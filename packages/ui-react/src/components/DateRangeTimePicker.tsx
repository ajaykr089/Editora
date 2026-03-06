import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { serializeTranslations } from './_internals';

export type DateRangeTimePickerDetail = {
  mode: 'datetimerange';
  start: string | null;
  end: string | null;
  value: { start: string; end: string } | null;
  source: string;
};

export type DateRangeTimePickerProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onInput'> & {
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
  autoNormalize?: boolean;
  allowPartial?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  name?: string;
  closeOnSelect?: boolean;
  clearable?: boolean;
  mode?: 'popover' | 'inline';
  showFooter?: boolean;
  label?: string;
  hint?: string;
  error?: string;
  onInput?: (detail: DateRangeTimePickerDetail) => void;
  onChange?: (detail: DateRangeTimePickerDetail) => void;
  onValueChange?: (value: string | null) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onInvalid?: (detail: { raw: string; reason: string }) => void;
};

export const DateRangeTimePicker = React.forwardRef<HTMLElement, DateRangeTimePickerProps>(
  function DateRangeTimePicker(
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
      autoNormalize,
      allowPartial,
      disabled,
      readOnly,
      required,
      name,
      closeOnSelect,
      clearable,
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
        const detail = (event as CustomEvent<DateRangeTimePickerDetail>).detail;
        if (!detail) return;
        onInput?.(detail);
      };
      const handleChange = (event: Event) => {
        const detail = (event as CustomEvent<DateRangeTimePickerDetail>).detail;
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
      syncBool('auto-normalize', autoNormalize);
      syncBool('allow-partial', allowPartial);
      syncBool('disabled', disabled);
      syncBool('readonly', readOnly);
      syncBool('required', required);
      syncAttr('name', name ?? null);
      syncBool('close-on-select', closeOnSelect);
      syncBool('clearable', clearable);
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
      autoNormalize,
      allowPartial,
      disabled,
      readOnly,
      required,
      name,
      closeOnSelect,
      clearable,
      mode,
      showFooter,
      label,
      hint,
      error
    ]);

    return React.createElement('ui-date-range-time-picker', { ref, ...rest }, children);
  }
);

DateRangeTimePicker.displayName = 'DateRangeTimePicker';

export default DateRangeTimePicker;
