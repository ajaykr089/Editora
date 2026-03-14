import { beforeEach, describe, expect, it, vi } from 'vitest';
import '../components/ui-combobox';
import '../components/ui-select';

function flushMicrotask() {
  return Promise.resolve();
}

describe('ui-select and ui-combobox integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('ui-select opens a styled listbox, renders grouped options, and keeps required placeholders out of the menu', async () => {
    const el = document.createElement('ui-select') as HTMLElement;
    el.setAttribute('placeholder', 'Choose status');
    el.setAttribute('required', '');
    el.innerHTML = `
      <option value="draft">Draft</option>
      <optgroup label="Published">
        <option value="review">In review</option>
        <option value="approved">Approved</option>
      </optgroup>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    const trigger = el.shadowRoot?.querySelector('.trigger') as HTMLButtonElement | null;
    expect(trigger).toBeTruthy();
    expect(trigger?.textContent).toContain('Draft');

    trigger?.click();
    await flushMicrotask();

    const panel = el.shadowRoot?.querySelector('.panel') as HTMLElement | null;
    const menuItems = el.shadowRoot?.querySelectorAll('.menu-item') || [];
    const group = el.shadowRoot?.querySelector('.menu-group') as HTMLElement | null;

    expect(panel?.hidden).toBe(false);
    expect(menuItems).toHaveLength(3);
    expect(Array.from(menuItems).map((item) => item.textContent?.trim())).toEqual(['Draft', 'In review', 'Approved']);
    expect(group?.textContent).toBe('Published');
  });

  it('ui-select syncs host value changes into the trigger shell without replacing the control node', async () => {
    const el = document.createElement('ui-select') as HTMLElement;
    el.innerHTML = `
      <option value="one">One</option>
      <option value="two">Two</option>
    `;
    el.setAttribute('value', 'one');
    document.body.appendChild(el);
    await flushMicrotask();

    const controlBefore = el.shadowRoot?.querySelector('.control');
    const triggerBefore = el.shadowRoot?.querySelector('.trigger') as HTMLButtonElement | null;
    expect(controlBefore).toBeTruthy();
    expect(triggerBefore?.textContent).toContain('One');

    el.setAttribute('value', 'two');
    el.setAttribute('disabled', '');
    el.setAttribute('validation', 'error');
    await flushMicrotask();

    const controlAfter = el.shadowRoot?.querySelector('.control');
    const triggerAfter = el.shadowRoot?.querySelector('.trigger') as HTMLButtonElement | null;
    expect(controlAfter).toBe(controlBefore);
    expect(triggerAfter?.textContent).toContain('Two');
    expect(triggerAfter?.disabled).toBe(true);
    expect(triggerAfter?.getAttribute('aria-invalid')).toBe('true');
  });

  it('ui-select emits a single host change event when a menu option is chosen', async () => {
    const el = document.createElement('ui-select') as HTMLElement;
    el.innerHTML = `
      <option value="draft">Draft</option>
      <option value="review">Review</option>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    const onChange = vi.fn();
    const onInput = vi.fn();
    el.addEventListener('change', onChange);
    el.addEventListener('input', onInput);

    const trigger = el.shadowRoot?.querySelector('.trigger') as HTMLButtonElement | null;
    expect(trigger).toBeTruthy();

    trigger?.click();
    await flushMicrotask();

    const option = el.shadowRoot?.querySelector('.menu-item[data-index="1"]') as HTMLButtonElement | null;
    option?.click();
    await flushMicrotask();

    expect(el.getAttribute('value')).toBe('review');
    expect(onInput).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect((onChange.mock.calls[0]?.[0] as CustomEvent<{ value: string }>).detail.value).toBe('review');
  });

  it('ui-select updates the rendered menu items when light-dom options change', async () => {
    const el = document.createElement('ui-select') as HTMLElement;
    el.innerHTML = `
      <option value="one">One</option>
      <option value="two">Two</option>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    const added = document.createElement('option');
    added.value = 'three';
    added.textContent = 'Three';
    el.appendChild(added);
    await flushMicrotask();

    const trigger = el.shadowRoot?.querySelector('.trigger') as HTMLButtonElement | null;
    trigger?.click();
    await flushMicrotask();

    const items = el.shadowRoot?.querySelectorAll('.menu-item') || [];
    expect(items).toHaveLength(3);
    expect(Array.from(items).map((item) => item.textContent?.trim())).toEqual(['One', 'Two', 'Three']);
  });

  it('ui-select hides checks by default and can render them before labels when configured', async () => {
    const el = document.createElement('ui-select') as HTMLElement;
    el.setAttribute('show-check', 'true');
    el.setAttribute('check-placement', 'start');
    el.innerHTML = `
      <option value="one">One</option>
      <option value="two">Two</option>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    const trigger = el.shadowRoot?.querySelector('.trigger') as HTMLButtonElement | null;
    trigger?.click();
    await flushMicrotask();

    const item = el.shadowRoot?.querySelector('.menu-item[data-value="one"]') as HTMLButtonElement | null;
    const check = item?.querySelector('.menu-item-check') as HTMLElement | null;
    const label = item?.querySelector('.menu-item-label') as HTMLElement | null;

    expect(check).toBeTruthy();
    expect(check?.hidden).toBe(false);
    expect(item?.getAttribute('data-check-placement')).toBe('start');
    expect(item?.firstElementChild).toBe(check);
    expect(item?.lastElementChild).toBe(label);

    el.removeAttribute('show-check');
    await flushMicrotask();

    const updatedCheck = el.shadowRoot?.querySelector('.menu-item[data-value="one"] .menu-item-check') as HTMLElement | null;
    expect(updatedCheck?.hidden).toBe(true);
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
