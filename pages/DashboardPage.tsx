import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getBatchesForUser, addBatch } from '../services/mockApi';
import { Batch, Role } from '../types';
import DashboardCard from '../components/DashboardCard';
import { Link } from 'react-router-dom';
import { Package, Truck, Store, PlusCircle } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCropType, setNewCropType] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const fetchBatches = useCallback(async () => {
    if (user) {
      setLoading(true);
      const userBatches = await getBatchesForUser(user);
      setBatches(userBatches);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  const handleAddBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user && newCropType) {
        setIsAdding(true);
        await addBatch(newCropType, user);
        setNewCropType('');
        await fetchBatches(); // Refresh list
        setIsAdding(false);
    }
  };

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (!user) {
    return <div>User not found.</div>;
  }

  const roleSpecificTitle = {
    [Role.FARMER]: 'Your Harvested Batches',
    [Role.DISTRIBUTOR]: 'Batches in Distribution',
    [Role.CONSUMER]: 'Consumer View',
    [Role.RETAILER]: '',
  };
  
  const totalBatches = batches.length;
  const inTransitBatches = batches.filter(b => b.currentStage.includes('IN_TRANSIT')).length;
  const atLocationBatches = batches.filter(b => b.currentStage.includes('AT_')).length;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome, {user.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard icon={<Package className="w-8 h-8 text-primary"/>} title="Total Batches" value={totalBatches.toString()} description="All batches you manage" />
        <DashboardCard icon={<Truck className="w-8 h-8 text-primary"/>} title="In Transit" value={inTransitBatches.toString()} description="Batches currently on the move" />
        <DashboardCard icon={<Store className="w-8 h-8 text-primary"/>} title="At Location" value={atLocationBatches.toString()} description="Batches at a facility" />
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{roleSpecificTitle[user.role]}</h2>
           {user.role === Role.FARMER && (
             <form onSubmit={handleAddBatch} className="flex items-center space-x-2">
                <input 
                    type="text"
                    value={newCropType}
                    onChange={(e) => setNewCropType(e.target.value)}
                    placeholder="e.g., Organic Strawberries"
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700"
                    required
                />
                <button type="submit" disabled={isAdding} className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-focus disabled:bg-gray-400">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    {isAdding ? 'Adding...' : 'Add Batch'}
                </button>
             </form>
           )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Batch ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Crop Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Current Stage</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {batches.map((batch) => (
                <tr key={batch.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500 dark:text-gray-400">{batch.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{batch.cropType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        {batch.currentStage.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/batch/${batch.id}`} className="text-primary hover:text-primary-focus">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;