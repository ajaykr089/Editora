import React from 'react';
import type { Meta } from '@storybook/react';
import { AspectRatio, Box, Button, Flex, Grid } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import {
  CameraIcon,
  CheckCircleIcon,
  ImageIcon,
  PlayCircleIcon,
  SlidersIcon,
} from '@editora/react-icons';
import '../../packages/editora-toast/src/toast.css';
import '@editora/themes/themes/default.css';

const meta: Meta<typeof AspectRatio> = {
  title: 'UI/AspectRatio',
  component: AspectRatio,
};

export default meta;

function EnterpriseMediaCanvas() {
  const [ratio, setRatio] = React.useState<'16/9' | '4/3' | '1/1'>('16/9');
  const [fit, setFit] = React.useState<'cover' | 'contain'>('cover');

  return (
    <Grid style={{ gap: 14, maxInlineSize: 980 }}>
      <Box
        style={{
          border: '1px solid var(--ui-color-border, #d8e1ec)',
          borderRadius: 16,
          padding: 16,
          background:
            'linear-gradient(135deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 7%, #fff) 0%, var(--ui-color-surface, #fff) 42%)',
        }}
      >
        <Flex align="center" justify="space-between" style={{ gap: 12, flexWrap: 'wrap' }}>
          <Box>
            <Box style={{ fontWeight: 700, fontSize: 18 }}>Media Composition Surface</Box>
            <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13, marginTop: 4 }}>
              Enterprise aspect-ratio layouts for thumbnails, previews, and campaign assets.
            </Box>
          </Box>
          <Flex align="center" style={{ gap: 8, color: 'var(--ui-color-muted, #64748b)', fontSize: 12 }}>
            <SlidersIcon size={14} />
            Ratio: {ratio} / Fit: {fit}
          </Flex>
        </Flex>
      </Box>

      <Flex style={{ gap: 8, flexWrap: 'wrap' }}>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setRatio('16/9');
            toastAdvanced.info('Canvas ratio set to 16:9', { duration: 1300, theme: 'light' });
          }}
        >
          16:9
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setRatio('4/3');
            toastAdvanced.info('Canvas ratio set to 4:3', { duration: 1300, theme: 'light' });
          }}
        >
          4:3
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setRatio('1/1');
            toastAdvanced.info('Canvas ratio set to 1:1', { duration: 1300, theme: 'light' });
          }}
        >
          1:1
        </Button>
        <Button
          size="sm"
          onClick={() => {
            const next = fit === 'cover' ? 'contain' : 'cover';
            setFit(next);
            toastAdvanced.success(`Fit mode changed to ${next}`, { duration: 1300, theme: 'light' });
          }}
        >
          Toggle Fit
        </Button>
      </Flex>

      <Grid style={{ gap: 12 }}>
        <AspectRatio ratio={ratio} fit={fit} tone="info" interactive showRatioBadge style={{ width: '100%' }}>
          <img
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1400&q=80"
            alt="Operations team reviewing clinical dashboards"
          />
        </AspectRatio>

        <Grid style={{ gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <AspectRatio ratio="1/1" tone="success" showRatioBadge style={{ width: '100%' }}>
            <Flex
              style={{
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                color: '#0f172a',
              }}
            >
              <CheckCircleIcon size={16} />
              Approved Thumbnail
            </Flex>
          </AspectRatio>

          <AspectRatio ratio="4/3" tone="warning" showRatioBadge style={{ width: '100%' }}>
            <Flex
              style={{
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                color: '#0f172a',
              }}
            >
              <CameraIcon size={16} />
              Capture Queue
            </Flex>
          </AspectRatio>

          <AspectRatio ratio="16/9" tone="danger" showRatioBadge style={{ width: '100%' }}>
            <Flex
              style={{
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                color: '#0f172a',
              }}
            >
              <PlayCircleIcon size={16} />
              Pending Review
            </Flex>
          </AspectRatio>
        </Grid>

        <AspectRatio ratio="21/9" tone="neutral" showRatioBadge style={{ width: '100%' }} />
      </Grid>

      <Flex justify="end" style={{ gap: 8, flexWrap: 'wrap' }}>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => toastAdvanced.info('Preview generated for content team', { duration: 1400, theme: 'light' })}
        >
          <ImageIcon size={14} />
          Generate Preview
        </Button>
        <Button size="sm" onClick={() => toastAdvanced.success('Media layout saved', { duration: 1400, theme: 'light' })}>
          Save Layout
        </Button>
      </Flex>
    </Grid>
  );
}

export const EnterpriseMediaOps = () => <EnterpriseMediaCanvas />;

