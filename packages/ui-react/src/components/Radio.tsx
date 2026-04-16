import * as React from 'react';
import {
  getCustomEventDetail,
  syncBooleanAttribute,
  syncStringAttribute,
  useElementAttributes,
  useElementEventListeners,
  useForwardedHostRef,
  warnIfElementNotRegistered,
} from './_internals';

type RadioChangeDetail = {
  checked?: boolean;
  value?: string;
  name?: string;
  reason?: 'click' | 'keyboard';
};

export interface RadioProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onInput'> {
  checked?: boolean;
  disabled?: boolean;
  loading?: boolean;
  invalid?: boolean;
  required?: boolean;
  headless?: boolean;
  name?: string;
  value?: string;
  density?: 'default' | 'compact' | 'comfortable';
  tone?: 'brand' | 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  onCheckedChange?: (checked: boolean, detail: RadioChangeDetail) => void;
  onChange?: (event: CustomEvent<RadioChangeDetail>) => void;
  onInput?: (event: CustomEvent<RadioChangeDetail>) => void;
}

export const Radio = React.forwardRef<HTMLElement, RadioProps>(function Radio(
  {
    checked,
    disabled,
    loading,
    invalid,
    required,
    headless,
    name,
    value,
    density,
    tone,
    onCheckedChange,
    onChange,
    onInput,
    children,
    ...rest
  },
  forwardedRef
) {
  const ref = useForwardedHostRef<HTMLElement>(forwardedRef);

  React.useEffect(() => {
    warnIfElementNotRegistered('ui-radio', 'Radio');
  }, []);

  useElementAttributes(ref, (element) => {
    syncBooleanAttribute(element, 'checked', checked);
    syncBooleanAttribute(element, 'disabled', disabled);
    syncBooleanAttribute(element, 'loading', loading);
    syncBooleanAttribute(element, 'invalid', invalid);
    syncBooleanAttribute(element, 'required', required);
    syncBooleanAttribute(element, 'headless', headless);
    syncStringAttribute(element, 'name', name || null);
    syncStringAttribute(element, 'value', value || null);
    syncStringAttribute(element, 'density', density && density !== 'default' ? density : null);
    syncStringAttribute(element, 'tone', tone && tone !== 'brand' ? tone : null);
  }, [checked, disabled, loading, invalid, required, headless, name, value, density, tone]);

  const handleInput = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<RadioChangeDetail>(event) ?? {};
    onInput?.(event as CustomEvent<RadioChangeDetail>);
    if (typeof detail.checked === 'boolean') {
      onCheckedChange?.(detail.checked, detail);
    }
  }, [onCheckedChange, onInput]);

  const handleChange = React.useCallback((event: Event) => {
    onChange?.(event as CustomEvent<RadioChangeDetail>);
  }, [onChange]);

  useElementEventListeners(
    ref,
    [
      { type: 'input', listener: handleInput },
      { type: 'change', listener: handleChange },
    ],
    [handleInput, handleChange]
  );

  const hostProps: Record<string, unknown> = {
    ref,
    ...rest,
    checked: checked ? '' : undefined,
    disabled: disabled ? '' : undefined,
    loading: loading ? '' : undefined,
    invalid: invalid ? '' : undefined,
    required: required ? '' : undefined,
    headless: headless ? '' : undefined,
    name: name || undefined,
    value: value || undefined,
    density: density && density !== 'default' ? density : undefined,
    tone: tone && tone !== 'brand' ? tone : undefined,
  };

  return React.createElement('ui-radio', hostProps, children);
});

Radio.displayName = 'Radio';
