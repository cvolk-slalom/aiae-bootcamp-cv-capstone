# Brief: F004 — Step 2: Companion recommender

- **Silo(s):** backend, shared, frontend
- **Status:** todo
- **Date:** 2026-06-03

## Goal
Given the user's desired plants, suggest extra companions, flag antagonistic pairs, and let the user accept a confirmed plant list.

## Scope
- In:
  - `shared`: `CompanionsResult` Zod schema = `{ recommended: string[], discouraged: {a,b,reason}[] }`; `UpdateCompanionsRequest` = `{ confirmedPlants: string[] }`.
  - `api`:
    - `GET /plans/:id/companions/recommendations` → reads `inputs.desiredPlants`, runs recommender service, returns `CompanionsResult`. Does NOT persist.
    - `PATCH /plans/:id/companions` → validates that every `confirmedPlants` id exists in `plants.json`; persists; advances `step` to `"layout"`.
  - `services/companions.ts` (pure):
    - `recommend(desired, plantsDb)` returns up to 5 unique recommended ids: plants that appear as a `companion` of any desired plant AND are not already desired AND have no antagonist in the desired set.
    - `discouraged(desired, plantsDb)` returns every pair `(a,b)` from desired where `b ∈ plants[a].antagonists`. Reason string: `"<A> and <B> are antagonists"`.
  - `web`:
    - `/plans/:id/companions` screen shows: desired list, recommended list (each with "Add"), discouraged list (each with "Remove offender"), and a confirmed list the user edits.
    - "Save & continue" → PATCH then redirect to `/plans/:id/layout`.
- Out:
  - Reasoning text beyond the antagonist pair name. Layout. Timing.

## Acceptance
- [ ] With a desired list of `[tomato, basil, fennel]`, recommendations include sensible companions from `plants.json` and `(tomato, fennel)` appears in `discouraged`.
- [ ] User can add/remove plants from the confirmed list before saving.
- [ ] PATCH with an unknown plant id returns 400.
- [ ] After saving, reloading the page shows the saved confirmed list and recomputed recommendations.
- [ ] Service functions have vitest tests covering at least: empty desired, all-good list, list with one antagonist pair.

## Notes
- Recommender is intentionally simple — no scoring, no ranking. If user wants smarter recs later, that's a new brief + ADR.
