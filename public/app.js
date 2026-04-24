/* ---------- icon library (inline SVG strings, stroke-based) ---------- */
const ICONS = {
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/></svg>',
  sparkle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></svg>',
  alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
  mapPin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  stop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="5" width="14" height="14" rx="2"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
  party: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01M22 8h.01M15 2h.01M22 20h.01"/><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="m22 13-1.5-.5c-.82-.27-1.72.23-1.93 1.07v0c-.21.85-1.11 1.35-1.93 1.07L15 14"/><path d="M13 7C9 7 5 10 5 14s4 7 8 7 8-3 8-7-4-7-8-7z"/></svg>'
};

/* ---------- state ---------- */
const state = {
  businesses: {},
  markers: {},
  polygons: {},
  progress: {},
  budget: {},
  searching: false,
  mapsKey: null,
  activeFilter: 'all',
  sectionsCollapsed: (() => { try { return JSON.parse(localStorage.getItem('sectionsCollapsed') || '{}'); } catch { return {}; } })()
};

function toggleSection(key) {
  state.sectionsCollapsed[key] = !state.sectionsCollapsed[key];
  localStorage.setItem('sectionsCollapsed', JSON.stringify(state.sectionsCollapsed));
  refreshList();
}

const CATEGORY_COLORS = {
  hair_salon: '#ec4899', beauty_salon: '#f472b6', barber: '#d946ef', spa: '#a855f7', nail_salon: '#c084fc',
  doctor: '#3b82f6', hospital: '#1d4ed8', clinic: '#60a5fa', dentist: '#06b6d4', physiotherapist: '#0891b2', drugstore: '#14b8a6',
  gym: '#22c55e',
  lawyer: '#eab308', veterinary_care: '#f59e0b', photographer: '#fb923c', tattoo_parlor: '#78350f',
  default: '#94a3b8'
};
function colorFor(category) { return CATEGORY_COLORS[category] || CATEGORY_COLORS.default; }

/* ---------- setup / config ---------- */
async function checkConfig() {
  const r = await fetch('/api/config/status').then(r => r.json());
  if (r.googleSet && r.notionSet) {
    document.getElementById('setup').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    state.autoNotion = true;
    await initApp();
    updateQueueInfo(r.notionQueueSize || 0);
  } else {
    document.getElementById('setup').classList.remove('hidden');
    document.getElementById('app').classList.add('hidden');
  }
}

document.getElementById('btn-validate').addEventListener('click', async () => {
  const google = document.getElementById('cfg-google').value.trim();
  const notionToken = document.getElementById('cfg-notion-token').value.trim();
  const notionDb = document.getElementById('cfg-notion-db').value.trim();
  const msg = document.getElementById('setup-msg');
  msg.textContent = 'Validando...'; msg.className = 'setup-msg';
  const r = await fetch('/api/config/validate', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ google, notionToken, notionDb })
  }).then(r => r.json());
  let ok = true, parts = [];
  if (r.google) { parts.push(r.google.ok ? '✓ Google OK' : '✗ Google: ' + r.google.error); ok = ok && r.google.ok; }
  if (r.notion) { parts.push(r.notion.ok ? `✓ Notion OK (${r.notion.title})` : '✗ Notion: ' + r.notion.error); ok = ok && r.notion.ok; }
  msg.textContent = parts.join('\n');
  msg.className = 'setup-msg ' + (ok ? 'ok' : 'err');
  document.getElementById('btn-save').disabled = !ok;
});

document.getElementById('btn-save').addEventListener('click', async () => {
  const google = document.getElementById('cfg-google').value.trim();
  const notionToken = document.getElementById('cfg-notion-token').value.trim();
  const notionDb = document.getElementById('cfg-notion-db').value.trim();
  const r = await fetch('/api/config/save', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ google, notionToken, notionDb })
  }).then(r => r.json());
  if (r.ok) checkConfig();
  else {
    const m = document.getElementById('setup-msg');
    m.textContent = r.error || 'Error guardando';
    m.className = 'setup-msg err';
  }
});

/* ---------- main app ---------- */
let map;
async function initApp() {
  map = L.map('map').setView([4.65, -74.1], 11);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap', maxZoom: 19
  }).addTo(map);
  addLegend();

  // inject gear icon once
  const gear = document.getElementById('btn-settings');
  if (gear) gear.innerHTML = ICONS.settings;

  const [geo, progress, businessesArr, budget] = await Promise.all([
    fetch('/api/localidades').then(r => r.json()),
    fetch('/api/progress').then(r => r.json()),
    fetch('/api/businesses').then(r => r.json()),
    fetch('/api/budget').then(r => r.json())
  ]);

  state.progress = progress;
  state.budget = budget;
  state.localidadesGeo = geo;

  drawLocalidades(geo);
  populateSelects(geo);

  for (const b of businessesArr) { state.businesses[b.place_id] = b; addMarker(b); }
  refreshAll();

  connectSSE();
  wireUI();
  fetch('/api/config/maps-key').then(r => r.json()).then(r => state.mapsKey = r.key);
}

function addLegend() {
  const legend = L.control({ position: 'bottomright' });
  legend.onAdd = () => {
    const div = L.DomUtil.create('div', 'legend');
    div.innerHTML = `
      <div><b>Estado localidad</b></div>
      <div><span class="swatch" style="background:#cbd1d9"></span>Sin buscar</div>
      <div><span class="swatch" style="background:#fbbf24"></span>En progreso</div>
      <div><span class="swatch" style="background:#10b981"></span>Completada</div>
      <div style="margin-top:8px"><b>Pines por categoría</b></div>
      <div><span class="swatch" style="background:#ec4899"></span>Belleza</div>
      <div><span class="swatch" style="background:#3b82f6"></span>Salud</div>
      <div><span class="swatch" style="background:#22c55e"></span>Fitness</div>
      <div><span class="swatch" style="background:#eab308"></span>Otros</div>
    `;
    return div;
  };
  legend.addTo(map);
}

