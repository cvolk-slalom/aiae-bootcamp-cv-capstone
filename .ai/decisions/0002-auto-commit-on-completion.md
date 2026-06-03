# ADR 0002: Auto-commit & push on task completion

- **Status:** Accepted
- **Date:** 2026-06-03
- **Silo(s):** meta

## Context
The repo is AI-built with a single human driver. Manual commit/push between turns adds friction and lets uncommitted AI-authored changes pile up, making the journal and ADR trail drift from git history. We want commits to be a routine, near-automatic end-step of every completed task.

## Decision
- Add a shell helper at [scripts/ai-commit.sh](../../scripts/ai-commit.sh) that stages all changes, commits with a structured message + AI-authored trailer, and pushes (setting upstream on first push).
- Add a workflow [.ai/workflows/commit-and-push.md](../workflows/commit-and-push.md) defining **when** to call it and the commit-message convention (`type: subject` + optional why-body referencing brief/ADR IDs).
- Wire it into [.ai/workflows/new-feature.md](../workflows/new-feature.md) as step 10 (after journal).
- Promote it to a hard rule in [AGENTS.md](../../AGENTS.md): commit on task completion; one commit per completed unit; never `--force` push.
- Default branch target is `main` for this demo (single driver). If the user signals an experiment in progress, ask once before pushing.

## Alternatives considered
- **Git pre-commit / post-merge hook that auto-commits on file save.** Rejected: too aggressive; would commit work-in-progress and bypass the brief/journal discipline.
- **CI job that opens a PR per AI change.** Rejected: heavy ceremony for a single-driver demo; defeats the "few prompts" goal.
- **Leave commits fully manual.** Rejected: that's the status quo we're replacing — it lets the trail rot.
- **One commit per file edit.** Rejected: noisy history; obscures the unit-of-work boundary.

## Consequences
- **Positive**
  - Journal entries, ADRs, and code land together in a single commit per task — easy to audit.
  - First-push UX is handled (`-u origin <branch>`).
  - AI-authored trailer makes provenance obvious in `git log`.
  - One predictable command for the agent: `scripts/ai-commit.sh "<type>: <subject>" "<body>"`.
- **Negative / trade-offs**
  - Agent must remember to invoke it (mitigated by listing as step 10 in `new-feature.md` and as a hard rule).
  - Push failures (non-fast-forward) need human intervention by design — no force-push escape hatch.
- **Follow-ups**
  - If we later adopt feature branches + PRs, supersede this ADR with one that adds branch-naming and a PR workflow.
