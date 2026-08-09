import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, type UserRole } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, openAuthModal } = useAuth();

  useEffect(() => {
    if (!user) {
      openAuthModal();
    }
  }, [user, openAuthModal]);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If role requirement specified and user role doesn't match
  if (requiredRole && user.role !== requiredRole) {
    if (requiredRole === 'collector') {
      return <Navigate to="/collector/register" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
