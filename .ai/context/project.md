# Project

## One-liner
TBD — set during the first feature kickoff. (Working title: `aiae-bootcamp-cv-capstone`.)

## Goals
- Build a demo product in **as few prompts as possible** by relying on this AI-SDLC scaffold.
- Validate that silo-scoped context + ADRs + journal = a new chat can pick up work cold.

## Non-goals
- Production hardening (security, scale, ops) unless explicitly requested.
- Exhaustive tests — pragmatic coverage only.

## Constraints
- Lightweight stack — prefer batteries-included frameworks over bespoke glue.
- Dev container is Ubuntu 24.04; tooling assumes Linux.
- No secrets in repo. Use `.env.example` + env vars.

## Stakeholders
- **Owner / driver:** repo owner (single human user).
- **Builders:** AI agents (Copilot, Claude, Codex) following [.ai/workflows/](../workflows/).

## Current status
Scaffolding-only. No product code yet. Next step: pick the demo concept and stack — see [.ai/requirements/backlog.md](../requirements/backlog.md).
