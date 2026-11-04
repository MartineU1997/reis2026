/* Offline: de app en alle data worden bij de eerste keer opgeslagen. Met internet wordt op de achtergrond bijgewerkt.
   Kaarttegels die je bekijkt worden apart bewaard, zodat die stukken kaart ook offline werken. */
const CACHE = 'trip-20261104215212';
const TILES = 'tiles-v1';
const FILES = ["./","app.js","config.js","data.enc.json","features.js","fonts/jakarta.woff2","geo/countries.json","i18n.js","icons/icon-180.png","icons/icon-192.png","icons/icon-512.png","icons/icon-maskable-512.png","icons.svg","img/buenosaires.webp","img/calafate.webp","img/chalten.webp","img/mendoza.webp","img/natales.webp","img/paine.webp","img/uco.webp","index.html","manifest.webmanifest","photos/ba-bar-el-federal.webp","photos/ba-cafe-tortoni.webp","photos/ba-caminito-la-boca.webp","photos/ba-cementerio-de-la-recoleta.webp","photos/ba-don-julio.webp","photos/ba-el-ateneo-grand-splendid.webp","photos/ba-el-preferido-de-palermo.webp","photos/ba-jardi-n-japone-s.webp","photos/ba-plaza-de-mayo-casa-rosada.webp","photos/ba-reserva-ecolo-gica-costanera-sur.webp","photos/ba-san-telmo.webp","photos/ba_palacio_barolo_0.webp","photos/ba_palermo_soho_0.webp","photos/calafate-boottocht-upsala-spegazzini.webp","photos/calafate-glaciarium.webp","photos/calafate-perito-moreno-gletsjer.webp","photos/calafate_calafate_ijs_0.webp","photos/calafate_reserva_laguna_nimez_2.webp","photos/chalten-lago-del-desierto.webp","photos/chalten-laguna-capri.webp","photos/chalten-loma-del-pliegue-tumbado.webp","photos/chalten_laguna_de_los_tres_1.webp","photos/chalten_laguna_torre_1.webp","photos/chalten_mirador_de_los_c_ndores_1.webp","photos/mendoza-catena-zapata.webp","photos/mendoza-cerro-de-la-gloria.webp","photos/mendoza-paardrijden-met-asado.webp","photos/mendoza-termas-de-cacheuta.webp","photos/natales-cerro-dorotea.webp","photos/natales-costanera-monumento-al-viento.webp","photos/natales-cueva-del-milodo-n.webp","photos/natales-muelle-histo-rico.webp","photos/natales-santolla.webp","photos/natales_plaza_de_armas_1.webp","photos/paine-base-las-torres.webp","photos/paine-chileno.webp","photos/paine-hangbruggen-voorbij-grey.webp","photos/paine-lago-pehoe-per-catamaran.webp","photos/paine_franc_s_1.webp","photos/paine_grey_gletsjer_2.webp","photos/paine_mirador_brit_nico_0.webp","photos/paine_paine_grande_2.webp","photos/paine_salto_grande_1.webp","photos/uco-bodegas-salentein-killka.webp","photos/uco-manzano-histo-rico.webp","photos/uco-zonsondergang-bij-alpasio-n.webp","styles.css","vendor/leaflet.css","vendor/leaflet.js"];
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
