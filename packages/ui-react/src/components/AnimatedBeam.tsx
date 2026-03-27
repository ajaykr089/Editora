import React from 'react';
import { warnIfElementNotRegistered } from './_internals';

export type AnimatedBeamVariant = 'surface' | 'soft' | 'solid' | 'glass' | 'contrast' | 'minimal';
export type AnimatedBeamTone = 'brand' | 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type AnimatedBeamSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | '0' | '1' | '2' | '3';
export type AnimatedBeamElevation = 'none' | 'low' | 'high';
export type AnimatedBeamAnimation = 'calm' | 'smooth' | 'snappy' | 'surge' | 'pulse' | 'heartbeat';
export type AnimatedBeamCurve = 'auto' | 'straight' | 'soft' | 'arc';
export type AnimatedBeamDirection = 'forward' | 'reverse';
export type AnimatedBeamNodeEffect = 'none' | 'glow' | 'pulse' | 'ring' | 'shake';

export type AnimatedBeamElement = HTMLElement & {
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
  if (typeof value === 'number') return `${value}ms`;
  if (/^-?\d+(\.\d+)?$/.test(value)) return `${value}ms`;
  return value;
}

export type AnimatedBeamProps = React.HTMLAttributes<AnimatedBeamElement> & {
  animation?: AnimatedBeamAnimation;
  variant?: AnimatedBeamVariant;
  tone?: AnimatedBeamTone;
  size?: AnimatedBeamSize;
  radius?: number | string;
  elevation?: AnimatedBeamElevation;
  columns?: number | string;
  rows?: number | string;
  padding?: number | string;
  columnGap?: number | string;
  rowGap?: number | string;
  minHeight?: number | string;
  nodeSize?: number | string;
  hubSize?: number | string;
  duration?: number | string;
  delay?: number | string;
  stagger?: number | string;
  trailWidth?: number | string;
  beamWidth?: number | string;
  beamFactor?: number | string;
  path?: boolean;
  glow?: boolean;
  nodeEffect?: AnimatedBeamNodeEffect;
  autoFit?: boolean;
  paused?: boolean;
  repeat?: boolean;
  reverse?: boolean;
  direction?: AnimatedBeamDirection;
  colorStart?: string;
  colorEnd?: string;
  trailColor?: string;
  curve?: AnimatedBeamCurve;
  children?: React.ReactNode;
};

export interface AnimatedBeamNodeProps extends React.HTMLAttributes<HTMLElement> {
  as?: keyof JSX.IntrinsicElements;
  nodeId?: string;
  column?: number | string;
  row?: number | string;
  size?: number | string;
  children?: React.ReactNode;
}

export interface AnimatedBeamHubProps extends React.HTMLAttributes<HTMLElement> {
  as?: keyof JSX.IntrinsicElements;
  nodeId?: string;
  column?: number | string;
  row?: number | string;
  size?: number | string;
  children?: React.ReactNode;
}

export interface AnimatedBeamConnectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: keyof JSX.IntrinsicElements;
  from: string;
  to: string;
  curve?: AnimatedBeamCurve;
  reverse?: boolean;
  direction?: AnimatedBeamDirection;
  duration?: number | string;
  delay?: number | string;
  tone?: AnimatedBeamTone;
  colorStart?: string;
  colorEnd?: string;
  beamFactor?: number | string;
  trailWidth?: number | string;
  beamWidth?: number | string;
}

