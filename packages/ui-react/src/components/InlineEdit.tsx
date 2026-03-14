import React, { useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type InlineEditProps = React.HTMLAttributes<HTMLElement> & {
  value?: string;
  placeholder?: string;
  editing?: boolean;
  multiline?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  name?: string;
  onChange?: (detail: { value: string; previousValue: string; source: string }) => void;
  onValueChange?: (value: string) => void;
  onSave?: (detail: { value: string; previousValue: string }) => void;
  onCancel?: (value: string) => void;
};

export const InlineEdit = React.forwardRef<HTMLElement, InlineEditProps>(function InlineEdit(
  { value, placeholder, editing, multiline, disabled, readOnly, name, onChange, onValueChange, onSave, onCancel, children, ...rest },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);
  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleChange = (event: Event) => {
      const detail = (event as CustomEvent<any>).detail;
      onChange?.(detail);
      onValueChange?.(detail.value);
    };
    const handleSave = (event: Event) => onSave?.((event as CustomEvent<any>).detail);
    const handleCancel = (event: Event) => onCancel?.((event as CustomEvent<any>).detail.value);
    el.addEventListener('change', handleChange as EventListener);
    el.addEventListener('save', handleSave as EventListener);
    el.addEventListener('cancel', handleCancel as EventListener);
    return () => {
      el.removeEventListener('change', handleChange as EventListener);
      el.removeEventListener('save', handleSave as EventListener);
      el.removeEventListener('cancel', handleCancel as EventListener);
    };
  }, [onChange, onValueChange, onSave, onCancel]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const sync = (attr: string, next: string | null) => {
      if (next == null) el.removeAttribute(attr);
      else el.setAttribute(attr, next);
    };
    sync('value', value ?? null);
    sync('placeholder', placeholder ?? null);
    sync('name', name ?? null);
    if (editing) el.setAttribute('editing', '');
    else el.removeAttribute('editing');
    if (multiline) el.setAttribute('multiline', '');
    else el.removeAttribute('multiline');
    if (disabled) el.setAttribute('disabled', '');
    else el.removeAttribute('disabled');
    if (readOnly) el.setAttribute('readonly', '');
    else el.removeAttribute('readonly');
  }, [value, placeholder, name, editing, multiline, disabled, readOnly]);

  return React.createElement('ui-inline-edit', { ref, ...rest }, children);
});

InlineEdit.displayName = 'InlineEdit';

export default InlineEdit;
