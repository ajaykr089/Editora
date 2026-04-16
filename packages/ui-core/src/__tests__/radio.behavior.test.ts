import { afterEach, describe, expect, it, vi } from 'vitest';
import '../components/ui-radio';

function flushMicrotask() {
  return Promise.resolve();
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-radio', () => {
  it('sets radio semantics and emits input/change when checked by click', async () => {
    const el = document.createElement('ui-radio');
    el.textContent = 'Weekly summary';
    document.body.appendChild(el);
    await flushMicrotask();

    const inputSpy = vi.fn();
    const changeSpy = vi.fn();
    el.addEventListener('input', inputSpy);
    el.addEventListener('change', changeSpy);

    expect(el.getAttribute('role')).toBe('radio');
    expect(el.getAttribute('aria-checked')).toBe('false');
    expect(el.getAttribute('tabindex')).toBe('0');

    el.click();

    expect(el.hasAttribute('checked')).toBe(true);
    expect(el.getAttribute('aria-checked')).toBe('true');
    expect(inputSpy).toHaveBeenCalledTimes(1);
    expect(changeSpy).toHaveBeenCalledTimes(1);
    expect(inputSpy.mock.calls[0]?.[0].detail).toMatchObject({ checked: true, reason: 'click' });
  });

  it('does not toggle off or re-emit change when already checked', async () => {
    const el = document.createElement('ui-radio');
    document.body.appendChild(el);
    await flushMicrotask();

    const changeSpy = vi.fn();
    el.addEventListener('change', changeSpy);

    el.click();
    el.click();

    expect(el.hasAttribute('checked')).toBe(true);
    expect(changeSpy).toHaveBeenCalledTimes(1);
  });

  it('keeps same-name radios mutually exclusive and supports arrow-key movement', async () => {
    const first = document.createElement('ui-radio');
    const second = document.createElement('ui-radio');
    const third = document.createElement('ui-radio');

    first.setAttribute('name', 'billing-cycle');
    second.setAttribute('name', 'billing-cycle');
    third.setAttribute('name', 'billing-cycle');
    first.setAttribute('value', 'weekly');
    second.setAttribute('value', 'monthly');
    third.setAttribute('value', 'yearly');

    document.body.append(first, second, third);
    await flushMicrotask();

    first.click();
    expect(first.hasAttribute('checked')).toBe(true);

    first.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await flushMicrotask();

    expect(first.hasAttribute('checked')).toBe(false);
    expect(second.hasAttribute('checked')).toBe(true);

    second.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await flushMicrotask();

    expect(third.hasAttribute('checked')).toBe(true);
    expect(second.hasAttribute('checked')).toBe(false);
  });

  it('prevents interaction while disabled or loading', async () => {
    const disabled = document.createElement('ui-radio');
    disabled.setAttribute('disabled', '');
    const loading = document.createElement('ui-radio');
    loading.setAttribute('loading', '');

    document.body.append(disabled, loading);
    await flushMicrotask();

    disabled.click();
    loading.click();

    expect(disabled.hasAttribute('checked')).toBe(false);
    expect(loading.hasAttribute('checked')).toBe(false);
    expect(disabled.getAttribute('tabindex')).toBe('-1');
    expect(loading.getAttribute('aria-busy')).toBe('true');
  });
});
