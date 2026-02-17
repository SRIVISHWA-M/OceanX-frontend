import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/auth/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/upload" replace /> : <LoginPage />} 
        />
        <Route 
          path="/upload" 
          element={<ProtectedRoute><HomePage /></ProtectedRoute>} 
        />
        <Route 
          path="/search" 
          element={<ProtectedRoute><HomePage /></ProtectedRoute>} 
        />
        <Route 
          path="/collections" 
          element={<ProtectedRoute><HomePage /></ProtectedRoute>} 
        />
        <Route 
          path="/dashboard" 
          element={<ProtectedRoute><HomePage /></ProtectedRoute>} 
        />
        <Route 
          path="/preview/:id" 
          element={<ProtectedRoute><HomePage /></ProtectedRoute>} 
        />
        <Route 
          path="/quiz/:id" 
          element={<ProtectedRoute><HomePage /></ProtectedRoute>} 
        />
        <Route 
          path="/quiz-history" 
          element={<ProtectedRoute><HomePage /></ProtectedRoute>} 
        />
        <Route 
          path="/quiz-history/:id" 
          element={<ProtectedRoute><HomePage /></ProtectedRoute>} 
        />
        <Route path="/" element={<Navigate to="/upload" replace />} />
        
        <Route path="*" element={<Navigate to="/upload" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
