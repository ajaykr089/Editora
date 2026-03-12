import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AspectRatio, Box, Button, Card, CardDescription, CardHeader, CardTitle, Flex, Grid } from '@editora/ui-react';
import { CameraIcon, CheckCircleIcon, ImageIcon, PlayCircleIcon } from '@editora/react-icons';

const meta: Meta<typeof AspectRatio> = {
  title: 'UI/AspectRatio',
  component: AspectRatio,
  args: {
    ratio: '16/9',
    fit: 'cover',
    variant: 'surface',
    tone: 'neutral',
    size: 'md',
    elevation: 'none',
    radius: 12,
  },
  argTypes: {
    variant: { control: 'select', options: ['surface', 'soft', 'outline', 'solid'] },
    tone: { control: 'select', options: ['neutral', 'info', 'success', 'warning', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    elevation: { control: 'select', options: ['none', 'low', 'high'] },
    fit: { control: 'select', options: ['cover', 'contain', 'fill', 'none', 'scale-down'] },
  },
};

export default meta;

type Story = StoryObj<typeof AspectRatio>;

const imageUrl = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1400&q=80';

export const Playground: Story = {
  render: (args) => (
    <Grid style={{ gap: 16 }}>
      <Card radius={16}>
        <CardHeader>
          <CardTitle>Aspect ratio</CardTitle>
          <CardDescription>
            Stable media frames for previews, thumbnails, editorial cards, and workflow canvases.
          </CardDescription>
        </CardHeader>
        <Box slot="inset" style={{ padding: 12 }}>
          <AspectRatio {...args} showRatioBadge style={{ width: '100%' }}>
            <img src={imageUrl} alt="Operations team reviewing dashboards" />
          </AspectRatio>
        </Box>
      </Card>
    </Grid>
  ),
};

export const VariantGallery: Story = {
  render: () => (
    <Grid style={{ gap: 14 }}>
      {[
        { label: 'Surface', variant: 'surface', tone: 'neutral' },
        { label: 'Soft', variant: 'soft', tone: 'info' },
        { label: 'Outline', variant: 'outline', tone: 'warning' },
        { label: 'Solid', variant: 'solid', tone: 'success' },
      ].map((entry) => (
        <Grid key={entry.label} style={{ gap: 8 }}>
          <Box style={{ fontSize: 13, fontWeight: 600, color: 'var(--ui-color-muted, #64748b)' }}>{entry.label}</Box>
          <AspectRatio
            ratio="16/9"
            showRatioBadge
            variant={entry.variant as 'surface' | 'soft' | 'outline' | 'solid'}
            tone={entry.tone as 'neutral' | 'info' | 'warning' | 'success'}
            radius={12}
            style={{ width: '100%' }}
          >
            <img src={imageUrl} alt={`${entry.label} preview`} />
          </AspectRatio>
        </Grid>
      ))}
    </Grid>
  ),
};

export const SizeGallery: Story = {
  render: () => (
    <Grid style={{ gap: 14 }}>
      {[
        { label: 'Small', size: 'sm', radius: 8 },
        { label: 'Medium', size: 'md', radius: 12 },
        { label: 'Large', size: 'lg', radius: 16 },
      ].map((entry) => (
        <Grid key={entry.label} style={{ gap: 8 }}>
          <Box style={{ fontSize: 13, fontWeight: 600, color: 'var(--ui-color-muted, #64748b)' }}>{entry.label}</Box>
          <AspectRatio
            ratio="4/3"
            size={entry.size as 'sm' | 'md' | 'lg'}
            radius={entry.radius}
            tone="info"
            variant="soft"
            showRatioBadge
            style={{ width: '100%' }}
          >
            <img src={imageUrl} alt={`${entry.label} media frame`} />
          </AspectRatio>
        </Grid>
      ))}
    </Grid>
  ),
};

export const MediaOpsWorkflow: Story = {
  render: () => {
    const [ratio, setRatio] = React.useState<'16/9' | '4/3' | '1/1'>('16/9');
    const [fit, setFit] = React.useState<'cover' | 'contain'>('cover');

    return (
      <Grid style={{ gap: 14, maxInlineSize: 980 }}>
        <Flex align="center" justify="space-between" style={{ gap: 12, flexWrap: 'wrap' }}>
          <Box>
            <Box style={{ fontWeight: 700, fontSize: 18 }}>Media composition surface</Box>
            <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13, marginTop: 4 }}>
              Production preview frames for campaign assets, dashboard thumbnails, and review queues.
            </Box>
          </Box>
          <Flex align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
            <Button size="sm" recipe="soft" variant="secondary" onClick={() => setRatio('16/9')}>
              16:9
            </Button>
            <Button size="sm" recipe="soft" variant="secondary" onClick={() => setRatio('4/3')}>
              4:3
            </Button>
            <Button size="sm" recipe="soft" variant="secondary" onClick={() => setRatio('1/1')}>
              1:1
            </Button>
            <Button size="sm" onClick={() => setFit((current) => (current === 'cover' ? 'contain' : 'cover'))}>
              Toggle Fit
            </Button>
          </Flex>
        </Flex>

        <AspectRatio ratio={ratio} fit={fit} tone="info" interactive showRatioBadge radius={16} elevation="low">
          <img src={imageUrl} alt="Operations team reviewing clinical dashboards" />
        </AspectRatio>

        <Grid style={{ gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <AspectRatio ratio="1/1" tone="success" variant="soft" showRatioBadge radius={12}>
            <Flex style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#0f172a' }}>
              <CheckCircleIcon size={16} />
              Approved thumbnail
            </Flex>
          </AspectRatio>

          <AspectRatio ratio="4/3" tone="warning" variant="soft" showRatioBadge radius={0}>
            <Flex style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#0f172a' }}>
              <CameraIcon size={16} />
              Capture queue
            </Flex>
          </AspectRatio>

          <AspectRatio ratio="16/9" tone="danger" variant="soft" showRatioBadge radius={12}>
            <Flex style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#0f172a' }}>
              <PlayCircleIcon size={16} />
              Pending review
            </Flex>
          </AspectRatio>
        </Grid>

        <Flex justify="end" style={{ gap: 8, flexWrap: 'wrap' }}>
          <Button size="sm" recipe="soft" variant="secondary">
            <ImageIcon size={14} />
            Generate preview
          </Button>
          <Button size="sm">Save layout</Button>
        </Flex>
      </Grid>
    );
  },
};

export const EmptyStates: Story = {
  render: () => (
    <Grid style={{ gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
      <AspectRatio ratio="16/9" showRatioBadge variant="surface" radius={12} />
      <AspectRatio ratio="4/3" showRatioBadge variant="soft" tone="info" radius={12} />
      <AspectRatio ratio="1/1" showRatioBadge variant="outline" tone="warning" radius={12} />
    </Grid>
  ),
};
