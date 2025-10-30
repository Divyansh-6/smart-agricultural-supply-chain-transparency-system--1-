
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getBatchById, getIotData } from '../services/mockApi';
import { Batch, IoTData } from '../types';
import IoTChart from '../components/IoTChart';
import Timeline from '../components/Timeline';
import { Leaf } from 'lucide-react';

const ConsumerViewPage: React.FC = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [iotData, setIotData] = useState<IoTData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (batchId) {
      const fetchBatchData = async () => {
        setLoading(true);
        const batchDetails = await getBatchById(batchId);
        if (batchDetails) {
          setBatch(batchDetails);
        }
        setLoading(false);
      };
      fetchBatchData();
    }
  }, [batchId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (batchId) {
      const fetchIot = async () => {
        const data = await getIotData(batchId);
        setIotData(data);
      };
      fetchIot();
      interval = setInterval(fetchIot, 5000); // Refresh IoT data
    }
    return () => clearInterval(interval);
  }, [batchId]);

  if (loading) {
    return <div className="text-center p-10 min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">Loading traceability report...</div>;
  }

  if (!batch) {
    return <div className="text-center p-10 min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">Product batch not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      <header className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center space-x-2">
            <Leaf className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-gray-800 dark:text-white">AgriChain Transparency Report</span>
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{batch.cropType}</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 font-mono">Batch ID: {batch.id}</p>
            <p className="mt-2">From <strong>{batch.farmerName}</strong> at <strong>{batch.farmLocation}</strong></p>
          </div>

          <IoTChart data={iotData} />
          <Timeline history={batch.history} />

        </div>
      </main>
      <footer className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
        Powered by AgriChain
      </footer>
    </div>
  );
};

export default ConsumerViewPage;
