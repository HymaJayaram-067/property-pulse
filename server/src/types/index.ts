import { Request } from 'express';
import { Document } from 'mongoose';

// User Types
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  favorites: string[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Property Types
export interface IProperty extends Document {
  title: string;
  description: string;
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  bedrooms: number;
  bathrooms: number;
  area: number;
  propertyType: 'house' | 'apartment' | 'condo' | 'land' | 'commercial';
  status: 'for-sale' | 'sold' | 'rented';
  images: string[];
  owner: string;
  createdAt: Date;
  updatedAt: Date;
}

// Auth Request
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

// AI Search Request
export interface AISearchRequest {
  query: string;
  context?: string;
}

// AI Description Request
export interface AIDescriptionRequest {
  propertyDetails: {
    title: string;
    propertyType: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    location: string;
    price: number;
  };
}

// AI Recommendation Request
export interface AIRecommendationRequest {
  userPreferences: {
    priceRange?: { min: number; max: number };
    bedrooms?: number;
    bathrooms?: number;
    propertyType?: string;
    location?: string;
  };
  excludePropertyIds?: string[];
}
