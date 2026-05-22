import { Sun } from 'lucide-react'

export default function Step6Ready({ theme, onComplete }) {
  return (
    <div className="ob-screen ob-screen--ready">
      <div className="ob-ready-graphic">
        <Sun
          size={theme === 'playful' ? 32 : 28}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </div>
      <div className="ob-ready-text">
        <h2 className="ob-title ob-title--hero">You're all set.</h2>
        <p className="ob-tagline">Unfolding starts now.</p>
      </div>
      <div className="ob-footer">
        <button className="ob-cta" onClick={onComplete} type="button">
          Open Unfolding
        </button>
      </div>
    </div>
  )
}
