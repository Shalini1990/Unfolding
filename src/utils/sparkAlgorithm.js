// ── Adaptive spark algorithm ───────────────────────────────────
// Implements F03 difficulty progression and type affinity weighting.
// All data stored locally in spark_algorithm (id=1) and spark_log.

import db from '../db/db'
import { getDayNumber } from './date'
import { SPARK_LIBRARY } from '../data/sparks'

const TYPES = ['novelty', 'creative', 'mastery', 'social', 'sensory']

// Day-of-week type preference (JS convention: 0=Sun … 6=Sat)
const TYPE_ORDER_BY_DAY = {
  0: ['creative', 'sensory', 'novelty', 'social', 'mastery'],   // Sunday  — easy + creative/sensory
  1: ['novelty',  'creative', 'mastery', 'social', 'sensory'],  // Monday  — novelty bias
  2: ['mastery',  'novelty', 'creative', 'sensory', 'social'],  // Tuesday
  3: ['creative', 'mastery', 'novelty',  'social', 'sensory'],  // Wednesday
  4: ['sensory',  'novelty', 'creative', 'mastery', 'social'],  // Thursday
  5: ['social',   'novelty', 'creative', 'mastery', 'sensory'], // Friday  — social bias
  6: ['creative', 'sensory', 'novelty',  'social', 'mastery'],  // Saturday — creative/sensory
}

// ── Load or initialise algorithm state ───────────────────────
async function getState() {
  let s = await db.spark_algorithm.get(1)
  if (!s) {
    s = {
      id:                 1,
      difficulty_ceiling: 'easy',
      ceiling_since:      new Date().toISOString().split('T')[0],
      type_weights:       { novelty: 1.0, creative: 1.0, mastery: 1.0, social: 1.0, sensory: 1.0 },
    }
    await db.spark_algorithm.put(s)
  }
  // Back-fill missing fields on old records
  if (!s.ceiling_since) {
    s.ceiling_since = new Date().toISOString().split('T')[0]
    await db.spark_algorithm.put(s)
  }
  return s
}

// null if fewer than 3 decided entries (not enough signal)
function completionRate(entries) {
  const decided = entries.filter(e => e.completion_status === 'done' || e.completion_status === 'skipped')
  if (decided.length < 3) return null
  return decided.filter(e => e.completion_status === 'done').length / decided.length
}

// ── Evaluate and update algorithm from recent spark_log ───────
// Call once per app open (HomeScreen). Safe to call repeatedly —
// reads from DB, updates state, returns the new state.
export async function evaluateAlgorithm() {
  const state = await getState()

  // Onboarding week: stay easy, equal weights
  const installRec = await db.settings.where('key').equals('install_date').first()
  const dayNum     = getDayNumber(installRec?.value ?? null)
  if (dayNum <= 7) return { ...state, onboardingWeek: true }

  const today     = new Date().toISOString().split('T')[0]
  const cutoff14  = new Date(); cutoff14.setDate(cutoff14.getDate() - 14)
  const cutoff7   = new Date(); cutoff7 .setDate(cutoff7 .getDate() - 7)
  const cut14str  = cutoff14.toISOString().split('T')[0]
  const cut7str   = cutoff7 .toISOString().split('T')[0]

  const log14 = await db.spark_log.where('date').aboveOrEqual(cut14str).toArray()
  const log7  = log14.filter(e => e.date >= cut7str)

  // ── Type weights (14-day rolling window) ──────────────────
  const newWeights = { ...state.type_weights }
  const unseenTypes = []

  for (const type of TYPES) {
    const entries = log14.filter(e => e.type === type)
    if (entries.length === 0) {
      unseenTypes.push(type)   // hasn't appeared — ensure it shows up soon
      continue
    }
    const rate = completionRate(entries)
    if (rate === null) continue
    if (rate > 0.70) newWeights[type] = Math.min(2.0, +(newWeights[type] + 0.1).toFixed(2))
    if (rate < 0.30) newWeights[type] = Math.max(0.3, +(newWeights[type] - 0.1).toFixed(2))
  }

  // ── Difficulty ceiling (7-day window) ─────────────────────
  let ceiling      = state.difficulty_ceiling
  let ceilingSince = state.ceiling_since

  const daysAtCeiling = Math.floor(
    (new Date(today) - new Date(ceilingSince)) / (1000 * 60 * 60 * 24)
  )

  const easyRate = completionRate(log7.filter(e => e.difficulty === 'easy'))
  const medRate  = completionRate(log7.filter(e => e.difficulty === 'medium'))
  const hardRate = completionRate(log7.filter(e => e.difficulty === 'hard'))

  if (ceiling === 'easy') {
    // Above 60% after onboarding week → introduce medium
    if (easyRate !== null && easyRate > 0.60 && daysAtCeiling >= 7) {
      ceiling = 'medium'
      ceilingSince = today
    }
  } else if (ceiling === 'medium') {
    // Above 60% for 2+ weeks → introduce hard
    if (medRate !== null && medRate > 0.60 && daysAtCeiling >= 14) {
      ceiling = 'hard'
      ceilingSince = today
    }
    // Below 40% → step back to easy
    else if (medRate !== null && medRate < 0.40) {
      ceiling = 'easy'
      ceilingSince = today
    }
  } else if (ceiling === 'hard') {
    // Below 40% → step back to medium
    if (hardRate !== null && hardRate < 0.40) {
      ceiling = 'medium'
      ceilingSince = today
    }
  }

  const updated = {
    id:                 1,
    difficulty_ceiling: ceiling,
    ceiling_since:      ceilingSince,
    type_weights:       newWeights,
  }
  await db.spark_algorithm.put(updated)

  // Return with transient hint for this session only
  return { ...updated, _unseen_types: unseenTypes }
}

