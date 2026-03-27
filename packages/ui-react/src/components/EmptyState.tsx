import React from 'react';
import {
  syncBooleanAttribute,
  syncStringAttribute,
  useElementAttributes,
  useElementEventListeners,
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

export function EmptyState(props: EmptyStateProps) {
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

  const ref = React.useRef<HTMLElement | null>(null);

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

  return React.createElement('ui-empty-state', { ref, ...rest }, children);
}

export default EmptyState;
