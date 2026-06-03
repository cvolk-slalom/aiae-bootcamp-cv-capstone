# Backlog

> Ordered toward the [MVP](mvp.md). One line per item. Status: `todo` | `doing` | `done` | `parked`.
> IDs: `F` = product feature, `T` = infra/setup task. Never reuse IDs.

| Order | ID | Title | Silo | Status | Brief |
|------:|----|-------|------|--------|-------|
| 1 | F001 | Pick demo product concept + stack | meta | done | [ADR 0003](../decisions/0003-product-concept-and-stack.md) |
| 2 | T001 | Repo setup (pnpm workspaces, FE/BE/shared scaffolds, SQLite, plant data, dev loop) | meta, frontend, backend, shared | done | [briefs/T001-repo-setup.md](briefs/T001-repo-setup.md) |
| 3 | F003 | Step 1 — Inputs + Plan persistence (CRUD) | backend, shared, frontend | done | [briefs/F003-inputs-and-persistence.md](briefs/F003-inputs-and-persistence.md) |
| 4 | F004 | Step 2 — Companion recommender | backend, shared, frontend | done | [briefs/F004-companion-recommender.md](briefs/F004-companion-recommender.md) |
| 5 | F005 | Step 3 — Bed layout | backend, shared, frontend | todo | [briefs/F005-bed-layout.md](briefs/F005-bed-layout.md) |
| 6 | F006 | Step 4 — Frost & window timing | backend, shared, frontend | todo | [briefs/F006-frost-and-window-timing.md](briefs/F006-frost-and-window-timing.md) |
| 7 | F007 | Step 5 — Final plan + Markdown export | backend, shared, frontend | todo | [briefs/F007-final-plan-export.md](briefs/F007-final-plan-export.md) |

(F002 was retired during planning — do not reuse.)

## Conventions
- IDs are `F`/`T` + zero-padded sequence (F001, T001). Never reuse.
- Move a row to `done` rather than deleting it.
- Park (don't delete) items you defer; add a one-line reason in the title.
- Add a new row at the bottom unless order matters; if reordering, renumber the `Order` column.
