import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Register from './pages/Register.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        {/* Placeholder dashboards */}
        <Route path="/seeker/dashboard" element={<div className="p-6">Seeker Dashboard</div>} />
        <Route path="/owner/dashboard" element={<div className="p-6">Owner Dashboard</div>} />
        {/* Default redirect to sign in */}
        <Route path="*" element={<Navigate to="/register" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
