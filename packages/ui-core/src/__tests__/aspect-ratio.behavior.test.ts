import { afterEach, describe, expect, it, vi } from 'vitest';
import '../components/ui-aspect-ratio';

function flushMicrotask() {
  return Promise.resolve();
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-aspect-ratio', () => {
  it('normalizes numeric and full radius values', async () => {
    const el = document.createElement('ui-aspect-ratio');
    el.setAttribute('radius', '12');
    document.body.appendChild(el);
    await flushMicrotask();
    expect(el.style.getPropertyValue('--ui-aspect-radius')).toBe('12px');

    el.setAttribute('radius', 'full');
    await flushMicrotask();
    expect(el.style.getPropertyValue('--ui-aspect-radius')).toBe('999px');
  });

  it('renders the ratio badge when enabled', async () => {
    const el = document.createElement('ui-aspect-ratio');
    el.setAttribute('ratio', '4/3');
    el.setAttribute('show-ratio-badge', '');
    document.body.appendChild(el);
    await flushMicrotask();

    const badge = el.shadowRoot?.querySelector('.badge') as HTMLElement | null;
    expect(badge?.hidden).toBe(false);
    expect(badge?.textContent).toBe('4/3');
  });

  it('emits change detail when ratio changes', async () => {
    const el = document.createElement('ui-aspect-ratio');
    const spy = vi.fn();
    el.addEventListener('change', spy);

    document.body.appendChild(el);
    await flushMicrotask();

    el.setAttribute('ratio', '1/1');
    await flushMicrotask();

    expect(spy).toHaveBeenCalled();
    const payload = spy.mock.calls.at(-1)?.[0] as CustomEvent | undefined;
    expect(payload?.detail.ratioText).toBe('1/1');
  });
});
