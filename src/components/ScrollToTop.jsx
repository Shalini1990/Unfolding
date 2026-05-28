import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Resets the app-shell scroll position to 0 on every tab navigation. */
export default function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    const el = document.querySelector('.app-shell__main')
    if (el) el.scrollTop = 0
  }, [pathname])
  return null
}
