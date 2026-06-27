// frontend/src/components/ProtectedRoute.jsx
// Purpose: Guards routes — redirects unauthenticated users and wrong roles
// Dependencies: react-router-dom, AuthContext
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import PageSpinner from '@/components/ui/PageSpinner';

/**
 * @param {string[]} roles  - allowed roles; if omitted any authenticated user passes
 * @param {ReactNode} children - optional; if provided renders children, else <Outlet />
 */
export default function ProtectedRoute({ roles, children }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <PageSpinner />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (roles && roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? children : <Outlet />;
}
