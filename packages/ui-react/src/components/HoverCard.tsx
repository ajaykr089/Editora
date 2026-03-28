import React from 'react';
import {
  getCustomEventDetail,
  syncBooleanAttribute,
  syncNumberAttribute,
  syncStringAttribute,
  useElementAttributes,
  useElementEventListeners,
  useForwardedHostRef,
} from './_internals';

export type HoverCardProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onOpen' | 'onClose'> & {
  open?: boolean;
  delay?: number;
  closeDelay?: number;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  offset?: number;
  variant?: 'default' | 'line' | 'glass' | 'contrast' | 'minimal' | 'elevated';
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger';
  density?: 'default' | 'compact' | 'comfortable';
  shape?: 'default' | 'square' | 'soft';
  elevation?: 'default' | 'none' | 'low' | 'high';
  headless?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onChange?: (open: boolean) => void;
};

export type HoverCardTriggerProps = React.HTMLAttributes<HTMLElement>;

export type HoverCardContentProps = React.HTMLAttributes<HTMLElement>;

const HoverCardRoot = React.forwardRef<HTMLElement, HoverCardProps>(function HoverCard(
  {
    children,
    open,
    delay,
    closeDelay,
    placement,
    offset,
    variant,
    tone,
    density,
    shape,
    elevation,
    headless,
    onOpen,
    onClose,
    onChange,
    ...rest
  },
  forwardedRef
) {
  const ref = useForwardedHostRef<HTMLElement>(forwardedRef);

  const handleOpen = React.useCallback(() => {
    onOpen?.();
  }, [onOpen]);

  const handleClose = React.useCallback(() => {
    onClose?.();
  }, [onClose]);

  const handleChange = React.useCallback((event: Event) => {
    const next = getCustomEventDetail<{ open?: boolean }>(event)?.open;
    if (typeof next === 'boolean') onChange?.(next);
  }, [onChange]);

  useElementEventListeners(
    ref,
    [
      { type: 'open', listener: handleOpen as EventListener },
      { type: 'close', listener: handleClose as EventListener },
      { type: 'change', listener: handleChange },
    ],
    [handleOpen, handleClose, handleChange]
  );

  useElementAttributes(ref, (el) => {
    if (typeof open === 'boolean') syncBooleanAttribute(el, 'open', open);
    else syncStringAttribute(el, 'open', null);
    syncNumberAttribute(el, 'delay', delay);
    syncNumberAttribute(el, 'close-delay', closeDelay);
    syncStringAttribute(el, 'placement', placement ?? null);
    syncNumberAttribute(el, 'offset', offset);
    syncStringAttribute(el, 'variant', variant && variant !== 'default' ? variant : null);
    syncStringAttribute(el, 'tone', tone && tone !== 'default' ? tone : null);
    syncStringAttribute(el, 'density', density && density !== 'default' ? density : null);
    syncStringAttribute(el, 'shape', shape && shape !== 'default' ? shape : null);
    syncStringAttribute(el, 'elevation', elevation && elevation !== 'default' ? elevation : null);
    syncBooleanAttribute(el, 'headless', headless);
  }, [open, delay, closeDelay, placement, offset, variant, tone, density, shape, elevation, headless]);

  return React.createElement('ui-hover-card', { ref, ...rest }, children);
});

HoverCardRoot.displayName = 'HoverCard';

/**
 * HoverCard.Trigger - Wraps the interactive trigger element
 * @example
 * ```tsx
 * <HoverCard>
 *   <HoverCard.Trigger asChild>
 *     <button>Hover me</button>
 *   </HoverCard.Trigger>
 *   <HoverCard.Content>Hover content</HoverCard.Content>
 * </HoverCard>
 * ```
 */
const HoverCardTrigger = React.forwardRef<HTMLElement, HoverCardTriggerProps>(
  function HoverCardTrigger({ ...props }, ref) {
    return React.createElement('div', { ref, ...props });
  }
);

HoverCardTrigger.displayName = 'HoverCard.Trigger';

/**
 * HoverCard.Content - Wraps the hover card content with slot="card"
 * @example
 * ```tsx
 * <HoverCard>
 *   <button>Hover me</button>
 *   <HoverCard.Content>
 *     <strong>Title</strong>
 *     <p>Description</p>
 *   </HoverCard.Content>
 * </HoverCard>
 * ```
 */
const HoverCardContent = React.forwardRef<HTMLElement, HoverCardContentProps>(
  function HoverCardContent({ children, ...props }, ref) {
    return React.createElement('div', { ref, slot: 'card', ...props }, children);
  }
);

HoverCardContent.displayName = 'HoverCard.Content';

export const HoverCard = Object.assign(HoverCardRoot, {
  Trigger: HoverCardTrigger,
  Content: HoverCardContent,
});

export default HoverCard;
