import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QrScannerProps {
  onResult: (result: string | null) => void;
}

const QrScannerComponent: React.FC<QrScannerProps> = ({ onResult }) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Add a small delay to ensure DOM is ready
    const initTimeout = setTimeout(() => {
      if (containerRef.current) {
        const scannerId = "html5-qr-scanner";
        
        // Create scanner container if it doesn't exist
        let scannerContainer = document.getElementById(scannerId);
        if (!scannerContainer) {
          scannerContainer = document.createElement("div");
          scannerContainer.id = scannerId;
          scannerContainer.style.width = "100%";
          scannerContainer.style.minHeight = "300px";
          containerRef.current.appendChild(scannerContainer);
        }
        
        try {
          // Initialize scanner
          scannerRef.current = new Html5Qrcode(scannerId);
          
          // Start scanning with camera
          scannerRef.current.start(
            { facingMode: "environment" },
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
              aspectRatio: 1.0,
            },
            (decodedText) => {
              onResult(decodedText);
            },
            (errorMessage) => {
              // Ignore common errors
              if (!errorMessage.includes("No QR code found")) {
                console.error("QR Scanner Error:", errorMessage);
              }
            }
          ).catch(err => {
            console.error("Failed to start scanner:", err);
            setError("Failed to access camera. Please ensure camera permissions are granted.");
          });
        } catch (err) {
          console.error("Error initializing scanner:", err);
          setError("Failed to initialize QR scanner. Please try again.");
        }
      }
    }, 500);
    
    // Cleanup
    return () => {
      clearTimeout(initTimeout);
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(err => {
          console.error("Failed to stop scanner:", err);
        });
      }
    };
  }, [onResult]);

  return (
    <div className="flex flex-col items-center">
      <div 
        ref={containerRef}
        className="w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 min-h-[300px] relative"
      />
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
        Position a QR code in the scanner view to scan it
      </p>
    </div>
  );
};

export default QrScannerComponent;