import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { HomeScreen } from './screens/Home/Home.js';
import { InputsScreen } from './screens/Inputs/Inputs.js';
import { CompanionsScreen } from './screens/Companions/Companions.js';
import { LayoutScreen } from './screens/Layout/Layout.js';
import { TimingScreen } from './screens/Timing/Timing.js';
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
          <Route path="/plans/:id/timing" element={<TimingScreen />} />
          <Route path="/plans/:id/final" element={<FinalPlaceholder />} />
          <Route path="*" element={<p>Not found.</p>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

function FinalPlaceholder() {
  return (
    <section>
      <h2>Step 5 — Final plan</h2>
      <p>Coming in F007.</p>
    </section>
  );
}
