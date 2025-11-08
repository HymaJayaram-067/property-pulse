"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const propertyController_1 = require("../controllers/propertyController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const uploadService_1 = require("../services/uploadService");
const router = express_1.default.Router();
// Validation rules for creating/updating properties
const propertyValidation = [
    (0, express_validator_1.body)('title').trim().notEmpty().withMessage('Title is required'),
    (0, express_validator_1.body)('description').trim().notEmpty().withMessage('Description is required'),
    (0, express_validator_1.body)('price').isNumeric().withMessage('Price must be a number'),
    (0, express_validator_1.body)('location.address').notEmpty().withMessage('Address is required'),
    (0, express_validator_1.body)('location.city').notEmpty().withMessage('City is required'),
    (0, express_validator_1.body)('location.state').notEmpty().withMessage('State is required'),
    (0, express_validator_1.body)('location.zipCode').notEmpty().withMessage('Zip code is required'),
    (0, express_validator_1.body)('bedrooms').isNumeric().withMessage('Bedrooms must be a number'),
    (0, express_validator_1.body)('bathrooms').isNumeric().withMessage('Bathrooms must be a number'),
    (0, express_validator_1.body)('area').isNumeric().withMessage('Area must be a number'),
    (0, express_validator_1.body)('propertyType')
        .isIn(['house', 'apartment', 'condo', 'land', 'commercial'])
        .withMessage('Invalid property type'),
];
// Public routes
router.get('/', propertyController_1.getAllProperties);
router.get('/:id', propertyController_1.getPropertyById);
router.get('/user/:userId', propertyController_1.getPropertiesByUser);
// Protected routes
router.post('/', auth_1.authenticate, uploadService_1.upload.array('images', 10), propertyValidation, validation_1.validate, propertyController_1.createProperty);
router.put('/:id', auth_1.authenticate, uploadService_1.upload.array('images', 10), propertyController_1.updateProperty);
router.delete('/:id', auth_1.authenticate, propertyController_1.deleteProperty);
exports.default = router;
//# sourceMappingURL=propertyRoutes.js.map