import React from 'react';
import '@editora/ui-core/radio-group';
import {
  createUIElement,
  getCustomEventDetail,
  syncBooleanAttribute,
  syncJsonAttribute,
  syncStringAttribute,
  useElementAttributes,
  useElementEventListeners,
  useForwardedHostRef,
  useControlledAttribute,
  whenHandled,
} from './_internals';

type RadioOption = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

type RadioGroupProps = React.HTMLAttributes<HTMLElement> & {
  value?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  orientation?: 'vertical' | 'horizontal';
  variant?: 'default' | 'card' | 'segmented';
  size?: 'sm' | 'md' | 'lg';
  tone?: 'brand' | 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  options?: Array<RadioOption | string>;
  onValueChange?: (detail: {
    value: string;
    option?: RadioOption;
    reason?: 'click' | 'keyboard';
    name?: string;
  }) => void;
};

export const RadioGroup = React.forwardRef<HTMLElement, RadioGroupProps>(function RadioGroup(
  {
    value,
    disabled,
    required,
    name,
    orientation,
    variant,
    size,
    tone,
    options,
    onValueChange,
    children,
    ...rest
  },
  forwardedRef
) {
  const ref = useForwardedHostRef<HTMLElement>(forwardedRef);

  const handler = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<{
      value: string;
      option?: RadioOption;
      reason?: 'click' | 'keyboard';
      name?: string;
    }>(event);
    if (detail) onValueChange?.(detail);
  }, [onValueChange]);

  useElementEventListeners(ref, [{ type: 'change', listener: handler }], [handler]);

  useElementAttributes(ref, (el) => {
    syncStringAttribute(el, 'value', value != null ? value : null);
    syncBooleanAttribute(el, 'disabled', disabled);
    syncBooleanAttribute(el, 'required', required);
    syncStringAttribute(el, 'name', name || null);
    syncStringAttribute(el, 'orientation', orientation && orientation !== 'vertical' ? orientation : null);
    syncStringAttribute(el, 'variant', variant && variant !== 'default' ? variant : null);
    syncStringAttribute(el, 'size', size && size !== 'md' ? size : null);
    syncStringAttribute(el, 'tone', tone && tone !== 'brand' ? tone : null);
    syncJsonAttribute(el, 'options', options?.length ? options : null);
  }, [value, disabled, required, name, orientation, variant, size, tone, options]);

  // With a change handler the prop wins over the element's own state; without one it is the
  // initial value, as the docs use it (see useControlledAttribute).
  useControlledAttribute(ref, { attribute: 'value', value: whenHandled([onValueChange, (rest as { onChange?: unknown }).onChange], value == null ? undefined : value), events: ['change'] });

  return createUIElement('ui-radio-group', { ref, ...rest }, children);
});

RadioGroup.displayName = 'RadioGroup';
