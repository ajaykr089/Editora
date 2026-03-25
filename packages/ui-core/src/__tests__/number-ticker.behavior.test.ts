import { afterEach, describe, expect, it, vi } from 'vitest';
import '../components/ui-number-ticker';

function wait(ms = 48) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-number-ticker', () => {
  it('counts from the starting value to the target and formats the final output', async () => {
    const el = document.createElement('ui-number-ticker');
    el.setAttribute('value', '12842');
    el.setAttribute('from', '12000');
    el.setAttribute('duration', '36');
    document.body.appendChild(el);
    await wait(180);

    const value = el.shadowRoot?.querySelector('.value') as HTMLElement | null;
    expect(value?.textContent).toBe('12,842');
    expect(el.getAttribute('data-state')).toBe('completed');
    expect(el.getAttribute('data-direction')).toBe('up');
  });

  it('applies formatting options and supports play pause refresh finish controls', async () => {
    const el = document.createElement('ui-number-ticker') as HTMLElement & {
      play(): void;
      pause(): void;
      refresh(): void;
      finish(): void;
    };
    el.setAttribute('value', '9876.5');
    el.setAttribute('from', '9000');
    el.setAttribute('duration', '120');
    el.setAttribute('format-style', 'currency');
    el.setAttribute('currency', 'USD');
    el.setAttribute('notation', 'compact');
    el.setAttribute('fraction-digits', '1');
    el.setAttribute('prefix', '~');
    el.setAttribute('suffix', ' ARR');
    el.setAttribute('paused', '');
    document.body.appendChild(el);
    await wait();

    const value = el.shadowRoot?.querySelector('.value') as HTMLElement | null;
    expect(value?.textContent).toContain('~');
    expect(value?.textContent).toContain('ARR');
    expect(el.getAttribute('data-state')).toBe('paused');

    el.play();
    await wait(32);
    expect(el.getAttribute('data-state')).toBe('running');

    el.pause();
    expect(el.getAttribute('data-state')).toBe('paused');

    el.refresh();
    expect(el.getAttribute('data-state')).toBe('paused');

    el.play();
    el.finish();
    expect(el.getAttribute('data-state')).toBe('completed');
    expect(value?.textContent).toContain('ARR');
  });

  it('snaps to the final value when reduced motion is preferred', async () => {
    const originalMatchMedia = window.matchMedia;
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: () => ({
        matches: true,
        media: '(prefers-reduced-motion: reduce)',
        onchange: null,
        addEventListener() {},
        removeEventListener() {},
        addListener() {},
        removeListener() {},
        dispatchEvent() {
          return false;
        },
      }),
    });

    const el = document.createElement('ui-number-ticker');
    el.setAttribute('value', '64');
    el.setAttribute('from', '0');
    el.setAttribute('duration', '800');
    document.body.appendChild(el);
    await wait();

    const value = el.shadowRoot?.querySelector('.value') as HTMLElement | null;
    expect(value?.textContent).toBe('64');
    expect(el.getAttribute('data-state')).toBe('completed');

    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: originalMatchMedia,
    });
  });

  it('renders per-digit odometer markup with stagger support', async () => {
    const el = document.createElement('ui-number-ticker');
    el.setAttribute('value', '12842');
    el.setAttribute('from', '12000');
    el.setAttribute('duration', '40');
    el.setAttribute('animation', 'odometer');
    el.setAttribute('stagger', '18');
    el.setAttribute('stagger-from', 'end');
    document.body.appendChild(el);
    await wait(120);

    const value = el.shadowRoot?.querySelector('.value') as HTMLElement | null;
    const digits = value?.querySelectorAll('.digit') || [];
    expect(value?.getAttribute('data-mode')).toBe('odometer');
    expect(digits.length).toBeGreaterThan(0);
    expect(digits[0]?.getAttribute('part')).toBe('digit');
    expect((digits[0] as HTMLElement)?.style.getPropertyValue('--ui-number-ticker-digit-delay')).not.toBe('');
    expect(el.getAttribute('data-rendered')).toBe('12,842');
  });

  it('waits to start when trigger is set to visible', async () => {
    const observers: Array<{
      callback: IntersectionObserverCallback;
    }> = [];

    class MockIntersectionObserver {
      callback: IntersectionObserverCallback;

      constructor(callback: IntersectionObserverCallback) {
        this.callback = callback;
        observers.push({ callback });
      }

      observe() {}
      unobserve() {}
      disconnect() {}
    }

    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

    const el = document.createElement('ui-number-ticker');
    el.setAttribute('value', '64');
    el.setAttribute('from', '0');
    el.setAttribute('duration', '36');
    el.setAttribute('trigger', 'visible');
    document.body.appendChild(el);
    await wait(24);

    expect(el.getAttribute('data-state')).toBe('waiting');
    expect(el.getAttribute('data-rendered')).toBe('0');

    observers[0]?.callback([
      {
        isIntersecting: true,
        intersectionRatio: 1,
      } as IntersectionObserverEntry,
    ], {} as IntersectionObserver);

    await wait(120);
    expect(el.getAttribute('data-state')).toBe('completed');
    expect(el.getAttribute('data-rendered')).toBe('64');

    vi.unstubAllGlobals();
  });

  it('supports custom formatter callbacks and advanced easing presets', async () => {
    const el = document.createElement('ui-number-ticker') as HTMLElement & {
      formatter: ((value: number, context: { formatted: string }) => string) | null;
    };
    el.setAttribute('value', '2400');
    el.setAttribute('from', '1200');
    el.setAttribute('duration', '40');
    el.setAttribute('easing', 'spring');
    el.formatter = (value, context) => `${context.formatted} MRR`;
    document.body.appendChild(el);
    await wait(120);

    const value = el.shadowRoot?.querySelector('.value') as HTMLElement | null;
    expect(value?.textContent).toContain('MRR');

    el.setAttribute('easing', 'bounce');
    el.setAttribute('from', '2400');
    el.setAttribute('value', '1800');
    await wait(120);
    expect(el.getAttribute('data-direction')).toBe('down');
    expect(el.getAttribute('data-state')).toBe('completed');
  });
});
