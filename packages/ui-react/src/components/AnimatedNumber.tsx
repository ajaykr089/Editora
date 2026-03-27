import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  syncBooleanAttribute,
  syncNumberAttribute,
  syncStringAttribute,
  useElementAttributes,
  useElementEventListeners,
  useForwardedHostRef,
  warnIfElementNotRegistered,
} from './_internals';

export type AnimatedNumberAnimation = 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear' | 'spring';
export type AnimatedNumberVariant = 'odometer' | 'inline' | 'digital' | 'analog';
export type AnimatedNumberFormat = 'decimal' | 'currency' | 'percent' | 'number';
export type AnimatedNumberNotation = 'standard' | 'compact';
export type AnimatedNumberDirection = 'auto' | 'up' | 'down';

export type AnimatedNumberCompleteEvent = CustomEvent<{ value: number }>;

export type AnimatedNumberProps = Omit<React.HTMLAttributes<HTMLElement>, 'children'> & {
  value?: number;
  onComplete?: (event: AnimatedNumberCompleteEvent) => void;
  variant?: AnimatedNumberVariant;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger';
  theme?: 'default' | 'dark' | 'brand';
  format?: AnimatedNumberFormat;
  locale?: string;
  currency?: string;
  notation?: AnimatedNumberNotation;
  fractionDigits?: number;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  decimals?: number;
  duration?: number;
  animation?: AnimatedNumberAnimation;
  direction?: AnimatedNumberDirection;
  prefix?: string;
  suffix?: string;
  decimalSeparator?: string;
  groupSeparator?: string;
  animate?: boolean;
  animateOnMount?: boolean;
  countUp?: boolean;
  min?: number;
  max?: number;
  label?: string;
};

export const AnimatedNumber = React.forwardRef<HTMLElement, AnimatedNumberProps>(function AnimatedNumber(
  {
    value = 0,
    onComplete,
    variant = 'inline',
    size,
    tone,
    theme,
    format = 'decimal',
    locale,
    currency,
    notation = 'standard',
    fractionDigits,
    minimumFractionDigits,
    maximumFractionDigits,
    decimals,
    duration,
    animation = 'spring',
    direction = 'auto',
    prefix,
    suffix,
    decimalSeparator,
    groupSeparator,
    animate,
    animateOnMount,
    countUp,
    min,
    max,
    label,
    className,
    ...rest
  },
  forwardedRef
) {
  const ref = useForwardedHostRef<HTMLElement>(forwardedRef);
  const resolvedAnimateOnMount = animateOnMount ?? countUp;
  const resolvedMinimumFractionDigits = minimumFractionDigits ?? fractionDigits ?? decimals;
  const resolvedMaximumFractionDigits = maximumFractionDigits ?? fractionDigits ?? decimals;

  useEffect(() => {
    warnIfElementNotRegistered('ui-odometer', 'AnimatedNumber');
  }, []);

  const handleComplete = React.useCallback((event: Event) => {
    onComplete?.(event as AnimatedNumberCompleteEvent);
  }, [onComplete]);

  useElementEventListeners(ref, [{ type: 'complete', listener: handleComplete }], [handleComplete]);

  useElementAttributes(ref, (el) => {
    syncNumberAttribute(el, 'value', value);
    syncNumberAttribute(el, 'duration', duration);
    syncNumberAttribute(el, 'min', min);
    syncNumberAttribute(el, 'max', max);
    syncNumberAttribute(el, 'minimum-fraction-digits', resolvedMinimumFractionDigits);
    syncNumberAttribute(el, 'maximum-fraction-digits', resolvedMaximumFractionDigits);

    syncStringAttribute(el, 'variant', variant);
    syncStringAttribute(el, 'size', size ?? null);
    syncStringAttribute(el, 'tone', tone && tone !== 'default' ? tone : null);
    syncStringAttribute(el, 'theme', theme && theme !== 'default' ? theme : null);
    syncStringAttribute(el, 'format', format && format !== 'decimal' ? format : null);
    syncStringAttribute(el, 'locale', locale ?? null);
    syncStringAttribute(el, 'currency', currency ?? null);
    syncStringAttribute(el, 'notation', notation && notation !== 'standard' ? notation : null);
    syncStringAttribute(el, 'animation', animation ?? null);
    syncStringAttribute(el, 'direction', direction && direction !== 'auto' ? direction : null);
    syncStringAttribute(el, 'prefix', prefix ?? null);
    syncStringAttribute(el, 'suffix', suffix ?? null);
    syncStringAttribute(el, 'decimal-separator', decimalSeparator ?? null);
    syncStringAttribute(el, 'group-separator', groupSeparator ?? null);
    syncStringAttribute(el, 'label', label ?? null);

    syncNumberAttribute(el, 'decimals', decimals);

    syncBooleanAttribute(el, 'animate', animate);
    syncBooleanAttribute(el, 'animate-on-mount', resolvedAnimateOnMount);
    syncBooleanAttribute(el, 'count-up', countUp);
  }, [
    value,
    variant,
    size,
    tone,
    theme,
    format,
    locale,
    currency,
    notation,
    duration,
    animation,
    direction,
    prefix,
    suffix,
    decimalSeparator,
    groupSeparator,
    animate,
    resolvedAnimateOnMount,
    countUp,
    min,
    max,
    label,
    decimals,
    resolvedMinimumFractionDigits,
    resolvedMaximumFractionDigits,
  ]);

  return React.createElement('ui-odometer', { ref, class: className, ...rest });
});

