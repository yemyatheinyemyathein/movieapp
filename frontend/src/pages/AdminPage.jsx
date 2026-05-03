/**
 * Admin Page
 * Dashboard for managing movies - create, edit, delete
 */

import { useState, useEffect } from 'react';
import api from '../utils/api.js';
import MovieForm from '../components/admin/MovieForm.jsx';
import toast from 'react-hot-toast';

const AdminPage = () => {
  const [movies, setMovies]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm]     = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [deleteId, setDeleteId]     = useState(null);
  const [search, setSearch]         = useState('');

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await api.get('/movies?limit=100&sortBy=createdAt&order=desc');
      setMovies(res.data.data);
    } catch (err) {
      toast.error('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMovies(); }, []);

  const handleCreate = async (data) => {
    setFormLoading(true);
    try {
      await api.post('/movies', data);
      toast.success('Movie created successfully');
      setShowForm(false);
      fetchMovies();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create movie');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    setFormLoading(true);
    try {
      await api.put(`/movies/${editingMovie._id}`, data);
      toast.success('Movie updated successfully');
      setEditingMovie(null);
      setShowForm(false);
      fetchMovies();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update movie');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/movies/${id}`);
      toast.success('Movie deleted');
      setDeleteId(null);
      fetchMovies();
    } catch (err) {
      toast.error('Failed to delete movie');
    }
  };

  const openEdit = (movie) => {
    setEditingMovie(movie);
    setShowForm(true);
  };

  const openCreate = () => {
    setEditingMovie(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingMovie(null);
  };

  const filteredMovies = movies.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 page-enter">
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-400 bg-brand-500/10 border border-brand-500/20 px-2 py-0.5 rounded">
              Admin
            </span>
            <h1 className="font-display text-4xl tracking-widest text-white">DASHBOARD</h1>
          </div>
          <div className="w-12 h-0.5 bg-brand-500" />
          <p className="text-gray-500 text-sm mt-2">{movies.length} total movies</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
          </svg>
          Add Movie
        </button>
      </div>

      {/* ─── Search ─── */}
      <div className="relative mb-6 max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter movies..."
          className="w-full bg-dark-700 border border-dark-500 text-white text-sm rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
        />
      </div>

      {/* ─── Movie Table ─── */}
      <div className="bg-dark-700 rounded-xl border border-dark-500 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-500">
                <th className="text-left text-xs uppercase tracking-widest text-gray-500 px-5 py-3">Movie</th>
                <th className="text-left text-xs uppercase tracking-widest text-gray-500 px-4 py-3 hidden md:table-cell">Genres</th>
                <th className="text-left text-xs uppercase tracking-widest text-gray-500 px-4 py-3 hidden sm:table-cell">Year</th>
                <th className="text-left text-xs uppercase tracking-widest text-gray-500 px-4 py-3 hidden sm:table-cell">Rating</th>
                <th className="text-left text-xs uppercase tracking-widest text-gray-500 px-4 py-3 hidden lg:table-cell">Featured</th>
                <th className="text-right text-xs uppercase tracking-widest text-gray-500 px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-600">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-5 py-3"><div className="h-8 skeleton rounded w-40" /></td>
                    <td className="px-4 py-3 hidden md:table-cell"><div className="h-5 skeleton rounded w-24" /></td>
                    <td className="px-4 py-3 hidden sm:table-cell"><div className="h-5 skeleton rounded w-12" /></td>
                    <td className="px-4 py-3 hidden sm:table-cell"><div className="h-5 skeleton rounded w-10" /></td>
                    <td className="px-4 py-3 hidden lg:table-cell"><div className="h-5 skeleton rounded w-10" /></td>
                    <td className="px-5 py-3"><div className="h-8 skeleton rounded w-20 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredMovies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">No movies found</td>
                </tr>
              ) : (
                filteredMovies.map((movie) => (
                  <tr key={movie._id} className="hover:bg-dark-600/50 transition-colors">
                    {/* Poster + Title */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-14 rounded overflow-hidden bg-dark-600 flex-shrink-0">
                          {movie.poster ? (
                            <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-dark-500" />
                          )}
                        </div>
                        <span className="text-white text-sm font-medium line-clamp-2 max-w-[180px]">
                          {movie.title}
                        </span>
                      </div>
                    </td>

                    {/* Genres */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {movie.genre?.slice(0, 2).map((g) => (
                          <span key={g} className="text-xs text-gray-400 bg-dark-600 px-2 py-0.5 rounded-full">{g}</span>
                        ))}
                      </div>
                    </td>

                    {/* Year */}
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-gray-400 text-sm">
                        {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : '—'}
                      </span>
                    </td>

                    {/* Rating */}
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        <span className="text-white text-sm">{movie.rating.toFixed(1)}</span>
                      </div>
                    </td>

                    {/* Featured */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {movie.featured ? (
                        <span className="text-xs text-brand-400 bg-brand-500/10 border border-brand-500/20 px-2 py-0.5 rounded-full">
                          Featured
                        </span>
                      ) : (
                        <span className="text-dark-400">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(movie)}
                          className="text-gray-400 hover:text-white text-xs px-3 py-1.5 rounded-lg bg-dark-600 hover:bg-dark-500 transition-colors border border-dark-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteId(movie._id)}
                          className="text-red-400 hover:text-red-300 text-xs px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors border border-red-500/20"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Movie Form Modal ─── */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-start justify-center p-4 overflow-y-auto">
          <div
            className="w-full max-w-2xl bg-dark-700 border border-dark-500 rounded-2xl p-6 my-8 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl tracking-widest text-white">
                {editingMovie ? 'EDIT MOVIE' : 'ADD MOVIE'}
              </h2>
              <button onClick={closeForm} className="text-gray-500 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <MovieForm
              initialData={editingMovie}
              onSubmit={editingMovie ? handleUpdate : handleCreate}
              onCancel={closeForm}
              loading={formLoading}
            />
          </div>
        </div>
      )}

      {/* ─── Delete Confirm Modal ─── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-dark-700 border border-dark-500 rounded-xl p-6 w-full max-w-sm animate-slide-up">
            <h3 className="text-white font-semibold text-lg mb-2">Delete Movie?</h3>
            <p className="text-gray-400 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
              >
                Delete
              </button>
              <button onClick={() => setDeleteId(null)} className="flex-1 btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;