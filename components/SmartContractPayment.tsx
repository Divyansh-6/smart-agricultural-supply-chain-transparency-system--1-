import React, { useState } from 'react';
import { Batch, SmartContract, User } from '../types';
import { FiCheck, FiClock, FiAlertTriangle, FiDollarSign, FiFileText } from 'react-icons/fi';

interface SmartContractPaymentProps {
  batch: Batch;
  currentUser: User;
  onPaymentComplete?: () => void;
}

const SmartContractPayment: React.FC<SmartContractPaymentProps> = ({ 
  batch, 
  currentUser,
  onPaymentComplete 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  const totalAmount = batch.batchWeight * batch.pricePerUnit;
  const fairTradeBonus = batch.sustainabilityScore && batch.sustainabilityScore > 80 ? 0.1 : 0;
  const fairTradeAmount = totalAmount * fairTradeBonus;
  const finalAmount = totalAmount + fairTradeAmount;
  
  const mockContract: SmartContract = {
    contractAddress: '0x' + Math.random().toString(16).substring(2, 42),
    contractType: 'PAYMENT',
    parties: [batch.farmerId, currentUser.id],
    terms: {
      batchId: batch.id,
      amount: finalAmount,
      fairTradeBonus: fairTradeBonus,
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      qualityRequirements: 'Temperature must not exceed 30°C during transit',
    },
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    transactions: []
  };

  const handleInitiatePayment = () => {
    setIsProcessing(true);
    
    // Simulate blockchain transaction
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      
      if (onPaymentComplete) {
        onPaymentComplete();
      }
    }, 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            <FiClock className="mr-1" /> Pending
          </span>
        );
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            <FiCheck className="mr-1" /> Active
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            <FiCheck className="mr-1" /> Completed
          </span>
        );
      case 'DISPUTED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            <FiAlertTriangle className="mr-1" /> Disputed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <FiDollarSign className="mr-2" /> Fair-Pay Smart Contract
        </h2>
        {getStatusBadge(paymentSuccess ? 'COMPLETED' : mockContract.status)}
      </div>
      
      {paymentSuccess ? (
        <div className="text-center py-8">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
            <FiCheck className="h-6 w-6 text-green-600 dark:text-green-300" />
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Payment Successful</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Transaction has been recorded on the blockchain and payment has been sent to the farmer.
          </p>
          <div className="mt-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Transaction Hash</p>
            <p className="text-xs font-mono text-gray-500 dark:text-gray-400 break-all">
              0x{Math.random().toString(16).substring(2, 66)}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Contract Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Contract Address</p>
                  <p className="text-sm font-mono text-gray-900 dark:text-white">{mockContract.contractAddress}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</p>
                  <p className="text-sm text-gray-900 dark:text-white">{new Date(mockContract.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Parties</p>
                  <p className="text-sm text-gray-900 dark:text-white">Farmer: {batch.farmerName}</p>
                  <p className="text-sm text-gray-900 dark:text-white">Buyer: {currentUser.name}</p>
                </div>
                <div>
                  <button
                    onClick={() => setShowTerms(!showTerms)}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <FiFileText className="mr-1" /> {showTerms ? 'Hide Terms' : 'View Terms'}
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Payment Summary</h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Product</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{batch.cropType}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Quantity</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{batch.batchWeight} kg</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Price per Unit</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">${batch.pricePerUnit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Subtotal</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">${totalAmount.toFixed(2)}</span>
                </div>
                {fairTradeBonus > 0 && (
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                    <span className="text-sm text-green-600 dark:text-green-400">Fair Trade Bonus (10%)</span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">+${fairTradeAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 font-medium">
                  <span className="text-base text-gray-900 dark:text-white">Total</span>
                  <span className="text-base text-gray-900 dark:text-white">${finalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {showTerms && (
            <div className="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Contract Terms</h4>
              <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <p><strong>Delivery Date:</strong> {new Date(mockContract.terms.deliveryDate).toLocaleDateString()}</p>
                <p><strong>Quality Requirements:</strong> {mockContract.terms.qualityRequirements}</p>
                <p><strong>Payment Terms:</strong> Payment will be released automatically when the batch is confirmed received in good condition.</p>
                <p><strong>Fair Trade Bonus:</strong> {fairTradeBonus > 0 ? `10% bonus applied for sustainable farming practices` : 'Not applicable'}</p>
                <p><strong>Dispute Resolution:</strong> Any disputes will be resolved through the platform's arbitration process.</p>
              </div>
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              onClick={handleInitiatePayment}
              disabled={isProcessing}
              className={`px-4 py-2 rounded-md text-white font-medium flex items-center ${
                isProcessing 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
              }`}
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <FiDollarSign className="mr-2" /> Initiate Payment
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SmartContractPayment;