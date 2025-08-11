import { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    conpassword: '',
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
      const res = await fetch(`${API_BASE}/accounts/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
          conpassword: form.conpassword,
          role: form.role,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        const msg = data?.message || data?.data || 'Registration failed';
        throw new Error(typeof msg === 'string' ? msg : 'Registration failed');
      }

      setSuccess('Your account was successfully created');
      setTimeout(() => (window.location.href = '/signin'), 800);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-brand-50 via-white to-brand-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur shadow-xl rounded-2xl overflow-hidden">
          <div className="h-28 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1505692794403-34cb1239b1b6?q=80&w=1200&auto=format&fit=crop')" }} />
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-800">Create your account</h1>
            <p className="text-sm text-gray-500 mb-6">Join the renting community as a Seeker or Room Owner</p>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {String(error)}
              </div>
            )}
            {success && (
              <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => updateField('username', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="johndoe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  value={form.conpassword}
                  onChange={(e) => updateField('conpassword', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => updateField('role', 'seeker')}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${form.role === 'seeker' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    Seeker
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField('role', 'Room Owner')}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${form.role === 'Room Owner' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    Room Owner
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500">Pick your role. You can use a different account for each role.</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white py-2.5 font-medium shadow-sm"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              Already have an account? <a href="/signin" className="text-brand-700 hover:underline">Sign in</a>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          Find your next stay or welcome new tenants with confidence.
        </div>
      </div>
    </div>
  );
}