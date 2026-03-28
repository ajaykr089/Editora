import { describe, expect, it } from 'vitest';
import '../components/ui-transfer-list';
import '../components/ui-form';

function flushMicrotask() {
  return Promise.resolve();
}

describe('ui-transfer-list', () => {
  it('moves selected items between available and chosen lists', async () => {
    const el = document.createElement('ui-transfer-list') as HTMLElement;
    el.setAttribute(
      'options',
      JSON.stringify([
        { value: 'read', label: 'Read' },
        { value: 'write', label: 'Write' },
        { value: 'admin', label: 'Admin' }
      ])
    );
    document.body.appendChild(el);
    await flushMicrotask();

    const readItem = el.shadowRoot?.querySelector('[data-side="available"][data-value="read"]') as HTMLElement | null;
    readItem?.click();
    const add = el.shadowRoot?.querySelector('[data-action="add"]') as HTMLButtonElement | null;
    add?.click();

    expect(el.getAttribute('value')).toBe('["read"]');
  });

  it('does not double-toggle selection after a rerender', async () => {
    const el = document.createElement('ui-transfer-list') as HTMLElement & { requestRender?: () => void };
    el.setAttribute(
      'options',
      JSON.stringify([
        { value: 'read', label: 'Read' },
        { value: 'write', label: 'Write' }
      ])
    );
    document.body.appendChild(el);
    await flushMicrotask();

    el.requestRender?.();
    await flushMicrotask();

    const readItem = el.shadowRoot?.querySelector('[data-side="available"][data-value="read"]') as HTMLElement | null;
    readItem?.click();

    const add = el.shadowRoot?.querySelector('[data-action="add"]') as HTMLButtonElement | null;
    expect(add?.disabled).toBe(false);

    add?.click();
    expect(el.getAttribute('value')).toBe('["read"]');
  });

  it('supports the shared surface attributes and custom panel copy', async () => {
    const el = document.createElement('ui-transfer-list') as HTMLElement;
    el.setAttribute(
      'options',
      JSON.stringify([{ value: 'read', label: 'Read' }])
    );
    el.setAttribute('variant', 'glass');
    el.setAttribute('tone', 'success');
    el.setAttribute('size', 'lg');
    el.setAttribute('radius', '28px');
    el.setAttribute('elevation', 'high');
    el.setAttribute('selection-indicator', 'tick');
    el.setAttribute('available-label', 'Available roles');
    el.setAttribute('selected-label', 'Granted roles');
    document.body.appendChild(el);
    await flushMicrotask();

    const root = el.shadowRoot?.querySelector('.root') as HTMLElement | null;
    const availableTitle = el.shadowRoot?.querySelector('.panel-title')?.textContent;
    const addButton = el.shadowRoot?.querySelector('[data-action="add"]') as HTMLButtonElement | null;

    expect(el.getAttribute('variant')).toBe('glass');
    expect(el.getAttribute('tone')).toBe('success');
    expect(el.getAttribute('size')).toBe('lg');
    expect(el.getAttribute('elevation')).toBe('high');
    expect(el.getAttribute('selection-indicator')).toBe('tick');
    expect(root?.getAttribute('style')).toContain('--ui-transfer-panel-radius:28px;');
    expect(availableTitle).toBe('Available roles');
    expect(addButton?.textContent).toContain('Add selected');
    expect(el.shadowRoot?.querySelector('.indicator')).toBeTruthy();
  });

  it('can hide action labels and counts', async () => {
    const el = document.createElement('ui-transfer-list') as HTMLElement;
    el.setAttribute(
      'options',
      JSON.stringify([
        { value: 'read', label: 'Read' },
        { value: 'write', label: 'Write' }
      ])
    );
    el.setAttribute('show-action-labels', 'false');
    el.setAttribute('show-action-counts', 'false');
    el.setAttribute('show-panel-counts', 'false');
    document.body.appendChild(el);
    await flushMicrotask();

    const addButton = el.shadowRoot?.querySelector('[data-action="add"]') as HTMLButtonElement | null;
    const panelCount = el.shadowRoot?.querySelector('.panel-count');

    expect(addButton?.textContent).not.toContain('Add selected');
    expect(addButton?.querySelector('.move-btn-count')).toBeNull();
    expect(addButton?.getAttribute('data-compact')).toBe('true');
    expect(addButton?.querySelector('svg')).toBeTruthy();
    expect(panelCount).toBeNull();
  });

  it('registers selected values with ui-form', async () => {
    const form = document.createElement('ui-form') as any;
    form.innerHTML = `<ui-transfer-list name="roles" options='[{"value":"ops","label":"Ops"}]' value='["ops"]'></ui-transfer-list>`;
    document.body.appendChild(form);
    await flushMicrotask();
    await flushMicrotask();
    expect(form.getValues().roles).toEqual(['ops']);
  });
});
