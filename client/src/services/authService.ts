import api from './api';
import { User } from '../types';

export const authService = {
  // Register new user
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Login user
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getMe: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data.user;
  },

  // Add to favorites
  addToFavorites: async (propertyId: string) => {
    const response = await api.post(`/auth/favorites/${propertyId}`);
    return response.data;
  },

  // Remove from favorites
  removeFromFavorites: async (propertyId: string) => {
    const response = await api.delete(`/auth/favorites/${propertyId}`);
    return response.data;
  },

  // Get favorites
  getFavorites: async () => {
    const response = await api.get('/auth/favorites');
    return response.data.favorites;
  },
};
