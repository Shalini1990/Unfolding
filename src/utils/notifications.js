/**
 * Notification scheduler — local-first, no server required.
 *
 * On each app open we:
 *   1. Load the user's notification settings from IndexedDB.
 *   2. Clear any pending timers from this session.
 *   3. Set new setTimeout calls for every notification whose time
 *      hasn't passed yet today.
 *   4. At fire time, re-check the DB to suppress if ritual is done.
 *
 * Notifications are shown via `registration.showNotification()` so
 * the service-worker's `notificationclick` handler can deep-link.
 */

import db from '../db/db'

// ── In-memory timer handles ───────────────────────────────────────
const _timers = {}

// ── Low-level show ────────────────────────────────────────────────
async function _show(title, body, tag, url) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return
  try {
    const reg = await navigator.serviceWorker?.ready
    if (reg?.showNotification) {
      await reg.showNotification(title, {
        body,
        tag,
        icon:         '/icons/icon-192.png',
        badge:        '/icons/icon-192.png',
        renotify:     false,
        requireInteraction: false,
        data: { url },
      })
    } else {
      // Fallback when no SW (dev mode)
      new Notification(title, { body, tag, icon: '/icons/icon-192.png' })
    }
  } catch (err) {
    console.warn('[notif]', err)
  }
}

// ── Parse "HH:MM" into today's Date ──────────────────────────────
function _todayAt(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  const d = new Date()
  d.setHours(h, m, 0, 0)
  return d
}

// ── Load settings from DB ─────────────────────────────────────────
export async function loadNotifSettings() {
  const [enabled, morning, evening] = await Promise.all([
    db.settings.where('key').equals('notifications_enabled').first(),
    db.settings.where('key').equals('notification_morning').first(),
    db.settings.where('key').equals('notification_evening').first(),
  ])
  return {
    enabled: !!enabled?.value,
    morning: morning?.value  || '08:00',
    evening: evening?.value  || '20:00',
  }
}

// ── Permission helpers ────────────────────────────────────────────
export function getPermission() {
  if (!('Notification' in window)) return 'unsupported'
  return Notification.permission  // 'default' | 'granted' | 'denied'
}

export async function requestPermission() {
  if (!('Notification' in window)) return 'unsupported'
  return Notification.requestPermission()
}

// ── Main scheduler — call on every app foreground ─────────────────
export async function scheduleDay() {
  // Bail fast if notifications not available / permitted
  if (!('Notification' in window) || Notification.permission !== 'granted') return

  const settings = await loadNotifSettings()
  if (!settings.enabled) return

  // Cancel previous timers
  Object.values(_timers).forEach(id => clearTimeout(id))
  Object.keys(_timers).forEach(k => delete _timers[k])

  const now   = new Date()
  const today = now.toISOString().slice(0, 10)

  // ── Morning ritual ─────────────────────────────────────────────
  const morningAt = _todayAt(settings.morning)
  if (morningAt > now) {
    _timers.morning = setTimeout(async () => {
      const rec = await db.daily_intentions.where('date').equals(today).first()
      if (!rec?.intentions_set) {
        _show(
          'Good morning.',
          'Your day is ready.',
          'morning-ritual',
          '/home'
        )
      }
    }, morningAt - now)
  }

  // ── Evening ritual ─────────────────────────────────────────────
  const eveningAt = _todayAt(settings.evening)
  if (eveningAt > now) {
    _timers.evening = setTimeout(async () => {
      const rec = await db.reflection_entries.where('date').equals(today).first()
      if (!rec) {
        const isSunday = new Date().getDay() === 0
        const body = isSunday
          ? 'Sunday reflection — someone came to mind this week?'
          : 'How was your day?'
        _show('Evening reflection.', body, 'evening-ritual', '/evening')
      }
    }, eveningAt - now)
  }

  // ── Monthly site-data reminder ─────────────────────────────────
  // Fires once a month, piggybacking on the morning time slot
  const lastMonthly = localStorage.getItem('notif_monthly_last')
  const cutoff = new Date()
  cutoff.setMonth(cutoff.getMonth() - 1)
  const isDue = !lastMonthly || new Date(lastMonthly) < cutoff

  if (isDue) {
    // Use morning slot if still in future, else evening slot, else skip today
    const targetAt = morningAt > now ? morningAt : eveningAt > now ? eveningAt : null
    if (targetAt) {
      // Add a 2-minute offset so it follows (not overlaps) the ritual notification
      _timers.monthly = setTimeout(() => {
        _show(
          'A quick reminder.',
          'Your entries live on this device. Export a backup anytime — Me → Your Privacy.',
          'site-data-reminder',
          '/me'
        )
        localStorage.setItem('notif_monthly_last', new Date().toISOString())
      }, targetAt - now + 2 * 60 * 1000)
    }
  }
}

// ── Called when user saves new notification settings ──────────────
export async function saveNotifSettings({ enabled, morning, evening }) {
  async function upsert(key, value) {
    const rec = await db.settings.where('key').equals(key).first()
    if (rec) await db.settings.update(rec.id, { value })
    else      await db.settings.add({ key, value })
  }
  await Promise.all([
    upsert('notifications_enabled', enabled),
    upsert('notification_morning',  morning),
    upsert('notification_evening',  evening),
  ])
  // Reschedule with new settings
  await scheduleDay()
}