function polygonStyle(nombre) {
  const p = state.progress[nombre];
  const status = p && p.status;
  let color = '#cbd1d9';
  let fillColor = '#9ba3ad';
  if (status === 'in_progress') { color = '#fbbf24'; fillColor = '#fbbf24'; }
  else if (status === 'done') { color = '#10b981'; fillColor = '#10b981'; }
  return { color, weight: 1.5, fillColor, fillOpacity: 0.12 };
}

function drawLocalidades(geo) {
  for (const f of geo.features) {
    const nombre = f.properties.nombre;
    const coords = f.geometry.coordinates[0].map(([lng, lat]) => [lat, lng]);
    const poly = L.polygon(coords, polygonStyle(nombre)).addTo(map);
    poly.bindTooltip(nombre, { permanent: false, direction: 'center', className: 'localidad-label' });
    poly.on('click', async () => {
      if (await confirmDialog(`¿Iniciar búsqueda en ${nombre}?`, { title: 'Iniciar búsqueda', okText: 'Iniciar' })) startSearch(nombre);
    });
    state.polygons[nombre] = poly;
  }
}

function refreshPolygonStyles() {
  for (const [nombre, poly] of Object.entries(state.polygons)) poly.setStyle(polygonStyle(nombre));
}

function populateSelects(geo) {
  const filt = document.getElementById('filter-localidad');
  for (const f of geo.features) {
    const n = f.properties.nombre;
    filt.insertAdjacentHTML('beforeend', `<option value="${n}">${n}</option>`);
  }
}

/* ---------- markers ---------- */
function addMarker(b) {
  if (!b.lat || !b.lng) return;
  if (state.markers[b.place_id]) return;
  const m = L.circleMarker([b.lat, b.lng], {
    radius: 6, color: colorFor(b.category), fillColor: colorFor(b.category),
    fillOpacity: 0.85, weight: 1
  }).addTo(map);
  m.on('click', () => openSingleReview(b.place_id));
  state.markers[b.place_id] = m;
}

function openSingleReview(placeId) {
  if (!state.businesses[placeId]) return;
  reviewState.queue = [placeId];
  reviewState.index = 0;
  reviewState.open = true;
  document.getElementById('review-modal').classList.remove('hidden');
  renderReview();
}

