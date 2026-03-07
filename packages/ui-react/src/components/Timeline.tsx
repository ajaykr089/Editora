import React, { useEffect, useLayoutEffect, useImperativeHandle, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type TimelineItem = {
  title: string;
  description?: string;
  time?: string;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  active?: boolean;
};

export type TimelineProps = React.HTMLAttributes<HTMLElement> & {
  items?: TimelineItem[];
  variant?: 'default' | 'contrast';
  headless?: boolean;
};

export const Timeline = React.forwardRef<HTMLElement, TimelineProps>(function Timeline(
  { items, variant, headless, children, ...rest },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);

  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

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

    const syncBool = (name: string, enabled: boolean | undefined) => {
      if (enabled) syncAttr(name, '');
      else syncAttr(name, null);
    };

    if (items && items.length) {
      try {
        syncAttr('items', JSON.stringify(items));
      } catch {
        syncAttr('items', null);
      }
    } else {
      syncAttr('items', null);
    }

    syncAttr('variant', variant && variant !== 'default' ? variant : null);
    syncBool('headless', headless);
  }, [items, variant, headless]);

  return React.createElement('ui-timeline', { ref, ...rest }, children);
});

Timeline.displayName = 'Timeline';

export default Timeline;
