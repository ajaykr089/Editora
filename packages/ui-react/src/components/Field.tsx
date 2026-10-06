import React from 'react';

import '@editora/ui-core/field';
import { createUIElement } from './_internals';

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

export const Field = React.forwardRef<HTMLElement, FieldProps>(function Field(props, forwardedRef) {
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
    ref: forwardedRef,
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

  return createUIElement('ui-field', hostProps, children);
});

Field.displayName = 'Field';

export default Field;
