import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PropertyFormData, Property } from '../../types';
import { propertyService } from '../../services/propertyService';
import { FaMagic } from 'react-icons/fa';

interface PropertyFormProps {
  property?: Property;
  isEdit?: boolean;
}

const PropertyForm = ({ property, isEdit = false }: PropertyFormProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [generatingDesc, setGeneratingDesc] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: property?.title || '',
    description: property?.description || '',
    price: property?.price || 0,
    location: {
      address: property?.location.address || '',
      city: property?.location.city || '',
      state: property?.location.state || '',
      zipCode: property?.location.zipCode || '',
    },
    bedrooms: property?.bedrooms || 1,
    bathrooms: property?.bathrooms || 1,
    area: property?.area || 0,
    propertyType: property?.propertyType || 'house',
    status: property?.status || 'for-sale',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: ['price', 'bedrooms', 'bathrooms', 'area'].includes(name)
          ? Number(value)
          : value,
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleGenerateDescription = async () => {
    setGeneratingDesc(true);
    try {
      const description = await propertyService.generateDescription({
        title: formData.title,
        propertyType: formData.propertyType,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        area: formData.area,
        location: `${formData.location.city}, ${formData.location.state}`,
        price: formData.price,
      });
      setFormData((prev) => ({ ...prev, description }));
    } catch (err) {
      console.error('Failed to generate description:', err);
    } finally {
      setGeneratingDesc(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEdit && property) {
        await propertyService.updateProperty(property._id, formData, images);
        navigate(`/properties/${property._id}`);
      } else {
        const response = await propertyService.createProperty(formData, images);
        navigate(`/properties/${response.property._id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold mb-6">
        {isEdit ? 'Edit Property' : 'Create New Listing'}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Property Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="e.g., Beautiful 3BR House in Downtown"
          />
        </div>

        {/* Description */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-gray-700 font-semibold">
              Description *
            </label>
            <button
              type="button"
              onClick={handleGenerateDescription}
              disabled={generatingDesc || !formData.title}
              className="flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium disabled:opacity-50"
            >
              <FaMagic className="mr-1" />
              {generatingDesc ? 'Generating...' : 'Generate with AI'}
            </button>
          </div>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Describe your property..."
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Price ($) *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-semibold mb-2">
              Address *
            </label>
            <input
              type="text"
              name="location.address"
              value={formData.location.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              City *
            </label>
            <input
              type="text"
              name="location.city"
              value={formData.location.city}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              State *
            </label>
            <input
              type="text"
              name="location.state"
              value={formData.location.state}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-semibold mb-2">
              Zip Code *
            </label>
            <input
              type="text"
              name="location.zipCode"
              value={formData.location.zipCode}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Bedrooms *
            </label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Bathrooms *
            </label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              required
              min="0"
              step="0.5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Area (sqft) *
            </label>
            <input
              type="number"
              name="area"
              value={formData.area}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Property Type & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Property Type *
            </label>
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="condo">Condo</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="for-sale">For Sale</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
            </select>
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Images {!isEdit && '*'}
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            required={!isEdit}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">
            Upload up to 10 images (max 5MB each)
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
          >
            {loading
              ? isEdit
                ? 'Updating...'
                : 'Creating...'
              : isEdit
              ? 'Update Property'
              : 'Create Property'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;
