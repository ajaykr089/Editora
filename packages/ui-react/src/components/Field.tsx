import React, { useEffect, useRef } from 'react';

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

  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (label != null && label !== '') el.setAttribute('label', label);
    else el.removeAttribute('label');

    if (description != null && description !== '') el.setAttribute('description', description);
    else el.removeAttribute('description');

    if (error != null && error !== '') el.setAttribute('error', error);
    else el.removeAttribute('error');

    if (htmlFor) el.setAttribute('for', htmlFor);
    else el.removeAttribute('for');

    if (required) el.setAttribute('required', '');
    else el.removeAttribute('required');

    if (invalid) el.setAttribute('invalid', '');
    else el.removeAttribute('invalid');

    if (orientation && orientation !== 'vertical') el.setAttribute('orientation', orientation);
    else el.removeAttribute('orientation');

    if (variant && variant !== 'default') el.setAttribute('variant', variant);
    else el.removeAttribute('variant');

    if (tone && tone !== 'default') el.setAttribute('tone', tone);
    else el.removeAttribute('tone');

    if (density && density !== 'default') el.setAttribute('density', density);
    else el.removeAttribute('density');

    if (shape && shape !== 'default') el.setAttribute('shape', shape);
    else el.removeAttribute('shape');

    if (shell && shell !== 'none') el.setAttribute('shell', shell);
    else el.removeAttribute('shell');

    if (labelWidth) el.setAttribute('label-width', labelWidth);
    else el.removeAttribute('label-width');

    if (headless) el.setAttribute('headless', '');
    else el.removeAttribute('headless');
  }, [
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
    headless
  ]);

  return React.createElement('ui-field', { ref, ...rest }, children);
}

export default Field;
