import { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    role: 'seeker',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    const normalizedRole = String(form.role).toLowerCase();
    if (!['seeker', 'room owner'].includes(normalizedRole)) {
      setError('Role must be Seeker or Room Owner');
      return;
    }

    try {
      setLoading(true);
      
      // Log the data being sent
      console.log('Sending registration data:', {
        username: form.username,
        email: form.email,
        password: form.password,
        password2: form.password2,
        role: form.role,
      });
      
      const res = await fetch(`${API_BASE}/accounts/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
          password2: form.password2,
          role: form.role,
        }),
      });

      console.log('Response status:', res.status);
      console.log('Response headers:', res.headers);

      const data = await res.json();
      console.log('Response data:', data);
      
      if (!res.ok) {
        const msg = data?.message || data?.data || 'Registration failed';
        throw new Error(typeof msg === 'string' ? msg : 'Registration failed');
      }

      setSuccess('Your account was successfully created');
      setTimeout(() => (window.location.href = '/signin'), 800);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0">
        {/* Main background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
          }}
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-purple-900/70 to-slate-900/80"></div>
        
        {/* Additional overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-pink-400/20 to-red-400/20 rounded-full blur-xl animate-blob" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-xl animate-blob" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Floating House Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/6 text-white/10 animate-float">
          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
        </div>
        <div className="absolute top-1/3 right-1/6 text-white/10 animate-float" style={{animationDelay: '1s'}}>
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
        </div>
        <div className="absolute bottom-1/4 left-1/3 text-white/10 animate-float" style={{animationDelay: '2s'}}>
          <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-2xl">
          {/* Header Section */}
          <div className="text-center mb-10 animate-fade-in">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl mb-8 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
              <svg className="w-12 h-12 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
              Welcome to <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">RoomRent</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-lg mx-auto leading-relaxed">
              Find your perfect room or rent out your space with confidence and ease
            </p>
          </div>

          {/* Main Form Card */}
          <div className="bg-white/10 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/20 overflow-hidden animate-slide-up">
            <div className="p-10">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-white mb-3">Create Your Account</h2>
                <p className="text-gray-300 text-lg">Join thousands of people finding and renting rooms</p>
              </div>

              {error && (
                <div className="mb-8 p-6 bg-red-500/20 border border-red-400/30 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-red-300 mr-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-200 font-medium text-lg">{String(error)}</p>
                  </div>
                </div>
              )}
              
              {success && (
                <div className="mb-8 p-6 bg-green-500/20 border border-green-400/30 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-green-300 mr-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-green-200 font-medium text-lg">{success}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Username Field */}
                <div className="group">
                  <label className="block text-lg font-semibold text-white mb-4 group-hover:text-blue-300 transition-colors">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={form.username}
                      onChange={(e) => updateField('username', e.target.value)}
                      className="block w-full pl-20 pr-6 py-5 text-lg border-2 border-white/20 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-300 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 hover:bg-white/20"
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="group">
                  <label className="block text-lg font-semibold text-white mb-4 group-hover:text-blue-300 transition-colors">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className="block w-full pl-20 pr-6 py-5 text-lg border-2 border-white/20 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-300 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 hover:bg-white/20"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="group">
                  <label className="block text-lg font-semibold text-white mb-4 group-hover:text-blue-300 transition-colors">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    </div>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => updateField('password', e.target.value)}
                      className="block w-full pl-20 pr-6 py-5 text-lg border-2 border-white/20 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/50 focus:border-green-400 transition-all duration-300 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 hover:bg-white/20"
                      placeholder="Create a strong password"
                      required
                    />
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="group">
                  <label className="block text-lg font-semibold text-white mb-4 group-hover:text-blue-300 transition-colors">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                      <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg flex items-center justify-center">
                        <svg className="h5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <input
                      type="password"
                      value={form.password2}
                      onChange={(e) => updateField('password2', e.target.value)}
                      className="block w-full pl-20 pr-6 py-5 text-lg border-2 border-white/20 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-500/50 focus:border-pink-400 transition-all duration-300 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 hover:bg-white/20"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>

                {/* Role Selection */}
                <div className="group">
                  <label className="block text-lg font-semibold text-white mb-4 group-hover:text-blue-300 transition-colors">
                    Role
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                      <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                    </div>
                    <select
                      value={form.role}
                      onChange={(e) => updateField('role', e.target.value)}
                      className="block w-full pl-20 pr-12 py-5 text-lg border-2 border-white/20 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all duration-300 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 appearance-none cursor-pointer"
                      required
                    >
                      <option value="seeker" className="bg-slate-800 text-white">Seeker</option>
                      <option value="room owner" className="bg-slate-800 text-white">Room Owner</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-gray-400">You can always change your role later in your account settings</p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 disabled:opacity-60 text-white font-bold py-6 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] disabled:transform-none text-xl"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating your account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              {/* Sign In Link */}
              <div className="mt-10 text-center">
                <p className="text-lg text-gray-300">
                  Already have an account?{' '}
                  <a href="/signin" className="font-bold text-blue-300 hover:text-blue-200 transition-colors duration-300 underline decoration-2 underline-offset-4">
                    Sign in here
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-10 text-center">
            <p className="text-lg text-gray-400 mb-6">
              Join thousands of people finding their perfect room or renting out their space
            </p>
            <div className="flex items-center justify-center space-x-8">
              <div className="flex items-center text-sm text-gray-500">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                Secure & Safe
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <div className="w-3 h-3 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                Verified Listings
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <div className="w-3 h-3 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
                24/7 Support
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}