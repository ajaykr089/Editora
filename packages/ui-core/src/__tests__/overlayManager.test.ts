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

  function withScrollbar(width: number) {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1024 });
    Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, get: () => 1024 - width });
  }
  function withCss(supportsGutter: boolean) {
    const originalCss = globalThis.CSS;
    Object.defineProperty(globalThis, 'CSS', {
      configurable: true,
      value: { ...(originalCss || {}), supports: (query: string) => supportsGutter && query === 'scrollbar-gutter: stable' }
    });
    return () => Object.defineProperty(globalThis, 'CSS', { configurable: true, value: originalCss });
  }

  it('keeps the scrollbar gutter on the html element when the page has a scrollbar', () => {
    const restore = withCss(true);
    withScrollbar(15);
    OverlayManager.acquireLock();
    expect(document.documentElement.style.scrollbarGutter).toBe('stable');
    // a second gutter on body would push the content again
    expect(document.body.style.scrollbarGutter).toBe('');
    OverlayManager.releaseLock();
    expect(document.documentElement.style.scrollbarGutter).toBe('');
    restore();
  });

  it('leaves a page without a scrollbar where it is (no gutter, no padding)', () => {
    const restore = withCss(true);
    withScrollbar(0);
    OverlayManager.acquireLock();
    expect(document.documentElement.style.scrollbarGutter).toBe('');
    expect(document.body.style.scrollbarGutter).toBe('');
    expect(document.body.style.paddingRight).toBe('');
    expect(document.body.style.overflow).toBe('hidden');
    OverlayManager.releaseLock();
    restore();
  });

  it('pads the body by the scrollbar width where scrollbar-gutter is unsupported', () => {
    const restore = withCss(false);
    withScrollbar(15);
    document.body.style.paddingRight = '12px';
    OverlayManager.acquireLock();
    expect(document.body.style.paddingRight).toBe('27px');
    OverlayManager.releaseLock();
    expect(document.body.style.paddingRight).toBe('12px');
    document.body.style.removeProperty('padding-right');
    restore();
  });
});
