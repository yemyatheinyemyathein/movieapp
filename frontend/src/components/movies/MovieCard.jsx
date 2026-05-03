/**
 * MovieCard Component
 * Displays a movie in grid format with poster, title, rating, and favorite toggle
 */

import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import toast from 'react-hot-toast';

// Star rating display
const StarRating = ({ rating }) => {
  const stars = Math.round((rating / 10) * 5);
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map((i) => (
        <svg key={i} className={`w-3 h-3 ${i <= stars ? 'text-amber-400' : 'text-gray-600'}`}
             fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
      <span className="text-gray-400 text-xs ml-1">{rating.toFixed(1)}</span>
    </div>
  );
};

const MovieCard = ({ movie, onFavoriteChange }) => {
  const { isAuthenticated, isFavorite, addFavorite, removeFavorite } = useAuth();
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  const favorited = isFavorite(movie._id);

  const handleFavoriteToggle = async (e) => {
    e.preventDefault(); // Don't navigate to detail page
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please sign in to add favorites');
      return;
    }

    setFavoriteLoading(true);
    try {
      if (favorited) {
        await removeFavorite(movie._id);
        toast.success(`Removed from favorites`);
      } else {
        await addFavorite(movie._id);
        toast.success(`Added to favorites`);
      }
      onFavoriteChange?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setFavoriteLoading(false);
    }
  };

  return (
    <Link
      to={`/movies/${movie._id}`}
      className="group block bg-dark-700 rounded-xl overflow-hidden
                 border border-dark-500 hover:border-brand-500/50
                 transition-all duration-300 movie-card-glow animate-fade-in"
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden bg-dark-600">
        {!imgError && movie.poster ? (
          <img
            src={movie.poster}
            alt={movie.title}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          /* Fallback poster */
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-dark-600 to-dark-800">
            <svg className="w-16 h-16 text-dark-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                    d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"/>
            </svg>
            <span className="text-gray-500 text-xs text-center px-4">{movie.title}</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/20 to-transparent
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Favorite button */}
        <button
          onClick={handleFavoriteToggle}
          disabled={favoriteLoading}
          className={`absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center
                      transition-all duration-200 ${
                        favorited
                          ? 'bg-brand-500 text-white'
                          : 'bg-dark-900/70 text-gray-400 hover:text-white hover:bg-dark-600'
                      }`}
          title={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          {favoriteLoading ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          ) : (
            <svg className="w-4 h-4" fill={favorited ? 'currentColor' : 'none'}
                 stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
          )}
        </button>

        {/* Featured badge */}
        {movie.featured && (
          <div className="absolute top-2 left-2 bg-brand-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            Featured
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-white font-semibold text-sm leading-tight truncate group-hover:text-brand-400 transition-colors">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between mt-1.5">
          <StarRating rating={movie.rating} />
          <span className="text-gray-500 text-xs">
            {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : '—'}
          </span>
        </div>
        {/* Genres */}
        <div className="flex flex-wrap gap-1 mt-2">
          {movie.genre?.slice(0, 2).map((g) => (
            <span key={g} className="text-xs bg-dark-500 text-gray-400 px-2 py-0.5 rounded-full">
              {g}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;