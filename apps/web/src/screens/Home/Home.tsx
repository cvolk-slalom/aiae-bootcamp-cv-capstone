import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, ApiError } from '../../api/client.js';
import type { PlanSummary } from '@gpb/shared';
import styles from './Home.module.css';

export function HomeScreen() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<PlanSummary[]>([]);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.listPlans().then(setPlans).catch(() => setPlans([]));
  }, []);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Name is required.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const plan = await api.createPlan({ name: trimmed });
      navigate(`/plans/${plan.id}/inputs`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to create plan.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className={styles.section}>
      <h2>Start a new plan</h2>
      <form onSubmit={onCreate} className={styles.form}>
        <label>
          Plan name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Backyard bed 2026"
            disabled={busy}
          />
        </label>
        <button type="submit" disabled={busy}>{busy ? 'Creating...' : 'New plan'}</button>
        {error && <p className={styles.error}>{error}</p>}
      </form>

      <h2>Recent plans</h2>
      {plans.length === 0 ? (
        <p>No plans yet.</p>
      ) : (
        <ul className={styles.list}>
          {plans.map((p) => (
            <li key={p.id}>
              <Link to={`/plans/${p.id}/${p.step}`}>{p.name}</Link>
              <span className={styles.meta}>
                {p.step} · updated {new Date(p.updatedAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
