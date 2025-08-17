import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [removingItem, setRemovingItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/wishlist/wishlist/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setWishlistItems(data.results || data);
      } else {
        setError('Failed to fetch wishlist');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (roomId) => {
    setRemovingItem(roomId);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/wishlist/wishlist/${roomId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setSuccessMessage('Room removed from wishlist successfully!');
        fetchWishlist();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError('Failed to remove from wishlist');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setRemovingItem(null);
    }
  };

  const handleRequestRoom = (roomId) => {
    navigate(`/seeker/request-room/${roomId}`);
  };

  const handleBack = () => {
    navigate('/seeker/dashboard');
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
            <p className="text-white text-lg">Loading your wishlist...</p>
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
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-white">My Wishlist</h1>
                  <p className="text-sm text-gray-200">Your saved favorite rooms</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Saved Rooms</h2>
            <p className="text-xl text-gray-200">Your collection of favorite rental spaces</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 bg-green-500 bg-opacity-20 border border-green-400 text-green-100 px-4 py-3 rounded-xl backdrop-blur-sm">
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-500 bg-opacity-20 border border-red-400 text-red-100 px-4 py-3 rounded-xl backdrop-blur-sm">
              {error}
            </div>
          )}

          {/* Wishlist Count */}
          <div className="mb-6">
            <p className="text-white text-lg">
              You have <span className="font-bold">{wishlistItems.length}</span> saved room{wishlistItems.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Wishlist Items */}
          {wishlistItems.length === 0 ? (
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl shadow-2xl border border-white border-opacity-20 p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Your wishlist is empty</h3>
              <p className="text-gray-300 mb-6">Start exploring rooms and add them to your wishlist!</p>
              <button
                onClick={() => navigate('/seeker/browse-rooms')}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Browse Rooms
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {wishlistItems.map((item) => (
                <div key={item.id} className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl shadow-2xl border border-white border-opacity-20 overflow-hidden hover:shadow-3xl transition-all duration-300">
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <h3 className="text-2xl font-bold text-white">{item.room?.title || 'Room'}</h3>
                          {getStatusBadge(item.room?.is_approved, item.room?.available)}
                        </div>
                        
                        <p className="text-gray-300 mb-6 text-lg leading-relaxed">{item.room?.description || 'No description available'}</p>
                        
                        {/* Room Details */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                          <div className="flex items-center space-x-2 bg-white bg-opacity-5 px-3 py-2 rounded-lg backdrop-blur-sm">
                            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <span className="text-gray-300">{item.room?.location || 'Location not available'}</span>
                          </div>

                          <div className="flex items-center space-x-2 bg-white bg-opacity-5 px-3 py-2 rounded-lg backdrop-blur-sm">
                            <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                              </svg>
                            </div>
                            <span className="text-gray-300">${item.room?.price || 'N/A'}/month</span>
                          </div>

                          <div className="flex items-center space-x-2 bg-white bg-opacity-5 px-3 py-2 rounded-lg backdrop-blur-sm capitalize">
                            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                            <span className="text-gray-300">{item.room?.room_type || 'N/A'}</span>
                          </div>

                          <div className="flex items-center space-x-2 bg-white bg-opacity-5 px-3 py-2 rounded-lg backdrop-blur-sm">
                            <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <span className="text-gray-300">Added {formatDate(item.added_at)}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-between items-center">
                          <button
                            onClick={() => handleRemoveFromWishlist(item.room?.id)}
                            disabled={removingItem === item.room?.id}
                            className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            {removingItem === item.room?.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            )}
                            <span>Remove from Wishlist</span>
                          </button>

                          <button
                            onClick={() => handleRequestRoom(item.room?.id)}
                            disabled={!item.room?.is_approved || !item.room?.available}
                            className={`px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                              item.room?.is_approved && item.room?.available
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                                : 'bg-white bg-opacity-10 text-gray-300 cursor-not-allowed'
                            }`}
                          >
                            {item.room?.is_approved
                              ? item.room?.available ? 'Request Room' : 'Not Available'
                              : 'Pending Approval'}
                          </button>
                        </div>
                      </div>
                    </div>
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
