import React, { useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type TransferListOption = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

export type TransferListProps = React.HTMLAttributes<HTMLElement> & {
  options: TransferListOption[];
  value?: string[];
  label?: string;
  description?: string;
  error?: string;
  name?: string;
  disabled?: boolean;
  onChange?: (detail: { value: string[]; previousValue: string[]; selectedItems: TransferListOption[]; source: string }) => void;
  onValueChange?: (value: string[]) => void;
};

export const TransferList = React.forwardRef<HTMLElement, TransferListProps>(function TransferList(
  { options, value, label, description, error, name, disabled, onChange, onValueChange, children, ...rest },
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
    el.addEventListener('change', handleChange as EventListener);
    return () => el.removeEventListener('change', handleChange as EventListener);
  }, [onChange, onValueChange]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const syncAttr = (attr: string, next: string | null) => {
      if (next == null) el.removeAttribute(attr);
      else el.setAttribute(attr, next);
    };
    syncAttr('options', JSON.stringify(options || []));
    syncAttr('value', value?.length ? JSON.stringify(value) : null);
    syncAttr('label', label ?? null);
    syncAttr('description', description ?? null);
    syncAttr('error', error ?? null);
    syncAttr('name', name ?? null);
    if (disabled) el.setAttribute('disabled', '');
    else el.removeAttribute('disabled');
  }, [options, value, label, description, error, name, disabled]);

  return React.createElement('ui-transfer-list', { ref, ...rest }, children);
});

TransferList.displayName = 'TransferList';

export default TransferList;
