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
              
              {/* Profile Icon */}
              <button
                onClick={() => navigate('/profile')}
                className="relative p-2 text-white hover:text-gray-200 hover:bg-white hover:bg-opacity-10 rounded-lg transition-all duration-200"
                title="Profile Settings"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
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
            <div className="space-y-8">
              {wishlistItems.map((item) => (
                <div key={item.id} className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl shadow-2xl border border-white border-opacity-20 overflow-hidden hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] group">
                  <div className="flex flex-col lg:flex-row">
                    {/* Room Photo Section */}
                    <div className="lg:w-2/5 relative overflow-hidden">
                      {item.room?.photo ? (
                        <div className="relative h-80 lg:h-full">
                          <img 
                            src={`${API_BASE}${item.room.photo.startsWith('/') ? '' : '/'}${item.room.photo}`}
                            alt={item.room.title || 'Room'}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 high-quality-image"
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                          {/* Photo Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          {/* Status Badge Overlay */}
                          <div className="absolute top-4 right-4">
                            {getStatusBadge(item.room?.is_approved, item.room?.available)}
                          </div>
                          
                          {/* Price Tag Overlay */}
                          <div className="absolute bottom-4 left-4">
                            <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-2 rounded-full shadow-lg backdrop-blur-sm">
                              <span className="text-lg font-bold">${item.room?.price || 'N/A'}</span>
                              <span className="text-sm ml-1">/month</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="h-80 lg:h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:from-blue-600 group-hover:to-purple-700 transition-all duration-500">
                          <div className="text-center text-white">
                            <svg className="w-20 h-20 mx-auto mb-4 opacity-50 group-hover:opacity-70 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-xl font-medium">No Photo Available</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Room Content Section */}
                    <div className="lg:w-3/5 p-8 flex flex-col justify-between">
                      <div>
                        {/* Header Section */}
                        <div className="mb-6">
                          <h3 className="text-3xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors duration-300">{item.room?.title || 'Room'}</h3>
                          <p className="text-gray-300 text-lg leading-relaxed line-clamp-3">{item.room?.description || 'No description available'}</p>
                        </div>
                        
                        {/* Enhanced Room Details Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                          {/* Location */}
                          <div className="bg-white bg-opacity-5 px-4 py-3 rounded-xl backdrop-blur-sm border border-white border-opacity-10 hover:bg-white hover:bg-opacity-10 transition-all duration-300 group-hover:border-blue-400/30">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider">Location</p>
                                <p className="text-white font-medium">{item.room?.location || 'Location not available'}</p>
                              </div>
                            </div>
                          </div>

                          {/* Room Type */}
                          <div className="bg-white bg-opacity-5 px-4 py-3 rounded-xl backdrop-blur-sm border border-white border-opacity-10 hover:bg-white hover:bg-opacity-10 transition-all duration-300 group-hover:border-purple-400/30">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider">Type</p>
                                <p className="text-white font-medium capitalize">{item.room?.room_type || 'N/A'}</p>
                              </div>
                            </div>
                          </div>

                          {/* Added Date */}
                          <div className="bg-white bg-opacity-5 px-4 py-3 rounded-xl backdrop-blur-sm border border-white border-opacity-10 hover:bg-white hover:bg-opacity-10 transition-all duration-300 group-hover:border-orange-400/30">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider">Added</p>
                                <p className="text-white font-medium">{formatDate(item.added_at)}</p>
                              </div>
                            </div>
                          </div>

                          {/* Approval Status */}
                          <div className="bg-white bg-opacity-5 px-4 py-3 rounded-xl backdrop-blur-sm border border-white border-opacity-10 hover:bg-white hover:bg-opacity-10 transition-all duration-300 group-hover:border-yellow-400/30">
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${item.room?.is_approved ? 'bg-gradient-to-r from-emerald-500 to-green-600' : 'bg-gradient-to-r from-yellow-500 to-orange-600'}`}>
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  {item.room?.is_approved ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  )}
                                </svg>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider">Approval</p>
                                <p className="text-white font-medium">{item.room?.is_approved ? 'Approved' : 'Pending'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Actions Section */}
                      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white border-opacity-20">
                        <button
                          onClick={() => handleRemoveFromWishlist(item.room?.id)}
                          disabled={removingItem === item.room?.id}
                          className="flex-1 flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-lg"
                        >
                          {removingItem === item.room?.id ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          ) : (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          )}
                          <span>Remove from Wishlist</span>
                        </button>

                        <button
                          onClick={() => handleRequestRoom(item.room?.id)}
                          disabled={!item.room?.is_approved || !item.room?.available}
                          className={`flex-1 px-6 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-lg ${
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
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
