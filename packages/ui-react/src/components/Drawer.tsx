import React, { useEffect, useLayoutEffect, useImperativeHandle, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type DrawerProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> & {
  open?: boolean;
  side?: 'left' | 'right' | 'top' | 'bottom' | 'start' | 'end';
  variant?: 'default' | 'solid' | 'flat' | 'line' | 'glass' | 'contrast';
  density?: 'default' | 'compact' | 'comfortable';
  shape?: 'default' | 'square' | 'soft';
  elevation?: 'default' | 'none' | 'low' | 'high';
  tone?: 'default' | 'brand' | 'danger' | 'success' | 'warning';
  size?: 'default' | 'sm' | 'lg';
  state?: 'idle' | 'loading' | 'error' | 'success';
  inset?: boolean;
  dismissible?: boolean;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  lockWhileLoading?: boolean;
  showClose?: boolean;
  initialFocus?: string;
  title?: string;
  description?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  onOpen?: () => void;
  onClose?: () => void;
  onChange?: (open: boolean) => void;
};

export type DrawerHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export type DrawerFooterProps = React.HTMLAttributes<HTMLDivElement>;

type DrawerComponent = React.ForwardRefExoticComponent<DrawerProps & React.RefAttributes<HTMLElement>> & {
  Header: typeof DrawerHeader;
  Footer: typeof DrawerFooter;
};

const DrawerRoot = React.forwardRef<HTMLElement, DrawerProps>(function Drawer(
  {
    children,
    open,
    side,
    variant,
    density,
    shape,
    elevation,
    tone,
    size,
    state,
    inset,
    dismissible,
    closeOnOverlay,
    closeOnEsc,
    lockWhileLoading,
    showClose,
    initialFocus,
    title,
    description,
    ariaLabel,
    ariaLabelledBy,
    ariaDescribedBy,
    onOpen,
    onClose,
    onChange,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);

  useImperativeHandle(forwardedRef, () => ref.current as any);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const openHandler = () => onOpen?.();
    const closeHandler = () => onClose?.();
    const changeHandler = (event: Event) => {
      const next = (event as CustomEvent<{ open?: boolean }>).detail?.open;
      if (typeof next === 'boolean') onChange?.(next);
    };

    el.addEventListener('open', openHandler as EventListener);
    el.addEventListener('close', closeHandler as EventListener);
    el.addEventListener('change', changeHandler as EventListener);

    return () => {
      el.removeEventListener('open', openHandler as EventListener);
      el.removeEventListener('close', closeHandler as EventListener);
      el.removeEventListener('change', changeHandler as EventListener);
    };
  }, [onOpen, onClose, onChange]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open) el.setAttribute('open', '');
    else el.removeAttribute('open');
  }, [open]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (side) el.setAttribute('side', side);
    else el.removeAttribute('side');
  }, [side]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (dismissible) el.setAttribute('dismissible', '');
    else el.removeAttribute('dismissible');
  }, [dismissible]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (variant && variant !== 'default') el.setAttribute('variant', variant);
    else el.removeAttribute('variant');
  }, [variant]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (density && density !== 'default') el.setAttribute('density', density);
    else el.removeAttribute('density');
  }, [density]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (shape && shape !== 'default') el.setAttribute('shape', shape);
    else el.removeAttribute('shape');
  }, [shape]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (elevation && elevation !== 'default') el.setAttribute('elevation', elevation);
    else el.removeAttribute('elevation');
  }, [elevation]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (tone && tone !== 'default' && tone !== 'brand') el.setAttribute('tone', tone);
    else el.removeAttribute('tone');
  }, [tone]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (size && size !== 'default') el.setAttribute('size', size);
    else el.removeAttribute('size');
  }, [size]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (state && state !== 'idle') el.setAttribute('state', state);
    else el.removeAttribute('state');
  }, [state]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (inset) el.setAttribute('inset', '');
    else el.removeAttribute('inset');
  }, [inset]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof closeOnOverlay === 'boolean') el.setAttribute('close-on-overlay', String(closeOnOverlay));
    else el.removeAttribute('close-on-overlay');
  }, [closeOnOverlay]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof closeOnEsc === 'boolean') el.setAttribute('close-on-esc', String(closeOnEsc));
    else el.removeAttribute('close-on-esc');
  }, [closeOnEsc]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof lockWhileLoading === 'boolean') el.setAttribute('lock-while-loading', String(lockWhileLoading));
    else el.removeAttribute('lock-while-loading');
  }, [lockWhileLoading]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof showClose === 'boolean') el.setAttribute('show-close', String(showClose));
    else el.removeAttribute('show-close');
  }, [showClose]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (initialFocus) el.setAttribute('initial-focus', initialFocus);
    else el.removeAttribute('initial-focus');
  }, [initialFocus]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (title) el.setAttribute('title', title);
    else el.removeAttribute('title');
  }, [title]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (description) el.setAttribute('description', description);
    else el.removeAttribute('description');
  }, [description]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (ariaLabel) el.setAttribute('aria-label', ariaLabel);
    else el.removeAttribute('aria-label');
  }, [ariaLabel]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (ariaLabelledBy) el.setAttribute('aria-labelledby', ariaLabelledBy);
    else el.removeAttribute('aria-labelledby');
  }, [ariaLabelledBy]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (ariaDescribedBy) el.setAttribute('aria-describedby', ariaDescribedBy);
    else el.removeAttribute('aria-describedby');
  }, [ariaDescribedBy]);

  return React.createElement('ui-drawer', { ref, ...rest }, children);
});

DrawerRoot.displayName = 'Drawer';

export const DrawerHeader = React.forwardRef<HTMLDivElement, DrawerHeaderProps>(function DrawerHeader(
  props,
  ref
) {
  return <div {...props} ref={ref} slot="header" />;
});

DrawerHeader.displayName = 'Drawer.Header';

export const DrawerFooter = React.forwardRef<HTMLDivElement, DrawerFooterProps>(function DrawerFooter(
  props,
  ref
) {
  return <div {...props} ref={ref} slot="footer" />;
});

DrawerFooter.displayName = 'Drawer.Footer';

export const Drawer = Object.assign(DrawerRoot, {
  Header: DrawerHeader,
  Footer: DrawerFooter
}) as DrawerComponent;

export default Drawer;
