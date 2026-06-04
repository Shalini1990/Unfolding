import { useState, useEffect, useRef, useMemo } from 'react'

// ── 3-2-1 Sensory Grounding (F12) ──────────────────────────────
// Duration chips at the top let the user change the step length
// at any time. Changing it resets to step 1 with the new duration.
// Last choice is saved to localStorage.

const DURATION_OPTIONS = [5, 8, 12, 20]
const DEFAULT_SECS     = 12
const STORAGE_KEY      = 'grounding_step_secs'

function buildSteps(secs) {
  const ms = secs * 1000
  return [
    { text: 'Notice 3 things\nyou can see right now.',                                             duration: ms  },
    { text: 'Notice 2 things\nyou can hear.',                                                      duration: ms  },
    { text: 'Notice 1 thing you can feel —\nthe ground under your feet,\nthe chair beneath you.', duration: ms  },
    { text: "You're here.",                                                                         duration: 4000, isLast: true },
  ]
}

export default function GroundingOverlay({ onClose }) {
  const saved    = parseInt(localStorage.getItem(STORAGE_KEY) || String(DEFAULT_SECS), 10)
  const initSecs = DURATION_OPTIONS.includes(saved) ? saved : DEFAULT_SECS

  const [stepSecs, setStepSecs] = useState(initSecs)
  const [stepIdx,  setStepIdx]  = useState(0)
  const [arcKey,   setArcKey]   = useState(0)    // remounts arc SVG when duration changes
  const [bodyShow, setBodyShow] = useState(true)
  const [exiting,  setExiting]  = useState(false)
  const closingRef = useRef(false)

  const steps = useMemo(() => buildSteps(stepSecs), [stepSecs])

  // Auto-advance or auto-close after each step's duration
  useEffect(() => {
    if (closingRef.current) return
    const id = setTimeout(() => {
      if (stepIdx < steps.length - 1) {
        crossfadeTo(stepIdx + 1)
      } else {
        doClose()
      }
    }, steps[stepIdx].duration)
    return () => clearTimeout(id)
  }, [stepIdx, steps])  // eslint-disable-line react-hooks/exhaustive-deps

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

  function handleDurationChange(secs) {
    localStorage.setItem(STORAGE_KEY, String(secs))
    setStepSecs(secs)
    setStepIdx(0)
    setArcKey(k => k + 1)
    setBodyShow(true)
  }

  const step = steps[stepIdx]

  return (
    <div
      className={`ground-overlay${exiting ? ' ground-overlay--out' : ''}`}
      onClick={doClose}
    >
      <div className="ground-inner">

        {/* Duration chips — stop propagation so tapping them doesn't close */}
        <div className="ground-duration" onClick={e => e.stopPropagation()}>
          {DURATION_OPTIONS.map(d => (
            <button
              key={d}
              className={`ground-dur-chip${stepSecs === d ? ' ground-dur-chip--active' : ''}`}
              onClick={() => handleDurationChange(d)}
              type="button"
            >
              {d}s
            </button>
          ))}
        </div>

        {/* Step dots */}
        <div className="ground-dots">
          {[0, 1, 2].map(i => {
            const isActive = i === stepIdx && stepIdx < 3
            const isDone   = i < stepIdx
            return (
              <div key={i} className="ground-dot-wrap">
                {isActive ? (
                  <svg
                    key={arcKey}
                    className="ground-arc-svg"
                    width="20" height="20"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <circle cx="10" cy="10" r="8" className="ground-arc-track" />
                    <circle
                      cx="10" cy="10" r="8"
                      className="ground-arc-fill"
                      transform="rotate(-90 10 10)"
                      style={{ animationDuration: `${stepSecs}s` }}
                    />
                    <circle cx="10" cy="10" r="3" className="ground-arc-dot" />
                  </svg>
                ) : (
                  <span className={`ground-dot${isDone ? ' ground-dot--done' : ''}`} />
                )}
              </div>
            )
          })}
        </div>

        {/* Main text */}
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
