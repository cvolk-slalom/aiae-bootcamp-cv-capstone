# Architecture

> Update this file whenever a structural decision lands. Keep it < 100 lines. Link to ADRs for rationale.

## Product
**Garden Plan Builder** — guided wizard that produces a personalized planting plan. See [.ai/requirements/mvp.md](../requirements/mvp.md).

## Stack (locked in [ADR 0003](../decisions/0003-product-concept-and-stack.md))
- **Frontend:** Vite + React + TypeScript, plain CSS modules.
- **Backend:** Node + TypeScript + Fastify.
- **Persistence:** SQLite via `better-sqlite3`. Single file at `apps/api/data/app.db`.
- **Shared:** TypeScript types + Zod schemas in `packages/shared`.
- **Tooling:** pnpm workspaces, tsx (dev), vitest (tests), eslint + prettier.
- **Plant data:** static `data/plants.json` (~20–30 entries).
- **Runtime:** Dev container (Ubuntu 24.04). Node 20+, pnpm 9+.

## Silos
The codebase is partitioned so agents can load only what they need.

| Silo | Path | Context file |
|---|---|---|
| Frontend | `apps/web/` | [silos/frontend.md](silos/frontend.md) |
| Backend | `apps/api/` | [silos/backend.md](silos/backend.md) |
| Shared | `packages/shared/` | [silos/shared.md](silos/shared.md) |

Add a new silo by: (1) creating `silos/<name>.md`, (2) listing it here, (3) recording an ADR.

## Cross-cutting
- **Config:** env vars via `.env` (loaded by Vite + Fastify). `.env.example` checked in.
- **API contract:** REST + JSON. Zod schemas in `packages/shared` are the single source of truth; both sides import them.
- **Validation:** Zod at the API boundary; trust internal calls.
- **Logging:** Fastify's built-in pino logger on the backend; browser console on the frontend.
- **Auth:** none.

## Repo layout
```
apps/
  web/        # frontend silo
  api/        # backend silo
packages/
  shared/     # shared silo (types, Zod schemas)
data/
  plants.json # seed plant database
.ai/          # AI-SDLC scaffolding
scripts/      # repo-wide helpers (e.g., ai-commit.sh)
```

## Diagrams
None yet. Add Mermaid blocks here when component count > 3.
