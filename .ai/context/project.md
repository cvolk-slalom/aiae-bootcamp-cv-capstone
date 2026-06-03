# Project

## One-liner
**Garden Plan Builder** — a guided wizard that turns a gardener's bed + plant wishes into a personalized planting plan (companions, layout, timing).

Full MVP definition: [.ai/requirements/mvp.md](../requirements/mvp.md).

## Goals
- Build a demo product in **as few prompts as possible** by relying on this AI-SDLC scaffold.
- Validate that silo-scoped context + ADRs + journal = a new chat can pick up work cold.

## Non-goals
- Production hardening (security, scale, ops) unless explicitly requested.
- Exhaustive tests — pragmatic coverage only.
- Multi-user, auth, sharing, mobile-native.

## Constraints
- Lightweight stack — see [.ai/context/architecture.md](architecture.md) (Vite/React + Node/Fastify + SQLite).
- Dev container is Ubuntu 24.04; Node 20+, pnpm 9+.
- No secrets in repo. Use `.env.example` + env vars.

## Stakeholders
- **Owner / driver:** repo owner (single human user).
- **Builders:** AI agents (Copilot, Claude, Codex) following [.ai/workflows/](../workflows/).

## Current status
Scaffolding + MVP defined. Stack locked in [ADR 0003](../decisions/0003-product-concept-and-stack.md). **Next:** T001 — repo setup. Then F003–F007.
