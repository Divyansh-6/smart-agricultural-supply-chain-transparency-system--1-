
import React from 'react';

interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ icon, title, value, description }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-transform transform hover:scale-105 duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-shrink-0">
            <div className="bg-green-100 dark:bg-gray-700 p-3 rounded-xl">
              {icon}
            </div>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</p>
        <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{description}</p>
      </div>
    </div>
  );
};

export default DashboardCard;
