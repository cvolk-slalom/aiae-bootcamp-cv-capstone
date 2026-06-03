# Requirements

Lightweight, token-efficient capture. Two levels only:

1. **[backlog.md](backlog.md)** — single-page list of one-line items. Source of truth for "what's next".
2. **[briefs/](briefs/)** — one short file per non-trivial feature, written *just before* building it. Use [brief-template.md](brief-template.md).

## Rules
- Trivial items (typos, tiny tweaks) → skip the brief, just do it.
- Non-trivial items (new feature, new endpoint, new screen) → brief first, then build.
- A brief is **≤ 30 lines**. If it grows, split the feature.
- Update `backlog.md` status when an item starts/finishes.
- Briefs are kept after build as historical record — do not delete.
