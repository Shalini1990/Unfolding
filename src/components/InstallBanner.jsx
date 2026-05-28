import { X, Download } from 'lucide-react'

const STORAGE_KEY = 'install_banner_dismissed'

/**
 * Compact install banner for Android / Chrome.
 * Shows once until the user dismisses or installs.
 *
 * Props:
 *   onInstall  — async fn that triggers the native install dialog
 *   onDismiss  — fn called when the user dismisses
 */
export default function InstallBanner({ onInstall, onDismiss }) {
  async function handleInstall() {
    const accepted = await onInstall()
    if (accepted) onDismiss()   // banner no longer needed after install
  }

  function handleDismiss() {
    localStorage.setItem(STORAGE_KEY, '1')
    onDismiss()
  }

  return (
    <div className="install-banner" role="banner">
      <span className="install-banner__icon" aria-hidden="true">
        <Download size={15} strokeWidth={2} />
      </span>
      <p className="install-banner__text">
        Add Unfolding to your home screen for the best experience.
      </p>
      <button
        className="install-banner__cta"
        onClick={handleInstall}
        type="button"
      >
        Install
      </button>
      <button
        className="install-banner__close"
        onClick={handleDismiss}
        type="button"
        aria-label="Dismiss"
      >
        <X size={13} strokeWidth={2.5} />
      </button>
    </div>
  )
}

/** Returns true if the banner has been permanently dismissed. */
export function isBannerDismissed() {
  return !!localStorage.getItem(STORAGE_KEY)
}
