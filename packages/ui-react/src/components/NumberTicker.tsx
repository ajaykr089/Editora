import React from 'react';
import { warnIfElementNotRegistered } from './_internals';

export type NumberTickerTone = 'brand' | 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type NumberTickerSize = 'sm' | 'md' | 'lg' | 'xl' | '1' | '2' | '3' | '4';
export type NumberTickerAlign = 'start' | 'center' | 'end' | 'left' | 'right';
export type NumberTickerEasing =
  | 'linear'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'spring'
  | 'bounce'
  | 'overshoot';
export type NumberTickerFormatStyle = 'decimal' | 'currency';
export type NumberTickerCurrencyDisplay = 'symbol' | 'narrowSymbol' | 'code' | 'name';
export type NumberTickerNotation = 'standard' | 'compact';
export type NumberTickerCompactDisplay = 'short' | 'long';
export type NumberTickerSignDisplay = 'auto' | 'always' | 'exceptZero' | 'never';
export type NumberTickerAnimation = 'interpolate' | 'odometer';
export type NumberTickerTrigger = 'immediate' | 'visible';
export type NumberTickerStaggerFrom = 'start' | 'end' | 'center';

export type NumberTickerFormatterContext = {
  formatted: string;
  intl: string;
  value: number;
  prefix: string;
  suffix: string;
  locale?: string;
  formatStyle: NumberTickerFormatStyle;
  currency?: string;
  notation: NumberTickerNotation;
  signDisplay: NumberTickerSignDisplay;
  fractionDigits: number | null;
};

export type NumberTickerFormatter = (value: number, context: NumberTickerFormatterContext) => string;

export type NumberTickerElement = HTMLElement & {
  play(): void;
  pause(): void;
  refresh(): void;
  finish(): void;
  formatter: NumberTickerFormatter | null;
};

export type NumberTickerProps = React.HTMLAttributes<NumberTickerElement> & {
  value?: number | string;
  from?: number | string;
  duration?: number | string;
  delay?: number | string;
  easing?: NumberTickerEasing;
  animation?: NumberTickerAnimation;
  trigger?: NumberTickerTrigger;
  visibilityThreshold?: number | string;
  stagger?: number | string;
  staggerFrom?: NumberTickerStaggerFrom;
  locale?: string;
  formatStyle?: NumberTickerFormatStyle;
  currency?: string;
  currencyDisplay?: NumberTickerCurrencyDisplay;
  notation?: NumberTickerNotation;
  compactDisplay?: NumberTickerCompactDisplay;
  fractionDigits?: number | string;
  useGrouping?: boolean;
  signDisplay?: NumberTickerSignDisplay;
  prefix?: string;
  suffix?: string;
  tone?: NumberTickerTone;
  size?: NumberTickerSize;
  align?: NumberTickerAlign;
  fontSize?: number | string;
  fontWeight?: number | string;
  letterSpacing?: number | string;
  color?: string;
  tabular?: boolean;
  monospace?: boolean;
  paused?: boolean;
  pauseOnHover?: boolean;
  pauseOnFocus?: boolean;
  formatter?: NumberTickerFormatter | null;
  children?: React.ReactNode;
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

const NumberTickerRoot = React.forwardRef<NumberTickerElement, NumberTickerProps>(function NumberTicker(
  {
    value,
    from,
    duration,
    delay,
    easing,
    animation,
    trigger,
    visibilityThreshold,
    stagger,
    staggerFrom,
    locale,
    formatStyle,
    currency,
    currencyDisplay,
    notation,
    compactDisplay,
    fractionDigits,
    useGrouping,
    signDisplay,
    prefix,
    suffix,
    tone,
    size,
    align,
    fontSize,
    fontWeight,
    letterSpacing,
    color,
    tabular,
    monospace,
    paused,
    pauseOnHover,
    pauseOnFocus,
    formatter,
    children,
    ...rest
  },
  forwardedRef
) {
  const ref = React.useRef<NumberTickerElement | null>(null);
  React.useImperativeHandle(forwardedRef, () => ref.current as NumberTickerElement);

  React.useEffect(() => {
    warnIfElementNotRegistered('ui-number-ticker', 'NumberTicker');
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

    syncAttr('value', value == null || value === '' ? null : String(value));
    syncAttr('from', from == null || from === '' ? null : String(from));
    syncAttr('duration', normalizeTime(duration));
    syncAttr('delay', normalizeTime(delay));
    syncAttr('easing', easing && easing !== 'ease-out' ? easing : null);
    syncAttr('animation', animation && animation !== 'interpolate' ? animation : null);
    syncAttr('trigger', trigger && trigger !== 'immediate' ? trigger : null);
    syncAttr(
      'visibility-threshold',
      visibilityThreshold == null || visibilityThreshold === '' ? null : String(visibilityThreshold)
    );
    syncAttr('stagger', normalizeTime(stagger));
    syncAttr('stagger-from', staggerFrom && staggerFrom !== 'start' ? staggerFrom : null);
    syncAttr('locale', locale || null);
    syncAttr('format-style', formatStyle && formatStyle !== 'decimal' ? formatStyle : null);
    syncAttr('currency', currency || null);
    syncAttr('currency-display', currencyDisplay && currencyDisplay !== 'symbol' ? currencyDisplay : null);
    syncAttr('notation', notation && notation !== 'standard' ? notation : null);
    syncAttr('compact-display', compactDisplay && compactDisplay !== 'short' ? compactDisplay : null);
    syncAttr('fraction-digits', fractionDigits == null || fractionDigits === '' ? null : String(fractionDigits));
    syncAttr('use-grouping', useGrouping == null ? null : String(useGrouping));
    syncAttr('sign-display', signDisplay && signDisplay !== 'auto' ? signDisplay : null);
    syncAttr('prefix', prefix || null);
    syncAttr('suffix', suffix || null);
    syncAttr('tone', tone && tone !== 'brand' ? tone : null);
    syncAttr('size', size && size !== 'md' && size !== '2' ? size : null);
    syncAttr('align', align && align !== 'start' ? align : null);
    syncAttr('font-size', normalizeLength(fontSize));
    syncAttr('font-weight', fontWeight == null || fontWeight === '' ? null : String(fontWeight));
    syncAttr('letter-spacing', normalizeLength(letterSpacing));
    syncAttr('color', color || null);
    syncAttr('tabular', tabular == null ? null : String(tabular));
    syncBooleanAttr('monospace', monospace);
    syncBooleanAttr('paused', paused);
    syncBooleanAttr('pause-on-hover', pauseOnHover);
    syncBooleanAttr('pause-on-focus', pauseOnFocus);
    el.formatter = formatter ?? null;
  }, [
    value,
    from,
    duration,
    delay,
    easing,
    animation,
    trigger,
    visibilityThreshold,
    stagger,
    staggerFrom,
    locale,
    formatStyle,
    currency,
    currencyDisplay,
    notation,
    compactDisplay,
    fractionDigits,
    useGrouping,
    signDisplay,
    prefix,
    suffix,
    tone,
    size,
    align,
    fontSize,
    fontWeight,
    letterSpacing,
    color,
    tabular,
    monospace,
    paused,
    pauseOnHover,
    pauseOnFocus,
    formatter,
  ]);

  return React.createElement('ui-number-ticker', { ref, ...rest }, children);
});

NumberTickerRoot.displayName = 'NumberTicker';

export const NumberTicker = NumberTickerRoot;

export default NumberTicker;
