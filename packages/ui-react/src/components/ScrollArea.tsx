import React, { useEffect, useLayoutEffect, useRef } from 'react';

import '@editora/ui-core/scroll-area';
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type ScrollAreaProps = React.HTMLAttributes<HTMLElement> & {
  orientation?: 'vertical' | 'horizontal' | 'both';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'soft' | 'inset' | 'contrast' | 'minimal';
  tone?: 'neutral' | 'brand' | 'info' | 'success' | 'warning' | 'danger';
  autoHide?: boolean;
  shadows?: boolean;
  onScrollChange?: (detail: {
    scrollTop: number;
    scrollLeft: number;
    maxScrollTop: number;
    maxScrollLeft: number;
    progressY: number;
    progressX: number;
  }) => void;
  onReachStart?: () => void;
  onReachEnd?: () => void;
};

export const ScrollArea = React.forwardRef<HTMLElement, ScrollAreaProps>(function ScrollArea(
  {
    orientation,
    size,
    variant,
    tone,
    autoHide,
    shadows,
    onScrollChange,
    onReachStart,
    onReachEnd,
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

    const handleScroll = (event: Event) => {
      const detail = (event as CustomEvent<any>).detail;
      if (detail) onScrollChange?.(detail);
    };

    const start = () => onReachStart?.();
    const end = () => onReachEnd?.();

    el.addEventListener('scroll', handleScroll as EventListener);
    el.addEventListener('reach-start', start as EventListener);
    el.addEventListener('reach-end', end as EventListener);

    return () => {
      el.removeEventListener('scroll', handleScroll as EventListener);
      el.removeEventListener('reach-start', start as EventListener);
      el.removeEventListener('reach-end', end as EventListener);
    };
  }, [onScrollChange, onReachStart, onReachEnd]);

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

    const syncBoolState = (name: string, enabled: boolean | undefined) => {
      const current = el.getAttribute(name);
      if (enabled == null) {
        if (current != null) el.removeAttribute(name);
        return;
      }
      const next = enabled ? 'true' : 'false';
      if (current !== next) el.setAttribute(name, next);
    };

    syncAttr('orientation', orientation && orientation !== 'vertical' ? orientation : null);
    syncAttr('size', size && size !== 'md' ? size : null);
    syncAttr('variant', variant && variant !== 'default' ? variant : null);
    syncAttr('tone', tone && tone !== 'neutral' ? tone : null);
    syncBoolState('auto-hide', autoHide);
    syncBoolState('shadows', shadows);
  }, [orientation, size, variant, tone, autoHide, shadows]);

  return React.createElement('ui-scroll-area', { ref, ...rest }, children);
});

ScrollArea.displayName = 'ScrollArea';
