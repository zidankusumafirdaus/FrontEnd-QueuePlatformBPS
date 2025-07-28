import React from "react";
import { Navigate } from "react-router-dom";
import { isLoggedIn } from "./auth";

const ProtectedRoute = ({ children }) => {
  console.log("Is Logged In:", isLoggedIn());

  if (!isLoggedIn()) {
    return <Navigate to="/login-BukuTamu" replace />;
  }

  return children;
};

export default ProtectedRoute;