function escapeHtml(s) {
  return (s || '').toString().replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

/* ---------- filters + list ---------- */
function filteredBusinesses() {
  const cat = document.getElementById('filter-category').value;
  const loc = document.getElementById('filter-localidad').value;
  const txt = document.getElementById('filter-text').value.toLowerCase().trim();
  const list = Object.values(state.businesses).filter(b =>
    (!cat || b.category === cat) &&
    (!loc || b.localidad === loc) &&
    (!txt || (b.name || '').toLowerCase().includes(txt))
  );
  if (state.activeFilter === 'approved') return list.filter(b => b.reviewStatus === 'approved');
  if (state.activeFilter === 'notion') return list.filter(b => b.notionPageId);
  return list;
}

function refreshCategoryFilter() {
  const sel = document.getElementById('filter-category');
  const existing = new Set(Array.from(sel.options).map(o => o.value));
  const cats = new Set(Object.values(state.businesses).map(b => b.category).filter(Boolean));
  for (const c of cats) {
    if (!existing.has(c)) sel.insertAdjacentHTML('beforeend', `<option value="${c}">${c}</option>`);
  }
}

function statusPill(b) {
  const hasPhone = !!(b.formatted_phone_number || b.international_phone_number);
  if (b.reviewStatus === 'approved' && b.detailsFetched && b.notionPageId && hasPhone) return '<span class="pill done">En Notion con teléfono</span>';
  if (b.reviewStatus === 'approved' && b.detailsFetched && b.notionPageId) return '<span class="pill nophone">En Notion sin teléfono</span>';
  if (b.reviewStatus === 'approved' && b.detailsFetched && !hasPhone) return '<span class="pill nophone">Sin teléfono · no enviado</span>';
  if (b.reviewStatus === 'approved' && b.notionPageId) return '<span class="pill approved">Verificado · en Notion (falta detalles)</span>';
  if (b.reviewStatus === 'approved') return '<span class="pill approved">Verificado · falta Notion</span>';
  return '<span class="pill pending">Sin verificar</span>';
}

function buildListItem(b, opts = {}) {
  const li = document.createElement('li');
  const hasPhoneLocal = !!(b.formatted_phone_number || b.international_phone_number);
  const fullyDone = b.reviewStatus === 'approved' && b.detailsFetched && b.notionPageId;
  const noPhoneDone = fullyDone && !hasPhoneLocal;
  const isDup = state._dupIds && state._dupIds.has(b.place_id);
  if (b.notionPageId) li.classList.add('notion-done');
  if (b.reviewStatus === 'approved') li.classList.add('approved-item');
  if (fullyDone && hasPhoneLocal) li.classList.add('done-item');
  if (noPhoneDone) li.classList.add('nophone-item');
  if (isDup) li.classList.add('dup-item');
  const mark = noPhoneDone
    ? `<span class="warn-mark">${ICONS.alert}</span>`
    : (fullyDone ? `<span class="done-mark">${ICONS.send}</span>` : (b.reviewStatus === 'approved' ? `<span class="ok-mark">${ICONS.check}</span>` : ''));
  const phoneShown = b.formatted_phone_number || b.international_phone_number;
  li.innerHTML = `
    <div class="bname">${mark}${escapeHtml(b.name)}</div>
    <div>${statusPill(b)}${isDup ? ' <span class="pill dup">Posible duplicado</span>' : ''}</div>
    <div class="bmeta">${escapeHtml(b.category)} · ${escapeHtml(b.localidad || '')}</div>
    <div class="bmeta">★ ${b.rating ?? '-'} (${b.user_ratings_total || 0})${phoneShown ? ' · ' + escapeHtml(phoneShown) : ' · sin teléfono'}</div>
    ${b.formatted_address ? `<div class="bmeta">${escapeHtml(b.formatted_address)}</div>` : ''}
    <div class="bactions">
      <a href="${b.url}" target="_blank">Maps</a>
      ${b.website ? `<a href="${b.website}" target="_blank">Web</a>` : ''}
      <button data-focus="${b.place_id}">Ver</button>
      ${opts.quickAcceptDup ? `<button class="quick-ok" data-accept-dup="${b.place_id}" title="No es duplicado">✓</button>` : ''}
      ${opts.quickDelete ? `<button class="quick-del" data-del="${b.place_id}" title="Eliminar">✗</button>` : ''}
    </div>
  `;
  return li;
}

function findDuplicateGroups(list) {
  const parent = {};
  const find = x => parent[x] === x ? x : (parent[x] = find(parent[x]));
  const union = (a, b) => { const ra = find(a), rb = find(b); if (ra !== rb) parent[ra] = rb; };
  for (const b of list) parent[b.place_id] = b.place_id;

  const keyIdx = { name: {}, addr: {}, phone: {} };
  for (const b of list) {
    if (b.notDuplicate) continue;
    const n = (b.name || '').toLowerCase().trim();
    const a = (b.formatted_address || '').toLowerCase().replace(/[^a-z0-9]/g, '').trim();
    const p = (b.formatted_phone_number || b.international_phone_number || '').replace(/\D/g, '');
    if (n) (keyIdx.name[n] = keyIdx.name[n] || []).push(b.place_id);
    if (a.length > 6) (keyIdx.addr[a] = keyIdx.addr[a] || []).push(b.place_id);
    if (p.length >= 7) (keyIdx.phone[p] = keyIdx.phone[p] || []).push(b.place_id);
  }

  const reasons = {};
  for (const k of ['name', 'addr', 'phone']) {
    for (const [val, ids] of Object.entries(keyIdx[k])) {
      if (ids.length > 1) {
        for (let i = 1; i < ids.length; i++) union(ids[0], ids[i]);
        for (const id of ids) {
          (reasons[id] = reasons[id] || { name: new Set(), addr: new Set(), phone: new Set() })[k].add(val);
        }
      }
    }
  }

  const byRoot = {};
  for (const id of Object.keys(reasons)) {
    const r = find(id);
    (byRoot[r] = byRoot[r] || []).push(id);
  }
  return { groups: Object.values(byRoot), reasons };
}

function groupReasonsLabel(ids, reasons) {
  const types = new Set();
  for (const id of ids) {
    const r = reasons[id];
    if (!r) continue;
    if (r.name.size) types.add('nombre');
    if (r.addr.size) types.add('dirección');
    if (r.phone.size) types.add('teléfono');
  }
  return Array.from(types).join(' · ') || 'coincidencia';
}

function renderSection(ul, key, title, items, headerClass, opts = {}) {
  if (!items.length) return;
  const collapsed = !!state.sectionsCollapsed[key];
  const h = document.createElement('li');
  h.className = 'list-section-header ' + (headerClass || '');
  h.innerHTML = `<span class="caret">${collapsed ? '▸' : '▾'}</span> ${title}`;
  h.addEventListener('click', () => toggleSection(key));
  ul.appendChild(h);
  if (!collapsed) {
    for (const b of items.slice(0, 300)) ul.appendChild(buildListItem(b, opts));
  }
}

function refreshList() {
  const list = filteredBusinesses().sort((a, b) => (b.user_ratings_total || 0) - (a.user_ratings_total || 0));
  const hasPhone = b => !!(b.formatted_phone_number || b.international_phone_number);
  const { groups: dupGroups, reasons: dupReasons } = findDuplicateGroups(list);
  const dupIds = new Set();
  dupGroups.forEach(g => g.forEach(id => dupIds.add(id)));
  state._dupIds = dupIds;

  const noPhone = list.filter(b => b.reviewStatus === 'approved' && b.detailsFetched && !hasPhone(b));
  const approvedPartial = list.filter(b => b.reviewStatus === 'approved' && !(b.detailsFetched && b.notionPageId) && !(b.detailsFetched && !hasPhone(b)));
  const done = list.filter(b => b.reviewStatus === 'approved' && b.detailsFetched && b.notionPageId && hasPhone(b));
  const pending = list.filter(b => b.reviewStatus !== 'approved');

  const ul = document.getElementById('business-list');
  ul.innerHTML = '';

  if (dupGroups.length) {
    const collapsed = !!state.sectionsCollapsed['dup'];
    const h = document.createElement('li');
    h.className = 'list-section-header dup';
    h.innerHTML = `<span class="caret">${collapsed ? '▸' : '▾'}</span> Posibles duplicados · ${dupGroups.length} grupos · ${dupIds.size} locales`;
    h.addEventListener('click', () => toggleSection('dup'));
    ul.appendChild(h);
    if (!collapsed) {
      dupGroups.forEach((ids, idx) => {
        const gh = document.createElement('li');
        gh.className = 'dup-group-header';
        gh.innerHTML = `
          <div class="dup-group-meta"><b>Grupo ${idx + 1}</b> · ${ids.length} locales · coincide por <i>${groupReasonsLabel(ids, dupReasons)}</i></div>
          <button class="quick-ok dup-group-accept" data-accept-group="${ids.join(',')}" title="No son duplicados">✓ Aceptar grupo</button>
        `;
        ul.appendChild(gh);
        for (const id of ids) {
          const b = state.businesses[id];
          if (b) ul.appendChild(buildListItem(b, { quickDelete: true }));
        }
      });
    }
  }

  renderSection(ul, 'approvedPartial', `Verificados · falta Notion o contacto (${approvedPartial.length})`, approvedPartial, 'approved');
  renderSection(ul, 'noPhone', `Segunda verificación · sin teléfono (${noPhone.length})`, noPhone, 'nophone', { quickDelete: true });
  renderSection(ul, 'done', `Listos · en Notion con teléfono (${done.length})`, done, 'done');
  renderSection(ul, 'pending', `Sin verificar (${pending.length})`, pending, '');

  // stat counts
  const all = Object.values(state.businesses);
  document.getElementById('count-total').textContent = all.length;
  document.getElementById('count-approved').textContent = all.filter(b => b.reviewStatus === 'approved').length;
  document.getElementById('count-notion').textContent = all.filter(b => b.notionPageId).length;

  // filter summary
  const cat = document.getElementById('filter-category').value;
  const loc = document.getElementById('filter-localidad').value;
  const txt = document.getElementById('filter-text').value.trim();
  const hasFilter = !!(cat || loc || txt);
  const summary = document.getElementById('filter-summary');
  if (summary) summary.textContent = hasFilter ? `${list.length} resultados` : '';
  const wrap = document.getElementById('filter-wrap');
  if (hasFilter && list.length !== all.length) {
    wrap.classList.remove('hidden');
    document.getElementById('count-filtered').textContent = list.length;
  } else {
    wrap.classList.add('hidden');
  }

  // empty state
  const empty = document.getElementById('list-empty');
  if (empty) empty.classList.toggle('hidden', list.length > 0);

  // hero + steps always refresh alongside list
  renderHero();
  renderSteps();
}

/* ---------- step progress indicator ---------- */
function renderSteps() {
  const all = Object.values(state.businesses);
  const pending = all.filter(b => b.reviewStatus !== 'approved').length;
  const approved = all.filter(b => b.reviewStatus === 'approved').length;
  const approvedNoDetails = all.filter(b => b.reviewStatus === 'approved' && !b.detailsFetched).length;
  const inNotion = all.filter(b => b.notionPageId).length;

  let current = 'search';
  if (all.length > 0 && pending > 0) current = 'review';
  else if (approved > 0 && approvedNoDetails > 0) current = 'enrich';
  else if (approved > inNotion) current = 'notion';
  else if (approved > 0 && approved === inNotion) current = 'notion';

  const order = ['search', 'review', 'enrich', 'notion'];
  const doneUpTo = {
    search: all.length > 0,
    review: all.length > 0 && pending === 0,
    enrich: approved > 0 && approvedNoDetails === 0,
    notion: approved > 0 && approved === inNotion
  };

  document.querySelectorAll('#step-progress li').forEach(li => {
    const s = li.dataset.step;
    li.classList.remove('active', 'done');
    if (doneUpTo[s]) li.classList.add('done');
    if (s === current && !doneUpTo[s]) li.classList.add('active');
  });
}

/* ---------- hero card (contextual CTA) ---------- */
function renderHero() {
  const hero = document.getElementById('hero-card');
  if (!hero) return;

  const all = Object.values(state.businesses);
  const pending = all.filter(b => b.reviewStatus !== 'approved');
  const approved = all.filter(b => b.reviewStatus === 'approved');
  const approvedNoDetails = approved.filter(b => !b.detailsFetched || !b.notionPageId);

  // 1. Searching state
  if (state.searching) {
    const loc = state.currentLocalidad || '';
    const prog = state.progress[loc];
    const done = prog ? Object.keys(prog.searchedPoints || {}).length : 0;
    const total = state.currentGridTotal || '?';
    hero.classList.add('accent');
    hero.innerHTML = `
      <div class="hero-head">
        <div class="hero-icon info-bg">${ICONS.search}</div>
        <div class="hero-text">
          <div class="hero-title">Buscando en ${escapeHtml(loc) || 'localidad'}...</div>
          <div class="hero-sub">${done} / ${total} puntos procesados</div>
        </div>
      </div>
      <div class="hero-actions">
        <button class="ghost" data-hero="stop">${ICONS.stop} Parar búsqueda</button>
      </div>`;
    return;
  }

  // 2. Pending review
  if (pending.length > 0) {
    hero.classList.remove('accent');
    hero.classList.add('accent');
    hero.innerHTML = `
      <div class="hero-head">
        <div class="hero-icon">${ICONS.eye}</div>
        <div class="hero-text">
          <div class="hero-title">${pending.length} ${pending.length === 1 ? 'local sin revisar' : 'locales sin revisar'}</div>
          <div class="hero-sub">Revisalos 1 por 1 con el teclado. J = descartar · L = aprobar.</div>
        </div>
      </div>
      <div class="hero-actions">
        <button class="primary" data-hero="review">${ICONS.play} Empezar revisión</button>
        <button class="ghost" data-hero="search-more">${ICONS.mapPin} Buscar más</button>
      </div>`;
    return;
  }

  // 3. Approved without Notion or phone
  if (approvedNoDetails.length > 0) {
    const needDetails = approvedNoDetails.filter(b => !b.detailsFetched).length;
    const cost = (needDetails * 0.017).toFixed(2);
    hero.classList.add('accent');
    hero.innerHTML = `
      <div class="hero-head">
        <div class="hero-icon accent-bg">${ICONS.phone}</div>
        <div class="hero-text">
          <div class="hero-title">${approvedNoDetails.length} aprobados listos para Notion</div>
          <div class="hero-sub">Traigo tel + web de ${needDetails} locales (≈ $${cost}) y los envío a tu Notion.</div>
        </div>
      </div>
      <div class="hero-actions">
        <button class="accent" data-hero="enrich">${ICONS.send} Enriquecer + enviar</button>
        <button class="ghost" data-hero="search-more">${ICONS.mapPin} Buscar más</button>
      </div>
      <div id="enrich-live" class="tiny subtle hidden"></div>`;
    return;
  }

  // 4. All done → prompt next localidad
  if (all.length > 0) {
    const geo = state.localidadesGeo;
    const unfinished = (geo?.features || []).filter(f => {
      const st = state.progress[f.properties.nombre]?.status;
      return st !== 'done';
    });
    hero.classList.remove('accent');
    hero.innerHTML = `
      <div class="hero-head">
        <div class="hero-icon accent-bg">${ICONS.party}</div>
        <div class="hero-text">
          <div class="hero-title">Todo al día</div>
          <div class="hero-sub">${all.length} locales procesados. Probá otra localidad para seguir prospectando.</div>
        </div>
      </div>
      <div class="hero-actions">
        <select id="localidad-select">
          ${unfinished.map(f => `<option value="${f.properties.nombre}">${f.properties.nombre}</option>`).join('')}
        </select>
        <button class="primary" data-hero="start">${ICONS.play} Iniciar</button>
      </div>`;
    return;
  }

  // 5. Empty state — first search
  const geo = state.localidadesGeo;
  hero.classList.add('accent');
  hero.innerHTML = `
    <div class="hero-head">
      <div class="hero-icon">${ICONS.sparkle}</div>
      <div class="hero-text">
        <div class="hero-title">Arrancá tu primera búsqueda</div>
        <div class="hero-sub">Elegí una localidad de Bogotá. La app escanea el grid y trae negocios tipo salones, gimnasios, clínicas, etc.</div>
      </div>
    </div>
    <div class="hero-actions">
      <select id="localidad-select">
        ${(geo?.features || []).map(f => `<option value="${f.properties.nombre}">${f.properties.nombre}</option>`).join('')}
      </select>
      <button class="primary" data-hero="start">${ICONS.play} Iniciar</button>
    </div>`;
}

/* ---------- budget / queue UI ---------- */
function refreshBudget() {
  const b = state.budget;
  const pill = document.getElementById('b-state-pill');
  const stateEl = document.getElementById('b-state');
  const toggleBtn = document.getElementById('btn-toggle-budget');
  if (stateEl) stateEl.textContent = b.stopped ? 'Bloqueada' : 'Activa';
  if (pill) pill.classList.toggle('stopped', !!b.stopped);
  if (toggleBtn) toggleBtn.textContent = b.stopped ? 'Desbloquear' : 'Bloquear';
}

function updateQueueInfo(size) {
  const el = document.getElementById('queue-info');
  if (!el) return;
  el.textContent = size > 0 ? `Cola Notion: ${size}` : 'Listo';
}

async function refreshBlacklist() {
  try {
    const r = await fetch('/api/blacklist').then(r => r.json());
    const el = document.getElementById('blacklist-info');
    if (el) el.textContent = `Blacklist: ${r.count} locales rechazados (no se volverán a traer)`;
  } catch {}
}

function refreshAll() {
  refreshCategoryFilter();
  refreshList();
  refreshBudget();
  refreshBlacklist();
  refreshPolygonStyles();
}

/* ---------- SSE ---------- */
function connectSSE() {
  const es = new EventSource('/api/stream');
  es.onmessage = e => {
    let d; try { d = JSON.parse(e.data); } catch { return; }
    switch (d.type) {
      case 'business':
        state.businesses[d.business.place_id] = d.business;
        addMarker(d.business);
        refreshCategoryFilter();
        refreshList();
        break;
      case 'budget':
        state.budget = d.status;
        refreshBudget();
        break;
      case 'warn':
        state.budget = d.status;
        refreshBudget();
        toast('Llegaste al 80% del crédito. Cuidado.', 'warn', 8000);
        break;
      case 'stopped':
        state.budget = d.status;
        refreshBudget();
        state.searching = false;
        setStatus('err', `Parado: ${d.reason}. Encontrados: ${Object.keys(state.businesses).length}`);
        toast(`Búsqueda detenida (${d.reason}). ${Object.keys(state.businesses).length} locales.`, 'err', 0);
        renderHero();
        break;
      case 'search_start':
        state.searching = true;
        state.currentLocalidad = d.localidad;
        state.progress[d.localidad] = state.progress[d.localidad] || { status: 'in_progress', searchedPoints: {} };
        state.progress[d.localidad].status = 'in_progress';
        refreshPolygonStyles();
        setStatus('running', `Buscando en ${d.localidad}...`);
        renderHero();
        break;
      case 'grid':
        state.currentGridTotal = d.points;
        setStatus('running', `${d.localidad}: ${d.points} puntos`);
        renderHero();
        break;
      case 'progress':
        setStatus('running', `${d.localidad}: ${d.done}/${d.total}`);
        renderHero();
        break;
      case 'search_end':
        state.searching = false;
        state.currentLocalidad = null;
        state.currentGridTotal = null;
        state.progress[d.localidad] = state.progress[d.localidad] || {};
        state.progress[d.localidad].status = d.status;
        refreshPolygonStyles();
        setStatus(d.status === 'done' ? 'done' : 'idle', `${d.localidad}: ${d.status}`);
        toast(`Búsqueda terminada en ${d.localidad}`, 'ok', 4000);
        renderHero();
        renderSteps();
        break;
      case 'error':
        toast('Error: ' + d.message, 'err', 5000);
        break;
      case 'notion_exported':
        if (state.businesses[d.placeId]) {
          state.businesses[d.placeId].notionPageId = d.pageId;
          refreshList();
        }
        break;
      case 'notion_queue':
        updateQueueInfo(d.size || 0);
        break;
      case 'notion_updated':
        toast('Notion actualizado', 'ok', 2000);
        break;
      case 'business_removed':
        if (state.markers[d.placeId]) {
          map.removeLayer(state.markers[d.placeId]);
          delete state.markers[d.placeId];
        }
        delete state.businesses[d.placeId];
        refreshList();
        refreshBlacklist();
        break;
      case 'cleanup_start':
        document.getElementById('cleanup-live').classList.remove('hidden');
        document.getElementById('btn-cleanup').disabled = true;
        document.getElementById('btn-cleanup').textContent = `Limpiando 0/${d.total}`;
        break;
      case 'cleanup_progress':
        document.getElementById('btn-cleanup').textContent = `Limpiando ${d.current}/${d.total}`;
        document.getElementById('cleanup-live').textContent = `→ ${d.name}`;
        break;
      case 'cleanup_end':
        document.getElementById('btn-cleanup').disabled = false;
        document.getElementById('btn-cleanup').textContent = 'Limpiar';
        document.getElementById('cleanup-live').classList.add('hidden');
        toast(`Limpieza: ${d.deleted} borrados, ${d.notionArchived} archivados, ${d.notionFailed} fallos`, 'ok', 6000);
        break;
      case 'purge_progress': break;
      case 'purge_end':
        toast(`Archivados en Notion: ${d.ok} OK, ${d.fail} fallos`, 'ok', 5000);
        refreshList();
        break;
      case 'enrich_start': {
        const live = document.getElementById('enrich-live');
        if (live) { live.classList.remove('hidden'); live.textContent = `Procesando 0/${d.total}`; }
        break;
      }
      case 'enrich_progress': {
        const live = document.getElementById('enrich-live');
        if (live) live.textContent = `Procesando ${d.current}/${d.total} · ${d.name}`;
        break;
      }
      case 'enrich_end': {
        const live = document.getElementById('enrich-live');
        if (live) live.classList.add('hidden');
        toast(`Enrich: ${d.ok} OK, ${d.fail} fallos`, 'ok', 5000);
        renderHero();
        renderSteps();
        break;
      }
      case 'notion_error':
        toast('Notion error: ' + d.message, 'err', 5000);
        break;
      case 'notion_batch_end':
        toast(`Notion: ${d.ok} OK, ${d.fail} errores`, d.fail ? 'warn' : 'ok', 5000);
        break;
      case 'details_batch_end':
        toast('Details batch terminado', 'ok', 3000);
        break;
    }
  };
  es.onerror = () => setStatus('err', 'Stream desconectado');
}

/* ---------- UI wiring ---------- */
function wireUI() {
  // hero card delegated clicks
  document.getElementById('hero-card').addEventListener('click', async e => {
    const btn = e.target.closest('[data-hero]');
    if (!btn) return;
    const action = btn.dataset.hero;
    if (action === 'start' || action === 'search-more') {
      const sel = document.getElementById('localidad-select');
      const loc = sel?.value;
      if (!loc) return;
      startSearch(loc);
    } else if (action === 'stop') {
      await fetch('/api/search/stop', { method: 'POST' });
      setStatus('idle', 'Detención pedida...');
    } else if (action === 'review') {
      startReview();
    } else if (action === 'enrich') {
      triggerEnrich();
    }
  });

  // stats chip filters
  document.querySelectorAll('.stat').forEach(chip => {
    chip.addEventListener('click', () => {
      const f = chip.dataset.filter;
      state.activeFilter = state.activeFilter === f ? 'all' : f;
      document.querySelectorAll('.stat').forEach(c => c.classList.toggle('active', c.dataset.filter === state.activeFilter && state.activeFilter !== 'all'));
      refreshList();
    });
  });

  // settings modal open/close
  document.getElementById('btn-settings').addEventListener('click', () => {
    document.getElementById('settings-modal').classList.remove('hidden');
  });
  document.getElementById('settings-close').addEventListener('click', () => {
    document.getElementById('settings-modal').classList.add('hidden');
  });

  // advanced actions (in settings modal)
  document.getElementById('btn-toggle-budget').addEventListener('click', async () => {
    const wasStopped = !!state.budget.stopped;
    const endpoint = wasStopped ? '/api/budget/unblock' : '/api/budget/block';
    const action = wasStopped ? 'Desbloquear' : 'Bloquear';
    if (!(await confirmDialog(`¿${action} la API?`, { title: action + ' API', okText: action, danger: !wasStopped }))) return;
    try {
      const res = await fetch(endpoint, { method: 'POST' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const r = await res.json();
      state.budget = { ...state.budget, ...r, stopped: !wasStopped };
      refreshBudget();
      toast(`API ${!wasStopped ? 'bloqueada' : 'desbloqueada'}`, 'ok', 2000);
    } catch (e) {
      toast('Error: ' + e.message, 'err', 5000);
    }
  });

  document.getElementById('btn-cleanup').addEventListener('click', async () => {
    const btn = document.getElementById('btn-cleanup');
    if (btn.disabled) return;
    if (!(await confirmDialog('Borra locales spam del cache Y archiva sus páginas en Notion.', { title: 'Limpiar spam', okText: 'Borrar', danger: true }))) return;
    btn.disabled = true;
    btn.textContent = 'Iniciando...';
    const r = await fetch('/api/cleanup/spam', { method: 'POST' });
    if (r.status === 409) {
      toast('Limpieza ya en curso', 'warn', 3000);
      btn.disabled = false; btn.textContent = 'Limpiar';
    }
  });

  // review modal
  document.getElementById('review-close').addEventListener('click', closeReview);
  document.getElementById('review-reject').addEventListener('click', () => reviewAction('reject'));
  document.getElementById('review-approve').addEventListener('click', () => reviewAction('approve'));
  document.addEventListener('keydown', e => {
    if (reviewState.open) {
      if (e.key === 'Escape') closeReview();
      else if (e.key === 'j' || e.key === 'J') reviewAction('reject');
      else if (e.key === 'l' || e.key === 'L') reviewAction('approve');
    }
    if (!document.getElementById('settings-modal').classList.contains('hidden') && e.key === 'Escape') {
      document.getElementById('settings-modal').classList.add('hidden');
    }
  });

  // filter inputs
  for (const id of ['filter-category', 'filter-localidad', 'filter-text']) {
    document.getElementById(id).addEventListener('input', refreshList);
  }

  // list delegated actions
  document.getElementById('business-list').addEventListener('click', async e => {
    const t = e.target;
    if (t.dataset.del) { e.stopPropagation(); await quickReject(t.dataset.del); return; }
    if (t.dataset.acceptGroup) { e.stopPropagation(); await acceptDuplicateGroup(t.dataset.acceptGroup.split(',')); return; }
    if (t.dataset.focus) {
      const b = state.businesses[t.dataset.focus];
      if (b && b.lat && b.lng) {
        map.setView([b.lat, b.lng], 17);
        openSingleReview(b.place_id);
      }
    }
  });
}

async function triggerEnrich() {
  const approved = Object.values(state.businesses).filter(b => b.reviewStatus === 'approved' && (!b.detailsFetched || !b.notionPageId));
  if (!approved.length) return toast('Todos los aprobados ya están listos', 'ok', 3000);
  const needDetails = approved.filter(b => !b.detailsFetched).length;
  const cost = (needDetails * 0.017).toFixed(2);
  const msg = `Traer tel/web de ${needDetails} locales + enviar ${approved.length} a Notion.\nCosto estimado: $${cost}`;
  if (!(await confirmDialog(msg, { title: 'Enriquecer aprobados', okText: 'Continuar' }))) return;
  const r = await fetch('/api/enrich/approved', { method: 'POST' });
  if (r.status === 409) return toast('Ya corriendo', 'warn', 3000);
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    return toast(j.error || `Error ${r.status}`, 'err', 6000);
  }
}

async function startSearch(localidad) {
  const r = await fetch('/api/search/start', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ localidad })
  });
  const data = await r.json();
  if (!r.ok) return toast(data.error || 'Error', 'err', 5000);
  state.searching = true;
  state.currentLocalidad = localidad;
  setStatus('running', `Iniciando ${localidad}...`);
  renderHero();
}

