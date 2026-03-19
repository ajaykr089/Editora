import React, { useEffect, useLayoutEffect, useImperativeHandle, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
import { serializeTranslations } from './_internals';

export type DatePickerDetail = {
  mode: 'single';
  value: string | null;
  displayValue: string;
  source: string;
};

export type DatePickerState = 'idle' | 'loading' | 'error' | 'success';

export type DatePickerProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onInput' | 'onOpen' | 'onClose' | 'onInvalid'> & {
  value?: string;
  defaultValue?: string;
  open?: boolean;
  defaultOpen?: boolean;
  min?: string;
  max?: string;
  locale?: string;
  translations?: Record<string, string> | string;
  weekStart?: 0 | 1 | 6;
  size?: 'sm' | 'md' | 'lg';
  shape?: 'default' | 'square' | 'soft';
  bare?: boolean;
  variant?: 'default' | 'contrast';
  state?: DatePickerState;
  placeholder?: string;
  label?: string;
  hint?: string;
  error?: string;
  clearable?: boolean;
  allowInput?: boolean;
  closeOnSelect?: boolean;
  outsideClick?: 'none' | 'navigate' | 'select';
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  name?: string;
  mode?: 'popover' | 'inline';
  showFooter?: boolean;
  events?: Array<{ date: string; title?: string; tone?: 'default' | 'success' | 'warning' | 'danger' | 'info' }>;
  eventsMax?: number;
  eventsDisplay?: 'dots' | 'badges' | 'count';
  format?: 'iso' | 'locale' | 'custom';
  displayFormat?: string;
  onInput?: (detail: DatePickerDetail) => void;
  onChange?: (detail: DatePickerDetail) => void;
  onValueChange?: (value: string | null) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onInvalid?: (detail: { raw: string; reason: string }) => void;
};

export const DatePicker = React.forwardRef<HTMLElement, DatePickerProps>(function DatePicker(
  {
    value,
    defaultValue,
    open,
    defaultOpen,
    min,
    max,
    locale,
    translations,
    weekStart,
    size,
    shape,
    bare,
    variant,
    state,
    placeholder,
    label,
    hint,
    error,
    clearable,
    allowInput,
    closeOnSelect,
    outsideClick,
    disabled,
    readOnly,
    required,
    name,
    mode,
    showFooter,
    events,
    eventsMax,
    eventsDisplay,
    format,
    displayFormat,
    onInput,
    onChange,
    onValueChange,
    onOpen,
    onClose,
    onInvalid,
    children,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);
  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleInput = (event: Event) => {
      const detail = (event as CustomEvent<DatePickerDetail>).detail;
      if (!detail) return;
      onInput?.(detail);
    };
    const handleChange = (event: Event) => {
      const detail = (event as CustomEvent<DatePickerDetail>).detail;
      if (!detail) return;
      onChange?.(detail);
      onValueChange?.(detail.value);
    };
    const handleInvalid = (event: Event) => {
      const detail = (event as CustomEvent<{ raw: string; reason: string }>).detail;
      if (!detail) return;
      onInvalid?.(detail);
    };

    el.addEventListener('input', handleInput as EventListener);
    el.addEventListener('change', handleChange as EventListener);
    el.addEventListener('open', onOpen as EventListener);
    el.addEventListener('close', onClose as EventListener);
    el.addEventListener('invalid', handleInvalid as EventListener);
    return () => {
      el.removeEventListener('input', handleInput as EventListener);
      el.removeEventListener('change', handleChange as EventListener);
      el.removeEventListener('open', onOpen as EventListener);
      el.removeEventListener('close', onClose as EventListener);
      el.removeEventListener('invalid', handleInvalid as EventListener);
    };
  }, [onInput, onChange, onValueChange, onOpen, onClose, onInvalid]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const syncAttr = (name: string, next: string | null) => {
      const current = el.getAttribute(name);
      if (next == null) {
        if (current != null) el.removeAttribute(name);
      } else if (current !== next) {
        el.setAttribute(name, next);
      }
    };
    const syncBool = (name: string, next: boolean | undefined) => {
      if (next) syncAttr(name, '');
      else syncAttr(name, null);
    };

    syncAttr('value', value ?? null);
    syncAttr('default-value', defaultValue ?? null);
    if (typeof open === 'boolean') syncBool('open', open);
    else syncAttr('open', null);
    syncBool('default-open', defaultOpen);
    syncAttr('min', min ?? null);
    syncAttr('max', max ?? null);
    syncAttr('locale', locale ?? null);
    syncAttr('translations', serializeTranslations(translations));
    syncAttr('week-start', typeof weekStart === 'number' ? String(weekStart) : null);
    syncAttr('size', size && size !== 'md' ? size : null);
    syncAttr('shape', shape && shape !== 'default' ? shape : null);
    syncBool('bare', bare);
    syncAttr('variant', variant && variant !== 'default' ? variant : null);
    syncAttr('state', state && state !== 'idle' ? state : null);
    syncAttr('placeholder', placeholder ?? null);
    syncAttr('label', label ?? null);
    syncAttr('hint', hint ?? null);
    syncAttr('error', error ?? null);
    syncBool('clearable', clearable);
    syncBool('allow-input', allowInput);
    syncBool('close-on-select', closeOnSelect);
    syncAttr('outside-click', outsideClick && outsideClick !== 'navigate' ? outsideClick : null);
    syncBool('disabled', disabled);
    syncBool('readonly', readOnly);
    syncBool('required', required);
    syncAttr('name', name ?? null);
    syncAttr('mode', mode && mode !== 'popover' ? mode : null);
    syncAttr('show-footer', typeof showFooter === 'boolean' ? String(showFooter) : null);
    syncAttr('events-max', typeof eventsMax === 'number' ? String(eventsMax) : null);
    syncAttr('events-display', eventsDisplay && eventsDisplay !== 'dots' ? eventsDisplay : null);
    syncAttr('format', format && format !== 'locale' ? format : null);
    syncAttr('display-format', displayFormat ?? null);
    if (events?.length) {
      try {
        syncAttr('events', JSON.stringify(events));
      } catch {
        syncAttr('events', null);
      }
    } else {
      syncAttr('events', null);
    }
  }, [
    value,
    defaultValue,
    open,
    defaultOpen,
    min,
    max,
    locale,
    translations,
    weekStart,
    size,
    shape,
    bare,
    variant,
    state,
    placeholder,
    label,
    hint,
    error,
    clearable,
    allowInput,
    closeOnSelect,
    outsideClick,
    disabled,
    readOnly,
    required,
    name,
    mode,
    showFooter,
    events,
    eventsMax,
    eventsDisplay,
    format,
    displayFormat
  ]);

  return React.createElement('ui-date-picker', { ref, ...rest }, children);
});

DatePicker.displayName = 'DatePicker';

export default DatePicker;
