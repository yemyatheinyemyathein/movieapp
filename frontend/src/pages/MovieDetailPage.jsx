/**
 * Movie Detail Page
 * Full movie information with trailer, cast, and favorite toggle
 */

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

// Extract YouTube video ID from URL
const getYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:v=|youtu\.be\/)([^&\s]+)/);
  return match ? match[1] : null;
};

// Skeleton for loading state
const DetailSkeleton = () => (
  <div className="animate-fade-in">
    <div className="h-[50vh] skeleton" />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
      <div className="h-12 skeleton rounded w-1/2" />
      <div className="h-4 skeleton rounded w-1/4" />
      <div className="h-20 skeleton rounded" />
    </div>
  </div>
);

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isFavorite, addFavorite, removeFavorite } = useAuth();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favLoading, setFavLoading] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await api.get(`/movies/${id}`);
        setMovie(res.data.data);
      } catch (err) {
        toast.error('Movie not found');
        navigate('/movies');
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
    window.scrollTo(0, 0);
  }, [id]);

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add favorites');
      return;
    }
    setFavLoading(true);
    try {
      if (isFavorite(movie._id)) {
        await removeFavorite(movie._id);
        toast.success('Removed from favorites');
      } else {
        await addFavorite(movie._id);
        toast.success('Added to favorites ❤️');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setFavLoading(false);
    }
  };

  if (loading) return <DetailSkeleton />;
  if (!movie)  return null;

  const youtubeId = getYouTubeId(movie.trailerUrl);
  const favorited = isFavorite(movie._id);
  const releaseYear = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : '—';

  return (
    <div className="page-enter">
      {/* ─── Backdrop Hero ─── */}
      <div className="relative h-[55vh] min-h-[400px] overflow-hidden">
        {movie.backdrop ? (
          <img src={movie.backdrop} alt={movie.title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-dark-700 to-dark-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900/70 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 flex items-center gap-2 glass text-gray-300 hover:text-white
                     px-4 py-2 rounded-xl text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
          Back
        </button>
      </div>

      {/* ─── Main Content ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10 -mt-32 relative z-10">

          {/* Poster (hidden on small screens) */}
          <div className="hidden lg:block flex-shrink-0 w-56">
            <div className="rounded-xl overflow-hidden shadow-2xl border-2 border-dark-500">
              {movie.poster ? (
                <img src={movie.poster} alt={movie.title} className="w-full" />
              ) : (
                <div className="aspect-[2/3] bg-dark-600 flex items-center justify-center">
                  <span className="text-gray-500 text-xs text-center px-4">{movie.title}</span>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 pt-4 lg:pt-32">
            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genre?.map((g) => (
                <span key={g} className="text-xs bg-brand-500/20 text-brand-400 border border-brand-500/30 px-3 py-1 rounded-full">
                  {g}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="font-display text-4xl md:text-6xl tracking-widest text-white leading-none mb-4">
              {movie.title.toUpperCase()}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
              {/* Rating */}
              <div className="flex items-center gap-1.5">
                <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span className="text-white font-bold text-base">{movie.rating.toFixed(1)}</span>
                {movie.voteCount > 0 && (
                  <span className="text-gray-500 text-xs">({movie.voteCount.toLocaleString()} votes)</span>
                )}
              </div>
              <span className="text-dark-400">|</span>
              <span>{releaseYear}</span>
              {movie.runtime > 0 && (
                <>
                  <span className="text-dark-400">|</span>
                  <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                </>
              )}
              {movie.language && (
                <>
                  <span className="text-dark-400">|</span>
                  <span>{movie.language}</span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-300 text-base leading-relaxed mb-8 max-w-2xl">
              {movie.description}
            </p>

            {/* Director & Cast */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {movie.director && (
                <div>
                  <span className="text-xs uppercase tracking-widest text-gray-500 block mb-1">Director</span>
                  <span className="text-white font-medium">{movie.director}</span>
                </div>
              )}
              {movie.cast?.length > 0 && (
                <div>
                  <span className="text-xs uppercase tracking-widest text-gray-500 block mb-1">Cast</span>
                  <span className="text-white">{movie.cast.join(', ')}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {/* Favorite button */}
              <button
                onClick={handleFavorite}
                disabled={favLoading}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm
                            transition-all active:scale-95 ${
                              favorited
                                ? 'bg-brand-500 text-white hover:bg-brand-600'
                                : 'bg-dark-600 border border-dark-400 text-gray-300 hover:border-brand-500 hover:text-white'
                            }`}
              >
                <svg className="w-5 h-5" fill={favorited ? 'currentColor' : 'none'}
                     stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
                {favLoading ? 'Updating...' : (favorited ? 'In Favorites' : 'Add to Favorites')}
              </button>

              {/* Trailer button */}
              {youtubeId && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="flex items-center gap-2 btn-primary"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/>
                  </svg>
                  Watch Trailer
                </button>
              )}

              {/* External trailer link */}
              {movie.trailerUrl && !youtubeId && (
                <a
                  href={movie.trailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 btn-primary"
                >
                  Watch Trailer ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Trailer Modal ─── */}
      {showTrailer && youtubeId && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setShowTrailer(false)}
        >
          <div
            className="w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
              title="Movie Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <button
            onClick={() => setShowTrailer(false)}
            className="absolute top-6 right-6 text-white bg-dark-700 hover:bg-dark-600 w-10 h-10
                       rounded-full flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      )}

      {/* Spacer */}
      <div className="pb-16" />
    </div>
  );
};

export default MovieDetailPage;