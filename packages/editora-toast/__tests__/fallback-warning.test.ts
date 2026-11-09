// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  document.head.innerHTML = '';
  document.body.innerHTML = '';
  document.documentElement.style.removeProperty('--editora-toast-stylesheet');
  vi.restoreAllMocks();
  vi.resetModules();
});

async function showOne() {
  const { toastAdvanced } = await import('../src/index');
  toastAdvanced.show({ message: 'Saved', level: 'success' });
  await new Promise((resolve) => setTimeout(resolve, 50));
}

describe('toast stylesheet fallback', () => {
  it('warns once and injects a minimal style when toast.css is missing', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    await showOne();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0][0])).toContain("@editora/toast/toast.css");
    expect(document.querySelector('style[data-editora-toast-fallback]')).not.toBeNull();
  });

  it('stays quiet when the stylesheet marker is present (a bundled toast.css)', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    document.documentElement.style.setProperty('--editora-toast-stylesheet', '1');
    await showOne();
    expect(warn).not.toHaveBeenCalled();
    expect(document.querySelector('style[data-editora-toast-fallback]')).toBeNull();
  });
});
