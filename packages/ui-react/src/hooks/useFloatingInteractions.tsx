'use client';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { createPortal } from 'react-dom';
import {
  callAll,
  composeEventHandlers,
  mergeRefs,
  type FloatingContext,
  type FloatingOpenChangeReason,
  type RefLike
} from './useFloating';

type AnyProps = Record<string, any>;
type PropGetter = (props?: AnyProps) => AnyProps;
type DelayValue = number | { open?: number; close?: number };
type PressEventName = 'pointerdown' | 'mousedown' | 'click';
type FloatingTreeEventDetail = Record<string, unknown>;
type Interaction = {
  getReferenceProps?: PropGetter;
  getFloatingProps?: PropGetter;
  getItemProps?: PropGetter;
};

function mergeProps(getters: Array<PropGetter | undefined>, userProps: AnyProps = {}) {
  return getters.reduce((acc, getter) => {
    const next = getter?.(acc) || acc;
    return mergeTwoProps(acc, next);
  }, userProps);
}

function mergeTwoProps(base: AnyProps, next: AnyProps) {
  const merged = { ...base, ...next };
  Object.keys(base).forEach((key) => {
    if (/^on[A-Z]/.test(key) && typeof base[key] === 'function' && typeof next[key] === 'function') {
      merged[key] = callAll(base[key], next[key]);
    }
  });
  if (base.ref || next.ref) {
    merged.ref = mergeRefs(base.ref, next.ref);
  }
  if (base.style || next.style) {
    merged.style = { ...(base.style || {}), ...(next.style || {}) };
  }
  return merged;
}

function contains(parent: Element | null, child: EventTarget | null) {
  return !!parent && !!child && parent.contains(child as Node);
}

function getDelayValue(delay: DelayValue | undefined, phase: 'open' | 'close') {
  if (typeof delay === 'number') return delay;
  return delay?.[phase] ?? 0;
}

function getFocusableElements(container: HTMLElement | null) {
  return Array.from(
    container?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) || []
  ).filter((node) => !node.hasAttribute('disabled') && node.getAttribute('aria-hidden') !== 'true');
}

function focusVisible(event: FocusEvent | React.FocusEvent) {
  const target = event.target as HTMLElement | null;
  if (!target) return true;
  try {
    return typeof target.matches !== 'function' || target.matches(':focus-visible');
  } catch {
    return true;
  }
}

function isRefObject<T>(value: unknown): value is { current: T | null } {
  return typeof value === 'object' && value !== null && 'current' in value;
}

function getFloatingNodeIdFromTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return null;
  const node = target.closest<HTMLElement>('[data-floating-node-id], [data-floating-reference-id]');
  if (!node) return null;
  return node.dataset.floatingNodeId || node.dataset.floatingReferenceId || null;
}

function isNodeWithinTree(tree: FloatingTreeContextValue | null, nodeId: string, ancestorId: string) {
  if (!tree || nodeId === ancestorId) return false;
  let current = tree.getNode(nodeId);
  while (current?.parentId) {
    if (current.parentId === ancestorId) return true;
    current = tree.getNode(current.parentId);
  }
  return false;
}

export function useInteractions(interactions: Array<Interaction | null | undefined>) {
  const enabled = interactions.filter(Boolean) as Interaction[];
  return useMemo(() => ({
    getReferenceProps: (props: AnyProps = {}) => mergeProps(enabled.map((interaction) => interaction.getReferenceProps), props),
    getFloatingProps: (props: AnyProps = {}) => mergeProps(enabled.map((interaction) => interaction.getFloatingProps), props),
    getItemProps: (props: AnyProps = {}) => mergeProps(enabled.map((interaction) => interaction.getItemProps), props)
  }), [enabled]);
}

export function useClick(context: FloatingContext, options: {
  enabled?: boolean;
  toggle?: boolean;
  event?: 'click' | 'mousedown';
  ignoreMouse?: boolean;
  keyboardHandlers?: boolean;
  stickIfOpen?: boolean;
} = {}): Interaction {
  const {
    enabled = true,
    toggle = true,
    event = 'click',
    ignoreMouse = false,
    keyboardHandlers = true,
    stickIfOpen = false
  } = options;
  return useMemo(() => ({
    getReferenceProps(props: AnyProps = {}) {
      if (!enabled) return props;
      const handlerName = event === 'mousedown' ? 'onMouseDown' : 'onClick';
      const openFromPress = (source: FloatingOpenChangeReason = 'click') => {
        if (context.open && stickIfOpen) return;
        if (toggle) context.toggle(source);
        else context.setOpen(true, source);
      };
      return {
        ...props,
        [handlerName]: composeEventHandlers(props[handlerName], (event: MouseEvent & { detail?: number }) => {
          if (ignoreMouse && (event.detail ?? 0) !== 0) return;
          openFromPress('click');
        }),
        onKeyDown: composeEventHandlers(props.onKeyDown, (event: KeyboardEvent) => {
          if (!keyboardHandlers) return;
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          if (context.open && stickIfOpen) return;
          if (toggle) context.toggle('click');
          else context.setOpen(true, 'click');
        })
      };
    }
  }), [context, enabled, event, ignoreMouse, keyboardHandlers, stickIfOpen, toggle]);
}

