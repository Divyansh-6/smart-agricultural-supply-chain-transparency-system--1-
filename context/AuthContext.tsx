
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { User, Role } from '../types';
import { MOCK_USERS, login as apiLogin } from '../services/mockApi';

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
    // Check for a logged-in user in session storage on initial load
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, pass: string): Promise<User | null> => {
    const loggedInUser = await apiLogin(email, pass);
    if (loggedInUser) {
      setUser(loggedInUser);
      sessionStorage.setItem('user', JSON.stringify(loggedInUser));
    }
    return loggedInUser;
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
