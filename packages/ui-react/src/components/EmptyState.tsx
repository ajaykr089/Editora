import React, { useEffect, useRef } from 'react';

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

  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = () => onAction?.();
    el.addEventListener('action', handler as EventListener);
    return () => el.removeEventListener('action', handler as EventListener);
  }, [onAction]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (title) el.setAttribute('title', title);
    else el.removeAttribute('title');

    if (description) el.setAttribute('description', description);
    else el.removeAttribute('description');

    if (actionLabel) el.setAttribute('action-label', actionLabel);
    else el.removeAttribute('action-label');

    if (tone) el.setAttribute('tone', tone);
    else el.removeAttribute('tone');

    if (compact) el.setAttribute('compact', '');
    else el.removeAttribute('compact');

    if (headless) el.setAttribute('headless', '');
    else el.removeAttribute('headless');
  }, [title, description, actionLabel, tone, compact, headless]);

  return React.createElement('ui-empty-state', { ref, ...rest }, children);
}

export default EmptyState;
