import React, { useEffect, useRef, useState } from 'react';
import { Toggle , Box, Grid} from '@editora/ui-react';

export default {
  title: 'UI/Toggle',
  component: Toggle,
  argTypes: { pressed: { control: 'boolean' } }
};

export const Controlled = (args: any) => {
  const [pressed, setPressed] = useState(!!args.pressed);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onChange = (event: Event) => {
      const next = (event as CustomEvent<{ pressed: boolean }>).detail?.pressed;
      if (typeof next === 'boolean') setPressed(next);
    };
    el.addEventListener('change', onChange as EventListener);
    return () => el.removeEventListener('change', onChange as EventListener);
  }, []);

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <Toggle ref={ref as any} pressed={pressed}>Bold</Toggle>
      <Box style={{ fontSize: 13, color: '#475569' }}>Pressed: {String(pressed)}</Box>
    </Grid>
  );
};
Controlled.args = { pressed: false };
