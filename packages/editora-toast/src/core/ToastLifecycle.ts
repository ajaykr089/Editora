// ToastLifecycle - Manages toast lifecycle events and hooks
import { ToastInstance, ToastPlugin } from './types';

type HookCallback = (toast: ToastInstance, ...args: any[]) => void | Promise<void>;

export class ToastLifecycle {
  private plugins: ToastPlugin[] = [];
  private hooks = {
    beforeShow: [] as HookCallback[],
    afterShow: [] as HookCallback[],
    beforeHide: [] as HookCallback[],
    afterHide: [] as HookCallback[],
    beforeUpdate: [] as HookCallback[],
    afterUpdate: [] as HookCallback[]
  };

  // Plugin management
  use(plugin: ToastPlugin): void {
    if (this.plugins.find(p => p.name === plugin.name)) {
      console.warn(`Plugin "${plugin.name}" is already installed`);
      return;
    }

    this.plugins.push(plugin);
    plugin.install(this as any);
  }

  remove(pluginName: string): boolean {
    const index = this.plugins.findIndex(p => p.name === pluginName);
    if (index === -1) return false;

    const plugin = this.plugins[index];
    if (plugin.uninstall) {
      plugin.uninstall(this as any);
    }

    this.plugins.splice(index, 1);
    return true;
  }

  getPlugins(): ToastPlugin[] {
    return [...this.plugins];
  }

  // Hook registration
  on(event: keyof typeof this.hooks, callback: HookCallback): void {
    if (this.hooks[event]) {
      this.hooks[event].push(callback);
    }
  }

  off(event: keyof typeof this.hooks, callback: HookCallback): void {
    if (this.hooks[event]) {
      const index = this.hooks[event].indexOf(callback);
      if (index !== -1) {
        this.hooks[event].splice(index, 1);
      }
    }
  }

  // Hook execution
  async trigger(event: keyof typeof this.hooks, toast: ToastInstance, ...args: any[]): Promise<void> {
    const callbacks = this.hooks[event];
    if (!callbacks || callbacks.length === 0) return;

    for (const callback of callbacks) {
      try {
        await callback(toast, ...args);
      } catch (error) {
        console.error(`Error in ${event} hook:`, error);
      }
    }
  }

  // Convenience methods for common lifecycle events
  async beforeShow(toast: ToastInstance): Promise<void> {
    await this.trigger('beforeShow', toast);
  }

  async afterShow(toast: ToastInstance): Promise<void> {
    await this.trigger('afterShow', toast);
  }

  async beforeHide(toast: ToastInstance): Promise<void> {
    await this.trigger('beforeHide', toast);
  }

  async afterHide(toast: ToastInstance): Promise<void> {
    await this.trigger('afterHide', toast);
  }

  async beforeUpdate(toast: ToastInstance, updates: any): Promise<void> {
    await this.trigger('beforeUpdate', toast, updates);
  }

  async afterUpdate(toast: ToastInstance, updates: any): Promise<void> {
    await this.trigger('afterUpdate', toast, updates);
  }

  // Editor integration hooks (for RTE)
  onEditorEvent(event: string, callback: HookCallback): void {
    // Special hooks for editor integration
    const eventKey = `editor:${event}` as keyof typeof this.hooks;
    if (!this.hooks[eventKey]) {
      (this.hooks as any)[eventKey] = [];
    }
    (this.hooks as any)[eventKey].push(callback);
  }

  triggerEditorEvent(event: string, toast: ToastInstance, ...args: any[]): void {
    const eventKey = `editor:${event}` as keyof typeof this.hooks;
    this.trigger(eventKey, toast, ...args);
  }

  // Promise lifecycle helpers
  async handlePromise<T>(
    promise: Promise<T>,
    onLoading: () => void,
    onSuccess: (data: T) => void,
    onError: (error: any) => void
  ): Promise<T> {
    onLoading();

    try {
      const result = await promise;
      onSuccess(result);
      return result;
    } catch (error) {
      onError(error);
      throw error;
    }
  }

  // Batch operations
  async batchShow(toasts: ToastInstance[]): Promise<void> {
    const promises = toasts.map(toast => this.beforeShow(toast));
    await Promise.all(promises);

    // All toasts are shown simultaneously
    const showPromises = toasts.map(toast => this.afterShow(toast));
    await Promise.all(showPromises);
  }

  async batchHide(toasts: ToastInstance[]): Promise<void> {
    const promises = toasts.map(toast => this.beforeHide(toast));
    await Promise.all(promises);

    // All toasts are hidden simultaneously
    const hidePromises = toasts.map(toast => this.afterHide(toast));
    await Promise.all(hidePromises);
  }

  // Cleanup
  destroy(): void {
    // Uninstall all plugins
    this.plugins.forEach(plugin => {
      if (plugin.uninstall) {
        plugin.uninstall(this as any);
      }
    });
    this.plugins = [];

    // Clear all hooks
    Object.keys(this.hooks).forEach(key => {
      this.hooks[key as keyof typeof this.hooks] = [];
    });
  }
}