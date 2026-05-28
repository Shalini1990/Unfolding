import { useRef, useState, useEffect } from 'react'

// ── Colour palette — 8 calming hues ──────────────────────────────
const PALETTE = [
  { label: 'Sky',      hex: '#93C5FD' },
  { label: 'Mint',     hex: '#6EE7B7' },
  { label: 'Lavender', hex: '#C4B5FD' },
  { label: 'Blush',    hex: '#F9A8D4' },
  { label: 'Coral',    hex: '#FCA5A5' },
  { label: 'Amber',    hex: '#FDE68A' },
  { label: 'Sage',     hex: '#86EFAC' },
  { label: 'Slate',    hex: '#94A3B8' },
]

const BRUSH_R     = 18    // radius in CSS px
const BRUSH_ALPHA = 0.28  // per-stamp opacity — builds up on overlap

export default function ColourFill() {
  const canvasRef = useRef(null)
  const ctxRef    = useRef(null)
  const painting  = useRef(false)
  const lastPos   = useRef(null)
  const colorRef  = useRef(PALETTE[0].hex)

  const [color, setColor] = useState(PALETTE[0].hex)

  // Keep colorRef in sync so pointer-event closures always read latest value
  useEffect(() => { colorRef.current = color }, [color])

  // Size the canvas backing store to match layout pixels × device pixel ratio
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr  = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width  = Math.round(rect.width  * dpr)
    canvas.height = Math.round(rect.height * dpr)
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctxRef.current = ctx
  }, [])

  // ── Drawing primitives ─────────────────────────────────────────
  function stamp(x, y) {
    const ctx = ctxRef.current
    if (!ctx) return
    ctx.globalAlpha = BRUSH_ALPHA
    ctx.fillStyle   = colorRef.current
    ctx.beginPath()
    ctx.arc(x, y, BRUSH_R, 0, Math.PI * 2)
    ctx.fill()
  }

  function strokeTo(x, y) {
    const from  = lastPos.current ?? { x, y }
    const dist  = Math.hypot(x - from.x, y - from.y)
    const steps = Math.max(1, Math.ceil(dist / 4))
    for (let i = 1; i <= steps; i++) {
      const t = i / steps
      stamp(from.x + (x - from.x) * t, from.y + (y - from.y) * t)
    }
    lastPos.current = { x, y }
  }

  // ── Pointer event helpers ──────────────────────────────────────
  function getXY(e) {
    const rect = canvasRef.current.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  function onDown(e) {
    e.preventDefault()
    canvasRef.current?.setPointerCapture(e.pointerId)
    painting.current = true
    const { x, y } = getXY(e)
    lastPos.current  = { x, y }
    stamp(x, y)
  }

  function onMove(e) {
    if (!painting.current) return
    e.preventDefault()
    const { x, y } = getXY(e)
    strokeTo(x, y)
  }

  function onUp() {
    painting.current = false
    lastPos.current  = null
  }

  function clear() {
    const canvas = canvasRef.current
    const ctx    = ctxRef.current
    if (!canvas || !ctx) return
    const dpr = window.devicePixelRatio || 1
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)
  }

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div className="colour-fill-wrap">
      <canvas
        ref={canvasRef}
        className="colour-fill-canvas"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        onPointerCancel={onUp}
      />

      <div className="colour-fill-controls">
        <div className="colour-fill-palette">
          {PALETTE.map(({ label, hex }) => (
            <button
              key={hex}
              className={`colour-fill-swatch${color === hex ? ' colour-fill-swatch--active' : ''}`}
              style={{ '--sw': hex }}
              onClick={() => setColor(hex)}
              type="button"
              aria-label={label}
            />
          ))}
        </div>
        <button className="colour-fill-clear" onClick={clear} type="button">
          Clear
        </button>
      </div>
    </div>
  )
}
