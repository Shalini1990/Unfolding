/**
 * PWA environment detection helpers.
 */

/** True when running as an installed PWA (standalone display mode). */
export function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // iOS Safari sets this to true when opened from home screen
    window.navigator.standalone === true
  )
}

/** True on any iOS device. */
export function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    // iPad on iOS 13+ reports as "Macintosh" but has touch
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

/** True when running in iOS Safari specifically (not Chrome/Firefox on iOS). */
export function isIOSSafari() {
  if (!isIOS()) return false
  const ua = navigator.userAgent
  // CriOS = Chrome on iOS, FxiOS = Firefox on iOS, OPiOS = Opera
  return /safari/i.test(ua) && !/crios|fxios|opios|edgios/i.test(ua)
}
