// frontend/src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import StandupForm from './components/StandupForm';
import TeamView from './components/TeamView';
import HistoryView from './components/HistoryView';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <nav className="p-4 bg-gray-100 flex gap-4">
          <Link to="/">Standup</Link>
          <Link to="/team">Team</Link>
          <Link to="/history">History</Link>
        </nav>
        <div className="p-4">
          <Routes>
            <Route path="/" element={<StandupForm />} />
            <Route path="/team" element={<TeamView />} />
            <Route path="/history" element={<HistoryView />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;