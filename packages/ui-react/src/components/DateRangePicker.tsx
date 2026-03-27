import React, { useEffect, useLayoutEffect, useImperativeHandle, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
import { serializeTranslations } from './_internals';

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
  const ref = useRef<HTMLElement | null>(null);
  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleInput = (event: Event) => {
      const detail = (event as CustomEvent<DateRangePickerDetail>).detail;
      if (!detail) return;
      onInput?.(detail);
    };
    const handleChange = (event: Event) => {
      const detail = (event as CustomEvent<DateRangePickerDetail>).detail;
      if (!detail) return;
      onChange?.(detail);
      onValueChange?.(detail.value ? JSON.stringify(detail.value) : null);
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
    syncAttr('range-variant', rangeVariant && rangeVariant !== 'two-fields' ? rangeVariant : null);
    syncAttr('label', label ?? null);
    syncAttr('hint', hint ?? null);
    syncAttr('error', error ?? null);
    syncBool('allow-same-day', allowSameDay);
    syncBool('allow-partial', allowPartial);
    syncBool('close-on-select', closeOnSelect);
    syncBool('clearable', clearable);
    syncBool('disabled', disabled);
    syncBool('readonly', readOnly);
    syncBool('required', required);
    syncAttr('name', name ?? null);
    syncAttr('name-start', nameStart ?? null);
    syncAttr('name-end', nameEnd ?? null);
    syncAttr('mode', mode && mode !== 'popover' ? mode : null);
    syncAttr('show-footer', typeof showFooter === 'boolean' ? String(showFooter) : null);
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
