
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { IoTData } from '../types';
import { useDarkMode } from '../hooks/useDarkMode';

interface IoTChartProps {
  data: IoTData[];
  batchType?: string;
  predictedShelfLife?: number;
}

const IoTChart: React.FC<IoTChartProps> = ({ data, batchType = 'Produce', predictedShelfLife }) => {
  const { theme } = useDarkMode();
  const strokeColor = theme === 'dark' ? '#9ca3af' : '#6b7280';
  const gridColor = theme === 'dark' ? '#374151' : '#e5e7eb';

  const formattedData = data.map(d => ({
    ...d,
    time: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    freshness: calculateFreshness(d.temperature, d.humidity, d.ethylene || 0, d.co2 || 0),
  }));

  const spoilageRisk = calculateSpoilageRisk(data);
  const freshnessTrend = calculateFreshnessTrend(formattedData);
  const freshnessBadge = getFreshnessBadge(freshnessTrend);

  function calculateFreshness(temp: number, humidity: number, ethylene: number, co2: number): number {
    // Freshness algorithm based on multiple factors
    // Scale: 100 (perfect) to 0 (spoiled)
    let freshness = 100;
    
    // Temperature impact (optimal range depends on produce type)
    if (temp > 30) freshness -= (temp - 30) * 5;
    if (temp < 0) freshness -= Math.abs(temp) * 8;
    
    // Humidity impact (optimal range 60-80%)
    if (humidity > 80) freshness -= (humidity - 80) * 1.5;
    if (humidity < 60) freshness -= (60 - humidity) * 2;
    
    // Ethylene impact (ripening hormone)
    freshness -= ethylene * 10;
    
    // CO2 impact (indicates respiration rate)
    freshness -= co2 * 0.5;
    
    return Math.max(0, Math.min(100, freshness));
  }

  function calculateSpoilageRisk(data: IoTData[]): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    const tempExcursions = data.filter(d => d.temperature > 30 || d.temperature < 0).length;
    const humidityExcursions = data.filter(d => d.humidity > 85 || d.humidity < 40).length;
    const ethyleneHigh = data.filter(d => (d.ethylene || 0) > 5).length;
    
    const totalPoints = data.length;
    const excursionPercentage = ((tempExcursions + humidityExcursions + ethyleneHigh) / (totalPoints * 3)) * 100;
    
    if (excursionPercentage > 50) return 'CRITICAL';
    if (excursionPercentage > 30) return 'HIGH';
    if (excursionPercentage > 15) return 'MEDIUM';
    return 'LOW';
  }

  function calculateFreshnessTrend(data: any[]): 'STABLE' | 'DECLINING' | 'RAPIDLY_DECLINING' {
    if (data.length < 3) return 'STABLE';
    
    const recentValues = data.slice(-3).map(d => d.freshness);
    const decline = recentValues[0] - recentValues[recentValues.length - 1];
    
    if (decline > 15) return 'RAPIDLY_DECLINING';
    if (decline > 5) return 'DECLINING';
    return 'STABLE';
  }

  function getFreshnessBadge(trend: string) {
    switch (trend) {
      case 'STABLE':
        return { color: 'green', text: 'Freshness Stable', icon: '✓' };
      case 'DECLINING':
        return { color: 'yellow', text: 'Freshness Declining', icon: '⚠️' };
      case 'RAPIDLY_DECLINING':
        return { color: 'red', text: 'Rapid Quality Loss', icon: '⚠️' };
      default:
        return { color: 'gray', text: 'Unknown', icon: '?' };
    }
  }

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'HIGH': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'CRITICAL': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const latestFreshness = formattedData.length > 0 ? formattedData[formattedData.length - 1].freshness : 0;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Live IoT Sensor Data</h3>
        <div className="flex space-x-2">
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getRiskBadgeColor(spoilageRisk)}`}>
            {spoilageRisk === 'LOW' ? '✓' : '⚠️'} {spoilageRisk} Risk
          </span>
          <span className={`px-3 py-1 text-sm font-medium rounded-full bg-${freshnessBadge.color}-100 text-${freshnessBadge.color}-800 dark:bg-${freshnessBadge.color}-900 dark:text-${freshnessBadge.color}-300`}>
            {freshnessBadge.icon} {freshnessBadge.text}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Freshness Score</p>
          <div className="flex items-center justify-center">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={latestFreshness > 70 ? '#10b981' : latestFreshness > 40 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="3"
                  strokeDasharray={`${latestFreshness}, 100`}
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="text-xl font-bold text-gray-900 dark:text-white">{Math.round(latestFreshness)}%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Product Type</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{batchType}</p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Shelf Life Remaining</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {predictedShelfLife ? `${predictedShelfLife} days` : 'Calculating...'}
          </p>
        </div>
      </div>

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart
            data={formattedData}
            margin={{
              top: 5,
              right: 20,
              left: -10,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="time" stroke={strokeColor} />
            <YAxis yAxisId="left" label={{ value: 'Temp (°C)', angle: -90, position: 'insideLeft', fill: strokeColor }} stroke={strokeColor} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'Humidity (%)', angle: -90, position: 'insideRight', fill: strokeColor }} stroke={strokeColor} />
            <YAxis yAxisId="freshness" orientation="right" domain={[0, 100]} hide />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                color: theme === 'dark' ? '#ffffff' : '#000000',
                border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
              }}
            />
            <Legend wrapperStyle={{ color: strokeColor }} />
            <ReferenceLine yAxisId="left" y={30} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Max Safe Temp', fill: '#ef4444', position: 'insideBottomRight' }} />
            <ReferenceLine yAxisId="right" y={80} stroke="#3b82f6" strokeDasharray="3 3" label={{ value: 'Max Safe Humidity', fill: '#3b82f6', position: 'insideTopRight' }} />
            <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#ef4444" name="Temperature" dot={false} />
            <Line yAxisId="right" type="monotone" dataKey="humidity" stroke="#3b82f6" name="Humidity" dot={false} />
            <Line yAxisId="freshness" type="monotone" dataKey="freshness" stroke="#10b981" name="Freshness" dot={false} strokeWidth={2} />
            {data.some(d => d.ethylene !== undefined) && (
              <Line yAxisId="left" type="monotone" dataKey="ethylene" stroke="#8b5cf6" name="Ethylene" dot={false} />
            )}
            {data.some(d => d.co2 !== undefined) && (
              <Line yAxisId="right" type="monotone" dataKey="co2" stroke="#f97316" name="CO₂" dot={false} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IoTChart;
