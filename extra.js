/* Extra (nov 2026): reisverzekering, reisoverzicht om te printen, eten & bucketlist, offline wandelkaart, paardrijden. */
const XT_STR = {
  nl: {
    ins: 'Reisverzekering', insAdd: 'Reisverzekering toevoegen', insWhy: 'Zet hier je verzekeraar en het alarmnummer, dan bel je het met één tik. Thijs ziet het ook.',
    insCo: 'Verzekeraar', insPhone: 'Alarmnummer (24/7)', insPolicy: 'Polisnummer', insNote: 'Notitie (bijv. pasnummer, wie is verzekerd)', insSave: 'Bewaar', insEdit: 'Wijzig', insCall: 'Bel alarmnummer', insCancel: 'Annuleer',
    ov: 'Reisoverzicht', ovSub: 'Alles op één pagina, om te printen of als PDF', ovIntro: 'Voor als je telefoon leeg of kwijt is. Print dit, of bewaar het als PDF en stuur het naar Thijs.', ovPrint: 'Print of bewaar als PDF',
    ovHow: 'iPhone: tik op Print, knijp het voorbeeld open met twee vingers en kies Deel › Bewaar in Bestanden.', ovTransport: 'Vervoer', ovStays: 'Slapen', ovEmergency: 'Nood', ovTodo: 'nog regelen', ovMade: 'Gemaakt op {d}',
    food: 'Eten & bucketlist', foodSub: 'Wat je geproefd en gedaan moet hebben', foodLead: 'Proef het, doe het, vink het af. Jullie zien elkaars vinkjes.', foodDone: '{a} van {b} gedaan', foodWhere: 'Waar je dit eet', foodGuide: 'Uit de gids per plek',
    hikeMap: 'Wandelkaart', hmOffline: 'Werkt zonder bereik: de paden, meren en kampen zitten in de app. Je locatie komt van GPS, ook zonder internet.', hmLocate: 'Waar ben ik?', hmLocating: 'Locatie zoeken…', hmNoLoc: 'Locatie niet beschikbaar. Sta locatie toe voor Safari (Instellingen › Privacy › Locatie).',
    hmFar: 'Je bent nog niet in de buurt van deze wandeling.', hmOnTrail: 'Je bent op het pad, ongeveer {k} km van de start.', hmOffTrail: '{m} m naast het pad.', hmKm: 'km', hmUp: 'omhoog', hmDown: 'omlaag', hmMax: 'hoogste punt', hmTotal: 'heen en terug', hmOneWay: 'enkele reis',
    hmProfile: 'Hoogteprofiel', hmOptions: 'Optioneel', hmThen: 'Daarna', hmCamp: 'Camping', hmHut: 'Refugio', hmView: 'Uitzichtpunt', hmWater: 'Drinkwater', hmTrailhead: 'Begin pad', hmRanger: 'Parkwachter', hmSource: 'Kaartdata © OpenStreetMap-bijdragers, hoogte: Copernicus DEM via Open-Meteo. Ongeveer: ±10–15%.',
    horse: 'Paardrijden in Mendoza', horseSub: 'Opties voor 17–19 dec', horsePrice: 'Prijs', horseTime: 'Tijden', horsePickup: 'Ophalen', horseLevel: 'Niveau', horseSite: 'Website', horseMsg: 'Bericht klaarzetten', horseCall: 'Bel', horsePick: 'Aanrader', horseChecked: 'Gecheckt op 8 nov 2026. Niets geboekt.',
  },
  en: {
    ins: 'Travel insurance', insAdd: 'Add travel insurance', insWhy: 'Add your insurer and emergency number so you can call with one tap. Thijs sees it too.',
    insCo: 'Insurer', insPhone: 'Emergency number (24/7)', insPolicy: 'Policy number', insNote: 'Note (e.g. card number, who is covered)', insSave: 'Save', insEdit: 'Edit', insCall: 'Call emergency line', insCancel: 'Cancel',
    ov: 'Trip overview', ovSub: 'Everything on one page, to print or save as PDF', ovIntro: 'For when your phone is dead or lost. Print this, or save it as a PDF and send it to Thijs.', ovPrint: 'Print or save as PDF',
    ovHow: 'iPhone: tap Print, pinch the preview open with two fingers and choose Share › Save to Files.', ovTransport: 'Transport', ovStays: 'Stays', ovEmergency: 'Emergency', ovTodo: 'to arrange', ovMade: 'Made on {d}',
    food: 'Food & bucket list', foodSub: 'What you must taste and do', foodLead: 'Taste it, do it, tick it off. You see each other’s ticks.', foodDone: '{a} of {b} done', foodWhere: 'Where to eat it', foodGuide: 'From the guide, per place',
    hikeMap: 'Hiking map', hmOffline: 'Works without signal: trails, lakes and camps are in the app. Your location comes from GPS, even offline.', hmLocate: 'Where am I?', hmLocating: 'Finding location…', hmNoLoc: 'Location not available. Allow location for Safari (Settings › Privacy › Location).',
    hmFar: 'You are not near this hike yet.', hmOnTrail: 'You are on the trail, about {k} km from the start.', hmOffTrail: '{m} m off the trail.', hmKm: 'km', hmUp: 'up', hmDown: 'down', hmMax: 'highest point', hmTotal: 'round trip', hmOneWay: 'one way',
    hmProfile: 'Elevation profile', hmOptions: 'Optional', hmThen: 'Then', hmCamp: 'Campsite', hmHut: 'Refugio', hmView: 'Viewpoint', hmWater: 'Drinking water', hmTrailhead: 'Trailhead', hmRanger: 'Ranger', hmSource: 'Map data © OpenStreetMap contributors, elevation: Copernicus DEM via Open-Meteo. Approximate: ±10–15%.',
    horse: 'Horse riding in Mendoza', horseSub: 'Options for 17–19 Dec', horsePrice: 'Price', horseTime: 'Times', horsePickup: 'Pickup', horseLevel: 'Level', horseSite: 'Website', horseMsg: 'Prepare message', horseCall: 'Call', horsePick: 'Recommended', horseChecked: 'Checked on 8 Nov 2026. Nothing booked.',
  },
  es: {
    ins: 'Seguro de viaje', insAdd: 'Agregar seguro de viaje', insWhy: 'Guardá la aseguradora y el número de emergencia para llamar con un toque. Thijs también lo ve.',
    insCo: 'Aseguradora', insPhone: 'Emergencias (24/7)', insPolicy: 'Número de póliza', insNote: 'Nota', insSave: 'Guardar', insEdit: 'Editar', insCall: 'Llamar a emergencias', insCancel: 'Cancelar',
    ov: 'Resumen del viaje', ovSub: 'Todo en una página, para imprimir o PDF', ovIntro: 'Por si el teléfono se queda sin batería o se pierde. Imprimilo o guardalo como PDF.', ovPrint: 'Imprimir o guardar PDF',
    ovHow: 'iPhone: tocá Imprimir, abrí la vista previa con dos dedos y elegí Compartir › Guardar en Archivos.', ovTransport: 'Transporte', ovStays: 'Alojamiento', ovEmergency: 'Emergencias', ovTodo: 'falta reservar', ovMade: 'Hecho el {d}',
    food: 'Comida y para hacer', foodSub: 'Lo que tenés que probar y hacer', foodLead: 'Probalo, hacelo, marcalo. Ven las marcas del otro.', foodDone: '{a} de {b} hechos', foodWhere: 'Dónde comerlo', foodGuide: 'De la guía, por lugar',
    hikeMap: 'Mapa del sendero', hmOffline: 'Funciona sin señal: senderos, lagos y campings están en la app. La ubicación viene del GPS, aun sin internet.', hmLocate: '¿Dónde estoy?', hmLocating: 'Buscando ubicación…', hmNoLoc: 'Ubicación no disponible. Permití la ubicación para Safari.',
    hmFar: 'Todavía no estás cerca de este sendero.', hmOnTrail: 'Estás en el sendero, a unos {k} km del inicio.', hmOffTrail: 'A {m} m del sendero.', hmKm: 'km', hmUp: 'subida', hmDown: 'bajada', hmMax: 'punto más alto', hmTotal: 'ida y vuelta', hmOneWay: 'solo ida',
    hmProfile: 'Perfil de altura', hmOptions: 'Opcional', hmThen: 'Después', hmCamp: 'Camping', hmHut: 'Refugio', hmView: 'Mirador', hmWater: 'Agua potable', hmTrailhead: 'Inicio del sendero', hmRanger: 'Guardaparques', hmSource: 'Datos © colaboradores de OpenStreetMap, altura: Copernicus DEM vía Open-Meteo. Aproximado: ±10–15%.',
    horse: 'Cabalgatas en Mendoza', horseSub: 'Opciones para el 17–19 dic', horsePrice: 'Precio', horseTime: 'Horarios', horsePickup: 'Traslado', horseLevel: 'Nivel', horseSite: 'Sitio web', horseMsg: 'Preparar mensaje', horseCall: 'Llamar', horsePick: 'Recomendado', horseChecked: 'Revisado el 8 nov 2026. Nada reservado.',
  },
};
const xt = (k, v = {}) => { const s = (XT_STR[LANG] || XT_STR.nl)[k] ?? XT_STR.nl[k] ?? k; return String(s).replace(/\{(\w+)\}/g, (_, x) => v[x] ?? ''); };
const L3 = o => o && typeof o === 'object' ? (o[LANG] ?? (LANG === 'es' ? o.en : o.nl) ?? o.nl ?? '') : (o ?? '');
window.xt = xt;

