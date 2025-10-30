import React, { useState, useEffect } from 'react';
import { Batch, IoTData, SpoilagePrediction as SpoilagePredictionType } from '../types';
import { FiAlertTriangle, FiClock, FiThermometer, FiDroplet, FiTrendingUp } from 'react-icons/fi';

interface SpoilagePredictionProps {
  batch: Batch;
  iotData: IoTData[];
  initialPrediction?: SpoilagePredictionType;
}

const SpoilagePrediction: React.FC<SpoilagePredictionProps> = ({ 
  batch, 
  iotData,
  initialPrediction 
}) => {
  const [prediction, setPrediction] = useState<SpoilagePredictionType | null>(initialPrediction || null);
  
  // Simulate ML model prediction based on IoT data
  useEffect(() => {
    if (!iotData || iotData.length === 0) return;
    
    // Sort data by timestamp (newest first)
    const sortedData = [...iotData].sort((a, b) => b.timestamp - a.timestamp);
    const latestData = sortedData[0];
    
    // Calculate average temperature and humidity over the last 24 hours
    const last24Hours = sortedData.filter(d => 
      (latestData.timestamp - d.timestamp) <= 24 * 60 * 60 * 1000
    );
    
    const avgTemp = last24Hours.reduce((sum, d) => sum + d.temperature, 0) / last24Hours.length;
    const avgHumidity = last24Hours.reduce((sum, d) => sum + d.humidity, 0) / last24Hours.length;
    
    // Calculate temperature and humidity volatility
    const tempVolatility = last24Hours.reduce((sum, d) => 
      sum + Math.abs(d.temperature - avgTemp), 0) / last24Hours.length;
    
    const humidityVolatility = last24Hours.reduce((sum, d) => 
      sum + Math.abs(d.humidity - avgHumidity), 0) / last24Hours.length;
    
    // Calculate time since harvest
    const harvestStage = batch.stages.find(s => s.name === 'HARVESTED');
    const harvestTime = harvestStage ? harvestStage.timestamp : batch.createdAt;
    const daysSinceHarvest = (Date.now() - harvestTime) / (1000 * 60 * 60 * 24);
    
    // Simple ML model simulation
    // In a real application, this would call an API to a trained ML model
    let spoilageRisk = 0;
    
    // Temperature factor (higher temp = higher risk)
    if (avgTemp > 30) spoilageRisk += 40;
    else if (avgTemp > 25) spoilageRisk += 25;
    else if (avgTemp > 20) spoilageRisk += 15;
    else if (avgTemp > 15) spoilageRisk += 5;
    
    // Humidity factor (higher humidity = higher risk)
    if (avgHumidity > 85) spoilageRisk += 35;
    else if (avgHumidity > 75) spoilageRisk += 25;
    else if (avgHumidity > 65) spoilageRisk += 15;
    else if (avgHumidity > 55) spoilageRisk += 5;
    
    // Volatility factors (more volatility = higher risk)
    spoilageRisk += tempVolatility * 5;
    spoilageRisk += humidityVolatility * 3;
    
    // Time factor (more time = higher risk)
    spoilageRisk += Math.min(daysSinceHarvest * 2, 20);
    
    // Cap at 100%
    spoilageRisk = Math.min(Math.max(spoilageRisk, 0), 100);
    
    // Calculate estimated shelf life
    let shelfLifeDays = 14; // Base shelf life for produce
    
    // Adjust based on risk factors
    if (spoilageRisk > 80) shelfLifeDays = 1;
    else if (spoilageRisk > 60) shelfLifeDays = 3;
    else if (spoilageRisk > 40) shelfLifeDays = 7;
    else if (spoilageRisk > 20) shelfLifeDays = 10;
    
    // Calculate expiration date
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + shelfLifeDays);
    
    // Generate key factors
    const keyFactors = [];
    if (avgTemp > 25) keyFactors.push('High average temperature');
    if (avgHumidity > 75) keyFactors.push('High average humidity');
    if (tempVolatility > 5) keyFactors.push('Temperature fluctuations');
    if (humidityVolatility > 10) keyFactors.push('Humidity fluctuations');
    if (daysSinceHarvest > 7) keyFactors.push('Time since harvest');
    
    // Generate recommendations
    const recommendations = [];
    if (avgTemp > 25) recommendations.push('Lower storage temperature');
    if (avgHumidity > 75) recommendations.push('Reduce humidity in storage area');
    if (tempVolatility > 5) recommendations.push('Maintain consistent temperature');
    if (humidityVolatility > 10) recommendations.push('Stabilize humidity levels');
    if (spoilageRisk > 60) recommendations.push('Expedite delivery to final destination');
    if (spoilageRisk > 80) recommendations.push('Consider immediate sale or use');
    
    // Create prediction object
    const newPrediction: SpoilagePredictionType = {
      id: `spoilage-${batch.id}`,
      batchId: batch.id,
      timestamp: Date.now(),
      spoilageRisk,
      estimatedShelfLife: shelfLifeDays,
      expirationDate: expirationDate.getTime(),
      keyFactors,
      recommendations,
      confidenceScore: 85 // In a real ML model, this would be provided by the model
    };
    
    setPrediction(newPrediction);
  }, [batch, iotData]);
  
  if (!prediction) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex justify-center items-center h-64">
        <p className="text-gray-500 dark:text-gray-400">Loading prediction data...</p>
      </div>
    );
  }
  
  const getRiskColor = (risk: number) => {
    if (risk < 20) return 'text-green-500';
    if (risk < 40) return 'text-blue-500';
    if (risk < 60) return 'text-yellow-500';
    if (risk < 80) return 'text-orange-500';
    return 'text-red-500';
  };
  
  const getRiskBg = (risk: number) => {
    if (risk < 20) return 'bg-green-100 dark:bg-green-900';
    if (risk < 40) return 'bg-blue-100 dark:bg-blue-900';
    if (risk < 60) return 'bg-yellow-100 dark:bg-yellow-900';
    if (risk < 80) return 'bg-orange-100 dark:bg-orange-900';
    return 'bg-red-100 dark:bg-red-900';
  };
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center mb-6">
        <FiTrendingUp className="mr-2" /> Spoilage Prediction (ML Model)
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Score */}
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
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
                className={getRiskColor(prediction.spoilageRisk)}
                strokeWidth="10"
                strokeDasharray={360}
                strokeDashoffset={360 - (360 * prediction.spoilageRisk) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="56"
                cx="64"
                cy="64"
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <span className={`text-3xl font-bold ${getRiskColor(prediction.spoilageRisk)}`}>
                {prediction.spoilageRisk}%
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400">Risk</p>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Model Confidence: {prediction.confidenceScore}%
            </p>
          </div>
          
          <div className={`mt-4 p-3 rounded-lg ${getRiskBg(prediction.spoilageRisk)} w-full text-center`}>
            <p className={`font-medium ${getRiskColor(prediction.spoilageRisk)}`}>
              {prediction.spoilageRisk < 20 ? 'Very Low Risk' :
               prediction.spoilageRisk < 40 ? 'Low Risk' :
               prediction.spoilageRisk < 60 ? 'Moderate Risk' :
               prediction.spoilageRisk < 80 ? 'High Risk' : 'Critical Risk'}
            </p>
          </div>
        </div>
        
        {/* Shelf Life */}
        <div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
            <div className="flex items-center mb-2">
              <FiClock className="text-blue-500 mr-2" />
              <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">
                Estimated Shelf Life
              </h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {prediction.estimatedShelfLife} days
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Best before: {formatDate(prediction.expirationDate)}
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">
              Key Factors
            </h3>
            <ul className="space-y-1">
              {prediction.keyFactors.map((factor, index) => (
                <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <FiAlertTriangle className="text-yellow-500 mr-2" />
                  {factor}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Recommendations */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
          Recommendations
        </h3>
        <ul className="space-y-2">
          {prediction.recommendations.map((recommendation, index) => (
            <li key={index} className="flex items-start">
              <span className="flex-shrink-0 w-5 h-5 text-blue-500 mr-2">•</span>
              <span className="text-gray-600 dark:text-gray-400">{recommendation}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SpoilagePrediction;