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
    el.setAttribute('density', 'comfortable');
    el.setAttribute('shape', 'soft');
    await flushMicrotask();

    expect(el._portalEl).toBe(portalBefore);
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
});
