import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-orbiter';

function wait(ms = 48) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-orbiter', () => {
  it('annotates slotted items, center content, and renders the requested ring paths', async () => {
    const el = document.createElement('ui-orbiter');
    el.setAttribute('rings', '2');
    el.setAttribute('radius', '92');
    el.setAttribute('ring-gap', '24');
    el.setAttribute('start-angle', '-60');
    el.setAttribute('direction', 'alternate');
    el.setAttribute('icon-size', '48');
    el.setAttribute('center-size', '120');
    el.setAttribute('delay', '4');
    el.setAttribute('speed', '1.5');
    el.setAttribute('path', 'false');
    el.setAttribute('reverse', '');
    el.innerHTML = `
      <div>One</div>
      <div>Two</div>
      <div>Three</div>
      <div>Four</div>
      <div slot="center">Center</div>
    `;
    document.body.appendChild(el);
    await wait();

    const items = Array.from(el.children).filter((node) => node.getAttribute('slot') !== 'center') as HTMLElement[];
    const center = el.querySelector('[slot="center"]') as HTMLElement | null;
    const paths = el.shadowRoot?.querySelectorAll('.path');

    expect(items).toHaveLength(4);
    expect(items.every((item) => item.hasAttribute('data-ui-orbiter-item'))).toBe(true);
    expect(items[0]?.style.getPropertyValue('--ui-orbit-radius')).toBe('92px');
    expect(items[1]?.style.getPropertyValue('--ui-orbit-radius')).toContain('calc(');
    expect(items[1]?.style.getPropertyValue('--ui-orbit-duration')).toContain('* 1.14');
    expect(items[0]?.style.getPropertyValue('--ui-orbit-end-angle')).toBe('-420deg');
    expect(items[1]?.style.getPropertyValue('--ui-orbit-end-angle')).toBe('390deg');
    expect(center?.hasAttribute('data-ui-orbiter-center')).toBe(true);
    expect(paths?.length).toBe(2);
    expect(el.getAttribute('data-ring-count')).toBe('2');
    expect(el.getAttribute('data-path-visible')).toBe('false');
  });

  it('supports pause, play, and runtime style synchronization', async () => {
    const el = document.createElement('ui-orbiter') as HTMLElement & {
      play(): void;
      pause(): void;
      refresh(): void;
    };
    el.setAttribute('size', 'lg');
    el.setAttribute('animation', 'snappy');
    el.setAttribute('duration', '12');
    el.setAttribute('delay', '3');
    el.setAttribute('speed', '2');
    el.innerHTML = '<div>One</div><div>Two</div><div>Three</div>';
    document.body.appendChild(el);
    await wait();

    expect(el.style.getPropertyValue('--ui-orbiter-duration')).toBe('calc((12s) * 0.82 / 2)');
    expect(el.style.getPropertyValue('--ui-orbiter-delay')).toBe('3s');
    expect(el.style.getPropertyValue('--ui-orbiter-stage-size')).toContain('calc(');
    expect(el.getAttribute('data-state')).toBe('running');

    el.pause();
    expect(el.hasAttribute('paused')).toBe(true);
    expect(el.getAttribute('data-state')).toBe('paused');

    el.play();
    expect(el.hasAttribute('paused')).toBe(false);
    expect(el.getAttribute('data-state')).toBe('running');
  });

  it('can pause when an orbiting item is hovered if requested', async () => {
    const el = document.createElement('ui-orbiter');
    el.setAttribute('pause-on-item-hover', '');
    el.innerHTML = '<button data-ui-orbiter-item>One</button><div>Two</div>';
    document.body.appendChild(el);
    await wait();

    const firstItem = el.querySelector('[data-ui-orbiter-item]') as HTMLElement | null;
    expect(firstItem).not.toBeNull();
    expect(el.getAttribute('data-state')).toBe('running');

    firstItem?.dispatchEvent(new Event('pointerenter'));
    expect(el.getAttribute('data-state')).toBe('paused');
    expect(el.getAttribute('data-item-hovered')).toBe('true');

    firstItem?.dispatchEvent(new MouseEvent('pointerleave', { bubbles: false }));
    expect(el.getAttribute('data-state')).toBe('running');
    expect(el.getAttribute('data-item-hovered')).toBe('false');
  });
});
