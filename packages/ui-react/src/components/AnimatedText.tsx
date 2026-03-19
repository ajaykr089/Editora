import React from 'react';
import { warnIfElementNotRegistered } from './_internals';

export type BuiltinAnimatedTextEffect =
  | 'fade-up'
  | 'fade-down'
  | 'slide-left'
  | 'slide-right'
  | 'blur'
  | 'blur-up'
  | 'pop'
  | 'wave'
  | 'zoom-in'
  | 'rotate-in'
  | 'flip-up'
  | 'skew-in'
  | 'glow'
  | 'typewriter';
export type AnimatedTextEffect = BuiltinAnimatedTextEffect | (string & {});

export type AnimatedTextSplit = 'chars' | 'words' | 'lines';
export type AnimatedTextTrigger = 'load' | 'visible' | 'manual';
export type AnimatedTextVariant = 'default' | 'soft' | 'solid' | 'contrast' | 'gradient' | 'minimal';
export type AnimatedTextTone = 'brand' | 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type AnimatedTextSize = 'sm' | 'md' | 'lg' | 'xl' | '1' | '2' | '3' | '4';
export type AnimatedTextElevation = 'none' | 'low' | 'high';
export type AnimatedTextAlign = 'start' | 'center' | 'end' | 'left' | 'right';

export type AnimatedTextElement = HTMLElement & {
  pause(): void;
  play(): void;
  replay(): void;
  refresh(): void;
};

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

export type AnimatedTextProps = React.HTMLAttributes<AnimatedTextElement> & {
  text?: string;
  effect?: AnimatedTextEffect;
  split?: AnimatedTextSplit;
  trigger?: AnimatedTextTrigger;
  duration?: number | string;
  stagger?: number | string;
  delay?: number | string;
  loop?: boolean;
  loopDelay?: number | string;
  paused?: boolean;
  customEffect?: string;
  effectTimingFunction?: string;
  effectDirection?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  effectIterationCount?: number | string;
  effectFillMode?: 'none' | 'forwards' | 'backwards' | 'both';
  variant?: AnimatedTextVariant;
  tone?: AnimatedTextTone;
  size?: AnimatedTextSize;
  radius?: number | string;
  elevation?: AnimatedTextElevation;
  padding?: number | string;
  align?: AnimatedTextAlign;
  children?: React.ReactNode;
};

function normalizeLength(value: number | string | undefined): string | null {
  if (value == null || value === '') return null;
  if (typeof value === 'number') return `${value}px`;
  const parts = value.split(/\s+/).filter(Boolean);
  if (!parts.length) return null;
  return parts
    .map((part) => (/^-?\d+(\.\d+)?$/.test(part) ? `${part}px` : part))
    .join(' ');
}

function normalizeTime(value: number | string | undefined): string | null {
  if (value == null || value === '') return null;
  if (typeof value === 'number') return `${value}ms`;
  if (/^-?\d+(\.\d+)?$/.test(value)) return `${value}ms`;
  return value;
}

const AnimatedTextRoot = React.forwardRef<AnimatedTextElement, AnimatedTextProps>(function AnimatedText(
  {
    text,
    effect,
    split,
    trigger,
    duration,
    stagger,
    delay,
    loop,
    loopDelay,
    paused,
    customEffect,
    effectTimingFunction,
    effectDirection,
    effectIterationCount,
    effectFillMode,
    variant,
    tone,
    size,
    radius,
    elevation,
    padding,
    align,
    children,
    ...rest
  },
  forwardedRef
) {
  const ref = React.useRef<AnimatedTextElement | null>(null);
  React.useImperativeHandle(forwardedRef, () => ref.current as AnimatedTextElement);

  React.useEffect(() => {
    warnIfElementNotRegistered('ui-animated-text', 'AnimatedText');
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
    syncAttr('effect', effect && effect !== 'fade-up' ? effect : null);
    syncAttr('split', split && split !== 'words' ? split : null);
    syncAttr('trigger', trigger && trigger !== 'load' ? trigger : null);
    syncAttr('duration', normalizeTime(duration));
    syncAttr('stagger', normalizeTime(stagger));
    syncAttr('delay', normalizeTime(delay));
    syncBooleanAttr('loop', loop);
    syncAttr('loop-delay', normalizeTime(loopDelay));
    syncBooleanAttr('paused', paused);
    syncAttr('custom-effect', customEffect || null);
    syncAttr('effect-timing', effectTimingFunction || null);
    syncAttr('effect-direction', effectDirection || null);
    syncAttr(
      'effect-iteration-count',
      effectIterationCount == null || effectIterationCount === '' ? null : String(effectIterationCount)
    );
    syncAttr('effect-fill-mode', effectFillMode || null);
    syncAttr('variant', variant && variant !== 'default' ? variant : null);
    syncAttr('tone', tone && tone !== 'brand' ? tone : null);
    syncAttr('size', size && size !== 'md' && size !== '2' ? size : null);
    syncAttr('radius', radius == null || radius === '' ? null : String(radius));
    syncAttr('elevation', elevation && elevation !== 'low' ? elevation : null);
    syncAttr('padding', normalizeLength(padding));
    syncAttr('align', align && align !== 'start' ? align : null);
  }, [
    text,
    effect,
    split,
    trigger,
    duration,
    stagger,
    delay,
    loop,
    loopDelay,
    paused,
    customEffect,
    effectTimingFunction,
    effectDirection,
    effectIterationCount,
    effectFillMode,
    variant,
    tone,
    size,
    radius,
    elevation,
    padding,
    align,
  ]);

  return React.createElement('ui-animated-text', { ref, ...rest }, text == null ? children : null);
});

AnimatedTextRoot.displayName = 'AnimatedText';

export const AnimatedText = AnimatedTextRoot;

export default AnimatedText;
