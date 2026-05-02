/**
 * User Routes
 * Favorites management and user administration
 */

const express = require('express');
const {
  getFavorites,
  addFavorite,
  removeFavorite,
  getAllUsers,
} = require('../controllers/userController.js');
const { protect, authorize } = require('../middleware/auth.js');

const router = express.Router();

// All user routes require authentication
router.use(protect);

// @route GET  /api/users/favorites
router.get('/favorites', getFavorites);

// @route POST /api/users/favorites/:movieId
router.post('/favorites/:movieId', addFavorite);

// @route DELETE /api/users/favorites/:movieId
router.delete('/favorites/:movieId', removeFavorite);

// @route GET /api/users (Admin only)
router.get('/', authorize('admin'), getAllUsers);

module.exports = router;