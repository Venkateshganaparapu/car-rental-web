# Driftline

Driftline is a cinematic car-rental marketplace for browsing distinctive owner-listed cars, requesting bookings, and managing a small fleet.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- Frontend: `artifacts/car-rental/src/App.tsx` and `artifacts/car-rental/src/index.css`
- API contract: `lib/api-spec/openapi.yaml`
- API routes: `artifacts/api-server/src/routes/rental.ts`
- Generated client: `lib/api-client-react/src/generated/`

## Architecture decisions

- The home page is a scroll-snapped, three-chapter experience; other flows remain route-based and direct.
- The API contract stays OpenAPI-first so the renter and owner surfaces use typed generated hooks.
- Seeded inventory and bookings keep the first experience populated while the owner CRUD surface is exercised against the API.

## Product

- Renter browse/search/filter, car details, date-based booking requests, booking log, and demo account preferences.
- Owner dashboard with revenue/utilization summary, recent activity, fleet CRUD, and booking status actions.
- Reduced-motion support and responsive navigation are included in the cinematic browse experience.

## User preferences

- The user wants scrolling to feel like pages changing while scrolling up or down.

## Gotchas

- Re-run `pnpm --filter @workspace/api-spec run codegen` after changing `lib/api-spec/openapi.yaml`.
- The current API seed data is in-memory for the first build; production persistence and auth can be added without changing the OpenAPI surface.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
