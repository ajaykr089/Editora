// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(async () => {
  document.head.innerHTML = '';
  document.body.innerHTML = '';
  document.documentElement.style.removeProperty('--editora-toast-stylesheet');
  vi.restoreAllMocks();
  vi.resetModules();
});

const settle = () => new Promise((resolve) => setTimeout(resolve, 50));

async function showOne(entry: '../src/index' | '../src/lite' = '../src/index', config?: Record<string, unknown>) {
  const { toastAdvanced } = await import(/* @vite-ignore */ entry);
  if (config) toastAdvanced.configure(config);
  toastAdvanced.show({ message: 'Saved', level: 'success' });
  await settle();
  return toastAdvanced;
}

describe('the stylesheet', () => {
  it('is put on the page by the first toast, first in <head> so the app can override it, with no warning', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const appStyles = document.createElement('style');
    appStyles.textContent = '.editora-toast { border-radius: 2px }';
    document.head.appendChild(appStyles);

    await showOne();

    const style = document.querySelector<HTMLStyleElement>('style[data-editora-toast]');
    expect(style).not.toBeNull();
    expect(document.head.firstElementChild).toBe(style);
    expect(style!.textContent).toContain('--editora-toast-stylesheet');
    expect(style!.textContent!.length).toBeGreaterThan(10000);
    expect(warn).not.toHaveBeenCalled();
    expect(document.querySelector('style[data-editora-toast-fallback]')).toBeNull();
  });

  it('is put there once, however many toasts are shown', async () => {
    const toastAdvanced = await showOne();
    toastAdvanced.show({ message: 'Again', position: 'bottom-left' });
    await settle();
    expect(document.querySelectorAll('style[data-editora-toast]').length).toBe(1);
  });

  it('carries the nonce from configure() or from <meta property="csp-nonce">', async () => {
    await showOne('../src/index', { nonce: 'from-config' });
    expect(document.querySelector<HTMLStyleElement>('style[data-editora-toast]')!.nonce).toBe('from-config');

    document.head.innerHTML = '';
    vi.resetModules();
    const meta = document.createElement('meta');
    meta.setAttribute('property', 'csp-nonce');
    meta.setAttribute('nonce', 'from-meta');
    document.head.appendChild(meta);
    await showOne();
    expect(document.querySelector<HTMLStyleElement>('style[data-editora-toast]')!.nonce).toBe('from-meta');
  });

  it('is left out when toast.css is already loaded (its marker, as in a bundled stylesheet)', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    document.documentElement.style.setProperty('--editora-toast-stylesheet', '1');
    await showOne();
    expect(document.querySelector('style[data-editora-toast]')).toBeNull();
    expect(warn).not.toHaveBeenCalled();
  });

  it('is left out with injectStyles: false, and then a missing toast.css gets the warning and a minimal style', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    await showOne('../src/index', { injectStyles: false });
    expect(document.querySelector('style[data-editora-toast]')).toBeNull();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0][0])).toContain('@editora/toast/toast.css');
    expect(document.querySelector('style[data-editora-toast-fallback]')).not.toBeNull();
  });

  it('is not in the lite entry, which warns when toast.css is missing', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    await showOne('../src/lite');
    expect(document.querySelector('style[data-editora-toast]')).toBeNull();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(document.querySelector('style[data-editora-toast-fallback]')).not.toBeNull();
  });

  it('the lite entry stays quiet when the app loaded toast.css', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    document.documentElement.style.setProperty('--editora-toast-stylesheet', '1');
    await showOne('../src/lite');
    expect(warn).not.toHaveBeenCalled();
    expect(document.querySelector('style[data-editora-toast-fallback]')).toBeNull();
  });
});
