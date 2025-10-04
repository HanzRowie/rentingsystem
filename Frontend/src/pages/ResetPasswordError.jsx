import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ResetPasswordError = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const message = searchParams.get('message') || 'Invalid reset link';

  useEffect(() => {
    // Auto redirect to login after 5 seconds
    const timer = setTimeout(() => {
      navigate('/login');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-red-500">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Password Reset Failed
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {message}
          </p>
          <p className="mt-4 text-sm text-gray-500">
            You will be automatically redirected to the login page in 5 seconds.
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => navigate('/login')}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go to Login
          </button>
          
          <button
            onClick={() => navigate('/forgot-password')}
            className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Request New Reset Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordError;
