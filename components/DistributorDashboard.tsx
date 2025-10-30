import React, { useState } from 'react';
import { Batch, User, IoTData } from '../types';
import { FiPackage, FiTruck, FiMapPin, FiAlertCircle } from 'react-icons/fi';
import IoTChart from './IoTChart';
import BlockchainTraceability from './BlockchainTraceability';

interface DistributorDashboardProps {
  user: User;
  batches: Batch[];
  iotData: Record<string, IoTData[]>;
}

const DistributorDashboard: React.FC<DistributorDashboardProps> = ({ user, batches, iotData }) => {
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  
  // Calculate metrics
  const receivedBatches = batches.filter(b => 
    b.currentStage === 'AT_DISTRIBUTOR' || b.currentStage === 'IN_TRANSIT_TO_CONSUMER'
  );
  const inTransitBatches = batches.filter(b => b.currentStage === 'IN_TRANSIT_TO_CONSUMER');
  const atDistributorBatches = batches.filter(b => b.currentStage === 'AT_DISTRIBUTOR');
  
  // Get alerts for distributor's batches
  const alerts = batches.flatMap(batch => {
    const batchIoTData = iotData[batch.iotSensorId] || [];
    return batchIoTData
      .filter(data => data.temperature > 30 || data.humidity > 80)
      .map(data => ({
        batchId: batch.id,
        cropType: batch.cropType,
        timestamp: data.timestamp,
        issue: data.temperature > 30 ? 'High Temperature' : 'High Humidity',
        value: data.temperature > 30 ? `${data.temperature}°C` : `${data.humidity}%`,
        location: data.gpsLocation ? `${data.gpsLocation.latitude.toFixed(4)}, ${data.gpsLocation.longitude.toFixed(4)}` : 'Unknown'
      }));
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Distributor Dashboard</h1>
      
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
              <FiPackage className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Received Batches</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{receivedBatches.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 mr-4">
              <FiMapPin className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">At Warehouse</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{atDistributorBatches.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 mr-4">
              <FiTruck className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">In Transit to Consumer</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{inTransitBatches.length}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Alerts Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
          <FiAlertCircle className="mr-2" /> Alerts
        </h2>
        
        {alerts.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No alerts at this time.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Batch ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Crop</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Issue</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Value</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Location</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {alerts.slice(0, 5).map((alert, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{alert.batchId.substring(0, 8)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{alert.cropType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400">{alert.issue}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{alert.value}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{alert.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(alert.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Batch Management */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Batch Management</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Batch ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Farmer</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Stage</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Shelf Life</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {receivedBatches.map((batch, index) => (
                <tr key={batch.id} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{batch.id.substring(0, 8)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{batch.cropType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{batch.farmerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${batch.currentStage === 'AT_DISTRIBUTOR' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'}`}>
                      {batch.currentStage.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {batch.predictedShelfLife ? `${batch.predictedShelfLife} days` : 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedBatch(batch)}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Selected Batch Details */}
      {selectedBatch && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Batch Details: {selectedBatch.cropType}</h2>
            <button
              onClick={() => setSelectedBatch(null)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              Close
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Batch Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Batch ID</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">{selectedBatch.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Product</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">{selectedBatch.cropType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Farmer</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">{selectedBatch.farmerName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Farm Location</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">{selectedBatch.farmLocation}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Harvest Date</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">{new Date(selectedBatch.harvestDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Expiry Date</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">{new Date(selectedBatch.expiryDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Weight</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">{selectedBatch.batchWeight} kg</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Price</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">${selectedBatch.pricePerUnit} per kg</p>
                </div>
              </div>
              
              {selectedBatch.sustainabilityScore && (
                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Sustainability Score</p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{ width: `${selectedBatch.sustainabilityScore}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-right mt-1 text-gray-500 dark:text-gray-400">{selectedBatch.sustainabilityScore}%</p>
                </div>
              )}
            </div>
            
            {iotData[selectedBatch.iotSensorId] && (
              <div>
                <IoTChart 
                  data={iotData[selectedBatch.iotSensorId]} 
                  batchType={selectedBatch.cropType}
                  predictedShelfLife={selectedBatch.predictedShelfLife}
                />
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <BlockchainTraceability batch={selectedBatch} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DistributorDashboard;