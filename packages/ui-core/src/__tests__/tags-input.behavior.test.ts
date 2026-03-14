import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-tags-input';
import '../components/ui-form';

function flushMicrotask() {
  return Promise.resolve();
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-tags-input', () => {
  it('creates and removes tags from keyboard input', async () => {
    const el = document.createElement('ui-tags-input') as HTMLElement;
    document.body.appendChild(el);
    await flushMicrotask();

    const input = el.shadowRoot?.querySelector('.input') as HTMLInputElement | null;
    expect(input).toBeTruthy();

    input!.value = 'alpha';
    input!.dispatchEvent(new Event('input', { bubbles: true }));
    input!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(el.getAttribute('value')).toBe('alpha');

    input!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
    expect(el.getAttribute('value')).toBeNull();
  });

  it('registers array values with ui-form', async () => {
    const form = document.createElement('ui-form') as HTMLElement & { getValues(): Record<string, unknown> };
    form.innerHTML = `<ui-tags-input name="owners" value="alpha, beta"></ui-tags-input>`;
    document.body.appendChild(form);
    await flushMicrotask();

    expect(form.getValues().owners).toEqual(['alpha', 'beta']);
  });

  it('keeps shell node stable across value/control updates', async () => {
    const el = document.createElement('ui-tags-input') as HTMLElement;
    el.setAttribute('value', 'alpha');
    document.body.appendChild(el);
    await flushMicrotask();

    const shellBefore = el.shadowRoot?.querySelector('.shell');
    expect(shellBefore).toBeTruthy();

    el.setAttribute('value', 'alpha, beta');
    el.setAttribute('placeholder', 'Add owner');
    el.setAttribute('disabled', '');
    await flushMicrotask();

    const shellAfter = el.shadowRoot?.querySelector('.shell');
    expect(shellAfter).toBe(shellBefore);
  });
});
