"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
// Validation rules
const registerValidation = [
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
];
const loginValidation = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'),
];
// Auth routes
router.post('/register', registerValidation, validation_1.validate, authController_1.register);
router.post('/login', loginValidation, validation_1.validate, authController_1.login);
router.get('/me', auth_1.authenticate, authController_1.getMe);
// Favorites routes
router.post('/favorites/:propertyId', auth_1.authenticate, authController_1.addToFavorites);
router.delete('/favorites/:propertyId', auth_1.authenticate, authController_1.removeFromFavorites);
router.get('/favorites', auth_1.authenticate, authController_1.getFavorites);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map