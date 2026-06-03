# File Organization

## Top-level (planned, set in stack ADR)
```
apps/         # or src/ — runnable applications
  web/        # frontend silo
  api/        # backend silo
packages/     # or src/shared/ — reusable cross-silo code
  shared/
.ai/          # AI-SDLC scaffolding (this layer)
.github/      # CI + Copilot config
```

## Rules
- A new top-level dir requires an ADR.
- Tests live next to the code they test (`foo.ts` + `foo.test.ts`) unless the framework dictates otherwise.
- Config files at the repo root only when the tool requires it; otherwise tuck under `config/`.
- One responsibility per file. If a file exceeds ~300 lines, consider splitting.
