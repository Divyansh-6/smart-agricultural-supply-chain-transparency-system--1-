import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Batch, IoTData } from '../types';
import IoTChart from '../components/IoTChart';
import BlockchainTraceability from '../components/BlockchainTraceability';
import BatchIdentitySystem from '../components/BatchIdentitySystem';
import SpoilagePrediction from '../components/SpoilagePrediction';
import CarbonFootprintScore from '../components/CarbonFootprintScore';
import AlertsSystem from '../components/AlertsSystem';
import ProductRating from '../components/ProductRating';
import NutritionalInfo from '../components/NutritionalInfo';
import SustainabilityScore from '../components/SustainabilityScore';
import RecipeSuggestions from '../components/RecipeSuggestions';
import { FiArrowLeft, FiBox, FiInfo, FiMapPin, FiCalendar, FiClock } from 'react-icons/fi';

// Mock data for demonstration
const mockBatch: Batch = {
  id: 'batch-123456',
  name: 'Organic Strawberries',
  description: 'Premium organic strawberries from Hillside Farms',
  productType: 'Strawberries',
  quantity: 500,
  quantityUnit: 'kg',
  createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
  iotSensorId: 'iot-sensor-789',
  rfidTagId: 'rfid-tag-456',
  currentStage: 'AT_CONSUMER',
  stages: [
    {
      id: 'stage-1',
      name: 'HARVESTED',
      timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
      location: {
        latitude: 37.7749,
        longitude: -122.4194,
        name: 'Hillside Farms, California'
      },
      handler: {
        id: 'user-123',
        name: 'John Farmer',
        role: 'FARMER'
      },
      notes: 'Harvested in optimal conditions',
      txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
    },
    {
      id: 'stage-2',
      name: 'IN_TRANSIT',
      timestamp: Date.now() - 6 * 24 * 60 * 60 * 1000,
      location: {
        latitude: 37.8049,
        longitude: -122.2711,
        name: 'In transit from farm to distributor'
      },
      handler: {
        id: 'user-456',
        name: 'Logistics Co.',
        role: 'DISTRIBUTOR'
      },
      notes: 'Refrigerated transport at 4°C',
      txHash: '0x2345678901abcdef2345678901abcdef2345678901abcdef2345678901abcdef'
    },
    {
      id: 'stage-3',
      name: 'AT_DISTRIBUTOR',
      timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000,
      location: {
        latitude: 37.8049,
        longitude: -122.2711,
        name: 'FreshDist Warehouse, Oakland'
      },
      handler: {
        id: 'user-456',
        name: 'FreshDist Inc.',
        role: 'DISTRIBUTOR'
      },
      notes: 'Quality check performed, all metrics within acceptable range',
      txHash: '0x3456789012abcdef3456789012abcdef3456789012abcdef3456789012abcdef'
    },
    {
      id: 'stage-4',
      name: 'IN_TRANSIT_TO_CONSUMER',
      timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
      location: {
        latitude: 37.7749,
        longitude: -122.4194,
        name: 'In transit to consumer'
      },
      handler: {
        id: 'user-456',
        name: 'Logistics Co.',
        role: 'DISTRIBUTOR'
      },
      notes: 'Refrigerated transport at 4°C',
      txHash: '0x4567890123abcdef4567890123abcdef4567890123abcdef4567890123abcdef'
    },
    {
      id: 'stage-5',
      name: 'AT_CONSUMER',
      timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
      location: {
        latitude: 37.7749,
        longitude: -122.4194,
        name: 'FreshMart Store #42, San Francisco'
      },
      handler: {
        id: 'user-789',
        name: 'FreshMart',
        role: 'CONSUMER'
      },
      notes: 'Received and placed in refrigerated display',
      txHash: '0x5678901234abcdef5678901234abcdef5678901234abcdef5678901234abcdef'
    }
  ]
};

