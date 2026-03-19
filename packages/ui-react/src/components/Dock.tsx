import React from 'react';
import { warnIfElementNotRegistered } from './_internals';

export type DockOrientation = 'horizontal' | 'vertical';
export type DockVariant = 'surface' | 'soft' | 'solid' | 'glass' | 'contrast' | 'minimal';
export type DockTone = 'brand' | 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type DockSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '0' | '1' | '2' | '3' | '4';
export type DockElevation = 'none' | 'low' | 'high';
export type DockLabelMode = 'hover' | 'always' | 'none';
export type DockLabelPlacement = 'auto' | 'top' | 'bottom' | 'start' | 'end';
export type DockAnimation = 'calm' | 'smooth' | 'snappy' | 'bouncy';
export type DockFocusTarget = number | string;

export type DockElement = HTMLElement & {
  refresh(): void;
  focusItem(target: DockFocusTarget): void;
  clearActive(): void;
};

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

function normalizeLength(value: number | string | undefined): string | null {
  if (value == null || value === '') return null;
  if (typeof value === 'number') return `${value}px`;
  const parts = value.split(/\s+/).filter(Boolean);
  if (!parts.length) return null;
  return parts
    .map((part) => (/^-?\d+(\.\d+)?$/.test(part) ? `${part}px` : part))
    .join(' ');
}

export type DockProps = React.HTMLAttributes<DockElement> & {
  orientation?: DockOrientation;
  magnification?: number | string;
  distance?: number | string;
  idleScale?: number | string;
  lift?: number | string;
  smoothing?: number | string;
  animation?: DockAnimation;
  gap?: number | string;
  padding?: number | string;
  itemSize?: number | string;
  labelMode?: DockLabelMode;
  labelPlacement?: DockLabelPlacement;
  variant?: DockVariant;
  tone?: DockTone;
  size?: DockSize;
  radius?: number | string;
  elevation?: DockElevation;
  children?: React.ReactNode;
};

export type DockItemSlotProps = React.HTMLAttributes<HTMLElement>;

export interface DockItemProps extends React.HTMLAttributes<HTMLElement> {
  as?: keyof JSX.IntrinsicElements;
  href?: string;
  target?: string;
  rel?: string;
  value?: string;
  active?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  label?: React.ReactNode;
  badge?: React.ReactNode;
  iconProps?: DockItemSlotProps;
  labelProps?: DockItemSlotProps;
  badgeProps?: DockItemSlotProps;
  children?: React.ReactNode;
}

const DockRoot = React.forwardRef<DockElement, DockProps>(function Dock(
  {
    orientation,
    magnification,
    distance,
    idleScale,
    lift,
    smoothing,
    animation,
    gap,
    padding,
    itemSize,
    labelMode,
    labelPlacement,
    variant,
    tone,
    size,
    radius,
    elevation,
    children,
    ...rest
  },
  forwardedRef
) {
  const ref = React.useRef<DockElement | null>(null);
  React.useImperativeHandle(forwardedRef, () => ref.current as DockElement);

  React.useEffect(() => {
    warnIfElementNotRegistered('ui-dock', 'Dock');
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

    syncAttr('orientation', orientation && orientation !== 'horizontal' ? orientation : null);
    syncAttr('magnification', magnification == null || magnification === '' ? null : String(magnification));
    syncAttr('distance', distance == null || distance === '' ? null : String(distance));
    syncAttr('idle-scale', idleScale == null || idleScale === '' ? null : String(idleScale));
    syncAttr('lift', lift == null || lift === '' ? null : String(lift));
    syncAttr('smoothing', smoothing == null || smoothing === '' ? null : String(smoothing));
    syncAttr('animation', animation && animation !== 'smooth' ? animation : null);
    syncAttr('gap', normalizeLength(gap));
    syncAttr('padding', normalizeLength(padding));
    syncAttr('item-size', normalizeLength(itemSize));
    syncAttr('label-mode', labelMode && labelMode !== 'hover' ? labelMode : null);
    syncAttr('label-placement', labelPlacement && labelPlacement !== 'auto' ? labelPlacement : null);
    syncAttr('variant', variant && variant !== 'surface' ? variant : null);
    syncAttr('tone', tone && tone !== 'brand' ? tone : null);
    syncAttr('size', size && size !== 'md' && size !== '2' ? size : null);
    syncAttr('radius', radius == null || radius === '' ? null : String(radius));
    syncAttr('elevation', elevation && elevation !== 'low' ? elevation : null);
  }, [
    orientation,
    magnification,
    distance,
    idleScale,
    lift,
    smoothing,
    animation,
    gap,
    padding,
    itemSize,
    labelMode,
    labelPlacement,
    variant,
    tone,
    size,
    radius,
    elevation,
  ]);

  return React.createElement('ui-dock', { ref, ...rest }, children);
});

DockRoot.displayName = 'Dock';

const DockItem = React.forwardRef<HTMLElement, DockItemProps>(function DockItem(
  {
    as,
    href,
    target,
    rel,
    value,
    active,
    disabled,
    icon,
    label,
    badge,
    iconProps,
    labelProps,
    badgeProps,
    children,
    ...rest
  },
  forwardedRef
) {
  const Tag = (as || (href ? 'a' : 'button')) as keyof JSX.IntrinsicElements;
  const iconContent = icon ?? children;
  const resolvedLabel =
    typeof label === 'string' || typeof label === 'number' ? String(label) : undefined;

  const props: Record<string, unknown> = {
    ref: forwardedRef,
    'data-ui-dock-item': '',
    ...rest,
  };

  if (value != null && value !== '') props['data-value'] = String(value);
  if (active) {
    props['data-active'] = '';
    if (href) props['aria-current'] = 'page';
  }
  if (resolvedLabel && props['aria-label'] == null) props['aria-label'] = resolvedLabel;
  if (resolvedLabel && props.title == null) props.title = resolvedLabel;

  if (href) {
    props.href = href;
    if (target) props.target = target;
    if (rel) props.rel = rel;
  }

  if (disabled) {
    if (Tag === 'button') {
      props.disabled = true;
    } else {
      props['aria-disabled'] = true;
      props.tabIndex = -1;
    }
  } else if (Tag === 'button' && props.type == null) {
    props.type = 'button';
  }

  return React.createElement(
    Tag,
    props,
    iconContent != null
      ? React.createElement('span', { 'data-ui-dock-icon': '', ...iconProps }, iconContent)
      : null,
    label != null
      ? React.createElement(
          'span',
          { 'data-ui-dock-label': '', ...labelProps },
          label
        )
      : null,
    badge != null
      ? React.createElement(
          'span',
          { 'data-ui-dock-badge': '', ...badgeProps },
          badge
        )
      : null
  );
});

DockItem.displayName = 'Dock.Item';

export const Dock = Object.assign(DockRoot, {
  Item: DockItem,
});

export default Dock;
