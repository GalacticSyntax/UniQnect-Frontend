// src/components/PrivateRoute.tsx
import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "~/provider/AuthProvider";

const PrivateRoute: React.FC<{
  children: React.ReactNode;
  roles?: string[];
}> = ({ children, roles = [] }) => {
  const { user, hasPermission } = useAuth();

  console.log(user);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles.length > 0 && !hasPermission(roles)) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
