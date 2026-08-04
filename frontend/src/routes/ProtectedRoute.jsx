import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090c] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const rawRole = (user?.role || '').toUpperCase();
    
    // Normalize role aliases
    const normalizedAllowed = allowedRoles.map(r => r.toUpperCase());
    
    let isPermitted = normalizedAllowed.includes(rawRole);

    // Master roles bypass
    if (rawRole === 'ADMIN' || rawRole === 'OWNER' || rawRole === 'SUPER_ADMIN') {
      isPermitted = true;
    }

    // Alias checks
    if (rawRole === 'KITCHEN_STAFF' && normalizedAllowed.includes('KITCHEN')) isPermitted = true;
    if (rawRole === 'KITCHEN' && normalizedAllowed.includes('KITCHEN_STAFF')) isPermitted = true;
    if (rawRole === 'WAITSTAFF' && normalizedAllowed.includes('WAITER')) isPermitted = true;
    if (rawRole === 'WAITER' && normalizedAllowed.includes('WAITSTAFF')) isPermitted = true;

    if (!isPermitted) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
};
