const CACHE_NAME = 'merikamai-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/css/home.css',
  '/assets/css/game-base.css',
  '/assets/js/home.js',
  '/common/storage.js',
  '/games/skyrise/index.html',
  '/games/one-percent/index.html',
  '/games/survivor-x/index.html',
  '/games/clutch-x/index.html',
  '/games/legend-run/index.html',
  '/pages/about.html',
  '/pages/privacy.html',
  '/pages/terms.html',
  '/pages/disclaimer.html',
  '/pages/contact.html',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match('/index.html'));
    })
  );
});
