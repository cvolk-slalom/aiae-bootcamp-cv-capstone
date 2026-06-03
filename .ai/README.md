# .ai/ — AI-SDLC Scaffolding

This directory is the **meta-layer** of the project. It teaches an AI agent how to build, change, and reason about the product code without conversation history.

## Layout
```
.ai/
  context/        # What exists / what we're building (split by silo)
    project.md
    architecture.md
    glossary.md
    silos/
      frontend.md
      backend.md
      shared.md
  decisions/      # ADRs — one file per decision, append-only
  requirements/   # Lightweight backlog + per-feature briefs
  patterns/       # Coding standards, file org, testing
  workflows/      # Step-by-step recipes the AI follows
  journal/        # Dated session log — what changed, why
```

## Principles
1. **Token-efficient.** Each file is short and single-purpose. Agents load the minimum.
2. **Silo-scoped context.** Frontend/backend/etc. live in separate files so agents only load what's relevant.
3. **Self-maintaining.** Workflows mandate updating context, ADRs, and the journal when work happens.
4. **No history required.** A new chat with zero prior context should be productive after reading [AGENTS.md](../AGENTS.md) + 1–2 silo files.
