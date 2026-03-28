import React from 'react';
import {
  getCustomEventDetail,
  syncBooleanAttribute,
  syncStringAttribute,
  useElementAttributes,
  useElementEventListeners,
  useForwardedHostRef,
} from './_internals';

type BaseProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onInput'> & {
  children?: React.ReactNode;
};

export type SelectOptionProps = React.OptionHTMLAttributes<HTMLOptionElement>;
export type SelectOptGroupProps = React.OptgroupHTMLAttributes<HTMLOptGroupElement>;
export type SelectLabelProps = React.HTMLAttributes<HTMLElement>;
export type SelectDescriptionProps = React.HTMLAttributes<HTMLElement>;
export type SelectErrorProps = React.HTMLAttributes<HTMLElement>;
export type SelectLeadingProps = React.HTMLAttributes<HTMLElement>;
export type SelectTrailingProps = React.HTMLAttributes<HTMLElement>;

export type SelectProps = BaseProps & {
  value?: string;
  disabled?: boolean;
  loading?: boolean;
  required?: boolean;
  invalid?: boolean;
  headless?: boolean;
  placeholder?: string;
  name?: string;
  label?: string;
  description?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg' | '1' | '2' | '3';
  variant?:
    | 'classic'
    | 'surface'
    | 'soft'
    | 'filled'
    | 'outline'
    | 'line'
    | 'minimal'
    | 'ghost'
    | 'solid'
    | 'glass'
    | 'contrast';
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger';
  density?: 'default' | 'compact' | 'comfortable';
  shape?: 'rounded' | 'square' | 'pill';
  elevation?: 'low' | 'none' | 'high';
  radius?: 'none' | 'large' | 'full' | number | string;
  optionBorder?: boolean;
  showCheck?: boolean;
  checkPlacement?: 'start' | 'end';
  validation?: 'none' | 'success' | 'warning' | 'error';
  onChange?: (value: string) => void;
  onInput?: (value: string) => void;
  onValueChange?: (value: string) => void;
};

const SelectRoot = React.forwardRef<HTMLElement, SelectProps>(function Select(
  {
    children,
    value,
    disabled,
    loading,
    required,
    invalid,
    headless,
    placeholder,
    name,
    label,
    description,
    error,
    size,
    variant,
    tone,
    density,
    shape,
    elevation,
    radius,
    optionBorder,
    showCheck,
    checkPlacement,
    validation,
    onChange,
    onInput,
    onValueChange,
    ...rest
  },
  forwardedRef
) {
  const ref = useForwardedHostRef<HTMLElement>(forwardedRef);

  const resolveValue = React.useCallback((event: Event) => {
    return (
      getCustomEventDetail<{ value?: string }>(event)?.value ??
      ((event.target as HTMLSelectElement | null)?.value ?? '')
    );
  }, []);

  const inputHandler = React.useCallback((event: Event) => {
    onInput?.(resolveValue(event));
  }, [onInput, resolveValue]);

  const changeHandler = React.useCallback((event: Event) => {
    const next = resolveValue(event);
    onChange?.(next);
    onValueChange?.(next);
  }, [onChange, onValueChange, resolveValue]);

  useElementEventListeners(
    ref,
    [
      { type: 'input', listener: inputHandler },
      { type: 'change', listener: changeHandler },
    ],
    [inputHandler, changeHandler]
  );

  useElementAttributes(ref, (el) => {
    syncStringAttribute(el, 'value', value != null ? String(value) : null);
    syncBooleanAttribute(el, 'disabled', disabled);
    syncBooleanAttribute(el, 'loading', loading);
    syncBooleanAttribute(el, 'required', required);
    syncBooleanAttribute(el, 'headless', headless);
    syncBooleanAttribute(el, 'invalid', invalid);
    syncStringAttribute(el, 'placeholder', placeholder ? placeholder : null);
    syncStringAttribute(el, 'name', name ? name : null);
    syncStringAttribute(el, 'label', label ? label : null);
    syncStringAttribute(el, 'description', description ? description : null);
    syncStringAttribute(el, 'error', error ? error : null);
    syncStringAttribute(el, 'size', size && size !== 'md' && size !== '2' ? size : null);
    syncStringAttribute(el, 'variant', variant && variant !== 'classic' ? variant : null);
    syncStringAttribute(el, 'tone', tone && tone !== 'default' ? tone : null);
    syncStringAttribute(el, 'density', density && density !== 'default' ? density : null);
    syncStringAttribute(el, 'shape', shape && shape !== 'rounded' ? shape : null);
    syncStringAttribute(el, 'elevation', elevation && elevation !== 'low' ? elevation : null);
    syncStringAttribute(el, 'radius', radius ? String(radius) : null);
    syncBooleanAttribute(el, 'option-border', optionBorder);
    syncBooleanAttribute(el, 'show-check', showCheck);
    syncStringAttribute(el, 'check-placement', showCheck ? checkPlacement || 'end' : null);
    syncStringAttribute(el, 'validation', validation && validation !== 'none' ? validation : null);
  }, [
    value,
    disabled,
    loading,
    required,
    invalid,
    headless,
    placeholder,
    name,
    label,
    description,
    error,
    size,
    variant,
    tone,
    density,
    shape,
    elevation,
    radius,
    optionBorder,
    showCheck,
    checkPlacement,
    validation
  ]);

  return React.createElement('ui-select', { ref, ...rest }, children);
});

