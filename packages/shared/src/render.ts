import type { Plan } from './plan.js';
import type { Plant } from './plant.js';

export type PlantsDb = Map<string, Plant>;

function nameOf(db: PlantsDb, id: string): string {
  return db.get(id)?.name ?? id;
}

function shortCode(db: PlantsDb, id: string): string {
  const n = db.get(id)?.name ?? id;
  return n.replace(/[^A-Za-z0-9]/g, '').slice(0, 4) || id.slice(0, 4);
}

function renderOverview(plan: Plan): string {
  const lines = ['## Overview', ''];
  if (plan.inputs) {
    lines.push(`- **Zone:** ${plan.inputs.zone}`);
    lines.push(`- **Last frost:** ${plan.inputs.lastFrostDate}`);
    lines.push(`- **Bed:** ${plan.inputs.bed.widthIn}″ × ${plan.inputs.bed.lengthIn}″`);
    lines.push(`- **Light hours:** ${plan.inputs.lightHours}`);
  } else {
    lines.push('_Inputs not set._');
  }
  return lines.join('\n');
}

function renderConfirmed(plan: Plan, db: PlantsDb): string {
  const lines = ['## Confirmed plants', ''];
  const ids = plan.companions?.confirmedPlants ?? [];
  if (ids.length === 0) {
    lines.push('_None confirmed yet._');
    return lines.join('\n');
  }
  for (const id of ids) {
    const p = db.get(id);
    if (!p) {
      lines.push(`- ${id} _(unknown)_`);
      continue;
    }
    lines.push(`- **${p.name}** — ${p.spacingIn}″ spacing, ${p.sun} sun`);
  }
  return lines.join('\n');
}

function renderLayout(plan: Plan, db: PlantsDb): string {
  const lines = ['## Layout', ''];
  const layout = plan.layout;
  if (!layout || layout.cols === 0 || layout.rows === 0) {
    lines.push('_No layout._');
    return lines.join('\n');
  }
  lines.push(`Cell size: ${layout.cellSizeIn}″ · Grid: ${layout.cols} × ${layout.rows}`);
  lines.push('');
  const header = ['', ...Array.from({ length: layout.cols }, (_, x) => `${x + 1}`)];
  lines.push(`| ${header.join(' | ')} |`);
  lines.push(`| ${header.map(() => '---').join(' | ')} |`);
  const byKey = new Map<string, string | null>();
  for (const c of layout.grid) byKey.set(`${c.x},${c.y}`, c.plantId);
  for (let y = 0; y < layout.rows; y++) {
    const row: string[] = [`**${y + 1}**`];
    for (let x = 0; x < layout.cols; x++) {
      const pid = byKey.get(`${x},${y}`) ?? null;
      row.push(pid ? shortCode(db, pid) : '·');
    }
    lines.push(`| ${row.join(' | ')} |`);
  }
  if (layout.unplaced.length > 0) {
    lines.push('');
    lines.push(`**Unplaced:** ${layout.unplaced.map((id) => nameOf(db, id)).join(', ')}`);
  }
  return lines.join('\n');
}

function renderTiming(plan: Plan, db: PlantsDb): string {
  const lines = ['## Timing', ''];
  const rows = plan.timing?.perPlant ?? [];
  if (rows.length === 0) {
    lines.push('_No timing set._');
    return lines.join('\n');
  }
  lines.push('| Plant | Start indoors | Direct sow | Transplant | Harvest start | Harvest end |');
  lines.push('| --- | --- | --- | --- | --- | --- |');
  for (const r of rows) {
    lines.push(
      `| ${nameOf(db, r.plantId)} | ${r.startIndoorsOn ?? '—'} | ${r.directSowOn ?? '—'} | ${r.transplantOn ?? '—'} | ${r.harvestStart ?? '—'} | ${r.harvestEnd ?? '—'} |`,
    );
  }
  return lines.join('\n');
}

function renderNotes(plan: Plan, db: PlantsDb): string {
  const lines = ['## Notes', ''];
  const confirmed = new Set(plan.companions?.confirmedPlants ?? []);
  const kept = (plan.companions?.discouraged ?? []).filter((d) => confirmed.has(d.a) && confirmed.has(d.b));
  if (kept.length === 0) {
    lines.push('_No discouraged pairs kept._');
    return lines.join('\n');
  }
  for (const d of kept) {
    lines.push(`- ⚠️ Kept discouraged pair **${nameOf(db, d.a)}** + **${nameOf(db, d.b)}** — ${d.reason}`);
  }
  return lines.join('\n');
}

export function renderPlanMarkdown(plan: Plan, db: PlantsDb): string {
  const blocks = [
    `# ${plan.name}`,
    renderOverview(plan),
    renderConfirmed(plan, db),
    renderLayout(plan, db),
    renderTiming(plan, db),
    renderNotes(plan, db),
  ];
  return blocks.join('\n\n') + '\n';
}
