# Silo: Shared

> Cross-cutting concerns: types, contracts, utilities, config. Loaded alongside any other silo when work crosses boundaries.

## Status
Not yet scaffolded.

## Location
TBD — planned: `packages/shared/` or `src/shared/`.

## What lives here
- Type definitions used by both FE and BE
- API contracts / schemas
- Pure utilities with no FE or BE dependencies

## What does NOT live here
- UI components → frontend silo
- DB access / server handlers → backend silo

## Conventions
- No runtime dependencies on FE or BE frameworks.
- If a util is used by only one silo, keep it in that silo.
