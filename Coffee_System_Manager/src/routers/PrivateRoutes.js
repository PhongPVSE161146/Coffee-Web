import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = ({ requiredRole }) => {
  const storedRole = sessionStorage.getItem("selectedRole");

  if (storedRole === null || requiredRole !== storedRole) {
    return <Navigate to="/unauthorized" />;
  }
  return <Outlet />;
};

export default PrivateRoutes;
