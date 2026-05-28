import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import db from '../db/db'
import { getTodayDate } from '../utils/date'

const ACTIONS = [
  { id: 'save',     label: 'Save to clarity archive' },
  { id: 'tomorrow', label: "Add to tomorrow's intentions" },
  { id: 'parking',  label: 'Back to parking lot' },
  { id: 'letgo',    label: 'Let it go' },
]

export default function ClarityCard({ card, thoughtId, onDone }) {
  const navigate  = useNavigate()
  const [done,    setDone]    = useState(null)   // which action was taken
  const [saving,  setSaving]  = useState(false)

  async function handleAction(id) {
    if (saving) return
    setSaving(true)

    if (id === 'save') {
      await db.clarity_archive.add({
        date:                  getTodayDate(),
        title:                 card.title,
        summary:               card.summary,
        mode:                  card.mode,
        linked_parking_lot_id: thoughtId ?? null,
      })
      // Also mark original thought resolved if we have its id
      if (thoughtId) {
        await db.parking_lot.update(thoughtId, {
          status:      'resolved',
          resolved_at: new Date().toISOString(),
        })
      }
      setDone('save')
      setTimeout(() => onDone(), 1600)

    } else if (id === 'tomorrow') {
      // Save full card to archive and resolve the parking lot thought
      await db.clarity_archive.add({
        date:                  getTodayDate(),
        title:                 card.title,
        summary:               card.summary,
        mode:                  card.mode,
        linked_parking_lot_id: thoughtId ?? null,
      })
      if (thoughtId) {
        await db.parking_lot.update(thoughtId, {
          status:      'resolved',
          resolved_at: new Date().toISOString(),
        })
      }
      // AI-generated next_step goes into tomorrow's intention
      await db.tomorrow_intention.put({
        id:       1,
        text:     card.next_step || card.summary[0],
        date_set: getTodayDate(),
      })
      setDone('tomorrow')
      setTimeout(() => onDone(), 1600)

    } else if (id === 'parking') {
      navigate(-1)

    } else if (id === 'letgo') {
      await db.releases.add({
        date:   getTodayDate(),
        text:   card.summary.join(' '),
        source: 'figure_it_out',
        mode:   card.mode,
      })
      // Resolve original thought too
      if (thoughtId) {
        await db.parking_lot.update(thoughtId, {
          status:      'resolved',
          resolved_at: new Date().toISOString(),
        })
      }
      setDone('letgo')
      setTimeout(() => onDone(), 1600)
    }

    setSaving(false)
  }

  return (
    <div className="clarity-card">
      {/* Title eyebrow */}
      <p className="clarity-card__eyebrow">Clarity card</p>

      {/* Mode chip */}
      {card.mode && (
        <span className="clarity-card__mode">{card.mode}</span>
      )}

      {/* Title */}
      <h2 className="clarity-card__title">{card.title}</h2>

      {/* Summary lines */}
      <div className="clarity-card__summary">
        {card.summary.map((line, i) => (
          <p key={i} className="clarity-card__line">{line}</p>
        ))}
      </div>

      {/* Actions */}
      {done ? (
        <div className="clarity-card__ack">
          <CheckCircle size={18} strokeWidth={2} />
          <span>
            {done === 'save'     && 'Saved to your clarity archive'}
            {done === 'tomorrow' && "Added to tomorrow's intentions"}
            {done === 'letgo'    && 'Released. Well done.'}
          </span>
        </div>
      ) : (
        <div className="clarity-card__actions">
          {ACTIONS.map(({ id, label }) => (
            <button
              key={id}
              className={`clarity-card__action clarity-card__action--${id}`}
              onClick={() => handleAction(id)}
              disabled={saving}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
