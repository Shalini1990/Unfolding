import { useState, useEffect } from 'react'
import {
  Star, Edit2, Check, X,
  Zap, BookOpen, Lightbulb, ListChecks,
  ChevronDown, ChevronUp,
  Palette, Shield, Download, User, AlertTriangle, HardDrive, Trash2,
  Bell, BellOff,
} from 'lucide-react'
import db from '../db/db'
import { useTheme } from '../hooks/useTheme'
import {
  getPermission,
  requestPermission,
  loadNotifSettings,
  saveNotifSettings,
} from '../utils/notifications'

// ── Accent presets (matches CSS vars in index.css) ─────────────
export const ACCENTS = [
  { name: 'Slate', value: '#64748B', soft: '#F1F5F9' },
  { name: 'Sage',  value: '#6B8F71', soft: '#F0F7F1' },
  { name: 'Dusk',  value: '#4F46E5', soft: '#EEF2FF' },
  { name: 'Clay',  value: '#C2714F', soft: '#FDF0EB' },
  { name: 'Stone', value: '#78716C', soft: '#F5F4F3' },
  { name: 'Rose',  value: '#BE8A9D', soft: '#FDF2F5' },
]

export function applyAccent(value) {
  const preset = ACCENTS.find(a => a.value === value)
  if (!preset) return
  document.documentElement.style.setProperty('--color-accent',      preset.value)
  document.documentElement.style.setProperty('--color-accent-soft', preset.soft)
}

