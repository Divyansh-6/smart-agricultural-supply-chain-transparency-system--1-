
import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';

const RegistrationPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('FARMER');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      if (response.ok) {
        navigate('/verify-otp', { state: { email } });
      } else {
        const data = await response.json();
        setError(data.error || 'An error occurred during registration.');
      }
    } catch (err) {
      setError('An error occurred during registration.');
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
                Create an Account
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Join AgriChain Today
            </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
          </div>
          <div>
            <label htmlFor="password-sr" className="sr-only">
              Password
            </label>
            <input
              id="password-sr"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
          <div>
            <label htmlFor="role" className="sr-only">
              Role
            </label>
            <select
                id="role"
                name="role"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
            >
                <option value="FARMER">Farmer</option>
                <option value="DISTRIBUTOR">Distributor</option>
                <option value="CONSUMER">Consumer</option>
            </select>
            </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400 dark:disabled:bg-gray-600"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
