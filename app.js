'use strict';
/* Reis-app Argentinië & Chili — Martine & Thijs.
   De reisgegevens staan versleuteld in data.enc.json. De code wordt één keer per toestel gevraagd.
   Vinkjes en notities worden (versleuteld) gedeeld via Supabase als config.js dat instelt. */

const $ = (s, el = document) => el.querySelector(s);
const view = $('#view');
const store = {
  get(k, d = null) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  del(k) { try { localStorage.removeItem(k); } catch {} },
};
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ic = (n, cls = '') => `<svg class="ico ${cls}"><use href="#i-${n}"/></svg>`;

let T = null, PL = [], RT = null, KEY = null; // trip, places, routes, crypto key

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
  throw new Error('Geen data beschikbaar. Open de app één keer met internet.');
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
function showLock(enc, resolve) {
  setChrome('', { hideNav: true, hideBar: true });
  view.innerHTML = `<div class="lock">
    <div style="font-size:40px">🇦🇷 🇨🇱</div>
    <h2>Argentinië & Chili</h2>
    <p>Vul de code in die je van Martine of Thijs hebt gekregen. Dit hoeft maar één keer op dit toestel.</p>
    <input id="code" type="password" autocomplete="off" autocapitalize="none" placeholder="Code" aria-label="Code">
    <button class="btn" id="go">Openen</button>
    <div class="err" id="err"></div></div>`;
  const go = async () => {
    $('#err').textContent = ''; $('#go').textContent = 'Bezig…';
    try {
      const key = await deriveKey($('#code').value, b64.dec(enc.salt), enc.iter);
      const data = await decryptJSON(key, enc.iv, enc.ct);
      store.set('key', { salt: enc.salt, raw: b64.enc(await crypto.subtle.exportKey('raw', key)) });
      resolve({ key, data });
    } catch { $('#go').textContent = 'Openen'; $('#err').textContent = 'Die code klopt niet.'; }
  };
  $('#go').onclick = go;
  $('#code').addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
}

/* ================= shared state (Supabase) ================= */
const Sync = {
  cfg: () => window.SYNC && window.SYNC.url && window.SYNC.key ? window.SYNC : null,
  room: null,
  data() { return store.get('shared', {}); },
  get(k, d = null) { const e = this.data()[k]; return e ? e.v : d; },
  meta(k) { return this.data()[k] || null; },
  set(k, v) {
    const all = this.data(), t = Date.now();
    all[k] = { v, t, by: store.get('me', '') };
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
        const t = Number(r.t), loc = all[r.k];
        if (loc && loc.t >= t) continue;
        try {
          const [iv, ct] = r.v.split('.');
          const d = await decryptJSON(KEY, iv, ct);
          all[r.k] = { v: d.v, t, by: d.by }; changed = true;
        } catch {}
      }
      if (changed) { store.set('shared', all); if (/^#\/(todo|notities|vandaag|meer)/.test(location.hash || '#/vandaag') && !document.activeElement?.matches('textarea')) route(true); }
      this.ok(true);
    } catch { this.ok(false); }
  },
  ok(on) { $('#syncdot').classList.toggle('on', on); },
};

/* ================= dates ================= */
const DAYS = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'];
const DAYS_LONG = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
const MONTHS = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
const MONTHS_LONG = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
const parseD = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const fmt = (s, long) => { const d = parseD(s); return `${(long ? DAYS_LONG : DAYS)[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`; };
const range = (a, b) => { const A = parseD(a), B = parseD(b); return A.getMonth() === B.getMonth() ? `${A.getDate()}–${B.getDate()} ${MONTHS[B.getMonth()]}` : `${A.getDate()} ${MONTHS[A.getMonth()]} – ${B.getDate()} ${MONTHS[B.getMonth()]}`; };
function now() {
  const o = new URLSearchParams(location.search).get('d') || store.get('debugDate');
  if (o) { const d = parseD(o), n = new Date(); d.setHours(n.getHours(), n.getMinutes()); return d; }
  return new Date();
}
const todayIso = () => iso(now());
const dayDiff = (a, b) => Math.round((parseD(a) - parseD(b)) / 864e5);