/* ================= reisverzekering (gedeeld, versleuteld) ================= */
let insEditing = false;
window.FX_INFO_TOP = () => {
  const v = Sync.get('insurance', null);
  if (v && !insEditing) return `<div class="card ins-card"><div class="row top"><div class="bubble ins-ico">${ic('shield-plus')}</div><div class="grow">
      <div class="tiny muted" style="font-weight:700;text-transform:uppercase;letter-spacing:.04em">${xt('ins')}</div><strong style="font-size:17px">${esc(v.co || '')}</strong>
      ${v.policy ? `<div class="small" style="margin-top:4px">${xt('insPolicy')}: <b>${esc(v.policy)}</b> <button class="linkbtn" data-copy="${esc(v.policy)}">${ic('copy', 'sm')}</button></div>` : ''}
      ${v.note ? `<div class="small muted" style="margin-top:4px">${esc(v.note)}</div>` : ''}</div><button class="linkbtn" id="insEdit">${xt('insEdit')}</button></div>
      ${v.phone ? `<a class="btn ins-call" href="${tel(v.phone)}">${ic('phone', 'sm')} ${xt('insCall')} · ${esc(v.phone)}</a>` : ''}</div>`;
  const f = v || {};
  return `<form class="card ins-card" id="insForm"><div class="row top"><div class="bubble ins-ico">${ic('shield-plus')}</div><div class="grow"><strong>${v ? xt('ins') : xt('insAdd')}</strong><p class="small muted" style="margin:4px 0 0">${xt('insWhy')}</p></div></div>
    <label class="fld"><span>${xt('insCo')}</span><input name="co" value="${esc(f.co || '')}" autocomplete="off"></label>
    <label class="fld"><span>${xt('insPhone')}</span><input name="phone" type="tel" value="${esc(f.phone || '')}" placeholder="+31 …" autocomplete="off"></label>
    <label class="fld"><span>${xt('insPolicy')}</span><input name="policy" value="${esc(f.policy || '')}" autocomplete="off"></label>
    <label class="fld"><span>${xt('insNote')}</span><input name="note" value="${esc(f.note || '')}" autocomplete="off"></label>
    <div class="btns"><button class="btn">${xt('insSave')}</button>${v ? `<button type="button" class="btn soft" id="insCancel">${xt('insCancel')}</button>` : ''}</div></form>`;
};
window.FX_INFO_END = () => `<a class="card link-card" href="#/overzicht">${ic('printer')}<span class="grow"><strong>${xt('ov')}</strong><span class="small muted">${xt('ovSub')}</span></span>${ic('chevron-right', 'sm')}</a>`;
window.FX_INFO_BIND = () => {
  $('#insEdit')?.addEventListener('click', () => { insEditing = true; vInfo(); });
  $('#insCancel')?.addEventListener('click', () => { insEditing = false; vInfo(); });
  const f = $('#insForm'); if (!f) return;
  f.onsubmit = e => {
    e.preventDefault(); const d = Object.fromEntries(new FormData(f)); for (const k in d) d[k] = d[k].trim();
    if (!d.co && !d.phone && !d.policy) return;
    Sync.set('insurance', d); insEditing = false; vInfo(); toast(xt('insSave') + ' ✓');
  };
};

