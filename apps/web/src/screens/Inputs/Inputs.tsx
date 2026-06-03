import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, ApiError } from '../../api/client.js';
import { UpdateInputsRequestSchema, type Plant, type UpdateInputsRequest } from '@gpb/shared';
import styles from './Inputs.module.css';

type FormState = {
  zone: string;
  lastFrostDate: string;
  widthIn: string;
  lengthIn: string;
  lightHours: string;
  desiredPlants: string[];
};

const EMPTY: FormState = {
  zone: '',
  lastFrostDate: '',
  widthIn: '',
  lengthIn: '',
  lightHours: '',
  desiredPlants: [],
};

export function InputsScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;
    Promise.all([api.getPlan(id), api.listPlants()])
      .then(([plan, allPlants]) => {
        setPlants(allPlants);
        if (plan.inputs) {
          setForm({
            zone: plan.inputs.zone,
            lastFrostDate: plan.inputs.lastFrostDate,
            widthIn: String(plan.inputs.bed.widthIn),
            lengthIn: String(plan.inputs.bed.lengthIn),
            lightHours: String(plan.inputs.lightHours),
            desiredPlants: plan.inputs.desiredPlants,
          });
        }
      })
      .catch(() => setErrors(['Failed to load plan.']))
      .finally(() => setLoading(false));
  }, [id]);

  const candidate = useMemo<UpdateInputsRequest | null>(() => {
    const widthIn = Number(form.widthIn);
    const lengthIn = Number(form.lengthIn);
    const lightHours = Number(form.lightHours);
    const draft = {
      zone: form.zone.trim(),
      lastFrostDate: form.lastFrostDate,
      bed: { widthIn, lengthIn },
      lightHours,
      desiredPlants: form.desiredPlants,
    };
    const parsed = UpdateInputsRequestSchema.safeParse(draft);
    return parsed.success ? parsed.data : null;
  }, [form]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    const parsed = UpdateInputsRequestSchema.safeParse({
      zone: form.zone.trim(),
      lastFrostDate: form.lastFrostDate,
      bed: { widthIn: Number(form.widthIn), lengthIn: Number(form.lengthIn) },
      lightHours: Number(form.lightHours),
      desiredPlants: form.desiredPlants,
    });
    if (!parsed.success) {
      setErrors(parsed.error.issues.map((i) => `${i.path.join('.') || 'form'}: ${i.message}`));
      return;
    }
    setBusy(true);
    setErrors([]);
    try {
      await api.updateInputs(id, parsed.data);
      navigate(`/plans/${id}/companions`);
    } catch (err) {
      if (err instanceof ApiError && err.body && typeof err.body === 'object') {
        const e = err.body as { errors?: { formErrors?: string[]; fieldErrors?: Record<string, string[]> } };
        const formErrs = e.errors?.formErrors ?? [];
        const fieldErrs = Object.entries(e.errors?.fieldErrors ?? {}).flatMap(([k, vs]) =>
          (vs ?? []).map((v) => `${k}: ${v}`),
        );
        setErrors([...formErrs, ...fieldErrs].length > 0 ? [...formErrs, ...fieldErrs] : ['Save failed.']);
      } else {
        setErrors(['Save failed.']);
      }
    } finally {
      setBusy(false);
    }
  }

  function togglePlant(pid: string) {
    setForm((f) =>
      f.desiredPlants.includes(pid)
        ? { ...f, desiredPlants: f.desiredPlants.filter((x) => x !== pid) }
        : { ...f, desiredPlants: [...f.desiredPlants, pid] },
    );
  }

  if (loading) return <p>Loading…</p>;

  return (
    <section className={styles.section}>
      <h2>Step 1 — Inputs</h2>
      <form onSubmit={onSubmit} className={styles.form}>
        <label>
          USDA zone
          <input value={form.zone} onChange={(e) => setForm({ ...form, zone: e.target.value })} placeholder="7a" />
        </label>
        <label>
          Last-frost date
          <input
            type="date"
            value={form.lastFrostDate}
            onChange={(e) => setForm({ ...form, lastFrostDate: e.target.value })}
          />
        </label>
        <div className={styles.row}>
          <label>
            Bed width (in)
            <input
              type="number"
              min={1}
              value={form.widthIn}
              onChange={(e) => setForm({ ...form, widthIn: e.target.value })}
            />
          </label>
          <label>
            Bed length (in)
            <input
              type="number"
              min={1}
              value={form.lengthIn}
              onChange={(e) => setForm({ ...form, lengthIn: e.target.value })}
            />
          </label>
        </div>
        <label>
          Daily light hours (0–16)
          <input
            type="number"
            min={0}
            max={16}
            value={form.lightHours}
            onChange={(e) => setForm({ ...form, lightHours: e.target.value })}
          />
        </label>
        <fieldset className={styles.plants}>
          <legend>Desired plants ({form.desiredPlants.length})</legend>
          <div className={styles.plantsGrid}>
            {plants.map((p) => (
              <label key={p.id} className={styles.plantLabel}>
                <input
                  type="checkbox"
                  checked={form.desiredPlants.includes(p.id)}
                  onChange={() => togglePlant(p.id)}
                />
                {p.name}
              </label>
            ))}
          </div>
        </fieldset>
        <button type="submit" disabled={busy || !candidate}>
          {busy ? 'Saving…' : 'Save & continue'}
        </button>
        {errors.length > 0 && (
          <ul className={styles.errors}>
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        )}
      </form>
    </section>
  );
}