/* ================= lookups ================= */
const byId = id => T.transport.find(x => x.id === id) || T.other.find(x => x.id === id) || T.stays.find(x => x.id === id);
const stay = id => T.stays.find(s => s.id === id);
const hike = id => T.hikes.find(h => h.id === id);
const place = id => PL.find(p => p.id === id);
const pcolor = id => id ? `var(--p-${id})` : 'var(--m-car)';
const img = p => p ? `img/${p.img}.webp` : '';
const TYPE = { flight: 'Vlucht', bus: 'Bus', boat: 'Boot', transfer: 'Vervoer', ticket: 'Ticket', stay: 'Verblijf' };
const TICON = { flight: 'plane', bus: 'bus', boat: 'ship', transfer: 'car-taxi-front', ticket: 'ticket', stay: 'bed-double', hike: 'footprints', note: 'info', todo: 'circle-alert' };
const PICON = { ba: 'landmark', chalten: 'mountain-snow', calafate: 'sparkles', natales: 'waves', paine: 'tent', mendoza: 'wine', uco: 'sunrise' };
const ORDER = ['ba', 'chalten', 'calafate', 'natales', 'paine', 'mendoza', 'uco'];
const mapsUrl = (q, ll) => ll ? `https://www.google.com/maps/search/?api=1&query=${ll[0]},${ll[1]}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
const tel = p => `tel:${p.replace(/[^+\d]/g, '')}`;
const status = s => s === 'todo' ? `<span class="badge todo">${ic('circle-alert', 'sm')}regelen</span>` : s === 'ok' ? `<span class="badge ok">${ic('check', 'sm')}geboekt</span>` : '';
const isTodoDay = d => d.items.some(it => it.status === 'todo' || (it.ref && byId(it.ref)?.status === 'todo'));

/* ================= ui helpers ================= */
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('show'), 1600); }
async function copy(text) {
  try { await navigator.clipboard.writeText(text); }
  catch { const a = document.createElement('textarea'); a.value = text; document.body.appendChild(a); a.select(); document.execCommand('copy'); a.remove(); }
  toast('Gekopieerd');
}
document.addEventListener('click', e => { const b = e.target.closest('[data-copy]'); if (b) { e.preventDefault(); copy(b.dataset.copy); } });
function setChrome(title, o = {}) {
  $('#title').textContent = title;
  $('#back').hidden = !o.back;
  $('#nav').style.display = o.hideNav ? 'none' : '';
  $('#topbar').style.display = o.hideBar ? 'none' : '';
  view.className = o.full ? 'full' : '';
  document.title = title ? `${title} · Argentinië` : 'Argentinië';
}
$('#back').onclick = () => history.length > 1 ? history.back() : (location.hash = '#/vandaag');
window.addEventListener('scroll', () => $('#topbar').classList.toggle('scrolled', scrollY > 4), { passive: true });
const codeBlock = codes => (codes || []).map(c => `<div class="code"><div class="grow"><div class="lbl">${esc(c.label)}</div><div class="val">${esc(c.value)}</div></div><button class="btn soft round" data-copy="${esc(c.value)}" aria-label="Kopieer">${ic('copy')}</button></div>`).join('');
const legsHtml = legs => (legs || []).map((l, i) => `<div class="leg">
  <div class="t">${esc(l.dep || '')}</div><div><div class="dot"></div><div class="line"></div></div><div><strong>${esc(l.from)}</strong></div>
  ${l.carrier || l.number ? `<div></div><div></div><div class="carrier">${ic(l.number ? 'plane' : 'bus', 'sm')} ${esc([l.carrier, l.number].filter(Boolean).join(' · '))}</div>` : ''}
  <div class="t">${esc(l.arr || '')}</div><div><div class="dot" style="background:var(--accent)"></div></div><div><strong>${esc(l.to)}</strong></div>
  </div>${i < legs.length - 1 ? '<div class="tiny muted" style="margin:10px 0 10px 64px">overstap</div>' : ''}`).join('');

/* ================= timeline ================= */
function tlItem(it) {
  if (it.ref) {
    const x = byId(it.ref); if (!x) return '';
    const first = x.legs?.[0] || {}, last = x.legs?.[x.legs.length - 1] || {};
    const times = [first.dep, last.arr].filter(Boolean).join(' → ');
    const nums = (x.legs || []).map(l => l.number).filter(Boolean).join(' + ');
    return `<div class="tl-item"><div class="tl-ico bg-${x.type}">${ic(TICON[x.type])}</div>
      <a class="tl-body" href="#/boeking/${esc(x.id)}"><div class="t"><span>${esc(times || TYPE[x.type])}${nums ? ' · ' + esc(nums) : ''}</span>${status(x.status)}</div>
      <strong>${esc(x.title)}</strong>${x.codes?.length ? `<div class="tiny muted" style="margin-top:4px">${ic('ticket', 'sm')} ${x.codes.length} ${x.codes.length === 1 ? 'code' : 'codes'} · tik voor details</div>` : ''}</a></div>`;
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
function stayCard(s, label = 'Slapen') {
  if (!s) return '';
  return `<div class="card"><div class="row"><div class="tile" style="box-shadow:none;padding:0;background:none"><div class="bubble" style="background:#0f766e;color:#fff">${ic('bed-double')}</div></div>
    <a class="grow" href="#/boeking/${esc(s.id)}" style="color:inherit"><div class="tiny muted" style="font-weight:700;text-transform:uppercase;letter-spacing:.04em">${esc(label)}</div><strong style="font-size:16px">${esc(s.name)}</strong>
    <div class="small muted">${esc(s.place)}${s.checkin ? ' · in ' + esc(s.checkin) : ''}</div></a>
    <a class="btn soft round" href="${mapsUrl(s.address)}" target="_blank" rel="noopener" aria-label="Route">${ic('navigation')}</a></div></div>`;
}

/* ================= views ================= */
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
    <div class="body"><strong>${esc(p.name)}</strong><div class="small muted">${esc(range(p.dates[0], p.dates[1]))} · ${p.country === 'CL' ? '🇨🇱' : '🇦🇷'}</div></div></a>`; }).join('')}</div>`;
}
function tiles() {
  const open = openTodoCount();
  const t = (href, icon, color, label, badge) => `<a class="tile" href="${href}"><div class="bubble" style="background:${color};color:#fff">${ic(icon)}</div>${label}${badge ? `<span class="badge-n">${badge}</span>` : ''}</a>`;
  return `<div class="tiles">${t('#/boekingen', 'ticket', 'var(--m-flight)', 'Boekingen')}${t('#/todo', 'list-checks', 'var(--todo)', 'Te doen', open)}${t('#/kaart', 'route', 'var(--m-hike)', 'Route')}${t('#/info', 'phone', '#e11d48', 'Nood')}</div>`;
}
function vToday() {
  setChrome('Vandaag');
  const t = todayIso(), { start, end } = T.meta;
  let h = '';
  if (t < start) {
    const n = dayDiff(start, t);
    h += `<div class="hero tall" style="background-image:url(img/paine.webp)"><div class="eyebrow">${ic('plane', 'sm')} Vertrek ${esc(fmt(start, true))} · 07:10</div>
      <div class="count">${n}</div><h2>${n === 1 ? 'dag' : 'dagen'} tot Argentinië</h2>
      <div class="glass-row"><span class="glass">${ic('calendar-days', 'sm')} 23 dagen</span><span class="glass">${ic('map-pin', 'sm')} 7 plekken</span><span class="glass">${ic('flag', 'sm')} 2 landen</span></div></div>`;
    h += tiles();
    h += `<div class="h-sec">${ic('route')} Jullie route <small><a href="#/kaart">Kaart ›</a></small></div>` + stageScroller();
    h += `<div class="h-sec">${ic('sunrise')} Dag 1 · ${esc(fmt(start))}</div>` + timeline(T.days[0]) + stayCard(stay(T.days[0].sleep));
  } else if (t > end) {
    h += `<div class="hero tall" style="background-image:url(img/uco.webp)"><h2>Welkom thuis</h2><p>23 dagen, 7 plekken, 1 W-trek. Wat een reis.</p></div>` + tiles();
  } else {
    const d = T.days.find(x => x.date === t), i = T.days.indexOf(d), p = place(d.placeId);
    h += `<div class="hero" style="background-image:url(${img(p) || 'img/uco.webp'})"><div class="eyebrow">${ic('calendar-days', 'sm')} Dag ${i + 1} van ${T.days.length} · ${esc(fmt(t, true))}</div>
      <h2>${esc(d.title)}</h2><p>${esc(d.place)}</p>${d.sleep ? `<div class="glass-row"><span class="glass">${ic('bed-double', 'sm')} ${esc(stay(d.sleep).name)}</span></div>` : ''}</div>`;
    h += tiles();
    const nx = nextMove();
    if (nx) h += `<div class="h-sec">${ic('clock')} Volgende vertrek <small>${nx.x.date === t ? 'vandaag' : esc(fmt(nx.x.date))}</small></div><div class="tl">${tlItem({ ref: nx.x.id })}</div>`;
    h += `<div class="h-sec">${ic('sun')} Vandaag</div>` + timeline(d) + (d.sleep ? stayCard(stay(d.sleep)) : '');
    if (p) {
      const pool = p.gems.length ? p.gems : p.highlights, g = pool[dayDiff(t, start) % pool.length];
      h += `<div class="h-sec">${ic('gem')} Tip voor vandaag</div><a class="card" href="#/plek/${p.id}"><div class="tip"><div class="bubble b-gem">${ic(g.icon || 'gem')}</div><div class="grow"><strong>${esc(g.name)}</strong><p>${esc(g.text)}</p></div></div></a>`;
    }
    const tm = T.days[i + 1];
    if (tm) h += `<div class="h-sec">${ic('chevron-right')} Morgen</div><a class="dayrow" href="#/dag/${tm.date}"><div class="db" style="background:${pcolor(tm.placeId)}"><span>${DAYS[parseD(tm.date).getDay()]}</span><b>${parseD(tm.date).getDate()}</b></div><div class="grow"><strong>${esc(tm.title)}</strong><div class="small muted">${esc(tm.place)}</div></div>${ic('chevron-right', 'chev')}</a>`;
  }
  view.innerHTML = h;
}

/* ---------- agenda ---------- */
let agendaMode = store.get('agendaMode', 'kalender');
function dayIcon(d) {
  const refs = d.items.map(it => it.ref && byId(it.ref)).filter(Boolean);
  if (refs.some(x => x.type === 'flight')) return 'plane';
  if (d.items.some(it => it.hike)) return 'footprints';
  if (refs.some(x => x.type === 'bus')) return 'bus';
  return PICON[d.placeId] || 'sun';
}
function vAgenda() {
  setChrome('Agenda');
  const t = todayIso();
  let h = `<div class="seg"><button data-m="kalender" class="${agendaMode === 'kalender' ? 'on' : ''}">Kalender</button><button data-m="lijst" class="${agendaMode === 'lijst' ? 'on' : ''}">Lijst</button></div>`;
  if (agendaMode === 'kalender') {
    h += `<div class="cal">${['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'].map(w => `<div class="wd">${w}</div>`).join('')}`;
    const d0 = parseD('2026-11-23');
    for (let i = 0; i < 35; i++) {
      const dt = new Date(d0); dt.setDate(d0.getDate() + i);
      const ds = iso(dt), d = T.days.find(x => x.date === ds), dd = dt.getDate();
      const lbl = dd === 1 || i === 0 ? `<span class="tiny" style="font-size:9px;text-transform:uppercase;opacity:.85">${MONTHS[dt.getMonth()]}</span>` : '';
      if (!d) { h += `<div class="c ${ds === t ? 'today' : ''}">${dd}${lbl}</div>`; continue; }
      h += `<a class="c trip ${ds === t ? 'today' : ''}" href="#/dag/${ds}" style="background:${pcolor(d.placeId)}">${dd}${ic(dayIcon(d))}${isTodoDay(d) ? '<i class="dot"></i>' : ''}</a>`;
    }
    h += `</div>`;
    h += `<div class="legend">${ORDER.map(id => `<span><i style="background:${pcolor(id)}"></i>${esc(place(id).name)}</span>`).join('')}<span><i style="background:#fff;box-shadow:0 0 0 2px var(--todo)"></i>nog regelen</span></div>`;
  } else {
    let cur = null;
    for (const [i, d] of T.days.entries()) {
      if (d.placeId !== cur) { cur = d.placeId; const p = place(cur); h += `<div class="stage-head">${p ? `<div class="thumb" style="background-image:url(${img(p)})"></div>` : `<div class="thumb" style="background:var(--m-car)"></div>`}<div><strong>${esc(p ? p.name : 'Naar huis')}</strong><div class="tiny muted">${p ? esc(p.tagline) : 'Mendoza → Buenos Aires → Amsterdam'}</div></div></div>`; }
      const dt = parseD(d.date);
      h += `<a class="dayrow ${d.date < t ? 'past' : ''} ${d.date === t ? 'today' : ''}" href="#/dag/${d.date}"><div class="db" style="background:${pcolor(d.placeId)}"><span>${DAYS[dt.getDay()]}</span><b>${dt.getDate()}</b><span>${MONTHS[dt.getMonth()]}</span></div>
        <div class="grow"><strong>${esc(d.title)}</strong><div class="small muted">Dag ${i + 1}${d.sleep ? ' · ' + esc(stay(d.sleep).name) : ''}</div></div>${isTodoDay(d) ? status('todo') : ic('chevron-right', 'chev')}</a>`;
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
  view.innerHTML = `<div class="hero" style="background-image:url(${img(p) || 'img/uco.webp'})"><div class="eyebrow">${ic('calendar-days', 'sm')} Dag ${i + 1} · ${esc(fmt(date, true))}</div><h2>${esc(d.title)}</h2><p>${esc(d.place)}</p>
    ${p ? `<div class="glass-row"><a class="glass" style="color:#fff" href="#/plek/${p.id}">${ic('compass', 'sm')} Gids ${esc(p.name)}</a><a class="glass" style="color:#fff" href="#/kaart/${p.id}">${ic('map', 'sm')} Kaart</a></div>` : ''}</div>
    ${timeline(d)}${d.sleep ? stayCard(stay(d.sleep)) : ''}
    <div class="btns" style="justify-content:space-between">${prev ? `<a class="btn soft" href="#/dag/${prev.date}">${ic('chevron-left', 'sm')} ${esc(fmt(prev.date))}</a>` : '<span></span>'}${next ? `<a class="btn soft" href="#/dag/${next.date}">${esc(fmt(next.date))} ${ic('chevron-right', 'sm')}</a>` : ''}</div>`;
}

/* ---------- places ---------- */
function vPlaces() {
  setChrome('Plekken');
  view.innerHTML = `<p class="muted small" style="margin:4px 2px 14px">Highlights, hidden gems en waar je goed eet, per plek.</p><div class="pgrid">${ORDER.map((id, i) => { const p = place(id);
    return `<a class="pcard ${i === 0 ? 'wide' : ''}" href="#/plek/${id}" style="background-image:url(${img(p)})"><span>${p.country === 'CL' ? '🇨🇱' : '🇦🇷'} ${esc(range(p.dates[0], p.dates[1]))}</span><strong>${esc(p.name)}</strong></a>`; }).join('')}</div>`;
}
function tipCard(p, it, kind) {
  const cls = { hl: 'b-hl', gem: 'b-gem', food: 'b-food' }[kind];
  const icon = it.icon || { hl: 'star', gem: 'gem', food: 'utensils' }[kind];
  return `<div class="card"><div class="tip"><div class="bubble ${cls}">${ic(icon)}</div><div class="grow"><strong>${esc(it.name)}</strong><p>${esc(it.text)}</p>
    <div class="acts">${it.ll ? `<a href="#/kaart/${p.id}/${encodeURIComponent(it.name)}">${ic('map', 'sm')} Op kaart</a>` : ''}<a href="${mapsUrl(it.q || it.name, it.ll)}" target="_blank" rel="noopener">${ic('navigation', 'sm')} Route</a></div></div></div></div>`;
}
let placeTab = 'hl';
function vPlace(id) {
  const p = place(id); if (!p) return vPlaces();
  setChrome(p.name, { back: true });
  const stays = T.stays.filter(s => T.days.some(d => d.placeId === id && d.sleep === s.id));
  const tabs = [['hl', 'Highlights', p.highlights], ['gem', 'Gems', p.gems], ['food', 'Eten', p.food]];
  if (!tabs.some(t => t[0] === placeTab)) placeTab = 'hl';
  const cur = tabs.find(t => t[0] === placeTab);
  view.innerHTML = `<div class="hero tall" style="background-image:url(${img(p)})"><div class="eyebrow">${p.country === 'CL' ? '🇨🇱 Chili' : '🇦🇷 Argentinië'} · ${esc(range(p.dates[0], p.dates[1]))}</div><h2>${esc(p.name)}</h2><p>${esc(p.tagline)}</p>
    <div class="glass-row"><a class="glass" style="color:#fff" href="#/kaart/${id}">${ic('map', 'sm')} Op de kaart</a></div></div>
    <div class="card"><p style="margin:0">${esc(p.intro)}</p></div>
    ${p.plan ? `<div class="h-sec">${ic('calendar-days')} Voorstel</div><div class="card">${p.plan.map(x => `<div class="plan"><b>${esc(x.day)}</b><div>${esc(x.text)}</div></div>`).join('')}</div>` : ''}
    <div class="seg" style="margin-top:20px">${tabs.map(([k, l, arr]) => `<button data-t="${k}" class="${placeTab === k ? 'on' : ''}">${l} <span class="muted">${arr.length}</span></button>`).join('')}</div>
    ${cur[2].map(it => tipCard(p, it, cur[0])).join('')}
    <div class="h-sec">${ic('lightbulb')} Goed om te weten</div><div class="card"><ul class="clean">${p.tips.map(t => `<li>${ic('check', 'sm')}<span>${esc(t)}</span></li>`).join('')}</ul></div>
    ${stays.length ? `<div class="h-sec">${ic('bed-double')} Hier slapen jullie</div>` + stays.map(s => stayCard(s, range(s.in, s.out))).join('') : ''}`;
  view.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { placeTab = b.dataset.t; const y = scrollY; vPlace(id); scrollTo(0, y); });
}

/* ---------- map ---------- */
let MAP = null;
const MODE = { flight: { c: '#6366f1', w: 2.5, dash: '6 7', label: 'Vlucht', icon: 'plane' }, bus: { c: '#f59e0b', w: 4, label: 'Bus', icon: 'bus' }, boat: { c: '#06b6d4', w: 4, dash: '2 8', label: 'Boot', icon: 'ship' }, car: { c: '#64748b', w: 3, label: 'Auto', icon: 'car-taxi-front' }, hike: { c: '#16a34a', w: 4, label: 'Wandelen', icon: 'footprints' } };
const isDark = () => document.documentElement.dataset.theme === 'dark' || (document.documentElement.dataset.theme !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches);
let mapTips = store.get('mapTips', true);
function vMap(focus, tipName) {
  setChrome('Kaart', { full: true, hideBar: true });
  view.innerHTML = `<div class="mapwrap"><div id="map"></div></div>
    <div class="map-top"><div class="chips">
      <button class="chip ${mapTips ? 'on' : ''}" id="tipsBtn">${ic('sparkles', 'sm')} Tips</button>
      <button class="chip" id="allBtn">${ic('route', 'sm')} Hele route</button>
      ${Object.entries(MODE).map(([k, m]) => `<span class="chip"><i class="sw" style="background:${m.c}"></i>${m.label}</span>`).join('')}
    </div></div>
    <div class="map-bottom"><div class="hscroll">${ORDER.map((id, i) => { const p = place(id); return `<button class="mstage" data-fly="${id}"><div class="thumb" style="background-image:url(${img(p)})"></div><div style="text-align:left"><strong>${i + 1}. ${esc(p.name)}</strong><span>${esc(range(p.dates[0], p.dates[1]))}</span></div></button>`; }).join('')}</div></div>`;
  if (!window.L) { $('#map').innerHTML = '<div class="card" style="margin:120px 16px">Kaart kon niet laden.</div>'; return; }
  if (MAP) { MAP.remove(); MAP = null; }
  const map = MAP = L.map('map', { zoomControl: false, attributionControl: true, worldCopyJump: false }).setView([-42, -66], 4);
  map.createPane('land'); map.getPane('land').style.zIndex = 150;
  fetch('geo/countries.json').then(r => r.json()).then(geo => L.geoJSON(geo, { pane: 'land', interactive: false,
    style: f => ({ color: isDark() ? '#334155' : '#b8c4d4', weight: 1, fillColor: f.properties.main ? (isDark() ? '#1e2733' : '#fbfaf7') : (isDark() ? '#161d27' : '#eef0f2'), fillOpacity: 1 }) }).addTo(map)).catch(() => {});
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', className: 'osm-tiles' }).addTo(map);
  for (const l of RT.legs) {
    const m = MODE[l.mode]; if (!m) continue;
    if (l.mode !== 'flight') L.polyline(l.line, { color: '#fff', weight: m.w + 4, opacity: 0.9, interactive: false }).addTo(map);
    L.polyline(l.line, { color: m.c, weight: m.w, dashArray: m.dash, opacity: 0.95, lineCap: 'round' }).addTo(map)
      .bindPopup(() => { const x = byId(l.id) || hike(l.id) || hike(l.id.replace(/b$/, '')); return `<strong>${ic(m.icon, 'sm')} ${esc(x?.title || x?.name || m.label)}</strong>${x?.date ? `<div class="muted">${esc(fmt(x.date))}</div>` : ''}${x?.date ? `<a class="btn" href="#/boeking/${x.id}">Details</a>` : ''}`; });
  }
  const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const mk = (ll, html, cls, size, bg) => L.marker(ll, { icon: L.divIcon({ className: '', html: `<div class="${cls}" style="background:${bg}">${html}</div>`, iconSize: [size, size], iconAnchor: [size / 2, size / 2] }) });
  ORDER.forEach((id, i) => {
    const p = place(id), s = stay(T.days.find(d => d.placeId === id && d.sleep)?.sleep);
    mk(s?.ll || p.center, i + 1, 'stop-marker', 30, css(`--p-${id}`)).setZIndexOffset(1000).addTo(map)
      .bindPopup(`<strong>${i + 1}. ${esc(p.name)}</strong><div class="muted">${esc(range(p.dates[0], p.dates[1]))}</div><div>${esc(p.tagline)}</div><a class="btn" href="#/plek/${id}">Bekijk gids</a>`);
  });
  for (const id of ['painegrande', 'frances', 'chileno']) {
    const s = stay(id);
    mk(s.ll, ic('tent'), 'tip-marker', 26, '#0f766e').setZIndexOffset(900).addTo(map).bindPopup(`<strong>${esc(s.name)}</strong><div class="muted">${esc(range(s.in, s.out))}</div><a class="btn" href="#/boeking/${id}">Details</a>`);
  }
  const tipLayer = L.layerGroup(), tipMarkers = {};
  for (const p of PL) for (const [list, color, kind] of [['highlights', '#2f6fd6', 'hl'], ['gems', '#8b5cf6', 'gem'], ['food', '#ea580c', 'food']]) for (const it of p[list]) {
    if (!it.ll) continue;
    const m = mk(it.ll, ic(it.icon || { hl: 'star', gem: 'gem', food: 'utensils' }[kind]), 'tip-marker', 26, color);
    m.bindPopup(`<span class="badge ${kind === 'gem' ? 'gem' : 'plain'}">${{ hl: 'Highlight', gem: 'Hidden gem', food: 'Eten & drinken' }[kind]}</span><div style="margin-top:6px"><strong>${esc(it.name)}</strong></div><div>${esc(it.text)}</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap"><a class="btn" href="${mapsUrl(it.q, it.ll)}" target="_blank" rel="noopener">Route</a><a class="btn" style="background:var(--accent-soft);color:var(--accent)" href="#/plek/${p.id}">Gids</a></div>`, { maxWidth: 260 });
    tipLayer.addLayer(m); tipMarkers[p.id + '|' + it.name] = m;
  }
  if (mapTips) tipLayer.addTo(map);
  const fitAll = () => { map.invalidateSize(); map.fitBounds(L.latLngBounds(RT.legs.flatMap(l => l.line)), { paddingTopLeft: [20, 70], paddingBottomRight: [20, 190] }); };
  const fly = id => { const p = place(id); map.flyTo(p.center, p.zoom, { duration: 0.8 }); };
  requestAnimationFrame(() => {
    map.invalidateSize();
    if (focus && place(focus)) {
      const p = place(focus); map.setView(p.center, p.zoom);
      if (tipName) { const m = tipMarkers[focus + '|' + decodeURIComponent(tipName)]; if (m) { if (!mapTips) { mapTips = true; tipLayer.addTo(map); $('#tipsBtn').classList.add('on'); } map.setView(m.getLatLng(), Math.max(p.zoom, 14)); setTimeout(() => m.openPopup(), 300); } }
    } else fitAll();
  });
  $('#tipsBtn').onclick = () => { mapTips = !mapTips; store.set('mapTips', mapTips); $('#tipsBtn').classList.toggle('on', mapTips); mapTips ? tipLayer.addTo(map) : tipLayer.remove(); };
  $('#allBtn').onclick = fitAll;
  view.querySelectorAll('[data-fly]').forEach(b => b.onclick = () => fly(b.dataset.fly));
  L.control.zoom({ position: 'topright' }).addTo(map);
  map.getContainer().querySelector('.leaflet-top.leaflet-right').style.marginTop = 'calc(env(safe-area-inset-top) + 60px)';
}

