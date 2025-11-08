import { Property } from '../../types';
import PropertyCard from './PropertyCard';

interface PropertyListProps {
  properties: Property[];
  onFavoriteChange?: () => void;
}

const PropertyList = ({ properties, onFavoriteChange }: PropertyListProps) => {
  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No properties found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property._id}
          property={property}
          onFavoriteChange={onFavoriteChange}
        />
      ))}
    </div>
  );
};

export default PropertyList;
