import React from 'react';
import {
  getCustomEventDetail,
  serializeTranslations,
  syncBooleanAttribute,
  syncNumberAttribute,
  syncStringAttribute,
  useElementAttributes,
  useElementEventListeners,
  useForwardedHostRef,
} from './_internals';

export type DateTimePickerDetail = {
  mode: 'datetime';
  value: string | null;
  date: string | null;
  time: string | null;
  source: string;
};

export type DateTimePickerProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onInput' | 'onOpen' | 'onClose' | 'onInvalid'> & {
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
  bare?: boolean;
  variant?: 'default' | 'contrast';
  step?: number;
  format?: '24h' | '12h';
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  name?: string;
  closeOnSelect?: boolean;
  clearable?: boolean;
  allowInput?: boolean;
  mode?: 'popover' | 'inline';
  showFooter?: boolean;
  label?: string;
  hint?: string;
  error?: string;
  onInput?: (detail: DateTimePickerDetail) => void;
  onChange?: (detail: DateTimePickerDetail) => void;
  onValueChange?: (value: string | null) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onInvalid?: (detail: { raw: string; reason: string }) => void;
};

export const DateTimePicker = React.forwardRef<HTMLElement, DateTimePickerProps>(function DateTimePicker(
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
    bare,
    variant,
    step,
    format,
    disabled,
    readOnly,
    required,
    name,
    closeOnSelect,
    clearable,
    allowInput,
    mode,
    showFooter,
    label,
    hint,
    error,
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
    const detail = getCustomEventDetail<DateTimePickerDetail>(event);
    if (!detail) return;
    onInput?.(detail);
  }, [onInput]);

  const handleChange = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<DateTimePickerDetail>(event);
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
    syncBooleanAttribute(el, 'bare', bare);
    syncStringAttribute(el, 'variant', variant && variant !== 'default' ? variant : null);
    syncNumberAttribute(el, 'step', step);
    syncStringAttribute(el, 'format', format && format !== '24h' ? format : null);
    syncBooleanAttribute(el, 'disabled', disabled);
    syncBooleanAttribute(el, 'readonly', readOnly);
    syncBooleanAttribute(el, 'required', required);
    syncStringAttribute(el, 'name', name ?? null);
    syncBooleanAttribute(el, 'close-on-select', closeOnSelect);
    syncBooleanAttribute(el, 'clearable', clearable);
    syncBooleanAttribute(el, 'allow-input', allowInput);
    syncStringAttribute(el, 'mode', mode && mode !== 'popover' ? mode : null);
    syncStringAttribute(el, 'show-footer', typeof showFooter === 'boolean' ? String(showFooter) : null);
    syncStringAttribute(el, 'label', label ?? null);
    syncStringAttribute(el, 'hint', hint ?? null);
    syncStringAttribute(el, 'error', error ?? null);
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
    bare,
    variant,
    step,
    format,
    disabled,
    readOnly,
    required,
    name,
    closeOnSelect,
    clearable,
    allowInput,
    mode,
    showFooter,
    label,
    hint,
    error
  ]);

  return React.createElement('ui-date-time-picker', { ref, ...rest }, children);
});

DateTimePicker.displayName = 'DateTimePicker';

export default DateTimePicker;
