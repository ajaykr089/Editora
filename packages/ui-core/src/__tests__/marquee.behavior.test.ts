import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-marquee';

function flush() {
  return new Promise((resolve) => setTimeout(resolve, 24));
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-marquee', () => {
  it('duplicates content lanes and computes runtime distance + duration', async () => {
    const el = document.createElement('ui-marquee');
    el.setAttribute('speed', '60');
    el.setAttribute('gap', '20');
    el.innerHTML = '<span>Alpha</span><span>Beta</span>';
    document.body.appendChild(el);
    await flush();

    const viewport = el.shadowRoot?.querySelector('.viewport') as HTMLElement | null;
    const source = el.shadowRoot?.querySelector('.source') as HTMLElement | null;

    Object.defineProperty(viewport!, 'clientWidth', { configurable: true, value: 320 });
    Object.defineProperty(source!, 'scrollWidth', { configurable: true, value: 100 });
    source!.getBoundingClientRect = () =>
      ({ width: 100, height: 24, top: 0, left: 0, right: 100, bottom: 24, x: 0, y: 0, toJSON() {} }) as DOMRect;

    el.refresh();
    await flush();

    expect(el.style.getPropertyValue('--ui-marquee-distance')).toBe('120px');
    expect(el.style.getPropertyValue('--ui-marquee-duration')).toBe('2s');
    expect(el.getAttribute('data-state')).toBe('running');
    expect(el.shadowRoot?.querySelectorAll('.lane--clone').length).toBeGreaterThan(2);
  });

  it('applies and clears custom visual token overrides for radius and padding', async () => {
    const el = document.createElement('ui-marquee');
    el.setAttribute('radius', '20');
    el.setAttribute('padding', '12px 20px');
    el.setAttribute('variant', 'glass');
    el.setAttribute('tone', 'warning');
    el.setAttribute('elevation', 'high');
    el.innerHTML = '<span data-ui-marquee-item>Alpha</span>';
    document.body.appendChild(el);
    await flush();

    expect(el.style.getPropertyValue('--ui-marquee-radius')).toBe('20px');
    expect(el.style.getPropertyValue('--ui-marquee-padding')).toBe('12px 20px');
    expect(el.getAttribute('variant')).toBe('glass');
    expect(el.getAttribute('tone')).toBe('warning');
    expect(el.getAttribute('elevation')).toBe('high');

    el.setAttribute('radius', 'full');
    el.removeAttribute('padding');
    await flush();

    expect(el.style.getPropertyValue('--ui-marquee-radius')).toBe('');
    expect(el.style.getPropertyValue('--ui-marquee-padding')).toBe('');
  });

  it('sanitizes cloned interactive content and exposes pause/play methods', async () => {
    const el = document.createElement('ui-marquee') as HTMLElement & {
      pause(): void;
      play(): void;
      refresh(): void;
    };
    el.innerHTML = '<button id="cta">Play</button>';
    document.body.appendChild(el);
    await flush();

    const viewport = el.shadowRoot?.querySelector('.viewport') as HTMLElement | null;
    const source = el.shadowRoot?.querySelector('.source') as HTMLElement | null;
    Object.defineProperty(viewport!, 'clientWidth', { configurable: true, value: 180 });
    Object.defineProperty(source!, 'scrollWidth', { configurable: true, value: 120 });
    source!.getBoundingClientRect = () =>
      ({ width: 120, height: 32, top: 0, left: 0, right: 120, bottom: 32, x: 0, y: 0, toJSON() {} }) as DOMRect;

    el.refresh();
    await flush();

    const cloneButton = el.shadowRoot?.querySelector('.lane--clone button') as HTMLButtonElement | null;
    expect(cloneButton).not.toBeNull();
    expect(cloneButton?.id).toBe('');
    expect(cloneButton?.getAttribute('tabindex')).toBe('-1');
    expect(cloneButton?.disabled).toBe(true);

    el.pause();
    expect(el.hasAttribute('paused')).toBe(true);
    expect(el.getAttribute('data-state')).toBe('paused');

    el.play();
    expect(el.hasAttribute('paused')).toBe(false);
    expect(el.getAttribute('data-state')).toBe('running');
  });
});
