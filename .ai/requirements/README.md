# Requirements

Three levels:

1. **[mvp.md](mvp.md)** — product north star. The whole MVP in one page. **Always start here** when planning work.
2. **[backlog.md](backlog.md)** — ordered list of tasks driving toward the MVP. One-line rows.
3. **[briefs/](briefs/)** — one short file per non-trivial task, written *just before* building it. Use [brief-template.md](brief-template.md).

## Rules
- Trivial items (typos, tiny tweaks) → skip the brief, just do it.
- Non-trivial items → brief first, then build.
- A brief is **≤ 30 lines**. If it grows, split the task.
- Update `backlog.md` status when an item starts/finishes.
- Briefs are kept after build as historical record — do not delete.
- If the MVP changes, update `mvp.md` in the same change and write an ADR.
