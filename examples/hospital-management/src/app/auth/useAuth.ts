import { useAuthContext } from '@/app/auth/AuthContext';

export function useAuth() {
  return useAuthContext();
}
