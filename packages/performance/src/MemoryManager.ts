/**
 * Configuration for memory management.
 */
export interface MemoryConfig {
  /** Maximum memory usage before cleanup (MB) */
  maxMemoryMB?: number;
  /** Cleanup interval in milliseconds */
  cleanupIntervalMs?: number;
  /** Whether to enable automatic cleanup */
  autoCleanup?: boolean;
}

/**
 * Memory manager for optimizing memory usage and cleanup.
 */
export class MemoryManager {
  private config: Required<MemoryConfig>;
  private cleanupInterval: number | null = null;
  private eventListeners: Array<{ element: EventTarget; type: string; listener: EventListener; options?: boolean | AddEventListenerOptions }> = [];
  private timeouts: Set<number> = new Set();
  private intervals: Set<number> = new Set();

  constructor(config: MemoryConfig = {}) {
    this.config = {
      maxMemoryMB: 100,
      cleanupIntervalMs: 30000, // 30 seconds
      autoCleanup: true,
      ...config
    };

    if (this.config.autoCleanup) {
      this.startAutoCleanup();
    }
  }

  /**
   * Register an event listener for cleanup.
   */
  registerEventListener(
    element: EventTarget,
    type: string,
    listener: EventListener,
    options?: boolean | AddEventListenerOptions
  ): void {
    element.addEventListener(type, listener, options);
    this.eventListeners.push({ element, type, listener, options });
  }

  /**
   * Register a timeout for cleanup.
   */
  registerTimeout(timeoutId: number): void {
    this.timeouts.add(timeoutId);
  }

  /**
   * Register an interval for cleanup.
   */
  registerInterval(intervalId: number): void {
    this.intervals.add(intervalId);
  }

  /**
   * Unregister a timeout.
   */
  unregisterTimeout(timeoutId: number): void {
    this.timeouts.delete(timeoutId);
  }

  /**
   * Unregister an interval.
   */
  unregisterInterval(intervalId: number): void {
    this.intervals.delete(intervalId);
  }

  /**
   * Force garbage collection if available.
   */
  forceGC(): void {
    if ((window as any).gc) {
      (window as any).gc();
    }
  }

  /**
   * Get current memory usage if available.
   */
  getMemoryUsage(): { used: number; total: number; limit: number } | null {
    const memInfo = (performance as any).memory;
    if (!memInfo) return null;

    return {
      used: Math.round(memInfo.usedJSHeapSize / 1024 / 1024),
      total: Math.round(memInfo.totalJSHeapSize / 1024 / 1024),
      limit: Math.round(memInfo.jsHeapSizeLimit / 1024 / 1024)
    };
  }

  /**
   * Check if memory usage is high.
   */
  isMemoryHigh(): boolean {
    const memInfo = this.getMemoryUsage();
    if (!memInfo) return false;

    return memInfo.used > this.config.maxMemoryMB;
  }

  /**
   * Perform cleanup operations.
   */
  cleanup(): void {
    // Clear all registered timeouts
    for (const timeoutId of this.timeouts) {
      clearTimeout(timeoutId);
    }
    this.timeouts.clear();

    // Clear all registered intervals
    for (const intervalId of this.intervals) {
      clearInterval(intervalId);
    }
    this.intervals.clear();

    // Force garbage collection if available
    this.forceGC();
  }

  /**
   * Start automatic cleanup.
   */
  private startAutoCleanup(): void {
    this.cleanupInterval = window.setInterval(() => {
      if (this.isMemoryHigh()) {
        this.cleanup();
      }
    }, this.config.cleanupIntervalMs);
  }

  /**
   * Stop automatic cleanup.
   */
  stopAutoCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * Destroy the memory manager and perform final cleanup.
   */
  destroy(): void {
    this.stopAutoCleanup();
    this.cleanup();

    // Remove the event listeners that were registered. cleanup() leaves them: it runs by itself when memory is high,
    // and listeners are not something to take away from a page that is still using them.
    for (const { element, type, listener, options } of this.eventListeners) {
      element.removeEventListener(type, listener, options);
    }
    this.eventListeners = [];
  }
}

/**
 * Create a memory manager instance.
 */
export function createMemoryManager(config?: MemoryConfig): MemoryManager {
  return new MemoryManager(config);
}

/**
 * Global memory manager instance.
 */
let globalMemoryManager: MemoryManager | null = null;

/**
 * Get the global memory manager instance.
 */
export function getGlobalMemoryManager(): MemoryManager {
  if (!globalMemoryManager) {
    globalMemoryManager = new MemoryManager();
  }
  return globalMemoryManager;
}