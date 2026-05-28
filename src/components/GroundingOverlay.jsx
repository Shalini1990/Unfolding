import { useState, useEffect, useRef } from 'react'

// ── 3-2-1 Sensory Grounding (F12) ──────────────────────────────
// Step 1 (8s): See  · Step 2 (8s): Hear  · Step 3 (8s): Feel
// Close  (4s): "You're here." — then auto-dismisses
// Tap anywhere to exit early at any point.
// Zero data footprint — nothing stored, nothing tracked.

const STEPS = [
  {
    label:    '3',
    text:     'Notice 3 things\nyou can see right now.',
    duration: 8000,
  },
  {
    label:    '2',
    text:     'Notice 2 things\nyou can hear.',
    duration: 8000,
  },
  {
    label:    '1',
    text:     'Notice 1 thing you can feel —\nthe ground under your feet,\nthe chair beneath you.',
    duration: 8000,
  },
  {
    label:    '·',
    text:     "You're here.",
    duration: 4000,
    isLast:   true,
  },
]

export default function GroundingOverlay({ onClose }) {
  const [stepIdx,  setStepIdx]  = useState(0)
  const [bodyShow, setBodyShow] = useState(true)
  const [exiting,  setExiting]  = useState(false)
  const closingRef = useRef(false)

  // Auto-advance or auto-close after each step's duration
  useEffect(() => {
    if (closingRef.current) return
    const id = setTimeout(() => {
      if (stepIdx < STEPS.length - 1) {
        crossfadeTo(stepIdx + 1)
      } else {
        doClose()
      }
    }, STEPS[stepIdx].duration)
    return () => clearTimeout(id)
  }, [stepIdx])

  function crossfadeTo(next) {
    setBodyShow(false)
    setTimeout(() => {
      setStepIdx(next)
      setBodyShow(true)
    }, 350)
  }

  function doClose() {
    if (closingRef.current) return
    closingRef.current = true
    setExiting(true)
    setTimeout(() => onClose(), 450)
  }

  const step = STEPS[stepIdx]

  return (
    <div
      className={`ground-overlay${exiting ? ' ground-overlay--out' : ''}`}
      onClick={doClose}
    >
      <div className="ground-inner">

        {/* Step dots — first 3 steps only
            Active dot is replaced by an SVG arc that fills over 8s.
            Remounting the SVG (via conditional render) restarts the animation. */}
        <div className="ground-dots">
          {[0, 1, 2].map(i => {
            const isActive = i === stepIdx && stepIdx < 3
            const isDone   = i < stepIdx
            return (
              <div key={i} className="ground-dot-wrap">
                {isActive ? (
                  // SVG mounts fresh on each step → animation always starts at 0
                  <svg
                    className="ground-arc-svg"
                    width="20" height="20"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    {/* faint track ring */}
                    <circle cx="10" cy="10" r="8" className="ground-arc-track" />
                    {/* filling arc — rotated so it starts at top */}
                    <circle
                      cx="10" cy="10" r="8"
                      className="ground-arc-fill"
                      transform="rotate(-90 10 10)"
                    />
                    {/* centre dot */}
                    <circle cx="10" cy="10" r="3" className="ground-arc-dot" />
                  </svg>
                ) : (
                  <span className={`ground-dot${isDone ? ' ground-dot--done' : ''}`} />
                )}
              </div>
            )
          })}
        </div>

        {/* Main text block — fades between steps */}
        <div className={`ground-body${bodyShow ? '' : ' ground-body--fade'}`}>
          <p className="ground-text" style={{ whiteSpace: 'pre-line' }}>
            {step.text}
          </p>
          <p className="ground-hint">
            {step.isLast ? "tap anywhere · you're done" : 'tap anywhere to exit'}
          </p>
        </div>

      </div>
    </div>
  )
}
