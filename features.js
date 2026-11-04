'use strict';
/* Extra functies: check-ins & dagboek (gedeeld met de volg-pagina), uitgaven, valuta, "Vraag de app",
   agenda-export, reis in cijfers, delen met familie, installatiehulp. Gebruikt de globale helpers uit app.js. */

const FT_STR = {
  nl: {
    checkin: 'Check-in', checkinSub: 'Deel waar jullie zijn', journal: 'Dagboek', journalSub: 'Check-ins, foto\'s en berichtjes', expenses: 'Uitgaven', expensesSub: 'Wie betaalde wat', currency: 'Valuta', currencySub: 'Pesos, dollars, euro\'s', ask: 'Vraag', askSub: 'Vraag het de app', stats: 'Reis in cijfers', statsSub: 'Kilometers en meer', share: 'Delen met familie', shareSub: 'Link voor thuisblijvers', calendar: 'In je agenda', calendarSub: 'Alle vluchten, bussen en hotels',
    ciTitle: 'Deel waar jullie nu zijn', ciMsg: 'Wat doen jullie? Hoe is het?', ciLoc: 'Locatie meesturen', ciPhoto: 'Foto toevoegen', ciChange: 'Andere foto', ciPost: 'Check-in plaatsen', ciPosting: 'Bezig…', ciQueued: 'Opgeslagen. Wordt verstuurd zodra er bereik is.', ciPosted: 'Geplaatst! Familie ziet dit op de volg-pagina.', ciNoLoc: 'Locatie niet beschikbaar, check-in zonder locatie.', ciEmpty: 'Nog geen check-ins. De eerste komt vast uit Buenos Aires!', ciDelete: 'Verwijder', ciTooBig: 'Deze check-in kon niet worden verstuurd. Probeer een andere foto.', ciVisible: 'Zichtbaar op de volg-pagina voor familie.', ciNoSync: 'Delen werkt alleen met synchronisatie aan.', onMap: 'Op kaart',
    exAdd: 'Uitgave toevoegen', exAmount: 'Bedrag', exWho: 'Betaald door', exDesc: 'Omschrijving', exDescPh: 'Bijv. asado bij Don Julio', exSave: 'Opslaan', exCancel: 'Annuleer', exTotal: 'Totaal uitgegeven', exPaid: '{n} betaalde', exSettle: '{a} betaalt {b} nog {x}', exEven: 'Jullie staan quitte.', exEmpty: 'Nog geen uitgaven. Voeg de eerste toe.', exNoRates: 'Koersen nog niet geladen: open de app een keer met internet.', exSplit: 'Alles wordt 50/50 gedeeld.',
    cat_food: 'Eten', cat_transport: 'Vervoer', cat_stay: 'Verblijf', cat_activity: 'Activiteit', cat_groceries: 'Boodschappen', cat_other: 'Overig',
    fxIntro: 'Reken snel om. In Argentinië bestaan meerdere dollarkoersen.', fxOfficial: 'Officieel', fxMep: 'MEP (vaak de kaartkoers)', fxBlue: 'Blue (straat)', fxUpdated: 'Koersen van {d}', fxOffline: 'Offline: laatst bekende koersen', fxTip: 'Buitenlandse creditcards krijgen in Argentinië vaak een koers in de buurt van MEP. Vergelijk met contant dollars wisselen bij een casa de cambio.', fxSource: 'Bron: ExchangeRate-API en DolarApi.', fxPer: '1 {a} = {v} {b}',
    askTitle: 'Vraag het de app', askHello: '¡Hola! Ik ken jullie hele reis. Vraag bijvoorbeeld:', askPh: 'Stel een vraag…', askNone: 'Daar heb ik niets over gevonden. Probeer andere woorden, bijvoorbeeld een plaatsnaam of "vlucht".', askOffline: 'Werkt offline met jullie eigen reisgegevens.',
    askToday: 'Dit staat er vandaag op het programma:', askTomorrow: 'Morgen:', askDay: 'Op {d}:', askSleep: 'Jullie slapen op {d} hier:', askSleeps: 'Alle verblijven:', askFlights: 'Jullie vluchten:', askNext: 'Het eerstvolgende vertrek:', askCodes: 'De codes die ik vond:', askWeather: 'Het weer in {p}:', askPhrase: 'Zo zeg je dat:', askEmergency: 'Noodnummers:', askMoney: 'Reken het om in de valuta-omrekenaar:', askFound: 'Dit vond ik:',
    sug: ['Waar slapen we morgen?', 'Volgende vlucht', 'Code vlucht Mendoza', 'Weer in El Chaltén', 'Hoe zeg je de rekening?', 'Noodnummers'],
    statKm: 'kilometer in totaal', statFlight: 'km vliegen', statBus: 'km met bus en auto', statBoat: 'km varen', statHike: 'km wandelen', statNights: 'nachten', statFlights: 'vluchten', statBeds: 'slaapplekken', statEarth: '{n}× de omtrek van de aarde',
    shareIntro: 'Met deze link kunnen jullie ouders meekijken: waar jullie zijn, de route, het programma, het weer en jullie check-ins.', shareNot: 'Niet zichtbaar: boekingscodes, adressen, betalingen en jullie lijstjes.', shareCopy: 'Kopieer link', shareSend: 'Delen', shareWa: 'Via WhatsApp', shareOpen: 'Bekijk de volg-pagina', shareMsg: 'Volg onze reis door Argentinië en Chili! Hier zie je waar we zijn: {u}', shareNone: 'De volg-pagina is nog niet ingesteld.',
    calIntro: 'Zet alle vluchten, bussen en verblijven in de agenda van je iPhone, met herinneringen: 3 uur voor een vlucht, 1 uur voor een bus.', calBtn: 'Download agenda-bestand', calDone: 'Open het bestand en kies "Voeg alles toe".',
    installTitle: 'Zet de app op je beginscherm', installSteps: ['Open deze pagina in Safari.', 'Tik op de deelknop (vierkant met pijl).', 'Kies "Zet op beginscherm".', 'Open de app voortaan via het icoon.'], installLater: 'Later', nextIn: 'over {t}', ago: '{t} geleden', justNow: 'zojuist',
  },
  en: {
    checkin: 'Check-in', checkinSub: 'Share where you are', journal: 'Journal', journalSub: 'Check-ins, photos and notes', expenses: 'Expenses', expensesSub: 'Who paid what', currency: 'Currency', currencySub: 'Pesos, dollars, euros', ask: 'Ask', askSub: 'Ask the app', stats: 'Trip in numbers', statsSub: 'Kilometres and more', share: 'Share with family', shareSub: 'A link for the folks at home', calendar: 'Add to calendar', calendarSub: 'All flights, buses and hotels',
    ciTitle: 'Share where you are now', ciMsg: 'What are you up to? How is it going?', ciLoc: 'Include location', ciPhoto: 'Add photo', ciChange: 'Other photo', ciPost: 'Post check-in', ciPosting: 'Posting…', ciQueued: 'Saved. It will be sent once you have signal.', ciPosted: 'Posted! Family can see it on the follow page.', ciNoLoc: 'Location unavailable, checking in without it.', ciEmpty: 'No check-ins yet. The first one will surely come from Buenos Aires!', ciDelete: 'Delete', ciTooBig: 'This check-in could not be sent. Try another photo.', ciVisible: 'Visible on the family follow page.', ciNoSync: 'Sharing only works with sync on.', onMap: 'On map',
    exAdd: 'Add expense', exAmount: 'Amount', exWho: 'Paid by', exDesc: 'Description', exDescPh: 'E.g. asado at Don Julio', exSave: 'Save', exCancel: 'Cancel', exTotal: 'Total spent', exPaid: '{n} paid', exSettle: '{a} owes {b} {x}', exEven: "You're even.", exEmpty: 'No expenses yet. Add the first one.', exNoRates: 'Rates not loaded yet: open the app once with internet.', exSplit: 'Everything is split 50/50.',
    cat_food: 'Food', cat_transport: 'Transport', cat_stay: 'Stay', cat_activity: 'Activity', cat_groceries: 'Groceries', cat_other: 'Other',
    fxIntro: 'Convert quickly. Argentina has several dollar rates.', fxOfficial: 'Official', fxMep: 'MEP (often the card rate)', fxBlue: 'Blue (street)', fxUpdated: 'Rates from {d}', fxOffline: 'Offline: last known rates', fxTip: 'Foreign credit cards in Argentina often get a rate close to MEP. Compare with changing cash dollars at a casa de cambio.', fxSource: 'Source: ExchangeRate-API and DolarApi.', fxPer: '1 {a} = {v} {b}',
    askTitle: 'Ask the app', askHello: '¡Hola! I know your whole trip. Try for example:', askPh: 'Ask a question…', askNone: "I couldn't find anything on that. Try other words, like a place name or \"flight\".", askOffline: 'Works offline with your own trip data.',
    askToday: "Here's today's plan:", askTomorrow: 'Tomorrow:', askDay: 'On {d}:', askSleep: "On {d} you're sleeping here:", askSleeps: 'All stays:', askFlights: 'Your flights:', askNext: 'The next departure:', askCodes: 'The codes I found:', askWeather: 'Weather in {p}:', askPhrase: "Here's how to say it:", askEmergency: 'Emergency numbers:', askMoney: 'Convert it in the currency tool:', askFound: "Here's what I found:",
    sug: ['Where do we sleep tomorrow?', 'Next flight', 'Code flight Mendoza', 'Weather in El Chaltén', 'How do you say the bill?', 'Emergency numbers'],
    statKm: 'kilometres in total', statFlight: 'km flying', statBus: 'km by bus and car', statBoat: 'km by boat', statHike: 'km hiking', statNights: 'nights', statFlights: 'flights', statBeds: 'places to sleep', statEarth: '{n}× around the Earth',
    shareIntro: 'With this link your parents can follow along: where you are, the route, the plan, the weather and your check-ins.', shareNot: 'Not visible: booking codes, addresses, payments and your lists.', shareCopy: 'Copy link', shareSend: 'Share', shareWa: 'Via WhatsApp', shareOpen: 'View the follow page', shareMsg: 'Follow our trip through Argentina and Chile! See where we are: {u}', shareNone: 'The follow page is not set up yet.',
    calIntro: 'Put all flights, buses and stays in your iPhone calendar, with reminders: 3 hours before a flight, 1 hour before a bus.', calBtn: 'Download calendar file', calDone: 'Open the file and choose "Add all".',
    installTitle: 'Add the app to your home screen', installSteps: ['Open this page in Safari.', 'Tap the share button (square with arrow).', 'Choose "Add to Home Screen".', 'From now on, open the app from the icon.'], installLater: 'Later', nextIn: 'in {t}', ago: '{t} ago', justNow: 'just now',
  },
  es: {
    checkin: 'Check-in', checkinSub: 'Compartí dónde están', journal: 'Diario', journalSub: 'Check-ins, fotos y mensajes', expenses: 'Gastos', expensesSub: 'Quién pagó qué', currency: 'Cambio', currencySub: 'Pesos, dólares, euros', ask: 'Preguntá', askSub: 'Preguntale a la app', stats: 'El viaje en números', statsSub: 'Kilómetros y más', share: 'Compartir con la familia', shareSub: 'Link para los de casa', calendar: 'Al calendario', calendarSub: 'Vuelos, buses y hoteles',
    ciTitle: 'Compartí dónde están ahora', ciMsg: '¿Qué están haciendo? ¿Cómo va?', ciLoc: 'Enviar ubicación', ciPhoto: 'Agregar foto', ciChange: 'Otra foto', ciPost: 'Publicar check-in', ciPosting: 'Publicando…', ciQueued: 'Guardado. Se envía cuando haya señal.', ciPosted: '¡Publicado! La familia lo ve en la página de seguimiento.', ciNoLoc: 'Ubicación no disponible, check-in sin ubicación.', ciEmpty: 'Todavía no hay check-ins. ¡El primero seguro llega desde Buenos Aires!', ciDelete: 'Borrar', ciTooBig: 'No se pudo enviar este check-in. Probá con otra foto.', ciVisible: 'Visible en la página para la familia.', ciNoSync: 'Compartir solo funciona con la sincronización activa.', onMap: 'En el mapa',
    exAdd: 'Agregar gasto', exAmount: 'Monto', exWho: 'Pagó', exDesc: 'Descripción', exDescPh: 'Ej. asado en Don Julio', exSave: 'Guardar', exCancel: 'Cancelar', exTotal: 'Total gastado', exPaid: '{n} pagó', exSettle: '{a} le debe a {b} {x}', exEven: 'Están a mano.', exEmpty: 'Todavía no hay gastos. Agregá el primero.', exNoRates: 'Faltan cotizaciones: abrí la app una vez con internet.', exSplit: 'Todo se divide 50/50.',
    cat_food: 'Comida', cat_transport: 'Transporte', cat_stay: 'Alojamiento', cat_activity: 'Actividad', cat_groceries: 'Súper', cat_other: 'Otro',
    fxIntro: 'Convertí rápido. En Argentina hay varios tipos de dólar.', fxOfficial: 'Oficial', fxMep: 'MEP (suele ser el de tarjeta)', fxBlue: 'Blue', fxUpdated: 'Cotizaciones del {d}', fxOffline: 'Sin conexión: últimas cotizaciones', fxTip: 'Las tarjetas extranjeras en Argentina suelen tener una cotización cercana al MEP. Compará con cambiar dólares en una casa de cambio.', fxSource: 'Fuente: ExchangeRate-API y DolarApi.', fxPer: '1 {a} = {v} {b}',
    askTitle: 'Preguntale a la app', askHello: '¡Hola! Conozco todo su viaje. Probá por ejemplo:', askPh: 'Escribí una pregunta…', askNone: 'No encontré nada. Probá con otras palabras, como un lugar o "vuelo".', askOffline: 'Funciona sin conexión con sus propios datos.',
    askToday: 'Esto es lo de hoy:', askTomorrow: 'Mañana:', askDay: 'El {d}:', askSleep: 'El {d} duermen acá:', askSleeps: 'Todos los alojamientos:', askFlights: 'Sus vuelos:', askNext: 'La próxima salida:', askCodes: 'Los códigos que encontré:', askWeather: 'El clima en {p}:', askPhrase: 'Así se dice:', askEmergency: 'Números de emergencia:', askMoney: 'Convertilo en la calculadora:', askFound: 'Esto encontré:',
    sug: ['¿Dónde dormimos mañana?', 'Próximo vuelo', 'Código vuelo Mendoza', 'Clima en El Chaltén', '¿Cómo se dice la cuenta?', 'Emergencias'],
    statKm: 'kilómetros en total', statFlight: 'km en avión', statBus: 'km en bus y auto', statBoat: 'km en barco', statHike: 'km caminando', statNights: 'noches', statFlights: 'vuelos', statBeds: 'lugares para dormir', statEarth: '{n}× la vuelta al mundo',
    shareIntro: 'Con este link sus padres pueden seguirlos: dónde están, la ruta, el plan, el clima y sus check-ins.', shareNot: 'No se ven: códigos de reserva, direcciones, pagos ni sus listas.', shareCopy: 'Copiar link', shareSend: 'Compartir', shareWa: 'Por WhatsApp', shareOpen: 'Ver la página', shareMsg: '¡Seguí nuestro viaje por Argentina y Chile! Acá ves dónde estamos: {u}', shareNone: 'La página de seguimiento todavía no está configurada.',
    calIntro: 'Agregá todos los vuelos, buses y alojamientos al calendario del iPhone, con avisos: 3 horas antes de un vuelo, 1 hora antes de un bus.', calBtn: 'Descargar calendario', calDone: 'Abrí el archivo y elegí "Agregar todo".',
    installTitle: 'Agregá la app a tu pantalla de inicio', installSteps: ['Abrí esta página en Safari.', 'Tocá el botón compartir (cuadrado con flecha).', 'Elegí "Agregar a inicio".', 'Desde ahora abrí la app desde el ícono.'], installLater: 'Después', nextIn: 'en {t}', ago: 'hace {t}', justNow: 'recién',
  },
};
const ft = (k, v = {}) => { const s = (FT_STR[LANG] || FT_STR.nl)[k] ?? FT_STR.nl[k] ?? k; return Array.isArray(s) ? s : String(s).replace(/\{(\w+)\}/g, (_, x) => v[x] ?? ''); };
const dur = ms => { const m = Math.round(ms / 60000); if (m < 60) return `${m} min`; const h = Math.floor(m / 60); if (h < 48) return `${h}u ${m % 60}m`.replace('u', LANG === 'nl' ? 'u' : 'h'); return `${Math.floor(h / 24)} ${t('cdDays')}`; };
const ago = ts => { const d = Date.now() - ts; return d < 90e3 ? ft('justNow') : ft('ago', { t: dur(d) }); };
const fmtTime = ts => { const d = new Date(ts); return `${fmt(iso(d))} · ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
const me = () => store.get('me', 'Martine');
const otherPerson = () => me() === 'Thijs' ? 'Martine' : 'Thijs';

/* ================= familie-kamer (check-ins, gedeeld met volg-pagina) ================= */
const Fam = {
  key: null, room: null, raw: null,
  data() { return store.get('fam', {}); },
  async init() {
    if (!BASE?.family?.key || !Sync.cfg()) return;
    this.raw = Uint8Array.from(atob(BASE.family.key.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - BASE.family.key.length % 4) % 4)), c => c.charCodeAt(0));
    this.key = await crypto.subtle.importKey('raw', this.raw, 'AES-GCM', false, ['encrypt', 'decrypt']);
    const h = await crypto.subtle.digest('SHA-256', new Uint8Array([...this.raw, ...new TextEncoder().encode('|family')]));
    this.room = [...new Uint8Array(h)].map(b => b.toString(16).padStart(2, '0')).join('');
    await this.pull(); this.flush();
    setInterval(() => { if (document.visibilityState === 'visible') this.pull(); }, 60000);
    window.addEventListener('online', () => { this.flush(); this.pull(); });
  },
  post(k, v) {
    const all = this.data(), now = Date.now(); all[k] = { v, t: now }; store.set('fam', all);
    const out = store.get('famOut', {}); out[k] = all[k]; store.set('famOut', out);
    return this.flush();
  },
  async flush() {
    if (!this.room || !navigator.onLine) return false;
    const out = store.get('famOut', {}); let ok = true;
    for (const [k, e] of Object.entries(out)) {
      try { await Sync.rpc('kv_set', { p_room: this.room, p_k: k, p_v: await encryptJSON(this.key, e.v), p_t: e.t }); const cur = store.get('famOut', {}); if (cur[k]?.t === e.t) { delete cur[k]; store.set('famOut', cur); } }
      catch (err) {
        if (/sync 4\d\d/.test(err.message)) { const cur = store.get('famOut', {}); delete cur[k]; store.set('famOut', cur); toast(ft('ciTooBig')); continue; }
        ok = false; break;
      }
    }
    return ok;
  },
  async pull() {
    if (!this.room || !navigator.onLine) return;
    try {
      const rows = await Sync.rpc('kv_get', { p_room: this.room }), all = this.data(); let changed = false;
      for (const r of rows || []) { const ts = Number(r.t); if (all[r.k] && all[r.k].t >= ts) continue; try { const [iv, ct] = r.v.split('.'); all[r.k] = { v: await decryptJSON(this.key, iv, ct), t: ts }; changed = true; } catch {} }
      if (changed) { try { store.set('fam', all); } catch {} if (/^#\/(dagboek|checkin)/.test(location.hash)) route(true); }
    } catch {}
  },
  checkins() { return Object.entries(this.data()).filter(([k, e]) => k.startsWith('ci:') && e.v && !e.v.deleted).map(([k, e]) => ({ k, ...e.v, t: e.t })).sort((a, b) => b.at - a.at); },
};

/* ================= check-in & dagboek ================= */
let ciPhoto = null;
async function compressImage(file, max = 1100, q = 0.72) {
  const url = URL.createObjectURL(file);
  const im = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
  const s = Math.min(1, max / Math.max(im.width, im.height)), c = document.createElement('canvas');
  c.width = Math.round(im.width * s); c.height = Math.round(im.height * s);
  c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
  // versleuteld wordt het ~35% groter; de server accepteert max 400.000 tekens per item
  let out = c.toDataURL('image/jpeg', q);
  for (const qq of [0.6, 0.5, 0.42]) { if (out.length <= 250000) break; out = c.toDataURL('image/jpeg', qq); }
  while (out.length > 250000 && c.width > 400) {
    const w = Math.round(c.width * 0.8), h = Math.round(c.height * 0.8), c2 = document.createElement('canvas');
    c2.width = w; c2.height = h; c2.getContext('2d').drawImage(c, 0, 0, w, h); c.width = w; c.height = h; c.getContext('2d').drawImage(c2, 0, 0);
    out = c.toDataURL('image/jpeg', 0.5);
  }
  return out;
}
const curPlaceId = () => { const d = T.days.find(x => x.date === todayIso()); return d?.placeId || null; };
function checkinCard(c, mine) {
  const p = c.place && place(c.place);
  return `<article class="ci-card">${c.photo ? `<img class="ci-photo" src="${c.photo}" alt="" loading="lazy">` : ''}
    <div class="ci-body"><div class="ci-head"><div class="mz-avatar" style="width:32px;height:32px;font-size:12px">${esc((c.by || '?')[0])}</div><div class="grow"><strong>${esc(c.by || '')}</strong><div class="tiny muted">${p ? esc(p.name) + ' · ' : ''}${esc(fmtTime(c.at))}</div></div>
    ${mine ? `<button class="icon-btn" data-del="${esc(c.k)}" aria-label="${ft('ciDelete')}" style="width:32px;height:32px;box-shadow:none;background:var(--surface-2)">${ic('x', 'sm')}</button>` : ''}</div>
    ${c.msg ? `<p class="ci-msg">${esc(c.msg)}</p>` : ''}
    ${c.lat ? `<a class="ci-loc" href="${mapsUrl('', [c.lat, c.lon])}" target="_blank" rel="noopener">${ic('map-pin', 'sm')} ${c.lat.toFixed(3)}, ${c.lon.toFixed(3)}</a>` : ''}</div></article>`;
}
function vCheckin() {
  setChrome(ft('checkin'), { back: true });
  const ok = !!BASE?.family?.key && !!Sync.cfg();
  view.innerHTML = `<div class="card ci-compose"><h2 style="margin:0 0 4px;font-size:20px">${ft('ciTitle')}</h2><p class="tiny muted" style="margin:0 0 12px">${ok ? ft('ciVisible') : ft('ciNoSync')}</p>
    <textarea id="ciMsg" rows="3" placeholder="${ft('ciMsg')}" style="min-height:90px"></textarea>
    <div id="ciPrev">${ciPhoto ? `<img class="ci-photo" src="${ciPhoto}" alt="" style="border-radius:16px;margin-top:10px">` : ''}</div>
    <div class="btns"><label class="btn soft" style="cursor:pointer">${ic('image-plus', 'sm')} <span id="ciPhLbl">${ciPhoto ? ft('ciChange') : ft('ciPhoto')}</span><input id="ciFile" type="file" accept="image/*" hidden></label>
    <label class="chip ${store.get('ciLoc', true) ? 'on' : ''}" id="ciLocChip" style="cursor:pointer">${ic('map-pin', 'sm')} ${ft('ciLoc')}</label></div>
    <button class="btn" id="ciGo" style="width:100%;margin-top:14px;padding:14px" ${ok ? '' : 'disabled'}>${ic('send', 'sm')} ${ft('ciPost')}</button></div>
    <div class="h-sec">${ic('notebook-pen')} ${ft('journal')} <small><a href="#/dagboek">${ft('journal')} ›</a></small></div>
    <div id="ciList">${journalHtml(3)}</div>`;
  $('#ciFile').onchange = async e => { const f = e.target.files[0]; if (!f) return; ciPhoto = await compressImage(f); $('#ciPrev').innerHTML = `<img class="ci-photo" src="${ciPhoto}" alt="" style="border-radius:16px;margin-top:10px">`; $('#ciPhLbl').textContent = ft('ciChange'); };
  $('#ciLocChip').onclick = () => { const v = !store.get('ciLoc', true); store.set('ciLoc', v); $('#ciLocChip').classList.toggle('on', v); };
  $('#ciGo').onclick = async () => {
    const btn = $('#ciGo'); btn.disabled = true; btn.textContent = ft('ciPosting');
    let pos = null;
    if (store.get('ciLoc', true) && navigator.geolocation) pos = await new Promise(res => navigator.geolocation.getCurrentPosition(p => res(p.coords), () => res(null), { enableHighAccuracy: true, timeout: 12000, maximumAge: 120000 }));
    if (store.get('ciLoc', true) && !pos) toast(ft('ciNoLoc'));
    const at = Date.now(), entry = { by: me(), msg: $('#ciMsg').value.trim(), at, place: curPlaceId(), photo: ciPhoto || null, ...(pos ? { lat: +pos.latitude.toFixed(5), lon: +pos.longitude.toFixed(5), acc: Math.round(pos.accuracy) } : {}) };
    const sent = await Fam.post('ci:' + at, entry);
    ciPhoto = null; toast(sent ? ft('ciPosted') : ft('ciQueued')); vCheckin();
  };
  bindJournal();
}
function journalHtml(limit) {
  const list = Fam.checkins().slice(0, limit || 999);
  return list.length ? list.map(c => checkinCard(c, c.by === me())).join('') : `<div class="empty">${ic('camera', 'lg')}<p>${ft('ciEmpty')}</p></div>`;
}
function bindJournal() { view.querySelectorAll('[data-del]').forEach(b => b.onclick = () => { const k = b.dataset.del, cur = Fam.data()[k]?.v; Fam.post(k, { ...cur, deleted: true, photo: null }); route(true); }); }
function vJournal() {
  setChrome(ft('journal'), { back: true });
  view.innerHTML = `<a class="btn" href="#/checkin" style="width:100%;padding:14px;margin-bottom:14px">${ic('camera', 'sm')} ${ft('ciTitle')}</a>${journalHtml()}`;
  bindJournal(); Fam.pull();
}

/* ================= valuta ================= */
const FX = {
  get() { return store.get('fx', null); },
  async refresh() {
    if (!navigator.onLine) return this.get();
    try {
      const [er, da] = await Promise.all([fetch('https://open.er-api.com/v6/latest/EUR').then(r => r.json()), fetch('https://dolarapi.com/v1/dolares').then(r => r.json()).catch(() => [])]);
      if (er.result !== 'success') return this.get();
      const ars = Object.fromEntries((da || []).map(x => [x.casa, x.venta]));
      const v = { at: Date.now(), eur: { USD: er.rates.USD, ARS: er.rates.ARS, CLP: er.rates.CLP, EUR: 1 }, arsUsd: { official: ars.oficial, mep: ars.bolsa, blue: ars.blue } };
      store.set('fx', v); return v;
    } catch { return this.get(); }
  },
  // aantal euro voor bedrag in valuta (ARS via MEP als beschikbaar: dichtst bij kaartkoers)
  toEur(amt, cur, fx = this.get()) {
    if (!fx) return null; if (cur === 'EUR') return amt;
    if (cur === 'ARS' && fx.arsUsd?.mep) return amt / fx.arsUsd.mep * (1 / fx.eur.USD);
    return amt / fx.eur[cur];
  },
};
const money = (v, cur) => { if (v == null || isNaN(v)) return '–'; const d = cur === 'ARS' || cur === 'CLP' ? 0 : 2; return new Intl.NumberFormat(LANG === 'en' ? 'en-GB' : LANG === 'es' ? 'es-AR' : 'nl-NL', { style: 'currency', currency: cur, currencyDisplay: cur === 'EUR' ? 'symbol' : 'code', minimumFractionDigits: d, maximumFractionDigits: d }).format(v); };
let fxAmt = store.get('fxAmt', 10000), fxCur = store.get('fxCur', 'ARS');
function vCurrency() {
  setChrome(ft('currency'), { back: true });
  const render = () => {
    const fx = FX.get(), curs = ['ARS', 'CLP', 'USD', 'EUR'];
    let rows = '';
    if (fx) {
      const eur = FX.toEur(fxAmt, fxCur, fx);
      for (const c of curs.filter(c => c !== fxCur)) {
        if (c === 'ARS' && fx.arsUsd?.mep) {
          const usd = eur * fx.eur.USD;
          rows += `<div class="fx-row"><div class="grow"><strong>${money(usd * fx.arsUsd.mep, 'ARS')}</strong><div class="tiny muted">${ft('fxMep')}</div></div></div>
            <div class="fx-row sub"><div class="grow small">${money(usd * fx.arsUsd.official, 'ARS')} <span class="muted">· ${ft('fxOfficial')}</span></div></div>
            ${fx.arsUsd.blue ? `<div class="fx-row sub"><div class="grow small">${money(usd * fx.arsUsd.blue, 'ARS')} <span class="muted">· ${ft('fxBlue')}</span></div></div>` : ''}`;
        } else rows += `<div class="fx-row"><div class="grow"><strong>${money(c === 'EUR' ? eur : eur * fx.eur[c], c)}</strong></div></div>`;
      }
    }
    view.innerHTML = `<div class="card fx-card"><p class="small muted" style="margin:0 0 10px">${ft('fxIntro')}</p>
      <input id="fxIn" class="fx-input" inputmode="decimal" value="${fxAmt}" aria-label="${ft('exAmount')}">
      <div class="seg" style="margin:10px 0 0">${curs.map(c => `<button data-c="${c}" class="${c === fxCur ? 'on' : ''}">${c}</button>`).join('')}</div>
      <div class="chips" style="margin-top:12px">${(fxCur === 'ARS' ? [1000, 10000, 50000, 100000] : fxCur === 'CLP' ? [1000, 5000, 20000, 50000] : [1, 10, 50, 100]).map(v => `<button class="chip" data-q="${v}">${money(v, fxCur)}</button>`).join('')}</div></div>
      ${fx ? `<div class="card">${rows}</div><p class="tiny muted" style="text-align:center">${navigator.onLine ? ft('fxUpdated', { d: esc(fmtTime(fx.at)) }) : ft('fxOffline')} · ${ft('fxSource')}</p>` : `<div class="card">${ft('exNoRates')}</div>`}
      <div class="card flat"><div class="wx-tip" style="margin:0">${ic('lightbulb', 'sm')}<span>${ft('fxTip')}</span></div></div>`;
    const inp = $('#fxIn');
    inp.oninput = () => { fxAmt = parseFloat(inp.value.replace(/\./g, '').replace(',', '.')) || 0; store.set('fxAmt', fxAmt); const pos = inp.selectionStart; render(); const n = $('#fxIn'); n.focus(); try { n.setSelectionRange(pos, pos); } catch {} };
    view.querySelectorAll('[data-c]').forEach(b => b.onclick = () => { fxCur = b.dataset.c; store.set('fxCur', fxCur); render(); });
    view.querySelectorAll('[data-q]').forEach(b => b.onclick = () => { fxAmt = +b.dataset.q; store.set('fxAmt', fxAmt); render(); });
  };
  render();
  const age = FX.get() ? Date.now() - FX.get().at : Infinity;
  if (age > 3 * 3600e3) FX.refresh().then(() => { if (location.hash.startsWith('#/valuta')) render(); });
}

/* ================= uitgaven (gedeeld) ================= */
const CATS = { food: 'utensils', transport: 'bus', stay: 'bed-double', activity: 'mountain-snow', groceries: 'shopping-bag', other: 'sparkles' };
const expenses = () => Object.entries(Sync.data()).filter(([k, e]) => k.startsWith('exp:') && e.v && !e.v.deleted).map(([k, e]) => ({ id: k, ...e.v })).sort((a, b) => b.date.localeCompare(a.date) || b.at - a.at);
let exForm = false;
function vExpenses() {
  setChrome(ft('expenses'), { back: true });
  const list = expenses(), fx = FX.get();
  const eurOf = x => FX.toEur(x.amt, x.cur, fx);
  const paid = { Martine: 0, Thijs: 0 }; let total = 0, missing = false;
  for (const x of list) { const e = eurOf(x); if (e == null) { missing = true; continue; } paid[x.who] = (paid[x.who] || 0) + e; total += e; }
  const diff = (paid.Martine - paid.Thijs) / 2, owes = diff > 0 ? ['Thijs', 'Martine'] : ['Martine', 'Thijs'];
  let h = `<div class="card ex-sum"><div class="tiny muted" style="font-weight:700;text-transform:uppercase;letter-spacing:.05em">${ft('exTotal')}</div><div class="ex-total">${money(total, 'EUR')}</div>
    <div class="ex-bars">${['Martine', 'Thijs'].map(n => `<div><div class="ex-bar"><i style="width:${total ? Math.round(paid[n] / total * 100) : 0}%;background:${n === 'Martine' ? 'var(--p-ba)' : 'var(--p-calafate)'}"></i></div><span>${ft('exPaid', { n })}: <b>${money(paid[n], 'EUR')}</b></span></div>`).join('')}</div>
    <div class="wx-tip" style="margin-top:12px">${ic('circle-check', 'sm')}<span>${Math.abs(diff) < 0.5 ? ft('exEven').replace(/\.$/, '') : ft('exSettle', { a: owes[0], b: owes[1], x: money(Math.abs(diff), 'EUR') })}. ${ft('exSplit')}</span></div>
    ${missing || !fx ? `<p class="tiny muted" style="margin:8px 0 0">${ft('exNoRates')}</p>` : ''}</div>`;
  if (exForm) {
    const cats = Object.keys(CATS);
    h += `<div class="card ex-form"><div class="row"><input id="exAmt" class="fx-input" inputmode="decimal" placeholder="0" style="flex:1"><select id="exCur" class="ex-select">${['ARS', 'CLP', 'USD', 'EUR'].map(c => `<option ${c === store.get('exCur', 'ARS') ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
      <input id="exDesc" class="ex-text" placeholder="${ft('exDescPh')}">
      <div class="tiny muted" style="margin:10px 0 4px;font-weight:700">${ft('exWho')}</div><div class="seg" style="margin:0">${['Martine', 'Thijs'].map(n => `<button data-who="${n}" class="${n === me() ? 'on' : ''}">${n}</button>`).join('')}</div>
      <div class="chips" style="margin-top:10px">${cats.map((c, i) => `<button class="chip ${i === 0 ? 'on' : ''}" data-cat="${c}">${ic(CATS[c], 'sm')} ${ft('cat_' + c)}</button>`).join('')}</div>
      <div class="btns"><button class="btn" id="exSave">${ft('exSave')}</button><button class="btn soft" id="exCancel">${ft('exCancel')}</button></div></div>`;
  } else h += `<button class="btn" id="exNew" style="width:100%;padding:14px;margin-bottom:12px">${ic('sparkles', 'sm')} ${ft('exAdd')}</button>`;
  if (!list.length) h += `<div class="empty">${ic('wallet', 'lg')}<p>${ft('exEmpty')}</p></div>`;
  let cur = null;
  for (const x of list) {
    if (x.date !== cur) { cur = x.date; h += `<div class="h-sec" style="font-size:15px;margin:18px 2px 8px">${esc(fmt(x.date, true))}</div>`; }
    const e = eurOf(x);
    h += `<div class="card ex-item"><div class="row"><div class="tl-ico" style="background:var(--accent-soft);color:var(--accent)">${ic(CATS[x.cat] || 'sparkles')}</div><div class="grow"><strong>${esc(x.desc || ft('cat_' + x.cat))}</strong><div class="tiny muted">${esc(x.who)} · ${ft('cat_' + x.cat)}</div></div>
      <div style="text-align:right"><strong>${money(x.amt, x.cur)}</strong>${x.cur !== 'EUR' && e != null ? `<div class="tiny muted">≈ ${money(e, 'EUR')}</div>` : ''}</div><button class="icon-btn" data-exdel="${esc(x.id)}" style="width:30px;height:30px;box-shadow:none;background:var(--surface-2);margin-left:6px">${ic('x', 'sm')}</button></div></div>`;
  }
  view.innerHTML = h;
  if ($('#exNew')) $('#exNew').onclick = () => { exForm = true; vExpenses(); setTimeout(() => $('#exAmt')?.focus(), 50); };
  if (exForm) {
    let who = me(), cat = 'food';
    view.querySelectorAll('[data-who]').forEach(b => b.onclick = () => { who = b.dataset.who; view.querySelectorAll('[data-who]').forEach(x => x.classList.toggle('on', x === b)); });
    view.querySelectorAll('[data-cat]').forEach(b => b.onclick = () => { cat = b.dataset.cat; view.querySelectorAll('[data-cat]').forEach(x => x.classList.toggle('on', x === b)); });
    $('#exCancel').onclick = () => { exForm = false; vExpenses(); };
    $('#exSave').onclick = () => {
      const amt = parseFloat($('#exAmt').value.replace(/\./g, '').replace(',', '.')); if (!amt) return $('#exAmt').focus();
      const c = $('#exCur').value; store.set('exCur', c); const at = Date.now();
      Sync.set('exp:' + at.toString(36), { amt, cur: c, who, desc: $('#exDesc').value.trim(), cat, date: todayIso(), at });
      exForm = false; vExpenses();
    };
  }
  view.querySelectorAll('[data-exdel]').forEach(b => b.onclick = () => { const cur = Sync.get(b.dataset.exdel); Sync.set(b.dataset.exdel, { ...cur, deleted: true }); vExpenses(); });
  if (!fx || Date.now() - fx.at > 6 * 3600e3) FX.refresh().then(v => { if (v && location.hash.startsWith('#/uitgaven') && !exForm) vExpenses(); });
}

/* ================= Vraag de app ================= */
let askLog = [];
const nrm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const MONTH_RX = { nov: 10, november: 10, noviembre: 10, dec: 11, december: 11, diciembre: 11, dic: 11 };
function askDate(q) {
  const td = todayIso();
  if (/\b(vandaag|today|hoy)\b/.test(q)) return td;
  if (/\b(morgen|tomorrow|manana)\b/.test(q)) { const d = parseD(td); d.setDate(d.getDate() + 1); return iso(d); }
  if (/\b(gisteren|yesterday|ayer)\b/.test(q)) { const d = parseD(td); d.setDate(d.getDate() - 1); return iso(d); }
  const m = q.match(/\b(\d{1,2})\s*(nov|november|noviembre|dec|december|diciembre|dic)\b/) || q.match(/\b(\d{1,2})[-/](11|12)\b/);
  if (m) { const mo = MONTH_RX[m[2]] ?? (+m[2] - 1); return iso(new Date(2026, mo, +m[1])); }
  return null;
}
function placeIn(q) { return PL.find(p => q.includes(nrm(p.name)) || q.includes(nrm(p.name.split(' ').pop())) || (p.id === 'ba' && /\b(ba|bsas)\b/.test(q))); }
function answer(qRaw) {
  const q = nrm(qRaw), date = askDate(q), p = placeIn(q), out = [];
  const has = (...w) => w.some(x => new RegExp(`\\b${x}`).test(q));
  const dayFor = d => T.days.find(x => x.date === d) || (d && d < T.meta.start ? T.days[0] : null);
  if (has('nood', 'emergen', 'ambulan', 'politie', 'police', 'policia', 'ambassade', 'embassy', 'embajada')) {
    const s = T.info[0]; return { text: ft('askEmergency'), html: `<div class="card">${s.items.map(i => `<div class="row" style="padding:6px 0"><div class="grow"><strong>${esc(i.label)}</strong></div>${i.phone ? `<a class="btn soft" href="tel:${i.phone.replace(/[^+\d]/g, '')}">${ic('phone', 'sm')} ${esc(i.phone)}</a>` : ''}</div>`).join('')}</div>` };
  }
  if (has('hoe zeg', 'how do you say', 'how to say', 'como se dice', 'spaans voor', 'spanish for', 'vertaal', 'translate')) {
    const term = q.replace(/.*(hoe zeg je|how do you say|how to say|como se dice|spaans voor|spanish for|vertaal|translate)\s*/, '').replace(/[?¿!.]/g, '').replace(/^(de|het|een|the|a|el|la)\s+/, '').trim();
    const hits = PH ? PH.categories.flatMap(c => c.items).filter(it => term && (nrm(it.nl).includes(term) || nrm(it.en).includes(term))).slice(0, 4) : [];
    if (hits.length) return { text: ft('askPhrase'), html: `<div class="card phrases">${hits.map(it => `<div class="phrase"><div class="grow"><strong>${esc(it.es)}</strong><div class="small muted">${esc(LANG === 'es' ? it.en : it[LANG] || it.nl)}</div></div><button class="btn soft round" data-say="${esc(it.es)}">${ic('volume-2')}</button></div>`).join('')}</div>` };
  }
  if (has('weer', 'weather', 'clima', 'temperat', 'regen', 'rain', 'wind', 'koud', 'cold', 'warm')) {
    const pid = p?.id || dayFor(date || todayIso())?.placeId || curPlaceId() || 'chalten';
    return { text: ft('askWeather', { p: place(pid).name }), html: weatherCard(pid) };
  }
  if (has('koers', 'wissel', 'pesos', 'dollar', 'euro', 'exchange', 'cambio', 'geld', 'money', 'dinero')) return { text: ft('askMoney'), html: `<a class="card" href="#/valuta"><div class="row"><div class="tl-ico" style="background:var(--ok)">${ic('arrow-left-right')}</div><strong class="grow">${ft('currency')}</strong>${ic('chevron-right', 'chev')}</div></a>` };
  if (has('slaap', 'slapen', 'sleep', 'hotel', 'verblijf', 'stay', 'dorm', 'aloja', 'overnacht', 'camping')) {
    if (date) { const d = dayFor(date); if (d?.sleep) return { text: ft('askSleep', { d: fmt(date, true) }), html: stayCard(stay(d.sleep)) }; }
    const ss = p ? T.stays.filter(s => T.days.some(d => d.sleep === s.id && d.placeId === p.id)) : T.stays;
    return { text: ft('askSleeps'), html: ss.map(s => stayCard(s, range(s.in, s.out))).join('') };
  }
  if (has('code', 'pnr', 'boekingsn', 'booking n', 'ticket', 'reserv', 'codigo')) {
    let xs = [...T.transport, ...T.other, ...T.stays].filter(x => x.codes?.length);
    if (p) xs = xs.filter(x => nrm(JSON.stringify([x.title, x.name, x.place, x.legs])).includes(nrm(p.name.split(' ').pop())));
    if (has('vlucht', 'flight', 'vuelo')) xs = xs.filter(x => x.type === 'flight');
    if (has('bus')) xs = xs.filter(x => x.type === 'bus');
    if (date) xs = xs.filter(x => (x.date || x.in) === date);
    if (xs.length) return { text: ft('askCodes'), html: xs.slice(0, 4).map(x => `<div class="card"><a href="#/boeking/${x.id}" style="color:inherit"><strong>${esc(x.title || x.name)}</strong><div class="tiny muted">${esc(fmt(x.date || x.in))}</div></a></div>` + codeBlock(x.codes)).join('') };
  }
  if (has('volgend', 'next', 'proxim', 'vertrek', 'departure', 'salida')) {
    const fl = has('vlucht', 'vlieg', 'flight', 'vuelo', 'plane'), bus = has('bus');
    const n0 = now(), cand = T.transport.filter(x => (!fl || x.type === 'flight') && (!bus || x.type === 'bus')).map(x => { const d = parseD(x.date), dep = (x.legs?.[0]?.dep || '').replace('~', ''); if (/^\d{1,2}:\d{2}/.test(dep)) { const [hh, mm] = dep.split(':').map(Number); d.setHours(hh, mm); } else d.setHours(23, 59); return { x, at: d }; }).filter(o => o.at > n0).sort((a, b) => a.at - b.at)[0];
    if (cand) return { text: ft('askNext'), html: `<div class="tl">${tlItem({ ref: cand.x.id })}</div>` };
  }
  if (has('vlucht', 'vlieg', 'flight', 'vuelo', 'plane')) {
    let fl = T.transport.filter(x => x.type === 'flight');
    if (p) fl = fl.filter(x => nrm(JSON.stringify(x.legs)).includes(nrm(p.name.split(' ').pop())) || nrm(x.title).includes(nrm(p.name.split(' ').pop())));
    if (date) fl = fl.filter(x => x.date === date);
    return { text: ft('askFlights'), html: `<div class="tl">${fl.map(x => tlItem({ ref: x.id })).join('')}</div>` };
  }
  if (date) { const d = dayFor(date); if (d) return { text: date === todayIso() ? ft('askToday') : q.match(/morgen|tomorrow|manana/) ? ft('askTomorrow') : ft('askDay', { d: fmt(date, true) }), html: `<a class="card" href="#/dag/${d.date}" style="color:inherit"><strong>${esc(d.title)}</strong><div class="tiny muted">${esc(d.place)}</div></a>` + timeline(d) + (d.sleep ? stayCard(stay(d.sleep)) : '') }; }
  // vrije tekst
  const words = q.split(/\s+/).filter(w => w.length > 2 && !['wat', 'waar', 'what', 'where', 'donde', 'que', 'hoe', 'how', 'the', 'een', 'het', 'van', 'voor', 'with', 'met', 'zijn', 'are', 'onze', 'our'].includes(w));
  if (!words.length) return { text: ft('askNone') };
  const score = s => { const n = nrm(s); return words.reduce((a, w) => a + (n.includes(w) ? 1 : 0), 0); };
  const cands = [];
  for (const x of T.transport) cands.push({ s: score(JSON.stringify([x.title, x.legs, x.codes, x.notes])), h: `<div class="tl">${tlItem({ ref: x.id })}</div>` });
  for (const x of T.stays) cands.push({ s: score(JSON.stringify([x.name, x.place, x.notes])), h: stayCard(x, range(x.in, x.out)) });
  for (const p2 of PL) for (const [l, k] of [['highlights', 'hl'], ['gems', 'gem'], ['food', 'food']]) for (const it of p2[l]) cands.push({ s: score(it.name + ' ' + it.text + ' ' + p2.name) * 0.9, h: tipCard(p2, it, k) });
  for (const d of T.days) cands.push({ s: score(d.title + ' ' + d.place + ' ' + JSON.stringify(d.items)), h: `<a class="dayrow" href="#/dag/${d.date}"><div class="db" style="background:${pcolor(d.placeId)}"><span>${days()[parseD(d.date).getDay()]}</span><b>${parseD(d.date).getDate()}</b></div><div class="grow"><strong>${esc(d.title)}</strong><div class="small muted">${esc(d.place)}</div></div></a>` });
  for (const a of AR) cands.push({ s: score(Lx(a.title) + ' ' + Lx(a.intro)) * 0.8, h: articleCard(a) });
  const best = cands.filter(c => c.s > 0).sort((a, b) => b.s - a.s).slice(0, 4);
  return best.length ? { text: ft('askFound'), html: best.map(c => c.h).join('') } : { text: ft('askNone') };
}
function vAsk() {
  setChrome(ft('askTitle'), { back: true });
  const bubbles = askLog.map(m => m.me ? `<div class="bubble-me">${esc(m.text)}</div>` : `<div class="bubble-ai"><div class="ai-av">${ic('bot', 'sm')}</div><div class="grow"><p>${esc(m.text)}</p>${m.html || ''}</div></div>`).join('');
  view.innerHTML = `<div class="ask">
    <div class="bubble-ai"><div class="ai-av">${ic('bot', 'sm')}</div><div class="grow"><p>${ft('askHello')}</p><div class="chips wrap">${ft('sug').map(s => `<button class="chip" data-s="${esc(s)}">${esc(s)}</button>`).join('')}</div><div class="tiny muted" style="margin:6px 4px 0">${ft('askOffline')}</div></div></div>
    ${bubbles}<div id="askEnd"></div></div>
    <form class="ask-bar" id="askForm"><input id="askIn" placeholder="${ft('askPh')}" autocomplete="off" enterkeyhint="send"><button class="btn round" aria-label="${ft('ask')}">${ic('send')}</button></form>`;
  document.querySelectorAll('body > .ask-bar').forEach(x => x.remove());
  document.body.appendChild($('#askForm'));
  const go = txt => { if (!txt.trim()) return; askLog.push({ me: true, text: txt }); askLog.push({ me: false, ...answer(txt) }); vAsk(); setTimeout(() => $('#askEnd')?.scrollIntoView({ behavior: 'smooth' }), 30); };
  $('#askForm').onsubmit = e => { e.preventDefault(); go($('#askIn').value); };
  view.querySelectorAll('[data-s]').forEach(b => b.onclick = () => go(b.dataset.s));
  view.querySelectorAll('[data-say]').forEach(b => b.onclick = () => speak(b.dataset.say));
  if (askLog.length) setTimeout(() => $('#askEnd')?.scrollIntoView(), 0);
}

/* ================= agenda-export (.ics) ================= */
function buildICS() {
  const TZ = s => /amsterdam|ams\)/i.test(s) ? 'Europe/Amsterdam' : /madrid|mad\)/i.test(s) ? 'Europe/Madrid' : 'America/Argentina/Buenos_Aires';
  const pad = n => String(n).padStart(2, '0');
  const dt = (date, hm) => date.replace(/-/g, '') + 'T' + hm.replace(':', '') + '00';
  const escI = s => String(s || '').replace(/\\/g, '\\\\').replace(/[,;]/g, m => '\\' + m).replace(/\n/g, '\\n');
  const L1 = [];
  const ev = (uid, props) => { L1.push('BEGIN:VEVENT', `UID:${uid}@reis2026`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`, ...props, 'END:VEVENT'); };
  for (const x of T.transport) for (const [i, l] of (x.legs || []).entries()) {
    const dep = (l.dep || '').replace('~', '').match(/^\d{1,2}:\d{2}/); if (!dep) continue;
    const arrM = (l.arr || '').replace('~', '').match(/^(\d{1,2}:\d{2})(\s*\+1)?/);
    let endDate = x.date; if (arrM?.[2]) { const d = parseD(x.date); d.setDate(d.getDate() + 1); endDate = iso(d); }
    if (x.id === 'home' && i === 1) { const d = parseD(x.date); d.setDate(d.getDate() + 1); endDate = iso(d); }
    const startDate = x.id === 'home' && i === 1 ? endDate : x.date;
    const codes = (x.codes || []).map(c => `${c.label}: ${c.value}`).join('\n');
    const props = [`SUMMARY:${escI(`${{ flight: '✈️', bus: '🚌', boat: '⛴️', transfer: '🚕' }[x.type] || ''} ${[l.number, x.legs.length > 1 ? `${l.from.replace(/\s*\(.*$/, '')} → ${l.to.replace(/\s*\(.*$/, '')}` : x.title].filter(Boolean).join(' · ')}`)}`, `DTSTART;TZID=${TZ(l.from)}:${dt(startDate, dep[0].padStart(5, '0'))}`];
    if (arrM) props.push(`DTEND;TZID=${TZ(l.to)}:${dt(endDate, arrM[1].padStart(5, '0'))}`);
    props.push(`LOCATION:${escI(l.from)}`, `DESCRIPTION:${escI(`${l.from} → ${l.to}${l.carrier ? '\n' + l.carrier : ''}${codes ? '\n\n' + codes : ''}`)}`);
    props.push('BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${escI(x.title)}`, `TRIGGER:-PT${x.type === 'flight' ? 3 : 1}H`, 'END:VALARM');
    ev(`${x.id}-${i}`, props);
  }
  for (const s of T.stays) {
    const codes = (s.codes || []).map(c => `${c.label}: ${c.value}`).join('\n');
    ev(`stay-${s.id}`, [`SUMMARY:${escI('🛏 ' + s.name)}`, `DTSTART;VALUE=DATE:${s.in.replace(/-/g, '')}`, `DTEND;VALUE=DATE:${s.out.replace(/-/g, '')}`, `LOCATION:${escI(s.address)}`, `DESCRIPTION:${escI(`${s.checkin ? t('checkin') + ': ' + s.checkin + '\n' : ''}${s.checkout ? t('checkout') + ': ' + s.checkout + '\n' : ''}${s.phone ? s.phone + '\n' : ''}${codes}`)}`, 'TRANSP:TRANSPARENT']);
  }
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Martine & Thijs//Reis 2026//NL', 'CALSCALE:GREGORIAN', 'X-WR-CALNAME:Argentinië & Chili 2026', ...L1, 'END:VCALENDAR'].join('\r\n');
}
function vCalendar() {
  setChrome(ft('calendar'), { back: true });
  view.innerHTML = `<div class="card"><div class="row top"><div class="tl-ico bg-flight" style="width:52px;height:52px;border-radius:17px">${ic('calendar-days', 'lg')}</div><div class="grow"><h2 style="margin:0;font-size:20px">${ft('calendar')}</h2><p class="small muted" style="margin:4px 0 0">${ft('calIntro')}</p></div></div>
    <button class="btn" id="icsBtn" style="width:100%;padding:14px;margin-top:16px">${ic('download', 'sm')} ${ft('calBtn')}</button><p class="tiny muted" style="margin:10px 0 0">${ft('calDone')}</p></div>`;
  $('#icsBtn').onclick = () => {
    const blob = new Blob([buildICS()], { type: 'text/calendar;charset=utf-8' }), url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = 'reis-argentinie-chili.ics'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 60000);
  };
}

