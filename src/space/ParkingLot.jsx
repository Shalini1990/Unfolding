import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Flame, ChevronLeft, ChevronRight } from 'lucide-react'
import db from '../db/db'
import { relativeDate } from '../utils/date'
import JarSVG from './JarSVG'
import PrivacyNudge from '../components/PrivacyNudge'

const TAGS = ['Low mood', 'Anger', 'Worry', 'Decision', 'Idea', 'Dream']

const SNOOZE_OPTIONS = [
  { label: 'Tomorrow',   days: 1 },
  { label: 'In 3 days',  days: 3 },
  { label: 'Next week',  days: 7 },
]

// ── Add mode ────────────────────────────────────────────────────
function AddMode({ thoughts, onRevisit, onPark }) {
  const [text, setText] = useState('')
  const [selectedTag, setSelectedTag] = useState(null)
  const [parkedMsg, setParkedMsg] = useState(false)

  const hasOld = thoughts.some(
    t => (Date.now() - new Date(t.date_parked).getTime()) / 864e5 > 14
  )

  async function handlePark() {
    const trimmed = text.trim()
    if (!trimmed) return
    await onPark(trimmed, selectedTag)   // parent updates thoughts state
    setText('')
    setSelectedTag(null)
    setParkedMsg(true)
    setTimeout(() => setParkedMsg(false), 1600)
  }

  return (
    <div className="parking-add">
      {/* Jar */}
      <div className="parking-jar">
        <JarSVG count={thoughts.length} />
        <div className="parking-jar__info">
          {thoughts.length === 0 ? (
            <p className="parking-jar__empty">Your jar is empty</p>
          ) : (
            <div className="parking-jar__meta">
              <p className="parking-jar__count">
                {thoughts.length} thought{thoughts.length !== 1 ? 's' : ''} parked
                {hasOld && (
                  <span className="parking-jar__old-dot" title="Some thoughts are over 2 weeks old" />
                )}
              </p>
              <button className="parking-jar__revisit" onClick={onRevisit} type="button">
                Revisit →
              </button>
            </div>
          )}
          {parkedMsg && <p className="parking-jar__ack">Parked ✓</p>}
        </div>
      </div>

      {/* Privacy nudge (F14) */}
      <PrivacyNudge featureKey="parking_lot" />

      {/* Input */}
      <textarea
        className="parking-input"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="What's on your mind? Park it here."
        rows={3}
      />

      {/* Tags */}
      <div className="parking-tags">
        {TAGS.map(t => (
          <button
            key={t}
            className={`parking-tag${selectedTag === t ? ' parking-tag--selected' : ''}`}
            onClick={() => setSelectedTag(prev => prev === t ? null : t)}
            type="button"
          >
            {t}
          </button>
        ))}
      </div>

      {/* Park button */}
      <button
        className="parking-btn"
        onClick={handlePark}
        disabled={!text.trim()}
        type="button"
      >
        Park it in the jar
      </button>
    </div>
  )
}

