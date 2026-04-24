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

/* ---------- category clusters ---------- */
const CATEGORY_CLUSTERS = [
  { id: 'beauty',  label: 'Belleza',    types: ['hair_salon','beauty_salon','barber','spa','nail_salon'] },
  { id: 'health',  label: 'Salud',      types: ['doctor','clinic','dentist','physiotherapist','hospital','drugstore'] },
  { id: 'fitness', label: 'Fitness',    types: ['gym'] },
  { id: 'pro',     label: 'Servicios',  types: ['lawyer','photographer'] },
  { id: 'pets',    label: 'Mascotas',   types: ['veterinary_care'] },
  { id: 'other',   label: 'Otros',      types: ['tattoo_parlor'] }
];
const TYPE_LABELS = {
  hair_salon: 'Peluquería', beauty_salon: 'Salón belleza', barber: 'Barbería', spa: 'Spa', nail_salon: 'Uñas',
  doctor: 'Médico', clinic: 'Clínica', dentist: 'Odontólogo', physiotherapist: 'Fisio', hospital: 'Hospital', drugstore: 'Droguería',
  gym: 'Gimnasio',
  lawyer: 'Abogado', photographer: 'Fotógrafo',
  veterinary_care: 'Veterinaria', tattoo_parlor: 'Tatuajes'
};
function clusterOfType(type) {
  for (const c of CATEGORY_CLUSTERS) if (c.types.includes(type)) return c.id;
  // Heurística para categorías que vienen de keyword searches (español/inglés)
  const t = (type || '').toLowerCase();
  if (/médic|medic|salud|cl[íi]nic|dentist|odontó|fisio|psic[óo]|terapeu|therap|nutri|acupunt|est[ée]tic|ortoped|dermató|cardi|pediatr|gine|oftal|neuro|quiro|cirug|urol|endocrin|gastro|implant|endodon/.test(t)) return 'health';
  if (/pilates|yoga|fitness|gim|entrenad|gym|trainer|crossfit/.test(t)) return 'fitness';
  if (/pelu|barb|spa|belleza|beauty|manicur|u[ñn]as|nail|masaj|massag|microblading|depila|laser|bot[óo]x|rellen/.test(t)) return 'beauty';
  if (/foto|photo|abog|lawyer|conta|asesor/.test(t)) return 'pro';
  if (/veterin|mascot|pet/.test(t)) return 'pets';
  return 'other';
}
function typeLabel(t) { return TYPE_LABELS[t] || t; }