export function useHover(context: FloatingContext, options: {
  enabled?: boolean;
  delay?: DelayValue;
  closeDelay?: number;
  mouseOnly?: boolean;
  move?: boolean;
  restMs?: number;
} = {}): Interaction {
  const { enabled = true, delay = 0, closeDelay, mouseOnly = false, move = true, restMs = 0 } = options;
  const delayGroup = useContext(FloatingDelayGroupContext);
  const hoverId = useRef(`delay-group-${Math.random().toString(36).slice(2, 9)}`);
  const timeout = useRef<number | null>(null);
  const restTimeout = useRef<number | null>(null);
  const clear = useCallback(() => {
    if (timeout.current) window.clearTimeout(timeout.current);
    timeout.current = null;
    if (restTimeout.current) window.clearTimeout(restTimeout.current);
    restTimeout.current = null;
  }, []);
  const setDelayedOpen = useCallback((open: boolean) => {
    clear();
    const defaultCloseDelay = closeDelay ?? getDelayValue(delay, 'close');
    const wait = open
      ? ((delayGroup?.instantPhase || (delayGroup?.currentId && delayGroup.currentId !== hoverId.current)) ? 1 : getDelayValue(delay, 'open'))
      : defaultCloseDelay;
    timeout.current = window.setTimeout(() => {
      if (open) {
        delayGroup?.beginInstantPhase(hoverId.current);
      } else if (delayGroup?.currentIdRef.current === hoverId.current) {
        delayGroup.setCurrentId(null);
        delayGroup.scheduleInstantPhaseReset(hoverId.current);
      }
      context.setOpen(open, 'hover');
    }, wait);
  }, [clear, closeDelay, context, delay, delayGroup]);

  useEffect(() => clear, [clear]);

  return useMemo(() => ({
    getReferenceProps(props: AnyProps = {}) {
      if (!enabled) return props;
      return {
        ...props,
        onMouseEnter: composeEventHandlers(props.onMouseEnter, (event: MouseEvent) => {
          if (mouseOnly && (event as MouseEvent & { pointerType?: string }).pointerType && (event as MouseEvent & { pointerType?: string }).pointerType !== 'mouse') return;
          if (restMs > 0) {
            clear();
            restTimeout.current = window.setTimeout(() => setDelayedOpen(true), restMs);
            return;
          }
          setDelayedOpen(true);
        }),
        onMouseLeave: composeEventHandlers(props.onMouseLeave, () => setDelayedOpen(false))
      };
    },
    getFloatingProps(props: AnyProps = {}) {
      if (!enabled) return props;
      return {
        ...props,
        onMouseEnter: composeEventHandlers(props.onMouseEnter, () => {
          if (move) setDelayedOpen(true);
        }),
        onMouseLeave: composeEventHandlers(props.onMouseLeave, () => setDelayedOpen(false))
      };
    }
  }), [clear, enabled, mouseOnly, move, restMs, setDelayedOpen]);
}

export function useFocus(context: FloatingContext, options: { enabled?: boolean; visibleOnly?: boolean } = {}): Interaction {
  const { enabled = true, visibleOnly = true } = options;
  return useMemo(() => ({
    getReferenceProps(props: AnyProps = {}) {
      if (!enabled) return props;
      return {
        ...props,
        onFocus: composeEventHandlers(props.onFocus, (event: FocusEvent) => {
          if (visibleOnly && !focusVisible(event)) return;
          context.setOpen(true, 'focus');
        }),
        onBlur: composeEventHandlers(props.onBlur, (event: FocusEvent) => {
          const next = event.relatedTarget;
          if (contains(context.elements.floating, next)) return;
          context.setOpen(false, 'focus');
        })
      };
    },
    getFloatingProps(props: AnyProps = {}) {
      if (!enabled) return props;
      return {
        ...props,
        onBlur: composeEventHandlers(props.onBlur, (event: FocusEvent) => {
          const next = event.relatedTarget;
          if (contains(context.elements.reference, next) || contains(context.elements.floating, next)) return;
          context.setOpen(false, 'focus');
        })
      };
    }
  }), [context, enabled, visibleOnly]);
}

export function useRole(context: FloatingContext, options: { role?: string; enabled?: boolean } = {}): Interaction {
  const { role = context.role, enabled = true } = options;
  return useMemo(() => ({
    getReferenceProps(props: AnyProps = {}) {
      if (!enabled) return props;
      return {
        ...props,
        'aria-haspopup': role,
        'aria-expanded': context.open ? 'true' : 'false',
        'aria-controls': context.floatingId
      };
    },
    getFloatingProps(props: AnyProps = {}) {
      if (!enabled) return props;
      return {
        ...props,
        id: context.floatingId,
        role
      };
    }
  }), [context.floatingId, context.open, enabled, role]);
}

