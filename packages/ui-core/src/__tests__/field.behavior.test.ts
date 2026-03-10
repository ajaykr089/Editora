import { describe, expect, it } from 'vitest';
import '../components/ui-field';

function flushMicrotask() {
  return Promise.resolve();
}

describe('ui-field shell + accessibility behavior', () => {
  it('keeps control-shell visuals disabled by default', async () => {
    const el = document.createElement('ui-field');
    document.body.appendChild(el);
    await flushMicrotask();

    const css = (el.shadowRoot?.querySelector('style') as HTMLStyleElement | null)?.textContent || '';
    expect(css).toContain('padding: var(--ui-field-shell-padding, 0px);');
    expect(css).toContain('border: var(--ui-field-shell-border, 0);');
    expect(css).toContain('border-radius: var(--ui-field-shell-radius, 0px);');
    expect(css).toContain('box-shadow: var(--ui-field-shell-shadow, none);');
  });

  it('hides metadata chrome when label/description/actions are missing', async () => {
    const el = document.createElement('ui-field');
    el.innerHTML = '<input />';
    document.body.appendChild(el);
    await flushMicrotask();

    const meta = el.shadowRoot?.querySelector('.meta') as HTMLElement | null;
    const labelRow = el.shadowRoot?.querySelector('.label-row') as HTMLElement | null;
    const description = el.shadowRoot?.querySelector('.description') as HTMLElement | null;

    expect(meta?.hasAttribute('hidden')).toBe(true);
    expect(labelRow?.hasAttribute('hidden')).toBe(true);
    expect(description?.hasAttribute('hidden')).toBe(true);
  });

  it('only links aria-labelledby when label exists', async () => {
    const el = document.createElement('ui-field');
    el.innerHTML = '<input id="field-input-a11y" />';
    document.body.appendChild(el);
    await flushMicrotask();

    const input = el.querySelector('input') as HTMLInputElement | null;
    expect(input).toBeTruthy();
    expect(input?.hasAttribute('aria-labelledby')).toBe(false);

    el.setAttribute('label', 'Patient name');
    await flushMicrotask();
    await flushMicrotask();

    const labelledBy = input?.getAttribute('aria-labelledby') || '';
    expect(labelledBy).toContain('-label');
  });
});
