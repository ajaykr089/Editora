import React, { useEffect, useLayoutEffect, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type BaseProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
};

export type ComboboxProps = Omit<BaseProps, 'onChange'> & {
  value?: string;
  open?: boolean;
  state?: 'idle' | 'loading' | 'error' | 'success';
  stateText?: string;
  onChange?: (value: string) => void;
  onInput?: (query: string) => void;
  onDebouncedInput?: (query: string) => void;
  onSelect?: (value: string, label: string) => void;
  onOpenDetail?: (detail: { open: boolean; previousOpen: boolean; source: string }) => void;
  onCloseDetail?: (detail: { open: boolean; previousOpen: boolean; source: string }) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onClear?: () => void;
  clearable?: boolean;
  debounce?: number;
  validation?: 'error' | 'success' | 'none';
  size?: 'sm' | 'md' | 'lg' | '1' | '2' | '3';
  maxlength?: number;
  readOnly?: boolean;
  autofocus?: boolean;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  placeholder?: string;
  variant?: 'classic' | 'surface' | 'soft';
  radius?: 'none' | 'large' | 'full' | string;
  label?: string;
  description?: string;
  emptyText?: string;
  noFilter?: boolean;
  allowCustom?: boolean;
};

export type ComboboxOptionProps = React.OptionHTMLAttributes<HTMLOptionElement> & {
  children?: React.ReactNode;
  description?: string;
};

type ComboboxComponent = React.ForwardRefExoticComponent<ComboboxProps & React.RefAttributes<HTMLElement>> & {
  Option: typeof ComboboxOption;
};

const ComboboxRoot = React.forwardRef<HTMLElement, ComboboxProps>(function Combobox(
  {
    value,
    open,
    state,
    stateText,
    onChange,
    onInput,
    onDebouncedInput,
    onSelect,
    onOpenDetail,
    onCloseDetail,
    onOpen,
    onClose,
    onClear,
    clearable,
    debounce,
    validation,
    size,
    maxlength,
    readOnly,
    autofocus,
    disabled,
    name,
    required,
    placeholder,
    variant,
    radius,
    label,
    description,
    emptyText,
    noFilter,
    allowCustom,
    children,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);

  React.useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onInputHandler = (event: Event) => {
      const query = (event as CustomEvent<{ query?: string }>).detail?.query;
      if (typeof query === 'string') onInput?.(query);
    };

    const onChangeHandler = (event: Event) => {
      const next = (event as CustomEvent<{ value?: string }>).detail?.value;
      if (typeof next === 'string') onChange?.(next);
    };

    const onDebouncedHandler = (event: Event) => {
      const query = (event as CustomEvent<{ query?: string }>).detail?.query;
      if (typeof query === 'string') onDebouncedInput?.(query);
    };

    const onSelectHandler = (event: Event) => {
      const detail = (event as CustomEvent<{ value?: string; label?: string }>).detail;
      if (typeof detail?.value === 'string') onSelect?.(detail.value, detail.label || detail.value);
    };

    const onOpenHandler = (event: Event) => {
      const detail = (event as CustomEvent<{ open: boolean; previousOpen: boolean; source: string }>).detail;
      onOpen?.();
      if (detail) onOpenDetail?.(detail);
    };
    const onCloseHandler = (event: Event) => {
      const detail = (event as CustomEvent<{ open: boolean; previousOpen: boolean; source: string }>).detail;
      onClose?.();
      if (detail) onCloseDetail?.(detail);
    };
    const onClearHandler = () => onClear?.();

    el.addEventListener('input', onInputHandler as EventListener);
    el.addEventListener('change', onChangeHandler as EventListener);
    el.addEventListener('debounced-input', onDebouncedHandler as EventListener);
    el.addEventListener('select', onSelectHandler as EventListener);
    el.addEventListener('open', onOpenHandler as EventListener);
    el.addEventListener('close', onCloseHandler as EventListener);
    el.addEventListener('clear', onClearHandler as EventListener);

    return () => {
      el.removeEventListener('input', onInputHandler as EventListener);
      el.removeEventListener('change', onChangeHandler as EventListener);
      el.removeEventListener('debounced-input', onDebouncedHandler as EventListener);
      el.removeEventListener('select', onSelectHandler as EventListener);
      el.removeEventListener('open', onOpenHandler as EventListener);
      el.removeEventListener('close', onCloseHandler as EventListener);
      el.removeEventListener('clear', onClearHandler as EventListener);
    };
  }, [onChange, onInput, onDebouncedInput, onSelect, onOpen, onClose, onOpenDetail, onCloseDetail, onClear]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const syncBooleanish = (attr: string, next: boolean | undefined) => {
      if (next) {
        if (!el.hasAttribute(attr)) el.setAttribute(attr, '');
      } else if (el.hasAttribute(attr)) {
        el.removeAttribute(attr);
      }
    };

    const syncAttr = (attr: string, next: string | null) => {
      const current = el.getAttribute(attr);
      if (next == null) {
        if (current != null) el.removeAttribute(attr);
        return;
      }
      if (current !== next) el.setAttribute(attr, next);
    };

    syncBooleanish('clearable', clearable);
    syncAttr('debounce', typeof debounce === 'number' && Number.isFinite(debounce) ? String(debounce) : null);
    syncAttr('validation', validation && validation !== 'none' ? validation : null);
    syncAttr('state', state && state !== 'idle' ? state : null);
    syncAttr('state-text', stateText || null);
    syncAttr('size', size && size !== 'md' && size !== '2' ? String(size) : null);
    syncAttr('maxlength', typeof maxlength === 'number' ? String(maxlength) : null);
    syncBooleanish('readonly', readOnly);
    syncBooleanish('autofocus', autofocus);
    syncBooleanish('disabled', disabled);
    syncAttr('name', name || null);
    syncBooleanish('required', required);
    syncAttr('placeholder', placeholder || null);
    syncAttr('variant', variant || null);
    syncAttr('radius', radius ? String(radius) : null);
    syncAttr('label', label || null);
    syncAttr('description', description || null);
    syncAttr('empty-text', emptyText || null);
    syncBooleanish('no-filter', noFilter);
    syncBooleanish('allow-custom', allowCustom);
    syncBooleanish('open', typeof open === 'boolean' ? open : undefined);

    if (value != null) el.setAttribute('value', value);
    else el.removeAttribute('value');
  }, [
    value,
    open,
    state,
    stateText,
    clearable,
    debounce,
    validation,
    size,
    maxlength,
    readOnly,
    autofocus,
    disabled,
    name,
    required,
    placeholder,
    variant,
    radius,
    label,
    description,
    emptyText,
    noFilter,
    allowCustom
  ]);

  return React.createElement('ui-combobox', { ref, ...rest }, children);
});

ComboboxRoot.displayName = 'Combobox';

export const ComboboxOption = React.forwardRef<HTMLOptionElement, ComboboxOptionProps>(function ComboboxOption(
  { description, ...props },
  ref
) {
  return (
    <option {...props} ref={ref} data-description={description} />
  );
});

ComboboxOption.displayName = 'Combobox.Option';

export const Combobox = Object.assign(ComboboxRoot, {
  Option: ComboboxOption,
}) as ComboboxComponent;

export default Combobox;
