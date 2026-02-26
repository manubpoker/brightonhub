# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Brighton Hub (brightonhub.ai) — a multi-dashboard civic data portal for Brighton & Hove built with Next.js 16 (App Router). It aggregates UK government open data across multiple dashboards: Environment (flood warnings, air quality, carbon intensity, bathing water quality), Weather (Open-Meteo), Crime & Safety (Police.uk across BN1–BN43), Transport (National Rail Darwin Push Port via Kafka), Planning & Development, Health, Housing, Schools, Community, Entertainment, and a Student Hub.

## Commands

- `npm run dev` — Start dev server at http://localhost:3000
- `npm run build` — Production build
- `npm run lint` — Run ESLint (flat config, ESLint 9)
- No test framework is configured yet

## Architecture

**Data flow:** External UK Gov APIs → Next.js API routes (`src/app/api/`) → Transformers (`src/lib/transformers/`) → TanStack Query hooks (`src/lib/hooks/`) → React components

The root layout (`src/app/layout.tsx`) wraps the app in `QueryProvider` (`src/providers/query-provider.tsx`) for TanStack Query.

### URL structure

- `/` — Portal homepage with dashboard cards (each card shows live status via hooks)
- `/environment/` — Environment dashboard (flood, air quality, carbon, bathing water)
- `/environment/air-quality/`, `/environment/carbon/`, `/environment/flood/` — Sub-pages
- `/weather/` — Weather dashboard (current, hourly, 7-day forecast)
- `/crime/` — Crime & safety dashboard (BN1–BN43 areas)
- `/crime/categories/`, `/crime/neighbourhood/` — Sub-pages
- `/transport/` — Transport dashboard (trains)
- `/transport/buses/`, `/transport/trains/` — Sub-pages
- `/planning/` — Planning & development dashboard
- `/planning/applications/` — Applications sub-page
- `/health/`, `/housing/`, `/schools/`, `/community/`, `/entertainment/`, `/students/` — Individual dashboards
- `/about` — Platform about page
- Old URLs (`/carbon`, `/flood`, `/air-quality`) redirect to `/environment/` prefix

### Key layers

- **API routes** (`src/app/api/`) — Server-side proxies to external APIs; use `export const dynamic = 'force-dynamic'` and `next: { revalidate }` for caching
- **Transformers** (`src/lib/transformers/`) — Convert raw API responses (typed in `src/types/api.ts`) to domain types (`src/types/domain.ts`). Each transformer exports a data interface (e.g., `CarbonData`) and a `transform*` function
- **Hooks** (`src/lib/hooks/`) — TanStack Query wrappers; each hook uses `API_ROUTES` for the endpoint and `POLLING` for refetch intervals from `constants.ts`
- **Types** — Three type files: `src/types/api.ts` (raw API response shapes), `src/types/domain.ts` (transformed domain models), `src/types/dashboard.ts` (dashboard config/status)
- **Shared components** (`src/components/shared/`) — Cross-dashboard UI (StatusCard, AlertPanel, DashboardCard, PageHeader, LoadingState, ErrorState)
- **Domain components** (`src/components/{environment,crime,transport,planning,weather,health,housing,schools,community,entertainment}/`) — Dashboard-specific UI
- **Map** (`src/components/map/`) — Generalized `BrightonMap` accepting typed `MapMarker[]`; uses Leaflet via react-leaflet
- **Charts** (`src/components/charts/`) — Recharts-based (TimeSeriesChart, GenerationMixChart)
- **Dashboard registry** (`src/lib/dashboards.ts`) — Central `DASHBOARDS` array of `DashboardConfig` objects; homepage iterates this
- **Constants** (`src/lib/constants.ts`) — API URLs, polling intervals, severity mappings, marker colors, Brighton coordinates/bounding box, crime areas, beach IDs

### Darwin Push Port (train data)

Transport data comes from National Rail's Darwin Push Port via Kafka (Confluent Cloud). This is the most complex subsystem:

- `src/lib/darwin/push-port-client.ts` — Kafka consumer using `kafkajs`; uses a `globalThis` singleton pattern to survive Next.js HMR. Lazy-connects on first API request
- `src/lib/darwin/push-port-parser.ts` — Parses Darwin XML messages (schedules, train statuses, deactivations, station messages)
- `src/lib/darwin/push-port-store.ts` — In-memory store tracking Brighton-relevant services
- `src/lib/darwin/push-port-board.ts` — Synthesizes a departure board from store data
- `src/lib/darwin/toc-names.ts`, `tiploc-names.ts` — Lookup tables for train operator codes and TIPLOC station codes
- `next.config.ts` has `serverExternalPackages: ['kafkajs']` to avoid bundling issues

### Severity system

All data normalized to 4-level scale: `normal | alert | warning | severe`. Each domain has its own mapping logic in its transformer (e.g., DAQI bands for air quality, EA severity levels for floods, crime count thresholds). Visual styles (colors, badges, border classes) are centralized in `constants.ts` and accessed via helper functions in `utils.ts` (`getSeverityColor`, `getSeverityBgClass`, `getSeverityTextClass`, `getSeverityBorderClass`).

### Data sources

| Dashboard | API | Auth |
|-----------|-----|------|
| Environment | Carbon Intensity, EA Flood, DEFRA UK-AIR, EA Bathing Water | None |
| Weather | Open-Meteo | None |
| Crime | Police.uk (BN1–BN43 areas) | None |
| Transport | National Rail Darwin Push Port (Kafka) | DARWIN_PUSHPORT_* env vars |
| Planning | Planning Data (DLUHC) | None |
| Health | NHS ODS (Organisation Data Service) | None |
| Housing | HM Land Registry (SPARQL) | None |
| Schools | Overpass API (OpenStreetMap) | None |
| Community | GiveFood API (food banks) | None |
| Entertainment | Skiddle Events API | SKIDDLE_API_KEY |

### Environment variables

Required in `.env.local`:
- `DARWIN_PUSHPORT_BROKER`, `DARWIN_PUSHPORT_USER`, `DARWIN_PUSHPORT_PASS`, `DARWIN_PUSHPORT_TOPIC`, `DARWIN_PUSHPORT_GROUP` — For live train departures via Kafka
- `SKIDDLE_API_KEY` — For entertainment/events data

All other APIs are open and require no auth.

## Conventions

- Path alias: `@/*` maps to `src/*`
- Client components use `'use client'` directive; API routes are server-only
- UI primitives from shadcn/ui (style: "new-york"); icons from `lucide-react`
- Tailwind CSS v4 with `tw-animate-css`
- TypeScript strict mode enabled
- Date formatting uses `date-fns` (`format`, `formatDistanceToNow`)
- New dashboards follow the pattern: types (`domain.ts` + `api.ts`) → transformer → API route → hook → components → page
- Dashboard pages use `max-w-7xl` container with `px-4 py-6 sm:px-6 lg:px-8` spacing
- Map markers use `MARKER_COLORS` from constants for consistent color coding per data type
