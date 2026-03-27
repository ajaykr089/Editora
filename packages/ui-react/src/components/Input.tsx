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

  const ref = useForwardedHostRef<HTMLElement>(forwardedRef);

  const onInputHandler = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<{ value?: string }>(event);
    if (typeof detail?.value === 'string') onInput?.(detail.value);
  }, [onInput]);

  const onChangeHandler = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<{ value?: string }>(event);
    if (typeof detail?.value === 'string') onChange?.(detail.value);
  }, [onChange]);

  const onDebouncedHandler = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<{ value?: string }>(event);
    if (typeof detail?.value === 'string') onDebouncedInput?.(detail.value);
  }, [onDebouncedInput]);

  const onClearHandler = React.useCallback(() => {
    onClear?.();
  }, [onClear]);

  useElementEventListeners(
    ref,
    [
      { type: 'input', listener: onInputHandler },
      { type: 'change', listener: onChangeHandler },
      { type: 'debounced-input', listener: onDebouncedHandler },
      { type: 'clear', listener: onClearHandler as EventListener },
    ],
    [onInputHandler, onChangeHandler, onDebouncedHandler, onClearHandler]
  );

  useElementAttributes(ref, (el) => {
    syncBooleanAttribute(el, 'clearable', clearable);
    syncNumberAttribute(el, 'debounce', typeof debounce === 'number' && Number.isFinite(debounce) ? debounce : undefined);
    syncStringAttribute(el, 'validation', validation && validation !== 'none' ? validation : null);
    syncStringAttribute(el, 'size', size && size !== 'md' && size !== '2' ? String(size) : null);
    syncNumberAttribute(el, 'minlength', minlength);
    syncNumberAttribute(el, 'maxlength', maxlength);
    syncBooleanAttribute(el, 'readonly', readOnly);
    syncBooleanAttribute(el, 'autofocus', autofocus);
    syncBooleanAttribute(el, 'disabled', disabled);
    syncBooleanAttribute(el, 'counter', counter);
    syncBooleanAttribute(el, 'floating-label', floatingLabel);
    syncStringAttribute(el, 'type', type ?? null);
    syncStringAttribute(el, 'name', name ?? null);
    syncBooleanAttribute(el, 'required', required);
    syncStringAttribute(el, 'pattern', pattern ?? null);
    syncStringAttribute(el, 'inputmode', inputMode ?? null);
    syncStringAttribute(el, 'autocomplete', autoComplete ?? null);
    syncStringAttribute(el, 'min', min != null && min !== '' ? String(min) : null);
    syncStringAttribute(el, 'max', max != null && max !== '' ? String(max) : null);
    syncStringAttribute(el, 'step', step != null && step !== '' ? String(step) : null);
    syncStringAttribute(el, 'spellcheck', typeof spellCheck === 'boolean' ? (spellCheck ? 'true' : 'false') : null);
    syncStringAttribute(el, 'placeholder', placeholder ?? null);
    syncBooleanAttribute(el, 'headless', headless);
    syncStringAttribute(el, 'variant', variant && variant !== 'classic' ? variant : null);
    syncStringAttribute(el, 'tone', tone && tone !== 'default' ? tone : null);
    syncStringAttribute(el, 'density', density && density !== 'default' ? density : null);
    syncStringAttribute(el, 'shape', shape && shape !== 'default' ? shape : null);
    syncStringAttribute(el, 'color', color ?? null);
    syncStringAttribute(el, 'radius', radius ? String(radius) : null);
    syncStringAttribute(el, 'label', label ?? null);
    syncStringAttribute(el, 'description', description ?? null);
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
