/**
 * MovieForm Component (Admin)
 * Form for creating and editing movies
 */

import { useState, useEffect } from 'react';

const GENRES = [
  'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime',
  'Documentary', 'Drama', 'Fantasy', 'History', 'Horror', 'Musical',
  'Mystery', 'Romance', 'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western',
];

const defaultForm = {
  title: '', description: '', releaseDate: '', genre: [],
  rating: '', voteCount: '', poster: '', backdrop: '',
  trailerUrl: '', director: '', cast: '', runtime: '',
  language: 'English', featured: false,
};

const MovieForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState(defaultForm);

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      setForm({
        ...defaultForm,
        ...initialData,
        releaseDate: initialData.releaseDate
          ? new Date(initialData.releaseDate).toISOString().split('T')[0]
          : '',
        cast: Array.isArray(initialData.cast)
          ? initialData.cast.join(', ')
          : initialData.cast || '',
        rating: initialData.rating?.toString() || '',
        voteCount: initialData.voteCount?.toString() || '',
        runtime: initialData.runtime?.toString() || '',
      });
    } else {
      setForm(defaultForm);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleGenreToggle = (genre) => {
    setForm((prev) => ({
      ...prev,
      genre: prev.genre.includes(genre)
        ? prev.genre.filter((g) => g !== genre)
        : [...prev.genre, genre],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Transform form data for API
    const data = {
      ...form,
      rating: parseFloat(form.rating) || 0,
      voteCount: parseInt(form.voteCount) || 0,
      runtime: parseInt(form.runtime) || 0,
      cast: form.cast.split(',').map((s) => s.trim()).filter(Boolean),
    };
    onSubmit(data);
  };

  const inputClass = "w-full bg-dark-800 border border-dark-400 text-white rounded-lg px-3 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all";
  const labelClass = "block text-xs text-gray-400 font-medium mb-1.5 uppercase tracking-wide";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <label className={labelClass}>Title *</label>
        <input name="title" value={form.title} onChange={handleChange} required
               placeholder="Movie title" className={inputClass} />
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description *</label>
        <textarea name="description" value={form.description} onChange={handleChange} required
                  rows={3} placeholder="Movie synopsis..." className={inputClass} />
      </div>

      {/* Row: Release Date + Rating */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Release Date *</label>
          <input name="releaseDate" type="date" value={form.releaseDate} onChange={handleChange} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Rating (0-10)</label>
          <input name="rating" type="number" min="0" max="10" step="0.1"
                 value={form.rating} onChange={handleChange} placeholder="8.5" className={inputClass} />
        </div>
      </div>

      {/* Row: Director + Runtime */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Director</label>
          <input name="director" value={form.director} onChange={handleChange}
                 placeholder="Director name" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Runtime (min)</label>
          <input name="runtime" type="number" min="0" value={form.runtime}
                 onChange={handleChange} placeholder="120" className={inputClass} />
        </div>
      </div>

      {/* Cast */}
      <div>
        <label className={labelClass}>Cast (comma separated)</label>
        <input name="cast" value={form.cast} onChange={handleChange}
               placeholder="Actor 1, Actor 2, Actor 3" className={inputClass} />
      </div>

      {/* Poster URL */}
      <div>
        <label className={labelClass}>Poster URL</label>
        <input name="poster" value={form.poster} onChange={handleChange}
               placeholder="https://..." className={inputClass} />
      </div>

      {/* Trailer URL */}
      <div>
        <label className={labelClass}>Trailer URL (YouTube)</label>
        <input name="trailerUrl" value={form.trailerUrl} onChange={handleChange}
               placeholder="https://youtube.com/watch?v=..." className={inputClass} />
      </div>

      {/* Language */}
      <div>
        <label className={labelClass}>Language</label>
        <input name="language" value={form.language} onChange={handleChange} className={inputClass} />
      </div>

      {/* Genres */}
      <div>
        <label className={labelClass}>Genres * (select at least one)</label>
        <div className="flex flex-wrap gap-2">
          {GENRES.map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() => handleGenreToggle(genre)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                form.genre.includes(genre)
                  ? 'bg-brand-500 border-brand-500 text-white'
                  : 'bg-dark-800 border-dark-400 text-gray-400 hover:border-brand-500 hover:text-white'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Featured checkbox */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="featured"
          name="featured"
          checked={form.featured}
          onChange={handleChange}
          className="w-4 h-4 rounded border-dark-400 text-brand-500 focus:ring-brand-500 bg-dark-800"
        />
        <label htmlFor="featured" className="text-sm text-gray-300">Mark as Featured</label>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading ? 'Saving...' : (initialData ? 'Update Movie' : 'Create Movie')}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary px-6">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default MovieForm;