import api from './api';
import { Property, PropertyFormData, PropertyFilters } from '../types';

export const propertyService = {
  // Get all properties with optional filters
  getAllProperties: async (filters?: PropertyFilters, page = 1, limit = 12) => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await api.get(`/properties?${params.toString()}`);
    return response.data;
  },

  // Get single property by ID
  getPropertyById: async (id: string): Promise<Property> => {
    const response = await api.get(`/properties/${id}`);
    return response.data.property;
  },

  // Create new property
  createProperty: async (propertyData: PropertyFormData, images?: File[]) => {
    const formData = new FormData();

    // Append property data
    formData.append('title', propertyData.title);
    formData.append('description', propertyData.description);
    formData.append('price', propertyData.price.toString());
    formData.append('location[address]', propertyData.location.address);
    formData.append('location[city]', propertyData.location.city);
    formData.append('location[state]', propertyData.location.state);
    formData.append('location[zipCode]', propertyData.location.zipCode);
    formData.append('bedrooms', propertyData.bedrooms.toString());
    formData.append('bathrooms', propertyData.bathrooms.toString());
    formData.append('area', propertyData.area.toString());
    formData.append('propertyType', propertyData.propertyType);
    formData.append('status', propertyData.status);

    // Append images
    if (images) {
      images.forEach((image) => {
        formData.append('images', image);
      });
    }

    const response = await api.post('/properties', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update property
  updateProperty: async (
    id: string,
    propertyData: Partial<PropertyFormData>,
    images?: File[]
  ) => {
    const formData = new FormData();

    // Append property data
    Object.entries(propertyData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'location' && typeof value === 'object') {
          Object.entries(value).forEach(([locKey, locValue]) => {
            formData.append(`location[${locKey}]`, locValue as string);
          });
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    // Append images
    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append('images', image);
      });
    }

    const response = await api.put(`/properties/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete property
  deleteProperty: async (id: string) => {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  },

  // Get properties by user
  getPropertiesByUser: async (userId: string) => {
    const response = await api.get(`/properties/user/${userId}`);
    return response.data.properties;
  },

  // AI-powered natural language search
  aiSearch: async (query: string) => {
    const response = await api.post('/ai/search', { query });
    return response.data;
  },

  // Generate AI description
  generateDescription: async (propertyDetails: any) => {
    const response = await api.post('/ai/generate-description', {
      propertyDetails,
    });
    return response.data.description;
  },

  // Get AI recommendations
  getRecommendations: async (userPreferences: any, excludePropertyIds?: string[]) => {
    const response = await api.post('/ai/recommend', {
      userPreferences,
      excludePropertyIds,
    });
    return response.data.recommendations;
  },
};
