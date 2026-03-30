# Port Activity Dashboard — Le Havre

## Context

Alex is building a portfolio project to demonstrate his ability to architect and deliver a complete application from idea to production. The project is a real-time port activity dashboard for Le Havre, combining maritime data (AIS), weather, and AI-powered features. It showcases heterogeneous data integration, cartography, automation, and applied generative AI — differentiating from typical portfolio projects (todo apps, e-commerce clones).

Alex has professional experience with maritime applications (Leaflet) and dashboards (Chart.js, shadcn/ui, Tailwind). This project elevates that experience by adding real-time data architecture, AI integration (NLQ + summaries), and full infrastructure ownership (self-hosted Docker).

---

## Architecture Overview

### Deployment Model

Self-hosted on a VPS (OVH or Hostinger, ~5-8€/month), fully containerized with Docker Compose.

```
┌─ VPS (Docker Compose) ────────────────────────────┐
│                                                     │
│  ┌─────────┐  ┌───────────┐  ┌──────────────────┐ │
│  │  Caddy  │  │  Next.js  │  │   PostgreSQL     │ │
│  │ (proxy) │──│   (app)   │──│   + PostGIS      │ │
│  │ + SSL   │  │           │  │                  │ │
│  └─────────┘  └───────────┘  └──────────────────┘ │
│                                                     │
│  ┌───────────────────┐  ┌────────────────────────┐ │
│  │  AIS WebSocket    │  │         n8n            │ │
│  │  Worker (Node.js) │  │   (orchestration)      │ │
│  └───────────────────┘  └────────────────────────┘ │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer              | Technology                                |
|--------------------|-------------------------------------------|
| Language           | TypeScript (strict mode)                  |
| Framework          | Next.js (App Router)                      |
| Styling            | Tailwind CSS + shadcn/ui                  |
| Maps               | MapLibre GL JS                            |
| Charts             | Recharts                                  |
| State (client)     | Zustand                                   |
| State (server)     | TanStack Query                            |
| Validation         | Zod                                       |
| Database           | PostgreSQL + PostGIS (self-hosted)        |
| ORM                | Drizzle ORM                               |
| AI (NLQ)           | Gemini Flash (text-to-SQL)                |
| AI (summaries)     | Gemini Flash                              |
| Orchestration      | n8n (self-hosted)                         |
| Reverse proxy      | Caddy (auto SSL via Let's Encrypt)        |
| Containerization   | Docker Compose                            |
| Testing            | Vitest                                    |

### Key Architecture Decisions

**MapLibre GL JS over Leaflet**: Alex already has Leaflet on his professional track record. MapLibre demonstrates versatility with mapping libraries and offers better performance for real-time rendering of many vessel markers with WebGL.

**PostgreSQL + PostGIS over managed DB (Supabase/Turso)**: Self-hosted eliminates free-tier limitations (DB pause, storage caps). PostGIS enables native geospatial queries critical for maritime data (radius searches, bounding box filters, distance calculations). Full control aligns with the architect positioning.

**Gemini Flash over Claude API**: Daily summaries and text-to-SQL are straightforward tasks where Gemini Flash provides sufficient quality at 10-20x lower cost. This demonstrates pragmatic model selection — choosing the right tool for the job.

**n8n over Next.js cron/API routes**: Separates data collection orchestration from the web application. Visual workflow editor makes pipelines inspectable and debuggable. Adds n8n to Alex's skill set. Self-hosted on the same VPS keeps costs at zero.

---

## Data Sources

### AIS Vessel Data — AISstream (free)
- **Protocol**: WebSocket (`wss://stream.aisstream.io/v0/stream`)
- **Access**: Free API key via registration
- **Data**: Real-time vessel positions, speed, heading, destination, vessel type
- **Filtering**: Geographic bounding box centered on Le Havre estuary
- **Constraint**: Must send subscription message within 3 seconds of connection

### Weather — Open-Meteo Marine API (free)
- **Protocol**: REST API (no key required)
- **Data**: Wave height, wind speed/direction, visibility, sea conditions
- **Update frequency**: Hourly polling via n8n
- **Forecast horizon**: 7 days

### Port Statistics — HAROPA OpenData (free)
- **Protocol**: ArcGIS REST / Open Data API
- **Data**: Port infrastructure, traffic volumes, GIS layers
- **Usage**: Reference data for map overlays and contextual statistics

---

## Features

### 1. Real-Time Map (MapLibre GL JS)

**What it does**: Interactive map centered on Le Havre port and Seine estuary showing live vessel positions.