/* ---------- state ---------- */
const state = {
  businesses: {},
  markers: {},
  polygons: {},
  progress: {},
  budget: {},
  searching: false,
  mapsKey: null,
  activeFilter: 'all',           // stats chip: all | approved | notion
  activeCluster: null,            // cluster id | null
  activeType: null,               // specific google place type | null
  topOnly: false,                 // rating>=4 && reviews>=30
  withPhoneOnly: false,
  hideClosed: true,               // hide CLOSED_TEMPORARILY por default
  ratingMin: 0,
  reviewsMin: 0,
  sb: { types: new Set(), preset: 'economy', localidad: null },  // search builder state
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

  // Cluster group para agrupar pines cuando hay miles. Explota al hacer zoom.
  state.cluster = L.markerClusterGroup({
    maxClusterRadius: 50,
    chunkedLoading: true,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false
  });
  map.addLayer(state.cluster);

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
/* ---------- marker rendering (Fresha-style pins) ---------- */
function pinIcon(b) {
  const color = colorFor(b.category);
  const classes = ['rb-pin'];
  if (b.reviewStatus === 'approved') classes.push('is-approved');
  if (b.notionPageId) classes.push('is-notion');
  if (b.reviewStatus === 'approved' && b.detailsFetched && b.notionPageId && (b.formatted_phone_number || b.international_phone_number)) classes.push('is-done');
  if (b.leadStatus === 'contacted') classes.push('is-contacted');
  if (b.leadStatus === 'responded') classes.push('is-responded');
  if (b.leadStatus === 'customer') classes.push('is-customer');
  return L.divIcon({
    className: 'rb-pin-wrap',
    html: `<div class="${classes.join(' ')}" style="--pin-color:${color}"><span class="rb-pin-dot"></span></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  });
}

function addMarker(b) {
  if (!b.lat || !b.lng) return;
  if (state.markers[b.place_id]) { updateMarkerForBusiness(b); return; }
  const m = L.marker([b.lat, b.lng], { icon: pinIcon(b) });
  m.on('click', () => openSingleReview(b.place_id));
  state.markers[b.place_id] = m;
  if (state.cluster) state.cluster.addLayer(m); else m.addTo(map);
}

function updateMarkerForBusiness(b) {
  const m = state.markers[b.place_id];
  if (!m) return;
  m.setIcon(pinIcon(b));
}

function removeMarker(placeId) {
  const m = state.markers[placeId];
  if (!m) return;
  if (state.cluster) state.cluster.removeLayer(m); else map.removeLayer(m);
  delete state.markers[placeId];
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
  const ratingMin = Number(document.getElementById('filter-rating')?.value || 0);
  const reviewsMin = state.reviewsMin || 0;

  let list = Object.values(state.businesses).filter(b => {
    if (cat && b.category !== cat) return false;
    if (loc && b.localidad !== loc) return false;
    if (txt && !(b.name || '').toLowerCase().includes(txt)) return false;
    if (state.hideClosed && b.business_status && b.business_status !== 'OPERATIONAL') return false;
    if (state.withPhoneOnly && !(b.formatted_phone_number || b.international_phone_number)) return false;
    if (state.topOnly) {
      const r = b.rating || 0, n = b.user_ratings_total || 0;
      if (r < 4 || n < 30) return false;
    }
    if (ratingMin > 0 && (b.rating || 0) < ratingMin) return false;
    if (reviewsMin > 0 && (b.user_ratings_total || 0) < reviewsMin) return false;
    if (state.activeCluster) {
      const cluster = CATEGORY_CLUSTERS.find(c => c.id === state.activeCluster);
      if (cluster && !cluster.types.includes(b.category)) return false;
    }
    if (state.activeType && b.category !== state.activeType) return false;
    return true;
  });

  if (state.activeFilter === 'approved') list = list.filter(b => b.reviewStatus === 'approved');
  else if (state.activeFilter === 'notion') list = list.filter(b => b.notionPageId);
  return list;
}

/* composite score: rating × log10(reviews+1). Prioriza calidad + volumen */
function compositeScore(b) {
  const r = b.rating || 0;
  const n = b.user_ratings_total || 0;
  return r * Math.log10(n + 1);
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
  // leadStatus wins si está set
  if (b.leadStatus && LEAD_LABELS[b.leadStatus]) {
    const L = LEAD_LABELS[b.leadStatus];
    const rel = b.lastContactAt ? ` · hace ${relTime(b.lastContactAt)}` : '';
    return `<span class="pill ${L.cls}">${L.emoji} ${L.label}${rel}</span>`;
  }
  if (b.reviewStatus === 'approved' && b.detailsFetched && b.notionPageId && hasPhone) return '<span class="pill done">En Notion con teléfono</span>';
  if (b.reviewStatus === 'approved' && b.detailsFetched && b.notionPageId) return '<span class="pill nophone">En Notion sin teléfono</span>';
  if (b.reviewStatus === 'approved' && b.detailsFetched && !hasPhone) return '<span class="pill nophone">Sin teléfono · no enviado</span>';
  if (b.reviewStatus === 'approved' && b.notionPageId) return '<span class="pill approved">Verificado · en Notion (falta detalles)</span>';
  if (b.reviewStatus === 'approved') return '<span class="pill approved">Verificado · falta Notion</span>';
  return '<span class="pill pending">Sin verificar</span>';
}

/* ---------- phone + WhatsApp templates por cluster ---------- */
function waNumber(phone) {
  if (!phone) return null;
  let digits = String(phone).replace(/\D/g, '');
  if (!digits) return null;
  if (digits.length === 10) digits = '57' + digits;
  return digits;
}
function waLink(phone, template) {
  const num = waNumber(phone);
  if (!num) return null;
  const msg = encodeURIComponent(template || 'Hola');
  return `https://wa.me/${num}?text=${msg}`;
}
const WA_TEMPLATES = {
  beauty:  b => `Hola! Soy de ReserBox. Vi ${b.name} y quería contarte cómo peluquerías y spas de Bogotá están reduciendo no-shows y llenando horarios muertos con nuestro sistema de agendamiento online. ¿Tenés 2 min para ver una demo rápida?`,
  health:  b => `Hola! Te escribo de ReserBox. ${b.name} me parece el tipo de consultorio donde nuestro sistema de citas online puede ahorrarte muchas horas de llamadas y confirmaciones. ¿Podemos coordinar 10 min esta semana para mostrártelo?`,
  fitness: b => `Hola! Soy de ReserBox. Trabajamos con gimnasios y estudios de entrenamiento para manejar reservas de clases, pases y seguimiento de clientes desde un solo lugar. ¿Te muestro cómo funciona en ${b.name}?`,
  pro:     b => `Hola! Soy de ReserBox. Vi ${b.name} y me imagino que recibís muchas solicitudes por WhatsApp. Nuestro sistema automatiza agenda, confirmaciones y recordatorios. ¿Tenés 5 min esta semana?`,
  pets:    b => `Hola! Te escribo de ReserBox. Ayudamos a veterinarias a organizar turnos, historias clínicas básicas y recordatorios automáticos a los dueños de las mascotas. ¿Te interesa ver cómo podría funcionar en ${b.name}?`,
  other:   b => `Hola! Soy de ReserBox. Vi ${b.name} y creo que nuestro sistema de reservas online puede ahorrarte tiempo. ¿Tenés un rato para una demo rápida?`
};
function waTemplate(b) {
  const clusterId = clusterOfType(b.category);
  const fn = WA_TEMPLATES[clusterId] || WA_TEMPLATES.other;
  return fn(b);
}

/* ---------- lead status + time helpers ---------- */
const LEAD_LABELS = {
  contacted: { label: 'Contactado', emoji: '📞', cls: 'lead-contacted' },
  responded: { label: 'Respondió', emoji: '💬', cls: 'lead-responded' },
  customer:  { label: 'Cliente',   emoji: '⭐', cls: 'lead-customer' }
};
function relTime(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'recién';
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} h`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days} d`;
  const months = Math.floor(days / 30);
  return `${months} mes${months > 1 ? 'es' : ''}`;
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
      ${phoneShown ? `
        <a class="btn-wa" href="${waLink(phoneShown, waTemplate(b))}" target="_blank" rel="noopener" data-wa-click="${b.place_id}" title="WhatsApp con template de tu cluster">WhatsApp</a>
        <button class="btn-copy" data-copy-phone="${escapeHtml(phoneShown)}" title="Copiar teléfono">Copiar tel</button>
      ` : ''}
      <button class="btn-note ${b.note ? 'has-note' : ''}" data-note="${b.place_id}" title="${b.note ? 'Editar nota' : 'Agregar nota'}">${b.note ? 'Nota ✎' : 'Nota +'}</button>
      <select class="lead-select" data-lead="${b.place_id}" title="Cambiar estado del lead">
        <option value="">· Estado ·</option>
        <option value="contacted" ${b.leadStatus === 'contacted' ? 'selected' : ''}>📞 Contactado</option>
        <option value="responded" ${b.leadStatus === 'responded' ? 'selected' : ''}>💬 Respondió</option>
        <option value="customer" ${b.leadStatus === 'customer' ? 'selected' : ''}>⭐ Cliente</option>
        <option value="pending">↺ Resetear</option>
      </select>
      ${opts.quickAcceptDup ? `<button class="quick-ok" data-accept-dup="${b.place_id}" title="No es duplicado">✓</button>` : ''}
      ${opts.quickDelete ? `<button class="quick-del" data-del="${b.place_id}" title="Eliminar">✗</button>` : ''}
    </div>
    ${b.note ? `<div class="bnote">${escapeHtml(b.note)}</div>` : ''}
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
  const list = filteredBusinesses().sort((a, b) => compositeScore(b) - compositeScore(a));
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

  // hero + steps + chips always refresh alongside list
  renderHero();
  renderSteps();
  renderClusterChips();
}

/* ---------- cluster chips row (sidebar) ---------- */
function renderClusterChips() {
  const el = document.getElementById('cluster-chips');
  const typeEl = document.getElementById('type-chips');
  if (!el) return;
  const all = Object.values(state.businesses);
  const countByCluster = {};
  const countByType = {};
  for (const c of CATEGORY_CLUSTERS) {
    countByCluster[c.id] = all.filter(b => c.types.includes(b.category)).length;
    for (const t of c.types) countByType[t] = all.filter(b => b.category === t).length;
  }
  const allCount = all.length;
  el.innerHTML = `
    <button class="cluster-chip ${state.activeCluster === null && !state.activeType ? 'active' : ''}" data-cluster="">Todas <span class="count">${allCount}</span></button>
    ${CATEGORY_CLUSTERS.map(c => `
      <button class="cluster-chip ${state.activeCluster === c.id ? 'active' : ''}" data-cluster="${c.id}">
        ${c.label} <span class="count">${countByCluster[c.id]}</span>
      </button>
    `).join('')}
  `;

  // Sub-chips: si hay cluster activo, mostrar types dentro. Si no hay cluster pero hay activeType, mostrar su cluster.
  if (!typeEl) return;
  let showTypes = null;
  if (state.activeCluster) {
    showTypes = CATEGORY_CLUSTERS.find(c => c.id === state.activeCluster)?.types || null;
  } else if (state.activeType) {
    const c = CATEGORY_CLUSTERS.find(c => c.types.includes(state.activeType));
    showTypes = c?.types || null;
  }
  if (!showTypes) { typeEl.innerHTML = ''; typeEl.classList.add('hidden'); return; }
  typeEl.classList.remove('hidden');
  typeEl.innerHTML = showTypes.map(t => `
    <button class="cluster-chip sub ${state.activeType === t ? 'active' : ''}" data-type="${t}">
      ${typeLabel(t)} <span class="count">${countByType[t] || 0}</span>
    </button>
  `).join('');
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
    hero.classList.remove('accent');
    hero.innerHTML = `
      <div class="hero-head">
        <div class="hero-icon accent-bg">${ICONS.party}</div>
        <div class="hero-text">
          <div class="hero-title">Todo al día</div>
          <div class="hero-sub">${all.length} locales procesados. Probá otra localidad o filtrá por categoría para seguir prospectando.</div>
        </div>
      </div>
      <div class="hero-actions">
        <button class="primary" data-hero="search-builder">${ICONS.search} Armar búsqueda</button>
      </div>`;
    return;
  }

  // 5. Empty state — first search
  hero.classList.add('accent');
  hero.innerHTML = `
    <div class="hero-head">
      <div class="hero-icon">${ICONS.sparkle}</div>
      <div class="hero-text">
        <div class="hero-title">Arrancá tu primera búsqueda</div>
        <div class="hero-sub">Elegí una localidad, qué categorías buscar (ej. solo barberías) y ves el costo estimado antes de correr.</div>
      </div>
    </div>
    <div class="hero-actions">
      <button class="primary" data-hero="search-builder">${ICONS.search} Armar búsqueda</button>
    </div>`;
}

/* ---------- budget / queue UI ---------- */
function refreshBudget() {
  const b = state.budget;
  const pill = document.getElementById('b-state-pill');
  const stateEl = document.getElementById('b-state');
  const pctEl = document.getElementById('b-pct');
  const toggleBtn = document.getElementById('btn-toggle-budget');
  const cost = Number(b.cost || 0);
  const free = Number(b.freeCredit || 200);
  const pct = free > 0 ? Math.round((cost / free) * 100) : 0;
  if (stateEl) stateEl.textContent = b.stopped ? `BLOQUEADA · $${cost.toFixed(2)}` : `$${cost.toFixed(2)} / $${free}`;
  if (pctEl) pctEl.textContent = b.stopped ? '' : ` · ${pct}%`;
  if (pill) {
    pill.classList.toggle('stopped', !!b.stopped);
    pill.classList.toggle('warn', !b.stopped && pct >= 80);
  }
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
  renderClusterChips();
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
        if (state.markers[d.business.place_id]) updateMarkerForBusiness(d.business);
        else addMarker(d.business);
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
          updateMarkerForBusiness(state.businesses[d.placeId]);
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
        removeMarker(d.placeId);
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
    if (action === 'search-builder' || action === 'search-more' || action === 'start') {
      openSearchModal();
    } else if (action === 'stop') {
      await fetch('/api/search/stop', { method: 'POST' });
      setStatus('idle', 'Detención pedida...');
    } else if (action === 'review') {
      startReview();
    } else if (action === 'enrich') {
      triggerEnrich();
    }
  });

  // cluster chips
  const chipsEl = document.getElementById('cluster-chips');
  if (chipsEl) chipsEl.addEventListener('click', e => {
    const b = e.target.closest('[data-cluster]');
    if (!b) return;
    const v = b.dataset.cluster || null;
    if (!v) { state.activeCluster = null; state.activeType = null; }
    else {
      state.activeCluster = state.activeCluster === v ? null : v;
      state.activeType = null; // al cambiar cluster se limpia type
    }
    refreshList();
  });

  // type chips (sub-row)
  const typeEl = document.getElementById('type-chips');
  if (typeEl) typeEl.addEventListener('click', e => {
    const b = e.target.closest('[data-type]');
    if (!b) return;
    const t = b.dataset.type;
    state.activeType = state.activeType === t ? null : t;
    refreshList();
  });

  // quick toggles
  document.getElementById('flt-top')?.addEventListener('change', e => { state.topOnly = e.target.checked; refreshList(); });
  document.getElementById('flt-phone')?.addEventListener('change', e => { state.withPhoneOnly = e.target.checked; refreshList(); });
  document.getElementById('flt-hideclosed')?.addEventListener('change', e => { state.hideClosed = e.target.checked; refreshList(); });

  // rating slider con label live
  const rating = document.getElementById('filter-rating');
  const ratingVal = document.getElementById('filter-rating-val');
  if (rating) {
    const paintRating = () => {
      const v = parseFloat(rating.value);
      ratingVal.textContent = v > 0 ? `★ ${v.toFixed(1)}+` : 'Cualquiera';
      state.ratingMin = v;
      // fill track visually
      const pct = (v / 5) * 100;
      rating.style.background = `linear-gradient(90deg, var(--primary) 0%, var(--primary) ${pct}%, var(--border) ${pct}%, var(--border) 100%)`;
    };
    rating.addEventListener('input', () => { paintRating(); refreshList(); });
    paintRating();
  }

  // reviews chips (presets)
  const revRow = document.getElementById('reviews-chips');
  if (revRow) revRow.addEventListener('click', e => {
    const b = e.target.closest('[data-reviews]');
    if (!b) return;
    state.reviewsMin = Number(b.dataset.reviews) || 0;
    revRow.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c === b));
    refreshList();
  });

  // budget pill → open settings (donde está el botón bloquear/desbloquear)
  document.getElementById('b-state-pill')?.addEventListener('click', () => {
    document.getElementById('settings-modal').classList.remove('hidden');
  });

  // note modal wiring
  document.getElementById('note-cancel').addEventListener('click', closeNoteModal);
  document.getElementById('note-save').addEventListener('click', () => {
    saveNote(document.getElementById('note-textarea').value.trim());
  });
  document.getElementById('note-delete').addEventListener('click', async () => {
    if (!(await confirmDialog('¿Borrar la nota?', { title: 'Borrar nota', okText: 'Borrar', danger: true }))) return;
    saveNote('');
  });
  document.getElementById('note-textarea').addEventListener('keydown', e => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) saveNote(e.target.value.trim());
  });

  // search modal
  document.getElementById('search-close').addEventListener('click', closeSearchModal);
  document.getElementById('sb-cancel').addEventListener('click', closeSearchModal);
  document.getElementById('sb-start').addEventListener('click', submitSearchBuilder);
  document.getElementById('sb-all').addEventListener('click', () => { state.sb.types = new Set(allPlaceTypes()); renderSearchBuilder(); });
  document.getElementById('sb-none').addEventListener('click', () => { state.sb.types = new Set(); renderSearchBuilder(); });
  document.getElementById('sb-localidad').addEventListener('change', e => { state.sb.localidad = e.target.value; debouncedPreview(); });
  document.querySelectorAll('input[name="sb-preset"]').forEach(r => r.addEventListener('change', e => {
    state.sb.preset = e.target.value; debouncedPreview();
  }));

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
    if (!document.getElementById('search-modal').classList.contains('hidden') && e.key === 'Escape') {
      closeSearchModal();
    }
    if (!document.getElementById('note-modal').classList.contains('hidden') && e.key === 'Escape') {
      closeNoteModal();
    }
  });

  // filter inputs
  for (const id of ['filter-category', 'filter-localidad', 'filter-text']) {
    document.getElementById(id).addEventListener('input', refreshList);
  }

  // lead-status select change (delegated)
  document.getElementById('business-list').addEventListener('change', async e => {
    const sel = e.target.closest('.lead-select');
    if (!sel) return;
    const id = sel.dataset.lead;
    const status = sel.value || '';
    const r = await fetch(`/api/business/${id}/lead-status`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: status || null })
    });
    if (!r.ok) { toast('Error guardando estado', 'err', 3000); return; }
    const d = await r.json();
    if (state.businesses[id]) {
      state.businesses[id].leadStatus = d.leadStatus || undefined;
      state.businesses[id].lastContactAt = d.lastContactAt || state.businesses[id].lastContactAt;
      updateMarkerForBusiness(state.businesses[id]);
    }
    refreshList();
    const label = status && LEAD_LABELS[status] ? LEAD_LABELS[status].label : 'Reset';
    toast(`Estado: ${label}`, 'ok', 1500);
  });

  // list delegated actions
  document.getElementById('business-list').addEventListener('click', async e => {
    const t = e.target;
    if (t.dataset.del) { e.stopPropagation(); await quickReject(t.dataset.del); return; }
    if (t.dataset.acceptGroup) { e.stopPropagation(); await acceptDuplicateGroup(t.dataset.acceptGroup.split(',')); return; }
    if (t.dataset.copyPhone) {
      e.stopPropagation();
      try { await navigator.clipboard.writeText(t.dataset.copyPhone); toast('Teléfono copiado', 'ok', 1200); }
      catch { toast('No pude copiar (permisos)', 'err', 2500); }
      return;
    }
    if (t.dataset.note) {
      e.stopPropagation();
      openNoteModal(t.dataset.note);
      return;
    }
    if (t.dataset.waClick) {
      // No preventDefault: dejar que abra wa.me. Solo marcar contactado si no hay estado aún.
      const id = t.dataset.waClick;
      const b = state.businesses[id];
      if (b && !b.leadStatus) {
        // disparamos POST async, no bloquea click nativo
        fetch(`/api/business/${id}/lead-status`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'contacted' })
        }).then(r => r.ok ? r.json() : null).then(d => {
          if (d && state.businesses[id]) {
            state.businesses[id].leadStatus = 'contacted';
            state.businesses[id].lastContactAt = d.lastContactAt;
            updateMarkerForBusiness(state.businesses[id]);
            refreshList();
          }
        });
      }
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

