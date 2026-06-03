# Silo: Shared

> Cross-cutting concerns: types, contracts, utilities, config. Loaded alongside any other silo when work crosses boundaries.

## Status
Scaffolded by T001. Stack locked in [ADR 0003](../../decisions/0003-product-concept-and-stack.md).

## Location
`packages/shared/`

## What lives here
- `src/plan.ts` — `Plan` TypeScript type + Zod schema. Single source of truth for the wizard state.
- `src/plant.ts` — `Plant` TypeScript type + Zod schema (matches `data/plants.json`).
- `src/api.ts` — per-route request/response Zod schemas (e.g., `CreatePlanRequest`, `UpdateInputsRequest`).
- Pure utilities used by both sides (date math, id generation) — no FE or BE imports.

## What does NOT live here
- React components → frontend silo.
- DB access / Fastify handlers → backend silo.
- Anything that imports `react`, `fastify`, or `better-sqlite3`.

## Conventions
- ESM only (`"type": "module"` in package.json).
- Exports via `package.json` `"exports"` map; consumers import from `@gpb/shared`.
- Add a new contract here *before* implementing it on either side.
- If a util is used by only one silo, keep it in that silo — don't promote prematurely.
