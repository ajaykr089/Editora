import React, { useEffect, useRef, useState } from 'react';
import { ToggleGroup, Toggle , Box, Grid} from '@editora/ui-react';

export default {
  title: 'UI/ToggleGroup',
  component: ToggleGroup
};

export const SingleSelect = () => {
  const ref = useRef<HTMLElement | null>(null);
  const [value, setValue] = useState('left');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onChange = (event: Event) => {
      const next = (event as CustomEvent<{ value: string }>).detail?.value;
      if (next) setValue(next);
    };
    el.addEventListener('change', onChange as EventListener);
    return () => el.removeEventListener('change', onChange as EventListener);
  }, []);

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <ToggleGroup ref={ref as any} value={value}>
        <Toggle value="left">Left</Toggle>
        <Toggle value="center">Center</Toggle>
        <Toggle value="right">Right</Toggle>
      </ToggleGroup>
      <Box style={{ fontSize: 13, color: '#475569' }}>Alignment: {value}</Box>
    </Grid>
  );
};

export const MultipleSelect = () => {
  const ref = useRef<HTMLElement | null>(null);
  const [value, setValue] = useState<string[]>(['bold']);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onChange = (event: Event) => {
      const next = (event as CustomEvent<{ value: string[] }>).detail?.value;
      if (Array.isArray(next)) setValue(next);
    };
    el.addEventListener('change', onChange as EventListener);
    return () => el.removeEventListener('change', onChange as EventListener);
  }, []);

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <ToggleGroup ref={ref as any} multiple value={JSON.stringify(value)}>
        <Toggle value="bold">Bold</Toggle>
        <Toggle value="italic">Italic</Toggle>
        <Toggle value="underline">Underline</Toggle>
      </ToggleGroup>
      <Box style={{ fontSize: 13, color: '#475569' }}>Active styles: {value.join(', ') || 'none'}</Box>
    </Grid>
  );
};
