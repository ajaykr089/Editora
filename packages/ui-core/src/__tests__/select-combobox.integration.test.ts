import { beforeEach, describe, expect, it } from 'vitest';
import '../components/ui-combobox';
import '../components/ui-select';

function flushMicrotask() {
  return Promise.resolve();
}

describe('ui-select and ui-combobox integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    const root = document.getElementById('ui-portal-root');
    if (root?.parentElement) root.parentElement.removeChild(root);
  });

  it('ui-select opens from trigger click and closes on outside pointerdown', async () => {
    const outside = document.createElement('button');
    const el = document.createElement('ui-select') as HTMLElement;
    el.innerHTML = `
      <option value="one">One</option>
      <option value="two">Two</option>
    `;
    document.body.append(outside, el);
    await flushMicrotask();

    const trigger = el.shadowRoot?.querySelector('.trigger') as HTMLButtonElement | null;
    expect(trigger).toBeTruthy();

    trigger?.click();
    await flushMicrotask();

    expect((el as HTMLElement & { _portalEl?: HTMLElement | null })._portalEl).toBeTruthy();

    outside.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    await flushMicrotask();

    expect((el as HTMLElement & { _portalEl?: HTMLElement | null })._portalEl).toBeNull();
  });

  it('ui-select keeps its portal node stable across visual updates while open', async () => {
    const el = document.createElement('ui-select') as HTMLElement & { _portalEl?: HTMLElement | null };
    el.innerHTML = `
      <option value="one">One</option>
      <option value="two">Two</option>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    const trigger = el.shadowRoot?.querySelector('.trigger') as HTMLButtonElement | null;
    trigger?.click();
    await flushMicrotask();

    const portalBefore = el._portalEl;
    expect(portalBefore).toBeTruthy();

    el.setAttribute('variant', 'contrast');
    el.setAttribute('tone', 'success');
    el.setAttribute('shape', 'pill');
    await flushMicrotask();

    expect(el._portalEl).toBe(portalBefore);
  });

  it('ui-combobox opens on focus, selects an option, and closes on outside pointerdown', async () => {
    const outside = document.createElement('button');
    const el = document.createElement('ui-combobox') as HTMLElement;
    el.innerHTML = `
      <option value="alpha">Alpha</option>
      <option value="beta">Beta</option>
    `;
    document.body.append(outside, el);
    await flushMicrotask();

    let selectedValue: string | null = null;
    el.addEventListener('select', (event: Event) => {
      selectedValue = (event as CustomEvent<{ value: string }>).detail.value;
    });

    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement | null;
    const panel = el.shadowRoot?.querySelector('.panel') as HTMLElement | null;
    expect(input).toBeTruthy();
    expect(panel).toBeTruthy();

    input?.focus();
    input?.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    await flushMicrotask();

    expect(el.hasAttribute('open')).toBe(true);
    expect(panel?.getAttribute('data-open')).toBe('true');

    const option = el.shadowRoot?.querySelector('[data-option-index="1"]') as HTMLButtonElement | null;
    option?.click();
    await flushMicrotask();

    expect(selectedValue).toBe('beta');
    expect(el.getAttribute('value')).toBe('beta');
    expect(el.hasAttribute('open')).toBe(false);

    input?.focus();
    input?.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    await flushMicrotask();
    expect(el.hasAttribute('open')).toBe(true);

    outside.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    await flushMicrotask();

    expect(el.hasAttribute('open')).toBe(false);
  });

  it('ui-combobox stays interactive while loading so query-driven stories can still select options', async () => {
    const el = document.createElement('ui-combobox') as HTMLElement;
    el.innerHTML = `
      <option value="alpha">Alpha</option>
      <option value="beta">Beta</option>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    let changedValue: string | null = null;
    el.addEventListener('change', (event: Event) => {
      changedValue = (event as CustomEvent<{ value: string }>).detail.value;
    });

    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement | null;
    expect(input).toBeTruthy();

    input?.focus();
    input?.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    await flushMicrotask();

    input!.value = 'be';
    input!.dispatchEvent(new Event('input', { bubbles: true }));
    await flushMicrotask();

    el.setAttribute('state', 'loading');
    await flushMicrotask();

    expect(el.hasAttribute('open')).toBe(true);

    const option = el.shadowRoot?.querySelector('[data-option-index="0"]') as HTMLButtonElement | null;
    expect(option?.textContent).toContain('Beta');
    option?.click();
    await flushMicrotask();

    expect(changedValue).toBe('beta');
    expect(el.getAttribute('value')).toBe('beta');
    expect(el.hasAttribute('open')).toBe(false);
  });

  it('ui-combobox preserves selection when an option is clicked after opening from input focus', async () => {
    const el = document.createElement('ui-combobox') as HTMLElement;
    el.innerHTML = `
      <option value="alpha">Alpha</option>
      <option value="beta">Beta</option>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement | null;
    input?.focus();
    input?.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    await flushMicrotask();

    const option = el.shadowRoot?.querySelector('[data-option-index="1"]') as HTMLButtonElement | null;
    expect(option).toBeTruthy();

    option?.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, cancelable: true }));
    option?.click();
    await flushMicrotask();

    expect(el.getAttribute('value')).toBe('beta');
    expect(el.hasAttribute('open')).toBe(false);
  });
});
