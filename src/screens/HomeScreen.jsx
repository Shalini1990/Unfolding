import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, X } from 'lucide-react'
import db from '../db/db'
import { getTodayDate, getDayNumber } from '../utils/date'
import { pickQuote } from '../data/quotes'
import { evaluateAlgorithm, pickSparkAdaptive } from '../utils/sparkAlgorithm'
import GreetingHeader from '../home/GreetingHeader'
import QuoteCard from '../home/QuoteCard'
import SparkCard from '../home/SparkCard'
import ThreeThingsCard from '../home/ThreeThingsCard'
import TomorrowCard from '../home/TomorrowCard'
import NorthStarLine from '../home/NorthStarLine'
import EveningPromptCard from '../home/EveningPromptCard'
import WeekCartoonCard from '../home/WeekCartoonCard'

// ── Day-3 notification nudge ──────────────────────────────────────
function NotifNudge({ onDismiss }) {
  const navigate = useNavigate()

  function handleSetUp() {
    localStorage.setItem('notif_day3_shown', '1')
    onDismiss()
    navigate('/me')
  }

  function handleDismiss() {
    localStorage.setItem('notif_day3_shown', '1')
    onDismiss()
  }

  return (
    <div className="home-notif-nudge">
      <Bell size={14} strokeWidth={2} className="home-notif-nudge__icon" aria-hidden="true" />
      <p className="home-notif-nudge__text">
        Set up reminders for your morning and evening rituals?
      </p>
      <button className="home-notif-nudge__cta" onClick={handleSetUp} type="button">
        Set up
      </button>
      <button className="home-notif-nudge__close" onClick={handleDismiss} type="button" aria-label="Dismiss">
        <X size={12} strokeWidth={2.5} />
      </button>
    </div>
  )
}

// ── Day-change archival ─────────────────────────────────────────
// Runs on every app open. When the date has rolled over it:
//   1. Copies previous-day daily_intentions → intentions_history
//   2. Marks any previous-day pending spark entries as 'skipped'
//      so the spark log and Me screen are fully consistent
// (reflection_entries are written directly, no archival needed)
async function archiveOldIntentions(today) {
  try {
    // ── 1. Intentions ──────────────────────────────────────────
    const old = await db.daily_intentions
      .filter(r => r.date < today)
      .toArray()

    if (old.length > 0) {
      const toArchive = old.filter(r => r.intentions_set)

      if (toArchive.length > 0) {
        // Skip dates already in intentions_history (dedup guard)
        const alreadyDone = await db.intentions_history
          .where('date').anyOf(toArchive.map(r => r.date)).toArray()
        const archivedDates = new Set(alreadyDone.map(r => r.date))
        const newEntries = toArchive.filter(r => !archivedDates.has(r.date))

        if (newEntries.length > 0) {
          await db.intentions_history.bulkAdd(
            newEntries.map(r => ({
              date:             r.date,
              text_1:           r.text_1  || '',
              text_2:           r.text_2  || '',
              text_3:           r.text_3  || '',
              ticked_1:         r.ticked_1  ?? false,
              ticked_2:         r.ticked_2  ?? false,
              ticked_3:         r.ticked_3  ?? false,
              completion_count: [r.ticked_1, r.ticked_2, r.ticked_3].filter(Boolean).length,
            }))
          )
        }
      }

      await db.daily_intentions.bulkDelete(old.map(r => r.id))
    }

    // ── 2. Spark log ───────────────────────────────────────────
    // Any spark that's still 'pending' from a previous day never
    // got a decision — close it out as 'skipped' so the records
    // are clean and the Me screen count is accurate.
    const pendingSparks = await db.spark_log
      .filter(r => r.date < today && r.completion_status === 'pending')
      .toArray()

    if (pendingSparks.length > 0) {
      await Promise.all(
        pendingSparks.map(s => db.spark_log.update(s.id, { completion_status: 'skipped' }))
      )
    }
  } catch {
    // Non-critical — silently ignore
  }
}

