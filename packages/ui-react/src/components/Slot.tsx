import React, { useEffect, useLayoutEffect, useImperativeHandle, useRef } from 'react';

import '@editora/ui-core/slot';
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type SlotChangeDetail = {
  name: string;
  count: number;
  empty: boolean;
};

export type SlotProps = React.HTMLAttributes<HTMLElement> & {
  name?: string;
  fallback?: string;
  required?: boolean;
  inline?: boolean;
  align?: 'start' | 'center' | 'end';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'plain' | 'surface' | 'outline' | 'soft' | 'chip' | 'contrast';
  tone?: 'brand' | 'success' | 'warning' | 'danger';
  headless?: boolean;
  onSlotChange?: (detail: SlotChangeDetail) => void;
  onMissing?: () => void;
  onResolved?: () => void;
};

export const Slot = React.forwardRef<HTMLElement, SlotProps>(function Slot(
  {
    children,
    name,
    fallback,
    required,
    inline,
    align,
    size,
    variant,
    tone,
    headless,
    onSlotChange,
    onMissing,
    onResolved,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);

  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const changeHandler = (event: Event) => {
      const detail = (event as CustomEvent<SlotChangeDetail>).detail;
      if (detail) onSlotChange?.(detail);
    };

    const missingHandler = () => onMissing?.();
    const resolvedHandler = () => onResolved?.();

    el.addEventListener('slotchange', changeHandler as EventListener);
    el.addEventListener('missing', missingHandler as EventListener);
    el.addEventListener('resolved', resolvedHandler as EventListener);

    return () => {
      el.removeEventListener('slotchange', changeHandler as EventListener);
      el.removeEventListener('missing', missingHandler as EventListener);
      el.removeEventListener('resolved', resolvedHandler as EventListener);
    };
  }, [onSlotChange, onMissing, onResolved]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const syncAttr = (attr: string, next: string | null) => {
      const current = el.getAttribute(attr);
      if (next == null) {
        if (current != null) el.removeAttribute(attr);
        return;
      }
      if (current !== next) el.setAttribute(attr, next);
    };

    const syncBool = (attr: string, enabled: boolean | undefined) => {
      if (enabled) syncAttr(attr, '');
      else syncAttr(attr, null);
    };

    syncAttr('name', name ? name : null);
    syncAttr('fallback', fallback ? fallback : null);
    syncBool('required', required);
    if (typeof inline === 'boolean') syncAttr('inline', inline ? 'true' : 'false');
    else syncAttr('inline', null);
    syncAttr('align', align && align !== 'start' ? align : null);
    syncAttr('size', size && size !== 'md' ? size : null);
    syncAttr('variant', variant && variant !== 'plain' ? variant : null);
    syncAttr('tone', tone && tone !== 'brand' ? tone : null);
    syncBool('headless', headless);
  }, [name, fallback, required, inline, align, size, variant, tone, headless]);

  return React.createElement('ui-slot', { ref, ...rest }, children);
});

Slot.displayName = 'Slot';

export default Slot;
