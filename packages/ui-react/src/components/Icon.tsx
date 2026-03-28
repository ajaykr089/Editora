import React from 'react';

export type IconProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
  name?: string;
  iconVariant?: 'outline' | 'solid' | 'duotone';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string | number;
  color?: string;
  secondaryColor?: string;
  variant?: 'default' | 'surface' | 'soft' | 'contrast' | 'minimal' | 'elevated';
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger';
  shape?: 'default' | 'square' | 'soft';
  spin?: boolean;
  pulse?: boolean;
  badge?: boolean;
  label?: string;
  decorative?: boolean;
  strokeWidth?: number | string;
  absoluteStrokeWidth?: boolean;
  strokeLinecap?: 'butt' | 'round' | 'square';
  strokeLinejoin?: 'miter' | 'round' | 'bevel';
  rotate?: number;
  flip?: 'horizontal' | 'vertical' | 'both';
  rtl?: boolean;
};

export const Icon = React.forwardRef<HTMLElement, IconProps>(function Icon(
  {
    children,
    name,
    iconVariant,
    size,
    color,
    secondaryColor,
    variant,
    tone,
    shape,
    spin,
    pulse,
    badge,
    label,
    decorative,
    strokeWidth,
    absoluteStrokeWidth,
    strokeLinecap,
    strokeLinejoin,
    rotate,
    flip,
    rtl,
    ...rest
  },
  forwardedRef
) {
  const hostProps: Record<string, unknown> = {
    ref: forwardedRef,
    ...rest,
    name: name || undefined,
    'icon-variant': iconVariant || undefined,
    size: size != null && size !== '' ? String(size) : undefined,
    color: color || undefined,
    'secondary-color': secondaryColor || undefined,
    variant: variant && variant !== 'default' ? variant : undefined,
    tone: tone && tone !== 'default' ? tone : undefined,
    shape: shape && shape !== 'default' ? shape : undefined,
    spin: spin ? '' : undefined,
    pulse: pulse ? '' : undefined,
    badge: badge ? '' : undefined,
    label: label || undefined,
    decorative: decorative ? '' : undefined,
    'stroke-width': strokeWidth != null && strokeWidth !== '' ? String(strokeWidth) : undefined,
    'absolute-stroke-width': absoluteStrokeWidth ? '' : undefined,
    'stroke-linecap': strokeLinecap || undefined,
    'stroke-linejoin': strokeLinejoin || undefined,
    rotate: typeof rotate === 'number' && Number.isFinite(rotate) ? rotate : undefined,
    flip: flip || undefined,
    rtl: rtl ? '' : undefined,
  };

  return React.createElement('ui-icon', hostProps, children);
});

Icon.displayName = 'Icon';

export default Icon;
