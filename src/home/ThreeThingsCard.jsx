import { useRef, useState } from 'react'
import { ChevronDown, Pencil } from 'lucide-react'
import { FistPumpCharacter, ThinkingCharacter } from '../components/DoneCharacter'
import PrivacyNudge from '../components/PrivacyNudge'

const ACK = {
  1: "One down — you're moving",
  2: 'Almost there',
  3: "All three. That's a real day.",
}

function InputMode({ onSave, initialTexts = ['', '', ''], submitLabel = 'Set my intentions' }) {
  const [texts, setTexts] = useState(initialTexts)
  const ref1 = useRef(null)
  const ref2 = useRef(null)
  const ref3 = useRef(null)
  const refs = [ref1, ref2, ref3]

  function update(i, val) {
    setTexts(prev => prev.map((t, j) => (j === i ? val : t)))
  }

  function handleKeyDown(e, i) {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (i < 2) refs[i + 1].current?.focus()
      else handleSave()
    }
  }

  function handleSave() {
    const trimmed = texts.map(t => t.trim())
    if (!trimmed.some(Boolean)) return
    onSave(trimmed)
  }

  const hasAny = texts.some(t => t.trim())
  const placeholders = ['Your first thing…', 'Second…', 'Third…']

  return (
    <div className="home-card home-card--input">
      <ThinkingCharacter />
      <PrivacyNudge featureKey="three_things" />
      <p className="home-card__label">Three things to accomplish</p>
      <div className="three-things-inputs">
        {texts.map((text, i) => (
          <div key={i} className="three-things-row">
            <span className="three-things-num" aria-hidden="true">{i + 1}</span>
            <input
              ref={refs[i]}
              type="text"
              className="three-things-input"
              value={text}
              onChange={e => update(i, e.target.value)}
              onKeyDown={e => handleKeyDown(e, i)}
              placeholder={placeholders[i]}
              autoFocus={i === 0}
            />
          </div>
        ))}
      </div>
      <button
        className="three-things-btn"
        onClick={handleSave}
        disabled={!hasAny}
        type="button"
      >
        {submitLabel}
      </button>
    </div>
  )
}

function TickMode({ record, onTick, onEditClick }) {
  const items = [1, 2, 3]
    .map(n => ({ n, text: record[`text_${n}`], ticked: !!record[`ticked_${n}`] }))
    .filter(item => item.text)

  const tickCount = items.filter(item => item.ticked).length
  const allDone = items.length > 0 && tickCount === items.length
  const ackMsg = ACK[tickCount] || null

  return (
    <div className={`home-card home-card--three-things${allDone ? ' home-card--done' : ''}`}>
      <div className="three-things-header">
        <p className="home-card__label">Three things to accomplish</p>
        <button className="three-things-edit-btn" onClick={onEditClick} type="button" aria-label="Edit intentions">
          <Pencil size={13} strokeWidth={2} />
        </button>
      </div>
      <div className="three-things-list">
        {items.map(({ n, text, ticked }) => (
          <button
            key={n}
            className={`three-things-item${ticked ? ' three-things-item--ticked' : ''}`}
            onClick={() => onTick(n, !ticked)}
            type="button"
            aria-pressed={ticked}
          >
            <span
              className={`three-things-check${ticked ? ' three-things-check--ticked' : ''}`}
              aria-hidden="true"
            >
              {ticked ? '✓' : ''}
            </span>
            <span className={`three-things-text${ticked ? ' three-things-text--ticked' : ''}`}>
              {text}
            </span>
          </button>
        ))}
      </div>
      {ackMsg && (
        <p
          className={`three-things-ack${tickCount === 3 ? ' three-things-ack--all' : ''}`}
          key={tickCount}
        >
          {ackMsg}
        </p>
      )}
      {allDone ? <FistPumpCharacter /> : <ThinkingCharacter />}
    </div>
  )
}

export default function ThreeThingsCard({ record, onSave, onEdit, onTick }) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const isEvening = new Date().getHours() >= 17

  if (!record?.intentions_set) {
    if (isEvening && !expanded) {
      return (
        <button
          className="three-things-collapsed"
          onClick={() => setExpanded(true)}
          type="button"
          aria-label="Set three things — tap to expand"
        >
          <span className="three-things-collapsed__label">Three things · not set today</span>
          <ChevronDown size={14} strokeWidth={2} aria-hidden="true" />
        </button>
      )
    }
    return <InputMode onSave={onSave} />
  }

  if (editing) {
    const initialTexts = [record.text_1 || '', record.text_2 || '', record.text_3 || '']
    return (
      <InputMode
        initialTexts={initialTexts}
        submitLabel="Save changes"
        onSave={texts => { onEdit(texts); setEditing(false) }}
      />
    )
  }

  return <TickMode record={record} onTick={onTick} onEditClick={() => setEditing(true)} />
}
