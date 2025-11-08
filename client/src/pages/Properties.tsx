import { useState } from 'react';
import { useProperties } from '../hooks/useProperties';
import PropertyList from '../components/properties/PropertyList';
import AISearchBar from '../components/properties/AISearchBar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { PropertyFilters } from '../types';

const Properties = () => {
  const [aiResults, setAiResults] = useState<any>(null);
  const { properties, loading, error, filters, updateFilters, pagination, goToPage } =
    useProperties();

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFilters({
      ...filters,
      [name]: value === '' ? undefined : value,
    });
  };

  const handleAISearch = (results: any) => {
    setAiResults(results);
  };

  const clearAISearch = () => {
    setAiResults(null);
  };

  const displayProperties = aiResults ? aiResults.properties : properties;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold mb-8">Browse Properties</h1>

      {/* AI Search Bar */}
      <AISearchBar onSearchResults={handleAISearch} />

      {aiResults && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-blue-900">
                AI Search Results for: "{aiResults.query}"
              </p>
              <p className="text-sm text-blue-700">
                Found {aiResults.properties.length} properties
              </p>
            </div>
            <button
              onClick={clearAISearch}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear Search
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      {!aiResults && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type
              </label>
              <select
                name="propertyType"
                value={filters.propertyType || ''}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Types</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Price
              </label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice || ''}
                onChange={handleFilterChange}
                placeholder="Min"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Price
              </label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice || ''}
                onChange={handleFilterChange}
                placeholder="Max"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bedrooms
              </label>
              <input
                type="number"
                name="bedrooms"
                value={filters.bedrooms || ''}
                onChange={handleFilterChange}
                placeholder="Any"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <>
          <PropertyList properties={displayProperties} />

          {/* Pagination */}
          {!aiResults && pagination.pages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-4 py-2 rounded ${
                    page === pagination.page
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  } border`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Properties;