/* ================= reisoverzicht (printbaar) ================= */
function vOverview() {
  setChrome(xt('ov'), { back: true });
  const ins = Sync.get('insurance', null);
  const codes = x => (x.codes || []).map(c => `<span class="ov-code">${esc(c.label)}: <b>${esc(c.value)}</b></span>`).join(' ');
  const tr = T.transport.map(x => `<tr class="${x.status === 'todo' ? 'ov-todo' : ''}"><td class="ov-d">${esc(fmt(x.date))}</td><td><strong>${esc(x.title)}</strong>${x.status === 'todo' ? ` <em>(${xt('ovTodo')})</em>` : ''}
      ${(x.legs || []).map(l => `<div class="small">${esc([l.number, l.dep && l.dep + (l.arr ? '–' + l.arr : ''), `${l.from} → ${l.to}`, l.carrier].filter(Boolean).join(' · '))}</div>`).join('')}
      ${codes(x) ? `<div class="small">${codes(x)}</div>` : ''}${x.qr ? `<img class="ov-qr" src="${esc(x.qr)}" alt="QR">` : ''}</td></tr>`).join('');
  const st = T.stays.map(s => `<tr><td class="ov-d">${esc(fmt(s.in))} → ${esc(fmt(s.out))}</td><td><strong>${esc(s.name)}</strong><div class="small">${esc(s.address || '')}</div>
      <div class="small">${[s.phone && '☎ ' + s.phone, s.checkin && t('checkin') + ' ' + s.checkin, s.checkout && t('checkout') + ' ' + s.checkout].filter(Boolean).map(esc).join(' · ')}</div>${codes(s) ? `<div class="small">${codes(s)}</div>` : ''}</td></tr>`).join('');
  const em = (T.info.find(s => s.items.some(i => i.phone))?.items || []).filter(i => i.phone).map(i => `<li>${esc(i.label)}: <b>${esc(i.phone)}</b></li>`).join('');
  view.innerHTML = `<div class="card no-print"><p class="small" style="margin:0 0 12px">${xt('ovIntro')}</p><button class="btn" id="ovPrint" style="width:100%">${ic('printer', 'sm')} ${xt('ovPrint')}</button><p class="tiny muted" style="margin:10px 0 0">${xt('ovHow')}</p></div>
    <div class="ov">
      <h1 class="ov-h">${esc(T.meta.title)} · ${esc(T.meta.travelers.join(' & '))}</h1><p class="tiny muted">${xt('ovMade', { d: fmt(iso(new Date())) })}</p>
      <h2>${xt('ovEmergency')}</h2><ul class="ov-list">${ins ? `<li>${xt('ins')}: <b>${esc(ins.co || '')}</b>${ins.phone ? ` · ${esc(ins.phone)}` : ''}${ins.policy ? ` · ${xt('insPolicy')} ${esc(ins.policy)}` : ''}</li>` : ''}${em}</ul>
      <h2>${xt('ovTransport')}</h2><table class="ov-t">${tr}</table>
      <h2>${xt('ovStays')}</h2><table class="ov-t">${st}</table>
    </div>`;
  $('#ovPrint').onclick = () => window.print();
}

