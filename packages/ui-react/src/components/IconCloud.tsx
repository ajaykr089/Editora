import React from 'react';
import { warnIfElementNotRegistered } from './_internals';

export type IconCloudDirection = 'clockwise' | 'counterclockwise';
export type IconCloudVariant = 'surface' | 'soft' | 'solid' | 'glass' | 'contrast' | 'minimal';
export type IconCloudTone = 'brand' | 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type IconCloudSize = 'sm' | 'md' | 'lg' | 'xl' | '1' | '2' | '3' | '4';
export type IconCloudElevation = 'none' | 'low' | 'high';

export type IconCloudElement = HTMLElement & {
  play(): void;
  pause(): void;
  refresh(): void;
};

export type IconCloudProps = React.HTMLAttributes<IconCloudElement> & {
  radius?: number | string;
  perspective?: number | string;
  depth?: number | string;
  speed?: number | string;
  direction?: IconCloudDirection;
  itemSize?: number | string;
  centerSize?: number | string;
  padding?: number | string;
  variant?: IconCloudVariant;
  tone?: IconCloudTone;
  size?: IconCloudSize;
  surfaceRadius?: number | string;
  elevation?: IconCloudElevation;
  interactive?: boolean;
  autoFit?: boolean;
  paused?: boolean;
  pauseOnHover?: boolean;
  pauseOnItemHover?: boolean;
  pauseOnFocus?: boolean;
  children?: React.ReactNode;
};

export interface IconCloudItemProps extends React.HTMLAttributes<HTMLElement> {
  as?: keyof JSX.IntrinsicElements;
  clickable?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  children?: React.ReactNode;
}

export interface IconCloudCenterProps extends React.HTMLAttributes<HTMLElement> {
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

const IconCloudRoot = React.forwardRef<IconCloudElement, IconCloudProps>(function IconCloud(
  {
    radius,
    perspective,
    depth,
    speed,
    direction,
    itemSize,
    centerSize,
    padding,
    variant,
    tone,
    size,
    surfaceRadius,
    elevation,
    interactive,
    autoFit,
    paused,
    pauseOnHover,
    pauseOnItemHover,
    pauseOnFocus,
    children,
    ...rest
  },
  forwardedRef
) {
  const ref = React.useRef<IconCloudElement | null>(null);
  React.useImperativeHandle(forwardedRef, () => ref.current as IconCloudElement);

  React.useEffect(() => {
    warnIfElementNotRegistered('ui-icon-cloud', 'IconCloud');
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

    syncAttr('radius', normalizeLength(radius));
    syncAttr('perspective', normalizeLength(perspective));
    syncAttr('depth', depth == null || depth === '' ? null : String(depth));
    syncAttr('speed', speed == null || speed === '' ? null : String(speed));
    syncAttr('direction', direction && direction !== 'clockwise' ? direction : null);
    syncAttr('item-size', normalizeLength(itemSize));
    syncAttr('center-size', normalizeLength(centerSize));
    syncAttr('padding', normalizeLength(padding));
    syncAttr('variant', variant && variant !== 'surface' ? variant : null);
    syncAttr('tone', tone && tone !== 'brand' ? tone : null);
    syncAttr('size', size && size !== 'md' && size !== '2' ? size : null);
    syncAttr('surface-radius', normalizeLength(surfaceRadius));
    syncAttr('elevation', elevation && elevation !== 'low' ? elevation : null);
    syncBooleanAttr('interactive', interactive == null ? true : interactive);
    syncBooleanAttr('auto-fit', autoFit);
    syncBooleanAttr('paused', paused);
    syncBooleanAttr('pause-on-hover', pauseOnHover);
    syncBooleanAttr('pause-on-item-hover', pauseOnItemHover);
    syncBooleanAttr('pause-on-focus', pauseOnFocus);
  }, [
    radius,
    perspective,
    depth,
    speed,
    direction,
    itemSize,
    centerSize,
    padding,
    variant,
    tone,
    size,
    surfaceRadius,
    elevation,
    interactive,
    autoFit,
    paused,
    pauseOnHover,
    pauseOnItemHover,
    pauseOnFocus,
  ]);

  return React.createElement('ui-icon-cloud', { ref, ...rest }, children);
});

IconCloudRoot.displayName = 'IconCloud';

const IconCloudItem = React.forwardRef<HTMLElement, IconCloudItemProps>(function IconCloudItem(
  { as, clickable, href, target, rel, disabled, type, tabIndex, children, ...rest },
  forwardedRef
) {
  const Tag = (as || (clickable ? (href ? 'a' : 'button') : 'div')) as keyof JSX.IntrinsicElements;
  const interactive = clickable || Tag === 'button' || Tag === 'a';
  const itemProps: Record<string, unknown> = {
    ref: forwardedRef,
    'data-ui-icon-cloud-item': '',
    ...rest,
  };

  if (interactive) itemProps['data-ui-icon-cloud-clickable'] = '';
  if (href) itemProps.href = href;
  if (target) itemProps.target = target;
  if (rel) itemProps.rel = rel;
  if (disabled != null) itemProps.disabled = disabled;
  if (Tag === 'button') itemProps.type = type || 'button';
  if (tabIndex != null) itemProps.tabIndex = tabIndex;
  else if (interactive && Tag !== 'button' && Tag !== 'a') itemProps.tabIndex = 0;

  return React.createElement(Tag, itemProps, children);
});

IconCloudItem.displayName = 'IconCloud.Item';

const IconCloudCenter = React.forwardRef<HTMLElement, IconCloudCenterProps>(function IconCloudCenter(
  { as, children, ...rest },
  forwardedRef
) {
  const Tag = (as || 'div') as keyof JSX.IntrinsicElements;
  return React.createElement(Tag, { ref: forwardedRef, slot: 'center', 'data-ui-icon-cloud-center': '', ...rest }, children);
});

IconCloudCenter.displayName = 'IconCloud.Center';

export const IconCloud = Object.assign(IconCloudRoot, {
  Item: IconCloudItem,
  Center: IconCloudCenter,
});

export default IconCloud;
