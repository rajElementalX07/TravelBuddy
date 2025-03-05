import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.user);

  

  return !token ? (
    <Navigate to="/auth/user-login" />
  ) : (
    <>{children}</>
  );
};

export default ProtectedRoute;
