import * as React from 'react';
import { warnIfElementNotRegistered } from './_internals';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

export type PopoverPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'right'
  | 'right-start'
  | 'right-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end';

export type PopoverOpenChangeDetail = { open: boolean };

export type PopoverElement = HTMLElement & {
  open: () => void;
  close: () => void;
  toggle: () => void;
  updatePosition: () => void;
};

export type PopoverProps = React.HTMLAttributes<HTMLElement> & {
  open?: boolean;
  placement?: PopoverPlacement;
  offset?: number;
  shift?: boolean;
  flip?: boolean;
  closeOnEscape?: boolean;
  closeOnOutside?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onOpenChange?: (detail: PopoverOpenChangeDetail) => void;
};

export const Popover = React.forwardRef<PopoverElement, PopoverProps>(function Popover(
  {
    children,
    open,
    placement,
    offset,
    shift,
    flip,
    closeOnEscape,
    closeOnOutside,
    onOpen,
    onClose,
    onOpenChange,
    ...rest
  },
  forwardedRef
) {
  const ref = React.useRef<PopoverElement | null>(null);

  React.useImperativeHandle(forwardedRef, () => ref.current as PopoverElement);

  React.useEffect(() => {
    warnIfElementNotRegistered('ui-popover', 'Popover');
  }, []);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleOpen = () => onOpen?.();
    const handleClose = () => onClose?.();
    const handleOpenChange = (event: Event) => {
      const detail = (event as CustomEvent<PopoverOpenChangeDetail>).detail;
      if (detail) onOpenChange?.(detail);
    };

    el.addEventListener('open', handleOpen as EventListener);
    el.addEventListener('close', handleClose as EventListener);
    el.addEventListener('open-change', handleOpenChange as EventListener);

    return () => {
      el.removeEventListener('open', handleOpen as EventListener);
      el.removeEventListener('close', handleClose as EventListener);
      el.removeEventListener('open-change', handleOpenChange as EventListener);
    };
  }, [onOpen, onClose, onOpenChange]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const syncAttr = (name: string, next: string | null, enabled = true) => {
      if (!enabled) return;
      const current = el.getAttribute(name);
      if (next == null) {
        if (current != null) el.removeAttribute(name);
        return;
      }
      if (current !== next) el.setAttribute(name, next);
    };

    if (typeof open === 'boolean') syncAttr('open', open ? '' : null);
    syncAttr('placement', placement ?? null, placement !== undefined);
    syncAttr('offset', typeof offset === 'number' && Number.isFinite(offset) ? String(offset) : null, offset !== undefined);
    syncAttr('shift', shift === undefined ? null : String(shift), shift !== undefined);
    syncAttr('flip', flip === undefined ? null : String(flip), flip !== undefined);
    syncAttr('close-on-escape', closeOnEscape === undefined ? null : String(closeOnEscape), closeOnEscape !== undefined);
    syncAttr('close-on-outside', closeOnOutside === undefined ? null : String(closeOnOutside), closeOnOutside !== undefined);
  }, [open, placement, offset, shift, flip, closeOnEscape, closeOnOutside]);

  return React.createElement('ui-popover', { ref, ...rest }, children);
});

Popover.displayName = 'Popover';

export default Popover;
