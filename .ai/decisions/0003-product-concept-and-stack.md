# ADR 0003: Product concept & stack — Garden Plan Builder

- **Status:** Accepted
- **Date:** 2026-06-03
- **Silo(s):** meta, frontend, backend, shared

## Context
F001 asks: pick the demo concept and stack. The user landed on a guided gardening planner combining three small ideas (companion planting, bed layout, frost/window advisor) into one wizard-style flow. We need to commit to a stack so silo work can start. Constraints from `project.md`: lightweight, demo-grade, few-prompts to build.

## Decision

**Product concept — Garden Plan Builder.** A guided wizard that builds a personalized planting plan in 5 steps: inputs → companion recommendations → bed layout → frost/window timing → final plan. State persists between steps so a user can resume. Full MVP in [.ai/requirements/mvp.md](../requirements/mvp.md).

**Stack:**
- **Frontend:** Vite + React + TypeScript. Plain CSS modules (no design system).
- **Backend:** Node + TypeScript + **Fastify**. Lightweight, typed, fast to scaffold.
- **Persistence:** SQLite via **better-sqlite3**. Single file DB. One table for plans (id + JSON blob + timestamps).
- **Shared:** TypeScript types + Zod schemas in `packages/shared`. Used by both sides; runtime validation at the API boundary.
- **Plant data:** static `plants.json` checked in; ~20–30 common vegetables/herbs.
- **Tooling:** pnpm workspaces; tsx for dev; vitest for tests; eslint + prettier minimal config.

**Repo layout:**
```
apps/
  web/        # Vite + React (frontend silo)
  api/        # Fastify + better-sqlite3 (backend silo)
packages/
  shared/     # Types, Zod schemas, plant data (shared silo)
data/
  plants.json # Seed plant database
```

**API style:** REST, JSON, single resource `/plans` with step-specific subroutes (e.g. `POST /plans`, `GET /plans/:id`, `POST /plans/:id/companions`, ...).

**No auth.** Single anonymous user. Plans are listed/loaded by id (URL is the bookmark).

## Alternatives considered
- **Next.js full-stack.** Rejected: blurs the FE/BE silo boundary that the scaffold is designed around; fewer artifacts to demonstrate cross-silo workflow.
- **FastAPI (Python) backend.** Rejected: user asked for TypeScript backend; keeping one language across silos reduces context-switching.
- **Hono instead of Fastify.** Considered: Hono is more minimal and edge-ready. Rejected for now in favor of Fastify's broader Node ecosystem and built-in JSON schema validation; can supersede if it bites.
- **Express.** Rejected: older patterns, weaker TS story, no built-in schema validation.
- **Prisma / Drizzle ORM.** Rejected for MVP: schema is one table with a JSON blob; raw better-sqlite3 is simpler and zero-codegen.
- **Postgres.** Rejected: SQLite is enough for a single-user demo and removes a service dependency.
- **Monorepo with Turborepo / Nx.** Rejected: pnpm workspaces alone are sufficient for 3 packages.

## Consequences
- **Positive**
  - Single language (TS) across silos; one `pnpm install` at the root.
  - Static plant data ships in the repo — no external API risk.
  - SQLite means a fresh clone runs with no DB setup.
  - Zod schemas in `shared` give us one source of truth for API contracts.
  - Each MVP step (F003–F007) maps cleanly to one Fastify route + one React screen.
- **Negative / trade-offs**
  - Manual sync between Zod schemas and any FE forms (no codegen).
  - better-sqlite3 is native; `pnpm install` will rebuild on first clone (fine in the dev container).
  - Fastify + better-sqlite3 means CommonJS-friendly ESM setup — needs care in `tsconfig.json`.
- **Follow-ups**
  - Update [architecture.md](../context/architecture.md) with the chosen stack.
  - Update [silos/frontend.md](../context/silos/frontend.md), [silos/backend.md](../context/silos/backend.md), [silos/shared.md](../context/silos/shared.md).
  - Add glossary entries: Plan, Wizard, Companion, Antagonist.
  - T001 (Repo setup) implements this ADR.
