import { useState } from 'react'
import { Check } from 'lucide-react'
import { FEATURE_META } from '../context/FeaturesContext'

const SPACE_DEPS = new Set(['kind_words', 'figure_it_out'])
const SPACE_DEP_LABELS = {
  kind_words:    'Kind words',
  figure_it_out: "Let's figure it out",
}

export default function Step6Features({ features, onToggleFeature, next }) {
  const [nudge, setNudge] = useState(null)

  function handleTap(id) {
    if (SPACE_DEPS.has(id) && !features.includes(id) && !features.includes('space')) {
      setNudge(id)
      setTimeout(() => setNudge(null), 3000)
      return
    }
    onToggleFeature(id)
  }

  return (
    <div className="ob-screen ob-screen--features">
      <div className="ob-features-header">
        <h2 className="ob-title">What would you like?</h2>
        <p className="ob-sub">Pick what feels right. You can change this any time in settings.</p>
      </div>

      <div className="ob-features-list">
        {FEATURE_META.map(f => {
          const on = features.includes(f.id)
          return (
            <button
              key={f.id}
              className={`ob-feature-row${on ? ' ob-feature-row--on' : ''}`}
              onClick={() => handleTap(f.id)}
              type="button"
            >
              <span className={`ob-feature-row__check${on ? ' ob-feature-row__check--on' : ''}`}>
                {on && <Check size={11} strokeWidth={3} />}
              </span>
              <span className="ob-feature-row__text">
                <span className="ob-feature-row__label">{f.label}</span>
                <span className="ob-feature-row__desc">{f.desc}</span>
              </span>
            </button>
          )
        })}
        {nudge && (
          <p className="ob-feature-nudge">
            {SPACE_DEP_LABELS[nudge]} lives inside Your space — enable Your space first.
          </p>
        )}
      </div>

      <div className="ob-footer">
        <button className="ob-cta" onClick={next} type="button">
          Continue
        </button>
      </div>
    </div>
  )
}
