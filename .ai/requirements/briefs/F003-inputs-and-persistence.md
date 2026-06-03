# Brief: F003 — Step 1: Inputs + Plan persistence

- **Silo(s):** shared, backend, frontend
- **Status:** todo
- **Date:** 2026-06-03

## Goal
User can create a new Plan, fill in step-1 inputs, save, and reload it by URL.

## Scope
- In:
  - `shared`: `Plan` + `PlanInputs` Zod schemas (matching [mvp.md](../mvp.md) shape); request/response schemas: `CreatePlanRequest`, `UpdateInputsRequest`, `PlanResponse`.
  - `api`:
    - `POST /plans` → creates a Plan with `step: "inputs"`, returns id.
    - `GET /plans/:id` → returns full Plan.
    - `PATCH /plans/:id/inputs` → validates with Zod, persists, advances `updatedAt`. Sets `step` to `"companions"` on success.
    - Persistence via the `plans` table (JSON blob in `data` column).
  - `web`:
    - `/` shows "New plan" button + list of recent plans (id + name + updated time, last 10).
    - `/plans/:id/inputs` is the form: name, zone, last-frost date (date picker), bed width/length (inches), light hours, desired plants (multi-select from `plants.json`).
    - "Save & continue" → PATCH then redirect to `/plans/:id/companions` (placeholder for F004).
- Out:
  - Companion logic, layout, timing, final view, export. Those are F004–F007.
  - Auth, plan deletion, plan rename UI beyond the inputs form.

## Acceptance
- [ ] Creating a plan from the home page lands on `/plans/:id/inputs`.
- [ ] Submitting valid inputs persists and redirects to `/plans/:id/companions`.
- [ ] Invalid inputs (e.g., negative dimensions, unknown plant id, bad date) show inline errors and do not persist.
- [ ] Reloading `/plans/:id/inputs` shows the saved values.
- [ ] Home page lists the plan after creation.
- [ ] Backend rejects requests that don't match the Zod schemas with 400 + field-level errors.

## Notes
- Plant list comes from `data/plants.json` exposed via `GET /plants` (cached in memory at startup).
- Bed dimensions are inches (integers). Light hours 0–16 (integer).