const AnimatedBeamRoot = React.forwardRef<AnimatedBeamElement, AnimatedBeamProps>(function AnimatedBeam(
  {
    animation,
    variant,
    tone,
    size,
    radius,
    elevation,
    columns,
    rows,
    padding,
    columnGap,
    rowGap,
    minHeight,
    nodeSize,
    hubSize,
    duration,
    delay,
    stagger,
    trailWidth,
    beamWidth,
    beamFactor,
    path,
    glow,
    nodeEffect,
    autoFit,
    paused,
    repeat,
    reverse,
    direction,
    colorStart,
    colorEnd,
    trailColor,
    curve,
    children,
    ...rest
  },
  forwardedRef,
) {
  const ref = React.useRef<AnimatedBeamElement | null>(null);
  React.useImperativeHandle(forwardedRef, () => ref.current as AnimatedBeamElement);

  React.useEffect(() => {
    warnIfElementNotRegistered('ui-animated-beam', 'AnimatedBeam');
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
      if (enabled == null) {
        if (el.hasAttribute(name)) el.removeAttribute(name);
        return;
      }
      const next = String(enabled);
      if (el.getAttribute(name) !== next) el.setAttribute(name, next);
    };

    syncAttr('animation', animation && animation !== 'smooth' ? animation : null);
    syncAttr('variant', variant && variant !== 'minimal' ? variant : null);
    syncAttr('tone', tone && tone !== 'brand' ? tone : null);
    syncAttr('size', size && size !== 'md' && size !== '2' ? size : null);
    syncAttr('radius', radius == null || radius === '' ? null : String(radius));
    syncAttr('elevation', elevation && elevation !== 'low' ? elevation : null);
    syncAttr('columns', columns == null || columns === '' ? null : String(columns));
    syncAttr('rows', rows == null || rows === '' ? null : String(rows));
    syncAttr('padding', normalizeLength(padding));
    syncAttr('column-gap', normalizeLength(columnGap));
    syncAttr('row-gap', normalizeLength(rowGap));
    syncAttr('min-height', normalizeLength(minHeight));
    syncAttr('node-size', normalizeLength(nodeSize));
    syncAttr('hub-size', normalizeLength(hubSize));
    syncAttr('duration', normalizeTime(duration));
    syncAttr('delay', normalizeTime(delay));
    syncAttr('stagger', normalizeTime(stagger));
    syncAttr('trail-width', normalizeLength(trailWidth));
    syncAttr('beam-width', normalizeLength(beamWidth));
    syncAttr('beam-factor', beamFactor == null || beamFactor === '' ? null : String(beamFactor));
    syncBooleanAttr('path', path);
    syncBooleanAttr('glow', glow);
    syncAttr('node-effect', nodeEffect && nodeEffect !== 'none' ? nodeEffect : null);
    syncBooleanAttr('auto-fit', autoFit);
    syncBooleanAttr('repeat', repeat);
    if (paused) el.setAttribute('paused', '');
    else el.removeAttribute('paused');
    if (reverse) el.setAttribute('reverse', '');
    else el.removeAttribute('reverse');
    syncAttr('direction', direction && direction !== 'forward' ? direction : null);
    syncAttr('color-start', colorStart || null);
    syncAttr('color-end', colorEnd || null);
    syncAttr('trail-color', trailColor || null);
    syncAttr('curve', curve && curve !== 'auto' ? curve : null);
  }, [
    animation,
    variant,
    tone,
    size,
    radius,
    elevation,
    columns,
    rows,
    padding,
    columnGap,
    rowGap,
    minHeight,
    nodeSize,
    hubSize,
    duration,
    delay,
    stagger,
    trailWidth,
    beamWidth,
    beamFactor,
    path,
    glow,
    nodeEffect,
    autoFit,
    paused,
    repeat,
    reverse,
    direction,
    colorStart,
    colorEnd,
    trailColor,
    curve,
  ]);

  return React.createElement('ui-animated-beam', { ref, ...rest }, children);
});

AnimatedBeamRoot.displayName = 'AnimatedBeam';

const AnimatedBeamNode = React.forwardRef<HTMLElement, AnimatedBeamNodeProps>(function AnimatedBeamNode(
  { as, nodeId, column, row, size, children, ...rest },
  forwardedRef,
) {
  const Tag = (as || 'div') as keyof JSX.IntrinsicElements;
  return React.createElement(
    Tag,
    {
      ref: forwardedRef,
      'data-ui-animated-beam-node': '',
      'node-id': nodeId,
      column: column == null ? undefined : String(column),
      row: row == null ? undefined : String(row),
      size: size == null ? undefined : String(size),
      ...rest,
    },
    children,
  );
});

AnimatedBeamNode.displayName = 'AnimatedBeam.Node';

const AnimatedBeamHub = React.forwardRef<HTMLElement, AnimatedBeamHubProps>(function AnimatedBeamHub(
  { as, nodeId, column, row, size, children, ...rest },
  forwardedRef,
) {
  const Tag = (as || 'div') as keyof JSX.IntrinsicElements;
  return React.createElement(
    Tag,
    {
      ref: forwardedRef,
      slot: 'hub',
      'data-ui-animated-beam-hub': '',
      'node-id': nodeId,
      column: column == null ? undefined : String(column),
      row: row == null ? undefined : String(row),
      size: size == null ? undefined : String(size),
      ...rest,
    },
    children,
  );
});

AnimatedBeamHub.displayName = 'AnimatedBeam.Hub';

const AnimatedBeamConnection = React.forwardRef<HTMLElement, AnimatedBeamConnectionProps>(function AnimatedBeamConnection(
  { as, from, to, curve, reverse, direction, duration, delay, tone, colorStart, colorEnd, beamFactor, trailWidth, beamWidth, ...rest },
  forwardedRef,
) {
  const Tag = (as || 'div') as keyof JSX.IntrinsicElements;
  return React.createElement(Tag, {
    ref: forwardedRef,
    slot: 'connections',
    'data-ui-animated-beam-connection': '',
    from,
    to,
    curve: curve && curve !== 'auto' ? curve : undefined,
    reverse: reverse ? '' : undefined,
    direction: direction && direction !== 'forward' ? direction : undefined,
    duration: normalizeTime(duration) || undefined,
    delay: normalizeTime(delay) || undefined,
    tone: tone || undefined,
    'color-start': colorStart || undefined,
    'color-end': colorEnd || undefined,
    'beam-factor': beamFactor == null || beamFactor === '' ? undefined : String(beamFactor),
    'trail-width': normalizeLength(trailWidth) || undefined,
    'beam-width': normalizeLength(beamWidth) || undefined,
    'aria-hidden': 'true',
    hidden: true,
    ...rest,
  });
});

AnimatedBeamConnection.displayName = 'AnimatedBeam.Connection';

export const AnimatedBeam = Object.assign(AnimatedBeamRoot, {
  Node: AnimatedBeamNode,
  Hub: AnimatedBeamHub,
  Connection: AnimatedBeamConnection,
});

export default AnimatedBeam;
