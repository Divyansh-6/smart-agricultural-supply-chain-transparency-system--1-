import React, { useState, useEffect } from 'react';
import { Alert, Batch, IoTData } from '../types';
import { FiMapPin, FiThermometer, FiDroplet, FiAlertTriangle, FiClock, FiBell } from 'react-icons/fi';

interface AlertsSystemProps {
  batch: Batch;
  iotData: IoTData[];
  alerts?: Alert[];
}

const AlertsSystem: React.FC<AlertsSystemProps> = ({ batch, iotData, alerts: initialAlerts = [] }) => {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [showMap, setShowMap] = useState(false);
  
  // Generate alerts based on IoT data
  useEffect(() => {
    const generatedAlerts: Alert[] = [];
    
    // Process the latest IoT data points
    const latestData = [...iotData].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
    
    latestData.forEach(data => {
      // Temperature alerts
      if (data.temperature > 30) {
        generatedAlerts.push({
          id: `temp-${data.timestamp}`,
          batchId: batch.id,
          type: 'TEMPERATURE',
          severity: data.temperature > 35 ? 'CRITICAL' : 'HIGH',
          message: `High temperature detected: ${data.temperature.toFixed(1)}°C`,
          timestamp: data.timestamp,
          acknowledged: false,
          location: data.gpsLocation
        });
      }
      
      // Humidity alerts
      if (data.humidity > 80) {
        generatedAlerts.push({
          id: `humid-${data.timestamp}`,
          batchId: batch.id,
          type: 'HUMIDITY',
          severity: data.humidity > 90 ? 'HIGH' : 'MEDIUM',
          message: `High humidity detected: ${data.humidity.toFixed(1)}%`,
          timestamp: data.timestamp,
          acknowledged: false,
          location: data.gpsLocation
        });
      }
      
      // Location alerts (if GPS data available)
      if (data.gpsLocation) {
        // Check if location is outside expected route
        // This is a simplified example - in a real system, you would compare against a predefined route
        const isOutsideRoute = Math.random() < 0.2; // 20% chance for demo purposes
        
        if (isOutsideRoute) {
          generatedAlerts.push({
            id: `loc-${data.timestamp}`,
            batchId: batch.id,
            type: 'LOCATION',
            severity: 'MEDIUM',
            message: 'Shipment detected outside expected route',
            timestamp: data.timestamp,
            acknowledged: false,
            location: data.gpsLocation
          });
        }
      }
    });
    
    // Combine with existing alerts, removing duplicates
    const existingAlertIds = new Set(alerts.map(a => a.id));
    const newAlerts = generatedAlerts.filter(a => !existingAlertIds.has(a.id));
    
    if (newAlerts.length > 0) {
      setAlerts(prevAlerts => [...newAlerts, ...prevAlerts]);
    }
  }, [iotData, batch.id]);
  
  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'LOW': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'HIGH': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'CRITICAL': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };
  
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'TEMPERATURE': return <FiThermometer className="mr-2" />;
      case 'HUMIDITY': return <FiDroplet className="mr-2" />;
      case 'LOCATION': return <FiMapPin className="mr-2" />;
      case 'TAMPERING': return <FiAlertTriangle className="mr-2" />;
      case 'DELAY': return <FiClock className="mr-2" />;
      case 'SPOILAGE_RISK': return <FiAlertTriangle className="mr-2" />;
      default: return <FiBell className="mr-2" />;
    }
  };
  
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };
  
  const renderMap = () => {
    // In a real application, this would use a mapping library like Leaflet or Google Maps
    // For this prototype, we'll show a placeholder
    return (
      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mt-4 relative">
        <div className="aspect-w-16 aspect-h-9">
          <div className="w-full h-64 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Interactive map would be displayed here</p>
            
            {/* Simulate map markers for alerts with locations */}
            {alerts.filter(a => a.location).map((alert, index) => (
              <div 
                key={alert.id}
                className={`absolute w-4 h-4 rounded-full ${
                  alert.severity === 'CRITICAL' ? 'bg-red-500' : 
                  alert.severity === 'HIGH' ? 'bg-orange-500' : 
                  alert.severity === 'MEDIUM' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}
                style={{ 
                  left: `${20 + (index * 10)}%`, 
                  top: `${30 + (Math.random() * 40)}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                title={`${alert.message} at ${formatTimestamp(alert.timestamp)}`}
              ></div>
            ))}
          </div>
        </div>
        <button 
          onClick={() => setShowMap(false)}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Hide Map
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <FiBell className="mr-2" /> Real-time Alerts
        </h2>
        {!showMap && (
          <button 
            onClick={() => setShowMap(true)}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <FiMapPin className="mr-1" /> Show Map
          </button>
        )}
      </div>
      
      {showMap && renderMap()}
      
      {alerts.length === 0 ? (
        <div className="text-center py-8">
          <FiBell className="mx-auto text-gray-400" size={48} />
          <p className="mt-2 text-gray-500 dark:text-gray-400">No alerts at this time</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map(alert => (
            <div 
              key={alert.id}
              className={`p-4 rounded-lg border-l-4 ${
                alert.acknowledged 
                  ? 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600' 
                  : `${getSeverityColor(alert.severity)} border-${alert.severity === 'CRITICAL' ? 'red' : alert.severity === 'HIGH' ? 'orange' : alert.severity === 'MEDIUM' ? 'yellow' : 'blue'}-500`
              }`}
            >
              <div className="flex justify-between">
                <div className="flex items-center">
                  {getAlertIcon(alert.type)}
                  <span className={`font-medium ${alert.acknowledged ? 'text-gray-500 dark:text-gray-400' : ''}`}>
                    {alert.message}
                  </span>
                </div>
                {!alert.acknowledged && (
                  <button
                    onClick={() => handleAcknowledgeAlert(alert.id)}
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Acknowledge
                  </button>
                )}
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  {formatTimestamp(alert.timestamp)}
                </span>
                {alert.location && (
                  <span className="text-gray-500 dark:text-gray-400 flex items-center">
                    <FiMapPin className="mr-1" />
                    {alert.location.latitude.toFixed(4)}, {alert.location.longitude.toFixed(4)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertsSystem;