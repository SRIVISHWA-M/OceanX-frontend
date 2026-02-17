import React from 'react';
import { Navigate } from 'react-router-dom';
import IdleTimer from './IdleTimer';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <IdleTimer>{children}</IdleTimer>;
};

export default ProtectedRoute;
