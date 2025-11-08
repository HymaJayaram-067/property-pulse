// Format price to USD currency
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Format date
export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Get property type label
export const getPropertyTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    house: 'House',
    apartment: 'Apartment',
    condo: 'Condo',
    land: 'Land',
    commercial: 'Commercial',
  };
  return labels[type] || type;
};

// Get status badge color
export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'for-sale': 'bg-green-100 text-green-800',
    sold: 'bg-red-100 text-red-800',
    rented: 'bg-blue-100 text-blue-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

// Validate email
export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// File size validation
export const isValidFileSize = (file: File, maxSizeMB = 5): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

// Image file validation
export const isValidImageType = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return validTypes.includes(file.type);
};