/* ================= eten & bucketlist ================= */
let foodTab = 'eten';
function vFood() {
  setChrome(xt('food'), { back: true });
  const B = BASE.bucket; if (!B) { view.innerHTML = `<div class="card">${t('noResults')}</div>`; return; }
  const all = B.groups.flatMap(g => g.items), key = id => 'bucket:' + id;
  const done = all.filter(i => Sync.get(key(i.id))).length;
  const g = B.groups.find(x => x.id === foodTab) || B.groups[0];
  const flag = r => r === 'AR' ? '🇦🇷' : r === 'CL' ? '🇨🇱' : '🇦🇷🇨🇱';
  const pname = id => PL.find(p => p.id === id)?.name;
  view.innerHTML = `<div class="hero" style="background-image:url(img/mendoza.webp);min-height:180px"><div class="eyebrow">${ic('utensils', 'sm')} ${xt('food')}</div><h2>${xt('foodDone', { a: done, b: all.length })}</h2><p>${xt('foodLead')}</p></div>
    <div class="seg">${B.groups.map(x => { const n = x.items.filter(i => Sync.get(key(i.id))).length; return `<button data-ft="${x.id}" class="${x.id === g.id ? 'on' : ''}">${esc(L3(x.title))}<small>${n}/${x.items.length}</small></button>`; }).join('')}</div>
    <div class="card food-list">${g.items.map(i => { const on = !!Sync.get(key(i.id)), m = Sync.meta(key(i.id)); return `<label class="food ${on ? 'done' : ''}"><span class="food-e">${i.e}</span><span class="grow"><strong>${esc(i.name)}</strong> <span class="tiny">${flag(i.r)}</span>
        <span class="small muted food-t">${esc(L3(i))}</span>${i.place && pname(i.place) ? `<a class="tiny food-p" href="#/plek/${esc(i.place)}">${ic('map-pin', 'sm')} ${esc(pname(i.place))}</a>` : ''}${on && m?.by ? `<span class="who">✓ ${esc(m.by)}</span>` : ''}</span>
        <input type="checkbox" data-bk="${esc(i.id)}" ${on ? 'checked' : ''}><span class="food-c">${ic('check', 'sm')}</span></label>`; }).join('')}</div>
    ${g.id === 'eten' || g.id === 'zoet' || g.id === 'drinken' ? `<div class="h-sec">${ic('utensils')} ${xt('foodGuide')}</div><div class="card">${PL.filter(p => p.food?.length).map(p => `<a class="list-link" href="#/plek/${esc(p.id)}"><div class="bubble" style="background:var(--p-${p.id});color:#fff">${ic('utensils')}</div><div class="grow"><strong>${esc(p.name)}</strong><span>${p.food.map(f => esc(f.name)).join(' · ')}</span></div>${ic('chevron-right', 'chev')}</a>`).join('')}</div>` : ''}
    ${g.id === 'beleven' ? `<a class="card link-card" href="#/paardrijden">${ic('sunset')}<span class="grow"><strong>${xt('horse')}</strong><span class="small muted">${xt('horseSub')}</span></span>${ic('chevron-right', 'sm')}</a>` : ''}`;
  view.querySelectorAll('[data-ft]').forEach(b => b.onclick = () => { foodTab = b.dataset.ft; vFood(); });
  view.querySelectorAll('[data-bk]').forEach(cb => cb.onchange = () => { const y = scrollY; Sync.set(key(cb.dataset.bk), cb.checked); vFood(); scrollTo(0, y); if (cb.checked) toast('¡Buenísimo! ' + (all.find(i => i.id === cb.dataset.bk)?.e || '')); });
}

