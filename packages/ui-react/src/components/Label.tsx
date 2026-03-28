import React from 'react';

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
  const targetFor = htmlFor || forProp;
  const hostProps: Record<string, unknown> = {
    ref: forwardedRef,
    ...rest,
    for: targetFor || undefined,
    required: required ? '' : undefined,
    description: description || undefined,
    variant: variant && variant !== 'default' ? variant : undefined,
    tone: tone && tone !== 'default' ? tone : undefined,
    size: size && size !== 'md' && size !== '2' ? size : undefined,
    density: density && density !== 'default' ? density : undefined,
    shape: shape && shape !== 'default' ? shape : undefined,
    disabled: disabled ? '' : undefined,
    headless: headless ? '' : undefined,
  };

  return React.createElement('ui-label', hostProps, children);
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
