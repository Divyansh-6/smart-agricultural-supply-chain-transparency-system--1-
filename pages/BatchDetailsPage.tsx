import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getBatchById, getIotData, updateBatchStage } from '../services/mockApi';
import { Batch, IoTData, Role, StageName } from '../types';
import IoTChart from '../components/IoTChart';
import Timeline from '../components/Timeline';
import Map from '../components/Map';
// Fix: The 'qrcode.react' library exports named components like QRCodeSVG instead of a default export.
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../hooks/useAuth';

const stageTransitions: Record<Role, Partial<Record<StageName, StageName>>> = {
    [Role.FARMER]: { [StageName.HARVESTED]: StageName.IN_TRANSIT },
    [Role.DISTRIBUTOR]: {
        [StageName.IN_TRANSIT]: StageName.AT_DISTRIBUTOR,
        [StageName.AT_DISTRIBUTOR]: StageName.IN_TRANSIT_TO_CONSUMER,
    },
    [Role.CONSUMER]: {
        [StageName.IN_TRANSIT_TO_CONSUMER]: StageName.AT_CONSUMER,
    },
    [Role.RETAILER]: {}
};


const BatchDetailsPage: React.FC = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const { user } = useAuth();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [iotData, setIotData] = useState<IoTData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBatchData = useCallback(async () => {
    if (batchId) {
      setLoading(true);
      const batchDetails = await getBatchById(batchId);
      if (batchDetails) {
        setBatch(batchDetails);
      }
      setLoading(false);
    }
  }, [batchId]);

  useEffect(() => {
    fetchBatchData();
  }, [fetchBatchData]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (batchId) {
        const fetchIot = async () => {
            const data = await getIotData(batchId);
            setIotData(data);
        };
        fetchIot();
        interval = setInterval(fetchIot, 5000); // refresh iot data every 5 seconds
    }
    return () => clearInterval(interval);
  }, [batchId]);

  const handleUpdateStage = async () => {
    if (user && batch && batchId) {
        const nextStage = stageTransitions[user.role]?.[batch.currentStage];
        if (nextStage) {
            await updateBatchStage(batchId, nextStage, user, {});
            fetchBatchData(); // Refresh batch data
        }
    }
  };

  if (loading) {
    return <div className="text-center p-10">Loading batch details...</div>;
  }

  if (!batch) {
    return <div className="text-center p-10">Batch not found.</div>;
  }

  const nextStageForUser = user ? stageTransitions[user.role]?.[batch.currentStage] : undefined;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{batch.cropType}</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 font-mono">{batch.id}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <IoTChart data={iotData} />
            <Timeline history={batch.history} />
            <Map history={batch.history} />
        </div>
        <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Product QR Code</h3>
                <div className="p-4 bg-white inline-block rounded-lg">
                    {/* Fix: Use the imported QRCodeSVG component as the default export is deprecated. */}
                    <QRCodeSVG value={window.location.origin + window.location.pathname + batch.qrCodeUrl} size={192} />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">Scan to see public traceability report.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Batch Information</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li><strong>Farmer:</strong> {batch.farmerName}</li>
                    <li><strong>Origin:</strong> {batch.farmLocation}</li>
                    <li><strong>Sensor ID:</strong> {batch.iotSensorId}</li>
                    <li className="pt-2"><strong>Current Stage:</strong> 
                        <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            {batch.currentStage.replace(/_/g, ' ')}
                        </span>
                    </li>
                </ul>
                {nextStageForUser && (
                    <button onClick={handleUpdateStage} className="w-full mt-6 py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-focus">
                        Update to: {nextStageForUser.replace(/_/g, ' ')}
                    </button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default BatchDetailsPage;
