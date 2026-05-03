'use client';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';
import {
  createPositioner,
  createVirtualPoint,
  type PositionerAnchor,
  type PositionerMiddleware,
  type PositionerHandle,
  type PositionerPlacement
} from '@editora/ui-core/runtime';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type Placement = PositionerPlacement;
export type FloatingMiddleware = PositionerMiddleware;
export type FloatingOpenChangeReason =
  | 'click'
  | 'hover'
  | 'focus'
  | 'dismiss'
  | 'list-navigation'
  | 'typeahead'
  | 'client-point'
  | 'manual';

export type RefLike<T> =
  | ((instance: T | null) => void)
  | { current: T | null }
  | null
  | undefined;

export function assignRef<T>(ref: RefLike<T>, value: T | null) {
  if (!ref) return;
  if (typeof ref === 'function') {
    ref(value);
    return;
  }
  ref.current = value;
}

export function mergeRefs<T>(...refs: Array<RefLike<T>>) {
  return (value: T | null) => {
    refs.forEach((ref) => assignRef(ref, value));
  };
}

export function callAll<Args extends unknown[]>(...handlers: Array<((...args: Args) => void) | undefined>) {
  return (...args: Args) => {
    handlers.forEach((handler) => handler?.(...args));
  };
}

export function composeEventHandlers<E extends { defaultPrevented?: boolean }>(
  userHandler: ((event: E) => void) | undefined,
  libraryHandler: (event: E) => void,
  options: { checkDefaultPrevented?: boolean } = {}
) {
  return (event: E) => {
    userHandler?.(event);
    if ((options.checkDefaultPrevented ?? true) && event.defaultPrevented) return;
    libraryHandler(event);
  };
}

export type FloatingContext = {
  open: boolean;
  setOpen: (nextOpen: boolean, reason?: FloatingOpenChangeReason) => void;
  toggle: (reason?: FloatingOpenChangeReason) => void;
  refs: {
    reference: MutableRefObject<HTMLElement | null>;
    floating: MutableRefObject<HTMLElement | null>;
    arrow: MutableRefObject<HTMLElement | null>;
    setReference: (node: HTMLElement | null) => void;
    setFloating: (node: HTMLElement | null) => void;
    setArrow: (node: HTMLElement | null) => void;
    setPositionReference: (anchor: PositionerAnchor | null) => void;
  };
  elements: {
    get reference(): HTMLElement | null;
    get floating(): HTMLElement | null;
    get arrow(): HTMLElement | null;
  };
  coords: {
    top: number;
    left: number;
    placement: Placement;
    arrow?: { x?: number; y?: number; centerOffset?: number };
  };
  update: () => void;
  floatingId: string;
  role: string;
  placement: Placement;
  strategy: 'absolute' | 'fixed';
};