/* ================= reis in cijfers ================= */
const hav = (a, b) => { const r = Math.PI / 180, dLa = (b[0] - a[0]) * r, dLo = (b[1] - a[1]) * r, x = Math.sin(dLa / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dLo / 2) ** 2; return 12742 * Math.asin(Math.sqrt(x)); };
function tripStats() {
  const km = { flight: 0, bus: 0, boat: 0, hike: 0 };
  for (const l of RT.legs) { let d = 0; for (let i = 1; i < l.line.length; i++) d += hav(l.line[i - 1], l.line[i]); if (l.id === 'w2') d *= 2; if (l.id === 'w5') d *= 2; if (l.intl) d *= 2; const k = l.mode === 'car' ? 'bus' : l.mode; km[k] += d; }
  // dagwandelingen zonder route op de kaart (Fitz Roy, Laguna Torre) tellen mee via hun afstand
  const legIds = new Set(RT.legs.map(l => l.id));
  km.hike += T.hikes.filter(h => !legIds.has(h.id)).reduce((a, h) => a + (+(String(h.approx || '').match(/(\d+(?:[.,]\d+)?)\s*km/)?.[1] || '0').replace(',', '.')), 0);
  const total = Object.values(km).reduce((a, b) => a + b, 0);
  return { km, total, nights: T.days.length - 2, flights: T.transport.filter(x => x.type === 'flight').reduce((n, x) => n + x.legs.length, 0), beds: T.stays.length };
}
function vStats() {
  setChrome(ft('stats'), { back: true });
  const s = tripStats(), r = Math.round;
  const tile = (v, label, icon, color) => `<div class="stat"><div class="stat-ico" style="background:${color}">${ic(icon)}</div><b data-count="${r(v)}">0</b><span>${label}</span></div>`;
  view.innerHTML = `<div class="hero" style="background-image:url(img/paine.webp);min-height:200px"><div class="eyebrow">${ic('route', 'sm')} ${ft('stats')}</div><div class="count" data-count="${r(s.total)}">0</div><h2 style="font-size:20px">${ft('statKm')}</h2><p>${ft('statEarth', { n: (s.total / 40075).toFixed(2).replace('.', LANG === 'en' ? '.' : ',') })}</p></div>
    <div class="stats">${tile(s.km.flight, ft('statFlight'), 'plane', 'var(--m-flight)')}${tile(s.km.bus, ft('statBus'), 'bus', 'var(--m-bus)')}${tile(s.km.hike, ft('statHike'), 'footprints', 'var(--m-hike)')}${tile(s.km.boat, ft('statBoat'), 'ship', 'var(--m-boat)')}
    ${tile(s.flights, ft('statFlights'), 'plane', '#8b5cf6')}${tile(s.nights, ft('statNights'), 'bed-double', '#0f766e')}${tile(s.beds, ft('statBeds'), 'tent', 'var(--p-paine)')}${tile(23, t('nDays', { n: '' }).trim(), 'calendar-days', 'var(--p-ba)')}</div>`;
  view.querySelectorAll('[data-count]').forEach(el => { const to = +el.dataset.count, t0 = performance.now(), d = 900; const step = n => { const f = Math.min(1, (n - t0) / d), e = 1 - Math.pow(1 - f, 3); el.textContent = new Intl.NumberFormat('nl-NL').format(Math.round(to * e)); if (f < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); });
}

/* ================= delen met familie ================= */
const familyUrl = () => BASE?.family?.key ? location.origin + location.pathname.replace(/index\.html$/, '') + 'volg.html#' + BASE.family.key : null;
function vShare() {
  setChrome(ft('share'), { back: true });
  const u = familyUrl();
  if (!u) { view.innerHTML = `<div class="card">${ft('shareNone')}</div>`; return; }
  const msg = ft('shareMsg', { u });
  view.innerHTML = `<div class="hero" style="background-image:url(img/buenosaires.webp);min-height:200px"><div class="eyebrow">${ic('heart', 'sm')} ${ft('share')}</div><h2>${ft('shareSub')}</h2></div>
    <div class="card"><p style="margin:0 0 8px">${ft('shareIntro')}</p><p class="small muted" style="margin:0">${ft('shareNot')}</p>
    <div class="share-url">${esc(u)}</div>
    <div class="btns">${navigator.share ? `<button class="btn" id="shNative">${ic('share-2', 'sm')} ${ft('shareSend')}</button>` : ''}<a class="btn ${navigator.share ? 'soft' : ''}" href="https://wa.me/?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">${ic('messages-square', 'sm')} ${ft('shareWa')}</a><button class="btn soft" data-copy="${esc(u)}">${ic('copy', 'sm')} ${ft('shareCopy')}</button></div>
    <a class="btn soft" href="${esc(u)}" target="_blank" rel="noopener" style="margin-top:8px;width:100%">${ic('compass', 'sm')} ${ft('shareOpen')}</a></div>`;
  if ($('#shNative')) $('#shNative').onclick = () => navigator.share({ title: 'Martine & Thijs', text: msg.replace(u, '').trim(), url: u }).catch(() => {});
}

/* ================= installatiehulp ================= */
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);
const isStandalone = () => navigator.standalone || matchMedia('(display-mode: standalone)').matches;
function installBanner() {
  if (!isIOS() || isStandalone() || store.get('installHidden')) return '';
  return `<div class="card install"><div class="row top"><div class="tl-ico" style="background:var(--accent)">${ic('sparkles')}</div><div class="grow"><strong>${ft('installTitle')}</strong><ol class="small" style="margin:6px 0 0;padding-left:18px">${ft('installSteps').map(s => `<li>${esc(s)}</li>`).join('')}</ol></div><button class="icon-btn" id="instX" style="width:30px;height:30px;box-shadow:none;background:var(--surface-2)">${ic('x', 'sm')}</button></div></div>`;
}
document.addEventListener('click', e => { if (e.target.closest('#instX')) { store.set('installHidden', true); e.target.closest('.install')?.remove(); } });

