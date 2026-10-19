import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { notify } from '../notify';

const regions = () => Array.from(document.querySelectorAll<HTMLElement>('[data-rte-notices]'));
const notices = () => Array.from(document.querySelectorAll<HTMLElement>('.rte-notice'));

beforeEach(() => {
  vi.useFakeTimers();
  document.body.innerHTML = '';
});

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = '';
  document.getElementById('rte-notice-styles')?.remove();
});

describe('notify', () => {
  it('shows the message, and does not stop the page', () => {
    const blocked = vi.spyOn(window, 'alert').mockImplementation(() => {});
    notify('Select some text first');
    expect(notices().map((n) => n.textContent)).toEqual(['Select some text first']);
    expect(blocked).not.toHaveBeenCalled();
    blocked.mockRestore();
  });

  it('announces an ordinary message politely and an error assertively', () => {
    notify('Saved');
    notify('Export failed', 'error');
    const polite = document.querySelector('[data-rte-notices="polite"]')!;
    const assertive = document.querySelector('[data-rte-notices="assertive"]')!;
    expect(polite.getAttribute('aria-live')).toBe('polite');
    expect(polite.getAttribute('role')).toBe('status');
    expect(assertive.getAttribute('aria-live')).toBe('assertive');
    expect(assertive.getAttribute('role')).toBe('alert');
    expect(polite.textContent).toBe('Saved');
    expect(assertive.textContent).toBe('Export failed');
  });

  it('puts the message in the text, never in the markup', () => {
    notify('<img src=x onerror="window.__pwned=1">');
    expect(document.querySelector('.rte-notice img')).toBeNull();
    expect(notices()[0].textContent).toBe('<img src=x onerror="window.__pwned=1">');
  });

  it('goes away by itself, and takes its empty region with it', () => {
    notify('Saved');
    vi.advanceTimersByTime(4900);
    expect(notices()).toHaveLength(1);
    vi.advanceTimersByTime(200);
    expect(notices()).toHaveLength(0);
    expect(regions()).toHaveLength(0);
  });

  it('keeps an error up longer than an ordinary message', () => {
    notify('Export failed', 'error');
    vi.advanceTimersByTime(6000);
    expect(notices()).toHaveLength(1);
    vi.advanceTimersByTime(2100);
    expect(notices()).toHaveLength(0);
  });

  it('goes away when it is clicked', () => {
    notify('Saved');
    notices()[0].click();
    expect(notices()).toHaveLength(0);
  });

  it('stacks different messages and shows the same one once', () => {
    notify('One');
    notify('Two');
    notify('One');
    expect(notices().map((n) => n.textContent)).toEqual(['Two', 'One']);
    expect(regions()).toHaveLength(1);
  });

  it('adds its styles once', () => {
    notify('One');
    notify('Two', 'error');
    expect(document.querySelectorAll('#rte-notice-styles')).toHaveLength(1);
  });
});
