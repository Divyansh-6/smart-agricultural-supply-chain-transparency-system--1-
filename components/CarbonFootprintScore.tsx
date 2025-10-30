import React from 'react';
import { Batch, CarbonFootprint } from '../types';
import { FiLeaf, FiTruck, FiDroplet, FiSun, FiPackage } from 'react-icons/fi';

interface CarbonFootprintScoreProps {
  batch: Batch;
  carbonData?: CarbonFootprint;
}

const CarbonFootprintScore: React.FC<CarbonFootprintScoreProps> = ({ 
  batch, 
  carbonData = {
    id: `carbon-${batch.id}`,
    batchId: batch.id,
    totalScore: 78,
    transportEmissions: 45.2,
    farmingEmissions: 12.8,
    packagingEmissions: 8.5,
    waterUsage: 320,
    energyEfficiency: 82,
    sustainabilityBadges: ['Eco-Friendly Packaging', 'Low Water Usage'],
    improvementSuggestions: [
      'Consider local distribution to reduce transport emissions',
      'Switch to renewable energy sources at the farm'
    ]
  }
}) => {
  // Calculate score color based on total score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Calculate badge color based on badge name
  const getBadgeColor = (badge: string) => {
    if (badge.includes('Eco')) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    if (badge.includes('Low')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    if (badge.includes('Organic')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  // Calculate percentage of each emission type
  const totalEmissions = carbonData.transportEmissions + carbonData.farmingEmissions + carbonData.packagingEmissions;
  const transportPercentage = (carbonData.transportEmissions / totalEmissions) * 100;
  const farmingPercentage = (carbonData.farmingEmissions / totalEmissions) * 100;
  const packagingPercentage = (carbonData.packagingEmissions / totalEmissions) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center mb-6">
        <FiLeaf className="mr-2" /> Carbon Footprint & Sustainability
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Score and Badges */}
        <div>
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <svg className="w-32 h-32">
                <circle
                  className="text-gray-200 dark:text-gray-700"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                  r="56"
                  cx="64"
                  cy="64"
                />
                <circle
                  className={getScoreColor(carbonData.totalScore)}
                  strokeWidth="10"
                  strokeDasharray={360}
                  strokeDashoffset={360 - (360 * carbonData.totalScore) / 100}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="56"
                  cx="64"
                  cy="64"
                />
              </svg>
              <span className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold ${getScoreColor(carbonData.totalScore)}`}>
                {carbonData.totalScore}
              </span>
            </div>
          </div>

          <div className="text-center mb-6">
            <p className="text-gray-600 dark:text-gray-400">Sustainability Score</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {carbonData.totalScore >= 80 ? 'Excellent' : 
               carbonData.totalScore >= 60 ? 'Good' : 
               carbonData.totalScore >= 40 ? 'Fair' : 'Needs Improvement'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {carbonData.sustainabilityBadges.map((badge, index) => (
              <span 
                key={index} 
                className={`px-3 py-1 rounded-full text-sm ${getBadgeColor(badge)}`}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Emissions Breakdown */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Emissions Breakdown</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  <FiTruck className="mr-1" /> Transport
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {carbonData.transportEmissions.toFixed(1)} kg CO₂e
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${transportPercentage}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  <FiSun className="mr-1" /> Farming
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {carbonData.farmingEmissions.toFixed(1)} kg CO₂e
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{ width: `${farmingPercentage}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  <FiPackage className="mr-1" /> Packaging
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {carbonData.packagingEmissions.toFixed(1)} kg CO₂e
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-yellow-600 h-2.5 rounded-full" 
                  style={{ width: `${packagingPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resource Usage */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center">
            <FiDroplet className="text-blue-500 mr-2" />
            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">Water Usage</h4>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {carbonData.waterUsage} <span className="text-sm font-normal text-gray-500">liters</span>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {carbonData.waterUsage < 350 ? 'Below industry average' : 'Above industry average'}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center">
            <FiSun className="text-yellow-500 mr-2" />
            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">Energy Efficiency</h4>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {carbonData.energyEfficiency}%
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {carbonData.energyEfficiency > 75 ? 'Excellent efficiency' : 'Room for improvement'}
          </p>
        </div>
      </div>

      {/* Improvement Suggestions */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Improvement Suggestions</h3>
        <ul className="space-y-2">
          {carbonData.improvementSuggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start">
              <span className="flex-shrink-0 w-5 h-5 text-green-500 mr-2">•</span>
              <span className="text-gray-600 dark:text-gray-400">{suggestion}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CarbonFootprintScore;