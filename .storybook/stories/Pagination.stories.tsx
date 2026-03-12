import React, { useRef, useState } from 'react';
import { Box, Button, Flex, Grid, Pagination } from '@editora/ui-react';

export default {
  title: 'UI/Pagination',
  component: Pagination,
  argTypes: {
    page: { control: { type: 'number', min: 1, max: 50, step: 1 } },
    count: { control: { type: 'number', min: 1, max: 50, step: 1 } },
    variant: { control: 'select', options: ['classic', 'flat', 'outline', 'solid'] }
  }
};

export const Interactive = (args: any) => {
  const [page, setPage] = useState(Number(args.page) || 1);
  const [count, setCount] = useState(Number(args.count) || 12);
  const [lastReason, setLastReason] = useState('change');
  const ref = useRef<any>(null);

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <Flex style={{ display: 'flex', gap: 8 }}>
        <Button size="sm" variant="secondary" onClick={() => setCount((v) => Math.max(1, v - 1))}>- count</Button>
        <Button size="sm" variant="secondary" onClick={() => setCount((v) => v + 1)}>+ count</Button>
      </Flex>

      <Pagination
        ref={ref}
        page={page}
        count={count}
        variant={args.variant || 'classic'}
        onPageChange={(detail) => {
          setPage(detail.page);
          setLastReason(detail.reason);
        }}
      />

      <Box style={{ fontSize: 13, color: '#475569' }}>
        Page {page} of {count} • last action: {lastReason}
      </Box>
    </Grid>
  );
};
Interactive.args = { page: 3, count: 12, variant: 'classic' };

export const CustomTokens = () => (
  <Pagination
    page={4}
    count={18}
    variant="outline"
    style={{
      ['--ui-pagination-active-bg' as any]: '#0ea5e9',
      ['--ui-pagination-radius' as any]: '999px',
      ['--ui-pagination-padding' as any]: '6px 12px'
    }}
  />
);

export const VariantGallery = () => (
  <Grid style={{ display: 'grid', gap: 18 }}>
    {(['classic', 'flat', 'outline', 'solid'] as const).map((variant) => (
      <Flex key={variant} style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <Box style={{ width: 72, fontSize: 13, color: '#475569', textTransform: 'capitalize' }}>{variant}</Box>
        <Pagination page={4} count={18} variant={variant} />
      </Flex>
    ))}
  </Grid>
);
