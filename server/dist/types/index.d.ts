import { Request } from 'express';
import { Document, Types } from 'mongoose';
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    favorites: string[];
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
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
    owner: Types.ObjectId | string;
    createdAt: Date;
    updatedAt: Date;
}
export interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
    };
}
export interface AISearchRequest {
    query: string;
    context?: string;
}
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
export interface AIRecommendationRequest {
    userPreferences: {
        priceRange?: {
            min: number;
            max: number;
        };
        bedrooms?: number;
        bathrooms?: number;
        propertyType?: string;
        location?: string;
    };
    excludePropertyIds?: string[];
}
//# sourceMappingURL=index.d.ts.map