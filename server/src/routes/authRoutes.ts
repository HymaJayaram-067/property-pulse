import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  getMe,
  addToFavorites,
  removeFromFavorites,
  getFavorites,
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Auth routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/me', authenticate, getMe);

// Favorites routes
router.post('/favorites/:propertyId', authenticate, addToFavorites);
router.delete('/favorites/:propertyId', authenticate, removeFromFavorites);
router.get('/favorites', authenticate, getFavorites);

export default router;
