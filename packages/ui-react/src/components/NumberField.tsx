import React, { useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

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
  const ref = useRef<HTMLElement | null>(null);
  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleValueChange = (event: Event) => {
      const detail = (event as CustomEvent<NumberFieldChangeDetail>).detail;
      if (detail) onValueChange?.(detail);
    };

    const handleInvalid = (event: Event) => {
      const detail = (event as CustomEvent<{ reason?: string }>).detail;
      if (detail?.reason) onInvalidValue?.(detail.reason);
    };

    el.addEventListener('value-change', handleValueChange as EventListener);
    el.addEventListener('invalid', handleInvalid as EventListener);
    return () => {
      el.removeEventListener('value-change', handleValueChange as EventListener);
      el.removeEventListener('invalid', handleInvalid as EventListener);
    };
  }, [onInvalidValue, onValueChange]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const syncAttr = (name: string, next: string | null) => {
      const current = el.getAttribute(name);
      if (next == null) {
        if (current != null) el.removeAttribute(name);
        return;
      }
      if (current !== next) el.setAttribute(name, next);
    };

    const syncBoolean = (name: string, enabled: boolean | undefined) => {
      if (enabled) {
        if (!el.hasAttribute(name)) el.setAttribute(name, '');
      } else if (el.hasAttribute(name)) {
        el.removeAttribute(name);
      }
    };

    syncAttr('value', value != null && value !== '' ? String(value) : null);
    syncAttr('min', min != null ? String(min) : null);
    syncAttr('max', max != null ? String(max) : null);
    syncAttr('step', step != null ? String(step) : null);
    syncAttr('precision', precision != null ? String(precision) : null);
    syncAttr('locale', locale ?? null);
    syncAttr('format', format && format !== 'grouped' ? format : null);
    syncAttr('placeholder', placeholder ?? null);
    syncAttr('label', label ?? null);
    syncAttr('description', description ?? null);
    syncAttr('data-error', error ?? null);
    syncAttr('name', name ?? null);
    syncAttr('autocomplete', autoComplete ?? null);
    syncAttr('inputmode', inputMode ?? null);
    syncBoolean('required', required);
    syncBoolean('disabled', disabled);
    syncBoolean('readonly', readOnly);
    syncBoolean('allow-wheel', allowWheel);
    syncBoolean('show-steppers', showSteppers);
    syncBoolean('clamp-on-blur', clampOnBlur);
    syncBoolean('invalid', invalid);
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
