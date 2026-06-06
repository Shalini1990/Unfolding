import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, ArrowRight } from 'lucide-react'

// ── First-run contextual tour ──────────────────────────────────────
// Navigates to each feature, highlights the real element with a
// glowing frame, then shows a positioned callout with an arrow.

export const TOUR_KEY = 'first_run_guide_v1'
export const shouldShowTour = () => !localStorage.getItem(TOUR_KEY)

const delay = ms => new Promise(r => setTimeout(r, ms))
const CALLOUT_H = 230   // approximate max callout height (px)
const MARGIN    = 14    // gap between target and callout

function buildSteps(features) {
  return [
    {
      id: 'intentions', path: '/home', target: '[data-tour="intentions"]',
      title: 'Your morning ritual',
      body: 'Each morning, write three small intentions — things you want to bring attention to today. Tap to tick them off as you go.',
    },
    features.includes('spark') && {
      id: 'spark', path: '/home', target: '[data-tour="spark"]',
      title: 'Your daily Spark',
      body: "A small, curious act to try each day. Shuffle for something different, or mark it done when you're finished.",
    },
    {
      id: 'easel', path: '/home', target: '[data-tour="easel"]',
      title: 'Your week, illustrated',
      body: 'Tap the easel each day to watch your week fill with colour — a patch blooms for every day that passes. Go ahead, tap it.',
      passthrough: true,   // let taps reach the real button
      autoClick: true,     // open the cartoon automatically to show the animation
      radius: 50,
    },
    {
      id: 'evening', path: '/home', target: '[data-tour="evening"]',
      title: 'Evening ritual',
      body: "After 5pm, home shifts to evening mode — a gentle prompt to reflect on how the day went. A quiet way to close out.",
      optional: true,      // card only renders in the evening; show callout anyway
    },
    features.includes('space') && {
      id: 'parking', path: '/space', target: '[data-tour="parking-lot"]',
      title: 'Park it',
      body: "Got a thought that keeps swirling? Park it here — save it, give it a tag, and come back when you're ready to think it through.",
    },
    features.includes('space') && features.includes('kind_words') && {
      id: 'kind-words', path: '/space', target: '[data-tour="kind-words"]',
      title: 'Kind Words jar',
      body: "Collect kind words — things someone said to you, or things you want to remember. Open the jar on a hard day.",
    },
    features.includes('space') && {
      id: 'let-it-out', path: '/space', target: '[data-tour="let-it-out"]',
      title: 'Let it out',
      body: "Write something into the dark and watch it disappear. Nothing is saved, nothing is judged. Just release.",
      beforeClick: '[data-tour="release-door"]',  // switch the door before measuring
    },
    features.includes('figure_it_out') && {
      id: 'figure-it-out', path: '/space', target: '[data-tour="parking-lot"]',
      title: "Let's figure it out",
      body: "When a parked thought needs more than sitting with — open it and tap 'Let's figure it out'. An AI thinking partner helps you untangle, decide, or get unstuck.",
      beforeClick: '[data-tour="park-door"]',  // switch back to park door after let-it-out step
    },
    features.includes('settle') && {
      id: 'settle', path: '/settle', target: '[data-tour="settle"]',
      title: 'Settle',
      body: "When you need to slow down — breathe along with the box, or fill in colours mindlessly. Nothing to achieve. Just be.",
    },
    features.includes('grounding') && {
      id: 'grounding', path: '/home', target: '[data-tour="grounding"]',
      title: 'Your reset button',
      body: 'Press this any time you need a moment. It walks you through a 3-2-1 grounding exercise to bring you back to the present.',
      radius: 50,
    },
  ].filter(Boolean)
}