window.approveOne = async placeId => {
  await fetch(`/api/business/${placeId}/approve`, { method: 'POST' });
  if (state.businesses[placeId]) state.businesses[placeId].reviewStatus = 'approved';
  refreshList();
  toast('Aprobado', 'ok', 1500);
};

async function quickReject(placeId) {
  await fetch(`/api/business/${placeId}`, { method: 'DELETE' });
  if (state.markers[placeId]) { map.removeLayer(state.markers[placeId]); delete state.markers[placeId]; }
  delete state.businesses[placeId];
  refreshList();
  refreshBlacklist();
  toast('Eliminado', 'ok', 1200);
}

async function acceptDuplicateGroup(placeIds) {
  const r = await fetch('/api/business/accept-duplicates-bulk', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ placeIds })
  });
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    return toast(j.error || `Error ${r.status}`, 'err', 4000);
  }
  for (const id of placeIds) {
    if (state.businesses[id]) state.businesses[id].notDuplicate = true;
  }
  refreshList();
  toast(`Grupo aceptado (${placeIds.length} locales)`, 'ok', 1800);
}

window.rejectOne = async placeId => {
  if (!(await confirmDialog('Borra del cache, archiva la página de Notion si existe, y agrega el place_id a la blacklist.', { title: 'Eliminar local', okText: 'Eliminar', danger: true }))) return;
  await fetch(`/api/business/${placeId}`, { method: 'DELETE' });
  if (state.markers[placeId]) { map.removeLayer(state.markers[placeId]); delete state.markers[placeId]; }
  delete state.businesses[placeId];
  refreshList();
  toast('Eliminado', 'ok', 2000);
};

