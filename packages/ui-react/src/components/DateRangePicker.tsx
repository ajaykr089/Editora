import React from 'react';
import {
  getCustomEventDetail,
  serializeTranslations,
  syncBooleanAttribute,
  syncStringAttribute,
  useElementAttributes,
  useElementEventListeners,
  useForwardedHostRef,
} from './_internals';

export type DateRangePickerDetail = {
  mode: 'range';
  start: string | null;
  end: string | null;
  value: { start: string; end: string } | null;
  source: string;
};

export type DateRangePickerState = 'idle' | 'loading' | 'error' | 'success';

export type DateRangePickerProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onInput' | 'onOpen' | 'onClose' | 'onInvalid'> & {
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
  state?: DateRangePickerState;
  rangeVariant?: 'two-fields' | 'single-field';
  label?: string;
  hint?: string;
  error?: string;
  allowSameDay?: boolean;
  allowPartial?: boolean;
  closeOnSelect?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  name?: string;
  nameStart?: string;
  nameEnd?: string;
  mode?: 'popover' | 'inline';
  showFooter?: boolean;
  onInput?: (detail: DateRangePickerDetail) => void;
  onChange?: (detail: DateRangePickerDetail) => void;
  onValueChange?: (value: string | null) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onInvalid?: (detail: { raw: string; reason: string }) => void;
};

export const DateRangePicker = React.forwardRef<HTMLElement, DateRangePickerProps>(function DateRangePicker(
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
    rangeVariant,
    label,
    hint,
    error,
    allowSameDay,
    allowPartial,
    closeOnSelect,
    clearable,
    disabled,
    readOnly,
    required,
    name,
    nameStart,
    nameEnd,
    mode,
    showFooter,
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
    const detail = getCustomEventDetail<DateRangePickerDetail>(event);
    if (!detail) return;
    onInput?.(detail);
  }, [onInput]);

  const handleChange = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<DateRangePickerDetail>(event);
    if (!detail) return;
    onChange?.(detail);
    onValueChange?.(detail.value ? JSON.stringify(detail.value) : null);
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
    syncStringAttribute(el, 'range-variant', rangeVariant && rangeVariant !== 'two-fields' ? rangeVariant : null);
    syncStringAttribute(el, 'label', label ?? null);
    syncStringAttribute(el, 'hint', hint ?? null);
    syncStringAttribute(el, 'error', error ?? null);
    syncBooleanAttribute(el, 'allow-same-day', allowSameDay);
    syncBooleanAttribute(el, 'allow-partial', allowPartial);
    syncBooleanAttribute(el, 'close-on-select', closeOnSelect);
    syncBooleanAttribute(el, 'clearable', clearable);
    syncBooleanAttribute(el, 'disabled', disabled);
    syncBooleanAttribute(el, 'readonly', readOnly);
    syncBooleanAttribute(el, 'required', required);
    syncStringAttribute(el, 'name', name ?? null);
    syncStringAttribute(el, 'name-start', nameStart ?? null);
    syncStringAttribute(el, 'name-end', nameEnd ?? null);
    syncStringAttribute(el, 'mode', mode && mode !== 'popover' ? mode : null);
    syncStringAttribute(el, 'show-footer', typeof showFooter === 'boolean' ? String(showFooter) : null);
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
    rangeVariant,
    label,
    hint,
    error,
    allowSameDay,
    allowPartial,
    closeOnSelect,
    clearable,
    disabled,
    readOnly,
    required,
    name,
    nameStart,
    nameEnd,
    mode,
    showFooter
  ]);

  return React.createElement('ui-date-range-picker', { ref, ...rest }, children);
});

DateRangePicker.displayName = 'DateRangePicker';

export default DateRangePicker;