export function useDismiss(context: FloatingContext, options: {
  enabled?: boolean;
  escapeKey?: boolean;
  outsidePress?: boolean | ((event: Event) => boolean);
  outsidePressEvent?: PressEventName;
  ancestorScroll?: boolean;
  referencePress?: boolean;
  referencePressEvent?: PressEventName;
  nodeId?: string | null;
} = {}): Interaction {
  const {
    enabled = true,
    escapeKey = true,
    outsidePress = true,
    outsidePressEvent = 'pointerdown',
    ancestorScroll = false,
    referencePress = false,
    referencePressEvent = 'pointerdown',
    nodeId = null
  } = options;
  const tree = useFloatingTree();

  const isTargetWithinDescendantTree = useCallback((target: EventTarget | null) => {
    if (!tree || !nodeId) return false;
    const targetNodeId = getFloatingNodeIdFromTarget(target);
    if (!targetNodeId || targetNodeId === nodeId) return false;
    return isNodeWithinTree(tree, targetNodeId, nodeId);
  }, [nodeId, tree]);

  const closeSelfAndDescendants = useCallback((reason: FloatingOpenChangeReason = 'dismiss') => {
    if (nodeId) tree?.closeDescendants(nodeId, reason);
    context.setOpen(false, reason);
  }, [context, nodeId, tree]);

  useEffect(() => {
    if (!enabled || !context.open) return;
    const onPointerDown = (event: Event) => {
      if (!outsidePress) return;
      if (contains(context.elements.reference, event.target) || contains(context.elements.floating, event.target)) return;
      if (isTargetWithinDescendantTree(event.target)) return;
      if (typeof outsidePress === 'function' && !outsidePress(event)) return;
      closeSelfAndDescendants('dismiss');
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (!escapeKey || event.key !== 'Escape' || event.defaultPrevented) return;
      if (isTargetWithinDescendantTree(event.target)) return;
      event.preventDefault();
      closeSelfAndDescendants('dismiss');
    };
    const onScroll = () => {
      if (ancestorScroll) closeSelfAndDescendants('dismiss');
    };
    document.addEventListener(outsidePressEvent, onPointerDown, true);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      document.removeEventListener(outsidePressEvent, onPointerDown, true);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [
    ancestorScroll,
    closeSelfAndDescendants,
    context,
    enabled,
    escapeKey,
    isTargetWithinDescendantTree,
    outsidePress,
    outsidePressEvent
  ]);

  return useMemo(() => ({
    getReferenceProps(props: AnyProps = {}) {
      if (!enabled && !nodeId) return props;
      const handlerName =
        referencePressEvent === 'click'
          ? 'onClick'
          : referencePressEvent === 'mousedown'
            ? 'onMouseDown'
            : 'onPointerDown';
      const nextProps = {
        ...props,
        'data-floating-reference-id': nodeId ?? props['data-floating-reference-id']
      };
      if (!referencePress) return nextProps;
      return {
        ...nextProps,
        [handlerName]: composeEventHandlers(props[handlerName], () => {
          if (!context.open) return;
          closeSelfAndDescendants('dismiss');
        })
      };
    },
    getFloatingProps(props: AnyProps = {}) {
      if (!enabled && !nodeId) return props;
      const nextProps = {
        ...props,
        'data-floating-node-id': nodeId ?? props['data-floating-node-id']
      };
      if (!enabled) return nextProps;
      return {
        ...nextProps,
        onKeyDown: composeEventHandlers(props.onKeyDown, (event: KeyboardEvent) => {
          if (escapeKey && event.key === 'Escape') {
            event.preventDefault();
            closeSelfAndDescendants('dismiss');
          }
        })
      };
    }
  }), [closeSelfAndDescendants, context, enabled, escapeKey, nodeId, referencePress, referencePressEvent]);
}

export function useListNavigation(context: FloatingContext, options: {
  enabled?: boolean;
  listRef?: React.MutableRefObject<Array<HTMLElement | null>>;
  activeIndex: number | null;
  onNavigate: (index: number | null) => void;
  loop?: boolean;
  orientation?: 'vertical' | 'horizontal' | 'both';
  cols?: number;
  rtl?: boolean;
  focusItemOnOpen?: boolean | 'auto';
  openOnArrowKeyDown?: boolean;
  nested?: boolean;
  nodeId?: string | null;
  getItemHasSubmenu?: (index: number) => boolean;
  getItemExpanded?: (index: number) => boolean;
  onOpenSubmenu?: (index: number) => void;
  onCloseSubmenu?: () => void;
  openSubmenuKey?: string;
  closeSubmenuKey?: string;
  restoreFocusOnClose?: boolean | RefLike<HTMLElement>;
}): Interaction {
  const {
    enabled = true,
    listRef,
    activeIndex,
    onNavigate,
    loop = true,
    orientation = 'vertical',
    cols = 1,
    rtl = false,
    focusItemOnOpen = false,
    openOnArrowKeyDown = false,
    nested = false,
    nodeId = null,
    getItemHasSubmenu,
    getItemExpanded,
    onOpenSubmenu,
    onCloseSubmenu,
    openSubmenuKey = rtl ? 'ArrowLeft' : 'ArrowRight',
    closeSubmenuKey = rtl ? 'ArrowRight' : 'ArrowLeft',
    restoreFocusOnClose = nested
  } = options;
  const getItems = useCallback(() => listRef?.current?.filter(Boolean) as HTMLElement[] | undefined, [listRef]);
  const getItemIndexFromEvent = useCallback((target: EventTarget | null) => {
    if (!(target instanceof Element)) return null;
    const item = target.closest<HTMLElement>('[data-index]');
    if (!item) return null;
    const index = Number(item.dataset.index);
    return Number.isFinite(index) ? index : null;
  }, []);
  const focusReference = useCallback(() => {
    const target = restoreFocusOnClose && isRefObject<HTMLElement>(restoreFocusOnClose)
      ? restoreFocusOnClose.current
      : context.elements.reference;
    if (!restoreFocusOnClose || !target) return;
    requestAnimationFrame(() => target.focus());
  }, [context.elements, restoreFocusOnClose]);
  const move = useCallback((delta: number, currentIndexOverride?: number | null) => {
    const items = getItems();
    if (!items?.length) return;
    const focusedIndex = items.indexOf(document.activeElement as HTMLElement);
    const current = currentIndexOverride ?? activeIndex ?? (focusedIndex >= 0 ? focusedIndex : -1);
    let next = current + delta;
    if (loop) next = (next + items.length) % items.length;
    else next = Math.max(0, Math.min(items.length - 1, next));
    onNavigate(next);
    items[next]?.focus();
  }, [activeIndex, getItems, loop, onNavigate]);

  useEffect(() => {
    if (!enabled || !context.open) return;
    if (!(focusItemOnOpen === true || focusItemOnOpen === 'auto')) return;
    const targetIndex = activeIndex == null ? 0 : activeIndex;
    let frame = 0;
    let cancelled = false;
    let attempts = 0;
    const focusWhenReady = () => {
      if (cancelled) return;
      const items = getItems();
      if (!items?.length) {
        if (attempts < 4) {
          attempts += 1;
          frame = requestAnimationFrame(focusWhenReady);
        }
        return;
      }
      const focusedIndex = items.indexOf(document.activeElement as HTMLElement);
      if (focusedIndex >= 0) {
        onNavigate(focusedIndex);
        return;
      }
      onNavigate(targetIndex);
      items[targetIndex]?.focus();
    };
    frame = requestAnimationFrame(focusWhenReady);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [activeIndex, context.open, enabled, focusItemOnOpen, getItems, onNavigate]);

  const getDeltaFromKey = useCallback((key: string) => {
    const vertical = orientation === 'vertical' || orientation === 'both';
    const horizontal = orientation === 'horizontal' || orientation === 'both';
    if (vertical && key === 'ArrowDown') return cols;
    if (vertical && key === 'ArrowUp') return -cols;
    if (horizontal && key === (rtl ? 'ArrowLeft' : 'ArrowRight')) return 1;
    if (horizontal && key === (rtl ? 'ArrowRight' : 'ArrowLeft')) return -1;
    return 0;
  }, [cols, orientation, rtl]);

  const handleNavigationKeyDown = useCallback((event: KeyboardEvent) => {
    const currentIndex = getItemIndexFromEvent(event.target) ?? activeIndex;
    if (nested && event.key === openSubmenuKey && currentIndex != null && getItemHasSubmenu?.(currentIndex)) {
      event.preventDefault();
      onNavigate(currentIndex);
      onOpenSubmenu?.(currentIndex);
      return;
    }
    if (nested && onCloseSubmenu && event.key === closeSubmenuKey) {
      event.preventDefault();
      onCloseSubmenu?.();
      focusReference();
      return;
    }
    const delta = getDeltaFromKey(event.key);
    if (delta) {
      event.preventDefault();
      move(delta, currentIndex);
    } else if (event.key === 'Home') {
      const items = getItems();
      if (!items?.length) return;
      event.preventDefault();
      onNavigate(0);
      items[0]?.focus();
    } else if (event.key === 'End') {
      const items = getItems();
      if (!items?.length) return;
      event.preventDefault();
      onNavigate(items.length - 1);
      items[items.length - 1]?.focus();
    }
  }, [
    activeIndex,
    closeSubmenuKey,
    focusReference,
    getDeltaFromKey,
    getItemHasSubmenu,
    getItemIndexFromEvent,
    getItems,
    move,
    nested,
    onCloseSubmenu,
    onNavigate,
    onOpenSubmenu,
    openSubmenuKey
  ]);

  return useMemo(() => ({
    getReferenceProps(props: AnyProps = {}) {
      if (!enabled || !openOnArrowKeyDown) return props;
      return {
        ...props,
        onKeyDown: composeEventHandlers(props.onKeyDown, (event: KeyboardEvent) => {
          if (context.open) return;
          const delta = getDeltaFromKey(event.key);
          if (!delta) return;
          const items = getItems();
          event.preventDefault();
          if (items?.length) {
            const next =
              event.key === 'ArrowUp' || event.key === (rtl ? 'ArrowRight' : 'ArrowLeft')
                ? items.length - 1
                : 0;
            onNavigate(next);
          } else if (event.key !== 'ArrowUp' && event.key !== (rtl ? 'ArrowRight' : 'ArrowLeft')) {
            onNavigate(0);
          }
          context.setOpen(true, 'list-navigation');
        })
      };
    },
    getFloatingProps(props: AnyProps = {}) {
      if (!enabled) return props;
      return {
        ...props,
        'data-floating-node-id': nodeId ?? props['data-floating-node-id'],
        'aria-activedescendant': activeIndex != null ? `floating-item-${activeIndex}` : undefined,
        onKeyDown: composeEventHandlers(props.onKeyDown, handleNavigationKeyDown)
      };
    },
    getItemProps(props: AnyProps = {}) {
      const index = props['data-index'];
      const numericIndex = typeof index === 'number' ? index : Number(index);
      const hasSubmenu = Number.isFinite(numericIndex) ? getItemHasSubmenu?.(numericIndex) : false;
      return {
        ...props,
        id: typeof index === 'number' ? `floating-item-${index}` : props.id,
        tabIndex: index === activeIndex ? 0 : -1,
        'data-active': index === activeIndex ? '' : undefined,
        'aria-haspopup': hasSubmenu ? 'menu' : props['aria-haspopup'],
        'aria-expanded': hasSubmenu
          ? String(getItemExpanded?.(numericIndex) ?? false)
          : props['aria-expanded'],
        onKeyDown: composeEventHandlers(props.onKeyDown, handleNavigationKeyDown)
      };
    }
  }), [
    activeIndex,
    context,
    enabled,
    getItemExpanded,
    getItemHasSubmenu,
    handleNavigationKeyDown,
    getDeltaFromKey,
    getItems,
    nodeId,
    onNavigate,
    openOnArrowKeyDown,
    rtl
  ]);
}

export function useTypeahead(context: FloatingContext, options: {
  enabled?: boolean;
  listRef?: React.MutableRefObject<Array<HTMLElement | null>>;
  labelsRef: React.MutableRefObject<string[]>;
  activeIndex: number | null;
  onMatch: (index: number) => void;
  resetMs?: number;
  selectedIndex?: number | null;
  onTypingChange?: (typing: boolean) => void;
  findMatch?: (labels: string[], query: string, activeIndex: number | null) => number | null;
}): Interaction {
  const {
    enabled = true,
    labelsRef,
    listRef,
    activeIndex,
    onMatch,
    resetMs = 750,
    selectedIndex = null,
    onTypingChange,
    findMatch
  } = options;
  const searchRef = useRef('');
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
  }, []);

  return useMemo(() => ({
    getFloatingProps(props: AnyProps = {}) {
      if (!enabled) return props;
      return {
        ...props,
        onKeyDown: composeEventHandlers(props.onKeyDown, (event: KeyboardEvent) => {
          if (event.key.length !== 1 || event.altKey || event.ctrlKey || event.metaKey) return;
          searchRef.current += event.key.toLocaleLowerCase();
          onTypingChange?.(true);
          if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
          timeoutRef.current = window.setTimeout(() => {
            searchRef.current = '';
            onTypingChange?.(false);
          }, resetMs);
          const labels = labelsRef.current.map((label) => label.toLocaleLowerCase());
          const rawMatch = findMatch
            ? findMatch(labels, searchRef.current, activeIndex)
            : (() => {
              const start = (activeIndex ?? selectedIndex) == null ? 0 : (activeIndex ?? selectedIndex)! + 1;
              const ordered = labels.map((_, index) => (start + index) % labels.length);
              return ordered.find((index) => labels[index]?.startsWith(searchRef.current)) ?? null;
            })();
          const match = rawMatch == null || rawMatch < 0 ? null : rawMatch;
          if (match == null) return;
          event.preventDefault();
          onMatch(match);
          listRef?.current?.[match]?.focus();
          context.setOpen(true, 'typeahead');
        })
      };
    }
  }), [activeIndex, context, enabled, findMatch, labelsRef, listRef, onMatch, onTypingChange, resetMs, selectedIndex]);
}

