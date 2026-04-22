# ReserBox Mapper

Herramienta de prospección para ReserBox: mapea sistemáticamente Bogotá localidad por localidad usando Google Places API, visualiza progreso en mapa interactivo, y sincroniza locales encontrados con Notion para seguimiento comercial.

## Stack

- Backend: Node.js + Express
- Frontend: HTML + CSS + JS vanilla
- Mapa: Leaflet.js sobre OpenStreetMap (gratis)
- Persistencia: archivos JSON en `data/`
- APIs externas: Google Places, Notion

## Requisitos

- Node.js ≥ 18
- Google Cloud project con Places API habilitada y billing activo (usa el crédito gratuito de $200/mes)
- Integración de Notion con permisos sobre una database con las propiedades correctas (ver abajo)

## Setup

```bash
npm install
cp .env.example .env   # opcional, la app lo crea sola
npm start
```

Abrir http://localhost:3000

La primera vez aparece pantalla de configuración para pegar las keys. Se validan contra las APIs antes de guardarse.

## Database de Notion

Tu database debe tener estas propiedades con estos tipos exactos:

| Propiedad | Tipo |
|---|---|
| Nombre | Title |
| Categoría | Select |
| Teléfono | Phone |
| Maps URL | URL |
| Website | URL |
| Dirección | Text |
| Localidad | Select |
| Calificación | Number |
| Reseñas | Number |
| Estado | Select (crear opción "Pendiente contacto") |
| Notas | Text |
| Fecha encontrado | Date |

Compartí la database con tu integración de Notion (click "..." → Connections → tu integración).

## Cómo funciona

1. El mapa muestra las 20 localidades de Bogotá como polígonos.
2. Hacé click en una localidad (o usá el selector lateral) → "Iniciar". La app genera un grid de puntos cada 600m dentro del polígono y busca con radio 500m.
3. Por cada punto busca todas las categorías configuradas (types de Google + keywords en español).
4. Los locales aparecen como pines en el mapa en tiempo real, coloreados por categoría, y también en la lista lateral.
5. Podés exportar uno a uno o todos en batch a Notion.
6. El contador de costos se actualiza en vivo. Al 80% del crédito te avisa, al 95% se detiene sola.

## Control de costos

- Nearby Search: $0.032/request
- Place Details: $0.017/request
- Crédito gratuito: $200/mes de Google

Estrategia:

- Primero Nearby Search para cubrir el grid (los datos básicos los trae).
- Place Details es opcional y solo lo pedís explícitamente con el botón "Traer Details" o en batch sobre los filtrados — así no quemás crédito en locales que no te interesan.

Si Google devuelve `OVER_QUERY_LIMIT` o `REQUEST_DENIED`, la app detiene toda operación inmediatamente y muestra alerta con el total encontrado.

## Persistencia

Todos los datos se guardan en archivos JSON locales:

- `data/businesses.json` — todos los locales encontrados (keyed por place_id, deduplicado)
- `data/progress.json` — qué localidades + puntos de grid ya se buscaron
- `data/budget.json` — contadores de requests y estado de parada

Al reiniciar el servidor carga todo automáticamente. Podés ver los locales ya encontrados sin internet.

## Geodata

`data/bogota-localidades.geojson` contiene polígonos aproximados (rectangulares) de las 20 localidades. Para mayor precisión descargá los límites oficiales de https://datosabiertos.bogota.gov.co y reemplazá el archivo manteniendo la misma estructura de propiedades (`nombre`).

## Endpoints

- `GET /api/config/status` — hay keys guardadas?
- `POST /api/config/validate` — valida contra Google y Notion
- `POST /api/config/save` — guarda y valida
- `GET /api/localidades` — GeoJSON
- `GET /api/progress` — estado por localidad
- `GET /api/businesses` — todos los locales
- `GET /api/budget` — estado del presupuesto
- `POST /api/budget/reset` — resetea contadores locales
- `POST /api/search/start` — inicia búsqueda en una localidad
- `POST /api/search/stop` — cancela la búsqueda en curso
- `POST /api/details/:placeId` — trae Place Details
- `POST /api/details/batch` — batch de Place Details
- `POST /api/notion/export/:placeId` — exporta uno
- `POST /api/notion/export-all` — exporta todos los pendientes
- `GET /api/stream` — Server-Sent Events para updates en tiempo real
