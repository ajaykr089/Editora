import * as React from 'react';
import { warnIfElementNotRegistered } from './_internals';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

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
  const ref = React.useRef<HTMLElement | null>(null);

  React.useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  React.useEffect(() => {
    warnIfElementNotRegistered('ui-aspect-ratio', 'AspectRatio');
  }, []);

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const nextRatio = normalizeRatio(ratio);
    if (nextRatio) element.setAttribute('ratio', nextRatio);
    else element.removeAttribute('ratio');

    if (fit) element.setAttribute('fit', fit);
    else element.removeAttribute('fit');

    if (tone && tone !== 'neutral') element.setAttribute('tone', tone);
    else element.removeAttribute('tone');

    if (variant && variant !== 'surface') element.setAttribute('variant', variant);
    else element.removeAttribute('variant');

    if (size && size !== 'md') element.setAttribute('size', size);
    else element.removeAttribute('size');

    if (radius != null) element.setAttribute('radius', String(radius));
    else element.removeAttribute('radius');

    if (elevation && elevation !== 'none') element.setAttribute('elevation', elevation);
    else element.removeAttribute('elevation');

    if (interactive) element.setAttribute('interactive', '');
    else element.removeAttribute('interactive');

    if (showRatioBadge) element.setAttribute('show-ratio-badge', '');
    else element.removeAttribute('show-ratio-badge');

    if (headless) element.setAttribute('headless', '');
    else element.removeAttribute('headless');
  }, [ratio, fit, tone, variant, size, radius, elevation, interactive, showRatioBadge, headless]);

  return React.createElement('ui-aspect-ratio', { ref, ...rest }, children);
});

AspectRatio.displayName = 'AspectRatio';

export default AspectRatio;
