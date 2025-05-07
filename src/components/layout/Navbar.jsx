import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Search } from 'lucide-react';

function Navbar() {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-600';
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/dash" className="text-xl font-bold text-blue-600">
              SkillSync
            </Link>
          </div>

          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses and posts..."
                className="w-full px-4 py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <nav className="flex items-center space-x-4">
            <Link to="/dash" className={isActive('/dash')}>
              Home
            </Link>
            <Link to="/analytics" className={isActive('/analytics')}>
              Analytics
            </Link>
            <Link to="/course" className={isActive('/course')}>
              dashboard
            </Link>
            <Link to="/profile" className={isActive('/profile')}>
              Profile
            </Link>
            {user ? (
              <button className="text-gray-600 hover:text-blue-600">
                Logout
              </button>
            ) : (
              <Link to="/" className="text-gray-600 hover:text-blue-600">
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Navbar;