import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../api/client.js';
import type { PlanResponse } from '@gpb/shared';
import styles from './Final.module.css';

export function FinalScreen() {
  const { id } = useParams<{ id: string }>();
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        // Always re-render on visit so edits to earlier steps are picked up.
        const p = await api.renderFinal(id);
        setPlan(p);
      } catch {
        setErrors(['Failed to render final plan.']);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function onRerender() {
    if (!id) return;
    setBusy(true);
    setErrors([]);
    setFlash(null);
    try {
      const p = await api.renderFinal(id);
      setPlan(p);
      setFlash('Re-rendered.');
    } catch {
      setErrors(['Re-render failed.']);
    } finally {
      setBusy(false);
    }
  }

  async function onCopy() {
    if (!plan?.final?.summaryMarkdown) return;
    setErrors([]);
    setFlash(null);
    try {
      await navigator.clipboard.writeText(plan.final.summaryMarkdown);
      setFlash('Copied to clipboard.');
    } catch {
      setErrors(['Copy failed. Select the text and copy manually.']);
    }
  }

  function onDownload() {
    if (!plan?.final?.summaryMarkdown) return;
    const blob = new Blob([plan.final.summaryMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safe = plan.name.replace(/[^A-Za-z0-9-_]+/g, '-').replace(/^-+|-+$/g, '') || 'plan';
    a.download = `${safe}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  if (loading) return <p>Loading…</p>;
  if (!plan) {
    return (
      <section className={styles.section}>
        <h2>Step 5 — Final plan</h2>
        {errors.map((e, i) => <p key={i} className={styles.errors}>{e}</p>)}
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <h2>Step 5 — Final plan</h2>
      <p className={styles.muted}>{plan.name}</p>

      <div className={styles.actions}>
        <button type="button" onClick={onCopy} disabled={!plan.final}>Copy markdown</button>
        <button type="button" onClick={onDownload} disabled={!plan.final}>Download .md</button>
        <button type="button" onClick={onRerender} disabled={busy}>
          {busy ? 'Rendering…' : 'Re-render'}
        </button>
        <Link to="/">Back to start</Link>
      </div>

      {flash && <p className={styles.flash}>{flash}</p>}
      {errors.length > 0 && <ul className={styles.errors}>{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>}

      <pre className={styles.source}>{plan.final?.summaryMarkdown ?? ''}</pre>
    </section>
  );
}
