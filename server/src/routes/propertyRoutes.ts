import express from 'express';
import { body } from 'express-validator';
import {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertiesByUser,
} from '../controllers/propertyController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { upload } from '../services/uploadService';

const router = express.Router();

// Validation rules for creating/updating properties
const propertyValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('location.address').notEmpty().withMessage('Address is required'),
  body('location.city').notEmpty().withMessage('City is required'),
  body('location.state').notEmpty().withMessage('State is required'),
  body('location.zipCode').notEmpty().withMessage('Zip code is required'),
  body('bedrooms').isNumeric().withMessage('Bedrooms must be a number'),
  body('bathrooms').isNumeric().withMessage('Bathrooms must be a number'),
  body('area').isNumeric().withMessage('Area must be a number'),
  body('propertyType')
    .isIn(['house', 'apartment', 'condo', 'land', 'commercial'])
    .withMessage('Invalid property type'),
];

// Public routes
router.get('/', getAllProperties);
router.get('/:id', getPropertyById);
router.get('/user/:userId', getPropertiesByUser);

// Protected routes
router.post(
  '/',
  authenticate,
  upload.array('images', 10),
  propertyValidation,
  validate,
  createProperty
);

router.put(
  '/:id',
  authenticate,
  upload.array('images', 10),
  updateProperty
);

router.delete('/:id', authenticate, deleteProperty);

export default router;
