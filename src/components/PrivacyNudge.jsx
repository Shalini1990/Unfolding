import { useState, useEffect } from 'react'
import { Lock, X } from 'lucide-react'

/**
 * One-time contextual nudge shown on first use of each private feature.
 * featureKey: 'three_things' | 'reflection' | 'kind_words' | 'parking_lot'
 * Auto-dismissed after 6s; can be manually closed.
 */
export default function PrivacyNudge({ featureKey }) {
  const storageKey = `pnudge_${featureKey}`
  const [visible,  setVisible]  = useState(false)
  const [exiting,  setExiting]  = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(storageKey)) {
      setVisible(true)
    }
  }, [storageKey])

  useEffect(() => {
    if (!visible) return
    const t = setTimeout(dismiss, 6000)
    return () => clearTimeout(t)
  }, [visible]) // eslint-disable-line react-hooks/exhaustive-deps

  function dismiss() {
    if (exiting) return
    localStorage.setItem(storageKey, '1')
    setExiting(true)
    setTimeout(() => setVisible(false), 260)
  }

  if (!visible) return null

  return (
    <div className={`pnudge${exiting ? ' pnudge--exit' : ''}`} role="status" aria-live="polite">
      <Lock size={11} strokeWidth={2.5} className="pnudge__icon" aria-hidden="true" />
      <p className="pnudge__text">Private — stays on your device only.</p>
      <button
        className="pnudge__close"
        onClick={dismiss}
        type="button"
        aria-label="Dismiss"
      >
        <X size={11} strokeWidth={2.5} />
      </button>
    </div>
  )
}
