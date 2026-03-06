import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { serializeTranslations, warnIfElementNotRegistered } from './_internals';

export type CalendarEvent = {
  date: string;
  title?: string;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'info';
};

export type CalendarSelectDetail = { value: string; source?: 'pointer' | 'keyboard' | 'api' };
export type CalendarChangeDetail =
  | { mode: 'single'; value: string | null; source?: 'pointer' | 'keyboard' | 'api' }
  | {
      mode: 'range';
      value: { start: string; end: string } | null;
      start: string | null;
      end: string | null;
      source?: 'pointer' | 'keyboard' | 'api';
    }
  | { mode: 'multiple'; value: string[]; values: string[]; source?: 'pointer' | 'keyboard' | 'api' };
export type CalendarMonthChangeDetail = { year: number; month: number; source?: 'pointer' | 'keyboard' | 'api' };

type BaseProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onSelect'> & {
  children?: React.ReactNode;
};

export type CalendarProps = BaseProps & {
  year?: number;
  month?: number;
  value?: string;
  events?: CalendarEvent[];
  variant?: 'default' | 'contrast';
  selection?: 'single' | 'range' | 'multiple';
  min?: string;
  max?: string;
  disabled?: boolean;
  readOnly?: boolean;
  locale?: string;
  translations?: Record<string, string> | string;
  weekStart?: 0 | 1 | 6;
  outsideClick?: 'none' | 'navigate' | 'select';
  eventsMax?: number;
  eventsDisplay?: 'dots' | 'badges' | 'count';
  maxSelections?: number;
  size?: 'sm' | 'md' | 'lg';
  bare?: boolean;
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
  state?: 'idle' | 'loading' | 'error' | 'success';
  headless?: boolean;
  hideToday?: boolean;
  showToday?: boolean;
  ariaLabel?: string;
  onSelect?: (detail: CalendarSelectDetail) => void;
  onChange?: (detail: CalendarSelectDetail) => void;
  onCalendarChange?: (detail: CalendarChangeDetail) => void;
  onMonthChange?: (detail: CalendarMonthChangeDetail) => void;
  onValueChange?: (value: string) => void;
};

export const Calendar = React.forwardRef<HTMLElement, CalendarProps>(function Calendar(
  {
    year,
    month,
    value,
    events,
    variant,
    selection,
    min,
    max,
    disabled,
    readOnly,
    locale,
    translations,
    weekStart,
    outsideClick,
    eventsMax,
    eventsDisplay,
    maxSelections,
    size,
    bare,
    tone,
    state,
    headless,
    hideToday,
    showToday,
    ariaLabel,
    onSelect,
    onChange,
    onCalendarChange,
    onMonthChange,
    onValueChange,
    children,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);

  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    warnIfElementNotRegistered('ui-calendar', 'Calendar');
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleSelect = (event: Event) => {
      const detail = (event as CustomEvent<CalendarSelectDetail>).detail;
      if (!detail) return;
      onSelect?.(detail);
      onChange?.(detail);
      onValueChange?.(detail.value);
    };

    const handleCalendarChange = (event: Event) => {
      const detail = (event as CustomEvent<CalendarChangeDetail>).detail;
      if (!detail) return;
      onCalendarChange?.(detail);
    };

    const handleMonthChange = (event: Event) => {
      const detail = (event as CustomEvent<CalendarMonthChangeDetail>).detail;
      if (!detail) return;
      onMonthChange?.(detail);
    };

    el.addEventListener('ui-select', handleSelect as EventListener);
    el.addEventListener('ui-change', handleCalendarChange as EventListener);
    el.addEventListener('ui-month-change', handleMonthChange as EventListener);
    return () => {
      el.removeEventListener('ui-select', handleSelect as EventListener);
      el.removeEventListener('ui-change', handleCalendarChange as EventListener);
      el.removeEventListener('ui-month-change', handleMonthChange as EventListener);
    };
  }, [onSelect, onChange, onCalendarChange, onMonthChange, onValueChange]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const syncAttr = (name: string, next: string | null) => {
      const current = el.getAttribute(name);
      if (next == null) {
        if (current != null) el.removeAttribute(name);
        return;
      }
      if (current !== next) el.setAttribute(name, next);
    };

    const syncBool = (name: string, enabled: boolean | undefined) => {
      if (enabled) {
        if (!el.hasAttribute(name)) el.setAttribute(name, '');
      } else if (el.hasAttribute(name)) {
        el.removeAttribute(name);
      }
    };

    if (typeof year === 'number' && Number.isFinite(year)) syncAttr('year', String(year));
    else syncAttr('year', null);

    if (typeof month === 'number' && Number.isFinite(month)) syncAttr('month', String(month));
    else syncAttr('month', null);

    syncAttr('value', value || null);
    syncAttr('selection', selection && selection !== 'single' ? selection : null);
    syncAttr('min', min || null);
    syncAttr('max', max || null);
    syncAttr('locale', locale || null);
    syncAttr('translations', serializeTranslations(translations));
    syncAttr('week-start', typeof weekStart === 'number' ? String(weekStart) : null);
    syncAttr('outside-click', outsideClick && outsideClick !== 'navigate' ? outsideClick : null);
    syncAttr('events-max', typeof eventsMax === 'number' && Number.isFinite(eventsMax) ? String(eventsMax) : null);
    syncAttr('events-display', eventsDisplay && eventsDisplay !== 'dots' ? eventsDisplay : null);
    syncAttr(
      'max-selections',
      typeof maxSelections === 'number' && Number.isFinite(maxSelections) ? String(maxSelections) : null
    );
    syncAttr('size', size && size !== 'md' ? size : null);
    syncBool('bare', bare);
    syncAttr('tone', tone || null);
    syncAttr('state', state && state !== 'idle' ? state : null);
    syncAttr('show-today', typeof showToday === 'boolean' ? (showToday ? 'true' : 'false') : null);
    syncAttr('aria-label', ariaLabel || null);

    syncBool('disabled', disabled);
    syncBool('readonly', readOnly);
    syncBool('hide-today', hideToday);
    syncBool('headless', headless);

    if (events && events.length) {
      try {
        syncAttr('events', JSON.stringify(events));
      } catch {
        syncAttr('events', null);
      }
    } else {
      syncAttr('events', null);
    }

    syncAttr('variant', variant && variant !== 'default' ? variant : null);
  }, [
    year,
    month,
    value,
    events,
    variant,
    selection,
    min,
    max,
    disabled,
    readOnly,
    locale,
    translations,
    weekStart,
    outsideClick,
    eventsMax,
    eventsDisplay,
    maxSelections,
    size,
    bare,
    tone,
    state,
    headless,
    hideToday,
    showToday,
    ariaLabel
  ]);

  return React.createElement('ui-calendar', { ref, ...rest }, children);
});

Calendar.displayName = 'Calendar';

export default Calendar;
