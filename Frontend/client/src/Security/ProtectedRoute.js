import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";

const ProtectedRoute = ({ roles, children }) => {
  const { token, role, loading } = useAuth();

  const normalizedRole = role?.toLowerCase();
  const allowedRoles = roles?.map((r) => r.toLowerCase()) || [];

  console.log("ProtectedRoute loading:", loading);
  console.log("token:", token);
  console.log("role:", normalizedRole);
  console.log("required roles:", allowedRoles);

  if (loading) return null;

  if (!token || !allowedRoles.includes(normalizedRole)) {
    console.log("❌ Redirecting to /");
    return <Navigate to="/" />;
  }

  console.log("✅ Access granted");
  return children;
};

export default ProtectedRoute;
