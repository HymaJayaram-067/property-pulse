export interface User {
  id: string;
  name: string;
  email: string;
  favorites: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Property {
  _id: string;
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
  owner: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface PropertyFormData {
  title: string;
  description: string;
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  bedrooms: number;
  bathrooms: number;
  area: number;
  propertyType: 'house' | 'apartment' | 'condo' | 'land' | 'commercial';
  status: 'for-sale' | 'sold' | 'rented';
}

export interface PropertyFilters {
  status?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  city?: string;
  state?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
