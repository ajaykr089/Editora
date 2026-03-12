import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BlockControls, Box, Button, Card, CardDescription, CardHeader, CardTitle, Flex, Grid } from '@editora/ui-react';
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  AlertTriangleIcon,
  BoldIcon,
  CheckCircleIcon,
  ClockIcon,
  CodeIcon,
  ItalicIcon,
  LinkIcon,
  SparklesIcon,
} from '@editora/react-icons';

const meta: Meta<typeof BlockControls> = {
  title: 'UI/BlockControls',
  component: BlockControls,
  args: {
    variant: 'surface',
    tone: 'neutral',
    size: 'md',
    radius: 12,
    elevation: 'low',
    state: 'idle',
    orientation: 'horizontal',
    density: 'compact',
    wrap: true,
  },
  argTypes: {
    variant: { control: 'select', options: ['surface', 'soft', 'solid', 'outline', 'ghost'] },
    tone: { control: 'select', options: ['neutral', 'info', 'success', 'warning', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg', '1', '2', '3'] },
    radius: { control: 'text' },
    elevation: { control: 'select', options: ['none', 'low', 'high'] },
    state: { control: 'select', options: ['idle', 'loading', 'error', 'success'] },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    density: { control: 'select', options: ['compact', 'comfortable'] },
    wrap: { control: 'boolean' },
    loop: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof BlockControls>;

function DemoToolbar(props: React.ComponentProps<typeof BlockControls>) {
  const [align, setAlign] = React.useState<'left' | 'center' | 'right'>('left');
  const [bold, setBold] = React.useState(false);
  const [italic, setItalic] = React.useState(false);
  const [linked, setLinked] = React.useState(false);

  return (
    <BlockControls {...props} ariaLabel="Formatting controls">
      <Button variant={bold ? 'primary' : 'secondary'} onClick={() => setBold((value) => !value)}>
        <BoldIcon size={14} />
      </Button>
      <Button variant={italic ? 'primary' : 'secondary'} onClick={() => setItalic((value) => !value)}>
        <ItalicIcon size={14} />
      </Button>
      <Button variant={linked ? 'primary' : 'secondary'} onClick={() => setLinked((value) => !value)}>
        <LinkIcon size={14} />
      </Button>
      <span data-separator aria-hidden="true" />
      <Button variant={align === 'left' ? 'primary' : 'secondary'} onClick={() => setAlign('left')}>
        <AlignLeftIcon size={14} />
      </Button>
      <Button variant={align === 'center' ? 'primary' : 'secondary'} onClick={() => setAlign('center')}>
        <AlignCenterIcon size={14} />
      </Button>
      <Button variant={align === 'right' ? 'primary' : 'secondary'} onClick={() => setAlign('right')}>
        <AlignRightIcon size={14} />
      </Button>
    </BlockControls>
  );
}

export const Playground: Story = {
  render: (args) => (
    <Grid style={{ gap: 16, maxInlineSize: 840 }}>
      <Card radius={16}>
        <CardHeader>
          <CardTitle>Block controls</CardTitle>
          <CardDescription>
            Token-backed command strip for editor controls, inline formatting actions, and contextual action groups.
          </CardDescription>
        </CardHeader>
        <Box slot="inset" style={{ padding: 16 }}>
          <DemoToolbar {...args} />
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
        { label: 'Outline', variant: 'outline', tone: 'warning' },
        { label: 'Solid', variant: 'solid', tone: 'success' },
        { label: 'Ghost', variant: 'ghost', tone: 'danger' },
      ].map((entry) => (
        <Grid key={entry.label} style={{ gap: 8 }}>
          <Box style={{ fontSize: 13, fontWeight: 600, color: 'var(--ui-color-muted, #64748b)' }}>{entry.label}</Box>
          <DemoToolbar variant={entry.variant as any} tone={entry.tone as any} size="md" radius={12} elevation="low" wrap />
        </Grid>
      ))}
    </Grid>
  ),
};

export const SizeGallery: Story = {
  render: () => (
    <Grid style={{ gap: 14, maxInlineSize: 920 }}>
      {[
        { label: 'Small', size: 'sm', radius: 8 },
        { label: 'Medium', size: 'md', radius: 12 },
        { label: 'Large', size: 'lg', radius: 16 },
      ].map((entry) => (
        <Grid key={entry.label} style={{ gap: 8 }}>
          <Box style={{ fontSize: 13, fontWeight: 600, color: 'var(--ui-color-muted, #64748b)' }}>{entry.label}</Box>
          <DemoToolbar variant="surface" tone="info" size={entry.size as any} radius={entry.radius} elevation="low" wrap />
        </Grid>
      ))}
    </Grid>
  ),
};

export const EditorialWorkflow: Story = {
  render: () => {
    const [block, setBlock] = React.useState<'paragraph' | 'heading' | 'quote' | 'code'>('paragraph');
    const [align, setAlign] = React.useState<'left' | 'center' | 'right'>('left');
    const [state, setState] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');

    return (
      <Grid style={{ gap: 14, maxInlineSize: 980 }}>
        <Card radius={16}>
          <CardHeader>
            <CardTitle>Clinical note toolbar</CardTitle>
            <CardDescription>
              Baseline-themed command strip for formatting, alignment, and AI-assisted note review.
            </CardDescription>
          </CardHeader>

          <Box slot="inset" style={{ padding: 16, display: 'grid', gap: 14 }}>
            <BlockControls
              ariaLabel="Clinical note formatting controls"
              variant={state === 'error' ? 'outline' : state === 'success' ? 'soft' : 'surface'}
              tone={state === 'error' ? 'danger' : state === 'success' ? 'success' : 'info'}
              state={state}
              size="md"
              radius={12}
              elevation="low"
              wrap
            >
              <Button variant={block === 'paragraph' ? 'primary' : 'secondary'} onClick={() => setBlock('paragraph')}>
                P
              </Button>
              <Button variant={block === 'heading' ? 'primary' : 'secondary'} onClick={() => setBlock('heading')}>
                H1
              </Button>
              <Button variant={block === 'quote' ? 'primary' : 'secondary'} onClick={() => setBlock('quote')}>
                "
              </Button>
              <Button variant={block === 'code' ? 'primary' : 'secondary'} onClick={() => setBlock('code')}>
                <CodeIcon size={14} />
              </Button>

              <span data-separator aria-hidden="true" />

              <Button variant={align === 'left' ? 'primary' : 'secondary'} onClick={() => setAlign('left')}>
                <AlignLeftIcon size={14} />
              </Button>
              <Button variant={align === 'center' ? 'primary' : 'secondary'} onClick={() => setAlign('center')}>
                <AlignCenterIcon size={14} />
              </Button>
              <Button variant={align === 'right' ? 'primary' : 'secondary'} onClick={() => setAlign('right')}>
                <AlignRightIcon size={14} />
              </Button>

              <span data-separator aria-hidden="true" />

              <Button
                variant="secondary"
                onClick={() => {
                  setState('loading');
                  window.setTimeout(() => setState('success'), 900);
                }}
              >
                <SparklesIcon size={14} />
                Suggest
              </Button>
            </BlockControls>

            <Flex align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
              <Button size="sm" variant="secondary" onClick={() => setState('idle')}>
                <ClockIcon size={14} />
                Idle
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setState('error')}>
                <AlertTriangleIcon size={14} />
                Error
              </Button>
              <Button size="sm" onClick={() => setState('success')}>
                <CheckCircleIcon size={14} />
                Success
              </Button>
            </Flex>

            <Box
              style={{
                border: '1px solid var(--ui-color-border, #d8e1ec)',
                borderRadius: 12,
                padding: 12,
                background: 'var(--ui-color-surface, #fff)',
                fontSize: 13,
                color: 'var(--ui-color-muted, #64748b)',
              }}
            >
              Block: <strong>{block}</strong> | Alignment: <strong>{align}</strong> | State: <strong>{state}</strong>
            </Box>
          </Box>
        </Card>
      </Grid>
    );
  },
};