/* ================= paardrijden ================= */
function vHorse() {
  setChrome(xt('horse'), { back: true });
  const O = T.options?.horse || [];
  view.innerHTML = `<div class="hero" style="background-image:url(img/mendoza.webp);min-height:170px"><div class="eyebrow">${ic('sunset', 'sm')} ${xt('horseSub')}</div><h2>${xt('horse')}</h2></div>
    <div class="card"><p class="small" style="margin:0">${esc(T.options?.horseAdvice || '')}</p><p class="tiny muted" style="margin:8px 0 0">${xt('horseChecked')}</p></div>
    ${O.map(o => `<div class="card horse ${o.pick ? 'pick' : ''}">${o.pick ? `<span class="badge">${ic('star', 'sm')} ${xt('horsePick')}</span>` : ''}<h3 style="margin:4px 0 2px">${esc(o.name)}</h3><div class="small muted">${esc(o.area)}</div>
      <dl class="kv"><dt>${xt('horsePrice')}</dt><dd>${esc(o.price)}</dd><dt>${xt('horseTime')}</dt><dd>${esc(o.time)}</dd><dt>${xt('horsePickup')}</dt><dd>${esc(o.pickup)}</dd><dt>${xt('horseLevel')}</dt><dd>${esc(o.level)}</dd></dl>
      ${o.note ? `<p class="small" style="margin:8px 0 0">${esc(o.note)}</p>` : ''}
      <div class="btns">${o.msg ? `<a class="btn" href="#/bericht/${esc(o.msg)}">${ic('messages-square', 'sm')} ${xt('horseMsg')}</a>` : ''}${o.phone ? `<a class="btn soft" href="${tel(o.phone)}">${ic('phone', 'sm')} ${xt('horseCall')}</a>` : ''}<a class="btn soft" href="${esc(o.url)}" target="_blank" rel="noopener">${ic('link', 'sm')} ${xt('horseSite')}</a></div></div>`).join('')}`;
}