**Behavior**:
- Map loads centered on Le Havre port coordinates (~49.49°N, 0.11°E)
- Vessel markers update in real-time as AIS data arrives
- Markers are differentiated by vessel type (cargo, tanker, passenger, fishing, other) using distinct icons/colors
- Clicking a vessel opens a detail panel showing: vessel name, MMSI, type, speed (knots), heading, destination, last update timestamp
- Port zone is highlighted with a geofence overlay
- Map controls: zoom, pan, fullscreen, layer toggle (satellite/standard)

**Data flow**: AIS Worker → PostgreSQL → Next.js API route (SSE endpoint) → TanStack Query (with refetch on SSE event) → MapLibre layer. The SSE endpoint pushes new position updates to connected clients, avoiding aggressive polling. Fallback: TanStack Query polls every 30s if SSE connection drops.

### 2. Metrics Dashboard (Recharts)

**What it does**: Visual summary of port activity with charts and KPIs.

**Components**:
- **KPI cards**: Vessels currently in zone, arrivals today, departures today
- **Vessel type distribution**: Pie or bar chart (cargo, tanker, passenger, fishing, other)
- **Traffic timeline**: Line chart showing vessel count over 24h / 7d (toggle)
- **Weather panel**: Current marine conditions (wind, waves, visibility) with 24h forecast mini-chart

**Data flow**: PostgreSQL (historical aggregates) → API routes → TanStack Query → Recharts

### 3. Natural Language Query (NLQ)

**What it does**: Users type questions in natural language, the AI translates them to SQL queries, and results are displayed on the map and dashboard.

**Behavior**:
- Search bar prominently placed in the UI
- User types a question (e.g., "Show me tankers that arrived this week")
- Gemini Flash receives: the question + database schema + a few-shot prompt with example queries
- AI returns a SQL query (validated and sanitized before execution)
- Results displayed: matching vessels highlighted on the map + results table below
- Suggested queries shown as chips for discoverability
- Error handling: if the AI generates invalid SQL, show a friendly "I didn't understand, try rephrasing" message

**Security**: All generated SQL runs through a read-only database connection with a restricted role. Query is validated (no DDL, no writes). Timeout enforced (5s max).

**Prompt structure**:
```
System: You are a SQL query generator for a maritime port database.
Schema: [vessels table, positions table, weather table — with column descriptions]
Rules: SELECT only. No INSERT/UPDATE/DELETE. Use PostGIS functions for spatial queries.
Examples:
  "tankers this week" → SELECT ... WHERE vessel_type = 'Tanker' AND last_seen > NOW() - INTERVAL '7 days'
  "vessels faster than 15 knots" → SELECT ... WHERE speed > 15
User: {user_query}
```

### 4. Daily AI Summary (Gemini Flash)

**What it does**: Automated daily digest of notable port events.

**Behavior**:
- Generated daily at 22:00 UTC via n8n scheduled workflow
- n8n queries PostgreSQL for the day's data (arrivals, departures, unusual events)
- Data is sent to Gemini Flash with a prompt: "Summarize the 3 most notable events at Le Havre port today"
- Result stored in a `daily_summaries` table
- Frontend displays the latest summary in a dedicated panel, with history browsable

### 5. Data Collection & Orchestration (n8n)

**Workflows**:

1. **AIS Collector** (continuous):
   - A dedicated Node.js worker service maintains the WebSocket connection to AISstream
   - Filters messages by bounding box (Le Havre area)
   - Writes vessel positions to PostgreSQL every reception (with deduplication)
   - n8n monitors the worker health and restarts if needed

2. **Weather Poller** (hourly):
   - n8n workflow runs every hour
   - Fetches Open-Meteo marine data for Le Havre coordinates
   - Stores in `weather_readings` table

3. **Daily Summary Generator** (daily at 22:00):
   - Queries day's vessel + weather data from PostgreSQL
   - Sends to Gemini Flash for summary generation
   - Stores result in `daily_summaries` table

---

## Database Schema (PostgreSQL + PostGIS)

