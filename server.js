const express = require('express');
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const axios = require('axios');
const crypto = require('crypto');

const ENV_PATH = path.join(__dirname, '.env');
const ALLOW_ENV_WRITE = process.env.ALLOW_ENV_WRITE !== 'false';
if (ALLOW_ENV_WRITE) {
  try {
    if (!fs.existsSync(ENV_PATH)) fs.writeFileSync(ENV_PATH, '');
  } catch { /* read-only FS (Railway build) — ignore */ }
}
try { require('dotenv').config({ path: ENV_PATH }); } catch {}

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const SEED_DIR = path.join(__dirname, 'data-seed');
try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch {}
// First boot on persistent volume: seed from committed snapshot if missing.
if (fs.existsSync(SEED_DIR)) {
  for (const f of fs.readdirSync(SEED_DIR)) {
    const dest = path.join(DATA_DIR, f);
    if (!fs.existsSync(dest)) {
      try { fs.copyFileSync(path.join(SEED_DIR, f), dest); }
      catch (e) { console.error('seed copy failed', f, e.message); }
    }
  }
}
const BUSINESSES_PATH = path.join(DATA_DIR, 'businesses.json');
const PROGRESS_PATH = path.join(DATA_DIR, 'progress.json');
const BUDGET_PATH = path.join(DATA_DIR, 'budget.json');
const LOCALIDADES_PATH = path.join(DATA_DIR, 'bogota-localidades.geojson');

const COST_NEARBY = 32 / 1000;   // USD per request
const COST_DETAILS = 17 / 1000;
const FREE_CREDIT = 200;
const WARN_THRESHOLD = 0.80;
const STOP_THRESHOLD = 0.95;

const MAX_PAGES = 3;
const RATE_LIMIT_MS = 200;

const SEARCH_PRESETS = {
  economy:    { step: 1000, radius: 700, useKeywords: false,  maxPages: 1 },
  balanced:   { step: 800,  radius: 600, useKeywords: 'core', maxPages: 2 },
  complete:   { step: 600,  radius: 500, useKeywords: true,   maxPages: 3 }
};
const CORE_KEYWORDS = [
  'psicólogo','nutricionista','pilates','yoga','terapeuta',
  'entrenador personal','medicina estética','ortodoncia','acupuntura','optómetra'
];

const PLACE_TYPES = [
  'hair_salon','beauty_salon','barber','spa','nail_salon',
  'doctor','clinic','dentist','physiotherapist',
  'gym','lawyer','veterinary_care','photographer','tattoo_parlor'
];

const NAME_BLACKLIST = [
  // comida
  'pollo','polleria','pollería','asadero','rostipollo','broaster',
  'panaderia','panadería','pasteleria','pastelería','reposteria','repostería',
  'restaurante','pizzeria','pizzería','hamburg','parrilla','asados','comidas',
  'café','cafeteria','cafetería','heladeria','heladería','fruteria','frutería','fruver','jugos',
  'verdulería','verduleria','carnicería','carniceria',
  // retail varios
  'supermercado','mini market','minimarket','mercado','autoservicio',
  'tienda','abarrotes','ferreteria','ferretería','papeleria','papelería',
  'muebles','mueblería','muebleria','colchón','colchones','colchonería','colchoneria',
  'electrodomésticos','electrodomesticos','repuestos','taller',
  'celulares','tecnología','tecnologia','computadores',
  'ropa','zapatos','calzado','textiles','almacén','almacen',
  'ferretero','plomería','plomeria','eléctricos','electricos',
  'lavanderia','lavandería','tintoreria','tintorería',
  // servicios no appointment
  'parqueadero','parking','lavadero de carros','car wash','montallantas','servitecas',
  'hotel','hostal','motel','residencias','posada',
  'licorera','cigarreria','cigarrería','estanco','licores',
  'iglesia','parroquia','ministerio','templo',
  'banco','cajero','bancolombia','davivienda','bbva','bancoomeva','colpatria',
  'droguería','drogueria','farmacia',
  'hospital universitario','hospital militar','hospital san','clínica general','clinica general',
  // genéricos
  'gasolineria','gasolinería','estación de servicio','estacion de servicio',
  'notaría','notaria','juzgado','secretaría','secretaria de',
  'colegio','universidad','escuela','jardín infantil','jardin infantil',
  // entretenimiento
  'parque','teatro','theater','theatre','cine','cinema','cinecolombia','cineco','cinepolis','cinépolis','procinal','royal films',
  'mall','centro comercial','c.c.','shopping',
  // marcas retail / productos
  'nike','adidas','puma','reebok','levis','zara','h&m','pull and bear','bershka','forever 21','mango',
  'tennis','arturo calle','studio f','chevignon','americanino','patprimo','falabella','éxito','exito','olimpica','olímpica',
  'decathlon','decathon','colsubsidio','cafam','colmena','cruz roja','cruz verde',
  'homecenter','easy','makro','pricesmart','alkosto','ktronix','jumbo','metro','carulla','ara',
  // salud EPS / aseguradoras
  'compensar','sanitas','sura','coomeva','famisanar','salud total','nueva eps','capital salud','colsanitas','medimas',
  // transporte
  'transmilenio','sitp','estación transmilenio','estacion transmilenio','terminal',
  // libros / biblioteca
  'librería','libreria','library','biblioteca',
  // petroleras / estatales
  'ecopetrol','terpel','mobil','petrobras','esso','shell','primax',
  // policía / estatal
  'police','policía','policia','cai ','fiscalía','fiscalia','ejército','ejercito','alcaldía','alcaldia','gobernación','gobernacion'
];
const SPAM_TYPES = new Set([
  'restaurant','food','meal_takeaway','meal_delivery','cafe','bakery','bar','night_club',
  'supermarket','grocery_or_supermarket','convenience_store','liquor_store',
  'lodging','parking','gas_station','car_wash','car_repair','car_dealer',
  'bank','atm','church','post_office','school','university','primary_school','secondary_school',
  'furniture_store','home_goods_store','clothing_store','shoe_store','electronics_store',
  'hardware_store','book_store','department_store','jewelry_store',
  'movie_theater','shopping_mall','library','park','amusement_park','tourist_attraction',
  'police','fire_station','local_government_office','city_hall','courthouse','embassy',
  'transit_station','bus_station','train_station','subway_station','taxi_stand'
]);
const NAME_BLACKLIST_RE = new RegExp(
  '(?:^|[^a-záéíóúñ])(?:' +
  NAME_BLACKLIST.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') +
  ')(?:[^a-záéíóúñ]|$)',
  'i'
);
function isSpam(place) {
  const name = (place.name || '').trim();
  if (name.length < 3) return true;                    // 1-2 chars basura
  if (/^[\d\s.\-+]+$/.test(name)) return true;         // solo números/simbolos
  if (NAME_BLACKLIST_RE.test(name)) return true;
  const types = place.types || [];
  if (types.some(t => SPAM_TYPES.has(t))) return true;
  return false;
}

