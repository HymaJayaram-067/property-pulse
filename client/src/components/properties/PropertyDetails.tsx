import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBed, FaBath, FaRuler, FaMapMarkerAlt, FaEdit, FaTrash } from 'react-icons/fa';
import { Property } from '../../types';
import { formatPrice, formatDate, getPropertyTypeLabel, getStatusColor } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';
import { propertyService } from '../../services/propertyService';

interface PropertyDetailsProps {
  property: Property;
}

const PropertyDetails = ({ property }: PropertyDetailsProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const isOwner = user?.id === property.owner._id;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return;
    }

    setDeleting(true);
    try {
      await propertyService.deleteProperty(property._id);
      navigate('/my-listings');
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete property');
    } finally {
      setDeleting(false);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Image Gallery */}
      <div className="relative h-96 bg-gray-200">
        {property.images.length > 0 ? (
          <>
            <img
              src={property.images[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 p-2 rounded-full"
                >
                  ‹
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 p-2 rounded-full"
                >
                  ›
                </button>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {property.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-gray-400">No images available</span>
          </div>
        )}
        
        <div className="absolute top-4 left-4">
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
              property.status
            )}`}
          >
            {property.status.replace('-', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      {/* Property Info */}
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {property.title}
            </h1>
            <div className="flex items-center text-gray-600 mb-4">
              <FaMapMarkerAlt className="mr-2 text-primary-500" />
              <span>
                {property.location.address}, {property.location.city},{' '}
                {property.location.state} {property.location.zipCode}
              </span>
            </div>
          </div>
          
          {isOwner && (
            <div className="flex space-x-2">
              <button
                onClick={() => navigate(`/properties/${property._id}/edit`)}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                <FaEdit className="mr-2" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition disabled:opacity-50"
              >
                <FaTrash className="mr-2" />
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>

        <div className="mb-6">
          <p className="text-4xl font-bold text-primary-600">
            {formatPrice(property.price)}
          </p>
        </div>

        {/* Property Features */}
        <div className="grid grid-cols-3 gap-4 mb-8 p-6 bg-gray-50 rounded-lg">
          <div className="text-center">
            <FaBed className="text-3xl text-primary-500 mx-auto mb-2" />
            <p className="text-2xl font-semibold">{property.bedrooms}</p>
            <p className="text-gray-600">Bedrooms</p>
          </div>
          <div className="text-center">
            <FaBath className="text-3xl text-primary-500 mx-auto mb-2" />
            <p className="text-2xl font-semibold">{property.bathrooms}</p>
            <p className="text-gray-600">Bathrooms</p>
          </div>
          <div className="text-center">
            <FaRuler className="text-3xl text-primary-500 mx-auto mb-2" />
            <p className="text-2xl font-semibold">{property.area}</p>
            <p className="text-gray-600">Square Feet</p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Description</h2>
          <p className="text-gray-700 leading-relaxed">{property.description}</p>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Property Type</h3>
            <p className="text-gray-600">{getPropertyTypeLabel(property.propertyType)}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Status</h3>
            <p className="text-gray-600">{property.status.replace('-', ' ')}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Listed On</h3>
            <p className="text-gray-600">{formatDate(property.createdAt)}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Last Updated</h3>
            <p className="text-gray-600">{formatDate(property.updatedAt)}</p>
          </div>
        </div>

        {/* Owner Info */}
        <div className="border-t pt-6">
          <h3 className="text-xl font-semibold mb-4">Listed By</h3>
          <div className="flex items-center">
            <div className="bg-primary-100 rounded-full w-12 h-12 flex items-center justify-center mr-4">
              <span className="text-primary-600 font-semibold text-lg">
                {property.owner.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-800">{property.owner.name}</p>
              <p className="text-gray-600">{property.owner.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
