import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import Profile from './pages/Profile.jsx';
import OwnerDashboard from './pages/owner/Dashboard.jsx';
import AddRoom from './pages/owner/AddRoom.jsx';
import ManageRooms from './pages/owner/ManageRooms.jsx';
import ViewRequest from './pages/owner/ViewRequest.jsx';
import SeekerDashboard from './pages/seeker/Dashboard.jsx';
import BrowseRooms from './pages/seeker/BrowseRooms.jsx';
import ViewRequestSeeker from './pages/seeker/ViewRequestseeker.jsx';
import Wishlist from './pages/seeker/Wishlist.jsx';
import RequestRoom from './pages/seeker/RequestRoom.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/owner/dashboard" element={<ProtectedRoute requiredRole="room owner"><OwnerDashboard /></ProtectedRoute>} />
        <Route path="/owner/add-room" element={<ProtectedRoute requiredRole="room owner"><AddRoom /></ProtectedRoute>} />
        <Route path="/owner/manage-rooms" element={<ProtectedRoute requiredRole="room owner"><ManageRooms /></ProtectedRoute>} />
        <Route path="/owner/view-requests" element={<ProtectedRoute requiredRole="room owner"><ViewRequest /></ProtectedRoute>} />
        <Route path="/seeker/dashboard" element={<ProtectedRoute requiredRole="seeker"><SeekerDashboard /></ProtectedRoute>} />
        <Route path="/seeker/browse-rooms" element={<ProtectedRoute requiredRole="seeker"><BrowseRooms /></ProtectedRoute>} />
        <Route path="/seeker/request-room/:roomId" element={<ProtectedRoute requiredRole="seeker"><RequestRoom /></ProtectedRoute>} />
        <Route path="/seeker/view-requests-seeker" element={<ProtectedRoute requiredRole="seeker"><ViewRequestSeeker /></ProtectedRoute>} />
        <Route path="/seeker/wishlist" element={<ProtectedRoute requiredRole="seeker"><Wishlist /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
