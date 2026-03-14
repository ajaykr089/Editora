import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-input';
import '../components/ui-password-field';
import '../components/ui-form';

afterEach(() => {
  document.body.innerHTML = '';
});

function flushRender() {
  return Promise.resolve().then(() => Promise.resolve());
}

function getInnerInput(el: HTMLElement): HTMLInputElement | null {
  return el.shadowRoot?.querySelector('input') || null;
}

describe('ui-password-field', () => {
  it('toggles between password and text modes and emits visibility-change', async () => {
    const el = document.createElement('ui-password-field') as HTMLElement & { revealed?: boolean };
    document.body.appendChild(el);
    await flushRender();

    const events: boolean[] = [];
    el.addEventListener('visibility-change', (event) => {
      events.push(!!(event as CustomEvent<{ revealed?: boolean }>).detail?.revealed);
    });

    const toggle = el.shadowRoot?.querySelector('.toggle-btn') as HTMLButtonElement | null;
    expect(getInnerInput(el)?.type).toBe('password');
    toggle?.click();

    expect(getInnerInput(el)?.type).toBe('text');
    expect(events).toEqual([true]);
  });

  it('forwards input changes through the host value contract', async () => {
    const el = document.createElement('ui-password-field') as HTMLElement & { value?: string };
    document.body.appendChild(el);
    await flushRender();

    let latest = '';
    el.addEventListener('input', (event) => {
      latest = (event as CustomEvent<{ value?: string }>).detail?.value || '';
    });

    const input = getInnerInput(el);
    expect(input).toBeTruthy();
    input!.value = 'Secret123!';
    input!.dispatchEvent(new Event('input', { bubbles: true }));

    expect(el.getAttribute('value')).toBe('Secret123!');
    expect(latest).toBe('Secret123!');
  });

  it('shows strength guidance when configured', async () => {
    const el = document.createElement('ui-password-field');
    el.setAttribute('show-strength', '');
    el.setAttribute('value', 'StrongPass123!');
    document.body.appendChild(el);
    await flushRender();

    const strength = el.shadowRoot?.querySelector('.strength') as HTMLElement | null;
    expect(strength?.hidden).toBe(false);
    expect(strength?.dataset.score).toBe('4');
    expect((el.shadowRoot?.querySelector('.strength-label') as HTMLElement | null)?.textContent).toBe('Strong');
  });

  it('respects revealable=false', async () => {
    const el = document.createElement('ui-password-field');
    el.setAttribute('revealable', 'false');
    document.body.appendChild(el);
    await flushRender();

    const toggle = el.shadowRoot?.querySelector('.toggle-btn') as HTMLButtonElement | null;
    expect(toggle?.hidden).toBe(true);
  });

  it('registers with ui-form from the host component', async () => {
    const form = document.createElement('ui-form') as HTMLElement & { getValues(): Record<string, unknown> };
    form.innerHTML = `<ui-password-field name="adminPassword" value="Secret#42"></ui-password-field>`;
    document.body.appendChild(form);
    await flushRender();

    expect(form.getValues().adminPassword).toBe('Secret#42');
  });

  it('does not allow reveal toggle when disabled', async () => {
    const el = document.createElement('ui-password-field');
    el.setAttribute('disabled', '');
    document.body.appendChild(el);
    await flushRender();

    const toggle = el.shadowRoot?.querySelector('.toggle-btn') as HTMLButtonElement | null;
    toggle?.click();

    expect(getInnerInput(el)?.type).toBe('password');
    expect(toggle?.disabled).toBe(true);
  });

  it('projects prefix and error slots into the inner input contract', async () => {
    const el = document.createElement('ui-password-field');
    el.innerHTML = `<span slot="prefix">@</span><span slot="error">Password is required</span>`;
    document.body.appendChild(el);
    await flushRender();

    const prefixSlot = el.shadowRoot?.querySelector('slot[name="prefix"]') as HTMLSlotElement | null;
    const errorSlot = el.shadowRoot?.querySelector('slot[name="error"]') as HTMLSlotElement | null;
    expect(prefixSlot?.assignedElements({ flatten: true })[0]?.textContent).toBe('@');
    expect(errorSlot?.assignedElements({ flatten: true })[0]?.textContent).toBe('Password is required');
  });

  it('supports a custom strength evaluator and emits strength-change', async () => {
    const el = document.createElement('ui-password-field') as HTMLElement & {
      strengthEvaluator?: (value: string) => { score: 1 | 2 | 3 | 4; label: string; caption: string };
    };
    el.setAttribute('show-strength', '');
    el.strengthEvaluator = () => ({
      score: 4,
      label: 'Policy pass',
      caption: 'Matched enterprise password policy.'
    });
    document.body.appendChild(el);
    await flushRender();

    let latestLabel = '';
    el.addEventListener('strength-change', (event) => {
      latestLabel = (event as CustomEvent<{ label?: string }>).detail?.label || '';
    });

    const input = getInnerInput(el);
    input!.value = 'whatever';
    input!.dispatchEvent(new Event('input', { bubbles: true }));
    await flushRender();

    expect((el.shadowRoot?.querySelector('.strength-label') as HTMLElement | null)?.textContent).toBe('Policy pass');
    expect(latestLabel).toBe('Policy pass');
  });
});
