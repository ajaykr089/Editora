import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../components/ui-dialog';

function styleText(el: Element): string {
  return (el.shadowRoot?.querySelector('style') as HTMLStyleElement | null)?.textContent || '';
}

describe('ui-dialog disconnect behavior', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('does not emit a close cycle for same-tick disconnect/reconnect', async () => {
    const el = document.createElement('ui-dialog');
    const closeSpy = vi.fn();
    const dismissSpy = vi.fn();

    el.setAttribute('open', '');
    el.addEventListener('ui-close', closeSpy as EventListener);
    el.addEventListener('ui-dismiss', dismissSpy as EventListener);

    document.body.appendChild(el);
    await Promise.resolve();

    document.body.removeChild(el);
    document.body.appendChild(el);

    vi.runAllTimers();
    await Promise.resolve();

    expect(el.hasAttribute('open')).toBe(true);
    expect(closeSpy).not.toHaveBeenCalled();
    expect(dismissSpy).not.toHaveBeenCalled();
  });

  it('still emits unmount close when the dialog stays disconnected', async () => {
    const el = document.createElement('ui-dialog');
    const closeSpy = vi.fn();

    el.setAttribute('open', '');
    el.addEventListener('ui-close', closeSpy as EventListener);

    document.body.appendChild(el);
    await Promise.resolve();

    document.body.removeChild(el);

    vi.runAllTimers();
    await Promise.resolve();

    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(closeSpy.mock.calls[0]?.[0]?.detail).toMatchObject({
      action: 'dismiss',
      source: 'unmount'
    });
  });

  it('does not keep a transform on the open panel state', async () => {
    const el = document.createElement('ui-dialog');
    el.setAttribute('open', '');
    document.body.appendChild(el);
    await Promise.resolve();

    const css = styleText(el);
    // Open and close are animations on data-state. The enter fills backwards, so nothing animated
    // (a transform makes a containing block and blurs text) is left on the panel once it ends.
    expect(css).toContain(".overlay[data-state='open']:not([data-instant]) .panel");
    expect(css).toMatch(/ui-dialog-panel-in[^;]*backwards;/);
    expect(css).not.toMatch(/\.panel \{[^}]*\n\s+transform:/);
  });

  it('keeps the overlay node stable across open toggles', async () => {
    const el = document.createElement('ui-dialog');
    document.body.appendChild(el);
    await Promise.resolve();

    const overlayBefore = el.shadowRoot?.querySelector('.overlay');
    expect(overlayBefore).toBeTruthy();

    el.setAttribute('open', '');
    await Promise.resolve();
    el.removeAttribute('open');
    await Promise.resolve();
    el.setAttribute('open', '');
    await Promise.resolve();

    const overlayAfter = el.shadowRoot?.querySelector('.overlay');
    expect(overlayAfter).toBe(overlayBefore);
  });
});
