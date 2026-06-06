import { useState } from 'react'
import { X, Sun, Zap, Leaf, Moon } from 'lucide-react'

// ── First-run feature walkthrough ──────────────────────────────
// Shows once, as a bottom sheet over the home screen.
// Dismissed state persisted to localStorage.

const STORAGE_KEY = 'first_run_guide_v1'

export function shouldShowGuide() {
  return !localStorage.getItem(STORAGE_KEY)
}

const SLIDES = [
  {
    Icon: Sun,
    title: 'Your morning ritual',
    body: 'Each day starts here. Write three small intentions — things you want to bring your attention to today. Check them off as you go.',
  },
  {
    Icon: Zap,
    title: 'Little sparks',
    body: 'Each day brings a Spark — a tiny curious act to try. And Your Space is always there to park a thought, release something weighing on you, or think something through.',
  },
  {
    Icon: Leaf,
    title: 'Park it or let it go',
    body: "Thoughts that don’t belong in your day can live in Your Space. Save them to revisit, or write them into the dark and watch them disappear.",
  },
  {
    Icon: Moon,
    title: 'End the day gently',
    body: "After 5pm the app shifts to evening mode — a few quiet prompts to close the day with intention. That's the whole loop.",
  },
]

export default function FirstRunGuide({ onClose }) {
  const [idx,     setIdx]     = useState(0)
  const [exiting, setExiting] = useState(false)

  const isLast = idx === SLIDES.length - 1
  const { Icon, title, body } = SLIDES[idx]

  function close() {
    localStorage.setItem(STORAGE_KEY, '1')
    setExiting(true)
    setTimeout(onClose, 380)
  }

  function next() {
    if (isLast) close()
    else setIdx(i => i + 1)
  }

  return (
    <div
      className={`frg-overlay${exiting ? ' frg-overlay--out' : ''}`}
      onClick={close}
    >
      <div className="frg-sheet" onClick={e => e.stopPropagation()}>

        {/* Close */}
        <button className="frg-close" onClick={close} type="button" aria-label="Close guide">
          <X size={16} strokeWidth={2.5} />
        </button>

        {/* Slide content */}
        <div className="frg-slide" key={idx}>
          <div className="frg-icon-wrap">
            <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
          </div>
          <h2 className="frg-title">{title}</h2>
          <p className="frg-body">{body}</p>
        </div>

        {/* Progress dots */}
        <div className="frg-dots" aria-hidden="true">
          {SLIDES.map((_, i) => (
            <span key={i} className={`frg-dot${i === idx ? ' frg-dot--active' : ''}`} />
          ))}
        </div>

        {/* Action */}
        <button className="frg-cta" onClick={next} type="button">
          {isLast ? "Got it, let's go" : 'Next'}
        </button>

      </div>
    </div>
  )
}
