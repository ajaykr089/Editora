import React, { useEffect, useLayoutEffect, useImperativeHandle, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type SwitchDetail = {
  checked: boolean;
  value: string;
  name: string;
  required: boolean;
};

export type SwitchProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onInput'> & {
  checked?: boolean;
  disabled?: boolean;
  headless?: boolean;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'soft' | 'outline' | 'contrast' | 'minimal';
  tone?: 'brand' | 'success' | 'warning' | 'danger';
  shape?: 'pill' | 'rounded' | 'square';
  elevation?: 'none' | 'low' | 'high';
  label?: string;
  description?: string;
  name?: string;
  value?: string;
  required?: boolean;
  onInput?: (detail: SwitchDetail) => void;
  onChange?: (detail: SwitchDetail) => void;
};

export const Switch = React.forwardRef<HTMLElement, SwitchProps>(function Switch(
  {
    children,
    checked,
    disabled,
    headless,
    loading,
    size,
    variant,
    tone,
    shape,
    elevation,
    label,
    description,
    name,
    value,
    required,
    onInput,
    onChange,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);

  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleInput = (event: Event) => {
      const detail = (event as CustomEvent<SwitchDetail>).detail;
      if (detail) onInput?.(detail);
    };

    const handleChange = (event: Event) => {
      const detail = (event as CustomEvent<SwitchDetail>).detail;
      if (detail) onChange?.(detail);
    };

    el.addEventListener('input', handleInput as EventListener);
    el.addEventListener('change', handleChange as EventListener);

    return () => {
      el.removeEventListener('input', handleInput as EventListener);
      el.removeEventListener('change', handleChange as EventListener);
    };
  }, [onInput, onChange]);

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
      if (enabled) syncAttr(attr, '');
      else syncAttr(attr, null);
    };

    syncBool('checked', checked);
    syncBool('disabled', disabled);
    syncBool('headless', headless);
    syncBool('loading', loading);
    syncBool('required', required);

    syncAttr('size', size && size !== 'md' ? size : null);
    syncAttr('variant', variant && variant !== 'default' ? variant : null);
    syncAttr('tone', tone && tone !== 'brand' ? tone : null);
    syncAttr('label', label || null);
    syncAttr('description', description || null);
    syncAttr('name', name || null);
    syncAttr('value', value || null);
    syncAttr('shape', shape && shape !== 'pill' ? shape : null);
    syncAttr('elevation', elevation && elevation !== 'low' ? elevation : null);
  }, [checked, disabled, headless, loading, required, size, variant, tone, shape, elevation, label, description, name, value]);

  return React.createElement('ui-switch', { ref, ...rest }, children);
});

Switch.displayName = 'Switch';

export default Switch;