/* ================= offline wandelkaart ================= */
let HMAP = null, HWATCH = null;
const stopHike = () => { if (HWATCH != null) { navigator.geolocation?.clearWatch(HWATCH); HWATCH = null; } if (HMAP) { HMAP.remove(); HMAP = null; } };
window.addEventListener('hashchange', () => { if (!/^#\/wandelkaart/.test(location.hash)) stopHike(); });
const hv = (a, b) => { const r = Math.PI / 180, dLa = (b[0] - a[0]) * r, dLo = (b[1] - a[1]) * r, x = Math.sin(dLa / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dLo / 2) ** 2; return 12742 * Math.asin(Math.sqrt(x)); };
const nf = (v, d = 1) => new Intl.NumberFormat(LANG === 'en' ? 'en-GB' : 'nl-NL', { maximumFractionDigits: d }).format(v);
// dichtstbijzijnde punt op de lijn: afstand tot het pad (m) en km vanaf de start
function nearOnLine(line, p) {
  let best = { d: Infinity, km: 0 }, acc = 0;
  const kx = Math.cos(p[0] * Math.PI / 180);
  for (let i = 1; i < line.length; i++) {
    const a = line[i - 1], b = line[i], seg = hv(a, b);
    const ax = (a[1] - p[1]) * kx, ay = a[0] - p[0], bx = (b[1] - p[1]) * kx, by = b[0] - p[0];
    const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy;
    const tt = L2 ? Math.max(0, Math.min(1, -(ax * dx + ay * dy) / L2)) : 0;
    const q = [a[0] + (b[0] - a[0]) * tt, a[1] + (b[1] - a[1]) * tt], d = hv(q, p) * 1000;
    if (d < best.d) best = { d, km: acc + seg * tt };
    acc += seg;
  }
  return best;
}
function profileSvg(pr, color, kmLabel) {
  if (!pr?.length) return '';
  const W = 320, H = 110, P = 22, maxK = pr[pr.length - 1][0], ys = pr.map(p => p[1]), lo = Math.min(...ys), hi = Math.max(...ys), rng = Math.max(50, hi - lo);
  const x = k => P + (k / maxK) * (W - P - 6), y = m => H - 16 - ((m - lo) / rng) * (H - 32);
  const d = pr.map((p, i) => `${i ? 'L' : 'M'}${x(p[0]).toFixed(1)},${y(p[1]).toFixed(1)}`).join('');
  return `<svg class="prof" viewBox="0 0 ${W} ${H}" role="img" aria-label="${xt('hmProfile')}"><path d="${d}L${x(maxK)},${H - 16}L${P},${H - 16}Z" fill="${color}" opacity=".18"/><path d="${d}" fill="none" stroke="${color}" stroke-width="2.2" stroke-linejoin="round"/>
    <text x="${P - 4}" y="${y(hi) + 4}" text-anchor="end">${Math.round(hi)}</text><text x="${P - 4}" y="${y(lo) + 4}" text-anchor="end">${Math.round(lo)}</text>
    <text x="${P}" y="${H - 2}">0</text><text x="${x(maxK)}" y="${H - 2}" text-anchor="end">${nf(kmLabel ?? maxK)} km</text><circle id="profDot" r="4.5" fill="#2f7cf6" stroke="#fff" stroke-width="2" style="display:none"/></svg>`;
}
function vHikeMap(id) {
  stopHike();
  const HM = BASE.hikemap, h = HM?.hikes?.[id], meta = T.hikes.find(x => x.id === id);
  setChrome(meta?.name || xt('hikeMap'), { back: true });
  if (!h || !window.L) { view.innerHTML = `<div class="card">${t('mapFailed')}</div>`; return; }
  const A = HM.areas[h.area], col = '#5c8c4c';
  const stat = (v, l) => `<div class="hm-s"><b>${v}</b><span>${l}</span></div>`;
  const day = T.days.find(d => d.items.some(i => i.hike === id));
  view.innerHTML = `<div class="hm-wrap"><div id="hmap"></div><button class="btn hm-loc" id="hmLoc">${ic('locate', 'sm')} ${xt('hmLocate')}</button></div>
    <div class="card hm-status" id="hmStatus"><span class="small muted">${ic('map-pin', 'sm')} ${xt('hmOffline')}</span></div>
    <div class="card"><div class="hm-stats">${stat(nf(h.back ? h.kmTotal : h.km), `${xt('hmKm')} ${h.back ? xt('hmTotal') : xt('hmOneWay')}`)}${stat('↑ ' + nf(h.upTotal ?? h.up, 0), 'm ' + xt('hmUp'))}${stat('↓ ' + nf(h.downTotal ?? h.down, 0), 'm ' + xt('hmDown'))}${stat(nf(h.maxEle, 0), 'm ' + xt('hmMax'))}</div>
      <div class="tiny muted" style="margin:12px 0 4px;font-weight:700">${xt('hmProfile')} (${xt('hmOneWay')})</div>${profileSvg(h.profile, col, h.km)}
      ${(h.options || []).map(o => `<div class="small" style="margin-top:8px">${ic('route', 'sm')} <b>${xt('hmOptions')}: ${esc(o.name || '')}</b> · ${nf(o.kmTotal ?? o.km)} km · ↑ ${nf(o.up, 0)} m</div>`).join('')}
      ${h.then ? `<div class="small" style="margin-top:8px">${ic('route', 'sm')} <b>${xt('hmThen')}: ${esc(h.then.name || '')}</b> · ${nf(h.then.km)} km · ↓ ${nf(h.then.down, 0)} m</div>` : ''}
      ${day ? `<a class="btn soft" style="margin-top:12px" href="#/dag/${day.date}">${ic('calendar-days', 'sm')} ${esc(fmt(day.date))}</a>` : ''}</div>
    <p class="tiny muted" style="padding:0 6px">${xt('hmSource')}</p>`;
  const map = HMAP = L.map('hmap', { zoomControl: false, attributionControl: true, maxBounds: [[A.bbox[0][0] - .05, A.bbox[0][1] - .08], [A.bbox[1][0] + .05, A.bbox[1][1] + .08]], minZoom: 10 });
  L.control.zoom({ position: 'topright' }).addTo(map);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 17, attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', className: 'osm-tiles hm-tiles' }).addTo(map);
  const dk = isDark();
  map.createPane('vec'); map.getPane('vec').style.zIndex = 350;
  for (const g of A.glacier || []) L.polygon(g, { pane: 'vec', stroke: true, color: dk ? '#8aa3b3' : '#b8cbd6', weight: .8, fillColor: dk ? '#5d717d' : '#eef4f7', fillOpacity: .75, interactive: false }).addTo(map);
  for (const w of A.water || []) L.polygon(w, { pane: 'vec', stroke: true, color: dk ? '#3c6f80' : '#7fb3c4', weight: .8, fillColor: dk ? '#2b5563' : '#a9d3df', fillOpacity: .8, interactive: false }).addTo(map);
  // andere wandelingen in hetzelfde gebied lichter erachter
  for (const [oid, o] of Object.entries(HM.hikes)) if (oid !== id && o.area === h.area) L.polyline(o.line, { pane: 'vec', color: col, weight: 2.5, opacity: .35, dashArray: '2 6', interactive: false }).addTo(map);
  for (const o of h.options || []) L.polyline(o.line, { pane: 'vec', color: col, weight: 4, opacity: .9, dashArray: '6 7' }).addTo(map);
  if (h.then) L.polyline(h.then.line, { pane: 'vec', color: '#d0973a', weight: 4.5, opacity: .95 }).addTo(map);
  L.polyline(h.line, { pane: 'vec', color: '#fff', weight: 8, opacity: .85, interactive: false }).addTo(map);
  const main = L.polyline(h.line, { pane: 'vec', color: col, weight: 5 }).addTo(map);
  const PI = { camp: ['tent', '#3a8b86', xt('hmCamp')], hut: ['house', '#8467ad', xt('hmHut')], view: ['camera', '#d2664c', xt('hmView')], water: ['droplets', '#4a9fb8', xt('hmWater')], trailhead: ['flag', '#5c8c4c', xt('hmTrailhead')], ranger: ['info', '#80766c', xt('hmRanger')] };
  const near = p => nearOnLine(h.line, p.ll).d < 1600 || (h.options || []).some(o => nearOnLine(o.line, p.ll).d < 800) || (h.then && nearOnLine(h.then.line, p.ll).d < 800);
  for (const p of HM.pois.filter(p => p.area === h.area && PI[p.type] && (p.type !== 'water' || near(p)) && near(p))) {
    const [icn, c, label] = PI[p.type], small = p.type === 'water';
    L.marker(p.ll, { pane: 'vec', icon: L.divIcon({ className: '', html: `<div class="hm-poi ${small ? 'sm' : ''}" style="background:${c}">${ic(icn)}</div>`, iconSize: small ? [18, 18] : [26, 26], iconAnchor: small ? [9, 9] : [13, 13] }) })
      .bindPopup(`<strong>${esc(p.name || label)}</strong><br><span class="tiny">${esc(label)}</span>`).addTo(map);
  }
  const s = h.line[0], e = h.line[h.line.length - 1];
  L.circleMarker(s, { pane: 'vec', radius: 7, color: '#fff', weight: 3, fillColor: col, fillOpacity: 1 }).bindTooltip('Start').addTo(map);
  if (!h.back) L.circleMarker(e, { pane: 'vec', radius: 7, color: '#fff', weight: 3, fillColor: '#b0502b', fillOpacity: 1 }).addTo(map);
  map.fitBounds(main.getBounds(), { padding: [28, 28] });
  // eigen locatie (GPS werkt zonder internet)
  let me = null, acc = null, first = true;
  const status = $('#hmStatus'), dot = $('#profDot'), maxK = h.profile?.[h.profile.length - 1]?.[0] || h.km;
  const onPos = pos => {
    const p = [pos.coords.latitude, pos.coords.longitude], r = pos.coords.accuracy;
    if (!me) { me = L.circleMarker(p, { pane: 'vec', radius: 8, color: '#fff', weight: 3, fillColor: '#2f7cf6', fillOpacity: 1 }).addTo(map); acc = L.circle(p, { pane: 'vec', radius: r, color: '#2f7cf6', weight: 1, fillOpacity: .12, interactive: false }).addTo(map); }
    else { me.setLatLng(p); acc.setLatLng(p).setRadius(r); }
    const n = nearOnLine(h.line, p);
    if (n.d > 5000) status.innerHTML = `<span class="small">${ic('locate-fixed', 'sm')} ${xt('hmFar')}</span>`;
    else {
      status.innerHTML = `<span class="small">${ic('locate-fixed', 'sm')} ${n.d < 60 ? xt('hmOnTrail', { k: nf(n.km) }) : xt('hmOnTrail', { k: nf(n.km) }) + ' ' + xt('hmOffTrail', { m: Math.round(n.d) })}</span>`;
      if (dot && h.profile) { const W = 320, P = 22, H = 110, ys = h.profile.map(q => q[1]), lo = Math.min(...ys), rng = Math.max(50, Math.max(...ys) - lo); const k = Math.min(n.km * maxK / h.km, maxK); let m = h.profile[0][1]; for (const q of h.profile) if (q[0] <= k) m = q[1]; dot.setAttribute('cx', P + (k / maxK) * (W - P - 6)); dot.setAttribute('cy', H - 16 - ((m - lo) / rng) * (H - 32)); dot.style.display = ''; }
    }
    if (first) { first = false; if (n.d < 5000) map.setView(p, Math.max(map.getZoom(), 14)); }
  };
  const onErr = () => { status.innerHTML = `<span class="small">${ic('info', 'sm')} ${xt('hmNoLoc')}</span>`; $('#hmLoc').disabled = false; };
  $('#hmLoc').onclick = () => {
    if (!navigator.geolocation) return onErr();
    if (me) { map.setView(me.getLatLng(), Math.max(map.getZoom(), 14)); return; }
    status.innerHTML = `<span class="small">${ic('locate', 'sm')} ${xt('hmLocating')}</span>`;
    HWATCH = navigator.geolocation.watchPosition(onPos, onErr, { enableHighAccuracy: true, maximumAge: 15000, timeout: 30000 });
  };
}

/* ================= aanhaken ================= */
Object.assign(window.FX_ROUTES, { overzicht: vOverview, proeven: vFood, paardrijden: vHorse, wandelkaart: () => vHikeMap(location.hash.split('/')[2]) });
const _more = window.FX_MORE;
window.FX_MORE = () => {
  const row = (href, icon, color, ti, s) => `<a class="list-link" href="${href}"><div class="bubble" style="background:${color};color:#fff">${ic(icon)}</div><div class="grow"><strong>${ti}</strong><span>${s}</span></div>${ic('chevron-right', 'chev')}</a>`;
  return `<div class="card">${row('#/proeven', 'utensils', 'var(--p-mendoza)', xt('food'), xt('foodSub'))}${row('#/paardrijden', 'sunset', 'var(--p-uco)', xt('horse'), xt('horseSub'))}</div>` + _more() +
    `<div class="card">${row('#/overzicht', 'printer', 'var(--m-car)', xt('ov'), xt('ovSub'))}</div>`;
};
if (typeof T !== 'undefined' && T && /^#\/(overzicht|proeven|paardrijden|wandelkaart)/.test(location.hash)) route(true);
