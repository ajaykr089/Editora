import { beforeEach, describe, expect, it, vi } from 'vitest';
import '../components/ui-calendar';

function settle() {
  return new Promise<void>((resolve) => setTimeout(resolve, 0));
}

function mountCalendar(attrs: Record<string, string> = {}) {
  const el = document.createElement('ui-calendar') as HTMLElement;
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  document.body.appendChild(el);
  return el;
}

describe('ui-calendar behavior', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('emits compatibility and ui events with pointer source', async () => {
    const el = mountCalendar({ year: '2026', month: '3', selection: 'single' });
    await settle();

    const selectSpy = vi.fn();
    const uiSelectSpy = vi.fn();
    const changeSpy = vi.fn();
    const uiChangeSpy = vi.fn();
    el.addEventListener('select', selectSpy as EventListener);
    el.addEventListener('ui-select', uiSelectSpy as EventListener);
    el.addEventListener('change', changeSpy as EventListener);
    el.addEventListener('ui-change', uiChangeSpy as EventListener);

    const day = el.shadowRoot?.querySelector('.day[data-date="2026-03-09"]') as HTMLButtonElement | null;
    expect(day).toBeTruthy();
    day?.click();
    await settle();

    expect(selectSpy).toHaveBeenCalledTimes(1);
    expect(uiSelectSpy).toHaveBeenCalledTimes(1);
    expect(changeSpy).toHaveBeenCalledTimes(1);
    expect(uiChangeSpy).toHaveBeenCalledTimes(1);

    const detail = (uiSelectSpy.mock.calls[0][0] as CustomEvent<{ source: string; value: string }>).detail;
    expect(detail.value).toBe('2026-03-09');
    expect(detail.source).toBe('pointer');
  });

  it('normalizes swapped min/max bounds instead of blocking all dates', async () => {
    const el = mountCalendar({
      year: '2026',
      month: '3',
      min: '2026-03-20',
      max: '2026-03-05',
    });
    await settle();

    const inRange = el.shadowRoot?.querySelector('.day[data-date="2026-03-10"]') as HTMLButtonElement | null;
    expect(inRange).toBeTruthy();
    expect(inRange?.getAttribute('aria-disabled')).toBe('false');
  });

  it('does not trap Tab key navigation', async () => {
    const el = mountCalendar({ year: '2026', month: '3' });
    await settle();

    const focusDay = el.shadowRoot?.querySelector('.day[tabindex="0"]') as HTMLButtonElement | null;
    expect(focusDay).toBeTruthy();
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    const notCanceled = focusDay?.dispatchEvent(tabEvent);

    expect(notCanceled).toBe(true);
    expect(tabEvent.defaultPrevented).toBe(false);
  });

  it('uses rtl-aware horizontal arrow navigation', async () => {
    const el = mountCalendar({ year: '2026', month: '3', dir: 'rtl' });
    await settle();

    const start = el.shadowRoot?.querySelector('.day[data-date="2026-03-09"]') as HTMLButtonElement | null;
    expect(start).toBeTruthy();
    start?.focus();
    start?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
    await settle();

    const focused = el.shadowRoot?.querySelector('.day[tabindex="0"]') as HTMLButtonElement | null;
    expect(focused?.getAttribute('data-date')).toBe('2026-03-08');
  });

  it('emits ui-month-change when navigating months', async () => {
    const el = mountCalendar({ year: '2026', month: '3' });
    await settle();

    const monthSpy = vi.fn();
    el.addEventListener('ui-month-change', monthSpy as EventListener);

    const next = el.shadowRoot?.querySelector('.nav-btn[data-action="next-month"]') as HTMLButtonElement | null;
    expect(next).toBeTruthy();
    next?.click();
    await settle();

    expect(monthSpy).toHaveBeenCalledTimes(1);
    const detail = (monthSpy.mock.calls[0][0] as CustomEvent<{ year: number; month: number; source: string }>).detail;
    expect(detail.year).toBe(2026);
    expect(detail.month).toBe(4);
    expect(detail.source).toBe('pointer');
  });
});
