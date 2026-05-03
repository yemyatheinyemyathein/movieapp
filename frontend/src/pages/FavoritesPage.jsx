/**
 * Favorites Page
 * Displays the logged-in user's saved favorite movies
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api.js';
import MovieGrid from '../components/movies/MovieGrid.jsx';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const res = await api.get('/users/favorites');
      setFavorites(res.data.data);
    } catch (err) {
      console.error('Failed to fetch favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFavorites(); }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 page-enter">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl tracking-widest text-white">MY FAVORITES</h1>
        <div className="w-12 h-0.5 bg-brand-500 mt-1" />
        {!loading && (
          <p className="text-gray-500 text-sm mt-2">
            {favorites.length} {favorites.length === 1 ? 'movie' : 'movies'} saved
          </p>
        )}
      </div>

      {!loading && favorites.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-dark-700 border border-dark-500 flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
          </div>
          <h3 className="text-gray-300 text-xl font-semibold mb-2">No favorites yet</h3>
          <p className="text-gray-600 text-sm mb-6">
            Browse movies and click the heart icon to add them here.
          </p>
          <Link to="/movies" className="btn-primary">Browse Movies</Link>
        </div>
      ) : (
        <MovieGrid
          movies={favorites}
          loading={loading}
          onFavoriteChange={fetchFavorites} // Re-fetch when a favorite is toggled
        />
      )}
    </div>
  );
};

export default FavoritesPage;