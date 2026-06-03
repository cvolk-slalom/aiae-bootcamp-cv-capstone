# ADR 0001: AI-SDLC scaffolding & conventions

- **Status:** Accepted
- **Date:** 2026-06-03
- **Silo(s):** meta

## Context
The project's goal is to build a demo product in as few prompts as possible by leaning on AI agents. To make that work, a new chat with no prior history must be able to orient itself, find the right context, and follow consistent patterns — without the human re-explaining things or the AI hallucinating. We need a scaffold that is **lightweight, token-efficient, silo-scoped, and self-maintaining**.

## Decision
Adopt the `.ai/` directory as the meta-layer with this structure:
- **`AGENTS.md`** at repo root as the single routing entry point (mirrored by `.github/copilot-instructions.md` for Copilot Chat).
- **`.ai/context/`** split into `project.md`, `architecture.md`, `glossary.md`, plus per-silo files under `silos/` (frontend, backend, shared). Agents load only the silo files relevant to the task.
- **`.ai/decisions/`** for append-only ADRs, numbered, with an index in `README.md` and a `template.md`.
- **`.ai/requirements/`** with a single-page `backlog.md` and short per-feature `briefs/` for anything non-trivial (template provided).
- **`.ai/patterns/`** for cross-silo standards (coding, file org, testing).
- **`.ai/workflows/`** with recipes the agent follows: `new-feature.md`, `context-discovery.md`, `record-decision.md`, `update-journal.md`.
- **`.ai/journal/`** dated entries appended at the end of meaningful sessions.

Hard rules encoded in `AGENTS.md`: silo-first loading, log decisions, journal at session end, update context with changes, prefer terse bullets, no clarifying questions if `.ai/` already answers it.

## Alternatives considered
- **Monolithic `CONTRIBUTING.md` / single instructions file.** Rejected: forces agents to load everything; not silo-scoped; grows unbounded.
- **Tool-specific config only (`.github/copilot-instructions.md` alone).** Rejected: locks the scaffold to one tool; can't host ADRs/journal/requirements.
- **Heavy templates (PRD + RFC + design doc per feature).** Rejected: too much ceremony; defeats the "few prompts" goal.
- **No journal, rely on git log.** Rejected: git messages aren't structured for AI re-entry and don't capture *why*.

## Consequences
- **Positive**
  - A fresh chat can be productive after reading `AGENTS.md` + 1–2 silo files (≈ few hundred tokens).
  - Decisions are durable and discoverable; the AI can cite them instead of re-deriving.
  - Silo split keeps context loads small as the repo grows.
  - Journal gives the human a readable trail; the AI a quick history scan.
- **Negative / trade-offs**
  - Discipline required: workflows must actually update context/ADRs/journal or the system rots.
  - Slight upfront cost before any product code is written.
- **Follow-ups**
  - First product-feature chat must pick stack and write ADR 0002 (frontend) and ADR 0003 (backend) or a combined stack ADR.
  - Update [architecture.md](../context/architecture.md) and the matching silo file in the same change.
