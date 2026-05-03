/**
 * Movies Page
 * Full movie browser with search, genre filter, and pagination
 */

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import MovieGrid from '../components/movies/MovieGrid.jsx';
import SearchBar from '../components/movies/SearchBar.jsx';
import Pagination from '../components/ui/Pagination.jsx';

const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest First' },
  { value: 'rating:desc',    label: 'Highest Rated' },
  { value: 'title:asc',      label: 'A – Z' },
  { value: 'releaseDate:desc', label: 'Release Date' },
];

const MoviesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  // Read filters from URL params
  const search  = searchParams.get('search')  || '';
  const genre   = searchParams.get('genre')   || '';
  const sort    = searchParams.get('sort')    || 'createdAt:desc';
  const page    = parseInt(searchParams.get('page') || '1');

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    if (key !== 'page') next.delete('page'); // Reset page on filter change
    setSearchParams(next);
  };

  // Fetch genres once
  useEffect(() => {
    api.get('/movies/genres').then((r) => setGenres(r.data.data)).catch(console.error);
  }, []);

  // Fetch movies when filters change
  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const [sortBy, order] = sort.split(':');
      const res = await api.get('/movies', {
        params: { search, genre, sortBy, order, page, limit: 18 },
      });
      setMovies(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error('Failed to fetch movies:', err);
    } finally {
      setLoading(false);
    }
  }, [search, genre, sort, page]);

  useEffect(() => { fetchMovies(); }, [fetchMovies]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 page-enter">

      {/* ─── Header ─── */}
      <div className="mb-8">
        <h1 className="font-display text-4xl tracking-widest text-white">BROWSE MOVIES</h1>
        <div className="w-12 h-0.5 bg-brand-500 mt-1" />
        {!loading && (
          <p className="text-gray-500 text-sm mt-2">{pagination.total} movies available</p>
        )}
      </div>

      {/* ─── Filters Bar ─── */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        {/* Search */}
        <SearchBar onSearch={(v) => setParam('search', v)} initialValue={search} />

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setParam('sort', e.target.value)}
          className="bg-dark-600 border border-dark-400 text-white rounded-xl px-4 py-3 text-sm
                     focus:outline-none focus:ring-2 focus:ring-brand-500 lg:w-48"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* ─── Genre Chips ─── */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setParam('genre', '')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            !genre ? 'bg-brand-500 text-white' : 'bg-dark-700 border border-dark-500 text-gray-400 hover:border-brand-500 hover:text-white'
          }`}
        >
          All
        </button>
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => setParam('genre', g === genre ? '' : g)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              g === genre ? 'bg-brand-500 text-white' : 'bg-dark-700 border border-dark-500 text-gray-400 hover:border-brand-500 hover:text-white'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* ─── Movie Grid ─── */}
      <MovieGrid movies={movies} loading={loading} onFavoriteChange={fetchMovies} />

      {/* ─── Pagination ─── */}
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.pages}
        onPageChange={(p) => setParam('page', p.toString())}
      />
    </div>
  );
};

export default MoviesPage;