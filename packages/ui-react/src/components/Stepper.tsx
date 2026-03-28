import React from 'react';
import {
  getCustomEventDetail,
  syncBooleanAttribute,
  syncJsonAttribute,
  syncStringAttribute,
  useElementAttributes,
  useElementEventListeners,
  useForwardedHostRef,
} from './_internals';

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

export type StepperProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onSelect'> & {
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
  const ref = useForwardedHostRef<HTMLElement>(forwardedRef);

  const handleChange = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<StepperChangeDetail>(event);
    if (detail) onChange?.(detail);
  }, [onChange]);

  const handleSelect = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<StepperChangeDetail>(event);
    if (detail) onSelect?.(detail);
  }, [onSelect]);

  useElementEventListeners(
    ref,
    [
      { type: 'change', listener: handleChange },
      { type: 'select', listener: handleSelect },
    ],
    [handleChange, handleSelect]
  );

  useElementAttributes(ref, (el) => {
    syncJsonAttribute(el, 'steps', steps?.length ? steps : null);
    syncStringAttribute(el, 'value', value || null);
    syncStringAttribute(el, 'orientation', orientation && orientation !== 'horizontal' ? orientation : null);
    syncStringAttribute(el, 'variant', variant && variant !== 'default' ? variant : null);
    syncStringAttribute(el, 'size', size && size !== 'md' ? size : null);
    syncBooleanAttribute(el, 'clickable', clickable);
    syncBooleanAttribute(el, 'linear', linear);
    syncBooleanAttribute(el, 'headless', headless);
  }, [steps, value, orientation, variant, size, clickable, linear, headless]);

  return React.createElement('ui-stepper', { ref, ...rest }, children);
});

Stepper.displayName = 'Stepper';

export default Stepper;
