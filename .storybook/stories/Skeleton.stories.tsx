import React from 'react';
import { Box, Flex, Grid, Skeleton } from '@editora/ui-react';

export default {
  title: 'UI/Skeleton',
  component: Skeleton,
  argTypes: {
    count: { control: { type: 'number', min: 1, max: 20, step: 1 } },
    variant: { control: 'select', options: ['rect', 'text', 'circle', 'pill', 'avatar', 'badge', 'button'] },
    animation: { control: 'select', options: ['none', 'shimmer', 'pulse', 'wave'] },
    density: { control: 'select', options: ['default', 'compact', 'comfortable'] },
    tone: { control: 'select', options: ['default', 'brand', 'success', 'warning', 'danger'] },
    animated: { control: 'boolean' },
    duration: { control: 'text' }
  }
};

export const Playground = (args: any) => (
  <Box style={{ maxWidth: 480 }}>
    <Skeleton
      count={args.count}
      variant={args.variant}
      animation={args.animation}
      density={args.density}
      tone={args.tone}
      animated={args.animated}
      duration={args.duration}
      height={args.variant === 'circle' || args.variant === 'avatar' ? '44px' : undefined}
      width={args.variant === 'circle' || args.variant === 'avatar' ? '44px' : undefined}
    />
  </Box>
);

Playground.args = {
  count: 4,
  variant: 'text',
  animation: 'shimmer',
  density: 'default',
  tone: 'default',
  animated: true,
  duration: '1.2s'
};

export const VariantGallery = () => (
  <Grid style={{ display: 'grid', gap: 16, maxWidth: 980 }}>
    <Flex style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
      <Box style={{ minWidth: 200 }}>
        <div style={{ fontSize: 12, marginBottom: 6, color: '#64748b' }}>Text</div>
        <Skeleton variant="text" count={3} animation="shimmer" />
      </Box>
      <Box>
        <div style={{ fontSize: 12, marginBottom: 6, color: '#64748b' }}>Circle</div>
        <Skeleton variant="circle" animation="wave" height="40px" width="40px" />
      </Box>
      <Box>
        <div style={{ fontSize: 12, marginBottom: 6, color: '#64748b' }}>Avatar</div>
        <Skeleton variant="avatar" animation="pulse" />
      </Box>
      <Box>
        <div style={{ fontSize: 12, marginBottom: 6, color: '#64748b' }}>Badge</div>
        <Skeleton variant="badge" animation="shimmer" />
      </Box>
      <Box>
        <div style={{ fontSize: 12, marginBottom: 6, color: '#64748b' }}>Button</div>
        <Skeleton variant="button" animation="wave" />
      </Box>
      <Box style={{ minWidth: 180 }}>
        <div style={{ fontSize: 12, marginBottom: 6, color: '#64748b' }}>Pill</div>
        <Skeleton variant="pill" count={2} animation="pulse" />
      </Box>
    </Flex>
  </Grid>
);

export const EnterpriseCardLoading = () => (
  <Box
    style={{
      border: '1px solid #e2e8f0',
      borderRadius: 14,
      padding: 16,
      maxWidth: 380,
      background: '#ffffff',
      display: 'grid',
      gap: 14
    }}
  >
    <Skeleton variant="rect" height="168px" radius="12px" animation="wave" />
    <Skeleton variant="text" count={2} animation="shimmer" />
    <Flex style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Skeleton variant="badge" animation="pulse" />
      <Skeleton variant="button" animation="shimmer" width="96px" />
    </Flex>
  </Box>
);

export const DataTableRows = () => (
  <Box
    style={{
      border: '1px solid #cbd5e1',
      borderRadius: 10,
      padding: 12,
      maxWidth: 980,
      display: 'grid',
      gap: 8
    }}
  >
    {Array.from({ length: 6 }).map((_, rowIndex) => (
      <Flex key={rowIndex} style={{ display: 'grid', gridTemplateColumns: '220px 140px 160px 1fr 120px', gap: 10, alignItems: 'center' }}>
        <Flex style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Skeleton variant="avatar" width="28px" height="28px" animation="none" />
          <Skeleton variant="text" count={1} width="140px" animation="pulse" />
        </Flex>
        <Skeleton variant="pill" count={1} width="110px" animation="none" />
        <Skeleton variant="text" count={1} width="130px" animation="shimmer" />
        <Skeleton variant="text" count={1} width="100%" animation="wave" />
        <Skeleton variant="button" count={1} width="92px" height="30px" animation="none" />
      </Flex>
    ))}
  </Box>
);

export const ProfilePanel = () => (
  <Box
    style={{
      border: '1px solid #e2e8f0',
      borderRadius: 16,
      padding: 18,
      maxWidth: 520,
      display: 'grid',
      gap: 16
    }}
  >
    <Flex style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
      <Skeleton variant="avatar" width="58px" height="58px" tone="brand" animation="wave" />
      <Box style={{ flex: 1 }}>
        <Skeleton variant="text" count={2} tone="brand" animation="shimmer" />
      </Box>
    </Flex>
    <Skeleton variant="rect" height="96px" radius="12px" tone="brand" animation="pulse" />
    <Flex style={{ display: 'flex', gap: 10 }}>
      <Skeleton variant="button" tone="brand" animation="wave" />
      <Skeleton variant="button" tone="default" animation="none" />
    </Flex>
  </Box>
);

export const AnimationAndToneMatrix = () => (
  <Grid style={{ display: 'grid', gap: 12, maxWidth: 920 }}>
    {(['shimmer', 'pulse', 'wave', 'none'] as const).map((animation) => (
      <Flex key={animation} style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <Box style={{ width: 80, fontSize: 12, color: '#64748b', textTransform: 'capitalize' }}>{animation}</Box>
        <Skeleton variant="text" count={1} width="140px" animation={animation} tone="default" />
        <Skeleton variant="text" count={1} width="140px" animation={animation} tone="brand" />
        <Skeleton variant="text" count={1} width="140px" animation={animation} tone="success" />
        <Skeleton variant="text" count={1} width="140px" animation={animation} tone="warning" />
        <Skeleton variant="text" count={1} width="140px" animation={animation} tone="danger" />
      </Flex>
    ))}
  </Grid>
);
