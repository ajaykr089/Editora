import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge, Box, Button, Card, Flex, Grid } from '@editora/ui-react';
import { ActivityIcon, AlertTriangleIcon, CheckCircleIcon, ClockIcon, ShieldIcon, XCircleIcon } from '@editora/react-icons';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  args: {
    tone: 'neutral',
    variant: 'surface',
    size: 'md',
    radius: 'full',
    elevation: 'none',
    state: 'idle',
    dot: false,
    interactive: false,
    removable: false,
    disabled: false,
    truncate: false,
    text: 'Operations',
  },
  argTypes: {
    tone: { control: 'select', options: ['neutral', 'info', 'success', 'warning', 'danger', 'purple'] },
    variant: { control: 'select', options: ['surface', 'soft', 'solid', 'outline', 'ghost'] },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', '1', '2', '3'] },
    radius: { control: 'text' },
    elevation: { control: 'select', options: ['none', 'low', 'high'] },
    state: { control: 'select', options: ['idle', 'loading', 'error', 'success'] },
    dot: { control: 'boolean' },
    interactive: { control: 'boolean' },
    removable: { control: 'boolean' },
    disabled: { control: 'boolean' },
    truncate: { control: 'boolean' },
    maxWidth: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Playground: Story = {
  render: (args) => (
    <Grid style={{ gap: 16, maxInlineSize: 760 }}>
      <Card radius={16}>
        <Card.Header>
          <Card.Title>Badge</Card.Title>
          <Card.Description>
            Compact status surface for workflow labels, queue states, live filters, and removable metadata chips.
          </Card.Description>
        </Card.Header>
        <Box slot="inset" style={{ padding: 16 }}>
          <Flex align="center" justify="space-between" style={{ gap: 12, flexWrap: 'wrap' }}>
            <Flex align="center" style={{ gap: 10, flexWrap: 'wrap' }}>
              <Badge {...args}>{args.text}</Badge>
              <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>
                Attached to the real `ui-badge` API: tone, variant, size, radius, elevation, state, and interaction props.
              </Box>
            </Flex>
          </Flex>
        </Box>
      </Card>
    </Grid>
  ),
};

export const VariantGallery: Story = {
  render: () => (
    <Grid style={{ gap: 14, maxInlineSize: 980 }}>
      {[
        { label: 'Surface', variant: 'surface', tone: 'neutral', icon: <ShieldIcon size={12} /> },
        { label: 'Soft', variant: 'soft', tone: 'info', icon: <ActivityIcon size={12} /> },
        { label: 'Outline', variant: 'outline', tone: 'warning', icon: <ClockIcon size={12} /> },
        { label: 'Solid', variant: 'solid', tone: 'success', icon: <CheckCircleIcon size={12} /> },
        { label: 'Ghost', variant: 'ghost', tone: 'danger', icon: <AlertTriangleIcon size={12} /> },
      ].map((entry) => (
        <Grid key={entry.label} style={{ gap: 8 }}>
          <Box style={{ fontSize: 13, fontWeight: 600, color: 'var(--ui-color-muted, #64748b)' }}>{entry.label}</Box>
          <Flex align="center" style={{ gap: 10, flexWrap: 'wrap' }}>
            <Badge variant={entry.variant as any} tone={entry.tone as any} radius="full">
              <span slot="icon">{entry.icon}</span>
              {entry.label} workflow
            </Badge>
            <Badge variant={entry.variant as any} tone={entry.tone as any} radius={12} dot>
              {entry.label} queue
            </Badge>
            <Badge variant={entry.variant as any} tone={entry.tone as any} radius={4} elevation="low">
              {entry.label} tag
            </Badge>
          </Flex>
        </Grid>
      ))}
    </Grid>
  ),
};

export const SizeGallery: Story = {
  render: () => (
    <Grid style={{ gap: 14, maxInlineSize: 880 }}>
      {[
        { label: 'Extra small', size: 'xs' },
        { label: 'Small', size: 'sm' },
        { label: 'Medium', size: 'md' },
        { label: 'Large', size: 'lg' },
        { label: 'Extra large', size: 'xl' },
      ].map((entry) => (
        <Grid key={entry.label} style={{ gap: 8 }}>
          <Box style={{ fontSize: 13, fontWeight: 600, color: 'var(--ui-color-muted, #64748b)' }}>{entry.label}</Box>
          <Flex align="center" style={{ gap: 10, flexWrap: 'wrap' }}>
            <Badge size={entry.size as any} tone="info" variant="surface">
              <span slot="icon">
                <ActivityIcon size={12} />
              </span>
              Live monitor
            </Badge>
            <Badge size={entry.size as any} tone="success" variant="soft" dot>
              Healthy
            </Badge>
            <Badge size={entry.size as any} tone="warning" variant="outline" removable>
              Needs review
            </Badge>
          </Flex>
        </Grid>
      ))}
    </Grid>
  ),
};

export const StateGallery: Story = {
  render: () => (
    <Grid style={{ gap: 14, maxInlineSize: 900 }}>
      <Flex align="center" style={{ gap: 10, flexWrap: 'wrap' }}>
        <Badge tone="neutral" variant="surface">
          Idle
        </Badge>
        <Badge tone="info" variant="soft" state="loading">
          Syncing queue
        </Badge>
        <Badge tone="danger" variant="outline" state="error">
          <span slot="icon">
            <XCircleIcon size={12} />
          </span>
          Feed delayed
        </Badge>
        <Badge tone="success" variant="solid" state="success" dot>
          Healthy
        </Badge>
        <Badge tone="purple" variant="surface" elevation="high">
          Priority
        </Badge>
        <Badge tone="warning" variant="ghost" interactive>
          Clickable
        </Badge>
        <Badge tone="neutral" variant="surface" disabled>
          Disabled
        </Badge>
      </Flex>
    </Grid>
  ),
};

export const OperationsFilterPattern: Story = {
  render: () => {
    const [selected, setSelected] = React.useState('critical');
    const [filters, setFilters] = React.useState([
      { id: 'critical', label: 'Critical', tone: 'danger' as const, icon: <AlertTriangleIcon size={12} />, count: 7 },
      { id: 'monitoring', label: 'Monitoring', tone: 'warning' as const, icon: <ClockIcon size={12} />, count: 11 },
      { id: 'stable', label: 'Stable', tone: 'success' as const, icon: <CheckCircleIcon size={12} />, count: 32 },
      { id: 'telemetry', label: 'Telemetry', tone: 'info' as const, icon: <ActivityIcon size={12} />, count: 5 },
    ]);

    return (
      <Grid style={{ gap: 14, maxInlineSize: 980 }}>
        <Card radius={16}>
          <Card.Header>
            <Card.Title>Incident filter rail</Card.Title>
            <Card.Description>
              Interactive triage labels, queue states, and removable routing chips for production monitoring surfaces.
            </Card.Description>
          </Card.Header>

          <Box slot="inset" style={{ padding: 14, display: 'grid', gap: 14 }}>
            <Grid style={{ gap: 8 }}>
              <Box style={{ fontSize: 13, color: 'var(--ui-color-muted, #64748b)' }}>Active filters</Box>
              <Flex align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
                {filters.map((filter) => {
                  const active = selected === filter.id;
                  return (
                    <Badge
                      key={filter.id}
                      tone={filter.tone}
                      variant={active ? 'solid' : 'soft'}
                      interactive
                      dot
                      elevation={active ? 'high' : 'none'}
                      onClick={() => setSelected(filter.id)}
                    >
                      <span slot="icon">{filter.icon}</span>
                      {filter.label} ({filter.count})
                    </Badge>
                  );
                })}
                <Badge tone="warning" variant="outline" state="loading">
                  Syncing queue
                </Badge>
              </Flex>
            </Grid>

            <Grid style={{ gap: 8 }}>
              <Flex align="center" justify="space-between" style={{ gap: 10, flexWrap: 'wrap' }}>
                <Box style={{ fontSize: 13, color: 'var(--ui-color-muted, #64748b)' }}>Routing chips</Box>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    setFilters([
                      { id: 'critical', label: 'Critical', tone: 'danger', icon: <AlertTriangleIcon size={12} />, count: 7 },
                      { id: 'monitoring', label: 'Monitoring', tone: 'warning', icon: <ClockIcon size={12} />, count: 11 },
                      { id: 'stable', label: 'Stable', tone: 'success', icon: <CheckCircleIcon size={12} />, count: 32 },
                      { id: 'telemetry', label: 'Telemetry', tone: 'info', icon: <ActivityIcon size={12} />, count: 5 },
                    ])
                  }
                >
                  Reset filters
                </Button>
              </Flex>

              <Flex align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
                {filters.map((filter) => (
                  <Badge
                    key={`${filter.id}-chip`}
                    tone={filter.tone}
                    variant="outline"
                    removable
                    truncate
                    maxWidth="18ch"
                    onRemove={() => setFilters((current) => current.filter((entry) => entry.id !== filter.id))}
                  >
                    <span slot="icon">{filter.icon}</span>
                    {filter.label} escalation route
                  </Badge>
                ))}
              </Flex>
            </Grid>
          </Box>
        </Card>
      </Grid>
    );
  },
};
