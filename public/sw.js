// D-Santé Service Worker - Cache & Offline-First Resiliency
const CACHE_NAME = 'd-sante-v1'
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/triage',
  '/consultations',
  '/manifest.json',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Failed to precache some static assets:', err)
      })
    })
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key)
          }
        })
      )
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  // Only handle GET requests for navigations and static assets
  if (event.request.method !== 'GET') return

  const url = new URL(event.request.url)

  // Bypass API and auth routes
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/auth')) {
    return
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Cache successful page/asset responses
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
        }
        return networkResponse
      })
      .catch(() => {
        // Fallback to cache when offline
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse
          // Return generic offline page if navigation
          if (event.request.mode === 'navigate') {
            return caches.match('/dashboard')
          }
        })
      })
  )
})
