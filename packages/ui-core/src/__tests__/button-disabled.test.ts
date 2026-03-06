import { describe, it, expect } from 'vitest';
import '../components/ui-button';

function settle() {
  return new Promise<void>((resolve) => setTimeout(resolve, 0));
}

describe('UIButton disabled parsing', () => {
  it('treats disabled="false" as not disabled', async () => {
    const el = document.createElement('ui-button') as HTMLElement;
    el.setAttribute('disabled', 'false');
    document.body.appendChild(el);
    await settle();

    const btn = el.shadowRoot?.querySelector('button') as HTMLButtonElement | null;
    expect(btn).toBeTruthy();
    expect(btn?.hasAttribute('disabled')).toBe(false);
  });

  it('treats presence of disabled attribute as disabled', async () => {
    const el = document.createElement('ui-button') as HTMLElement;
    el.setAttribute('disabled', '');
    document.body.appendChild(el);
    await settle();

    const btn = el.shadowRoot?.querySelector('button') as HTMLButtonElement | null;
    expect(btn?.hasAttribute('disabled')).toBe(true);
  });

  it('loading still disables inner button regardless of disabled attr', async () => {
    const el = document.createElement('ui-button') as HTMLElement;
    el.setAttribute('loading', '');
    document.body.appendChild(el);
    await settle();

    const btn = el.shadowRoot?.querySelector('button') as HTMLButtonElement | null;
    expect(btn?.hasAttribute('disabled')).toBe(true);
    expect(el.getAttribute('aria-busy')).toBe('true');
    expect(el.getAttribute('aria-disabled')).toBe('true');
  });
});
