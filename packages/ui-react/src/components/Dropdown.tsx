import React, { useEffect, useRef } from 'react';

type Props = React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode };

type DropdownProps = Props & {
  open?: boolean;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  variant?: 'default' | 'solid' | 'flat' | 'line' | 'glass' | 'contrast';
  density?: 'default' | 'compact' | 'comfortable';
  shape?: 'default' | 'square' | 'soft';
  elevation?: 'default' | 'none' | 'low' | 'high';
  tone?: 'default' | 'brand' | 'danger' | 'success' | 'warning';
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
    density,
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

  React.useImperativeHandle(forwardedRef, () => ref.current as any);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleOpen = () => onOpen?.();
    const handleClose = () => onClose?.();
    const handleChange = (event: Event) => {
      const detail = (event as CustomEvent<{ open?: boolean; reason?: string }>).detail || {};
      const next = detail?.open;
      if (typeof next === 'boolean') onChange?.(next);
      if (typeof next === 'boolean') onChangeDetail?.({ open: next, reason: detail.reason });
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

  useEffect(() => {
    const el = ref.current;
    if (!el || open == null) return;
    if (open) el.setAttribute('open', '');
    else el.removeAttribute('open');
  }, [open]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (placement) el.setAttribute('placement', placement);
    else el.removeAttribute('placement');
  }, [placement]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (variant && variant !== 'default') el.setAttribute('variant', variant);
    else el.removeAttribute('variant');
  }, [variant]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (density && density !== 'default') el.setAttribute('density', density);
    else el.removeAttribute('density');
  }, [density]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (shape && shape !== 'default') el.setAttribute('shape', shape);
    else el.removeAttribute('shape');
  }, [shape]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (elevation && elevation !== 'default') el.setAttribute('elevation', elevation);
    else el.removeAttribute('elevation');
  }, [elevation]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (tone && tone !== 'default' && tone !== 'brand') el.setAttribute('tone', tone);
    else el.removeAttribute('tone');
  }, [tone]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (closeOnSelect == null) {
      el.removeAttribute('close-on-select');
      return;
    }
    el.setAttribute('close-on-select', closeOnSelect ? 'true' : 'false');
  }, [closeOnSelect]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeahead == null) {
      el.removeAttribute('typeahead');
      return;
    }
    el.setAttribute('typeahead', typeahead ? 'true' : 'false');
  }, [typeahead]);

  return React.createElement('ui-dropdown', { ref, ...rest }, children);
});

Dropdown.displayName = 'Dropdown';

export default Dropdown;
