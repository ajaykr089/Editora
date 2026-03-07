import React, { useEffect, useLayoutEffect, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type SkeletonProps = React.HTMLAttributes<HTMLElement> & {
  count?: number;
  width?: string;
  height?: string;
  radius?: string;
  gap?: string;
  duration?: string;
  variant?: 'rect' | 'text' | 'circle' | 'pill' | 'avatar' | 'badge' | 'button';
  animation?: 'none' | 'shimmer' | 'pulse' | 'wave';
  density?: 'default' | 'compact' | 'comfortable';
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger';
  animated?: boolean;
  headless?: boolean;
};

export function Skeleton(props: SkeletonProps) {
  const {
    count,
    width,
    height,
    radius,
    gap,
    duration,
    variant,
    animation,
    density,
    tone,
    animated,
    headless,
    ...rest
  } = props;

  const ref = useRef<HTMLElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof count === 'number' && Number.isFinite(count)) el.setAttribute('count', String(count));
    else el.removeAttribute('count');

    if (width) el.setAttribute('width', width);
    else el.removeAttribute('width');

    if (height) el.setAttribute('height', height);
    else el.removeAttribute('height');

    if (radius) el.setAttribute('radius', radius);
    else el.removeAttribute('radius');

    if (gap) el.setAttribute('gap', gap);
    else el.removeAttribute('gap');

    if (duration) el.setAttribute('duration', duration);
    else el.removeAttribute('duration');

    if (variant) el.setAttribute('variant', variant);
    else el.removeAttribute('variant');

    if (animation && animation !== 'none') el.setAttribute('animation', animation);
    else if (animation === 'none') el.setAttribute('animation', 'none');
    else el.removeAttribute('animation');

    if (density && density !== 'default') el.setAttribute('density', density);
    else el.removeAttribute('density');

    if (tone && tone !== 'default') el.setAttribute('tone', tone);
    else el.removeAttribute('tone');

    if (animated) el.setAttribute('animated', '');
    else el.removeAttribute('animated');

    if (headless) el.setAttribute('headless', '');
    else el.removeAttribute('headless');
  }, [count, width, height, radius, gap, duration, variant, animation, density, tone, animated, headless]);

  return React.createElement('ui-skeleton', { ref, ...rest });
}

export default Skeleton;
