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

export type TimePickerDetail = {
  mode: 'time';
  value: string | null;
  source: string;
};

export type TimePickerProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onInput' | 'onOpen' | 'onClose' | 'onInvalid'> & {
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
  const ref = useForwardedHostRef<HTMLElement>(forwardedRef);

  const handleInput = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<TimePickerDetail>(event);
    if (!detail) return;
    onInput?.(detail);
  }, [onInput]);

  const handleChange = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<TimePickerDetail>(event);
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
    syncStringAttribute(el, 'format', format && format !== '24h' ? format : null);
    syncNumberAttribute(el, 'step', step);
    syncBooleanAttribute(el, 'seconds', seconds);
    syncNumberAttribute(el, 'step-seconds', stepSeconds);
    syncStringAttribute(el, 'min', min ?? null);
    syncStringAttribute(el, 'max', max ?? null);
    syncBooleanAttribute(el, 'disabled', disabled);
    syncBooleanAttribute(el, 'readonly', readOnly);
    syncBooleanAttribute(el, 'required', required);
    syncStringAttribute(el, 'name', name ?? null);
    syncBooleanAttribute(el, 'clearable', clearable);
    syncBooleanAttribute(el, 'allow-input', allowInput);
    syncStringAttribute(el, 'mode', mode && mode !== 'popover' ? mode : null);
    syncStringAttribute(el, 'label', label ?? null);
    syncStringAttribute(el, 'hint', hint ?? null);
    syncStringAttribute(el, 'error', error ?? null);
    syncStringAttribute(el, 'locale', locale ?? null);
    syncStringAttribute(el, 'translations', serializeTranslations(translations));
    syncStringAttribute(el, 'variant', variant && variant !== 'default' ? variant : null);
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
