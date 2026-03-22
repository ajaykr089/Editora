import React, { useEffect, useLayoutEffect, useImperativeHandle, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type TooltipChangeDetail = {
  open: boolean;
};

type BaseProps = Omit<React.HTMLAttributes<HTMLElement>, 'onOpen' | 'onClose'> & {
  children?: React.ReactNode;
};

export type TooltipProps = BaseProps & {
  text?: string;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  open?: boolean;
  disabled?: boolean;
  headless?: boolean;
  variant?: 'default' | 'soft' | 'contrast' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  tone?: 'default' | 'success' | 'warning' | 'danger';
  delay?: number;
  closeDelay?: number;
  trigger?: 'hover' | 'focus' | 'click' | 'manual' | string;
  offset?: number;
  interactive?: boolean;
  arrow?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
};

export const Tooltip = React.forwardRef<HTMLElement, TooltipProps>(function Tooltip(
  {
    children,
    text,
    placement,
    open,
    disabled,
    headless,
    variant,
    size,
    tone,
    delay,
    closeDelay,
    trigger,
    offset,
    interactive,
    arrow,
    onOpen,
    onClose,
    onOpenChange,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);

  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const openHandler = () => {
      onOpen?.();
    };

    const closeHandler = () => {
      onClose?.();
    };

    const changeHandler = (event: Event) => {
      const detail = (event as CustomEvent<TooltipChangeDetail>).detail;
      if (detail && typeof detail.open === 'boolean') {
        onOpenChange?.(detail.open);
      }
    };

    el.addEventListener('open', openHandler as EventListener);
    el.addEventListener('close', closeHandler as EventListener);
    el.addEventListener('change', changeHandler as EventListener);

    return () => {
      el.removeEventListener('open', openHandler as EventListener);
      el.removeEventListener('close', closeHandler as EventListener);
      el.removeEventListener('change', changeHandler as EventListener);
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

    const syncBool = (name: string, enabled: boolean | undefined) => {
      if (enabled) syncAttr(name, '');
      else syncAttr(name, null);
    };

    syncAttr('text', text || null);
    syncAttr('placement', placement || null);
    syncBool('open', open);
    syncBool('disabled', disabled);
    syncBool('headless', headless);
    syncAttr('variant', variant && variant !== 'default' ? variant : null);
    syncAttr('size', size && size !== 'md' ? size : null);
    syncAttr('tone', tone && tone !== 'default' ? tone : null);
    syncAttr('delay', typeof delay === 'number' && Number.isFinite(delay) ? String(delay) : null);
    syncAttr('close-delay', typeof closeDelay === 'number' && Number.isFinite(closeDelay) ? String(closeDelay) : null);
    syncAttr('trigger', trigger || null);
    syncAttr('offset', typeof offset === 'number' && Number.isFinite(offset) ? String(offset) : null);
    syncBool('interactive', interactive);

    if (typeof arrow === 'boolean') syncAttr('arrow', arrow ? 'true' : 'false');
    else syncAttr('arrow', null);
  }, [text, placement, open, disabled, headless, variant, size, tone, delay, closeDelay, trigger, offset, interactive, arrow]);

  return React.createElement('ui-tooltip', { ref, ...rest }, children);
});

Tooltip.displayName = 'Tooltip';

export default Tooltip;
