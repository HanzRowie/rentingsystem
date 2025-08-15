import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import OwnerDashboard from './pages/owner/Dashboard.jsx';
import SeekerDashboard from './pages/seeker/Dashboard.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* Dashboard routes */}
        <Route path="/seeker/dashboard" element={<SeekerDashboard />} />
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        {/* Default redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
