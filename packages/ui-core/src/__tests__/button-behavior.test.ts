import { describe, it, expect, vi, beforeEach } from 'vitest';
import '../components/ui-button';

function settle() {
  return new Promise<void>((resolve) => setTimeout(resolve, 0));
}

describe('UIButton behavior', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('supports prefix and suffix slots for icon composition', async () => {
    const el = document.createElement('ui-button') as HTMLElement;
    el.innerHTML = `
      <span slot="prefix">P</span>
      Action
      <span slot="suffix">S</span>
    `;
    document.body.appendChild(el);
    await settle();

    const prefixSlot = el.shadowRoot?.querySelector('slot[name="prefix"]');
    const suffixSlot = el.shadowRoot?.querySelector('slot[name="suffix"]');
    expect(prefixSlot).toBeTruthy();
    expect(suffixSlot).toBeTruthy();
  });

  it('re-renders when slot content is added after mount', async () => {
    const el = document.createElement('ui-button') as HTMLElement;
    el.textContent = 'Action';
    document.body.appendChild(el);
    await settle();

    let prefixSlot = el.shadowRoot?.querySelector('slot[name="prefix"]');
    expect(prefixSlot).toBeNull();

    const prefix = document.createElement('span');
    prefix.setAttribute('slot', 'prefix');
    prefix.textContent = 'P';
    el.appendChild(prefix);
    await settle();
    await settle();

    prefixSlot = el.shadowRoot?.querySelector('slot[name="prefix"]');
    expect(prefixSlot).toBeTruthy();
  });

  it('applies loading state from state attribute', async () => {
    const el = document.createElement('ui-button') as HTMLElement;
    el.setAttribute('state', 'loading');
    document.body.appendChild(el);
    await settle();

    const btn = el.shadowRoot?.querySelector('button') as HTMLButtonElement | null;
    expect(btn?.disabled).toBe(true);
    expect(btn?.getAttribute('aria-busy')).toBe('true');
    expect(el.getAttribute('aria-busy')).toBe('true');
  });

  it('does not keep loading state after loading attribute is removed', async () => {
    const el = document.createElement('ui-button') as HTMLElement;
    el.setAttribute('loading', '');
    document.body.appendChild(el);
    await settle();

    let btn = el.shadowRoot?.querySelector('button') as HTMLButtonElement | null;
    expect(btn?.disabled).toBe(true);

    el.removeAttribute('loading');
    await settle();

    btn = el.shadowRoot?.querySelector('button') as HTMLButtonElement | null;
    expect(btn?.disabled).toBe(false);
    expect(el.hasAttribute('state')).toBe(false);
  });

  it('triggers form requestSubmit when type is submit', async () => {
    const form = document.createElement('form');
    const el = document.createElement('ui-button') as HTMLElement;
    el.setAttribute('type', 'submit');
    el.textContent = 'Submit';
    form.appendChild(el);
    document.body.appendChild(form);
    await settle();

    const submitSpy = vi.fn();
    Object.defineProperty(form, 'requestSubmit', {
      configurable: true,
      value: submitSpy,
    });

    const btn = el.shadowRoot?.querySelector('button') as HTMLButtonElement | null;
    expect(btn).toBeTruthy();
    btn?.click();
    await settle();

    expect(submitSpy).toHaveBeenCalledTimes(1);
  });

  it('triggers form reset when type is reset', async () => {
    const form = document.createElement('form');
    const el = document.createElement('ui-button') as HTMLElement;
    el.setAttribute('type', 'reset');
    form.appendChild(el);
    document.body.appendChild(form);
    await settle();

    const resetSpy = vi.spyOn(form, 'reset');
    const btn = el.shadowRoot?.querySelector('button') as HTMLButtonElement | null;
    expect(btn).toBeTruthy();
    btn?.click();
    await settle();

    expect(resetSpy).toHaveBeenCalledTimes(1);
  });

  it('does not submit form when click is prevented on host', async () => {
    const form = document.createElement('form');
    const el = document.createElement('ui-button') as HTMLElement;
    el.setAttribute('type', 'submit');
    form.appendChild(el);
    document.body.appendChild(form);
    await settle();

    const submitSpy = vi.fn();
    Object.defineProperty(form, 'requestSubmit', {
      configurable: true,
      value: submitSpy,
    });

    el.addEventListener('click', (event) => event.preventDefault());
    const btn = el.shadowRoot?.querySelector('button') as HTMLButtonElement | null;
    expect(btn).toBeTruthy();
    btn?.click();
    await settle();

    expect(submitSpy).toHaveBeenCalledTimes(0);
  });

  it('applies numeric radius values as px tokens', async () => {
    const el = document.createElement('ui-button') as HTMLElement;
    el.setAttribute('radius', '12');
    document.body.appendChild(el);
    await settle();

    expect(el.style.getPropertyValue('--ui-btn-radius')).toBe('12px');
  });

  it('preserves explicit radius when size is present', async () => {
    const el = document.createElement('ui-button') as HTMLElement;
    el.setAttribute('radius', 'full');
    el.setAttribute('size', 'lg');
    document.body.appendChild(el);
    await settle();

    expect(el.style.getPropertyValue('--ui-btn-radius')).toBe('999px');
  });
});
