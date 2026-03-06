import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { serializeTranslations } from './_internals';

export type DateTimePickerDetail = {
  mode: 'datetime';
  value: string | null;
  date: string | null;
  time: string | null;
  source: string;
};

export type DateTimePickerProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onInput'> & {
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
  const ref = useRef<HTMLElement | null>(null);
  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleInput = (event: Event) => {
      const detail = (event as CustomEvent<DateTimePickerDetail>).detail;
      if (!detail) return;
      onInput?.(detail);
    };
    const handleChange = (event: Event) => {
      const detail = (event as CustomEvent<DateTimePickerDetail>).detail;
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

  useEffect(() => {
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
    syncBool('bare', bare);
    syncAttr('variant', variant && variant !== 'default' ? variant : null);
    syncAttr('step', typeof step === 'number' ? String(step) : null);
    syncAttr('format', format && format !== '24h' ? format : null);
    syncBool('disabled', disabled);
    syncBool('readonly', readOnly);
    syncBool('required', required);
    syncAttr('name', name ?? null);
    syncBool('close-on-select', closeOnSelect);
    syncBool('clearable', clearable);
    syncBool('allow-input', allowInput);
    syncAttr('mode', mode && mode !== 'popover' ? mode : null);
    syncAttr('show-footer', typeof showFooter === 'boolean' ? String(showFooter) : null);
    syncAttr('label', label ?? null);
    syncAttr('hint', hint ?? null);
    syncAttr('error', error ?? null);
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
