# Silo: Backend

> Load this file only when working on server/API/data code. Pair with [shared.md](shared.md) if the change crosses the boundary.

## Status
Scaffolded by T001. Stack locked in [ADR 0003](../../decisions/0003-product-concept-and-stack.md).

## Location
`apps/api/`

## Stack
- Node 20+ + TypeScript
- Fastify (with `@fastify/cors`)
- `better-sqlite3` for persistence (synchronous, single-file)
- Zod schemas from `packages/shared` for request/response validation
- `tsx` for dev, `vitest` for tests

## Conventions
- One route module per resource under `src/routes/`. Example: `src/routes/plans.ts` exports a Fastify plugin.
- DB access in `src/db/` only. No SQL outside this folder.
- Schema: single `plans` table — `id TEXT PRIMARY KEY, data JSON, created_at, updated_at`. Plan body lives in the `data` blob.
- Validation: every request body/params goes through a Zod schema from `packages/shared` before hitting the handler.
- Errors: throw Fastify HTTP errors (`fastify.httpErrors`); never return raw stack traces.
- Plant data: loaded once at startup from `data/plants.json` into an in-memory map.

## Key files
- `src/server.ts` — Fastify bootstrap + plugin registration
- `src/db/index.ts` — better-sqlite3 connection + migrations
- `src/routes/plans.ts` — `/plans` CRUD + per-step subroutes
- `src/services/` — pure recommendation logic (companions, layout, timing). These are unit-testable without Fastify.

## How agents should work here
1. Read this file + [shared.md](shared.md) + [.ai/requirements/mvp.md](../../requirements/mvp.md).
2. Put pure logic in `src/services/`. Routes are thin.
3. Follow [.ai/patterns/coding-standards.md](../../patterns/coding-standards.md).
4. If introducing a new pattern/library, write an ADR.

## Dev environment gotchas
- Use Node 22 LTS (`.nvmrc`). better-sqlite3 has no prebuilt binary for Node 24 — see [ADR 0004](../../decisions/0004-pin-node-22-lts.md).
- If `pnpm` is missing after `nvm use`, run `corepack prepare pnpm@10.32.1 --activate` (export `COREPACK_ENABLE_DOWNLOAD_PROMPT=0` first to skip the interactive Y/n).
