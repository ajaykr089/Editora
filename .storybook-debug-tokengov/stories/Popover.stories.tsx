import React from 'react';
import { Box, Button, Flex, Popover } from '@editora/ui-react';

export default {
  title: 'UI/Popover',
  component: Popover,
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'top-start', 'top-end', 'right', 'right-start', 'right-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end']
    },
    offset: { control: 'number' },
    shift: { control: 'boolean' },
    flip: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' },
    closeOnOutside: { control: 'boolean' },
    variant: { control: 'select', options: ['surface', 'soft', 'solid', 'glass', 'contrast', 'minimal'] },
    tone: { control: 'select', options: ['brand', 'neutral', 'info', 'success', 'warning', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    elevation: { control: 'select', options: ['none', 'low', 'high'] },
    radius: { control: 'text' }
  }
};

export const Playground = (args: any) => (
  <Box style={{ padding: 60 }}>
    <Popover
      placement={args.placement}
      offset={args.offset}
      shift={args.shift}
      flip={args.flip}
      closeOnEscape={args.closeOnEscape}
      closeOnOutside={args.closeOnOutside}
      variant={args.variant}
      tone={args.tone}
      size={args.size}
      elevation={args.elevation}
      radius={args.radius}
    >
      <Popover.Trigger>
        <Button>Show popover</Button>
      </Popover.Trigger>
      <Popover.Content style={{ minWidth: 220 }}>
        <Box style={{ fontWeight: 700 }}>Popover content</Box>
        <Box style={{ fontSize: '0.92em', color: 'var(--ui-color-muted, #64748b)' }}>
          Floating panel with the same theme and size tokens as newer surface components.
        </Box>
      </Popover.Content>
    </Popover>
  </Box>
);

Playground.args = {
  placement: 'bottom',
  offset: 8,
  shift: true,
  flip: true,
  closeOnEscape: true,
  closeOnOutside: true,
  variant: 'surface',
  tone: 'brand',
  size: 'md',
  elevation: 'low',
  radius: ''
};

export const CompositionSlots = () => (
  <Flex style={{ display: 'flex', gap: 16, padding: 60, flexWrap: 'wrap' }}>
    {/* Trigger only — minimal */}
    <Popover closeOnOutside>
      <Popover.Trigger>
        <Button variant="secondary">Trigger only</Button>
      </Popover.Trigger>
      <Popover.Content>
        Minimal popover body.
      </Popover.Content>
    </Popover>

    {/* Rich content */}
    <Popover placement="bottom-start" offset={8} closeOnOutside closeOnEscape variant="soft" tone="brand" size="md">
      <Popover.Trigger>
        <Button>Rich content</Button>
      </Popover.Trigger>
      <Popover.Content style={{ minWidth: 240 }}>
        <Box style={{ fontWeight: 600, marginBottom: 6 }}>Workspace settings</Box>
        <Box style={{ fontSize: 13, color: '#64748b' }}>
          Manage members, billing, and integrations from this panel.
        </Box>
      </Popover.Content>
    </Popover>

    {/* Custom trigger element */}
    <Popover placement="top" offset={8} closeOnOutside variant="minimal" tone="neutral" size="sm">
      <Popover.Trigger>
        <span style={{ cursor: 'pointer', textDecoration: 'underline', fontSize: 14 }}>
          What is this?
        </span>
      </Popover.Trigger>
      <Popover.Content style={{ maxWidth: 220, fontSize: 13 }}>
        Any element can be a trigger — not just buttons.
      </Popover.Content>
    </Popover>
  </Flex>
);

