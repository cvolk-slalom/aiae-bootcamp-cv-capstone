# Brief: T001 — Repo setup

- **Silo(s):** meta, frontend, backend, shared
- **Status:** todo
- **Date:** 2026-06-03

## Goal
A monorepo a developer can clone, `pnpm install`, and run `pnpm dev` to get a Vite frontend talking to a Fastify backend backed by SQLite — with shared types in place. No product features yet.

## Scope
- In:
  - pnpm workspaces at root; root `package.json` with `dev`, `build`, `test`, `lint`.
  - `apps/web` (Vite + React + TS), `apps/api` (Fastify + TS + better-sqlite3), `packages/shared` (TS + Zod).
  - `data/plants.json` seeded with **≥ 20** realistic entries matching the `Plant` schema in [mvp.md](../mvp.md).
  - SQLite DB at `apps/api/data/app.db` created on startup; `plans` table migration.
  - One health endpoint `GET /health` returning `{ok: true}`.
  - Web app boots and calls `/health` on load to confirm wiring.
  - `.env.example` files; `.gitignore` for node_modules, dist, *.db.
  - eslint + prettier minimal config; `tsconfig.base.json` extended by each package.
  - Vitest configured in api + shared.
- Out:
  - Any wizard UI, any plan-related routes, any recommendation logic. Those are F003+.
  - CI/CD, Docker, deploy config.

## Acceptance
- [ ] `pnpm install && pnpm dev` starts both apps (web on 5173, api on 3001) with no errors.
- [ ] Browsing the web app shows a placeholder page and the network tab shows a successful `/health` call.
- [ ] `pnpm test` runs (even if zero tests) and exits 0.
- [ ] `pnpm lint` exits 0.
- [ ] `data/plants.json` validates against the `Plant` Zod schema in `packages/shared`.
- [ ] `apps/api/data/app.db` is created on first run with a `plans` table.

## Notes
- Stack locked by [ADR 0003](../../decisions/0003-product-concept-and-stack.md). If anything in this brief conflicts, ADR wins — write a follow-up ADR.
- Package name convention: `@gpb/web`, `@gpb/api`, `@gpb/shared` ("gpb" = Garden Plan Builder).
