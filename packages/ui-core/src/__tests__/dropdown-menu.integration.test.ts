import { beforeEach, describe, expect, it } from 'vitest';
import '../components/ui-dropdown';
import '../components/ui-menu';

function flushMicrotask() {
  return Promise.resolve();
}

describe('ui-dropdown and ui-menu integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    const root = document.getElementById('ui-portal-root');
    if (root?.parentElement) root.parentElement.removeChild(root);
  });

  it('ui-dropdown opens from trigger click and closes on outside pointerdown', async () => {
    const outside = document.createElement('button');
    const el = document.createElement('ui-dropdown') as HTMLElement;
    el.innerHTML = `
      <button slot="trigger">Open</button>
      <div slot="content"><button class="item">One</button></div>
    `;
    document.body.append(outside, el);
    await flushMicrotask();

    const trigger = el.querySelector('[slot="trigger"]') as HTMLButtonElement;
    trigger.click();
    await flushMicrotask();

    expect(el.hasAttribute('open')).toBe(true);
    expect((el as HTMLElement & { _portalEl?: HTMLElement | null })._portalEl).toBeTruthy();

    outside.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    await flushMicrotask();

    expect(el.hasAttribute('open')).toBe(false);
  });

  it('ui-dropdown keeps portal node stable across visual updates while open', async () => {
    const el = document.createElement('ui-dropdown') as HTMLElement & { _portalEl?: HTMLElement | null };
    el.innerHTML = `
      <button slot="trigger">Open</button>
      <div slot="content"><button class="item">One</button></div>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    el.setAttribute('open', '');
    await flushMicrotask();

    const portalBefore = el._portalEl;
    expect(portalBefore).toBeTruthy();

    el.setAttribute('variant', 'contrast');
    el.setAttribute('size', 'lg');
    el.setAttribute('density', 'comfortable');
    el.setAttribute('radius', '16');
    await flushMicrotask();

    expect(el._portalEl).toBe(portalBefore);
    expect(el._portalEl?.getAttribute('data-size')).toBe('lg');
    expect(el._portalEl?.style.getPropertyValue('--ui-dropdown-radius')).toBe('16px');
  });

  it('ui-dropdown mirrors theme surface props onto the portaled menu', async () => {
    const el = document.createElement('ui-dropdown') as HTMLElement & { _portalEl?: HTMLElement | null };
    el.innerHTML = `
      <button slot="trigger">Open</button>
      <div slot="content"><button class="item">One</button></div>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    el.setAttribute('variant', 'glass');
    el.setAttribute('size', 'sm');
    el.setAttribute('tone', 'warning');
    el.setAttribute('radius', 'full');
    el.setAttribute('open', '');
    await flushMicrotask();

    expect(el._portalEl?.getAttribute('data-variant')).toBe('glass');
    expect(el._portalEl?.getAttribute('data-size')).toBe('sm');
    expect(el._portalEl?.getAttribute('data-tone')).toBe('warning');
    expect(el._portalEl?.style.getPropertyValue('--ui-dropdown-radius')).toBe('999px');
    expect(el._portalEl?.style.getPropertyValue('--ui-dropdown-item-radius')).toBe('999px');
  });

  it('ui-dropdown leaves size metrics to the menu size rules instead of copying host defaults inline', async () => {
    const el = document.createElement('ui-dropdown') as HTMLElement & { _portalEl?: HTMLElement | null };
    el.innerHTML = `
      <button slot="trigger">Open</button>
      <div slot="content"><button class="item">One</button></div>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    el.setAttribute('size', 'sm');
    el.setAttribute('open', '');
    await flushMicrotask();

    const menu = el._portalEl;
    expect(menu).toBeTruthy();
    expect(menu?.getAttribute('data-size')).toBe('sm');
    expect(menu?.style.getPropertyValue('--ui-dropdown-item-font-size')).toBe('');
    expect(menu?.style.getPropertyValue('--ui-dropdown-item-min-height')).toBe('');
    expect(menu?.style.getPropertyValue('--ui-dropdown-item-pad-y')).toBe('');
    expect(menu?.style.getPropertyValue('--ui-dropdown-separator-margin')).toBe('');

    el.setAttribute('size', 'lg');
    await flushMicrotask();

    expect(menu?.getAttribute('data-size')).toBe('lg');
    expect(menu?.style.getPropertyValue('--ui-dropdown-item-font-size')).toBe('');
    expect(menu?.style.getPropertyValue('--ui-dropdown-item-min-height')).toBe('');
  });

  it('ui-menu opens from trigger click, emits select, and closes on outside pointerdown', async () => {
    const outside = document.createElement('button');
    const el = document.createElement('ui-menu') as HTMLElement;
    el.innerHTML = `
      <button slot="trigger">Open</button>
      <div slot="item">One</div>
      <div slot="item">Two</div>
    `;
    document.body.append(outside, el);
    await flushMicrotask();

    let selectedIndex: number | null = null;
    el.addEventListener('select', (event: Event) => {
      selectedIndex = (event as CustomEvent<{ index?: number }>).detail.index ?? null;
    });

    const trigger = el.querySelector('[slot="trigger"]') as HTMLButtonElement;
    trigger.click();
    await flushMicrotask();

    expect(el.hasAttribute('open')).toBe(true);

    const root = document.getElementById('ui-portal-root');
    const items = root?.querySelectorAll('.item') ?? [];
    expect(items.length).toBe(2);

    (items[1] as HTMLElement).click();
    await flushMicrotask();

    expect(selectedIndex).toBe(1);
    expect(el.hasAttribute('open')).toBe(false);

    trigger.click();
    await flushMicrotask();
    expect(el.hasAttribute('open')).toBe(true);

    outside.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    await flushMicrotask();

    expect(el.hasAttribute('open')).toBe(false);
  });

  it('ui-menu keeps portal node stable across visual updates while open', async () => {
    const el = document.createElement('ui-menu') as HTMLElement & { _portalEl?: HTMLElement | null };
    el.innerHTML = `
      <button slot="trigger">Open</button>
      <div slot="content"><button class="item">Export</button></div>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    el.setAttribute('open', '');
    await flushMicrotask();

    const portalBefore = el._portalEl;
    expect(portalBefore).toBeTruthy();

    el.setAttribute('variant', 'contrast');
    el.setAttribute('density', 'comfortable');
    el.setAttribute('shape', 'square');
    await flushMicrotask();

    expect(el._portalEl).toBe(portalBefore);
  });

  it('ui-menu mirrors size, radius, and tone onto the portaled menu surface', async () => {
    const el = document.createElement('ui-menu') as HTMLElement & { _portalEl?: HTMLElement | null };
    el.innerHTML = `
      <button slot="trigger">Open</button>
      <div slot="content"><button class="item">Export</button></div>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    el.setAttribute('size', 'lg');
    el.setAttribute('radius', '12');
    el.setAttribute('tone', 'warning');
    el.setAttribute('open', '');
    await flushMicrotask();

    expect(el._portalEl?.getAttribute('data-size')).toBe('lg');
    expect(el._portalEl?.getAttribute('data-tone')).toBe('warning');
    expect(el._portalEl?.style.getPropertyValue('--ui-menu-radius')).toBe('12px');
  });
});
