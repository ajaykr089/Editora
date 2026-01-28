import { Transaction, EditorState } from '@editora/core';

/**
 * Configuration for transaction batching.
 */
export interface TransactionBatchConfig {
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
export class TransactionBatcher {
  private config: Required<TransactionBatchConfig>;
  private batch: Transaction[] = [];
  private batchTimeout: number | null = null;
  private onFlush?: (transactions: Transaction[], state: EditorState) => void;

  constructor(config: TransactionBatchConfig = {}) {
    this.config = {
      maxBatchSize: 10,
      maxBatchTime: 16, // ~60fps
      enabled: true,
      ...config
    };
  }

  /**
   * Add a transaction to the batch.
   */
  add(transaction: Transaction): void {
    if (!this.config.enabled) {
      this.flush([transaction]);
      return;
    }

    this.batch.push(transaction);

    // Auto-flush if batch is full
    if (this.batch.length >= this.config.maxBatchSize) {
      this.flushBatch();
    } else if (this.batch.length === 1) {
      // Start timeout for first transaction
      this.scheduleFlush();
    }
  }

  /**
   * Flush all pending transactions.
   */
  flushBatch(): void {
    if (this.batch.length > 0) {
      this.flush([...this.batch]);
      this.batch = [];
      this.clearTimeout();
    }
  }

  /**
   * Set flush callback.
   */
  setOnFlush(callback: (transactions: Transaction[], state: EditorState) => void): void {
    this.onFlush = callback;
  }

  /**
   * Get current batch size.
   */
  getBatchSize(): number {
    return this.batch.length;
  }

  /**
   * Check if batching is enabled.
   */
  isEnabled(): boolean {
    return this.config.enabled;
  }

  /**
   * Enable or disable batching.
   */
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
    if (!enabled) {
      this.flushBatch();
    }
  }

  /**
   * Force immediate flush of all transactions.
   */
  private flush(transactions: Transaction[]): void {
    if (this.onFlush) {
      // Create a composite state for the batch
      const state = transactions[0]?.beforeState || {} as EditorState;
      this.onFlush(transactions, state);
    }
  }

  /**
   * Schedule automatic flush.
   */
  private scheduleFlush(): void {
    this.clearTimeout();
    this.batchTimeout = window.setTimeout(() => {
      this.flushBatch();
    }, this.config.maxBatchTime);
  }

  /**
   * Clear pending timeout.
   */
  private clearTimeout(): void {
    if (this.batchTimeout) {
      window.clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }
  }

  /**
   * Clean up resources.
   */
  destroy(): void {
    this.clearTimeout();
    this.flushBatch();
  }
}

/**
 * Create a transaction batcher instance.
 */
export function createTransactionBatcher(config?: TransactionBatchConfig): TransactionBatcher {
  return new TransactionBatcher(config);
}