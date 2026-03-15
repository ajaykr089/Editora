import React, { useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type InputProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onInput'> & {
  children?: React.ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  onInput?: (value: string) => void;
  onDebouncedInput?: (value: string) => void;
  onClear?: () => void;
  clearable?: boolean;
  debounce?: number;
  validation?: 'error' | 'success' | 'none';
  size?: 'sm' | 'md' | 'lg' | '1' | '2' | '3';
  minlength?: number;
  maxlength?: number;
  readOnly?: boolean;
  autofocus?: boolean;
  disabled?: boolean;
  counter?: boolean;
  floatingLabel?: boolean;
  type?: string;
  name?: string;
  required?: boolean;
  pattern?: string;
  inputMode?: string;
  autoComplete?: string;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  spellCheck?: boolean;
  placeholder?: string;
  headless?: boolean;
  variant?: 'classic' | 'surface' | 'soft' | 'outlined' | 'filled' | 'flushed' | 'minimal' | 'contrast' | 'elevated';
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger';
  density?: 'default' | 'compact' | 'comfortable';
  shape?: 'default' | 'square' | 'soft';
  color?: string;
  radius?: 'none' | 'large' | 'full' | string;
  label?: string;
  description?: string;
};

export type InputPrefixProps = React.HTMLAttributes<HTMLElement>;

export type InputSuffixProps = React.HTMLAttributes<HTMLElement>;

export type InputErrorProps = React.HTMLAttributes<HTMLElement>;

const InputRoot = React.forwardRef<HTMLElement, InputProps>(function Input(props, forwardedRef) {
  const {
    value,
    onChange,
    onInput,
    onDebouncedInput,
    onClear,
    clearable,
    debounce,
    validation,
    size,
    minlength,
    maxlength,
    readOnly,
    autofocus,
    disabled,
    counter,
    floatingLabel,
    type,
    name,
    required,
    pattern,
    inputMode,
    autoComplete,
    min,
    max,
    step,
    spellCheck,
    placeholder,
    headless,
    variant,
    tone,
    density,
    shape,
    color,
    radius,
    label,
    description,
    children,
    ...rest
  } = props;

  const ref = useRef<HTMLElement | null>(null);

  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onInputHandler = (event: Event) => {
      const detail = (event as CustomEvent<{ value?: string }>).detail;
      if (typeof detail?.value === 'string') onInput?.(detail.value);
    };

    const onChangeHandler = (event: Event) => {
      const detail = (event as CustomEvent<{ value?: string }>).detail;
      if (typeof detail?.value === 'string') onChange?.(detail.value);
    };

    const onDebouncedHandler = (event: Event) => {
      const detail = (event as CustomEvent<{ value?: string }>).detail;
      if (typeof detail?.value === 'string') onDebouncedInput?.(detail.value);
    };

    const onClearHandler = () => {
      onClear?.();
    };

    el.addEventListener('input', onInputHandler as EventListener);
    el.addEventListener('change', onChangeHandler as EventListener);
    el.addEventListener('debounced-input', onDebouncedHandler as EventListener);
    el.addEventListener('clear', onClearHandler as EventListener);

    return () => {
      el.removeEventListener('input', onInputHandler as EventListener);
      el.removeEventListener('change', onChangeHandler as EventListener);
      el.removeEventListener('debounced-input', onDebouncedHandler as EventListener);
      el.removeEventListener('clear', onClearHandler as EventListener);
    };
  }, [onChange, onInput, onDebouncedInput, onClear]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (clearable) el.setAttribute('clearable', '');
    else el.removeAttribute('clearable');

    if (typeof debounce === 'number' && Number.isFinite(debounce)) el.setAttribute('debounce', String(debounce));
    else el.removeAttribute('debounce');

    if (validation && validation !== 'none') el.setAttribute('validation', validation);
    else el.removeAttribute('validation');

    if (size && size !== 'md' && size !== '2') el.setAttribute('size', String(size));
    else el.removeAttribute('size');

    if (typeof minlength === 'number') el.setAttribute('minlength', String(minlength));
    else el.removeAttribute('minlength');

    if (typeof maxlength === 'number') el.setAttribute('maxlength', String(maxlength));
    else el.removeAttribute('maxlength');

    if (readOnly) el.setAttribute('readonly', '');
    else el.removeAttribute('readonly');

    if (autofocus) el.setAttribute('autofocus', '');
    else el.removeAttribute('autofocus');

    if (disabled) el.setAttribute('disabled', '');
    else el.removeAttribute('disabled');

    if (counter) el.setAttribute('counter', '');
    else el.removeAttribute('counter');

    if (floatingLabel) el.setAttribute('floating-label', '');
    else el.removeAttribute('floating-label');

    if (type) el.setAttribute('type', type);
    else el.removeAttribute('type');

    if (name) el.setAttribute('name', name);
    else el.removeAttribute('name');

    if (required) el.setAttribute('required', '');
    else el.removeAttribute('required');

    if (pattern) el.setAttribute('pattern', pattern);
    else el.removeAttribute('pattern');

    if (inputMode) el.setAttribute('inputmode', inputMode);
    else el.removeAttribute('inputmode');

    if (autoComplete) el.setAttribute('autocomplete', autoComplete);
    else el.removeAttribute('autocomplete');

    if (min != null && min !== '') el.setAttribute('min', String(min));
    else el.removeAttribute('min');

    if (max != null && max !== '') el.setAttribute('max', String(max));
    else el.removeAttribute('max');

    if (step != null && step !== '') el.setAttribute('step', String(step));
    else el.removeAttribute('step');

    if (typeof spellCheck === 'boolean') el.setAttribute('spellcheck', spellCheck ? 'true' : 'false');
    else el.removeAttribute('spellcheck');

    if (placeholder) el.setAttribute('placeholder', placeholder);
    else el.removeAttribute('placeholder');

    if (headless) el.setAttribute('headless', '');
    else el.removeAttribute('headless');

    if (variant && variant !== 'classic') el.setAttribute('variant', variant);
    else el.removeAttribute('variant');

    if (tone && tone !== 'default') el.setAttribute('tone', tone);
    else el.removeAttribute('tone');

    if (density && density !== 'default') el.setAttribute('density', density);
    else el.removeAttribute('density');

    if (shape && shape !== 'default') el.setAttribute('shape', shape);
    else el.removeAttribute('shape');

    if (color) el.setAttribute('color', color);
    else el.removeAttribute('color');

    if (radius) el.setAttribute('radius', String(radius));
    else el.removeAttribute('radius');

    if (label) el.setAttribute('label', label);
    else el.removeAttribute('label');

    if (description) el.setAttribute('description', description);
    else el.removeAttribute('description');
  }, [
    clearable,
    debounce,
    validation,
    size,
    minlength,
    maxlength,
    readOnly,
    autofocus,
    disabled,
    counter,
    floatingLabel,
    type,
    name,
    required,
    pattern,
    inputMode,
    autoComplete,
    min,
    max,
    step,
    spellCheck,
    placeholder,
    headless,
    variant,
    tone,
    density,
    shape,
    color,
    radius,
    label,
    description
  ]);

  return React.createElement('ui-input', { ref, value: value ?? undefined, ...rest }, children);
});

