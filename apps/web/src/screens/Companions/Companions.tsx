import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, ApiError } from '../../api/client.js';
import type { CompanionsResult, Plant, PlanResponse } from '@gpb/shared';
import styles from './Companions.module.css';

export function CompanionsScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [result, setResult] = useState<CompanionsResult | null>(null);
  const [confirmed, setConfirmed] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;
    Promise.all([api.getPlan(id), api.listPlants(), api.getCompanionsRecommendations(id)])
      .then(([p, allPlants, r]) => {
        setPlan(p);
        setPlants(allPlants);
        setResult(r);
        setConfirmed(p.companions?.confirmedPlants ?? p.inputs?.desiredPlants ?? []);
      })
      .catch(() => setErrors(['Failed to load companions data.']))
      .finally(() => setLoading(false));
  }, [id]);

  const nameOf = useMemo(() => {
    const m = new Map(plants.map((p) => [p.id, p.name]));
    return (pid: string) => m.get(pid) ?? pid;
  }, [plants]);

  function add(pid: string) {
    setConfirmed((c) => (c.includes(pid) ? c : [...c, pid]));
  }
  function remove(pid: string) {
    setConfirmed((c) => c.filter((x) => x !== pid));
  }

  async function onSave() {
    if (!id) return;
    setBusy(true);
    setErrors([]);
    try {
      await api.updateCompanions(id, { confirmedPlants: confirmed });
      navigate(`/plans/${id}/layout`);
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
  if (!plan || !result) {
    return (
      <section className={styles.section}>
        <h2>Step 2 — Companions</h2>
        {errors.map((e, i) => <p key={i} className={styles.errors}>{e}</p>)}
      </section>
    );
  }

  const desired = plan.inputs?.desiredPlants ?? [];

  return (
    <section className={styles.section}>
      <h2>Step 2 — Companions</h2>

      <div className={styles.group}>
        <h3>Desired plants ({desired.length})</h3>
        <ul className={styles.list}>
          {desired.map((pid) => <li key={pid}>{nameOf(pid)}</li>)}
        </ul>
      </div>

      <div className={`${styles.group} ${styles.warn}`}>
        <h3>Discouraged pairs</h3>
        {result.discouraged.length === 0 ? (
          <p className={styles.muted}>None — your desired list plays nicely together.</p>
        ) : (
          <ul className={styles.list}>
            {result.discouraged.map((d) => (
              <li key={`${d.a}|${d.b}`} className={styles.row}>
                <span>{d.reason}</span>
                <span className={styles.actions}>
                  <button type="button" className={styles.smallBtn} onClick={() => remove(d.a)}>
                    Remove {nameOf(d.a)}
                  </button>
                  <button type="button" className={styles.smallBtn} onClick={() => remove(d.b)}>
                    Remove {nameOf(d.b)}
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.group}>
        <h3>Recommended companions</h3>
        {result.recommended.length === 0 ? (
          <p className={styles.muted}>No additional recommendations.</p>
        ) : (
          <ul className={styles.list}>
            {result.recommended.map((pid) => (
              <li key={pid} className={styles.row}>
                <span>{nameOf(pid)}</span>
                <button
                  type="button"
                  className={styles.smallBtn}
                  disabled={confirmed.includes(pid)}
                  onClick={() => add(pid)}
                >
                  {confirmed.includes(pid) ? 'Added' : 'Add'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.group}>
        <h3>Confirmed list ({confirmed.length})</h3>
        {confirmed.length === 0 ? (
          <p className={styles.muted}>Add at least one plant before continuing.</p>
        ) : (
          <ul className={styles.list}>
            {confirmed.map((pid) => (
              <li key={pid} className={styles.row}>
                <span>{nameOf(pid)}</span>
                <button type="button" className={styles.smallBtn} onClick={() => remove(pid)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={onSave} disabled={busy || confirmed.length === 0}>
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
