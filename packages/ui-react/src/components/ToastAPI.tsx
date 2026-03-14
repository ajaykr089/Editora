import React, { createContext, useContext, useEffect, useMemo } from 'react';
import toastLegacy, { toastAdvanced, toastPro } from '@editora/toast';
import type { ToastConfig, ToastOptionsAdvanced } from '@editora/toast';

export type ToastOptions = Partial<Omit<ToastOptionsAdvanced, 'message'>> & {
  type?: string;
};

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

function normalizeOptions(options?: ToastOptions): Partial<Omit<ToastOptionsAdvanced, 'message'>> {
  if (!options) return {};
  const normalized = { ...options } as Record<string, unknown>;

  if (normalized.type != null && normalized.level == null) {
    normalized.level = normalized.type;
  }

  delete normalized.type;
  return normalized as Partial<Omit<ToastOptionsAdvanced, 'message'>>;
}

export function toast(message: string, options: ToastOptions = {}) {
  return toastAdvanced.show({
    message,
    level: 'info',
    ...normalizeOptions(options)
  });
}

export const toastApi = {
  show(message: string, options: ToastOptions = {}) {
    return toastAdvanced.show({ message, ...normalizeOptions(options) });
  },
  success(message: string, options: ToastOptions = {}) {
    return toastAdvanced.success(message, normalizeOptions(options));
  },
  error(message: string, options: ToastOptions = {}) {
    return toastAdvanced.error(message, normalizeOptions(options));
  },
  warning(message: string, options: ToastOptions = {}) {
    return toastAdvanced.warning(message, normalizeOptions(options));
  },
  info(message: string, options: ToastOptions = {}) {
    return toastAdvanced.info(message, normalizeOptions(options));
  },
  loading(message: string, options: ToastOptions = {}) {
    return toastAdvanced.loading(message, normalizeOptions(options));
  },
  dismiss(id: string | number) {
    return toastAdvanced.dismiss(String(id));
  },
  clear() {
    return toastAdvanced.clear();
  },
  configure(config: Partial<ToastConfig>) {
    return toastAdvanced.configure(config);
  }
};

type ToastAPIProps = {
  config?: Partial<ToastConfig>;
};

export type ToastContextValue = typeof toastApi;

const ToastContext = createContext<ToastContextValue | null>(null);

export type ToastProviderProps = {
  children: React.ReactNode;
  config?: Partial<ToastConfig>;
};

export function ToastAPI({ config }: ToastAPIProps = {}) {
  useEffect(() => {
    if (!config) return;
    toastAdvanced.configure(config);
  }, [config]);

  return null;
}

export function ToastProvider({ children, config }: ToastProviderProps) {
  useEffect(() => {
    if (!config) return;
    toastAdvanced.configure(config);
  }, [config]);

  const value = useMemo(() => toastApi, []);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    return toastApi;
  }
  return context;
}

export { toastAdvanced, toastPro, toastLegacy };

export default ToastAPI;
