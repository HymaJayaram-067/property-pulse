import { Link } from 'react-router-dom';
import { FaBed, FaBath, FaRuler, FaMapMarkerAlt, FaHeart } from 'react-icons/fa';
import { Property } from '../../types';
import { formatPrice, getPropertyTypeLabel, getStatusColor } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { useState } from 'react';

interface PropertyCardProps {
  property: Property;
  onFavoriteChange?: () => void;
}

const PropertyCard = ({ property, onFavoriteChange }: PropertyCardProps) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(
    user?.favorites?.includes(property._id) || false
  );
  const [loading, setLoading] = useState(false);

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      if (isFavorite) {
        await authService.removeFromFavorites(property._id);
        setIsFavorite(false);
      } else {
        await authService.addToFavorites(property._id);
        setIsFavorite(true);
      }
      onFavoriteChange?.();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link to={`/properties/${property._id}`}>
        <div className="relative h-64">
          <img
            src={property.images[0] || 'https://via.placeholder.com/400x300'}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                property.status
              )}`}
            >
              {property.status.replace('-', ' ').toUpperCase()}
            </span>
          </div>
          {user && (
            <button
              onClick={handleFavoriteToggle}
              disabled={loading}
              className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition"
            >
              <FaHeart
                className={`${
                  isFavorite ? 'text-red-500' : 'text-gray-400'
                } transition`}
              />
            </button>
          )}
        </div>
      </Link>

      <div className="p-6">
        <Link to={`/properties/${property._id}`}>
          <h3 className="text-xl font-semibold text-gray-800 mb-2 hover:text-primary-600 transition">
            {property.title}
          </h3>
        </Link>

        <div className="flex items-center text-gray-600 mb-3">
          <FaMapMarkerAlt className="mr-1 text-primary-500" />
          <span className="text-sm">
            {property.location.city}, {property.location.state}
          </span>
        </div>

        <p className="text-2xl font-bold text-primary-600 mb-4">
          {formatPrice(property.price)}
        </p>

        <div className="flex items-center justify-between text-gray-600 text-sm border-t pt-4">
          <div className="flex items-center">
            <FaBed className="mr-1" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center">
            <FaBath className="mr-1" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center">
            <FaRuler className="mr-1" />
            <span>{property.area} sqft</span>
          </div>
        </div>

        <div className="mt-4">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {getPropertyTypeLabel(property.propertyType)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
