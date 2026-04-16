import { describe, it, expect, beforeEach, vi } from 'vitest';
import { lockBodyScroll } from '../components/date-time-utils';
import OverlayManager from '../overlayManager';
import { getBodyScrollLockCount, releaseBodyScrollLock } from '../scroll-lock';

describe('OverlayManager lock-count API', () => {
  beforeEach(() => {
    // reset internal state
    (OverlayManager as any).stack.length = 0;
    // @ts-ignore - reset private counter for deterministic tests
    (OverlayManager as any)._lockCount = 0;
    while (getBodyScrollLockCount() > 0) releaseBodyScrollLock();
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  });

  it('acquireLock / releaseLock manage internal counter and scroll lock', () => {
    expect(OverlayManager.lockCount()).toBe(0);

    OverlayManager.acquireLock();
    expect(OverlayManager.lockCount()).toBe(1);
    expect(document.body.style.overflow).toBe('hidden');

    OverlayManager.acquireLock();
    expect(OverlayManager.lockCount()).toBe(2);

    OverlayManager.releaseLock();
    expect(OverlayManager.lockCount()).toBe(1);
    expect(document.body.style.overflow).toBe('hidden');

    OverlayManager.releaseLock();
    expect(OverlayManager.lockCount()).toBe(0);
    expect(document.body.style.overflow).toBe('');
  });

  it('lockScroll / unlockScroll are backwards-compatible aliases', () => {
    OverlayManager.lockScroll();
    expect(OverlayManager.lockCount()).toBe(1);

    OverlayManager.lockScroll();
    expect(OverlayManager.lockCount()).toBe(2);

    OverlayManager.unlockScroll();
    expect(OverlayManager.lockCount()).toBe(1);

    OverlayManager.unlockScroll();
    expect(OverlayManager.lockCount()).toBe(0);
  });

  it('releaseLock does not drop below zero', () => {
    OverlayManager.releaseLock();
    OverlayManager.releaseLock();
    expect(OverlayManager.lockCount()).toBe(0);
  });

  it('keeps body locked while different overlay systems overlap', () => {
    const releasePickerLock = lockBodyScroll();
    expect(document.body.style.overflow).toBe('hidden');

    OverlayManager.acquireLock();
    releasePickerLock();

    expect(document.body.style.overflow).toBe('hidden');
    OverlayManager.releaseLock();
    expect(document.body.style.overflow).toBe('');
  });

  it('uses scrollbar-gutter when supported to avoid padding measurement work', () => {
    const originalCss = globalThis.CSS;
    const supports = vi.fn((query: string) => query === 'scrollbar-gutter: stable');
    Object.defineProperty(globalThis, 'CSS', {
      configurable: true,
      value: { ...(originalCss || {}), supports }
    });

    OverlayManager.acquireLock();

    expect(document.documentElement.style.scrollbarGutter).toBe('stable');
    expect(document.body.style.scrollbarGutter).toBe('stable');

    OverlayManager.releaseLock();

    expect(document.documentElement.style.scrollbarGutter).toBe('');
    expect(document.body.style.scrollbarGutter).toBe('');

    Object.defineProperty(globalThis, 'CSS', {
      configurable: true,
      value: originalCss
    });
  });

  it('uses CSS scrollbar compensation without reading layout when scrollbar-gutter is unsupported', () => {
    const originalCss = globalThis.CSS;
    let clientWidthReads = 0;
    Object.defineProperty(globalThis, 'CSS', {
      configurable: true,
      value: { ...(originalCss || {}), supports: () => false }
    });

    Object.defineProperty(document.documentElement, 'clientWidth', {
      configurable: true,
      get() {
        clientWidthReads += 1;
        throw new Error('layout read should not happen');
      }
    });

    document.body.style.paddingRight = '12px';

    expect(() => OverlayManager.acquireLock()).not.toThrow();
    expect(clientWidthReads).toBe(0);
    expect(document.body.style.overflow).toBe('hidden');

    OverlayManager.releaseLock();
    expect(document.body.style.paddingRight).toBe('12px');

    Object.defineProperty(globalThis, 'CSS', {
      configurable: true,
      value: originalCss
    });
  });
});
