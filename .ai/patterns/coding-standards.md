# Coding Standards

> Cross-silo defaults. Silo-specific overrides live in `.ai/context/silos/<silo>.md`.

## General
- Prefer clarity over cleverness. Small functions, named constants.
- No dead code. No commented-out blocks. No TODOs without an owner + backlog ID.
- Comments explain **why**, not what. One short line unless absolutely necessary.
- Match existing style in the file. Don't drive-by refactor.

## Naming
- `kebab-case` for files, `camelCase` for variables/functions, `PascalCase` for types/components.
- Booleans read as questions: `isReady`, `hasError`.

## Errors
- Fail loudly at boundaries (user input, external APIs). Trust internal calls.
- Never swallow exceptions silently.

## Dependencies
- Adding a dependency requires an ADR if it's a framework, runtime, or anything > ~50KB minified.
- Pin versions in lockfiles. Don't use `^` in package.json without intent.

## AI-authored code
- Don't add files or abstractions "for future use".
- Don't add validation, error handling, or fallbacks for scenarios that can't happen.

## Environment & module loading
- Read env vars **inside functions**, not at module top-level. ES module imports are hoisted, so `process.env.X = ...` set in a test file runs *after* a top-level `const X = process.env.X` in the imported module — silently using the wrong value (e.g. the real DB instead of `:memory:`).
