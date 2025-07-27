// components/ProtectedRoute.tsx
import React from "react";
import { Navigate, useLocation } from "react-router";
import { authUtils } from "../utils/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = authUtils.isAuthenticated();

  if (!isAuthenticated || authUtils.isTokenExpired()) {
    // Clear any stale auth data
    authUtils.clearAuth();

    // Redirect to login with the current location for redirect after login
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
export default ProtectedRoute;
