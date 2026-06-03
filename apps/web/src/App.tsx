import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { HomeScreen } from './screens/Home/Home.js';
import { InputsScreen } from './screens/Inputs/Inputs.js';
import { CompanionsPlaceholder } from './screens/Companions/Companions.js';
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
          <Route path="/plans/:id/companions" element={<CompanionsPlaceholder />} />
          <Route path="*" element={<p>Not found.</p>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
