// Advanced Toast Notification System
// Backward compatible with the original API

import { ToastManager } from './core/ToastManager';
import { ToastOptions, ToastInstance, ToastConfig, ToastPlugin, ToastPromiseOptions, ToastTheme, ToastPosition } from './core/types';

// Legacy types for backward compatibility
export type ToastLevel = 'info' | 'success' | 'error' | 'warning' | 'loading';

let managerInstance: ToastManager | null = null;

function getManager(): ToastManager {
  if (!managerInstance) {
    managerInstance = new ToastManager();
  }
  return managerInstance;
}

// Legacy API - maintains exact same interface
// Legacy options should be compatible with the advanced ToastOptions shape
export interface ToastOptionsLegacy extends ToastOptions {
  message: string;
}

function showLegacy(options: ToastOptions) {
  if (typeof document === 'undefined') return { dismiss: () => {} };
  return getManager().show(options);
}
// Normalize legacy arguments to the new ToastOptions shape.
function normalizeLegacyArgs(
  message: string,
  optionsOrDuration?: Partial<ToastOptions> | number | null,
  theme?: ToastTheme,
  position?: ToastPosition
): 
ToastOptions {
  const defaults = { position: 'top-right' as ToastPosition, theme: 'light' as ToastTheme };

  let opts: Partial<ToastOptions> = {};

  if (optionsOrDuration && typeof optionsOrDuration === 'object') {
    opts = { ...(optionsOrDuration as Partial<ToastOptions>) };
  } else if (typeof optionsOrDuration === 'number') {
    opts.duration = optionsOrDuration;
  }

  if (theme) opts.theme = theme;
  if (position) opts.position = position;

  return {
    message,
    ...opts,
    duration: opts.duration,
    level: (opts.level || undefined) as any,
    position: (opts.position as ToastPosition) || defaults.position,
    theme: (opts.theme as ToastTheme) || defaults.theme
  } as ToastOptions;
}

// Legacy exports
export const toast = {
  info: (msg: string, optionsOrDuration?: Partial<ToastOptions> | number, theme?: ToastTheme, position?: ToastPosition) =>
    showLegacy({ ...normalizeLegacyArgs(msg, optionsOrDuration, theme, position), level: 'info' }),
  success: (msg: string, optionsOrDuration?: Partial<ToastOptions> | number, theme?: ToastTheme, position?: ToastPosition) =>
    showLegacy({ ...normalizeLegacyArgs(msg, optionsOrDuration, theme, position), level: 'success' }),
  error: (msg: string, optionsOrDuration?: Partial<ToastOptions> | number, theme?: ToastTheme, position?: ToastPosition) =>
    showLegacy({ ...normalizeLegacyArgs(msg, optionsOrDuration, theme, position), level: 'error' }),
  warning: (msg: string, optionsOrDuration?: Partial<ToastOptions> | number, theme?: ToastTheme, position?: ToastPosition) =>
    showLegacy({ ...normalizeLegacyArgs(msg, optionsOrDuration, theme, position), level: 'warning' }),
  loading: (msg: string, optionsOrDuration?: Partial<ToastOptions> | number, theme?: ToastTheme, position?: ToastPosition) =>
    showLegacy({ ...normalizeLegacyArgs(msg, optionsOrDuration, theme, position), level: 'loading' })
};

export default toast;

// Advanced API exports
export { ToastManager } from './core/ToastManager';
export type {
  ToastLevel as ToastLevelAdvanced,
  ToastPosition,
  ToastTheme,
  ToastAction,
  ToastProgress,
  ToastContent,
  ToastOptions as ToastOptionsAdvanced,
  ToastInstance,
  ToastConfig,
  ToastPlugin,
  ToastPromiseOptions,
  // New animation types
  SpringConfig,
  AnimationType,
  AnimationConfig,
  SpringAnimation,
  BounceAnimation,
  SlideAnimation,
  ZoomAnimation,
  FlipAnimation,
  FadeAnimation,
  ElasticAnimation,
  RotateAnimation,
  CustomAnimation
} from './core/types';

// Advanced toast instance with enhanced features
export const toastAdvanced = {
  // Core methods
  show: (options: ToastOptions) => getManager().show(options),
  update: (id: string, options: Partial<ToastOptions>) => getManager().update(id, options),
  dismiss: (id: string) => getManager().dismiss(id),
  clear: () => getManager().clear(),

  // Convenience methods
  info: (message: string, options?: Partial<ToastOptions>) =>
    getManager().show({ message, level: 'info', ...options }),
  success: (message: string, options?: Partial<ToastOptions>) =>
    getManager().show({ message, level: 'success', ...options }),
  error: (message: string, options?: Partial<ToastOptions>) =>
    getManager().show({ message, level: 'error', ...options }),
  warning: (message: string, options?: Partial<ToastOptions>) =>
    getManager().show({ message, level: 'warning', ...options }),
  loading: (message: string, options?: Partial<ToastOptions>) =>
    getManager().show({ message, level: 'loading', ...options }),

  // Advanced features
  promise: <T>(promise: Promise<T>, options: ToastPromiseOptions<T>) =>
    getManager().promise(promise, options),
  group: (id: string, options: ToastOptions) => getManager().group(id, options),
  configure: (config: Partial<ToastConfig>) => getManager().configure(config),
  use: (plugin: ToastPlugin) => getManager().use(plugin),

  // State queries
  getToasts: () => getManager().getToasts(),
  getGroups: () => getManager().getGroups(),
  getConfig: () => getManager().getConfig(),

  // Editor integration
  onEditorEvent: (event: string, callback: (toast: ToastInstance, ...args: any[]) => void) => getManager().onEditorEvent(event, callback),
  triggerEditorEvent: (event: string, toast: ToastInstance, ...args: any[]) => getManager().triggerEditorEvent(event, toast, ...args),

  // Cleanup
  destroy: () => {
    if (!managerInstance) return;
    managerInstance.destroy();
    managerInstance = null;
  }
};

// Re-export for convenience
export { toastAdvanced as toastPro };

// Browser global exports for direct script usage
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const globalWindow = window as Window & { __editoraToastReady?: boolean; toast?: unknown; toastAdvanced?: unknown; toastPro?: unknown; ToastManager?: unknown };
  globalWindow.toast = toast;
  globalWindow.toastAdvanced = toastAdvanced;
  globalWindow.toastPro = toastAdvanced;
  globalWindow.ToastManager = ToastManager;

  // Dispatch once per page to avoid duplicate "ready" signals when bundled multiple times.
  if (!globalWindow.__editoraToastReady) {
    globalWindow.__editoraToastReady = true;
    window.dispatchEvent(new CustomEvent('toastReady', {
      detail: { toast, toastAdvanced, toastPro: toastAdvanced, ToastManager }
    }));
  }
}
