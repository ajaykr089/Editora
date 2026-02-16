// ToastManager - Main orchestrator for the toast notification system
import { ToastInstance, ToastOptions, ToastConfig, ToastManager as IToastManager, ToastPromiseOptions, ToastPlugin } from './types';
import { ToastStore } from './ToastStore';
import { ToastQueue } from './ToastQueue';
import { ToastRenderer } from './ToastRenderer';
import { ToastLifecycle } from './ToastLifecycle';

const DEFAULT_CONFIG: ToastConfig = {
  position: 'bottom-right',
  duration: 4000,
  maxVisible: 5,
  queueStrategy: 'fifo',
  theme: 'system',
  pauseOnHover: true,
  pauseOnFocus: false,
  pauseOnWindowBlur: false, // Don't pause by default
  swipeDismiss: false,
  swipeDirection: 'any', // Allow any direction by default
  dragDismiss: false,
  rtl: false, // LTR by default
  enableAccessibility: true,
  animation: { type: 'css' } // Default to CSS animations
};

export class ToastManager implements IToastManager {
  private store: ToastStore;
  private queue: ToastQueue;
  private renderer: ToastRenderer;
  private lifecycle: ToastLifecycle;
  private config: ToastConfig;
  private idCounter = 0;
  private pausedToasts = new Set<string>();
  private windowFocusHandler?: () => void;
  private windowBlurHandler?: () => void;

  constructor(config: Partial<ToastConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };

    this.store = new ToastStore(this.config);
    this.queue = new ToastQueue(this.config);
    this.renderer = new ToastRenderer(this.config);
    this.lifecycle = new ToastLifecycle();

