import { useTheme } from '../hooks/useTheme'

export default function MeScreen() {
  const { theme, switchTheme } = useTheme()

  return (
    <div className="screen">
      <p className="screen__eyebrow">You</p>
      <h1 className="screen__title">Me</h1>
      <p className="screen__desc">
        Your north star, progress over time, accent colour, and personal
        settings will live here.
      </p>

      <div className="screen__card">
        <p className="screen__card-label">Coming soon</p>
        <p className="screen__card-value">
          North star · Weekly cartoon · Progress · Accent colour picker
        </p>
      </div>

      {/* Theme toggle — switches data-theme on <html> and persists to Dexie */}
      <div className="theme-picker">
        <p className="theme-picker__label">Theme</p>
        <div className="theme-picker__buttons">
          <button
            className={`theme-btn${theme === 'minimal' ? ' theme-btn--active' : ''}`}
            onClick={() => switchTheme('minimal')}
            type="button"
          >
            Minimal
          </button>
          <button
            className={`theme-btn${theme === 'playful' ? ' theme-btn--active' : ''}`}
            onClick={() => switchTheme('playful')}
            type="button"
          >
            Playful
          </button>
        </div>
      </div>
    </div>
  )
}
