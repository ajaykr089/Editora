// Performance optimization utilities for Rich Text Editor

// Transaction batching and debouncing
export { TransactionBatcher, createTransactionBatcher } from './TransactionBatcher';
export { Debouncer, createDebouncer, debounce } from './Debouncer';

// Memory management
export { MemoryManager, createMemoryManager, getGlobalMemoryManager } from './MemoryManager';

// Performance monitoring
export { PerformanceMonitor, createPerformanceMonitor, getGlobalPerformanceMonitor } from './PerformanceMonitor';

// Lazy module loading (declared in index.d.ts; the export was left commented out, so the typings
// promised a `LazyLoader` / `lazyLoader` that was undefined at runtime)
export { LazyLoader, lazyLoader } from './LazyLoader';

// Placeholder exports for future features
// export { VirtualScroller, createVirtualScroller } from './VirtualScroller';
// export { optimizeEditorState, optimizeDocument } from './optimization';
// export { useDebouncedCallback, useThrottledCallback } from './hooks';
// Optimization helpers
