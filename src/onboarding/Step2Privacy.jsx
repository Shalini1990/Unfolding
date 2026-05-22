import { Lock } from 'lucide-react'

const PRIVACY_POINTS = [
  'Everything you write stays on this device only.',
  'We cannot see it. Nobody can.',
  "Don't clear your browser's site data — it will delete your entries.",
  'You can export everything anytime as a backup.',
]

export default function Step2Privacy({ next }) {
  return (
    <div className="ob-screen">
      <div className="ob-content">
        <div className="ob-icon-wrap">
          <Lock size={24} strokeWidth={1.5} aria-hidden="true" />
        </div>
        <h2 className="ob-title">Your words, yours alone.</h2>
        <ul className="ob-privacy-list">
          {PRIVACY_POINTS.map(p => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
      <div className="ob-footer">
        <button className="ob-cta" onClick={next} type="button">
          Got it
        </button>
      </div>
    </div>
  )
}
