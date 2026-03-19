import React, { useEffect, useLayoutEffect, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
import { warnIfElementNotRegistered } from './_internals';

type UISelectionPopupElement = HTMLElement & {
  openFor?: (anchorId: string) => void;
  close?: () => void;
};

export type SelectionPopupContentProps = React.HTMLAttributes<HTMLElement>;

export type SelectionPopupProps = Omit<React.HTMLAttributes<HTMLElement>, 'onOpen' | 'onClose'> & {
  anchorId?: string;
  open?: boolean;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  offset?: number;
  strategy?: 'fixed' | 'absolute';
  arrow?: boolean;
  variant?: 'default' | 'surface' | 'soft' | 'glass' | 'contrast';
  tone?: 'brand' | 'success' | 'warning' | 'danger';
  radius?: 'none' | 'large' | 'full' | string;
  size?: 'sm' | 'md' | 'lg';
  closeOnOutside?: boolean;
  closeOnEscape?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
};

const SelectionPopupRoot = React.forwardRef<UISelectionPopupElement, SelectionPopupProps>(function SelectionPopup(props, forwardedRef) {
  const {
    children,
    anchorId,
    open,
    placement,
    offset,
    strategy,
    arrow,
    variant,
    tone,
    radius,
    size,
    closeOnOutside,
    closeOnEscape,
    onOpen,
    onClose,
    onOpenChange,
    ...rest
  } = props;
  const ref = useRef<UISelectionPopupElement | null>(null);

  React.useImperativeHandle(forwardedRef, () => ref.current as UISelectionPopupElement);

  useEffect(() => {
    warnIfElementNotRegistered('ui-selection-popup', 'SelectionPopup');
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const openHandler = () => {
      onOpen?.();
      onOpenChange?.(true);
    };

    const closeHandler = () => {
      onClose?.();
      onOpenChange?.(false);
    };

    el.addEventListener('open', openHandler as EventListener);
    el.addEventListener('close', closeHandler as EventListener);
    return () => {
      el.removeEventListener('open', openHandler as EventListener);
      el.removeEventListener('close', closeHandler as EventListener);
    };
  }, [onOpen, onClose, onOpenChange]);

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

    const syncBooleanAttr = (name: string, enabled: boolean | undefined, defaultValue: boolean | undefined = undefined) => {
      if (enabled == null) {
        if (defaultValue !== undefined) {
          syncAttr(name, defaultValue ? null : 'false');
        }
        return;
      }
      if (enabled) syncAttr(name, '');
      else syncAttr(name, 'false');
    };

    syncAttr('anchor-id', anchorId ?? null);
    syncAttr('placement', placement && placement !== 'top' ? placement : null);
    syncAttr('offset', typeof offset === 'number' && Number.isFinite(offset) ? String(offset) : null);
    syncAttr('strategy', strategy && strategy !== 'fixed' ? strategy : null);
    syncAttr('variant', variant && variant !== 'default' ? variant : null);
    syncAttr('tone', tone && tone !== 'brand' ? tone : null);
    syncAttr('radius', radius ? String(radius) : null);
    syncAttr('size', size && size !== 'md' ? size : null);
    syncBooleanAttr('arrow', arrow);
    syncBooleanAttr('close-on-outside', closeOnOutside, true);
    syncBooleanAttr('close-on-escape', closeOnEscape, true);

    if (open && anchorId) {
      el.openFor?.(anchorId);
    } else if (open) {
      el.setAttribute('open', '');
    } else if (open === false) {
      el.close?.();
    } else {
      el.removeAttribute('open');
    }
  }, [
    open,
    anchorId,
    placement,
    offset,
    strategy,
    arrow,
    variant,
    tone,
    radius,
    size,
    closeOnOutside,
    closeOnEscape
  ]);

  return React.createElement('ui-selection-popup', { ref, ...rest }, children);
});

SelectionPopupRoot.displayName = 'SelectionPopup';

/**
 * SelectionPopup.Content - Renders content in the `content` slot
 * @example
 * ```tsx
 * <SelectionPopup anchorId="my-anchor" open>
 *   <SelectionPopup.Content>
 *     <button>Bold</button>
 *     <button>Comment</button>
 *   </SelectionPopup.Content>
 * </SelectionPopup>
 * ```
 */
const SelectionPopupContent = React.forwardRef<HTMLElement, SelectionPopupContentProps>(
  function SelectionPopupContent({ children, ...props }, ref) {
    return React.createElement('div', { ref, slot: 'content', ...props }, children);
  }
);

SelectionPopupContent.displayName = 'SelectionPopup.Content';

export const SelectionPopup = Object.assign(SelectionPopupRoot, {
  Content: SelectionPopupContent,
});

export default SelectionPopup;
