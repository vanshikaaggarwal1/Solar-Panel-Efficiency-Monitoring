import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div class="min-h-screen flex items-center justify-center bg-navy-950 text-skyAccent-400">
        <div class="flex flex-col items-center gap-3">
          <div class="w-12 h-12 border-4 border-skyAccent-400 border-t-transparent rounded-full animate-spin"></div>
          <p class="font-medium text-sm text-slate-300">Authenticating Solar Gateway...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
