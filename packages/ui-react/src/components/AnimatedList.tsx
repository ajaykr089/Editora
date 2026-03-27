import React from 'react';
import { warnIfElementNotRegistered } from './_internals';

export type AnimatedListEffect =
  | 'fade-up'
  | 'fade-down'
  | 'slide-left'
  | 'slide-right'
  | 'scale-in'
  | 'blur-in'
  | 'pop'
  | 'flip-in'
  | 'rotate-in'
  | 'tilt-in'
  | 'float-up'
  | 'swing-in';

export type AnimatedListTrigger = 'load' | 'visible' | 'manual';
export type AnimatedListAnimation = 'calm' | 'smooth' | 'snappy' | 'bouncy';
export type AnimatedListVariant = 'default' | 'surface' | 'soft' | 'solid' | 'glass' | 'contrast' | 'minimal';
export type AnimatedListTone = 'brand' | 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type AnimatedListSize = 'sm' | 'md' | 'lg' | '1' | '2' | '3';
export type AnimatedListElevation = 'none' | 'low' | 'high';

export type AnimatedListElement = HTMLElement & {
  pause(): void;
  play(): void;
  replay(): void;
  refresh(): void;
};

export type AnimatedListProps = React.HTMLAttributes<AnimatedListElement> & {
  effect?: AnimatedListEffect;
  animation?: AnimatedListAnimation;
  trigger?: AnimatedListTrigger;
  duration?: number | string;
  stagger?: number | string;
  delay?: number | string;
  loop?: boolean;
  loopDelay?: number | string;
  paused?: boolean;
  threshold?: number | string;
  variant?: AnimatedListVariant;
  tone?: AnimatedListTone;
  size?: AnimatedListSize;
  radius?: number | string;
  elevation?: AnimatedListElevation;
  padding?: number | string;
  gap?: number | string;
  children?: React.ReactNode;
};

export interface AnimatedListItemProps extends React.HTMLAttributes<HTMLElement> {
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
}

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

function normalizeLength(value: number | string | undefined): string | null {
  if (value == null || value === '') return null;
  if (typeof value === 'number') return `${value}px`;
  const parts = value.split(/\s+/).filter(Boolean);
  if (!parts.length) return null;
  return parts.map((part) => (/^-?\d+(\.\d+)?$/.test(part) ? `${part}px` : part)).join(' ');
}

function normalizeTime(value: number | string | undefined): string | null {
  if (value == null || value === '') return null;
  if (typeof value === 'number') return `${value}ms`;
  if (/^-?\d+(\.\d+)?$/.test(value)) return `${value}ms`;
  return value;
}

const AnimatedListRoot = React.forwardRef<AnimatedListElement, AnimatedListProps>(function AnimatedList(
  {
    effect,
    animation,
    trigger,
    duration,
    stagger,
    delay,
    loop,
    loopDelay,
    paused,
    threshold,
    variant,
    tone,
    size,
    radius,
    elevation,
    padding,
    gap,
    children,
    ...rest
  },
  forwardedRef
) {
  const ref = React.useRef<AnimatedListElement | null>(null);
  React.useImperativeHandle(forwardedRef, () => ref.current as AnimatedListElement);

  React.useEffect(() => {
    warnIfElementNotRegistered('ui-animated-list', 'AnimatedList');
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

    syncAttr('effect', effect && effect !== 'fade-up' ? effect : null);
    syncAttr('animation', animation && animation !== 'smooth' ? animation : null);
    syncAttr('trigger', trigger && trigger !== 'load' ? trigger : null);
    syncAttr('duration', normalizeTime(duration));
    syncAttr('stagger', normalizeTime(stagger));
    syncAttr('delay', normalizeTime(delay));
    syncBooleanAttr('loop', loop);
    syncAttr('loop-delay', normalizeTime(loopDelay));
    syncBooleanAttr('paused', paused);
    syncAttr('threshold', threshold == null || threshold === '' ? null : String(threshold));
    syncAttr('variant', variant && variant !== 'default' && variant !== 'surface' ? variant : null);
    syncAttr('tone', tone && tone !== 'brand' ? tone : null);
    syncAttr('size', size && size !== 'md' && size !== '2' ? size : null);
    syncAttr('radius', radius == null || radius === '' ? null : String(radius));
    syncAttr('elevation', elevation && elevation !== 'low' ? elevation : null);
    syncAttr('padding', normalizeLength(padding));
    syncAttr('gap', normalizeLength(gap));
  }, [
    effect,
    animation,
    trigger,
    duration,
    stagger,
    delay,
    loop,
    loopDelay,
    paused,
    threshold,
    variant,
    tone,
    size,
    radius,
    elevation,
    padding,
    gap,
  ]);

  return React.createElement('ui-animated-list', { ref, ...rest }, children);
});

AnimatedListRoot.displayName = 'AnimatedList';

const AnimatedListItem = React.forwardRef<HTMLElement, AnimatedListItemProps>(function AnimatedListItem(
  { as, children, ...rest },
  forwardedRef
) {
  const Tag = (as || 'div') as keyof JSX.IntrinsicElements;
  return React.createElement(Tag, { ref: forwardedRef, 'data-ui-animated-list-item': '', ...rest }, children);
});

AnimatedListItem.displayName = 'AnimatedList.Item';

export const AnimatedList = Object.assign(AnimatedListRoot, {
  Item: AnimatedListItem,
});

export default AnimatedList;
