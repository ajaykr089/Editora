import { afterEach, describe, expect, it, vi } from 'vitest';
import '../components/ui-animated-list';

function wait(ms = 48) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('ui-animated-list', () => {
  it('annotates slotted items and applies runtime style overrides', async () => {
    const el = document.createElement('ui-animated-list');
    el.setAttribute('trigger', 'manual');
    el.setAttribute('duration', '160');
    el.setAttribute('stagger', '40');
    el.setAttribute('delay', '20');
    el.setAttribute('radius', '22');
    el.setAttribute('padding', '12 18');
    el.setAttribute('gap', '14');
    el.setAttribute('variant', 'glass');
    el.setAttribute('tone', 'warning');
    el.setAttribute('elevation', 'high');
    el.innerHTML = '<div>Alpha</div><div>Beta</div><div>Gamma</div>';
    document.body.appendChild(el);
    await wait();

    const items = Array.from(el.children) as HTMLElement[];
    expect(items).toHaveLength(3);
    expect(items.every((item) => item.hasAttribute('data-ui-animated-list-item'))).toBe(true);
    expect(items.map((item) => item.style.getPropertyValue('--ui-animated-list-index'))).toEqual(['0', '1', '2']);
    expect(el.style.getPropertyValue('--ui-animated-list-padding')).toBe('12px 18px');
    expect(el.style.getPropertyValue('--ui-animated-list-gap')).toBe('14px');
    expect(el.style.getPropertyValue('--ui-animated-list-radius')).toBe('22px');
    expect(el.getAttribute('data-phase')).toBe('ready');
  });

  it('plays to completion and supports pause + replay', async () => {
    const animateSpy = vi.fn(() => ({
      pause: vi.fn(),
      play: vi.fn(),
      cancel: vi.fn(),
    }));
    const originalAnimate = (HTMLElement.prototype as HTMLElement & { animate?: unknown }).animate;
    Object.defineProperty(HTMLElement.prototype, 'animate', {
      configurable: true,
      writable: true,
      value: animateSpy,
    });
    vi.stubGlobal('requestAnimationFrame', ((cb: FrameRequestCallback) => {
      cb(0);
      return 1;
    }) as typeof requestAnimationFrame);
    vi.stubGlobal('cancelAnimationFrame', (() => {}) as typeof cancelAnimationFrame);
    try {
      const el = document.createElement('ui-animated-list') as HTMLElement & {
        play(): void;
        pause(): void;
        replay(): void;
        refresh(): void;
      };
      el.setAttribute('trigger', 'manual');
      el.setAttribute('animation', 'snappy');
      el.setAttribute('duration', '18');
      el.setAttribute('stagger', '8');
      el.innerHTML = '<div>Alpha</div><div>Beta</div>';
      document.body.appendChild(el);
      await wait();

      el.play();
      await wait(8);
      expect(animateSpy).toHaveBeenCalled();

      el.pause();
      expect(el.hasAttribute('paused')).toBe(true);
      expect(el.getAttribute('data-state')).toBe('paused');

      el.replay();
      await wait(80);
      expect(el.hasAttribute('paused')).toBe(false);
      expect(el.getAttribute('data-phase')).toBe('complete');
      expect(el.getAttribute('data-state')).toBe('complete');
      const [, firstOptions] = animateSpy.mock.calls[0] as [Keyframe[], KeyframeAnimationOptions];
      expect(firstOptions.easing).toBe('cubic-bezier(0.16, 1, 0.3, 1)');
      expect(firstOptions.duration).toBeCloseTo(15.84);
    } finally {
      Object.defineProperty(HTMLElement.prototype, 'animate', {
        configurable: true,
        writable: true,
        value: originalAnimate,
      });
    }
  });

  it('starts when entering view for visible trigger mode', async () => {
    const observed: Array<(entries: Array<{ isIntersecting: boolean; intersectionRatio: number }>) => void> = [];
    class MockIntersectionObserver {
      private callback: (entries: Array<{ isIntersecting: boolean; intersectionRatio: number }>) => void;
      constructor(callback: (entries: Array<{ isIntersecting: boolean; intersectionRatio: number }>) => void) {
        this.callback = callback;
        observed.push(this.callback);
      }
      observe() {}
      disconnect() {}
      unobserve() {}
    }

    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

    const el = document.createElement('ui-animated-list');
    el.setAttribute('trigger', 'visible');
    el.setAttribute('duration', '12');
    el.setAttribute('stagger', '6');
    el.innerHTML = '<div>Alpha</div><div>Beta</div>';
    document.body.appendChild(el);
    await wait();

    expect(el.getAttribute('data-phase')).toBe('ready');
    observed[0]?.([{ isIntersecting: true, intersectionRatio: 1 }]);
    await wait(64);

    expect(el.getAttribute('data-phase')).toBe('complete');
  });
});
