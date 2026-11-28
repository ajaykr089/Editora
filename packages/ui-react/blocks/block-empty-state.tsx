// block: An empty state: a simple illustration, what is missing, and the first action to take.
import * as React from 'react';
import { Box, Button, Flex, Heading, Text } from '@editora/ui-react';

export type EmptyStateBlockProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  secondaryLabel?: string;
  onAction?: () => void;
  onSecondary?: () => void;
};

/** What a list or page shows before it has content. */
export function EmptyStateBlock({
  title = 'No projects yet',
  description = 'Projects keep your documents, people and settings together. Create one to get started.',
  actionLabel = 'New project',
  secondaryLabel = 'Import',
  onAction,
  onSecondary,
}: EmptyStateBlockProps) {
  return (
    <Box style={{ display: 'grid', placeItems: 'center', padding: 32, textAlign: 'center', border: '1px dashed var(--ui-color-border, #d4d4d8)', borderRadius: 12 }}>
      <div style={{ display: 'grid', gap: 12, justifyItems: 'center', maxWidth: 420 }}>
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
          <rect x="8" y="14" width="48" height="38" rx="6" stroke="currentColor" strokeOpacity="0.35" strokeWidth="2" />
          <path d="M8 24h48" stroke="currentColor" strokeOpacity="0.35" strokeWidth="2" />
          <path d="M32 32v12M26 38h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <Heading level={2} size="lg">{title}</Heading>
        <Text variant="muted">{description}</Text>
        <Flex style={{ gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button onClick={onAction}>{actionLabel}</Button>
          {secondaryLabel ? <Button variant="secondary" onClick={onSecondary}>{secondaryLabel}</Button> : null}
        </Flex>
      </div>
    </Box>
  );
}

export default EmptyStateBlock;
