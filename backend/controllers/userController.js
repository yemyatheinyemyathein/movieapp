/**
 * User Controller
 * Handles user-specific actions like managing favorites
 */

const User = require('../models/User.js');
const Movie = require('../models/Movie.js');

/**
 * @desc    Get user's favorite movies
 * @route   GET /api/users/favorites
 * @access  Private
 */
const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      'favorites',
      'title poster rating genre releaseDate description'
    );
    res.json({ success: true, data: user.favorites });
  } catch (error) {
    console.error('GetFavorites error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching favorites.' });
  }
};

/**
 * @desc    Add a movie to favorites
 * @route   POST /api/users/favorites/:movieId
 * @access  Private
 */
const addFavorite = async (req, res) => {
  try {
    const { movieId } = req.params;

    // Verify movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found.' });
    }

    const user = await User.findById(req.user._id);

    // Prevent duplicate favorites
    if (user.favorites.includes(movieId)) {
      return res.status(400).json({
        success: false,
        message: 'Movie is already in your favorites.',
      });
    }

    user.favorites.push(movieId);
    await user.save();

    res.json({
      success: true,
      message: `"${movie.title}" added to favorites.`,
      favorites: user.favorites,
    });
  } catch (error) {
    console.error('AddFavorite error:', error);
    res.status(500).json({ success: false, message: 'Server error adding favorite.' });
  }
};

/**
 * @desc    Remove a movie from favorites
 * @route   DELETE /api/users/favorites/:movieId
 * @access  Private
 */
const removeFavorite = async (req, res) => {
  try {
    const { movieId } = req.params;

    const user = await User.findById(req.user._id);
    const beforeCount = user.favorites.length;

    // Filter out the movie
    user.favorites = user.favorites.filter(
      (id) => id.toString() !== movieId
    );

    if (user.favorites.length === beforeCount) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found in favorites.',
      });
    }

    await user.save();

    res.json({
      success: true,
      message: 'Movie removed from favorites.',
      favorites: user.favorites,
    });
  } catch (error) {
    console.error('RemoveFavorite error:', error);
    res.status(500).json({ success: false, message: 'Server error removing favorite.' });
  }
};

/**
 * @desc    Get all users (Admin only)
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users, total: users.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching users.' });
  }
};

module.exports = { getFavorites, addFavorite, removeFavorite, getAllUsers };