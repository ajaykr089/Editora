import React from 'react';

export type FieldProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
  label?: string;
  description?: string;
  error?: string;
  htmlFor?: string;
  required?: boolean;
  invalid?: boolean;
  orientation?: 'vertical' | 'horizontal';
  variant?: 'default' | 'surface' | 'outline' | 'soft' | 'contrast' | 'minimal' | 'elevated';
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger';
  density?: 'default' | 'compact' | 'comfortable';
  shape?: 'default' | 'square' | 'soft';
  shell?: 'none' | 'outline' | 'filled' | 'soft' | 'line';
  labelWidth?: string;
  headless?: boolean;
};

export function Field(props: FieldProps) {
  const {
    children,
    label,
    description,
    error,
    htmlFor,
    required,
    invalid,
    orientation,
    variant,
    tone,
    density,
    shape,
    shell,
    labelWidth,
    headless,
    ...rest
  } = props;

  const hostProps: Record<string, unknown> = {
    ...rest,
    label: label != null && label !== '' ? label : undefined,
    description: description != null && description !== '' ? description : undefined,
    error: error != null && error !== '' ? error : undefined,
    for: htmlFor || undefined,
    required: required ? '' : undefined,
    invalid: invalid ? '' : undefined,
    orientation: orientation && orientation !== 'vertical' ? orientation : undefined,
    variant: variant && variant !== 'default' ? variant : undefined,
    tone: tone && tone !== 'default' ? tone : undefined,
    density: density && density !== 'default' ? density : undefined,
    shape: shape && shape !== 'default' ? shape : undefined,
    shell: shell && shell !== 'none' ? shell : undefined,
    'label-width': labelWidth || undefined,
    headless: headless ? '' : undefined,
  };

  return React.createElement('ui-field', hostProps, children);
}

export default Field;
