import * as React from 'react';

export interface AspectRatioProps extends React.HTMLAttributes<HTMLElement> {
  ratio?: number | string;
  fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
  variant?: 'surface' | 'soft' | 'outline' | 'solid';
  size?: 'sm' | 'md' | 'lg' | '1' | '2' | '3';
  radius?: number | string;
  elevation?: 'none' | 'low' | 'high';
  interactive?: boolean;
  showRatioBadge?: boolean;
  headless?: boolean;
}

function normalizeRatio(value: number | string | undefined): string | undefined {
  if (value == null) return undefined;
  if (typeof value === 'string') return value;
  if (!Number.isFinite(value) || value <= 0) return undefined;

  if (Math.abs(value - 16 / 9) < 0.01) return '16/9';
  if (Math.abs(value - 4 / 3) < 0.01) return '4/3';
  if (Math.abs(value - 1) < 0.01) return '1/1';
  return `${value}/1`;
}

export const AspectRatio = React.forwardRef<HTMLElement, AspectRatioProps>(function AspectRatio(
  { ratio, fit, tone, variant, size, radius, elevation, interactive, showRatioBadge, headless, children, ...rest },
  forwardedRef
) {
  const hostProps: Record<string, unknown> = {
    ref: forwardedRef,
    ...rest,
    ratio: normalizeRatio(ratio),
    fit: fit || undefined,
    tone: tone && tone !== 'neutral' ? tone : undefined,
    variant: variant && variant !== 'surface' ? variant : undefined,
    size: size && size !== 'md' ? size : undefined,
    radius: radius != null ? String(radius) : undefined,
    elevation: elevation && elevation !== 'none' ? elevation : undefined,
    interactive: interactive ? '' : undefined,
    'show-ratio-badge': showRatioBadge ? '' : undefined,
    headless: headless ? '' : undefined,
  };

  return React.createElement('ui-aspect-ratio', hostProps, children);
});

AspectRatio.displayName = 'AspectRatio';

export default AspectRatio;
