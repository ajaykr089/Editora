import { afterEach, describe, expect, it, vi } from 'vitest';
import '../components/ui-card';

function flushMicrotask() {
  return Promise.resolve();
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-card', () => {
  it('normalizes numeric and full radius values', async () => {
    const el = document.createElement('ui-card');
    el.setAttribute('radius', '12');
    document.body.appendChild(el);
    await flushMicrotask();
    expect(el.style.getPropertyValue('--ui-card-radius')).toBe('12px');

    el.setAttribute('radius', 'full');
    await flushMicrotask();
    expect(el.style.getPropertyValue('--ui-card-radius')).toBe('999px');
  });

  it('reveals named sections when content is slotted', async () => {
    const el = document.createElement('ui-card');
    el.innerHTML = `
      <div slot="header">Quick start</div>
      <div slot="footer">Footer actions</div>
      <p>Body content</p>
    `;

    document.body.appendChild(el);
    await flushMicrotask();

    const header = el.shadowRoot?.querySelector('.header') as HTMLElement | null;
    const footer = el.shadowRoot?.querySelector('.footer') as HTMLElement | null;
    expect(header?.hidden).toBe(false);
    expect(footer?.hidden).toBe(false);
  });

  it('adds accessible interactive semantics and click keyboard support', async () => {
    const el = document.createElement('ui-card');
    el.setAttribute('interactive', '');
    document.body.appendChild(el);
    await flushMicrotask();

    const clickSpy = vi.fn();
    el.addEventListener('click', clickSpy);

    expect(el.getAttribute('role')).toBe('button');
    expect(el.getAttribute('tabindex')).toBe('0');
    expect(el.getAttribute('aria-disabled')).toBe('false');

    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    el.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));

    expect(clickSpy).toHaveBeenCalledTimes(2);
  });

  it('marks disabled interactive cards as aria-disabled and unfocusable', async () => {
    const el = document.createElement('ui-card');
    el.setAttribute('interactive', '');
    el.setAttribute('disabled', '');
    document.body.appendChild(el);
    await flushMicrotask();

    expect(el.getAttribute('role')).toBe('button');
    expect(el.getAttribute('aria-disabled')).toBe('true');
    expect(el.getAttribute('tabindex')).toBe('-1');
  });
});
