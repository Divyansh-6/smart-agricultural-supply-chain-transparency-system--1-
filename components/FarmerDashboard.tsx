import React from 'react';
import { Batch, User, IoTData } from '../types';
import { FiTruck, FiDollarSign, FiBarChart2, FiAlertCircle } from 'react-icons/fi';
import IoTChart from './IoTChart';
import BlockchainTraceability from './BlockchainTraceability';
import BatchIdentitySystem from './BatchIdentitySystem';

interface FarmerDashboardProps {
  user: User;
  batches: Batch[];
  iotData: Record<string, IoTData[]>;
}

const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ user, batches, iotData }) => {
  // Calculate metrics
  const totalBatches = batches.length;
  const inTransitBatches = batches.filter(b => 
    b.currentStage === 'IN_TRANSIT' || b.currentStage === 'IN_TRANSIT_TO_CONSUMER'
  ).length;
  const totalRevenue = batches.reduce((sum, batch) => {
    return sum + (batch.paymentStatus?.status === 'PAID' ? batch.paymentStatus.amount : 0);
  }, 0);
  const pendingPayments = batches.reduce((sum, batch) => {
    return sum + (batch.paymentStatus?.status === 'PENDING' ? batch.paymentStatus.amount : 0);
  }, 0);
  
  // Get the most recent batch
  const sortedBatches = [...batches].sort((a, b) => 
    new Date(b.harvestDate).getTime() - new Date(a.harvestDate).getTime()
  );
  const latestBatch = sortedBatches[0];
  
  // Get alerts for farmer's batches
  const alerts = batches.flatMap(batch => {
    const batchIoTData = iotData[batch.iotSensorId] || [];
    return batchIoTData
      .filter(data => data.temperature > 30 || data.humidity > 80)
      .map(data => ({
        batchId: batch.id,
        cropType: batch.cropType,
        timestamp: data.timestamp,
        issue: data.temperature > 30 ? 'High Temperature' : 'High Humidity',
        value: data.temperature > 30 ? `${data.temperature}°C` : `${data.humidity}%`
      }));
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Farmer Dashboard</h1>
      
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 mr-4">
              <FiBarChart2 className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Batches</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{totalBatches}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
              <FiTruck className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">In Transit</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{inTransitBatches}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 mr-4">
              <FiDollarSign className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">${totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 mr-4">
              <FiDollarSign className="text-yellow-600 dark:text-yellow-400" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Payments</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">${pendingPayments.toFixed(2)}</p>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(alert.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Latest Batch IoT Data */}
      {latestBatch && iotData[latestBatch.iotSensorId] && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Latest Batch Monitoring</h2>
          <IoTChart 
            data={iotData[latestBatch.iotSensorId]} 
            batchType={latestBatch.cropType}
            predictedShelfLife={latestBatch.predictedShelfLife}
          />
        </div>
      )}
      
      {/* Blockchain Traceability */}
      {latestBatch && (
        <div className="mb-8">
          <BlockchainTraceability batch={latestBatch} />
        </div>
      )}
      
      {/* Batch Identity System */}
      {latestBatch && (
        <div className="mb-8">
          <BatchIdentitySystem batch={latestBatch} />
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;