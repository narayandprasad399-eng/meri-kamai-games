const CACHE_NAME = 'merikamai-saas-v2';

// Sirf basic styling aur scripts cache karenge, HTML ya Games nahi!
const ASSETS = [
  '/',
  '/assets/css/game-base.css',
  '/common/storage.js'
];

// Install Event - Turant naya service worker active karne ke liye
self.addEventListener('install', e => {
  self.skipWaiting();
});

// Activate Event - Purane caches ko delete karne ke liye
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch Event - "Network First" Strategy (For Ad Revenue Protection)
self.addEventListener('fetch', e => {
  // GET requests ke alawa kuch handle mat karo
  if (e.request.method !== 'GET') return;

  e.respondWith(
    fetch(e.request)
      .then(response => {
        // Agar internet chal raha hai aur response thik hai, toh wahi return karo
        return response;
      })
      .catch(() => {
        // 🔴 Agar internet band hai (Offline mode)
        
        // Check karo ki kya user HTML page maang raha tha (like opening the app)
        if (e.request.headers.get('accept').includes('text/html')) {
          // Custom Offline Screen
          return new Response(
            `<!DOCTYPE html>
            <html lang="hi">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>No Internet - Meri Kamai</title>
              <style>
                body {
                  background: #05050a;
                  color: #f0f0ff;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                  margin: 0;
                  font-family: sans-serif;
                  text-align: center;
                  padding: 20px;
                }
                .icon { font-size: 60px; margin-bottom: 20px; filter: drop-shadow(0 0 10px rgba(255,107,0,0.5)); }
                h2 { margin: 0 0 10px 0; color: #ff6b00; letter-spacing: 1px; }
                p { color: #9090b0; line-height: 1.5; font-size: 14px; max-width: 300px; }
                .retry-btn {
                  margin-top: 30px;
                  background: linear-gradient(135deg, #ff6b00, #ff9500);
                  color: #000;
                  border: none;
                  padding: 14px 32px;
                  border-radius: 30px;
                  font-size: 16px;
                  font-weight: bold;
                  cursor: pointer;
                  box-shadow: 0 0 20px rgba(255,107,0,0.4);
                  transition: transform 0.2s;
                }
                .retry-btn:active { transform: scale(0.95); }
              </style>
            </head>
            <body>
              <div class="icon">📡</div>
              <h2>No Internet Connection</h2>
              <p>Games khelne aur rewards jeetne ke liye kripya Wi-Fi ya Mobile Data on karein.</p>
              <button class="retry-btn" onclick="window.location.reload()">Retry Now</button>
            </body>
            </html>`,
            { headers: { 'Content-Type': 'text/html' } }
          );
        }

        // Agar koi aur cheez (image/script) offline maangi gayi ho
        return new Response('', { status: 408, statusText: 'Request Timeout' });
      })
  );
});