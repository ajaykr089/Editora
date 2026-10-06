import React from 'react';
import '@editora/ui-core/empty-state';
import {
  createUIElement,
  syncBooleanAttribute,
  syncStringAttribute,
  useElementAttributes,
  useElementEventListeners,
  useForwardedHostRef,
} from './_internals';

export type EmptyStateProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  actionLabel?: string;
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
  compact?: boolean;
  headless?: boolean;
  onAction?: () => void;
};

export const EmptyState = React.forwardRef<HTMLElement, EmptyStateProps>(function EmptyState(props, forwardedRef) {
  const {
    title,
    description,
    actionLabel,
    tone,
    compact,
    headless,
    onAction,
    children,
    ...rest
  } = props;

  const ref = useForwardedHostRef<HTMLElement>(forwardedRef);

  const handler = React.useCallback(() => {
    onAction?.();
  }, [onAction]);

  useElementEventListeners(ref, [{ type: 'action', listener: handler as EventListener }], [handler]);

  useElementAttributes(ref, (el) => {
    syncStringAttribute(el, 'title', title ?? null);
    syncStringAttribute(el, 'description', description ?? null);
    syncStringAttribute(el, 'action-label', actionLabel ?? null);
    syncStringAttribute(el, 'tone', tone ?? null);
    syncBooleanAttribute(el, 'compact', compact);
    syncBooleanAttribute(el, 'headless', headless);
  }, [title, description, actionLabel, tone, compact, headless]);

  return createUIElement('ui-empty-state', { ref, ...rest }, children);
});

EmptyState.displayName = 'EmptyState';

export default EmptyState;
