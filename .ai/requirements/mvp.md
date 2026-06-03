# MVP — Garden Plan Builder

> The product north star. **Read this whenever you're unsure what to build next.** If a proposed change doesn't serve this MVP, push back or write an ADR explaining why.

## One-liner
A guided wizard that turns a gardener's bed + plant wishes into a personalized planting plan: companions, layout, and timing.

## Who it's for
A single home gardener planning one raised bed for one season.

## The five-step flow (the entire MVP)
Each step persists its state. The user can stop and resume by URL. State is a single `Plan` record.

1. **Inputs** — name the plan, enter USDA zone, last-frost date, bed dimensions (W × L in inches), daily light hours, and the list of plants they *want*.
2. **Companion recommendations** — system suggests additional good companions, flags antagonistic pairs in the wish list, and lets the user accept/reject. Output: a confirmed plant list.
3. **Bed layout** — system packs the confirmed plants into the bed using per-plant spacing rules and the light constraint. Output: a grid the user can view and lightly tweak.
4. **Frost & window timing** — per plant, compute start-indoors / direct-sow / transplant / harvest-window dates from the frost date and plant metadata.
5. **Final plan** — composite view of inputs, layout, timing, and notes. Exportable as Markdown.

## Domain model (the single source of truth)
```ts
// packages/shared/src/plan.ts (target shape)
type Plan = {
  id: string;
  name: string;
  createdAt: string; updatedAt: string;
  step: 'inputs' | 'companions' | 'layout' | 'timing' | 'final';
  inputs?: {
    zone: string;
    lastFrostDate: string;            // ISO date
    bed: { widthIn: number; lengthIn: number };
    lightHours: number;
    desiredPlants: string[];          // plant ids
  };
  companions?: {
    recommended: string[];            // additions
    discouraged: Array<{a: string; b: string; reason: string}>;
    confirmedPlants: string[];        // final plant list user accepted
  };
  layout?: {
    cellSizeIn: number;
    grid: Array<{ x: number; y: number; plantId: string | null }>;
    unplaced: string[];
  };
  timing?: {
    perPlant: Array<{
      plantId: string;
      startIndoorsOn?: string;
      directSowOn?: string;
      transplantOn?: string;
      harvestStart?: string;
      harvestEnd?: string;
    }>;
  };
  final?: { summaryMarkdown: string };
};
```

## Plant data shape
```ts
// data/plants.json entries
type Plant = {
  id: string;            // 'tomato'
  name: string;          // 'Tomato'
  spacingIn: number;     // per-plant footprint
  sun: 'full' | 'partial' | 'shade';
  daysToMaturity: number;
  frostTolerance: 'tender' | 'hardy' | 'half-hardy';
  startIndoorsWeeksBeforeLastFrost?: number;
  transplantWeeksAfterLastFrost?: number;
  directSowWeeksRelativeToLastFrost?: number; // negative = before
  companions: string[];   // plant ids
  antagonists: string[];  // plant ids
};
```

## MVP acceptance (the whole product is "done" when)
- [ ] User can create a new plan and complete all 5 steps end-to-end.
- [ ] State persists between steps; reloading the URL resumes where they left off.
- [ ] Companion recommender uses the plant database (not stubs).
- [ ] Layout fills the bed without overlaps and respects spacing.
- [ ] Timing dates are computed from `lastFrostDate` + plant data.
- [ ] Final plan exports as Markdown.
- [ ] Plant database has ≥ 20 plants with realistic data.

## Explicitly out of scope (do NOT build)
- Authentication, multi-user, sharing.
- Multiple beds per plan, multi-season planning.
- Drag-and-drop layout editor (table-style grid is fine).
- Live weather / soil / GPS integrations.
- Editing the plant database in-app.
- Mobile-native UI; responsive web is enough.
- Image uploads or plant photos.

## Task breakdown
See [backlog.md](backlog.md). The order is:

| Order | ID | Title | Brief |
|---|---|---|---|
| 1 | F001 | Pick concept + stack | done — see [ADR 0003](../decisions/0003-product-concept-and-stack.md) |
| 2 | T001 | Repo setup (monorepo, FE/BE/shared scaffolds, DB, CI-less dev loop) | [briefs/T001-repo-setup.md](briefs/T001-repo-setup.md) |
| 3 | F003 | Step 1 — Inputs + persistence (Plan CRUD) | [briefs/F003-inputs-and-persistence.md](briefs/F003-inputs-and-persistence.md) |
| 4 | F004 | Step 2 — Companion recommender | [briefs/F004-companion-recommender.md](briefs/F004-companion-recommender.md) |
| 5 | F005 | Step 3 — Bed layout | [briefs/F005-bed-layout.md](briefs/F005-bed-layout.md) |
| 6 | F006 | Step 4 — Frost & window timing | [briefs/F006-frost-and-window-timing.md](briefs/F006-frost-and-window-timing.md) |
| 7 | F007 | Step 5 — Final plan + Markdown export | [briefs/F007-final-plan-export.md](briefs/F007-final-plan-export.md) |

## For an agent resuming cold
1. Read [AGENTS.md](../../AGENTS.md), [.ai/context/project.md](../context/project.md), [.ai/context/architecture.md](../context/architecture.md).
2. Read this file.
3. Read the silo files relevant to the next backlog item.
4. Read the brief for the next backlog item.
5. Run [.ai/workflows/new-feature.md](../workflows/new-feature.md).
