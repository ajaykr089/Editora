import { describe, it, expect } from 'vitest';
import '../components/ui-input';

describe('UIInput advanced features', () => {
  it('shows clear button when clearable and value present and clears on click', () => {
    const el = document.createElement('ui-input') as HTMLElement & { value?: string };
    el.setAttribute('clearable', '');
    el.setAttribute('value', 'hello');
    document.body.appendChild(el);

    const btn = el.shadowRoot?.querySelector('button.clear-btn') as HTMLButtonElement | null;
    expect(btn).toBeTruthy();

    // click clear
    btn!.click();
    expect(el.getAttribute('value')).toBe('');
  });

  it('sets aria-invalid when validation=error', () => {
    const el = document.createElement('ui-input') as HTMLElement;
    el.setAttribute('validation', 'error');
    document.body.appendChild(el);
    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement | null;
    expect(input?.getAttribute('aria-invalid')).toBe('true');
  });

  it('exposes debounce attribute and emits debounced-input', async () => {
    const el = document.createElement('ui-input') as HTMLElement;
    el.setAttribute('debounce', '80');
    document.body.appendChild(el);
    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;

    let seen: any = null;
    el.addEventListener('debounced-input', (e: any) => { seen = e.detail?.value; });

    input.value = 'abc';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    await new Promise((r) => setTimeout(r, 100));
    expect(seen).toBe('abc');
  });

  it('treats disabled="false" as not disabled and disabled presence disables input', () => {
    const elFalse = document.createElement('ui-input') as HTMLElement;
    elFalse.setAttribute('disabled', 'false');
    document.body.appendChild(elFalse);
    const inputFalse = elFalse.shadowRoot?.querySelector('input') as HTMLInputElement | null;
    expect(inputFalse?.hasAttribute('disabled')).toBe(false);

    const elTrue = document.createElement('ui-input') as HTMLElement;
    elTrue.setAttribute('disabled', '');
    document.body.appendChild(elTrue);
    const inputTrue = elTrue.shadowRoot?.querySelector('input') as HTMLInputElement | null;
    expect(inputTrue?.hasAttribute('disabled')).toBe(true);
  });

  it('keeps focus while typing (no re-render that drops focus)', async () => {
    const el = document.createElement('ui-input') as HTMLElement;
    document.body.appendChild(el);
    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement | null;
    expect(input).toBeTruthy();

    // focus and type multiple characters; focus should remain on the input
    input!.focus();
    expect(el.shadowRoot?.activeElement).toBe(input);

    input!.value = 'a';
    input!.dispatchEvent(new Event('input', { bubbles: true }));
    await Promise.resolve();
    expect(el.shadowRoot?.activeElement).toBe(input);

    input!.value = 'ab';
    input!.dispatchEvent(new Event('input', { bubbles: true }));
    await Promise.resolve();
    expect(el.shadowRoot?.activeElement).toBe(input);
  });
});
