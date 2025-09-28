import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function BrowseRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchRooms();
    fetchWishlist();
  }, [currentPage]);

  useEffect(() => {
    // Reset to page 1 when search/filter/sort changes
    setCurrentPage(1);
    fetchRooms();
  }, [searchQuery, priceFilter, locationFilter, sortBy]);

  useEffect(() => {
    // Check for success message from navigation state
    if (location.state?.success) {
      setSuccessMessage(location.state.success);
      // Clear the state to prevent showing the message again on refresh
      navigate(location.pathname, { replace: true });
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    }
  }, [location.state, navigate, location.pathname]);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      
      // Build query parameters
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (priceFilter) params.append('price', priceFilter);
      if (locationFilter) params.append('location', locationFilter);
      if (currentPage > 1) params.append('page', currentPage);
      if (sortBy) params.append('sort', sortBy);

      // Use search endpoint for all queries (it handles search, filter, and sort)
      let url = `${API_BASE}/seeker/search/`;

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRooms(data);
        setHasNextPage(data.length === 2); // Assuming pagination size is 2
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch rooms');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    // fetchRooms will be called automatically by useEffect when currentPage changes
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setPriceFilter('');
    setLocationFilter('');
    setSortBy('newest');
    setCurrentPage(1);
    // fetchRooms will be called automatically by useEffect when these values change
  };

  const handleRequestRoom = (room) => {
    console.log('handleRequestRoom called with room:', room);
    console.log('Room ID:', room.id);
    console.log('Room is_approved:', room.is_approved);
    console.log('Room available:', room.available);
    
    navigate(`/seeker/request-room/${room.id}`, { 
      state: { room: room } 
    });
  };

  const handleBack = () => {
    navigate('/seeker/dashboard');
  };

  const fetchWishlist = async () => {
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
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    }
  };

  const handleAddToWishlist = async (roomId) => {
    setWishlistLoading(prev => ({ ...prev, [roomId]: true }));
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/wishlist/wishlist/${roomId}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await fetchWishlist();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to add to wishlist');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setWishlistLoading(prev => ({ ...prev, [roomId]: false }));
    }
  };

  const handleRemoveFromWishlist = async (roomId) => {
    setWishlistLoading(prev => ({ ...prev, [roomId]: true }));
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
        await fetchWishlist();
      } else {
        setError('Failed to remove from wishlist');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setWishlistLoading(prev => ({ ...prev, [roomId]: false }));
    }
  };

  const isInWishlist = (roomId) => {
    return wishlistItems.some(item => item.room === roomId);
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

  if (loading && rooms.length === 0) {
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-white">Browse Rooms</h1>
                  <p className="text-sm text-gray-200">Find your perfect rental space</p>
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Available Rooms</h2>
            <p className="text-xl text-gray-200">Discover amazing rental opportunities</p>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl shadow-2xl border border-white border-opacity-20 p-6 mb-8">
            <form onSubmit={handleSearch} className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search rooms by title, description, or location..."
                  className="w-full pl-12 pr-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                />
              </div>

              {/* Filters Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Price Filter */}
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
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    placeholder="Max price per month"
                    className="w-full pl-12 pr-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  />
                </div>

                {/* Location Filter */}
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
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    placeholder="Location (city, state)"
                    className="w-full pl-12 pr-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  />
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                      </svg>
                    </div>
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 appearance-none"
                  >
                    <option value="newest" className="bg-gray-800">Newest First</option>
                    <option value="oldest" className="bg-gray-800">Oldest First</option>
                    <option value="price_asc" className="bg-gray-800">Price: Low to High</option>
                    <option value="price_desc" className="bg-gray-800">Price: High to Low</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="px-6 py-3 border border-white border-opacity-30 text-white rounded-xl hover:bg-white hover:bg-opacity-10 transition-all duration-200 backdrop-blur-sm"
                >
                  Clear Filters
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Search Rooms
                </button>
              </div>
            </form>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 bg-green-500 bg-opacity-20 border border-green-400 text-green-100 px-4 py-3 rounded-xl backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{successMessage}</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-500 bg-opacity-20 border border-red-400 text-red-100 px-4 py-3 rounded-xl backdrop-blur-sm">
              {error}
            </div>
          )}

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-white text-lg">
              Found <span className="font-bold">{rooms.length}</span> room{rooms.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Rooms List */}
          {rooms.length === 0 ? (
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl shadow-2xl border border-white border-opacity-20 p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">No rooms found</h3>
              <p className="text-gray-300 mb-6">Try adjusting your search criteria or check back later.</p>
              <button
                onClick={handleClearFilters}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Clear Filters
              </button>
            </div>
          ) : (
                         <div className="space-y-8">
               {rooms.map((room) => (
                 <div key={room.id} className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl shadow-2xl border border-white border-opacity-20 overflow-hidden hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] group">
                   <div className="flex flex-col lg:flex-row">
                     {/* Room Photo Section */}
                     <div className="lg:w-2/5 relative overflow-hidden">
                       {room.photo ? (
                         <div className="relative h-80 lg:h-full">
                           <img 
                             src={`${API_BASE}${room.photo.startsWith('/') ? '' : '/'}${room.photo}`}
                             alt={room.title}
                             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 high-quality-image"
                             loading="lazy"
                             decoding="async"
                             onError={(e) => {
                               e.target.style.display = 'none';
                               e.target.nextSibling.style.display = 'flex';
                             }}
                           />
                           {/* Photo Overlay */}
                           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                           
                           {/* Status Badge Overlay */}
                           <div className="absolute top-4 right-4">
                             {getStatusBadge(room.is_approved, room.available)}
                           </div>
                           
                           {/* Price Tag Overlay */}
                           <div className="absolute bottom-4 left-4">
                             <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-2 rounded-full shadow-lg backdrop-blur-sm">
                               <span className="text-lg font-bold">${room.price}</span>
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
                           <h3 className="text-3xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors duration-300">{room.title}</h3>
                           <p className="text-gray-300 text-lg leading-relaxed line-clamp-3">{room.description}</p>
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
                                 <p className="text-white font-medium">{room.location}</p>
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
                                 <p className="text-white font-medium capitalize">{room.room_type}</p>
                               </div>
                             </div>
                           </div>

                           {/* Availability */}
                           <div className="bg-white bg-opacity-5 px-4 py-3 rounded-xl backdrop-blur-sm border border-white border-opacity-10 hover:bg-white hover:bg-opacity-10 transition-all duration-300 group-hover:border-emerald-400/30">
                             <div className="flex items-center space-x-3">
                               <div className={`w-8 h-8 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${room.available ? 'bg-gradient-to-r from-emerald-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-rose-600'}`}>
                                 <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   {room.available ? (
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                   ) : (
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                   )}
                                 </svg>
                               </div>
                               <div>
                                 <p className="text-xs text-gray-400 uppercase tracking-wider">Status</p>
                                 <p className="text-white font-medium">{room.available ? 'Available' : 'Not Available'}</p>
                               </div>
                             </div>
                           </div>

                           {/* Approval Status */}
                           <div className="bg-white bg-opacity-5 px-4 py-3 rounded-xl backdrop-blur-sm border border-white border-opacity-10 hover:bg-white hover:bg-opacity-10 transition-all duration-300 group-hover:border-yellow-400/30">
                             <div className="flex items-center space-x-3">
                               <div className={`w-8 h-8 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${room.is_approved ? 'bg-gradient-to-r from-emerald-500 to-green-600' : 'bg-gradient-to-r from-yellow-500 to-orange-600'}`}>
                                 <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   {room.is_approved ? (
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                   ) : (
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                   )}
                                 </svg>
                               </div>
                               <div>
                                 <p className="text-xs text-gray-400 uppercase tracking-wider">Approval</p>
                                 <p className="text-white font-medium">{room.is_approved ? 'Approved' : 'Pending'}</p>
                               </div>
                             </div>
                           </div>
                         </div>
                       </div>

                       {/* Enhanced Actions Section */}
                       <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white border-opacity-20">
                         {/* Wishlist Button */}
                         <button
                           onClick={() => isInWishlist(room.id) 
                             ? handleRemoveFromWishlist(room.id) 
                             : handleAddToWishlist(room.id)
                           }
                           disabled={wishlistLoading[room.id]}
                           className={`flex-1 flex items-center justify-center space-x-3 px-6 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                             isInWishlist(room.id)
                               ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700'
                               : 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700'
                           }`}
                         >
                           {wishlistLoading[room.id] ? (
                             <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                           ) : (
                             <svg className="w-6 h-6" fill={isInWishlist(room.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                             </svg>
                           )}
                           <span className="font-semibold text-lg">{isInWishlist(room.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
                         </button>

                         {/* Request Room Button */}
                         <button
                           onClick={() => handleRequestRoom(room)}
                           disabled={!room.is_approved || !room.available}
                           className={`flex-1 px-6 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-lg ${
                             room.is_approved && room.available
                               ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                               : 'bg-white bg-opacity-10 text-gray-300 cursor-not-allowed'
                           }`}
                         >
                           {room.is_approved
                             ? room.available ? 'Request Room' : 'Not Available'
                             : 'Pending Approval'}
                         </button>
                       </div>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          )}

          {/* Pagination */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              disabled={currentPage === 1}
              className="px-6 py-3 border border-white border-opacity-30 text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white hover:bg-opacity-10 transition-all duration-200 backdrop-blur-sm"
            >
              Previous
            </button>
            <span className="text-white">Page {currentPage}</span>
            <button
              onClick={() => { setCurrentPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              disabled={!hasNextPage}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Next
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
