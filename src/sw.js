import { clientsClaim, skipWaiting } from 'workbox-core'
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching'
import { registerRoute, NavigationRoute } from 'workbox-routing'
import { CacheFirst, NetworkFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'

// ── Activation ────────────────────────────────────────────────────
// Take over immediately so the first visit is fully SW-controlled.
skipWaiting()
clientsClaim()

// ── App shell precache ────────────────────────────────────────────
// VitePWA injects the manifest here; precacheAndRoute handles
// serving /index.html for all navigation requests (SPA pattern).
precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

// ── Navigation fallback ───────────────────────────────────────────
// Any navigation request that isn't in the precache manifest falls
// back to /index.html so React Router can take over.
const handler = createHandlerBoundToURL('/index.html')
const navRoute = new NavigationRoute(handler, {
  // Exclude the offline page itself — it has its own standalone HTML.
  denylist: [/\/offline\.html/],
})
registerRoute(navRoute)

// ── Runtime: fonts (cache-first, 1 year) ─────────────────────────
registerRoute(
  ({ url }) =>
    url.origin === 'https://fonts.googleapis.com' ||
    url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'fonts',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxAgeSeconds: 60 * 60 * 24 * 365 }),
    ],
  })
)

// ── Runtime: same-origin static assets (cache-first, 30 days) ────
registerRoute(
  ({ request, url }) =>
    url.origin === self.location.origin &&
    (request.destination === 'style' ||
      request.destination === 'script' ||
      request.destination === 'image' ||
      request.destination === 'font'),
  new CacheFirst({
    cacheName: 'static-assets',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 60 * 60 * 24 * 30,
      }),
    ],
  })
)

// NavigationRoute above already handles all SPA navigations and offline fallback.

// ── Notification click → deep-link navigation ─────────────────────
self.addEventListener('notificationclick', event => {
  event.notification.close()
  const url = event.notification.data?.url || '/'
  const origin = self.location.origin

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(list => {
        for (const client of list) {
          if (client.url.startsWith(origin) && 'focus' in client) {
            client.navigate(origin + url)
            return client.focus()
          }
        }
        if (clients.openWindow) return clients.openWindow(origin + url)
      })
  )
})

// ── Push event (future server-sent push) ─────────────────────────
self.addEventListener('push', event => {
  if (!event.data) return
  try {
    const { title, body, tag, url } = event.data.json()
    event.waitUntil(
      self.registration.showNotification(title, {
        body,
        tag,
        icon:  '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        data:  { url: url || '/' },
      })
    )
  } catch {}
})

// ── Broadcast new SW version to the page ─────────────────────────
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting()
})
