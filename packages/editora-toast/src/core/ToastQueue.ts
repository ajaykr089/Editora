// ToastQueue - Manages toast ordering, priority, and queue limits
import { ToastInstance, ToastConfig, QueueStrategy } from './types';

export class ToastQueue {
  private queue: ToastInstance[] = [];
  private visible: ToastInstance[] = [];
  private config: ToastConfig;

  constructor(config: ToastConfig) {
    this.config = config;
  }

  // Add toast to queue
  enqueue(toast: ToastInstance): void {
    // Remove duplicates if same message and level
    this.deduplicate(toast);

    // Add to queue based on strategy
    if (this.config.queueStrategy === 'fifo') {
      this.queue.push(toast);
    } else {
      this.queue.unshift(toast);
    }

    // Sort by priority (higher priority first)
    this.queue.sort((a, b) => (b.options.priority || 0) - (a.options.priority || 0));

    this.processQueue();
  }

  // Remove toast from queue/visible
  dequeue(id: string): boolean {
    let removed = false;

    // Remove from queue
    const queueIndex = this.queue.findIndex(t => t.id === id);
    if (queueIndex !== -1) {
      this.queue.splice(queueIndex, 1);
      removed = true;
    }

    // Remove from visible
    const visibleIndex = this.visible.findIndex(t => t.id === id);
    if (visibleIndex !== -1) {
      this.visible.splice(visibleIndex, 1);
      removed = true;
    }

    if (removed) {
      this.processQueue();
    }

    return removed;
  }

  // Process queue to show toasts within limits
  private processQueue(): void {
    const maxVisible = this.config.maxVisible;

    // Hide excess visible toasts
    while (this.visible.length > maxVisible) {
      const toast = this.visible.pop()!;
      this.hideToast(toast);
    }

    // Show queued toasts if space available
    while (this.visible.length < maxVisible && this.queue.length > 0) {
      const toast = this.queue.shift()!;
      this.showToast(toast);
    }
  }

  private showToast(toast: ToastInstance): void {
    this.visible.push(toast);
    // ToastRenderer will handle the actual showing
  }

  private hideToast(toast: ToastInstance): void {
    // ToastRenderer will handle the actual hiding
  }

  // Deduplicate toasts with same message and level
  private deduplicate(newToast: ToastInstance): void {
    const duplicates = this.queue.filter(t =>
      t.options.message === newToast.options.message &&
      t.options.level === newToast.options.level
    );

    duplicates.forEach(duplicate => {
      const index = this.queue.indexOf(duplicate);
      if (index !== -1) {
        this.queue.splice(index, 1);
      }
    });
  }

  // Update configuration
  updateConfig(config: Partial<ToastConfig>): void {
    this.config = { ...this.config, ...config };
    this.processQueue();
  }

  // Get current state
  getQueued(): ToastInstance[] {
    return [...this.queue];
  }

  getVisible(): ToastInstance[] {
    return [...this.visible];
  }

  getAll(): ToastInstance[] {
    return [...this.visible, ...this.queue];
  }

  // Clear all
  clear(): void {
    const allToasts = [...this.visible, ...this.queue];
    this.queue = [];
    this.visible = [];

    // Hide all visible toasts
    allToasts.forEach(toast => {
      if (toast.element) {
        this.hideToast(toast);
      }
    });
  }

  // Force show a high-priority toast (bypass queue)
  forceShow(toast: ToastInstance): void {
    if (this.visible.length >= this.config.maxVisible) {
      // Hide the lowest priority visible toast
      const lowestPriority = this.visible.reduce((lowest, current) =>
        (current.options.priority || 0) < (lowest.options.priority || 0) ? current : lowest
      );
      this.dequeue(lowestPriority.id);
    }

    this.showToast(toast);
  }
}