export const VariantGallery = () => (
  <Box style={{ padding: 32 }}>
    <Box style={{ marginBottom: 18, fontSize: 13, color: '#64748b' }}>
      Surface variants, tones, and sizes now use the same token pattern as the newer overlay and card components.
    </Box>
    <Box
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 20,
      }}
    >
      {([
        { label: 'Surface / Brand', variant: 'surface', tone: 'brand', size: 'md' },
        { label: 'Soft / Success', variant: 'soft', tone: 'success', size: 'md' },
        { label: 'Solid / Warning', variant: 'solid', tone: 'warning', size: 'lg' },
        { label: 'Glass / Info', variant: 'glass', tone: 'info', size: 'md' },
        { label: 'Contrast / Danger', variant: 'contrast', tone: 'danger', size: 'md' },
        { label: 'Minimal / Neutral', variant: 'minimal', tone: 'neutral', size: 'sm' },
      ] as const).map((entry) => (
        <Box
          key={entry.label}
          style={{
            minHeight: 200,
            border: '1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 78%, transparent)',
            borderRadius: 18,
            padding: 20,
            background: 'color-mix(in srgb, var(--ui-color-surface, #ffffff) 98%, transparent)',
            display: 'grid',
            placeItems: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            style={{
              position: 'absolute',
              top: 14,
              left: 14,
              fontSize: 12,
              lineHeight: 1.4,
              color: '#64748b',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {entry.label}
          </Box>
          <Popover
            placement="bottom"
            offset={12}
            closeOnOutside
            variant={entry.variant}
            tone={entry.tone}
            size={entry.size}
            elevation={entry.variant === 'minimal' ? 'none' : 'low'}
          >
            <Popover.Trigger>
              <Button variant="secondary">Preview</Button>
            </Popover.Trigger>
            <Popover.Content style={{ minWidth: 210 }}>
              <Box style={{ fontWeight: 700 }}>{entry.label}</Box>
              <Box style={{ fontSize: '0.92em', color: 'var(--ui-color-muted, #64748b)' }}>
                Popover panels inherit their surface tokens directly from the root component.
              </Box>
            </Popover.Content>
          </Popover>
        </Box>
      ))}
    </Box>
  </Box>
);

export const PlacementMatrix = () => (
  <Box style={{ padding: 32 }}>
    <Box style={{ marginBottom: 16, fontSize: 13, color: '#64748b' }}>
      Each tile disables <code>flip</code> and <code>shift</code> so the requested placement stays fixed for review.
    </Box>
    <Box
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 20,
      }}
    >
      {(
        [
          'top',
          'top-start',
          'top-end',
          'right',
          'right-start',
          'right-end',
          'bottom',
          'bottom-start',
          'bottom-end',
          'left',
          'left-start',
          'left-end',
        ] as const
      ).map((placement) => (
        <Box
          key={placement}
          style={{
            minHeight: 220,
            border: '1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 78%, transparent)',
            borderRadius: 18,
            padding: 20,
            background: 'color-mix(in srgb, var(--ui-color-surface, #ffffff) 98%, transparent)',
            display: 'grid',
            placeItems: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            style={{
              position: 'absolute',
              top: 14,
              left: 14,
              fontSize: 12,
              lineHeight: 1.4,
              color: '#64748b',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            {placement}
          </Box>
          <Popover
            key={placement}
            placement={placement}
            offset={12}
            flip={false}
            shift={false}
            closeOnOutside
            variant="surface"
            tone="brand"
            elevation="low"
          >
            <Popover.Trigger>
              <Button variant="secondary">Open</Button>
            </Popover.Trigger>
            <Popover.Content style={{ minWidth: 180 }}>
              Placement: <strong>{placement}</strong>
            </Popover.Content>
          </Popover>
        </Box>
      ))}
    </Box>
  </Box>
);

export const Controlled = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <Box style={{ padding: 60 }}>
      <Flex style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <Button onClick={() => setOpen(true)}>Open</Button>
        <Button variant="secondary" onClick={() => setOpen(false)}>Close</Button>
      </Flex>
      <Popover
        open={open}
        placement="bottom"
        offset={8}
        onOpenChange={({ open: next }) => setOpen(next)}
        closeOnOutside
        closeOnEscape
        variant="soft"
        tone="info"
        elevation="low"
      >
        <Popover.Trigger>
          <Button>Controlled trigger</Button>
        </Popover.Trigger>
        <Popover.Content style={{ minWidth: 200 }}>
          <Box style={{ fontWeight: 600, marginBottom: 4 }}>Controlled popover</Box>
          <Box style={{ fontSize: 13, color: '#64748b' }}>Open state: <strong>{String(open)}</strong></Box>
        </Popover.Content>
      </Popover>
    </Box>
  );
};