export function useFloating(options?: {
  placement?: Placement;
  offset?: number;
  open?: boolean;
  onOpen?: (reason?: FloatingOpenChangeReason) => void;
  onClose?: (reason?: FloatingOpenChangeReason) => void;
  onOpenChange?: (open: boolean, reason?: FloatingOpenChangeReason) => void;
  role?: string;
  flip?: boolean;
  shift?: boolean;
  matchWidth?: boolean;
  fitViewport?: boolean;
  strategy?: 'absolute' | 'fixed';
  arrowPadding?: number;
  dir?: 'ltr' | 'rtl';
  boundary?: HTMLElement | null;
  boundaryPadding?: number;
  autoPlacement?: boolean;
  allowedPlacements?: Placement[];
  fallbackPlacements?: Placement[];
  inline?: boolean;
  hideWhenDetached?: boolean;
  observeWindowResize?: boolean;
  observeScroll?: boolean;
  observeAncestorScroll?: boolean;
  observeAncestorResize?: boolean;
  observeLayoutShift?: boolean;
  observeAnchorResize?: boolean;
  observeFloatingResize?: boolean;
  animationFrame?: boolean;
  middleware?: FloatingMiddleware[];
}) {
  const {
    placement = 'bottom',
    offset = 8,
    open: controlledOpen,
    onOpen,
    onClose,
    onOpenChange,
    role = 'menu',
    flip = true,
    shift = true,
    matchWidth = false,
    fitViewport = false,
    strategy = 'absolute',
    arrowPadding = 8,
    dir,
    boundary = null,
    boundaryPadding,
    autoPlacement = false,
    allowedPlacements,
    fallbackPlacements,
    inline = false,
    hideWhenDetached = false,
    observeWindowResize,
    observeScroll,
    observeAncestorScroll,
    observeAncestorResize,
    observeLayoutShift,
    observeAnchorResize,
    observeFloatingResize,
    animationFrame,
    middleware
  } = options || {};
  const reference = useRef<HTMLElement | null>(null);
  const floating = useRef<HTMLElement | null>(null);
  const arrow = useRef<HTMLElement | null>(null);
  const positionReference = useRef<PositionerAnchor | null>(null);
  const positioner = useRef<PositionerHandle | null>(null);
  const uid = useRef(`floating-${Math.random().toString(36).slice(2, 9)}`);
  const [positionReferenceVersion, setPositionReferenceVersion] = useState(0);
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
  const [floatingElement, setFloatingElement] = useState<HTMLElement | null>(null);
  const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null);

  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    placement: Placement;
    arrow?: { x?: number; y?: number; centerOffset?: number };
  }>({ top: 0, left: 0, placement });

  const isControlled = typeof controlledOpen !== 'undefined';
  const [internalOpen, setInternalOpen] = useState<boolean>(Boolean(controlledOpen));
  const open = isControlled ? Boolean(controlledOpen) : internalOpen;

  const update = useCallback(() => {
    positioner.current?.update();
  }, []);

  const setOpen = useCallback(
    (nextOpen: boolean, reason: FloatingOpenChangeReason = 'manual') => {
      if (!isControlled) setInternalOpen(nextOpen);
      onOpenChange?.(nextOpen, reason);
      if (nextOpen) onOpen?.(reason);
      else onClose?.(reason);
    },
    [isControlled, onOpen, onClose, onOpenChange]
  );

  const toggle = useCallback((reason: FloatingOpenChangeReason = 'manual') => setOpen(!open, reason), [open, setOpen]);
  const openPopup = useCallback((reason: FloatingOpenChangeReason = 'manual') => setOpen(true, reason), [setOpen]);
  const closePopup = useCallback((reason: FloatingOpenChangeReason = 'manual') => setOpen(false, reason), [setOpen]);

  useIsomorphicLayoutEffect(() => {
    if (!open) return;
    const r = referenceElement;
    const f = floatingElement;
    if (!r || !f) return;

    const previousVisibility = f.style.visibility;
    const previousPointerEvents = f.style.pointerEvents;
    const needsHiddenMeasure = !f.offsetWidth && !f.offsetHeight;
    if (needsHiddenMeasure) {
      f.style.visibility = 'hidden';
      f.style.pointerEvents = 'none';
    }

    positioner.current?.destroy();
    positioner.current = createPositioner({
      anchor: positionReference.current || r,
      floating: f,
      placement,
      strategy,
      offset,
      flip,
      shift,
      matchWidth,
      fitViewport,
      arrow: arrowElement,
      arrowPadding,
      dir,
      boundary,
      boundaryPadding,
      autoPlacement,
      allowedPlacements,
      fallbackPlacements,
      inline,
      hideWhenDetached,
      observeWindowResize,
      observeScroll,
      observeAncestorScroll,
      observeAncestorResize,
      observeLayoutShift,
      observeAnchorResize,
      observeFloatingResize,
      animationFrame,
      middleware,
      onUpdate: (state) => {
        setCoords({
          top: Math.round(state.y),
          left: Math.round(state.x),
          placement: state.placement,
          arrow: state.middlewareData?.arrow
            ? {
              x: state.middlewareData.arrow.x,
              y: state.middlewareData.arrow.y,
              centerOffset: state.middlewareData.arrow.centerOffset
            }
            : undefined
        });
      }
    });

    return () => {
      if (needsHiddenMeasure) {
        f.style.visibility = previousVisibility;
        f.style.pointerEvents = previousPointerEvents;
      }
      positioner.current?.destroy();
      positioner.current = null;
    };
  }, [
    open,
    placement,
    strategy,
    offset,
    flip,
    shift,
    matchWidth,
    fitViewport,
    positionReferenceVersion,
    referenceElement,
    floatingElement,
    arrowElement,
    arrowPadding,
    dir,
    boundary,
    boundaryPadding,
    autoPlacement,
    allowedPlacements,
    fallbackPlacements,
    inline,
    hideWhenDetached,
    observeWindowResize,
    observeScroll,
    observeAncestorScroll,
    observeAncestorResize,
    observeLayoutShift,
    observeAnchorResize,
    observeFloatingResize,
    animationFrame,
    middleware
  ]);

  useIsomorphicLayoutEffect(() => {
    if (!open || !floatingElement) return;
    floatingElement.style.visibility = '';
    floatingElement.style.pointerEvents = '';
  }, [coords.left, coords.top, open, floatingElement]);

  const referenceRef = useCallback((node: HTMLElement | null) => {
    reference.current = node;
    setReferenceElement((current) => current === node ? current : node);
  }, []);

  const floatingRef = useCallback((node: HTMLElement | null) => {
    floating.current = node;
    setFloatingElement((current) => current === node ? current : node);
  }, []);

  const arrowRef = useCallback((node: HTMLElement | null) => {
    arrow.current = node;
    setArrowElement((current) => current === node ? current : node);
  }, []);

  const setPositionReference = useCallback((anchor: PositionerAnchor | null) => {
    positionReference.current = anchor;
    setPositionReferenceVersion((version) => version + 1);
  }, []);

  const setClientPoint = useCallback((x: number, y: number) => {
    const contextElement = reference.current || floating.current || undefined;
    positionReference.current = createVirtualPoint(x, y, contextElement);
    setPositionReferenceVersion((version) => version + 1);
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
          openPopup('list-navigation');
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
        position: strategy,
        top: coords.top,
        left: coords.left
      },
      hidden: !open,
      onKeyDown: (event: KeyboardEvent) => {
        userOnKeyDown?.(event);
        if (event.defaultPrevented) return;

        if (event.key === 'Escape') {
          event.preventDefault();
          closePopup('dismiss');
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
    arrowRef,
    setPositionReference,
    setClientPoint,
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
    focusPrev,
    refs: {
      reference,
      floating,
      arrow,
      setReference: referenceRef,
      setFloating: floatingRef,
      setArrow: arrowRef,
      setPositionReference
    },
    elements: {
      get reference() {
        return reference.current;
      },
      get floating() {
        return floating.current;
      },
      get arrow() {
        return arrow.current;
      }
    },
    floatingId: uid.current,
    role,
    placement,
    context: {
      open,
      setOpen,
      toggle,
      refs: {
        reference,
        floating,
        arrow,
        setReference: referenceRef,
        setFloating: floatingRef,
        setArrow: arrowRef,
        setPositionReference
      },
      elements: {
        get reference() {
          return reference.current;
        },
        get floating() {
          return floating.current;
        },
        get arrow() {
          return arrow.current;
        }
      },
      coords,
      update,
      floatingId: uid.current,
      role,
      placement,
      strategy
    } satisfies FloatingContext
  } as const;
}
