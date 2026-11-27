import * as React from 'react';
import '@editora/ui-core/trace-item';
import {
  createUIElement,
  getCustomEventDetail,
  syncBooleanAttribute,
  syncStringAttribute,
  useElementAttributes,
  useElementEventListeners,
  useForwardedHostRef,
} from './_internals';

export type TraceItemStatus = 'running' | 'pending' | 'error';

export type TraceItemProps = Omit<React.HTMLAttributes<HTMLElement>, 'onToggle'> & {
  /** What happened, as a sentence ("Failed to run pnpm build"). */
  label?: string;
  /** Secondary text: a duration, a count, a diff stat. */
  description?: string;
  /** Unset means done. */
  status?: TraceItemStatus;
  /** Expanded (when it has children). Controlled with onOpenChange; omit for uncontrolled. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  href?: string;
  target?: string;
};

export const TraceItem = React.forwardRef<HTMLElement, TraceItemProps>(function TraceItem(props, forwardedRef) {
  const { label, description, status, open, defaultOpen, onOpenChange, href, target, children, ...rest } = props;
  const ref = useForwardedHostRef<HTMLElement>(forwardedRef);
  const controlled = open !== undefined;

  const handleToggle = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<{ open: boolean }>(event);
    if (!detail) return;
    // Controlled: the prop decides, so put the element back until the parent re-renders.
    if (controlled) (event.currentTarget as HTMLElement).toggleAttribute('open', !!open);
    onOpenChange?.(detail.open);
  }, [controlled, open, onOpenChange]);
  useElementEventListeners(ref, [{ type: 'toggle', listener: handleToggle }], [handleToggle], { hostOnly: true });

  const initialOpen = React.useRef(defaultOpen);
  useElementAttributes(ref, (el) => {
    syncStringAttribute(el, 'label', label ?? null);
    syncStringAttribute(el, 'description', description ?? null);
    syncStringAttribute(el, 'status', status ?? null);
    syncStringAttribute(el, 'href', href ?? null);
    syncStringAttribute(el, 'target', target ?? null);
    if (controlled) syncBooleanAttribute(el, 'open', open);
    else if (initialOpen.current !== undefined) {
      syncBooleanAttribute(el, 'open', initialOpen.current);
      initialOpen.current = undefined;
    }
  }, [label, description, status, href, target, controlled, open]);

  return createUIElement('ui-trace-item', { ref, ...rest }, children);
});
TraceItem.displayName = 'TraceItem';

export default TraceItem;
