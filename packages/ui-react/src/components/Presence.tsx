import React, { useEffect, useLayoutEffect, useRef } from 'react';

import '@editora/ui-core/presence';
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type PresenceState = 'hidden' | 'entering' | 'present' | 'exiting';

type PresenceProps = React.HTMLAttributes<HTMLElement> & {
  present?: boolean;
  headless?: boolean;
  mode?: 'fade' | 'scale' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'blur' | 'flip';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'soft' | 'glass' | 'contrast';
  keepMounted?: boolean;
  lazy?: boolean;
  enterDuration?: number;
  exitDuration?: number;
  delay?: number;
  onBeforeEnter?: (state: PresenceState) => void;
  onEnter?: (state: PresenceState) => void;
  onAfterEnter?: (state: PresenceState) => void;
  onBeforeExit?: (state: PresenceState) => void;
  onExit?: (state: PresenceState) => void;
  onAfterExit?: (state: PresenceState) => void;
};

export const Presence = React.forwardRef<HTMLElement, PresenceProps>(function Presence(
  {
    present,
    headless,
    mode,
    size,
    variant,
    keepMounted,
    lazy,
    enterDuration,
    exitDuration,
    delay,
    onBeforeEnter,
    onEnter,
    onAfterEnter,
    onBeforeExit,
    onExit,
    onAfterExit,
    children,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);
  React.useImperativeHandle(forwardedRef, () => ref.current as any);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mapState = (event: Event): PresenceState => {
      const detail = (event as CustomEvent<{ state?: PresenceState }>).detail;
      return (detail?.state || 'hidden') as PresenceState;
    };
    const beforeEnter = (event: Event) => onBeforeEnter?.(mapState(event));
    const enter = (event: Event) => onEnter?.(mapState(event));
    const afterEnter = (event: Event) => onAfterEnter?.(mapState(event));
    const beforeExit = (event: Event) => onBeforeExit?.(mapState(event));
    const exit = (event: Event) => onExit?.(mapState(event));
    const afterExit = (event: Event) => onAfterExit?.(mapState(event));
    el.addEventListener('before-enter', beforeEnter as EventListener);
    el.addEventListener('enter', enter as EventListener);
    el.addEventListener('after-enter', afterEnter as EventListener);
    el.addEventListener('before-exit', beforeExit as EventListener);
    el.addEventListener('exit', exit as EventListener);
    el.addEventListener('after-exit', afterExit as EventListener);
    return () => {
      el.removeEventListener('before-enter', beforeEnter as EventListener);
      el.removeEventListener('enter', enter as EventListener);
      el.removeEventListener('after-enter', afterEnter as EventListener);
      el.removeEventListener('before-exit', beforeExit as EventListener);
      el.removeEventListener('exit', exit as EventListener);
      el.removeEventListener('after-exit', afterExit as EventListener);
    };
  }, [onBeforeEnter, onEnter, onAfterEnter, onBeforeExit, onExit, onAfterExit]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (present) el.setAttribute('present', '');
    else el.removeAttribute('present');

    if (headless) el.setAttribute('headless', '');
    else el.removeAttribute('headless');

    if (mode && mode !== 'fade') el.setAttribute('mode', mode);
    else el.removeAttribute('mode');
    if (size && size !== 'md') el.setAttribute('size', size);
    else el.removeAttribute('size');
    if (variant && variant !== 'default') el.setAttribute('variant', variant);
    else el.removeAttribute('variant');

    if (keepMounted) el.setAttribute('keep-mounted', '');
    else el.removeAttribute('keep-mounted');
    if (lazy) el.setAttribute('lazy', '');
    else el.removeAttribute('lazy');

    if (typeof enterDuration === 'number') el.setAttribute('enter-duration', String(enterDuration));
    else el.removeAttribute('enter-duration');
    if (typeof exitDuration === 'number') el.setAttribute('exit-duration', String(exitDuration));
    else el.removeAttribute('exit-duration');
    if (typeof delay === 'number') el.setAttribute('delay', String(delay));
    else el.removeAttribute('delay');
  }, [present, headless, mode, size, variant, keepMounted, lazy, enterDuration, exitDuration, delay]);

  return React.createElement('ui-presence', { ref, ...rest }, children);
});

Presence.displayName = 'Presence';
