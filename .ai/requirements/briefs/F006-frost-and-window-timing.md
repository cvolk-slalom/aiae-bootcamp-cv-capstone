# Brief: F006 — Step 4: Frost & window timing

- **Silo(s):** backend, shared, frontend
- **Status:** todo
- **Date:** 2026-06-03

## Goal
Per confirmed plant, compute start-indoors / direct-sow / transplant / harvest-window dates from `inputs.lastFrostDate` and plant metadata.

## Scope
- In:
  - `shared`: `TimingResult` Zod schema = `{ perPlant: PlantTiming[] }` where `PlantTiming = { plantId, startIndoorsOn?, directSowOn?, transplantOn?, harvestStart?, harvestEnd? }` (all ISO date strings).
  - `api`:
    - `GET /plans/:id/timing/suggestion` → runs timing service, returns `TimingResult`.
    - `PATCH /plans/:id/timing` → validates dates are ISO and each `plantId` is in `confirmedPlants`; persists; advances `step` to `"final"`.
  - `services/timing.ts` (pure, dependency-free):
    - `addWeeks(date, n)` helper.
    - For each plant in `confirmedPlants`:
      - If `startIndoorsWeeksBeforeLastFrost` set → `startIndoorsOn = lastFrostDate - n weeks`.
      - If `transplantWeeksAfterLastFrost` set → `transplantOn = lastFrostDate + n weeks`.
      - If `directSowWeeksRelativeToLastFrost` set → `directSowOn = lastFrostDate + n weeks` (negative ok).
      - `harvestStart = (transplantOn || directSowOn || lastFrostDate) + daysToMaturity days`.
      - `harvestEnd = harvestStart + 21 days` (MVP-fixed harvest window).
  - `web`:
    - `/plans/:id/timing` shows a table: plant | start indoors | direct sow | transplant | harvest. Empty cells render as "—".
    - Each date is editable (date input); "Save & continue" → PATCH then redirect to `/plans/:id/final`.
- Out:
  - Calendar/ICS export. Reminders. Weather-aware adjustments. Zone-specific tweaks beyond frost date.

## Acceptance
- [ ] With `lastFrostDate = 2026-05-01` and a tomato (`startIndoorsWeeksBeforeLastFrost: 6`, `transplantWeeksAfterLastFrost: 2`, `daysToMaturity: 75`), dates match: start indoors 2026-03-20, transplant 2026-05-15, harvest start 2026-07-29.
- [ ] Plants missing all timing fields render with all dashes and no errors.
- [ ] User edits persist exactly; reload shows them.
- [ ] Service has vitest tests for: indoors+transplant plant, direct-sow plant, no-data plant.

## Notes
- All math in UTC. No timezone handling beyond ISO date strings.
