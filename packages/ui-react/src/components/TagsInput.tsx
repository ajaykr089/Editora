import React, { useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type TagsInputProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> & {
  value?: string[] | string;
  name?: string;
  label?: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  counter?: boolean;
  maxTags?: number;
  allowDuplicates?: boolean;
  addOnBlur?: boolean;
  onChange?: (value: string[]) => void;
  onTagAdd?: (detail: { tag: string; value: string[] }) => void;
  onTagRemove?: (detail: { tag: string; index: number; value: string[] }) => void;
};

function serializeValue(value: string[] | string | undefined): string | null {
  if (value == null) return null;
  if (Array.isArray(value)) return JSON.stringify(value);
  return value;
}

export const TagsInput = React.forwardRef<HTMLElement, TagsInputProps>(function TagsInput(
  {
    value,
    name,
    label,
    description,
    placeholder,
    required,
    disabled,
    readOnly,
    counter,
    maxTags,
    allowDuplicates,
    addOnBlur,
    onChange,
    onTagAdd,
    onTagRemove,
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
      const detail = (event as CustomEvent<{ value?: string[] }>).detail;
      if (Array.isArray(detail?.value)) onChange?.(detail.value);
    };

    const handleAdd = (event: Event) => {
      const detail = (event as CustomEvent<{ tag: string; value: string[] }>).detail;
      if (detail) onTagAdd?.(detail);
    };

    const handleRemove = (event: Event) => {
      const detail = (event as CustomEvent<{ tag: string; index: number; value: string[] }>).detail;
      if (detail) onTagRemove?.(detail);
    };

    el.addEventListener('change', handleChange as EventListener);
    el.addEventListener('tag-add', handleAdd as EventListener);
    el.addEventListener('tag-remove', handleRemove as EventListener);
    return () => {
      el.removeEventListener('change', handleChange as EventListener);
      el.removeEventListener('tag-add', handleAdd as EventListener);
      el.removeEventListener('tag-remove', handleRemove as EventListener);
    };
  }, [onChange, onTagAdd, onTagRemove]);

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

    const syncBoolean = (attr: string, enabled: boolean | undefined) => {
      if (enabled) {
        if (!el.hasAttribute(attr)) el.setAttribute(attr, '');
      } else if (el.hasAttribute(attr)) {
        el.removeAttribute(attr);
      }
    };

    syncAttr('value', serializeValue(value));
    syncAttr('name', name ?? null);
    syncAttr('label', label ?? null);
    syncAttr('description', description ?? null);
    syncAttr('placeholder', placeholder ?? null);
    syncBoolean('required', required);
    syncBoolean('disabled', disabled);
    syncBoolean('readonly', readOnly);
    syncBoolean('counter', counter);
    syncBoolean('allow-duplicates', allowDuplicates);
    syncBoolean('add-on-blur', addOnBlur);
    syncAttr('max-tags', typeof maxTags === 'number' ? String(maxTags) : null);
  }, [value, name, label, description, placeholder, required, disabled, readOnly, counter, allowDuplicates, addOnBlur, maxTags]);

  return React.createElement('ui-tags-input', { ref, ...rest }, children);
});

TagsInput.displayName = 'TagsInput';

export default TagsInput;
