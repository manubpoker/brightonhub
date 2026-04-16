# Repository Guidelines

## Project Structure & Module Organization
This is a Next.js App Router monorepo-style layout rooted at `src/`.
- `src/app/` holds all routes, dashboards, and API routes under `src/app/api/`.
- `src/components/` contains shared UI and domain-specific components.
- `src/lib/` contains data constants, transformation logic, hooks, and external service integrations.
- `src/types/` contains TypeScript domain and API types.
- `public/` stores static assets.
- `.env.example` documents required environment variables; `.env.local` is used for local secrets.

## Build, Test, and Development Commands
- `npm run dev` — start local server at `http://localhost:3000` with fast refresh.
- `npm run build` — compile a production build for deployment checks.
- `npm run start` — run the built app (after `npm run build`).
- `npm run lint` — run ESLint (flat config, ESLint 9) against the codebase.
- `npm install` — install dependencies after checkout.

## Coding Style & Naming Conventions
- Language: TypeScript + React Server/Client Components.
- Indentation: 2 spaces; use semicolons and single quotes by existing code style.
- Path alias: `@/*` maps to `src/*` (`tsconfig.json`).
- Naming:
  - Components: `PascalCase.tsx` exports (e.g., `StatusCard`).
  - Hooks: `use-*.ts` in `src/lib/hooks/`.
  - Route/feature folders: `kebab-case` in `src/app` and `src/lib/darwin`.
- Formatting/linting: keep code passing `npm run lint`; avoid disabling rules unless necessary and justified.

## Testing Guidelines
- No dedicated test runner is configured yet.
- Before major changes, verify behavior by running through the app pages and API routes locally.
- For new coverage, add tests under `src/` using a consistent runner (`*.test.ts`/`*.test.tsx`) and list the exact command in PRs.

## Commit & Pull Request Guidelines
- No formal commit convention file exists in-repo; use a clear Conventional Commit style (e.g., `feat(dashboard): ...`).
- Keep commits scoped to one change per message.
- PRs should include:
  - short summary + rationale
  - files/routes affected
  - commands run (`npm run lint`, `npm run build`, any manual checks)
  - screenshot for UI changes
  - env/config updates if external APIs are touched.

## Security & Configuration Notes
- Put credentials in `.env.local` only and never commit secrets.
- Design with explicit guards and keep API calls resilient:
  - `DARWIN_PUSHPORT_*` for transport streaming
  - `SKIDDLE_API_KEY` for entertainment data
  - other data sources should remain optional where possible.
- Prefer reusing constants in `src/lib/constants.ts` over inline values.
