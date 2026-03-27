import React from 'react';
import {
  getCustomEventDetail,
  syncBooleanAttribute,
  syncNumberAttribute,
  syncStringAttribute,
  useElementAttributes,
  useElementEventListeners,
  useForwardedHostRef,
} from './_internals';

type NumberFieldChangeDetail = {
  value: number | null;
  previousValue: number | null;
  source: string;
};

type NumberFieldProps = React.HTMLAttributes<HTMLElement> & {
  value?: string | number;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  precision?: number;
  locale?: string;
  format?: 'plain' | 'grouped';
  placeholder?: string;
  label?: string;
  description?: string;
  error?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  allowWheel?: boolean;
  showSteppers?: boolean;
  clampOnBlur?: boolean;
  autoComplete?: string;
  inputMode?: string;
  invalid?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  incrementTrigger?: React.ReactNode;
  decrementTrigger?: React.ReactNode;
  onValueChange?: (detail: NumberFieldChangeDetail) => void;
  onInvalidValue?: (reason: string) => void;
};

export const NumberField = React.forwardRef<HTMLElement, NumberFieldProps>(function NumberField(
  {
    value,
    min,
    max,
    step,
    precision,
    locale,
    format,
    placeholder,
    label,
    description,
    error,
    name,
    required,
    disabled,
    readOnly,
    allowWheel,
    showSteppers,
    clampOnBlur,
    autoComplete,
    inputMode,
    invalid,
    prefix,
    suffix,
    incrementTrigger,
    decrementTrigger,
    children,
    onValueChange,
    onInvalidValue,
    ...rest
  },
  forwardedRef
) {
  const ref = useForwardedHostRef<HTMLElement>(forwardedRef);

  const handleValueChange = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<NumberFieldChangeDetail>(event);
    if (detail) onValueChange?.(detail);
  }, [onValueChange]);

  const handleInvalid = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<{ reason?: string }>(event);
    if (detail?.reason) onInvalidValue?.(detail.reason);
  }, [onInvalidValue]);

  useElementEventListeners(
    ref,
    [
      { type: 'value-change', listener: handleValueChange },
      { type: 'invalid', listener: handleInvalid },
    ],
    [handleValueChange, handleInvalid]
  );

  useElementAttributes(ref, (el) => {
    syncStringAttribute(el, 'value', value != null && value !== '' ? String(value) : null);
    syncStringAttribute(el, 'min', min != null ? String(min) : null);
    syncStringAttribute(el, 'max', max != null ? String(max) : null);
    syncStringAttribute(el, 'step', step != null ? String(step) : null);
    syncNumberAttribute(el, 'precision', precision);
    syncStringAttribute(el, 'locale', locale ?? null);
    syncStringAttribute(el, 'format', format && format !== 'grouped' ? format : null);
    syncStringAttribute(el, 'placeholder', placeholder ?? null);
    syncStringAttribute(el, 'label', label ?? null);
    syncStringAttribute(el, 'description', description ?? null);
    syncStringAttribute(el, 'data-error', error ?? null);
    syncStringAttribute(el, 'name', name ?? null);
    syncStringAttribute(el, 'autocomplete', autoComplete ?? null);
    syncStringAttribute(el, 'inputmode', inputMode ?? null);
    syncBooleanAttribute(el, 'required', required);
    syncBooleanAttribute(el, 'disabled', disabled);
    syncBooleanAttribute(el, 'readonly', readOnly);
    syncBooleanAttribute(el, 'allow-wheel', allowWheel);
    syncBooleanAttribute(el, 'show-steppers', showSteppers);
    syncBooleanAttribute(el, 'clamp-on-blur', clampOnBlur);
    syncBooleanAttribute(el, 'invalid', invalid);
  }, [
    autoComplete,
    allowWheel,
    clampOnBlur,
    description,
    disabled,
    error,
    format,
    inputMode,
    invalid,
    label,
    locale,
    max,
    min,
    name,
    placeholder,
    precision,
    readOnly,
    required,
    showSteppers,
    step,
    value
  ]);

  return React.createElement(
    'ui-number-field',
    { ref, ...rest },
    prefix != null ? React.createElement('span', { slot: 'prefix' }, prefix) : null,
    suffix != null ? React.createElement('span', { slot: 'suffix' }, suffix) : null,
    decrementTrigger != null ? React.createElement('span', { slot: 'decrement-trigger' }, decrementTrigger) : null,
    incrementTrigger != null ? React.createElement('span', { slot: 'increment-trigger' }, incrementTrigger) : null,
    children
  );
});

NumberField.displayName = 'NumberField';

export default NumberField;
