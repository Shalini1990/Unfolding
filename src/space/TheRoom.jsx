import { useState, useEffect, useRef, useCallback } from 'react'
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

// ── Line colours (oldest → newest) ──────────────────────────────
const LINE_COLORS = ['#7a6e55', '#c8b896', '#efe4cd']
function colorForLine(fromEnd) {
  return fromEnd === 0 ? LINE_COLORS[2] : fromEnd === 1 ? LINE_COLORS[1] : LINE_COLORS[0]
}

// ── Main component ──────────────────────────────────────────────
export default function TheRoom({ onClose }) {
  const [phase,        setPhase]        = useState('entered')
  // 'entered' | 'writing' | 'releasing' | 'fading' | 'after'
  const [text,         setText]         = useState('')
  const [isClosing,    setIsClosing]    = useState(false)
  const [showConfirm,  setShowConfirm]  = useState(false)
  const [holdProgress, setHoldProgress] = useState(0)

  const holdActiveRef = useRef(false)
  const holdStartRef  = useRef(null)
  const rafRef        = useRef(null)
  const editorRef     = useRef(null)
  const overlayRef    = useRef(null)
  // Keep a ref to phase so startHold closure sees fresh value
  const phaseRef      = useRef(phase)
  useEffect(() => { phaseRef.current = phase }, [phase])

  // ── Visual viewport — adjust writing area bottom padding when
  //    keyboard opens so the overlay never moves ──────────────────
  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return
    function onViewport() {
      const area = overlayRef.current?.querySelector('.room-writing-area')
      if (!area) return
      const keyboardHeight = Math.max(0, window.innerHeight - vv.height - vv.offsetTop)
      area.style.paddingBottom = keyboardHeight > 0 ? `${keyboardHeight + 16}px` : ''
    }
    vv.addEventListener('resize', onViewport)
    vv.addEventListener('scroll', onViewport)
    return () => {
      vv.removeEventListener('resize', onViewport)
      vv.removeEventListener('scroll', onViewport)
    }
  }, [])

  const lineCount   = text.trim() ? text.split('\n').filter(l => l.length > 0).length : 0
  const isReleasing = phase === 'releasing'
  const breadcrumb  = isReleasing ? 'Releasing…' : 'YOUR SAFE SPACE'

  // Initialise editor with an empty div line (Chrome default structure)
  useEffect(() => {
    const el = editorRef.current
    if (!el) return
    el.innerHTML = '<div><br></div>'
    el.focus()
    try {
      const range = document.createRange()
      range.setStart(el.firstChild, 0)
      range.collapse(true)
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(range)
    } catch { /* ignore */ }
  }, [])

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  // ── Colour update — ONLY changes style.color, never touches cursor ──
  const updateColors = useCallback(() => {
    const el = editorRef.current
    if (!el) return
    const kids = Array.from(el.children)   // element nodes only (divs)
    const n    = kids.length
    kids.forEach((div, i) => {
      div.style.color = colorForLine(n - 1 - i)
    })
  }, [])

  // Read the current raw text from the editor
  function getRawText() {
    const el = editorRef.current
    if (!el) return ''
    let t = el.innerText ?? ''
    // Chrome appends a trailing \n from the last line div — strip it
    if (t.endsWith('\n')) t = t.slice(0, -1)
    return t
  }

  // ── Input handler ──────────────────────────────────────────────
  function handleInput() {
    const raw = getRawText()
    setText(raw)
    if (raw.trim() && phase === 'entered') setPhase('writing')
    if (!raw.trim() && phase === 'writing') setPhase('entered')
    requestAnimationFrame(() => {
      updateColors()
      // Scroll writing area so cursor stays above keyboard
      const sel = window.getSelection()
      if (!sel?.rangeCount) return
      const rect      = sel.getRangeAt(0).getBoundingClientRect()
      const vv        = window.visualViewport
      const viewH     = vv ? vv.offsetTop + vv.height : window.innerHeight
      const padding   = 48 // space below cursor
      if (rect.bottom + padding > viewH) {
        const area = editorRef.current?.parentElement
        if (area) area.scrollTop += rect.bottom + padding - viewH
      }
    })
  }

  // Strip rich formatting on paste
  function handlePaste(e) {
    e.preventDefault()
    const plain = e.clipboardData?.getData('text/plain') ?? ''
    document.execCommand('insertText', false, plain)
  }

  // ── Close ─────────────────────────────────────────────────────
  function requestClose() {
    if (getRawText().trim()) setShowConfirm(true)
    else doClose()
  }

  function doClose() {
    setIsClosing(true)
    setTimeout(() => onClose(), 400)
  }

  // ── Hold gesture ──────────────────────────────────────────────
  function startHold(e) {
    const ph = phaseRef.current
    if (ph !== 'writing' || !getRawText().trim() || holdActiveRef.current) return
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
      const el = editorRef.current
      if (el) el.innerHTML = '<div><br></div>'
      setText('')
      setPhase('after')
    }, 450)
  }

  // ── Render ────────────────────────────────────────────────────
  return (
    <div ref={overlayRef} className={`room-overlay${isClosing ? ' room-overlay--closing' : ''}`}>

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
            <button className="room-confirm__stay"  onClick={() => setShowConfirm(false)} type="button">Stay</button>
            <button className="room-confirm__leave" onClick={doClose}                     type="button">Leave</button>
          </div>
        </div>
      )}

      {/* ── Main content ───────────────────────────────────────── */}
      {!showConfirm && (
        <>
          {/* Ritual prompt — shown before typing starts */}
          {phase === 'entered' && (
            <div className="room-ritual">
              <p>Nothing here is saved.</p>
              <p>When you're done, it goes.</p>
            </div>
          )}

          {/* Writing area — single contenteditable div handles both input and display */}
          {(phase === 'entered' || phase === 'writing' || phase === 'releasing' || phase === 'fading') && (
            <div className={`room-writing-area${phase === 'fading' ? ' room-writing-area--fading' : ''}`}>
              <div
                ref={editorRef}
                className="room-editor"
                contentEditable={phase === 'releasing' || phase === 'fading' ? 'false' : 'true'}
                suppressContentEditableWarning={true}
                onInput={handleInput}
                onPaste={handlePaste}
                spellCheck={false}
                autoCapitalize="sentences"
                data-gramm="false"          /* disable Grammarly overlay */
                data-gramm_editor="false"
              />
            </div>
          )}

          {/* After-release screen */}
          {phase === 'after' && (
            <div className="room-after">
              <p className="room-after__gone">Gone.</p>
              <p className="room-after__sub">that's yours to leave</p>
              <button className="room-after__close" onClick={doClose} type="button">
                I'm okay · close
              </button>
            </div>
          )}

          {/* Bottom bar */}
          {(phase === 'entered' || phase === 'writing' || phase === 'releasing') && (
            <div className="room-bottom">
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

              <div
                className={`room-release-btn${!text.trim() ? ' room-release-btn--empty' : ''}${isReleasing ? ' room-release-btn--active' : ''}`}
                role="button"
                aria-disabled={!text.trim()}
                onPointerDown={text.trim() ? startHold : undefined}
                onPointerUp={cancelHold}
                onPointerLeave={cancelHold}
                onPointerCancel={cancelHold}
              >
                <div className="room-release-btn__fill" style={{ width: `${holdProgress * 100}%` }} />
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