```sql
-- Vessels (deduplicated by MMSI)
CREATE TABLE vessels (
  mmsi TEXT PRIMARY KEY,
  name TEXT,
  vessel_type TEXT,
  flag TEXT,
  length REAL,
  width REAL,
  destination TEXT,
  first_seen TIMESTAMPTZ NOT NULL,
  last_seen TIMESTAMPTZ NOT NULL
);

-- AIS positions (time-series)
CREATE TABLE positions (
  id BIGSERIAL PRIMARY KEY,
  mmsi TEXT NOT NULL REFERENCES vessels(mmsi),
  position GEOMETRY(Point, 4326) NOT NULL,
  speed REAL,
  heading REAL,
  course REAL,
  timestamp TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_positions_timestamp ON positions(timestamp);
CREATE INDEX idx_positions_mmsi ON positions(mmsi);
CREATE INDEX idx_positions_geo ON positions USING GIST(position);

-- Weather readings
CREATE TABLE weather_readings (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL,
  wind_speed REAL,
  wind_direction REAL,
  wave_height REAL,
  visibility REAL,
  temperature REAL,
  raw_data JSONB
);
CREATE INDEX idx_weather_timestamp ON weather_readings(timestamp);

-- Daily AI summaries
CREATE TABLE daily_summaries (
  id SERIAL PRIMARY KEY,
  date DATE UNIQUE NOT NULL,
  summary TEXT NOT NULL,
  notable_events JSONB,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Data retention**: Positions older than 90 days are archived/deleted via a weekly n8n workflow to keep the database manageable.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Main dashboard page
│   ├── layout.tsx                  # Root layout
│   └── api/
│       ├── vessels/route.ts        # Vessel data endpoints
│       ├── positions/route.ts      # Position data + geospatial queries
│       ├── weather/route.ts        # Weather data endpoint
│       ├── summary/route.ts        # Daily summaries endpoint
│       └── nlq/route.ts           # Natural language query endpoint
├── components/
│   ├── atoms/                      # Button, Badge, Input, Icon
│   ├── molecules/                  # SearchBar, VesselCard, WeatherCard, KpiCard
│   ├── organisms/                  # MapView, Dashboard, NlqPanel, SummaryPanel
│   ├── templates/                  # DashboardLayout
│   └── ui/                         # shadcn/ui generated
├── hooks/
│   ├── use-vessels.ts              # TanStack Query hook for vessel data
│   ├── use-positions.ts            # TanStack Query hook for positions
│   ├── use-weather.ts              # TanStack Query hook for weather
│   ├── use-nlq.ts                  # NLQ mutation hook
│   └── use-map.ts                  # MapLibre instance management
├── lib/
│   ├── db.ts                       # Drizzle ORM client
│   ├── ais-schema.ts               # Drizzle schema definitions
│   ├── gemini.ts                   # Gemini Flash client wrapper
│   ├── nlq-prompt.ts               # NLQ prompt template + SQL validation
│   └── constants.ts                # Coordinates, config, vessel types
├── stores/
│   ├── use-map-store.ts            # Map state (viewport, selected vessel)
│   └── use-filter-store.ts         # Dashboard filter state
├── types/
│   └── index.ts                    # Shared types (Vessel, Position, Weather)
├── workers/
│   └── ais-collector/              # Standalone Node.js AIS WebSocket worker
│       ├── index.ts
│       ├── Dockerfile
│       └── package.json
└── styles/
    └── globals.css
```

---

## Infrastructure

### Docker Compose Services

| Service        | Image / Build        | Port  | Purpose                    |
|----------------|----------------------|-------|----------------------------|
| `caddy`        | caddy:2-alpine       | 80/443| Reverse proxy + auto SSL   |
| `app`          | ./Dockerfile         | 3000  | Next.js application        |
| `db`           | postgis/postgis:16   | 5432  | PostgreSQL + PostGIS       |
| `n8n`          | n8nio/n8n            | 5678  | Workflow orchestration     |
| `ais-worker`   | ./workers/ais-collector | —  | AIS WebSocket collector    |

### Domain & SSL
- Custom domain (e.g., `lehavre-port.dev` or similar)
- Caddy handles automatic Let's Encrypt SSL certificates
- n8n accessible on a subdomain (e.g., `n8n.lehavre-port.dev`) — password protected

---

## Testing Strategy

- **Unit tests (Vitest)**: SQL validation logic, data transformation utilities, Zod schemas
- **Component tests**: Key organisms (MapView, Dashboard, NlqPanel) with mock data
- **Integration**: NLQ prompt → SQL generation → validation pipeline
- **Manual/E2E**: Full flow verification on staging (the VPS itself)

---

## Architecture Considerations for Future (V2)

### Multi-Port Support
V1 targets Le Havre exclusively, but the architecture must not hardcode this. All port-specific values (coordinates, bounding box, timezone, name) are centralized in a single config object (`lib/constants.ts`). No geographic coordinate or port name should appear anywhere else in the codebase. This ensures V2 multi-port support (port selector, dynamic AIS reconnection, per-port routing) requires only:
- A ports registry (JSON/DB table)
- A UI selector
- AIS worker reconnection logic

---

## Out of Scope (V1)

- Multi-port support (port selector UI, dynamic bounding box switching)
- User authentication / multi-user
- Mobile-specific responsive design (desktop-first, basic mobile support via Tailwind)
- ETA predictions or anomaly detection (potential V2 features)
- Historical data import from external sources
- Push notifications
- Port call data from paid APIs (Datalastic, etc.)
