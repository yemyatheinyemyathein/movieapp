/**
 * Register Page
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/', { replace: true });
    return null;
  }

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome to CineVault 🎬');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 page-enter">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-brand-700/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-10">
          <Link to="/" className="font-display text-4xl tracking-widest gradient-text">CINEVAULT</Link>
          <p className="text-gray-500 text-sm mt-2">Create your free account</p>
        </div>

        <div className="bg-dark-700 border border-dark-500 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs text-gray-400 font-medium mb-1.5 uppercase tracking-wide">Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} required
                     placeholder="Your name" className="input-field" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 font-medium mb-1.5 uppercase tracking-wide">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required
                     placeholder="you@example.com" className="input-field" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 font-medium mb-1.5 uppercase tracking-wide">Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} required
                     minLength={6} placeholder="At least 6 characters" className="input-field" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 font-medium mb-1.5 uppercase tracking-wide">Confirm Password</label>
              <input name="confirm" type="password" value={form.confirm} onChange={handleChange} required
                     placeholder="Repeat password" className="input-field" />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;