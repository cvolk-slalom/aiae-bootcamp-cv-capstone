import type { LayoutResult, Plant } from '@gpb/shared';
import type { PlantsDb } from './companions.js';

export const MIN_CELL_IN = 6;
export const MAX_CELL_IN = 24;

export interface LayoutInput {
  bed: { widthIn: number; lengthIn: number };
  confirmedPlants: string[];
  lightHours: number;
}

// Footprint per plant = ceil(spacingIn / cellSizeIn)^2 cells (greedy, row-major).
export function computeLayout(input: LayoutInput, db: PlantsDb): LayoutResult {
  const { bed, confirmedPlants, lightHours } = input;

  const plants: Plant[] = [];
  for (const id of confirmedPlants) {
    const p = db.get(id);
    if (p) plants.push(p);
  }

  const unplaced: string[] = [];
  const usable: Plant[] = [];
  for (const p of plants) {
    if (lightHours < 6 && p.sun === 'full') {
      unplaced.push(p.id);
    } else {
      usable.push(p);
    }
  }

  const rawMax = usable.length > 0 ? Math.max(...usable.map((p) => p.spacingIn)) : MIN_CELL_IN;
  const cellSizeIn = Math.min(MAX_CELL_IN, Math.max(MIN_CELL_IN, rawMax));
  const cols = Math.max(0, Math.floor(bed.widthIn / cellSizeIn));
  const rows = Math.max(0, Math.floor(bed.lengthIn / cellSizeIn));

  const occ: (string | null)[][] = Array.from({ length: rows }, () => Array<string | null>(cols).fill(null));

  const sorted = [...usable].sort((a, b) => b.spacingIn - a.spacingIn);
  for (const p of sorted) {
    const fp = Math.max(1, Math.ceil(p.spacingIn / cellSizeIn));
    let placed = false;
    for (let y = 0; y + fp <= rows && !placed; y++) {
      for (let x = 0; x + fp <= cols && !placed; x++) {
        let free = true;
        for (let dy = 0; dy < fp && free; dy++) {
          for (let dx = 0; dx < fp && free; dx++) {
            if (occ[y + dy]![x + dx] !== null) free = false;
          }
        }
        if (!free) continue;
        for (let dy = 0; dy < fp; dy++) {
          for (let dx = 0; dx < fp; dx++) {
            occ[y + dy]![x + dx] = p.id;
          }
        }
        placed = true;
      }
    }
    if (!placed) unplaced.push(p.id);
  }

  const grid: LayoutResult['grid'] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      grid.push({ x, y, plantId: occ[y]![x] ?? null });
    }
  }

  return { cellSizeIn, cols, rows, grid, unplaced };
}

export interface LayoutValidationError {
  formErrors: string[];
  fieldErrors: Record<string, string[]>;
}

// Structural validation beyond Zod: dimensions match bed, cells unique & in-bounds, plantIds known.
export function validateLayout(
  layout: LayoutResult,
  bed: { widthIn: number; lengthIn: number },
  confirmedPlants: string[],
): LayoutValidationError | null {
  const errors: string[] = [];

  const expectedCols = Math.max(0, Math.floor(bed.widthIn / layout.cellSizeIn));
  const expectedRows = Math.max(0, Math.floor(bed.lengthIn / layout.cellSizeIn));
  if (layout.cols !== expectedCols || layout.rows !== expectedRows) {
    errors.push(
      `dimensions mismatch: expected ${expectedCols}x${expectedRows} for bed ${bed.widthIn}x${bed.lengthIn} @ cell ${layout.cellSizeIn}in, got ${layout.cols}x${layout.rows}`,
    );
  }

  if (layout.grid.length !== layout.cols * layout.rows) {
    errors.push(`grid length ${layout.grid.length} != cols*rows ${layout.cols * layout.rows}`);
  }

  const seen = new Set<string>();
  const confirmed = new Set(confirmedPlants);
  for (const cell of layout.grid) {
    if (cell.x < 0 || cell.x >= layout.cols || cell.y < 0 || cell.y >= layout.rows) {
      errors.push(`cell out of bounds: (${cell.x},${cell.y})`);
      continue;
    }
    const key = `${cell.x},${cell.y}`;
    if (seen.has(key)) errors.push(`overlapping cell at (${cell.x},${cell.y})`);
    seen.add(key);
    if (cell.plantId !== null && !confirmed.has(cell.plantId)) {
      errors.push(`cell (${cell.x},${cell.y}) references unknown plant '${cell.plantId}'`);
    }
  }

  if (errors.length === 0) return null;
  return { formErrors: errors, fieldErrors: {} };
}
