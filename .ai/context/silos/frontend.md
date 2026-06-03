# Silo: Frontend

> Load this file only when working on UI/client code. Pair with [shared.md](shared.md) if the change crosses the boundary.

## Status
Scaffolded by T001. Stack locked in [ADR 0003](../../decisions/0003-product-concept-and-stack.md).

## Location
`apps/web/`

## Stack
- Vite + React + TypeScript
- React Router for the wizard steps
- Plain CSS Modules (no design system, no Tailwind)
- `fetch` for API calls (no axios/react-query for MVP)

## Conventions
- Components: `PascalCase.tsx`, colocated `Component.module.css`.
- One screen per wizard step under `src/screens/<StepName>/`.
- API client in `src/api/` re-exports Zod-validated request/response helpers built on shared schemas.
- State: local component state + URL params (`/plans/:id/<step>`); no global store for MVP.
- Forms: controlled inputs; validate with Zod schemas from `packages/shared` before submit.

## Key files
- `src/main.tsx` — entry
- `src/App.tsx` — router
- `src/screens/` — one folder per wizard step (Inputs, Companions, Layout, Timing, Final)
- `src/api/client.ts` — typed fetch wrapper

## How agents should work here
1. Read this file + [shared.md](shared.md) + [.ai/requirements/mvp.md](../../requirements/mvp.md).
2. Follow [.ai/patterns/coding-standards.md](../../patterns/coding-standards.md).
3. If introducing a new pattern/library, write an ADR.
