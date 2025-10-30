import React, { useState } from 'react';
import { Batch } from '../types';
import { FiTag, FiQrCode, FiDownload, FiShare2 } from 'react-icons/fi';
import QRCode from 'qrcode.react';

interface BatchIdentitySystemProps {
  batch: Batch;
}

const BatchIdentitySystem: React.FC<BatchIdentitySystemProps> = ({ batch }) => {
  const [activeTab, setActiveTab] = useState<'qr' | 'rfid'>('qr');
  
  const batchUrl = `${window.location.origin}/batch/${batch.id}`;
  
  const downloadQRCode = () => {
    const canvas = document.getElementById('batch-qr-code') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');
      
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `batch-${batch.id}-qr.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const shareQRCode = async () => {
    try {
      const canvas = document.getElementById('batch-qr-code') as HTMLCanvasElement;
      if (canvas) {
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
          }, 'image/png');
        });
        
        if (navigator.share) {
          await navigator.share({
            title: `Batch ${batch.id} QR Code`,
            text: `Scan this QR code to track batch ${batch.id}`,
            url: batchUrl,
            files: [new File([blob], `batch-${batch.id}-qr.png`, { type: 'image/png' })]
          });
        } else {
          alert('Web Share API not supported in your browser');
        }
      }
    } catch (error) {
      console.error('Error sharing QR code:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Batch Identity System</h2>
      
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          className={`py-2 px-4 font-medium text-sm focus:outline-none ${
            activeTab === 'qr'
              ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('qr')}
        >
          <FiQrCode className="inline mr-2" /> QR Code
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm focus:outline-none ${
            activeTab === 'rfid'
              ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('rfid')}
        >
          <FiTag className="inline mr-2" /> RFID Tag
        </button>
      </div>
      
      {activeTab === 'qr' && (
        <div className="flex flex-col items-center">
          <div className="bg-white p-4 rounded-lg mb-4">
            <QRCode
              id="batch-qr-code"
              value={batchUrl}
              size={200}
              level="H"
              includeMargin={true}
              renderAs="canvas"
            />
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
            Scan this QR code to access complete traceability information for batch {batch.id}
          </p>
          
          <div className="flex space-x-4">
            <button
              onClick={downloadQRCode}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FiDownload className="mr-2" /> Download
            </button>
            <button
              onClick={shareQRCode}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <FiShare2 className="mr-2" /> Share
            </button>
          </div>
        </div>
      )}
      
      {activeTab === 'rfid' && (
        <div className="flex flex-col items-center">
          <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg mb-4 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <FiTag size={40} className="text-blue-600 dark:text-blue-400" />
              <span className="text-lg font-mono bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded">
                {batch.rfidTag || 'RFID-' + batch.id.substring(0, 8).toUpperCase()}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Batch ID:</span>
                <span className="text-sm font-medium">{batch.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Product:</span>
                <span className="text-sm font-medium">{batch.cropType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Harvest Date:</span>
                <span className="text-sm font-medium">{new Date(batch.harvestDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Weight:</span>
                <span className="text-sm font-medium">{batch.batchWeight} kg</span>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
            RFID tag contains encrypted batch information and can be scanned with compatible RFID readers
          </p>
          
          <div className="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 p-4 w-full max-w-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700 dark:text-yellow-200">
                  Physical RFID tag required for scanning. Contact support to order replacement tags.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchIdentitySystem;