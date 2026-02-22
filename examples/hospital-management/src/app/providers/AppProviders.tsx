import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AlertDialogProvider, ThemeProvider } from '@editora/ui-react';
import { AuthProvider } from '@/app/auth/AuthContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 20_000,
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        tokens={{
          colors: {
            primary: '#1d4ed8',
            background: '#f5f8fc',
            text: '#0f172a'
          },
          radius: '12px'
        }}
      >
        <AuthProvider>
          <AlertDialogProvider>{children}</AlertDialogProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default AppProviders;