/* ---------- note modal ---------- */
let noteEditingId = null;
function openNoteModal(placeId) {
  const b = state.businesses[placeId];
  if (!b) return;
  noteEditingId = placeId;
  document.getElementById('note-title').textContent = `Nota · ${b.name}`;
  document.getElementById('note-textarea').value = b.note || '';
  document.getElementById('note-meta').textContent = b.noteUpdatedAt
    ? `Última edición: ${new Date(b.noteUpdatedAt).toLocaleString('es-CO')}`
    : 'Nueva nota — solo visible en esta app, no se sincroniza a Notion';
  document.getElementById('note-delete').style.display = b.note ? '' : 'none';
  document.getElementById('note-modal').classList.remove('hidden');
  setTimeout(() => document.getElementById('note-textarea').focus(), 50);
}
function closeNoteModal() {
  noteEditingId = null;
  document.getElementById('note-modal').classList.add('hidden');
}
async function saveNote(noteValue) {
  if (!noteEditingId) return;
  const id = noteEditingId;
  const r = await fetch(`/api/business/${id}/note`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ note: noteValue || null })
  });
  if (!r.ok) { toast('Error guardando nota', 'err', 3000); return; }
  const d = await r.json();
  if (state.businesses[id]) {
    if (d.note) { state.businesses[id].note = d.note; state.businesses[id].noteUpdatedAt = d.updatedAt; }
    else { delete state.businesses[id].note; delete state.businesses[id].noteUpdatedAt; }
  }
  closeNoteModal();
  refreshList();
  toast(noteValue ? 'Nota guardada' : 'Nota borrada', 'ok', 1500);
}