const KEYWORD_QUERIES = [
  // Especialidades médicas — español
  'dermatólogo','cardiólogo','ginecólogo','pediatra','oftalmólogo',
  'neurólogo','psiquiatra','endocrinólogo','urólogo','ortopedista','gastroenterólogo',
  // Especialidades médicas — inglés
  'dermatologist','cardiologist','gynecologist','pediatrician','ophthalmologist',
  'neurologist','psychiatrist','endocrinologist','urologist','orthopedist','gastroenterologist',
  // Salud mental y terapias — español
  'psicólogo','terapeuta','fonoaudiólogo','terapeuta ocupacional','nutricionista','quiropráctico',
  // Salud mental — inglés
  'psychologist','therapist','speech therapist','nutritionist','chiropractor',
  // Estética médica — español
  'medicina estética','cirugía estética','depilación láser','microblading','micropigmentación','botox','rellenos',
  // Estética — inglés
  'aesthetic medicine','plastic surgery','laser hair removal','fillers',
  // Odontología especializada
  'ortodoncia','implantes dentales','endodoncia',
  'orthodontics','dental implants','endodontics',
  // Bienestar alternativo
  'acupuntura','masajes terapéuticos','pilates','yoga',
  'acupuncture','therapeutic massage',
  // Otros con citas
  'optómetra','entrenador personal','sesiones de fotos',
  'optometrist','personal trainer','photography session'
];

// ---------- persistence helpers ----------
function readJson(p, fallback) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return fallback; }
}
async function writeJson(p, data) {
  const tmp = p + '.tmp';
  await fsp.writeFile(tmp, JSON.stringify(data, null, 2));
  await fsp.rename(tmp, p);
}

const BLACKLIST_PATH = path.join(DATA_DIR, 'blacklist.json');
let businesses = readJson(BUSINESSES_PATH, {}); // keyed by place_id
let progress = readJson(PROGRESS_PATH, {});     // { [localidadId]: "pending"|"in_progress"|"done", searchedPoints: {...} }
let budget = readJson(BUDGET_PATH, { nearby: 0, details: 0, stopped: false, lastWarn: 0, baseCost: 0, baseAt: null });
if (typeof budget.baseCost !== 'number') budget.baseCost = 0;
if (!('baseAt' in budget)) budget.baseAt = null;
let blacklist = readJson(BLACKLIST_PATH, { placeIds: [] });
if (!Array.isArray(blacklist.placeIds)) blacklist.placeIds = [];
const blacklistSet = new Set(blacklist.placeIds);
const localidadesGeo = readJson(LOCALIDADES_PATH, { features: [] });

function saveBusinesses() { return writeJson(BUSINESSES_PATH, businesses); }
function saveProgress()   { return writeJson(PROGRESS_PATH, progress); }
function saveBudget()     { return writeJson(BUDGET_PATH, budget); }
function saveBlacklist()  { return writeJson(BLACKLIST_PATH, { placeIds: Array.from(blacklistSet) }); }

