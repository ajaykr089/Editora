import React from 'react';
import { warnIfElementNotRegistered } from './_internals';

export type MarqueeDirection = 'left' | 'right' | 'up' | 'down';
export type MarqueeVariant = 'default' | 'surface' | 'soft' | 'solid' | 'glass' | 'contrast' | 'minimal';
export type MarqueeTone = 'brand' | 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type MarqueeSize = 'sm' | 'md' | 'lg' | '1' | '2' | '3';
export type MarqueeElevation = 'none' | 'low' | 'high';
export type MarqueeElement = HTMLElement & {
  pause(): void;
  play(): void;
  refresh(): void;
};

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

export type MarqueeProps = React.HTMLAttributes<MarqueeElement> & {
  direction?: MarqueeDirection;
  speed?: number | string;
  gap?: number | string;
  paused?: boolean;
  pauseOnHover?: boolean;
  pauseOnFocus?: boolean;
  fade?: boolean;
  fadeSize?: number | string;
  variant?: MarqueeVariant;
  tone?: MarqueeTone;
  size?: MarqueeSize;
  radius?: number | string;
  elevation?: MarqueeElevation;
  padding?: number | string;
  children?: React.ReactNode;
};

export interface MarqueeItemProps extends React.HTMLAttributes<HTMLElement> {
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
}

function normalizeLength(value: number | string | undefined): string | null {
  if (value == null || value === '') return null;
  if (typeof value === 'number') return `${value}px`;
  if (/^-?\d+(\.\d+)?$/.test(value)) return `${value}px`;
  return value;
}

const MarqueeRoot = React.forwardRef<MarqueeElement, MarqueeProps>(function Marquee(
  {
    direction,
    speed,
    gap,
    paused,
    pauseOnHover,
    pauseOnFocus,
    fade,
    fadeSize,
    variant,
    tone,
    size,
    radius,
    elevation,
    padding,
    children,
    ...rest
  },
  forwardedRef
) {
  const ref = React.useRef<MarqueeElement | null>(null);
  React.useImperativeHandle(forwardedRef, () => ref.current as MarqueeElement);

  React.useEffect(() => {
    warnIfElementNotRegistered('ui-marquee', 'Marquee');
  }, []);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const syncAttr = (name: string, next: string | null) => {
      const current = el.getAttribute(name);
      if (next == null) {
        if (current != null) el.removeAttribute(name);
        return;
      }
      if (current !== next) el.setAttribute(name, next);
    };

    const syncBooleanAttr = (name: string, enabled: boolean | undefined) => {
      if (enabled) {
        if (!el.hasAttribute(name)) el.setAttribute(name, '');
      } else if (el.hasAttribute(name)) {
        el.removeAttribute(name);
      }
    };

    syncAttr('direction', direction && direction !== 'left' ? direction : null);
    syncAttr('speed', speed != null ? String(speed) : null);
    syncAttr('gap', normalizeLength(gap));
    syncBooleanAttr('paused', paused);
    syncBooleanAttr('pause-on-hover', pauseOnHover);
    syncBooleanAttr('pause-on-focus', pauseOnFocus);
    syncBooleanAttr('fade', fade);
    syncAttr('fade-size', normalizeLength(fadeSize));
    syncAttr('variant', variant && variant !== 'default' && variant !== 'surface' ? variant : null);
    syncAttr('tone', tone && tone !== 'brand' ? tone : null);
    syncAttr('size', size && size !== 'md' && size !== '2' ? size : null);
    syncAttr('radius', radius == null || radius === '' ? null : String(radius));
    syncAttr('elevation', elevation && elevation !== 'low' ? elevation : null);
    syncAttr('padding', normalizeLength(padding));
  }, [
    direction,
    speed,
    gap,
    paused,
    pauseOnHover,
    pauseOnFocus,
    fade,
    fadeSize,
    variant,
    tone,
    size,
    radius,
    elevation,
    padding,
  ]);

  return React.createElement('ui-marquee', { ref, ...rest }, children);
});

MarqueeRoot.displayName = 'Marquee';

const MarqueeItem = React.forwardRef<HTMLElement, MarqueeItemProps>(function MarqueeItem(
  { as, children, ...rest },
  forwardedRef
) {
  const Tag = (as || 'div') as keyof JSX.IntrinsicElements;
  return React.createElement(Tag, { ref: forwardedRef, 'data-ui-marquee-item': '', ...rest }, children);
});

MarqueeItem.displayName = 'Marquee.Item';

export const Marquee = Object.assign(MarqueeRoot, {
  Item: MarqueeItem,
});

export default Marquee;
