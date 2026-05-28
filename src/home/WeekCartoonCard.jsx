import { useState, useEffect, useRef } from 'react'
import db from '../db/db'
import { getWeekStart, getDayOfWeek, getTodayDate } from '../utils/date'
import { useTheme } from '../hooks/useTheme'
import { CARTOONS, pickWeekColors, pickCartoon } from '../data/cartoons'

const FILL_DURATION  = 5      // seconds — how long today's colour seeps in
const FILL_START     = 200    // ms — delay before fill begins
const DISMISS_ANIM   = FILL_START + FILL_DURATION * 1000  // 5200ms
const DISMISS_STATIC = 5000   // ms — manual open (unchanged)

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

// ── Day indicator strip ───────────────────────────────────────────
function DayDots({ partitions, colors, todayIdx, animateIdx, animateDuration }) {
  return (
    <div className="wc-days">
      {DAY_LABELS.map((label, i) => {
        const isAnimating = i === animateIdx && animateDuration != null
        return (
          <div
            key={i}
            className={[
              'wc-day',
              partitions[i] ? 'wc-day--filled' : '',
              i === todayIdx  ? 'wc-day--today'  : '',
            ].join(' ')}
            style={{
              ...(partitions[i] ? { '--wc-day-color': colors[i] } : {}),
              ...(isAnimating ? {
                transition: `background ${animateDuration}s cubic-bezier(0.4,0,0.2,1), border-color 0.4s ease`,
              } : {}),
            }}
          >
            <span className="wc-day__label">{label}</span>
          </div>
        )
      })}
    </div>
  )
}

// ── Single SVG element (partition or base layer) ─────────────────
// fillDuration: CSS transition duration in seconds for the fill property
function SvgEl({ def, filled, color, isBase, fillDuration = 0.7 }) {
  const { type, ...attrs } = def
  const El = type

  let fill, stroke, strokeWidth
  const strokeLinecap = 'round'

  if (isBase) {
    fill        = 'none'
    stroke      = 'var(--color-border)'
    strokeWidth = type === 'line' ? 3.5 : 1.5
  } else if (filled) {
    fill        = color
    stroke      = 'none'
    strokeWidth = 0
  } else {
    fill        = 'transparent'   // 'none' can't be interpolated; transparent → colour transitions smoothly
    stroke      = 'var(--color-border)'
    strokeWidth = 1.5
  }

  return (
    <El
      {...attrs}
      style={{
        fill,
        stroke,
        strokeWidth,
        strokeLinecap,
        strokeLinejoin: 'round',
        transition: `fill ${fillDuration}s cubic-bezier(0.4,0,0.2,1), stroke 0.4s ease`,
      }}
    />
  )
}

// ── SVG cartoon with 7 colourable partitions ─────────────────────
// animateIdx: partition index that uses the slow fill (today's day), or null
function SVGCartoon({ cartoonId, partitions, colors, isMinimal, animateIdx }) {
  const design = CARTOONS[cartoonId] ?? CARTOONS[0]

  return (
    <svg
      viewBox={design.viewBox}
      className="wc-svg"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {design.base.map((def, i) => (
        <SvgEl key={`b${i}`} def={def} isBase filled={false} color={null} />
      ))}
      {design.parts.map((def, i) => (
        <SvgEl
          key={`p${i}`}
          def={def}
          filled={partitions[i]}
          color={colors[i]}
          fillDuration={i === animateIdx ? FILL_DURATION : 0.7}
        />
      ))}
    </svg>
  )
}

