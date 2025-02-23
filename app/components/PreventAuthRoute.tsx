// src/components/PrivateRoute.tsx
import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "~/provider/AuthProvider";

const PreventAuthRoute: React.FC<{
  children: React.ReactNode;
  roles?: string[];
}> = ({ children, roles = [] }) => {
  const { user } = useAuth();

  // If user is authenticated, redirect to the dashboard or home page
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  // Otherwise, allow access to the auth route
  return <>{children}</>;
};

export default PreventAuthRoute;
