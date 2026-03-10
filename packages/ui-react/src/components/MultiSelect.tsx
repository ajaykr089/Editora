import React, { useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type MultiSelectOption = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

type MultiSelectProps = React.HTMLAttributes<HTMLElement> & {
  options: MultiSelectOption[];
  value?: string[];
  placeholder?: string;
  label?: string;
  description?: string;
  error?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  maxSelections?: number;
  onChange?: (detail: { value: string[]; previousValue: string[]; selectedItems: MultiSelectOption[]; source: string }) => void;
  onValueChange?: (value: string[]) => void;
};

export const MultiSelect = React.forwardRef<HTMLElement, MultiSelectProps>(function MultiSelect(
  { options, value, placeholder, label, description, error, name, required, disabled, maxSelections, onChange, onValueChange, children, ...rest },
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
    syncBool('required', required);
    syncBool('disabled', disabled);
  }, [options, value, placeholder, label, description, error, name, required, disabled, maxSelections]);

  return React.createElement('ui-multi-select', { ref, ...rest }, children);
});

MultiSelect.displayName = 'MultiSelect';

export default MultiSelect;
