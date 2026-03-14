import React, { useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type BaseProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
};

export type DropdownProps = BaseProps & {
  open?: boolean;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  variant?:
    | 'default'
    | 'surface'
    | 'soft'
    | 'filled'
    | 'outline'
    | 'flat'
    | 'line'
    | 'minimal'
    | 'ghost'
    | 'glass'
    | 'solid'
    | 'contrast';
  size?: 'sm' | 'md' | 'lg' | '1' | '2' | '3';
  density?: 'default' | 'compact' | 'comfortable';
  radius?: number | string;
  shape?: 'default' | 'square' | 'soft' | 'rounded' | 'pill';
  elevation?: 'default' | 'none' | 'low' | 'high';
  tone?: 'default' | 'brand' | 'neutral' | 'info' | 'danger' | 'success' | 'warning';
  closeOnSelect?: boolean;
  typeahead?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onChange?: (open: boolean) => void;
  onChangeDetail?: (detail: { open: boolean; reason?: string }) => void;
  onRequestClose?: (detail: { reason: string }) => void;
  onSelect?: (detail: { value?: string; label?: string; checked?: boolean; item?: HTMLElement }) => void;
};

export const Dropdown = React.forwardRef<HTMLElement, DropdownProps>(function Dropdown(
  {
    children,
    open,
    placement,
    variant,
    size,
    density,
    radius,
    shape,
    elevation,
    tone,
    closeOnSelect,
    typeahead,
    onOpen,
    onClose,
    onChange,
    onChangeDetail,
    onRequestClose,
    onSelect,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);

  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleOpen = () => onOpen?.();
    const handleClose = () => onClose?.();
    const handleChange = (event: Event) => {
      const detail = (event as CustomEvent<{ open?: boolean; reason?: string }>).detail || {};
      if (typeof detail.open === 'boolean') onChange?.(detail.open);
      if (typeof detail.open === 'boolean') onChangeDetail?.({ open: detail.open, reason: detail.reason });
    };
    const handleRequestClose = (event: Event) => {
      const detail = (event as CustomEvent<{ reason?: string }>).detail || {};
      if (typeof detail.reason === 'string') onRequestClose?.({ reason: detail.reason });
    };
    const handleSelect = (event: Event) => {
      onSelect?.((event as CustomEvent<{ value?: string; label?: string; checked?: boolean; item?: HTMLElement }>).detail || {});
    };

    el.addEventListener('open', handleOpen as EventListener);
    el.addEventListener('close', handleClose as EventListener);
    el.addEventListener('change', handleChange as EventListener);
    el.addEventListener('request-close', handleRequestClose as EventListener);
    el.addEventListener('select', handleSelect as EventListener);
    return () => {
      el.removeEventListener('open', handleOpen as EventListener);
      el.removeEventListener('close', handleClose as EventListener);
      el.removeEventListener('change', handleChange as EventListener);
      el.removeEventListener('request-close', handleRequestClose as EventListener);
      el.removeEventListener('select', handleSelect as EventListener);
    };
  }, [onOpen, onClose, onChange, onChangeDetail, onRequestClose, onSelect]);

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

    const syncBooleanish = (attr: string, next: boolean | undefined, mode: 'presence' | 'value' = 'presence') => {
      if (mode === 'presence') {
        if (next) {
          if (!el.hasAttribute(attr)) el.setAttribute(attr, '');
        } else if (el.hasAttribute(attr)) {
          el.removeAttribute(attr);
        }
        return;
      }

      if (next == null) {
        if (el.hasAttribute(attr)) el.removeAttribute(attr);
        return;
      }

      const serialized = next ? 'true' : 'false';
      if (el.getAttribute(attr) !== serialized) el.setAttribute(attr, serialized);
    };

    syncBooleanish('open', open);
    syncAttr('placement', placement || null);
    syncAttr('variant', variant && variant !== 'default' && variant !== 'surface' ? variant : null);
    syncAttr('size', size && size !== 'md' && size !== '2' ? size : null);
    syncAttr('density', density && density !== 'default' ? density : null);
    syncAttr('radius', radius == null || radius === '' || radius === 'default' ? null : String(radius));
    syncAttr('shape', shape && shape !== 'default' && shape !== 'rounded' ? shape : null);
    syncAttr('elevation', elevation && elevation !== 'default' ? elevation : null);
    syncAttr('tone', tone && tone !== 'default' && tone !== 'brand' ? tone : null);
    syncBooleanish('close-on-select', closeOnSelect, 'value');
    syncBooleanish('typeahead', typeahead, 'value');
  }, [open, placement, variant, size, density, radius, shape, elevation, tone, closeOnSelect, typeahead]);

  return React.createElement('ui-dropdown', { ref, ...rest }, children);
});

Dropdown.displayName = 'Dropdown';

export default Dropdown;