AnimatedNumber.displayName = 'AnimatedNumber';

export default AnimatedNumber;

export function useAnimatedNumberValue(options: {
  start?: number;
  end: number;
  duration?: number;
  easing?: (t: number) => number;
  autoStart?: boolean;
}) {
  const { start = 0, end, duration = 800, easing, autoStart = false } = options;

  const [value, setValue] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const startValueRef = useRef(start);
  const endValueRef = useRef(end);
  const valueRef = useRef(start);

  const defaultEasing = useCallback((t: number): number => 1 - Math.pow(1 - t, 3), []);
  const currentEasing = easing || defaultEasing;

  const stop = useCallback(() => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    startTimeRef.current = null;
    setIsAnimating(false);
  }, []);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const animate = useCallback(() => {
    const animateFrame = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = currentEasing(progress);
      const currentValue = startValueRef.current + (endValueRef.current - startValueRef.current) * easedProgress;
      setValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateFrame);
        return;
      }

      setValue(endValueRef.current);
      animationRef.current = null;
      startTimeRef.current = null;
      setIsAnimating(false);
    };

    animationRef.current = requestAnimationFrame(animateFrame);
    setIsAnimating(true);
  }, [currentEasing, duration]);

  const startAnimation = useCallback(
    (toValue?: number) => {
      stop();

      if (toValue !== undefined) {
        endValueRef.current = toValue;
      }

      startValueRef.current = valueRef.current;
      animate();
    },
    [animate, stop]
  );

  const reset = useCallback(
    (newStart?: number) => {
      stop();
      const resetValue = newStart !== undefined ? newStart : start;
      startValueRef.current = resetValue;
      endValueRef.current = resetValue;
      setValue(resetValue);
    },
    [start, stop]
  );

  useEffect(() => {
    endValueRef.current = end;
  }, [end]);

  useEffect(() => {
    if (autoStart) {
      startAnimation(end);
    }

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [autoStart, end, startAnimation]);

  return {
    value,
    isAnimating,
    start: startAnimation,
    reset,
    stop,
  };
}

export function useAnimatedNumber(options: {
  initialValue?: number;
  duration?: number;
  animation?: AnimatedNumberAnimation;
  format?: AnimatedNumberFormat;
  variant?: AnimatedNumberVariant;
} = {}) {
  const {
    initialValue = 0,
    duration = 800,
    animation = 'spring',
    format = 'decimal',
    variant = 'inline',
  } = options;

  const ref = useRef<HTMLElement | null>(null);
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.setAttribute('duration', String(duration));
    el.setAttribute('variant', variant);

    if (animation !== 'spring') {
      el.setAttribute('animation', animation);
    } else {
      el.removeAttribute('animation');
    }

    if (format !== 'decimal') {
      el.setAttribute('format', format);
    } else {
      el.removeAttribute('format');
    }
  }, [animation, duration, format, variant]);

  const setAnimatedNumberValue = useCallback((newValue: number) => {
    const el = ref.current;
    setValue(newValue);

    if (!el) return;
    el.setAttribute('value', String(newValue));
  }, []);

  const increment = useCallback(
    (amount: number = 1) => {
      setAnimatedNumberValue(value + amount);
    },
    [setAnimatedNumberValue, value]
  );

  const decrement = useCallback(
    (amount: number = 1) => {
      setAnimatedNumberValue(value - amount);
    },
    [setAnimatedNumberValue, value]
  );

  const reset = useCallback(() => {
    setAnimatedNumberValue(initialValue);
  }, [initialValue, setAnimatedNumberValue]);

  return {
    ref,
    value,
    setValue: setAnimatedNumberValue,
    increment,
    decrement,
    reset,
  };
}
