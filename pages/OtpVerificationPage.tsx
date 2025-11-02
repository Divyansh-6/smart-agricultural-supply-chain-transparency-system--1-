
import React, { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Leaf } from 'lucide-react';

const OtpVerificationPage: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:3001/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      if (response.ok) {
        navigate('/login');
      } else {
        const data = await response.json();
        setError(data.error || 'An error occurred during OTP verification.');
      }
    } catch (err) {
      setError('An error occurred during OTP verification.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
        <div className="text-center">
            <Leaf className="mx-auto w-12 h-12 text-primary" />
            <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
                Verify Your Email
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Enter the OTP sent to {email}
            </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="otp" className="sr-only">
              OTP
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder="Enter OTP"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400 dark:disabled:bg-gray-600"
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpVerificationPage;
