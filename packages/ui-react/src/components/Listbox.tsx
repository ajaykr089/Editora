import React, { useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type ListboxProps = React.HTMLAttributes<HTMLElement> & {
  itemSelector?: string;
  directItemSelector?: string;
  itemRole?: string;
  activeAttribute?: string;
  container?: ParentNode | null;
  items?: HTMLElement[] | null;
  onCollectionChange?: () => void;
};

export const Listbox = React.forwardRef<HTMLElement, ListboxProps>(function Listbox(
  { children, itemSelector, directItemSelector, itemRole, activeAttribute, container, items, onCollectionChange, ...rest },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);
  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleCollectionChange = () => onCollectionChange?.();
    el.addEventListener('collection-change', handleCollectionChange as EventListener);
    return () => {
      el.removeEventListener('collection-change', handleCollectionChange as EventListener);
    };
  }, [onCollectionChange]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current as (HTMLElement & { container?: ParentNode | null; items?: HTMLElement[] | null }) | null;
    if (!el) return;
    if (itemSelector) el.setAttribute('item-selector', itemSelector);
    else el.removeAttribute('item-selector');
    if (directItemSelector) el.setAttribute('direct-item-selector', directItemSelector);
    else el.removeAttribute('direct-item-selector');
    if (itemRole) el.setAttribute('item-role', itemRole);
    else el.removeAttribute('item-role');
    if (activeAttribute) el.setAttribute('active-attribute', activeAttribute);
    else el.removeAttribute('active-attribute');
    el.container = container ?? null;
    el.items = items ?? null;
  }, [activeAttribute, container, directItemSelector, itemRole, itemSelector, items]);

  return React.createElement('ui-listbox', { ref, ...rest }, children);
});

Listbox.displayName = 'Listbox';

export default Listbox;
