import React, { useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type PinInputProps = React.HTMLAttributes<HTMLElement> & {
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
  const ref = useRef<HTMLElement | null>(null);
  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleChange = (event: Event) => {
      onChange?.(((event as CustomEvent<{ value?: string }>).detail.value || '') as string);
    };

    const handleComplete = (event: Event) => {
      onComplete?.(((event as CustomEvent<{ value?: string }>).detail.value || '') as string);
    };

    el.addEventListener('change', handleChange as EventListener);
    el.addEventListener('complete', handleComplete as EventListener);
    return () => {
      el.removeEventListener('change', handleChange as EventListener);
      el.removeEventListener('complete', handleComplete as EventListener);
    };
  }, [onChange, onComplete]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (value != null && value !== '') el.setAttribute('value', value);
    else el.removeAttribute('value');
    if (typeof length === 'number' && Number.isFinite(length)) el.setAttribute('length', String(length));
    else el.removeAttribute('length');
    if (name) el.setAttribute('name', name);
    else el.removeAttribute('name');
    if (label) el.setAttribute('label', label);
    else el.removeAttribute('label');
    if (description) el.setAttribute('description', description);
    else el.removeAttribute('description');
    if (error) el.setAttribute('error', error);
    else el.removeAttribute('error');
    if (mode && mode !== 'numeric') el.setAttribute('mode', mode);
    else el.removeAttribute('mode');
    if (mask) el.setAttribute('mask', '');
    else el.removeAttribute('mask');
    if (required) el.setAttribute('required', '');
    else el.removeAttribute('required');
    if (disabled) el.setAttribute('disabled', '');
    else el.removeAttribute('disabled');
    if (readOnly) el.setAttribute('readonly', '');
    else el.removeAttribute('readonly');
    if (placeholderChar) el.setAttribute('placeholder-char', placeholderChar);
    else el.removeAttribute('placeholder-char');
    if (size && size !== 'md' && size !== '2') el.setAttribute('size', size);
    else el.removeAttribute('size');
    if (density && density !== 'default') el.setAttribute('density', density);
    else el.removeAttribute('density');
    if (shape && shape !== 'default') el.setAttribute('shape', shape);
    else el.removeAttribute('shape');
    if (invalid) el.setAttribute('invalid', '');
    else el.removeAttribute('invalid');
  }, [value, length, name, label, description, error, mode, mask, required, disabled, readOnly, placeholderChar, size, density, shape, invalid]);

  return React.createElement('ui-pin-input', { ref, ...rest }, children);
});

PinInput.displayName = 'PinInput';

export const OTPInput = PinInput;

export default PinInput;
