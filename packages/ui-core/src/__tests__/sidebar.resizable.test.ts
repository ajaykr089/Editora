import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-sidebar';

function flushMicrotask() {
  return Promise.resolve();
}

afterEach(() => {
  document.body.innerHTML = '';
  window.localStorage.clear();
});

describe('ui-sidebar resizable shell', () => {
  it('resizes with keyboard and emits width-change', async () => {
    const el = document.createElement('ui-sidebar') as HTMLElement;
    el.setAttribute('resizable', '');
    el.setAttribute('width', '280px');
    el.innerHTML = `<div slot="item" data-value="home" data-active>Home</div>`;
    document.body.appendChild(el);
    await flushMicrotask();

    let seen = 0;
    el.addEventListener('width-change', () => {
      seen += 1;
    });

    const handle = el.shadowRoot?.querySelector('.resize-handle') as HTMLElement | null;
    expect(handle).toBeTruthy();

    handle?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

    expect(Number.parseFloat(el.style.getPropertyValue('--ui-sidebar-width'))).toBeGreaterThan(280);
    expect(seen).toBe(1);
  });

  it('restores expanded width after collapse and expand', async () => {
    const el = document.createElement('ui-sidebar') as HTMLElement & { collapse(): void; expand(): void };
    el.setAttribute('resizable', '');
    el.setAttribute('width', '312px');
    el.setAttribute('collapsible', '');
    el.innerHTML = `<div slot="item" data-value="home" data-active>Home</div>`;
    document.body.appendChild(el);
    await flushMicrotask();

    el.collapse();
    expect(Number.parseFloat(el.style.getPropertyValue('--ui-sidebar-current-width'))).toBeCloseTo(78, 0);

    el.expand();
    expect(Number.parseFloat(el.style.getPropertyValue('--ui-sidebar-current-width'))).toBeCloseTo(312, 0);
  });

  it('persists resized width when storage-key and auto-save are enabled', async () => {
    const first = document.createElement('ui-sidebar') as HTMLElement;
    first.setAttribute('resizable', '');
    first.setAttribute('storage-key', 'ops-nav');
    first.setAttribute('auto-save', '');
    first.innerHTML = `<div slot="item" data-value="home" data-active>Home</div>`;
    document.body.appendChild(first);
    await flushMicrotask();

    const handle = first.shadowRoot?.querySelector('.resize-handle') as HTMLElement | null;
    handle?.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    first.remove();

    const second = document.createElement('ui-sidebar') as HTMLElement;
    second.setAttribute('resizable', '');
    second.setAttribute('storage-key', 'ops-nav');
    second.setAttribute('auto-save', '');
    second.innerHTML = `<div slot="item" data-value="home" data-active>Home</div>`;
    document.body.appendChild(second);
    await flushMicrotask();

    expect(Number.parseFloat(second.style.getPropertyValue('--ui-sidebar-width'))).toBeCloseTo(420, 0);
  });
});
