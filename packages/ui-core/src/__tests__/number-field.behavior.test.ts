import { describe, expect, it } from 'vitest';
import '../components/ui-number-field';

function flushMicrotask() {
  return Promise.resolve();
}

describe('ui-number-field', () => {
  it('formats committed values using the configured locale', async () => {
    const el = document.createElement('ui-number-field') as HTMLElement;
    el.setAttribute('locale', 'de-DE');
    el.setAttribute('precision', '2');
    el.setAttribute('value', '1234.5');
    document.body.appendChild(el);
    await flushMicrotask();

    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement | null;
    expect(input?.value).toBe(
      new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(1234.5)
    );
  });

  it('steps with keyboard arrows and emits value-change', async () => {
    const el = document.createElement('ui-number-field') as HTMLElement;
    el.setAttribute('value', '1');
    el.setAttribute('step', '0.25');
    el.setAttribute('precision', '2');
    document.body.appendChild(el);
    await flushMicrotask();

    let seen: number | null = null;
    el.addEventListener('value-change', (event: Event) => {
      seen = (event as CustomEvent<{ value: number | null }>).detail.value;
    });

    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));

    expect(el.getAttribute('value')).toBe('1.25');
    expect(seen).toBe(1.25);
  });

  it('clamps values on blur when clamp-on-blur is enabled', async () => {
    const el = document.createElement('ui-number-field') as HTMLElement;
    el.setAttribute('max', '10');
    el.setAttribute('clamp-on-blur', '');
    document.body.appendChild(el);
    await flushMicrotask();

    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new FocusEvent('focus'));
    input.value = '12';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new FocusEvent('blur'));

    expect(el.getAttribute('value')).toBe('10');
    expect(input.value).toBe('10');
  });

  it('keeps raw invalid input visible and emits invalid parse events', async () => {
    const el = document.createElement('ui-number-field') as HTMLElement;
    document.body.appendChild(el);
    await flushMicrotask();

    let reason: string | null = null;
    el.addEventListener('invalid', (event: Event) => {
      reason = (event as CustomEvent<{ reason: string }>).detail.reason;
    });

    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new FocusEvent('focus'));
    input.value = 'abc';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new FocusEvent('blur'));

    expect(reason).toBe('parse');
    expect(input.value).toBe('abc');
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('allows wheel stepping only when allow-wheel is enabled and the input is focused', async () => {
    const el = document.createElement('ui-number-field') as HTMLElement;
    el.setAttribute('value', '2');
    el.setAttribute('allow-wheel', '');
    document.body.appendChild(el);
    await flushMicrotask();

    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.focus();
    input.dispatchEvent(new WheelEvent('wheel', { deltaY: -10, bubbles: true, cancelable: true }));

    expect(el.getAttribute('value')).toBe('3');
  });
});
