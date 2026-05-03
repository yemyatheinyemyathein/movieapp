/**
 * Navbar Component
 * Top navigation bar with auth state awareness
 */

import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive ? 'text-brand-400' : 'text-gray-400 hover:text-white'
    }`;

  return (
    <nav className="glass sticky top-0 z-50 border-b border-dark-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center
                            group-hover:bg-brand-400 transition-colors">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
                <path d="M14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
              </svg>
            </div>
            <span className="font-display text-xl tracking-widest text-white">
              CINEVAULT
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/"       end className={navLinkClass}>Home</NavLink>
            <NavLink to="/movies"     className={navLinkClass}>Movies</NavLink>
            {isAuthenticated && (
              <NavLink to="/favorites" className={navLinkClass}>Favorites</NavLink>
            )}
            {isAdmin && (
              <NavLink to="/admin"     className={navLinkClass}>
                <span className="text-brand-400">Admin</span>
              </NavLink>
            )}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">
                  Hi, <span className="text-white font-medium">{user.name.split(' ')[0]}</span>
                </span>
                <button onClick={handleLogout} className="btn-ghost text-sm">
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login"    className="btn-ghost text-sm">Sign In</Link>
                <Link to="/register" className="btn-primary py-2 px-4 text-sm">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-400 hover:text-white p-2"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
              }
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-dark-500 animate-fade-in space-y-2">
            {[
              { to: '/',          label: 'Home',      end: true },
              { to: '/movies',    label: 'Movies' },
              ...(isAuthenticated ? [{ to: '/favorites', label: 'Favorites' }] : []),
              ...(isAdmin         ? [{ to: '/admin',     label: 'Admin' }]     : []),
            ].map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-dark-600 text-brand-400' : 'text-gray-400 hover:text-white hover:bg-dark-700'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <div className="pt-2 border-t border-dark-500">
              {isAuthenticated ? (
                <button onClick={handleLogout} className="w-full text-left py-2 px-3 text-sm text-gray-400 hover:text-white">
                  Logout
                </button>
              ) : (
                <div className="flex gap-2">
                  <Link to="/login"    onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2 btn-ghost text-sm">Sign In</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2 btn-primary text-sm">Register</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;