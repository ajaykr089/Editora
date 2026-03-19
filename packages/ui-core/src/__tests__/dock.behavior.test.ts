import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-dock';

function flush() {
  return new Promise((resolve) => setTimeout(resolve, 24));
}

function readScale(transform: string): number {
  const match = transform.match(/scale\(([^)]+)\)/);
  return match ? Number(match[1]) : 1;
}

function readTranslateX(transform: string): number {
  const match = transform.match(/translate3d\(([-\d.]+)px,\s*([-\d.]+)px,\s*0\)/);
  return match ? Number(match[1]) : 0;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-dock', () => {
  it('magnifies nearby items and reveals their labels on pointer movement', async () => {
    const el = document.createElement('ui-dock');
    el.setAttribute('magnification', '2.4');
    el.setAttribute('distance', '180');
    el.setAttribute('gap', '0');
    el.innerHTML = `
      <button data-ui-dock-item>
        <span data-ui-dock-icon>H</span>
        <span data-ui-dock-label>Home</span>
      </button>
      <button data-ui-dock-item>
        <span data-ui-dock-icon>S</span>
        <span data-ui-dock-label>Search</span>
      </button>
      <button data-ui-dock-item>
        <span data-ui-dock-icon>R</span>
        <span data-ui-dock-label>Review</span>
      </button>
    `;
    document.body.appendChild(el);
    await flush();

    const frame = el.shadowRoot?.querySelector('.frame') as HTMLElement | null;
    const items = Array.from(el.children) as HTMLElement[];
    const firstLabel = items[0]?.querySelector('[data-ui-dock-label]') as HTMLElement | null;

    frame!.getBoundingClientRect = () =>
      ({ width: 220, height: 100, top: 0, left: 0, right: 220, bottom: 100, x: 0, y: 0, toJSON() {} }) as DOMRect;
    items[0]!.getBoundingClientRect = () =>
      ({ width: 56, height: 56, top: 20, left: 20, right: 76, bottom: 76, x: 20, y: 20, toJSON() {} }) as DOMRect;
    items[1]!.getBoundingClientRect = () =>
      ({ width: 56, height: 56, top: 20, left: 76, right: 132, bottom: 76, x: 76, y: 20, toJSON() {} }) as DOMRect;
    items[2]!.getBoundingClientRect = () =>
      ({ width: 56, height: 56, top: 20, left: 132, right: 188, bottom: 76, x: 132, y: 20, toJSON() {} }) as DOMRect;

    (el as HTMLElement & { refresh(): void }).refresh();
    frame?.dispatchEvent(new MouseEvent('pointermove', { bubbles: true, clientX: 48, clientY: 40 }));
    await flush();
    await flush();

    expect(readScale(items[0]!.style.transform)).toBeGreaterThan(1.2);
    expect(readScale(items[1]!.style.transform)).toBeLessThan(readScale(items[0]!.style.transform));
    expect(readTranslateX(items[0]!.style.transform)).toBeLessThan(0);
    expect(readTranslateX(items[1]!.style.transform)).toBeGreaterThan(0);
    expect(firstLabel?.style.opacity).toBe('1');
    expect(el.getAttribute('data-state')).toBe('pointer');
  });

  it('supports roving focus keyboard navigation and clears active state on escape', async () => {
    const el = document.createElement('ui-dock') as HTMLElement & {
      refresh(): void;
      focusItem(target: number | string): void;
      clearActive(): void;
    };
    el.innerHTML = `
      <button data-ui-dock-item data-value="home"><span data-ui-dock-icon>H</span><span data-ui-dock-label>Home</span></button>
      <button data-ui-dock-item data-value="notifications" disabled><span data-ui-dock-icon>N</span><span data-ui-dock-label>Notifications</span></button>
      <button data-ui-dock-item data-value="settings"><span data-ui-dock-icon>S</span><span data-ui-dock-label>Settings</span></button>
    `;
    document.body.appendChild(el);
    await flush();

    const items = Array.from(el.children) as HTMLButtonElement[];
    el.focusItem('home');
    await flush();

    expect(document.activeElement).toBe(items[0]);
    expect(el.getAttribute('data-state')).toBe('keyboard');
    expect(items[0]?.tabIndex).toBe(0);

    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await flush();

    expect(document.activeElement).toBe(items[2]);
    expect(items[2]?.tabIndex).toBe(0);
    expect(items[0]?.tabIndex).toBe(-1);

    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await flush();

    expect(el.getAttribute('data-state')).toBe('idle');
  });

  it('applies visual token overrides for gap, padding, item size, and radius', async () => {
    const el = document.createElement('ui-dock');
    el.setAttribute('gap', '18');
    el.setAttribute('padding', '12 16');
    el.setAttribute('item-size', '64');
    el.setAttribute('radius', '28');
    el.innerHTML = `
      <button data-ui-dock-item>
        <span data-ui-dock-icon>H</span>
        <span data-ui-dock-label>Home</span>
      </button>
    `;
    document.body.appendChild(el);
    await flush();

    expect(el.style.getPropertyValue('--ui-dock-gap')).toBe('18px');
    expect(el.style.getPropertyValue('--ui-dock-padding')).toBe('12px 16px');
    expect(el.style.getPropertyValue('--ui-dock-item-size')).toBe('64px');
    expect(el.style.getPropertyValue('--ui-dock-icon-size')).toBe('calc(64px * 0.44)');
    expect(el.style.getPropertyValue('--ui-dock-radius')).toBe('28px');
    expect(el.style.getPropertyValue('--ui-dock-item-radius')).toBe('calc(28px * 0.82)');
  });

  it('binds label styling to dock size and variant tokens', async () => {
    const el = document.createElement('ui-dock');
    el.setAttribute('size', 'xl');
    el.setAttribute('variant', 'soft');
    el.innerHTML = `
      <button data-ui-dock-item>
        <span data-ui-dock-icon>H</span>
        <span data-ui-dock-label>Home</span>
      </button>
    `;
    document.body.appendChild(el);
    await flush();

    const label = el.querySelector('[data-ui-dock-label]') as HTMLElement | null;
    const styleText = label?.getAttribute('style') || '';
    expect(el.getAttribute('size')).toBe('xl');
    expect(el.getAttribute('variant')).toBe('soft');
    expect(styleText).toContain('border-radius: var(--ui-dock-label-radius);');
    expect(styleText).toContain('box-shadow: var(--ui-dock-label-shadow);');
    expect(styleText).toContain('font-weight: var(--ui-dock-label-font-weight);');
  });

  it('supports animation presets and extended size variants', async () => {
    const el = document.createElement('ui-dock');
    el.setAttribute('animation', 'bouncy');
    el.setAttribute('size', 'xl');
    el.setAttribute('gap', '0');
    el.setAttribute('magnification', '2.5');
    el.innerHTML = `
      <button data-ui-dock-item>
        <span data-ui-dock-icon>H</span>
        <span data-ui-dock-label>Home</span>
      </button>
      <button data-ui-dock-item>
        <span data-ui-dock-icon>S</span>
        <span data-ui-dock-label>Search</span>
      </button>
    `;
    document.body.appendChild(el);
    await flush();

    const frame = el.shadowRoot?.querySelector('.frame') as HTMLElement | null;
    const items = Array.from(el.children) as HTMLElement[];

    frame!.getBoundingClientRect = () =>
      ({ width: 260, height: 112, top: 0, left: 0, right: 260, bottom: 112, x: 0, y: 0, toJSON() {} }) as DOMRect;
    items[0]!.getBoundingClientRect = () =>
      ({ width: 74, height: 74, top: 20, left: 26, right: 100, bottom: 94, x: 26, y: 20, toJSON() {} }) as DOMRect;
    items[1]!.getBoundingClientRect = () =>
      ({ width: 74, height: 74, top: 20, left: 126, right: 200, bottom: 94, x: 126, y: 20, toJSON() {} }) as DOMRect;

    (el as HTMLElement & { refresh(): void }).refresh();
    frame?.dispatchEvent(new MouseEvent('pointermove', { bubbles: true, clientX: 58, clientY: 40 }));
    await flush();
    await flush();

    expect(el.getAttribute('animation')).toBe('bouncy');
    expect(el.getAttribute('size')).toBe('xl');
    expect(readScale(items[0]!.style.transform)).toBeGreaterThan(1.1);
    expect(readTranslateX(items[0]!.style.transform)).toBeLessThan(0);
  });
});
