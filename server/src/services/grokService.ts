import axios from 'axios';
import Property from '../models/Property';
import {
  AISearchRequest,
  AIDescriptionRequest,
  AIRecommendationRequest,
} from '../types';

const GROK_API_URL = 'https://api.x.ai/v1/chat/completions';
const GROK_API_KEY = process.env.GROK_API_KEY;

// Helper function to call Grok API
const callGrokAPI = async (messages: any[], temperature = 0.3, maxTokens = 1000) => {
  try {
    const response = await axios.post(
      GROK_API_URL,
      {
        messages,
        model: 'grok-beta',
        stream: false,
        temperature,
        max_tokens: maxTokens,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GROK_API_KEY}`,
        },
      }
    );

    return response.data.choices[0]?.message?.content || '';
  } catch (error: any) {
    console.error('Grok API error:', error.response?.data || error.message);
    throw new Error('Failed to communicate with Grok API');
  }
};

export const naturalLanguageSearch = async (
  searchRequest: AISearchRequest
): Promise<any> => {
  try {
    // Use Grok AI to extract search criteria from natural language
    const messages = [
      {
        role: 'system',
        content: `You are a real estate search assistant. Extract property search criteria from user queries. 
        Return a JSON object with these optional fields: 
        - priceMin (number)
        - priceMax (number)
        - bedrooms (number)
        - bathrooms (number)
        - propertyType (string: house/apartment/condo/land/commercial)
        - city (string)
        - state (string)
        Only include fields that are mentioned in the query.`,
      },
      {
        role: 'user',
        content: searchRequest.query,
      },
    ];

    const responseContent = await callGrokAPI(messages, 0.3);
    const criteria = JSON.parse(responseContent || '{}');

    // Build MongoDB query based on extracted criteria
    const query: any = { status: 'for-sale' };

    if (criteria.priceMin || criteria.priceMax) {
      query.price = {};
      if (criteria.priceMin) query.price.$gte = criteria.priceMin;
      if (criteria.priceMax) query.price.$lte = criteria.priceMax;
    }

    if (criteria.bedrooms) {
      query.bedrooms = { $gte: criteria.bedrooms };
    }

    if (criteria.bathrooms) {
      query.bathrooms = { $gte: criteria.bathrooms };
    }

    if (criteria.propertyType) {
      query.propertyType = criteria.propertyType;
    }

    if (criteria.city) {
      query['location.city'] = new RegExp(criteria.city, 'i');
    }

    if (criteria.state) {
      query['location.state'] = new RegExp(criteria.state, 'i');
    }

    const properties = await Property.find(query)
      .populate('owner', 'name email')
      .limit(20)
      .sort({ createdAt: -1 });

    return {
      properties,
      criteria,
      query: searchRequest.query,
    };
  } catch (error) {
    console.error('Grok AI search error:', error);
    throw new Error('Failed to process natural language search');
  }
};

export const generatePropertyDescription = async (
  request: AIDescriptionRequest
): Promise<string> => {
  try {
    const { propertyDetails } = request;

    const messages = [
      {
        role: 'system',
        content: 'You are a professional real estate copywriter. Write engaging, compelling property descriptions.',
      },
      {
        role: 'user',
        content: `Write a compelling property description for:
        - Type: ${propertyDetails.propertyType}
        - Bedrooms: ${propertyDetails.bedrooms}
        - Bathrooms: ${propertyDetails.bathrooms}
        - Area: ${propertyDetails.area} sq ft
        - Location: ${propertyDetails.location}
        - Price: $${propertyDetails.price.toLocaleString()}
        
        Make it engaging, professional, and highlight key features. Keep it under 200 words.`,
      },
    ];

    const description = await callGrokAPI(messages, 0.7, 300);
    return description || 'Description not available';
  } catch (error) {
    console.error('Grok AI description generation error:', error);
    throw new Error('Failed to generate property description');
  }
};

export const getAIRecommendations = async (
  request: AIRecommendationRequest
): Promise<any[]> => {
  try {
    const { userPreferences, excludePropertyIds = [] } = request;

    // Build query based on preferences
    const query: any = { status: 'for-sale' };

    if (excludePropertyIds.length > 0) {
      query._id = { $nin: excludePropertyIds };
    }

    if (userPreferences.priceRange) {
      query.price = {};
      if (userPreferences.priceRange.min) {
        query.price.$gte = userPreferences.priceRange.min;
      }
      if (userPreferences.priceRange.max) {
        query.price.$lte = userPreferences.priceRange.max;
      }
    }

    if (userPreferences.bedrooms) {
      query.bedrooms = userPreferences.bedrooms;
    }

    if (userPreferences.bathrooms) {
      query.bathrooms = { $gte: userPreferences.bathrooms };
    }

    if (userPreferences.propertyType) {
      query.propertyType = userPreferences.propertyType;
    }

    if (userPreferences.location) {
      query.$or = [
        { 'location.city': new RegExp(userPreferences.location, 'i') },
        { 'location.state': new RegExp(userPreferences.location, 'i') },
      ];
    }

    const properties = await Property.find(query)
      .populate('owner', 'name email')
      .limit(10)
      .sort({ createdAt: -1 });

    return properties;
  } catch (error) {
    console.error('AI recommendation error:', error);
    throw new Error('Failed to get property recommendations');
  }
};
