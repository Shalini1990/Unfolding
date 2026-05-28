import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import db from '../db/db'
import { relativeDate } from '../utils/date'

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000

export default function ResolvedSection() {
  const [items, setItems]       = useState([])
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading]   = useState(true)

  useEffect(() => { loadResolved() }, [])

  async function loadResolved() {
    const all = await db.parking_lot.toArray()
    const cutoff = Date.now() - THIRTY_DAYS_MS

    // Auto-delete anything resolved more than 30 days ago
    const expired = all.filter(t => {
      if (t.status !== 'resolved') return false
      const resolvedMs = new Date(t.resolved_at || t.date_parked).getTime()
      return resolvedMs < cutoff
    })
    for (const t of expired) {
      await db.parking_lot.delete(t.id)
    }

    const expiredIds = new Set(expired.map(t => t.id))
    const resolved = all
      .filter(t => t.status === 'resolved' && !expiredIds.has(t.id))
      .sort((a, b) =>
        new Date(b.resolved_at || b.date_parked) -
        new Date(a.resolved_at || a.date_parked)
      )

    setItems(resolved)
    setLoading(false)
  }

  if (loading || items.length === 0) return null

  return (
    <div className="resolved-section">
      <button
        className="resolved-section__toggle"
        onClick={() => setExpanded(e => !e)}
        type="button"
      >
        <span className="resolved-section__title">
          Resolved · {items.length}
        </span>
        <ChevronDown
          size={14}
          strokeWidth={2}
          className={`resolved-section__chevron${expanded ? ' resolved-section__chevron--open' : ''}`}
          aria-hidden="true"
        />
      </button>

      {expanded && (
        <div className="resolved-list">
          {items.map(t => (
            <div key={t.id} className="resolved-item">
              <div className="resolved-item__meta">
                {t.tag && (
                  <span className="resolved-item__tag">{t.tag}</span>
                )}
                <span className="resolved-item__date">
                  Resolved {relativeDate(t.resolved_at || t.date_parked)}
                </span>
              </div>
              <p className="resolved-item__text">{t.text}</p>
            </div>
          ))}
          <p className="resolved-section__note">
            Entries are deleted automatically after 30 days.
          </p>
        </div>
      )}
    </div>
  )
}
