import { useEffect, useState } from 'react';
import { getHealth } from './api/client.js';
import styles from './App.module.css';

type Status = 'loading' | 'ok' | 'error';

export function App() {
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    getHealth()
      .then(() => setStatus('ok'))
      .catch(() => setStatus('error'));
  }, []);

  return (
    <main className={styles.main}>
      <h1>Garden Plan Builder</h1>
      <p>Scaffold ready. Wizard coming soon.</p>
      <p>API health: <strong data-testid="health">{status}</strong></p>
    </main>
  );
}
