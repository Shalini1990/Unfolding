import { useState, useEffect } from 'react'
import { Sun, Download } from 'lucide-react'
import { useInstallPrompt } from '../hooks/useInstallPrompt'
import { isIOSSafari, isStandalone } from '../utils/pwa'
import { isIOSSheetShown } from '../components/IOSInstallSheet'

export default function Step6Ready({ theme, onComplete }) {
  const { canInstall, promptInstall } = useInstallPrompt()
  const [showIOSHint, setShowIOSHint] = useState(false)
  const [installing, setInstalling] = useState(false)

  useEffect(() => {
    // Show iOS hint if in Safari and not yet installed
    if (isIOSSafari() && !isStandalone() && !isIOSSheetShown()) {
      setShowIOSHint(true)
    }
  }, [])

  async function handleInstall() {
    setInstalling(true)
    await promptInstall()
    setInstalling(false)
  }

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

        {/* Android/Chrome install prompt */}
        {canInstall && (
          <button
            className="ob-install-btn"
            onClick={handleInstall}
            disabled={installing}
            type="button"
          >
            <Download size={15} strokeWidth={2} />
            {installing ? 'Installing…' : 'Add to home screen'}
          </button>
        )}

        {/* iOS Safari hint */}
        {showIOSHint && (
          <div className="ob-ios-hint">
            <p className="ob-ios-hint__text">
              For the best experience, tap{' '}
              <svg
                className="ob-ios-hint__share"
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
                aria-label="Share"
              >
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                <polyline points="16 6 12 2 8 6"/>
                <line x1="12" y1="2" x2="12" y2="15"/>
              </svg>
              {' '}then <strong>Add to Home Screen</strong>.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
