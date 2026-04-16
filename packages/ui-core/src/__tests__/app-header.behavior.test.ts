import { afterEach, describe, expect, it, vi } from 'vitest';
import '../components/ui-app-header';

function flushMicrotask() {
  return Promise.resolve();
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-app-header', () => {
  it('normalizes numeric and full radius values', async () => {
    const el = document.createElement('ui-app-header');
    el.setAttribute('radius', '12');
    document.body.appendChild(el);
    await flushMicrotask();
    expect(el.style.getPropertyValue('--ui-app-header-radius')).toBe('12px');

    el.setAttribute('radius', 'full');
    await flushMicrotask();
    expect(el.style.getPropertyValue('--ui-app-header-radius')).toBe('999px');
  });

  it('renders the subtitle slot without needing a rerender toggle', async () => {
    const el = document.createElement('ui-app-header');
    el.innerHTML = `
      <div slot="title">Operations</div>
      <div slot="subtitle">Shift A</div>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    const subtitle = el.shadowRoot?.querySelector('.subtitle-slot slot[name="subtitle"]') as HTMLSlotElement | null;
    expect(subtitle).toBeTruthy();
  });

  it('emits menu-trigger when the built-in menu button is clicked', async () => {
    const el = document.createElement('ui-app-header');
    el.setAttribute('show-menu-button', '');
    document.body.appendChild(el);
    await flushMicrotask();

    const spy = vi.fn();
    el.addEventListener('menu-trigger', spy);

    const button = el.shadowRoot?.querySelector('.menu-btn') as HTMLButtonElement | null;
    button?.click();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('disables backdrop blur for sticky headers to avoid scroll repaint flicker', async () => {
    const el = document.createElement('ui-app-header');
    el.setAttribute('sticky', '');
    document.body.appendChild(el);
    await flushMicrotask();

    const styleText = el.shadowRoot?.querySelector('style')?.textContent ?? '';
    expect(styleText).toContain('--ui-app-header-surface-backdrop: none;');
    expect(styleText).toContain('backdrop-filter: var(--ui-app-header-surface-backdrop);');
    expect(styleText).toContain('contain: paint;');
    expect(styleText).toContain('transform: translateZ(0);');
  });
});
