import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  computePositionState,
  createPositioner,
  createVirtualRange,
  detectPositionerOverflow,
  offsetMiddleware
} from '../primitives/positioner';
import '../components/ui-positioner';

describe('positioner primitive', () => {
  const originalResizeObserver = globalThis.ResizeObserver;
  const originalGetComputedStyle = window.getComputedStyle;

  beforeEach(() => {
    document.body.innerHTML = '';
    Object.defineProperty(window, 'innerWidth', { value: 320, configurable: true, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 200, configurable: true, writable: true });
  });

  afterEach(() => {
    globalThis.ResizeObserver = originalResizeObserver;
    window.getComputedStyle = originalGetComputedStyle;
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

  it('supports custom middleware and exposes middleware data', () => {
    const anchor = {
      getBoundingClientRect: () =>
        ({
          top: 40,
          bottom: 72,
          left: 24,
          right: 104,
          width: 80,
          height: 32
        }) as DOMRect
    };

    const floatingRect = {
      top: 0,
      left: 0,
      right: 80,
      bottom: 40,
      width: 80,
      height: 40
    } as DOMRect;

    const state = computePositionState(anchor, floatingRect, {
      placement: 'bottom-start',
      middleware: [
        offsetMiddleware({ mainAxis: 12, crossAxis: 4 }),
        {
          name: 'nudge',
          fn(current) {
            return {
              x: current.x + 3,
              data: { applied: true }
            };
          }
        }
      ]
    });

    expect(state.x).toBe(31);
    expect(state.y).toBe(84);
    expect(state.middlewareData?.offset).toEqual({ x: 4, y: 4 });
    expect(state.middlewareData?.nudge).toEqual({ applied: true });
  });

  it('allows platform overrides for measurement and clipping', () => {
    const anchor = {
      getBoundingClientRect: () =>
        ({
          top: 0,
          bottom: 10,
          left: 0,
          right: 10,
          width: 10,
          height: 10
        }) as DOMRect
    };
    const floatingRect = {
      top: 0,
      left: 0,
      right: 10,
      bottom: 10,
      width: 10,
      height: 10
    } as DOMRect;

    const state = computePositionState(anchor, floatingRect, {
      placement: 'bottom-start',
      shift: true,
      boundaryPadding: 0,
      platform: {
        getElementRects: () => ({
          reference: {
            top: 20,
            bottom: 40,
            left: 20,
            right: 40,
            width: 20,
            height: 20
          } as DOMRect,
          floating: {
            top: 0,
            left: 0,
            right: 40,
            bottom: 30,
            width: 40,
            height: 30
          } as DOMRect
        }),
        getClippingRect: () => ({
          top: 0,
          left: 0,
          right: 50,
          bottom: 70,
          width: 50,
          height: 70
        })
      }
    });

    expect(state.x).toBe(10);
    expect(state.y).toBe(40);
    expect(state.rects?.reference.left).toBe(20);
    expect(state.rects?.floating.width).toBe(40);
  });

  it('detects overflow against the resolved clipping boundary', () => {
    const overflow = detectPositionerOverflow({
      x: 280,
      y: 170,
      padding: 4,
      boundary: {
        top: 0,
        left: 0,
        right: 320,
        bottom: 200,
        width: 320,
        height: 200
      },
      rects: {
        reference: {
          top: 0,
          bottom: 20,
          left: 0,
          right: 20,
          width: 20,
          height: 20
        } as DOMRect,
        floating: {
          top: 0,
          bottom: 60,
          left: 0,
          right: 80,
          width: 80,
          height: 60
        } as DOMRect
      }
    });

    expect(overflow.right).toBe(44);
    expect(overflow.bottom).toBe(34);
    expect(overflow.left).toBeLessThan(0);
    expect(overflow.top).toBeLessThan(0);
  });

  it('uses overflow ancestors as clipping boundaries', () => {
    const clippingParent = document.createElement('div');
    const anchor = document.createElement('button');
    const floating = document.createElement('div');
    clippingParent.append(anchor, floating);
    document.body.append(clippingParent);

    window.getComputedStyle = ((element: Element) => {
      return {
        overflow: element === clippingParent ? 'hidden' : 'visible',
        overflowX: element === clippingParent ? 'hidden' : 'visible',
        overflowY: element === clippingParent ? 'hidden' : 'visible',
        direction: 'ltr'
      } as Partial<CSSStyleDeclaration> as CSSStyleDeclaration;
    }) as typeof window.getComputedStyle;

    clippingParent.getBoundingClientRect = () =>
      ({
        top: 10,
        bottom: 130,
        left: 10,
        right: 170,
        width: 160,
        height: 120
      }) as DOMRect;
    anchor.getBoundingClientRect = () =>
      ({
        top: 96,
        bottom: 120,
        left: 36,
        right: 116,
        width: 80,
        height: 24
      }) as DOMRect;
    floating.getBoundingClientRect = () =>
      ({
        top: 0,
        bottom: 80,
        left: 0,
        right: 120,
        width: 120,
        height: 80
      }) as DOMRect;

    const state = computePositionState(anchor, floating, {
      placement: 'bottom-start',
      fitViewport: true,
      boundaryPadding: 0
    });

    expect(state.availableHeight).toBeLessThanOrEqual(120);
    expect(state.y + 80).toBeLessThanOrEqual(130);
  });

  it('supports inline virtual ranges by choosing the placement-aware rect', () => {
    const range = {
      getBoundingClientRect: () =>
        ({
          top: 20,
          bottom: 60,
          left: 20,
          right: 180,
          width: 160,
          height: 40
        }) as DOMRect,
      getClientRects: () =>
        [
          {
            top: 20,
            bottom: 36,
            left: 20,
            right: 100,
            width: 80,
            height: 16
          },
          {
            top: 44,
            bottom: 60,
            left: 120,
            right: 180,
            width: 60,
            height: 16
          }
        ] as unknown as DOMRectList
    } as Range;
    const floatingRect = {
      top: 0,
      bottom: 30,
      left: 0,
      right: 50,
      width: 50,
      height: 30
    } as DOMRect;

    const state = computePositionState(createVirtualRange(range), floatingRect, {
      placement: 'bottom-start',
      inline: true,
      offset: 0
    });

    expect(state.x).toBe(120);
    expect(state.y).toBe(60);
  });

  it('supports RTL horizontal start and end alignment', () => {
    const anchor = document.createElement('button');
    const floating = document.createElement('div');
    document.body.append(anchor, floating);
    anchor.style.direction = 'rtl';
    anchor.getBoundingClientRect = () =>
      ({
        top: 40,
        bottom: 70,
        left: 100,
        right: 200,
        width: 100,
        height: 30
      }) as DOMRect;
    floating.getBoundingClientRect = () =>
      ({
        top: 0,
        bottom: 40,
        left: 0,
        right: 60,
        width: 60,
        height: 40
      }) as DOMRect;

    const start = computePositionState(anchor, floating, {
      placement: 'bottom-start',
      dir: 'rtl',
      offset: 0
    });
    const end = computePositionState(anchor, floating, {
      placement: 'bottom-end',
      dir: 'rtl',
      offset: 0
    });

    expect(start.x).toBe(140);
    expect(end.x).toBe(100);
  });

  it('constrains auto placement to allowed placements and reports hide data', () => {
    const anchor = {
      getBoundingClientRect: () =>
        ({
          top: 260,
          bottom: 284,
          left: 340,
          right: 420,
          width: 80,
          height: 24
        }) as DOMRect
    };
    const floatingRect = {
      top: 0,
      bottom: 80,
      left: 0,
      right: 100,
      width: 100,
      height: 80
    } as DOMRect;

    const state = computePositionState(anchor, floatingRect, {
      autoPlacement: true,
      allowedPlacements: ['top', 'left'],
      hideWhenDetached: true
    });

    expect(['top', 'left']).toContain(state.placement);
    expect(state.middlewareData?.autoPlacement?.overflows).toHaveLength(2);
    expect(state.middlewareData?.hide?.referenceHidden).toBe(true);
    expect(state.referenceHidden).toBe(true);
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

  it('recomputes placement on scroll when the anchor moves across the clipping boundary', () => {
    vi.useFakeTimers();
    const anchor = document.createElement('button');
    const floating = document.createElement('div');
    document.body.append(anchor, floating);

    let anchorRect = {
      top: 24,
      bottom: 56,
      left: 24,
      right: 124,
      width: 100,
      height: 32
    };

    anchor.getBoundingClientRect = () => anchorRect as DOMRect;
    floating.getBoundingClientRect = () =>
      ({
        top: 0,
        left: 0,
        right: 120,
        bottom: 72,
        width: 120,
        height: 72
      }) as DOMRect;

    const handle = createPositioner({
      anchor,
      floating,
      placement: 'bottom-start',
      flip: true
    });

    expect(floating.getAttribute('data-placement')).toBe('bottom-start');

    anchorRect = {
      top: 160,
      bottom: 192,
      left: 24,
      right: 124,
      width: 100,
      height: 32
    };

    window.dispatchEvent(new Event('scroll'));
    vi.advanceTimersByTime(20);

    expect(floating.getAttribute('data-placement')).toBe('top-start');

    handle.destroy();
    vi.useRealTimers();
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
