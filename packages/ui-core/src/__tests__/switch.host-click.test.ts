import { afterEach, describe, expect, it, vi } from 'vitest';
import '../components/ui-switch';

afterEach(() => { document.body.innerHTML = ''; });

describe('ui-switch activation', () => {
  it('toggles once for a click sent to the element itself (element.click(), assistive technology)', () => {
    document.body.innerHTML = '<ui-switch>Active</ui-switch>';
    const el = document.querySelector('ui-switch') as HTMLElement;
    const changed = vi.fn();
    el.addEventListener('change', changed);
    el.click();
    expect(el.getAttribute('aria-checked')).toBe('true');
    expect(changed).toHaveBeenCalledTimes(1);
    el.click();
    expect(el.getAttribute('aria-checked')).toBe('false');
  });

  it('still toggles once for a click inside it, and not at all when disabled', () => {
    document.body.innerHTML = '<ui-switch>Active</ui-switch><ui-switch disabled>Off</ui-switch>';
    const [el, disabled] = Array.from(document.querySelectorAll('ui-switch')) as HTMLElement[];
    (el.shadowRoot!.querySelector('.control') as HTMLElement).click();
    expect(el.getAttribute('aria-checked')).toBe('true');
    disabled.click();
    expect(disabled.getAttribute('aria-checked')).toBe('false');
  });
});
