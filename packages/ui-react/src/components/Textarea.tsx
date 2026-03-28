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

type TextareaDetail = {
  value: string;
  length: number;
  name: string;
};

export type TextareaLabelProps = React.HTMLAttributes<HTMLElement>;
export type TextareaDescriptionProps = React.HTMLAttributes<HTMLElement>;
export type TextareaErrorProps = React.HTMLAttributes<HTMLElement>;

type BaseProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onInput'> & {
  children?: React.ReactNode;
};

export type TextareaProps = BaseProps & {
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
  rows?: number;
  readOnly?: boolean;
  autofocus?: boolean;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  placeholder?: string;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  variant?: 'classic' | 'surface' | 'soft' | 'filled' | 'ghost' | 'contrast';
  color?: string;
  radius?: 'none' | 'large' | 'full' | string;
  label?: string;
  description?: string;
  autosize?: boolean;
  maxRows?: number;
  showCount?: boolean;
  density?: 'compact' | 'default' | 'comfortable';
  tone?: 'brand' | 'success' | 'warning' | 'danger';
  headless?: boolean;
};

const TextareaRoot = React.forwardRef<HTMLElement, TextareaProps>(function Textarea(
  {
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
    rows,
    readOnly,
    autofocus,
    disabled,
    name,
    required,
    placeholder,
    resize,
    variant,
    color,
    radius,
    label,
    description,
    autosize,
    maxRows,
    showCount,
    density,
    tone,
    headless,
    children,
    ...rest
  },
  forwardedRef
) {
  const ref = useForwardedHostRef<HTMLElement>(forwardedRef);

  const inputHandler = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<TextareaDetail>(event);
    if (detail) onInput?.(detail.value);
  }, [onInput]);

  const changeHandler = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<TextareaDetail>(event);
    if (detail) onChange?.(detail.value);
  }, [onChange]);

  const debouncedHandler = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<TextareaDetail>(event);
    if (detail) onDebouncedInput?.(detail.value);
  }, [onDebouncedInput]);

  const clearHandler = React.useCallback(() => {
    onClear?.();
  }, [onClear]);

  useElementEventListeners(
    ref,
    [
      { type: 'input', listener: inputHandler },
      { type: 'change', listener: changeHandler },
      { type: 'debounced-input', listener: debouncedHandler },
      { type: 'clear', listener: clearHandler as EventListener },
    ],
    [inputHandler, changeHandler, debouncedHandler, clearHandler]
  );

  useElementAttributes(ref, (el) => {
    syncStringAttribute(el, 'value', value != null ? String(value) : null);
    syncBooleanAttribute(el, 'clearable', clearable);
    syncBooleanAttribute(el, 'readonly', readOnly);
    syncBooleanAttribute(el, 'autofocus', autofocus);
    syncBooleanAttribute(el, 'disabled', disabled);
    syncBooleanAttribute(el, 'required', required);
    syncBooleanAttribute(el, 'autosize', autosize);
    syncBooleanAttribute(el, 'show-count', showCount);
    syncBooleanAttribute(el, 'headless', headless);
    syncNumberAttribute(el, 'debounce', typeof debounce === 'number' && Number.isFinite(debounce) ? debounce : undefined);
    syncStringAttribute(el, 'validation', validation && validation !== 'none' ? validation : null);
    syncStringAttribute(el, 'size', size && size !== 'md' && size !== '2' ? String(size) : null);
    syncNumberAttribute(el, 'minlength', minlength);
    syncNumberAttribute(el, 'maxlength', maxlength);
    syncNumberAttribute(el, 'rows', rows);
    syncStringAttribute(el, 'name', name || null);
    syncStringAttribute(el, 'placeholder', placeholder || null);
    syncStringAttribute(el, 'resize', resize || null);
    syncStringAttribute(el, 'variant', variant && variant !== 'classic' ? variant : null);
    syncStringAttribute(el, 'color', color || null);
    syncStringAttribute(el, 'radius', radius ? String(radius) : null);
    syncStringAttribute(el, 'label', label || null);
    syncStringAttribute(el, 'description', description || null);
    syncNumberAttribute(el, 'max-rows', maxRows);
    syncStringAttribute(el, 'density', density && density !== 'default' ? density : null);
    syncStringAttribute(el, 'tone', tone && tone !== 'brand' ? tone : null);
  }, [
    value,
    clearable,
    debounce,
    validation,
    size,
    minlength,
    maxlength,
    rows,
    readOnly,
    autofocus,
    disabled,
    name,
    required,
    placeholder,
    resize,
    variant,
    color,
    radius,
    label,
    description,
    autosize,
    maxRows,
    showCount,
    density,
    tone,
    headless
  ]);

  return React.createElement('ui-textarea', { ref, ...rest }, children);
});

TextareaRoot.displayName = 'Textarea';

const TextareaLabel = React.forwardRef<HTMLElement, TextareaLabelProps>(
  function TextareaLabel({ ...props }, ref) {
    return React.createElement('span', { ref, slot: 'label', ...props });
  }
);
TextareaLabel.displayName = 'Textarea.Label';

const TextareaDescription = React.forwardRef<HTMLElement, TextareaDescriptionProps>(
  function TextareaDescription({ ...props }, ref) {
    return React.createElement('span', { ref, slot: 'description', ...props });
  }
);
TextareaDescription.displayName = 'Textarea.Description';

const TextareaError = React.forwardRef<HTMLElement, TextareaErrorProps>(
  function TextareaError({ ...props }, ref) {
    return React.createElement('span', { ref, slot: 'error', ...props });
  }
);
TextareaError.displayName = 'Textarea.Error';

export const Textarea = Object.assign(TextareaRoot, {
  Label: TextareaLabel,
  Description: TextareaDescription,
  Error: TextareaError,
});

export default Textarea;
