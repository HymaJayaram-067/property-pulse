import { Request, Response } from 'express';
import {
  naturalLanguageSearch,
  generatePropertyDescription,
  getAIRecommendations,
} from '../services/grokService';
import { AuthRequest } from '../types';

// Natural language property search
export const aiSearch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, context } = req.body;

    if (!query) {
      res.status(400).json({ message: 'Search query is required' });
      return;
    }

    const result = await naturalLanguageSearch({ query, context });

    res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error('AI search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing AI search',
      error: error.message,
    });
  }
};

// Generate property description using AI
export const generateDescription = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { propertyDetails } = req.body;

    if (!propertyDetails) {
      res.status(400).json({ message: 'Property details are required' });
      return;
    }

    const description = await generatePropertyDescription({ propertyDetails });

    res.json({
      success: true,
      description,
    });
  } catch (error: any) {
    console.error('Generate description error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating description',
      error: error.message,
    });
  }
};

// Get AI-powered property recommendations
export const getRecommendations = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { userPreferences, excludePropertyIds } = req.body;

    const recommendations = await getAIRecommendations({
      userPreferences: userPreferences || {},
      excludePropertyIds: excludePropertyIds || [],
    });

    res.json({
      success: true,
      recommendations,
      count: recommendations.length,
    });
  } catch (error: any) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting recommendations',
      error: error.message,
    });
  }
};
