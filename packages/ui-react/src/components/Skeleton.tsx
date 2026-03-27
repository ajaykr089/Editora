import React from 'react';
import {
  syncBooleanAttribute,
  syncNumberAttribute,
  syncStringAttribute,
  useElementAttributes,
} from './_internals';

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

  const ref = React.useRef<HTMLElement | null>(null);

  useElementAttributes(ref, (el) => {
    syncNumberAttribute(el, 'count', typeof count === 'number' && Number.isFinite(count) ? count : undefined);
    syncStringAttribute(el, 'width', width ?? null);
    syncStringAttribute(el, 'height', height ?? null);
    syncStringAttribute(el, 'radius', radius ?? null);
    syncStringAttribute(el, 'gap', gap ?? null);
    syncStringAttribute(el, 'duration', duration ?? null);
    syncStringAttribute(el, 'variant', variant ?? null);
    syncStringAttribute(el, 'animation', animation ? animation : null);
    syncStringAttribute(el, 'density', density && density !== 'default' ? density : null);
    syncStringAttribute(el, 'tone', tone && tone !== 'default' ? tone : null);
    syncBooleanAttribute(el, 'animated', animated);
    syncBooleanAttribute(el, 'headless', headless);
  }, [count, width, height, radius, gap, duration, variant, animation, density, tone, animated, headless]);

  return React.createElement('ui-skeleton', { ref, ...rest });
}

export default Skeleton;
