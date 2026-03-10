import { afterEach, describe, expect, it, vi } from 'vitest';
import '../components/ui-date-field';
import '../components/ui-time-field';
import '../components/ui-form';

function flushMicrotask() {
  return Promise.resolve();
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-date-field / ui-time-field', () => {
  it('increments date segments and respects locale order', async () => {
    const el = document.createElement('ui-date-field');
    el.setAttribute('locale', 'en-GB');
    el.setAttribute('value', '2026-03-09');
    document.body.appendChild(el);
    await flushMicrotask();

    const firstSegment = el.shadowRoot?.querySelector('.segment') as HTMLElement | null;
    expect(firstSegment?.getAttribute('data-segment')).toBe('day');

    const day = el.shadowRoot?.querySelector('[data-segment="day"]') as HTMLElement | null;
    day?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(el.getAttribute('value')).toBe('2026-03-10');
  });

  it('keeps focus on the active date segment across repeated keyboard increments', async () => {
    const el = document.createElement('ui-date-field');
    el.setAttribute('value', '2026-03-09');
    document.body.appendChild(el);
    await flushMicrotask();

    const month = el.shadowRoot?.querySelector('[data-segment="month"]') as HTMLButtonElement | null;
    month?.focus();
    expect(el.shadowRoot?.activeElement?.getAttribute('data-segment')).toBe('month');

    month?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    const nextMonth = el.shadowRoot?.querySelector('[data-segment="month"]') as HTMLButtonElement | null;
    expect(el.getAttribute('value')).toBe('2026-04-09');
    expect(el.shadowRoot?.activeElement).toBe(nextMonth);

    nextMonth?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(el.getAttribute('value')).toBe('2026-03-09');
    expect(el.shadowRoot?.activeElement?.getAttribute('data-segment')).toBe('month');
  });

  it('registers date field with ui-form', async () => {
    const form = document.createElement('ui-form') as HTMLElement & { getValues(): Record<string, unknown> };
    form.innerHTML = `<ui-date-field name="start" value="2026-03-09"></ui-date-field>`;
    document.body.appendChild(form);
    await flushMicrotask();

    expect(form.getValues().start).toBe('2026-03-09');
  });

  it('supports 12h time editing and form registration', async () => {
    const form = document.createElement('ui-form') as HTMLElement & { getValues(): Record<string, unknown> };
    form.innerHTML = `<ui-time-field name="startTime" value="09:15" format="12h"></ui-time-field>`;
    document.body.appendChild(form);
    await flushMicrotask();

    const field = form.querySelector('ui-time-field') as HTMLElement;
    const meridiem = field.shadowRoot?.querySelector('[data-segment="meridiem"]') as HTMLElement | null;
    meridiem?.dispatchEvent(new KeyboardEvent('keydown', { key: 'p', bubbles: true }));

    expect(field.getAttribute('value')).toBe('21:15');
    expect(form.getValues().startTime).toBe('21:15');
  });

  it('keeps focus on the active time segment across repeated arrow-key stepping', async () => {
    const el = document.createElement('ui-time-field');
    el.setAttribute('value', '09:15');
    document.body.appendChild(el);
    await flushMicrotask();

    const hour = el.shadowRoot?.querySelector('[data-segment="hour"]') as HTMLButtonElement | null;
    hour?.focus();
    expect(el.shadowRoot?.activeElement?.getAttribute('data-segment')).toBe('hour');

    hour?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    const nextHour = el.shadowRoot?.querySelector('[data-segment="hour"]') as HTMLButtonElement | null;
    expect(el.getAttribute('value')).toBe('10:15');
    expect(el.shadowRoot?.activeElement).toBe(nextHour);

    nextHour?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(el.getAttribute('value')).toBe('09:15');
    expect(el.shadowRoot?.activeElement?.getAttribute('data-segment')).toBe('hour');
  });

  it('exposes grouped semantics, roving tabindex, and form value sync when internals are available', async () => {
    const attachInternals = HTMLElement.prototype.attachInternals;
    const setFormValue = vi.fn();
    Object.defineProperty(HTMLElement.prototype, 'attachInternals', {
      configurable: true,
      value() {
        return { setFormValue, ariaInvalid: '', ariaLabel: '' };
      }
    });

    const el = document.createElement('ui-date-field');
    el.setAttribute('label', 'Start date');
    el.setAttribute('description', 'Pick a launch date');
    el.setAttribute('value', '2026-03-09');
    document.body.appendChild(el);
    await flushMicrotask();

    const shell = el.shadowRoot?.querySelector('.shell') as HTMLElement | null;
    expect(shell?.getAttribute('role')).toBe('group');
    expect(shell?.getAttribute('aria-labelledby')).toContain('label');
    expect(shell?.getAttribute('aria-describedby')).toContain('description');

    const segments = Array.from(el.shadowRoot?.querySelectorAll('.segment') || []) as HTMLButtonElement[];
    expect(segments.filter((segment) => segment.tabIndex === 0)).toHaveLength(1);

    const day = el.shadowRoot?.querySelector('[data-segment="day"]') as HTMLElement | null;
    day?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(setFormValue).toHaveBeenLastCalledWith('2026-03-10');

    if (attachInternals) {
      Object.defineProperty(HTMLElement.prototype, 'attachInternals', { configurable: true, value: attachInternals });
    } else {
      delete (HTMLElement.prototype as Partial<HTMLElement>).attachInternals;
    }
  });
});
