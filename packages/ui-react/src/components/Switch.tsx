import React from 'react';
import {
  getCustomEventDetail,
  syncBooleanAttribute,
  syncStringAttribute,
  useElementAttributes,
  useElementEventListeners,
  useForwardedHostRef,
} from './_internals';

type SwitchDetail = {
  checked: boolean;
  value: string;
  name: string;
  required: boolean;
};

export type SwitchDescriptionProps = React.HTMLAttributes<HTMLElement>;

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

const SwitchRoot = React.forwardRef<HTMLElement, SwitchProps>(function Switch(
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
  const ref = useForwardedHostRef<HTMLElement>(forwardedRef);

  const handleInput = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<SwitchDetail>(event);
    if (detail) onInput?.(detail);
  }, [onInput]);

  const handleChange = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<SwitchDetail>(event);
    if (detail) onChange?.(detail);
  }, [onChange]);

  useElementEventListeners(
    ref,
    [
      { type: 'input', listener: handleInput },
      { type: 'change', listener: handleChange },
    ],
    [handleInput, handleChange]
  );

  useElementAttributes(ref, (el) => {
    syncBooleanAttribute(el, 'checked', checked);
    syncBooleanAttribute(el, 'disabled', disabled);
    syncBooleanAttribute(el, 'headless', headless);
    syncBooleanAttribute(el, 'loading', loading);
    syncBooleanAttribute(el, 'required', required);
    syncStringAttribute(el, 'size', size && size !== 'md' ? size : null);
    syncStringAttribute(el, 'variant', variant && variant !== 'default' ? variant : null);
    syncStringAttribute(el, 'tone', tone && tone !== 'brand' ? tone : null);
    syncStringAttribute(el, 'label', label || null);
    syncStringAttribute(el, 'description', description || null);
    syncStringAttribute(el, 'name', name || null);
    syncStringAttribute(el, 'value', value || null);
    syncStringAttribute(el, 'shape', shape && shape !== 'pill' ? shape : null);
    syncStringAttribute(el, 'elevation', elevation && elevation !== 'low' ? elevation : null);
  }, [checked, disabled, headless, loading, required, size, variant, tone, shape, elevation, label, description, name, value]);

  return React.createElement('ui-switch', { ref, ...rest }, children);
});

SwitchRoot.displayName = 'Switch';

const SwitchDescription = React.forwardRef<HTMLElement, SwitchDescriptionProps>(
  function SwitchDescription({ ...props }, ref) {
    return React.createElement('span', { ref, slot: 'description', ...props });
  }
);
SwitchDescription.displayName = 'Switch.Description';

export const Switch = Object.assign(SwitchRoot, {
  Description: SwitchDescription,
});

export default Switch;
