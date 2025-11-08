import { useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import PropertyList from '../properties/PropertyList';
import LoadingSpinner from '../common/LoadingSpinner';
import { Property } from '../../types';

const FavoritesList = () => {
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const data = await authService.getFavorites();
      setFavorites(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch favorites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Favorite Properties</h2>
      <PropertyList properties={favorites} onFavoriteChange={fetchFavorites} />
    </div>
  );
};

export default FavoritesList;
