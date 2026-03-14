import { describe, expect, it } from 'vitest';
import '../components/ui-pin-input';
import '../components/ui-form';

function flushMicrotask() {
  return Promise.resolve();
}

describe('ui-pin-input', () => {
  it('advances through slots and emits complete when fully entered', async () => {
    const el = document.createElement('ui-pin-input') as HTMLElement;
    el.setAttribute('length', '4');
    document.body.appendChild(el);
    await flushMicrotask();

    let completed = '';
    el.addEventListener('complete', (event: Event) => {
      completed = (event as CustomEvent<{ value: string }>).detail.value;
    });

    const inputs = Array.from(el.shadowRoot?.querySelectorAll('.slot') || []) as HTMLInputElement[];
    inputs[0].value = '1';
    inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
    inputs[1].value = '2';
    inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
    inputs[2].value = '3';
    inputs[2].dispatchEvent(new Event('input', { bubbles: true }));
    inputs[3].value = '4';
    inputs[3].dispatchEvent(new Event('input', { bubbles: true }));

    expect(el.getAttribute('value')).toBe('1234');
    expect(completed).toBe('1234');
  });

  it('distributes pasted values across the remaining slots', async () => {
    const el = document.createElement('ui-pin-input') as HTMLElement;
    el.setAttribute('length', '6');
    document.body.appendChild(el);
    await flushMicrotask();

    const inputs = Array.from(el.shadowRoot?.querySelectorAll('.slot') || []) as HTMLInputElement[];
    const paste = new Event('paste', { bubbles: true, cancelable: true }) as ClipboardEvent;
    Object.defineProperty(paste, 'clipboardData', { value: { getData: () => '987654' } });
    inputs[0].dispatchEvent(paste);

    expect(el.getAttribute('value')).toBe('987654');
  });

  it('backs up to the previous slot on backspace when current slot is empty', async () => {
    const el = document.createElement('ui-pin-input') as HTMLElement;
    el.setAttribute('value', '1234');
    document.body.appendChild(el);
    await flushMicrotask();

    const inputs = Array.from(el.shadowRoot?.querySelectorAll('.slot') || []) as HTMLInputElement[];
    inputs[3].focus();
    inputs[3].dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
    inputs[3].dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));

    expect(el.getAttribute('value')).toBe('12');
  });

  it('registers the aggregated code with ui-form and validates required completion', async () => {
    const form = document.createElement('ui-form') as any;
    form.innerHTML = '<ui-pin-input name="otp" length="4" required value="12"></ui-pin-input>';
    document.body.appendChild(form);
    await flushMicrotask();
    await flushMicrotask();

    expect(form.getValues().otp).toBe('12');
    const result = await form.submit();
    const field = form.querySelector('ui-pin-input') as HTMLElement | null;
    expect(result).toBe(false);
    expect(field?.hasAttribute('invalid')).toBe(true);
  });
});
