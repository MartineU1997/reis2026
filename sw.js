/* Offline: de app en alle data worden bij de eerste keer opgeslagen. Met internet wordt op de achtergrond bijgewerkt.
   Kaarttegels die je bekijkt worden apart bewaard, zodat die stukken kaart ook offline werken. */
const CACHE = 'trip-20261104165620';
const TILES = 'tiles-v1';
const FILES = ['./', 'index.html', 'styles.css', 'app.js', 'config.js', 'data.enc.json', 'manifest.webmanifest', 'icons.svg',
  'vendor/leaflet.js', 'vendor/leaflet.css', 'fonts/jakarta.woff2', 'geo/countries.json',
  'img/buenosaires.webp', 'img/chalten.webp', 'img/calafate.webp', 'img/natales.webp', 'img/paine.webp', 'img/mendoza.webp', 'img/uco.webp',
  'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' })))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE && k !== TILES).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
async function tile(req) {
  const c = await caches.open(TILES);
  const hit = await c.match(req);
  if (hit) return hit;
  try {
    const r = await fetch(req);
    if (r.ok || r.type === 'opaque') {
      c.put(req, r.clone());
      c.keys().then(ks => { if (ks.length > 3000) ks.slice(0, 300).forEach(k => c.delete(k)); });
    }
    return r;
  } catch { return new Response('', { status: 504 }); }
}
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET') return;
  if (url.hostname === 'tile.openstreetmap.org') { e.respondWith(tile(req)); return; }
  if (url.origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(req, { ignoreSearch: true });
    const fresh = fetch(req, { cache: 'no-cache' }).then(r => { if (r.ok) c.put(req, r.clone()); return r; }).catch(() => null);
    return hit || (await fresh) || c.match('index.html');
  }));
});