// ---------- geo helpers ----------
function pointInPolygon(lng, lat, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    const intersect = ((yi > lat) !== (yj > lat)) &&
      (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function localidadForPoint(lat, lng) {
  for (const f of localidadesGeo.features) {
    const coords = f.geometry.coordinates[0];
    if (pointInPolygon(lng, lat, coords)) return f.properties.nombre;
  }
  // fallback: nearest centroid
  let best = null, bestD = Infinity;
  for (const f of localidadesGeo.features) {
    const c = featureCentroid(f);
    const d = (c[1]-lat)**2 + (c[0]-lng)**2;
    if (d < bestD) { bestD = d; best = f.properties.nombre; }
  }
  return best;
}

function featureCentroid(feature) {
  const coords = feature.geometry.coordinates[0];
  let sx = 0, sy = 0;
  for (const [x, y] of coords) { sx += x; sy += y; }
  return [sx / coords.length, sy / coords.length];
}

function featureBbox(feature) {
  const coords = feature.geometry.coordinates[0];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [x, y] of coords) {
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
  return { minX, minY, maxX, maxY };
}

function buildGrid(feature, stepMeters) {
  const bbox = featureBbox(feature);
  const latStep = stepMeters / 111320;
  const avgLat = (bbox.minY + bbox.maxY) / 2;
  const lngStep = stepMeters / (111320 * Math.cos(avgLat * Math.PI / 180));
  const poly = feature.geometry.coordinates[0];
  const points = [];
  for (let lat = bbox.minY; lat <= bbox.maxY; lat += latStep) {
    for (let lng = bbox.minX; lng <= bbox.maxX; lng += lngStep) {
      if (pointInPolygon(lng, lat, poly)) points.push({ lat, lng });
    }
  }
  return points;
}

// ---------- budget ----------
function currentCost() {
  return +((budget.baseCost || 0) + budget.nearby * COST_NEARBY + budget.details * COST_DETAILS).toFixed(4);
}
function budgetStatus() {
  const cost = currentCost();
  const pct = cost / FREE_CREDIT;
  return {
    nearby: budget.nearby,
    details: budget.details,
    cost,
    baseCost: budget.baseCost || 0,
    baseAt: budget.baseAt || null,
    freeCredit: FREE_CREDIT,
    pctUsed: +(pct * 100).toFixed(2),
    stopped: budget.stopped,
    warn: pct >= WARN_THRESHOLD && pct < STOP_THRESHOLD,
    shouldStop: pct >= STOP_THRESHOLD
  };
}
function checkBudget() {
  const s = budgetStatus();
  if (s.shouldStop && !budget.stopped) {
    budget.stopped = true;
    saveBudget();
    searchState.running = false;
    broadcast({ type: 'stopped', reason: 'budget', status: s });
  } else if (s.warn && !budget.lastWarn) {
    budget.lastWarn = Date.now();
    saveBudget();
    broadcast({ type: 'warn', status: s });
  }
  return s;
}

// ---------- places API ----------
async function placesNearby({ lat, lng, type, keyword, pagetoken, radius = 700 }) {
  if (budget.stopped) throw new Error('budget_stopped');
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
  const params = pagetoken
    ? { pagetoken, key }
    : { location: `${lat},${lng}`, radius, key };
  if (type && !pagetoken) params.type = type;
  if (keyword && !pagetoken) params.keyword = keyword;
  const { data } = await axios.get(url, { params });
  budget.nearby++;
  saveBudget();
  if (data.status === 'OVER_QUERY_LIMIT' || data.status === 'REQUEST_DENIED') {
    budget.stopped = true;
    saveBudget();
    throw new Error('api_' + data.status);
  }
  return data;
}

async function placeDetails(placeId) {
  if (budget.stopped) throw new Error('budget_stopped');
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const url = 'https://maps.googleapis.com/maps/api/place/details/json';
  const fields = [
    'name','place_id','formatted_address','formatted_phone_number',
    'international_phone_number','website','url','rating','user_ratings_total',
    'opening_hours','current_opening_hours','types','geometry','business_status',
    'reviews','editorial_summary','photos','price_level'
  ].join(',');
  const { data } = await axios.get(url, { params: { place_id: placeId, fields, key } });
  budget.details++;
  saveBudget();
  if (data.status === 'OVER_QUERY_LIMIT' || data.status === 'REQUEST_DENIED') {
    budget.stopped = true;
    saveBudget();
    throw new Error('api_' + data.status);
  }
  return data.result || null;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ---------- SSE ----------
const sseClients = new Set();
function broadcast(obj) {
  const line = `data: ${JSON.stringify(obj)}\n\n`;
  for (const res of sseClients) {
    try { res.write(line); } catch {}
  }
}

// ---------- notion auto-export queue ----------
const SETTINGS_PATH = path.join(DATA_DIR, 'settings.json');
let settings = readJson(SETTINGS_PATH, { autoNotion: true, searchMode: 'economy', minimalNotion: true });
function saveSettings() { return writeJson(SETTINGS_PATH, settings); }

const notionQueue = [];
let notionWorkerRunning = false;

function enqueueNotion(placeId) {
  if (!settings.autoNotion) return;
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) return;
  const b = businesses[placeId];
  if (!b || b.notionPageId || b._notionQueued) return;
  b._notionQueued = true;
  notionQueue.push(placeId);
  broadcast({ type: 'notion_queue', size: notionQueue.length });
  if (!notionWorkerRunning) runNotionWorker();
}

async function runNotionWorker() {
  notionWorkerRunning = true;
  while (notionQueue.length) {
    const placeId = notionQueue.shift();
    const b = businesses[placeId];
    if (!b || b.notionPageId) continue;
    try {
      const pageId = await exportToNotion(b);
      b.notionPageId = pageId;
      delete b._notionQueued;
      await saveBusinesses();
      broadcast({ type: 'notion_exported', placeId, pageId });
    } catch (e) {
      delete b._notionQueued;
      const msg = e.response?.data?.message || e.message;
      if (!msg.includes('archived')) {
        broadcast({ type: 'notion_error', placeId, message: msg });
      }
    }
    broadcast({ type: 'notion_queue', size: notionQueue.length });
    await sleep(350);
  }
  notionWorkerRunning = false;
}

// ---------- search engine ----------
const searchState = { running: false, cancel: false, currentLocalidad: null };

function primaryTypeFor(place) {
  const t = (place.types || []).find(x => PLACE_TYPES.includes(x));
  return t || (place.types && place.types[0]) || 'other';
}

function normalizeBusiness(p, sourceCategory) {
  const loc = p.geometry && p.geometry.location;
  const lat = loc && loc.lat, lng = loc && loc.lng;
  return {
    place_id: p.place_id,
    name: p.name,
    formatted_address: p.formatted_address || p.vicinity || '',
    formatted_phone_number: p.formatted_phone_number || null,
    international_phone_number: p.international_phone_number || null,
    website: p.website || null,
    url: p.url || `https://www.google.com/maps/place/?q=place_id:${p.place_id}`,
    rating: p.rating ?? null,
    user_ratings_total: p.user_ratings_total ?? 0,
    opening_hours: p.opening_hours || null,
    types: p.types || [],
    business_status: p.business_status || null,
    lat, lng,
    category: sourceCategory,
    localidad: (lat && lng) ? localidadForPoint(lat, lng) : null,
    foundAt: new Date().toISOString(),
    detailsFetched: !!p.url,
    notionPageId: null
  };
}

async function searchLocalidad(localidadName, opts = {}) {
  const feature = localidadesGeo.features.find(f => f.properties.nombre === localidadName);
  if (!feature) throw new Error('localidad_not_found');

  searchState.running = true;
  searchState.cancel = false;
  searchState.currentLocalidad = localidadName;
  progress[localidadName] = progress[localidadName] || { status: 'in_progress', searchedPoints: {} };
  progress[localidadName].status = 'in_progress';
  await saveProgress();
  broadcast({ type: 'search_start', localidad: localidadName });

  const preset = SEARCH_PRESETS[settings.searchMode] || SEARCH_PRESETS.economy;
  const grid = buildGrid(feature, preset.step);
  broadcast({ type: 'grid', localidad: localidadName, points: grid.length, mode: settings.searchMode });

  // Selección de types: si el cliente manda lista, usar eso (filtrada a types válidos).
  // Si manda array vacío o no lo manda, usar todos los defaults.
  const selectedTypes = Array.isArray(opts.types) && opts.types.length
    ? opts.types.filter(t => PLACE_TYPES.includes(t))
    : PLACE_TYPES;

  let keywordsToUse = [];
  // Si el usuario filtró a types específicos, saltamos keywords (búsqueda enfocada).
  const userFiltered = Array.isArray(opts.types) && opts.types.length > 0;
  if (!userFiltered) {
    if (preset.useKeywords === true) keywordsToUse = KEYWORD_QUERIES;
    else if (preset.useKeywords === 'core') keywordsToUse = CORE_KEYWORDS;
  }

  const categories = [
    ...selectedTypes.map(t => ({ kind: 'type', value: t })),
    ...keywordsToUse.map(k => ({ kind: 'keyword', value: k }))
  ];

  for (let i = 0; i < grid.length; i++) {
    if (searchState.cancel || budget.stopped) break;
    const pt = grid[i];
    const key = `${pt.lat.toFixed(4)},${pt.lng.toFixed(4)}`;
    if (progress[localidadName].searchedPoints[key]) continue;

    for (const cat of categories) {
      if (searchState.cancel || budget.stopped) break;
      try {
        let pagetoken = null;
        for (let page = 0; page < preset.maxPages; page++) {
          if (searchState.cancel || budget.stopped) break;
          const params = { lat: pt.lat, lng: pt.lng, radius: preset.radius };
          if (cat.kind === 'type') params.type = cat.value;
          else params.keyword = cat.value;
          if (pagetoken) { params.pagetoken = pagetoken; await sleep(2000); }
          const data = await placesNearby(params);
          const results = data.results || [];
          for (const r of results) {
            if (!r.place_id || businesses[r.place_id]) continue;
            if (blacklistSet.has(r.place_id)) continue;
            if (isSpam(r)) continue;
            businesses[r.place_id] = normalizeBusiness(r, cat.value);
            broadcast({ type: 'business', business: businesses[r.place_id] });
            // NO auto-Notion. Solo aprobados van a Notion (ver /approve).
          }
          await saveBusinesses();
          const bs = checkBudget();
          broadcast({ type: 'budget', status: bs });
          if (!data.next_page_token) break;
          pagetoken = data.next_page_token;
          await sleep(RATE_LIMIT_MS);
        }
      } catch (e) {
        broadcast({ type: 'error', message: e.message, category: cat.value });
        if (e.message === 'budget_stopped' || e.message.startsWith('api_')) {
          searchState.cancel = true; break;
        }
      }
      await sleep(RATE_LIMIT_MS);
    }

    progress[localidadName].searchedPoints[key] = true;
    await saveProgress();
    broadcast({
      type: 'progress',
      localidad: localidadName,
      done: Object.keys(progress[localidadName].searchedPoints).length,
      total: grid.length
    });
  }

  if (!searchState.cancel && !budget.stopped) {
    progress[localidadName].status = 'done';
  } else {
    progress[localidadName].status = 'in_progress';
  }
  await saveProgress();
  searchState.running = false;
  searchState.currentLocalidad = null;
  broadcast({ type: 'search_end', localidad: localidadName, status: progress[localidadName].status });
}

// ---------- notion ----------
async function notionRequest(method, path, body) {
  const token = process.env.NOTION_TOKEN;
  return axios({
    method,
    url: `https://api.notion.com/v1${path}`,
    headers: {
      Authorization: `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
    data: body
  });
}

function businessToNotionProps(b) {
  const trim = s => (s || '').toString().slice(0, 2000);
  const props = {
    'Nombre': { title: [{ text: { content: trim(b.name) || 'Sin nombre' } }] },
    'Categoría': { select: { name: trim(b.category).slice(0, 100) || 'otros' } },
    'Maps URL': b.url ? { url: b.url } : { url: null },
    'Teléfono': b.formatted_phone_number ? { phone_number: b.formatted_phone_number } : { phone_number: null },
    'Website': b.website ? { url: b.website } : { url: null },
    'Localidad': b.localidad ? { select: { name: b.localidad } } : { select: null },
    'Estado': { select: { name: 'Pendiente contacto' } },
    'Fecha encontrado': { date: { start: (b.foundAt || new Date().toISOString()).slice(0, 10) } }
  };
  if (!settings.minimalNotion) {
    props['Dirección'] = { rich_text: [{ text: { content: trim(b.formatted_address) } }] };
    props['Calificación'] = { number: b.rating ?? null };
    props['Reseñas'] = { number: b.user_ratings_total ?? 0 };
    props['Notas'] = { rich_text: [{ text: { content: '' } }] };
  }
  return props;
}

async function exportToNotion(b) {
  const dbId = process.env.NOTION_DATABASE_ID;
  const res = await notionRequest('POST', '/pages', {
    parent: { database_id: dbId },
    properties: businessToNotionProps(b)
  });
  return res.data.id;
}

async function updateNotionPage(b) {
  if (!b.notionPageId) return;
  try {
    await notionRequest('PATCH', `/pages/${b.notionPageId}`, {
      properties: businessToNotionProps(b)
    });
  } catch (e) {
    const msg = e.response?.data?.message || '';
    if (msg.includes('archived')) {
      b.notionPageId = null;
      await saveBusinesses();
      return;
    }
    throw e;
  }
}

// ---------- env write ----------
function writeEnv(obj) {
  for (const [k, v] of Object.entries(obj)) process.env[k] = v;
  if (!ALLOW_ENV_WRITE) return; // Railway: config via dashboard env vars
  try {
    const lines = Object.entries(obj).map(([k, v]) => `${k}=${v}`);
    fs.writeFileSync(ENV_PATH, lines.join('\n') + '\n');
  } catch (e) { console.error('writeEnv failed:', e.message); }
}

async function validateGoogleKey(key) {
  try {
    const { data } = await axios.get('https://maps.googleapis.com/maps/api/place/findplacefromtext/json', {
      params: { input: 'Bogotá', inputtype: 'textquery', key }
    });
    if (data.status === 'OK' || data.status === 'ZERO_RESULTS') return { ok: true };
    return { ok: false, error: `Google respondió: ${data.status} ${data.error_message || ''}` };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}
async function validateNotion(token, dbId) {
  try {
    const res = await axios.get(`https://api.notion.com/v1/databases/${dbId}`, {
      headers: { Authorization: `Bearer ${token}`, 'Notion-Version': '2022-06-28' }
    });
    return { ok: true, title: res.data.title?.[0]?.plain_text || 'Sin título' };
  } catch (e) {
    return { ok: false, error: e.response?.data?.message || e.message };
  }
}

// ---------- express ----------
const app = express();
app.set('trust proxy', 1);

// Health endpoint (no auth) — for Railway healthcheck / uptime monitors.
app.get('/healthz', (req, res) => {
  res.json({ ok: true, ts: Date.now(), businesses: Object.keys(businesses).length });
});

// ---------- auth (login page + signed session cookie) ----------
const ACCESS_PASSWORD = process.env.ACCESS_PASSWORD || '';
const SESSION_COOKIE = 'rb_session';
const SESSION_TTL_MS = 30 * 24 * 3600 * 1000;
const SESSION_SECRET = process.env.SESSION_SECRET ||
  crypto.createHash('sha256').update('rb:' + (ACCESS_PASSWORD || 'dev')).digest('hex');

function signSession(ts) {
  return crypto.createHmac('sha256', SESSION_SECRET).update(String(ts)).digest('hex');
}
function makeToken() {
  const ts = Date.now();
  return `${ts}.${signSession(ts)}`;
}
function verifyToken(token) {
  if (!token || typeof token !== 'string') return false;
  const dot = token.indexOf('.');
  if (dot < 0) return false;
  const ts = Number(token.slice(0, dot));
  const sig = token.slice(dot + 1);
  if (!Number.isFinite(ts) || Date.now() - ts > SESSION_TTL_MS) return false;
  const expected = signSession(ts);
  const a = Buffer.from(sig), b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
function parseCookies(req) {
  const out = {};
  const hdr = req.headers.cookie;
  if (!hdr) return out;
  for (const part of hdr.split(';')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}
function setSessionCookie(req, res) {
  const secure = req.secure || req.headers['x-forwarded-proto'] === 'https';
  const token = makeToken();
  res.set('Set-Cookie',
    `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_MS / 1000}` +
    (secure ? '; Secure' : ''));
}
function clearSessionCookie(res) {
  res.set('Set-Cookie', `${SESSION_COOKIE}=; Path=/; HttpOnly; Max-Age=0`);
}

const LOGIN_HTML = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ReserBox Mapper — Ingresar</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap">
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; height: 100%; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #faf9f7; color: #1a1a1a; -webkit-font-smoothing: antialiased; }
  .wrap { min-height: 100%; display: flex; align-items: center; justify-content: center; padding: 24px; }
  .card { background: #ffffff; padding: 40px 36px; border-radius: 20px; width: 100%; max-width: 400px; box-shadow: 0 20px 50px rgba(17,24,39,.10); border: 1px solid #e7e5e0; }
  .brand { display: flex; align-items: center; gap: 12px; margin-bottom: 28px; }
  .logo { width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, #ff385c, #ff6b8a); display: grid; place-items: center; font-weight: 800; color: white; font-size: 18px; box-shadow: 0 4px 14px rgba(255,56,92,.35); }
  h1 { margin: 0; font-size: 18px; font-weight: 700; letter-spacing: -.01em; }
  .sub { margin: 2px 0 0; font-size: 13px; color: #6b6b6b; }
  label { display: block; margin-bottom: 8px; font-size: 13px; color: #1a1a1a; font-weight: 500; }
  input { width: 100%; padding: 12px 14px; background: #fff; border: 1px solid #e7e5e0; color: #1a1a1a; border-radius: 10px; font-size: 14px; outline: none; transition: border-color .15s, box-shadow .15s; font-family: inherit; }
  input:focus { border-color: #ff385c; box-shadow: 0 0 0 3px #ffe4ea; }
  button { width: 100%; margin-top: 18px; padding: 13px; background: #ff385c; color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; transition: background .15s; font-family: inherit; }
  button:hover:not(:disabled) { background: #e11d48; }
  button:disabled { opacity: .5; cursor: not-allowed; }
  .msg { margin-top: 14px; font-size: 13px; min-height: 18px; text-align: center; font-weight: 500; }
  .msg.err { color: #dc2626; }
</style>
</head>
<body>
  <div class="wrap">
    <form class="card" id="f">
      <div class="brand">
        <div class="logo">R</div>
        <div>
          <h1>ReserBox Mapper</h1>
          <p class="sub">Acceso restringido</p>
        </div>
      </div>
      <label for="pw">Contraseña</label>
      <input type="password" id="pw" autofocus autocomplete="current-password" required />
      <button type="submit" id="btn">Ingresar</button>
      <div class="msg" id="msg"></div>
    </form>
  </div>
<script>
  const f = document.getElementById('f');
  const btn = document.getElementById('btn');
  const msg = document.getElementById('msg');
  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    btn.disabled = true; msg.textContent = ''; msg.className = 'msg';
    try {
      const r = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: document.getElementById('pw').value })
      });
      if (r.ok) {
        const params = new URLSearchParams(location.search);
        location.href = params.get('next') || '/';
        return;
      }
      const d = await r.json().catch(() => ({}));
      msg.textContent = d.error || 'Clave incorrecta';
      msg.className = 'msg err';
      btn.disabled = false;
    } catch (err) {
      msg.textContent = 'Error de red';
      msg.className = 'msg err';
      btn.disabled = false;
    }
  });
</script>
</body>
</html>`;

app.use(express.json({ limit: '100mb' }));

app.get('/login', (req, res) => {
  if (!ACCESS_PASSWORD) return res.redirect('/');
  const token = parseCookies(req)[SESSION_COOKIE];
  if (verifyToken(token)) return res.redirect('/');
  res.type('html').send(LOGIN_HTML);
});

app.post('/api/login', (req, res) => {
  const { password } = req.body || {};
  if (!ACCESS_PASSWORD) return res.json({ ok: true });
  if (typeof password !== 'string' || !password) return res.status(400).json({ error: 'Falta contraseña' });
  const pBuf = Buffer.from(password);
  const exp = Buffer.from(ACCESS_PASSWORD);
  const ok = pBuf.length === exp.length && crypto.timingSafeEqual(pBuf, exp);
  if (!ok) return res.status(401).json({ error: 'Clave incorrecta' });
  setSessionCookie(req, res);
  res.json({ ok: true });
});

app.post('/api/logout', (req, res) => {
  clearSessionCookie(res);
  res.json({ ok: true });
});

function requireAuth(req, res, next) {
  if (!ACCESS_PASSWORD) return next();
  const token = parseCookies(req)[SESSION_COOKIE];
  if (verifyToken(token)) return next();
  if (req.path.startsWith('/api/')) return res.status(401).json({ error: 'Sesión requerida' });
  const next_ = encodeURIComponent(req.originalUrl || '/');
  res.redirect(`/login?next=${next_}`);
}
app.use(requireAuth);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/config/status', (req, res) => {
  res.json({
    googleSet: !!process.env.GOOGLE_PLACES_API_KEY,
    notionSet: !!process.env.NOTION_TOKEN && !!process.env.NOTION_DATABASE_ID,
    autoNotion: settings.autoNotion,
    notionQueueSize: notionQueue.length
  });
});

app.get('/api/config/maps-key', (req, res) => {
  res.json({ key: process.env.GOOGLE_PLACES_API_KEY });
});

app.post('/api/settings', async (req, res) => {
  if (typeof req.body.autoNotion === 'boolean') settings.autoNotion = req.body.autoNotion;
  if (typeof req.body.minimalNotion === 'boolean') settings.minimalNotion = req.body.minimalNotion;
  if (req.body.searchMode && SEARCH_PRESETS[req.body.searchMode]) settings.searchMode = req.body.searchMode;
  await saveSettings();
  res.json(settings);
});

app.get('/api/settings', (req, res) => res.json({ ...settings, presets: SEARCH_PRESETS }));

app.get('/api/stats', (req, res) => {
  const all = Object.values(businesses);
  res.json({
    total: all.length,
    approved: all.filter(b => b.reviewStatus === 'approved').length,
    reviewed: all.filter(b => b.reviewStatus).length,
    pending: all.filter(b => !b.reviewStatus).length,
    inNotion: all.filter(b => b.notionPageId).length,
    withPhone: all.filter(b => b.formatted_phone_number).length
  });
});

app.post('/api/notion/nuke-db', async (req, res) => {
  const dbId = process.env.NOTION_DATABASE_ID;
  const all = [];
  let cursor = null;
  try {
    while (true) {
      const body = { page_size: 100 };
      if (cursor) body.start_cursor = cursor;
      const r = await notionRequest('POST', `/databases/${dbId}/query`, body);
      for (const p of r.data.results) all.push(p.id);
      if (!r.data.has_more) break;
      cursor = r.data.next_cursor;
    }
  } catch (e) {
    return res.status(500).json({ error: e.response?.data?.message || e.message });
  }
  res.json({ ok: true, count: all.length });
  broadcast({ type: 'purge_start', total: all.length });

  const CONCURRENCY = 20;
  let i = 0, done = 0, ok = 0, fail = 0;
  async function worker() {
    while (i < all.length) {
      const idx = i++;
      const pageId = all[idx];
      try {
        await notionRequest('PATCH', `/pages/${pageId}`, { archived: true });
        ok++;
      } catch (e) {
        const msg = e.response?.data?.message || e.message;
        if (msg.includes('archived')) ok++; else fail++;
      }
      done++;
      if (done % 10 === 0) broadcast({ type: 'purge_progress', current: done, total: all.length, name: '' });
    }
  }
  (async () => {
    await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
    for (const b of Object.values(businesses)) b.notionPageId = null;
    await saveBusinesses();
    broadcast({ type: 'purge_end', ok, fail });
  })();
});

app.post('/api/notion/purge-all', async (req, res) => {
  const list = Object.values(businesses).filter(b => b.notionPageId);
  res.json({ ok: true, count: list.length });
  (async () => {
    let ok = 0, fail = 0;
    for (let i = 0; i < list.length; i++) {
      const b = list[i];
      broadcast({ type: 'purge_progress', current: i + 1, total: list.length, name: b.name });
      try {
        await notionRequest('PATCH', `/pages/${b.notionPageId}`, { archived: true });
        b.notionPageId = null;
        ok++;
      } catch (e) {
        const msg = e.response?.data?.message || e.message;
        if (msg.includes('archived')) { b.notionPageId = null; ok++; } else { fail++; }
      }
      await sleep(350);
    }
    await saveBusinesses();
    broadcast({ type: 'purge_end', ok, fail });
  })();
});

app.post('/api/notion/purge-unapproved', async (req, res) => {
  const list = Object.values(businesses).filter(b => b.notionPageId && b.reviewStatus !== 'approved');
  res.json({ ok: true, count: list.length });
  (async () => {
    let ok = 0, fail = 0;
    for (let i = 0; i < list.length; i++) {
      const b = list[i];
      broadcast({ type: 'purge_progress', current: i + 1, total: list.length, name: b.name });
      try {
        await notionRequest('PATCH', `/pages/${b.notionPageId}`, { archived: true });
        b.notionPageId = null;
        ok++;
      } catch (e) {
        const msg = e.response?.data?.message || e.message;
        if (msg.includes('archived')) { b.notionPageId = null; ok++; } else { fail++; }
      }
      await sleep(350);
    }
    await saveBusinesses();
    broadcast({ type: 'purge_end', ok, fail });
  })();
});

app.delete('/api/business/:placeId', async (req, res) => {
  const id = req.params.placeId;
  const b = businesses[id];
  if (!b) return res.status(404).json({ error: 'No existe' });
  if (b.notionPageId) {
    try { await notionRequest('PATCH', `/pages/${b.notionPageId}`, { archived: true }); }
    catch (e) { /* ignora — ya archivado o sin acceso */ }
  }
  delete businesses[id];
  blacklistSet.add(id);
  await Promise.all([saveBusinesses(), saveBlacklist()]);
  broadcast({ type: 'business_removed', placeId: id });
  res.json({ ok: true });
});

app.post('/api/business/:placeId/approve', async (req, res) => {
  const b = businesses[req.params.placeId];
  if (!b) return res.status(404).json({ error: 'No existe' });
  b.reviewStatus = 'approved';
  await saveBusinesses();
  broadcast({ type: 'business', business: b });
  res.json({ ok: true });
});

app.post('/api/business/:placeId/accept-duplicate', async (req, res) => {
  const b = businesses[req.params.placeId];
  if (!b) return res.status(404).json({ error: 'No existe' });
  b.notDuplicate = true;
  await saveBusinesses();
  broadcast({ type: 'business', business: b });
  res.json({ ok: true });
});

// Persist private note per business (no se sincroniza a Notion).
app.post('/api/business/:placeId/note', async (req, res) => {
  const b = businesses[req.params.placeId];
  if (!b) return res.status(404).json({ error: 'No existe' });
  const { note } = req.body || {};
  if (typeof note !== 'string' && note !== null) return res.status(400).json({ error: 'note inválido' });
  if (!note) {
    delete b.note;
    delete b.noteUpdatedAt;
  } else {
    b.note = note.slice(0, 2000);
    b.noteUpdatedAt = new Date().toISOString();
  }
  await saveBusinesses();
  broadcast({ type: 'business', business: b });
  res.json({ ok: true, note: b.note || null, updatedAt: b.noteUpdatedAt || null });
});

app.post('/api/business/accept-duplicates-bulk', async (req, res) => {
  const { placeIds } = req.body || {};
  if (!Array.isArray(placeIds)) return res.status(400).json({ error: 'placeIds array requerido' });
  let n = 0;
  for (const id of placeIds) {
    const b = businesses[id];
    if (!b) continue;
    b.notDuplicate = true;
    broadcast({ type: 'business', business: b });
    n++;
  }
  await saveBusinesses();
  res.json({ ok: true, updated: n });
});

let enrichRunning = false;
app.post('/api/enrich/approved', async (req, res) => {
  if (enrichRunning) return res.status(409).json({ error: 'Ya en curso' });
  const pending = Object.values(businesses).filter(b =>
    b.reviewStatus === 'approved' && (!b.detailsFetched || !b.notionPageId)
  );
  if (!pending.length) return res.json({ ok: true, count: 0 });
  const needDetailsCount = pending.filter(b => !b.detailsFetched).length;
  if (budget.stopped && needDetailsCount > 0) {
    return res.status(402).json({ error: `Presupuesto bloqueado. ${needDetailsCount} aprobados necesitan Details (teléfono/web). Desbloqueá primero.` });
  }
  enrichRunning = true;
  const needDetails = pending.filter(b => !b.detailsFetched).length;
  res.json({ ok: true, count: pending.length, needDetails, cost: +(needDetails * COST_DETAILS).toFixed(2) });
  broadcast({ type: 'enrich_start', total: pending.length, needDetails });

  (async () => {
    let okN = 0, failN = 0;
    for (let i = 0; i < pending.length; i++) {
      const b = pending[i];
      broadcast({ type: 'enrich_progress', current: i + 1, total: pending.length, name: b.name });
      if (!b.detailsFetched && !budget.stopped) {
        try {
          const d = await placeDetails(b.place_id);
          if (d) {
            Object.assign(b, {
              formatted_phone_number: d.formatted_phone_number || b.formatted_phone_number,
              international_phone_number: d.international_phone_number || b.international_phone_number,
              website: d.website || b.website,
              url: d.url || b.url,
              opening_hours: d.opening_hours || b.opening_hours,
              detailsFetched: true
            });
            await saveBusinesses();
            broadcast({ type: 'business', business: b });
            broadcast({ type: 'budget', status: budgetStatus() });
          }
        } catch (e) {
          broadcast({ type: 'error', message: 'Details falló: ' + e.message });
          if (e.message === 'budget_stopped' || e.message.startsWith('api_')) break;
        }
        await sleep(RATE_LIMIT_MS);
      }
      const hasPhoneNow = !!(b.formatted_phone_number || b.international_phone_number);
      try {
        if (b.notionPageId) {
          await updateNotionPage(b);
          okN++;
        } else if (hasPhoneNow) {
          const pageId = await exportToNotion(b);
          b.notionPageId = pageId;
          await saveBusinesses();
          broadcast({ type: 'business', business: b });
          okN++;
        }
        // Sin teléfono y sin Notion: saltar. Queda en sección "segunda verificación".
      } catch (e) {
        const msg = e.response?.data?.message || e.message;
        failN++;
        broadcast({ type: 'notion_error', placeId: b.place_id, message: msg });
      }
      await sleep(350);
    }
    enrichRunning = false;
    broadcast({ type: 'enrich_end', ok: okN, fail: failN });
  })();
});

let cleanupRunning = false;
app.post('/api/cleanup/spam', async (req, res) => {
  if (cleanupRunning) return res.status(409).json({ error: 'Limpieza ya en curso' });
  const toDelete = [];
  for (const [id, b] of Object.entries(businesses)) {
    if (isSpam({ name: b.name, types: b.types })) toDelete.push(id);
  }
  cleanupRunning = true;
  res.json({ ok: true, count: toDelete.length });
  broadcast({ type: 'cleanup_start', total: toDelete.length });
  (async () => {
    let ok = 0, fail = 0;
    for (let i = 0; i < toDelete.length; i++) {
      const id = toDelete[i];
      const b = businesses[id];
      if (!b) continue;
      broadcast({ type: 'cleanup_progress', current: i + 1, total: toDelete.length, name: b.name, placeId: id });
      if (b.notionPageId) {
        try {
          await notionRequest('PATCH', `/pages/${b.notionPageId}`, { archived: true });
          ok++;
        } catch (e) {
          const msg = e.response?.data?.message || e.message;
          if (msg.includes('archived')) { ok++; } else { fail++; broadcast({ type: 'notion_error', placeId: id, message: msg }); }
        }
        await sleep(350);
      }
      delete businesses[id];
      blacklistSet.add(id);
      broadcast({ type: 'business_removed', placeId: id });
    }
    await Promise.all([saveBusinesses(), saveBlacklist()]);
    cleanupRunning = false;
    broadcast({ type: 'cleanup_end', deleted: toDelete.length, notionArchived: ok, notionFailed: fail });
  })();
});

app.post('/api/config/validate', async (req, res) => {
  const { google, notionToken, notionDb } = req.body;
  const results = {};
  if (google) results.google = await validateGoogleKey(google);
  if (notionToken && notionDb) results.notion = await validateNotion(notionToken, notionDb);
  res.json(results);
});

app.post('/api/config/save', async (req, res) => {
  const { google, notionToken, notionDb } = req.body;
  if (!google) return res.status(400).json({ error: 'Falta Google Places API key' });
  if (!notionToken || !notionDb) return res.status(400).json({ error: 'Falta Notion token o database id' });
  const g = await validateGoogleKey(google);
  if (!g.ok) return res.status(400).json({ error: 'Google: ' + g.error });
  const n = await validateNotion(notionToken, notionDb);
  if (!n.ok) return res.status(400).json({ error: 'Notion: ' + n.error });
  writeEnv({
    GOOGLE_PLACES_API_KEY: google,
    NOTION_TOKEN: notionToken,
    NOTION_DATABASE_ID: notionDb,
    PORT: process.env.PORT || 3000
  });
  res.json({ ok: true, notion: n });
});

app.get('/api/localidades', (req, res) => res.json(localidadesGeo));

app.get('/api/progress', (req, res) => res.json(progress));

app.get('/api/businesses', (req, res) => res.json(Object.values(businesses)));

app.get('/api/budget', (req, res) => res.json(budgetStatus()));

app.post('/api/budget/reset', async (req, res) => {
  budget = { nearby: 0, details: 0, stopped: false, lastWarn: 0, baseCost: 0, baseAt: null };
  await saveBudget();
  res.json(budgetStatus());
});

app.post('/api/budget/sync', async (req, res) => {
  const { googleCost } = req.body;
  const n = Number(googleCost);
  if (!Number.isFinite(n) || n < 0) return res.status(400).json({ error: 'googleCost inválido' });
  budget.baseCost = +n.toFixed(4);
  budget.baseAt = new Date().toISOString();
  budget.nearby = 0;
  budget.details = 0;
  await saveBudget();
  res.json(budgetStatus());
});

app.get('/api/blacklist', (req, res) => res.json({ count: blacklistSet.size, placeIds: Array.from(blacklistSet) }));

app.post('/api/blacklist/clear', async (req, res) => {
  blacklistSet.clear();
  await saveBlacklist();
  res.json({ ok: true, count: 0 });
});

app.post('/api/budget/unblock', async (req, res) => {
  budget.stopped = false;
  budget.lastWarn = 0;
  await saveBudget();
  res.json(budgetStatus());
});

app.post('/api/budget/block', async (req, res) => {
  budget.stopped = true;
  await saveBudget();
  searchState.cancel = true;
  res.json(budgetStatus());
});

app.post('/api/search/start', async (req, res) => {
  if (searchState.running) return res.status(409).json({ error: 'Búsqueda ya en curso', current: searchState.currentLocalidad });
  if (budget.stopped) return res.status(402).json({ error: 'Presupuesto detenido. Reseteá si querés continuar.' });
  if (!process.env.GOOGLE_PLACES_API_KEY) return res.status(400).json({ error: 'Sin Google API key' });
  const { localidad, types } = req.body;
  if (!localidad) return res.status(400).json({ error: 'Falta localidad' });
  res.json({ ok: true, localidad, types: Array.isArray(types) ? types : null });
  searchLocalidad(localidad, { types }).catch(e => broadcast({ type: 'error', message: e.message }));
});

// Preview / simulación de costo antes de correr. No gasta cuota Google.
app.post('/api/search/preview', (req, res) => {
  const { localidad, types, mode } = req.body || {};
  const feature = localidadesGeo.features.find(f => f.properties.nombre === localidad);
  if (!feature) return res.status(400).json({ error: 'Localidad no encontrada' });
  const presetKey = mode && SEARCH_PRESETS[mode] ? mode : (settings.searchMode || 'economy');
  const preset = SEARCH_PRESETS[presetKey];
  const grid = buildGrid(feature, preset.step);

  const userFiltered = Array.isArray(types) && types.length > 0;
  const selectedTypes = userFiltered ? types.filter(t => PLACE_TYPES.includes(t)) : PLACE_TYPES;
  let keywords = [];
  if (!userFiltered) {
    if (preset.useKeywords === true) keywords = KEYWORD_QUERIES;
    else if (preset.useKeywords === 'core') keywords = CORE_KEYWORDS;
  }
  const categoriesCount = selectedTypes.length + keywords.length;

  // Cuántos puntos ya están buscados → no se volverán a consultar
  const done = Object.keys(progress[localidad]?.searchedPoints || {}).length;
  const pending = Math.max(0, grid.length - done);

  // Cada punto × cada categoría = 1 Nearby request (página 1).
  // Para presets con maxPages > 1 asumimos factor 1.3 del peor caso (la 2da página no siempre existe).
  const nearbyMax = pending * categoriesCount * preset.maxPages;
  const nearbyTypical = preset.maxPages > 1
    ? Math.min(nearbyMax, Math.round(pending * categoriesCount * 1.3))
    : nearbyMax;
  const costTypical = +(nearbyTypical * COST_NEARBY).toFixed(2);
  const costMax = +(nearbyMax * COST_NEARBY).toFixed(2);

  const b = budgetStatus();
  res.json({
    localidad,
    preset: presetKey,
    gridTotal: grid.length,
    gridDone: done,
    gridPending: pending,
    selectedTypes,
    keywordCount: keywords.length,
    categoriesCount,
    nearbyTypical,
    nearbyMax,
    costTypical,
    costMax,
    currentCost: b.cost,
    remaining: +(b.freeCredit - b.cost).toFixed(2),
    freeCredit: b.freeCredit,
    stopped: b.stopped,
    costPerNearby: COST_NEARBY,
    costPerDetails: COST_DETAILS
  });
});

app.post('/api/search/stop', (req, res) => {
  searchState.cancel = true;
  res.json({ ok: true });
});

app.post('/api/progress/reset', async (req, res) => {
  const { localidad } = req.body;
  if (!localidad) return res.status(400).json({ error: 'Falta localidad' });
  delete progress[localidad];
  await saveProgress();
  broadcast({ type: 'progress_reset', localidad });
  res.json({ ok: true, localidad });
});

app.get('/api/search/state', (req, res) => {
  res.json({ running: searchState.running, currentLocalidad: searchState.currentLocalidad });
});

app.post('/api/details/:placeId', async (req, res) => {
  const id = req.params.placeId;
  const b = businesses[id];
  if (!b) return res.status(404).json({ error: 'No existe' });
  try {
    const d = await placeDetails(id);
    if (!d) return res.status(404).json({ error: 'Places no devolvió detalles' });
    businesses[id] = {
      ...b,
      formatted_address: d.formatted_address || b.formatted_address,
      formatted_phone_number: d.formatted_phone_number || b.formatted_phone_number,
      international_phone_number: d.international_phone_number || b.international_phone_number,
      website: d.website || b.website,
      url: d.url || b.url,
      opening_hours: d.opening_hours || b.opening_hours,
      rating: d.rating ?? b.rating,
      user_ratings_total: d.user_ratings_total ?? b.user_ratings_total,
      business_status: d.business_status || b.business_status,
      reviews: d.reviews || [],
      editorial_summary: d.editorial_summary?.overview || null,
      price_level: d.price_level ?? null,
      detailsFetched: true
    };
    await saveBusinesses();
    const bs = checkBudget();
    broadcast({ type: 'budget', status: bs });
    broadcast({ type: 'business', business: businesses[id] });
    if (businesses[id].notionPageId) {
      try { await updateNotionPage(businesses[id]); broadcast({ type: 'notion_updated', placeId: id }); }
      catch (e) { broadcast({ type: 'notion_error', placeId: id, message: e.response?.data?.message || e.message }); }
    }
    res.json(businesses[id]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/details/batch', async (req, res) => {
  const { placeIds } = req.body;
  if (!Array.isArray(placeIds)) return res.status(400).json({ error: 'placeIds requerido' });
  res.json({ ok: true, count: placeIds.length });
  (async () => {
    for (const id of placeIds) {
      if (budget.stopped) break;
      const b = businesses[id];
      if (!b || b.detailsFetched) continue;
      try {
        const d = await placeDetails(id);
        if (d) {
          businesses[id] = { ...b,
            formatted_phone_number: d.formatted_phone_number || b.formatted_phone_number,
            international_phone_number: d.international_phone_number || b.international_phone_number,
            website: d.website || b.website,
            url: d.url || b.url,
            opening_hours: d.opening_hours || b.opening_hours,
            detailsFetched: true
          };
          await saveBusinesses();
          broadcast({ type: 'business', business: businesses[id] });
          if (businesses[id].notionPageId) {
            try { await updateNotionPage(businesses[id]); broadcast({ type: 'notion_updated', placeId: id }); }
            catch (e) { broadcast({ type: 'notion_error', placeId: id, message: e.response?.data?.message || e.message }); }
          }
        }
      } catch (e) {
        broadcast({ type: 'error', message: e.message });
        if (e.message.startsWith('api_') || e.message === 'budget_stopped') break;
      }
      const bs = checkBudget();
      broadcast({ type: 'budget', status: bs });
      await sleep(RATE_LIMIT_MS);
    }
    broadcast({ type: 'details_batch_end' });
  })();
});

app.post('/api/notion/export/:placeId', async (req, res) => {
  const id = req.params.placeId;
  const b = businesses[id];
  if (!b) return res.status(404).json({ error: 'No existe' });
  if (!process.env.NOTION_TOKEN) return res.status(400).json({ error: 'Notion no configurado' });
  try {
    const pageId = await exportToNotion(b);
    b.notionPageId = pageId;
    await saveBusinesses();
    res.json({ ok: true, pageId });
  } catch (e) {
    res.status(500).json({ error: e.response?.data?.message || e.message });
  }
});

app.post('/api/notion/export-all', async (req, res) => {
  const pending = Object.values(businesses).filter(b => !b.notionPageId);
  res.json({ ok: true, total: pending.length });
  (async () => {
    let ok = 0, fail = 0;
    for (const b of pending) {
      try {
        const pageId = await exportToNotion(b);
        b.notionPageId = pageId;
        await saveBusinesses();
        ok++;
        broadcast({ type: 'notion_exported', placeId: b.place_id, pageId });
      } catch (e) {
        fail++;
        broadcast({ type: 'notion_error', placeId: b.place_id, message: e.response?.data?.message || e.message });
      }
      await sleep(350); // Notion ~3 req/s
    }
    broadcast({ type: 'notion_batch_end', ok, fail });
  })();
});

app.get('/api/stream', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no'
  });
  res.flushHeaders();
  res.write(`data: ${JSON.stringify({ type: 'hello' })}\n\n`);
  sseClients.add(res);
  req.on('close', () => sseClients.delete(res));
});

app.get('/api/admin/backup', (req, res) => {
  const payload = {
    exportedAt: new Date().toISOString(),
    version: 1,
    businesses,
    progress,
    budget,
    blacklist: { placeIds: Array.from(blacklistSet) },
    settings
  };
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  res.set('Content-Disposition', `attachment; filename="reserbox-backup-${stamp}.json"`);
  res.json(payload);
});

app.post('/api/admin/restore', async (req, res) => {
  const data = req.body;
  if (!data || typeof data !== 'object') return res.status(400).json({ error: 'JSON inválido' });
  const { mode = 'merge' } = req.query;
  try {
    if (data.businesses && typeof data.businesses === 'object') {
      businesses = mode === 'replace' ? data.businesses : { ...businesses, ...data.businesses };
    }
    if (data.progress && typeof data.progress === 'object') {
      progress = mode === 'replace' ? data.progress : { ...progress, ...data.progress };
    }
    if (data.budget && typeof data.budget === 'object') budget = { ...budget, ...data.budget };
    if (data.settings && typeof data.settings === 'object') settings = { ...settings, ...data.settings };
    if (data.blacklist?.placeIds && Array.isArray(data.blacklist.placeIds)) {
      if (mode === 'replace') blacklistSet.clear();
      for (const id of data.blacklist.placeIds) blacklistSet.add(id);
    }
    await Promise.all([saveBusinesses(), saveProgress(), saveBudget(), saveBlacklist(), saveSettings()]);
    broadcast({ type: 'restored', total: Object.keys(businesses).length });
    res.json({ ok: true, mode, total: Object.keys(businesses).length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;

// Production safety: refuse to start publicly-exposed without password.
const IS_PROD = process.env.NODE_ENV === 'production' || !!process.env.RAILWAY_ENVIRONMENT;
if (IS_PROD && !ACCESS_PASSWORD) {
  console.error('FATAL: producción detectada sin ACCESS_PASSWORD. Configurá la variable o la web queda pública.');
  process.exit(1);
}

// Listen with auto-fallback: if PORT is busy, try PORT+1..PORT+20 (dev convenience).
// In prod (Railway) don't fallback — PORT is injected and must bind.
function listenWithFallback(startPort, maxAttempts) {
  let attempt = 0;
  const tryListen = (port) => {
    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`ReserBox Mapper → http://localhost:${port}`);
      console.log(`DATA_DIR: ${DATA_DIR}`);
      console.log(`Locales cargados: ${Object.keys(businesses).length}`);
      if (port !== startPort) console.log(`ℹ  Puerto ${startPort} ocupado, usando ${port}`);
      if (!ACCESS_PASSWORD) console.warn('⚠  ACCESS_PASSWORD vacío → auth DESHABILITADA (modo dev).');
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE' && !IS_PROD && attempt < maxAttempts) {
        attempt++;
        tryListen(port + 1);
      } else {
        console.error(`FATAL: no pude bindear puerto: ${err.message}`);
        process.exit(1);
      }
    });
  };
  tryListen(startPort);
}

listenWithFallback(Number(PORT), 20);
