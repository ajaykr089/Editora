import React, { useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type TreeSelectDetail = {
  value: string;
  label: string;
};

export type TreeExpandedChangeDetail = {
  value: string;
  expanded: boolean;
};

export type TreeProps = Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> & {
  value?: string;
  indentSize?: string;
  onSelect?: (detail: TreeSelectDetail) => void;
  onExpandedChange?: (detail: TreeExpandedChangeDetail) => void;
};

export type TreeItemProps = React.HTMLAttributes<HTMLElement> & {
  value: string;
  label?: React.ReactNode;
  expanded?: boolean;
  selected?: boolean;
  disabled?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  children?: React.ReactNode;
};

const TreeItemComponent = React.forwardRef<HTMLElement, TreeItemProps>(function TreeItem(
  { children, value, label, expanded, selected, disabled, prefix, suffix, ...rest },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);
  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.setAttribute('value', value);
    if (expanded) el.setAttribute('expanded', '');
    else el.removeAttribute('expanded');
    if (selected) el.setAttribute('selected', '');
    else el.removeAttribute('selected');
    if (disabled) el.setAttribute('disabled', '');
    else el.removeAttribute('disabled');
  }, [value, expanded, selected, disabled]);

  return React.createElement(
    'ui-tree-item',
    { ref, ...rest },
    prefix != null ? React.createElement('span', { slot: 'prefix' }, prefix) : null,
    label != null ? React.createElement('span', { slot: 'label' }, label) : null,
    suffix != null ? React.createElement('span', { slot: 'suffix' }, suffix) : null,
    children
  );
});
TreeItemComponent.displayName = 'Tree.Item';

const TreeRoot = React.forwardRef<HTMLElement, TreeProps>(function TreeRoot(
  { children, value, indentSize, onSelect, onExpandedChange, ...rest },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);
  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleSelect = (event: Event) => {
      const detail = (event as CustomEvent<TreeSelectDetail>).detail;
      if (detail) onSelect?.(detail);
    };

    const handleExpandedChange = (event: Event) => {
      const detail = (event as CustomEvent<TreeExpandedChangeDetail>).detail;
      if (detail) onExpandedChange?.(detail);
    };

    el.addEventListener('select', handleSelect as EventListener);
    el.addEventListener('expanded-change', handleExpandedChange as EventListener);
    return () => {
      el.removeEventListener('select', handleSelect as EventListener);
      el.removeEventListener('expanded-change', handleExpandedChange as EventListener);
    };
  }, [onSelect, onExpandedChange]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (value) el.setAttribute('value', value);
    else el.removeAttribute('value');

    if (indentSize) el.setAttribute('indent-size', indentSize);
    else el.removeAttribute('indent-size');
  }, [value, indentSize]);

  return React.createElement('ui-tree', { ref, ...rest }, children);
});

TreeRoot.displayName = 'Tree';

export const Tree = Object.assign(TreeRoot, {
  Item: TreeItemComponent,
});

export default Tree;
