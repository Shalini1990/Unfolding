import { useState, useEffect, useRef } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

// ── 4-4-4-4 box breathing ──────────────────────────────────────
// Inhale 4s · Hold 4s · Exhale 4s · Hold 4s = 16s cycle
// CSS animation handles the visual; React state handles the label.
// Both start at mount → stay in sync for any reasonable session length.

const PHASES = ['Inhale', 'Hold', 'Exhale', 'Hold']

// iOS only allows AudioContext audio after a synchronous user gesture.
// async/await breaks the gesture trust — everything must be sync.
let sharedCtx = null

function unlockAudio() {
  // 1. Create context synchronously inside the gesture
  if (!sharedCtx) {
    sharedCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  // 2. Play a 1-frame silent buffer — iOS requires actual playback, not just resume()
  try {
    const buf = sharedCtx.createBuffer(1, 1, 22050)
    const src = sharedCtx.createBufferSource()
    src.buffer = buf
    src.connect(sharedCtx.destination)
    src.start(0)
  } catch (_) {}
  // 3. Resume — also synchronous, returns a promise we intentionally don't await
  sharedCtx.resume()
}

function playChime(phaseIdx) {
  if (!sharedCtx) return
  // Resume again in case context was suspended (e.g. tab switched)
  if (sharedCtx.state === 'suspended') sharedCtx.resume()
  try {
    const ctx  = sharedCtx
    const osc  = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    const freqs = [528, 440, 396, 440]
    osc.frequency.value = freqs[phaseIdx]
    osc.type = 'sine'
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.06)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.75)
  } catch (_) {}
}

export default function BoxBreathing() {
  const [phaseIdx,  setPhaseIdx]  = useState(0)
  const [showing,   setShowing]   = useState(true)
  const [chimeOn,   setChimeOn]   = useState(false)

  // Stable refs so the interval closure always reads current values
  const phaseRef  = useRef(0)
  const chimeRef  = useRef(false)
  useEffect(() => { chimeRef.current = chimeOn }, [chimeOn])

  // Fully synchronous — no async/await — so iOS keeps gesture trust
  function handleChimeToggle() {
    const next = !chimeOn
    if (next) unlockAudio()
    setChimeOn(next)
  }

  // Phase ticker — 4s per phase, matching CSS 16s keyframe
  useEffect(() => {
    const id = setInterval(() => {
      const next = (phaseRef.current + 1) % 4
      phaseRef.current = next

      // Fade out → update → fade in
      setShowing(false)
      setTimeout(() => {
        setPhaseIdx(next)
        setShowing(true)
        if (chimeRef.current) playChime(next)
      }, 200)
    }, 4000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="breath-wrap">

      {/* Animated circle */}
      <div className="breath-circle" />

      {/* Phase label */}
      <p className={`breath-phase${showing ? '' : ' breath-phase--hidden'}`}>
        {PHASES[phaseIdx]}
      </p>
      <p className="breath-counter">4 counts · box breathing</p>

      {/* Chime toggle */}
      <button
        className={`breath-chime-btn${chimeOn ? ' breath-chime-btn--on' : ''}`}
        onClick={handleChimeToggle}
        type="button"
        aria-label={chimeOn ? 'Turn chime off' : 'Turn chime on'}
      >
        {chimeOn
          ? <><Volume2 size={13} strokeWidth={2} /> Sound on</>
          : <><VolumeX size={13} strokeWidth={2} /> Sound off</>
        }
      </button>

    </div>
  )
}
