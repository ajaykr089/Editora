import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-tree';
import '../components/ui-tree-item';

function flushMicrotask() {
  return Promise.resolve();
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-tree', () => {
  it('expands and navigates nested items with keyboard arrows', async () => {
    const el = document.createElement('ui-tree') as HTMLElement & { focusValue(value: string): void };
    el.innerHTML = `
      <ui-tree-item value="src" expanded>
        <span slot="label">src</span>
        <ui-tree-item value="components">
          <span slot="label">components</span>
          <ui-tree-item value="button">
            <span slot="label">button.ts</span>
          </ui-tree-item>
        </ui-tree-item>
      </ui-tree-item>
      <ui-tree-item value="docs">
        <span slot="label">docs</span>
      </ui-tree-item>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    el.focusValue('src');
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await flushMicrotask();

    const components = el.querySelector('ui-tree-item[value="components"]') as HTMLElement | null;
    expect(components?.hasAttribute('expanded')).toBe(true);

    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    const button = el.querySelector('ui-tree-item[value="button"]') as HTMLElement | null;
    expect(button?.hidden).toBe(false);
  });

  it('selects focused items and emits select details', async () => {
    const el = document.createElement('ui-tree') as HTMLElement & { focusValue(value: string): void };
    el.innerHTML = `
      <ui-tree-item value="root">
        <span slot="label">Root</span>
      </ui-tree-item>
      <ui-tree-item value="guides">
        <span slot="label">Guides</span>
      </ui-tree-item>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    let selected: string | null = null;
    el.addEventListener('select', (event: Event) => {
      selected = (event as CustomEvent<{ value: string }>).detail.value;
    });

    el.focusValue('guides');
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(el.getAttribute('value')).toBe('guides');
    expect(selected).toBe('guides');
  });

  it('supports typeahead across visible items', async () => {
    const el = document.createElement('ui-tree') as HTMLElement & { focusValue(value: string): void };
    el.innerHTML = `
      <ui-tree-item value="api">
        <span slot="label">API</span>
      </ui-tree-item>
      <ui-tree-item value="components">
        <span slot="label">Components</span>
      </ui-tree-item>
      <ui-tree-item value="guides">
        <span slot="label">Guides</span>
      </ui-tree-item>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    el.focusValue('api');
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'g', bubbles: true }));
    await flushMicrotask();

    const guides = el.querySelector('ui-tree-item[value="guides"]') as HTMLElement | null;
    const row = guides?.shadowRoot?.querySelector('.row') as HTMLElement | null;
    expect(row?.tabIndex).toBe(0);
  });
});
