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

export type PasswordFieldProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onInput'> & {
  value?: string;
  onChange?: (value: string) => void;
  onInput?: (value: string) => void;
  onDebouncedInput?: (value: string) => void;
  onClear?: () => void;
  onVisibilityChange?: (revealed: boolean) => void;
  onStrengthChange?: (detail: { value: string; score: 1 | 2 | 3 | 4; label: string; caption: string }) => void;
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
  name?: string;
  required?: boolean;
  pattern?: string;
  autoComplete?: string;
  spellCheck?: boolean;
  placeholder?: string;
  variant?: 'classic' | 'surface' | 'soft' | 'outlined' | 'filled' | 'flushed' | 'minimal' | 'contrast' | 'elevated';
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger';
  density?: 'default' | 'compact' | 'comfortable';
  shape?: 'default' | 'square' | 'soft';
  color?: string;
  radius?: 'none' | 'large' | 'full' | string;
  label?: string;
  description?: string;
  error?: string;
  showStrength?: boolean;
  revealable?: boolean;
  strengthEvaluator?: (value: string) => { score: 1 | 2 | 3 | 4; label: string; caption: string };
};

export const PasswordField = React.forwardRef<HTMLElement, PasswordFieldProps>(function PasswordField(
  props,
  forwardedRef
) {
  const {
    value,
    onChange,
    onInput,
    onDebouncedInput,
    onClear,
    onVisibilityChange,
    onStrengthChange,
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
    name,
    required,
    pattern,
    autoComplete,
    spellCheck,
    placeholder,
    variant,
    tone,
    density,
    shape,
    color,
    radius,
    label,
    description,
    error,
    showStrength,
    revealable,
    strengthEvaluator,
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

  const onVisibilityHandler = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<{ revealed?: boolean }>(event);
    onVisibilityChange?.(!!detail?.revealed);
  }, [onVisibilityChange]);

  const onStrengthHandler = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<{ value: string; score: 1 | 2 | 3 | 4; label: string; caption: string }>(event);
    if (detail) onStrengthChange?.(detail);
  }, [onStrengthChange]);

  useElementEventListeners(
    ref,
    [
      { type: 'input', listener: onInputHandler },
      { type: 'change', listener: onChangeHandler },
      { type: 'debounced-input', listener: onDebouncedHandler },
      { type: 'clear', listener: onClearHandler as EventListener },
      { type: 'visibility-change', listener: onVisibilityHandler },
      { type: 'strength-change', listener: onStrengthHandler },
    ],
    [onInputHandler, onChangeHandler, onDebouncedHandler, onClearHandler, onVisibilityHandler, onStrengthHandler]
  );

  useElementAttributes(ref, (el) => {
    if (value !== undefined) {
      syncStringAttribute(el, 'value', value ?? null);
    }
    syncNumberAttribute(el, 'debounce', typeof debounce === 'number' && Number.isFinite(debounce) ? debounce : undefined);
    syncStringAttribute(el, 'validation', validation && validation !== 'none' ? validation : null);
    syncStringAttribute(el, 'size', size && size !== 'md' && size !== '2' ? String(size) : null);
    syncNumberAttribute(el, 'minlength', minlength);
    syncNumberAttribute(el, 'maxlength', maxlength);
    syncStringAttribute(el, 'pattern', pattern ?? null);
    syncStringAttribute(el, 'autocomplete', autoComplete ?? null);
    syncStringAttribute(el, 'spellcheck', typeof spellCheck === 'boolean' ? String(spellCheck) : null);
    syncStringAttribute(el, 'placeholder', placeholder ?? null);
    syncStringAttribute(el, 'variant', variant && variant !== 'classic' ? variant : null);
    syncStringAttribute(el, 'tone', tone && tone !== 'default' ? tone : null);
    syncStringAttribute(el, 'density', density && density !== 'default' ? density : null);
    syncStringAttribute(el, 'shape', shape && shape !== 'default' ? shape : null);
    syncStringAttribute(el, 'color', color ?? null);
    syncStringAttribute(el, 'radius', radius ? String(radius) : null);
    syncStringAttribute(el, 'label', label ?? null);
    syncStringAttribute(el, 'description', description ?? null);
    syncStringAttribute(el, 'data-error', error ?? null);
    syncStringAttribute(el, 'name', name ?? null);
    syncBooleanAttribute(el, 'clearable', clearable);
    syncBooleanAttribute(el, 'readonly', readOnly);
    syncBooleanAttribute(el, 'autofocus', autofocus);
    syncBooleanAttribute(el, 'disabled', disabled);
    syncBooleanAttribute(el, 'counter', counter);
    syncBooleanAttribute(el, 'floating-label', floatingLabel);
    syncBooleanAttribute(el, 'required', required);
    syncBooleanAttribute(el, 'show-strength', showStrength);
    syncStringAttribute(el, 'revealable', typeof revealable === 'boolean' ? String(revealable) : null);
    (el as HTMLElement & { strengthEvaluator?: PasswordFieldProps['strengthEvaluator'] | null }).strengthEvaluator =
      strengthEvaluator ?? null;
  }, [
    autoComplete,
    autofocus,
    clearable,
    color,
    counter,
    debounce,
    density,
    description,
    disabled,
    error,
    floatingLabel,
    label,
    maxlength,
    minlength,
    name,
    pattern,
    placeholder,
    radius,
    readOnly,
    required,
    revealable,
    showStrength,
    shape,
    size,
    spellCheck,
    strengthEvaluator,
    tone,
    validation,
    value,
    variant
  ]);

  return React.createElement('ui-password-field', { ref, ...rest }, children);
});

PasswordField.displayName = 'PasswordField';

export default PasswordField;