// ── Helpers ────────────────────────────────────────────────────
function fmtDate(str) {
  if (!str) return ''
  const d = new Date(str)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ── Generic expandable section card ───────────────────────────
function Section({ icon: Icon, title, count, emptyMsg, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="me-card">
      <button
        className="me-section-hd"
        onClick={() => setOpen(v => !v)}
        type="button"
      >
        <div className="me-card__label">
          <Icon size={14} strokeWidth={2.2} className="me-icon" />
          {title}
          {count > 0 && <span className="me-count">{count}</span>}
        </div>
        {open
          ? <ChevronUp  size={15} strokeWidth={2.2} className="me-chevron" />
          : <ChevronDown size={15} strokeWidth={2.2} className="me-chevron" />
        }
      </button>
      {open && (
        <div className="me-section-body">
          {count === 0
            ? <p className="me-empty">{emptyMsg}</p>
            : children
          }
        </div>
      )}
    </div>
  )
}

// ── North Star card ────────────────────────────────────────────
function NorthStarCard() {
  const [text,    setText]    = useState(null)   // null = loading
  const [editing, setEditing] = useState(false)
  const [draft,   setDraft]   = useState('')

  useEffect(() => {
    db.north_star.get(1)
      .then(r => setText(r?.text || ''))
      .catch(() => setText(''))
  }, [])

  async function save() {
    const trimmed = draft.trim()
    try {
      await db.north_star.put({ id: 1, text: trimmed })
      setText(trimmed)
    } catch {}
    setEditing(false)
  }

  function startEdit() {
    setDraft(text || '')
    setEditing(true)
  }

  if (text === null) return null

  return (
    <div className="me-card">
      <div className="me-card__hd">
        <div className="me-card__label">
          <Star size={14} strokeWidth={2.2} className="me-icon me-icon--star" />
          North Star
        </div>
        {!editing && (
          <button
            className="me-edit-btn"
            onClick={startEdit}
            type="button"
            aria-label="Edit North Star"
          >
            <Edit2 size={13} strokeWidth={2} />
          </button>
        )}
      </div>

      {editing ? (
        <>
          <textarea
            className="me-ns-input"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder="What matters most to you right now?"
            rows={3}
            autoFocus
          />
          <div className="me-ns-actions">
            <button
              className="me-btn-primary"
              onClick={save}
              disabled={!draft.trim()}
              type="button"
            >
              <Check size={13} strokeWidth={2.5} />
              Save
            </button>
            <button
              className="me-btn-ghost"
              onClick={() => setEditing(false)}
              type="button"
            >
              Cancel
            </button>
          </div>
        </>
      ) : text ? (
        <p className="me-ns-text">"{text}"</p>
      ) : (
        <button className="me-ns-empty" onClick={startEdit} type="button">
          Add your north star — what matters most to you right now?
        </button>
      )}
    </div>
  )
}

// ── Spark log ──────────────────────────────────────────────────
function SparkLog({ entries }) {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? entries : entries.slice(0, 5)

  return (
    <>
      {visible.map((entry, i) => {
        const done = entry.completion_status === 'done'
        return (
          <div key={i} className="me-spark-item">
            <span className={`me-spark-dot${done ? ' me-spark-dot--done' : ' me-spark-dot--skip'}`}>
              {done
                ? <Check size={10} strokeWidth={3} />
                : <X     size={10} strokeWidth={3} />
              }
            </span>
            <div className="me-spark-content">
              <p className="me-item-text">{entry.task_text}</p>
              <p className="me-item-meta">
                {fmtDate(entry.date)}
                {entry.type ? ` · ${entry.type}` : ''}
              </p>
            </div>
          </div>
        )
      })}
      {!showAll && entries.length > 5 && (
        <button className="me-see-all" onClick={() => setShowAll(true)} type="button">
          See {entries.length - 5} more
        </button>
      )}
    </>
  )
}

// ── Reflection history ─────────────────────────────────────────
const REFLECTION_PROMPTS = [
  { key: 'learnt',      label: 'Learnt' },
  { key: 'grateful',    label: 'Grateful for' },
  { key: 'smile',       label: 'Made me smile' },
  { key: 'warm_thought', label: 'Warm thought' },
]

function ReflectionItem({ entry }) {
  const [open, setOpen] = useState(false)
  const filled = REFLECTION_PROMPTS.filter(p => entry[p.key])

  return (
    <div className="me-ref">
      <button className="me-ref__hd" onClick={() => setOpen(v => !v)} type="button">
        <div>
          <p className="me-item-date">{fmtDate(entry.date)}</p>
          <p className="me-item-meta">
            {filled.length} prompt{filled.length !== 1 ? 's' : ''}
          </p>
        </div>
        {open
          ? <ChevronUp  size={13} strokeWidth={2.2} className="me-chevron" />
          : <ChevronDown size={13} strokeWidth={2.2} className="me-chevron" />
        }
      </button>
      {open && (
        <div className="me-ref__body">
          {filled.map(p => (
            <div key={p.key} className="me-ref__prompt">
              <p className="me-ref__label">{p.label}</p>
              <p className="me-ref__val">{entry[p.key]}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ReflectionLog({ entries }) {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? entries : entries.slice(0, 4)

  return (
    <>
      {visible.map((entry, i) => (
        <ReflectionItem key={entry.id ?? i} entry={entry} />
      ))}
      {!showAll && entries.length > 4 && (
        <button className="me-see-all" onClick={() => setShowAll(true)} type="button">
          See {entries.length - 4} more
        </button>
      )}
    </>
  )
}

// ── Clarity archive ────────────────────────────────────────────
function ClarityItem({ entry }) {
  const [open, setOpen] = useState(false)
  const summaryLines = Array.isArray(entry.summary) ? entry.summary : []

  return (
    <div className="me-clarity">
      <button className="me-clarity__hd" onClick={() => setOpen(v => !v)} type="button">
        <div>
          <p className="me-item-text">{entry.title || 'Untitled'}</p>
          <p className="me-item-meta">
            {fmtDate(entry.date)}
            {entry.mode ? ` · ${entry.mode}` : ''}
          </p>
        </div>
        {open
          ? <ChevronUp  size={13} strokeWidth={2.2} className="me-chevron" />
          : <ChevronDown size={13} strokeWidth={2.2} className="me-chevron" />
        }
      </button>
      {open && summaryLines.length > 0 && (
        <div className="me-clarity__summary">
          {summaryLines.map((line, i) => (
            <p key={i} className="me-clarity__line">{line}</p>
          ))}
        </div>
      )}
    </div>
  )
}

function ClarityLog({ entries }) {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? entries : entries.slice(0, 4)

  return (
    <>
      {visible.map((entry, i) => (
        <ClarityItem key={entry.id ?? i} entry={entry} />
      ))}
      {!showAll && entries.length > 4 && (
        <button className="me-see-all" onClick={() => setShowAll(true)} type="button">
          See {entries.length - 4} more
        </button>
      )}
    </>
  )
}

// ── Daily intentions log ───────────────────────────────────────
function IntentionItem({ entry }) {
  const [open, setOpen] = useState(false)
  const items = [
    { text: entry.text_1, ticked: entry.ticked_1 },
    { text: entry.text_2, ticked: entry.ticked_2 },
    { text: entry.text_3, ticked: entry.ticked_3 },
  ].filter(i => i.text)

  return (
    <div className="me-ref">
      <button className="me-ref__hd" onClick={() => setOpen(v => !v)} type="button">
        <div>
          <p className="me-item-date">{fmtDate(entry.date)}</p>
          <p className="me-item-meta">
            {entry.completion_count} of {items.length} done
          </p>
        </div>
        {open
          ? <ChevronUp   size={13} strokeWidth={2.2} className="me-chevron" />
          : <ChevronDown size={13} strokeWidth={2.2} className="me-chevron" />
        }
      </button>
      {open && (
        <div className="me-ref__body">
          {items.map((item, i) => (
            <div key={i} className="me-intention-item">
              <span className={`me-spark-dot${item.ticked ? ' me-spark-dot--done' : ' me-spark-dot--skip'}`}>
                {item.ticked
                  ? <Check size={10} strokeWidth={3} />
                  : <X     size={10} strokeWidth={3} />
                }
              </span>
              <p className="me-item-text">{item.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function IntentionsLog({ entries }) {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? entries : entries.slice(0, 4)

  return (
    <>
      {visible.map((entry, i) => (
        <IntentionItem key={entry.id ?? i} entry={entry} />
      ))}
      {!showAll && entries.length > 4 && (
        <button className="me-see-all" onClick={() => setShowAll(true)} type="button">
          See {entries.length - 4} more
        </button>
      )}
    </>
  )
}

// ── Personal details ───────────────────────────────────────────
const SEX_OPTIONS = ['Female', 'Male', 'Non-binary', 'Prefer not to say']

function PersonalDetails() {
  const [name,    setName]    = useState(null)   // null = loading
  const [age,     setAge]     = useState('')
  const [sex,     setSex]     = useState('')
  const [editing, setEditing] = useState(false)
  const [dName,   setDName]   = useState('')
  const [dAge,    setDAge]    = useState('')
  const [dSex,    setDSex]    = useState('')

  useEffect(() => {
    Promise.all([
      db.settings.where('key').equals('profile_name').first(),
      db.settings.where('key').equals('profile_age') .first(),
      db.settings.where('key').equals('profile_sex') .first(),
    ]).then(([n, a, s]) => {
      setName(n?.value ?? ''); setAge(a?.value ?? ''); setSex(s?.value ?? '')
    }).catch(() => { setName(''); setAge(''); setSex('') })
  }, [])

  async function saveSetting(key, value) {
    const rec = await db.settings.where('key').equals(key).first()
    if (rec) await db.settings.update(rec.id, { value })
    else      await db.settings.add({ key, value })
  }

  async function save() {
    try {
      await Promise.all([
        saveSetting('profile_name', dName.trim()),
        saveSetting('profile_age',  dAge.trim()),
        saveSetting('profile_sex',  dSex),
      ])
      setName(dName.trim()); setAge(dAge.trim()); setSex(dSex)
    } catch {}
    setEditing(false)
  }

  function startEdit() {
    setDName(name || ''); setDAge(age || ''); setDSex(sex || '')
    setEditing(true)
  }

  if (name === null) return null

  const hasAny = name || age || sex

  return (
    <div className="me-card">
      <div className="me-card__hd">
        <div className="me-card__label">
          <User size={14} strokeWidth={2.2} className="me-icon" />
          About you
          <span className="me-optional">optional</span>
        </div>
        {!editing && (
          <button className="me-edit-btn" onClick={startEdit} type="button" aria-label="Edit details">
            <Edit2 size={13} strokeWidth={2} />
          </button>
        )}
      </div>

      {editing ? (
        <>
          <div className="me-profile-fields">
            <div className="me-profile-field">
              <label className="me-profile-label">Name</label>
              <input
                className="me-profile-input"
                type="text"
                value={dName}
                onChange={e => setDName(e.target.value)}
                placeholder="Your name"
                autoFocus
              />
            </div>
            <div className="me-profile-field">
              <label className="me-profile-label">Age</label>
              <input
                className="me-profile-input me-profile-input--short"
                type="number"
                value={dAge}
                onChange={e => setDAge(e.target.value)}
                placeholder="—"
                min="1" max="120"
              />
            </div>
            <div className="me-profile-field">
              <label className="me-profile-label">Sex</label>
              <div className="me-sex-opts">
                {SEX_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    className={`me-sex-btn${dSex === opt ? ' me-sex-btn--on' : ''}`}
                    onClick={() => setDSex(opt === dSex ? '' : opt)}
                    type="button"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <p className="me-profile-hint">
            Used only to give the AI better context. Never leaves your device.
          </p>
          <div className="me-ns-actions">
            <button className="me-btn-primary" onClick={save} type="button">
              <Check size={13} strokeWidth={2.5} /> Save
            </button>
            <button className="me-btn-ghost" onClick={() => setEditing(false)} type="button">
              Cancel
            </button>
          </div>
        </>
      ) : hasAny ? (
        <div className="me-profile-vals">
          {name && <div className="me-profile-val"><span className="me-profile-val__k">Name</span><span className="me-profile-val__v">{name}</span></div>}
          {age  && <div className="me-profile-val"><span className="me-profile-val__k">Age</span> <span className="me-profile-val__v">{age}</span></div>}
          {sex  && <div className="me-profile-val"><span className="me-profile-val__k">Sex</span> <span className="me-profile-val__v">{sex}</span></div>}
        </div>
      ) : (
        <button className="me-ns-empty" onClick={startEdit} type="button">
          Add your details — helps the AI give better support
        </button>
      )}
    </div>
  )
}

// ── App feel (theme + accent) ──────────────────────────────────
function AppFeel({ theme, switchTheme }) {
  const [accent, setAccent] = useState(
    () => getComputedStyle(document.documentElement)
            .getPropertyValue('--color-accent').trim() || '#4F46E5'
  )

  useEffect(() => {
    db.settings.where('key').equals('accent_color').first()
      .then(r => { if (r?.value) { applyAccent(r.value); setAccent(r.value) } })
      .catch(() => {})
  }, [])

  async function pickAccent(preset) {
    applyAccent(preset.value)
    setAccent(preset.value)
    try {
      const rec = await db.settings.where('key').equals('accent_color').first()
      if (rec) await db.settings.update(rec.id, { value: preset.value })
      else      await db.settings.add({ key: 'accent_color', value: preset.value })
    } catch {}
  }

  return (
    <div className="me-card">
      <div className="me-card__hd">
        <div className="me-card__label">
          <Palette size={14} strokeWidth={2.2} className="me-icon" />
          App feel
        </div>
      </div>

      <div className="me-theme-row">
        {['minimal', 'playful'].map(t => (
          <button
            key={t}
            className={`me-theme-btn${theme === t ? ' me-theme-btn--on' : ''}`}
            onClick={() => switchTheme(t)}
            type="button"
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <p className="me-settings-sub">Accent colour</p>
      <div className="me-accent-row">
        {ACCENTS.map(a => (
          <button
            key={a.name}
            className={`me-accent-dot${accent === a.value ? ' me-accent-dot--on' : ''}`}
            style={{ '--dot': a.value }}
            onClick={() => pickAccent(a)}
            type="button"
            aria-label={a.name}
          />
        ))}
      </div>
    </div>
  )
}

// ── Notifications card ─────────────────────────────────────────
function NotificationsCard() {
  const [permission, setPermission] = useState(() => getPermission())
  const [enabled,    setEnabled]    = useState(false)
  const [morning,    setMorning]    = useState('08:00')
  const [evening,    setEvening]    = useState('20:00')
  const [saving,     setSaving]     = useState(false)
  const [saved,      setSaved]      = useState(false)
  const [loaded,     setLoaded]     = useState(false)

  useEffect(() => {
    loadNotifSettings().then(s => {
      setEnabled(s.enabled)
      setMorning(s.morning)
      setEvening(s.evening)
      setLoaded(true)
    }).catch(() => setLoaded(true))
  }, [])

  async function handleRequestPermission() {
    const result = await requestPermission()
    setPermission(result)
    if (result === 'granted') {
      // Auto-enable when permission just granted
      await handleSave(true)
    }
  }

  async function handleSave(forceEnabled) {
    setSaving(true)
    const isEnabled = forceEnabled ?? enabled
    await saveNotifSettings({ enabled: isEnabled, morning, evening })
    setEnabled(isEnabled)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleToggle() {
    const next = !enabled
    setEnabled(next)
    await saveNotifSettings({ enabled: next, morning, evening })
  }

  if (!loaded) return null

  const isSupported = permission !== 'unsupported'
  const isDenied    = permission === 'denied'
  const isGranted   = permission === 'granted'

  return (
    <div className="me-card">
      <div className="me-card__hd">
        <div className="me-card__label">
          {enabled && isGranted
            ? <Bell    size={14} strokeWidth={2.2} className="me-icon" />
            : <BellOff size={14} strokeWidth={2.2} className="me-icon" />
          }
          Notifications
        </div>
        {isGranted && (
          <button
            className={`me-notif-toggle${enabled ? ' me-notif-toggle--on' : ''}`}
            onClick={handleToggle}
            type="button"
            aria-label={enabled ? 'Disable notifications' : 'Enable notifications'}
          >
            <span className="me-notif-toggle__thumb" />
          </button>
        )}
      </div>

      {!isSupported && (
        <p className="me-notif-unsupported">
          Notifications aren't supported in this browser.
        </p>
      )}

      {isSupported && isDenied && (
        <p className="me-notif-denied">
          Notification permission was denied. Enable it in your browser's site settings, then come back here.
        </p>
      )}

      {isSupported && !isGranted && !isDenied && (
        <>
          <p className="me-notif-info">
            Get gentle reminders for your morning and evening rituals.
          </p>
          <button className="me-notif-request-btn" onClick={handleRequestPermission} type="button">
            <Bell size={14} strokeWidth={2} />
            Enable reminders
          </button>
        </>
      )}

      {isGranted && (
        <>
          {enabled ? (
            <>
              <div className="me-notif-times">
                <label className="me-notif-time-row">
                  <span className="me-notif-time-label">Morning ritual</span>
                  <input
                    type="time"
                    className="me-notif-time-input"
                    value={morning}
                    onChange={e => setMorning(e.target.value)}
                  />
                </label>
                <label className="me-notif-time-row">
                  <span className="me-notif-time-label">Evening ritual</span>
                  <input
                    type="time"
                    className="me-notif-time-input"
                    value={evening}
                    onChange={e => setEvening(e.target.value)}
                  />
                </label>
              </div>
              <p className="me-notif-note">
                Reminders fire while the app is open in your browser — they're not background push notifications. Suppressed automatically if you've already completed your ritual for the day.
              </p>
              <div className="me-notif-actions">
                <button
                  className="me-btn-primary"
                  onClick={() => handleSave()}
                  disabled={saving}
                  type="button"
                >
                  <Check size={13} strokeWidth={2.5} />
                  {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save times'}
                </button>
              </div>
            </>
          ) : (
            <p className="me-notif-info">
              Reminders are off. Toggle to turn them back on.
            </p>
          )}
        </>
      )}
    </div>
  )
}

// ── Privacy, export & data clear ───────────────────────────────

// Human-readable text export (F16)
async function buildExportText() {
  const [northStar, intentions, reflections, parking, kindWords, sparks, clarity] =
    await Promise.all([
      db.north_star.toArray(),
      db.intentions_history.orderBy('date').toArray(),
      db.reflection_entries.orderBy('date').toArray(),
      db.parking_lot.toArray(),
      db.kind_words.orderBy('createdAt').toArray(),
      db.spark_log.orderBy('date').toArray(),
      db.clarity_archive.orderBy('date').toArray(),
    ])

  const hr   = '─'.repeat(48)
  const now  = new Date()
  const date = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const lines = []

  lines.push('Unfolding — My Data Export')
  lines.push(`Exported: ${date}`)
  lines.push('')

  // North Star
  lines.push(hr)
  lines.push('North Star')
  lines.push(hr)
  if (northStar[0]?.text) lines.push(northStar[0].text)
  else lines.push('(not set)')
  lines.push('')

  // Reflections
  lines.push(hr)
  lines.push(`Evening Reflections  (${reflections.length})`)
  lines.push(hr)
  for (const r of [...reflections].reverse()) {
    lines.push(fmtDate(r.date))
    if (r.learnt)       lines.push(`  Learnt:           ${r.learnt}`)
    if (r.grateful)     lines.push(`  Grateful for:     ${r.grateful}`)
    if (r.smile)        lines.push(`  Made me smile:    ${r.smile}`)
    if (r.warm_thought) lines.push(`  Warm thought:     ${r.warm_thought}`)
    lines.push('')
  }

  // Daily intentions
  lines.push(hr)
  lines.push(`Daily Intentions  (${intentions.length})`)
  lines.push(hr)
  for (const r of [...intentions].reverse()) {
    const items = [r.text_1, r.text_2, r.text_3].filter(Boolean)
    const done  = [r.ticked_1, r.ticked_2, r.ticked_3]
    lines.push(fmtDate(r.date))
    items.forEach((t, i) => lines.push(`  ${done[i] ? '✓' : '·'} ${t}`))
    lines.push('')
  }

  // Kind Words
  lines.push(hr)
  lines.push(`Kind Words Jar  (${kindWords.length})`)
  lines.push(hr)
  for (const w of kindWords) {
    lines.push(`· ${w.text}`)
  }
  lines.push('')

  // Parking Lot
  lines.push(hr)
  lines.push(`Parking Lot  (${parking.length})`)
  lines.push(hr)
  for (const p of parking) {
    const status = p.status === 'resolved' ? '[resolved]' : '[parked]'
    lines.push(`${status} ${p.text}${p.tag ? ` — ${p.tag}` : ''}`)
    lines.push(`  Parked: ${fmtDate(p.date_parked)}`)
    lines.push('')
  }

  // Spark Log
  lines.push(hr)
  lines.push(`Spark Log  (${sparks.length})`)
  lines.push(hr)
  for (const s of [...sparks].reverse()) {
    const status = s.completion_status === 'done' ? '✓' : '·'
    lines.push(`${status} ${s.task_text}  [${fmtDate(s.date)}]`)
  }
  lines.push('')

  // Clarity Archive
  lines.push(hr)
  lines.push(`Clarity Archive  (${clarity.length})`)
  lines.push(hr)
  for (const c of [...clarity].reverse()) {
    lines.push(c.title || 'Untitled')
    lines.push(`  ${fmtDate(c.date)}${c.mode ? ` · ${c.mode}` : ''}`)
    if (Array.isArray(c.summary)) c.summary.forEach(l => lines.push(`  ${l}`))
    lines.push('')
  }

  return lines.join('\n')
}

function PrivacySection() {
  const [clearMode,    setClearMode]    = useState('idle')  // 'idle'|'old'|'all'|'done'
  const [deleteMode,   setDeleteMode]   = useState('idle')  // 'idle'|'confirm'|'done'
  const [exporting,    setExporting]    = useState(false)

  async function exportData() {
    if (exporting) return
    setExporting(true)
    try {
      const text = await buildExportText()
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `unfolding-${new Date().toISOString().slice(0, 10)}.txt`
      document.body.appendChild(a); a.click(); document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {}
    setExporting(false)
  }

  async function clearOldEntries() {
    const cutoff     = new Date()
    cutoff.setFullYear(cutoff.getFullYear() - 1)
    const cutoffDate = cutoff.toISOString().slice(0, 10)
    const cutoffISO  = cutoff.toISOString()
    try {
      await Promise.all([
        db.spark_log         .where('date')       .below(cutoffDate).delete(),
        db.reflection_entries.where('date')       .below(cutoffDate).delete(),
        db.clarity_archive   .where('date')       .below(cutoffDate).delete(),
        db.intentions_history.where('date')       .below(cutoffDate).delete(),
        db.kind_words        .where('createdAt')  .below(cutoffISO) .delete(),
        db.parking_lot       .where('date_parked').below(cutoffDate).delete(),
      ])
    } catch {}
    setClearMode('done')
    setTimeout(() => setClearMode('idle'), 2500)
  }

  async function deleteAllData() {
    try {
      await Promise.all([
        db.spark_log.clear(),
        db.reflection_entries.clear(),
        db.clarity_archive.clear(),
        db.intentions_history.clear(),
        db.kind_words.clear(),
        db.parking_lot.clear(),
        db.north_star.clear(),
        db.daily_intentions.clear(),
        db.tomorrow_intention.clear(),
        db.week_cartoons.clear(),
      ])
    } catch {}
    setDeleteMode('done')
  }

  const cutoffLabel = (() => {
    const d = new Date()
    d.setFullYear(d.getFullYear() - 1)
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  })()

  return (
    <div className="me-card me-card--privacy">
      <div className="me-card__hd">
        <div className="me-card__label">
          <Shield size={14} strokeWidth={2.2} className="me-icon" />
          Your Privacy
        </div>
      </div>

      {/* Where data lives */}
      <div className="me-privacy-where">
        <HardDrive size={13} strokeWidth={2} className="me-privacy-where__icon" aria-hidden="true" />
        <p className="me-privacy-where__text">
          Your reflections, intentions, and thoughts are stored in your browser's
          local storage — on this device only. We have no server. No account. No cloud.
          Nobody can read your entries but you.
        </p>
      </div>

      {/* Site-data warning */}
      <div className="me-privacy-warn">
        <AlertTriangle size={13} strokeWidth={2} className="me-privacy-warn__icon" aria-hidden="true" />
        <p className="me-privacy-warn__text">
          Clearing your browser's site data, cookies, or cache will permanently
          delete all entries. Export regularly as a backup.
        </p>
      </div>

      {/* Export (F16) */}
      <button className="me-export-btn" onClick={exportData} disabled={exporting} type="button">
        <Download size={14} strokeWidth={2} />
        {exporting ? 'Preparing…' : 'Export my data'}
      </button>
      <p className="me-export-hint">Downloads a readable text file of everything you've written.</p>

      {/* Clear old entries */}
      <div className="me-clear-wrap">
        {clearMode === 'done' ? (
          <p className="me-clear-done">Old entries cleared.</p>
        ) : clearMode === 'old' ? (
          <div className="me-clear-confirm">
            <p className="me-clear-confirm__text">
              Permanently delete all entries before {cutoffLabel}?
            </p>
            <div className="me-clear-confirm__row">
              <button className="me-clear-confirm__yes" onClick={clearOldEntries} type="button">
                Yes, clear
              </button>
              <button className="me-clear-confirm__no" onClick={() => setClearMode('idle')} type="button">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button className="me-clear-btn" onClick={() => setClearMode('old')} type="button">
            Clear entries older than 1 year
          </button>
        )}
      </div>

      {/* Delete all data */}
      <div className="me-clear-wrap">
        {deleteMode === 'done' ? (
          <p className="me-clear-done">All data deleted. The app will feel fresh on next open.</p>
        ) : deleteMode === 'confirm' ? (
          <div className="me-clear-confirm me-clear-confirm--danger">
            <p className="me-clear-confirm__text">
              Delete <strong>all</strong> your entries, intentions, reflections, and north star? This cannot be undone.
            </p>
            <div className="me-clear-confirm__row">
              <button className="me-clear-confirm__yes" onClick={deleteAllData} type="button">
                Delete everything
              </button>
              <button className="me-clear-confirm__no" onClick={() => setDeleteMode('idle')} type="button">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button className="me-delete-all-btn" onClick={() => setDeleteMode('confirm')} type="button">
            <Trash2 size={13} strokeWidth={2} />
            Delete all my data
          </button>
        )}
      </div>
    </div>
  )
}

// ── Main screen ────────────────────────────────────────────────
export default function MeScreen() {
  const { theme, switchTheme } = useTheme()
  const [sparks,      setSparks]      = useState([])
  const [reflections, setReflections] = useState([])
  const [clarity,     setClarity]     = useState([])
  const [intentions,  setIntentions]  = useState([])

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    db.spark_log.where('completion_status').equals('done').reverse().sortBy('date').then(setSparks).catch(() => {})
    // Exclude today — history shows completed days only, consistent with intentions & spark
    db.reflection_entries.orderBy('date').reverse().toArray()
      .then(all => setReflections(all.filter(r => r.date < today)))
      .catch(() => {})
    db.clarity_archive   .orderBy('date').reverse().toArray().then(setClarity)    .catch(() => {})
    db.intentions_history.orderBy('date').reverse().toArray().then(setIntentions) .catch(() => {})
  }, [])

  return (
    <div className="me-screen">

      {/* Header */}
      <div className="me-header">
        <p className="me-eyebrow">You</p>
        <h1 className="me-title">Me</h1>
      </div>

      {/* 1 — About you */}
      <PersonalDetails />

      {/* 2 — App feel */}
      <AppFeel theme={theme} switchTheme={switchTheme} />

      {/* 3 — Notifications */}
      <NotificationsCard />

      {/* 4 — North Star */}
      <NorthStarCard />

      {/* 5 — Reflection History */}
      <Section
        icon={BookOpen}
        title="Reflection History"
        count={reflections.length}
        emptyMsg="Evening reflections will appear here after your first ritual."
      >
        <ReflectionLog entries={reflections} />
      </Section>

      {/* 5 — Clarity Archive */}
      <Section
        icon={Lightbulb}
        title="Clarity Archive"
        count={clarity.length}
        emptyMsg="Clarity cards saved from Let's Figure It Out appear here."
      >
        <ClarityLog entries={clarity} />
      </Section>

      {/* 6 — Daily Intentions Log */}
      <Section
        icon={ListChecks}
        title="Daily Intentions"
        count={intentions.length}
        emptyMsg="Past daily intentions will appear here — they archive automatically each morning."
      >
        <IntentionsLog entries={intentions} />
      </Section>

      {/* 7 — Spark Log */}
      <Section
        icon={Zap}
        title="Spark Log"
        count={sparks.length}
        emptyMsg="Completed sparks will appear here."
      >
        <SparkLog entries={sparks} />
      </Section>

      {/* 8 — Privacy */}
      <PrivacySection />

    </div>
  )
}
