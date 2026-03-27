import React from 'react';
import { Button, EmptyState, Flex } from '@editora/ui-react';

export default {
  title: 'UI/EmptyState',
  component: EmptyState,
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    actionLabel: { control: 'text' },
    tone: { control: 'radio', options: ['neutral', 'success', 'warning', 'danger'] },
    compact: { control: 'boolean' }
  }
};

export const Default = (args: any) => (
  <EmptyState
    title={args.title}
    description={args.description}
    actionLabel={args.actionLabel}
    tone={args.tone}
    compact={args.compact}
  />
);

Default.args = {
  title: 'No users matched your filter',
  description: 'Try changing role filters or invite a new team member.',
  actionLabel: 'Invite user',
  tone: 'neutral',
  compact: false
};

export const SlottedActions = () => (
  <EmptyState title="No invoices" description="Create your first invoice to start collecting payments.">
    <span slot="icon">USD</span>
    <Flex slot="actions" style={{ display: 'flex', gap: 8 }}>
      <Button size="sm">Create invoice</Button>
      <Button size="sm" variant="secondary">Import data</Button>
    </Flex>
  </EmptyState>
);
