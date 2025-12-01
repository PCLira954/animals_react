// frontend/src/components/PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useAuth();
  
  console.log('PrivateRoute state:', state); // Adicione este log para depuração

  if (!state?.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;