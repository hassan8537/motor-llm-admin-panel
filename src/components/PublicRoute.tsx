// components/PublicRoute.tsx
import React from "react";
import { Navigate } from "react-router";
import { authUtils } from "../utils/auth";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const isAuthenticated = authUtils.isAuthenticated();

  if (isAuthenticated && !authUtils.isTokenExpired()) {
    // If user is already logged in, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
