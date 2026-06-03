# AGENTS.md — AI Entry Point

> **Read this first.** It is the routing index for any AI agent (Copilot, Claude, Codex, etc.) working in this repo. Keep it short. Link out, don't inline.

## What this repo is
A demo project being built with an **AI-first SDLC**. The product code does not exist yet — the scaffolding in `.ai/` is the source of truth for how to build it.

## How to orient in a fresh chat (token-cheap path)
1. Read this file.
2. Read [.ai/context/project.md](.ai/context/project.md) — goals + constraints.
3. Read [.ai/requirements/mvp.md](.ai/requirements/mvp.md) — the product north star.
4. Read [.ai/context/architecture.md](.ai/context/architecture.md) — tech + silos.
5. Load **only the silo(s)** relevant to the task: [.ai/context/silos/](.ai/context/silos/).
6. Check [.ai/requirements/backlog.md](.ai/requirements/backlog.md) for the next task; open its brief.
7. Skim [.ai/decisions/README.md](.ai/decisions/README.md) for recent ADRs.

**Do not** load all of `.ai/` upfront. Use the workflows below to fetch only what you need.

## When the user asks for...
| Ask | Workflow |
|---|---|
| Build a new feature | [.ai/workflows/new-feature.md](.ai/workflows/new-feature.md) |
| Find relevant code/context | [.ai/workflows/context-discovery.md](.ai/workflows/context-discovery.md) |
| Make a non-trivial design choice | [.ai/workflows/record-decision.md](.ai/workflows/record-decision.md) |
| End of meaningful work session | [.ai/workflows/update-journal.md](.ai/workflows/update-journal.md) |
| Commit & push completed work | [.ai/workflows/commit-and-push.md](.ai/workflows/commit-and-push.md) |
| Add/refine a requirement | [.ai/requirements/README.md](.ai/requirements/README.md) |

## Hard rules (do not violate)
1. **Silo first.** Frontend work reads only `silos/frontend.md` (+ shared). Same for backend, etc.
2. **Log decisions.** Any choice that affects architecture, dependencies, or conventions → new ADR in `.ai/decisions/`.
3. **Journal at session end.** Append a dated entry in `.ai/journal/` summarizing what changed and why.
4. **Update context when you change it.** If you change tech, conventions, or structure, update the matching `.ai/context/` file in the same change.
5. **Commit & push on completion.** When a feature/task is done (or a standalone meta change lands), run `scripts/ai-commit.sh` per [.ai/workflows/commit-and-push.md](.ai/workflows/commit-and-push.md). One commit per completed unit. Never `--force` push.
6. **Lightweight > complete.** Prefer terse bullets over prose. If a doc grows past ~150 lines, split it.
7. **No clarifying questions** if the answer is in `.ai/`. If it isn't, add it after the user answers.

## Repo map
- `.ai/` — AI-SDLC scaffolding (this is the meta-layer)
- `.github/copilot-instructions.md` — mirrors this file for Copilot Chat
- Product code — TBD (see [.ai/context/architecture.md](.ai/context/architecture.md))
