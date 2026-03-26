import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-odometer';

async function flushMicrotasks() {
  await Promise.resolve();
  await Promise.resolve();
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-odometer', () => {
  it('defaults to inline for generic animated numbers', async () => {
    const el = document.createElement('ui-odometer');
    el.setAttribute('value', '1234');

    document.body.appendChild(el);
    await flushMicrotasks();

    const container = el.shadowRoot?.querySelector('.container');
    expect(container?.getAttribute('data-variant')).toBe('inline');
  });

  it('renders the analog variant in the shadow DOM', async () => {
    const el = document.createElement('ui-odometer');
    el.setAttribute('value', '42');
    el.setAttribute('variant', 'analog');

    document.body.appendChild(el);
    await flushMicrotasks();

    const container = el.shadowRoot?.querySelector('.container');
    const valueDisplay = el.shadowRoot?.querySelector('.value-display');

    expect(container?.getAttribute('data-variant')).toBe('analog');
    expect(valueDisplay?.textContent).toBe('42');
    expect(valueDisplay?.classList.contains('analog-display')).toBe(true);
    expect(el.shadowRoot?.querySelectorAll('.digit').length).toBe(0);
  });

  it('renders a distinct digital display treatment', async () => {
    const el = document.createElement('ui-odometer');
    el.setAttribute('value', '42');
    el.setAttribute('variant', 'digital');

    document.body.appendChild(el);
    await flushMicrotasks();

    const container = el.shadowRoot?.querySelector('.container');
    const valueDisplay = el.shadowRoot?.querySelector('.value-display');

    expect(container?.getAttribute('data-variant')).toBe('digital');
    expect(valueDisplay?.classList.contains('digital-display')).toBe(true);
    expect(valueDisplay?.classList.contains('analog-display')).toBe(false);
  });

  it('renders rolling digit tracks for the odometer variant', async () => {
    const el = document.createElement('ui-odometer');
    el.setAttribute('value', '42');
    el.setAttribute('variant', 'odometer');

    document.body.appendChild(el);
    await flushMicrotasks();

    const container = el.shadowRoot?.querySelector('.container');
    const digits = el.shadowRoot?.querySelectorAll('.digit');

    expect(container?.getAttribute('data-variant')).toBe('odometer');
    expect(digits?.length).toBeGreaterThan(0);
  });
});
