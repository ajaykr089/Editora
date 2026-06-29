// ToastQueue - Manages toast ordering, priority, dedupe, and visible limits.
import { ToastInstance, ToastConfig } from './types';

export interface ToastQueueChanges {
  show: ToastInstance[];
  hide: ToastInstance[];
  rejected?: ToastInstance;
}

export class ToastQueue {
  private queue: ToastInstance[] = [];
  private visible: ToastInstance[] = [];
  private config: ToastConfig;

  constructor(config: ToastConfig) {
    this.config = this.normalizeConfig(config);
  }

  enqueue(toast: ToastInstance): ToastQueueChanges {
    const duplicate = this.findDuplicate(toast);
    if (duplicate && (toast.options.preventDuplicate ?? this.config.preventDuplicate)) {
      return { show: [], hide: [], rejected: duplicate };
    }

    const hide: ToastInstance[] = [];

    if (toast.options.important && this.visible.length >= this.maxVisible) {
      const replaced = this.removeLowestPriorityVisible();
      this.visible.push(toast);
      return { show: [toast], hide: replaced ? [...hide, replaced] : hide };
    }

    if (this.config.queueStrategy === 'fifo') {
      this.queue.push(toast);
    } else {
      this.queue.unshift(toast);
    }

    this.sortQueue();
    const changes = this.processQueue();
    return { show: changes.show, hide: [...hide, ...changes.hide] };
  }

  dequeue(id: string): ToastQueueChanges {
    const removed = this.removeFromCollections(id);
    if (!removed) return { show: [], hide: [] };

    const changes = this.processQueue();
    return { show: changes.show, hide: [] };
  }

  updateConfig(config: Partial<ToastConfig>): ToastQueueChanges {
    this.config = this.normalizeConfig({ ...this.config, ...config });
    this.sortQueue();
    return this.processQueue();
  }

  getQueued(): ToastInstance[] {
    return [...this.queue];
  }

  getVisible(): ToastInstance[] {
    return [...this.visible];
  }

  getAll(): ToastInstance[] {
    return [...this.visible, ...this.queue];
  }

  isVisible(id: string): boolean {
    return this.visible.some(toast => toast.id === id);
  }

  clear(): ToastInstance[] {
    const allToasts = [...this.visible, ...this.queue];
    this.queue = [];
    this.visible = [];
    return allToasts;
  }

  private processQueue(): ToastQueueChanges {
    const show: ToastInstance[] = [];
    const hide: ToastInstance[] = [];

    while (this.visible.length > this.maxVisible) {
      const toast = this.visible.pop();
      if (toast) hide.push(toast);
    }

    while (this.visible.length < this.maxVisible && this.queue.length > 0) {
      const toast = this.queue.shift();
      if (!toast) break;
      this.visible.push(toast);
      show.push(toast);
    }

    return { show, hide };
  }

  private removeLowestPriorityVisible(): ToastInstance | undefined {
    if (this.visible.length === 0) return undefined;

    let lowestIndex = 0;
    for (let index = 1; index < this.visible.length; index += 1) {
      if ((this.visible[index].options.priority || 0) < (this.visible[lowestIndex].options.priority || 0)) {
        lowestIndex = index;
      }
    }

    return this.visible.splice(lowestIndex, 1)[0];
  }

  private removeFromCollections(id: string): ToastInstance | undefined {
    const visibleIndex = this.visible.findIndex(toast => toast.id === id);
    if (visibleIndex !== -1) {
      return this.visible.splice(visibleIndex, 1)[0];
    }

    const queueIndex = this.queue.findIndex(toast => toast.id === id);
    if (queueIndex !== -1) {
      return this.queue.splice(queueIndex, 1)[0];
    }

    return undefined;
  }

  private findDuplicate(newToast: ToastInstance): ToastInstance | undefined {
    const scope = newToast.options.dedupeScope || this.config.dedupeScope;
    const candidates =
      scope === 'visible' ? this.visible :
      scope === 'queue' ? this.queue :
      [...this.visible, ...this.queue];

    const key = this.getDedupeKey(newToast);
    return candidates.find(toast => this.getDedupeKey(toast) === key);
  }

  private getDedupeKey(toast: ToastInstance): string {
    return toast.options.dedupeKey ||
      `${toast.options.level || 'info'}:${toast.options.title || ''}:${toast.options.message || ''}:${toast.options.description || ''}`;
  }

  private sortQueue(): void {
    this.queue.sort((a, b) => {
      const priorityDelta = (b.options.priority || 0) - (a.options.priority || 0);
      if (priorityDelta !== 0) return priorityDelta;
      return a.createdAt - b.createdAt;
    });
  }

  private get maxVisible(): number {
    return Math.max(1, this.config.visibleToasts || this.config.maxVisible || 1);
  }

  private normalizeConfig(config: ToastConfig): ToastConfig {
    return {
      ...config,
      maxVisible: config.visibleToasts || config.maxVisible
    };
  }
}
