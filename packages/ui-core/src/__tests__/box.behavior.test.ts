import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-box';

function flushMicrotask() {
  return Promise.resolve();
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-box', () => {
  it('keeps the default box borderless until a surface variant is applied', async () => {
    const el = document.createElement('ui-box');
    document.body.appendChild(el);
    await flushMicrotask();

    expect(el.style.border).toBe('');
    expect(getComputedStyle(el).borderTopStyle).toBe('');
  });

  it('normalizes numeric and full radius values', async () => {
    const el = document.createElement('ui-box');
    el.setAttribute('radius', '12');
    document.body.appendChild(el);
    await flushMicrotask();

    expect(el.style.getPropertyValue('--ui-box-radius')).toBe('12px');

    el.setAttribute('radius', 'full');
    await flushMicrotask();
    expect(el.style.getPropertyValue('--ui-box-radius')).toBe('9999px');
  });

  it('applies inline spacing styles without requiring responsive rerendering', async () => {
    const el = document.createElement('ui-box');
    el.setAttribute('p', '12px');
    el.setAttribute('bg', '#ff0000');
    document.body.appendChild(el);
    await flushMicrotask();

    expect(el.style.getPropertyValue('padding-top')).toBe('12px');
    expect(el.style.getPropertyValue('padding-right')).toBe('12px');
    expect(el.style.getPropertyValue('background')).toBe('rgb(255, 0, 0)');
  });

  it('applies interactive accessibility semantics', async () => {
    const el = document.createElement('ui-box');
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
});