export function useTransition(context: FloatingContext, options: {
  duration?: DelayValue;
  initial?: React.CSSProperties;
  open?: React.CSSProperties;
  close?: React.CSSProperties;
} = {}) {
  const { duration = 160, initial, open, close } = options;
  const [isMounted, setMounted] = useState(context.open);
  const [status, setStatus] = useState<'unmounted' | 'initial' | 'open' | 'close'>(context.open ? 'open' : 'unmounted');
  const openDuration = getDelayValue(duration, 'open');
  const closeDuration = getDelayValue(duration, 'close');

  useEffect(() => {
    if (context.open) {
      setMounted(true);
      setStatus('initial');
      const frame = requestAnimationFrame(() => setStatus('open'));
      return () => cancelAnimationFrame(frame);
    }
    if (!isMounted) return;
    setStatus('close');
    const timer = window.setTimeout(() => {
      setMounted(false);
      setStatus('unmounted');
    }, closeDuration);
    return () => window.clearTimeout(timer);
  }, [closeDuration, context.open, isMounted]);

  return {
    isMounted,
    status,
    styles: {
      transition: `opacity ${status === 'close' ? closeDuration : openDuration}ms ease, transform ${status === 'close' ? closeDuration : openDuration}ms ease`,
      ...(status === 'initial' ? { opacity: 0, transform: 'scale(0.98)', ...initial } : null),
      ...(status === 'open' ? { opacity: 1, transform: 'scale(1)', ...open } : null),
      ...(status === 'close' ? { opacity: 0, transform: 'scale(0.98)', ...close } : null)
    } as React.CSSProperties
  };
}

