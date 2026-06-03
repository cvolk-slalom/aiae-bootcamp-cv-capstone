# Testing

> Pragmatic, not exhaustive. This is a demo project.

## What to test
- Pure functions with non-trivial logic.
- API contracts (request → response shape).
- Critical user paths (one happy-path E2E per feature, if a feature has a UI).

## What NOT to test
- Framework internals.
- Trivial getters/setters.
- Generated code.

## Conventions
- Test files: `*.test.ts` / `*.test.py` next to source.
- One assertion concept per test; many assertions OK if they verify the same behavior.
- Tests should run in < 30s locally for the whole suite. If slower, split into unit vs. integration.
