import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box, Breadcrumb, Card, CardDescription, CardHeader, CardTitle, Flex, Grid } from '@editora/ui-react';
import { CheckCircleIcon, FolderIcon, HomeIcon, ShieldIcon, SparklesIcon } from '@editora/react-icons';

const meta: Meta<typeof Breadcrumb> = {
  title: 'UI/Breadcrumb',
  component: Breadcrumb,
  args: {
    separator: '/',
    maxItems: 6,
    currentIndex: 3,
    size: 'md',
    variant: 'surface',
    tone: 'neutral',
    radius: 'md',
    elevation: 'none',
    state: 'idle',
    disabled: false,
  },
  argTypes: {
    separator: { control: 'text' },
    maxItems: { control: { type: 'number', min: 3, max: 10, step: 1 } },
    currentIndex: { control: { type: 'number', min: 0, max: 10, step: 1 } },
    size: { control: 'select', options: ['sm', 'md', 'lg', '1', '2', '3'] },
    variant: { control: 'select', options: ['surface', 'soft', 'solid', 'outline', 'ghost', 'minimal'] },
    tone: { control: 'select', options: ['neutral', 'info', 'success', 'warning', 'danger'] },
    radius: { control: 'text' },
    elevation: { control: 'select', options: ['none', 'low', 'high'] },
    state: { control: 'select', options: ['idle', 'loading', 'error', 'success'] },
    disabled: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof Breadcrumb>;

const trail = ['Workspace', 'Programs', 'Spring release', 'Governance', 'Audit logs'];

export const Playground: Story = {
  render: (args) => (
    <Grid style={{ gap: 16, maxInlineSize: 860 }}>
      <Card radius={16}>
        <CardHeader>
          <CardTitle>Breadcrumb</CardTitle>
          <CardDescription>
            Hierarchical navigation with collapse logic, keyboard support, and theme-backed visual variants.
          </CardDescription>
        </CardHeader>
        <Box slot="inset" style={{ padding: 16, display: 'grid', gap: 12 }}>
          <Breadcrumb {...args} ariaLabel="Release navigation">
            <Breadcrumb.Item label="Workspace" index={0}>
              <HomeIcon size={13} style={{ marginInlineEnd: 4 }} />
              Workspace
            </Breadcrumb.Item>
            <Breadcrumb.Item label="Programs" index={1}>
              <FolderIcon size={13} style={{ marginInlineEnd: 4 }} />
              Programs
            </Breadcrumb.Item>
            <Breadcrumb.Item label="Spring release" index={2}>Spring release</Breadcrumb.Item>
            <Breadcrumb.Item label="Governance" index={3}>Governance</Breadcrumb.Item>
            <Breadcrumb.Item label="Audit logs" index={4}>Audit logs</Breadcrumb.Item>
          </Breadcrumb>
          <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>
            Uses the real breadcrumb API: `variant`, `size`, `radius`, `elevation`, `tone`, `state`, and `onSelect`.
          </Box>
        </Box>
      </Card>
    </Grid>
  ),
};

export const VariantGallery: Story = {
  render: () => (
    <Grid style={{ gap: 14, maxInlineSize: 920 }}>
      {[
        { label: 'Surface', variant: 'surface', tone: 'neutral' },
        { label: 'Soft', variant: 'soft', tone: 'info' },
        { label: 'Solid', variant: 'solid', tone: 'success' },
        { label: 'Outline', variant: 'outline', tone: 'warning' },
        { label: 'Ghost', variant: 'ghost', tone: 'danger' },
        { label: 'Minimal', variant: 'minimal', tone: 'neutral' },
      ].map((entry) => (
        <Grid key={entry.label} style={{ gap: 8 }}>
          <Box style={{ fontSize: 13, fontWeight: 600, color: 'var(--ui-color-muted, #64748b)' }}>{entry.label}</Box>
          <Breadcrumb
            separator="/"
            currentIndex={3}
            variant={entry.variant as any}
            tone={entry.tone as any}
            radius={entry.variant === 'ghost' ? 'none' : 'md'}
            elevation={entry.variant === 'solid' ? 'low' : 'none'}
          >
            <Breadcrumb.Item label="Workspace" index={0}>Workspace</Breadcrumb.Item>
            <Breadcrumb.Item label="Programs" index={1}>Programs</Breadcrumb.Item>
            <Breadcrumb.Item label="Governance" index={2}>Governance</Breadcrumb.Item>
            <Breadcrumb.Item label="Audit logs" index={3}>Audit logs</Breadcrumb.Item>
          </Breadcrumb>
        </Grid>
      ))}
    </Grid>
  ),
};

export const SizeGallery: Story = {
  render: () => (
    <Grid style={{ gap: 14, maxInlineSize: 860 }}>
      {[
        { label: 'Small', size: 'sm' },
        { label: 'Medium', size: 'md' },
        { label: 'Large', size: 'lg' },
      ].map((entry) => (
        <Grid key={entry.label} style={{ gap: 8 }}>
          <Box style={{ fontSize: 13, fontWeight: 600, color: 'var(--ui-color-muted, #64748b)' }}>{entry.label}</Box>
          <Breadcrumb separator="/" currentIndex={3} size={entry.size as any} variant="surface" tone="info" radius={12}>
            <Breadcrumb.Item label="Workspace" index={0}>Workspace</Breadcrumb.Item>
            <Breadcrumb.Item label="Programs" index={1}>Programs</Breadcrumb.Item>
            <Breadcrumb.Item label="Governance" index={2}>Governance</Breadcrumb.Item>
            <Breadcrumb.Item label="Audit logs" index={3}>Audit logs</Breadcrumb.Item>
          </Breadcrumb>
        </Grid>
      ))}
    </Grid>
  ),
};

export const WorkflowPattern: Story = {
  render: () => {
    const [currentIndex, setCurrentIndex] = React.useState(3);
    const [state, setState] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');

    return (
      <Grid style={{ gap: 16, maxInlineSize: 980 }}>
        <Card radius={18} variant="soft" tone="info">
          <CardHeader>
            <CardTitle>Governance review trail</CardTitle>
            <CardDescription>
              Collapsed breadcrumb for deep navigation paths with state feedback and keyboard-friendly selection.
            </CardDescription>
          </CardHeader>
          <Box slot="inset" style={{ padding: 16, display: 'grid', gap: 14 }}>
            <Breadcrumb
              separator="/"
              maxItems={5}
              currentIndex={currentIndex}
              variant="soft"
              tone={state === 'error' ? 'danger' : state === 'success' ? 'success' : 'info'}
              state={state}
              radius={12}
              elevation="low"
              ariaLabel="Governance review trail"
              onSelect={(detail) => {
                const selectDetail = detail as any;
                setCurrentIndex(selectDetail.index);
                setState(selectDetail.index === trail.length - 1 ? 'success' : 'idle');
              }}
            >
              <Breadcrumb.Item label="Workspace" index={0}>
                <HomeIcon size={13} style={{ marginInlineEnd: 4 }} />
                Workspace
              </Breadcrumb.Item>
              <Breadcrumb.Item label="Programs" index={1}>Programs</Breadcrumb.Item>
              <Breadcrumb.Item label="Spring release" index={2}>Spring release</Breadcrumb.Item>
              <Breadcrumb.Item label="Governance" index={3}>Governance</Breadcrumb.Item>
              <Breadcrumb.Item label="Audit logs" index={4}>
                <ShieldIcon size={13} style={{ marginInlineEnd: 4 }} />
                Audit logs
              </Breadcrumb.Item>
            </Breadcrumb>

            <Flex align="center" style={{ gap: 10, flexWrap: 'wrap', color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                {state === 'success' ? <CheckCircleIcon size={14} /> : <SparklesIcon size={14} />}
                Active step: {trail[currentIndex]}
              </span>
            </Flex>
          </Box>
        </Card>
      </Grid>
    );
  },
};