export function useClientPoint(context: FloatingContext, options: { enabled?: boolean; axis?: 'both' | 'x' | 'y' } = {}): Interaction {
  const { enabled = true, axis = 'both' } = options;
  const latest = useRef({ x: 0, y: 0 });
  return useMemo(() => ({
    getReferenceProps(props: AnyProps = {}) {
      if (!enabled) return props;
      return {
        ...props,
        onPointerMove: composeEventHandlers(props.onPointerMove, (event: PointerEvent) => {
          latest.current = {
            x: axis === 'y' ? latest.current.x : event.clientX,
            y: axis === 'x' ? latest.current.y : event.clientY
          };
          context.refs.setPositionReference({
            contextElement: context.elements.reference || undefined,
            getBoundingClientRect: () => new DOMRect(latest.current.x, latest.current.y, 0, 0)
          });
          context.update();
        })
      };
    }
  }), [axis, context, enabled]);
}

export const FloatingListContext = createContext<{
  elementsRef: React.MutableRefObject<Array<HTMLElement | null>>;
  labelsRef: React.MutableRefObject<string[]>;
} | null>(null);

export function FloatingList({ children, elementsRef, labelsRef }: {
  children: React.ReactNode;
  elementsRef?: React.MutableRefObject<Array<HTMLElement | null>>;
  labelsRef?: React.MutableRefObject<string[]>;
}) {
  const localElementsRef = useRef<Array<HTMLElement | null>>([]);
  const localLabelsRef = useRef<string[]>([]);
  const value = useMemo(() => ({
    elementsRef: elementsRef || localElementsRef,
    labelsRef: labelsRef || localLabelsRef
  }), [elementsRef, labelsRef]);
  return <FloatingListContext.Provider value={value}>{children}</FloatingListContext.Provider>;
}

export function useFloatingList() {
  return useContext(FloatingListContext);
}

export const FloatingArrow = React.forwardRef<HTMLDivElement, {
  context: FloatingContext;
  width?: number;
  height?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
} & React.HTMLAttributes<HTMLDivElement>>(function FloatingArrow({
  context,
  width = 14,
  height = 8,
  fill = 'currentColor',
  stroke,
  strokeWidth = 1,
  style,
  ...props
}, forwardedRef) {
  const arrow = context.coords.arrow;
  const side = context.coords.placement.split('-')[0];
  const pathBySide: Record<string, string> = {
    top: `M0 ${strokeWidth / 2} L${width / 2} ${height - strokeWidth / 2} L${width} ${strokeWidth / 2}`,
    bottom: `M0 ${height - strokeWidth / 2} L${width / 2} ${strokeWidth / 2} L${width} ${height - strokeWidth / 2}`,
    left: `M${strokeWidth / 2} ${strokeWidth / 2} L${width - strokeWidth / 2} ${height / 2} L${strokeWidth / 2} ${height - strokeWidth / 2}`,
    right: `M${width - strokeWidth / 2} ${strokeWidth / 2} L${strokeWidth / 2} ${height / 2} L${width - strokeWidth / 2} ${height - strokeWidth / 2}`
  };
  const placementStyle: React.CSSProperties = {
    position: 'absolute',
    width,
    height,
    pointerEvents: 'none',
    overflow: 'visible',
    left: typeof arrow?.x === 'number' ? Math.round(arrow.x) : undefined,
    top: typeof arrow?.y === 'number' ? Math.round(arrow.y) : undefined,
    transform: arrow?.centerOffset ? `translate(${Math.round(arrow.centerOffset * (side === 'top' || side === 'bottom' ? 0.15 : 0))}px, ${Math.round(arrow.centerOffset * (side === 'left' || side === 'right' ? 0.15 : 0))}px)` : undefined
  };
  if (side === 'top') {
    placementStyle.top = undefined;
    placementStyle.bottom = -height + strokeWidth;
  }
  if (side === 'bottom') {
    placementStyle.top = -height + strokeWidth;
  }
  if (side === 'left') {
    placementStyle.left = undefined;
    placementStyle.right = -width + strokeWidth;
  }
  if (side === 'right') {
    placementStyle.left = -width + strokeWidth;
    placementStyle.top = typeof arrow?.y === 'number' ? Math.round(arrow.y) : undefined;
  }

  return (
    <div
      {...props}
      ref={mergeRefs(context.refs.setArrow, forwardedRef)}
      aria-hidden="true"
      data-side={side}
      data-center-offset={typeof arrow?.centerOffset === 'number' ? String(Math.round(arrow.centerOffset)) : undefined}
      style={{ ...placementStyle, ...style }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ display: 'block', overflow: 'visible' }}
      >
        <path
          d={pathBySide[side] || pathBySide.bottom}
          fill={fill}
          stroke={stroke}
          strokeWidth={stroke ? strokeWidth : 0}
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
});

