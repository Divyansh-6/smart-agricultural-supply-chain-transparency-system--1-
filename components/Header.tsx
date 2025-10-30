
import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut, Scan, LayoutDashboard, Leaf } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useDarkMode();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2 text-xl font-bold text-gray-800 dark:text-white">
              <Leaf className="w-8 h-8 text-primary" />
              <span>AgriChain</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-4">
            <NavLink to="/dashboard" className={({ isActive }) => `flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'text-primary bg-green-100 dark:bg-gray-700' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                <LayoutDashboard className="w-4 h-4 mr-2"/> Dashboard
            </NavLink>
            <NavLink to="/scan" className={({ isActive }) => `flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'text-primary bg-green-100 dark:bg-gray-700' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                <Scan className="w-4 h-4 mr-2"/> Scan QR
            </NavLink>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {user && (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role.toLowerCase()}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