/* ---------- search builder modal ---------- */
function allPlaceTypes() {
  return CATEGORY_CLUSTERS.flatMap(c => c.types);
}

function openSearchModal() {
  // Preload localidades into modal select
  const sel = document.getElementById('sb-localidad');
  const geo = state.localidadesGeo;
  if (geo && sel.children.length === 0) {
    for (const f of geo.features) {
      const n = f.properties.nombre;
      const opt = document.createElement('option');
      opt.value = n; opt.textContent = n;
      sel.appendChild(opt);
    }
  }
  // Default: first localidad without status 'done', else first
  if (!state.sb.localidad) {
    const unfinished = (geo?.features || []).find(f => state.progress[f.properties.nombre]?.status !== 'done');
    state.sb.localidad = unfinished?.properties.nombre || geo?.features[0]?.properties.nombre || null;
  }
  sel.value = state.sb.localidad || '';

  // Default: preset 'economy', no types selected (means all by default)
  document.querySelector(`input[name="sb-preset"][value="${state.sb.preset}"]`).checked = true;

  renderSearchBuilder();
  document.getElementById('search-modal').classList.remove('hidden');
  debouncedPreview();
}

function closeSearchModal() {
  document.getElementById('search-modal').classList.add('hidden');
}

function renderSearchBuilder() {
  const host = document.getElementById('sb-clusters');
  const selected = state.sb.types;
  host.innerHTML = CATEGORY_CLUSTERS.map(c => {
    const allOn = c.types.every(t => selected.has(t));
    const anyOn = c.types.some(t => selected.has(t));
    return `
      <div class="sb-cluster">
        <div class="sb-cluster-head">
          <div class="sb-cluster-label">${c.label}</div>
          <button type="button" class="sb-cluster-all ${allOn ? 'all-on' : ''}" data-cluster-toggle="${c.id}">${allOn ? 'Quitar todos' : (anyOn ? 'Marcar todos' : 'Todos')}</button>
        </div>
        <div class="sb-cluster-types">
          ${c.types.map(t => `
            <button type="button" class="sb-type ${selected.has(t) ? 'active' : ''}" data-type="${t}">${typeLabel(t)}</button>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');

  // Wire per-chip clicks (rebind after innerHTML)
  host.querySelectorAll('[data-type]').forEach(btn => {
    btn.addEventListener('click', () => {
      const t = btn.dataset.type;
      if (selected.has(t)) selected.delete(t); else selected.add(t);
      renderSearchBuilder();
      debouncedPreview();
    });
  });
  host.querySelectorAll('[data-cluster-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const cluster = CATEGORY_CLUSTERS.find(c => c.id === btn.dataset.clusterToggle);
      const allOn = cluster.types.every(t => selected.has(t));
      if (allOn) cluster.types.forEach(t => selected.delete(t));
      else cluster.types.forEach(t => selected.add(t));
      renderSearchBuilder();
      debouncedPreview();
    });
  });
}

