import React, { useEffect, useImperativeHandle, useRef } from 'react';

export type StepperStep = {
  value?: string;
  label?: string;
  description?: string;
  optional?: boolean;
  disabled?: boolean;
  state?: 'default' | 'complete' | 'error' | 'warning';
};

export type StepperChangeDetail = {
  index: number;
  value: string;
  label: string;
  trigger: string;
};

export type StepperProps = React.HTMLAttributes<HTMLElement> & {
  steps?: StepperStep[];
  value?: string;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'contrast' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  clickable?: boolean;
  linear?: boolean;
  headless?: boolean;
  onChange?: (detail: StepperChangeDetail) => void;
  onSelect?: (detail: StepperChangeDetail) => void;
};

export const Stepper = React.forwardRef<HTMLElement, StepperProps>(function Stepper(
  {
    steps,
    value,
    orientation,
    variant,
    size,
    clickable,
    linear,
    headless,
    onChange,
    onSelect,
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
      const detail = (event as CustomEvent<StepperChangeDetail>).detail;
      if (detail) onChange?.(detail);
    };

    const handleSelect = (event: Event) => {
      const detail = (event as CustomEvent<StepperChangeDetail>).detail;
      if (detail) onSelect?.(detail);
    };

    el.addEventListener('change', handleChange as EventListener);
    el.addEventListener('select', handleSelect as EventListener);

    return () => {
      el.removeEventListener('change', handleChange as EventListener);
      el.removeEventListener('select', handleSelect as EventListener);
    };
  }, [onChange, onSelect]);

  useEffect(() => {
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

    const syncBool = (name: string, enabled: boolean | undefined) => {
      if (enabled) syncAttr(name, '');
      else syncAttr(name, null);
    };

    if (steps && steps.length) {
      try {
        syncAttr('steps', JSON.stringify(steps));
      } catch {
        syncAttr('steps', null);
      }
    } else {
      syncAttr('steps', null);
    }

    syncAttr('value', value || null);
    syncAttr('orientation', orientation && orientation !== 'horizontal' ? orientation : null);
    syncAttr('variant', variant && variant !== 'default' ? variant : null);
    syncAttr('size', size && size !== 'md' ? size : null);
    syncBool('clickable', clickable);
    syncBool('linear', linear);
    syncBool('headless', headless);
  }, [steps, value, orientation, variant, size, clickable, linear, headless]);

  return React.createElement('ui-stepper', { ref, ...rest }, children);
});

Stepper.displayName = 'Stepper';

export default Stepper;
