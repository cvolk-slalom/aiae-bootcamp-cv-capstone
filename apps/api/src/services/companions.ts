import type { CompanionsResult, Plant } from '@gpb/shared';

export type PlantsDb = Map<string, Plant>;

export function recommend(desired: string[], db: PlantsDb): string[] {
  const desiredSet = new Set(desired);
  const out: string[] = [];
  const seen = new Set<string>();

  for (const id of desired) {
    const plant = db.get(id);
    if (!plant) continue;
    for (const candidateId of plant.companions) {
      if (desiredSet.has(candidateId) || seen.has(candidateId)) continue;
      const candidate = db.get(candidateId);
      if (!candidate) continue;
      const conflicts = candidate.antagonists.some((a) => desiredSet.has(a));
      if (conflicts) continue;
      seen.add(candidateId);
      out.push(candidateId);
      if (out.length >= 5) return out;
    }
  }
  return out;
}

export function discouraged(desired: string[], db: PlantsDb): CompanionsResult['discouraged'] {
  const result: CompanionsResult['discouraged'] = [];
  const emitted = new Set<string>();

  for (const aId of desired) {
    const a = db.get(aId);
    if (!a) continue;
    for (const bId of a.antagonists) {
      if (!desired.includes(bId)) continue;
      const [lo, hi] = aId < bId ? [aId, bId] : [bId, aId];
      const key = `${lo}|${hi}`;
      if (emitted.has(key)) continue;
      emitted.add(key);
      const loName = db.get(lo)?.name ?? lo;
      const hiName = db.get(hi)?.name ?? hi;
      result.push({ a: lo, b: hi, reason: `${loName} and ${hiName} are antagonists` });
    }
  }
  return result;
}

export function buildCompanionsResult(desired: string[], db: PlantsDb): CompanionsResult {
  return { recommended: recommend(desired, db), discouraged: discouraged(desired, db) };
}
