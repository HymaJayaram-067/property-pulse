import { useState, useEffect } from 'react';
import { Property, PropertyFilters } from '../types';
import { propertyService } from '../services/propertyService';

export const useProperties = (initialFilters?: PropertyFilters) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PropertyFilters>(initialFilters || {});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  const fetchProperties = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await propertyService.getAllProperties(
        filters,
        page,
        pagination.limit
      );
      setProperties(response.properties);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(pagination.page);
  }, [filters]);

  const updateFilters = (newFilters: PropertyFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const goToPage = (page: number) => {
    fetchProperties(page);
  };

  const refetch = () => {
    fetchProperties(pagination.page);
  };

  return {
    properties,
    loading,
    error,
    filters,
    updateFilters,
    pagination,
    goToPage,
    refetch,
  };
};
