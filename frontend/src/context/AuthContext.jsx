/**
 * Auth Context
 * Provides global authentication state and actions to all components
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api.js';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Initial auth check loading

  // ─── Initialize from localStorage ────────────────────────────────────────

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        // Verify token is still valid
        verifyToken();
      } catch {
        clearAuth();
      }
    }
    setLoading(false);
  }, []);

  const verifyToken = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    } catch {
      clearAuth();
    }
  };

  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // ─── Auth Actions ─────────────────────────────────────────────────────────

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data;
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    clearAuth();
    toast.success('Logged out successfully');
  };

  // ─── Favorites Management ─────────────────────────────────────────────────

  const addFavorite = useCallback(async (movieId) => {
    const res = await api.post(`/users/favorites/${movieId}`);
    // Update local user state with new favorites list
    const updatedUser = { ...user, favorites: res.data.favorites };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return res.data;
  }, [user]);

  const removeFavorite = useCallback(async (movieId) => {
    const res = await api.delete(`/users/favorites/${movieId}`);
    const updatedUser = { ...user, favorites: res.data.favorites };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return res.data;
  }, [user]);

  const isFavorite = useCallback((movieId) => {
    if (!user?.favorites) return false;
    return user.favorites.some(
      (id) => id === movieId || id._id === movieId || id === movieId.toString()
    );
  }, [user]);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    register,
    login,
    logout,
    addFavorite,
    removeFavorite,
    isFavorite,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for consuming auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};