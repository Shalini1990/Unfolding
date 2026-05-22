import { useState, useEffect } from 'react'
import db from '../db/db'

export const THEMES = ['minimal', 'playful']
const STORAGE_KEY = 'unfolding-theme'

// Read the theme currently set on <html data-theme> — used as initial state
// so there is no flash between the inline script (index.html) and React mount.
function getInitialTheme() {
  const attr = document.documentElement.getAttribute('data-theme')
  return THEMES.includes(attr) ? attr : 'minimal'
}

// Exported so the onboarding flow can apply a theme without the full hook.
export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
  // Mirror to localStorage for flash-free reads in index.html inline script
  localStorage.setItem(STORAGE_KEY, theme)
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)

  // On mount: load from Dexie (source of truth) and reconcile
  useEffect(() => {
    db.settings
      .where('key')
      .equals('theme')
      .first()
      .then((record) => {
        if (record?.value && THEMES.includes(record.value)) {
          applyTheme(record.value)
          setTheme(record.value)
        }
      })
      .catch(() => {}) // silently ignore DB errors during boot
  }, [])

  async function switchTheme(newTheme) {
    if (!THEMES.includes(newTheme)) return

    applyTheme(newTheme)
    setTheme(newTheme)

    // Persist to Dexie
    try {
      const existing = await db.settings.where('key').equals('theme').first()
      if (existing) {
        await db.settings.update(existing.id, { value: newTheme })
      } else {
        await db.settings.add({ key: 'theme', value: newTheme })
      }
    } catch {
      // DB write failure is non-critical — localStorage already persisted it
    }
  }

  return { theme, switchTheme, themes: THEMES }
}
