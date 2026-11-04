'use strict';
/* Volg-pagina voor familie. De sleutel staat in het #-deel van de link en gaat nooit naar een server. */
const TZ = 'America/Argentina/Buenos_Aires';
const ORDER = ['ba', 'chalten', 'calafate', 'natales', 'paine', 'mendoza', 'uco'];
const MODE = { flight: '#6366f1', bus: '#f59e0b', boat: '#06b6d4', car: '#64748b', hike: '#16a34a' };
const MICON = { flight: 'plane', bus: 'bus', boat: 'ship', transfer: 'car-taxi-front', car: 'car-taxi-front', hike: 'footprints' };
const S = {
  nl: {
    title: 'Volg Martine & Thijs', live: 'Live', before: 'Nog even geduld', beforeH: 'Over {n} dagen vertrekken ze', beforeLead: 'Op 29 november vliegen Martine en Thijs naar Buenos Aires. Hier zie je straks elke dag waar ze zijn.', nowIn: 'Nu in {p}', nowLead: 'Dag {i} van {n}: {t}', home: 'Weer thuis', homeH: 'Ze zijn weer thuis!', homeLead: '23 dagen Argentinië en Chili zitten erop. Scroll door hun dagboek.',
    localTime: 'Tijd daar', diff: '{h} uur eerder dan in Nederland', weather: 'Weer nu', avg: 'Gemiddeld in december', rain: '{p}% kans op regen', journey: 'De reis', day: 'Dag {i}', of: 'van {n}', stage: 'Etappe {i} van {n}',
    plan: 'Vandaag', tomorrow: 'Morgen', nothing: 'Geen reizen vandaag: tijd om de omgeving te verkennen.', route: 'De route', done: 'Gereisd', upcoming: 'Nog te gaan', here: 'Hier zijn ze', journal: 'Dagboek', noCi: 'Nog geen berichtjes. Zodra Martine of Thijs een check-in plaatst, verschijnt die hier.', itinerary: 'Het hele programma', stays: 'Waar ze slapen', staysSub: 'Voor noodgevallen', call: 'Bel',
    install: 'Tip: zet deze pagina op je beginscherm', installSub: 'Tik in Safari op de deelknop en kies "Zet op beginscherm". Dan open je hem voortaan met één tik.', invalid: 'Deze link is niet compleet', invalidSub: 'Vraag Martine of Thijs om de link nog een keer te sturen.', updated: 'Bijgewerkt {t}', wholeRoute: 'Hele route', footer: 'Gemaakt door Martine & Thijs (met een beetje hulp van Claude). Alleen te zien met deze link.', ago: '{t} geleden', justNow: 'zojuist', min: 'min', hr: 'u', d: 'd', locShared: 'Locatie gedeeld', sleep: 'Slapen', nights: '{n} nachten', night: '1 nacht',
    flight: 'Vlucht', bus: 'Bus', boat: 'Boot', car: 'Auto', hike: 'Wandelen',
    wmo: { 0: 'Zonnig', 1: 'Vrijwel zonnig', 2: 'Half bewolkt', 3: 'Bewolkt', 45: 'Mist', 48: 'Mist', 51: 'Motregen', 53: 'Motregen', 55: 'Motregen', 61: 'Lichte regen', 63: 'Regen', 65: 'Zware regen', 71: 'Lichte sneeuw', 73: 'Sneeuw', 75: 'Zware sneeuw', 80: 'Buien', 81: 'Buien', 82: 'Zware buien', 95: 'Onweer', 96: 'Onweer', 99: 'Onweer' },
    days: ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'], months: ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
  },
  en: {
    title: 'Follow Martine & Thijs', live: 'Live', before: 'Almost there', beforeH: 'They leave in {n} days', beforeLead: 'On 29 November Martine and Thijs fly to Buenos Aires. Every day of the trip you can see where they are, right here.', nowIn: 'Now in {p}', nowLead: 'Day {i} of {n}: {t}', home: 'Back home', homeH: "They're back home!", homeLead: '23 days of Argentina and Chile are done. Scroll through their journal.',
    localTime: 'Time there', diff: '{h} hours behind the Netherlands', weather: 'Weather now', avg: 'Average in December', rain: '{p}% chance of rain', journey: 'The journey', day: 'Day {i}', of: 'of {n}', stage: 'Stage {i} of {n}',
    plan: 'Today', tomorrow: 'Tomorrow', nothing: 'No travel today: time to explore.', route: 'The route', done: 'Travelled', upcoming: 'Still to come', here: "They're here", journal: 'Journal', noCi: 'No updates yet. As soon as Martine or Thijs checks in, it will show up here.', itinerary: 'The full itinerary', stays: 'Where they sleep', staysSub: 'For emergencies', call: 'Call',
    install: 'Tip: add this page to your home screen', installSub: 'In Safari, tap the share button and choose "Add to Home Screen". Then it opens with one tap.', invalid: 'This link is incomplete', invalidSub: 'Ask Martine or Thijs to send the link again.', updated: 'Updated {t}', wholeRoute: 'Whole route', footer: 'Made by Martine & Thijs (with a little help from Claude). Only visible with this link.', ago: '{t} ago', justNow: 'just now', min: 'min', hr: 'h', d: 'd', locShared: 'Location shared', sleep: 'Sleeping', nights: '{n} nights', night: '1 night',
    flight: 'Flight', bus: 'Bus', boat: 'Boat', car: 'Car', hike: 'Hiking',
    wmo: { 0: 'Sunny', 1: 'Mostly sunny', 2: 'Partly cloudy', 3: 'Cloudy', 45: 'Fog', 48: 'Fog', 51: 'Drizzle', 53: 'Drizzle', 55: 'Drizzle', 61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 71: 'Light snow', 73: 'Snow', 75: 'Heavy snow', 80: 'Showers', 81: 'Showers', 82: 'Heavy showers', 95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm' },
    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
};
let LANG = (() => { try { return localStorage.getItem('volgLang') || 'nl'; } catch { return 'nl'; } })();
const s = (k, v = {}) => Array.isArray(S[LANG][k]) ? S[LANG][k] : String(S[LANG][k] ?? S.nl[k] ?? k).replace(/\{(\w+)\}/g, (_, x) => v[x] ?? '');
const $ = q => document.querySelector(q);
const esc = x => String(x ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ic = (n, c = '') => `<svg class="ico ${c}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const b64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
const b64url = s => b64(s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - s.length % 4) % 4));
const parseD = x => { const [y, m, d] = x.split('-').map(Number); return new Date(y, m - 1, d); };
const fmt = x => { const d = parseD(x); return `${s('days')[d.getDay()]} ${d.getDate()} ${s('months')[d.getMonth()]}`; };
const todayThere = () => { try { const d = localStorage.getItem('volgDebugDate'); if (d) return d; } catch {} return new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date()); };
const lx = o => o && typeof o === 'object' ? (o[LANG] || o.nl) : o;
const dur = ms => { const m = Math.round(ms / 60000); if (m < 60) return `${m} ${s('min')}`; const h = Math.round(m / 60); return h < 48 ? `${h} ${s('hr')}` : `${Math.round(h / 24)} ${s('d')}`; };
const ago = ts => Date.now() - ts < 90e3 ? s('justNow') : s('ago', { t: dur(Date.now() - ts) });
const S_ = { key: null, raw: null, D: null, cis: [], wx: null };

async function boot() {
  fetch('icons.svg').then(r => r.text()).then(x => document.body.insertAdjacentHTML('afterbegin', x)).catch(() => {});
  const frag = location.hash.slice(1).trim();
  if (!/^[A-Za-z0-9_-]{40,}$/.test(frag)) return lock();
  try {
    S_.raw = b64url(frag);
    S_.key = await crypto.subtle.importKey('raw', S_.raw, 'AES-GCM', false, ['decrypt']);
    const enc = await fetch('family.enc.json', { cache: 'no-cache' }).then(r => r.json());
    const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(enc.iv) }, S_.key, b64(enc.ct));
    S_.D = JSON.parse(new TextDecoder().decode(pt));
    try { localStorage.setItem('volgData', JSON.stringify(S_.D)); } catch {}
  } catch {
    try { S_.D = JSON.parse(localStorage.getItem('volgData')); } catch {}
    if (!S_.D || !S_.key) return lock();
  }
  try { S_.cis = JSON.parse(localStorage.getItem('volgCi') || '[]'); } catch {}
  render();
  loadCheckins(); loadWeather();
  setInterval(loadCheckins, 90000);
  setInterval(tickClock, 15000);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') loadCheckins(); });
}
function lock() { $('#app').innerHTML = `<div class="lock"><div><div style="font-size:44px">🧭</div><h1 style="font-family:var(--serif)">${s('invalid')}</h1><p class="muted">${s('invalidSub')}</p></div></div>`; }

/* ---------- status ---------- */
function status() {
  const D = S_.D, td = todayThere(), { start, end } = D.meta;
  if (td < start) return { phase: 'before', n: Math.ceil((parseD(start) - parseD(td)) / 864e5) };
  if (td > end) return { phase: 'after' };
  const i = D.days.findIndex(d => d.date === td);
  return { phase: 'now', i, day: D.days[i], place: D.places.find(p => p.id === D.days[i].placeId) };
}
const placeById = id => S_.D.places.find(p => p.id === id);

/* ---------- render ---------- */
function render() {
  const D = S_.D, st = status(), n = D.days.length;
  document.documentElement.lang = LANG; document.title = s('title');
  const heroPlace = st.phase === 'now' ? st.place : st.phase === 'before' ? placeById('ba') : placeById('uco');
  let eyebrow, h1, lead;
  if (st.phase === 'before') { eyebrow = `${ic('plane', 'sm')} ${s('before')}`; h1 = s('beforeH', { n: st.n }); lead = s('beforeLead'); }
  else if (st.phase === 'after') { eyebrow = `${ic('house', 'sm')} ${s('home')}`; h1 = s('homeH'); lead = s('homeLead'); }
  else { eyebrow = `${ic('map-pin', 'sm')} ${s('nowIn', { p: esc(heroPlace?.name || lx(st.day.place)) })}`; h1 = esc(lx(st.day.title)); lead = s('nowLead', { i: st.i + 1, n, t: esc(lx(st.day.place)) }); }
  const ci = S_.cis[0];
  let h = `<header class="hero" style="background-image:url(img/${heroPlace?.img || 'paine'}.webp)">
    <div class="top"><div class="brand"><span class="dot"></span>Martine & Thijs</div><div class="lang">${['nl', 'en'].map(l => `<button data-l="${l}" class="${l === LANG ? 'on' : ''}">${l.toUpperCase()}</button>`).join('')}</div></div>
    <div class="eyebrow">${eyebrow}</div><h1>${h1}</h1><p class="lead">${lead}</p>
    <div class="pills"><span class="pill">${ic('clock', 'sm')} <span id="clock">${clock()}</span></span><span class="pill" id="wxpill" ${S_.wx ? '' : 'hidden'}>${wxPill()}</span>${ci ? `<span class="pill">${ic('radio', 'sm')} ${esc(ago(ci.at))}</span>` : ''}</div>
  </header><div class="wrap">`;
  // reisbalk
  const pct = st.phase === 'before' ? 0 : st.phase === 'after' ? 100 : Math.round((st.i + 0.5) / n * 100);
  const curStage = st.phase === 'now' ? ORDER.indexOf(st.day.placeId) : -1;
  h += `<div class="card journey reveal"><div class="journey-head"><strong>${st.phase === 'now' ? s('day', { i: st.i + 1 }) + ' <span class="muted" style="font-weight:600">' + s('of', { n }) + '</span>' : s('journey')}</strong><span class="tiny muted">29 nov – 21 dec</span></div>
    <div class="bar"><i style="width:${pct}%"></i>${st.phase === 'now' ? `<b style="left:${pct}%"></b>` : ''}</div>
    <div class="stages">${ORDER.map((id, k) => { const p = placeById(id); const done = st.phase === 'after' || (st.phase === 'now' && p.dates[1] <= st.day.date && k !== curStage); return `<span class="${k === curStage ? 'now' : done ? 'done' : ''}" style="--c:var(--p-${id})">${esc(p.name.replace('Torres del ', '').replace('Puerto ', '').replace('Valle de ', ''))}</span>`; }).join('')}</div></div>`;
  if (/iphone|ipad/i.test(navigator.userAgent) && !navigator.standalone && !localStorage.getItem('volgInstallHidden')) h += `<div class="card install reveal">${ic('sparkles')}<div><strong>${s('install')}</strong><div class="tiny muted">${s('installSub')}</div></div><button id="instx" aria-label="x">×</button></div>`;
  // vandaag + morgen
  if (st.phase === 'now') {
    const tm = D.days[st.i + 1];
    h += `<div class="grid2 reveal"><div class="card"><div class="k">${ic('clock', 'sm')} ${s('localTime')}</div><div class="big" id="clock2">${clock()}</div><div class="tiny muted">${s('diff', { h: diffHours() })}</div></div>
      <div class="card" id="wxcard">${wxCard(st.day.placeId)}</div></div>`;
    h += `<h2 class="sec">${ic('sun')} ${s('plan')} <small>${esc(fmt(st.day.date))}</small></h2>${dayCard(st.day)}`;
    if (tm) h += `<h2 class="sec">${ic('sunrise')} ${s('tomorrow')} <small>${esc(fmt(tm.date))}</small></h2>${dayCard(tm)}`;
  }
  // kaart
  h += `<h2 class="sec">${ic('route')} ${s('route')}</h2><div id="map" class="reveal"></div>
    <div class="legend"><span><i style="background:var(--text)"></i>${s('done')}</span><span><i style="background:repeating-linear-gradient(90deg,var(--muted) 0 4px,transparent 4px 8px)"></i>${s('upcoming')}</span>${Object.entries(MODE).map(([m, c]) => `<span><i style="background:${c}"></i>${s(m)}</span>`).join('')}</div>`;
  // dagboek
  h += `<h2 class="sec">${ic('notebook-pen')} ${s('journal')} <small id="ciUpd"></small></h2><div id="cis">${cisHtml()}</div>`;
  // programma
  h += `<h2 class="sec">${ic('calendar-days')} ${s('itinerary')}</h2><div class="card"><ul class="days">${D.days.map((d, k) => { const dd = parseD(d.date), td = todayThere();
    return `<li class="${d.date < td ? 'past' : d.date === td ? 'now' : ''}"><div class="db" style="background:var(--p-${d.placeId || 'ba'})"><span>${s('days')[dd.getDay()]}</span><b>${dd.getDate()}</b></div><div><strong>${esc(lx(d.title))}</strong><div class="tiny muted">${esc(lx(d.place))}</div>${d.moves.length ? `<div>${d.moves.map(m => `<span class="tag">${ic(MICON[m.type] || 'route', 'sm')} ${esc(m.dep.replace('~', ''))}</span>`).join(' ')}</div>` : ''}</div></li>`; }).join('')}</ul></div>`;
  // verblijven
  h += `<h2 class="sec">${ic('bed-double')} ${s('stays')} <small>${s('staysSub')}</small></h2><div class="card">${D.stays.map(x => { const nn = Math.round((parseD(x.out) - parseD(x.in)) / 864e5);
    return `<div class="stay"><div class="mi" style="background:var(--p-${D.days.find(d => d.sleep === x.id)?.placeId || 'ba'})">${ic(/camp|refug|paine|grande|chileno|cuernos|central|torres|frances|domos/i.test(x.name) ? 'tent' : 'bed-double')}</div><div style="flex:1;min-width:0"><strong>${esc(x.name)}</strong><div class="tiny muted">${esc(fmt(x.in))} · ${nn === 1 ? s('night') : s('nights', { n: nn })}</div></div>${x.phone ? `<a class="btn" href="tel:${esc(x.phone.replace(/[^+\d]/g, ''))}">${ic('phone', 'sm')} ${s('call')}</a>` : ''}</div>`; }).join('')}</div>`;
  h += `<footer>${s('footer')}</footer></div>`;
  $('#app').innerHTML = h;
  document.querySelectorAll('[data-l]').forEach(b => b.onclick = () => { LANG = b.dataset.l; try { localStorage.setItem('volgLang', LANG); } catch {} render(); });
  if ($('#instx')) $('#instx').onclick = () => { try { localStorage.setItem('volgInstallHidden', 1); } catch {} $('#instx').closest('.install').remove(); };
  drawMap(st);
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -40px 0px' }) : null;
  document.querySelectorAll('.reveal').forEach(el => io ? io.observe(el) : el.classList.add('in'));
  setTimeout(() => document.querySelectorAll('.reveal').forEach(el => el.classList.add('in')), 1500);
}
function dayCard(d) {
  const p = placeById(d.placeId), st = d.sleep && S_.D.stays.find(x => x.id === d.sleep);
  return `<div class="card today-plan reveal">${d.moves.length ? d.moves.map(m => `<div class="move"><div class="mi" style="background:${MODE[m.type === 'transfer' ? 'car' : m.type] || MODE.car}">${ic(MICON[m.type] || 'route')}</div><div style="flex:1;min-width:0"><strong>${esc(m.title)}</strong><div class="tiny muted">${esc(m.dep.replace('~', ''))}${m.arr ? ' → ' + esc(m.arr.replace('~', '')) : ''}</div></div></div>`).join('') : `<p class="muted" style="margin:0">${s('nothing')}</p>`}
    ${st ? `<div class="move"><div class="mi" style="background:var(--p-${d.placeId})">${ic('bed-double')}</div><div><div class="tiny muted">${s('sleep')}</div><strong>${esc(st.name)}</strong></div></div>` : ''}</div>`;
}
function clock() { return new Intl.DateTimeFormat(LANG === 'nl' ? 'nl-NL' : 'en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit' }).format(new Date()); }
function diffHours() { const n = new Date(), a = new Date(n.toLocaleString('en-US', { timeZone: TZ })), b = new Date(n.toLocaleString('en-US', { timeZone: 'Europe/Amsterdam' })); return Math.round((b - a) / 36e5); }
function tickClock() { for (const id of ['clock', 'clock2']) { const el = document.getElementById(id); if (el) el.textContent = clock(); } }

/* ---------- weer ---------- */
const WICON = c => c === 0 || c === 1 ? 'sun' : c === 2 ? 'cloud-sun' : c === 3 ? 'cloud' : c <= 48 ? 'cloud-fog' : c <= 57 ? 'cloud-drizzle' : c <= 67 || (c >= 80 && c <= 82) ? 'cloud-rain' : c <= 77 ? 'cloud-snow' : 'cloud-lightning';
async function loadWeather() {
  const st = status(); if (st.phase !== 'now' || !st.place) return;
  const [lat, lon] = st.place.center;
  try {
    const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_gusts_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=1`).then(r => r.json());
    S_.wx = { t: r.current.temperature_2m, code: r.current.weather_code, gust: r.current.wind_gusts_10m, max: r.daily.temperature_2m_max[0], min: r.daily.temperature_2m_min[0], rain: r.daily.precipitation_probability_max[0] };
    if ($('#wxpill')) { $('#wxpill').hidden = false; $('#wxpill').innerHTML = wxPill(); }
    if ($('#wxcard')) $('#wxcard').innerHTML = wxCard(st.day.placeId);
  } catch {}
}
function wxPill() { const w = S_.wx; return w ? `${ic(WICON(w.code), 'sm')} ${Math.round(w.t)}°` : ''; }
function wxCard(pid) {
  const w = S_.wx, c = S_.D.climate?.[pid];
  if (w) return `<div class="k">${ic(WICON(w.code), 'sm')} ${s('weather')}</div><div class="big">${Math.round(w.t)}° <small>${Math.round(w.min)}°/${Math.round(w.max)}°</small></div><div class="tiny muted">${esc(S[LANG].wmo[w.code] || '')} · ${s('rain', { p: w.rain ?? 0 })}</div>`;
  if (c) return `<div class="k">${ic('cloud-sun', 'sm')} ${s('avg')}</div><div class="big">${Math.round(c.tmax)}° <small>${Math.round(c.tmin)}°</small></div>`;
  return '';
}