// ── Revisit mode ─────────────────────────────────────────────────
function RevisitMode({ thoughts, onExit }) {
  const navigate = useNavigate()
  const [settled, setSettled] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [tagFilter, setTagFilter] = useState(null)
  const [revIdx, setRevIdx] = useState(0)
  const [localThoughts, setLocalThoughts] = useState(thoughts)
  const [showSnooze, setShowSnooze] = useState(false)
  const [burning, setBurning] = useState(false)
  const [burnedMsg, setBurnedMsg] = useState(false)

  // Auto-advance after 10 seconds with a visual countdown
  useEffect(() => {
    const mainTimer = setTimeout(() => setSettled(true), 5000)
    const ticker = setInterval(() => setCountdown(n => Math.max(0, n - 1)), 1000)
    return () => { clearTimeout(mainTimer); clearInterval(ticker) }
  }, [])

  // Settling screen — auto-transitions, no tap required
  if (!settled) {
    return (
      <div className="parking-settling">
        <p className="parking-settling__text">You're brave for coming back to these.</p>
        <p className="parking-settling__sub">Take a deep breath before we begin.</p>
        <span className="parking-settling__countdown">{countdown}</span>
      </div>
    )
  }

  const visible = tagFilter
    ? localThoughts.filter(t => t.tag === tagFilter)
    : localThoughts

  const current = visible[revIdx]

  const tagCounts = TAGS
    .map(tag => ({ tag, count: localThoughts.filter(t => t.tag === tag).length }))
    .filter(({ count }) => count > 0)

  function handleNext() {
    if (revIdx < visible.length - 1) setRevIdx(n => n + 1)
  }

  function handlePrev() {
    if (revIdx > 0) setRevIdx(n => n - 1)
  }

  function advance() {
    // Called after an action removes current thought.
    // visible still reflects old list here (state update is async),
    // so length - 1 is the correct boundary check.
    if (revIdx >= visible.length - 1) {
      // Was the last thought — step back if possible, otherwise exit
      if (revIdx > 0) setRevIdx(n => n - 1)
      else onExit('done')
    }
    // Otherwise revIdx stays same; next item slides into its place
  }

  async function handleResolve() {
    if (!current) return
    await db.parking_lot.update(current.id, {
      status: 'resolved',
      resolved_at: new Date().toISOString(),
    })
    setLocalThoughts(prev => prev.filter(t => t.id !== current.id))
    advance()
  }

  async function handleSnooze(days) {
    if (!current) return
    const until = new Date()
    until.setDate(until.getDate() + days)
    await db.parking_lot.update(current.id, {
      status: 'snoozed',
      snooze_until: until.toISOString(),
    })
    setLocalThoughts(prev => prev.filter(t => t.id !== current.id))
    setShowSnooze(false)
    advance()
  }

  async function handleBurn() {
    if (!current || burning) return
    setBurning(true)
    // Card animation plays (1300ms), then delete + show confirmation
    setTimeout(async () => {
      await db.parking_lot.delete(current.id)
      setLocalThoughts(prev => prev.filter(t => t.id !== current.id))
      setBurning(false)
      setBurnedMsg(true)
      // Hold the message, then advance
      setTimeout(() => {
        setBurnedMsg(false)
        advance()
      }, 1800)
    }, 1300)
  }

  // All thoughts dealt with
  if (!current) {
    return (
      <div className="parking-alldone">
        <p className="parking-alldone__text">All caught up.</p>
        <button className="parking-alldone__back" onClick={() => onExit('add')} type="button">
          Back to jar
        </button>
      </div>
    )
  }

  return (
    <div className="parking-revisit">
      {/* Top bar */}
      <div className="parking-revisit__header">
        <button
          className="parking-revisit__back"
          onClick={() => onExit('add')}
          type="button"
          aria-label="Back"
        >
          <ChevronLeft size={18} strokeWidth={2} />
          Jar
        </button>

        <div className="parking-revisit__nav">
          <button
            className="parking-nav-arrow"
            onClick={handlePrev}
            disabled={revIdx === 0}
            type="button"
            aria-label="Previous thought"
          >
            <ChevronLeft size={18} strokeWidth={2.2} />
          </button>
          <span className="parking-revisit__progress">
            {revIdx + 1} / {visible.length}
          </span>
          <button
            className="parking-nav-arrow"
            onClick={handleNext}
            disabled={revIdx === visible.length - 1}
            type="button"
            aria-label="Next thought"
          >
            <ChevronRight size={18} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      {/* Tag filter (only if multiple tag types present) */}
      {tagCounts.length > 1 && (
        <div className="parking-tag-filter">
          <button
            className={`parking-filter-pill${tagFilter === null ? ' parking-filter-pill--active' : ''}`}
            onClick={() => { setTagFilter(null); setRevIdx(0) }}
            type="button"
          >
            All
          </button>
          {tagCounts.map(({ tag, count }) => (
            <button
              key={tag}
              className={`parking-filter-pill${tagFilter === tag ? ' parking-filter-pill--active' : ''}`}
              onClick={() => { setTagFilter(tag); setRevIdx(0) }}
              type="button"
            >
              {tag} · {count}
            </button>
          ))}
        </div>
      )}

      {burnedMsg ? (
        /* Confirmation — shown after the card burns away */
        <div className="parking-burned-msg">
          <p className="parking-burned-msg__text">Gone. You can let that go now.</p>
        </div>
      ) : (
        <>
          {/* Thought card */}
          <div className={`parking-thought-card${burning ? ' parking-thought-card--burning' : ''}`}>
            {burning && (
              <div className="burn-flames" aria-hidden="true">
                <Flame size={22} className="burn-flame burn-flame--0" />
                <Flame size={18} className="burn-flame burn-flame--1" />
                <Flame size={26} className="burn-flame burn-flame--2" />
                <Flame size={20} className="burn-flame burn-flame--3" />
                <Flame size={16} className="burn-flame burn-flame--4" />
                <Flame size={22} className="burn-flame burn-flame--5" />
              </div>
            )}
            <div className="parking-thought-card__meta">
              {current.tag && (
                <span className="parking-thought-card__tag">{current.tag}</span>
              )}
              <span className="parking-thought-card__date">{relativeDate(current.date_parked)}</span>
            </div>
            <p className="parking-thought-card__text">{current.text}</p>
          </div>

          {/* Actions / Snooze panel */}
          {!showSnooze ? (
            <>
              <div className="parking-actions">
                <button
                  className="parking-action-btn parking-action-btn--resolve"
                  onClick={handleResolve}
                  type="button"
                >
                  Resolve
                </button>
                <button
                  className="parking-action-btn parking-action-btn--snooze"
                  onClick={() => setShowSnooze(true)}
                  type="button"
                >
                  Snooze
                </button>
                <button
                  className="parking-action-btn parking-action-btn--burn"
                  onClick={handleBurn}
                  disabled={burning}
                  type="button"
                >
                  <Flame size={13} strokeWidth={2.2} aria-hidden="true" />
                  Burn
                </button>
              </div>
              <button
                className="parking-figureout-btn"
                onClick={() => navigate('/figure-it-out', {
                  state: { id: current.id, thought: current.text, tag: current.tag }
                })}
                type="button"
              >
                Need more help with this? Let's figure it out
              </button>
            </>
          ) : (
            <div className="parking-snooze-panel">
              <p className="parking-snooze-panel__label">Come back to this…</p>
              {SNOOZE_OPTIONS.map(({ label, days }) => (
                <button
                  key={label}
                  className="parking-snooze-option"
                  onClick={() => handleSnooze(days)}
                  type="button"
                >
                  {label}
                </button>
              ))}
              <button
                className="parking-snooze-cancel"
                onClick={() => setShowSnooze(false)}
                type="button"
              >
                Not yet
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ── Root component ───────────────────────────────────────────────
export default function ParkingLot({ onModeChange }) {
  const [thoughts, setThoughts] = useState([])
  const [mode, setMode] = useState('add') // 'add' | 'revisit'
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadThoughts() }, [mode]) // reload on return to add mode

  async function loadThoughts() {
    const all = await db.parking_lot.toArray()
    const now = new Date()

    // Unsnooze expired items
    const expired = all.filter(
      t => t.status === 'snoozed' && t.snooze_until && new Date(t.snooze_until) <= now
    )
    for (const t of expired) {
      await db.parking_lot.update(t.id, { status: 'active', snooze_until: null })
    }

    const active = all
      .map(t => expired.find(e => e.id === t.id)
        ? { ...t, status: 'active', snooze_until: null }
        : t
      )
      .filter(t => t.status === 'active')
      .sort((a, b) => new Date(a.date_parked) - new Date(b.date_parked))

    setThoughts(active)
    setLoading(false)
  }

  async function handlePark(text, tag) {
    const entry = {
      text,
      tag,
      date_parked: new Date().toISOString(),
      snooze_until: null,
      status: 'active',
    }
    const id = await db.parking_lot.add(entry)
    // Update local state immediately so the jar reflects the new count
    setThoughts(prev => [...prev, { id, ...entry }])
  }

  function handleExit() {
    setMode('add')
    onModeChange?.('add')
  }

  if (loading) return null

  if (mode === 'revisit') {
    return (
      <RevisitMode
        thoughts={thoughts}
        onExit={handleExit}
      />
    )
  }

  return (
    <AddMode
      thoughts={thoughts}
      onRevisit={() => { setMode('revisit'); onModeChange?.('revisit') }}
      onPark={handlePark}
    />
  )
}
