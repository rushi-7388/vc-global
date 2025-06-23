// Service Worker for caching and offline support
const CACHE_NAME = 'vc-global-v1';
const STATIC_CACHE = 'vc-global-static-v1';
const DYNAMIC_CACHE = 'vc-global-dynamic-v1';

// Cache static assets
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/uploads/pic1.png',
  '/uploads/pic2.png',
  '/logo.png'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - implement caching strategy
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Cache API requests with network-first strategy
  if (url.pathname.includes('/rest/v1/')) {
    event.respondWith(
      caches.open(DYNAMIC_CACHE).then(cache => {
        return fetch(request).then(response => {
          // Cache successful responses
          if (response.status === 200) {
            cache.put(request, response.clone());
          }
          return response;
        }).catch(() => {
          // Return cached version if network fails
          return cache.match(request);
        });
      })
    );
    return;
  }

  // Cache static assets with cache-first strategy
  if (STATIC_ASSETS.some(asset => url.pathname.includes(asset))) {
    event.respondWith(
      caches.match(request).then(response => {
        return response || fetch(request);
      })
    );
    return;
  }

  // For other requests, use network-first
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request);
    })
  );
});
