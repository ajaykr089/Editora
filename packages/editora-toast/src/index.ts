// Advanced Toast Notification System
// Backward compatible with the original API

import { ToastManager } from './core/ToastManager';
import { ToastOptions, ToastInstance, ToastConfig, ToastPlugin, ToastPromiseOptions, ToastTheme, ToastPosition } from './core/types';

// Legacy types for backward compatibility
export type ToastLevel = 'info' | 'success' | 'error' | 'warning' | 'loading';

// Create the global toast manager instance
const manager = new ToastManager();

// Legacy API - maintains exact same interface
// Legacy options should be compatible with the advanced ToastOptions shape
export interface ToastOptionsLegacy extends ToastOptions {
  message: string;
}

function showLegacy(options: ToastOptions) {
  if (typeof document === 'undefined') return { dismiss: () => {} };
  return manager.show(options);
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
  show: (options: ToastOptions) => manager.show(options),
  update: (id: string, options: Partial<ToastOptions>) => manager.update(id, options),
  dismiss: (id: string) => manager.dismiss(id),
  clear: () => manager.clear(),

  // Convenience methods
  info: (message: string, options?: Partial<ToastOptions>) =>
    manager.show({ message, level: 'info', ...options }),
  success: (message: string, options?: Partial<ToastOptions>) =>
    manager.show({ message, level: 'success', ...options }),
  error: (message: string, options?: Partial<ToastOptions>) =>
    manager.show({ message, level: 'error', ...options }),
  warning: (message: string, options?: Partial<ToastOptions>) =>
    manager.show({ message, level: 'warning', ...options }),
  loading: (message: string, options?: Partial<ToastOptions>) =>
    manager.show({ message, level: 'loading', ...options }),

  // Advanced features
  promise: <T>(promise: Promise<T>, options: ToastPromiseOptions<T>) =>
    manager.promise(promise, options),
  group: (id: string, options: ToastOptions) => manager.group(id, options),
  configure: (config: Partial<ToastConfig>) => manager.configure(config),
  use: (plugin: ToastPlugin) => manager.use(plugin),

  // State queries
  getToasts: () => manager.getToasts(),
  getGroups: () => manager.getGroups(),
  getConfig: () => manager.getConfig(),

  // Editor integration
  onEditorEvent: (event: string, callback: (toast: ToastInstance, ...args: any[]) => void) => manager.onEditorEvent(event, callback),
  triggerEditorEvent: (event: string, toast: ToastInstance, ...args: any[]) => manager.triggerEditorEvent(event, toast, ...args),

  // Cleanup
  destroy: () => manager.destroy()
};

// Re-export for convenience
export { toastAdvanced as toastPro };

// Browser global exports for direct script usage
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  (window as any).toast = toast;
  (window as any).toastAdvanced = toastAdvanced;
  (window as any).toastPro = toastAdvanced;
  (window as any).ToastManager = ToastManager;

  // Dispatch event to notify that toast library is ready
  window.dispatchEvent(new CustomEvent('toastReady', {
    detail: { toast, toastAdvanced, toastPro: toastAdvanced, ToastManager }
  }));
}
