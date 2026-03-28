import { describe, it, expect } from 'vitest';
import '../components/ui-input';

describe('UIInput accessibility & form attributes', () => {
  it('links label & description with aria attributes', () => {
    const el = document.createElement('ui-input') as HTMLElement;
    el.setAttribute('label', 'Full name');
    el.setAttribute('description', 'Enter your legal name');
    document.body.appendChild(el);

    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement | null;
    expect(input).toBeTruthy();
    expect(input?.getAttribute('aria-labelledby')).toBeTruthy();
    expect(input?.getAttribute('aria-describedby')).toBeTruthy();

    const labelId = input?.getAttribute('aria-labelledby')!;
    const descId = input?.getAttribute('aria-describedby')!;
    expect(el.shadowRoot?.getElementById(labelId)).toBeTruthy();
    expect(el.shadowRoot?.getElementById(descId)).toBeTruthy();
  });

  it('reflects form attributes (type/name/required/pattern)', () => {
    const el = document.createElement('ui-input') as HTMLElement;
    el.setAttribute('type', 'email');
    el.setAttribute('name', 'userEmail');
    el.setAttribute('required', '');
    el.setAttribute('pattern', '^.+@.+\\..+$');
    document.body.appendChild(el);

    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement | null;
    expect(input?.type).toBe('email');
    expect(input?.name).toBe('userEmail');
    expect(input?.hasAttribute('required')).toBe(true);
    expect(input?.getAttribute('pattern')).toBe('^.+@.+\\..+$');
  });
});