/* ---------- bookings ---------- */
let filter = 'all';
function vBookings() {
  setChrome('Boekingen', { back: true });
  const groups = [['all', 'Alles', 'sparkles'], ['flight', 'Vluchten', 'plane'], ['stay', 'Slapen', 'bed-double'], ['bus', 'Bus & boot', 'bus'], ['todo', 'Regelen', 'circle-alert']];
  const all = [...T.transport.map(x => ({ ...x, sort: x.date + (x.legs?.[0]?.dep || '') })), ...T.other.map(x => ({ ...x, sort: x.date + '06' })), ...T.stays.map(x => ({ ...x, type: 'stay', date: x.in, sort: x.in + '99' }))].sort((a, b) => a.sort.localeCompare(b.sort));
  const show = all.filter(x => filter === 'all' || (filter === 'todo' ? x.status === 'todo' : filter === 'bus' ? ['bus', 'boat', 'transfer', 'ticket'].includes(x.type) : x.type === filter));
  view.innerHTML = `<div class="chips">${groups.map(([k, l, i]) => `<button class="chip ${filter === k ? 'on' : ''}" data-f="${k}">${ic(i, 'sm')} ${l}</button>`).join('')}</div>` +
    show.map(x => `<a class="card" href="#/boeking/${esc(x.id)}"><div class="row"><div class="tl-ico bg-${x.type}">${ic(TICON[x.type])}</div><div class="grow">
      <div class="tiny muted" style="font-weight:700">${esc(fmt(x.date))}${x.type === 'stay' ? ' → ' + esc(fmt(x.out)) : ''}</div><strong>${esc(x.name || x.title)}</strong>
      <div class="small muted">${x.type === 'stay' ? esc(x.place) : esc((x.legs || []).map(l => l.number).filter(Boolean).join(' + ') || (x.legs?.[0]?.dep ? 'vertrek ' + x.legs[0].dep : x.codes?.[0]?.value || ''))}</div></div>${status(x.status)}</div></a>`).join('');
  view.querySelectorAll('[data-f]').forEach(b => b.onclick = () => { filter = b.dataset.f; vBookings(); });
}
function vBooking(id) {
  const x = byId(id); if (!x) return vBookings();
  const isStay = !!x.address, type = isStay ? 'stay' : x.type;
  setChrome(isStay ? 'Verblijf' : TYPE[x.type] || 'Boeking', { back: true });
  let h = `<div class="card"><div class="row top"><div class="tl-ico bg-${type}" style="width:52px;height:52px;border-radius:17px">${ic(TICON[type], 'lg')}</div><div class="grow">
    <h2 style="margin:0;font-size:21px;letter-spacing:-.02em">${esc(x.name || x.title)}</h2><div class="muted small">${isStay ? `${esc(fmt(x.in, true))} → ${esc(fmt(x.out, true))}` : esc(fmt(x.date, true))}</div><div style="margin-top:6px">${status(x.status)}</div></div></div>`;
  if (isStay) {
    h += `<dl class="facts" style="margin:16px 0 0"><dt>Inchecken</dt><dd>${esc(x.checkin || '–')}</dd><dt>Uitchecken</dt><dd>${esc(x.checkout || '–')}</dd><dt>Adres</dt><dd>${esc(x.address)}</dd></dl>
      <div class="btns"><a class="btn" href="${mapsUrl(x.address)}" target="_blank" rel="noopener">${ic('navigation', 'sm')} Route</a>${x.phone ? `<a class="btn soft" href="${tel(x.phone)}">${ic('phone', 'sm')} Bellen</a>` : ''}<button class="btn soft" data-copy="${esc(x.address)}">${ic('copy', 'sm')} Adres</button></div>`;
  } else if (x.legs) h += `<div style="margin-top:18px">${legsHtml(x.legs)}</div>`;
  h += `</div>`;
  if (x.codes?.length) h += `<div class="h-sec">${ic('ticket')} Codes</div>` + codeBlock(x.codes);
  const facts = [['Bagage', x.baggage], ['Prijs', x.price], ['Betaling', x.payment], ['Annuleren', x.cancel]].filter(f => f[1]);
  if (facts.length) h += `<div class="h-sec">${ic('info')} Details</div><div class="card"><dl class="facts" style="margin:0">${facts.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}</dl></div>`;
  if (x.notes?.length) h += `<div class="h-sec">${ic('lightbulb')} Goed om te weten</div><div class="card"><ul class="clean">${x.notes.map(n => `<li>${ic('check', 'sm')}<span>${esc(n)}</span></li>`).join('')}</ul></div>`;
  const days = T.days.filter(d => d.items.some(it => it.ref === id) || d.sleep === id);
  if (days.length) h += `<div class="h-sec">${ic('calendar-days')} In het schema</div>` + days.map(d => `<a class="dayrow" href="#/dag/${d.date}"><div class="db" style="background:${pcolor(d.placeId)}"><span>${DAYS[parseD(d.date).getDay()]}</span><b>${parseD(d.date).getDate()}</b></div><div class="grow"><strong>${esc(d.title)}</strong></div>${ic('chevron-right', 'chev')}</a>`).join('');
  view.innerHTML = h;
}

