import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import OwnerDashboard from './pages/owner/Dashboard.jsx';
import AddRoom from './pages/owner/AddRoom.jsx';
import ManageRooms from './pages/owner/ManageRooms.jsx';
import ViewRequest from './pages/owner/ViewRequest.jsx';
import SeekerDashboard from './pages/seeker/Dashboard.jsx';
import BrowseRooms from './pages/seeker/BrowseRooms.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* Dashboard routes */}
        <Route path="/seeker/dashboard" element={<SeekerDashboard />} />
        <Route path="/seeker/browse-rooms" element={<BrowseRooms />} />
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/owner/add-room" element={<AddRoom />} />
        <Route path="/owner/manage-rooms" element={<ManageRooms />} />
        <Route path="/owner/view-requests" element={<ViewRequest />} />
        {/* Default redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