// ── Overlay (controlled by parent) ───────────────────────────────
function WeekCartoonOverlay({ cartoonId, partitions, colors, todayIdx, isMinimal, onClose, animate }) {
  const dismissDelay = animate ? DISMISS_ANIM : DISMISS_STATIC

  const [exiting,      setExiting]      = useState(false)
  const [visibleParts, setVisibleParts] = useState(() => {
    if (!animate) return partitions
    // All previous days pre-filled — only today starts empty and animates in
    const initial = [...partitions]
    initial[todayIdx] = false
    return initial
  })
  const timerRef = useRef(null)

  function dismiss() {
    if (exiting) return
    clearTimeout(timerRef.current)
    setExiting(true)
    setTimeout(onClose, 350)
  }

  // Auto-dismiss after dismissDelay
  useEffect(() => {
    timerRef.current = setTimeout(dismiss, dismissDelay)
    return () => clearTimeout(timerRef.current)
  }, [])  // eslint-disable-line react-hooks/exhaustive-deps

  // Trigger today's fill after FILL_START ms — transition carries it to completion
  // exactly when the progress bar drains to zero
  useEffect(() => {
    if (!animate || !partitions[todayIdx]) return
    const t = setTimeout(() => {
      setVisibleParts(prev => {
        const next = [...prev]
        next[todayIdx] = true
        return next
      })
    }, FILL_START)
    return () => clearTimeout(t)
  }, [])  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className={`wc-overlay ${exiting ? 'wc-overlay--exit' : ''}`}
      onClick={dismiss}
    >
      <div className="wc-overlay__card" onClick={e => e.stopPropagation()}>
        <p className="wc-overlay__label">This week</p>

        <SVGCartoon
          cartoonId={cartoonId}
          partitions={visibleParts}
          colors={colors}
          isMinimal={isMinimal}
          animateIdx={animate ? todayIdx : null}
        />

        <DayDots
          partitions={visibleParts}
          colors={colors}
          todayIdx={todayIdx}
          animateIdx={animate ? todayIdx : null}
          animateDuration={animate ? FILL_DURATION : null}
        />

        <div className="wc-progress">
          {!exiting && (
            <div
              className="wc-progress__bar"
              style={{ animationDuration: `${dismissDelay}ms` }}
            />
          )}
        </div>
        <p className="wc-overlay__hint">Tap anywhere to continue</p>
      </div>
    </div>
  )
}

// ── Root — data loader + overlay renderer ─────────────────────────
// Props:
//   show       — whether to show the overlay (controlled by parent)
//   onClose    — called when overlay is dismissed
//   onAutoShow — called once per day when the overlay should auto-appear
export default function WeekCartoonCard({ show, onClose, onAutoShow }) {
  const [partitions,  setPartitions]  = useState(null)
  const [colors,      setColors]      = useState(null)
  const [cartoonId,   setCartoonId]   = useState(0)
  const [isAutoShow,  setIsAutoShow]  = useState(false)
  const { theme } = useTheme()
  const isMinimal = theme !== 'playful'

  const weekStart = getWeekStart()
  const todayIdx  = getDayOfWeek()
  const today     = getTodayDate()

  useEffect(() => {
    async function load() {
      let rec = await db.week_cartoons.where('weekStart').equals(weekStart).first()

      if (!rec) {
        const lastRec    = await db.week_cartoons.orderBy('weekStart').last()
        const lastCid    = lastRec?.cartoon_id ?? -1
        const cid        = pickCartoon(lastCid)
        const weekColors = pickWeekColors()
        const states     = Array(7).fill(false)
        for (let i = 0; i <= todayIdx; i++) states[i] = true

        const id = await db.week_cartoons.add({
          weekStart,
          cartoon_id:       cid,
          partition_states: states,
          colors:           weekColors,
        })
        rec = { id, weekStart, cartoon_id: cid, partition_states: states, colors: weekColors }

      } else if (!rec.partition_states[todayIdx]) {
        const states = [...rec.partition_states]
        states[todayIdx] = true
        await db.week_cartoons.update(rec.id, { partition_states: states })
        rec = { ...rec, partition_states: states }
      }

      // Backwards-compat: old records without colours or cartoon_id
      const needsPatch = !rec.colors || rec.cartoon_id == null
      if (needsPatch) {
        const patch = {}
        if (!rec.colors)            patch.colors      = pickWeekColors()
        if (rec.cartoon_id == null) patch.cartoon_id  = pickCartoon(-1)
        await db.week_cartoons.update(rec.id, patch)
        rec = { ...rec, ...patch }
      }

      setPartitions(rec.partition_states)
      setColors(rec.colors)
      setCartoonId(rec.cartoon_id)

      // Trigger auto-show once per day — mark as animate-worthy
      const lastSeen = localStorage.getItem('wc_last_shown')
      if (lastSeen !== today) {
        localStorage.setItem('wc_last_shown', today)
        setIsAutoShow(true)
        setTimeout(() => onAutoShow?.(), 500)
      }
    }
    load()
  }, [weekStart, todayIdx, today])  // eslint-disable-line react-hooks/exhaustive-deps

  if (!partitions || !colors) return null
  if (!show) return null

  return (
    <WeekCartoonOverlay
      cartoonId={cartoonId}
      partitions={partitions}
      colors={colors}
      todayIdx={todayIdx}
      isMinimal={isMinimal}
      onClose={onClose}
      animate={isAutoShow}
    />
  )
}
