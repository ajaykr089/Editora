import React, { useEffect, useLayoutEffect, useImperativeHandle, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type QuickActionSelectDetail = {
  index: number;
  id: string;
  label: string;
};

export type QuickActionsActionProps = React.HTMLAttributes<HTMLElement>;

export type QuickActionsProps = Omit<React.HTMLAttributes<HTMLElement>, 'onSelect' | 'onToggle'> & {
  open?: boolean;
  mode?: 'bar' | 'fab';
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'soft' | 'contrast' | 'minimal';
  floating?: boolean;
  placement?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  collapsible?: boolean;
  label?: string;
  headless?: boolean;
  onSelect?: (detail: QuickActionSelectDetail) => void;
  onOpenChange?: (open: boolean) => void;
  onToggle?: (open: boolean) => void;
};

const QuickActionsRoot = React.forwardRef<HTMLElement, QuickActionsProps>(function QuickActions(
  {
    open,
    mode,
    orientation,
    variant,
    floating,
    placement,
    collapsible,
    label,
    headless,
    onSelect,
    onOpenChange,
    onToggle,
    children,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);

  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleSelect = (event: Event) => {
      const detail = (event as CustomEvent<QuickActionSelectDetail>).detail;
      if (detail) onSelect?.(detail);
    };

    const handleChange = (event: Event) => {
      const next = (event as CustomEvent<{ open?: boolean }>).detail?.open;
      if (typeof next === 'boolean') onOpenChange?.(next);
    };

    const handleToggle = (event: Event) => {
      const next = (event as CustomEvent<{ open?: boolean }>).detail?.open;
      if (typeof next === 'boolean') onToggle?.(next);
    };

    el.addEventListener('select', handleSelect as EventListener);
    el.addEventListener('change', handleChange as EventListener);
    el.addEventListener('toggle', handleToggle as EventListener);

    return () => {
      el.removeEventListener('select', handleSelect as EventListener);
      el.removeEventListener('change', handleChange as EventListener);
      el.removeEventListener('toggle', handleToggle as EventListener);
    };
  }, [onSelect, onOpenChange, onToggle]);

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

    if (typeof open === 'boolean') syncBool('open', open);
    else syncAttr('open', null);

    syncAttr('mode', mode && mode !== 'bar' ? mode : null);
    syncAttr('orientation', orientation && orientation !== 'horizontal' ? orientation : null);
    syncAttr('variant', variant && variant !== 'default' ? variant : null);
    syncBool('floating', floating);
    syncAttr('placement', placement && placement !== 'bottom-right' ? placement : null);
    syncBool('collapsible', collapsible);
    syncAttr('label', label || null);
    syncBool('headless', headless);
  }, [open, mode, orientation, variant, floating, placement, collapsible, label, headless]);

  return React.createElement('ui-quick-actions', { ref, ...rest }, children);
});

QuickActionsRoot.displayName = 'QuickActions';

/**
 * QuickActions.Action - Renders an action item in the `action` slot
 * @example
 * ```tsx
 * <QuickActions>
 *   <QuickActions.Action>Save</QuickActions.Action>
 *   <QuickActions.Action>Discard</QuickActions.Action>
 * </QuickActions>
 * ```
 */
const QuickActionsAction = React.forwardRef<HTMLElement, QuickActionsActionProps>(
  function QuickActionsAction({ children, ...props }, ref) {
    return React.createElement('button', { ref, slot: 'action', type: 'button', ...props }, children);
  }
);

QuickActionsAction.displayName = 'QuickActions.Action';

export const QuickActions = Object.assign(QuickActionsRoot, {
  Action: QuickActionsAction,
});

export default QuickActions;