export function FloatingPortal({ children, root }: { children: React.ReactNode; root?: HTMLElement | null }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, root || document.body);
}

export function FloatingOverlay({ lockScroll = false, style, ...props }: { lockScroll?: boolean } & React.HTMLAttributes<HTMLDivElement>) {
  useEffect(() => {
    if (!lockScroll) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [lockScroll]);
  return <div {...props} style={{ position: 'fixed', inset: 0, ...style }} />;
}

export function FloatingFocusManager({
  context,
  children,
  modal = false,
  initialFocus = true,
  returnFocus = true,
  guards = true,
  disabled = false,
  closeOnFocusOut = !modal,
  outsideElementsInert = false,
  visuallyHiddenDismiss = false
}: {
  context: FloatingContext;
  children: React.ReactNode;
  modal?: boolean;
  initialFocus?: boolean | number | RefLike<HTMLElement>;
  returnFocus?: boolean | RefLike<HTMLElement>;
  guards?: boolean;
  disabled?: boolean;
  closeOnFocusOut?: boolean;
  outsideElementsInert?: boolean;
  visuallyHiddenDismiss?: boolean | string;
}) {
  const tree = useFloatingTree();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const startGuardRef = useRef<HTMLSpanElement | null>(null);
  const endGuardRef = useRef<HTMLSpanElement | null>(null);
  const previouslyFocused = useRef<Element | null>(null);
  const initialFocusApplied = useRef(false);

  const resolveInitialFocusTarget = useCallback(() => {
    if (typeof initialFocus === 'number') {
      return getFocusableElements(context.elements.floating)[initialFocus] || null;
    }
    if (typeof initialFocus === 'object' && initialFocus && 'current' in initialFocus) {
      return initialFocus.current;
    }
    return (
      context.elements.floating?.querySelector<HTMLElement>('[autofocus]') ||
      getFocusableElements(context.elements.floating)[0] ||
      null
    );
  }, [context.elements.floating, initialFocus]);

  const focusFirst = useCallback((backward = false) => {
    const nodes = getFocusableElements(context.elements.floating);
    const target = backward ? nodes[nodes.length - 1] : nodes[0];
    target?.focus();
  }, [context.elements.floating]);

  useLayoutEffect(() => {
    if (!context.open || disabled) return;
    initialFocusApplied.current = false;
    previouslyFocused.current = document.activeElement;
    if (initialFocus) {
      initialFocusApplied.current = true;
      resolveInitialFocusTarget()?.focus();
    }
    return () => {
      initialFocusApplied.current = false;
      if (!returnFocus) return;
      if (isRefObject<HTMLElement>(returnFocus)) {
        returnFocus.current?.focus();
      } else if (previouslyFocused.current instanceof HTMLElement) {
        previouslyFocused.current.focus();
      }
    };
  }, [context.open, disabled, initialFocus, resolveInitialFocusTarget, returnFocus]);

  useEffect(() => {
    if (disabled || !context.open) return;
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      const insideFloating = contains(containerRef.current, target) || contains(context.elements.floating, target);
      const insideReference = contains(context.elements.reference, target);
      const currentNodeId =
        context.elements.floating?.dataset.floatingNodeId ||
        context.elements.reference?.dataset.floatingReferenceId ||
        null;
      const targetNodeId = getFloatingNodeIdFromTarget(target);
      const insideDescendantTree =
        !!currentNodeId &&
        !!targetNodeId &&
        isNodeWithinTree(tree, targetNodeId, currentNodeId);
      if (insideFloating || insideReference || insideDescendantTree) return;
      if (modal) {
        if (!initialFocusApplied.current && initialFocus) {
          initialFocusApplied.current = true;
          resolveInitialFocusTarget()?.focus();
          return;
        }
        focusFirst();
        return;
      }
      if (closeOnFocusOut) {
        context.setOpen(false, 'dismiss');
      }
    };
    document.addEventListener('focusin', onFocusIn);
    return () => {
      document.removeEventListener('focusin', onFocusIn);
    };
  }, [closeOnFocusOut, context, context.open, disabled, focusFirst, initialFocus, modal, resolveInitialFocusTarget, tree]);

  useEffect(() => {
    if (!outsideElementsInert || !modal || !context.open || disabled) return;
    const scopeParent = containerRef.current?.parentElement || document.body;
    const scopeChildren = Array.from(scopeParent.children) as HTMLElement[];
    const allowed = new Set<HTMLElement>(
      [
        containerRef.current,
        context.elements.floating,
        startGuardRef.current,
        endGuardRef.current
      ].filter(Boolean) as HTMLElement[]
    );
    const previous = new Map<HTMLElement, string | null>();
    scopeChildren.forEach((element) => {
      if (Array.from(allowed).some((allowedElement) => allowedElement === element || allowedElement.contains(element) || element.contains(allowedElement))) {
        return;
      }
      previous.set(element, element.getAttribute('aria-hidden'));
      element.setAttribute('aria-hidden', 'true');
    });
    return () => {
      previous.forEach((value, element) => {
        if (value == null) element.removeAttribute('aria-hidden');
        else element.setAttribute('aria-hidden', value);
      });
    };
  }, [context.elements.floating, context.open, disabled, modal, outsideElementsInert]);

  if (disabled) {
    return <>{children}</>;
  }

  return (
    <>
      {modal && guards ? <span ref={startGuardRef} tabIndex={0} data-floating-focus-guard="" aria-hidden="true" onFocus={() => focusFirst(true)} /> : null}
      <div
        ref={containerRef}
        role={modal ? 'dialog' : undefined}
        aria-modal={modal ? 'true' : undefined}
        onKeyDown={(event) => {
          if (!modal || event.key !== 'Tab') return;
          const nodes = getFocusableElements(context.elements.floating);
          if (!nodes.length) return;
          const first = nodes[0];
          const last = nodes[nodes.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }}
      >
        {visuallyHiddenDismiss ? (
          <button
            type="button"
            style={{
              position: 'absolute',
              width: 1,
              height: 1,
              padding: 0,
              margin: -1,
              overflow: 'hidden',
              clip: 'rect(0, 0, 0, 0)',
              whiteSpace: 'nowrap',
              border: 0
            }}
            onClick={() => context.setOpen(false, 'dismiss')}
          >
            {typeof visuallyHiddenDismiss === 'string' ? visuallyHiddenDismiss : 'Dismiss'}
          </button>
        ) : null}
        {children}
      </div>
      {modal && guards ? <span ref={endGuardRef} tabIndex={0} data-floating-focus-guard="" aria-hidden="true" onFocus={() => focusFirst(false)} /> : null}
    </>
  );
}

type FloatingTreeNode = {
  id: string;
  parentId?: string | null;
  setOpen?: (open: boolean, reason?: FloatingOpenChangeReason) => void;
};

type FloatingTreeContextValue = {
  nodes: React.MutableRefObject<FloatingTreeNode[]>;
  register: (node: FloatingTreeNode) => () => void;
  events: EventTarget;
  emit: (type: string, detail?: FloatingTreeEventDetail) => void;
  on: (type: string, handler: (event: CustomEvent<FloatingTreeEventDetail>) => void) => () => void;
  getNode: (id: string) => FloatingTreeNode | null;
  getChildren: (parentId?: string | null) => FloatingTreeNode[];
  closeDescendants: (parentId: string, reason?: FloatingOpenChangeReason) => void;
};

const FloatingTreeContext = createContext<{
  nodes: React.MutableRefObject<FloatingTreeNode[]>;
  register: (node: FloatingTreeNode) => () => void;
  events: EventTarget;
  emit: (type: string, detail?: FloatingTreeEventDetail) => void;
  on: (type: string, handler: (event: CustomEvent<FloatingTreeEventDetail>) => void) => () => void;
  getNode: (id: string) => FloatingTreeNode | null;
  getChildren: (parentId?: string | null) => FloatingTreeNode[];
  closeDescendants: (parentId: string, reason?: FloatingOpenChangeReason) => void;
} | null>(null);

const FloatingNodeContext = createContext<string | null>(null);

export function FloatingTree({ children }: { children: React.ReactNode }) {
  const nodes = useRef<FloatingTreeNode[]>([]);
  const [version, setVersion] = useState(0);
  const events = useMemo(() => new EventTarget(), []);
  const register = useCallback((node: FloatingTreeNode) => {
    nodes.current = [...nodes.current.filter((item) => item.id !== node.id), node];
    setVersion((value) => value + 1);
    return () => {
      nodes.current = nodes.current.filter((item) => item.id !== node.id);
      setVersion((value) => value + 1);
    };
  }, []);
  const emit = useCallback((type: string, detail: FloatingTreeEventDetail = {}) => {
    events.dispatchEvent(new CustomEvent(type, { detail }));
  }, [events]);
  const on = useCallback((type: string, handler: (event: CustomEvent<FloatingTreeEventDetail>) => void) => {
    const wrapped = handler as EventListener;
    events.addEventListener(type, wrapped);
    return () => {
      events.removeEventListener(type, wrapped);
    };
  }, [events]);
  const getNode = useCallback((id: string) => nodes.current.find((node) => node.id === id) || null, []);
  const getChildren = useCallback((parentId?: string | null) => nodes.current.filter((node) => (node.parentId ?? null) === (parentId ?? null)), []);
  const closeDescendants = useCallback((parentId: string, reason: FloatingOpenChangeReason = 'dismiss') => {
    const closeChildren = (id: string) => {
      nodes.current
        .filter((node) => node.parentId === id)
        .forEach((node) => {
          node.setOpen?.(false, reason);
          closeChildren(node.id);
        });
    };
    closeChildren(parentId);
  }, []);
  const value = useMemo<FloatingTreeContextValue>(() => ({
    nodes,
    register,
    events,
    emit,
    on,
    getNode,
    getChildren,
    closeDescendants
  }), [closeDescendants, emit, events, getChildren, getNode, on, register, version]);
  return <FloatingTreeContext.Provider value={value}>{children}</FloatingTreeContext.Provider>;
}

export function useFloatingTree() {
  return useContext(FloatingTreeContext);
}

export function useFloatingParentNodeId() {
  return useContext(FloatingNodeContext);
}

type FloatingNodeIdOptions =
  | string
  | null
  | { parentId?: string | null; setOpen?: (open: boolean, reason?: FloatingOpenChangeReason) => void };

export function useFloatingNodeId(options?: FloatingNodeIdOptions) {
  const tree = useFloatingTree();
  const inferredParentId = useFloatingParentNodeId();
  const idRef = useRef(`floating-node-${Math.random().toString(36).slice(2, 9)}`);
  const setOpenRef = useRef<((open: boolean, reason?: FloatingOpenChangeReason) => void) | undefined>(undefined);
  let parentId: string | null | undefined;
  let setOpen: ((open: boolean, reason?: FloatingOpenChangeReason) => void) | undefined;

  if (typeof options === 'string' || options == null) {
    parentId = options ?? inferredParentId;
  } else {
    parentId = options.parentId ?? inferredParentId;
    setOpen = options.setOpen;
  }

  useEffect(() => {
    setOpenRef.current = setOpen;
  }, [setOpen]);

  const handleSetOpen = useCallback((open: boolean, reason?: FloatingOpenChangeReason) => {
    setOpenRef.current?.(open, reason);
  }, []);
  const register = tree?.register;
  useEffect(() => register?.({ id: idRef.current, parentId, setOpen: handleSetOpen }), [handleSetOpen, parentId, register]);
  return idRef.current;
}

const FloatingDelayGroupContext = createContext<{
  delay: number;
  closeDelay: number;
  timeoutRef: React.MutableRefObject<number | null>;
  currentId: string | null;
  currentIdRef: React.MutableRefObject<string | null>;
  setCurrentId: React.Dispatch<React.SetStateAction<string | null>>;
  instantPhase: boolean;
  setInstantPhase: React.Dispatch<React.SetStateAction<boolean>>;
  beginInstantPhase: (id: string) => void;
  scheduleInstantPhaseReset: (id: string) => void;
  cancelInstantPhaseReset: () => void;
} | null>(null);

export function FloatingDelayGroup({ children, delay = 250, closeDelay }: { children: React.ReactNode; delay?: DelayValue; closeDelay?: number }) {
  const timeoutRef = useRef<number | null>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [instantPhase, setInstantPhase] = useState(false);
  const currentIdRef = useRef<string | null>(null);
  const openDelay = getDelayValue(delay, 'open');
  const resolvedCloseDelay = closeDelay ?? (getDelayValue(delay, 'close') || 120);
  const cancelInstantPhaseReset = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    currentIdRef.current = currentId;
  }, [currentId]);

  const beginInstantPhase = useCallback((id: string) => {
    cancelInstantPhaseReset();
    currentIdRef.current = id;
    setCurrentId(id);
    setInstantPhase(true);
  }, [cancelInstantPhaseReset]);

  const scheduleInstantPhaseReset = useCallback((id: string) => {
    cancelInstantPhaseReset();
    timeoutRef.current = window.setTimeout(() => {
      if (currentIdRef.current === id || currentIdRef.current == null) {
        currentIdRef.current = null;
        setCurrentId(null);
        setInstantPhase(false);
      }
      timeoutRef.current = null;
    }, resolvedCloseDelay);
  }, [cancelInstantPhaseReset, resolvedCloseDelay]);

  useEffect(() => cancelInstantPhaseReset, [cancelInstantPhaseReset]);

  const value = useMemo(() => ({
    delay: openDelay,
    closeDelay: resolvedCloseDelay,
    timeoutRef,
    currentId,
    currentIdRef,
    setCurrentId,
    instantPhase,
    setInstantPhase,
    beginInstantPhase,
    scheduleInstantPhaseReset,
    cancelInstantPhaseReset
  }), [
    beginInstantPhase,
    cancelInstantPhaseReset,
    currentId,
    instantPhase,
    openDelay,
    resolvedCloseDelay,
    scheduleInstantPhaseReset
  ]);
  return <FloatingDelayGroupContext.Provider value={value}>{children}</FloatingDelayGroupContext.Provider>;
}

