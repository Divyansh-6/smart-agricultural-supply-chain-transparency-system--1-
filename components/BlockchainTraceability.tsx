import React, { useState } from 'react';
import { Batch, BlockchainTransaction, Stage } from '../types';
import { FiCheckCircle, FiClock, FiAlertTriangle, FiInfo } from 'react-icons/fi';
import { useDarkMode } from '../hooks/useDarkMode';

interface BlockchainTraceabilityProps {
  batch: Batch;
}

const BlockchainTraceability: React.FC<BlockchainTraceabilityProps> = ({ batch }) => {
  const { theme } = useDarkMode();
  const [selectedTransaction, setSelectedTransaction] = useState<BlockchainTransaction | null>(null);

  // Filter stages that have blockchain data
  const blockchainStages = batch.history.filter(stage => stage.blockchainData);

  const getStatusIcon = (status: boolean) => {
    if (status) {
      return <FiCheckCircle className="text-green-500" size={20} />;
    }
    return <FiAlertTriangle className="text-red-500" size={20} />;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const shortenHash = (hash: string) => {
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
  };

  const shortenAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const handleViewTransaction = (tx: BlockchainTransaction) => {
    setSelectedTransaction(tx);
  };

  const getExplorerUrl = (txHash: string) => {
    // This would be replaced with the actual blockchain explorer URL
    return `https://etherscan.io/tx/${txHash}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Blockchain Traceability</h2>
      
      {blockchainStages.length === 0 ? (
        <div className="text-center py-8">
          <FiInfo className="mx-auto text-gray-400" size={48} />
          <p className="mt-2 text-gray-500 dark:text-gray-400">No blockchain data available for this batch</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Stage</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Transaction Hash</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Timestamp</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {blockchainStages.map((stage, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{stage.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {stage.blockchainData && shortenHash(stage.blockchainData.txHash)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {stage.blockchainData && formatTimestamp(stage.blockchainData.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {stage.blockchainData && getStatusIcon(stage.blockchainData.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => stage.blockchainData && handleViewTransaction(stage.blockchainData)}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                    >
                      View Details
                    </button>
                    <a
                      href={getExplorerUrl(stage.txHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Explorer
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedTransaction && (
        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Transaction Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Transaction Hash</p>
              <p className="text-base font-medium text-gray-900 dark:text-white break-all">{selectedTransaction.txHash}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Block Number</p>
              <p className="text-base font-medium text-gray-900 dark:text-white">{selectedTransaction.blockNumber}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">From</p>
              <p className="text-base font-medium text-gray-900 dark:text-white">{shortenAddress(selectedTransaction.from)}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">To</p>
              <p className="text-base font-medium text-gray-900 dark:text-white">{shortenAddress(selectedTransaction.to)}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Value</p>
              <p className="text-base font-medium text-gray-900 dark:text-white">{selectedTransaction.value} ETH</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Gas Used</p>
              <p className="text-base font-medium text-gray-900 dark:text-white">{selectedTransaction.gasUsed}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
              <div className="flex items-center">
                {getStatusIcon(selectedTransaction.status)}
                <span className="ml-2 text-base font-medium text-gray-900 dark:text-white">
                  {selectedTransaction.status ? 'Success' : 'Failed'}
                </span>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Timestamp</p>
              <p className="text-base font-medium text-gray-900 dark:text-white">{formatTimestamp(selectedTransaction.timestamp)}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedTransaction(null)}
            className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            Close Details
          </button>
        </div>
      )}
    </div>
  );
};

export default BlockchainTraceability;