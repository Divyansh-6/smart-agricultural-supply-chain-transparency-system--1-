
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<User | null>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, pass: string): Promise<User | null> => {
    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password: pass }),
      });

      if (!response.ok) {
        // Handle non-2xx responses
        console.error('Login failed:', response.statusText);
        return null;
      }

      const data = await response.json();

      if (data.user) {
        const loggedInUser = {
            id: data.user.id.toString(),
            name: data.user.email, // Backend doesn't provide a name, so we use email
            email: data.user.email,
            role: data.user.role,
        };
        setUser(loggedInUser);
        sessionStorage.setItem('user', JSON.stringify(loggedInUser));
        return loggedInUser;
      }
      return null;
    } catch (error) {
      console.error('An error occurred during login:', error);
      return null;
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
  };
  
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