/* ================= live aftellen naar vertrekken ================= */
setInterval(() => document.querySelectorAll('[data-until]').forEach(el => { const ms = new Date(el.dataset.until) - now(); el.textContent = ms > 0 ? ft('nextIn', { t: dur(ms) }) : ''; }), 30000);

window.addEventListener('hashchange', () => { if (!/^#\/vraag/.test(location.hash)) document.querySelectorAll('body > .ask-bar').forEach(x => x.remove()); });
window.FX_ROUTES = { checkin: vCheckin, dagboek: vJournal, uitgaven: vExpenses, valuta: vCurrency, vraag: vAsk, agendabestand: vCalendar, cijfers: vStats, delen: vShare };
window.FX_MORE = () => {
  const row = (href, icon, color, ti, s) => `<a class="list-link" href="${href}"><div class="bubble" style="background:${color};color:#fff">${ic(icon)}</div><div class="grow"><strong>${ti}</strong><span>${s}</span></div>${ic('chevron-right', 'chev')}</a>`;
  return `<div class="card">${row('#/checkin', 'camera', 'var(--p-chalten)', ft('checkin'), ft('checkinSub'))}${row('#/dagboek', 'notebook-pen', 'var(--p-natales)', ft('journal'), ft('journalSub'))}${row('#/delen', 'heart', 'var(--p-ba)', ft('share'), ft('shareSub'))}</div>
    <div class="card">${row('#/uitgaven', 'wallet', 'var(--p-mendoza)', ft('expenses'), ft('expensesSub'))}${row('#/valuta', 'arrow-left-right', 'var(--ok)', ft('currency'), ft('currencySub'))}${row('#/vraag', 'bot', 'var(--m-flight)', ft('ask'), ft('askSub'))}</div>
    <div class="card">${row('#/agendabestand', 'calendar-days', 'var(--m-boat)', ft('calendar'), ft('calendarSub'))}${row('#/cijfers', 'chart-no-axes-column', 'var(--p-paine)', ft('stats'), ft('statsSub'))}</div>`;
};
window.FX_TILES = () => {
  const tile = (href, icon, color, label) => `<a class="tile" href="${href}"><div class="bubble" style="background:${color};color:#fff">${ic(icon)}</div>${label}</a>`;
  return tile('#/checkin', 'camera', 'var(--p-chalten)', ft('checkin')) + tile('#/uitgaven', 'wallet', 'var(--p-mendoza)', ft('expenses')) + tile('#/valuta', 'arrow-left-right', 'var(--ok)', ft('currency')) + tile('#/vraag', 'bot', 'var(--m-flight)', ft('ask'));
};
window.FX_INSTALL = installBanner;
window.Fam = Fam;

if (typeof T !== 'undefined' && T && /^#\/(checkin|dagboek|uitgaven|valuta|vraag|agendabestand|cijfers|delen)/.test(location.hash)) route(true);
