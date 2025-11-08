import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { propertyService } from '../services/propertyService';
import PropertyList from '../components/properties/PropertyList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Property } from '../types';

const MyListings = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyListings = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const data = await propertyService.getPropertiesByUser(user.id);
        setProperties(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch listings');
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, [user]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Listings</h1>
        <Link
          to="/properties/new"
          className="flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
        >
          <FaPlus className="mr-2" />
          Create New Listing
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {properties.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg mb-6">
            You haven't created any listings yet
          </p>
          <Link
            to="/properties/new"
            className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            <FaPlus className="mr-2" />
            Create Your First Listing
          </Link>
        </div>
      ) : (
        <PropertyList properties={properties} />
      )}
    </div>
  );
};

export default MyListings;
