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

type ProgressProps = React.HTMLAttributes<HTMLElement> & {
  value?: number | string;
  buffer?: number | string;
  max?: number | string;
  min?: number | string;
  indeterminate?: boolean;
  striped?: boolean;
  animated?: boolean;
  showLabel?: boolean;
  label?: string;
  format?: 'percent' | 'value' | 'fraction';
  precision?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'solid' | 'soft' | 'line' | 'glass' | 'contrast';
  tone?: 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  shape?: 'round' | 'pill' | 'square';
  mode?: 'line' | 'circle' | 'radial';
  onValueChange?: (detail: {
    value: number;
    buffer: number;
    max: number;
    min: number;
    percent: number;
    bufferPercent: number;
  }) => void;
  onComplete?: (detail: { value: number; max: number }) => void;
};

export const Progress = React.forwardRef<HTMLElement, ProgressProps>(function Progress(
  {
    value,
    buffer,
    max,
    min,
    indeterminate,
    striped,
    animated,
    showLabel,
    label,
    format,
    precision,
    size,
    variant,
    tone,
    shape,
    mode,
    onValueChange,
    onComplete,
    children,
    ...rest
  },
  forwardedRef
) {
  const ref = useForwardedHostRef<HTMLElement>(forwardedRef);

  const changeHandler = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<{
      value: number;
      buffer: number;
      max: number;
      min: number;
      percent: number;
      bufferPercent: number;
    }>(event);
    if (detail) onValueChange?.(detail);
  }, [onValueChange]);

  const completeHandler = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<{ value: number; max: number }>(event);
    if (detail) onComplete?.(detail);
  }, [onComplete]);

  useElementEventListeners(
    ref,
    [
      { type: 'change', listener: changeHandler },
      { type: 'complete', listener: completeHandler },
    ],
    [changeHandler, completeHandler]
  );

  useElementAttributes(ref, (el) => {
    syncStringAttribute(el, 'value', value != null ? String(value) : null);
    syncStringAttribute(el, 'buffer', buffer != null ? String(buffer) : null);
    syncStringAttribute(el, 'max', max != null ? String(max) : null);
    syncStringAttribute(el, 'min', min != null ? String(min) : null);
    syncBooleanAttribute(el, 'indeterminate', indeterminate);
    syncBooleanAttribute(el, 'striped', striped);
    syncBooleanAttribute(el, 'animated', animated);
    syncBooleanAttribute(el, 'show-label', showLabel);
    syncStringAttribute(el, 'label', label != null && label !== '' ? label : null);
    syncStringAttribute(el, 'format', format != null && format !== 'percent' ? format : null);
    syncNumberAttribute(el, 'precision', typeof precision === 'number' ? precision : undefined);
    syncStringAttribute(el, 'size', size && size !== 'md' ? size : null);
    syncStringAttribute(el, 'variant', variant && variant !== 'default' ? variant : null);
    syncStringAttribute(el, 'tone', tone && tone !== 'brand' ? tone : null);
    syncStringAttribute(el, 'shape', shape && shape !== 'pill' ? shape : null);
    syncStringAttribute(el, 'mode', mode && mode !== 'line' ? mode : null);
  }, [value, buffer, max, min, indeterminate, striped, animated, showLabel, label, format, precision, size, variant, tone, shape, mode]);

  return React.createElement('ui-progress', { ref, ...rest }, children);
});

Progress.displayName = 'Progress';