export default function Tour({ features, onDone }) {
  const navigate = useNavigate()
  const steps    = buildSteps(features)

  const [stepIdx, setStepIdx] = useState(0)
  const [frame,   setFrame]   = useState(null)    // { top, left, width, height }
  const [cStyle,  setCStyle]  = useState(null)    // callout fixed position style
  const [cSide,   setCSide]   = useState('below') // 'below' | 'above'
  const [ready,   setReady]   = useState(false)
  const [exiting, setExiting] = useState(false)

  const step   = steps[stepIdx]
  const isLast = stepIdx === steps.length - 1

  const positionStep = useCallback(async (s) => {
    setReady(false)
    setFrame(null)
    setCStyle(null)

    navigate(s.path)
    await delay(480)

    // Before-click: e.g. switch the Space screen to a different door
    if (s.beforeClick) {
      const trigger = document.querySelector(s.beforeClick)
      trigger?.click()
      await delay(420)
    }

    const el = document.querySelector(s.target)

    if (!el) {
      if (s.optional) {
        // Target not present (e.g. evening card outside evening hours) —
        // show a centred callout with no highlight frame
        setCStyle({ top: Math.round(window.innerHeight * 0.38) })
        setCSide('below')
        setReady(true)
      }
      return
    }

    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    await delay(680)

    const rect = el.getBoundingClientRect()
    const vH   = window.innerHeight

    setFrame({ top: rect.top, left: rect.left, width: rect.width, height: rect.height })

    // Decide: place callout below or above, clamped to viewport
    const spaceBelow = vH - rect.bottom - MARGIN
    const spaceAbove = rect.top  - MARGIN
    const placeAbove = spaceAbove > spaceBelow && spaceBelow < CALLOUT_H

    if (placeAbove) {
      const bottom = vH - rect.top + MARGIN
      setCStyle({ bottom: Math.max(bottom, MARGIN) })
      setCSide('above')
    } else {
      const top = rect.bottom + MARGIN
      // Clamp so callout doesn't overflow the bottom
      setCStyle({ top: Math.min(top, vH - CALLOUT_H - MARGIN) })
      setCSide('below')
    }

    setReady(true)

    // Auto-click (easel → opens the cartoon colouring animation)
    if (s.autoClick) {
      await delay(280)
      el.click()
    }
  }, [navigate])

  useEffect(() => {
    if (step) positionStep(step)
  }, [stepIdx])  // eslint-disable-line react-hooks/exhaustive-deps

  function advance() {
    if (isLast) finish()
    else setStepIdx(i => i + 1)
  }

  function finish() {
    localStorage.setItem(TOUR_KEY, '1')
    setExiting(true)
    setTimeout(onDone, 360)
  }

  if (!step) return null

  return (
    <div
      className={[
        'tour-overlay',
        step.passthrough  ? 'tour-overlay--passthrough' : '',
        exiting           ? 'tour-overlay--out'          : '',
      ].filter(Boolean).join(' ')}
    >
      {/* Highlight frame around the target element */}
      {frame && ready && (
        <div
          className="tour-frame"
          style={{
            top:          frame.top,
            left:         frame.left,
            width:        frame.width,
            height:       frame.height,
            borderRadius: step.radius ?? 14,
          }}
        />
      )}

      {/* Callout card */}
      {ready && cStyle && (
        <div
          className={`tour-callout tour-callout--${cSide}`}
          style={cStyle}
          onClick={e => e.stopPropagation()}
        >
          {/* Arrow tip pointing toward the highlighted element */}
          {frame && <div className={`tour-arrow tour-arrow--${cSide === 'below' ? 'up' : 'down'}`} />}

          <div className="tour-callout__body-wrap">
            <div className="tour-callout__top-row">
              <span className="tour-callout__count">{stepIdx + 1}&thinsp;/&thinsp;{steps.length}</span>
              <button className="tour-callout__close" onClick={finish} type="button" aria-label="Skip tour">
                <X size={13} strokeWidth={2.5} />
              </button>
            </div>

            <h3 className="tour-callout__title">{step.title}</h3>
            <p className="tour-callout__desc">{step.body}</p>

            <button className="tour-callout__next" onClick={advance} type="button">
              {isLast ? 'Done' : 'Next'}
              {!isLast && <ArrowRight size={13} strokeWidth={2.5} />}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