/* ---------- popup ---------- */
function popupHtml(b) {
  const status = b.reviewStatus === 'approved' ? '<div style="color:var(--accent);font-weight:600;margin:4px 0">Aprobado</div>' : '';
  let rich = '';
  if (b.detailsFetched) {
    const phone = b.formatted_phone_number ? `<div>${escapeHtml(b.formatted_phone_number)}</div>` : '';
    const web = b.website ? `<div><a href="${b.website}" target="_blank">${escapeHtml(b.website.replace(/^https?:\/\//, ''))}</a></div>` : '';
    rich = `
      ${phone}${web}
      <div>${escapeHtml(b.formatted_address || '')}</div>
      <div>★ ${b.rating ?? '-'} (${b.user_ratings_total || 0})</div>
    `;
  } else {
    const embedSrc = state.mapsKey ? `https://www.google.com/maps/embed/v1/place?key=${state.mapsKey}&q=place_id:${b.place_id}&zoom=17` : null;
    rich = `
      <div>${escapeHtml(b.formatted_address || '')}</div>
      <div>★ ${b.rating ?? '-'} (${b.user_ratings_total || 0})</div>
      ${embedSrc ? `<iframe src="${embedSrc}" style="width:100%;height:520px;border:1px solid #e7e5e0;border-radius:8px;margin-top:6px" allowfullscreen loading="lazy"></iframe>` : ''}
    `;
  }
  return `
    <div style="width:560px">
      <b style="font-size:14px">${escapeHtml(b.name)}</b>
      <small style="color:#6b6b6b"> · ${escapeHtml(b.category)} · ${escapeHtml(b.localidad || '')}</small>
      ${status}${rich}
      <div style="display:flex;gap:6px;margin-top:10px">
        <button style="flex:1;background:#dc2626;color:white;border:none;padding:10px;border-radius:8px;cursor:pointer;font-weight:700" onclick="window.rejectOne('${b.place_id}')">Eliminar</button>
        <button style="flex:1;background:#2d6a4f;color:white;border:none;padding:10px;border-radius:8px;cursor:pointer;font-weight:700" onclick="window.approveOne('${b.place_id}')">Aprobar</button>
      </div>
    </div>`;
}

