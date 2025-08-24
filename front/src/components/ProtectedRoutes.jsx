import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoutes({ allowedRoles }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/home" replace />;
  }


  return <Outlet />;
}

export default ProtectedRoutes;
