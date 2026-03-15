import React, { useEffect, useLayoutEffect, useRef, useImperativeHandle } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
import { warnIfElementNotRegistered } from './_internals';

type UIFloatingToolbarElement = HTMLElement & {
  showForAnchorId?: (anchorId: string) => void;
  hide?: () => void;
  openToolbar?: () => void;
  closeToolbar?: (reason?: string) => void;
};

export type FloatingToolbarProps = Omit<React.HTMLAttributes<HTMLElement>, 'onOpen' | 'onClose'> & {
  anchorId?: string;
  open?: boolean;
  placement?: 'auto' | 'top' | 'bottom';
  align?: 'start' | 'center' | 'end';
  offset?: number;
  variant?: 'default' | 'soft' | 'flat' | 'glass' | 'contrast';
  density?: 'default' | 'compact' | 'comfortable';
  shape?: 'default' | 'square' | 'soft';
  elevation?: 'default' | 'none' | 'low' | 'high';
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger';
  closeOnOutside?: boolean;
  closeOnEscape?: boolean;
  onOpen?: () => void;
  onClose?: (detail: { reason?: string }) => void;
  onOpenChange?: (open: boolean, detail?: { reason?: string }) => void;
  onRequestClose?: (detail: { reason: string }) => void;
};

export type FloatingToolbarToolbarProps = React.HTMLAttributes<HTMLDivElement>;

type FloatingToolbarComponent = React.ForwardRefExoticComponent<FloatingToolbarProps & React.RefAttributes<HTMLElement>> & {
  Toolbar: typeof FloatingToolbarToolbar;
};

const FloatingToolbarRoot = React.forwardRef<HTMLElement, FloatingToolbarProps>(function FloatingToolbar(
  {
    children,
    anchorId,
    open,
    placement,
    align,
    offset,
    variant,
    density,
    shape,
    elevation,
    tone,
    closeOnOutside,
    closeOnEscape,
    onOpen,
    onClose,
    onOpenChange,
    onRequestClose,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<UIFloatingToolbarElement | null>(null);

  useImperativeHandle(forwardedRef, () => ref.current as any);

  useEffect(() => {
    warnIfElementNotRegistered('ui-floating-toolbar', 'FloatingToolbar');
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onOpenEvent = () => {
      onOpen?.();
      onOpenChange?.(true);
    };

    const onCloseEvent = (event: Event) => {
      const detail = (event as CustomEvent<{ reason?: string }>).detail || {};
      onClose?.(detail);
      onOpenChange?.(false, detail);
    };

    const onRequestCloseEvent = (event: Event) => {
      const detail = (event as CustomEvent<{ reason?: string }>).detail || {};
      if (typeof detail.reason === 'string') onRequestClose?.({ reason: detail.reason });
    };

    el.addEventListener('open', onOpenEvent as EventListener);
    el.addEventListener('close', onCloseEvent as EventListener);
    el.addEventListener('request-close', onRequestCloseEvent as EventListener);
    return () => {
      el.removeEventListener('open', onOpenEvent as EventListener);
      el.removeEventListener('close', onCloseEvent as EventListener);
      el.removeEventListener('request-close', onRequestCloseEvent as EventListener);
    };
  }, [onOpen, onClose, onOpenChange, onRequestClose]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const syncAttr = (name: string, value: string | null) => {
      const current = el.getAttribute(name);
      if (value == null) {
        if (current != null) el.removeAttribute(name);
        return;
      }
      if (current !== value) el.setAttribute(name, value);
    };

    const syncBoolAttr = (name: string, value: boolean | undefined, defaultValue: boolean | undefined = undefined) => {
      if (value == null) {
        if (defaultValue !== undefined) syncAttr(name, defaultValue ? null : 'false');
        return;
      }
      syncAttr(name, value ? '' : 'false');
    };

    syncAttr('anchor-id', anchorId ?? null);
    syncAttr('placement', placement && placement !== 'auto' ? placement : null);
    syncAttr('align', align && align !== 'center' ? align : null);
    syncAttr('offset', typeof offset === 'number' && Number.isFinite(offset) ? String(offset) : null);
    syncAttr('variant', variant && variant !== 'default' ? variant : null);
    syncAttr('density', density && density !== 'default' ? density : null);
    syncAttr('shape', shape && shape !== 'default' ? shape : null);
    syncAttr('elevation', elevation && elevation !== 'default' ? elevation : null);
    syncAttr('tone', tone && tone !== 'default' && tone !== 'brand' ? tone : null);
    syncBoolAttr('close-on-outside', closeOnOutside, true);
    syncBoolAttr('close-on-escape', closeOnEscape, true);

    if (open && anchorId) {
      el.showForAnchorId?.(anchorId);
      return;
    }

    if (open) {
      el.openToolbar?.();
      return;
    }

    if (open === false) {
      el.closeToolbar?.('programmatic');
      return;
    }

    el.removeAttribute('open');
  }, [
    open,
    anchorId,
    placement,
    align,
    offset,
    variant,
    density,
    shape,
    elevation,
    tone,
    closeOnOutside,
    closeOnEscape
  ]);

  return React.createElement('ui-floating-toolbar', { ref, ...rest }, children);
});

FloatingToolbarRoot.displayName = 'FloatingToolbar';

export const FloatingToolbarToolbar = React.forwardRef<HTMLDivElement, FloatingToolbarToolbarProps>(function FloatingToolbarToolbar(
  props,
  ref
) {
  return <div {...props} ref={ref} slot="toolbar" />;
});

FloatingToolbarToolbar.displayName = 'FloatingToolbar.Toolbar';

export const FloatingToolbar = Object.assign(FloatingToolbarRoot, {
  Toolbar: FloatingToolbarToolbar
}) as FloatingToolbarComponent;

export default FloatingToolbar;
