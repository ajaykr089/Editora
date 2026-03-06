import { useEffect, useRef, useState, useCallback } from 'react';
import { computePosition as coreComputePosition } from '@editora/ui-core';

export type Placement = 'top' | 'bottom' | 'left' | 'right';

type RefLike<T> =
  | ((instance: T | null) => void)
  | { current: T | null }
  | null
  | undefined;

function assignRef<T>(ref: RefLike<T>, value: T | null) {
  if (!ref) return;
  if (typeof ref === 'function') {
    ref(value);
    return;
  }
  ref.current = value;
}

export function useFloating(options?: {
  placement?: Placement;
  offset?: number;
  open?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  role?: string;
}) {
  const { placement = 'bottom', offset = 8, open: controlledOpen, onOpen, onClose, role = 'menu' } = options || {};
  const reference = useRef<HTMLElement | null>(null);
  const floating = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const uid = useRef(`floating-${Math.random().toString(36).slice(2, 9)}`);

  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    placement: Placement;
    arrow?: { x?: number; y?: number };
  }>({ top: 0, left: 0, placement });

  const isControlled = typeof controlledOpen !== 'undefined';
  const [internalOpen, setInternalOpen] = useState<boolean>(Boolean(controlledOpen));
  const open = isControlled ? Boolean(controlledOpen) : internalOpen;

  const update = useCallback(() => {
    const r = reference.current;
    const f = floating.current;
    if (!r || !f) return;
    const pos = coreComputePosition(r, f, { placement, offset });
    setCoords({
      top: Math.round(pos.top),
      left: Math.round(pos.left),
      placement: pos.placement as Placement,
      arrow: pos.x || pos.y ? { x: pos.x, y: pos.y } : undefined
    });
  }, [placement, offset]);

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) setInternalOpen(nextOpen);
      if (nextOpen) onOpen?.();
      else onClose?.();
    },
    [isControlled, onOpen, onClose]
  );

  const toggle = useCallback(() => setOpen(!open), [open, setOpen]);
  const openPopup = useCallback(() => setOpen(true), [setOpen]);
  const closePopup = useCallback(() => setOpen(false), [setOpen]);

  useEffect(() => {
    if (!open) return;
    const r = reference.current;
    const f = floating.current;
    if (!r || !f) return;

    update();

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => update());
    };

    const onResize = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => update());
    };

    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);

    let ro1: ResizeObserver | null = null;
    let ro2: ResizeObserver | null = null;
    try {
      if (typeof ResizeObserver !== 'undefined') {
        ro1 = new ResizeObserver(onResize);
        ro2 = new ResizeObserver(onResize);
        ro1.observe(r);
        ro2.observe(f);
      }
    } catch {
      ro1 = ro2 = null;
    }

    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
      ro1?.disconnect();
      ro2?.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [open, update]);

  const referenceRef = useCallback((node: HTMLElement | null) => {
    reference.current = node;
  }, []);

  const floatingRef = useCallback((node: HTMLElement | null) => {
    floating.current = node;
  }, []);

  const getMenuItems = () => {
    if (!floating.current) return [] as HTMLElement[];
    const items = Array.from(
      floating.current.querySelectorAll('[role="menuitem"], .item, [data-menu-item]')
    ) as HTMLElement[];
    return items.filter(Boolean);
  };

  const focusItem = (index: number) => {
    const items = getMenuItems();
    if (!items.length) return;
    const i = Math.max(0, Math.min(items.length - 1, index));
    try {
      items[i].focus();
    } catch {
      // noop
    }
  };

  const focusFirstItem = () => focusItem(0);
  const focusLastItem = () => {
    const items = getMenuItems();
    if (items.length) focusItem(items.length - 1);
  };
  const focusNext = () => {
    const items = getMenuItems();
    const idx = items.findIndex((item) => item === document.activeElement);
    focusItem(idx < 0 ? 0 : (idx + 1) % items.length);
  };
  const focusPrev = () => {
    const items = getMenuItems();
    const idx = items.findIndex((item) => item === document.activeElement);
    focusItem(idx <= 0 ? items.length - 1 : idx - 1);
  };

  const getReferenceProps = (props: Record<string, any> = {}) => {
    const { onClick: userOnClick, onKeyDown: userOnKeyDown, ref: userRef, ...rest } = props;

    return {
      ...rest,
      ref: (node: HTMLElement | null) => {
        referenceRef(node);
        assignRef(userRef, node);
      },
      'aria-haspopup': role,
      'aria-controls': uid.current,
      'aria-expanded': open ? 'true' : 'false',
      onClick: (event: Event) => {
        userOnClick?.(event);
        if ((event as Event & { defaultPrevented?: boolean }).defaultPrevented) return;
        toggle();
      },
      onKeyDown: (event: KeyboardEvent) => {
        userOnKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          openPopup();
          setTimeout(() => focusFirstItem(), 0);
        }
      }
    };
  };

  const getFloatingProps = (props: Record<string, any> = {}) => {
    const { onKeyDown: userOnKeyDown, style: userStyle, ref: userRef, ...rest } = props;

    return {
      ...rest,
      id: uid.current,
      ref: (node: HTMLElement | null) => {
        floatingRef(node);
        assignRef(userRef, node);
      },
      role,
      tabIndex: -1,
      style: {
        ...(userStyle || {}),
        position: 'absolute',
        top: `${coords.top}px`,
        left: `${coords.left}px`
      },
      hidden: !open,
      onKeyDown: (event: KeyboardEvent) => {
        userOnKeyDown?.(event);
        if (event.defaultPrevented) return;

        if (event.key === 'Escape') {
          event.preventDefault();
          closePopup();
        } else if (event.key === 'ArrowDown') {
          event.preventDefault();
          focusNext();
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          focusPrev();
        } else if (event.key === 'Home') {
          event.preventDefault();
          focusFirstItem();
        } else if (event.key === 'End') {
          event.preventDefault();
          focusLastItem();
        }
      }
    };
  };

  return {
    referenceRef,
    floatingRef,
    coords,
    update,
    open,
    setOpen,
    toggle,
    openPopup,
    closePopup,
    getReferenceProps,
    getFloatingProps,
    focusFirstItem,
    focusLastItem,
    focusNext,
    focusPrev
  } as const;
}