/* ---------- review mode ---------- */
const reviewState = { open: false, queue: [], index: 0 };

function startReview() {
  const candidates = filteredBusinesses().filter(b => b.reviewStatus !== 'approved');
  if (!candidates.length) return toast('Nada para revisar', 'ok');
  reviewState.queue = candidates.map(b => b.place_id);
  reviewState.index = 0;
  reviewState.open = true;
  document.getElementById('review-modal').classList.remove('hidden');
  renderReview();
}

function closeReview() {
  reviewState.open = false;
  document.getElementById('review-modal').classList.add('hidden');
}

function buildEmbed(b, mode) {
  if (!state.mapsKey) return '';
  const k = state.mapsKey;
  if (mode === 'streetview') return `https://www.google.com/maps/embed/v1/streetview?key=${k}&location=${b.lat},${b.lng}&heading=0&pitch=0&fov=90`;
  if (mode === 'view') return `https://www.google.com/maps/embed/v1/view?key=${k}&center=${b.lat},${b.lng}&zoom=19&maptype=satellite`;
  return `https://www.google.com/maps/embed/v1/place?key=${k}&q=place_id:${b.place_id}&zoom=18`;
}

function renderReview(mode = 'place') {
  const id = reviewState.queue[reviewState.index];
  const b = id && state.businesses[id];
  const body = document.getElementById('review-body');
  document.getElementById('review-counter').textContent = `${reviewState.index + 1} / ${reviewState.queue.length}`;
  if (!b) { body.innerHTML = '<p class="subtle">No hay más</p>'; return; }
  const src = buildEmbed(b, mode);
  body.innerHTML = `
    <h3>${escapeHtml(b.name)}</h3>
    <div class="meta">${escapeHtml(b.category)} · ${escapeHtml(b.localidad || '')} · ★ ${b.rating ?? '-'} (${b.user_ratings_total || 0})</div>
    <div class="meta">${escapeHtml(b.formatted_address || '')}</div>
    ${b.reviewStatus === 'approved' ? '<div style="color:var(--accent);margin-top:4px;font-weight:600">Ya aprobado</div>' : ''}
    <div class="embed-modes">
      <button data-mode="place" class="${mode === 'place' ? 'active' : ''}">Info local</button>
      <button data-mode="streetview" class="${mode === 'streetview' ? 'active' : ''}">Street View</button>
      <button data-mode="view" class="${mode === 'view' ? 'active' : ''}">Satélite</button>
    </div>
    ${src ? `<iframe class="review-embed" src="${src}" allowfullscreen loading="lazy"></iframe>` : '<p class="subtle">Sin API key</p>'}
    <div class="links">
      <a href="${b.url}" target="_blank">Abrir en Google Maps</a>
      ${b.website ? `<a href="${b.website}" target="_blank">Web</a>` : ''}
    </div>
  `;
  body.querySelectorAll('.embed-modes button').forEach(btn => {
    btn.addEventListener('click', () => renderReview(btn.dataset.mode));
  });
  if (b.lat && b.lng) map.setView([b.lat, b.lng], 17);
}

