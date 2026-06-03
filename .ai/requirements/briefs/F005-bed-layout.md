# Brief: F005 — Step 3: Bed layout

- **Silo(s):** backend, shared, frontend
- **Status:** todo
- **Date:** 2026-06-03

## Goal
Pack the confirmed plants into the bed grid using per-plant spacing rules. Show the result as a styled table the user can lightly tweak.

## Scope
- In:
  - `shared`: `LayoutResult` Zod schema = `{ cellSizeIn: number, cols: number, rows: number, grid: {x,y,plantId|null}[], unplaced: string[] }`; `UpdateLayoutRequest` = full `LayoutResult` after user tweaks.
  - `api`:
    - `GET /plans/:id/layout/suggestion` → runs layout service on `inputs.bed` + `companions.confirmedPlants`, returns `LayoutResult`. Does NOT persist.
    - `PATCH /plans/:id/layout` → validates: no overlapping cells, every `plantId` is in `confirmedPlants` or null, dimensions match `inputs.bed`; persists; advances `step` to `"timing"`.
  - `services/layout.ts` (pure):
    - Cell size = max(`spacingIn`) of confirmed plants, clamped 6–24 in. `cols = floor(width/cell)`, `rows = floor(length/cell)`.
    - Greedy packer: sort plants by `spacingIn` desc; for each plant, claim the next available cell(s) needed to satisfy its spacing footprint (round up to whole cells). If no space, push to `unplaced`.
    - Light filter (MVP-simple): if `inputs.lightHours < 6`, demote `sun: 'full'` plants to `unplaced`.
  - `web`:
    - `/plans/:id/layout` shows: a CSS-grid table (`cols × rows`), each cell labeled with plant name or empty; an "unplaced" list; a dropdown per cell to override.
    - "Save & continue" → PATCH then redirect to `/plans/:id/timing`.
- Out:
  - Drag-and-drop. Optimal packing. Multiple beds. Vertical/3D layouts.

## Acceptance
- [ ] A 48×96 in bed with 6 plants produces a grid with no overlapping plants and respects each plant's spacing.
- [ ] Plants that don't fit appear in `unplaced`.
- [ ] Low-light input (lightHours < 6) sends `sun: full` plants to `unplaced`.
- [ ] User can manually move/clear a cell; PATCH persists exactly what's shown.
- [ ] Service has vitest tests: empty list, oversized plant, light-limited case.

## Notes
- Spacing model is "footprint = ceil(spacingIn / cellSize)² cells". Documented inline.
