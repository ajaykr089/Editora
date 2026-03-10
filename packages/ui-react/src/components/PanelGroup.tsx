import React, { useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type LayoutChangeDetail = {
  sizes: number[];
};

type ResizeDetail = {
  index: number;
  sizes?: number[];
};

type PanelGroupProps = Omit<React.HTMLAttributes<HTMLElement>, 'autoSave'> & {
  orientation?: 'horizontal' | 'vertical';
  storageKey?: string;
  autoSave?: boolean;
  onLayoutChange?: (detail: LayoutChangeDetail) => void;
  onResizeStart?: (detail: ResizeDetail) => void;
  onResize?: (detail: ResizeDetail) => void;
  onResizeEnd?: (detail: ResizeDetail) => void;
};

type PanelProps = React.HTMLAttributes<HTMLElement> & {
  size?: number;
  minSize?: number;
  maxSize?: number;
  collapsedSize?: number;
  collapsed?: boolean;
};

type SplitterProps = React.HTMLAttributes<HTMLElement> & {
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  ariaLabel?: string;
};

export const PanelGroup = React.forwardRef<HTMLElement, PanelGroupProps>(function PanelGroup(
  { orientation, storageKey, autoSave, children, onLayoutChange, onResizeStart, onResize, onResizeEnd, ...rest },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);
  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const layoutHandler = (event: Event) => onLayoutChange?.((event as CustomEvent<LayoutChangeDetail>).detail);
    const resizeStartHandler = (event: Event) => onResizeStart?.((event as CustomEvent<ResizeDetail>).detail);
    const resizeHandler = (event: Event) => onResize?.((event as CustomEvent<ResizeDetail>).detail);
    const resizeEndHandler = (event: Event) => onResizeEnd?.((event as CustomEvent<ResizeDetail>).detail);

    el.addEventListener('layout-change', layoutHandler as EventListener);
    el.addEventListener('resize-start', resizeStartHandler as EventListener);
    el.addEventListener('resize', resizeHandler as EventListener);
    el.addEventListener('resize-end', resizeEndHandler as EventListener);

    return () => {
      el.removeEventListener('layout-change', layoutHandler as EventListener);
      el.removeEventListener('resize-start', resizeStartHandler as EventListener);
      el.removeEventListener('resize', resizeHandler as EventListener);
      el.removeEventListener('resize-end', resizeEndHandler as EventListener);
    };
  }, [onLayoutChange, onResize, onResizeEnd, onResizeStart]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (orientation && orientation !== 'horizontal') el.setAttribute('orientation', orientation);
    else el.removeAttribute('orientation');
    if (storageKey) el.setAttribute('storage-key', storageKey);
    else el.removeAttribute('storage-key');
    if (autoSave) el.setAttribute('auto-save', '');
    else el.removeAttribute('auto-save');
  }, [orientation, storageKey, autoSave]);

  return React.createElement('ui-panel-group', { ref, ...rest }, children);
});

export const Panel = React.forwardRef<HTMLElement, PanelProps>(function Panel(
  { size, minSize, maxSize, collapsedSize, collapsed, children, ...rest },
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

    if (collapsed) el.setAttribute('collapsed', '');
    else el.removeAttribute('collapsed');
    syncAttr('size', size != null ? String(size) : null);
    syncAttr('min-size', minSize != null ? String(minSize) : null);
    syncAttr('max-size', maxSize != null ? String(maxSize) : null);
    syncAttr('collapsed-size', collapsedSize != null ? String(collapsedSize) : null);
  }, [collapsed, collapsedSize, maxSize, minSize, size]);

  return React.createElement('ui-panel', { ref, ...rest }, children);
});

export const Splitter = React.forwardRef<HTMLElement, SplitterProps>(function Splitter(
  { disabled, orientation, ariaLabel, children, ...rest },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);
  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (disabled) el.setAttribute('disabled', '');
    else el.removeAttribute('disabled');
    if (orientation) el.setAttribute('orientation', orientation);
    else el.removeAttribute('orientation');
    if (ariaLabel) el.setAttribute('aria-label', ariaLabel);
    else el.removeAttribute('aria-label');
  }, [ariaLabel, disabled, orientation]);

  return React.createElement('ui-splitter', { ref, ...rest }, children);
});

PanelGroup.displayName = 'PanelGroup';
Panel.displayName = 'Panel';
Splitter.displayName = 'Splitter';

export default PanelGroup;
