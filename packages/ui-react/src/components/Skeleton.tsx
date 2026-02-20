import React, { useEffect, useRef } from 'react';

export type SkeletonProps = React.HTMLAttributes<HTMLElement> & {
  count?: number;
  width?: string;
  height?: string;
  radius?: string;
  gap?: string;
  variant?: 'rect' | 'text' | 'circle';
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
    variant,
    animated,
    headless,
    ...rest
  } = props;

  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
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

    if (variant) el.setAttribute('variant', variant);
    else el.removeAttribute('variant');

    if (animated) el.setAttribute('animated', '');
    else el.removeAttribute('animated');

    if (headless) el.setAttribute('headless', '');
    else el.removeAttribute('headless');
  }, [count, width, height, radius, gap, variant, animated, headless]);

  return React.createElement('ui-skeleton', { ref, ...rest });
}

export default Skeleton;
