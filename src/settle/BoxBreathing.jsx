import { useState, useEffect, useRef } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

// ── 4-4-4-4 box breathing ──────────────────────────────────────
// Inhale 4s · Hold 4s · Exhale 4s · Hold 4s = 16s cycle
// CSS animation handles the visual; React state handles the label.
// Both start at mount → stay in sync for any reasonable session length.

const PHASES = ['Inhale', 'Hold', 'Exhale', 'Hold']

function playChime(phaseIdx) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc  = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    // Inhale → higher, Exhale → lower, Hold → mid
    const freqs = [528, 440, 396, 440]
    osc.frequency.value = freqs[phaseIdx]
    osc.type = 'sine'
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.06)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.75)
  } catch (_) { /* silently fail if AudioContext unavailable */ }
}

export default function BoxBreathing() {
  const [phaseIdx,  setPhaseIdx]  = useState(0)
  const [showing,   setShowing]   = useState(true)
  const [chimeOn,   setChimeOn]   = useState(false)

  // Stable refs so the interval closure always reads current values
  const phaseRef  = useRef(0)
  const chimeRef  = useRef(false)
  useEffect(() => { chimeRef.current = chimeOn }, [chimeOn])

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
        onClick={() => setChimeOn(v => !v)}
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
