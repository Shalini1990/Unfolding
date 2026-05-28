import { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'

// ── Inline ember dot ────────────────────────────────────────────
function EmberDot({ size = 6, glow = true }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: '50%',
        background: '#ff8a3d',
        flexShrink: 0,
        boxShadow: glow ? '0 0 8px rgba(255,138,61,0.7)' : 'none',
      }}
    />
  )
}

// ── Derive line colors ──────────────────────────────────────────
function coloredLines(text) {
  const lines = text.split('\n')
  const n = lines.length
  return lines.map((line, i) => {
    const fromEnd = n - 1 - i
    let color
    if (fromEnd === 0)      color = '#efe4cd'
    else if (fromEnd === 1) color = '#c8b896'
    else                    color = '#7a6e55'
    return { line, color }
  })
}

// ── Main component ──────────────────────────────────────────────
export default function TheRoom({ onClose }) {
  const [phase,       setPhase]       = useState('entered')
  // 'entered' | 'writing' | 'releasing' | 'fading' | 'after'
  const [text,        setText]        = useState('')
  const [isClosing,   setIsClosing]   = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [holdProgress,setHoldProgress]= useState(0)
  const [scrollTop,   setScrollTop]   = useState(0)

  const holdActiveRef = useRef(false)
  const holdStartRef  = useRef(null)
  const rafRef        = useRef(null)
  const textareaRef   = useRef(null)
  const displayRef    = useRef(null)

  const lineCount  = text.trim() ? text.split('\n').filter(l => l.length > 0).length : 0
  const isReleasing = phase === 'releasing'
  const breadcrumb  = isReleasing ? 'Releasing…' : 'YOUR SAFE SPACE'

  // Sync display div scroll to textarea scroll
  function handleScroll(e) {
    setScrollTop(e.target.scrollTop)
  }

  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.scrollTop = scrollTop
    }
  }, [scrollTop])

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  // ── Text change ───────────────────────────────────────────────
  function handleTextChange(e) {
    const val = e.target.value
    setText(val)
    if (val.trim() && phase === 'entered') setPhase('writing')
    if (!val.trim() && phase === 'writing') setPhase('entered')
  }

  // ── Close ─────────────────────────────────────────────────────
  function requestClose() {
    if (text.trim()) {
      setShowConfirm(true)
    } else {
      doClose()
    }
  }

  function doClose() {
    setIsClosing(true)
    setTimeout(() => onClose(), 400)
  }

  // ── Hold gesture ──────────────────────────────────────────────
  function startHold(e) {
    if (phase !== 'writing' || !text.trim() || holdActiveRef.current) return
    e.preventDefault()
    holdActiveRef.current = true
    holdStartRef.current  = Date.now()
    setPhase('releasing')

    function tick() {
      if (!holdActiveRef.current) return
      const progress = Math.min((Date.now() - holdStartRef.current) / 3000, 1)
      setHoldProgress(progress)
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        holdActiveRef.current = false
        completeRelease()
      }
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  function cancelHold() {
    if (!holdActiveRef.current) return
    holdActiveRef.current = false
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
    setHoldProgress(0)
    setPhase('writing')
  }

  function completeRelease() {
    setPhase('fading')
    setHoldProgress(0)
    setTimeout(() => {
      setText('')
      setPhase('after')
    }, 450)
  }

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className={`room-overlay${isClosing ? ' room-overlay--closing' : ''}`}>

      {/* Breadcrumb */}
      <div className="room-breadcrumb">
        <EmberDot size={6} />
        <span className="room-breadcrumb__text">{breadcrumb}</span>
      </div>

      {/* Close button */}
      {!showConfirm && phase !== 'after' && (
        <button
          className="room-close"
          onClick={requestClose}
          disabled={isReleasing}
          type="button"
          aria-label="Leave the room"
        >
          <X size={12} strokeWidth={1.5} />
        </button>
      )}

      {/* ── Confirmation sheet ─────────────────────────────────── */}
      {showConfirm && (
        <div className="room-confirm">
          <p className="room-confirm__title">Leave the room?</p>
          <p className="room-confirm__sub">Anything you wrote will be lost.</p>
          <div className="room-confirm__actions">
            <button
              className="room-confirm__stay"
              onClick={() => setShowConfirm(false)}
              type="button"
            >
              Stay
            </button>
            <button
              className="room-confirm__leave"
              onClick={doClose}
              type="button"
            >
              Leave
            </button>
          </div>
        </div>
      )}

      {/* ── Main content ───────────────────────────────────────── */}
      {!showConfirm && (
        <>

          {/* State: entered — ritual lines */}
          {phase === 'entered' && (
            <div className="room-ritual">
              <p>Nothing here is saved.</p>
              <p>When you're done, it goes.</p>
            </div>
          )}

          {/* Writing area — shown during entered/writing/releasing/fading */}
          {(phase === 'entered' || phase === 'writing' || phase === 'releasing' || phase === 'fading') && (
            <div className={`room-writing-area${phase === 'fading' ? ' room-writing-area--fading' : ''}`}>

              {/* Styled line display (behind textarea) */}
              <div className="room-lines-display" ref={displayRef} aria-hidden="true">
                {coloredLines(text).map(({ line, color }, i) => (
                  <div
                    key={i}
                    style={{ color, transition: 'color 200ms ease', whiteSpace: 'pre-wrap', minHeight: '1.5em' }}
                  >
                    {line || ' '}
                  </div>
                ))}
              </div>

              {/* Transparent textarea — captures input */}
              <textarea
                ref={textareaRef}
                className="room-textarea"
                value={text}
                onChange={handleTextChange}
                onScroll={handleScroll}
                autoFocus
                disabled={phase === 'releasing' || phase === 'fading'}
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="sentences"
              />
            </div>
          )}

          {/* State: after */}
          {phase === 'after' && (
            <div className="room-after">
              <p className="room-after__gone">Gone.</p>
              <p className="room-after__sub">that's yours to leave</p>
              <button
                className="room-after__close"
                onClick={doClose}
                type="button"
              >
                I'm okay · close
              </button>
            </div>
          )}

          {/* Bottom bar — writing states */}
          {(phase === 'entered' || phase === 'writing' || phase === 'releasing') && (
            <div className="room-bottom">

              {/* Counter */}
              <div className="room-meta-row">
                <span
                  className="room-counter"
                  style={{ color: isReleasing ? '#ff8a3d' : '#7a6e55' }}
                >
                  {isReleasing
                    ? "don't let go"
                    : text.trim()
                      ? `${lineCount} line${lineCount !== 1 ? 's' : ''} · just yours`
                      : '0 / no limit'
                  }
                </span>
              </div>

              {/* Hold-to-release */}
              <div
                className={`room-release-btn${!text.trim() ? ' room-release-btn--empty' : ''}${isReleasing ? ' room-release-btn--active' : ''}`}
                role="button"
                aria-disabled={!text.trim()}
                onPointerDown={text.trim() ? startHold : undefined}
                onPointerUp={cancelHold}
                onPointerLeave={cancelHold}
                onPointerCancel={cancelHold}
              >
                {/* Fill bar */}
                <div
                  className="room-release-btn__fill"
                  style={{ width: `${holdProgress * 100}%` }}
                />
                {/* Label */}
                <EmberDot size={8} glow={isReleasing} />
                <span className="room-release-btn__label">
                  {isReleasing ? 'Releasing…' : 'Hold to release'}
                </span>
              </div>

            </div>
          )}

        </>
      )}
    </div>
  )
}
