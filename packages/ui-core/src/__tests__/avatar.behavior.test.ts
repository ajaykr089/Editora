import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-avatar';

function flushMicrotask() {
  return Promise.resolve();
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-avatar', () => {
  it('normalizes numeric and full radius values', async () => {
    const el = document.createElement('ui-avatar');
    el.setAttribute('radius', '12');
    document.body.appendChild(el);
    await flushMicrotask();
    expect(el.style.getPropertyValue('--ui-avatar-radius')).toBe('12px');

    el.setAttribute('radius', 'full');
    await flushMicrotask();
    expect(el.style.getPropertyValue('--ui-avatar-radius')).toBe('999px');
  });

  it('applies interactive accessibility semantics', async () => {
    const el = document.createElement('ui-avatar');
    el.setAttribute('interactive', '');
    document.body.appendChild(el);
    await flushMicrotask();

    expect(el.getAttribute('role')).toBe('button');
    expect(el.getAttribute('tabindex')).toBe('0');
    expect(el.getAttribute('aria-disabled')).toBe('false');
  });

  it('shows badge and status when provided', async () => {
    const el = document.createElement('ui-avatar');
    el.setAttribute('badge', '2');
    el.setAttribute('status', 'online');
    document.body.appendChild(el);
    await flushMicrotask();

    expect((el.shadowRoot?.querySelector('.badge') as HTMLElement | null)?.textContent).toBe('2');
    expect(el.shadowRoot?.querySelector('.status')).toBeTruthy();
  });
});