// Generate mock IoT data
const generateMockIoTData = (): IoTData[] => {
  const data: IoTData[] = [];
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  
  // Generate data points for the last 7 days, one per hour
  for (let i = 0; i < 7 * 24; i++) {
    const timestamp = now - (i * oneHour);
    const baseTemp = 4; // Base temperature for refrigerated produce
    const baseHumidity = 85; // Base humidity
    
    // Add some randomness and a slight upward trend over time
    const tempVariation = Math.random() * 2 - 1; // -1 to +1
    const humidityVariation = Math.random() * 5 - 2.5; // -2.5 to +2.5
    const timeDecay = i / (7 * 24) * 3; // Gradual increase over time
    
    // Create GPS location with slight variations
    const baseLatitude = 37.7749;
    const baseLongitude = -122.4194;
    const latVariation = (Math.random() * 0.02) - 0.01;
    const longVariation = (Math.random() * 0.02) - 0.01;
    
    data.push({
      id: `iot-${timestamp}`,
      batchId: mockBatch.id,
      sensorId: mockBatch.iotSensorId,
      timestamp,
      temperature: baseTemp + tempVariation + timeDecay,
      humidity: baseHumidity + humidityVariation,
      gpsLocation: {
        latitude: baseLatitude + latVariation,
        longitude: baseLongitude + longVariation,
        name: 'In transit'
      },
      light: Math.random() * 100,
      shock: Math.random() > 0.95 ? Math.random() * 10 : 0, // Occasional shock events
      batteryLevel: 100 - (i / (7 * 24) * 15) // Battery decreases over time
    });
  }
  
  return data;
};

const ConsumerView: React.FC = () => {
  const router = useRouter();
  const { batchId } = router.query;
  const [batch, setBatch] = useState<Batch | null>(null);
  const [iotData, setIoTData] = useState<IoTData[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    // In a real app, we would fetch the batch data from an API
    // For this prototype, we'll use mock data
    if (batchId) {
      setBatch(mockBatch);
      setIoTData(generateMockIoTData());
    }
  }, [batchId]);
  
  if (!batch) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };
  
  const handleGoBack = () => {
    router.back();
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <button 
              onClick={handleGoBack}
              className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiArrowLeft className="text-gray-600 dark:text-gray-300" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {batch.name}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Batch ID: {batch.id}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Overview */}
      <div className="container mx-auto px-4 mt-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Product Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-start">
                  <FiBox className="mt-1 mr-3 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Product Type
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {batch.productType}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FiInfo className="mt-1 mr-3 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Description
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {batch.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FiMapPin className="mt-1 mr-3 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Origin
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {batch.stages[0].location.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Batch Timeline
              </h2>
              <div className="space-y-3">
                <div className="flex items-start">
                  <FiCalendar className="mt-1 mr-3 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Harvested Date
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {formatDate(batch.stages[0].timestamp)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FiClock className="mt-1 mr-3 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Current Stage
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {batch.currentStage.replace(/_/g, ' ')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FiMapPin className="mt-1 mr-3 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Current Location
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {batch.stages[batch.stages.length - 1].location.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="container mx-auto px-4">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 overflow-x-auto">
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'traceability'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('traceability')}
            >
              Blockchain Traceability
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'freshness'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('freshness')}
            >
              Freshness & Spoilage
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sustainability'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('sustainability')}
            >
              Sustainability
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'alerts'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('alerts')}
            >
              Alerts
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'identity'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('identity')}
            >
              Batch Identity
            </button>
          </nav>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="container mx-auto px-4 mt-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <IoTChart batch={batch} iotData={iotData} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SpoilagePrediction batch={batch} iotData={iotData} />
              <CarbonFootprintScore batch={batch} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <NutritionalInfo productType={batch.productType} />
              <SustainabilityScore batchId={batch.id} productType={batch.productType} />
            </div>
            <RecipeSuggestions productType={batch.productType} />
            <ProductRating batchId={batch.id} />
          </div>
        )}
        
        {activeTab === 'traceability' && (
          <BlockchainTraceability batch={batch} />
        )}
        
        {activeTab === 'freshness' && (
          <div className="space-y-6">
            <IoTChart batch={batch} iotData={iotData} />
            <SpoilagePrediction batch={batch} iotData={iotData} />
          </div>
        )}
        
        {activeTab === 'sustainability' && (
          <CarbonFootprintScore batch={batch} />
        )}
        
        {activeTab === 'alerts' && (
          <AlertsSystem batch={batch} iotData={iotData} />
        )}
        
        {activeTab === 'identity' && (
          <BatchIdentitySystem batch={batch} />
        )}
      </div>
    </div>
  );
};

export default ConsumerView;