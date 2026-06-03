# Architecture

> Update this file whenever a structural decision lands. Keep it < 100 lines. Link to ADRs for rationale.

## Stack
TBD — to be set in the first feature ADR. Likely defaults (revisit before locking):
- **Frontend:** TBD (candidates: Next.js, Vite + React)
- **Backend:** TBD (candidates: FastAPI, Node/Express, Next.js API routes)
- **Data:** TBD (candidates: SQLite for demo, Postgres if needed)
- **Runtime:** Dev container (Ubuntu 24.04)

## Silos
The codebase is partitioned so agents can load only what they need.

| Silo | Path (planned) | Context file |
|---|---|---|
| Frontend | `apps/web/` or `src/web/` | [silos/frontend.md](silos/frontend.md) |
| Backend | `apps/api/` or `src/api/` | [silos/backend.md](silos/backend.md) |
| Shared | `packages/shared/` or `src/shared/` | [silos/shared.md](silos/shared.md) |

Add a new silo by: (1) creating `silos/<name>.md`, (2) listing it here, (3) recording an ADR.

## Cross-cutting
- **Config:** env vars via `.env`, with `.env.example` checked in.
- **Logging:** TBD per silo.
- **Auth:** none until requested.

## Diagrams
None yet. Add Mermaid blocks here when component count > 3.
