/**
 * Home Page
 * Hero section + featured movies + call to action
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api.js';
import MovieGrid from '../components/movies/MovieGrid.jsx';

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroMovie, setHeroMovie] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [featuredRes, recentRes] = await Promise.all([
          api.get('/movies?featured=true&limit=6'),
          api.get('/movies?limit=12&sortBy=createdAt&order=desc'),
        ]);
        const featuredMovies = featuredRes.data.data;
        setFeatured(featuredMovies);
        setRecent(recentRes.data.data);
        // Pick a random featured movie for the hero
        if (featuredMovies.length > 0) {
          setHeroMovie(featuredMovies[Math.floor(Math.random() * featuredMovies.length)]);
        }
      } catch (err) {
        console.error('Failed to fetch movies:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div className="page-enter">
      {/* ─── Hero Section ─── */}
      <section className="relative h-[75vh] min-h-[500px] overflow-hidden">
        {/* Background */}
        {heroMovie?.backdrop ? (
          <img
            src={heroMovie.backdrop}
            alt={heroMovie.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-dark-800 via-dark-700 to-dark-900" />
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/40 to-transparent" />

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-end pb-16 px-6 lg:px-12">
          <div className="max-w-2xl animate-slide-up">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 bg-brand-500/20 border border-brand-500/40
                            text-brand-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5
                            rounded-full mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
              Now Trending
            </div>

            {heroMovie && (
              <>
                <h1 className="font-display text-5xl md:text-7xl tracking-widest text-white leading-none mb-3">
                  {heroMovie.title.toUpperCase()}
                </h1>
                <p className="text-gray-300 text-base md:text-lg leading-relaxed line-clamp-3 mb-6 max-w-lg">
                  {heroMovie.description}
                </p>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <span className="text-white font-bold text-lg">{heroMovie.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-gray-500">·</span>
                  <span className="text-gray-400">{new Date(heroMovie.releaseDate).getFullYear()}</span>
                  {heroMovie.runtime > 0 && (
                    <>
                      <span className="text-gray-500">·</span>
                      <span className="text-gray-400">{Math.floor(heroMovie.runtime / 60)}h {heroMovie.runtime % 60}m</span>
                    </>
                  )}
                </div>
              </>
            )}

            <div className="flex items-center gap-3">
              {heroMovie && (
                <Link
                  to={`/movies/${heroMovie._id}`}
                  className="btn-primary flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/>
                  </svg>
                  View Movie
                </Link>
              )}
              <Link to="/movies" className="btn-secondary">
                Browse All
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Featured Movies ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl tracking-widest text-white">FEATURED</h2>
            <div className="w-16 h-0.5 bg-brand-500 mt-1" />
          </div>
          <Link to="/movies?featured=true" className="text-brand-400 text-sm hover:text-brand-300 transition-colors">
            View all →
          </Link>
        </div>
        <MovieGrid movies={featured} loading={loading} />
      </section>

      {/* ─── Recently Added ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl tracking-widest text-white">LATEST ADDITIONS</h2>
            <div className="w-16 h-0.5 bg-brand-500 mt-1" />
          </div>
          <Link to="/movies" className="text-brand-400 text-sm hover:text-brand-300 transition-colors">
            View all →
          </Link>
        </div>
        <MovieGrid movies={recent} loading={loading} />
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="bg-gradient-to-r from-brand-600 via-brand-500 to-brand-700 py-16">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="font-display text-4xl md:text-5xl tracking-widest text-white mb-4">
            START YOUR WATCHLIST
          </h2>
          <p className="text-brand-100 text-lg mb-8">
            Create an account to save your favorite movies and track what you want to watch.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/register" className="bg-white text-brand-600 font-bold py-3 px-8 rounded-lg hover:bg-brand-50 transition-colors active:scale-95">
              Sign Up Free
            </Link>
            <Link to="/movies" className="text-white border border-white/50 py-3 px-8 rounded-lg hover:bg-white/10 transition-colors">
              Browse Movies
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;