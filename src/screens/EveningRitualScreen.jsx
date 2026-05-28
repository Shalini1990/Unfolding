import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import db from '../db/db'
import { getTodayDate, getDayNumber, getWeekStart } from '../utils/date'
import PrivacyNudge from '../components/PrivacyNudge'

const SUNDAY = 0

const HUMAN_LINES = {
  perfect: 'One of those weeks. Hold onto it.',
  strong:  'You really showed up this week.',
  decent:  'Solid week. More than you might think.',
  mixed:   'Not everything, but something. That counts.',
  light:   'Lighter week. Rest is part of it too.',
  first:   'Just getting started. That\'s enough.',
}

function Prompt({ label, value, onChange, placeholder, rows = 3, autoFocus = false }) {
  return (
    <div className="ev-prompt">
      <span className="ev-prompt__label">{label}</span>
      <textarea
        className="ev-prompt__input"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        autoFocus={autoFocus}
      />
    </div>
  )
}

export default function EveningRitualScreen() {
  const navigate = useNavigate()
  const today = getTodayDate()
  const isSunday = new Date().getDay() === SUNDAY

  const [learnt,      setLearnt]      = useState('')
  const [grateful,    setGrateful]    = useState('')
  const [smile,       setSmile]       = useState('')
  const [warmThought, setWarmThought] = useState('')
  const [tomorrow,    setTomorrow]    = useState('')
  const [saved,       setSaved]       = useState(false)
  const [loading,     setLoading]     = useState(true)
  const [isEditing,   setIsEditing]   = useState(false)
  const [phase,       setPhase]       = useState('idle')  // 'entering' | 'idle' | 'exiting'

  // Acknowledgement + spark check-in state
  const [tickCount,    setTickCount]    = useState(0)
  const [totalThings,  setTotalThings]  = useState(0)
  const [sparkRecord,  setSparkRecord]  = useState(null)  // full spark_log row

  // Sunday weekly summary
  const [weeklySummary, setWeeklySummary] = useState(null)

  useEffect(() => {
    async function load() {
      const [existing, tmr, intentions, spark] = await Promise.all([
        db.reflection_entries.where('date').equals(today).first(),
        db.tomorrow_intention.get(1),
        db.daily_intentions.where('date').equals(today).first(),
        db.spark_log.where('date').equals(today).first(),
      ])
      if (existing) {
        setLearnt(existing.learnt || '')
        setGrateful(existing.grateful || '')
        setSmile(existing.smile || '')
        setWarmThought(existing.warm_thought || '')
        setIsEditing(true)
      }
      if (tmr && tmr.date_set === today) {
        setTomorrow(tmr.text || '')
      }
      // Acknowledgements
      if (intentions?.intentions_set) {
        const total = [1, 2, 3].filter(n => intentions[`text_${n}`]).length
        const ticked = [1, 2, 3].filter(n => intentions[`ticked_${n}`]).length
        setTotalThings(total)
        setTickCount(ticked)
      }
      if (spark) setSparkRecord(spark)

      // Sunday weekly summary — gather Mon–Sat history + today's intentions
      if (new Date().getDay() === SUNDAY) {
        const monStr = getWeekStart()
        const [histRows, sparkWeek, reflWeek, installRec] = await Promise.all([
          db.intentions_history.where('date').aboveOrEqual(monStr).filter(r => r.date < today).toArray(),
          db.spark_log        .where('date').aboveOrEqual(monStr).toArray(),
          db.reflection_entries.where('date').aboveOrEqual(monStr).filter(r => r.date < today).toArray(),
          db.settings.where('key').equals('install_date').first(),
        ])

        // Intentions done + total set this week
        let intentionsDone = histRows.reduce((s, r) => s + (r.completion_count || 0), 0)
        let totalSet       = histRows.reduce((s, r) => s + [r.text_1, r.text_2, r.text_3].filter(Boolean).length, 0)
        if (intentions?.intentions_set) {
          intentionsDone += [1, 2, 3].filter(n => intentions[`ticked_${n}`]).length
          totalSet       += [1, 2, 3].filter(n => intentions[`text_${n}`]).length
        }

        const sparksDone      = sparkWeek.filter(r => r.completion_status === 'done').length
        const eveningsReflected = reflWeek.length   // Mon–Sat only; today not yet saved

        // Normalised 0–1 scores
        const sparkScore  = sparksDone / 7
        const reflScore   = eveningsReflected / 6
        const intentScore = totalSet > 0 ? intentionsDone / totalSet : null
        const scores      = [sparkScore, reflScore, ...(intentScore !== null ? [intentScore] : [])]
        const avg         = scores.reduce((a, b) => a + b, 0) / scores.length

        const dayNum         = getDayNumber(installRec?.value || null)
        const hasAnyActivity = sparksDone > 0 || intentionsDone > 0 || eveningsReflected > 0

        let signal
        if (dayNum <= 7)      signal = 'first'
        else if (avg >= 0.80) signal = 'perfect'
        else if (avg >= 0.60) signal = 'strong'
        else if (avg >= 0.35) signal = 'decent'
        else if (hasAnyActivity) signal = 'mixed'
        else                  signal = 'light'

        setWeeklySummary({ intentionsDone, sparksDone, eveningsReflected, signal })
      }

      setLoading(false)
    }
    load()
  }, [today])

  // Trigger open animation once data has loaded.
  // CSS keyframe animations start the moment the class hits the DOM — no
  // double-RAF needed (that trick was only for CSS transitions).
  useEffect(() => {
    if (loading) return
    setPhase('entering')
    const timer = setTimeout(() => setPhase('idle'), 380)
    return () => clearTimeout(timer)
  }, [loading])

  // Animate out then navigate
  async function dismissWithAnimation() {
    setPhase('exiting')
    await new Promise(r => setTimeout(r, 280))
    navigate('/home')
  }

  async function handleSparkCheckin(status) {
    if (!sparkRecord?.id) return
    await db.spark_log.update(sparkRecord.id, { completion_status: status })
    setSparkRecord(prev => ({ ...prev, completion_status: status }))
  }

  async function handleSave() {
    const entry = {
      date:        today,
      learnt:      learnt.trim(),
      grateful:    grateful.trim(),
      smile:       smile.trim(),
      warm_thought: isSunday ? warmThought.trim() : '',
      saved_at:    new Date().toISOString(),
    }

    const existing = await db.reflection_entries.where('date').equals(today).first()
    if (existing) {
      await db.reflection_entries.update(existing.id, entry)
    } else {
      await db.reflection_entries.add(entry)
    }

    const tomorrowText = tomorrow.trim()
    if (tomorrowText) {
      await db.tomorrow_intention.put({ id: 1, text: tomorrowText, date_set: today })
    } else {
      await db.tomorrow_intention.delete(1)
    }

    // Animate out, then show saved confirmation
    setPhase('exiting')
    await new Promise(r => setTimeout(r, 260))
    setSaved(true)
    setTimeout(() => navigate('/home'), 1600)
  }

  if (loading) return null

  if (saved) {
    return (
      <div className="ev-saved">
        <p className="ev-saved__text">Saved. Good evening.</p>
      </div>
    )
  }

  const hasAny = learnt.trim() || grateful.trim() || smile.trim() ||
    (isSunday && warmThought.trim()) || tomorrow.trim()

  return (
    <div className={`ev-screen${phase !== 'idle' ? ` ev-screen--${phase}` : ''}`}>
      {/* Header */}
      <div className="ev-header">
        <div>
          <p className="ev-header__eyebrow">Evening ritual</p>
          <h1 className="ev-header__title">Reflect on today.</h1>
        </div>
        <button
          className="ev-close"
          onClick={() => dismissWithAnimation()}
          type="button"
          aria-label="Close"
        >
          <X size={20} strokeWidth={1.8} />
        </button>
      </div>

      {/* Privacy nudge (F14) */}
      <PrivacyNudge featureKey="reflection" />

      {/* Acknowledgements */}
      {(tickCount > 0 || sparkRecord?.completion_status === 'done') && (
        <div className="ev-acks">
          {tickCount > 0 && (
            <span className="ev-ack">
              ✓ {tickCount === totalThings ? `All ${totalThings} intentions done` : `${tickCount} of ${totalThings} intentions done`}
            </span>
          )}
          {sparkRecord?.completion_status === 'done' && (
            <span className="ev-ack">✓ Spark done</span>
          )}
        </div>
      )}

      {/* Spark check-in — shown when spark is still pending in the evening */}
      {sparkRecord?.completion_status === 'pending' && (
        <div className="ev-spark-checkin">
          <p className="ev-spark-checkin__label">Did you get to your spark today?</p>
          <p className="ev-spark-checkin__task">{sparkRecord.task_text}</p>
          <div className="ev-spark-checkin__btns">
            <button
              className="ev-spark-checkin__done"
              onClick={() => handleSparkCheckin('done')}
              type="button"
            >
              Done ✓
            </button>
            <button
              className="ev-spark-checkin__skip"
              onClick={() => handleSparkCheckin('skipped')}
              type="button"
            >
              Not today
            </button>
          </div>
        </div>
      )}

      {/* F04 — Reflection prompts */}
      <div className="ev-section">
        <Prompt
          label="Something I learnt today…"
          value={learnt}
          onChange={setLearnt}
          placeholder="Even something small counts."
          autoFocus
        />
        <Prompt
          label="Something I'm grateful for…"
          value={grateful}
          onChange={setGrateful}
          placeholder="Big or small — both matter."
        />
        <Prompt
          label="Something that made me smile…"
          value={smile}
          onChange={setSmile}
          placeholder="It doesn't have to be significant."
        />
        {isSunday && (
          <Prompt
            label="Someone who came to mind this week and why…"
            value={warmThought}
            onChange={setWarmThought}
            placeholder="A face, a name, a feeling."
          />
        )}
      </div>

      {/* Divider */}
      <div className="ev-divider">
        <span className="ev-divider__label">Looking ahead</span>
      </div>

      {/* F05 — Tomorrow's One Thing */}
      <div className="ev-section">
        <Prompt
          label="Something I'm looking forward to tomorrow…"
          value={tomorrow}
          onChange={setTomorrow}
          placeholder="Optional — leaves something to wake up to."
          rows={2}
        />
      </div>

      {/* Sunday weekly summary */}
      {isSunday && weeklySummary && (
        <div className="ev-weekly-summary">
          <p className="ev-weekly-summary__facts">
            This week:{' '}
            {weeklySummary.intentionsDone} intention{weeklySummary.intentionsDone !== 1 ? 's' : ''} done
            {' · '}
            {weeklySummary.sparksDone} spark{weeklySummary.sparksDone !== 1 ? 's' : ''} lit
            {' · '}
            {weeklySummary.eveningsReflected} evening{weeklySummary.eveningsReflected !== 1 ? 's' : ''} reflected.
          </p>
          <p className="ev-weekly-summary__line">{HUMAN_LINES[weeklySummary.signal]}</p>
        </div>
      )}

      {/* Footer */}
      <div className="ev-footer">
        <button
          className="ev-save-btn"
          onClick={handleSave}
          disabled={!hasAny}
          type="button"
        >
          Save
        </button>
        {!isEditing && (
          <button
            className="ev-skip-btn"
            onClick={() => navigate('/home')}
            type="button"
          >
            Maybe later
          </button>
        )}
      </div>
    </div>
  )
}
