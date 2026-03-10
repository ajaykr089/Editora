import React, { useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type BaseDateFieldProps = React.HTMLAttributes<HTMLElement> & {
  value?: string;
  min?: string;
  max?: string;
  locale?: string;
  label?: string;
  description?: string;
  error?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  onChange?: (detail: { value: string | null; previousValue: string | null; source: string }) => void;
  onValueChange?: (value: string | null) => void;
};

function useFieldChangeBridge(
  ref: React.MutableRefObject<HTMLElement | null>,
  onChange: BaseDateFieldProps['onChange'],
  onValueChange: BaseDateFieldProps['onValueChange']
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleChange = (event: Event) => {
      const detail = (event as CustomEvent<{ value: string | null; previousValue: string | null; source: string }>).detail;
      if (!detail) return;
      onChange?.(detail);
      onValueChange?.(detail.value);
    };
    el.addEventListener('change', handleChange as EventListener);
    return () => {
      el.removeEventListener('change', handleChange as EventListener);
    };
  }, [onChange, onValueChange, ref]);
}

export const DateField = React.forwardRef<HTMLElement, BaseDateFieldProps>(function DateField(
  { value, min, max, locale, label, description, error, name, required, disabled, readOnly, onChange, onValueChange, children, ...rest },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);
  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);
  useFieldChangeBridge(ref, onChange, onValueChange);

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
    const syncBool = (attr: string, next: boolean | undefined) => {
      if (next) {
        if (!el.hasAttribute(attr)) el.setAttribute(attr, '');
      } else if (el.hasAttribute(attr)) {
        el.removeAttribute(attr);
      }
    };

    syncAttr('value', value ?? null);
    syncAttr('min', min ?? null);
    syncAttr('max', max ?? null);
    syncAttr('locale', locale ?? null);
    syncAttr('label', label ?? null);
    syncAttr('description', description ?? null);
    syncAttr('data-error', error ?? null);
    syncAttr('name', name ?? null);
    syncBool('required', required);
    syncBool('disabled', disabled);
    syncBool('readonly', readOnly);
  }, [value, min, max, locale, label, description, error, name, required, disabled, readOnly]);

  return React.createElement('ui-date-field', { ref, ...rest }, children);
});

export const TimeField = React.forwardRef<HTMLElement, BaseDateFieldProps & { format?: '24h' | '12h'; seconds?: boolean }>(
  function TimeField(
    { value, min, max, locale, label, description, error, name, required, disabled, readOnly, format, seconds, onChange, onValueChange, children, ...rest },
    forwardedRef
  ) {
    const ref = useRef<HTMLElement | null>(null);
    useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);
    useFieldChangeBridge(ref, onChange, onValueChange);

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
      const syncBool = (attr: string, next: boolean | undefined) => {
        if (next) {
          if (!el.hasAttribute(attr)) el.setAttribute(attr, '');
        } else if (el.hasAttribute(attr)) {
          el.removeAttribute(attr);
        }
      };

      syncAttr('value', value ?? null);
      syncAttr('min', min ?? null);
      syncAttr('max', max ?? null);
      syncAttr('locale', locale ?? null);
      syncAttr('label', label ?? null);
      syncAttr('description', description ?? null);
      syncAttr('data-error', error ?? null);
      syncAttr('name', name ?? null);
      syncAttr('format', format && format !== '24h' ? format : null);
      syncBool('seconds', seconds);
      syncBool('required', required);
      syncBool('disabled', disabled);
      syncBool('readonly', readOnly);
    }, [value, min, max, locale, label, description, error, name, required, disabled, readOnly, format, seconds]);

    return React.createElement('ui-time-field', { ref, ...rest }, children);
  }
);

DateField.displayName = 'DateField';
TimeField.displayName = 'TimeField';

export default DateField;
