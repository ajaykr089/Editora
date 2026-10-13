import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { PerformanceMonitor } from '../src/PerformanceMonitor';

describe('PerformanceMonitor', () => {
  let monitor: PerformanceMonitor;

  beforeEach(() => {
    monitor = new PerformanceMonitor({ enabled: true, sampleInterval: 100 });
  });

  afterEach(() => {
    monitor.destroy();
  });

  describe('initialization', () => {
    it('should initialize with default config', () => {
      const defaultMonitor = new PerformanceMonitor();
      expect(defaultMonitor).toBeDefined();
      defaultMonitor.destroy();
    });

    it('should initialize with custom config', () => {
      expect(monitor).toBeDefined();
    });
  });

  describe('operation tracking', () => {
    it('should track operation start and end', () => {
      monitor.startOperation('test');
      // Simulate some work
      const result = monitor.endOperation();
      expect(result).toBeDefined();
      expect(result!.renderTime).toBeGreaterThan(0);
    });

    it('should not track when disabled', () => {
      const disabledMonitor = new PerformanceMonitor({ enabled: false });
      disabledMonitor.startOperation('test');
      const result = disabledMonitor.endOperation();
      expect(result).toBeNull();
      disabledMonitor.destroy();
    });
  });

  describe('metrics collection', () => {
    it('should collect metrics over time', () => {
      monitor.startOperation('operation1');
      monitor.endOperation();

      monitor.startOperation('operation2');
      monitor.endOperation();

      const metrics = monitor.getMetrics();
      expect(metrics.length).toBeGreaterThanOrEqual(2);
    });

    it('should calculate average metrics', () => {
      monitor.startOperation('test');
      monitor.endOperation();

      const averages = monitor.getAverageMetrics();
      expect(averages).toBeDefined();
    });

    it('should clear metrics', () => {
      monitor.startOperation('test');
      monitor.endOperation();

      monitor.clearMetrics();
      expect(monitor.getMetrics()).toHaveLength(0);
    });
  });

  describe('performance warnings', () => {
    let consoleWarnSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    });

    afterEach(() => {
      consoleWarnSpy.mockRestore();
    });

    it('should warn about slow operations', () => {
      // Mock performance.now to simulate slow operation
      const originalNow = performance.now;
      performance.now = jest.fn()
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(100); // 100ms delay

      monitor.startOperation('slow-render');
      const result = monitor.endOperation();

      expect(consoleWarnSpy).toHaveBeenCalled();
      // console.warn('Performance warning:', 'Slow render: 100ms')
      expect(consoleWarnSpy.mock.calls[0].join(' ')).toContain('Slow render: 100ms');

      performance.now = originalNow;
    });
  });
});
describe('PerformanceMonitor averages', () => {
  const MB = 1024 * 1024;

  beforeEach(() => {
    jest.useFakeTimers();
    (performance as unknown as { memory: unknown }).memory = { usedJSHeapSize: 80 * MB, totalJSHeapSize: 200 * MB, jsHeapSizeLimit: 2048 * MB };
  });
  afterEach(() => {
    jest.useRealTimers();
    delete (performance as unknown as { memory?: unknown }).memory;
  });

  it('averages the timings of operations only, not those of the periodic heap samples', () => {
    // Where the browser exposes the heap (Chromium), the monitor also records a sample every sampleInterval. A sample has no
    // timings, and used to be averaged in as a 0: one 30 ms render read as 15 ms after a single sample, 3 ms after nine.
    const monitor = new PerformanceMonitor({ sampleInterval: 1000, logWarnings: false });

    monitor.startOperation('render');
    jest.advanceTimersByTime(30);
    monitor.endOperation();
    jest.advanceTimersByTime(3000);

    expect(monitor.getMetrics()).toHaveLength(4); // the operation and three samples
    expect(monitor.getAverageMetrics().renderTime).toBe(30);
    expect(monitor.getAverageMetrics().transactionTime).toBe(30);
    monitor.destroy();
  });

  it('averages the operations that are in the window, and gives zeros when there are none', () => {
    const monitor = new PerformanceMonitor({ sampleInterval: 1000, logWarnings: false });
    jest.advanceTimersByTime(2000); // two samples
    expect(monitor.getAverageMetrics()).toEqual({ domTime: 0, renderTime: 0, transactionTime: 0, memoryUsage: 80 });

    for (const duration of [10, 20]) {
      monitor.startOperation('render');
      jest.advanceTimersByTime(duration);
      monitor.endOperation();
    }
    expect(monitor.getAverageMetrics().renderTime).toBe(15);

    jest.advanceTimersByTime(120_000);
    expect(monitor.getAverageMetrics(60_000).renderTime).toBe(0); // those operations are older than the window
    monitor.destroy();
  });
});
