import { useState } from 'react'
import { X, Flame } from 'lucide-react'

export default function NegativityRelease({ onClose }) {
  const [isClosing, setIsClosing] = useState(false)
  const [text,      setText]      = useState('')
  const [phase,     setPhase]     = useState('write')  // 'write' | 'burning' | 'burned'

  function handleClose() {
    if (phase === 'burning') return
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 280)
  }

  function handleBurn() {
    if (!text.trim()) return
    setPhase('burning')
    setTimeout(() => {
      setText('')
      setPhase('burned')
      setTimeout(() => setPhase('write'), 2400)
    }, 1300)
  }

  return (
    <div className={`nr-overlay${isClosing ? ' nr-overlay--closing' : ''}`}>
      <button
        className="nr-close"
        onClick={handleClose}
        disabled={phase === 'burning'}
        type="button"
        aria-label="Close"
      >
        <X size={20} strokeWidth={1.8} />
      </button>

      <h2 className="nr-title">Just let it out.</h2>

      {/* ── Write ──────────────────────────────────────────────── */}
      {phase === 'write' && (
        <>
          <textarea
            className="nr-input"
            value={text}
            onChange={e => setText(e.target.value)}
            rows={7}
            autoFocus
          />
          <button
            className="nr-burn-btn"
            onClick={handleBurn}
            disabled={!text.trim()}
            type="button"
          >
            <Flame size={15} strokeWidth={2.2} aria-hidden="true" />
            Burn it
          </button>
        </>
      )}

      {/* ── Burning ────────────────────────────────────────────── */}
      {phase === 'burning' && (
        <div className="nr-burning-card parking-thought-card parking-thought-card--burning">
          <div className="burn-flames" aria-hidden="true">
            <Flame size={22} className="burn-flame burn-flame--0" />
            <Flame size={18} className="burn-flame burn-flame--1" />
            <Flame size={26} className="burn-flame burn-flame--2" />
            <Flame size={20} className="burn-flame burn-flame--3" />
            <Flame size={16} className="burn-flame burn-flame--4" />
            <Flame size={22} className="burn-flame burn-flame--5" />
          </div>
          <p className="nr-burning-text">{text}</p>
        </div>
      )}

      {/* ── Burned ─────────────────────────────────────────────── */}
      {phase === 'burned' && (
        <div className="nr-result-msg">
          <p>Gone. You can let that go now.</p>
        </div>
      )}
    </div>
  )
}
