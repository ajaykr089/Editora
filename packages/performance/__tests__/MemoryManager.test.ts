import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { MemoryManager } from '../src/MemoryManager';

const MB = 1024 * 1024;

describe('MemoryManager', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    jest.useRealTimers();
    delete (performance as unknown as { memory?: unknown }).memory;
  });

  const heap = (usedMB: number) => {
    (performance as unknown as { memory: unknown }).memory = { usedJSHeapSize: usedMB * MB, totalJSHeapSize: 300 * MB, jsHeapSizeLimit: 2048 * MB };
  };

  it('reports the heap in megabytes where the browser exposes it, and nothing where it does not', () => {
    const memory = new MemoryManager({ autoCleanup: false });
    expect(memory.getMemoryUsage()).toBeNull();
    expect(memory.isMemoryHigh()).toBe(false);

    heap(150);
    expect(memory.getMemoryUsage()).toEqual({ used: 150, total: 300, limit: 2048 });
    expect(memory.isMemoryHigh()).toBe(true);
    heap(100);
    expect(memory.isMemoryHigh()).toBe(false); // the limit itself is not "high"
  });

  it('cleanup() clears the timeouts and intervals that were registered, and only those', () => {
    const memory = new MemoryManager({ autoCleanup: false });
    const registered = jest.fn();
    const other = jest.fn();
    memory.registerTimeout(window.setTimeout(registered, 10));
    memory.registerInterval(window.setInterval(registered, 10));
    window.setTimeout(other, 10);

    memory.cleanup();
    jest.advanceTimersByTime(50);
    expect(registered).not.toHaveBeenCalled();
    expect(other).toHaveBeenCalledTimes(1);
  });

  it('an unregistered timeout is left alone by cleanup()', () => {
    const memory = new MemoryManager({ autoCleanup: false });
    const callback = jest.fn();
    const id = window.setTimeout(callback, 10);
    memory.registerTimeout(id);
    memory.unregisterTimeout(id);
    memory.cleanup();
    jest.advanceTimersByTime(10);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('cleans up on its own, but only while the heap is above the limit', () => {
    const memory = new MemoryManager({ maxMemoryMB: 100, cleanupIntervalMs: 1000 });

    // Below the limit the checks leave a registered timeout alone: it fires.
    heap(50);
    const fires = jest.fn();
    memory.registerTimeout(window.setTimeout(fires, 2500));
    jest.advanceTimersByTime(3000);
    expect(fires).toHaveBeenCalledTimes(1);

    // Above it, the next check clears what is registered.
    const cleared = jest.fn();
    memory.registerTimeout(window.setTimeout(cleared, 10000));
    heap(150);
    jest.advanceTimersByTime(1000);
    jest.advanceTimersByTime(20000);
    expect(cleared).not.toHaveBeenCalled();
    memory.destroy();
  });

  it('stops checking after stopAutoCleanup()', () => {
    heap(150);
    const memory = new MemoryManager({ maxMemoryMB: 100, cleanupIntervalMs: 1000 });
    const callback = jest.fn();
    memory.registerTimeout(window.setTimeout(callback, 5000));
    memory.stopAutoCleanup();
    jest.advanceTimersByTime(6000);
    expect(callback).toHaveBeenCalledTimes(1);
    memory.destroy();
  });

  it('destroy() removes the event listeners that were registered through it', () => {
    // destroy() used to forget the listeners without removing them, so they kept running (and kept their targets alive).
    const memory = new MemoryManager({ autoCleanup: false });
    const target = new EventTarget();
    const listener = jest.fn();
    memory.registerEventListener(target, 'ping', listener);

    target.dispatchEvent(new Event('ping'));
    expect(listener).toHaveBeenCalledTimes(1);

    memory.destroy();
    target.dispatchEvent(new Event('ping'));
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('removes a listener with the options it was added with, and leaves it in place on cleanup()', () => {
    const memory = new MemoryManager({ autoCleanup: false });
    const target = new EventTarget();
    const listener = jest.fn();
    const remove = jest.spyOn(target, 'removeEventListener');
    const options = { capture: true };
    memory.registerEventListener(target, 'ping', listener, options);

    memory.cleanup();
    target.dispatchEvent(new Event('ping'));
    expect(listener).toHaveBeenCalledTimes(1);
    expect(remove).not.toHaveBeenCalled();

    memory.destroy();
    expect(remove).toHaveBeenCalledWith('ping', listener, options);
  });

  it('destroy() also stops the automatic cleanup', () => {
    heap(150);
    const memory = new MemoryManager({ maxMemoryMB: 100, cleanupIntervalMs: 1000 });
    const cleanup = jest.spyOn(memory, 'cleanup');
    memory.destroy();
    cleanup.mockClear();
    jest.advanceTimersByTime(5000);
    expect(cleanup).not.toHaveBeenCalled();
  });
});
