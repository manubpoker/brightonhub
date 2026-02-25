# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Brighton Hub (brightonhub.ai) — a multi-dashboard civic data portal for Brighton & Hove built with Next.js 16 (App Router). It aggregates UK government open data across multiple dashboards: Environment (flood warnings, air quality, carbon intensity, bathing water quality), Weather (Open-Meteo), Crime & Safety (Police.uk across BN1/BN2/BN3), Transport (National Rail), Planning & Development, Health, Housing, Schools, Community, Events, and a Student Hub.

## Commands

- `npm run dev` — Start dev server at http://localhost:3000
- `npm run build` — Production build
- `npm run lint` — Run ESLint
- No test framework is configured yet

## Architecture

**Data flow:** External UK Gov APIs → Next.js API routes (`src/app/api/`) → Transformers (`src/lib/transformers/`) → TanStack Query hooks (`src/lib/hooks/`) → React components

### URL structure

- `/` — Portal homepage with dashboard cards
- `/environment/` — Environment dashboard (flood, air quality, carbon, bathing water)
- `/weather/` — Weather dashboard (current, hourly, 7-day forecast)
- `/crime/` — Crime & safety dashboard (BN1, BN2, BN3 areas)
- `/transport/` — Transport dashboard (trains)
- `/planning/` — Planning & development dashboard
- `/about` — Platform about page
- Old URLs (`/carbon`, `/flood`, `/air-quality`) redirect to `/environment/` prefix

### Key layers

- **API routes** (`src/app/api/`) — Server-side proxies to external APIs with caching
- **Transformers** (`src/lib/transformers/`) — Convert raw API responses to domain types
- **Hooks** (`src/lib/hooks/`) — TanStack Query wrappers with auto-polling
- **Shared components** (`src/components/shared/`) — Cross-dashboard UI (StatusCard, AlertPanel, DashboardCard, PageHeader, LoadingState, ErrorState)
- **Domain components** (`src/components/{environment,crime,transport,planning,weather}/`) — Dashboard-specific UI
- **Map** (`src/components/map/`) — Generalized BrightonMap accepting any marker type
- **Dashboard registry** (`src/lib/dashboards.ts`) — Central config for all dashboards
- **Constants** (`src/lib/constants.ts`) — API URLs, polling intervals, severity mappings, marker colors

### Severity system

All data normalized to 4-level scale: `normal | alert | warning | severe`. Each domain has its own mapping logic in its transformer. Visual styles (colors, badges) are shared via constants and utils.

### Data sources

| Dashboard | API | Auth |
|-----------|-----|------|
| Environment | Carbon Intensity, EA Flood, DEFRA UK-AIR, EA Bathing Water | None |
| Weather | Open-Meteo | None |
| Crime | Police.uk (BN1/BN2/BN3 areas) | None |
| Transport | National Rail Darwin | DARWIN_API_KEY (free) |
| Planning | Planning Data (DLUHC) | None |

## Conventions

- Path alias: `@/*` maps to `src/*`
- Client components use `'use client'` directive; API routes are server components
- UI primitives from shadcn/ui (style: "new-york")
- TypeScript strict mode enabled
- New dashboards follow the pattern: types → transformer → API route → hook → components → pages
