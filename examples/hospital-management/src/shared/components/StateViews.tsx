import React from 'react';
import { Alert, Box, Button, EmptyState, Grid, Skeleton } from '@editora/ui-react';

type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
};

export function ErrorStateView({ title, description, onRetry }: ErrorStateProps) {
  return (
    <Alert tone="danger" title={title || 'Unable to load data'} description={description || 'Please retry in a moment.'}>
      {onRetry ? (
        <Button slot="action" size="sm" variant="secondary" onClick={onRetry}>
          Retry
        </Button>
      ) : null}
    </Alert>
  );
}

export function EmptyStateView({
  title,
  description,
  actionLabel,
  onAction
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <EmptyState title={title} description={description}>
      {actionLabel && onAction ? (
        <Button slot="action" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </EmptyState>
  );
}

export function TableSkeleton() {
  return (
    <Grid style={{ display: 'grid', gap: 8 }}>
      <Skeleton style={{ height: 38 }} />
      <Skeleton style={{ height: 38 }} />
      <Skeleton style={{ height: 38 }} />
      <Skeleton style={{ height: 38 }} />
      <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>Loading records…</Box>
    </Grid>
  );
}
