import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { serializeTranslations } from './_internals';

export type TimePickerDetail = {
  mode: 'time';
  value: string | null;
  source: string;
};

export type TimePickerProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onInput'> & {
  value?: string;
  defaultValue?: string;
  open?: boolean;
  defaultOpen?: boolean;
  format?: '24h' | '12h';
  step?: number;
  seconds?: boolean;
  stepSeconds?: number;
  min?: string;
  max?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  name?: string;
  clearable?: boolean;
  allowInput?: boolean;
  mode?: 'popover' | 'inline';
  label?: string;
  hint?: string;
  error?: string;
  locale?: string;
  translations?: Record<string, string> | string;
  variant?: 'default' | 'contrast';
  onInput?: (detail: TimePickerDetail) => void;
  onChange?: (detail: TimePickerDetail) => void;
  onValueChange?: (value: string | null) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onInvalid?: (detail: { raw: string; reason: string }) => void;
};

export const TimePicker = React.forwardRef<HTMLElement, TimePickerProps>(function TimePicker(
  {
    value,
    defaultValue,
    open,
    defaultOpen,
    format,
    step,
    seconds,
    stepSeconds,
    min,
    max,
    disabled,
    readOnly,
    required,
    name,
    clearable,
    allowInput,
    mode,
    label,
    hint,
    error,
    locale,
    translations,
    variant,
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
      const detail = (event as CustomEvent<TimePickerDetail>).detail;
      if (!detail) return;
      onInput?.(detail);
    };
    const handleChange = (event: Event) => {
      const detail = (event as CustomEvent<TimePickerDetail>).detail;
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
    syncAttr('format', format && format !== '24h' ? format : null);
    syncAttr('step', typeof step === 'number' ? String(step) : null);
    syncBool('seconds', seconds);
    syncAttr('step-seconds', typeof stepSeconds === 'number' ? String(stepSeconds) : null);
    syncAttr('min', min ?? null);
    syncAttr('max', max ?? null);
    syncBool('disabled', disabled);
    syncBool('readonly', readOnly);
    syncBool('required', required);
    syncAttr('name', name ?? null);
    syncBool('clearable', clearable);
    syncBool('allow-input', allowInput);
    syncAttr('mode', mode && mode !== 'popover' ? mode : null);
    syncAttr('label', label ?? null);
    syncAttr('hint', hint ?? null);
    syncAttr('error', error ?? null);
    syncAttr('locale', locale ?? null);
    syncAttr('translations', serializeTranslations(translations));
    syncAttr('variant', variant && variant !== 'default' ? variant : null);
  }, [
    value,
    defaultValue,
    open,
    defaultOpen,
    format,
    step,
    seconds,
    stepSeconds,
    min,
    max,
    disabled,
    readOnly,
    required,
    name,
    clearable,
    allowInput,
    mode,
    label,
    hint,
    error,
    locale,
    translations,
    variant
  ]);

  return React.createElement('ui-time-picker', { ref, ...rest }, children);
});

TimePicker.displayName = 'TimePicker';

export default TimePicker;
