import React from 'react';
import '@editora/ui-core/number-field';
import {
  createUIElement,
  getCustomEventDetail,
  syncBooleanAttribute,
  syncNumberAttribute,
  syncStringAttribute,
  useElementAttributes,
  useElementEventListeners,
  useForwardedHostRef,
  useIsomorphicLayoutEffect,
  flushElementRender,
  useControlledAttribute,
  whenHandled,
} from './_internals';

type NumberFieldChangeDetail = {
  value: number | null;
  previousValue: number | null;
  source: string;
};

type NumberFieldProps = Omit<React.HTMLAttributes<HTMLElement>, 'onInput'> & {
  /** With onValueChange the field is controlled: a committed value the parent rejects is undone. */
  value?: string | number;
  /** Starting value of an uncontrolled field (written once, on mount). */
  defaultValue?: string | number;
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
  /** Committed value (blur, Enter, steppers). */
  onValueChange?: (detail: NumberFieldChangeDetail) => void;
  /** Every keystroke: the raw text and its parsed number (null while it is not a number yet, e.g. "1."). */
  onInput?: (detail: { rawValue: string; value: number | null }) => void;
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
    onInput,
    defaultValue,
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

  const handleInput = React.useCallback((event: Event) => {
    if (event.target !== event.currentTarget) return;
    const detail = (event as CustomEvent<{ rawValue?: string; value?: number | null }>).detail;
    if (detail && typeof detail.rawValue === 'string') onInput?.({ rawValue: detail.rawValue, value: detail.value ?? null });
  }, [onInput]);

  const defaultApplied = React.useRef(false);
  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || defaultApplied.current) return;
    defaultApplied.current = true;
    if ((value == null || value === '') && defaultValue != null && defaultValue !== '') {
      el.setAttribute('value', String(defaultValue));
      flushElementRender(el);
    }
  }, []);

  // Controlled on commit, not per keystroke: partial text such as "1." is not a number yet.
  useControlledAttribute(ref, {
    attribute: 'value',
    value: whenHandled([onValueChange], value == null ? undefined : value === '' ? null : String(value)),
    events: ['value-change']
  });

  const handleInvalid = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<{ reason?: string }>(event);
    if (detail?.reason) onInvalidValue?.(detail.reason);
  }, [onInvalidValue]);

  useElementEventListeners(
    ref,
    [
      { type: 'value-change', listener: handleValueChange },
      { type: 'invalid', listener: handleInvalid },
      { type: 'input', listener: handleInput },
    ],
    [handleValueChange, handleInvalid, handleInput]
  );

  useElementAttributes(ref, (el) => {
    // Uncontrolled (no value prop): leave the value to the user and to defaultValue.
    if (value != null) syncStringAttribute(el, 'value', value !== '' ? String(value) : null);
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

  return createUIElement(
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
