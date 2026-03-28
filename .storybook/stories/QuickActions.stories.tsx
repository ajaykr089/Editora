import React from 'react';
import { Box, Flex, QuickActions } from '@editora/ui-react';

const metaTextStyle: React.CSSProperties = {
  fontSize: 'var(--ui-font-size-sm, 12px)',
  color: 'var(--ui-color-muted, #64748b)'
};

const subtleTextStyle: React.CSSProperties = {
  fontSize: 'var(--ui-font-size-xs, 11px)',
  color: 'color-mix(in srgb, var(--ui-color-muted, #64748b) 82%, transparent)'
};

export default {
  title: 'UI/QuickActions',
  component: QuickActions,
  argTypes: {
    mode: { control: 'select', options: ['bar', 'fab'] },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    variant: { control: 'select', options: ['default', 'soft', 'contrast', 'minimal'] },
    floating: { control: 'boolean' },
    collapsible: { control: 'boolean' },
    label: { control: 'text' }
  }
};

export const Playground = (args: any) => {
  const [message, setMessage] = React.useState('No action selected');

  return (
    <Box style={{ minHeight: 240, display: 'grid', gap: 12, alignContent: 'start' }}>
      <QuickActions
        mode={args.mode}
        orientation={args.orientation}
        variant={args.variant}
        floating={args.floating}
        collapsible={args.collapsible}
        label={args.label}
        onSelect={(detail) => setMessage(`Selected: ${detail.label}`)}
      >
        <QuickActions.Action>Create</QuickActions.Action>
        <QuickActions.Action>Assign</QuickActions.Action>
        <QuickActions.Action>Export</QuickActions.Action>
      </QuickActions>
      <Box style={metaTextStyle}>{message}</Box>
    </Box>
  );
};

Playground.args = {
  mode: 'bar',
  orientation: 'horizontal',
  variant: 'default',
  floating: false,
  collapsible: true,
  label: 'Quick actions'
};

export const CompositionSlots = () => {
  const [last, setLast] = React.useState('—');

  return (
    <Box style={{ display: 'grid', gap: 24, padding: 16 }}>
      {/* Bar — horizontal */}
      <Box style={{ display: 'grid', gap: 6 }}>
        <Box style={subtleTextStyle}>Bar · horizontal</Box>
        <QuickActions mode="bar" orientation="horizontal" onSelect={(d) => setLast(d.label)}>
          <QuickActions.Action>Save</QuickActions.Action>
          <QuickActions.Action>Duplicate</QuickActions.Action>
          <QuickActions.Action>Archive</QuickActions.Action>
        </QuickActions>
      </Box>

      {/* Bar — vertical */}
      <Box style={{ display: 'grid', gap: 6 }}>
        <Box style={subtleTextStyle}>Bar · vertical</Box>
        <QuickActions mode="bar" orientation="vertical" onSelect={(d) => setLast(d.label)}>
          <QuickActions.Action>Alerts</QuickActions.Action>
          <QuickActions.Action>Incidents</QuickActions.Action>
          <QuickActions.Action>Escalate</QuickActions.Action>
        </QuickActions>
      </Box>

      {/* Collapsible */}
      <Box style={{ display: 'grid', gap: 6 }}>
        <Box style={subtleTextStyle}>Collapsible bar</Box>
        <QuickActions mode="bar" collapsible label="Document actions" onSelect={(d) => setLast(d.label)}>
          <QuickActions.Action>Publish</QuickActions.Action>
          <QuickActions.Action>Preview</QuickActions.Action>
          <QuickActions.Action>Delete</QuickActions.Action>
        </QuickActions>
      </Box>

      <Box style={metaTextStyle}>Last selected: <strong>{last}</strong></Box>
    </Box>
  );
};

export const Variants = () => (
  <Box style={{ display: 'grid', gap: 20, padding: 16 }}>
    {(['default', 'soft', 'contrast', 'minimal'] as const).map((variant) => (
      <Box key={variant} style={{ display: 'grid', gap: 6 }}>
        <Box style={subtleTextStyle}>{variant}</Box>
        <QuickActions mode="bar" variant={variant}>
          <QuickActions.Action>Create</QuickActions.Action>
          <QuickActions.Action>Edit</QuickActions.Action>
          <QuickActions.Action>Delete</QuickActions.Action>
        </QuickActions>
      </Box>
    ))}
  </Box>
);

export const FloatingFab = () => (
  <Box style={{ minHeight: 320, border: '1px solid var(--ui-color-border, #e2e8f0)', borderRadius: 12, position: 'relative', padding: 16 }}>
    <Flex style={metaTextStyle}>
      Floating FAB — fixed to bottom-right of its containing block.
    </Flex>
    <QuickActions mode="fab" floating placement="bottom-right" label="Quick actions">
      <QuickActions.Action>New patient</QuickActions.Action>
      <QuickActions.Action>New class</QuickActions.Action>
      <QuickActions.Action>New invoice</QuickActions.Action>
    </QuickActions>
  </Box>
);

export const Controlled = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <Box style={{ display: 'grid', gap: 12, padding: 16 }}>
      <Flex style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => setOpen(true)}>Open</button>
        <button onClick={() => setOpen(false)}>Close</button>
      </Flex>
      <QuickActions
        mode="bar"
        collapsible
        open={open}
        onOpenChange={(next) => setOpen(next)}
        label="Controlled actions"
      >
        <QuickActions.Action>Approve</QuickActions.Action>
        <QuickActions.Action>Reject</QuickActions.Action>
        <QuickActions.Action>Defer</QuickActions.Action>
      </QuickActions>
      <Box style={metaTextStyle}>open: <strong>{String(open)}</strong></Box>
    </Box>
  );
};
