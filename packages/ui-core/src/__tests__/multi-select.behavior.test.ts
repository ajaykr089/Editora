import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-multi-select';
import '../components/ui-form';

function flushMicrotask() {
  return Promise.resolve();
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-multi-select', () => {
  const options = JSON.stringify([
    { value: 'ops', label: 'Operations' },
    { value: 'security', label: 'Security' },
    { value: 'platform', label: 'Platform' }
  ]);

  it('toggles selections and emits array values', async () => {
    const el = document.createElement('ui-multi-select');
    el.setAttribute('options', options);
    document.body.appendChild(el);
    await flushMicrotask();

    let latest: string[] = [];
    el.addEventListener('change', (event) => {
      latest = (event as CustomEvent<{ value: string[] }>).detail.value;
    });

    const input = el.shadowRoot?.querySelector('.input') as HTMLInputElement | null;
    input?.focus();
    await flushMicrotask();

    const firstOption = el.shadowRoot?.querySelector('.option[data-value="ops"]') as HTMLElement | null;
    firstOption?.click();
    expect(latest).toEqual(['ops']);
  });

  it('supports selecting from nested option content and removing selected chips', async () => {
    const el = document.createElement('ui-multi-select');
    el.setAttribute('options', options);
    el.setAttribute('value', '["ops"]');
    document.body.appendChild(el);
    await flushMicrotask();

    const input = el.shadowRoot?.querySelector('.input') as HTMLInputElement | null;
    input?.focus();
    await flushMicrotask();

    const securityLabel = el.shadowRoot?.querySelector('.option[data-value="security"] .option-label') as HTMLElement | null;
    securityLabel?.click();
    expect(el.getAttribute('value')).toBe('["ops","security"]');

    const remove = el.shadowRoot?.querySelector('.chip-remove[data-value="ops"]') as HTMLButtonElement | null;
    remove?.click();
    expect(el.getAttribute('value')).toBe('["security"]');
  });

  it('keeps the panel interactive during pointer selection without collapsing on focus churn', async () => {
    const el = document.createElement('ui-multi-select');
    el.setAttribute('options', options);
    document.body.appendChild(el);
    await flushMicrotask();

    const input = el.shadowRoot?.querySelector('.input') as HTMLInputElement | null;
    input?.focus();
    await flushMicrotask();

    const option = el.shadowRoot?.querySelector('.option[data-value="ops"]') as HTMLButtonElement | null;
    option?.dispatchEvent(new Event('pointerdown', { bubbles: true, composed: true }));
    option?.click();

    expect(el.getAttribute('value')).toBe('["ops"]');
    expect(el.hasAttribute('open')).toBe(true);
  });

  it('does not throw when focus opens the panel and triggers nested sync', async () => {
    const el = document.createElement('ui-multi-select');
    el.setAttribute('options', options);
    document.body.appendChild(el);
    await flushMicrotask();

    const input = el.shadowRoot?.querySelector('.input') as HTMLInputElement | null;
    expect(() => input?.focus()).not.toThrow();
    expect(el.hasAttribute('open')).toBe(true);
  });

  it('registers selected arrays with ui-form', async () => {
    const form = document.createElement('ui-form') as HTMLElement & { getValues(): Record<string, unknown> };
    form.innerHTML = `<ui-multi-select name="teams" options='${options.replace(/'/g, '&apos;')}' value='["ops","security"]'></ui-multi-select>`;
    document.body.appendChild(form);
    await flushMicrotask();

    expect(form.getValues().teams).toEqual(['ops', 'security']);
  });

  it('supports keyboard navigation, escape close, and max-selections', async () => {
    const el = document.createElement('ui-multi-select');
    el.setAttribute('options', options);
    el.setAttribute('max-selections', '1');
    document.body.appendChild(el);
    await flushMicrotask();

    const input = el.shadowRoot?.querySelector('.input') as HTMLInputElement | null;
    input?.focus();
    await flushMicrotask();

    input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(el.getAttribute('value')).toBe('["ops"]');

    input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(el.getAttribute('value')).toBe('["security"]');

    input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(el.hasAttribute('open')).toBe(false);
  });

  it('supports removing the option indicator entirely', async () => {
    const el = document.createElement('ui-multi-select');
    el.setAttribute('options', options);
    el.setAttribute('selection-indicator', 'none');
    document.body.appendChild(el);
    await flushMicrotask();

    const input = el.shadowRoot?.querySelector('.input') as HTMLInputElement | null;
    input?.focus();
    await flushMicrotask();

    expect(el.shadowRoot?.querySelector('.option[data-value="ops"] .check')).toBeNull();
  });

  it('supports clearable selection reset', async () => {
    const el = document.createElement('ui-multi-select');
    el.setAttribute('options', options);
    el.setAttribute('value', '["ops","security"]');
    el.setAttribute('clearable', '');
    document.body.appendChild(el);
    await flushMicrotask();

    const clear = el.shadowRoot?.querySelector('.clear') as HTMLButtonElement | null;
    clear?.click();

    expect(el.getAttribute('value')).toBeNull();
  });

  it('prevents readonly interaction changes', async () => {
    const el = document.createElement('ui-multi-select');
    el.setAttribute('options', options);
    el.setAttribute('value', '["ops"]');
    el.setAttribute('readonly', '');
    document.body.appendChild(el);
    await flushMicrotask();

    const input = el.shadowRoot?.querySelector('.input') as HTMLInputElement | null;
    input?.focus();
    await flushMicrotask();

    expect(el.hasAttribute('open')).toBe(false);

    const remove = el.shadowRoot?.querySelector('.chip-remove[data-value="ops"]') as HTMLButtonElement | null;
    remove?.click();
    expect(el.getAttribute('value')).toBe('["ops"]');
  });

  it('shows a loading status instead of selectable options', async () => {
    const el = document.createElement('ui-multi-select');
    el.setAttribute('options', options);
    el.setAttribute('loading', '');
    el.setAttribute('loading-text', 'Refreshing teams...');
    document.body.appendChild(el);
    await flushMicrotask();

    const input = el.shadowRoot?.querySelector('.input') as HTMLInputElement | null;
    input?.focus();
    await flushMicrotask();

    const status = el.shadowRoot?.querySelector('.status') as HTMLElement | null;
    expect(status?.textContent).toBe('Refreshing teams...');
    expect(el.shadowRoot?.querySelector('.option')).toBeNull();
  });

  it('renders grouped options with section headers', async () => {
    const grouped = JSON.stringify([
      { label: 'Core response', options: [{ value: 'ops', label: 'Operations' }] },
      { label: 'Platform delivery', options: [{ value: 'platform', label: 'Platform' }] }
    ]);
    const el = document.createElement('ui-multi-select');
    el.setAttribute('options', grouped);
    document.body.appendChild(el);
    await flushMicrotask();

    const input = el.shadowRoot?.querySelector('.input') as HTMLInputElement | null;
    input?.focus();
    await flushMicrotask();

    const groups = Array.from(el.shadowRoot?.querySelectorAll('.group') || []).map((node) => node.textContent);
    expect(groups).toEqual(['Core response', 'Platform delivery']);
  });

  it('caps rendered options for large datasets and shows a narrowing hint', async () => {
    const many = JSON.stringify(Array.from({ length: 80 }, (_, index) => ({
      value: `team-${index + 1}`,
      label: `Team ${index + 1}`
    })));
    const el = document.createElement('ui-multi-select');
    el.setAttribute('options', many);
    el.setAttribute('render-limit', '20');
    document.body.appendChild(el);
    await flushMicrotask();

    const input = el.shadowRoot?.querySelector('.input') as HTMLInputElement | null;
    input?.focus();
    await flushMicrotask();

    expect(el.shadowRoot?.querySelectorAll('.option').length).toBe(20);
    expect(el.shadowRoot?.querySelector('.status')?.textContent).toContain('Showing first 20 results');
  });
});
