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
});
