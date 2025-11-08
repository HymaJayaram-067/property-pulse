import { useState } from 'react';
import { FaSearch, FaRobot } from 'react-icons/fa';
import { propertyService } from '../../services/propertyService';

interface AISearchBarProps {
  onSearchResults: (results: any) => void;
}

const AISearchBar = ({ onSearchResults }: AISearchBarProps) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');

    try {
      const results = await propertyService.aiSearch(query);
      onSearchResults(results);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-lg p-6 shadow-lg">
        <div className="flex items-center mb-4">
          <FaRobot className="text-white text-3xl mr-3" />
          <h2 className="text-2xl font-bold text-white">
            AI-Powered Property Search
          </h2>
        </div>
        
        <p className="text-primary-100 mb-4">
          Try natural language search like: "Find me a 3-bedroom house near downtown under $500k"
        </p>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe your dream property..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-transparent focus:border-white focus:outline-none"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default AISearchBar;