/* ---------- to-do (gedeeld) ---------- */
const todoKey = id => 'todo:' + id;
function openTodoCount() { return T.todos.flatMap(g => g.items).filter(i => !Sync.get(todoKey(i.id))).length; }
function vTodo() {
  setChrome('Te doen', { back: true });
  const all = T.todos.flatMap(g => g.items), done = all.filter(i => Sync.get(todoKey(i.id))).length, pct = Math.round(done / all.length * 100);
  let h = `<div class="card"><div class="row"><div class="ring" style="--p:${pct}"><div>${pct}%</div></div><div class="grow"><strong style="font-size:18px">${done} van ${all.length} geregeld</strong>
    <div class="small muted">${Sync.room ? `${ic('circle-check', 'sm')} Gedeeld met ${store.get('me') === 'Thijs' ? 'Martine' : 'Thijs'}` : 'Alleen op dit toestel'}</div></div></div></div>`;
  for (const g of T.todos) {
    const n = g.items.filter(i => !Sync.get(todoKey(i.id))).length;
    h += `<div class="h-sec">${esc(g.group)} <small>${n ? n + ' open' : '✓ klaar'}</small></div><div class="card">`;
    for (const it of g.items) {
      const on = !!Sync.get(todoKey(it.id)), m = Sync.meta(todoKey(it.id));
      h += `<label class="check ${on ? 'done' : ''}"><input type="checkbox" data-todo="${esc(it.id)}" ${on ? 'checked' : ''}><span>${esc(it.text)}${it.message ? ` <a href="#/bericht/${esc(it.message)}">Bericht ›</a>` : ''}${on && m?.by ? `<span class="who">✓ ${esc(m.by)}</span>` : ''}</span></label>`;
    }
    h += `</div>`;
  }
  view.innerHTML = h;
  view.querySelectorAll('[data-todo]').forEach(cb => cb.onchange = () => { Sync.set(todoKey(cb.dataset.todo), cb.checked); const y = scrollY; vTodo(); scrollTo(0, y); });
}
function vMessage(key) {
  const m = T.messages[key]; if (!m) return vTodo();
  setChrome('Bericht', { back: true });
  const wa = m.channel === 'WhatsApp' ? `https://wa.me/${m.to.replace(/[^\d]/g, '')}?text=${encodeURIComponent(m.body)}` : null;
  const mail = m.channel === 'E-mail' ? `mailto:${m.to}?subject=${encodeURIComponent(m.subject)}&body=${encodeURIComponent(m.body)}` : null;
  view.innerHTML = `<div class="card"><div class="tiny muted" style="font-weight:700">${esc(m.channel)} naar</div><h3 style="margin:2px 0 0">${esc(m.to)}</h3>
    ${m.subject ? `<div class="tiny muted" style="margin-top:10px;font-weight:700">Onderwerp</div><div>${esc(m.subject)}</div>` : ''}<div class="msg">${esc(m.body)}</div>
    <div class="btns">${wa ? `<a class="btn" href="${wa}" target="_blank" rel="noopener">Open in WhatsApp</a>` : ''}${mail ? `<a class="btn" href="${mail}">Open in Mail</a>` : ''}<button class="btn soft" data-copy="${esc(m.body)}">${ic('copy', 'sm')} Kopieer</button></div></div>`;
}

