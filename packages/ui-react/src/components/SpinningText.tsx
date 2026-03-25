import React from 'react';
import { warnIfElementNotRegistered } from './_internals';

export type SpinningTextDirection = 'clockwise' | 'counterclockwise';
export type SpinningTextVariant = 'default' | 'surface' | 'soft' | 'solid' | 'glass' | 'contrast' | 'minimal';
export type SpinningTextTone = 'brand' | 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type SpinningTextSize = 'sm' | 'md' | 'lg' | 'xl' | '1' | '2' | '3' | '4';
export type SpinningTextElevation = 'none' | 'low' | 'high';

export type SpinningTextElement = HTMLElement & {
  play(): void;
  pause(): void;
  refresh(): void;
};

export type SpinningTextProps = React.HTMLAttributes<SpinningTextElement> & {
  text?: string;
  repeat?: number | string;
  separator?: string;
  speed?: number | string;
  duration?: number | string;
  direction?: SpinningTextDirection;
  variant?: SpinningTextVariant;
  tone?: SpinningTextTone;
  size?: SpinningTextSize;
  radius?: number | string;
  padding?: number | string;
  fontSize?: number | string;
  fontWeight?: number | string;
  letterSpacing?: number | string;
  color?: string;
  accent?: string;
  orbitColor?: string;
  easing?: string;
  elevation?: SpinningTextElevation;
  paused?: boolean;
  pauseOnHover?: boolean;
  pauseOnFocus?: boolean;
  children?: React.ReactNode;
};

export interface SpinningTextCenterProps extends React.HTMLAttributes<HTMLElement> {
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
  if (typeof value === 'number') return `${value}s`;
  if (/^-?\d+(\.\d+)?$/.test(value)) return `${value}s`;
  return value;
}

const SpinningTextRoot = React.forwardRef<SpinningTextElement, SpinningTextProps>(function SpinningText(
  {
    text,
    repeat,
    separator,
    speed,
    duration,
    direction,
    variant,
    tone,
    size,
    radius,
    padding,
    fontSize,
    fontWeight,
    letterSpacing,
    color,
    accent,
    orbitColor,
    easing,
    elevation,
    paused,
    pauseOnHover,
    pauseOnFocus,
    children,
    ...rest
  },
  forwardedRef
) {
  const ref = React.useRef<SpinningTextElement | null>(null);
  React.useImperativeHandle(forwardedRef, () => ref.current as SpinningTextElement);

  React.useEffect(() => {
    warnIfElementNotRegistered('ui-spinning-text', 'SpinningText');
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

    syncAttr('text', text != null && text !== '' ? text : null);
    syncAttr('repeat', repeat == null || repeat === '' ? null : String(repeat));
    syncAttr('separator', separator || null);
    syncAttr('speed', speed == null || speed === '' ? null : String(speed));
    syncAttr('duration', normalizeTime(duration));
    syncAttr('direction', direction && direction !== 'clockwise' ? direction : null);
    syncAttr('variant', variant && variant !== 'default' && variant !== 'surface' ? variant : null);
    syncAttr('tone', tone && tone !== 'brand' ? tone : null);
    syncAttr('size', size && size !== 'lg' && size !== '3' ? size : null);
    syncAttr('radius', normalizeLength(radius));
    syncAttr('padding', normalizeLength(padding));
    syncAttr('font-size', normalizeLength(fontSize));
    syncAttr('font-weight', fontWeight == null || fontWeight === '' ? null : String(fontWeight));
    syncAttr('letter-spacing', normalizeLength(letterSpacing));
    syncAttr('color', color || null);
    syncAttr('accent', accent || null);
    syncAttr('orbit-color', orbitColor || null);
    syncAttr('easing', easing || null);
    syncAttr('elevation', elevation && elevation !== 'low' ? elevation : null);
    syncBooleanAttr('paused', paused);
    syncBooleanAttr('pause-on-hover', pauseOnHover);
    syncBooleanAttr('pause-on-focus', pauseOnFocus);
  }, [
    text,
    repeat,
    separator,
    speed,
    duration,
    direction,
    variant,
    tone,
    size,
    radius,
    padding,
    fontSize,
    fontWeight,
    letterSpacing,
    color,
    accent,
    orbitColor,
    easing,
    elevation,
    paused,
    pauseOnHover,
    pauseOnFocus,
  ]);

  return React.createElement('ui-spinning-text', { ref, ...rest }, children);
});

SpinningTextRoot.displayName = 'SpinningText';

const SpinningTextCenter = React.forwardRef<HTMLElement, SpinningTextCenterProps>(function SpinningTextCenter(
  { as, children, ...rest },
  forwardedRef
) {
  const Tag = (as || 'div') as keyof JSX.IntrinsicElements;
  return React.createElement(Tag, { ref: forwardedRef, slot: 'center', 'data-ui-spinning-text-center': '', ...rest }, children);
});

SpinningTextCenter.displayName = 'SpinningText.Center';

export const SpinningText = Object.assign(SpinningTextRoot, {
  Center: SpinningTextCenter,
});

export default SpinningText;
