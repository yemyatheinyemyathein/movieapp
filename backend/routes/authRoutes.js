/**
 * Auth Routes
 * Handles registration, login, and current user info
 */

const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe } = require('../controllers/authController.js');
const { protect } = require('../middleware/auth.js');

const router = express.Router();

// Validation rules for registration
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

// Validation rules for login
const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

// @route POST /api/auth/register
router.post('/register', registerValidation, register);

// @route POST /api/auth/login
router.post('/login', loginValidation, login);

// @route GET /api/auth/me
router.get('/me', protect, getMe);

module.exports = router;