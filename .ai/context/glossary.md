# Glossary

> Domain & project terms. Keep entries to one line. Add a term the first time it appears in a requirement or ADR.

- **AI-SDLC** — the practice of running the software lifecycle (requirements → design → build → log) with AI agents as primary builders, humans as drivers/reviewers.
- **Silo** — a bounded area of the codebase (e.g., frontend, backend) with its own context file so agents can load minimal context.
- **ADR** — Architecture Decision Record. One file per non-trivial decision in `.ai/decisions/`.
- **Journal entry** — dated session log in `.ai/journal/` summarizing what changed and why.
- **Brief** — short per-feature requirement doc in `.ai/requirements/briefs/`.
- **MVP doc** — [.ai/requirements/mvp.md](../requirements/mvp.md). The product north star; read when in doubt about scope.
- **Plan** (product) — the persistent record produced by the wizard. Holds inputs, companions, layout, timing, final.
- **Wizard step** — one of `inputs | companions | layout | timing | final`. State persists between steps.
- **Companion** — a plant that benefits another when grown nearby.
- **Antagonist** — a plant that harms another when grown nearby.
- **Last-frost date** — anchor for all timing calculations (sow/transplant/harvest windows).
