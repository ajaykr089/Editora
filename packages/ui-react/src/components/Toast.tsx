import React, { useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';
import { toastAdvanced } from '@editora/toast';
import type { ToastConfig, ToastInstance, ToastOptionsAdvanced, ToastPosition, ToastTheme } from '@editora/toast';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type ToastShowDetail = { id: string | number; message: string };
export type ToastHideDetail = { id: string | number };

export type ToastShowOptions = Partial<Omit<ToastOptionsAdvanced, 'message'>> & {
  type?: string;
};

export type ToastElement = {
  show: (message: string, options?: ToastShowOptions) => string | number;
  hide: (id: string | number) => void;
  clear: () => void;
  configure: (config: Partial<ToastConfig>) => void;
};

export type ToastProps = React.HTMLAttributes<HTMLDivElement> & {
  position?: ToastPosition;
  maxVisible?: number;
  theme?: ToastTheme;
  config?: Partial<ToastConfig>;
  headless?: boolean;
  onShow?: (detail: ToastShowDetail) => void;
  onHide?: (detail: ToastHideDetail) => void;
};

function normalizeShowOptions(options: ToastShowOptions | undefined): Partial<Omit<ToastOptionsAdvanced, 'message'>> {
  if (!options) return {};
  const normalized = { ...options } as Record<string, unknown>;

  if (normalized.type != null && normalized.level == null) {
    normalized.level = normalized.type;
  }

  delete normalized.type;
  return normalized as Partial<Omit<ToastOptionsAdvanced, 'message'>>;
}

export const Toast = React.forwardRef<ToastElement, ToastProps>(function Toast(
  { children, position, maxVisible, theme, config, headless: _headless, onShow, onHide, ...rest },
  forwardedRef
) {
  const onShowRef = useRef<typeof onShow>(onShow);
  const onHideRef = useRef<typeof onHide>(onHide);

  useEffect(() => {
    onShowRef.current = onShow;
  }, [onShow]);

  useEffect(() => {
    onHideRef.current = onHide;
  }, [onHide]);

  useImperativeHandle(
    forwardedRef,
    () => ({
      show(message: string, options?: ToastShowOptions) {
        let toastId: string | number = '';
        const normalized = normalizeShowOptions(options);
        const userOnShow = normalized.onShow;
        const userOnHide = normalized.onHide;

        const instance = toastAdvanced.show({
          message,
          ...normalized,
          onShow: () => {
            userOnShow?.();
            onShowRef.current?.({ id: toastId, message });
          },
          onHide: () => {
            userOnHide?.();
            onHideRef.current?.({ id: toastId });
          }
        } as ToastOptionsAdvanced);

        toastId = (instance as ToastInstance).id;
        return toastId;
      },
      hide(id: string | number) {
        toastAdvanced.dismiss(String(id));
      },
      clear() {
        toastAdvanced.clear();
      },
      configure(next: Partial<ToastConfig>) {
        toastAdvanced.configure(next);
      }
    }),
    []
  );

  useIsomorphicLayoutEffect(() => {
    const nextConfig: Partial<ToastConfig> = {
      ...(config || {})
    };

    if (position) nextConfig.position = position;
    if (theme) nextConfig.theme = theme;
    if (typeof maxVisible === 'number' && Number.isFinite(maxVisible)) {
      nextConfig.maxVisible = Math.max(1, Math.trunc(maxVisible));
    }

    if (Object.keys(nextConfig).length > 0) {
      toastAdvanced.configure(nextConfig);
    }
  }, [position, maxVisible, theme, config]);

  if (children == null && Object.keys(rest).length === 0) return null;
  return React.createElement('div', { ...rest }, children);
});

Toast.displayName = 'Toast';

export default Toast;
