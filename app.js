'use strict';
/* Reis-app Argentinië & Chili — Martine & Thijs.
   Reisgegevens staan versleuteld in data.enc.json; de code wordt één keer per toestel gevraagd.
   Vinkjes, paklijst en notities worden versleuteld gedeeld via Supabase (config.js).
   Interface in NL/EN/ES (i18n.js); inhoud per taal in de versleutelde data. */

const $ = (s, el = document) => el.querySelector(s);
const view = $('#view');
const store = {
  get(k, d = null) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  del(k) { try { localStorage.removeItem(k); } catch {} },
};
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ic = (n, cls = '') => `<svg class="ico ${cls}"><use href="#i-${n}"/></svg>`;

/* ================= taal ================= */
const LANGS = { nl: 'Nederlands', en: 'English', es: 'Español' };
let LANG = store.get('lang') || 'nl';
const t = (k, v = {}) => String((I18N[LANG] || I18N.nl)[k] ?? I18N.nl[k] ?? k).replace(/\{(\w+)\}/g, (_, x) => v[x] ?? '');
const L = o => o && typeof o === 'object' ? (o[LANG] ?? o.nl ?? o.en ?? '') : (o ?? '');
document.documentElement.lang = LANG;

let BASE = null, T = null, PL = [], RT = null, CL = {}, AR = [], PH = null, KEY = null;
const PROTECT = new Set(['id', 'ref', 'hike', 'sleep', 'placeId', 'img', 'icon', 'who', 'status', 'type', 'date', 'in', 'out', 'start', 'end', 'updated', 'value',
  'address', 'q', 'll', 'center', 'zoom', 'dates', 'country', 'carrier', 'number', 'dep', 'booking', 'qr', 'web', 'phone', 'messages', 'time', 'photo', 'message', 'travelers']);
function overlay(base, tr) {
  if (Array.isArray(base)) return base.map((x, i) => overlay(x, Array.isArray(tr) ? tr[i] : undefined));
  if (base && typeof base === 'object') { const o = {}; for (const k of Object.keys(base)) o[k] = PROTECT.has(k) || !tr || typeof tr !== 'object' ? base[k] : overlay(base[k], tr[k]); return o; }
  return typeof base === 'string' && typeof tr === 'string' && tr.trim() ? tr : base;
}
function applyLang() {
  const tr = BASE.i18n?.[LANG] || {};
  T = LANG === 'nl' ? BASE.trip : overlay(BASE.trip, tr.trip);
  PL = LANG === 'nl' ? BASE.places : overlay(BASE.places, tr.places);
  document.documentElement.lang = LANG;
  for (const [k, key] of [['vandaag', 'navToday'], ['kaart', 'navMap'], ['agenda', 'navAgenda'], ['plekken', 'navPlaces'], ['meer', 'navMore']]) { const s = document.querySelector(`.nav a[data-tab=${k}] span`); if (s) s.textContent = t(key); }
  $('#offline').textContent = t('offline');
}

/* ================= crypto ================= */
const b64 = { dec: s => Uint8Array.from(atob(s), c => c.charCodeAt(0)), enc: a => { let s = ''; new Uint8Array(a).forEach(b => s += String.fromCharCode(b)); return btoa(s); } };
async function deriveKey(code, salt, iter) {
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(code.trim().toLowerCase()), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: iter, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
}
async function decryptJSON(key, ivB64, ctB64) {
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64.dec(ivB64) }, key, b64.dec(ctB64));
  return JSON.parse(new TextDecoder().decode(pt));
}
async function encryptJSON(key, obj) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(JSON.stringify(obj)));
  return b64.enc(iv) + '.' + b64.enc(ct);
}
async function loadEnc() {
  const r = await fetch('data.enc.json', { cache: 'no-cache' }).catch(() => null);
  if (r && r.ok) return r.json();
  const c = await caches.match('data.enc.json');
  if (c) return c.json();
  throw new Error(t('noData'));
}
async function unlock() {
  const enc = await loadEnc();
  const saved = store.get('key');
  if (saved && saved.salt === enc.salt) {
    try {
      const key = await crypto.subtle.importKey('raw', b64.dec(saved.raw), 'AES-GCM', true, ['encrypt', 'decrypt']);
      return { key, data: await decryptJSON(key, enc.iv, enc.ct) };
    } catch { store.del('key'); }
  }
  return new Promise(resolve => showLock(enc, resolve));
}
const langPicker = () => `<div class="langs">${Object.entries(LANGS).map(([k, n]) => `<button data-lang="${k}" class="${LANG === k ? 'on' : ''}">${{ nl: '🇳🇱', en: '🇬🇧', es: '🇦🇷' }[k]} ${n}</button>`).join('')}</div>`;
function bindLang(after) { view.querySelectorAll('[data-lang]').forEach(b => b.onclick = () => { LANG = b.dataset.lang; store.set('lang', LANG); if (BASE) applyLang(); after(); }); }
function showLock(enc, resolve) {
  setChrome('', { hideNav: true, hideBar: true });
  view.innerHTML = `<div class="lock">${langPicker()}
    <div style="font-size:40px">🇦🇷 🇨🇱</div><h2>${t('lockTitle')}</h2><p>${t('lockIntro')}</p>
    <input id="code" type="password" autocomplete="off" autocapitalize="none" placeholder="${t('code')}" aria-label="${t('code')}">
    <button class="btn" id="go">${t('open')}</button><div class="err" id="err"></div></div>`;
  bindLang(() => showLock(enc, resolve));
  const go = async () => {
    $('#err').textContent = ''; $('#go').textContent = t('busy');
    try {
      const key = await deriveKey($('#code').value, b64.dec(enc.salt), enc.iter);
      const data = await decryptJSON(key, enc.iv, enc.ct);
      store.set('key', { salt: enc.salt, raw: b64.enc(await crypto.subtle.exportKey('raw', key)) });
      resolve({ key, data });
    } catch { $('#go').textContent = t('open'); $('#err').textContent = t('wrongCode'); }
  };
  $('#go').onclick = go;
  $('#code').addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
}

