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

  it('registers selected values with ui-form', async () => {
    const form = document.createElement('ui-form') as any;
    form.innerHTML = `<ui-transfer-list name="roles" options='[{"value":"ops","label":"Ops"}]' value='["ops"]'></ui-transfer-list>`;
    document.body.appendChild(form);
    await flushMicrotask();
    await flushMicrotask();
    expect(form.getValues().roles).toEqual(['ops']);
  });
});
