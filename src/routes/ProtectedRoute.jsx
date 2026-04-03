// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import { useSelector } from "react-redux";

// /**
//  * Returns the correct dashboard path for a given role.
//  */
// export function getDashboardByRole(role) {
//   switch (role) {
//     case "brand":
//       return "/brand/dashboard";
//     case "influencer":
//       return "/influencer/dashboard";
//     case "admin":
//       return "/admin/dashboard";
//     default:
//       return "/login";
//   }
// }

// /**
//  * ProtectedRoute — guards dashboard routes.
//  *
//  * @param {string[]} allowedRoles — if provided, only users with these roles can access.
//  *   If the user's role isn't in the list, they are redirected to their own dashboard.
//  */
// export default function ProtectedRoute({ allowedRoles }) {
//   const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

//   // 1. Show spinner while auth is being verified (prevents login flash on refresh)
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
//           <p className="text-sm text-gray-500">Verifying session...</p>
//         </div>
//       </div>
//     );
//   }

//   // 2. Not authenticated → go to login
//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   // 3. Role guard — if allowedRoles specified, check user's role
//   if (allowedRoles && allowedRoles.length > 0) {
//     const userRole = user?.role;
//     if (!allowedRoles.includes(userRole)) {
//       // Redirect to the user's own dashboard, not the one they tried to access
//       return <Navigate to={getDashboardByRole(userRole)} replace />;
//     }
//   }

//   // 4. All checks passed — render child routes
//   return <Outlet />;
// }

// src/routes/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export function getDashboardByRole(role) {
  switch (role) {
    case "brand":
      return "/brand/dashboard";
    case "influencer":
      return "/influencer/dashboard";
    case "admin":
      return "/admin/dashboard";
    default:
      return "/login";
  }
}

function getSettingsByRole(role) {
  switch (role) {
    case "brand":
      return "/brand/settings";
    case "influencer":
      return "/influencer/settings";
    default:
      return "/login";
  }
}

/**
 * ProtectedRoute
 *
 * Guards:
 *  1. Must be authenticated
 *  2. Must have the correct role (allowedRoles)
 *  3. If requireComplete=true, profile must be complete — else redirect to settings
 */
export default function ProtectedRoute({
  allowedRoles,
  requireComplete = false,
}) {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  const location = useLocation();

  // 1. Show spinner while auth state resolves
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Verifying session…</p>
        </div>
      </div>
    );
  }

  // 2. Not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Role guard
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user?.role)) {
      return <Navigate to={getDashboardByRole(user?.role)} replace />;
    }
  }

  // 4. Profile completion gate
  //    Skip the gate if the user is already ON the settings page (prevents loop)
  const settingsPath = getSettingsByRole(user?.role);
  const isOnSettings = location.pathname === settingsPath;

  if (requireComplete && !user?.profileComplete && !isOnSettings) {
    return <Navigate to={settingsPath} state={{ fromGate: true }} replace />;
  }

  return <Outlet />;
}
