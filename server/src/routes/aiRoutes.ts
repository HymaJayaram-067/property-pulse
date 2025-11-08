import express from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import {
  aiSearch,
  generateDescription,
  getRecommendations,
} from '../controllers/aiController';
import { validate } from '../middleware/validation';

const router = express.Router();

// Rate limiting for AI endpoints (prevent abuse)
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: 'Too many AI requests, please try again later',
});

// Validation rules
const searchValidation = [
  body('query').trim().notEmpty().withMessage('Search query is required'),
];

const descriptionValidation = [
  body('propertyDetails').notEmpty().withMessage('Property details are required'),
];

// AI routes
router.post('/search', aiLimiter, searchValidation, validate, aiSearch);

router.post(
  '/generate-description',
  aiLimiter,
  descriptionValidation,
  validate,
  generateDescription
);

router.post('/recommend', aiLimiter, getRecommendations);

export default router;
