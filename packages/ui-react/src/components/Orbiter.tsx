import React from 'react';
import { warnIfElementNotRegistered } from './_internals';

export type OrbiterDirection = 'clockwise' | 'counterclockwise' | 'alternate';
export type OrbiterAnimation = 'calm' | 'smooth' | 'snappy' | 'bouncy';
export type OrbiterVariant = 'surface' | 'soft' | 'solid' | 'glass' | 'contrast' | 'minimal';
export type OrbiterTone = 'brand' | 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type OrbiterSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '0' | '1' | '2' | '3' | '4';
export type OrbiterElevation = 'none' | 'low' | 'high';

export type OrbiterElement = HTMLElement & {
  play(): void;
  pause(): void;
  refresh(): void;
};

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
  if (typeof value === 'number') return `${value}s`;
  if (/^-?\d+(\.\d+)?$/.test(value)) return `${value}s`;
  return value;
}

export type OrbiterProps = React.HTMLAttributes<OrbiterElement> & {
  duration?: number | string;
  delay?: number | string;
  speed?: number | string;
  reverse?: boolean;
  radius?: number | string;
  path?: boolean;
  iconSize?: number | string;
  orbitRadius?: number | string;
  itemSize?: number | string;
  centerSize?: number | string;
  ringGap?: number | string;
  rings?: number | string;
  startAngle?: number | string;
  direction?: OrbiterDirection;
  animation?: OrbiterAnimation;
  variant?: OrbiterVariant;
  tone?: OrbiterTone;
  size?: OrbiterSize;
  surfaceRadius?: number | string;
  elevation?: OrbiterElevation;
  padding?: number | string;
  showPaths?: boolean;
  pauseOnHover?: boolean;
  pauseOnItemHover?: boolean;
  pauseOnFocus?: boolean;
  paused?: boolean;
  children?: React.ReactNode;
};

export interface OrbiterItemProps extends React.HTMLAttributes<HTMLElement> {
  as?: keyof JSX.IntrinsicElements;
  clickable?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  children?: React.ReactNode;
}

export interface OrbiterCenterProps extends React.HTMLAttributes<HTMLElement> {
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
}

const OrbiterRoot = React.forwardRef<OrbiterElement, OrbiterProps>(function Orbiter(
  {
    duration,
    delay,
    speed,
    reverse,
    radius,
    path,
    iconSize,
    orbitRadius,
    itemSize,
    centerSize,
    ringGap,
    rings,
    startAngle,
    direction,
    animation,
    variant,
    tone,
    size,
    surfaceRadius,
    elevation,
    padding,
    showPaths,
    pauseOnHover,
    pauseOnItemHover,
    pauseOnFocus,
    paused,
    children,
    ...rest
  },
  forwardedRef
) {
  const ref = React.useRef<OrbiterElement | null>(null);
  React.useImperativeHandle(forwardedRef, () => ref.current as OrbiterElement);

  React.useEffect(() => {
    warnIfElementNotRegistered('ui-orbiter', 'Orbiter');
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

    syncAttr('duration', normalizeTime(duration));
    syncAttr('delay', normalizeTime(delay));
    syncAttr('speed', speed == null || speed === '' ? null : String(speed));
    syncAttr('radius', normalizeLength(radius ?? orbitRadius));
    syncAttr('orbit-radius', normalizeLength(orbitRadius));
    syncAttr('icon-size', normalizeLength(iconSize ?? itemSize));
    syncAttr('item-size', normalizeLength(itemSize));
    syncAttr('center-size', normalizeLength(centerSize));
    syncAttr('ring-gap', normalizeLength(ringGap));
    syncAttr('rings', rings == null || rings === '' ? null : String(rings));
    syncAttr('start-angle', startAngle == null || startAngle === '' ? null : String(startAngle));
    syncAttr('direction', direction && direction !== 'clockwise' ? direction : null);
    syncAttr('animation', animation && animation !== 'smooth' ? animation : null);
    syncAttr('variant', variant && variant !== 'surface' ? variant : null);
    syncAttr('tone', tone && tone !== 'brand' ? tone : null);
    syncAttr('size', size && size !== 'md' && size !== '2' ? size : null);
    syncAttr('surface-radius', surfaceRadius == null || surfaceRadius === '' ? null : String(surfaceRadius));
    syncAttr('elevation', elevation && elevation !== 'low' ? elevation : null);
    syncAttr('padding', normalizeLength(padding));
    syncAttr('path', path == null ? null : String(path));
    syncBooleanAttr('show-paths', showPaths);
    syncBooleanAttr('pause-on-hover', pauseOnHover);
    syncBooleanAttr('pause-on-item-hover', pauseOnItemHover);
    syncBooleanAttr('pause-on-focus', pauseOnFocus);
    syncBooleanAttr('paused', paused);
    syncBooleanAttr('reverse', reverse);
  }, [
    duration,
    delay,
    speed,
    reverse,
    radius,
    path,
    iconSize,
    orbitRadius,
    itemSize,
    centerSize,
    ringGap,
    rings,
    startAngle,
    direction,
    animation,
    variant,
    tone,
    size,
    surfaceRadius,
    elevation,
    padding,
    showPaths,
    pauseOnHover,
    pauseOnItemHover,
    pauseOnFocus,
    paused,
  ]);

  return React.createElement('ui-orbiter', { ref, ...rest }, children);
});

OrbiterRoot.displayName = 'Orbiter';

const OrbiterItem = React.forwardRef<HTMLElement, OrbiterItemProps>(function OrbiterItem(
  { as, clickable, href, target, rel, disabled, type, tabIndex, children, ...rest },
  forwardedRef
) {
  const Tag = (as || (clickable ? (href ? 'a' : 'button') : 'div')) as keyof JSX.IntrinsicElements;
  const interactive = clickable || Tag === 'button' || Tag === 'a';
  const itemProps: Record<string, unknown> = {
    ref: forwardedRef,
    'data-ui-orbiter-item': '',
    ...rest,
  };

  if (interactive) itemProps['data-ui-orbiter-clickable'] = '';
  if (href) itemProps.href = href;
  if (target) itemProps.target = target;
  if (rel) itemProps.rel = rel;
  if (disabled != null) itemProps.disabled = disabled;
  if (Tag === 'button') itemProps.type = type || 'button';
  if (tabIndex != null) itemProps.tabIndex = tabIndex;
  else if (interactive && Tag !== 'button' && Tag !== 'a') itemProps.tabIndex = 0;

  return React.createElement(Tag, itemProps, children);
});

OrbiterItem.displayName = 'Orbiter.Item';

const OrbiterCenter = React.forwardRef<HTMLElement, OrbiterCenterProps>(function OrbiterCenter(
  { as, children, ...rest },
  forwardedRef
) {
  const Tag = (as || 'div') as keyof JSX.IntrinsicElements;
  return React.createElement(Tag, { ref: forwardedRef, slot: 'center', 'data-ui-orbiter-center': '', ...rest }, children);
});

OrbiterCenter.displayName = 'Orbiter.Center';

export const Orbiter = Object.assign(OrbiterRoot, {
  Item: OrbiterItem,
  Center: OrbiterCenter,
});

export default Orbiter;
