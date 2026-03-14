import React, { useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type RovingFocusActiveItemDetail = {
  item: HTMLElement | null;
};

export type RovingFocusGroupProps = React.HTMLAttributes<HTMLElement> & {
  itemSelector?: string;
  directItemSelector?: string;
  activeAttribute?: string | null;
  loop?: boolean;
  container?: ParentNode | null;
  onActiveItemChange?: (detail: RovingFocusActiveItemDetail) => void;
};

export const RovingFocusGroup = React.forwardRef<HTMLElement, RovingFocusGroupProps>(function RovingFocusGroup(
  { children, itemSelector, directItemSelector, activeAttribute, loop, container, onActiveItemChange, ...rest },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);
  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleActiveItemChange = (event: Event) => {
      const detail = (event as CustomEvent<RovingFocusActiveItemDetail>).detail;
      if (detail) onActiveItemChange?.(detail);
    };
    el.addEventListener('active-item-change', handleActiveItemChange as EventListener);
    return () => {
      el.removeEventListener('active-item-change', handleActiveItemChange as EventListener);
    };
  }, [onActiveItemChange]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current as (HTMLElement & { container?: ParentNode | null }) | null;
    if (!el) return;
    if (itemSelector) el.setAttribute('item-selector', itemSelector);
    else el.removeAttribute('item-selector');
    if (directItemSelector) el.setAttribute('direct-item-selector', directItemSelector);
    else el.removeAttribute('direct-item-selector');
    if (activeAttribute === null) el.setAttribute('active-attribute', '');
    else if (activeAttribute) el.setAttribute('active-attribute', activeAttribute);
    else el.removeAttribute('active-attribute');
    if (loop === false) el.setAttribute('loop', 'false');
    else el.removeAttribute('loop');
    el.container = container ?? null;
  }, [activeAttribute, container, directItemSelector, itemSelector, loop]);

  return React.createElement('ui-roving-focus-group', { ref, ...rest }, children);
});

RovingFocusGroup.displayName = 'RovingFocusGroup';

export default RovingFocusGroup;
