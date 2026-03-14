import React, { useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type DescriptionProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
  htmlFor?: string;
  for?: string;
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg' | '1' | '2' | '3';
  variant?: 'default' | 'soft' | 'surface';
};

export const Description = React.forwardRef<HTMLElement, DescriptionProps>(function Description(
  { children, htmlFor, for: forProp, tone, size, variant, hidden, ...rest },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);
  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targetFor = htmlFor || forProp;
    if (targetFor) el.setAttribute('for', targetFor);
    else el.removeAttribute('for');
    if (tone && tone !== 'default') el.setAttribute('tone', tone);
    else el.removeAttribute('tone');
    if (size && size !== 'md' && size !== '2') el.setAttribute('size', size);
    else el.removeAttribute('size');
    if (variant && variant !== 'default') el.setAttribute('variant', variant);
    else el.removeAttribute('variant');
    if (hidden) el.setAttribute('hidden', '');
    else el.removeAttribute('hidden');
  }, [htmlFor, forProp, tone, size, variant, hidden]);

  return React.createElement('ui-description', { ref, ...rest }, children);
});

Description.displayName = 'Description';

export type FieldErrorProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
  htmlFor?: string;
  for?: string;
  active?: boolean;
  size?: 'sm' | 'md' | 'lg' | '1' | '2' | '3';
  variant?: 'default' | 'soft';
};

export const FieldError = React.forwardRef<HTMLElement, FieldErrorProps>(function FieldError(
  { children, htmlFor, for: forProp, active, size, variant, hidden, ...rest },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);
  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targetFor = htmlFor || forProp;
    if (targetFor) el.setAttribute('for', targetFor);
    else el.removeAttribute('for');
    if (active) el.setAttribute('active', '');
    else el.removeAttribute('active');
    if (size && size !== 'md' && size !== '2') el.setAttribute('size', size);
    else el.removeAttribute('size');
    if (variant && variant !== 'default') el.setAttribute('variant', variant);
    else el.removeAttribute('variant');
    if (hidden) el.setAttribute('hidden', '');
    else el.removeAttribute('hidden');
  }, [htmlFor, forProp, active, size, variant, hidden]);

  return React.createElement('ui-field-error', { ref, ...rest }, children);
});

FieldError.displayName = 'FieldError';

export type ControlGroupProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
  label?: string;
  orientation?: 'vertical' | 'horizontal';
  variant?: 'default' | 'soft' | 'surface';
  density?: 'default' | 'compact' | 'comfortable';
};

export const ControlGroup = React.forwardRef<HTMLElement, ControlGroupProps>(function ControlGroup(
  { children, label, orientation, variant, density, hidden, ...rest },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);
  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (label) el.setAttribute('label', label);
    else el.removeAttribute('label');
    if (orientation && orientation !== 'vertical') el.setAttribute('orientation', orientation);
    else el.removeAttribute('orientation');
    if (variant && variant !== 'default') el.setAttribute('variant', variant);
    else el.removeAttribute('variant');
    if (density && density !== 'default') el.setAttribute('density', density);
    else el.removeAttribute('density');
    if (hidden) el.setAttribute('hidden', '');
    else el.removeAttribute('hidden');
  }, [label, orientation, variant, density, hidden]);

  return React.createElement('ui-control-group', { ref, ...rest }, children);
});

ControlGroup.displayName = 'ControlGroup';

export type FieldsetProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
  legend?: string;
  description?: string;
  error?: string;
  required?: boolean;
  invalid?: boolean;
  orientation?: 'vertical' | 'horizontal';
  variant?: 'default' | 'surface' | 'outline' | 'soft' | 'contrast';
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger';
  density?: 'default' | 'compact' | 'comfortable';
  shape?: 'default' | 'square' | 'soft';
  headless?: boolean;
};

export const Fieldset = React.forwardRef<HTMLElement, FieldsetProps>(function Fieldset(
  {
    children,
    legend,
    description,
    error,
    required,
    invalid,
    orientation,
    variant,
    tone,
    density,
    shape,
    headless,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);
  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (legend != null && legend !== '') el.setAttribute('legend', legend);
    else el.removeAttribute('legend');
    if (description != null && description !== '') el.setAttribute('description', description);
    else el.removeAttribute('description');
    if (error != null && error !== '') el.setAttribute('error', error);
    else el.removeAttribute('error');
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
    if (headless) el.setAttribute('headless', '');
    else el.removeAttribute('headless');
  }, [legend, description, error, required, invalid, orientation, variant, tone, density, shape, headless]);

  return React.createElement('ui-fieldset', { ref, ...rest }, children);
});

Fieldset.displayName = 'Fieldset';

export default Fieldset;