// ── Pick a spark using algorithm state ────────────────────────
// recentlyShownIds: spark ids shown in last 30 days
// algoState: result of evaluateAlgorithm()
// dayOfWeek: JS convention (0=Sun … 6=Sat)
export function pickSparkAdaptive(recentlyShownIds = [], algoState, dayOfWeek) {
  const ceiling      = algoState?.difficulty_ceiling ?? 'easy'
  const typeWeights  = algoState?.type_weights ?? { novelty: 1, creative: 1, mastery: 1, social: 1, sensory: 1 }
  const unseenTypes  = algoState?._unseen_types ?? []

  // Sunday → easy only (spec)
  const forceEasy    = dayOfWeek === 0

  // Wednesday → medium appropriate if ceiling allows (spec)
  const wednesdayBias = dayOfWeek === 3 && ceiling !== 'easy'

  // Difficulty distribution
  let diffDist
  if (forceEasy || ceiling === 'easy') {
    diffDist = { easy: 1.0, medium: 0.0, hard: 0.0 }
  } else if (ceiling === 'medium') {
    diffDist = wednesdayBias
      ? { easy: 0.6, medium: 0.4, hard: 0.0 }
      : { easy: 0.8, medium: 0.2, hard: 0.0 }
  } else { // hard
    diffDist = { easy: 0.7, medium: 0.2, hard: 0.1 }
  }

  // Pool: avoid recent 30-day repeats, fall back to full library if exhausted
  const available = SPARK_LIBRARY.filter(s => !recentlyShownIds.includes(s.id))
  const pool      = available.length > 0 ? available : SPARK_LIBRARY

  // Type priority: unseen types (min-frequency guarantee) come first,
  // then day-of-week preference order
  const dayOrder     = TYPE_ORDER_BY_DAY[dayOfWeek] ?? TYPE_ORDER_BY_DAY[1]
  const priorityOrder = unseenTypes.length > 0
    ? [...new Set([...unseenTypes, ...dayOrder])]
    : dayOrder

  // Pick difficulty
  const r = Math.random()
  let targetDiff
  if      (r < diffDist.easy)                        targetDiff = 'easy'
  else if (r < diffDist.easy + diffDist.medium)       targetDiff = 'medium'
  else                                                 targetDiff = 'hard'

  // Try preferred type + target difficulty
  for (const type of priorityOrder) {
    const candidates = pool.filter(s => s.difficulty === targetDiff && s.type === type)
    if (candidates.length > 0) return candidates[Math.floor(Math.random() * candidates.length)]
  }

  // Fallback: any task at target difficulty
  const diffPool = pool.filter(s => s.difficulty === targetDiff)
  if (diffPool.length > 0) return diffPool[Math.floor(Math.random() * diffPool.length)]

  // Final fallback: any available task
  return pool[Math.floor(Math.random() * pool.length)]
}
