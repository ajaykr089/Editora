import React, { useEffect, useRef, useState } from 'react';
import { RadioGroup , Box, Grid} from '@editora/ui-react';

export default {
  title: 'UI/RadioGroup',
  component: RadioGroup
};

export const Default = () => {
  const ref = useRef<HTMLElement | null>(null);
  const [value, setValue] = useState('draft');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleChange = (event: Event) => {
      const next = (event as CustomEvent<{ value: string }>).detail?.value;
      if (next) setValue(next);
    };
    el.addEventListener('change', handleChange as EventListener);
    return () => el.removeEventListener('change', handleChange as EventListener);
  }, []);

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <RadioGroup ref={ref as any} value={value}>
        <div data-radio data-value="draft">Draft</div>
        <div data-radio data-value="review">In review</div>
        <div data-radio data-value="published">Published</div>
      </RadioGroup>
      <Box style={{ fontSize: 13, color: '#475569' }}>Selected: {value}</Box>
    </Grid>
  );
};
