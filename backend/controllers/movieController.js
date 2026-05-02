/**
 * Movie Controller
 * Handles all movie CRUD operations, search, and filtering
 */

const Movie = require('../models/Movie.js');
const { validationResult } = require('express-validator');

/**
 * @desc    Get all movies with pagination, search, and filtering
 * @route   GET /api/movies
 * @access  Public
 */
const getMovies = async (req, res) => {
  try {
    const {
      search,
      genre,
      page = 1,
      limit = 12,
      sortBy = 'createdAt',
      order = 'desc',
      featured,
    } = req.query;

    // Build query filter
    const filter = {};

    // Text search on title (case-insensitive)
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    // Filter by genre
    if (genre) {
      filter.genre = { $in: [genre] };
    }

    // Filter featured only
    if (featured === 'true') {
      filter.featured = true;
    }

    // Calculate pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Sort direction
    const sortOrder = order === 'asc' ? 1 : -1;

    // Execute query with pagination
    const [movies, total] = await Promise.all([
      Movie.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limitNum),
      Movie.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: movies,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
    });
  } catch (error) {
    console.error('GetMovies error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching movies.' });
  }
};

/**
 * @desc    Get a single movie by ID
 * @route   GET /api/movies/:id
 * @access  Public
 */
const getMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found.' });
    }
    res.json({ success: true, data: movie });
  } catch (error) {
    console.error('GetMovie error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching movie.' });
  }
};

/**
 * @desc    Create a new movie (Admin only)
 * @route   POST /api/movies
 * @access  Private/Admin
 */
const createMovie = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const movie = await Movie.create(req.body);
    res.status(201).json({ success: true, data: movie });
  } catch (error) {
    console.error('CreateMovie error:', error);
    res.status(500).json({ success: false, message: 'Server error creating movie.' });
  }
};

/**
 * @desc    Update a movie (Admin only)
 * @route   PUT /api/movies/:id
 * @access  Private/Admin
 */
const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found.' });
    }

    res.json({ success: true, data: movie });
  } catch (error) {
    console.error('UpdateMovie error:', error);
    res.status(500).json({ success: false, message: 'Server error updating movie.' });
  }
};

/**
 * @desc    Delete a movie (Admin only)
 * @route   DELETE /api/movies/:id
 * @access  Private/Admin
 */
const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found.' });
    }
    res.json({ success: true, message: 'Movie deleted successfully.' });
  } catch (error) {
    console.error('DeleteMovie error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting movie.' });
  }
};

/**
 * @desc    Get all unique genres
 * @route   GET /api/movies/genres
 * @access  Public
 */
const getGenres = async (req, res) => {
  try {
    const genres = await Movie.distinct('genre');
    res.json({ success: true, data: genres.sort() });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching genres.' });
  }
};

module.exports = { getMovies, getMovie, createMovie, updateMovie, deleteMovie, getGenres };