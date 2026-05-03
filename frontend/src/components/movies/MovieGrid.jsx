/**
 * MovieGrid Component
 * Renders a responsive grid of movie cards with loading skeletons
 */

import MovieCard from './MovieCard.jsx';

// Skeleton card for loading state
const SkeletonCard = () => (
  <div className="bg-dark-700 rounded-xl overflow-hidden border border-dark-500">
    <div className="aspect-[2/3] skeleton" />
    <div className="p-3 space-y-2">
      <div className="h-4 skeleton rounded w-3/4" />
      <div className="h-3 skeleton rounded w-1/2" />
      <div className="flex gap-1">
        <div className="h-5 w-16 skeleton rounded-full" />
        <div className="h-5 w-12 skeleton rounded-full" />
      </div>
    </div>
  </div>
);

const MovieGrid = ({ movies, loading, onFavoriteChange }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!movies?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <svg className="w-16 h-16 text-dark-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h3 className="text-gray-400 text-lg font-medium">No movies found</h3>
        <p className="text-gray-600 text-sm mt-1">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {movies.map((movie, i) => (
        <div
          key={movie._id}
          style={{ animationDelay: `${i * 30}ms` }}
          className="animate-fade-in"
        >
          <MovieCard movie={movie} onFavoriteChange={onFavoriteChange} />
        </div>
      ))}
    </div>
  );
};

export default MovieGrid;