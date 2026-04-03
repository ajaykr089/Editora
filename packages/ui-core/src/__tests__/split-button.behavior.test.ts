import { afterEach, describe, expect, it, vi } from 'vitest';
import '../components/ui-split-button';

function flushMicrotask() {
  return Promise.resolve();
}

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = '';
});

describe('ui-split-button', () => {
  it('emits primary action and selects a menu item', async () => {
    const el = document.createElement('ui-split-button') as HTMLElement;
    el.setAttribute('label', 'Publish');
    el.innerHTML = `
      <button slot="menuitem" data-value="schedule" data-label="Schedule publish">Schedule publish</button>
      <button slot="menuitem" data-value="duplicate" data-label="Duplicate release">Duplicate release</button>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    let primary = 0;
    let selected = '';
    el.addEventListener('primary-action', () => {
      primary += 1;
    });
    el.addEventListener('select', (event: Event) => {
      selected = (event as CustomEvent<{ value?: string }>).detail.value || '';
    });

    (el.shadowRoot?.querySelector('.button') as HTMLButtonElement).click();
    (el.shadowRoot?.querySelector('.toggle') as HTMLButtonElement).click();
    await flushMicrotask();

    const item = document.querySelector('.ui-split-button-portal [data-menu-item][data-value="duplicate"]') as HTMLElement | null;
    item?.click();

    expect(primary).toBe(1);
    expect(selected).toBe('duplicate');
  });

  it('keeps the portaled menu interactive', async () => {
    const el = document.createElement('ui-split-button') as HTMLElement;
    el.setAttribute('label', 'Publish');
    el.innerHTML = `<button slot="menuitem" data-value="archive">Archive</button>`;
    document.body.appendChild(el);
    await flushMicrotask();

    (el.shadowRoot?.querySelector('.toggle') as HTMLButtonElement).click();
    await flushMicrotask();

    const menu = document.querySelector('.ui-split-button-portal .menu') as HTMLElement | null;
    expect(menu?.style.pointerEvents).toBe('auto');
  });

  it('keeps the menu mounted long enough for the close transition', async () => {
    vi.useFakeTimers();
    const el = document.createElement('ui-split-button') as any;
    el.setAttribute('label', 'Publish');
    el.innerHTML = `<button slot="menuitem" data-value="archive">Archive</button>`;
    document.body.appendChild(el);
    await flushMicrotask();

    (el.shadowRoot?.querySelector('.toggle') as HTMLButtonElement).click();
    await flushMicrotask();

    const menu = document.querySelector('.ui-split-button-portal .menu') as HTMLElement | null;
    expect(menu?.getAttribute('data-state')).toBeTruthy();

    el.closeMenu();
    expect(menu?.getAttribute('data-state')).toBe('closing');
    expect(document.querySelector('.ui-split-button-portal .menu')).toBeTruthy();

    vi.advanceTimersByTime(161);
    await flushMicrotask();

    expect(document.querySelector('.ui-split-button-portal .menu')).toBeNull();
  });

  it('tracks the hovered menu item as active', async () => {
    const el = document.createElement('ui-split-button') as HTMLElement;
    el.setAttribute('label', 'Publish');
    el.innerHTML = `
      <button slot="menuitem" data-value="schedule" data-label="Schedule publish">Schedule publish</button>
      <button slot="menuitem" data-value="duplicate" data-label="Duplicate release">Duplicate release</button>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    (el.shadowRoot?.querySelector('.toggle') as HTMLButtonElement).click();
    await flushMicrotask();

    const hovered = document.querySelector('.ui-split-button-portal [data-menu-item][data-value="duplicate"]') as HTMLElement | null;
    hovered?.dispatchEvent(new Event('pointermove', { bubbles: true }));

    expect(hovered?.getAttribute('data-active')).toBe('true');
  });
});
