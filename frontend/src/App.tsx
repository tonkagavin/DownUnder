import { NavLink, Route, Routes } from 'react-router-dom';
import InteractionCheckerPage from './pages/InteractionCheckerPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <main>
      <h1>DownUnder</h1>
      <p>Medication interaction awareness for women using birth control.</p>
      <nav>
        <NavLink to="/">Profile</NavLink> | <NavLink to="/checker">Interaction Checker</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<ProfilePage />} />
        <Route path="/checker" element={<InteractionCheckerPage />} />
      </Routes>
    </main>
  );
}
