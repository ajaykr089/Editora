import type { EditorState } from "@editora/core";

export interface Transaction {
  beforeState?: EditorState;
  [key: string]: unknown;
}

export interface TransactionBatchConfig {
  maxBatchSize?: number;
  maxBatchTime?: number;
  enabled?: boolean;
}

export class TransactionBatcher {
  constructor(config?: TransactionBatchConfig);
  add(transaction: Transaction): void;
  flushBatch(): void;
  setOnFlush(callback: (transactions: Transaction[], state: EditorState) => void): void;
  getBatchSize(): number;
  isEnabled(): boolean;
  setEnabled(enabled: boolean): void;
  destroy(): void;
}

export function createTransactionBatcher(config?: TransactionBatchConfig): TransactionBatcher;

export interface DebounceConfig {
  delay?: number;
  leading?: boolean;
  maxWait?: number;
}

export class Debouncer {
  constructor(delay?: number);
  execute<T extends unknown[]>(func: (...args: T) => unknown, ...args: T): void;
  cancel(): void;
}

export function createDebouncer(delay?: number): Debouncer;
export function debounce<T extends unknown[]>(
  func: (...args: T) => unknown,
  delay?: number,
): (...args: T) => void;

export interface MemoryConfig {
  maxMemoryMB?: number;
  cleanupIntervalMs?: number;
  autoCleanup?: boolean;
}

export class MemoryManager {
  constructor(config?: MemoryConfig);
  registerEventListener(
    element: EventTarget,
    type: string,
    listener: EventListener,
    options?: boolean | AddEventListenerOptions,
  ): void;
  registerTimeout(timeoutId: number): void;
  registerInterval(intervalId: number): void;
  unregisterTimeout(timeoutId: number): void;
  unregisterInterval(intervalId: number): void;
  forceGC(): void;
  getMemoryUsage(): { used: number; total: number; limit: number } | null;
  isMemoryHigh(): boolean;
  cleanup(): void;
  stopAutoCleanup(): void;
  destroy(): void;
}

export function createMemoryManager(config?: MemoryConfig): MemoryManager;
export function getGlobalMemoryManager(): MemoryManager;

export interface PerformanceMetrics {
  domTime: number;
  renderTime: number;
  transactionTime: number;
  memoryUsage: number;
  timestamp: number;
}

export interface PerformanceConfig {
  enabled?: boolean;
  sampleInterval?: number;
  maxSamples?: number;
  logWarnings?: boolean;
}

export class PerformanceMonitor {
  constructor(config?: PerformanceConfig);
  startMonitoring(): void;
  stopMonitoring(): void;
  startOperation(type: string): void;
  endOperation(): PerformanceMetrics | null;
  getMetrics(): PerformanceMetrics[];
  getAverageMetrics(durationMs?: number): Partial<PerformanceMetrics>;
  clearMetrics(): void;
  destroy(): void;
}

export function createPerformanceMonitor(config?: PerformanceConfig): PerformanceMonitor;
export function getGlobalPerformanceMonitor(): PerformanceMonitor;

export class LazyLoader {
  load<T>(moduleId: string, loader: () => Promise<T>): Promise<T>;
  unload(moduleId: string): void;
  clear(): void;
}

export const lazyLoader: LazyLoader;