let previewTimer;
function debouncedPreview() {
  clearTimeout(previewTimer);
  previewTimer = setTimeout(fetchPreview, 250);
}

async function fetchPreview() {
  const host = document.getElementById('sb-preview');
  const localidad = state.sb.localidad || document.getElementById('sb-localidad').value;
  if (!localidad) { host.innerHTML = '<div class="sb-preview-loading">Elegí una localidad</div>'; return; }
  host.innerHTML = '<div class="sb-preview-loading">Calculando...</div>';
  const types = Array.from(state.sb.types);
  try {
    const r = await fetch('/api/search/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ localidad, types, mode: state.sb.preset })
    });
    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || 'HTTP ' + r.status);
    const d = await r.json();
    const rangeTxt = d.nearbyMax > d.nearbyTypical ? `entre $${d.costTypical.toFixed(2)} y $${d.costMax.toFixed(2)}` : `$${d.costTypical.toFixed(2)}`;
    const willOverBudget = d.currentCost + d.costMax > d.freeCredit * 0.95;
    const typeLabels = d.selectedTypes.length === 0
      ? `Todas las categorías (${d.categoriesCount})`
      : d.selectedTypes.map(typeLabel).join(', ');
    host.innerHTML = `
      <div class="sb-preview-row big">
        <span>Costo estimado</span>
        <b>$${d.costTypical.toFixed(2)}</b>
      </div>
      <div class="sb-preview-range">Rango: ${rangeTxt} USD · peor caso ${d.nearbyMax} requests</div>
      <div class="sb-preview-hr"></div>
      <div class="sb-preview-row"><span class="muted">Localidad</span><b>${escapeHtml(d.localidad)}</b></div>
      <div class="sb-preview-row"><span class="muted">Puntos del grid</span><b>${d.gridPending} pendientes${d.gridDone ? ` (${d.gridDone} ya hechos)` : ''}</b></div>
      <div class="sb-preview-row"><span class="muted">Categorías</span><b>${escapeHtml(typeLabels)}</b></div>
      <div class="sb-preview-row"><span class="muted">Requests estimados</span><b>${d.nearbyTypical}</b></div>
      <div class="sb-preview-hr"></div>
      <div class="sb-preview-row"><span class="muted">Gastado este mes</span><span>$${d.currentCost.toFixed(2)} / $${d.freeCredit}</span></div>
      <div class="sb-preview-row"><span class="muted">Crédito disponible</span><b>$${d.remaining.toFixed(2)}</b></div>
      ${willOverBudget ? '<div class="sb-preview-warn">Atención: este pedido puede llevarte cerca del 95% del crédito. La app se detendrá sola si pasa.</div>' : ''}
    `;
    document.getElementById('sb-start').disabled = d.gridPending === 0 || d.stopped;
  } catch (e) {
    host.innerHTML = `<div class="sb-preview-warn">${escapeHtml(e.message)}</div>`;
  }
}

async function submitSearchBuilder() {
  const localidad = state.sb.localidad;
  if (!localidad) return toast('Elegí una localidad', 'warn', 2500);
  const types = Array.from(state.sb.types);
  // Guardar preset en settings antes de iniciar (searchLocalidad lee de settings.searchMode)
  await fetch('/api/settings', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ searchMode: state.sb.preset })
  });
  const r = await fetch('/api/search/start', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ localidad, types: types.length ? types : undefined })
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) return toast(data.error || 'Error', 'err', 5000);
  state.searching = true;
  state.currentLocalidad = localidad;
  setStatus('running', `Iniciando ${localidad}...`);
  closeSearchModal();
  renderHero();
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
  if (state.businesses[placeId]) {
    state.businesses[placeId].reviewStatus = 'approved';
    updateMarkerForBusiness(state.businesses[placeId]);
  }
  refreshList();
  toast('Aprobado', 'ok', 1500);
};

async function quickReject(placeId) {
  await fetch(`/api/business/${placeId}`, { method: 'DELETE' });
  removeMarker(placeId);
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
  removeMarker(placeId);
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
    if (state.businesses[id]) {
      state.businesses[id].reviewStatus = 'approved';
      updateMarkerForBusiness(state.businesses[id]);
    }
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
