/**
 * Movie Model
 * Defines the schema for movies in the database
 */

const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Movie description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    releaseDate: {
      type: Date,
      required: [true, 'Release date is required'],
    },
    genre: {
      type: [String],
      required: [true, 'At least one genre is required'],
    },
    rating: {
      type: Number,
      min: [0, 'Rating cannot be less than 0'],
      max: [10, 'Rating cannot exceed 10'],
      default: 0,
    },
    voteCount: {
      type: Number,
      default: 0,
    },
    poster: {
      type: String, // URL to poster image
      default: '',
    },
    backdrop: {
      type: String, // URL to backdrop/banner image
      default: '',
    },
    trailerUrl: {
      type: String, // YouTube or other video link
      default: '',
    },
    director: {
      type: String,
      default: '',
    },
    cast: {
      type: [String], // List of main cast members
      default: [],
    },
    runtime: {
      type: Number, // Duration in minutes
      default: 0,
    },
    language: {
      type: String,
      default: 'English',
    },
    // Optional: TMDB ID for fetching external data
    tmdbId: {
      type: Number,
      default: null,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    // Add virtual field for formatted release year
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: release year extracted from releaseDate
MovieSchema.virtual('releaseYear').get(function () {
  return this.releaseDate ? new Date(this.releaseDate).getFullYear() : null;
});

// Index for text search on title and description
MovieSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Movie', MovieSchema);