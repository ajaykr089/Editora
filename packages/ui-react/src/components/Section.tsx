import React from 'react';

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'surface' | 'muted' | 'outline' | 'elevated' | 'contrast' | 'gradient';
  tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  density?: 'compact' | 'comfortable';
  inset?: boolean;
};

export const Section = React.forwardRef<HTMLElement, SectionProps>(function Section(
  {
    size = 'medium',
    variant = 'default',
    tone = 'neutral',
    radius = 'md',
    density = 'comfortable',
    inset,
    children,
    ...rest
  },
  forwardedRef
) {
  const hostProps: Record<string, unknown> = {
    ref: forwardedRef,
    ...rest,
    size: size !== 'medium' ? size : undefined,
    variant: variant !== 'default' ? variant : undefined,
    tone: tone !== 'neutral' ? tone : undefined,
    radius: radius !== 'md' ? radius : undefined,
    density: density !== 'comfortable' ? density : undefined,
    inset: inset ? '' : undefined,
  };

  return React.createElement('ui-section', hostProps, children);
});

Section.displayName = 'Section';

export default Section;