InputRoot.displayName = 'Input';

/**
 * Input.Prefix - Renders content in the prefix slot
 * @example
 * ```tsx
 * <Input>
 *   <Input.Prefix>🔍</Input.Prefix>
 *   <Input.Suffix><button>Go</button></Input.Suffix>
 * </Input>
 * ```
 */
const InputPrefix = React.forwardRef<HTMLElement, InputPrefixProps>(
  function InputPrefix({ ...props }, ref) {
    return React.createElement('span', { ref, slot: 'prefix', ...props });
  }
);

InputPrefix.displayName = 'Input.Prefix';

/**
 * Input.Suffix - Renders content in the suffix slot
 * @example
 * ```tsx
 * <Input>
 *   <Input.Prefix>🔍</Input.Prefix>
 *   <Input.Suffix><button>Go</button></Input.Suffix>
 * </Input>
 * ```
 */
const InputSuffix = React.forwardRef<HTMLElement, InputSuffixProps>(
  function InputSuffix({ ...props }, ref) {
    return React.createElement('span', { ref, slot: 'suffix', ...props });
  }
);

InputSuffix.displayName = 'Input.Suffix';

/**
 * Input.Error - Renders error message in the error slot
 * @example
 * ```tsx
 * <Input validation="error">
 *   <Input.Error>Field is required</Input.Error>
 * </Input>
 * ```
 */
const InputError = React.forwardRef<HTMLElement, InputErrorProps>(
  function InputError({ ...props }, ref) {
    return React.createElement('span', { ref, slot: 'error', ...props });
  }
);

InputError.displayName = 'Input.Error';

export const Input = Object.assign(InputRoot, {
  Prefix: InputPrefix,
  Suffix: InputSuffix,
  Error: InputError,
});

export default Input;
