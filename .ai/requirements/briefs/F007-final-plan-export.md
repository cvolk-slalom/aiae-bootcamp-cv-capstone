# Brief: F007 — Step 5: Final plan + Markdown export

- **Silo(s):** backend, shared, frontend
- **Status:** todo
- **Date:** 2026-06-03

## Goal
Composite view of the whole plan with a one-click Markdown export the user can copy or download.

## Scope
- In:
  - `shared`: `FinalSummary` Zod schema = `{ summaryMarkdown: string }`; helper `renderPlanMarkdown(plan, plantsDb): string`.
  - `api`:
    - `POST /plans/:id/final` → calls `renderPlanMarkdown`, stores result in `final.summaryMarkdown`, sets `step: "final"`, returns the plan.
    - `GET /plans/:id/final.md` → returns the markdown as `text/markdown` (for download).
  - `services/render.ts` (pure):
    - Sections, in order: Title (plan name), Overview (zone, frost date, bed dims, light hours), Confirmed plants (bulleted with spacing + sun), Layout (ASCII or markdown table of the grid using plant short codes), Timing (markdown table per plant), Notes (any discouraged pairs the user kept).
  - `web`:
    - `/plans/:id/final` shows the rendered markdown (use a small renderer like `marked` — add via ADR if it counts as a new dep; otherwise inline a tiny renderer for headings/tables).
    - Buttons: "Copy markdown", "Download .md", "Back to start".
- Out:
  - PDF export, sharing links, multiple format options, theming.

## Acceptance
- [ ] After completing F003–F006, visiting `/plans/:id/final` shows a populated summary.
- [ ] "Copy markdown" puts the source markdown on the clipboard.
- [ ] "Download .md" downloads `<plan-name>.md`.
- [ ] Re-rendering after edits to earlier steps refreshes the summary (POST again).
- [ ] Service has vitest tests for: full plan (snapshot), partial plan (missing layout) handled gracefully.

## Notes
- This brief closes the MVP. After it lands, mark MVP acceptance items in [mvp.md](../mvp.md) and write a closing journal entry.
