import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getDashboardByRole } from './ProtectedRoute';

/**
 * PublicRoute — wraps auth pages (login, register, etc.).
 * If user is already authenticated, redirect them to their role-based dashboard.
 * Prevents logged-in users from accessing login/register pages.
 */
export default function PublicRoute() {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  // While verifying session, show spinner (prevents brief flash of login page)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Already logged in → redirect to their dashboard
  if (isAuthenticated && user) {
    return <Navigate to={getDashboardByRole(user.role)} replace />;
  }

  // Not authenticated → show the auth page
  return <Outlet />;
}