export function useDelayGroup() {
  const group = useContext(FloatingDelayGroupContext);

  return group
    ? {
      ...group,
      isInstantPhase: group.instantPhase
    }
    : null;
}

export const Composite = React.forwardRef<HTMLDivElement, {
  children: React.ReactNode;
  orientation?: 'vertical' | 'horizontal' | 'both';
  loop?: boolean;
  cols?: number;
  rtl?: boolean;
} & React.HTMLAttributes<HTMLDivElement>>(function Composite({ children, orientation = 'vertical', loop = true, cols = 1, rtl = false, ...props }, forwardedRef) {
  const ref = useRef<HTMLDivElement | null>(null);
  return (
    <div
      {...props}
      ref={mergeRefs(ref, forwardedRef)}
      role={props.role || 'group'}
      onKeyDown={composeEventHandlers(props.onKeyDown as any, (event: React.KeyboardEvent<HTMLDivElement>) => {
        const items = Array.from(ref.current?.querySelectorAll<HTMLElement>('[data-composite-item]') || []);
        if (!items.length) return;
        const current = items.indexOf(document.activeElement as HTMLElement);
        const vertical = orientation === 'vertical' || orientation === 'both';
        const horizontal = orientation === 'horizontal' || orientation === 'both';
        let delta = 0;
        if (vertical && event.key === 'ArrowDown') delta = cols;
        else if (vertical && event.key === 'ArrowUp') delta = -cols;
        else if (horizontal && event.key === (rtl ? 'ArrowLeft' : 'ArrowRight')) delta = 1;
        else if (horizontal && event.key === (rtl ? 'ArrowRight' : 'ArrowLeft')) delta = -1;
        if (!delta && event.key !== 'Home' && event.key !== 'End') return;
        event.preventDefault();
        let next = current;
        if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = items.length - 1;
        else next += delta;
        if (loop && event.key !== 'Home' && event.key !== 'End') next = (next + items.length) % items.length;
        else next = Math.max(0, Math.min(items.length - 1, next));
        items[next]?.focus();
      })}
    >
      {children}
    </div>
  );
});
