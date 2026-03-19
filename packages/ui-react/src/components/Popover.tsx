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

export type PopoverTriggerProps = React.HTMLAttributes<HTMLElement>;

export type PopoverContentProps = React.HTMLAttributes<HTMLElement>;

export type PopoverProps = Omit<React.HTMLAttributes<HTMLElement>, 'onOpen' | 'onClose'> & {
  open?: boolean;
  placement?: PopoverPlacement;
  offset?: number;
  shift?: boolean;
  flip?: boolean;
  closeOnEscape?: boolean;
  closeOnOutside?: boolean;
  variant?: 'surface' | 'soft' | 'solid' | 'glass' | 'contrast' | 'minimal';
  tone?: 'brand' | 'neutral' | 'info' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg' | '1' | '2' | '3';
  radius?: number | string;
  elevation?: 'none' | 'low' | 'high';
  onOpen?: () => void;
  onClose?: () => void;
  onOpenChange?: (detail: PopoverOpenChangeDetail) => void;
};

const PopoverRoot = React.forwardRef<PopoverElement, PopoverProps>(function Popover(
  {
    children,
    open,
    placement,
    offset,
    shift,
    flip,
    closeOnEscape,
    closeOnOutside,
    variant,
    tone,
    size,
    radius,
    elevation,
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
    syncAttr('variant', variant && variant !== 'surface' ? variant : null, variant !== undefined);
    syncAttr('tone', tone && tone !== 'brand' ? tone : null, tone !== undefined);
    syncAttr('size', size && size !== 'md' && size !== '2' ? size : null, size !== undefined);
    syncAttr(
      'radius',
      radius !== undefined && radius !== null && String(radius).trim() !== '' ? String(radius) : null,
      radius !== undefined
    );
    syncAttr('elevation', elevation && elevation !== 'low' ? elevation : null, elevation !== undefined);
  }, [open, placement, offset, shift, flip, closeOnEscape, closeOnOutside, variant, tone, size, radius, elevation]);

  return React.createElement('ui-popover', { ref, ...rest }, children);
});

PopoverRoot.displayName = 'Popover';

/**
 * Popover.Trigger - Renders the trigger element in the `trigger` slot
 * @example
 * ```tsx
 * <Popover>
 *   <Popover.Trigger><button>Open</button></Popover.Trigger>
 *   <Popover.Content>Content here</Popover.Content>
 * </Popover>
 * ```
 */
const PopoverTrigger = React.forwardRef<HTMLElement, PopoverTriggerProps>(
  function PopoverTrigger({ children, ...props }, ref) {
    return React.createElement('span', { ref, slot: 'trigger', ...props }, children);
  }
);

PopoverTrigger.displayName = 'Popover.Trigger';

/**
 * Popover.Content - Renders the panel body in the `content` slot
 * @example
 * ```tsx
 * <Popover>
 *   <Popover.Trigger><button>Open</button></Popover.Trigger>
 *   <Popover.Content>Content here</Popover.Content>
 * </Popover>
 * ```
 */
const PopoverContent = React.forwardRef<HTMLElement, PopoverContentProps>(
  function PopoverContent({ children, ...props }, ref) {
    return React.createElement('div', { ref, slot: 'content', ...props }, children);
  }
);

PopoverContent.displayName = 'Popover.Content';

export const Popover = Object.assign(PopoverRoot, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
});

export default Popover;
