import React, { useEffect, useLayoutEffect, useImperativeHandle, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

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
  const ref = useRef<HTMLElement | null>(null);
  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const resolveValue = (event: Event) =>
      (event as CustomEvent<{ value?: string }>).detail?.value ??
      ((event.target as HTMLSelectElement | null)?.value ?? '');

    const inputHandler = (event: Event) => {
      onInput?.(resolveValue(event));
    };

    const changeHandler = (event: Event) => {
      const next = resolveValue(event);
      onChange?.(next);
      onValueChange?.(next);
    };

    el.addEventListener('input', inputHandler as EventListener);
    el.addEventListener('change', changeHandler as EventListener);
    return () => {
      el.removeEventListener('input', inputHandler as EventListener);
      el.removeEventListener('change', changeHandler as EventListener);
    };
  }, [onChange, onInput, onValueChange]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const syncAttr = (attr: string, next: string | null) => {
      const current = el.getAttribute(attr);
      if (next == null) {
        if (current != null) el.removeAttribute(attr);
        return;
      }
      if (current !== next) el.setAttribute(attr, next);
    };

    const syncBoolean = (attr: string, enabled: boolean | undefined) => {
      if (enabled) {
        if (!el.hasAttribute(attr)) el.setAttribute(attr, '');
      } else if (el.hasAttribute(attr)) {
        el.removeAttribute(attr);
      }
    };

    syncAttr('value', value != null ? String(value) : null);
    syncBoolean('disabled', disabled);
    syncBoolean('loading', loading);
    syncBoolean('required', required);
    syncBoolean('headless', headless);
    syncBoolean('invalid', invalid);

    syncAttr('placeholder', placeholder ? placeholder : null);
    syncAttr('name', name ? name : null);
    syncAttr('label', label ? label : null);
    syncAttr('description', description ? description : null);
    syncAttr('error', error ? error : null);

    syncAttr('size', size && size !== 'md' && size !== '2' ? size : null);
    syncAttr('variant', variant && variant !== 'classic' ? variant : null);
    syncAttr('tone', tone && tone !== 'default' ? tone : null);
    syncAttr('density', density && density !== 'default' ? density : null);
    syncAttr('shape', shape && shape !== 'rounded' ? shape : null);
    syncAttr('elevation', elevation && elevation !== 'low' ? elevation : null);
    syncAttr('radius', radius ? String(radius) : null);
    syncBoolean('option-border', optionBorder);
    syncBoolean('show-check', showCheck);
    syncAttr('check-placement', showCheck ? checkPlacement || 'end' : null);
    syncAttr('validation', validation && validation !== 'none' ? validation : null);
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
