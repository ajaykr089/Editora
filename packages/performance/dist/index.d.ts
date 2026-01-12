import { Transaction, EditorState } from '@rte-editor/core';

/**
 * Configuration for transaction batching.
 */
interface TransactionBatchConfig {
    /** Maximum batch size before auto-flush */
    maxBatchSize?: number;
    /** Maximum time to wait before auto-flush (ms) */
    maxBatchTime?: number;
    /** Whether to enable batching */
    enabled?: boolean;
}
/**
 * Transaction batcher for grouping multiple operations.
 * Improves performance by reducing the number of state updates.
 */
declare class TransactionBatcher {
    private config;
    private batch;
    private batchTimeout;
    private onFlush?;
    constructor(config?: TransactionBatchConfig);
    /**
     * Add a transaction to the batch.
     */
    add(transaction: Transaction): void;
    /**
     * Flush all pending transactions.
     */
    flushBatch(): void;
    /**
     * Set flush callback.
     */
    setOnFlush(callback: (transactions: Transaction[], state: EditorState) => void): void;
    /**
     * Get current batch size.
     */
    getBatchSize(): number;
    /**
     * Check if batching is enabled.
     */
    isEnabled(): boolean;
    /**
     * Enable or disable batching.
     */
    setEnabled(enabled: boolean): void;
    /**
     * Force immediate flush of all transactions.
     */
    private flush;
    /**
     * Schedule automatic flush.
     */
    private scheduleFlush;
    /**
     * Clear pending timeout.
     */
    private clearTimeout;
    /**
     * Clean up resources.
     */
    destroy(): void;
}
/**
 * Create a transaction batcher instance.
 */
declare function createTransactionBatcher(config?: TransactionBatchConfig): TransactionBatcher;

/**
 * Simple debouncer for delaying function execution.
 * Useful for optimizing UI updates and API calls.
 */
declare class Debouncer {
    private timeoutId;
    private delay;
    constructor(delay?: number);
    /**
     * Execute the debounced function.
     */
    execute<T extends any[]>(func: (...args: T) => any, ...args: T): void;
    /**
     * Cancel pending execution.
     */
    cancel(): void;
}
/**
 * Create a debounced function.
 */
declare function createDebouncer(delay?: number): Debouncer;

/**
 * Configuration for memory management.
 */
interface MemoryConfig {
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
declare class MemoryManager {
    private config;
    private cleanupInterval;
    private eventListeners;
    private timeouts;
    private intervals;
    constructor(config?: MemoryConfig);
    /**
     * Register an event listener for cleanup.
     */
    registerEventListener(element: EventTarget, type: string, listener: EventListener, options?: boolean | AddEventListenerOptions): void;
    /**
     * Register a timeout for cleanup.
     */
    registerTimeout(timeoutId: number): void;
    /**
     * Register an interval for cleanup.
     */
    registerInterval(intervalId: number): void;
    /**
     * Unregister a timeout.
     */
    unregisterTimeout(timeoutId: number): void;
    /**
     * Unregister an interval.
     */
    unregisterInterval(intervalId: number): void;
    /**
     * Force garbage collection if available.
     */
    forceGC(): void;
    /**
     * Get current memory usage if available.
     */
    getMemoryUsage(): {
        used: number;
        total: number;
        limit: number;
    } | null;
    /**
     * Check if memory usage is high.
     */
    isMemoryHigh(): boolean;
    /**
     * Perform cleanup operations.
     */
    cleanup(): void;
    /**
     * Start automatic cleanup.
     */
    private startAutoCleanup;
    /**
     * Stop automatic cleanup.
     */
    stopAutoCleanup(): void;
    /**
     * Destroy the memory manager and perform final cleanup.
     */
    destroy(): void;
}
/**
 * Create a memory manager instance.
 */
declare function createMemoryManager(config?: MemoryConfig): MemoryManager;

/**
 * Performance metrics for monitoring.
 */
interface PerformanceMetrics {
    /** DOM manipulation time */
    domTime: number;
    /** Rendering time */
    renderTime: number;
    /** Transaction processing time */
    transactionTime: number;
    /** Memory usage */
    memoryUsage: number;
    /** Timestamp */
    timestamp: number;
}
/**
 * Configuration for performance monitoring.
 */
interface PerformanceConfig {
    /** Whether to enable monitoring */
    enabled?: boolean;
    /** Sampling interval in milliseconds */
    sampleInterval?: number;
    /** Maximum number of samples to keep */
    maxSamples?: number;
    /** Whether to log performance warnings */
    logWarnings?: boolean;
}
/**
 * Performance monitor for tracking editor performance metrics.
 */
declare class PerformanceMonitor {
    private config;
    private metrics;
    private isMonitoring;
    private sampleInterval;
    private currentOperation;
    constructor(config?: PerformanceConfig);
    /**
     * Start monitoring performance.
     */
    startMonitoring(): void;
    /**
     * Stop monitoring performance.
     */
    stopMonitoring(): void;
    /**
     * Start tracking an operation.
     */
    startOperation(type: string): void;
    /**
     * End tracking an operation and record metrics.
     */
    endOperation(): PerformanceMetrics | null;
    /**
     * Get current performance metrics.
     */
    getMetrics(): PerformanceMetrics[];
    /**
     * Get average metrics over a time period.
     */
    getAverageMetrics(durationMs?: number): Partial<PerformanceMetrics>;
    /**
     * Clear all metrics.
     */
    clearMetrics(): void;
    /**
     * Collect current performance metrics.
     */
    private collectMetrics;
    /**
     * Add metrics to the collection.
     */
    private addMetrics;
    /**
     * Check for performance warnings.
     */
    private checkPerformanceWarnings;
    /**
     * Destroy the monitor and clean up resources.
     */
    destroy(): void;
}
/**
 * Create a performance monitor instance.
 */
declare function createPerformanceMonitor(config?: PerformanceConfig): PerformanceMonitor;

export { Debouncer, MemoryManager, PerformanceMonitor, TransactionBatcher, createDebouncer, createMemoryManager, createPerformanceMonitor, createTransactionBatcher };
