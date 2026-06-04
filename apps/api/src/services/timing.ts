import type { TimingResult, Plant } from '@gpb/shared';
import type { PlantsDb } from './companions.js';

const MS_PER_DAY = 86_400_000;
const HARVEST_WINDOW_DAYS = 21;

// Parse 'YYYY-MM-DD' into a UTC midnight epoch ms. Throws on bad shape.
function parseUtcDate(iso: string): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) throw new Error(`invalid ISO date: ${iso}`);
  return Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

function toIso(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

export function addDays(iso: string, days: number): string {
  return toIso(parseUtcDate(iso) + days * MS_PER_DAY);
}

export function addWeeks(iso: string, weeks: number): string {
  return addDays(iso, weeks * 7);
}

export function computeTiming(
  lastFrostDate: string,
  confirmedPlants: string[],
  db: PlantsDb,
): TimingResult {
  const perPlant: TimingResult['perPlant'] = [];

  for (const id of confirmedPlants) {
    const plant: Plant | undefined = db.get(id);
    if (!plant) {
      perPlant.push({ plantId: id });
      continue;
    }

    const row: TimingResult['perPlant'][number] = { plantId: id };

    if (plant.startIndoorsWeeksBeforeLastFrost !== undefined) {
      row.startIndoorsOn = addWeeks(lastFrostDate, -plant.startIndoorsWeeksBeforeLastFrost);
    }
    if (plant.transplantWeeksAfterLastFrost !== undefined) {
      row.transplantOn = addWeeks(lastFrostDate, plant.transplantWeeksAfterLastFrost);
    }
    if (plant.directSowWeeksRelativeToLastFrost !== undefined) {
      row.directSowOn = addWeeks(lastFrostDate, plant.directSowWeeksRelativeToLastFrost);
    }

    const startFor = row.transplantOn ?? row.directSowOn;
    if (startFor !== undefined) {
      row.harvestStart = addDays(startFor, plant.daysToMaturity);
      row.harvestEnd = addDays(row.harvestStart, HARVEST_WINDOW_DAYS);
    }

    perPlant.push(row);
  }

  return { perPlant };
}
