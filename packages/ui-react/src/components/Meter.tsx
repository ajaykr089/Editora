import React from 'react';
import {
  getCustomEventDetail,
  syncBooleanAttribute,
  syncNumberAttribute,
  syncStringAttribute,
  useElementAttributes,
  useElementEventListeners,
  useForwardedHostRef,
} from './_internals';

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
  const ref = useForwardedHostRef<HTMLElement>(forwardedRef);

  const handleChange = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<{
      value: number;
      min: number;
      max: number;
      low: number;
      high: number;
      optimum: number | null;
      percent: number;
      state: 'low' | 'optimum' | 'suboptimum' | 'high';
    }>(event);
    if (detail) onValueChange?.(detail);
  }, [onValueChange]);

  useElementEventListeners(ref, [{ type: 'change', listener: handleChange }], [handleChange]);

  useElementAttributes(ref, (el) => {
    syncStringAttribute(el, 'value', value != null ? String(value) : null);
    syncStringAttribute(el, 'min', min != null ? String(min) : null);
    syncStringAttribute(el, 'max', max != null ? String(max) : null);
    syncStringAttribute(el, 'low', low != null ? String(low) : null);
    syncStringAttribute(el, 'high', high != null ? String(high) : null);
    syncStringAttribute(el, 'optimum', optimum != null ? String(optimum) : null);
    syncStringAttribute(el, 'label', label != null && label !== '' ? label : null);
    syncBooleanAttribute(el, 'show-label', showLabel);
    syncStringAttribute(el, 'format', format != null && format !== 'value' ? format : null);
    syncNumberAttribute(el, 'precision', typeof precision === 'number' ? precision : undefined);
    syncStringAttribute(el, 'size', size && size !== 'md' ? size : null);
    syncStringAttribute(el, 'variant', variant && variant !== 'default' ? variant : null);
    syncStringAttribute(el, 'tone', tone && tone !== 'auto' ? tone : null);
    syncStringAttribute(el, 'shape', shape && shape !== 'pill' ? shape : null);
    syncStringAttribute(el, 'mode', mode && mode !== 'line' ? mode : null);
  }, [value, min, max, low, high, optimum, label, showLabel, format, precision, size, variant, tone, shape, mode]);

  return React.createElement('ui-meter', { ref, ...rest }, children);
});

Meter.displayName = 'Meter';

export default Meter;
