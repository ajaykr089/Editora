import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/app/auth/useAuth';
import { Role } from '@/shared/types/domain';

type RoleGuardProps = {
  children: React.ReactElement;
  allow?: Role[];
};

export function RoleGuard({ children, allow }: RoleGuardProps) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allow && allow.length > 0 && !allow.includes(auth.user.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
}
