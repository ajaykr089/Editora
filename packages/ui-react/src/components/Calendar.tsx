import React from 'react';
import {
  getCustomEventDetail,
  serializeTranslations,
  syncBooleanAttribute,
  syncJsonAttribute,
  syncNumberAttribute,
  syncStringAttribute,
  useElementAttributes,
  useElementEventListeners,
  useForwardedHostRef,
  warnIfElementNotRegistered,
} from './_internals';

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
  const ref = useForwardedHostRef<HTMLElement>(forwardedRef);

  React.useEffect(() => {
    warnIfElementNotRegistered('ui-calendar', 'Calendar');
  }, []);

  const handleSelect = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<CalendarSelectDetail>(event);
    if (!detail) return;
    onSelect?.(detail);
    onChange?.(detail);
    onValueChange?.(detail.value);
  }, [onSelect, onChange, onValueChange]);

  const handleCalendarChange = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<CalendarChangeDetail>(event);
    if (!detail) return;
    onCalendarChange?.(detail);
  }, [onCalendarChange]);

  const handleMonthChange = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<CalendarMonthChangeDetail>(event);
    if (!detail) return;
    onMonthChange?.(detail);
  }, [onMonthChange]);

  useElementEventListeners(
    ref,
    [
      { type: 'ui-select', listener: handleSelect },
      { type: 'ui-change', listener: handleCalendarChange },
      { type: 'ui-month-change', listener: handleMonthChange },
    ],
    [handleSelect, handleCalendarChange, handleMonthChange]
  );

  useElementAttributes(ref, (el) => {
    syncNumberAttribute(el, 'year', typeof year === 'number' && Number.isFinite(year) ? year : undefined);
    syncNumberAttribute(el, 'month', typeof month === 'number' && Number.isFinite(month) ? month : undefined);
    syncStringAttribute(el, 'value', value || null);
    syncStringAttribute(el, 'selection', selection && selection !== 'single' ? selection : null);
    syncStringAttribute(el, 'min', min || null);
    syncStringAttribute(el, 'max', max || null);
    syncStringAttribute(el, 'locale', locale || null);
    syncStringAttribute(el, 'translations', serializeTranslations(translations));
    syncStringAttribute(el, 'week-start', typeof weekStart === 'number' ? String(weekStart) : null);
    syncStringAttribute(el, 'outside-click', outsideClick && outsideClick !== 'navigate' ? outsideClick : null);
    syncNumberAttribute(el, 'events-max', typeof eventsMax === 'number' && Number.isFinite(eventsMax) ? eventsMax : undefined);
    syncStringAttribute(el, 'events-display', eventsDisplay && eventsDisplay !== 'dots' ? eventsDisplay : null);
    syncNumberAttribute(
      el,
      'max-selections',
      typeof maxSelections === 'number' && Number.isFinite(maxSelections) ? maxSelections : undefined
    );
    syncStringAttribute(el, 'size', size && size !== 'md' ? size : null);
    syncBooleanAttribute(el, 'bare', bare);
    syncStringAttribute(el, 'tone', tone || null);
    syncStringAttribute(el, 'state', state && state !== 'idle' ? state : null);
    syncStringAttribute(el, 'show-today', typeof showToday === 'boolean' ? (showToday ? 'true' : 'false') : null);
    syncStringAttribute(el, 'aria-label', ariaLabel || null);
    syncBooleanAttribute(el, 'disabled', disabled);
    syncBooleanAttribute(el, 'readonly', readOnly);
    syncBooleanAttribute(el, 'hide-today', hideToday);
    syncBooleanAttribute(el, 'headless', headless);
    syncJsonAttribute(el, 'events', events?.length ? events : null);
    syncStringAttribute(el, 'variant', variant && variant !== 'default' ? variant : null);
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
