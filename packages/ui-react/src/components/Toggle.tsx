import React from 'react';
import {
  getCustomEventDetail,
  syncBooleanAttribute,
  syncStringAttribute,
  useElementAttributes,
  useElementEventListeners,
  useForwardedHostRef,
} from './_internals';

type ToggleDetail = {
  pressed: boolean;
  value: string;
  name: string;
  required: boolean;
};

export type ToggleProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onInput'> & {
  pressed?: boolean;
  disabled?: boolean;
  loading?: boolean;
  headless?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'soft' | 'outline' | 'contrast' | 'minimal';
  tone?: 'brand' | 'success' | 'warning' | 'danger';
  shape?: 'default' | 'square' | 'pill';
  elevation?: 'default' | 'none';
  name?: string;
  value?: string;
  required?: boolean;
  iconOn?: string;
  iconOff?: string;
  onInput?: (detail: ToggleDetail) => void;
  onChange?: (detail: ToggleDetail) => void;
};

export const Toggle = React.forwardRef<HTMLElement, ToggleProps>(function Toggle(
  {
    children,
    pressed,
    disabled,
    loading,
    headless,
    size,
    variant,
    tone,
    shape,
    elevation,
    name,
    value,
    required,
    iconOn,
    iconOff,
    onInput,
    onChange,
    ...rest
  },
  forwardedRef
) {
  const ref = useForwardedHostRef<HTMLElement>(forwardedRef);

  const inputHandler = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<ToggleDetail>(event);
    if (detail) onInput?.(detail);
  }, [onInput]);

  const changeHandler = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<ToggleDetail>(event);
    if (detail) onChange?.(detail);
  }, [onChange]);

  useElementEventListeners(
    ref,
    [
      { type: 'input', listener: inputHandler },
      { type: 'change', listener: changeHandler },
    ],
    [inputHandler, changeHandler]
  );

  useElementAttributes(ref, (el) => {
    syncBooleanAttribute(el, 'pressed', pressed);
    syncBooleanAttribute(el, 'disabled', disabled);
    syncBooleanAttribute(el, 'loading', loading);
    syncBooleanAttribute(el, 'headless', headless);
    syncBooleanAttribute(el, 'required', required);
    syncStringAttribute(el, 'size', size && size !== 'md' ? size : null);
    syncStringAttribute(el, 'variant', variant && variant !== 'default' ? variant : null);
    syncStringAttribute(el, 'tone', tone && tone !== 'brand' ? tone : null);
    syncStringAttribute(el, 'shape', shape && shape !== 'default' ? shape : null);
    syncStringAttribute(el, 'elevation', elevation && elevation !== 'default' ? elevation : null);
    syncStringAttribute(el, 'name', name || null);
    syncStringAttribute(el, 'value', value || null);
    syncStringAttribute(el, 'icon-on', iconOn || null);
    syncStringAttribute(el, 'icon-off', iconOff || null);
  }, [pressed, disabled, loading, headless, required, size, variant, tone, shape, elevation, name, value, iconOn, iconOff]);

  return React.createElement('ui-toggle', { ref, ...rest }, children);
});

Toggle.displayName = 'Toggle';

export default Toggle;
