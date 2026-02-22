import React from 'react';
import { Box, Button, Flex, QuickActions } from '@editora/ui-react';

export default {
  title: 'UI/QuickActions',
  component: QuickActions,
  argTypes: {
    mode: { control: 'select', options: ['bar', 'fab'] },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    variant: { control: 'select', options: ['default', 'soft', 'contrast', 'minimal'] },
    floating: { control: 'boolean' },
    collapsible: { control: 'boolean' }
  }
};

export const ActionBar = (args: any) => {
  const [message, setMessage] = React.useState('No action selected');

  return (
    <Box style={{ minHeight: 240, display: 'grid', gap: 10, alignContent: 'start' }}>
      <QuickActions
        mode={args.mode || 'bar'}
        orientation={args.orientation || 'horizontal'}
        variant={args.variant || 'default'}
        floating={!!args.floating}
        collapsible={typeof args.collapsible === 'boolean' ? args.collapsible : true}
        onSelect={(detail) => setMessage(`Selected: ${detail.label}`)}
      >
        <Button slot="action" size="sm">Create</Button>
        <Button slot="action" size="sm" variant="secondary">Assign</Button>
        <Button slot="action" size="sm" variant="ghost">Export</Button>
      </QuickActions>

      <Box style={{ fontSize: 'var(--ui-font-size-md, 14px)', color: 'var(--ui-color-muted, #64748b)' }}>{message}</Box>
    </Box>
  );
};

ActionBar.args = {
  mode: 'bar',
  orientation: 'horizontal',
  variant: 'default',
  floating: false,
  collapsible: true
};

export const FloatingFab = () => (
  <Box style={{ minHeight: 320, border: '1px solid var(--ui-color-border, #cbd5e1)', borderRadius: 'calc(var(--ui-radius, 12px) + 2px)', position: 'relative', padding: 'var(--ui-space-lg, 16px)' }}>
    <Flex style={{ fontSize: 'var(--ui-font-size-md, 14px)', color: 'var(--ui-color-muted, #64748b)' }}>Floating quick actions for dense admin workflows.</Flex>
    <QuickActions mode="fab" floating placement="bottom-right" label="Quick actions" onSelect={() => {}}>
      <Button slot="action" size="sm">New patient</Button>
      <Button slot="action" size="sm" variant="secondary">New class</Button>
      <Button slot="action" size="sm" variant="ghost">New invoice</Button>
    </QuickActions>
  </Box>
);

export const ContrastVertical = () => (
  <Box variant="contrast" p="12px" radius="lg" style={{ maxWidth: 240 }}>
    <QuickActions mode="bar" orientation="vertical" variant="contrast" collapsible>
      <Button slot="action" size="sm">Alerts</Button>
      <Button slot="action" size="sm" variant="secondary">Incidents</Button>
      <Button slot="action" size="sm" variant="ghost">Escalate</Button>
    </QuickActions>
  </Box>
);
