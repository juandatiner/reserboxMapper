const state = {
  businesses: {},
  markers: {},
  polygons: {},
  progress: {},
  budget: {},
  searching: false,
  mapsKey: null,
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
function colorFor(category) {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.default;
}

// ---------- setup / config ----------
async function checkConfig() {
  const r = await fetch('/api/config/status').then(r => r.json());
  if (r.googleSet && r.notionSet) {
    document.getElementById('setup').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    state.autoNotion = true;
    await initApp();
    document.getElementById('queue-info').textContent = `Cola Notion: ${r.notionQueueSize || 0}`;
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

// ---------- main app ----------
let map;
async function initApp() {
  map = L.map('map').setView([4.65, -74.1], 11);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap',
    maxZoom: 19
  }).addTo(map);

  addLegend();

  const [geo, progress, businessesArr, budget] = await Promise.all([
    fetch('/api/localidades').then(r => r.json()),
    fetch('/api/progress').then(r => r.json()),
    fetch('/api/businesses').then(r => r.json()),
    fetch('/api/budget').then(r => r.json())
  ]);

  state.progress = progress;
  state.budget = budget;

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
      <div><span class="swatch" style="background:#64748b"></span>Sin buscar</div>
      <div><span class="swatch" style="background:#fbbf24"></span>En progreso</div>
      <div><span class="swatch" style="background:#4ade80"></span>Completada</div>
      <div style="margin-top:6px"><b>Pines por categoría</b></div>
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
  let color = '#64748b';
  if (status === 'in_progress') color = '#fbbf24';
  else if (status === 'done') color = '#4ade80';
  return { color, weight: 1.5, fillColor: color, fillOpacity: 0.15 };
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
  for (const [nombre, poly] of Object.entries(state.polygons)) {
    poly.setStyle(polygonStyle(nombre));
  }
}

function populateSelects(geo) {
  const sel = document.getElementById('localidad-select');
  const filt = document.getElementById('filter-localidad');
  for (const f of geo.features) {
    const n = f.properties.nombre;
    sel.insertAdjacentHTML('beforeend', `<option value="${n}">${n}</option>`);
    filt.insertAdjacentHTML('beforeend', `<option value="${n}">${n}</option>`);
  }
}

// ---------- markers ----------
function addMarker(b) {
  if (!b.lat || !b.lng) return;
  if (state.markers[b.place_id]) return;
  const m = L.circleMarker([b.lat, b.lng], {
    radius: 6,
    color: colorFor(b.category),
    fillColor: colorFor(b.category),
    fillOpacity: 0.85,
    weight: 1
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

function popupHtml(b) {
  const status = b.reviewStatus === 'approved'
    ? '<div style="color:#16a34a;font-weight:600;margin:4px 0">✓ Aprobado</div>'
    : '';
  let rich = '';
  if (b.detailsFetched) {
    const phone = b.formatted_phone_number ? `<div>📞 <b>${escapeHtml(b.formatted_phone_number)}</b></div>` : '';
    const web = b.website ? `<div>🌐 <a href="${b.website}" target="_blank">${escapeHtml(b.website.replace(/^https?:\/\//,''))}</a></div>` : '';
    const sum = b.editorial_summary ? `<div style="margin:6px 0;color:#555;font-style:italic">${escapeHtml(b.editorial_summary)}</div>` : '';
    const hours = b.opening_hours?.weekday_text?.length
      ? `<details style="margin-top:6px"><summary style="cursor:pointer">Horarios</summary><ul style="margin:4px 0 0 14px;padding:0;font-size:12px">${b.opening_hours.weekday_text.map(h => `<li>${escapeHtml(h)}</li>`).join('')}</ul></details>`
      : '';
    const reviews = (b.reviews || []).slice(0, 3).map(r => `
      <div style="border-top:1px solid #eee;padding:6px 0;font-size:12px">
        <b>${escapeHtml(r.author_name || 'Anónimo')}</b> — ⭐ ${r.rating}
        <div style="color:#555">${escapeHtml((r.text || '').slice(0, 200))}${(r.text || '').length > 200 ? '...' : ''}</div>
      </div>`).join('');
    rich = `
      ${sum}
      ${phone}${web}
      <div>📍 ${escapeHtml(b.formatted_address || '')}</div>
      <div>⭐ ${b.rating ?? '-'} (${b.user_ratings_total || 0} reseñas)</div>
      ${hours}
      ${reviews ? `<div style="margin-top:8px"><b>Reseñas</b>${reviews}</div>` : ''}
    `;
  } else {
    const embedSrc = state.mapsKey
      ? `https://www.google.com/maps/embed/v1/place?key=${state.mapsKey}&q=place_id:${b.place_id}&zoom=17`
      : null;
    rich = `
      <div>${escapeHtml(b.formatted_address || '')}</div>
      <div>⭐ ${b.rating ?? '-'} (${b.user_ratings_total || 0})</div>
      ${embedSrc ? `<iframe src="${embedSrc}" style="width:100%;height:520px;border:1px solid #ccc;border-radius:4px;margin-top:6px" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>` : ''}
    `;
  }
  return `
    <div style="width:560px">
      <b style="font-size:14px">${escapeHtml(b.name)}</b>
      <small style="color:#666"> — ${escapeHtml(b.category)} · ${escapeHtml(b.localidad || '')}</small>
      ${status}
      ${rich}
      <div style="display:flex;gap:6px;margin-top:8px">
        <button style="flex:1;background:#dc2626;color:white;border:none;padding:10px;border-radius:4px;cursor:pointer;font-weight:600" onclick="window.rejectOne('${b.place_id}')">✗ Eliminar</button>
        <button style="flex:1;background:#16a34a;color:white;border:none;padding:10px;border-radius:4px;cursor:pointer;font-weight:600" onclick="window.approveOne('${b.place_id}')">✓ Aprobar</button>
      </div>
    </div>`;
}


function escapeHtml(s) {
  return (s || '').toString().replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// ---------- list / filters ----------
function filteredBusinesses() {
  const cat = document.getElementById('filter-category').value;
  const loc = document.getElementById('filter-localidad').value;
  const txt = document.getElementById('filter-text').value.toLowerCase().trim();
  return Object.values(state.businesses).filter(b =>
    (!cat || b.category === cat) &&
    (!loc || b.localidad === loc) &&
    (!txt || (b.name || '').toLowerCase().includes(txt))
  );
}

function refreshCategoryFilter() {
  const sel = document.getElementById('filter-category');
  const existing = new Set(Array.from(sel.options).map(o => o.value));
  const cats = new Set(Object.values(state.businesses).map(b => b.category).filter(Boolean));
  for (const c of cats) {
    if (!existing.has(c)) sel.insertAdjacentHTML('beforeend', `<option value="${c}">${c}</option>`);
  }
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
  const badge = noPhoneDone
    ? '<span style="color:#fbbf24">⚠</span> '
    : (fullyDone ? '<span style="color:#38bdf8">📨</span> ' : (b.reviewStatus === 'approved' ? '<span style="color:#4ade80">✓</span> ' : ''));
  const phoneShown = b.formatted_phone_number || b.international_phone_number;
  li.innerHTML = `
    <div class="bname">${badge}${escapeHtml(b.name)}</div>
    <div>${statusPill(b)}${isDup ? ' <span class="pill dup">🔀 Posible duplicado</span>' : ''}</div>
    <div class="bmeta">${escapeHtml(b.category)} · ${escapeHtml(b.localidad || '')}</div>
    <div class="bmeta">⭐ ${b.rating ?? '-'} (${b.user_ratings_total || 0}) ${phoneShown ? '· 📞 ' + escapeHtml(phoneShown) : '· <span style="color:#fbbf24">sin teléfono</span>'}</div>
    ${b.formatted_address ? `<div class="bmeta">📍 ${escapeHtml(b.formatted_address)}</div>` : ''}
    <div class="bactions">
      <a href="${b.url}" target="_blank">Maps</a>
      ${b.website ? `<a href="${b.website}" target="_blank">Web</a>` : ''}
      <button data-focus="${b.place_id}">Ver</button>
      ${opts.quickAcceptDup ? `<button class="quick-ok" data-accept-dup="${b.place_id}" title="Aceptar: no es duplicado">✓</button>` : ''}
      ${opts.quickDelete ? `<button class="quick-del" data-del="${b.place_id}" title="Eliminar rápido">✗</button>` : ''}
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

  const reasons = {}; // placeId -> { name: Set, addr: Set, phone: Set }
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

function statusPill(b) {
  const hasPhone = !!(b.formatted_phone_number || b.international_phone_number);
  if (b.reviewStatus === 'approved' && b.detailsFetched && b.notionPageId && hasPhone) return '<span class="pill done">📨 En Notion con teléfono</span>';
  if (b.reviewStatus === 'approved' && b.detailsFetched && b.notionPageId) return '<span class="pill nophone">⚠ En Notion SIN teléfono</span>';
  if (b.reviewStatus === 'approved' && b.detailsFetched && !hasPhone) return '<span class="pill nophone">⚠ Sin teléfono · NO enviado a Notion</span>';
  if (b.reviewStatus === 'approved' && b.notionPageId) return '<span class="pill approved">✓ Verificado · en Notion (falta traer detalles)</span>';
  if (b.reviewStatus === 'approved') return '<span class="pill approved">✓ Verificado · falta enviar a Notion</span>';
  return '<span class="pill pending">○ Sin verificar</span>';
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
  // Sections computed over FULL list — items duplicados también aparecen en su sección semántica.
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
    h.innerHTML = `<span class="caret">${collapsed ? '▸' : '▾'}</span> 🔀 Posibles duplicados — ${dupGroups.length} grupos · ${dupIds.size} locales`;
    h.addEventListener('click', () => toggleSection('dup'));
    ul.appendChild(h);
    if (!collapsed) {
      dupGroups.forEach((ids, idx) => {
        const gh = document.createElement('li');
        gh.className = 'dup-group-header';
        gh.innerHTML = `
          <div class="dup-group-meta"><b>Grupo ${idx + 1}</b> · ${ids.length} locales · coincide por <i>${groupReasonsLabel(ids, dupReasons)}</i></div>
          <button class="quick-ok dup-group-accept" data-accept-group="${ids.join(',')}" title="Aceptar grupo: no son duplicados">✓ Aceptar grupo</button>
        `;
        ul.appendChild(gh);
        for (const id of ids) {
          const b = state.businesses[id];
          if (b) ul.appendChild(buildListItem(b, { quickDelete: true }));
        }
      });
    }
  }

  renderSection(ul, 'approvedPartial', `✓ Verificados — falta enviar a Notion/traer contacto (${approvedPartial.length})`, approvedPartial, 'approved');
  renderSection(ul, 'noPhone', `⚠ Segunda verificación — sin teléfono (no enviados a Notion) (${noPhone.length})`, noPhone, 'nophone', { quickDelete: true });
  renderSection(ul, 'done', `✅ Listos — verificados + en Notion + con teléfono (${done.length})`, done, 'done');
  renderSection(ul, 'pending', `○ Sin verificar (${pending.length})`, pending, '');
  const all = Object.values(state.businesses);
  document.getElementById('count-total').textContent = all.length;
  document.getElementById('count-approved').textContent = all.filter(b => b.reviewStatus === 'approved').length;
  const wrap = document.getElementById('filter-wrap');
  if (list.length !== all.length) {
    wrap.classList.remove('hidden');
    document.getElementById('count-filtered').textContent = list.length;
  } else {
    wrap.classList.add('hidden');
  }
}

// ---------- budget UI ----------
function refreshBudget() {
  const b = state.budget;
  const stateEl = document.getElementById('b-state');
  const toggleBtn = document.getElementById('btn-toggle-budget');
  if (stateEl) {
    stateEl.textContent = b.stopped ? '🛑 Bloqueado' : '✅ Activo';
    stateEl.style.color = b.stopped ? '#f87171' : '#4ade80';
  }
  if (toggleBtn) toggleBtn.textContent = b.stopped ? 'Desbloquear' : 'Bloquear';
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

// ---------- SSE ----------
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
        toast('⚠️ Llegaste al 80% del crédito. Cuidado.', 'warn', 8000);
        break;
      case 'stopped':
        state.budget = d.status;
        refreshBudget();
        state.searching = false;
        setStatus('err', `Parado: ${d.reason}. Encontrados: ${Object.keys(state.businesses).length}`);
        toast(`🛑 Búsqueda detenida (${d.reason}). ${Object.keys(state.businesses).length} locales encontrados.`, 'err', 0);
        break;
      case 'search_start':
        state.searching = true;
        state.progress[d.localidad] = state.progress[d.localidad] || { status: 'in_progress', searchedPoints: {} };
        state.progress[d.localidad].status = 'in_progress';
        refreshPolygonStyles();
        setStatus('running', `Buscando en ${d.localidad}...`);
        break;
      case 'grid':
        setStatus('running', `${d.localidad}: ${d.points} puntos de grid`);
        break;
      case 'progress':
        setStatus('running', `${d.localidad}: ${d.done}/${d.total} puntos`);
        break;
      case 'search_end':
        state.searching = false;
        state.progress[d.localidad] = state.progress[d.localidad] || {};
        state.progress[d.localidad].status = d.status;
        refreshPolygonStyles();
        setStatus(d.status === 'done' ? 'done' : 'idle', `${d.localidad}: ${d.status}`);
        toast(`Búsqueda terminada en ${d.localidad} (${d.status})`, 'ok', 4000);
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
        document.getElementById('queue-info').textContent = `Cola Notion: ${d.size}`;
        break;
      case 'notion_updated':
        toast('Notion actualizado con Details', 'ok', 2000);
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
        document.getElementById('btn-cleanup').textContent = `Limpiando 0/${d.total}...`;
        break;
      case 'cleanup_progress':
        document.getElementById('btn-cleanup').textContent = `Limpiando ${d.current}/${d.total}`;
        document.getElementById('cleanup-live').textContent = `✗ ${d.name}`;
        break;
      case 'cleanup_end':
        document.getElementById('btn-cleanup').disabled = false;
        document.getElementById('btn-cleanup').textContent = 'Limpiar spam (polleria, hotel, etc.)';
        document.getElementById('cleanup-live').classList.add('hidden');
        toast(`Limpieza: ${d.deleted} borrados, ${d.notionArchived} archivados en Notion, ${d.notionFailed} fallos`, 'ok', 6000);
        break;
      case 'purge_progress':
        break;
      case 'purge_end':
        toast(`Archivados en Notion: ${d.ok} OK, ${d.fail} fallos`, 'ok', 5000);
        refreshList();
        break;
      case 'enrich_start':
        document.getElementById('btn-enrich').disabled = true;
        document.getElementById('btn-enrich').textContent = `Procesando 0/${d.total}...`;
        document.getElementById('enrich-live').classList.remove('hidden');
        break;
      case 'enrich_progress':
        document.getElementById('btn-enrich').textContent = `Procesando ${d.current}/${d.total}`;
        document.getElementById('enrich-live').textContent = `→ ${d.name}`;
        break;
      case 'enrich_end':
        document.getElementById('btn-enrich').disabled = false;
        document.getElementById('btn-enrich').textContent = 'Traer contacto de aprobados → Notion';
        document.getElementById('enrich-live').classList.add('hidden');
        toast(`Enrich: ${d.ok} OK, ${d.fail} fallos`, 'ok', 5000);
        break;
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

// ---------- UI wiring ----------
function wireUI() {
  document.getElementById('btn-start').addEventListener('click', () => {
    const loc = document.getElementById('localidad-select').value;
    startSearch(loc);
  });
  document.getElementById('btn-stop').addEventListener('click', async () => {
    await fetch('/api/search/stop', { method: 'POST' });
    setStatus('idle', 'Detención pedida...');
  });
  document.getElementById('btn-toggle-budget').addEventListener('click', async () => {
    const wasStopped = !!state.budget.stopped;
    const endpoint = wasStopped ? '/api/budget/unblock' : '/api/budget/block';
    const action = wasStopped ? 'Desbloquear' : 'Bloquear';
    if (!(await confirmDialog(`¿${action} API?`, { title: action + ' API', okText: action, danger: !wasStopped }))) return;
    try {
      const res = await fetch(endpoint, { method: 'POST' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const r = await res.json();
      state.budget = { ...state.budget, ...r, stopped: !wasStopped };
      refreshBudget();
      toast(`API ${!wasStopped ? 'bloqueada' : 'desbloqueada'}`, 'ok', 2000);
    } catch (e) {
      toast('Error: ' + e.message + ' (¿reiniciaste server?)', 'err', 5000);
    }
  });
  document.getElementById('btn-cleanup').addEventListener('click', async () => {
    const btn = document.getElementById('btn-cleanup');
    if (btn.disabled) return;
    if (!(await confirmDialog('Borrar locales spam (pollerías, hoteles, bancos, restaurantes, etc.) del cache Y archivar sus páginas en Notion.', { title: 'Limpiar spam', okText: 'Borrar', danger: true }))) return;
    btn.disabled = true;
    btn.textContent = 'Iniciando limpieza...';
    const r = await fetch('/api/cleanup/spam', { method: 'POST' });
    if (r.status === 409) {
      toast('Limpieza ya en curso', 'warn', 3000);
      btn.disabled = false; btn.textContent = 'Limpiar spam (polleria, hotel, etc.)';
      return;
    }
  });
  document.getElementById('btn-review').addEventListener('click', startReview);
  document.getElementById('btn-enrich').addEventListener('click', async () => {
    const btn = document.getElementById('btn-enrich');
    if (btn.disabled) return;
    const approved = Object.values(state.businesses).filter(b => b.reviewStatus === 'approved' && (!b.detailsFetched || !b.notionPageId));
    if (!approved.length) return toast('Todos los aprobados ya tienen contacto + están en Notion', 'ok', 3000);
    const needDetails = approved.filter(b => !b.detailsFetched).length;
    const cost = (needDetails * 0.017).toFixed(2);
    const msg = `Traer tel/web de ${needDetails} locales aprobados + enviar ${approved.length} a Notion.
Costo: $${cost}`;
    if (!(await confirmDialog(msg, { title: 'Enriquecer aprobados', okText: 'Continuar' }))) return;
    const r = await fetch('/api/enrich/approved', { method: 'POST' });
    if (r.status === 409) return toast('Ya corriendo', 'warn', 3000);
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      return toast(j.error || `Error ${r.status}`, 'err', 6000);
    }
  });
  document.getElementById('review-close').addEventListener('click', closeReview);
  document.getElementById('review-reject').addEventListener('click', () => reviewAction('reject'));
  document.getElementById('review-approve').addEventListener('click', () => reviewAction('approve'));
  document.addEventListener('keydown', e => {
    if (!reviewState.open) return;
    if (e.key === 'Escape') closeReview();
    else if (e.key === 'j' || e.key === 'J') reviewAction('reject');
    else if (e.key === 'l' || e.key === 'L') reviewAction('approve');
  });
  for (const id of ['filter-category', 'filter-localidad', 'filter-text']) {
    document.getElementById(id).addEventListener('input', refreshList);
  }

  fetch('/api/settings', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ searchMode: 'economy', autoNotion: false })
  });

  document.getElementById('business-list').addEventListener('click', async e => {
    const t = e.target;
    if (t.dataset.del) {
      e.stopPropagation();
      await quickReject(t.dataset.del);
      return;
    }
    if (t.dataset.acceptGroup) {
      e.stopPropagation();
      await acceptDuplicateGroup(t.dataset.acceptGroup.split(','));
      return;
    }
    if (t.dataset.focus) {
      const b = state.businesses[t.dataset.focus];
      if (b && b.lat && b.lng) {
        map.setView([b.lat, b.lng], 17);
        openSingleReview(b.place_id);
      }
    }
  });
}

async function startSearch(localidad) {
  const r = await fetch('/api/search/start', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ localidad })
  });
  const data = await r.json();
  if (!r.ok) return toast(data.error || 'Error', 'err', 5000);
  state.searching = true;
  setStatus('running', `Iniciando ${localidad}...`);
  document.getElementById('btn-stop').disabled = false;
}

window.approveOne = async placeId => {
  await fetch(`/api/business/${placeId}/approve`, { method: 'POST' });
  if (state.businesses[placeId]) state.businesses[placeId].reviewStatus = 'approved';
  refreshList();
  toast('✓ Aprobado', 'ok', 1500);
};

async function quickReject(placeId) {
  await fetch(`/api/business/${placeId}`, { method: 'DELETE' });
  if (state.markers[placeId]) { map.removeLayer(state.markers[placeId]); delete state.markers[placeId]; }
  delete state.businesses[placeId];
  refreshList();
  refreshBlacklist();
  toast('✗ Eliminado', 'ok', 1200);
}

async function acceptDuplicateGroup(placeIds) {
  const r = await fetch('/api/business/accept-duplicates-bulk', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ placeIds })
  });
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    return toast(j.error || `Error ${r.status} (¿reiniciaste server?)`, 'err', 4000);
  }
  for (const id of placeIds) {
    if (state.businesses[id]) state.businesses[id].notDuplicate = true;
  }
  refreshList();
  toast(`✓ Grupo aceptado (${placeIds.length} locales)`, 'ok', 1800);
}

window.rejectOne = async placeId => {
  if (!(await confirmDialog('Esto borra del cache, archiva la página en Notion si existe, y agrega el place_id a la blacklist para no volver a traerlo.', { title: 'Eliminar local', okText: 'Eliminar', danger: true }))) return;
  await fetch(`/api/business/${placeId}`, { method: 'DELETE' });
  if (state.markers[placeId]) { map.removeLayer(state.markers[placeId]); delete state.markers[placeId]; }
  delete state.businesses[placeId];
  refreshList();
  toast('✗ Eliminado', 'ok', 2000);
};

// ---------- review mode ----------
const reviewState = { open: false, queue: [], index: 0 };

function startReview() {
  const candidates = filteredBusinesses().filter(b => b.reviewStatus !== 'approved');
  if (!candidates.length) return toast('Nada para revisar en el filtro actual', 'ok');
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
  if (!b) { body.innerHTML = '<p style="color:#94a3b8">No hay más</p>'; return; }
  const src = buildEmbed(b, mode);
  body.innerHTML = `
    <h3>${escapeHtml(b.name)}</h3>
    <div class="meta">${escapeHtml(b.category)} · ${escapeHtml(b.localidad || '')} · ⭐ ${b.rating ?? '-'} (${b.user_ratings_total || 0})</div>
    <div class="meta">${escapeHtml(b.formatted_address || '')}</div>
    ${b.reviewStatus === 'approved' ? '<div style="color:#4ade80;margin-top:4px">✓ Ya aprobado</div>' : ''}
    <div class="embed-modes">
      <button data-mode="place" class="${mode==='place'?'active':''}">📍 Info local</button>
      <button data-mode="streetview" class="${mode==='streetview'?'active':''}">👁 Street View</button>
      <button data-mode="view" class="${mode==='view'?'active':''}">🛰 Satélite</button>
    </div>
    ${src ? `<iframe class="review-embed" src="${src}" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>` : '<p style="color:#f87171">Sin API key</p>'}
    <div class="links">
      <a href="${b.url}" target="_blank">Abrir en Google Maps ↗</a>
      ${b.website ? `<a href="${b.website}" target="_blank">Web ↗</a>` : ''}
    </div>
  `;
  body.querySelectorAll('.embed-modes button').forEach(btn => {
    btn.addEventListener('click', () => renderReview(btn.dataset.mode));
  });
  if (b.lat && b.lng) {
    map.setView([b.lat, b.lng], 17);
  }
}

window.focusMap = id => {
  const b = state.businesses[id];
  if (b?.lat) { map.setView([b.lat, b.lng], 18); }
};

async function reviewAction(kind) {
  const id = reviewState.queue[reviewState.index];
  if (!id) return;
  if (kind === 'reject') {
    await fetch(`/api/business/${id}`, { method: 'DELETE' });
    toast('✗ Eliminado', 'ok', 1200);
  } else if (kind === 'approve') {
    await fetch(`/api/business/${id}/approve`, { method: 'POST' });
    if (state.businesses[id]) state.businesses[id].reviewStatus = 'approved';
    refreshList();
    toast('✓ Aprobado', 'ok', 1200);
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

function setStatus(kind, text) {
  const dot = document.getElementById('status-dot');
  dot.className = 'dot ' + kind;
  document.getElementById('status-text').textContent = text;
  document.getElementById('btn-stop').disabled = !state.searching;
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
