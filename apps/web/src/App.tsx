import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { HomeScreen } from './screens/Home/Home.js';
import { InputsScreen } from './screens/Inputs/Inputs.js';
import { CompanionsScreen } from './screens/Companions/Companions.js';
import { LayoutScreen } from './screens/Layout/Layout.js';
import styles from './App.module.css';

export function App() {
  return (
    <BrowserRouter>
      <main className={styles.main}>
        <header className={styles.header}>
          <h1>
            <Link to="/">Garden Plan Builder</Link>
          </h1>
        </header>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/plans/:id/inputs" element={<InputsScreen />} />
          <Route path="/plans/:id/companions" element={<CompanionsScreen />} />
          <Route path="/plans/:id/layout" element={<LayoutScreen />} />
          <Route path="/plans/:id/timing" element={<TimingPlaceholder />} />
          <Route path="*" element={<p>Not found.</p>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

function TimingPlaceholder() {
  return (
    <section>
      <h2>Step 4 — Timing</h2>
      <p>Coming in F006.</p>
    </section>
  );
}
