import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, ApiError } from '../../api/client.js';
import type { LayoutResult, Plant, PlanResponse } from '@gpb/shared';
import styles from './Layout.module.css';

export function LayoutScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [layout, setLayout] = useState<LayoutResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const [p, allPlants] = await Promise.all([api.getPlan(id), api.listPlants()]);
        setPlan(p);
        setPlants(allPlants);
        setLayout(p.layout ?? (await api.getLayoutSuggestion(id)));
      } catch {
        setErrors(['Failed to load layout.']);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const nameOf = useMemo(() => {
    const m = new Map(plants.map((p) => [p.id, p.name]));
    return (pid: string) => m.get(pid) ?? pid;
  }, [plants]);

  const confirmed = plan?.companions?.confirmedPlants ?? [];

  function setCell(x: number, y: number, plantId: string | null) {
    if (!layout) return;
    setLayout({
      ...layout,
      grid: layout.grid.map((c) => (c.x === x && c.y === y ? { ...c, plantId } : c)),
      unplaced: layout.unplaced, // recomputed below if needed
    });
  }

  async function regenerate() {
    if (!id) return;
    setBusy(true);
    setErrors([]);
    try {
      const fresh = await api.getLayoutSuggestion(id);
      setLayout(fresh);
    } catch {
      setErrors(['Failed to regenerate.']);
    } finally {
      setBusy(false);
    }
  }

  async function onSave() {
    if (!id || !layout) return;
    setBusy(true);
    setErrors([]);
    try {
      await api.updateLayout(id, layout);
      navigate(`/plans/${id}/timing`);
    } catch (err) {
      if (err instanceof ApiError && err.body && typeof err.body === 'object') {
        const e = err.body as { errors?: { formErrors?: string[]; fieldErrors?: Record<string, string[]> } };
        const formErrs = e.errors?.formErrors ?? [];
        const fieldErrs = Object.entries(e.errors?.fieldErrors ?? {}).flatMap(([k, vs]) =>
          (vs ?? []).map((v) => `${k}: ${v}`),
        );
        const all = [...formErrs, ...fieldErrs];
        setErrors(all.length > 0 ? all : ['Save failed.']);
      } else {
        setErrors(['Save failed.']);
      }
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <p>Loading…</p>;
  if (!plan || !layout) {
    return (
      <section className={styles.section}>
        <h2>Step 3 — Layout</h2>
        {errors.map((e, i) => <p key={i} className={styles.errors}>{e}</p>)}
      </section>
    );
  }

  // Build a 2D view from the flat grid.
  const cellByPos = new Map<string, string | null>();
  for (const c of layout.grid) cellByPos.set(`${c.x},${c.y}`, c.plantId);

  return (
    <section className={styles.section}>
      <h2>Step 3 — Layout</h2>
      <p className={styles.meta}>
        Cell size: {layout.cellSizeIn} in · {layout.cols} × {layout.rows} cells ·
        Bed: {plan.inputs?.bed.widthIn} × {plan.inputs?.bed.lengthIn} in
      </p>

      <div
        className={styles.grid}
        style={{ gridTemplateColumns: `repeat(${layout.cols}, minmax(7rem, 1fr))` }}
      >
        {Array.from({ length: layout.rows }).flatMap((_, y) =>
          Array.from({ length: layout.cols }).map((_, x) => {
            const pid = cellByPos.get(`${x},${y}`) ?? null;
            return (
              <div key={`${x},${y}`} className={styles.cell}>
                <select
                  value={pid ?? ''}
                  onChange={(e) => setCell(x, y, e.target.value === '' ? null : e.target.value)}
                >
                  <option value="">— empty —</option>
                  {confirmed.map((cid) => (
                    <option key={cid} value={cid}>
                      {nameOf(cid)}
                    </option>
                  ))}
                </select>
              </div>
            );
          }),
        )}
      </div>

      <div className={styles.unplaced}>
        <h3>Unplaced ({layout.unplaced.length})</h3>
        {layout.unplaced.length === 0 ? (
          <p>Everything fit.</p>
        ) : (
          <ul>
            {layout.unplaced.map((pid) => (
              <li key={pid}>{nameOf(pid)}</li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={regenerate} disabled={busy}>
          Regenerate suggestion
        </button>
        <button type="button" onClick={onSave} disabled={busy}>
          {busy ? 'Saving…' : 'Save & continue'}
        </button>
      </div>

      {errors.length > 0 && (
        <ul className={styles.errors}>
          {errors.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
      )}
    </section>
  );
}
