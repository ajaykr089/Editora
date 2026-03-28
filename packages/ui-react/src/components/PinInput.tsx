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

export type PinInputProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> & {
  children?: React.ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  length?: number;
  name?: string;
  label?: string;
  description?: string;
  error?: string;
  mode?: 'numeric' | 'alpha' | 'alphanumeric';
  mask?: boolean;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholderChar?: string;
  size?: 'sm' | 'md' | 'lg' | '1' | '2' | '3';
  density?: 'default' | 'compact' | 'comfortable';
  shape?: 'default' | 'square' | 'soft';
  invalid?: boolean;
};

export const PinInput = React.forwardRef<HTMLElement, PinInputProps>(function PinInput(
  {
    value,
    onChange,
    onComplete,
    length,
    name,
    label,
    description,
    error,
    mode,
    mask,
    required,
    disabled,
    readOnly,
    placeholderChar,
    size,
    density,
    shape,
    invalid,
    children,
    ...rest
  },
  forwardedRef
) {
  const ref = useForwardedHostRef<HTMLElement>(forwardedRef);

  const handleChange = React.useCallback((event: Event) => {
    onChange?.(getCustomEventDetail<{ value?: string }>(event)?.value || '');
  }, [onChange]);

  const handleComplete = React.useCallback((event: Event) => {
    onComplete?.(getCustomEventDetail<{ value?: string }>(event)?.value || '');
  }, [onComplete]);

  useElementEventListeners(
    ref,
    [
      { type: 'change', listener: handleChange },
      { type: 'complete', listener: handleComplete },
    ],
    [handleChange, handleComplete]
  );

  useElementAttributes(ref, (el) => {
    syncStringAttribute(el, 'value', value != null && value !== '' ? value : null);
    syncNumberAttribute(el, 'length', typeof length === 'number' && Number.isFinite(length) ? length : undefined);
    syncStringAttribute(el, 'name', name || null);
    syncStringAttribute(el, 'label', label || null);
    syncStringAttribute(el, 'description', description || null);
    syncStringAttribute(el, 'error', error || null);
    syncStringAttribute(el, 'mode', mode && mode !== 'numeric' ? mode : null);
    syncBooleanAttribute(el, 'mask', mask);
    syncBooleanAttribute(el, 'required', required);
    syncBooleanAttribute(el, 'disabled', disabled);
    syncBooleanAttribute(el, 'readonly', readOnly);
    syncStringAttribute(el, 'placeholder-char', placeholderChar || null);
    syncStringAttribute(el, 'size', size && size !== 'md' && size !== '2' ? size : null);
    syncStringAttribute(el, 'density', density && density !== 'default' ? density : null);
    syncStringAttribute(el, 'shape', shape && shape !== 'default' ? shape : null);
    syncBooleanAttribute(el, 'invalid', invalid);
  }, [value, length, name, label, description, error, mode, mask, required, disabled, readOnly, placeholderChar, size, density, shape, invalid]);

  return React.createElement('ui-pin-input', { ref, ...rest }, children);
});

PinInput.displayName = 'PinInput';

export const OTPInput = PinInput;

export default PinInput;
