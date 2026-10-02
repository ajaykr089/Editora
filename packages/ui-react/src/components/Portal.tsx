import React, { useEffect, useLayoutEffect, useRef } from 'react';

import '@editora/ui-core/portal';
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type PortalEventDetail = { count: number };

type PortalProps = React.HTMLAttributes<HTMLElement> & {
  target?: string;
  headless?: boolean;
  disabled?: boolean;
  strategy?: 'append' | 'prepend';
  onMount?: (detail: PortalEventDetail) => void;
  onUnmount?: (detail: PortalEventDetail) => void;
  onSync?: (detail: PortalEventDetail) => void;
  onTargetMissing?: (detail: { target: string }) => void;
};

export const Portal = React.forwardRef<HTMLElement, PortalProps>(function Portal(
  { target, headless, disabled, strategy, onMount, onUnmount, onSync, onTargetMissing, children, ...rest },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);
  React.useImperativeHandle(forwardedRef, () => ref.current as any);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMountHandler = (event: Event) => onMount?.(((event as CustomEvent<PortalEventDetail>).detail || { count: 0 }));
    const onUnmountHandler = (event: Event) => onUnmount?.(((event as CustomEvent<PortalEventDetail>).detail || { count: 0 }));
    const onSyncHandler = (event: Event) => onSync?.(((event as CustomEvent<PortalEventDetail>).detail || { count: 0 }));
    const onMissingHandler = (event: Event) => {
      const detail = (event as CustomEvent<{ target: string }>).detail;
      if (detail) onTargetMissing?.(detail);
    };
    el.addEventListener('mount', onMountHandler as EventListener);
    el.addEventListener('unmount', onUnmountHandler as EventListener);
    el.addEventListener('sync', onSyncHandler as EventListener);
    el.addEventListener('target-missing', onMissingHandler as EventListener);
    return () => {
      el.removeEventListener('mount', onMountHandler as EventListener);
      el.removeEventListener('unmount', onUnmountHandler as EventListener);
      el.removeEventListener('sync', onSyncHandler as EventListener);
      el.removeEventListener('target-missing', onMissingHandler as EventListener);
    };
  }, [onMount, onUnmount, onSync, onTargetMissing]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (target) el.setAttribute('target', target);
    else el.removeAttribute('target');

    if (strategy && strategy !== 'append') el.setAttribute('strategy', strategy);
    else el.removeAttribute('strategy');

    if (headless) el.setAttribute('headless', '');
    else el.removeAttribute('headless');

    if (disabled) el.setAttribute('disabled', '');
    else el.removeAttribute('disabled');
  }, [target, strategy, headless, disabled]);

  return React.createElement('ui-portal', { ref, ...rest }, children);
});

Portal.displayName = 'Portal';
