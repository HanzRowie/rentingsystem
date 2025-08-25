import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, hasRole } from '../utils/auth';

export default function ProtectedRoute({ children, requiredRole, fallback = null }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      try {
        console.log('ProtectedRoute: Checking authentication...');
        console.log('ProtectedRoute: Required role:', requiredRole);
        
        // Check if we have a token
        const token = localStorage.getItem('access_token');
        console.log('ProtectedRoute: Token exists:', !!token);
        
        if (!isAuthenticated()) {
          console.log('ProtectedRoute: No token found, redirecting to login');
          setError('No authentication token found');
          navigate('/login');
          return;
        }

        // Check role
        const userRole = localStorage.getItem('role');
        console.log('ProtectedRoute: User role from localStorage:', userRole);
        
        if (requiredRole && !hasRole(requiredRole)) {
          console.log(`ProtectedRoute: Invalid role ${requiredRole}, redirecting to login`);
          setError(`Access denied. Required role: ${requiredRole}`);
          navigate('/login');
          return;
        }

        console.log('ProtectedRoute: Authentication successful');
        setIsAuthorized(true);
        setIsLoading(false);
        setError(null);
      } catch (err) {
        console.error('ProtectedRoute: Error during authentication check:', err);
        setError('Authentication check failed');
        navigate('/login');
      }
    };

    // Small delay to ensure localStorage is available
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [navigate, requiredRole]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-2">Authentication Error</div>
          <div className="text-red-500">{error}</div>
          <div className="text-gray-500 text-sm mt-2">Redirecting to login...</div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Checking authentication...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we verify your credentials</p>
        </div>
      </div>
    );
  }

  return isAuthorized ? children : null;
}
