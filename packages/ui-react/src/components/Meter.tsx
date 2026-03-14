import React, { useEffect, useLayoutEffect, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type MeterProps = React.HTMLAttributes<HTMLElement> & {
  value?: number | string;
  min?: number | string;
  max?: number | string;
  low?: number | string;
  high?: number | string;
  optimum?: number | string;
  label?: string;
  showLabel?: boolean;
  format?: 'percent' | 'value' | 'fraction';
  precision?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'soft' | 'solid' | 'contrast';
  tone?: 'auto' | 'brand' | 'success' | 'warning' | 'danger' | 'neutral';
  shape?: 'round' | 'pill' | 'square';
  mode?: 'line' | 'circle';
  onValueChange?: (detail: {
    value: number;
    min: number;
    max: number;
    low: number;
    high: number;
    optimum: number | null;
    percent: number;
    state: 'low' | 'optimum' | 'suboptimum' | 'high';
  }) => void;
};

export const Meter = React.forwardRef<HTMLElement, MeterProps>(function Meter(
  {
    value,
    min,
    max,
    low,
    high,
    optimum,
    label,
    showLabel,
    format,
    precision,
    size,
    variant,
    tone,
    shape,
    mode,
    onValueChange,
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
    const handleChange = (event: Event) => {
      const detail = (event as CustomEvent<any>).detail;
      if (detail) onValueChange?.(detail);
    };
    el.addEventListener('change', handleChange as EventListener);
    return () => {
      el.removeEventListener('change', handleChange as EventListener);
    };
  }, [onValueChange]);

  useIsomorphicLayoutEffect(() => {
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

    const syncBooleanAttr = (name: string, enabled: boolean | undefined) => {
      if (enabled) {
        if (!el.hasAttribute(name)) el.setAttribute(name, '');
      } else if (el.hasAttribute(name)) {
        el.removeAttribute(name);
      }
    };

    syncAttr('value', value != null ? String(value) : null);
    syncAttr('min', min != null ? String(min) : null);
    syncAttr('max', max != null ? String(max) : null);
    syncAttr('low', low != null ? String(low) : null);
    syncAttr('high', high != null ? String(high) : null);
    syncAttr('optimum', optimum != null ? String(optimum) : null);
    syncAttr('label', label != null && label !== '' ? label : null);
    syncBooleanAttr('show-label', showLabel);
    syncAttr('format', format != null && format !== 'value' ? format : null);
    syncAttr('precision', precision != null ? String(precision) : null);
    syncAttr('size', size && size !== 'md' ? size : null);
    syncAttr('variant', variant && variant !== 'default' ? variant : null);
    syncAttr('tone', tone && tone !== 'auto' ? tone : null);
    syncAttr('shape', shape && shape !== 'pill' ? shape : null);
    syncAttr('mode', mode && mode !== 'line' ? mode : null);
  }, [value, min, max, low, high, optimum, label, showLabel, format, precision, size, variant, tone, shape, mode]);

  return React.createElement('ui-meter', { ref, ...rest }, children);
});

Meter.displayName = 'Meter';

export default Meter;
