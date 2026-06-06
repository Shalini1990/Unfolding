import { Sparkles } from 'lucide-react'

export default function Step1Welcome({ next }) {
  return (
    <div className="ob-screen ob-screen--welcome">
      <div className="ob-welcome-mark">
        <Sparkles size={26} strokeWidth={1.5} aria-hidden="true" />
      </div>
      <div className="ob-welcome-text">
        <h1 className="ob-title ob-title--hero">Unfolding</h1>
        <p className="ob-tagline">Your story, gradually.</p>

        <div className="ob-welcome-desc">
          <p>Unfolding is a quiet space to start and end your day with intention.</p>
          <p>It's for anyone who wants to show up for their day with more clarity and less noise.</p>
          <p>Each morning, you set three small intentions. Each evening, you reflect on how it went. In between, there's room to breathe, release what's weighing on you, and find small sparks of curiosity.</p>
          <p className="ob-welcome-desc__closing">No streaks. No scores. Just you, gently unfolding.</p>
        </div>
      </div>
      <div className="ob-footer">
        <button className="ob-cta" onClick={next} type="button">
          Let's begin
        </button>
      </div>
    </div>
  )
}
