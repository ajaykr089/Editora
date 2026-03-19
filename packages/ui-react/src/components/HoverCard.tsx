import React, { useEffect, useLayoutEffect, useImperativeHandle, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type HoverCardElement = HTMLElement & {
  open: boolean;
};

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
  const ref = useRef<HoverCardElement | null>(null);

  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleOpen = () => onOpen?.();
    const handleClose = () => onClose?.();
    const handleChange = (event: Event) => {
      const next = (event as CustomEvent<{ open?: boolean }>).detail?.open;
      if (typeof next === 'boolean') onChange?.(next);
    };

    el.addEventListener('open', handleOpen as EventListener);
    el.addEventListener('close', handleClose as EventListener);
    el.addEventListener('change', handleChange as EventListener);

    return () => {
      el.removeEventListener('open', handleOpen as EventListener);
      el.removeEventListener('close', handleClose as EventListener);
      el.removeEventListener('change', handleChange as EventListener);
    };
  }, [onOpen, onClose, onChange]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || open == null) return;
    if (open) el.setAttribute('open', '');
    else el.removeAttribute('open');
  }, [open]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof delay === 'number') el.setAttribute('delay', String(delay));
    else el.removeAttribute('delay');

    if (typeof closeDelay === 'number') el.setAttribute('close-delay', String(closeDelay));
    else el.removeAttribute('close-delay');

    if (placement) el.setAttribute('placement', placement);
    else el.removeAttribute('placement');

    if (typeof offset === 'number') el.setAttribute('offset', String(offset));
    else el.removeAttribute('offset');

    if (variant && variant !== 'default') el.setAttribute('variant', variant);
    else el.removeAttribute('variant');

    if (tone && tone !== 'default') el.setAttribute('tone', tone);
    else el.removeAttribute('tone');

    if (density && density !== 'default') el.setAttribute('density', density);
    else el.removeAttribute('density');

    if (shape && shape !== 'default') el.setAttribute('shape', shape);
    else el.removeAttribute('shape');

    if (elevation && elevation !== 'default') el.setAttribute('elevation', elevation);
    else el.removeAttribute('elevation');

    if (headless) el.setAttribute('headless', '');
    else el.removeAttribute('headless');
  }, [delay, closeDelay, placement, offset, variant, tone, density, shape, elevation, headless]);

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
