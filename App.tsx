
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import OtpVerificationPage from './pages/OtpVerificationPage';
import DashboardPage from './pages/DashboardPage';
import BatchDetailsPage from './pages/BatchDetailsPage';
import ConsumerViewPage from './pages/ConsumerViewPage';
import ScanQrPage from './pages/ScanQrPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import { Role } from './types';
import Layout from './components/Layout';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/verify-otp" element={<OtpVerificationPage />} />
            <Route path="/consumer/:batchId" element={<ConsumerViewPage />} />
            
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={[Role.FARMER, Role.DISTRIBUTOR, Role.CONSUMER]}>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/batch/:batchId" 
                element={
                  <ProtectedRoute allowedRoles={[Role.FARMER, Role.DISTRIBUTOR, Role.CONSUMER]}>
                    <BatchDetailsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/scan" 
                element={
                   <ProtectedRoute allowedRoles={[Role.FARMER, Role.DISTRIBUTOR, Role.CONSUMER]}>
                    <ScanQrPage />
                   </ProtectedRoute>
                } 
              />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