export default function HomeScreen() {
  const [loading, setLoading] = useState(true)
  const [todayRecord, setTodayRecord] = useState(null)
  const [northStar, setNorthStar] = useState(null)
  const [tomorrowText, setTomorrowText] = useState(null)
  const [tomorrowDateSet, setTomorrowDateSet] = useState(null)
  const [quoteState, setQuoteState] = useState(null)
  const [todaysSpark, setTodaysSpark] = useState(null)
  const [dayNumber, setDayNumber] = useState(1)
  const [eveningDone, setEveningDone] = useState(false)
  const [sparkAnimKey, setSparkAnimKey] = useState(0)
  const [showCartoon, setShowCartoon] = useState(false)
  const [showNotifNudge, setShowNotifNudge] = useState(false)
  const [algoState, setAlgoState] = useState(null)

  const isEvening = new Date().getHours() >= 17

  const today = getTodayDate()

  useEffect(() => {
    async function loadData() {
      // Archive any daily_intentions from previous days before loading today
      await archiveOldIntentions(today)

      // Core data
      const [daily, ns, tmr, eveningEntry] = await Promise.all([
        db.daily_intentions.where('date').equals(today).first(),
        db.north_star.get(1),
        db.tomorrow_intention.get(1),
        db.reflection_entries.where('date').equals(today).first(),
      ])
      setTodayRecord(daily || null)
      setNorthStar(ns?.text || null)
      setTomorrowText(tmr?.text || null)
      setTomorrowDateSet(tmr?.date_set || null)
      setEveningDone(!!eveningEntry)

      // Install date → day number for quote thumbs visibility
      const installRec = await db.settings.where('key').equals('install_date').first()
      const dn = getDayNumber(installRec?.value || null)
      setDayNumber(dn)

      // Day-3 notification nudge: show once if notifications were skipped
      if (dn >= 3 && !localStorage.getItem('notif_day3_shown')) {
        const notifRec = await db.settings.where('key').equals('notifications_enabled').first()
        if (!notifRec?.value) setShowNotifNudge(true)
      }

      // Quote: pick a fresh one if we don't have today's yet
      let qd = await db.quote_data.get(1)
      if (!qd || qd.today_date !== today) {
        const shownQuotes = qd?.shown_quotes || []
        const newQuote = pickQuote(shownQuotes, qd?.blocked_themes || [])
        qd = {
          id: 1,
          today_quote: newQuote,
          today_date: today,
          today_thumb: null,
          shown_quotes: [...shownQuotes, newQuote],
          favourites: qd?.favourites || [],
          blocked_themes: qd?.blocked_themes || [],
        }
        await db.quote_data.put(qd)
      }
      setQuoteState(qd)

      // Evaluate adaptive algorithm (runs every load, updates ceiling + type weights)
      const algo = await evaluateAlgorithm()
      setAlgoState(algo)

      // Spark: pick a fresh one if we don't have today's yet
      let spark = await db.spark_log.where('date').equals(today).first()
      if (!spark) {
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        const cutoffStr = thirtyDaysAgo.toISOString().split('T')[0]
        const recentLog = await db.spark_log.where('date').aboveOrEqual(cutoffStr).toArray()
        const recentIds = recentLog.map(e => e.task_id)

        const task = pickSparkAdaptive(recentIds, algo, new Date().getDay())
        const newEntry = {
          date: today,
          task_id: task.id,
          task_text: task.text,
          type: task.type,
          difficulty: task.difficulty,
          completion_status: 'pending',
        }
        const id = await db.spark_log.add(newEntry)
        spark = { id, ...newEntry }
      }
      setTodaysSpark(spark)

      setLoading(false)
    }

    loadData()
  }, [today])

  async function handleSaveIntentions(texts) {
    const record = {
      date: today,
      text_1: texts[0] || '',
      text_2: texts[1] || '',
      text_3: texts[2] || '',
      ticked_1: false,
      ticked_2: false,
      ticked_3: false,
      time_ticked_1: null,
      time_ticked_2: null,
      time_ticked_3: null,
      intentions_set: true,
      set_at: new Date().toISOString(),
    }

    const existing = await db.daily_intentions.where('date').equals(today).first()
    if (existing) {
      await db.daily_intentions.update(existing.id, record)
      setTodayRecord({ ...existing, ...record })
    } else {
      const id = await db.daily_intentions.add(record)
      setTodayRecord({ id, ...record })
    }

    // Clear tomorrow's intention on ritual completion
    await db.tomorrow_intention.delete(1)
    setTomorrowText(null)
    setTomorrowDateSet(null)
  }

  async function handleTick(n, ticked) {
    if (!todayRecord?.id) return
    const updates = {
      [`ticked_${n}`]: ticked,
      [`time_ticked_${n}`]: ticked ? new Date().toISOString() : null,
    }
    await db.daily_intentions.update(todayRecord.id, updates)
    setTodayRecord(prev => ({ ...prev, ...updates }))
  }

  async function handleQuoteThumb(dir) {
    // dir: 'up' | 'down' | null (null = unthumbing)
    const prev = quoteState
    const updated = { ...prev, today_thumb: dir }

    if (dir === 'up' && prev.today_thumb !== 'up') {
      updated.favourites = [...(prev.favourites || []), { text: prev.today_quote, date: today }]
    }
    if (dir === null && prev.today_thumb === 'up') {
      updated.favourites = (prev.favourites || []).filter(f => f.text !== prev.today_quote)
    }
    if (dir === 'down') {
      // Block this quote permanently — it will never appear again
      const already = (prev.blocked_themes || []).includes(prev.today_quote)
      if (!already) {
        updated.blocked_themes = [...(prev.blocked_themes || []), prev.today_quote]
      }
    }

    await db.quote_data.put({ id: 1, ...updated })
    setQuoteState(updated)
  }

  async function handleSparkDone() {
    if (!todaysSpark?.id) return
    await db.spark_log.update(todaysSpark.id, { completion_status: 'done' })
    setTodaysSpark(prev => ({ ...prev, completion_status: 'done' }))
  }

  async function handleSparkSkip() {
    if (!todaysSpark?.id) return
    await db.spark_log.update(todaysSpark.id, { completion_status: 'skipped' })
    setTodaysSpark(prev => ({ ...prev, completion_status: 'skipped' }))
  }

  async function handleSparkShuffle() {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const cutoffStr = thirtyDaysAgo.toISOString().split('T')[0]
    const recentLog = await db.spark_log.where('date').aboveOrEqual(cutoffStr).toArray()
    const recentIds = recentLog.map(e => e.task_id)

    // Exclude current task so we always get something different
    const excludeIds = [...new Set([...recentIds, todaysSpark?.task_id].filter(Boolean))]
    const task = pickSparkAdaptive(excludeIds, algoState, new Date().getDay())

    const updated = {
      date: today,
      task_id: task.id,
      task_text: task.text,
      type: task.type,
      difficulty: task.difficulty,
      completion_status: 'pending',
    }
    await db.spark_log.update(todaysSpark.id, updated)
    setTodaysSpark(prev => ({ ...prev, ...updated }))
    setSparkAnimKey(k => k + 1)
  }

  if (loading) return null

  return (
    <div className="home-screen screen">
      <WeekCartoonCard
        show={showCartoon}
        onClose={() => setShowCartoon(false)}
        onAutoShow={() => setShowCartoon(true)}
      />
      <GreetingHeader date={today} onEaselClick={() => setShowCartoon(true)} />

      {showNotifNudge && (
        <NotifNudge onDismiss={() => setShowNotifNudge(false)} />
      )}

      <QuoteCard
        quoteState={quoteState}
        dayNumber={dayNumber}
        onThumb={handleQuoteThumb}
      />

      {isEvening && <EveningPromptCard done={eveningDone} />}
      <NorthStarLine text={northStar} />

      {tomorrowText && <TomorrowCard text={tomorrowText} dateSet={tomorrowDateSet} />}

      <ThreeThingsCard
        record={todayRecord}
        onSave={handleSaveIntentions}
        onTick={handleTick}
      />

      <SparkCard
        spark={todaysSpark}
        animationKey={sparkAnimKey}
        onDone={handleSparkDone}
        onSkip={handleSparkSkip}
        onShuffle={handleSparkShuffle}
      />
    </div>
  )
}
