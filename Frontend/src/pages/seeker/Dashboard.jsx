import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData, logout } from '../../utils/auth';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function SeekerDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalRooms: 0,
    savedRooms: 0,
    requestsSent: 0,
    approvedRequests: 0
  });
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Set user data from auth utility
    const userData = getUserData();
    if (userData) {
      setUser(userData);
    }
    
    fetchUserStats();
    fetchNotifications();
    
    // Set up polling for notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handle click outside notifications dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notifications-container')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/seeker/stats/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/notification/notifications/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        handleNewNotification(data);
      } else {
        console.error('Failed to fetch notifications:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/notification/notifications/${notificationId}/mark-read/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        // Update local state
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, is_read: true }
              : notification
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleNewNotification = (newNotifications) => {
    const previousUnreadCount = unreadCount;
    const newUnreadCount = newNotifications.filter(n => !n.is_read).length;
    
    // Show toast for new notifications
    if (newUnreadCount > previousUnreadCount) {
      const latestNotification = newNotifications.filter(n => !n.is_read)[0];
      if (latestNotification) {
        setToastMessage(latestNotification.message);
        setShowToast(true);
        
        // Auto-hide toast after 5 seconds
        setTimeout(() => {
          setShowToast(false);
        }, 5000);
      }
    }
    
    setNotifications(newNotifications);
    setUnreadCount(newUnreadCount);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Notifications Panel - Rendered outside main container */}
      {showNotifications && (
        <>
          {/* Backdrop overlay */}
          <div className="fixed inset-0 bg-black/20 z-[999999]" onClick={() => setShowNotifications(false)}></div>
          <div className="fixed top-24 right-4 w-80 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 z-[9999999] transform transition-all duration-300 ease-out opacity-100 scale-100" style={{ isolation: 'isolate', position: 'fixed' }}>
            <div className="p-4 border-b border-white/20">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <span className="text-sm text-gray-500">{unreadCount} unread</span>
                  )}
                  {unreadCount > 0 && (
                    <button
                      onClick={() => {
                        notifications.forEach(notification => {
                          if (!notification.is_read) {
                            markNotificationAsRead(notification.id);
                          }
                        });
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1 rounded-lg transition-all duration-200"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <p className="text-lg font-medium">No notifications yet</p>
                  <p className="text-sm text-gray-400 mt-1">We'll notify you when something important happens</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-white/10 hover:bg-white/5 transition-all duration-200 ${
                      !notification.is_read ? 'bg-blue-50/50 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          !notification.is_read ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {notification.title || 'Room Request Update'}
                        </p>
                        <p className={`text-sm mt-1 ${
                          !notification.is_read ? 'text-blue-700' : 'text-gray-600'
                        }`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                      {!notification.is_read && (
                        <button
                          onClick={() => markNotificationAsRead(notification.id)}
                          className="ml-2 p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-all duration-200"
                          title="Mark as read"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            {notifications.length > 0 && (
              <div className="p-4 border-t border-white/20 bg-white/50">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="w-full text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-xl transition-all duration-200"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </>
      )}
      
      <div className="min-h-screen relative overflow-hidden">
        {/* Beautiful Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
        {/* Animated background elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-30 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Enhanced Toast Notification */}
        {showToast && (
          <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-4 rounded-2xl shadow-2xl max-w-md transform animate-bounce">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="font-medium">{toastMessage}</span>
              </div>
              <button
                onClick={() => setShowToast(false)}
                className="ml-4 text-white hover:text-gray-200 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Enhanced Header */}
        <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h1 className="text-3xl font-bold text-white drop-shadow-lg">RoomRent</h1>
                  <p className="text-blue-200 text-sm font-medium">Seeker Dashboard</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Enhanced Notifications Icon */}
                <div className="relative notifications-container">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-3 text-white hover:text-blue-200 hover:bg-white/10 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium notification-badge animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                  
                </div>

                {/* Enhanced Wishlist Button */}
                <button
                  onClick={() => navigate('/seeker/wishlist')}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>My Wishlist</span>
                </button>
                
                <div className="text-right">
                  <p className="text-sm font-medium text-white">Welcome back,</p>
                  <p className="text-blue-200 text-sm">{user?.username}</p>
                </div>
                
                {/* Enhanced Profile Icon */}
                <button
                  onClick={() => navigate('/profile')}
                  className="relative p-3 text-white hover:text-blue-200 hover:bg-white/10 rounded-xl transition-all duration-300 transform hover:scale-105"
                  title="Profile Settings"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Enhanced Main Content */}
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Enhanced Welcome Section */}
          <div className="px-4 py-6 sm:px-0 mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h2 className="text-4xl font-bold mb-3">Welcome to Your Dashboard</h2>
                  <p className="text-blue-100 text-xl">Find your perfect room and manage your requests</p>
                  {/* Quick Wishlist Access */}
                  <div className="mt-6">
                    <button
                      onClick={() => navigate('/seeker/wishlist')}
                      className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-white hover:bg-opacity-30 text-white px-6 py-3 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white border-opacity-30 transform hover:scale-105"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>Quick Access: My Wishlist</span>
                    </button>
                  </div>
                </div>
                <div className="hidden md:block">
                  <svg className="w-32 h-32 text-white/20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Grid */}
          <div className="px-4 py-6 sm:px-0 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6 drop-shadow-lg">Dashboard Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Available Rooms */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-6 transform hover:scale-105 transition-all duration-500">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-blue-200">Available Rooms</p>
                    <p className="text-3xl font-bold text-white">{stats.totalRooms}</p>
                  </div>
                </div>
              </div>

              {/* Saved Rooms */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-6 transform hover:scale-105 transition-all duration-500">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-blue-200">Saved Rooms</p>
                    <p className="text-3xl font-bold text-white">{stats.savedRooms}</p>
                  </div>
                </div>
              </div>

              {/* Requests Sent */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-6 transform hover:scale-105 transition-all duration-500">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-blue-200">Requests Sent</p>
                    <p className="text-3xl font-bold text-white">{stats.requestsSent}</p>
                  </div>
                </div>
              </div>

              {/* Approved Requests */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-6 transform hover:scale-105 transition-all duration-500">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-blue-200">Approved Requests</p>
                    <p className="text-3xl font-bold text-white">{stats.approvedRequests}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Quick Actions */}
          <div className="px-4 py-6 sm:px-0 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6 drop-shadow-lg">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Browse Rooms */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 transform hover:scale-105 transition-all duration-500 cursor-pointer group">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-2xl transition-all duration-300">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-3">Browse Rooms</h4>
                  <p className="text-blue-200 mb-6">Find available rooms in your area</p>
                  <button 
                    onClick={() => navigate('/seeker/browse-rooms')}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    Start Searching
                  </button>
                </div>
              </div>

              {/* My Requests */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 transform hover:scale-105 transition-all duration-500 cursor-pointer group">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-2xl transition-all duration-300">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-3">My Requests</h4>
                  <p className="text-blue-200 mb-6">View and manage your room requests</p>
                  <button 
                    onClick={() => navigate('/seeker/view-requests-seeker')}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    View Requests
                  </button>
                </div>
              </div>

              {/* Saved Rooms */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 transform hover:scale-105 transition-all duration-500 cursor-pointer group">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-2xl transition-all duration-300">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-3">Saved Rooms</h4>
                  <p className="text-blue-200 mb-6">Access your favorite rooms</p>
                  <button 
                    onClick={() => navigate('/seeker/wishlist')}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    View Saved
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Recent Activity */}
          <div className="px-4 py-6 sm:px-0">
            <h3 className="text-2xl font-bold text-white mb-6 drop-shadow-lg">Recent Activity</h3>
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20">
              <div className="px-6 py-4 border-b border-white/20">
                <h3 className="text-xl font-semibold text-white">Latest Updates</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all duration-300">
                    <div className="w-4 h-4 bg-green-400 rounded-full mr-4 animate-pulse"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">Request approved for Room #123</p>
                      <p className="text-sm text-blue-200">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all duration-300">
                    <div className="w-4 h-4 bg-blue-400 rounded-full mr-4 animate-pulse"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">New room added to your search area</p>
                      <p className="text-sm text-blue-200">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all duration-300">
                    <div className="w-4 h-4 bg-yellow-400 rounded-full mr-4 animate-pulse"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">Request sent for Room #456</p>
                      <p className="text-sm text-blue-200">2 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
    </>
  );
}
