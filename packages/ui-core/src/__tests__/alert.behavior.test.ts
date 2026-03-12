import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-alert';

function flushMicrotask() {
  return Promise.resolve();
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-alert', () => {
  it('normalizes numeric and full radius values', async () => {
    const el = document.createElement('ui-alert');
    el.setAttribute('radius', '12');
    document.body.appendChild(el);
    await flushMicrotask();

    expect(el.style.getPropertyValue('--ui-alert-radius')).toBe('12px');

    el.setAttribute('radius', 'full');
    await flushMicrotask();
    expect(el.style.getPropertyValue('--ui-alert-radius')).toBe('999px');
  });

  it('renders dismiss button and closes when not prevented', async () => {
    const el = document.createElement('ui-alert');
    el.setAttribute('dismissible', '');
    document.body.appendChild(el);
    await flushMicrotask();

    const dismiss = el.shadowRoot?.querySelector('.dismiss') as HTMLButtonElement | null;
    expect(dismiss).toBeTruthy();
    dismiss?.click();
    expect(el.hasAttribute('hidden')).toBe(true);
  });

  it('supports disabling the indicator rail', async () => {
    const el = document.createElement('ui-alert');
    el.setAttribute('indicator', 'none');
    document.body.appendChild(el);
    await flushMicrotask();

    expect(el.getAttribute('indicator')).toBe('none');
  });
});
