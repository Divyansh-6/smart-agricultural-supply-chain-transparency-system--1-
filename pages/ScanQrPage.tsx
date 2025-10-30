
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QrScannerComponent from '../components/QrScannerComponent';

const ScanQrPage: React.FC = () => {
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScanResult = (result: string | null) => {
    // Only process if we haven't already processed a result
    if (result && !scanResult) {
      setScanResult(`Scanned: ${result}`);
      try {
        // Use a regular expression to find the batch ID, which is more robust
        // than parsing the URL object, which can fail on minor malformations.
        const match = result.match(/\/consumer\/([^/]+)/);
        
        if (match && match[1]) {
          const batchId = match[1];
          // Navigate to the consumer view page for the scanned batch
          navigate(`/consumer/${batchId}`);
        } else {
          setError('Invalid AgriChain QR code. Please scan a valid product code.');
          // Allow scanning again after a delay
          setTimeout(() => {
            setScanResult(null);
            setError(null);
          }, 3000);
        }
      } catch (e) {
        setError('An error occurred while processing the QR code.');
        // Allow scanning again after a delay
        setTimeout(() => {
          setScanResult(null);
          setError(null);
        }, 3000);
      }
    }
  };

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Scan Product QR Code</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Center the QR code in the frame to view its supply chain history.</p>
      
      <QrScannerComponent onResult={handleScanResult} />

      {error && <p className="mt-4 text-red-500">{error}</p>}
      {!error && scanResult && <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Processing scan...</p>}
    </div>
  );
};

export default ScanQrPage;
