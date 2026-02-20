import React from 'react';
import { Box, Skeleton } from '@editora/ui-react';

export default {
  title: 'UI/Skeleton',
  component: Skeleton,
  argTypes: {
    count: { control: { type: 'number', min: 1, max: 12, step: 1 } },
    variant: { control: 'radio', options: ['rect', 'text', 'circle'] },
    animated: { control: 'boolean' }
  }
};

export const Default = (args: any) => (
  <Box style={{ maxWidth: 460 }}>
    <Skeleton
      count={args.count}
      variant={args.variant}
      animated={args.animated}
      height={args.variant === 'circle' ? '42px' : undefined}
      width={args.variant === 'circle' ? '42px' : undefined}
    />
  </Box>
);

Default.args = {
  count: 4,
  variant: 'text',
  animated: true
};

export const CardPlaceholder = () => (
  <Box style={{ border: '1px solid #e2e8f0', borderRadius: 14, padding: 16, maxWidth: 360 }}>
    <Skeleton variant="rect" height="150px" animated />
    <Box style={{ marginTop: 14 }}>
      <Skeleton variant="text" count={3} animated />
    </Box>
  </Box>
);
