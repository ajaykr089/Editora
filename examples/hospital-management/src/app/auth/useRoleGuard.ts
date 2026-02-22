import { Role } from '@/shared/types/domain';
import { useAuth } from '@/app/auth/useAuth';

export function useRoleGuard(roles?: Role[]) {
  const auth = useAuth();
  return {
    canAccess: auth.hasRole(roles),
    role: auth.user?.role,
    isAuthenticated: !!auth.user
  };
}
