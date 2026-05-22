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
      </div>
      <div className="ob-footer">
        <button className="ob-cta" onClick={next} type="button">
          Let's begin
        </button>
      </div>
    </div>
  )
}
