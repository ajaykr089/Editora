import { afterEach, describe, expect, it, vi } from 'vitest';
import '../components/ui-badge';

function flushMicrotask() {
  return Promise.resolve();
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-badge', () => {
  it('normalizes numeric and full radius values', async () => {
    const el = document.createElement('ui-badge');
    el.setAttribute('radius', '12');
    document.body.appendChild(el);
    await flushMicrotask();

    expect(el.style.getPropertyValue('--ui-badge-radius')).toBe('12px');

    el.setAttribute('radius', 'full');
    await flushMicrotask();
    expect(el.style.getPropertyValue('--ui-badge-radius')).toBe('9999px');
  });

  it('applies interactive accessibility semantics', async () => {
    const el = document.createElement('ui-badge');
    el.setAttribute('interactive', '');
    document.body.appendChild(el);
    await flushMicrotask();

    expect(el.getAttribute('role')).toBe('button');
    expect(el.getAttribute('tabindex')).toBe('0');
    expect(el.getAttribute('aria-disabled')).toBe('false');

    el.setAttribute('disabled', '');
    await flushMicrotask();
    expect(el.getAttribute('tabindex')).toBe('-1');
    expect(el.getAttribute('aria-disabled')).toBe('true');
  });

  it('emits remove details from the remove button', async () => {
    const el = document.createElement('ui-badge');
    el.setAttribute('text', 'Monitoring');
    el.setAttribute('removable', '');
    document.body.appendChild(el);
    await flushMicrotask();

    const onRemove = vi.fn();
    el.addEventListener('remove', onRemove);

    const button = el.shadowRoot?.querySelector('.remove-btn') as HTMLButtonElement | null;
    button?.click();

    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onRemove.mock.calls[0]?.[0]).toBeInstanceOf(CustomEvent);
    expect((onRemove.mock.calls[0]?.[0] as CustomEvent).detail).toEqual({
      text: 'Monitoring',
      source: 'button',
    });
  });

  it('keeps the badge node stable for live visual and a11y-only attribute changes', async () => {
    const el = document.createElement('ui-badge');
    el.setAttribute('text', 'Ops');
    document.body.appendChild(el);
    await flushMicrotask();

    const badgeBefore = el.shadowRoot?.querySelector('.badge');
    expect(badgeBefore).toBeTruthy();

    el.setAttribute('tone', 'success');
    el.setAttribute('variant', 'soft');
    el.setAttribute('interactive', '');
    el.setAttribute('disabled', '');
    el.setAttribute('max-width', '120px');
    await flushMicrotask();

    const badgeAfter = el.shadowRoot?.querySelector('.badge');
    expect(badgeAfter).toBe(badgeBefore);
  });
});
