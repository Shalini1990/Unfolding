import { X } from 'lucide-react'

const STORAGE_KEY = 'ios_install_shown'

/**
 * Bottom-sheet explaining how to "Add to Home Screen" on iOS Safari.
 * Shows once, then never again (localStorage guard).
 *
 * Props:
 *   onClose — called when the user dismisses the sheet
 */
export default function IOSInstallSheet({ onClose }) {
  function handleClose() {
    localStorage.setItem(STORAGE_KEY, '1')
    onClose()
  }

  return (
    <>
      {/* Scrim */}
      <div className="ios-sheet-scrim" onClick={handleClose} aria-hidden="true" />

      {/* Sheet */}
      <div
        className="ios-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Add to Home Screen"
      >
        <div className="ios-sheet__handle" aria-hidden="true" />

        <button
          className="ios-sheet__close"
          onClick={handleClose}
          type="button"
          aria-label="Close"
        >
          <X size={16} strokeWidth={2} />
        </button>

        <div className="ios-sheet__icon-wrap" aria-hidden="true">
          {/* iOS Share icon */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
            <polyline points="16 6 12 2 8 6"/>
            <line x1="12" y1="2" x2="12" y2="15"/>
          </svg>
        </div>

        <h2 className="ios-sheet__title">Add to Home Screen</h2>
        <p className="ios-sheet__subtitle">
          Install Unfolding so it opens instantly, full-screen, any time.
        </p>

        <ol className="ios-sheet__steps">
          <li className="ios-sheet__step">
            <span className="ios-sheet__step-num">1</span>
            <span>
              Tap the{' '}
              <strong>Share</strong> button{' '}
              <span className="ios-sheet__share-icon" aria-label="share icon">
                {/* Inline share icon */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                  <polyline points="16 6 12 2 8 6"/>
                  <line x1="12" y1="2" x2="12" y2="15"/>
                </svg>
              </span>{' '}
              at the bottom of Safari.
            </span>
          </li>
          <li className="ios-sheet__step">
            <span className="ios-sheet__step-num">2</span>
            <span>
              Scroll down and tap{' '}
              <strong>Add to Home Screen</strong>.
            </span>
          </li>
          <li className="ios-sheet__step">
            <span className="ios-sheet__step-num">3</span>
            <span>Tap <strong>Add</strong> in the top-right corner.</span>
          </li>
        </ol>

        <button className="ios-sheet__done" onClick={handleClose} type="button">
          Done
        </button>
      </div>
    </>
  )
}

/** Returns true if the sheet has already been shown. */
export function isIOSSheetShown() {
  return !!localStorage.getItem(STORAGE_KEY)
}
