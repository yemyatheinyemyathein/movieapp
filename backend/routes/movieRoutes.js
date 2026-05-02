/**
 * Movie Routes
 * Public and protected movie endpoints
 */

const express = require('express');
const { body } = require('express-validator');
const {
  getMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
  getGenres,
} = require('../controllers/movieController.js');
const { protect, authorize } = require('../middleware/auth.js');

const router = express.Router();

// Validation rules for creating/updating movies
const movieValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('releaseDate').isISO8601().withMessage('Valid release date is required'),
  body('genre').isArray({ min: 1 }).withMessage('At least one genre is required'),
];

// @route GET /api/movies/genres  (must be before /:id route)
router.get('/genres', getGenres);

// @route GET /api/movies
router.get('/', getMovies);

// @route GET /api/movies/:id
router.get('/:id', getMovie);

// @route POST /api/movies (Admin only)
router.post('/', protect, authorize('admin'), movieValidation, createMovie);

// @route PUT /api/movies/:id (Admin only)
router.put('/:id', protect, authorize('admin'), updateMovie);

// @route DELETE /api/movies/:id (Admin only)
router.delete('/:id', protect, authorize('admin'), deleteMovie);

module.exports = router;