window.focusMap = id => {
  const b = state.businesses[id];
  if (b?.lat) map.setView([b.lat, b.lng], 18);
};

async function reviewAction(kind) {
  const id = reviewState.queue[reviewState.index];
  if (!id) return;
  if (kind === 'reject') {
    await fetch(`/api/business/${id}`, { method: 'DELETE' });
    toast('Eliminado', 'ok', 1200);
  } else if (kind === 'approve') {
    await fetch(`/api/business/${id}/approve`, { method: 'POST' });
    if (state.businesses[id]) state.businesses[id].reviewStatus = 'approved';
    refreshList();
    toast('Aprobado', 'ok', 1200);
  }
  reviewState.index++;
  if (reviewState.index >= reviewState.queue.length) {
    const wasBatch = reviewState.queue.length > 1;
    closeReview();
    if (wasBatch) toast('Revisión terminada', 'ok', 3000);
    return;
  }
  renderReview();
}

/* ---------- status + toast + confirm ---------- */
function setStatus(kind, text) {
  const dot = document.getElementById('status-dot');
  dot.className = 'dot ' + kind;
  document.getElementById('status-text').textContent = text;
}

function confirmDialog(msg, { title = 'Confirmar', okText = 'Aceptar', cancelText = 'Cancelar', danger = false } = {}) {
  return new Promise(resolve => {
    const modal = document.getElementById('confirm-modal');
    const ok = document.getElementById('confirm-ok');
    const cancel = document.getElementById('confirm-cancel');
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-msg').textContent = msg;
    ok.textContent = okText;
    cancel.textContent = cancelText;
    ok.className = danger ? 'reject' : 'primary';
    modal.classList.remove('hidden');
    const done = v => {
      modal.classList.add('hidden');
      ok.removeEventListener('click', onOk);
      cancel.removeEventListener('click', onCancel);
      document.removeEventListener('keydown', onKey);
      resolve(v);
    };
    const onOk = () => done(true);
    const onCancel = () => done(false);
    const onKey = e => {
      if (e.key === 'Escape') done(false);
      else if (e.key === 'Enter') done(true);
    };
    ok.addEventListener('click', onOk);
    cancel.addEventListener('click', onCancel);
    document.addEventListener('keydown', onKey);
  });
}

let toastTimer;
function toast(msg, kind = 'ok', ms = 3000) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast ' + kind;
  clearTimeout(toastTimer);
  if (ms > 0) toastTimer = setTimeout(() => el.classList.add('hidden'), ms);
}

checkConfig();
