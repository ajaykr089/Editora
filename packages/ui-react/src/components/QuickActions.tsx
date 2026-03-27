import React from 'react';
import {
  getCustomEventDetail,
  syncBooleanAttribute,
  syncStringAttribute,
  useElementAttributes,
  useElementEventListeners,
  useForwardedHostRef,
} from './_internals';

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
  const ref = useForwardedHostRef<HTMLElement>(forwardedRef);

  const handleSelect = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<QuickActionSelectDetail>(event);
    if (detail) onSelect?.(detail);
  }, [onSelect]);

  const handleChange = React.useCallback((event: Event) => {
    const next = getCustomEventDetail<{ open?: boolean }>(event)?.open;
    if (typeof next === 'boolean') onOpenChange?.(next);
  }, [onOpenChange]);

  const handleToggle = React.useCallback((event: Event) => {
    const next = getCustomEventDetail<{ open?: boolean }>(event)?.open;
    if (typeof next === 'boolean') onToggle?.(next);
  }, [onToggle]);

  useElementEventListeners(
    ref,
    [
      { type: 'select', listener: handleSelect },
      { type: 'change', listener: handleChange },
      { type: 'toggle', listener: handleToggle },
    ],
    [handleSelect, handleChange, handleToggle]
  );

  useElementAttributes(ref, (el) => {
    if (typeof open === 'boolean') syncBooleanAttribute(el, 'open', open);
    else syncStringAttribute(el, 'open', null);
    syncStringAttribute(el, 'mode', mode && mode !== 'bar' ? mode : null);
    syncStringAttribute(el, 'orientation', orientation && orientation !== 'horizontal' ? orientation : null);
    syncStringAttribute(el, 'variant', variant && variant !== 'default' ? variant : null);
    syncBooleanAttribute(el, 'floating', floating);
    syncStringAttribute(el, 'placement', placement && placement !== 'bottom-right' ? placement : null);
    syncBooleanAttribute(el, 'collapsible', collapsible);
    syncStringAttribute(el, 'label', label || null);
    syncBooleanAttribute(el, 'headless', headless);
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
