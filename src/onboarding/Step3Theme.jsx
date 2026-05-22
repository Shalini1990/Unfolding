// The 6 Minimal accent presets shown as colour dots in the swatch
const MINIMAL_ACCENTS = ['#64748B', '#6B8F71', '#4F46E5', '#C2714F', '#78716C', '#BE8A9D']

function ThemeCard({ id, label, desc, selected, onSelect, children }) {
  return (
    <button
      className={`ob-theme-card${selected ? ' ob-theme-card--selected' : ''}`}
      onClick={() => onSelect(id)}
      type="button"
      aria-pressed={selected}
    >
      <div className="ob-theme-card__swatch">{children}</div>
      <div className="ob-theme-card__body">
        <div className="ob-theme-card__label">{label}</div>
        <div className="ob-theme-card__desc">{desc}</div>
        {selected && <span className="ob-check" aria-hidden="true">✓</span>}
      </div>
    </button>
  )
}

export default function Step3Theme({ theme, onThemeSelect, next }) {
  return (
    <div className="ob-screen">
      <div className="ob-content">
        <h2 className="ob-title">How do you like to feel?</h2>
        <p className="ob-subtitle">You can always change this later.</p>

        <div className="ob-theme-cards">
          <ThemeCard
            id="minimal"
            label="Minimal"
            desc="Clean, calm, focused"
            selected={theme === 'minimal'}
            onSelect={onThemeSelect}
          >
            {/* Hardcoded white bg — always shows Minimal preview regardless of active theme */}
            <div className="ob-swatch-minimal">
              <div className="ob-swatch-dots">
                {MINIMAL_ACCENTS.map(c => (
                  <span key={c} className="ob-swatch-dot" style={{ backgroundColor: c }} />
                ))}
              </div>
              <span className="ob-swatch-sample ob-swatch-sample--tight">Good morning</span>
            </div>
          </ThemeCard>

          <ThemeCard
            id="playful"
            label="Playful"
            desc="Warm, joyful, bouncy"
            selected={theme === 'playful'}
            onSelect={onThemeSelect}
          >
            {/* Hardcoded warm bg — always shows Playful preview */}
            <div className="ob-swatch-playful">
              <div className="ob-swatch-warm-circle" />
              <span className="ob-swatch-sample ob-swatch-sample--loose">Good morning</span>
            </div>
          </ThemeCard>
        </div>
      </div>

      <div className="ob-footer">
        <button className="ob-cta" onClick={next} type="button">
          This one
        </button>
      </div>
    </div>
  )
}
