import React, { useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type FocusScopeProps = Omit<React.HTMLAttributes<HTMLElement>, 'autoFocus'> & {
  active?: boolean;
  trapped?: boolean;
  loop?: boolean;
  restoreFocus?: boolean;
  autoFocus?: 'first' | 'selected' | 'container' | 'none';
  inertOthers?: boolean;
  headless?: boolean;
  onEscape?: (detail: { originalEvent?: Event }) => void;
  onFocusScopeMount?: () => void;
};

export const FocusScope = React.forwardRef<HTMLElement, FocusScopeProps>(function FocusScope(
  { children, active, trapped, loop, restoreFocus, autoFocus, inertOthers, headless, onEscape, onFocusScopeMount, ...rest },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);
  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleEscape = (event: Event) => onEscape?.((event as CustomEvent<{ originalEvent?: Event }>).detail || {});
    const handleMount = () => onFocusScopeMount?.();
    el.addEventListener('escape', handleEscape as EventListener);
    el.addEventListener('focus-scope-mount', handleMount as EventListener);
    return () => {
      el.removeEventListener('escape', handleEscape as EventListener);
      el.removeEventListener('focus-scope-mount', handleMount as EventListener);
    };
  }, [onEscape, onFocusScopeMount]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (active) el.setAttribute('active', '');
    else el.removeAttribute('active');
    if (trapped === false) el.setAttribute('trapped', 'false');
    else if (trapped) el.setAttribute('trapped', '');
    else el.removeAttribute('trapped');
    if (loop === false) el.setAttribute('loop', 'false');
    else if (loop) el.setAttribute('loop', '');
    else el.removeAttribute('loop');
    if (restoreFocus === false) el.setAttribute('restore-focus', 'false');
    else if (restoreFocus) el.setAttribute('restore-focus', '');
    else el.removeAttribute('restore-focus');
    if (autoFocus) el.setAttribute('auto-focus', autoFocus);
    else el.removeAttribute('auto-focus');
    if (inertOthers) el.setAttribute('inert-others', '');
    else el.removeAttribute('inert-others');
    if (headless) el.setAttribute('headless', '');
    else el.removeAttribute('headless');
  }, [active, autoFocus, headless, inertOthers, loop, restoreFocus, trapped]);

  return React.createElement('ui-focus-scope', { ref, ...rest }, children);
});

FocusScope.displayName = 'FocusScope';

export default FocusScope;
