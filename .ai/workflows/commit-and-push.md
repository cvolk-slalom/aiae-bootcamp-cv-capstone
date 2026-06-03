# Workflow: Commit & Push

Trigger: a feature, task, or non-trivial unit of work is **complete** (acceptance items met, journal updated). Also fine after a meaningful checkpoint (e.g., scaffolding done, ADR landed).

## When to run
- After [new-feature.md](new-feature.md) step 9 (journal updated).
- After landing a standalone ADR or context update that is itself the deliverable.
- **Not** after every file edit — batch related changes into one commit.

## How to run
Use the helper so commits are consistent:

```bash
scripts/ai-commit.sh "<type>: <subject>" "<optional body>"
```

`<type>` ∈ `feat | fix | chore | docs | refactor | test | meta`
- `meta` is for changes to the `.ai/` scaffold itself.

The helper stages everything, commits with an AI-authored trailer, and pushes (setting upstream on first push of a branch).

## Commit message conventions
- Subject ≤ 72 chars, imperative mood (`feat: add login endpoint`, not `added login`).
- Body (optional) explains **why**, references brief / ADR / backlog IDs.

Example:
```bash
scripts/ai-commit.sh \
  "feat(api): add /health endpoint (F003)" \
  "Implements brief F003. ADR 0004 chose FastAPI for the backend silo."
```

## Branching
- Default: commit directly to `main` for this demo project (single driver, AI-built).
- If the user is mid-experiment, ask once before pushing; otherwise just push.

## Failure modes
- **Working tree clean:** helper exits 0 with a notice. Nothing to do.
- **No upstream:** helper sets one on first push (`git push -u origin <branch>`).
- **Push rejected:** stop, report to user, do **not** force-push.
