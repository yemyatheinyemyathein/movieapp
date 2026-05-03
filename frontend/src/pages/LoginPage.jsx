/**
 * Login Page
 */

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [form, setForm]   = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate(location.state?.from || '/', { replace: true });
    return null;
  }

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 🎬');
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  // Demo credentials fill
  const fillDemo = (role) => {
    if (role === 'admin') setForm({ email: 'admin@movieapp.com', password: 'admin123' });
    else setForm({ email: 'user@movieapp.com', password: 'user123' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 page-enter">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-700/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="font-display text-4xl tracking-widest gradient-text">
            CINEVAULT
          </Link>
          <p className="text-gray-500 text-sm mt-2">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-dark-700 border border-dark-500 rounded-2xl p-8">
          {/* Demo buttons */}
          <div className="flex gap-2 mb-6">
            <button onClick={() => fillDemo('user')}  className="flex-1 text-xs py-2 bg-dark-600 hover:bg-dark-500 text-gray-400 hover:text-white rounded-lg transition-colors border border-dark-400">
              Demo: User
            </button>
            <button onClick={() => fillDemo('admin')} className="flex-1 text-xs py-2 bg-dark-600 hover:bg-dark-500 text-brand-400 hover:text-brand-300 rounded-lg transition-colors border border-dark-400">
              Demo: Admin
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-500" />
            </div>
            <div className="relative flex justify-center text-xs text-gray-500">
              <span className="bg-dark-700 px-3">or sign in manually</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs text-gray-400 font-medium mb-1.5 uppercase tracking-wide">Email</label>
              <input
                name="email" type="email" value={form.email}
                onChange={handleChange} required autoComplete="email"
                placeholder="you@example.com"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 font-medium mb-1.5 uppercase tracking-wide">Password</label>
              <input
                name="password" type="password" value={form.password}
                onChange={handleChange} required autoComplete="current-password"
                placeholder="••••••••"
                className="input-field"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Signing In...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;