import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, ApiError } from '../../api/client.js';
import type { Plant, PlanResponse, TimingResult } from '@gpb/shared';
import styles from './Timing.module.css';

type Row = TimingResult['perPlant'][number];
type DateField = 'startIndoorsOn' | 'directSowOn' | 'transplantOn' | 'harvestStart' | 'harvestEnd';
const FIELDS: { key: DateField; label: string }[] = [
  { key: 'startIndoorsOn', label: 'Start indoors' },
  { key: 'directSowOn', label: 'Direct sow' },
  { key: 'transplantOn', label: 'Transplant' },
  { key: 'harvestStart', label: 'Harvest start' },
  { key: 'harvestEnd', label: 'Harvest end' },
];

export function TimingScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
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
        if (p.timing) {
          setRows(p.timing.perPlant);
        } else {
          const sug = await api.getTimingSuggestion(id);
          setRows(sug.perPlant);
        }
      } catch {
        setErrors(['Failed to load timing.']);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const nameOf = useMemo(() => {
    const m = new Map(plants.map((p) => [p.id, p.name]));
    return (pid: string) => m.get(pid) ?? pid;
  }, [plants]);

  function setField(plantId: string, field: DateField, value: string) {
    setRows((rs) =>
      rs.map((r) => {
        if (r.plantId !== plantId) return r;
        const next = { ...r };
        if (value === '') delete next[field];
        else next[field] = value;
        return next;
      }),
    );
  }

  async function onSave() {
    if (!id) return;
    setBusy(true);
    setErrors([]);
    try {
      await api.updateTiming(id, { perPlant: rows });
      navigate(`/plans/${id}/final`);
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
  if (!plan) {
    return (
      <section className={styles.section}>
        <h2>Step 4 — Timing</h2>
        {errors.map((e, i) => <p key={i} className={styles.errors}>{e}</p>)}
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <h2>Step 4 — Timing</h2>
      <p className={styles.muted}>Last frost: {plan.inputs?.lastFrostDate ?? '—'}</p>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Plant</th>
            {FIELDS.map((f) => <th key={f.key}>{f.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.plantId}>
              <td>{nameOf(row.plantId)}</td>
              {FIELDS.map((f) => (
                <td key={f.key}>
                  <input
                    type="date"
                    value={row[f.key] ?? ''}
                    onChange={(e) => setField(row.plantId, f.key, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.actions}>
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