/* ---------- meer ---------- */
function vMore() {
  setChrome('Meer');
  const L1 = (href, icon, color, t, s, badge) => `<a class="list-link" href="${href}"><div class="bubble" style="background:${color};color:#fff">${ic(icon)}</div><div class="grow"><strong>${t}</strong><span>${s}</span></div>${badge ? `<span class="badge todo">${badge}</span>` : ''}${ic('chevron-right', 'chev')}</a>`;
  view.innerHTML = `<div class="card">${L1('#/boekingen', 'ticket', 'var(--m-flight)', 'Boekingen', 'Vluchten, hotels, bussen, codes')}${L1('#/todo', 'list-checks', 'var(--todo)', 'Te doen', 'Samen afvinken', openTodoCount())}${L1('#/pakken', 'backpack', 'var(--m-hike)', 'Paklijst', 'Per persoon')}</div>
    <div class="card">${L1('#/info', 'info', '#e11d48', 'Praktisch', 'Noodnummers, geld, grens, Spaans')}${L1('#/notities', 'notebook-pen', 'var(--m-boat)', 'Notities', 'Gedeeld met elkaar')}${L1('#/instellingen', 'settings', 'var(--m-car)', 'Instellingen', 'Wie ben jij, vergrendelen')}</div>`;
}
function vInfo() {
  setChrome('Praktisch', { back: true });
  view.innerHTML = T.info.map(s => `<div class="h-sec">${esc(s.title)}</div><div class="card">${s.items.map(i => `<div class="row" style="padding:8px 0"><div class="grow">${i.label ? `<strong>${esc(i.label)}</strong>` : ''}${i.text ? `<div class="${i.label ? 'small muted' : ''}">${esc(i.text)}</div>` : ''}</div>${i.phone ? `<a class="btn soft" href="${tel(i.phone)}">${ic('phone', 'sm')} ${esc(i.phone)}</a>` : ''}</div>`).join('')}</div>`).join('');
}
function vPack() {
  setChrome('Paklijst', { back: true });
  const me = store.get('me', '');
  view.innerHTML = `<p class="muted small" style="margin:4px 2px 12px">Paklijst${me ? ' van ' + esc(me) : ''}, alleen op dit toestel.</p><div class="card">${T.packing.map((p, i) => { const on = !!store.get('pack:' + i);
    return `<label class="check ${on ? 'done' : ''}"><input type="checkbox" data-p="${i}" ${on ? 'checked' : ''}><span>${esc(p)}</span></label>`; }).join('')}</div>`;
  view.querySelectorAll('[data-p]').forEach(cb => cb.onchange = () => { store.set('pack:' + cb.dataset.p, cb.checked); cb.closest('.check').classList.toggle('done', cb.checked); });
}
function vNotes() {
  setChrome('Notities', { back: true });
  const m = Sync.meta('notes');
  view.innerHTML = `<p class="muted small" style="margin:4px 2px 12px">${Sync.room ? 'Gedeeld: Martine en Thijs zien dezelfde notities.' : 'Alleen op dit toestel.'}${m?.by ? ` Laatst bewerkt door ${esc(m.by)}.` : ''}</p>
    <textarea id="notes" placeholder="Reisverzekering, alarmnummer, polisnummer, ideeën, dagboek…">${esc(Sync.get('notes', store.get('notes', '')))}</textarea>`;
  let tmr; $('#notes').addEventListener('input', e => { clearTimeout(tmr); tmr = setTimeout(() => Sync.set('notes', e.target.value), 600); });
}
function vSettings() {
  setChrome('Instellingen', { back: true });
  const me = store.get('me', ''), dbg = store.get('debugDate', '');
  view.innerHTML = `<div class="card"><strong>Wie ben jij?</strong><p class="small muted" style="margin:2px 0 0">Zo zie je wie iets heeft afgevinkt.</p>
    <div class="seg" style="margin-bottom:0">${['Martine', 'Thijs'].map(n => `<button data-me="${n}" class="${me === n ? 'on' : ''}">${n}</button>`).join('')}</div></div>
    <div class="card"><strong>Synchronisatie</strong><p class="small muted" style="margin:2px 0 0">${Sync.room ? 'Aan. Vinkjes en notities worden versleuteld gedeeld en offline bewaard tot er weer internet is.' : 'Uit. Vinkjes blijven op dit toestel.'}</p></div>
    <div class="card"><strong>Bekijk de app op een andere datum</strong><p class="small muted" style="margin:2px 0 8px">Om te zien hoe "Vandaag" eruitziet tijdens de reis.</p>
    <input type="date" id="dbg" value="${esc(dbg)}" min="2026-11-01" max="2026-12-31" style="font:inherit;padding:10px;border-radius:12px;border:0;background:var(--surface-2);color:var(--text)">
    <div class="btns"><button class="btn soft" id="dbgclear">Terug naar vandaag</button></div></div>
    <div class="card"><strong>Vergrendelen</strong><p class="small muted" style="margin:2px 0 0">Verwijdert de code van dit toestel.</p><div class="btns"><button class="btn soft" id="lock">Vergrendel</button></div></div>
    <p class="tiny muted" style="text-align:center">Gegevens bijgewerkt op ${esc(fmt(T.meta.updated, true))}. Kaart © OpenStreetMap-bijdragers. Iconen: Lucide.</p>`;
  view.querySelectorAll('[data-me]').forEach(b => b.onclick = () => { store.set('me', b.dataset.me); vSettings(); toast('Hoi ' + b.dataset.me); });
  $('#dbg').onchange = e => { store.set('debugDate', e.target.value || null); toast('Datum ingesteld'); };
  $('#dbgclear').onclick = () => { store.del('debugDate'); $('#dbg').value = ''; toast('Echte datum'); };
  $('#lock').onclick = () => { store.del('key'); location.hash = '#/vandaag'; location.reload(); };
}
function askWho(done) {
  setChrome('Welkom', { hideNav: true });
  view.innerHTML = `<div class="hero tall" style="background-image:url(img/buenosaires.webp)"><h2>¡Hola!</h2><p>Wie gebruikt deze telefoon?</p></div>
    <div class="tiles" style="grid-template-columns:1fr 1fr">${[['Martine', 'var(--p-ba)'], ['Thijs', 'var(--p-calafate)']].map(([n, c]) => `<button class="tile" data-me="${n}" style="padding:18px 8px;font-size:16px"><div class="bubble" style="background:${c};color:#fff;width:56px;height:56px;border-radius:50%;font-size:22px;font-weight:800">${n[0]}</div>${n}</button>`).join('')}</div>`;
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
     todo: vTodo, bericht: () => vMessage(b), meer: vMore, info: vInfo, pakken: vPack, notities: vNotes, instellingen: vSettings }[a] || vToday)();
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
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (!had) return; if (Date.now() - t0 < 15000) location.reload(); else toast('Nieuwe versie klaar. Sluit en open de app.'); });
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
  try {
    const { key, data } = await unlock();
    KEY = key; T = data.trip; PL = data.places; RT = data.routes;
    const go = () => { route(); Sync.init(); };
    store.get('me') ? go() : askWho(go);
  } catch (e) { setChrome('Argentinië', { hideNav: true }); view.innerHTML = `<div class="card" style="margin-top:40px"><h2>Kan niet laden</h2><p class="muted">${esc(e.message)}</p></div>`; }
})();
