import React, { useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type MultiSelectOption = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

type MultiSelectOptionGroup = {
  label: string;
  options: MultiSelectOption[];
};

type MultiSelectProps = React.HTMLAttributes<HTMLElement> & {
  options: Array<MultiSelectOption | MultiSelectOptionGroup>;
  value?: string[];
  placeholder?: string;
  label?: string;
  description?: string;
  error?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  loading?: boolean;
  loadingText?: string;
  clearable?: boolean;
  maxSelections?: number;
  renderLimit?: number;
  selectionIndicator?: 'checkbox' | 'check' | 'none';
  optionBorder?: boolean;
  variant?: 'default' | 'surface' | 'soft' | 'solid' | 'outline' | 'flat' | 'contrast' | 'filled' | 'minimal';
  tone?: 'default' | 'neutral' | 'info' | 'success' | 'warning' | 'danger';
  density?: 'default' | 'compact' | 'comfortable';
  shape?: 'default' | 'square' | 'soft';
  radius?: number | string;
  optionRadius?: number | string;
  elevation?: 'none' | 'low' | 'high';
  size?: 'sm' | 'md' | 'lg' | '1' | '2' | '3';
  onChange?: (detail: { value: string[]; previousValue: string[]; selectedItems: MultiSelectOption[]; source: string }) => void;
  onValueChange?: (value: string[]) => void;
};

export const MultiSelect = React.forwardRef<HTMLElement, MultiSelectProps>(function MultiSelect(
  {
    options,
    value,
    placeholder,
    label,
    description,
    error,
    name,
    required,
    disabled,
    readOnly,
    loading,
    loadingText,
    clearable,
    maxSelections,
    renderLimit,
    selectionIndicator,
    optionBorder,
    variant,
    tone,
    density,
    shape,
    radius,
    optionRadius,
    elevation,
    size,
    onChange,
    onValueChange,
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
      const detail = (event as CustomEvent<{ value: string[]; previousValue: string[]; selectedItems: MultiSelectOption[]; source: string }>).detail;
      if (!detail) return;
      onChange?.(detail);
      onValueChange?.(detail.value);
    };
    el.addEventListener('change', handleChange as EventListener);
    return () => {
      el.removeEventListener('change', handleChange as EventListener);
    };
  }, [onChange, onValueChange]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const syncAttr = (attr: string, next: string | null) => {
      const current = el.getAttribute(attr);
      if (next == null) {
        if (current != null) el.removeAttribute(attr);
        return;
      }
      if (current !== next) el.setAttribute(attr, next);
    };
    const syncBool = (attr: string, enabled: boolean | undefined) => {
      if (enabled) {
        if (!el.hasAttribute(attr)) el.setAttribute(attr, '');
      } else if (el.hasAttribute(attr)) {
        el.removeAttribute(attr);
      }
    };

    syncAttr('options', JSON.stringify(options || []));
    syncAttr('value', value?.length ? JSON.stringify(value) : null);
    syncAttr('placeholder', placeholder ?? null);
    syncAttr('label', label ?? null);
    syncAttr('description', description ?? null);
    syncAttr('data-error', error ?? null);
    syncAttr('name', name ?? null);
    syncAttr('max-selections', typeof maxSelections === 'number' ? String(maxSelections) : null);
    syncAttr('render-limit', typeof renderLimit === 'number' ? String(renderLimit) : null);
    syncAttr('loading-text', loadingText ?? null);
    syncAttr('selection-indicator', selectionIndicator ?? null);
    syncBool('option-border', optionBorder);
    syncAttr('variant', variant && variant !== 'default' ? variant : null);
    syncAttr('tone', tone && tone !== 'default' ? tone : null);
    syncAttr('density', density && density !== 'default' ? density : null);
    syncAttr('shape', shape && shape !== 'default' ? shape : null);
    syncAttr('radius', radius != null ? String(radius) : null);
    syncAttr('option-radius', optionRadius != null ? String(optionRadius) : null);
    syncAttr('elevation', elevation && elevation !== 'low' ? elevation : null);
    syncAttr('size', size && size !== 'md' && size !== '2' ? size : null);
    syncBool('required', required);
    syncBool('disabled', disabled);
    syncBool('readonly', readOnly);
    syncBool('loading', loading);
    syncBool('clearable', clearable);
  }, [
    options,
    value,
    placeholder,
    label,
    description,
    error,
    name,
    required,
    disabled,
    readOnly,
    loading,
    loadingText,
    clearable,
    maxSelections,
    renderLimit,
    selectionIndicator,
    optionBorder,
    variant,
    tone,
    density,
    shape,
    radius,
    optionRadius,
    elevation,
    size
  ]);

  return React.createElement('ui-multi-select', { ref, ...rest }, children);
});

MultiSelect.displayName = 'MultiSelect';

export default MultiSelect;
