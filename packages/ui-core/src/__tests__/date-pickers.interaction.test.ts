import { beforeEach, describe, expect, it, vi } from 'vitest';
import '../components/ui-color-picker';
import '../components/ui-date-picker';
import '../components/ui-date-range-picker';
import '../components/ui-time-picker';
import '../components/ui-date-time-picker';
import '../components/ui-date-range-time-picker';

function createElement(tagName: string, attrs: Record<string, string | boolean> = {}) {
  const el = document.createElement(tagName) as HTMLElement;
  Object.entries(attrs).forEach(([name, value]) => {
    if (value === false) return;
    if (value === true) el.setAttribute(name, '');
    else el.setAttribute(name, String(value));
  });
  document.body.appendChild(el);
  return el;
}

async function settle() {
  await Promise.resolve();
  await new Promise((resolve) => setTimeout(resolve, 0));
}

async function flushAnimationFrame() {
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

describe('date/time pickers interaction flows', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('ui-date-picker commits value on Enter and emits change', async () => {
    const el = createElement('ui-date-picker', { locale: 'en-US' });
    let changeDetail: any = null;
    el.addEventListener('change', (event: Event) => {
      changeDetail = (event as CustomEvent).detail;
    });

    await settle();
    const input = el.shadowRoot?.querySelector('.input') as HTMLInputElement | null;
    expect(input).toBeTruthy();

    input!.value = '2026-03-05';
    input!.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    input!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));

    await settle();
    expect(el.getAttribute('value')).toBe('2026-03-05');
    expect(changeDetail).toBeTruthy();
    expect(changeDetail.value).toBe('2026-03-05');
    expect(changeDetail.source).toBe('enter');
  });

  it('ui-date-picker emits invalid on malformed blur input', async () => {
    const el = createElement('ui-date-picker', { locale: 'en-US' });
    let invalidDetail: any = null;
    el.addEventListener('invalid', (event: Event) => {
      invalidDetail = (event as CustomEvent).detail;
    });

    await settle();
    const input = el.shadowRoot?.querySelector('.input') as HTMLInputElement | null;
    expect(input).toBeTruthy();

    input!.value = 'abc';
    input!.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    input!.dispatchEvent(new FocusEvent('focusout', { bubbles: true, composed: true }));

    await settle();
    expect(invalidDetail).toBeTruthy();
    expect(invalidDetail.reason).toBe('parse');
    expect(el.getAttribute('value')).toBeNull();

    const error = el.shadowRoot?.querySelector('.error') as HTMLElement | null;
    expect(error).toBeTruthy();
    expect(error?.hasAttribute('hidden')).toBe(false);
  });

  it('ui-date-picker closes and commits on calendar select when close-on-select is enabled', async () => {
    const el = createElement('ui-date-picker', { 'close-on-select': true });
    el.setAttribute('open', '');
    await settle();

    const calendar = document.querySelector('.ui-date-picker-overlay-host ui-calendar') as HTMLElement | null;
    expect(calendar).toBeTruthy();

    calendar!.dispatchEvent(
      new CustomEvent('select', {
        detail: { value: '2026-04-10' },
        bubbles: true,
        composed: true
      })
    );

    await settle();
    expect(el.getAttribute('value')).toBe('2026-04-10');
    expect(el.hasAttribute('open')).toBe(false);
  });

  it('ui-date-picker normalizes reversed min/max bounds and clamps external value updates', async () => {
    const el = createElement('ui-date-picker', {
      min: '2026-12-31',
      max: '2026-01-01',
      value: '2026-06-15'
    });
    await settle();
    expect(el.getAttribute('value')).toBe('2026-06-15');

    el.setAttribute('value', '2027-02-20');
    await settle();
    expect(el.getAttribute('value')).toBe('2026-12-31');
  });

  it('ui-date-picker does not commit invalid blur while popover is open', async () => {
    const el = createElement('ui-date-picker', { locale: 'en-US' });
    el.setAttribute('open', '');
    await settle();

    let invalidDetail: any = null;
    el.addEventListener('invalid', (event: Event) => {
      invalidDetail = (event as CustomEvent).detail;
    });

    const input = el.shadowRoot?.querySelector('.input') as HTMLInputElement | null;
    const overlayCalendar = document.querySelector('.ui-date-picker-overlay-host ui-calendar') as HTMLElement | null;
    expect(input).toBeTruthy();
    expect(overlayCalendar).toBeTruthy();

    input!.value = 'abc';
    input!.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    input!.dispatchEvent(
      new FocusEvent('focusout', {
        bubbles: true,
        composed: true,
        relatedTarget: overlayCalendar
      })
    );

    await settle();
    expect(invalidDetail).toBeNull();
    expect(el.getAttribute('value')).toBeNull();
  });

  it('ui-date-picker ignores scroll events from inside its own overlay', async () => {
    const el = createElement('ui-date-picker') as HTMLElement & { _overlay?: HTMLElement | null };
    el.setAttribute('open', '');
    await settle();
    await flushAnimationFrame();

    const spy = vi.spyOn(el as any, '_positionOverlay');
    const panel = el._overlay?.querySelector('.panel') as HTMLElement | null;
    expect(panel).toBeTruthy();

    panel?.dispatchEvent(new Event('scroll', { bubbles: false, composed: true }));
    await flushAnimationFrame();

    expect(spy).not.toHaveBeenCalled();
  });

  it('ui-date-range-picker single-field accepts ISO date without splitting on hyphens', async () => {
    const el = createElement('ui-date-range-picker', {
      locale: 'en-US',
      'range-variant': 'single-field'
    });
    let invalidDetail: any = null;
    el.addEventListener('invalid', (event: Event) => {
      invalidDetail = (event as CustomEvent).detail;
    });

    await settle();
    const input = el.shadowRoot?.querySelector('.single') as HTMLInputElement | null;
    expect(input).toBeTruthy();

    input!.value = '2026-03-05';
    input!.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    input!.dispatchEvent(new FocusEvent('focusout', { bubbles: true, composed: true }));
    await settle();

    expect(invalidDetail).toBeNull();
    expect(el.getAttribute('value')).toBe('{"start":"2026-03-05"}');
  });

  it('ui-date-range-picker normalizes reversed bounds and clamps external value updates', async () => {
    const el = createElement('ui-date-range-picker', {
      min: '2026-12-31',
      max: '2026-01-01',
      value: '{"start":"2026-02-10","end":"2026-02-18"}'
    });
    await settle();
    expect(el.getAttribute('value')).toBe('{"start":"2026-02-10","end":"2026-02-18"}');

    el.setAttribute('value', '{"start":"2027-02-10","end":"2027-02-18"}');
    await settle();
    expect(el.getAttribute('value')).toBe('{"start":"2026-12-31","end":"2026-12-31"}');
  });

  it('ui-date-range-picker does not parse/commit on blur while popover is open', async () => {
    const el = createElement('ui-date-range-picker', { locale: 'en-US' });
    el.setAttribute('open', '');
    await settle();

    let invalidDetail: any = null;
    el.addEventListener('invalid', (event: Event) => {
      invalidDetail = (event as CustomEvent).detail;
    });

    const startInput = el.shadowRoot?.querySelector('.start') as HTMLInputElement | null;
    const overlayCalendar = document.querySelector('.ui-date-range-picker-overlay-host ui-calendar') as HTMLElement | null;
    expect(startInput).toBeTruthy();
    expect(overlayCalendar).toBeTruthy();

    startInput!.value = 'abc';
    startInput!.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    startInput!.dispatchEvent(
      new FocusEvent('focusout', {
        bubbles: true,
        composed: true,
        relatedTarget: overlayCalendar
      })
    );

    await settle();
    expect(invalidDetail).toBeNull();
    expect(el.getAttribute('value')).toBeNull();
  });

  it('ui-date-range-picker ignores scroll events from inside its own overlay', async () => {
    const el = createElement('ui-date-range-picker') as HTMLElement & { _overlay?: HTMLElement | null };
    el.setAttribute('open', '');
    await settle();
    await flushAnimationFrame();

    const spy = vi.spyOn(el as any, '_positionOverlay');
    const panel = el._overlay?.querySelector('.panel') as HTMLElement | null;
    expect(panel).toBeTruthy();

    panel?.dispatchEvent(new Event('scroll', { bubbles: false, composed: true }));
    await flushAnimationFrame();

    expect(spy).not.toHaveBeenCalled();
  });

  it('ui-time-picker applies panel selection and commits on Apply', async () => {
    const el = createElement('ui-time-picker', { value: '09:00', step: '15' });
    el.setAttribute('open', '');
    await settle();

    const hour = document.querySelector('select[data-segment="hours"]') as HTMLSelectElement | null;
    const minute = document.querySelector('select[data-segment="minutes"]') as HTMLSelectElement | null;
    const apply = document.querySelector('[data-action="apply"]') as HTMLButtonElement | null;
    expect(hour).toBeTruthy();
    expect(minute).toBeTruthy();
    expect(apply).toBeTruthy();

    hour!.value = '10';
    hour!.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    minute!.value = '30';
    minute!.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    apply!.click();

    await settle();
    expect(el.getAttribute('value')).toBe('10:30');
    expect(el.hasAttribute('open')).toBe(false);
  });

  it('ui-time-picker ignores scroll events from inside its own overlay', async () => {
    const el = createElement('ui-time-picker') as HTMLElement & { _overlay?: HTMLElement | null };
    el.setAttribute('open', '');
    await settle();
    await flushAnimationFrame();

    const spy = vi.spyOn(el as any, '_positionOverlay');
    const panel = el._overlay?.querySelector('.panel') as HTMLElement | null;
    expect(panel).toBeTruthy();

    panel?.dispatchEvent(new Event('scroll', { bubbles: false, composed: true }));
    await flushAnimationFrame();

    expect(spy).not.toHaveBeenCalled();
  });

  it('ui-date-time-picker commits selected date + time from panel', async () => {
    const el = createElement('ui-date-time-picker', { value: '2026-02-23T09:00' });
    el.setAttribute('open', '');
    await settle();

    const calendar = document.querySelector('.dt-calendar') as HTMLElement | null;
    expect(calendar).toBeTruthy();

    calendar!.dispatchEvent(
      new CustomEvent('select', {
        detail: { value: '2026-02-24' },
        bubbles: true,
        composed: true
      })
    );

    await settle();
    const hour = document.querySelector('select[data-segment="hours"]') as HTMLSelectElement | null;
    const minute = document.querySelector('select[data-segment="minutes"]') as HTMLSelectElement | null;
    const apply = document.querySelector('[data-action="apply"]') as HTMLButtonElement | null;
    expect(hour).toBeTruthy();
    expect(minute).toBeTruthy();
    expect(apply).toBeTruthy();

    hour!.value = '11';
    hour!.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    minute!.value = '20';
    minute!.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    apply!.click();

    await settle();
    expect(el.getAttribute('value')).toBe('2026-02-24T11:20');
  });

  it('ui-date-time-picker ignores scroll events from inside its own overlay', async () => {
    const el = createElement('ui-date-time-picker') as HTMLElement & { _overlay?: HTMLElement | null };
    el.setAttribute('open', '');
    await settle();
    await flushAnimationFrame();

    const spy = vi.spyOn(el as any, '_positionOverlay');
    const panel = el._overlay?.querySelector('.panel') as HTMLElement | null;
    expect(panel).toBeTruthy();

    panel?.dispatchEvent(new Event('scroll', { bubbles: false, composed: true }));
    await flushAnimationFrame();

    expect(spy).not.toHaveBeenCalled();
  });

  it('ui-date-range-time-picker auto-normalizes reverse ranges on apply', async () => {
    const el = createElement('ui-date-range-time-picker', { 'auto-normalize': true });
    el.setAttribute('open', '');
    await settle();

    const calendar = document.querySelector('.drtp-calendar') as HTMLElement | null;
    expect(calendar).toBeTruthy();
    calendar!.dispatchEvent(
      new CustomEvent('change', {
        detail: { mode: 'range', start: '2026-02-20', end: '2026-02-18' },
        bubbles: true,
        composed: true
      })
    );

    await settle();
    const startHour = document.querySelector('select[data-time="start"][data-segment="hours"]') as HTMLSelectElement | null;
    const startMinute = document.querySelector('select[data-time="start"][data-segment="minutes"]') as HTMLSelectElement | null;
    const endHour = document.querySelector('select[data-time="end"][data-segment="hours"]') as HTMLSelectElement | null;
    const endMinute = document.querySelector('select[data-time="end"][data-segment="minutes"]') as HTMLSelectElement | null;
    const apply = document.querySelector('[data-action="apply"]') as HTMLButtonElement | null;
    expect(startHour && startMinute && endHour && endMinute && apply).toBeTruthy();

    startHour!.value = '10';
    startHour!.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    startMinute!.value = '30';
    startMinute!.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    endHour!.value = '08';
    endHour!.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    endMinute!.value = '15';
    endMinute!.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    apply!.click();

    await settle();
    const serialized = el.getAttribute('value');
    expect(serialized).toBeTruthy();
    const parsed = JSON.parse(serialized || '{}');
    expect(parsed.start <= parsed.end).toBe(true);
  });

  it('ui-date-range-time-picker ignores scroll events from inside its own overlay', async () => {
    const el = createElement('ui-date-range-time-picker') as HTMLElement & { _overlay?: HTMLElement | null };
    el.setAttribute('open', '');
    await settle();
    await flushAnimationFrame();

    const spy = vi.spyOn(el as any, '_positionOverlay');
    const panel = el._overlay?.querySelector('.panel') as HTMLElement | null;
    expect(panel).toBeTruthy();

    panel?.dispatchEvent(new Event('scroll', { bubbles: false, composed: true }));
    await flushAnimationFrame();

    expect(spy).not.toHaveBeenCalled();
  });

  it('ui-color-picker ignores scroll events from inside its own overlay', async () => {
    const el = createElement('ui-color-picker') as HTMLElement & {
      openPopover?: () => void;
      _overlayRoot?: ShadowRoot | null;
    };
    el.setAttribute('mode', 'popover');
    await settle();
    el.openPopover?.();
    await settle();
    await flushAnimationFrame();

    const spy = vi.spyOn(el as any, '_positionOverlay');
    const panel = el._overlayRoot?.querySelector('.panel') as HTMLElement | null;
    expect(panel).toBeTruthy();

    panel?.dispatchEvent(new Event('scroll', { bubbles: false, composed: true }));
    await flushAnimationFrame();

    expect(spy).not.toHaveBeenCalled();
  });
});
