# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm install` — install deps
- `npm start` — run server (`node server.js`) on `PORT` or 3000
- `npm run dev` — run with `node --watch` (auto-restart on file change)

No test suite, no linter, no build step. The frontend is static — served directly from `public/` by Express.

## Architecture

Single-process Node/Express app. Everything runs in-memory and persists to JSON files on disk. No database. Frontend is vanilla HTML/CSS/JS loading Leaflet over OpenStreetMap.

### Layout

- `server.js` — entire backend in one file (~1300 lines): routes, search logic, Notion sync, auth, SSE, spam filter.
- `public/` — static frontend (`index.html`, `app.js`, `style.css`).
- `data/` — runtime JSON state (businesses, progress, budget, blacklist, settings). Gitignored in production path.
- `data-seed/` — committed snapshot. On first boot, `server.js` copies any missing file from `data-seed/` into `DATA_DIR` (seed-if-absent; never overwrites). Used to bootstrap a fresh Railway volume with ~5060 existing locales.

### Data flow for a search

1. Client POSTs `/api/search/start` with a localidad name.
2. `searchLocalidad()` reads the polygon from `bogota-localidades.geojson`, calls `buildGrid()` to generate points at `step` meter spacing (preset-dependent), then for each point hits Google `placesNearby` for each type in `PLACE_TYPES` (+ keywords depending on preset).
3. Each result is dedup'd by `place_id` in the in-memory `businesses` map, filtered through `isSpam()` (name blacklist + `NAME_BLACKLIST`), normalized via `normalizeBusiness()`, persisted, and pushed to all SSE clients via `broadcast()`.
4. Progress (which grid points done per localidad) persists to `progress.json` so restarts resume cleanly.
5. `checkBudget()` runs after every Google call. At 80% of `FREE_CREDIT` ($200) broadcasts a warning; at 95% sets `budget.stopped = true` which short-circuits subsequent requests.

### Search presets

`SEARCH_PRESETS` (economy / balanced / complete) control `step`, `radius`, `maxPages`, and whether keyword searches run alongside type searches. `CORE_KEYWORDS` is the reduced set used by `balanced`.

### Persistence model

Read JSON → mutate in-memory object → `writeJson()` (atomic: write to `.tmp` then rename). There are five stores: `businesses`, `progress`, `budget`, `blacklist` (a Set of dismissed place_ids), `settings`. Any new persisted state should follow the same pattern and the corresponding `save*()` helper.

### Notion sync

`exportToNotion()` maps a business to the exact property schema documented in `README.md` — do not add/rename properties without updating that mapping. Batch exports sleep 350ms between calls (~3 req/s, Notion's limit). `updateNotionPage()` is called after Place Details fetches so an already-exported page gets enriched. There is a `notionQueue` / `runNotionWorker()` pair for serialized background exports.

### Real-time updates

`/api/stream` is a Server-Sent Events endpoint. All state mutations call `broadcast({ type, ... })` so every connected client stays in sync. Event `type` values the frontend listens for: `business`, `budget`, `progress`, `progress_reset`, `notion_exported`, `notion_updated`, `notion_error`, `notion_batch_end`, `details_batch_end`, `restored`, `error`.

### Auth

Cookie session signed with HMAC-SHA256 using `ACCESS_PASSWORD`-derived `SESSION_SECRET`. Login at `/login` → POST `/api/login` sets `rb_session` cookie. `requireAuth` middleware guards everything except `/login`, `/api/login`, and `/healthz`. If `ACCESS_PASSWORD` is empty, auth is skipped (dev mode). **If `NODE_ENV=production` or `RAILWAY_ENVIRONMENT` is set and `ACCESS_PASSWORD` is empty, the server refuses to start** (`process.exit(1)`), to prevent accidental public exposure.

### Health check

`GET /healthz` — unauthenticated, returns `{ ok: true, ts, businesses: <count> }`. Use for Railway healthchecks / uptime monitors.

### Config / env

- Google + Notion keys: may be set via env vars OR persisted through `POST /api/config/save` (which writes `.env` only when `ALLOW_ENV_WRITE !== 'false'`). On Railway set `ALLOW_ENV_WRITE=false` because the filesystem is read-only outside the volume; use Railway dashboard env vars instead.
- `DATA_DIR` — override persistence location. Railway sets this to `/data` (mounted volume).
- On first boot `server.js` seeds missing files from `data-seed/` into `DATA_DIR`.

### Spam / blacklist

`NAME_BLACKLIST` (hardcoded array in `server.js`) filters out non-appointment businesses (food, retail, banks, schools, etc.) at normalization time. The runtime `blacklistSet` is a separate user-curated set of dismissed place_ids persisted to `blacklist.json`.

### Deploy

Railway via Nixpacks (see `railway.json`). Deploy flow and required env vars are documented in `README.md`. Backups: `GET /api/admin/backup` → `POST /api/admin/restore?mode=merge|replace`.

## Conventions

- Spanish is used throughout user-facing strings, commit messages, and the Notion schema. Keep it.
- Keep server logic in `server.js` unless it grows past ~2000 lines — the single-file layout is intentional.
- Any new route that mutates state must (a) persist via the matching `save*()` helper and (b) `broadcast()` the change so connected clients update.
- Every call that hits Google Places must go through `placesNearby()` / `placeDetails()` so `budget` accounting stays correct. Never call the Google API directly elsewhere.
