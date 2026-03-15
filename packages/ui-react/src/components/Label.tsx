import React, { useEffect, useLayoutEffect, useImperativeHandle, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type LabelTextProps = React.HTMLAttributes<HTMLElement>;
export type LabelDescriptionProps = React.HTMLAttributes<HTMLElement>;

export type LabelProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
  htmlFor?: string;
  for?: string;
  required?: boolean;
  description?: string;
  variant?: 'default' | 'surface' | 'soft' | 'contrast' | 'minimal' | 'elevated';
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg' | '1' | '2' | '3';
  density?: 'default' | 'compact' | 'comfortable';
  shape?: 'default' | 'square' | 'soft';
  disabled?: boolean;
  headless?: boolean;
};

const LabelRoot = React.forwardRef<HTMLElement, LabelProps>(function Label(
  {
    children,
    htmlFor,
    for: forProp,
    required,
    description,
    variant,
    tone,
    size,
    density,
    shape,
    disabled,
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

    const targetFor = htmlFor || forProp;
    if (targetFor) el.setAttribute('for', targetFor);
    else el.removeAttribute('for');

    if (required) el.setAttribute('required', '');
    else el.removeAttribute('required');

    if (description) el.setAttribute('description', description);
    else el.removeAttribute('description');

    if (variant && variant !== 'default') el.setAttribute('variant', variant);
    else el.removeAttribute('variant');

    if (tone && tone !== 'default') el.setAttribute('tone', tone);
    else el.removeAttribute('tone');

    if (size && size !== 'md' && size !== '2') el.setAttribute('size', size);
    else el.removeAttribute('size');

    if (density && density !== 'default') el.setAttribute('density', density);
    else el.removeAttribute('density');

    if (shape && shape !== 'default') el.setAttribute('shape', shape);
    else el.removeAttribute('shape');

    if (disabled) el.setAttribute('disabled', '');
    else el.removeAttribute('disabled');

    if (headless) el.setAttribute('headless', '');
    else el.removeAttribute('headless');
  }, [htmlFor, forProp, required, description, variant, tone, size, density, shape, disabled, headless]);

  return React.createElement('ui-label', { ref, ...rest }, children);
});

LabelRoot.displayName = 'Label';

const LabelText = React.forwardRef<HTMLElement, LabelTextProps>(
  function LabelText({ ...props }, ref) {
    return React.createElement('span', { ref, ...props });
  }
);
LabelText.displayName = 'Label.Text';

const LabelDescription = React.forwardRef<HTMLElement, LabelDescriptionProps>(
  function LabelDescription({ ...props }, ref) {
    return React.createElement('span', { ref, slot: 'description', ...props });
  }
);
LabelDescription.displayName = 'Label.Description';

export const Label = Object.assign(LabelRoot, {
  Text: LabelText,
  Description: LabelDescription,
});

export default Label;
