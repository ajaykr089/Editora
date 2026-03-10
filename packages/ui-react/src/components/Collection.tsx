import React, { useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type CollectionChangeDetail = Record<string, never>;

export type CollectionProps = React.HTMLAttributes<HTMLElement> & {
  itemSelector?: string;
  directItemSelector?: string;
  itemRole?: string;
  container?: ParentNode | null;
  items?: HTMLElement[] | null;
  onCollectionChange?: () => void;
};

export const Collection = React.forwardRef<HTMLElement, CollectionProps>(function Collection(
  { children, itemSelector, directItemSelector, itemRole, container, items, onCollectionChange, ...rest },
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
    el.container = container ?? null;
    el.items = items ?? null;
  }, [container, directItemSelector, itemRole, itemSelector, items]);

  return React.createElement('ui-collection', { ref, ...rest }, children);
});

Collection.displayName = 'Collection';

export default Collection;
