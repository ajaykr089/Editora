import React from 'react';
import {
  getCustomEventDetail,
  syncBooleanAttribute,
  syncJsonAttribute,
  syncNumberAttribute,
  syncStringAttribute,
  useElementAttributes,
  useElementEventListeners,
  useForwardedHostRef,
} from './_internals';

type SliderValueDetail = {
  value: number;
  valueStart: number;
  valueEnd: number;
  range: boolean;
  min: number;
  max: number;
  step: number;
  percent: number;
  percentStart: number;
  percentEnd: number;
};

type BaseProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onInput'> & {
  children?: React.ReactNode;
};

export type SliderProps = BaseProps & {
  value?: number;
  valueStart?: number;
  valueEnd?: number;
  min?: number;
  max?: number;
  step?: number;
  range?: boolean;
  disabled?: boolean;
  headless?: boolean;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'soft' | 'glass' | 'contrast' | 'minimal';
  tone?: 'brand' | 'success' | 'warning' | 'danger';
  showValue?: boolean;
  format?: 'value' | 'percent' | 'range';
  label?: string;
  description?: string;
  marks?: Array<number | { value: number; label?: string }>;
  name?: string;
  nameStart?: string;
  nameEnd?: string;
  onInput?: (value: number) => void;
  onChange?: (value: number) => void;
  onValueChange?: (detail: SliderValueDetail) => void;
};

export const Slider = React.forwardRef<HTMLElement, SliderProps>(function Slider(
  {
    children,
    value,
    valueStart,
    valueEnd,
    min,
    max,
    step,
    range,
    disabled,
    headless,
    orientation,
    size,
    variant,
    tone,
    showValue,
    format,
    label,
    description,
    marks,
    name,
    nameStart,
    nameEnd,
    onInput,
    onChange,
    onValueChange,
    ...rest
  },
  forwardedRef
) {
  const ref = useForwardedHostRef<HTMLElement>(forwardedRef);

  const handleInput = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<SliderValueDetail>(event);
    if (!detail) return;
    onInput?.(Number(detail.value));
    onValueChange?.(detail);
  }, [onInput, onValueChange]);

  const handleChange = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<SliderValueDetail>(event);
    if (!detail) return;
    onChange?.(Number(detail.value));
    onValueChange?.(detail);
  }, [onChange, onValueChange]);

  useElementEventListeners(
    ref,
    [
      { type: 'input', listener: handleInput },
      { type: 'change', listener: handleChange },
    ],
    [handleInput, handleChange]
  );

  useElementAttributes(ref, (el) => {
    syncNumberAttribute(el, 'value', typeof value === 'number' && Number.isFinite(value) ? value : undefined);
    syncNumberAttribute(el, 'value-start', typeof valueStart === 'number' && Number.isFinite(valueStart) ? valueStart : undefined);
    syncNumberAttribute(el, 'value-end', typeof valueEnd === 'number' && Number.isFinite(valueEnd) ? valueEnd : undefined);
    syncNumberAttribute(el, 'min', typeof min === 'number' && Number.isFinite(min) ? min : undefined);
    syncNumberAttribute(el, 'max', typeof max === 'number' && Number.isFinite(max) ? max : undefined);
    syncNumberAttribute(el, 'step', typeof step === 'number' && Number.isFinite(step) ? step : undefined);
    syncBooleanAttribute(el, 'range', range);
    syncBooleanAttribute(el, 'disabled', disabled);
    syncBooleanAttribute(el, 'headless', headless);
    syncStringAttribute(el, 'orientation', orientation && orientation !== 'horizontal' ? orientation : null);
    syncStringAttribute(el, 'size', size && size !== 'md' ? size : null);
    syncStringAttribute(el, 'variant', variant && variant !== 'default' ? variant : null);
    syncStringAttribute(el, 'tone', tone && tone !== 'brand' ? tone : null);
    syncStringAttribute(el, 'show-value', typeof showValue === 'boolean' ? (showValue ? 'true' : 'false') : null);
    syncStringAttribute(el, 'format', format ? format : null);
    syncStringAttribute(el, 'label', label ? label : null);
    syncStringAttribute(el, 'description', description ? description : null);
    syncStringAttribute(el, 'name', name ? name : null);
    syncStringAttribute(el, 'name-start', nameStart ? nameStart : null);
    syncStringAttribute(el, 'name-end', nameEnd ? nameEnd : null);
    syncJsonAttribute(el, 'marks', marks?.length ? marks : null);
  }, [
    value,
    valueStart,
    valueEnd,
    min,
    max,
    step,
    range,
    disabled,
    headless,
    orientation,
    size,
    variant,
    tone,
    showValue,
    format,
    label,
    description,
    marks,
    name,
    nameStart,
    nameEnd
  ]);

  return React.createElement('ui-slider', { ref, ...rest }, children);
});

Slider.displayName = 'Slider';

export default Slider;