/* ---------- check-ins ---------- */
async function loadCheckins() {
  const c = window.SYNC; if (!c?.url || !navigator.onLine) return;
  try {
    const h = await crypto.subtle.digest('SHA-256', new Uint8Array([...S_.raw, ...new TextEncoder().encode('|family')]));
    const room = [...new Uint8Array(h)].map(b => b.toString(16).padStart(2, '0')).join('');
    const r = await fetch(`${c.url}/rest/v1/rpc/kv_get`, { method: 'POST', headers: { apikey: c.key, Authorization: `Bearer ${c.key}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ p_room: room }) });
    if (!r.ok) return;
    const rows = await r.json(), out = [];
    for (const row of rows || []) {
      if (!row.k.startsWith('ci:')) continue;
      try { const [iv, ct] = row.v.split('.'); const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(iv) }, S_.key, b64(ct)); const v = JSON.parse(new TextDecoder().decode(pt)); if (!v.deleted) out.push(v); } catch {}
    }
    out.sort((a, b) => b.at - a.at);
    const changed = JSON.stringify(out.map(x => x.at)) !== JSON.stringify(S_.cis.map(x => x.at));
    S_.cis = out;
    try { localStorage.setItem('volgCi', JSON.stringify(out.map(x => ({ ...x, photo: null })))); } catch {}
    if (changed || out.some(x => x.photo)) { const box = $('#cis'); if (box) box.innerHTML = cisHtml(); drawMe(); }
    if ($('#ciUpd')) $('#ciUpd').textContent = s('updated', { t: clock() });
  } catch {}
}
function cisHtml() {
  if (!S_.cis.length) return `<div class="card empty">${ic('camera')}<p style="margin:8px 0 0">${s('noCi')}</p></div>`;
  return S_.cis.slice(0, 40).map(c => { const p = c.place && placeById(c.place);
    return `<article class="ci">${c.photo ? `<img src="${c.photo}" alt="" loading="lazy">` : ''}<div class="b"><div class="h"><div class="av">${esc((c.by || '?')[0])}</div><div style="flex:1"><strong>${esc(c.by || '')}</strong><div class="tiny muted">${p ? esc(p.name) + ' · ' : ''}${esc(fmt(new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date(c.at))))}, ${new Intl.DateTimeFormat(LANG === 'nl' ? 'nl-NL' : 'en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit' }).format(new Date(c.at))} · ${esc(ago(c.at))}</div></div>${c.lat ? `<a class="btn" href="https://maps.apple.com/?ll=${c.lat},${c.lon}&q=Martine%20%26%20Thijs" target="_blank" rel="noopener">${ic('map-pin', 'sm')}</a>` : ''}</div>${c.msg ? `<p>${esc(c.msg)}</p>` : ''}</div></article>`; }).join('');
}

/* ---------- kaart ---------- */
let MAP = null, ME = null;
function drawMap(st) {
  if (!window.L || !$('#map')) return;
  if (MAP) { MAP.remove(); MAP = null; ME = null; }
  const D = S_.D, td = todayThere();
  MAP = L.map('map', { zoomControl: false, attributionControl: true, scrollWheelZoom: false, tap: true });
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 16, attribution: '© OpenStreetMap', className: 'osm' }).addTo(MAP);
  const all = [];
  for (const l of D.routes.legs) {
    const done = st.phase === 'after' || (l.date && l.date < td), today = l.date === td;
    const color = MODE[l.mode] || MODE.car;
    all.push(...l.line);
    L.polyline(l.line, { color: '#fff', weight: 7, opacity: done || today ? .9 : .5, interactive: false }).addTo(MAP);
    L.polyline(l.line, { color, weight: 4, opacity: done || today ? 1 : .55, dashArray: done ? null : '4 8', className: today ? 'flow' : '' }).bindTooltip(esc(l.title || ''), { sticky: true }).addTo(MAP);
  }
  ORDER.forEach((id, k) => { const p = placeById(id); L.marker(p.center, { icon: L.divIcon({ className: '', html: `<div class="stop-pin" style="background:var(--p-${id})">${k + 1}</div>`, iconSize: [26, 26], iconAnchor: [13, 13] }) }).bindPopup(`<strong>${esc(p.name)}</strong><br><span class="tiny muted">${esc(fmt(p.dates[0]))} – ${esc(fmt(p.dates[1]))}</span>`).addTo(MAP); all.push(p.center); });
  const whole = L.latLngBounds(all);
  MAP.fitBounds(whole, { padding: [24, 24] });
  const Btn = L.Control.extend({ onAdd() { const b = L.DomUtil.create('button', 'mapbtn'); b.textContent = s('wholeRoute'); L.DomEvent.on(b, 'click', e => { L.DomEvent.stop(e); MAP.flyToBounds(whole, { padding: [24, 24], duration: 1.2 }); }); return b; } });
  new Btn({ position: 'topright' }).addTo(MAP);
  drawMe(st);
  if (st.phase === 'now' && ME) MAP.setView(ME.getLatLng(), 8, { animate: false });
}
function drawMe(st = status()) {
  if (!MAP) return;
  const recent = S_.cis.find(c => c.lat && Date.now() - c.at < 36 * 3600e3);
  let ll = recent ? [recent.lat, recent.lon] : null;
  if (!ll && st.phase === 'now') { const sl = st.day.sleep && S_.D.stays.find(x => x.id === st.day.sleep); ll = sl?.ll || st.place?.center; }
  if (!ll) return;
  if (ME) ME.setLatLng(ll); else ME = L.marker(ll, { zIndexOffset: 1000, icon: L.divIcon({ className: '', html: '<div class="me-pin"></div>', iconSize: [22, 22], iconAnchor: [11, 11] }) }).bindPopup(`<strong>${s('here')}</strong>${recent ? `<br><span class="tiny muted">${esc(ago(recent.at))}</span>` : ''}`).addTo(MAP);
}

window.addEventListener('hashchange', () => location.reload());
document.addEventListener('DOMContentLoaded', boot);
