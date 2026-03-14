import React, { useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type DismissableLayerDetail = {
  reason: string;
  originalEvent?: Event;
};

export type DismissableLayerProps = React.HTMLAttributes<HTMLElement> & {
  open?: boolean;
  modal?: boolean;
  closeOnEscape?: boolean;
  closeOnPointerOutside?: boolean;
  closeOnFocusOutside?: boolean;
  disableOutsidePointerEvents?: boolean;
  headless?: boolean;
  onBeforeClose?: (detail: DismissableLayerDetail) => void;
  onClose?: (detail: DismissableLayerDetail) => void;
  onInteractOutside?: (detail: { originalEvent?: Event }) => void;
  onEscapeKeyDown?: (detail: { originalEvent?: Event }) => void;
};

export const DismissableLayer = React.forwardRef<HTMLElement, DismissableLayerProps>(function DismissableLayer(
  {
    children,
    open,
    modal,
    closeOnEscape,
    closeOnPointerOutside,
    closeOnFocusOutside,
    disableOutsidePointerEvents,
    headless,
    onBeforeClose,
    onClose,
    onInteractOutside,
    onEscapeKeyDown,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);
  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleBeforeClose = (event: Event) => onBeforeClose?.((event as CustomEvent<DismissableLayerDetail>).detail);
    const handleClose = (event: Event) => onClose?.((event as CustomEvent<DismissableLayerDetail>).detail);
    const handleInteractOutside = (event: Event) =>
      onInteractOutside?.((event as CustomEvent<{ originalEvent?: Event }>).detail || {});
    const handleEscapeKeyDown = (event: Event) =>
      onEscapeKeyDown?.((event as CustomEvent<{ originalEvent?: Event }>).detail || {});
    el.addEventListener('before-close', handleBeforeClose as EventListener);
    el.addEventListener('close', handleClose as EventListener);
    el.addEventListener('interact-outside', handleInteractOutside as EventListener);
    el.addEventListener('escape-key-down', handleEscapeKeyDown as EventListener);
    return () => {
      el.removeEventListener('before-close', handleBeforeClose as EventListener);
      el.removeEventListener('close', handleClose as EventListener);
      el.removeEventListener('interact-outside', handleInteractOutside as EventListener);
      el.removeEventListener('escape-key-down', handleEscapeKeyDown as EventListener);
    };
  }, [onBeforeClose, onClose, onEscapeKeyDown, onInteractOutside]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open) el.setAttribute('open', '');
    else el.removeAttribute('open');
    if (modal) el.setAttribute('modal', '');
    else el.removeAttribute('modal');
    if (closeOnEscape === false) el.setAttribute('close-on-escape', 'false');
    else if (closeOnEscape) el.setAttribute('close-on-escape', '');
    else el.removeAttribute('close-on-escape');
    if (closeOnPointerOutside === false) el.setAttribute('close-on-pointer-outside', 'false');
    else if (closeOnPointerOutside) el.setAttribute('close-on-pointer-outside', '');
    else el.removeAttribute('close-on-pointer-outside');
    if (closeOnFocusOutside) el.setAttribute('close-on-focus-outside', '');
    else el.removeAttribute('close-on-focus-outside');
    if (disableOutsidePointerEvents) el.setAttribute('disable-outside-pointer-events', '');
    else el.removeAttribute('disable-outside-pointer-events');
    if (headless) el.setAttribute('headless', '');
    else el.removeAttribute('headless');
  }, [closeOnEscape, closeOnFocusOutside, closeOnPointerOutside, disableOutsidePointerEvents, headless, modal, open]);

  return React.createElement('ui-dismissable-layer', { ref, ...rest }, children);
});

DismissableLayer.displayName = 'DismissableLayer';

export default DismissableLayer;
