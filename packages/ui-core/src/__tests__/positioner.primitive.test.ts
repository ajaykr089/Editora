import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { computePositionState, createPositioner } from '../primitives/positioner';
import '../components/ui-positioner';

describe('positioner primitive', () => {
  const originalResizeObserver = globalThis.ResizeObserver;

  beforeEach(() => {
    document.body.innerHTML = '';
    Object.defineProperty(window, 'innerWidth', { value: 320, configurable: true, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 200, configurable: true, writable: true });
  });

  afterEach(() => {
    globalThis.ResizeObserver = originalResizeObserver;
  });

  it('flips placement when the preferred side overflows', () => {
    const anchor = {
      getBoundingClientRect: () =>
        ({
          top: 160,
          bottom: 184,
          left: 40,
          right: 120,
          width: 80,
          height: 24
        }) as DOMRect
    };

    const floatingRect = {
      top: 0,
      left: 0,
      right: 100,
      bottom: 60,
      width: 100,
      height: 60
    } as DOMRect;

    const state = computePositionState(anchor, floatingRect, { placement: 'bottom-start', flip: true });
    expect(state.placement).toBe('top-start');
    expect(state.y).toBeLessThan(160);
  });

  it('applies styles and width through createPositioner', () => {
    const anchor = document.createElement('button');
    const floating = document.createElement('div');
    document.body.append(anchor, floating);

    anchor.getBoundingClientRect = () =>
      ({
        top: 40,
        bottom: 72,
        left: 24,
        right: 144,
        width: 120,
        height: 32
      }) as DOMRect;
    floating.getBoundingClientRect = () =>
      ({
        top: 0,
        left: 0,
        right: 80,
        bottom: 40,
        width: 80,
        height: 40
      }) as DOMRect;

    const onUpdate = vi.fn();
    const handle = createPositioner({
      anchor,
      floating,
      placement: 'bottom',
      matchWidth: true,
      onUpdate
    });

    expect(floating.style.position).toBe('fixed');
    expect(floating.style.left).toBeTruthy();
    expect(floating.style.top).toBeTruthy();
    expect(floating.style.width).toBe('120px');
    expect(floating.getAttribute('data-placement')).toBe('bottom');
    expect(onUpdate).toHaveBeenCalled();

    handle.destroy();
  });

  it('does not observe the floating node when size constraints are positioner-managed', () => {
    const anchor = document.createElement('button');
    const floating = document.createElement('div');
    document.body.append(anchor, floating);

    anchor.getBoundingClientRect = () =>
      ({
        top: 40,
        bottom: 72,
        left: 24,
        right: 144,
        width: 120,
        height: 32
      }) as DOMRect;
    floating.getBoundingClientRect = () =>
      ({
        top: 0,
        left: 0,
        right: 220,
        bottom: 300,
        width: 220,
        height: 300
      }) as DOMRect;

    const observed: Element[] = [];
    class ResizeObserverStub {
      observe(target: Element) {
        observed.push(target);
      }
      disconnect() {
        // no-op
      }
    }
    globalThis.ResizeObserver = ResizeObserverStub as typeof ResizeObserver;

    const handle = createPositioner({
      anchor,
      floating,
      placement: 'bottom-start',
      fitViewport: true,
      matchWidth: true
    });

    expect(observed).toContain(anchor);
    expect(observed).not.toContain(floating);

    handle.destroy();
  });

  it('can disable window resize and scroll subscriptions for externally-managed overlays', () => {
    const anchor = document.createElement('button');
    const floating = document.createElement('div');
    document.body.append(anchor, floating);

    anchor.getBoundingClientRect = () =>
      ({
        top: 16,
        bottom: 48,
        left: 12,
        right: 112,
        width: 100,
        height: 32
      }) as DOMRect;
    floating.getBoundingClientRect = () =>
      ({
        top: 0,
        left: 0,
        right: 80,
        bottom: 36,
        width: 80,
        height: 36
      }) as DOMRect;

    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    const handle = createPositioner({
      anchor,
      floating,
      placement: 'bottom-start',
      observeWindowResize: false,
      observeScroll: false
    });

    expect(addSpy).not.toHaveBeenCalledWith('resize', expect.any(Function));
    expect(addSpy).not.toHaveBeenCalledWith('scroll', expect.any(Function), true);

    handle.destroy();

    expect(removeSpy).not.toHaveBeenCalledWith('resize', expect.any(Function));
    expect(removeSpy).not.toHaveBeenCalledWith('scroll', expect.any(Function), true);

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it('positions content through ui-positioner', () => {
    const host = document.createElement('ui-positioner');
    host.setAttribute('open', '');
    host.setAttribute('match-width', '');

    const anchor = document.createElement('button');
    anchor.slot = 'anchor';
    anchor.textContent = 'anchor';
    const content = document.createElement('div');
    content.slot = 'content';
    content.textContent = 'content';

    anchor.getBoundingClientRect = () =>
      ({
        top: 50,
        bottom: 82,
        left: 12,
        right: 112,
        width: 100,
        height: 32
      }) as DOMRect;
    content.getBoundingClientRect = () =>
      ({
        top: 0,
        left: 0,
        right: 80,
        bottom: 36,
        width: 80,
        height: 36
      }) as DOMRect;

    host.append(anchor, content);
    document.body.appendChild(host);

    expect(content.style.left).toBeTruthy();
    expect(content.style.top).toBeTruthy();
    expect(content.style.width).toBe('100px');
  });
});
