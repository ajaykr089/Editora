import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Flex, Grid, Pagination } from '@editora/ui-react';

export default {
  title: 'UI/Pagination',
  component: Pagination,
  argTypes: {
    page: { control: { type: 'number', min: 1, max: 50, step: 1 } },
    count: { control: { type: 'number', min: 1, max: 50, step: 1 } }
  }
};

export const Interactive = (args: any) => {
  const [page, setPage] = useState(Number(args.page) || 1);
  const [count, setCount] = useState(Number(args.count) || 12);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleChange = (event: Event) => {
      const next = (event as CustomEvent<{ page: number }>).detail?.page;
      if (typeof next === 'number') setPage(next);
    };
    el.addEventListener('change', handleChange as EventListener);
    return () => el.removeEventListener('change', handleChange as EventListener);
  }, []);

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <Flex style={{ display: 'flex', gap: 8 }}>
        <Button size="sm" variant="secondary" onClick={() => setCount((v) => Math.max(1, v - 1))}>- count</Button>
        <Button size="sm" variant="secondary" onClick={() => setCount((v) => v + 1)}>+ count</Button>
      </Flex>

      <Pagination ref={ref as any} page={String(page)} count={String(count)} />

      <Box style={{ fontSize: 13, color: '#475569' }}>
        Page {page} of {count}
      </Box>
    </Grid>
  );
};
Interactive.args = { page: 3, count: 12 };

export const CustomTokens = () => (
  <Pagination
    page="4"
    count="18"
    style={{
      ['--ui-pagination-active-bg' as any]: '#0ea5e9',
      ['--ui-pagination-radius' as any]: '999px',
      ['--ui-pagination-padding' as any]: '6px 12px'
    }}
  />
);
