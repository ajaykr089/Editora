import React from 'react';
import {
  getCustomEventDetail,
  serializeTranslations,
  syncBooleanAttribute,
  syncJsonAttribute,
  syncStringAttribute,
  useElementAttributes,
  useElementEventListeners,
  useForwardedHostRef,
} from './_internals';

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
  const ref = useForwardedHostRef<HTMLElement>(forwardedRef);

  const handleInput = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<DatePickerDetail>(event);
    if (!detail) return;
    onInput?.(detail);
  }, [onInput]);

  const handleChange = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<DatePickerDetail>(event);
    if (!detail) return;
    onChange?.(detail);
    onValueChange?.(detail.value);
  }, [onChange, onValueChange]);

  const handleInvalid = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<{ raw: string; reason: string }>(event);
    if (!detail) return;
    onInvalid?.(detail);
  }, [onInvalid]);

  useElementEventListeners(
    ref,
    [
      { type: 'input', listener: handleInput },
      { type: 'change', listener: handleChange },
      { type: 'open', listener: onOpen as EventListener | undefined },
      { type: 'close', listener: onClose as EventListener | undefined },
      { type: 'invalid', listener: handleInvalid },
    ],
    [handleInput, handleChange, onOpen, onClose, handleInvalid]
  );

  useElementAttributes(ref, (el) => {
    syncStringAttribute(el, 'value', value ?? null);
    syncStringAttribute(el, 'default-value', defaultValue ?? null);
    if (typeof open === 'boolean') syncBooleanAttribute(el, 'open', open);
    else syncStringAttribute(el, 'open', null);
    syncBooleanAttribute(el, 'default-open', defaultOpen);
    syncStringAttribute(el, 'min', min ?? null);
    syncStringAttribute(el, 'max', max ?? null);
    syncStringAttribute(el, 'locale', locale ?? null);
    syncStringAttribute(el, 'translations', serializeTranslations(translations));
    syncStringAttribute(el, 'week-start', typeof weekStart === 'number' ? String(weekStart) : null);
    syncStringAttribute(el, 'size', size && size !== 'md' ? size : null);
    syncStringAttribute(el, 'shape', shape && shape !== 'default' ? shape : null);
    syncBooleanAttribute(el, 'bare', bare);
    syncStringAttribute(el, 'variant', variant && variant !== 'default' ? variant : null);
    syncStringAttribute(el, 'state', state && state !== 'idle' ? state : null);
    syncStringAttribute(el, 'placeholder', placeholder ?? null);
    syncStringAttribute(el, 'label', label ?? null);
    syncStringAttribute(el, 'hint', hint ?? null);
    syncStringAttribute(el, 'error', error ?? null);
    syncBooleanAttribute(el, 'clearable', clearable);
    syncBooleanAttribute(el, 'allow-input', allowInput);
    syncBooleanAttribute(el, 'close-on-select', closeOnSelect);
    syncStringAttribute(el, 'outside-click', outsideClick && outsideClick !== 'navigate' ? outsideClick : null);
    syncBooleanAttribute(el, 'disabled', disabled);
    syncBooleanAttribute(el, 'readonly', readOnly);
    syncBooleanAttribute(el, 'required', required);
    syncStringAttribute(el, 'name', name ?? null);
    syncStringAttribute(el, 'mode', mode && mode !== 'popover' ? mode : null);
    syncStringAttribute(el, 'show-footer', typeof showFooter === 'boolean' ? String(showFooter) : null);
    syncStringAttribute(el, 'events-max', typeof eventsMax === 'number' ? String(eventsMax) : null);
    syncStringAttribute(el, 'events-display', eventsDisplay && eventsDisplay !== 'dots' ? eventsDisplay : null);
    syncStringAttribute(el, 'format', format && format !== 'locale' ? format : null);
    syncStringAttribute(el, 'display-format', displayFormat ?? null);
    syncJsonAttribute(el, 'events', events?.length ? events : null);
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
