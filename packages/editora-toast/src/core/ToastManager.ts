// ToastManager - Main orchestrator for the toast notification system
import { ToastInstance, ToastOptions, ToastConfig, ToastManager as IToastManager, ToastPromiseOptions, ToastPlugin, ToastState, ToastSubscriber } from './types';
import { ToastStore } from './ToastStore';
import { ToastQueue } from './ToastQueue';
import { ToastRenderer } from './ToastRenderer';
import { ToastLifecycle } from './ToastLifecycle';

const DEFAULT_CONFIG: ToastConfig = {
  position: 'bottom-right',
  duration: 4000,
  maxVisible: 3,
  queueStrategy: 'fifo',
  theme: 'system',
  richColors: false,
  expand: true,
  stack: false,
  offset: 16,
  mobileOffset: 16,
  gap: 8,
  pauseOnHover: true,
  pauseOnFocus: false,
  pauseOnWindowBlur: false, // Don't pause by default
  swipeDismiss: true,
  swipeDirection: 'any', // Allow any direction by default
  dragDismiss: false,
  rtl: false, // LTR by default
  enableAccessibility: true,
  closeButton: false,
  preventDuplicate: false,
  dedupeScope: 'all',
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
  private subscribers = new Set<ToastSubscriber>();
  private windowFocusHandler?: () => void;
  private windowBlurHandler?: () => void;
  private visibilityChangeHandler?: () => void;

  constructor(config: Partial<ToastConfig> = {}) {
    this.config = this.normalizeConfig({ ...DEFAULT_CONFIG, ...config });

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
      options: this.normalizeToastOptions({ ...this.config, ...options }),
      createdAt: Date.now(),
      dismiss: () => this.dismiss(id),
      update: (updates) => this.update(id, updates)
    };

    this.lifecycle.beforeShow(toast).then(async () => {
      const changes = this.queue.enqueue(toast);
      if (changes.rejected) return;

      this.store.addToast(toast);
      await this.hideToasts(changes.hide, true);
      await this.showToasts(changes.show);
      this.notify();
    });

    return toast;
  }

  update(id: string, options: Partial<ToastOptions>): boolean {
    const toast = this.store.getToast(id);
    if (!toast) return false;

    // Lifecycle: beforeUpdate
    this.lifecycle.beforeUpdate(toast, options).then(async () => {
      const normalizedUpdates = this.normalizeToastOptions({ ...toast.options, ...options });
      this.store.updateToast(id, { options: normalizedUpdates });

      if (this.queue.isVisible(id)) {
        await this.renderer.updateToast(toast, options);
      }

      this.lifecycle.afterUpdate(toast, options);
      this.notify();
    });

    return true;
  }

  dismiss(id: string): boolean {
    const toast = this.store.getToast(id);
    if (!toast) return false;

    this.lifecycle.beforeHide(toast).then(async () => {
      const wasVisible = this.queue.isVisible(id);
      const changes = this.queue.dequeue(id);

      if (wasVisible) {
        await this.renderer.hideToast(toast);
      }

      this.store.removeToast(id);
      this.lifecycle.afterHide(toast);
      await this.showToasts(changes.show);
      this.notify();
    });

    return true;
  }

  clear(): void {
    const toasts = this.queue.clear();
    Promise.all(toasts.map(toast => this.hideOne(toast, false))).then(() => {
      this.store.clear();
      this.notify();
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
      if (successOptions.duration === undefined && !successOptions.persistent) {
        successOptions.duration = this.config.duration;
      }
      this.update(loadingToast.id, successOptions);

      options.onSuccess?.(result);
      return result;

    } catch (error) {
      // Update to error
      const errorOptions = this.normalizeOptions(
        typeof options.error === 'function' ? options.error(error) : options.error,
        'error'
      );
      if (errorOptions.duration === undefined && !errorOptions.persistent) {
        errorOptions.duration = this.config.duration;
      }
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
    const hadPauseOnWindowBlur = this.config.pauseOnWindowBlur;
    this.config = this.normalizeConfig({ ...this.config, ...config });
    this.store.updateConfig(this.config);
    this.renderer.updateConfig(this.config);
    const changes = this.queue.updateConfig(this.config);
    this.hideToasts(changes.hide, true).then(() => this.showToasts(changes.show)).then(() => this.notify());
    if (config.pauseOnWindowBlur !== undefined && config.pauseOnWindowBlur !== hadPauseOnWindowBlur) {
      this.teardownWindowFocusHandling();
      this.setupWindowFocusHandling();
    }
  }

  getConfig(): ToastConfig {
    return { ...this.config };
  }

  // State queries
  getToasts(): ToastInstance[] {
    return this.store.getAllToasts();
  }

  getState(): ToastState {
    return {
      toasts: this.store.getAllToasts(),
      visible: this.queue.getVisible(),
      queued: this.queue.getQueued(),
      groups: this.store.getAllGroups(),
      config: this.getConfig()
    };
  }

  subscribe(listener: ToastSubscriber): () => void {
    this.subscribers.add(listener);
    listener(this.getState());
    return () => {
      this.subscribers.delete(listener);
    };
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

  private normalizeConfig(config: ToastConfig): ToastConfig {
    const maxVisible = config.visibleToasts || config.maxVisible || DEFAULT_CONFIG.maxVisible;
    return {
      ...config,
      maxVisible,
      visibleToasts: maxVisible
    };
  }

  private normalizeToastOptions(options: ToastOptions): ToastOptions {
    const closable = options.closeButton ?? options.closable ?? this.config.closeButton;
    const action = options.action ? { ...options.action, primary: options.action.primary ?? true } : undefined;
    const actions = [
      ...(action ? [action] : []),
      ...(options.cancel ? [options.cancel] : []),
      ...(options.actions || [])
    ];

    return {
      ...options,
      closable,
      actions: actions.length > 0 ? actions : undefined,
      ariaLive: options.ariaLive || (options.level === 'error' || options.important ? 'assertive' : 'polite'),
      role: options.role || (options.level === 'error' || options.important ? 'alert' : 'status'),
      preventDuplicate: options.preventDuplicate ?? this.config.preventDuplicate,
      dedupeScope: options.dedupeScope || this.config.dedupeScope
    };
  }

  private async showToasts(toasts: ToastInstance[]): Promise<void> {
    for (const toast of toasts) {
      await this.renderer.showToast(toast);
      await this.lifecycle.afterShow(toast);
    }
  }

  private async hideToasts(toasts: ToastInstance[], removeFromStore: boolean): Promise<void> {
    for (const toast of toasts) {
      await this.hideOne(toast, removeFromStore);
    }
  }

  private async hideOne(toast: ToastInstance, removeFromStore: boolean): Promise<void> {
    await this.lifecycle.beforeHide(toast);
    await this.renderer.hideToast(toast);
    if (removeFromStore) {
      this.store.removeToast(toast.id);
    }
    await this.lifecycle.afterHide(toast);
  }

  private notify(): void {
    if (this.subscribers.size === 0) return;
    const state = this.getState();
    this.subscribers.forEach(listener => listener(state));
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
    if (typeof window === 'undefined' || typeof document === 'undefined' || !this.config.pauseOnWindowBlur) return;

    // Avoid duplicate listeners when configuration changes.
    this.teardownWindowFocusHandling();

    this.windowBlurHandler = () => this.pauseAllToasts();
    this.windowFocusHandler = () => this.resumeAllToasts();
    this.visibilityChangeHandler = () => {
      if (document.hidden) {
        this.pauseAllToasts();
      } else {
        this.resumeAllToasts();
      }
    };

    window.addEventListener('blur', this.windowBlurHandler);
    window.addEventListener('focus', this.windowFocusHandler);
    document.addEventListener('visibilitychange', this.visibilityChangeHandler);
  }

  private teardownWindowFocusHandling(): void {
    if (typeof window === 'undefined') return;
    if (this.windowBlurHandler) {
      window.removeEventListener('blur', this.windowBlurHandler);
      this.windowBlurHandler = undefined;
    }
    if (this.windowFocusHandler) {
      window.removeEventListener('focus', this.windowFocusHandler);
      this.windowFocusHandler = undefined;
    }
    if (typeof document !== 'undefined' && this.visibilityChangeHandler) {
      document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
      this.visibilityChangeHandler = undefined;
    }
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
    this.teardownWindowFocusHandling();

    this.clear();
    this.renderer.destroy();
    this.lifecycle.destroy();
  }
}