    // Setup window focus/blur handling if enabled
    this.setupWindowFocusHandling();
  }

  // Core API
  show(options: ToastOptions): ToastInstance {
    const id = options.id || `toast-${++this.idCounter}`;
    const toast: ToastInstance = {
      id,
      options: { ...this.config, ...options },
      createdAt: Date.now(),
      dismiss: () => this.dismiss(id),
      update: (updates) => this.update(id, updates)
    };

    // Lifecycle: beforeShow
    this.lifecycle.beforeShow(toast).then(async () => {
      // Add to store
      this.store.addToast(toast);

      // Add to queue (which handles visibility)
      this.queue.enqueue(toast);

      // Show the toast
      await this.renderer.showToast(toast);

      // Lifecycle: afterShow
      this.lifecycle.afterShow(toast);
    });

    return toast;
  }

  update(id: string, options: Partial<ToastOptions>): boolean {
    const toast = this.store.getToast(id);
    if (!toast) return false;

    // Lifecycle: beforeUpdate
    this.lifecycle.beforeUpdate(toast, options).then(async () => {
      // Update in store
      this.store.updateToast(id, { options: { ...toast.options, ...options } });

      // Update rendering
      await this.renderer.updateToast(toast, options);

      // Lifecycle: afterUpdate
      this.lifecycle.afterUpdate(toast, options);
    });

    return true;
  }

  dismiss(id: string): boolean {
    const toast = this.store.getToast(id);
    if (!toast) return false;

    // Lifecycle: beforeHide
    this.lifecycle.beforeHide(toast).then(async () => {
      // Remove from queue
      this.queue.dequeue(id);

      // Hide the toast
      await this.renderer.hideToast(toast);

      // Remove from store
      this.store.removeToast(id);

      // Lifecycle: afterHide
      this.lifecycle.afterHide(toast);
    });

    return true;
  }

  clear(): void {
    const toasts = this.store.getAllToasts();
    this.lifecycle.batchHide(toasts).then(() => {
      this.queue.clear();
      this.store.clear();
    });
  }

  // Promise API
  async promise<T>(promise: Promise<T>, options: ToastPromiseOptions<T>): Promise<T> {
    const loadingToast = this.show(this.normalizeOptions(options.loading, 'loading'));

    try {
      const result = await promise;

      // Update to success
      const successOptions = this.normalizeOptions(
        typeof options.success === 'function' ? options.success(result) : options.success,
        'success'
      );
      this.update(loadingToast.id, successOptions);

      options.onSuccess?.(result);
      return result;

    } catch (error) {
      // Update to error
      const errorOptions = this.normalizeOptions(
        typeof options.error === 'function' ? options.error(error) : options.error,
        'error'
      );
      this.update(loadingToast.id, errorOptions);

      options.onError?.(error);
      throw error;
    }
  }

  // Group API
  group(groupId: string, options: ToastOptions): ToastInstance {
    return this.show({ ...options, group: groupId });
  }

  // Plugin API
  use(plugin: ToastPlugin): void {
    this.lifecycle.use(plugin);
  }

  // Configuration
  configure(config: Partial<ToastConfig>): void {
    this.config = { ...this.config, ...config };
    this.store.updateConfig(config);
    this.queue.updateConfig(config);
    // Renderer will use updated config for new toasts
  }

  getConfig(): ToastConfig {
    return { ...this.config };
  }

  // State queries
  getToasts(): ToastInstance[] {
    return this.store.getAllToasts();
  }

  getGroups() {
    return this.store.getAllGroups();
  }

  // Convenience methods for backward compatibility
  info(message: string, duration?: number): ToastInstance {
    return this.show({ message, level: 'info', duration });
  }

  success(message: string, duration?: number): ToastInstance {
    return this.show({ message, level: 'success', duration });
  }

  error(message: string, duration?: number): ToastInstance {
    return this.show({ message, level: 'error', duration });
  }

  warning(message: string, duration?: number): ToastInstance {
    return this.show({ message, level: 'warning', duration });
  }

  loading(message: string, duration?: number): ToastInstance {
    return this.show({ message, level: 'loading', duration });
  }

  // Utility methods
  private normalizeOptions(input: string | ToastOptions, defaultLevel: ToastOptions['level']): ToastOptions {
    if (typeof input === 'string') {
      return { message: input, level: defaultLevel };
    }
    return { ...input, level: input.level || defaultLevel };
  }

  // Editor integration (for RTE)
  onEditorEvent(event: string, callback: (toast: ToastInstance, ...args: any[]) => void): void {
    this.lifecycle.onEditorEvent(event, callback);
  }

  triggerEditorEvent(event: string, toast: ToastInstance, ...args: any[]): void {
    this.lifecycle.triggerEditorEvent(event, toast, ...args);
  }

  // Window focus/blur handling
  private setupWindowFocusHandling(): void {
    if (typeof window === 'undefined' || !this.config.pauseOnWindowBlur) return;

    this.windowBlurHandler = () => this.pauseAllToasts();
    this.windowFocusHandler = () => this.resumeAllToasts();

    window.addEventListener('blur', this.windowBlurHandler);
    window.addEventListener('focus', this.windowFocusHandler);

    // Also handle visibility change for better cross-browser support
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAllToasts();
      } else {
        this.resumeAllToasts();
      }
    });
  }

  private pauseAllToasts(): void {
    const toasts = this.store.getAllToasts();
    toasts.forEach(toast => {
      if (toast.timeoutId && !this.pausedToasts.has(toast.id)) {
        clearTimeout(toast.timeoutId);
        toast.timeoutId = undefined;
        this.pausedToasts.add(toast.id);
      }
    });
  }

  private resumeAllToasts(): void {
    const toasts = this.store.getAllToasts();
    toasts.forEach(toast => {
      if (this.pausedToasts.has(toast.id) && !toast.options.persistent && toast.options.duration !== 0) {
        const remainingTime = toast.options.duration || this.config.duration;
        toast.timeoutId = window.setTimeout(() => {
          this.dismiss(toast.id);
        }, remainingTime);
        this.pausedToasts.delete(toast.id);
      }
    });
  }

  // Cleanup
  destroy(): void {
    // Remove window event listeners
    if (this.windowBlurHandler && typeof window !== 'undefined') {
      window.removeEventListener('blur', this.windowBlurHandler);
    }
    if (this.windowFocusHandler && typeof window !== 'undefined') {
      window.removeEventListener('focus', this.windowFocusHandler);
    }

    this.clear();
    this.renderer.destroy();
    this.lifecycle.destroy();
  }
}