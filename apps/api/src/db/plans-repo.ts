import type { DB } from './index.js';
import { PlanSchema, type Plan, type PlanSummary } from '@gpb/shared';

export class PlansRepo {
  constructor(private readonly db: DB) {}

  insert(plan: Plan): void {
    this.db
      .prepare(
        `INSERT INTO plans (id, data, created_at, updated_at) VALUES (?, ?, ?, ?)`,
      )
      .run(plan.id, JSON.stringify(plan), plan.createdAt, plan.updatedAt);
  }

  update(plan: Plan): void {
    const res = this.db
      .prepare(`UPDATE plans SET data = ?, updated_at = ? WHERE id = ?`)
      .run(JSON.stringify(plan), plan.updatedAt, plan.id);
    if (res.changes === 0) throw new Error(`plan ${plan.id} not found`);
  }

  get(id: string): Plan | undefined {
    const row = this.db.prepare(`SELECT data FROM plans WHERE id = ?`).get(id) as
      | { data: string }
      | undefined;
    if (!row) return undefined;
    return PlanSchema.parse(JSON.parse(row.data));
  }

  list(limit = 10): PlanSummary[] {
    const rows = this.db
      .prepare(`SELECT data FROM plans ORDER BY updated_at DESC LIMIT ?`)
      .all(limit) as Array<{ data: string }>;
    return rows.map((r) => {
      const p = PlanSchema.parse(JSON.parse(r.data));
      return { id: p.id, name: p.name, step: p.step, updatedAt: p.updatedAt };
    });
  }
}
