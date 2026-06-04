import { useState, useEffect, useRef, useMemo } from 'react'

// ── 3-2-1 Sensory Grounding (F12) ──────────────────────────────
// Pre-start: user picks how long each step lasts (5 / 8 / 12 / 20 s).
// Last choice is saved to localStorage so it's remembered next time.
// Step 1–3 use the chosen duration; the closing "You're here." is 4 s.
// Tap anywhere to exit early at any point.

const DURATION_OPTIONS = [5, 8, 12, 20]   // seconds per step
const DEFAULT_SECS     = 8
const STORAGE_KEY      = 'grounding_step_secs'

function buildSteps(secs) {
  const ms = secs * 1000
  return [
    {
      label:    '3',
      text:     'Notice 3 things\nyou can see right now.',
      duration: ms,
    },
    {
      label:    '2',
      text:     'Notice 2 things\nyou can hear.',
      duration: ms,
    },
    {
      label:    '1',
      text:     'Notice 1 thing you can feel —\nthe ground under your feet,\nthe chair beneath you.',
      duration: ms,
    },
    {
      label:    '·',
      text:     "You're here.",
      duration: 4000,
      isLast:   true,
    },
  ]
}

// ── Pre-start duration picker ─────────────────────────────────────
function PreStart({ onBegin }) {
  const saved = parseInt(localStorage.getItem(STORAGE_KEY) || String(DEFAULT_SECS), 10)
  const [secs, setSecs] = useState(
    DURATION_OPTIONS.includes(saved) ? saved : DEFAULT_SECS
  )

  function handleBegin() {
    localStorage.setItem(STORAGE_KEY, String(secs))
    onBegin(secs)
  }

  return (
    <div className="ground-prestart" onClick={e => e.stopPropagation()}>
      <p className="ground-prestart__label">How long per step?</p>
      <div className="ground-prestart__chips">
        {DURATION_OPTIONS.map(d => (
          <button
            key={d}
            className={`ground-prestart__chip${secs === d ? ' ground-prestart__chip--active' : ''}`}
            onClick={() => setSecs(d)}
            type="button"
          >
            {d}s
          </button>
        ))}
      </div>
      <button
        className="ground-prestart__begin"
        onClick={handleBegin}
        type="button"
      >
        Begin
      </button>
      <p className="ground-hint">tap anywhere to close</p>
    </div>
  )
}

// ── Main overlay ──────────────────────────────────────────────────
export default function GroundingOverlay({ onClose }) {
  const [stepSecs, setStepSecs] = useState(null)   // null = show pre-start
  const [stepIdx,  setStepIdx]  = useState(0)
  const [bodyShow, setBodyShow] = useState(true)
  const [exiting,  setExiting]  = useState(false)
  const closingRef = useRef(false)

  // Only build steps once stepSecs is chosen
  const steps = useMemo(() => stepSecs ? buildSteps(stepSecs) : null, [stepSecs])

  // Auto-advance or auto-close after each step's duration
  useEffect(() => {
    if (!steps || closingRef.current) return
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

  const step = steps?.[stepIdx]

  return (
    <div
      className={`ground-overlay${exiting ? ' ground-overlay--out' : ''}`}
      onClick={doClose}
    >
      <div className="ground-inner">

        {/* ── Pre-start picker ── */}
        {!stepSecs && (
          <PreStart onBegin={secs => { setStepSecs(secs); setStepIdx(0) }} />
        )}

        {/* ── Active grounding steps ── */}
        {stepSecs && step && (
          <>
            {/* Step dots */}
            <div className="ground-dots">
              {[0, 1, 2].map(i => {
                const isActive = i === stepIdx && stepIdx < 3
                const isDone   = i < stepIdx
                return (
                  <div key={i} className="ground-dot-wrap">
                    {isActive ? (
                      <svg
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
          </>
        )}

      </div>
    </div>
  )
}
