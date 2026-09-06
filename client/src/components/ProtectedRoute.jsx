import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles, allowedAccountTypes }) => {
  const { user, isAuthenticated, loading, hasRole, isAccountType } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212] text-forest-500">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-forest-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-medium text-xs text-slate-300">Authenticating Solarix Gateway...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedAccountTypes && allowedAccountTypes.length > 0) {
    if (!isAccountType(allowedAccountTypes)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (user?.accountType !== 'personal' && !hasRole(allowedRoles)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
