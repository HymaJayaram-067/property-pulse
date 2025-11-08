import { Link } from 'react-router-dom';
import { FaPlus, FaHeart, FaList } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold mb-8">Welcome, {user?.name}!</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Create New Listing Card */}
        <Link
          to="/properties/new"
          className="bg-gradient-to-br from-primary-500 to-primary-700 text-white p-8 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
        >
          <div className="flex flex-col items-center text-center">
            <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <FaPlus className="text-3xl" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Create New Listing</h2>
            <p className="text-primary-100">
              List a new property for sale or rent
            </p>
          </div>
        </Link>

        {/* My Listings Card */}
        <Link
          to="/my-listings"
          className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-8 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
        >
          <div className="flex flex-col items-center text-center">
            <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <FaList className="text-3xl" />
            </div>
            <h2 className="text-2xl font-bold mb-2">My Listings</h2>
            <p className="text-blue-100">
              View and manage your property listings
            </p>
          </div>
        </Link>

        {/* Favorites Card */}
        <Link
          to="/favorites"
          className="bg-gradient-to-br from-pink-500 to-pink-700 text-white p-8 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
        >
          <div className="flex flex-col items-center text-center">
            <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <FaHeart className="text-3xl" />
            </div>
            <h2 className="text-2xl font-bold mb-2">My Favorites</h2>
            <p className="text-pink-100">
              View your saved favorite properties
            </p>
          </div>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="mt-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-4xl font-bold text-primary-600">
              {user?.favorites?.length || 0}
            </p>
            <p className="text-gray-600 mt-2">Favorite Properties</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600">-</p>
            <p className="text-gray-600 mt-2">Active Listings</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-green-600">-</p>
            <p className="text-gray-600 mt-2">Total Views</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
