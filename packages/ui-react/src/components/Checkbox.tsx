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

type CheckedDetail = {
  checked?: boolean;
  indeterminate?: boolean;
};

export interface CheckboxProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onInput'> {
  checked?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  loading?: boolean;
  headless?: boolean;
  invalid?: boolean;
  density?: 'default' | 'compact' | 'comfortable';
  preset?: 'default' | 'admin';
  onCheckedChange?: (checked: boolean, detail: CheckedDetail) => void;
  onChange?: (event: CustomEvent<CheckedDetail>) => void;
  onInput?: (event: CustomEvent<CheckedDetail>) => void;
}

export const Checkbox = React.forwardRef<HTMLElement, CheckboxProps>(function Checkbox(
  {
    checked,
    disabled,
    indeterminate,
    loading,
    headless,
    invalid,
    density,
    preset,
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
    warnIfElementNotRegistered('ui-checkbox', 'Checkbox');
  }, []);

  useElementAttributes(ref, (element) => {
    syncBooleanAttribute(element, 'checked', checked);
    syncBooleanAttribute(element, 'disabled', disabled);
    syncBooleanAttribute(element, 'indeterminate', indeterminate);
    syncBooleanAttribute(element, 'loading', loading);
    syncBooleanAttribute(element, 'headless', headless);
    syncBooleanAttribute(element, 'invalid', invalid);
    syncStringAttribute(element, 'density', density && density !== 'default' ? density : null);
    syncStringAttribute(element, 'preset', preset && preset !== 'default' ? preset : null);
  }, [checked, disabled, indeterminate, loading, headless, invalid, density, preset]);

  const handleInput = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<CheckedDetail>(event) ?? {};
    onInput?.(event as CustomEvent<CheckedDetail>);
    if (typeof detail.checked === 'boolean') {
      onCheckedChange?.(detail.checked, detail);
    }
  }, [onCheckedChange, onInput]);

  const handleChange = React.useCallback((event: Event) => {
    onChange?.(event as CustomEvent<CheckedDetail>);
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
    indeterminate: indeterminate ? '' : undefined,
    loading: loading ? '' : undefined,
    headless: headless ? '' : undefined,
    invalid: invalid ? '' : undefined,
    density: density && density !== 'default' ? density : undefined,
    preset: preset && preset !== 'default' ? preset : undefined,
  };

  return React.createElement('ui-checkbox', hostProps, children);
});

Checkbox.displayName = 'Checkbox';