/* ================= gedeelde staat (Supabase) ================= */
const Sync = {
  cfg: () => window.SYNC && window.SYNC.url && window.SYNC.key ? window.SYNC : null,
  room: null,
  data() { return store.get('shared', {}); },
  get(k, d = null) { const e = this.data()[k]; return e ? e.v : d; },
  meta(k) { return this.data()[k] || null; },
  set(k, v) {
    const all = this.data(), now = Date.now();
    all[k] = { v, t: now, by: store.get('me', '') };
    store.set('shared', all);
    const out = store.get('outbox', {}); out[k] = all[k]; store.set('outbox', out);
    this.flush();
  },
  async rpc(fn, body) {
    const c = this.cfg();
    const r = await fetch(`${c.url}/rest/v1/rpc/${fn}`, { method: 'POST', headers: { apikey: c.key, Authorization: `Bearer ${c.key}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!r.ok) throw new Error('sync ' + r.status);
    return r.status === 204 ? null : r.json();
  },
  async init() {
    if (!this.cfg()) return;
    const raw = await crypto.subtle.exportKey('raw', KEY).catch(() => null);
    if (!raw) return;
    const h = await crypto.subtle.digest('SHA-256', new Uint8Array([...new Uint8Array(raw), ...new TextEncoder().encode('|room')]));
    this.room = [...new Uint8Array(h)].map(b => b.toString(16).padStart(2, '0')).join('');
    $('#syncdot').hidden = false;
    await this.pull(); this.flush();
    setInterval(() => { if (document.visibilityState === 'visible') this.pull(); }, 30000);
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') { this.pull(); this.flush(); } });
    window.addEventListener('online', () => { this.flush(); this.pull(); });
  },
  async flush() {
    if (!this.room || !navigator.onLine) return;
    const out = store.get('outbox', {});
    for (const [k, e] of Object.entries(out)) {
      try {
        await this.rpc('kv_set', { p_room: this.room, p_k: k, p_v: await encryptJSON(KEY, { v: e.v, by: e.by }), p_t: e.t });
        const cur = store.get('outbox', {}); if (cur[k] && cur[k].t === e.t) { delete cur[k]; store.set('outbox', cur); }
        this.ok(true);
      } catch { this.ok(false); return; }
    }
  },
  async pull() {
    if (!this.room || !navigator.onLine) return;
    try {
      const rows = await this.rpc('kv_get', { p_room: this.room });
      const all = this.data(); let changed = false;
      for (const r of rows || []) {
        const ts = Number(r.t), loc = all[r.k];
        if (loc && loc.t >= ts) continue;
        try { const [iv, ct] = r.v.split('.'); const d = await decryptJSON(KEY, iv, ct); all[r.k] = { v: d.v, t: ts, by: d.by }; changed = true; } catch {}
      }
      if (changed) { store.set('shared', all); if (/^#\/(todo|notities|vandaag|meer|pakken)/.test(location.hash || '#/vandaag') && !document.activeElement?.matches('textarea,input')) route(true); }
      this.ok(true);
    } catch { this.ok(false); }
  },
  ok(on) { $('#syncdot').classList.toggle('on', on); },
};

/* ================= datums ================= */
const days = () => (I18N[LANG] || I18N.nl)._days, daysLong = () => (I18N[LANG] || I18N.nl)._daysLong, months = () => (I18N[LANG] || I18N.nl)._months;
const parseD = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const fmt = (s, long) => { const d = parseD(s); return `${(long ? daysLong() : days())[d.getDay()]} ${d.getDate()} ${months()[d.getMonth()]}`; };
const range = (a, b) => { const A = parseD(a), B = parseD(b), M = months(); return A.getMonth() === B.getMonth() ? `${A.getDate()}–${B.getDate()} ${M[B.getMonth()]}` : `${A.getDate()} ${M[A.getMonth()]} – ${B.getDate()} ${M[B.getMonth()]}`; };
function now() {
  const o = new URLSearchParams(location.search).get('d') || store.get('debugDate');
  if (o) { const d = parseD(o), n = new Date(); d.setHours(n.getHours(), n.getMinutes()); return d; }
  return new Date();
}
const todayIso = () => iso(now());
const dayDiff = (a, b) => Math.round((parseD(a) - parseD(b)) / 864e5);

/* ================= opzoeken ================= */
const byId = id => T.transport.find(x => x.id === id) || T.other.find(x => x.id === id) || T.stays.find(x => x.id === id);
const stay = id => T.stays.find(s => s.id === id);
const hike = id => T.hikes.find(h => h.id === id);
const place = id => PL.find(p => p.id === id);
const pcolor = id => id ? `var(--p-${id})` : 'var(--m-car)';
const img = p => p ? `img/${p.img}.webp` : '';
const TYPE = () => ({ flight: t('tFlight'), bus: t('tBus'), boat: t('tBoat'), transfer: t('tTransfer'), ticket: t('tTicket'), stay: t('tStay') });
const TICON = { flight: 'plane', bus: 'bus', boat: 'ship', transfer: 'car-taxi-front', ticket: 'ticket', stay: 'bed-double', hike: 'footprints', note: 'info', todo: 'circle-alert' };
const PICON = { ba: 'landmark', chalten: 'mountain-snow', calafate: 'sparkles', natales: 'waves', paine: 'tent', mendoza: 'wine', uco: 'sunrise' };
const PSHORT = { ba: 'BA', chalten: 'Chaltén', calafate: 'Calafate', natales: 'Natales', paine: 'Paine', mendoza: 'Mendoza', uco: 'Uco' };
const ORDER = ['ba', 'chalten', 'calafate', 'natales', 'paine', 'mendoza', 'uco'];
const mapsUrl = (q, ll) => ll ? `https://www.google.com/maps/search/?api=1&query=${ll[0]},${ll[1]}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
const bookingUrl = u => u.replace(/\.html$/, { nl: '.nl.html', en: '.en-gb.html', es: '.es.html' }[LANG]);
const tel = p => `tel:${p.replace(/[^+\d]/g, '')}`;
const status = s => s === 'todo' ? `<span class="badge todo">${ic('circle-alert', 'sm')}${t('stTodo')}</span>` : s === 'ok' ? `<span class="badge ok">${ic('check', 'sm')}${t('stOk')}</span>` : '';
const isTodoDay = d => d.items.some(it => it.status === 'todo' || (it.ref && byId(it.ref)?.status === 'todo'));
const flag = c => c === 'CL' ? '🇨🇱' : '🇦🇷';
const photoCredit = ph => ph ? `<a class="credit" href="${esc(ph.page)}" target="_blank" rel="noopener">${t('photo')}: ${esc(ph.author || 'Wikimedia Commons')}${ph.license ? ', ' + esc(ph.license) : ''}</a>` : '';

/* ================= ui ================= */
function toast(msg) { const el = $('#toast'); el.textContent = msg; el.classList.add('show'); clearTimeout(toast.h); toast.h = setTimeout(() => el.classList.remove('show'), 1600); }
async function copy(text) {
  try { await navigator.clipboard.writeText(text); }
  catch { const a = document.createElement('textarea'); a.value = text; document.body.appendChild(a); a.select(); document.execCommand('copy'); a.remove(); }
  toast(t('copied'));
}
document.addEventListener('click', e => { const b = e.target.closest('[data-copy]'); if (b) { e.preventDefault(); copy(b.dataset.copy); } });
function setChrome(title, o = {}) {
  $('#title').textContent = title;
  $('#back').hidden = !o.back;
  $('#nav').style.display = o.hideNav ? 'none' : '';
  $('#topbar').style.display = o.hideBar ? 'none' : '';
  view.className = o.full ? 'full' : '';
  document.title = title ? `${title} · ${t('appName')}` : t('appName');
}
$('#back').onclick = () => history.length > 1 ? history.back() : (location.hash = '#/vandaag');
window.addEventListener('scroll', () => $('#topbar').classList.toggle('scrolled', scrollY > 4), { passive: true });
const codeBlock = codes => (codes || []).map(c => `<div class="code"><div class="grow"><div class="lbl">${esc(c.label)}</div><div class="val">${esc(c.value)}</div></div><button class="btn soft round" data-copy="${esc(c.value)}" aria-label="${t('copy')}">${ic('copy')}</button></div>`).join('');
const legsHtml = legs => (legs || []).map((l, i) => `<div class="leg">
  <div class="t">${esc(l.dep || '')}</div><div><div class="dot"></div><div class="line"></div></div><div><strong>${esc(l.from)}</strong></div>
  ${l.carrier || l.number ? `<div></div><div></div><div class="carrier">${ic(l.number ? 'plane' : 'bus', 'sm')} ${esc([l.carrier, l.number].filter(Boolean).join(' · '))}</div>` : ''}
  <div class="t">${esc(l.arr || '')}</div><div><div class="dot" style="background:var(--accent)"></div></div><div><strong>${esc(l.to)}</strong></div>
  </div>${i < legs.length - 1 ? `<div class="tiny muted" style="margin:10px 0 10px 64px">${t('transfer')}</div>` : ''}`).join('');

/* ================= tijdlijn ================= */
function tlItem(it) {
  if (it.ref) {
    const x = byId(it.ref); if (!x) return '';
    const first = x.legs?.[0] || {}, last = x.legs?.[x.legs.length - 1] || {};
    const times = [first.dep, last.arr].filter(Boolean).join(' → ');
    const nums = (x.legs || []).map(l => l.number).filter(Boolean).join(' + ');
    return `<div class="tl-item"><div class="tl-ico bg-${x.type}">${ic(TICON[x.type])}</div>
      <a class="tl-body" href="#/boeking/${esc(x.id)}"><div class="t"><span>${esc(times || TYPE()[x.type])}${nums ? ' · ' + esc(nums) : ''}</span>${status(x.status)}</div>
      <strong>${esc(x.title)}</strong>${x.codes?.length ? `<div class="tiny muted" style="margin-top:4px">${ic('ticket', 'sm')} ${x.codes.length === 1 ? t('codes1') : t('codesN', { n: x.codes.length })}</div>` : ''}</a></div>`;
  }
  if (it.hike) {
    const h = hike(it.hike);
    return `<div class="tl-item"><div class="tl-ico bg-hike">${ic('footprints')}</div><div class="tl-body"><div class="t"><span>${esc(h.approx)}</span></div><strong>${esc(h.name)}</strong>
      <ul>${h.notes.map(n => `<li>${esc(n)}</li>`).join('')}</ul></div></div>`;
  }
  const todo = it.status === 'todo';
  return `<div class="tl-item"><div class="tl-ico bg-${todo ? 'todo' : 'note'}">${ic(todo ? 'circle-alert' : 'info')}</div><div class="tl-body">
    ${it.time || todo ? `<div class="t"><span>${esc(it.time || '')}</span>${status(it.status)}</div>` : ''}<strong style="font-weight:600">${esc(it.text)}</strong></div></div>`;
}
const timeline = d => `<div class="tl">${d.items.map(tlItem).join('')}</div>`;
function stayCard(s, label = t('sleep')) {
  if (!s) return '';
  return `<div class="card stay-card">${s.photo ? `<a href="#/boeking/${esc(s.id)}" class="stay-img" style="background-image:url(${esc(s.photo)})"></a>` : ''}<div class="row"><div class="bubble" style="background:#0f766e;color:#fff;width:42px;height:42px;border-radius:14px;display:grid;place-items:center;flex:none">${ic('bed-double')}</div>
    <a class="grow" href="#/boeking/${esc(s.id)}" style="color:inherit"><div class="tiny muted" style="font-weight:700;text-transform:uppercase;letter-spacing:.04em">${esc(label)}</div><strong style="font-size:16px">${esc(s.name)}</strong>
    <div class="small muted">${esc(s.place)}${s.checkin ? ' · ' + t('checkinShort') + ' ' + esc(s.checkin) : ''}</div></a>
    <a class="btn soft round" href="${mapsUrl(s.address)}" target="_blank" rel="noopener" aria-label="${t('route')}">${ic('navigation')}</a></div></div>`;
}

/* ================= vandaag ================= */
function nextMove() {
  const n = now();
  return T.transport.map(x => {
    const dep = (x.legs?.[0]?.dep || '').replace('~', ''), d = parseD(x.date);
    if (/^\d{1,2}:\d{2}/.test(dep)) { const [hh, mm] = dep.split(':').map(Number); d.setHours(hh, mm); }
    else if (x.date <= todayIso()) return null;
    return { x, at: d };
  }).filter(o => o && o.at > n).sort((a, b) => a.at - b.at)[0];
}
function stageScroller() {
  return `<div class="hscroll">${ORDER.map((id, i) => { const p = place(id); return `<a class="stage" href="#/plek/${id}">
    <div class="img" style="background-image:url(${img(p)})"><div class="num">${i + 1}</div></div>
    <div class="body"><strong>${esc(p.name)}</strong><div class="small muted">${esc(range(p.dates[0], p.dates[1]))} · ${flag(p.country)}</div></div></a>`; }).join('')}</div>`;
}
function tiles() {
  const open = openTodoCount();
  const tile = (href, icon, color, label, badge) => `<a class="tile" href="${href}"><div class="bubble" style="background:${color};color:#fff">${ic(icon)}</div>${label}${badge ? `<span class="badge-n">${badge}</span>` : ''}</a>`;
  return `<div class="tiles">${tile('#/boekingen', 'ticket', 'var(--m-flight)', t('tileBookings'))}${tile('#/todo', 'list-checks', 'var(--todo)', t('tileTodo'), open)}${tile('#/weer', 'cloud-sun', 'var(--m-boat)', t('tileWeather'))}${tile('#/info', 'phone', '#e11d48', t('tileEmergency'))}</div>`;
}
function extrasRow() {
  return `<div class="duo"><a class="duo-card" href="#/leesvoer" style="background-image:linear-gradient(160deg,rgba(15,23,42,.15),rgba(15,23,42,.8)),url(img/calafate.webp)">${ic('notebook-pen')}<strong>${t('reading')}</strong><span>${t('readingSub')}</span></a>
    <a class="duo-card" href="#/spaans" style="background-image:linear-gradient(160deg,rgba(15,23,42,.15),rgba(15,23,42,.8)),url(img/buenosaires.webp)">${ic('music')}<strong>${t('spanish')}</strong><span>${t('spanishSub')}</span></a></div>`;
}
function vToday() {
  setChrome(t('today'));
  const td = todayIso(), { start, end } = T.meta;
  let h = '';
  if (td < start) {
    const n = dayDiff(start, td);
    h += `<div class="hero tall" style="background-image:url(img/paine.webp)"><div class="eyebrow">${ic('plane', 'sm')} ${t('departs', { d: esc(fmt(start, true)) })}</div>
      <div class="count">${n}</div><h2>${n === 1 ? t('dayToGo') : t('daysToGo')}</h2>
      <div class="glass-row"><span class="glass">${ic('calendar-days', 'sm')} ${t('nDays', { n: 23 })}</span><span class="glass">${ic('map-pin', 'sm')} ${t('nPlaces', { n: 7 })}</span><span class="glass">${ic('flag', 'sm')} ${t('nCountries', { n: 2 })}</span></div></div>`;
    h += tiles() + extrasRow();
    h += `<div class="h-sec">${ic('route')} ${t('yourRoute')} <small><a href="#/kaart">${t('mapLink')}</a></small></div>` + stageScroller();
    h += `<div class="h-sec">${ic('sunrise')} ${t('dayN', { n: 1 })} · ${esc(fmt(start))}</div>` + timeline(T.days[0]) + stayCard(stay(T.days[0].sleep));
  } else if (td > end) {
    h += `<div class="hero tall" style="background-image:url(img/uco.webp)"><h2>${t('welcomeHome')}</h2><p>${t('welcomeHomeSub')}</p></div>` + tiles() + extrasRow();
  } else {
    const d = T.days.find(x => x.date === td), i = T.days.indexOf(d), p = place(d.placeId);
    h += `<div class="hero" style="background-image:url(${img(p) || 'img/uco.webp'})"><div class="eyebrow">${ic('calendar-days', 'sm')} ${t('dayOf', { i: i + 1, n: T.days.length })} · ${esc(fmt(td, true))}</div>
      <h2>${esc(d.title)}</h2><p>${esc(d.place)}</p>${d.sleep ? `<div class="glass-row"><span class="glass">${ic('bed-double', 'sm')} ${esc(stay(d.sleep).name)}</span></div>` : ''}</div>`;
    h += tiles();
    if (p) {
      const fd = fcDays(p.id, [td])[0], c = CL[p.id];
      if (fd || c) { const [icn, lbl] = fd ? WMO(fd.code) : ['cloud-sun', t('avg')]; h += `<a class="card wx" href="#/weer" style="display:flex;align-items:center;gap:14px"><div class="wx-ico">${ic(icn, 'lg')}</div><div class="grow"><div class="wx-temp" style="font-size:24px">${Math.round(fd ? fd.max : c.tmax)}° <span>/ ${Math.round(fd ? fd.min : c.tmin)}°</span></div><div class="tiny muted">${fd ? `${esc(lbl)} · ${t('rainChance', { p: fd.rain ?? 0 })} · ${t('windTo', { w: Math.round(fd.gust) })}` : t('avgPeriod')}</div></div>${ic('chevron-right', 'chev')}</a>`; }
      forecast(p.id).then(f => { if (f && !store.get('fcShown:' + td)) { store.set('fcShown:' + td, 1); if (location.hash.startsWith('#/vandaag') || !location.hash) route(true); } });
    }
    const nx = nextMove();
    if (nx) h += `<div class="h-sec">${ic('clock')} ${t('nextDeparture')} <small>${nx.x.date === td ? t('todayLc') : esc(fmt(nx.x.date))}</small></div><div class="tl">${tlItem({ ref: nx.x.id })}</div>`;
    h += `<div class="h-sec">${ic('sun')} ${t('today')}</div>` + timeline(d) + (d.sleep ? stayCard(stay(d.sleep)) : '');
    if (p) {
      const pool = p.gems.length ? p.gems : p.highlights, g = pool[dayDiff(td, start) % pool.length];
      h += `<div class="h-sec">${ic('gem')} ${t('tipToday')}</div>` + tipCard(p, g, 'gem');
    }
    const tm = T.days[i + 1];
    if (tm) h += `<div class="h-sec">${ic('chevron-right')} ${t('tomorrow')}</div><a class="dayrow" href="#/dag/${tm.date}"><div class="db" style="background:${pcolor(tm.placeId)}"><span>${days()[parseD(tm.date).getDay()]}</span><b>${parseD(tm.date).getDate()}</b></div><div class="grow"><strong>${esc(tm.title)}</strong><div class="small muted">${esc(tm.place)}</div></div>${ic('chevron-right', 'chev')}</a>`;
    h += extrasRow();
  }
  view.innerHTML = h;
}

/* ================= agenda ================= */
let agendaMode = store.get('agendaMode', 'kalender');
function dayIcon(d) {
  const refs = d.items.map(it => it.ref && byId(it.ref)).filter(Boolean);
  if (refs.some(x => x.type === 'flight')) return 'plane';
  if (d.items.some(it => it.hike)) return 'footprints';
  if (refs.some(x => x.type === 'bus')) return 'bus';
  return PICON[d.placeId] || 'sun';
}
function vAgenda() {
  setChrome(t('navAgenda'));
  const td = todayIso();
  let h = `<div class="seg"><button data-m="kalender" class="${agendaMode === 'kalender' ? 'on' : ''}">${t('calendar')}</button><button data-m="lijst" class="${agendaMode === 'lijst' ? 'on' : ''}">${t('list')}</button></div>`;
  if (agendaMode === 'kalender') {
    const wd = days();
    h += `<div class="wkhead">${[1, 2, 3, 4, 5, 6, 0].map(i => `<div>${wd[i]}</div>`).join('')}</div>`;
    const d0 = parseD('2026-11-23');
    for (let w = 0; w < 5; w++) {
      const week = [...Array(7)].map((_, i) => { const dt = new Date(d0); dt.setDate(d0.getDate() + w * 7 + i); const ds = iso(dt); return { dt, ds, d: T.days.find(x => x.date === ds) }; });
      let cells = '', bars = '';
      week.forEach(({ dt, ds, d }, i) => {
        const col = `grid-column:${i + 1}`, mon = dt.getDate() === 1 || (w === 0 && i === 0) ? ` <small>${months()[dt.getMonth()]}</small>` : '';
        if (!d) { cells += `<div class="wnum off" style="${col}">${dt.getDate()}${mon}</div><div class="wact off" style="${col}"></div>`; return; }
        cells += `<a class="wnum ${ds === td ? 'today' : ''}" href="#/dag/${ds}" style="${col}">${dt.getDate()}${mon}${isTodoDay(d) ? '<i class="tdot"></i>' : ''}</a>
          <a class="wact" href="#/dag/${ds}" style="${col}">${ic(dayIcon(d), 'sm')}<span>${esc(d.short || d.title)}</span></a>`;
      });
      for (let i = 0; i < 7;) {
        const d = week[i].d; if (!d) { i++; continue; }
        let j = i; while (j + 1 < 7 && week[j + 1].d && week[j + 1].d.placeId === d.placeId) j++;
        const p = place(d.placeId), one = j === i;
        const name = p ? (one ? PSHORT[p.id] : p.name) : (one ? '✈' : t('goingHome'));
        bars += `<a class="wbar ${one ? 'one' : ''}" href="${p ? '#/plek/' + p.id : '#/dag/' + d.date}" style="grid-column:${i + 1} / span ${j - i + 1};--c:${pcolor(d.placeId)}">${p && !one ? flag(p.country) + ' ' : ''}${esc(name)}</a>`;
        i = j + 1;
      }
      h += `<div class="wk">${cells}${bars}</div>`;
    }
    h += `<div class="legend"><span><i style="background:var(--todo);border-radius:50%"></i>${t('needsDoing')}</span></div>`;
  } else {
    let cur = null;
    for (const [i, d] of T.days.entries()) {
      if (d.placeId !== cur) { cur = d.placeId; const p = place(cur); h += `<div class="stage-head">${p ? `<div class="thumb" style="background-image:url(${img(p)})"></div>` : `<div class="thumb" style="background:var(--m-car)"></div>`}<div><strong>${esc(p ? p.name : t('goingHome'))}</strong><div class="tiny muted">${p ? esc(p.tagline) : 'Mendoza → Buenos Aires → Amsterdam'}</div></div></div>`; }
      const dt = parseD(d.date);
      h += `<a class="dayrow ${d.date < td ? 'past' : ''} ${d.date === td ? 'today' : ''}" href="#/dag/${d.date}"><div class="db" style="background:${pcolor(d.placeId)}"><span>${days()[dt.getDay()]}</span><b>${dt.getDate()}</b><span>${months()[dt.getMonth()]}</span></div>
        <div class="grow"><strong>${esc(d.title)}</strong><div class="small muted">${t('dayN', { n: i + 1 })}${d.sleep ? ' · ' + esc(stay(d.sleep).name) : ''}</div></div>${isTodoDay(d) ? status('todo') : ic('chevron-right', 'chev')}</a>`;
    }
  }
  view.innerHTML = h;
  view.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { agendaMode = b.dataset.m; store.set('agendaMode', agendaMode); vAgenda(); });
  if (agendaMode === 'lijst') { const el = view.querySelector('.dayrow.today'); if (el) setTimeout(() => el.scrollIntoView({ block: 'center' }), 0); }
}
function vDay(date) {
  const d = T.days.find(x => x.date === date); if (!d) return vAgenda();
  const i = T.days.indexOf(d), p = place(d.placeId);
  setChrome(fmt(date), { back: true });
  const prev = T.days[i - 1], next = T.days[i + 1];
  view.innerHTML = `<div class="hero" style="background-image:url(${img(p) || 'img/uco.webp'})"><div class="eyebrow">${ic('calendar-days', 'sm')} ${t('dayN', { n: i + 1 })} · ${esc(fmt(date, true))}</div><h2>${esc(d.title)}</h2><p>${esc(d.place)}</p>
    ${p ? `<div class="glass-row"><a class="glass" style="color:#fff" href="#/plek/${p.id}">${ic('compass', 'sm')} ${t('guide')} ${esc(p.name)}</a><a class="glass" style="color:#fff" href="#/kaart/${p.id}">${ic('map', 'sm')} ${t('map')}</a></div>` : ''}</div>
    ${timeline(d)}${d.sleep ? stayCard(stay(d.sleep)) : ''}
    <div class="btns" style="justify-content:space-between">${prev ? `<a class="btn soft" href="#/dag/${prev.date}">${ic('chevron-left', 'sm')} ${esc(fmt(prev.date))}</a>` : '<span></span>'}${next ? `<a class="btn soft" href="#/dag/${next.date}">${esc(fmt(next.date))} ${ic('chevron-right', 'sm')}</a>` : ''}</div>`;
}

/* ================= plekken ================= */
function vPlaces() {
  setChrome(t('navPlaces'));
  view.innerHTML = extrasRow() + `<p class="muted small" style="margin:14px 2px">${t('placesIntro')}</p><div class="pgrid">${ORDER.map((id, i) => { const p = place(id);
    return `<a class="pcard ${i === 0 ? 'wide' : ''}" href="#/plek/${id}" style="background-image:url(${img(p)})"><span>${flag(p.country)} ${esc(range(p.dates[0], p.dates[1]))}</span><strong>${esc(p.name)}</strong></a>`; }).join('')}</div>`;
}
function tipCard(p, it, kind) {
  const cls = { hl: 'b-hl', gem: 'b-gem', food: 'b-food' }[kind];
  const icon = it.icon || { hl: 'star', gem: 'gem', food: 'utensils' }[kind];
  const ph = it.photo;
  return `<div class="card tipcard">${ph ? `<div class="tip-img" style="background-image:url(photos/${esc(ph.local)})"></div>` : ''}<div class="tip"><div class="bubble ${cls}">${ic(icon)}</div><div class="grow"><strong>${esc(it.name)}</strong><p>${esc(it.text)}</p>
    <div class="acts">${it.ll ? `<a href="#/kaart/${p.id}/${esc(it.id)}">${ic('map', 'sm')} ${t('onMap')}</a>` : ''}<a href="${mapsUrl(it.q || it.name, it.ll)}" target="_blank" rel="noopener">${ic('navigation', 'sm')} ${t('route')}</a></div>${photoCredit(ph)}</div></div></div>`;
}
let placeTab = 'hl';
function vPlace(id) {
  const p = place(id); if (!p) return vPlaces();
  setChrome(p.name, { back: true });
  const stays = T.stays.filter(s => T.days.some(d => d.placeId === id && d.sleep === s.id));
  const tabs = [['hl', t('tabHl'), p.highlights], ['gem', t('tabGems'), p.gems], ['food', t('tabFood'), p.food]];
  if (!tabs.some(x => x[0] === placeTab)) placeTab = 'hl';
  const cur = tabs.find(x => x[0] === placeTab);
  const arts = AR.filter(a => a.place === id);
  view.innerHTML = `<div class="hero tall" style="background-image:url(${img(p)})"><div class="eyebrow">${flag(p.country)} ${t(p.country)} · ${esc(range(p.dates[0], p.dates[1]))}</div><h2>${esc(p.name)}</h2><p>${esc(p.tagline)}</p>
    <div class="glass-row"><a class="glass" style="color:#fff" href="#/kaart/${id}">${ic('map', 'sm')} ${t('onTheMap')}</a></div></div>
    <div class="card"><p style="margin:0">${esc(p.intro)}</p></div>
    <div class="h-sec">${ic('cloud-sun')} ${t('weather')}</div><div id="wxslot">${weatherCard(id)}</div>
    ${p.plan ? `<div class="h-sec">${ic('calendar-days')} ${t('plan')}</div><div class="card">${p.plan.map(x => `<div class="plan"><b>${esc(x.day)}</b><div>${esc(x.text)}</div></div>`).join('')}</div>` : ''}
    <div class="seg" style="margin-top:20px">${tabs.map(([k, l, arr]) => `<button data-t="${k}" class="${placeTab === k ? 'on' : ''}">${l} <span class="muted">${arr.length}</span></button>`).join('')}</div>
    ${cur[2].map(it => tipCard(p, it, cur[0])).join('')}
    <div class="h-sec">${ic('lightbulb')} ${t('goodToKnow')}</div><div class="card"><ul class="clean">${p.tips.map(x => `<li>${ic('check', 'sm')}<span>${esc(x)}</span></li>`).join('')}</ul></div>
    ${arts.length ? `<div class="h-sec">${ic('notebook-pen')} ${t('readAlso')}</div>` + arts.map(articleCard).join('') : ''}
    ${stays.length ? `<div class="h-sec">${ic('bed-double')} ${t('sleepHere')}</div>` + stays.map(s => stayCard(s, range(s.in, s.out))).join('') : ''}`;
  view.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { placeTab = b.dataset.t; const y = scrollY; vPlace(id); scrollTo(0, y); });
  forecast(id).then(f => { const el = $('#wxslot'); if (f && el && location.hash === '#/plek/' + id) el.innerHTML = weatherCard(id); });
}

/* ================= kaart ================= */
let MAP = null;
const MODE = () => ({ flight: { c: '#6366f1', w: 2.5, dash: '6 7', label: t('mFlight'), icon: 'plane' }, bus: { c: '#f59e0b', w: 4, label: t('mBus'), icon: 'bus' }, boat: { c: '#06b6d4', w: 4, dash: '2 8', label: t('mBoat'), icon: 'ship' }, car: { c: '#64748b', w: 3, label: t('mCar'), icon: 'car-taxi-front' }, hike: { c: '#16a34a', w: 4, label: t('mHike'), icon: 'footprints' } });
const isDark = () => document.documentElement.dataset.theme === 'dark' || (document.documentElement.dataset.theme !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches);
let mapTips = store.get('mapTips', true);
const mapModes = store.get('mapModes', {});
function vMap(focus, tipId) {
  setChrome(t('navMap'), { full: true, hideBar: true });
  const M = MODE();
  view.innerHTML = `<div class="mapwrap"><div id="map"></div></div>
    <div class="map-top"><div class="chips">
      <button class="chip ${mapTips ? 'on' : ''}" id="tipsBtn">${ic('sparkles', 'sm')} ${t('tips')}</button>
      <button class="chip" id="allBtn">${ic('map', 'sm')} ${t('southAmerica')}</button>
      <button class="chip" id="worldBtn">${ic('plane', 'sm')} ${t('wholeTrip')}</button>
      ${Object.entries(M).map(([k, m]) => `<button class="chip mode ${mapModes[k] === false ? 'off' : ''}" data-mode="${k}"><span class="mi" style="background:${m.c}">${ic(m.icon)}</span>${m.label}</button>`).join('')}
    </div></div>
    <div class="map-bottom"><div class="hscroll">${ORDER.map((id, i) => { const p = place(id); return `<button class="mstage" data-fly="${id}"><div class="thumb" style="background-image:url(${img(p)})"></div><div style="text-align:left"><strong>${i + 1}. ${esc(p.name)}</strong><span>${esc(range(p.dates[0], p.dates[1]))}</span></div></button>`; }).join('')}</div></div>`;
  if (!window.L) { $('#map').innerHTML = `<div class="card" style="margin:120px 16px">${t('mapFailed')}</div>`; return; }
  if (MAP) { MAP.remove(); MAP = null; }
  const map = MAP = L.map('map', { zoomControl: false, attributionControl: true, worldCopyJump: false }).setView([-42, -66], 4);
  map.createPane('land'); map.getPane('land').style.zIndex = 150;
  fetch('geo/countries.json').then(r => r.json()).then(geo => L.geoJSON(geo, { pane: 'land', interactive: false,
    style: f => ({ color: isDark() ? '#334155' : '#b8c4d4', weight: 1, fillColor: f.properties.main ? (isDark() ? '#1e2733' : '#fbfaf7') : (isDark() ? '#161d27' : '#eef0f2'), fillOpacity: 1 }) }).addTo(map)).catch(() => {});
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', className: 'osm-tiles' }).addTo(map);
  const modeLayers = Object.fromEntries(Object.keys(M).map(k => [k, L.layerGroup()]));
  for (const l of RT.legs) {
    const m = M[l.mode]; if (!m) continue;
    const g = modeLayers[l.mode];
    if (l.mode !== 'flight') g.addLayer(L.polyline(l.line, { color: '#fff', weight: m.w + 4, opacity: 0.9, interactive: false }));
    L.polyline(l.line, { color: m.c, weight: m.w, dashArray: m.dash, opacity: 0.95, lineCap: 'round' }).addTo(g)
      .bindPopup(() => { const x = byId(l.id) || hike(l.id) || hike(l.id.replace(/b$/, '')); return `<strong>${ic(m.icon, 'sm')} ${esc(x?.title || x?.name || m.label)}</strong>${x?.date ? `<div class="muted">${esc(fmt(x.date))}</div><a class="btn" href="#/boeking/${x.id}">${t('details')}</a>` : ''}`; });
  }
  const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const mk = (ll, html, cls, size, bg) => L.marker(ll, { icon: L.divIcon({ className: '', html: `<div class="${cls}" style="background:${bg}">${html}</div>`, iconSize: [size, size], iconAnchor: [size / 2, size / 2] }) });
  for (const [k, name, sub] of [['ams', 'Amsterdam', t('amsSub')], ['mad', 'Madrid', t('madSub')]])
    mk(RT.points[k], ic('plane'), 'tip-marker', 26, M.flight.c).addTo(modeLayers.flight).bindPopup(`<strong>${name}</strong><div class="muted">${sub}</div><a class="btn" href="#/boeking/out">${t('outbound')}</a> <a class="btn" href="#/boeking/home">${t('inbound')}</a>`);
  for (const [k, g] of Object.entries(modeLayers)) if (mapModes[k] !== false) g.addTo(map);
  ORDER.forEach((id, i) => {
    const p = place(id), s = stay(T.days.find(d => d.placeId === id && d.sleep)?.sleep);
    mk(s?.ll || p.center, i + 1, 'stop-marker', 30, css(`--p-${id}`)).setZIndexOffset(1000).addTo(map)
      .bindPopup(`<div class="pop-img" style="background-image:url(${img(p)})"></div><strong>${i + 1}. ${esc(p.name)}</strong><div class="muted">${esc(range(p.dates[0], p.dates[1]))}</div><div>${esc(p.tagline)}</div><a class="btn" href="#/plek/${id}">${t('viewGuide')}</a>`, { maxWidth: 260 });
  });
  for (const id of ['painegrande', 'frances', 'chileno']) {
    const s = stay(id);
    mk(s.ll, ic('tent'), 'tip-marker', 26, '#0f766e').setZIndexOffset(900).addTo(map).bindPopup(`<strong>${esc(s.name)}</strong><div class="muted">${esc(range(s.in, s.out))}</div><a class="btn" href="#/boeking/${id}">${t('details')}</a>`);
  }
  const tipLayer = L.layerGroup(), tipMarkers = {};
  for (const p of PL) for (const [list, color, kind] of [['highlights', '#2f6fd6', 'hl'], ['gems', '#8b5cf6', 'gem'], ['food', '#ea580c', 'food']]) for (const it of p[list]) {
    if (!it.ll) continue;
    const m = mk(it.ll, ic(it.icon || { hl: 'star', gem: 'gem', food: 'utensils' }[kind]), 'tip-marker', 26, color);
    m.bindPopup(`${it.photo ? `<div class="pop-img" style="background-image:url(photos/${esc(it.photo.local)})"></div>` : ''}<span class="badge ${kind === 'gem' ? 'gem' : 'plain'}">${{ hl: t('kHl'), gem: t('kGem'), food: t('kFood') }[kind]}</span><div style="margin-top:6px"><strong>${esc(it.name)}</strong></div><div>${esc(it.text)}</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap"><a class="btn" href="${mapsUrl(it.q, it.ll)}" target="_blank" rel="noopener">${t('route')}</a><a class="btn" style="background:var(--accent-soft);color:var(--accent)" href="#/plek/${p.id}">${t('guide')}</a></div>`, { maxWidth: 260 });
    tipLayer.addLayer(m); tipMarkers[p.id + '|' + it.id] = m;
  }
  if (mapTips) tipLayer.addTo(map);
  const fitLegs = legs => { map.invalidateSize(); map.fitBounds(L.latLngBounds(legs.flatMap(l => l.line)), { paddingTopLeft: [20, 70], paddingBottomRight: [20, 190] }); };
  const fitAll = () => fitLegs(RT.legs.filter(l => !l.intl));
  const fitWorld = () => fitLegs(RT.legs);
  const fly = id => { const p = place(id); map.flyTo(p.center, p.zoom, { duration: 0.8 }); };
  requestAnimationFrame(() => {
    map.invalidateSize();
    if (focus && place(focus)) {
      const p = place(focus); map.setView(p.center, p.zoom);
      if (tipId) { const m = tipMarkers[focus + '|' + decodeURIComponent(tipId)]; if (m) { if (!mapTips) { mapTips = true; tipLayer.addTo(map); $('#tipsBtn').classList.add('on'); } map.setView(m.getLatLng(), Math.max(p.zoom, 14)); setTimeout(() => m.openPopup(), 300); } }
    } else fitAll();
  });
  $('#tipsBtn').onclick = () => { mapTips = !mapTips; store.set('mapTips', mapTips); $('#tipsBtn').classList.toggle('on', mapTips); mapTips ? tipLayer.addTo(map) : tipLayer.remove(); };
  $('#allBtn').onclick = fitAll;
  $('#worldBtn').onclick = () => { if (mapModes.flight === false) view.querySelector('[data-mode=flight]').click(); fitWorld(); };
  view.querySelectorAll('[data-mode]').forEach(b => b.onclick = () => {
    const k = b.dataset.mode, on = mapModes[k] === false;
    mapModes[k] = on; store.set('mapModes', mapModes); b.classList.toggle('off', !on);
    on ? modeLayers[k].addTo(map) : modeLayers[k].remove();
    toast(`${M[k].label} ${on ? t('on') : t('off')}`);
  });
  view.querySelectorAll('[data-fly]').forEach(b => b.onclick = () => fly(b.dataset.fly));
  L.control.zoom({ position: 'topright' }).addTo(map);
  map.getContainer().querySelector('.leaflet-top.leaflet-right').style.marginTop = 'calc(env(safe-area-inset-top) + 60px)';
}

/* ================= weer ================= */
const WLL = { ba: [-34.5873, -58.4128], chalten: [-49.3315, -72.8863, 400], calafate: [-50.3393, -72.2716], natales: [-51.7308, -72.5064], paine: [-51.0, -73.0, 250], mendoza: [-32.9866, -68.8683], uco: [-33.651, -69.23] };
const WMO = c => c === 0 ? ['sun', t('wSun')] : c <= 2 ? ['cloud-sun', t('wPartly')] : c === 3 ? ['cloud', t('wCloud')] : c <= 48 ? ['cloud-fog', t('wFog')] : c <= 57 ? ['cloud-drizzle', t('wDrizzle')]
  : c <= 67 ? ['cloud-rain', t('wRain')] : c <= 77 ? ['cloud-snow', t('wSnow')] : c <= 82 ? ['cloud-sun-rain', t('wShowers')] : c <= 86 ? ['cloud-snow', t('wSnowShowers')] : ['cloud-lightning', t('wStorm')];
async function forecast(id) {
  const k = 'fc:' + id, c = store.get(k);
  if (c && Date.now() - c.at < 3 * 3600e3) return c;
  if (!navigator.onLine || !WLL[id]) return c;
  const [lat, lon, el] = WLL[id];
  try {
    const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_gusts_10m_max,uv_index_max&timezone=auto&forecast_days=16${el ? '&elevation=' + el : ''}`);
    const j = await r.json(); if (!j.daily) return c;
    const v = { at: Date.now(), d: j.daily }; store.set(k, v); return v;
  } catch { return c; }
}
const wearTip = (c, id) => c.tmax >= 24 ? t('wearWarm') : id === 'paine' ? t('wearPaine') : t('wearCool');
function fcDays(id, dates) {
  const f = store.get('fc:' + id); if (!f) return [];
  return f.d.time.map((x, i) => ({ t: x, code: f.d.weather_code[i], max: f.d.temperature_2m_max[i], min: f.d.temperature_2m_min[i], rain: f.d.precipitation_probability_max[i], gust: f.d.wind_gusts_10m_max[i], uv: f.d.uv_index_max[i] }))
    .filter(d => !dates || dates.includes(d.t));
}
const stayDates = id => T.days.filter(d => d.placeId === id).map(d => d.date);
function fcStrip(ds) {
  return `<div class="wx-strip">${ds.map(d => { const [icn, lbl] = WMO(d.code); return `<div class="wx-day" title="${esc(lbl)}"><span class="tiny muted">${esc(fmt(d.t).split(' ').slice(0, 2).join(' '))}</span>${ic(icn, 'lg')}<b>${Math.round(d.max)}°</b><span class="tiny muted">${Math.round(d.min)}°</span>${d.rain != null ? `<span class="tiny" style="color:var(--m-boat)">${d.rain}%</span>` : ''}</div>`; }).join('')}</div>`;
}
function weatherCard(id, compact) {
  const c = CL[id], p = place(id); if (!c) return '';
  const ds = stayDates(id), fc = fcDays(id, ds);
  const from = ds[0] ? (() => { const d = parseD(ds[0]); d.setDate(d.getDate() - 15); return iso(d); })() : null;
  const icon = c.tmax >= 24 ? 'sun' : c.rainDays >= 5 ? 'cloud-sun-rain' : 'cloud-sun';
  return `<div class="card wx">${compact ? `<a class="row" href="#/plek/${id}" style="color:inherit;margin-bottom:10px"><div class="thumb" style="width:44px;height:44px;border-radius:14px;background:center/cover url(${img(p)})"></div><div class="grow"><strong>${esc(p.name)}</strong><div class="tiny muted">${esc(range(p.dates[0], p.dates[1]))}</div></div></a>` : ''}
    <div class="row"><div class="wx-ico">${ic(icon, 'lg')}</div><div class="grow"><div class="wx-temp">${Math.round(c.tmax)}° <span>/ ${Math.round(c.tmin)}°</span></div><div class="tiny muted">${t('avgDayNight')}</div></div></div>
    <div class="wx-facts"><span>${ic('umbrella', 'sm')} ${t('rainDays', { n: Math.round(c.rainDays) })}</span><span>${ic('wind', 'sm')} ${t('gusts', { n: c.gust })}</span><span>${ic('sunrise', 'sm')} ${c.sunrise} · ${ic('sunset', 'sm')} ${c.sunset}</span><span>${ic('thermometer', 'sm')} ${t('tempRange', { a: Math.round(c.tminCold), b: Math.round(c.tmaxHot) })}</span></div>
    ${fc.length ? `<div class="tiny muted" style="font-weight:700;margin:14px 0 6px">${ic('sparkles', 'sm')} ${t('liveForDays')}</div>` + fcStrip(fc) : (from && todayIso() < from ? `<div class="tiny muted" style="margin-top:12px">${ic('clock', 'sm')} ${t('liveFrom', { d: esc(fmt(from)) })}</div>` : '')}
    ${compact ? '' : `<div class="wx-tip">${ic('shirt', 'sm')} <span>${esc(wearTip(c, id))}</span></div>`}
    ${id === 'paine' && !compact ? `<div class="tiny muted" style="margin-top:8px">${t('paineWind')}</div>` : ''}
  </div>`;
}
function vWeather() {
  setChrome(t('weather'), { back: true });
  const render = () => { view.innerHTML = `<p class="muted small" style="margin:4px 2px 12px">${t('weatherIntro')}</p>` + ORDER.map(id => weatherCard(id, true)).join('') + `<p class="tiny muted" style="text-align:center">${t('weatherSource')}</p>`; };
  render();
  if (navigator.onLine) Promise.all(ORDER.map(forecast)).then(() => { if (location.hash.startsWith('#/weer')) render(); });
}

/* ================= leesvoer ================= */
function articleCard(a) {
  const p = a.place && place(a.place);
  return `<a class="card art-card" href="#/lees/${esc(a.id)}"><div class="art-thumb" style="${p ? `background-image:url(${img(p)})` : ''}">${p ? '' : ic(a.icon || 'notebook-pen', 'lg')}</div>
    <div class="grow"><div class="tiny muted" style="font-weight:700">${ic('clock', 'sm')} ${t('minRead', { n: a.minutes || 5 })}</div><strong>${esc(L(a.title))}</strong><p class="small muted" style="margin:4px 0 0">${esc(L(a.intro))}</p></div></a>`;
}
function vReading() {
  setChrome(t('reading'), { back: true });
  view.innerHTML = `<div class="hero" style="background-image:url(img/natales.webp)"><div class="eyebrow">${ic('plane', 'sm')} AMS → MAD → EZE</div><h2>${t('reading')}</h2><p>${t('readingIntro')}</p></div>` + AR.map(articleCard).join('');
}
function vArticle(id) {
  const a = AR.find(x => x.id === id); if (!a) return vReading();
  const p = a.place && place(a.place);
  setChrome(t('reading'), { back: true });
  const paras = s => L(s).split(/\n\s*\n/).map(x => `<p>${esc(x.trim())}</p>`).join('');
  view.innerHTML = `<div class="hero" style="background-image:url(${p ? img(p) : 'img/paine.webp'})"><div class="eyebrow">${ic(a.icon || 'notebook-pen', 'sm')} ${t('minRead', { n: a.minutes || 5 })}</div><h2>${esc(L(a.title))}</h2></div>
    <article class="article"><p class="lead">${esc(L(a.intro))}</p>${(a.sections || []).map(s => `<h3>${esc(L(s.h))}</h3>${paras(s.p)}`).join('')}</article>
    ${a.facts?.length ? `<div class="card facts-card"><div class="h-sec" style="margin:0 0 8px">${ic('sparkles')} ${t('funFacts')}</div><ul class="clean">${a.facts.map(f => `<li>${ic('star', 'sm')}<span>${esc(L(f))}</span></li>`).join('')}</ul></div>` : ''}
    ${p ? `<a class="btn soft" href="#/plek/${p.id}">${ic('compass', 'sm')} ${t('guide')} ${esc(p.name)}</a>` : ''}`;
}

/* ================= Spaans ================= */
let phraseCat = 'all', phraseQ = '';
const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
function speak(text) {
  try {
    const u = new SpeechSynthesisUtterance(text), vs = speechSynthesis.getVoices();
    u.voice = vs.find(v => /es[-_](AR|419|US|MX)/i.test(v.lang)) || vs.find(v => /^es/i.test(v.lang)) || null;
    u.lang = u.voice?.lang || 'es-AR'; u.rate = 0.9; speechSynthesis.cancel(); speechSynthesis.speak(u);
  } catch {}
}
function vSpanish() {
  setChrome(t('spanish'), { back: true });
  if (!PH) { view.innerHTML = `<div class="card">${t('noResults')}</div>`; return; }
  const total = PH.categories.reduce((s, c) => s + c.items.length, 0);
  view.innerHTML = `<div class="card"><strong>${t('phrasesTips')}</strong><ul class="clean" style="margin-top:6px">${(PH.notes || []).map(n => `<li>${ic('lightbulb', 'sm')}<span>${esc(L(n))}</span></li>`).join('')}</ul><p class="tiny muted" style="margin:8px 0 0">${t('offlineTip')}</p></div>
    <div class="search"><svg class="ico"><use href="#i-compass"/></svg><input id="pq" type="search" placeholder="${t('phrasesSearch')}" value="${esc(phraseQ)}" autocomplete="off"></div>
    <div class="chips" id="pcats"><button class="chip ${phraseCat === 'all' ? 'on' : ''}" data-c="all">${t('fAll')} · ${total}</button>${PH.categories.map(c => `<button class="chip ${phraseCat === c.id ? 'on' : ''}" data-c="${esc(c.id)}">${ic(c.icon || 'info', 'sm')} ${esc(L(c.title))}</button>`).join('')}</div>
    <div id="plist"></div>`;
  const render = () => {
    const q = norm(phraseQ), tr = LANG === 'es' ? 'en' : LANG;
    let html = '', n = 0;
    for (const c of PH.categories) {
      if (phraseCat !== 'all' && c.id !== phraseCat) continue;
      const items = c.items.filter(it => !q || norm(it.es + ' ' + it.nl + ' ' + it.en).includes(q));
      if (!items.length) continue;
      n += items.length;
      html += `<div class="h-sec">${ic(c.icon || 'info')} ${esc(L(c.title))} <small>${items.length}</small></div><div class="card phrases">${items.map(it => `<div class="phrase"><div class="grow"><strong>${esc(it.es)}</strong>${it.region && it.region !== 'both' ? ` <span class="badge plain">${it.region === 'AR' ? '🇦🇷' : '🇨🇱'}</span>` : ''}<div class="small muted">${esc(it[tr] || it.en)}</div>${it.say ? `<div class="tiny" style="color:var(--accent)">🔊 ${esc(it.say)}</div>` : ''}</div><button class="btn soft round" data-say="${esc(it.es)}" aria-label="${t('listen')}">${ic('music')}</button></div>`).join('')}</div>`;
    }
    $('#plist').innerHTML = html || `<p class="muted" style="text-align:center">${t('noResults')}</p>`;
    $('#plist').querySelectorAll('[data-say]').forEach(b => b.onclick = () => speak(b.dataset.say));
  };
  render();
  let tmr; $('#pq').addEventListener('input', e => { clearTimeout(tmr); tmr = setTimeout(() => { phraseQ = e.target.value; render(); }, 120); });
  view.querySelectorAll('[data-c]').forEach(b => b.onclick = () => { phraseCat = b.dataset.c; view.querySelectorAll('[data-c]').forEach(x => x.classList.toggle('on', x === b)); render(); });
}

/* ================= boekingen ================= */
let filter = 'all';
function vBookings() {
  setChrome(t('bookings'), { back: true });
  const groups = [['all', t('fAll'), 'sparkles'], ['flight', t('fFlights'), 'plane'], ['stay', t('fStay'), 'bed-double'], ['bus', t('fBus'), 'bus'], ['todo', t('fTodo'), 'circle-alert']];
  const all = [...T.transport.map(x => ({ ...x, sort: x.date + (x.legs?.[0]?.dep || '') })), ...T.other.map(x => ({ ...x, sort: x.date + '06' })), ...T.stays.map(x => ({ ...x, type: 'stay', date: x.in, sort: x.in + '99' }))].sort((a, b) => a.sort.localeCompare(b.sort));
  const show = all.filter(x => filter === 'all' || (filter === 'todo' ? x.status === 'todo' : filter === 'bus' ? ['bus', 'boat', 'transfer', 'ticket'].includes(x.type) : x.type === filter));
  view.innerHTML = `<div class="chips">${groups.map(([k, l, i]) => `<button class="chip ${filter === k ? 'on' : ''}" data-f="${k}">${ic(i, 'sm')} ${l}</button>`).join('')}</div>` +
    show.map(x => `<a class="card" href="#/boeking/${esc(x.id)}"><div class="row">${x.photo ? `<div class="tl-ico" style="background:center/cover url(${esc(x.photo)})"></div>` : `<div class="tl-ico bg-${x.type}">${ic(TICON[x.type])}</div>`}<div class="grow">
      <div class="tiny muted" style="font-weight:700">${esc(fmt(x.date))}${x.type === 'stay' ? ' → ' + esc(fmt(x.out)) : ''}</div><strong>${esc(x.name || x.title)}</strong>
      <div class="small muted">${x.type === 'stay' ? esc(x.place) : esc((x.legs || []).map(l => l.number).filter(Boolean).join(' + ') || (x.legs?.[0]?.dep ? t('depart') + ' ' + x.legs[0].dep : x.codes?.[0]?.value || ''))}</div></div>${status(x.status)}</div></a>`).join('');
  view.querySelectorAll('[data-f]').forEach(b => b.onclick = () => { filter = b.dataset.f; vBookings(); });
}
function vBooking(id) {
  const x = byId(id); if (!x) return vBookings();
  const isStay = !!x.address, type = isStay ? 'stay' : x.type;
  setChrome(isStay ? t('tStay') : TYPE()[x.type] || t('tBooking'), { back: true });
  let h = `<div class="card">${x.photo ? `<div class="stay-img big" style="background-image:url(${esc(x.photo)})"></div>` : ''}<div class="row top"><div class="tl-ico bg-${type}" style="width:52px;height:52px;border-radius:17px">${ic(TICON[type], 'lg')}</div><div class="grow">
    <h2 style="margin:0;font-size:21px;letter-spacing:-.02em">${esc(x.name || x.title)}</h2><div class="muted small">${isStay ? `${esc(fmt(x.in, true))} → ${esc(fmt(x.out, true))}` : esc(fmt(x.date, true))}</div><div style="margin-top:6px">${status(x.status)}</div></div></div>`;
  if (isStay) {
    h += `<dl class="facts" style="margin:16px 0 0"><dt>${t('checkin')}</dt><dd>${esc(x.checkin || '–')}</dd><dt>${t('checkout')}</dt><dd>${esc(x.checkout || '–')}</dd><dt>${t('address')}</dt><dd>${esc(x.address)}</dd></dl>
      <div class="btns"><a class="btn" href="${mapsUrl(x.address)}" target="_blank" rel="noopener">${ic('navigation', 'sm')} ${t('route')}</a>${x.booking ? `<a class="btn booking" href="${bookingUrl(x.booking)}" target="_blank" rel="noopener">${ic('bed-double', 'sm')} ${t('onBooking')}</a>` : ''}${x.web ? `<a class="btn soft" href="${esc(x.web)}" target="_blank" rel="noopener">${ic('compass', 'sm')} ${t('website')}</a>` : ''}${x.phone ? `<a class="btn soft" href="${tel(x.phone)}">${ic('phone', 'sm')} ${t('call')}</a>` : ''}<button class="btn soft" data-copy="${esc(x.address)}">${ic('copy', 'sm')} ${t('address')}</button></div>`;
  } else if (x.legs) h += `<div style="margin-top:18px">${legsHtml(x.legs)}</div>`;
  h += `</div>`;
  if (x.codes?.length) h += `<div class="h-sec">${ic('ticket')} ${t('codes')}</div>` + codeBlock(x.codes);
  if (x.qr) h += `<div class="card qr-card"><img src="${x.qr}" alt="QR"><div class="tiny muted">${esc(x.codes?.[0]?.value || '')}</div></div>`;
  const facts = [[t('baggage'), x.baggage], [t('price'), x.price], [t('payment'), x.payment], [t('cancel'), x.cancel]].filter(f => f[1]);
  if (facts.length) h += `<div class="h-sec">${ic('info')} ${t('details')}</div><div class="card"><dl class="facts" style="margin:0">${facts.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}</dl></div>`;
  if (x.notes?.length) h += `<div class="h-sec">${ic('lightbulb')} ${t('goodToKnow')}</div><div class="card"><ul class="clean">${x.notes.map(n => `<li>${ic('check', 'sm')}<span>${esc(n)}</span></li>`).join('')}</ul></div>`;
  const ds = T.days.filter(d => d.items.some(it => it.ref === id) || d.sleep === id);
  if (ds.length) h += `<div class="h-sec">${ic('calendar-days')} ${t('inSchedule')}</div>` + ds.map(d => `<a class="dayrow" href="#/dag/${d.date}"><div class="db" style="background:${pcolor(d.placeId)}"><span>${days()[parseD(d.date).getDay()]}</span><b>${parseD(d.date).getDate()}</b></div><div class="grow"><strong>${esc(d.title)}</strong></div>${ic('chevron-right', 'chev')}</a>`).join('');
  view.innerHTML = h;
}

/* ================= te doen ================= */
const todoKey = id => 'todo:' + id;
function openTodoCount() { return T.todos.flatMap(g => g.items).filter(i => !Sync.get(todoKey(i.id))).length; }
const other = () => store.get('me') === 'Thijs' ? 'Martine' : 'Thijs';
function vTodo() {
  setChrome(t('todo'), { back: true });
  const all = T.todos.flatMap(g => g.items), done = all.filter(i => Sync.get(todoKey(i.id))).length, pct = Math.round(done / all.length * 100);
  let h = `<div class="card"><div class="row"><div class="ring" style="--p:${pct}"><div>${pct}%</div></div><div class="grow"><strong style="font-size:18px">${t('doneOf', { a: done, b: all.length })}</strong>
    <div class="small muted">${Sync.room ? `${ic('circle-check', 'sm')} ${t('sharedWith', { n: other() })}` : t('onlyDevice')}</div></div></div></div>`;
  for (const g of T.todos) {
    const n = g.items.filter(i => !Sync.get(todoKey(i.id))).length;
    h += `<div class="h-sec">${esc(g.group)} <small>${n ? t('nOpen', { n }) : t('allDone')}</small></div><div class="card">`;
    for (const it of g.items) {
      const on = !!Sync.get(todoKey(it.id)), m = Sync.meta(todoKey(it.id));
      h += `<label class="check ${on ? 'done' : ''}"><input type="checkbox" data-todo="${esc(it.id)}" ${on ? 'checked' : ''}><span>${esc(it.text)}${it.message ? ` <a href="#/bericht/${esc(it.message)}">${t('message')}</a>` : ''}${on && m?.by ? `<span class="who">✓ ${esc(m.by)}</span>` : ''}</span></label>`;
    }
    h += `</div>`;
  }
  view.innerHTML = h;
  view.querySelectorAll('[data-todo]').forEach(cb => cb.onchange = () => { Sync.set(todoKey(cb.dataset.todo), cb.checked); const y = scrollY; vTodo(); scrollTo(0, y); });
}
function vMessage(key) {
  const m = T.messages[key]; if (!m) return vTodo();
  setChrome(t('msgTitle'), { back: true });
  const wa = m.channel === 'WhatsApp' ? `https://wa.me/${m.to.replace(/[^\d]/g, '')}?text=${encodeURIComponent(m.body)}` : null;
  const mail = m.channel === 'E-mail' ? `mailto:${m.to}?subject=${encodeURIComponent(m.subject)}&body=${encodeURIComponent(m.body)}` : null;
  view.innerHTML = `<div class="card"><div class="tiny muted" style="font-weight:700">${t('msgTo', { c: esc(m.channel) })}</div><h3 style="margin:2px 0 0">${esc(m.to)}</h3>
    ${m.subject ? `<div class="tiny muted" style="margin-top:10px;font-weight:700">${t('subject')}</div><div>${esc(m.subject)}</div>` : ''}<div class="msg">${esc(m.body)}</div>
    <div class="btns">${wa ? `<a class="btn" href="${wa}" target="_blank" rel="noopener">${t('openWa')}</a>` : ''}${mail ? `<a class="btn" href="${mail}">${t('openMail')}</a>` : ''}<button class="btn soft" data-copy="${esc(m.body)}">${ic('copy', 'sm')} ${t('copy')}</button></div></div>`;
}

/* ================= meer ================= */
function vMore() {
  setChrome(t('more'));
  const row = (href, icon, color, ti, s, badge) => `<a class="list-link" href="${href}"><div class="bubble" style="background:${color};color:#fff">${ic(icon)}</div><div class="grow"><strong>${ti}</strong><span>${s}</span></div>${badge ? `<span class="badge todo">${badge}</span>` : ''}${ic('chevron-right', 'chev')}</a>`;
  view.innerHTML = `<div class="card">${row('#/boekingen', 'ticket', 'var(--m-flight)', t('bookings'), t('bookingsSub'))}${row('#/todo', 'list-checks', 'var(--todo)', t('todo'), t('todoSub'), openTodoCount())}${row('#/pakken', 'backpack', 'var(--m-hike)', t('packing'), t('packingSub'))}${row('#/weer', 'cloud-sun', 'var(--m-boat)', t('weather'), t('weatherSub'))}</div>
    <div class="card">${row('#/leesvoer', 'notebook-pen', 'var(--p-ba)', t('reading'), t('readingSub'))}${row('#/spaans', 'music', 'var(--p-chalten)', t('spanish'), t('spanishSub'))}</div>
    <div class="card">${row('#/info', 'info', '#e11d48', t('info'), t('infoSub'))}${row('#/notities', 'notebook-pen', 'var(--m-boat)', t('notes'), t('notesSub'))}${row('#/instellingen', 'settings', 'var(--m-car)', t('settings'), t('settingsSub'))}</div>`;
}
function vInfo() {
  setChrome(t('info'), { back: true });
  view.innerHTML = T.info.map(s => `<div class="h-sec">${esc(s.title)}</div><div class="card">${s.items.map(i => `<div class="row" style="padding:8px 0"><div class="grow">${i.label ? `<strong>${esc(i.label)}</strong>` : ''}${i.text ? `<div class="${i.label ? 'small muted' : ''}">${esc(i.text)}</div>` : ''}</div>${i.phone ? `<a class="btn soft" href="${tel(i.phone)}">${ic('phone', 'sm')} ${esc(i.phone)}</a>` : ''}</div>`).join('')}</div>`).join('');
}
let packWho = null;
function vPack() {
  setChrome(t('packing'), { back: true });
  const who = packWho || store.get('me') || 'Martine', w = who === 'Thijs' ? 't' : 'm', key = id => `pack:${w}:${id}`;
  const cats = T.packing.map(c => ({ ...c, items: c.items.filter(i => !i.who || i.who === w) }));
  const all = cats.flatMap(c => c.items), done = all.filter(i => Sync.get(key(i.id))).length, pct = Math.round(done / all.length * 100);
  view.innerHTML = `<div class="seg">${['Martine', 'Thijs'].map(n => `<button data-who="${n}" class="${who === n ? 'on' : ''}">${n}</button>`).join('')}</div>
    <div class="card"><div class="row"><div class="ring" style="--p:${pct}"><div>${pct}%</div></div><div class="grow"><strong style="font-size:18px">${t('packedOf', { a: done, b: all.length })}</strong>
    <div class="small muted">${t('listOf', { n: esc(who) })}${Sync.room ? t('visibleBoth') : ''}</div></div></div>
    <div class="wx-tip" style="margin-top:12px">${ic('circle-alert', 'sm')}<span>${t('domesticNote')}</span></div></div>` +
    cats.map(c => { const n = c.items.filter(i => Sync.get(key(i.id))).length;
      return `<div class="h-sec">${ic(c.icon)} ${esc(c.cat)} <small>${n}/${c.items.length}</small></div><div class="card">${c.note ? `<p class="small muted" style="margin:0 0 6px">${esc(c.note)}</p>` : ''}${c.items.map(i => { const on = !!Sync.get(key(i.id));
        return `<label class="check ${on ? 'done' : ''}"><input type="checkbox" data-p="${esc(i.id)}" ${on ? 'checked' : ''}><span>${esc(i.t)}${i.note ? `<span class="who">${esc(i.note)}</span>` : ''}</span></label>`; }).join('')}</div>`; }).join('');
  view.querySelectorAll('[data-who]').forEach(b => b.onclick = () => { packWho = b.dataset.who; vPack(); });
  view.querySelectorAll('[data-p]').forEach(cb => cb.onchange = () => { Sync.set(key(cb.dataset.p), cb.checked); const y = scrollY; vPack(); scrollTo(0, y); });
}
function vNotes() {
  setChrome(t('notes'), { back: true });
  const m = Sync.meta('notes');
  view.innerHTML = `<p class="muted small" style="margin:4px 2px 12px">${Sync.room ? t('notesShared') : t('onlyDevice')}${m?.by ? t('lastBy', { n: esc(m.by) }) : ''}</p>
    <textarea id="notes" placeholder="${t('notesPh')}">${esc(Sync.get('notes', store.get('notes', '')))}</textarea>`;
  let tmr; $('#notes').addEventListener('input', e => { clearTimeout(tmr); tmr = setTimeout(() => Sync.set('notes', e.target.value), 600); });
}
function vSettings() {
  setChrome(t('settings'), { back: true });
  const me = store.get('me', ''), dbg = store.get('debugDate', '');
  const credits = PL.flatMap(p => ['highlights', 'gems', 'food'].flatMap(l => p[l])).filter(x => x.photo);
  view.innerHTML = `<div class="card"><strong>${t('language')}</strong>${langPicker()}</div>
    <div class="card"><strong>${t('whoAreYou')}</strong><p class="small muted" style="margin:2px 0 0">${t('whoSub')}</p>
    <div class="seg" style="margin-bottom:0">${['Martine', 'Thijs'].map(n => `<button data-me="${n}" class="${me === n ? 'on' : ''}">${n}</button>`).join('')}</div></div>
    <div class="card"><strong>${t('sync')}</strong><p class="small muted" style="margin:2px 0 0">${Sync.room ? t('syncOn') : t('syncOff')}</p></div>
    <div class="card"><strong>${t('otherDate')}</strong><p class="small muted" style="margin:2px 0 8px">${t('otherDateSub')}</p>
    <input type="date" id="dbg" value="${esc(dbg)}" min="2026-11-01" max="2026-12-31" style="font:inherit;padding:10px;border-radius:12px;border:0;background:var(--surface-2);color:var(--text)">
    <div class="btns"><button class="btn soft" id="dbgclear">${t('backToday')}</button></div></div>
    <div class="card"><strong>${t('lock')}</strong><p class="small muted" style="margin:2px 0 0">${t('lockSub')}</p><div class="btns"><button class="btn soft" id="lock">${t('lockBtn')}</button></div></div>
    ${credits.length ? `<details class="card"><summary><strong>${t('photoCredits')}</strong></summary><ul class="clean tiny">${credits.map(x => `<li><span>${esc(x.name)}: <a href="${esc(x.photo.page)}" target="_blank" rel="noopener">${esc(x.photo.author || 'Wikimedia Commons')}</a>${x.photo.license ? ', ' + esc(x.photo.license) : ''}</span></li>`).join('')}</ul></details>` : ''}
    <p class="tiny muted" style="text-align:center">${t('updated', { d: esc(fmt(T.meta.updated, true)) })} ${t('credits')}</p>`;
  bindLang(vSettings);
  view.querySelectorAll('[data-me]').forEach(b => b.onclick = () => { store.set('me', b.dataset.me); vSettings(); toast(t('hi', { n: b.dataset.me })); });
  $('#dbg').onchange = e => { store.set('debugDate', e.target.value || null); toast(t('dateSet')); };
  $('#dbgclear').onclick = () => { store.del('debugDate'); $('#dbg').value = ''; toast(t('realDate')); };
  $('#lock').onclick = () => { store.del('key'); location.hash = '#/vandaag'; location.reload(); };
}
function askWho(done) {
  setChrome(t('hola'), { hideNav: true });
  view.innerHTML = `<div class="hero tall" style="background-image:url(img/buenosaires.webp)"><h2>${t('hola')}</h2><p>${t('whoUses')}</p></div>
    <div class="tiles" style="grid-template-columns:1fr 1fr">${[['Martine', 'var(--p-ba)'], ['Thijs', 'var(--p-calafate)']].map(([n, c]) => `<button class="tile" data-me="${n}" style="padding:18px 8px;font-size:16px"><div class="bubble" style="background:${c};color:#fff;width:56px;height:56px;border-radius:50%;font-size:22px;font-weight:800">${n[0]}</div>${n}</button>`).join('')}</div>
    <div class="card" style="margin-top:14px"><strong>${t('language')}</strong>${langPicker()}</div>`;
  bindLang(() => askWho(done));
  view.querySelectorAll('[data-me]').forEach(b => b.onclick = () => { store.set('me', b.dataset.me); done(); });
}

/* ================= router ================= */
function route(soft) {
  if (!T) return;
  const [, a, b, c] = (location.hash || '#/vandaag').split('/');
  if (a !== 'kaart' && MAP) { MAP.remove(); MAP = null; }
  const tab = { vandaag: 'vandaag', kaart: 'kaart', agenda: 'agenda', dag: 'agenda', plekken: 'plekken', plek: 'plekken' }[a] || 'meer';
  document.querySelectorAll('.nav a').forEach(x => x.classList.toggle('active', x.dataset.tab === tab));
  const y = scrollY;
  ({ vandaag: vToday, kaart: () => vMap(b, c), agenda: vAgenda, dag: () => vDay(b), plekken: vPlaces, plek: () => vPlace(b), boekingen: vBookings, boeking: () => vBooking(b),
     todo: vTodo, bericht: () => vMessage(b), meer: vMore, info: vInfo, pakken: vPack, weer: vWeather, notities: vNotes, instellingen: vSettings,
     leesvoer: vReading, lees: () => vArticle(b), spaans: vSpanish }[a] || vToday)();
  if (soft) scrollTo(0, y); else if (a !== 'agenda') scrollTo(0, 0);
}
window.addEventListener('hashchange', () => route());
const net = () => { $('#offline').hidden = navigator.onLine; };
window.addEventListener('online', net); window.addEventListener('offline', net);

(async function start() {
  net();
  fetch('icons.svg').then(r => r.text()).then(s => document.body.insertAdjacentHTML('afterbegin', s)).catch(() => {});
  if ('serviceWorker' in navigator) {
    const t0 = Date.now(), had = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (!had) return; if (Date.now() - t0 < 15000) location.reload(); else toast(t('newVersion')); });
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
  try {
    const { key, data } = await unlock();
    KEY = key; BASE = data; RT = data.routes; CL = data.climate || {}; AR = data.articles || []; PH = data.phrases || null;
    applyLang();
    const go = () => { route(); Sync.init(); };
    store.get('me') ? go() : askWho(go);
  } catch (e) { setChrome(t('appName'), { hideNav: true }); view.innerHTML = `<div class="card" style="margin-top:40px"><h2>${t('cantLoad')}</h2><p class="muted">${esc(e.message)}</p></div>`; }
})();
