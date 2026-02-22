import React from 'react';
import { mockApi } from '@/shared/api/mockApi';
import { AuthUser, Role } from '@/shared/types/domain';

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
};

type AuthContextValue = AuthState & {
  login: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  hasRole: (roles?: Role[]) => boolean;
};

const STORAGE_KEY = 'editora.hospital.session';

const AuthContext = React.createContext<AuthContextValue | null>(null);

function readSession(): { user: AuthUser; token: string } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeSession(payload: { user: AuthUser; token: string } | null): void {
  if (typeof window === 'undefined') return;
  if (!payload) {
    window.sessionStorage.removeItem(STORAGE_KEY);
    return;
  }
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AuthState>(() => {
    const session = readSession();
    return {
      user: session?.user ?? null,
      token: session?.token ?? null,
      loading: false
    };
  });

  const login = React.useCallback(async (payload: { email: string; password: string }) => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const result = await mockApi.login(payload);
      writeSession(result);
      setState({ user: result.user, token: result.token, loading: false });
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false }));
      throw error;
    }
  }, []);

  const logout = React.useCallback(() => {
    writeSession(null);
    setState({ user: null, token: null, loading: false });
  }, []);

  const hasRole = React.useCallback(
    (roles?: Role[]) => {
      if (!roles || roles.length === 0) return !!state.user;
      if (!state.user) return false;
      return roles.includes(state.user.role);
    },
    [state.user]
  );

  const value = React.useMemo<AuthContextValue>(
    () => ({ ...state, login, logout, hasRole }),
    [state, login, logout, hasRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used inside <AuthProvider>.');
  return context;
}
