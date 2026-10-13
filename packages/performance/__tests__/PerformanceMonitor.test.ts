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