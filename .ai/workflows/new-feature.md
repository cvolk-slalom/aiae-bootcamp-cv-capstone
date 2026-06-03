# Workflow: New Feature

Use this when the user asks for a new feature or non-trivial change.

## Steps

1. **Identify the silo(s).** Frontend, backend, shared, or multi. Load only those silo files from `.ai/context/silos/`.
2. **Find or create the backlog item.** Open [.ai/requirements/backlog.md](../requirements/backlog.md). If missing, add a row with the next `FNNN` ID and status `doing`.
3. **Write a brief.** Copy [.ai/requirements/brief-template.md](../requirements/brief-template.md) → `.ai/requirements/briefs/FNNN-kebab-title.md`. Fill in goal, scope, acceptance. **≤ 30 lines.**
4. **Discover context.** Run [context-discovery.md](context-discovery.md) to find any existing code/patterns that apply.
5. **Make non-trivial decisions explicit.** If you're about to choose a framework, library, pattern, data shape, or convention — pause and follow [record-decision.md](record-decision.md) **before** writing code.
6. **Build.** Smallest change that satisfies the brief's acceptance list.
7. **Update context.** If you changed structure, conventions, or stack: edit the matching `.ai/context/` files in the same change.
8. **Mark backlog `done`.** Update [.ai/requirements/backlog.md](../requirements/backlog.md) and link the brief.
9. **Journal it.** Follow [update-journal.md](update-journal.md).
10. **Commit & push.** Follow [commit-and-push.md](commit-and-push.md). One commit per completed unit of work.

## When to skip steps
- Trivial fix (typo, one-line tweak): skip 2, 3, 9. Step 10 still runs.
- Pure refactor with no behavior change: skip 3, but write an ADR if patterns change.
- Work-in-progress save: skip 10 unless the user asks to checkpoint.
