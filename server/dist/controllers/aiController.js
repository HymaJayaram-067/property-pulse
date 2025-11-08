"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecommendations = exports.generateDescription = exports.aiSearch = void 0;
const openaiService_1 = require("../services/openaiService");
// Natural language property search
const aiSearch = async (req, res) => {
    try {
        const { query, context } = req.body;
        if (!query) {
            res.status(400).json({ message: 'Search query is required' });
            return;
        }
        const result = await (0, openaiService_1.naturalLanguageSearch)({ query, context });
        res.json({
            success: true,
            ...result,
        });
    }
    catch (error) {
        console.error('AI search error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing AI search',
            error: error.message,
        });
    }
};
exports.aiSearch = aiSearch;
// Generate property description using AI
const generateDescription = async (req, res) => {
    try {
        const { propertyDetails } = req.body;
        if (!propertyDetails) {
            res.status(400).json({ message: 'Property details are required' });
            return;
        }
        const description = await (0, openaiService_1.generatePropertyDescription)({ propertyDetails });
        res.json({
            success: true,
            description,
        });
    }
    catch (error) {
        console.error('Generate description error:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating description',
            error: error.message,
        });
    }
};
exports.generateDescription = generateDescription;
// Get AI-powered property recommendations
const getRecommendations = async (req, res) => {
    try {
        const { userPreferences, excludePropertyIds } = req.body;
        const recommendations = await (0, openaiService_1.getAIRecommendations)({
            userPreferences: userPreferences || {},
            excludePropertyIds: excludePropertyIds || [],
        });
        res.json({
            success: true,
            recommendations,
            count: recommendations.length,
        });
    }
    catch (error) {
        console.error('Get recommendations error:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting recommendations',
            error: error.message,
        });
    }
};
exports.getRecommendations = getRecommendations;
//# sourceMappingURL=aiController.js.map