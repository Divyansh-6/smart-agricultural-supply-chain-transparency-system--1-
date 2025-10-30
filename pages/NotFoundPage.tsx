
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-center px-4">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">Page Not Found</h2>
      <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to="/dashboard"
        className="mt-8 px-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary-focus transition-colors"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;
