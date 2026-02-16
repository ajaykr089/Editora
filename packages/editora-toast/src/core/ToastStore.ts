// ToastStore - Centralized state management for toasts
import { ToastInstance, ToastGroup, ToastConfig, ToastPosition } from './types';

export class ToastStore {
  private toasts = new Map<string, ToastInstance>();
  private groups = new Map<string, ToastGroup>();
  private containers = new Map<ToastPosition, HTMLElement>();
  private config: ToastConfig;

  constructor(config: ToastConfig) {
    this.config = { ...config };
  }

  // Toast management
  addToast(toast: ToastInstance): void {
    this.toasts.set(toast.id, toast);
    this.updateGroup(toast);
  }

  removeToast(id: string): boolean {
    const toast = this.toasts.get(id);
    if (!toast) return false;

    this.toasts.delete(id);
    this.updateGroup(toast);
    return true;
  }

  getToast(id: string): ToastInstance | undefined {
    return this.toasts.get(id);
  }

  getAllToasts(): ToastInstance[] {
    return Array.from(this.toasts.values());
  }

  getToastsByPosition(position: ToastPosition): ToastInstance[] {
    return this.getAllToasts().filter(toast => toast.options.position === position);
  }

  updateToast(id: string, updates: Partial<ToastInstance>): boolean {
    const toast = this.toasts.get(id);
    if (!toast) return false;

    Object.assign(toast, updates);
    this.updateGroup(toast);
    return true;
  }

  // Group management
  private updateGroup(toast: ToastInstance): void {
    const groupId = toast.options.group;
    if (!groupId) return;

    let group = this.groups.get(groupId);
    if (!group) {
      group = { id: groupId, toasts: [] };
      this.groups.set(groupId, group);
    }

    // Remove from old group if changing groups
    group.toasts = group.toasts.filter(t => t.id !== toast.id);

    // Add to new group
    if (toast.options.group === groupId) {
      group.toasts.push(toast);
    }

    // Remove empty groups
    if (group.toasts.length === 0) {
      this.groups.delete(groupId);
    }
  }

  getGroup(id: string): ToastGroup | undefined {
    return this.groups.get(id);
  }

  getAllGroups(): ToastGroup[] {
    return Array.from(this.groups.values());
  }

  // Container management
  getContainer(position: ToastPosition): HTMLElement | undefined {
    return this.containers.get(position);
  }

  setContainer(position: ToastPosition, container: HTMLElement): void {
    this.containers.set(position, container);
  }

  removeContainer(position: ToastPosition): boolean {
    return this.containers.delete(position);
  }

  getAllContainers(): Map<ToastPosition, HTMLElement> {
    return new Map(this.containers);
  }

  // Configuration
  getConfig(): ToastConfig {
    return { ...this.config };
  }

  updateConfig(config: Partial<ToastConfig>): void {
    this.config = { ...this.config, ...config };
  }

  // Cleanup
  clear(): void {
    this.toasts.clear();
    this.groups.clear();
    // Note: containers are managed separately
  }

  // Statistics
  getStats() {
    return {
      totalToasts: this.toasts.size,
      totalGroups: this.groups.size,
      toastsByPosition: Object.fromEntries(
        Array.from(this.containers.keys()).map(pos => [
          pos,
          this.getToastsByPosition(pos).length
        ])
      )
    };
  }
}