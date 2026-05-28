import { useState, useEffect } from 'react'
import { isStandalone } from '../utils/pwa'

/**
 * Captures the browser's beforeinstallprompt event and exposes
 * a one-call helper to trigger the native install dialog.
 *
 * Returns:
 *   canInstall   — true when the deferred prompt is ready and app isn't installed
 *   isInstalled  — true once installed (standalone mode or appinstalled event)
 *   promptInstall() — shows the native install dialog; resolves to true if accepted
 */
export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstalled,    setIsInstalled]    = useState(() => isStandalone())

  useEffect(() => {
    function onBeforeInstall(e) {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    function onInstalled() {
      setIsInstalled(true)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled',         onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled',         onInstalled)
    }
  }, [])

  async function promptInstall() {
    if (!deferredPrompt) return false
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    setDeferredPrompt(null)
    return outcome === 'accepted'
  }

  return {
    canInstall:    !!deferredPrompt && !isInstalled,
    isInstalled,
    promptInstall,
  }
}
