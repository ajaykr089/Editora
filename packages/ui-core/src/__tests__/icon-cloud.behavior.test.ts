import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-icon-cloud';

function wait(ms = 72) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-icon-cloud', () => {
  it('annotates slotted items, center content, and applies projected positions', async () => {
    const el = document.createElement('ui-icon-cloud');
    el.setAttribute('radius', '128');
    el.setAttribute('item-size', '56');
    el.setAttribute('center-size', '120');
    el.setAttribute('perspective', '960');
    el.setAttribute('depth', '0.92');
    el.setAttribute('interactive', '');
    el.innerHTML = `
      <button aria-label="Search">S</button>
      <button aria-label="Trust">T</button>
      <button aria-label="Metrics">M</button>
      <button aria-label="Layers">L</button>
      <div slot="center">Core</div>
    `;
    document.body.appendChild(el);
    await wait();

    const items = Array.from(el.children).filter((node) => node.getAttribute('slot') !== 'center') as HTMLElement[];
    const center = el.querySelector('[slot="center"]') as HTMLElement | null;

    expect(items).toHaveLength(4);
    expect(items.every((item) => item.hasAttribute('data-ui-icon-cloud-item'))).toBe(true);
    expect(items.every((item) => item.style.getPropertyValue('--ui-icon-cloud-x') !== '')).toBe(true);
    expect(items.every((item) => item.style.getPropertyValue('--ui-icon-cloud-scale') !== '')).toBe(true);
    expect(center?.hasAttribute('data-ui-icon-cloud-center')).toBe(true);
    expect(el.style.getPropertyValue('--ui-icon-cloud-radius')).toBe('128px');
    expect(el.style.getPropertyValue('--ui-icon-cloud-item-size')).toBe('56px');
    expect(el.getAttribute('data-count')).toBe('4');
    expect(el.getAttribute('data-has-center')).toBe('true');
    expect(el.getAttribute('data-state')).toBe('running');
  });

  it('supports pause, play, and runtime style synchronization', async () => {
    const el = document.createElement('ui-icon-cloud') as HTMLElement & {
      play(): void;
      pause(): void;
      refresh(): void;
    };
    el.setAttribute('size', 'lg');
    el.setAttribute('speed', '1.6');
    el.setAttribute('direction', 'counterclockwise');
    el.setAttribute('surface-radius', '34');
    el.setAttribute('padding', '24');
    el.setAttribute('interactive', '');
    el.innerHTML = '<div>One</div><div>Two</div><div>Three</div>';
    document.body.appendChild(el);
    await wait();

    expect(el.style.getPropertyValue('--ui-icon-cloud-shell-radius')).toBe('34px');
    expect(el.style.getPropertyValue('--ui-icon-cloud-padding')).toBe('24px');
    expect(el.style.getPropertyValue('--ui-icon-cloud-stage-size')).toContain('calc(');
    expect(el.getAttribute('data-interactive')).toBe('true');
    expect(el.getAttribute('data-state')).toBe('running');

    el.pause();
    expect(el.hasAttribute('paused')).toBe(true);
    expect(el.getAttribute('data-state')).toBe('paused');

    el.play();
    expect(el.hasAttribute('paused')).toBe(false);
    expect(el.getAttribute('data-state')).toBe('running');

    el.refresh();
    await wait();
    expect(el.querySelectorAll('[data-ui-icon-cloud-item]').length).toBe(3);
  });

  it('can pause when an item is hovered if requested', async () => {
    const el = document.createElement('ui-icon-cloud');
    el.setAttribute('pause-on-item-hover', '');
    el.innerHTML = '<button data-ui-icon-cloud-item>One</button><div>Two</div>';
    document.body.appendChild(el);
    await wait();

    const firstItem = el.querySelector('[data-ui-icon-cloud-item]') as HTMLElement | null;
    expect(firstItem).not.toBeNull();
    expect(el.getAttribute('data-state')).toBe('running');

    firstItem?.dispatchEvent(new Event('pointerover', { bubbles: true }));
    expect(el.getAttribute('data-state')).toBe('paused');
    expect(el.getAttribute('data-item-hovered')).toBe('true');

    firstItem?.dispatchEvent(new MouseEvent('pointerout', { bubbles: true }));
    expect(el.getAttribute('data-state')).toBe('running');
    expect(el.getAttribute('data-item-hovered')).toBe('false');
  });

  it('can auto-fit the cloud to a narrower container width', async () => {
    const el = document.createElement('ui-icon-cloud');
    el.setAttribute('radius', '128');
    el.setAttribute('item-size', '56');
    el.setAttribute('padding', '24');
    el.setAttribute('auto-fit', '');
    el.innerHTML = '<div>One</div><div>Two</div><div>Three</div><div>Four</div>';
    Object.defineProperty(el, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        width: 180,
        height: 220,
        top: 0,
        left: 0,
        right: 180,
        bottom: 220,
        x: 0,
        y: 0,
        toJSON() {
          return {};
        },
      }),
    });

    document.body.appendChild(el);
    await wait();

    const scale = Number.parseFloat(el.getAttribute('data-auto-fit-scale') || '1');
    expect(el.getAttribute('data-auto-fit')).toBe('true');
    expect(scale).toBeLessThan(1);
    expect(el.style.getPropertyValue('--ui-icon-cloud-fit-inline-size')).toBeTruthy();
    expect(el.style.getPropertyValue('--ui-icon-cloud-fit-block-size')).toBeTruthy();
  });
});