SelectRoot.displayName = 'Select';

/** Select.Option - Renders a native `<option>` inside the select */
const SelectOption = React.forwardRef<HTMLOptionElement, SelectOptionProps>(
  function SelectOption(props, ref) {
    return <option ref={ref} {...props} />;
  }
);
SelectOption.displayName = 'Select.Option';

/** Select.OptGroup - Renders a native `<optgroup>` inside the select */
const SelectOptGroup = React.forwardRef<HTMLOptGroupElement, SelectOptGroupProps>(
  function SelectOptGroup(props, ref) {
    return <optgroup ref={ref} {...props} />;
  }
);
SelectOptGroup.displayName = 'Select.OptGroup';

/** Select.Label - Renders content in the `label` slot */
const SelectLabel = React.forwardRef<HTMLElement, SelectLabelProps>(
  function SelectLabel({ children, ...props }, ref) {
    return React.createElement('span', { ref, slot: 'label', ...props }, children);
  }
);
SelectLabel.displayName = 'Select.Label';

/** Select.Description - Renders content in the `description` slot */
const SelectDescription = React.forwardRef<HTMLElement, SelectDescriptionProps>(
  function SelectDescription({ children, ...props }, ref) {
    return React.createElement('span', { ref, slot: 'description', ...props }, children);
  }
);
SelectDescription.displayName = 'Select.Description';

/** Select.Error - Renders content in the `error` slot */
const SelectError = React.forwardRef<HTMLElement, SelectErrorProps>(
  function SelectError({ children, ...props }, ref) {
    return React.createElement('span', { ref, slot: 'error', ...props }, children);
  }
);
SelectError.displayName = 'Select.Error';

/** Select.Leading - Renders content in the `leading` slot (left side of trigger) */
const SelectLeading = React.forwardRef<HTMLElement, SelectLeadingProps>(
  function SelectLeading({ children, ...props }, ref) {
    return React.createElement('span', { ref, slot: 'leading', ...props }, children);
  }
);
SelectLeading.displayName = 'Select.Leading';

/** Select.Trailing - Renders content in the `trailing` slot (right side of trigger) */
const SelectTrailing = React.forwardRef<HTMLElement, SelectTrailingProps>(
  function SelectTrailing({ children, ...props }, ref) {
    return React.createElement('span', { ref, slot: 'trailing', ...props }, children);
  }
);
SelectTrailing.displayName = 'Select.Trailing';

export const Select = Object.assign(SelectRoot, {
  Option: SelectOption,
  OptGroup: SelectOptGroup,
  Label: SelectLabel,
  Description: SelectDescription,
  Error: SelectError,
  Leading: SelectLeading,
  Trailing: SelectTrailing,
});

export default Select;
