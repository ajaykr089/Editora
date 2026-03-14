import React, { useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type PasswordFieldProps = React.HTMLAttributes<HTMLElement> & {
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

    const onClearHandler = () => onClear?.();
    const onVisibilityHandler = (event: Event) => {
      const detail = (event as CustomEvent<{ revealed?: boolean }>).detail;
      onVisibilityChange?.(!!detail?.revealed);
    };
    const onStrengthHandler = (event: Event) => {
      const detail = (event as CustomEvent<{ value: string; score: 1 | 2 | 3 | 4; label: string; caption: string }>).detail;
      if (detail) onStrengthChange?.(detail);
    };

    el.addEventListener('input', onInputHandler as EventListener);
    el.addEventListener('change', onChangeHandler as EventListener);
    el.addEventListener('debounced-input', onDebouncedHandler as EventListener);
    el.addEventListener('clear', onClearHandler as EventListener);
    el.addEventListener('visibility-change', onVisibilityHandler as EventListener);
    el.addEventListener('strength-change', onStrengthHandler as EventListener);

    return () => {
      el.removeEventListener('input', onInputHandler as EventListener);
      el.removeEventListener('change', onChangeHandler as EventListener);
      el.removeEventListener('debounced-input', onDebouncedHandler as EventListener);
      el.removeEventListener('clear', onClearHandler as EventListener);
      el.removeEventListener('visibility-change', onVisibilityHandler as EventListener);
      el.removeEventListener('strength-change', onStrengthHandler as EventListener);
    };
  }, [onChange, onClear, onDebouncedInput, onInput, onStrengthChange, onVisibilityChange]);

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

    if (value !== undefined) syncAttr('value', value ?? null);
    syncAttr('debounce', typeof debounce === 'number' && Number.isFinite(debounce) ? String(debounce) : null);
    syncAttr('validation', validation && validation !== 'none' ? validation : null);
    syncAttr('size', size && size !== 'md' && size !== '2' ? String(size) : null);
    syncAttr('minlength', typeof minlength === 'number' ? String(minlength) : null);
    syncAttr('maxlength', typeof maxlength === 'number' ? String(maxlength) : null);
    syncAttr('pattern', pattern ?? null);
    syncAttr('autocomplete', autoComplete ?? null);
    syncAttr('spellcheck', typeof spellCheck === 'boolean' ? String(spellCheck) : null);
    syncAttr('placeholder', placeholder ?? null);
    syncAttr('variant', variant && variant !== 'classic' ? variant : null);
    syncAttr('tone', tone && tone !== 'default' ? tone : null);
    syncAttr('density', density && density !== 'default' ? density : null);
    syncAttr('shape', shape && shape !== 'default' ? shape : null);
    syncAttr('color', color ?? null);
    syncAttr('radius', radius ? String(radius) : null);
    syncAttr('label', label ?? null);
    syncAttr('description', description ?? null);
    syncAttr('data-error', error ?? null);
    syncAttr('name', name ?? null);

    syncBoolean('clearable', clearable);
    syncBoolean('readonly', readOnly);
    syncBoolean('autofocus', autofocus);
    syncBoolean('disabled', disabled);
    syncBoolean('counter', counter);
    syncBoolean('floating-label', floatingLabel);
    syncBoolean('required', required);
    syncBoolean('show-strength', showStrength);

    if (typeof revealable === 'boolean') syncAttr('revealable', String(revealable));
    else el.removeAttribute('revealable');

    (el as HTMLElement & { strengthEvaluator?: PasswordFieldProps['strengthEvaluator'] | null }).strengthEvaluator = strengthEvaluator ?? null;
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
