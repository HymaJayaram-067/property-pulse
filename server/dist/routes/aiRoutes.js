"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const aiController_1 = require("../controllers/aiController");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
// Rate limiting for AI endpoints (prevent abuse)
const aiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 requests per windowMs
    message: 'Too many AI requests, please try again later',
});
// Validation rules
const searchValidation = [
    (0, express_validator_1.body)('query').trim().notEmpty().withMessage('Search query is required'),
];
const descriptionValidation = [
    (0, express_validator_1.body)('propertyDetails').notEmpty().withMessage('Property details are required'),
];
// AI routes
router.post('/search', aiLimiter, searchValidation, validation_1.validate, aiController_1.aiSearch);
router.post('/generate-description', aiLimiter, descriptionValidation, validation_1.validate, aiController_1.generateDescription);
router.post('/recommend', aiLimiter, aiController_1.getRecommendations);
exports.default = router;
//# sourceMappingURL=aiRoutes.js.map