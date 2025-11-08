import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaHeart, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <FaHome className="text-primary-600 text-2xl mr-2" />
              <span className="text-2xl font-bold text-gray-800">
                Property Pulse
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/properties"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition"
            >
              Properties
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  Dashboard
                </Link>
                <Link
                  to="/favorites"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition flex items-center"
                >
                  <FaHeart className="mr-1" />
                  Favorites
                </Link>
                <Link
                  to="/my-listings"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  My Listings
                </Link>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <FaUser className="text-gray-600 mr-2" />
                    <span className="text-sm text-gray-700">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-red-600 hover:text-red-700 px-3 py-2 rounded-md text-sm font-medium transition"
                  >
                    <FaSignOutAlt className="mr-1" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  <FaSignInAlt className="mr-1" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
