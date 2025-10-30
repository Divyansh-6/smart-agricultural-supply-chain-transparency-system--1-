import React from 'react';

interface SustainabilityScoreProps {
  batchId: string;
  productType: string;
}

const SustainabilityScore: React.FC<SustainabilityScoreProps> = ({ batchId, productType }) => {
  // Mock sustainability data
  const sustainabilityData = {
    overallScore: 85,
    waterUsage: 78,
    carbonFootprint: 92,
    pesticides: 88,
    packaging: 82,
    transportEmissions: 75,
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Sustainability Score</h2>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl ${getScoreColor(sustainabilityData.overallScore)}`}>
            {sustainabilityData.overallScore}
          </div>
          <div className="ml-4">
            <p className="font-medium text-gray-800 dark:text-white">Overall Score</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This product is in the top {100 - Math.round(sustainabilityData.overallScore / 10)}% for sustainability
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Water Usage</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{sustainabilityData.waterUsage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${sustainabilityData.waterUsage}%` }}></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Carbon Footprint</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{sustainabilityData.carbonFootprint}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${sustainabilityData.carbonFootprint}%` }}></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pesticide Usage</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{sustainabilityData.pesticides}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-yellow-600 h-2.5 rounded-full" style={{ width: `${sustainabilityData.pesticides}%` }}></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Packaging</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{sustainabilityData.packaging}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${sustainabilityData.packaging}%` }}></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Transport Emissions</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{sustainabilityData.transportEmissions}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-red-600 h-2.5 rounded-full" style={{ width: `${sustainabilityData.transportEmissions}%` }}></div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h3 className="text-md font-medium mb-2 text-gray-800 dark:text-white">Sustainability Certifications</h3>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full dark:bg-green-900 dark:text-green-200">
            Organic Certified
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full dark:bg-blue-900 dark:text-blue-200">
            Fair Trade
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full dark:bg-yellow-900 dark:text-yellow-200">
            Rainforest Alliance
          </span>
        </div>
      </div>
    </div>
  );
};

export default SustainabilityScore;