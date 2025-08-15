import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function ManageRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingRoom, setEditingRoom] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/ownerrooms/roomview/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRooms(data);
      } else {
        setError('Failed to fetch rooms');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room.id);
    setEditFormData({
      title: room.title,
      description: room.description,
      price: room.price,
      location: room.location,
      room_type: room.room_type,
      available: room.available
    });
  };

  const handleCancelEdit = () => {
    setEditingRoom(null);
    setEditFormData({});
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleUpdateRoom = async (roomId) => {
    setEditLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/ownerrooms/roomview/${roomId}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editFormData)
      });

      if (response.ok) {
        // Refresh the rooms list
        await fetchRooms();
        setEditingRoom(null);
        setEditFormData({});
      } else {
        const errorData = await response.json();
        setError(errorData.msg || 'Failed to update room');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/ownerrooms/roomview/${roomId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Refresh the rooms list
        await fetchRooms();
      } else {
        setError('Failed to delete room');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  const handleBack = () => {
    navigate('/owner/dashboard');
  };

  const getStatusBadge = (isApproved, available) => {
    if (!isApproved) {
      return <span className="px-3 py-1 text-xs font-medium bg-yellow-500 bg-opacity-20 text-yellow-200 rounded-full backdrop-blur-sm border border-yellow-400 border-opacity-30">Pending Approval</span>;
    }
    if (available) {
      return <span className="px-3 py-1 text-xs font-medium bg-green-500 bg-opacity-20 text-green-200 rounded-full backdrop-blur-sm border border-green-400 border-opacity-30">Available</span>;
    }
    return <span className="px-3 py-1 text-xs font-medium bg-red-500 bg-opacity-20 text-red-200 rounded-full backdrop-blur-sm border border-red-400 border-opacity-30">Rented</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background Image with Blur */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
            filter: 'blur(8px)',
            transform: 'scale(1.1)'
          }}
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        {/* Loading Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
            <p className="text-white text-lg">Loading rooms...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
          filter: 'blur(8px)',
          transform: 'scale(1.1)'
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white bg-opacity-10 backdrop-blur-md border-b border-white border-opacity-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <button
                  onClick={handleBack}
                  className="mr-4 p-2 text-white hover:text-gray-200 hover:bg-white hover:bg-opacity-10 rounded-lg transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-white">Manage Rooms</h1>
                  <p className="text-sm text-gray-200">Edit and update your room listings</p>
                </div>
              </div>
              
              <button
                onClick={() => navigate('/owner/add-room')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Room
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Your Room Portfolio</h2>
            <p className="text-xl text-gray-200">Manage and update your room listings</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-500 bg-opacity-20 border border-red-400 text-red-100 px-4 py-3 rounded-xl backdrop-blur-sm">
              {error}
            </div>
          )}

          {/* Rooms List */}
          {rooms.length === 0 ? (
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl shadow-2xl border border-white border-opacity-20 p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">No rooms found</h3>
              <p className="text-gray-300 mb-6">You haven't added any rooms yet.</p>
              <button
                onClick={() => navigate('/owner/add-room')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Add Your First Room
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {rooms.map((room) => (
                <div key={room.id} className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl shadow-2xl border border-white border-opacity-20 overflow-hidden hover:shadow-3xl transition-all duration-300">
                  <div className="p-8">
                    {editingRoom === room.id ? (
                      // Edit Form
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-white mb-3">Title</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                  </svg>
                                </div>
                              </div>
                              <input
                                type="text"
                                name="title"
                                value={editFormData.title}
                                onChange={handleEditInputChange}
                                className="w-full pl-12 pr-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                                placeholder="Enter room title"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-white mb-3">Price</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                  </svg>
                                </div>
                              </div>
                              <input
                                type="number"
                                name="price"
                                value={editFormData.price}
                                onChange={handleEditInputChange}
                                className="w-full pl-12 pr-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                                placeholder="0.00"
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white mb-3">Description</label>
                          <textarea
                            name="description"
                            value={editFormData.description}
                            onChange={handleEditInputChange}
                            rows={3}
                            className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                            placeholder="Describe your room, amenities, etc."
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-white mb-3">Location</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                </div>
                              </div>
                              <input
                                type="text"
                                name="location"
                                value={editFormData.location}
                                onChange={handleEditInputChange}
                                className="w-full pl-12 pr-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                                placeholder="City, State"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-white mb-3">Room Type</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                  </svg>
                                </div>
                              </div>
                              <select
                                name="room_type"
                                value={editFormData.room_type}
                                onChange={handleEditInputChange}
                                className="w-full pl-12 pr-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 appearance-none"
                              >
                                <option value="single" className="bg-gray-800">Single Room</option>
                                <option value="double" className="bg-gray-800">Double Room</option>
                                <option value="studio" className="bg-gray-800">Studio</option>
                                <option value="apartment" className="bg-gray-800">Apartment</option>
                                <option value="house" className="bg-gray-800">House</option>
                              </select>
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="available"
                            checked={editFormData.available}
                            onChange={handleEditInputChange}
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-white border-opacity-30 rounded bg-white bg-opacity-10"
                          />
                          <label className="ml-3 block text-sm text-white">Available for rent</label>
                        </div>
                        <div className="flex justify-end space-x-4 pt-6">
                          <button
                            onClick={handleCancelEdit}
                            className="px-6 py-3 border border-white border-opacity-30 text-white rounded-xl hover:bg-white hover:bg-opacity-10 transition-all duration-200 backdrop-blur-sm"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleUpdateRoom(room.id)}
                            disabled={editLoading}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            {editLoading ? 'Updating...' : 'Update Room'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Room Display
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-3">
                              <h3 className="text-2xl font-bold text-white">{room.title}</h3>
                              {getStatusBadge(room.is_approved, room.available)}
                            </div>
                            <p className="text-gray-300 mb-4 text-lg leading-relaxed">{room.description}</p>
                            <div className="flex items-center space-x-6 text-sm text-gray-300">
                              <span className="flex items-center bg-white bg-opacity-10 px-3 py-2 rounded-lg backdrop-blur-sm">
                                <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {room.location}
                              </span>
                              <span className="flex items-center bg-white bg-opacity-10 px-3 py-2 rounded-lg backdrop-blur-sm">
                                <svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                                ${room.price}/month
                              </span>
                              <span className="flex items-center bg-white bg-opacity-10 px-3 py-2 rounded-lg backdrop-blur-sm capitalize">
                                <svg className="w-4 h-4 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                {room.room_type}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleEdit(room)}
                              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteRoom(room.id)}
                              className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
