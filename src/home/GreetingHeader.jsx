import { useState, useEffect } from 'react'
import { getGreeting, formatDisplayDate } from '../utils/date'
import db from '../db/db'

// Small painting-on-easel icon with a colourful mini landscape inside
function PaintingIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true"
         strokeLinecap="round" strokeLinejoin="round">
      {/* Canvas frame */}
      <rect x="2" y="2" width="20" height="14" rx="1.5"
            stroke="currentColor" strokeWidth="1.5" />
      {/* Sky fill */}
      <rect x="3" y="3" width="18" height="6" fill="#88B4D8" opacity="0.75" />
      {/* Ground fill */}
      <rect x="3" y="9" width="18" height="6" fill="#8DC49E" opacity="0.75" />
      {/* Sun */}
      <circle cx="17" cy="7" r="2.2" fill="#E8C87A" />
      {/* Mountain */}
      <polygon points="3,9 9,4.5 15,9" fill="#A88EC8" opacity="0.7" />
      {/* Easel legs */}
      <line x1="8"  y1="16" x2="6"  y2="22" stroke="currentColor" strokeWidth="1.5" />
      <line x1="16" y1="16" x2="18" y2="22" stroke="currentColor" strokeWidth="1.5" />
      <line x1="12" y1="16" x2="12" y2="22" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export default function GreetingHeader({ date, onEaselClick }) {
  const [firstName, setFirstName] = useState('')

  useEffect(() => {
    db.settings.where('key').equals('profile_name').first()
      .then(r => {
        if (r?.value) setFirstName(r.value.trim().split(/\s+/)[0])
      })
      .catch(() => {})
  }, [])

  const greeting = firstName ? `${getGreeting()}, ${firstName}` : getGreeting()

  return (
    <div className="home-greeting">
      <div className="home-greeting__h1-row">
        <h1 className="home-greeting__text">{greeting}</h1>
        {onEaselClick && (
          <button
            className="wc-icon-btn"
            onClick={onEaselClick}
            type="button"
            aria-label="This week"
          >
            <PaintingIcon />
          </button>
        )}
      </div>
      <p className="home-greeting__date">{formatDisplayDate(date)}</p>
    </div>
  )
}
