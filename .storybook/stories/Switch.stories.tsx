import React, { useEffect, useRef, useState } from 'react';
import { Switch , Box, Grid} from '@editora/ui-react';

export default {
  title: 'UI/Switch',
  component: Switch,
  argTypes: { checked: { control: 'boolean' } }
};

export const Controlled = (args: any) => {
  const [checked, setChecked] = useState(!!args.checked);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onChange = (event: Event) => {
      const next = (event as CustomEvent<{ checked: boolean }>).detail?.checked;
      if (typeof next === 'boolean') setChecked(next);
    };
    el.addEventListener('change', onChange as EventListener);
    return () => el.removeEventListener('change', onChange as EventListener);
  }, []);

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <Switch ref={ref as any} checked={checked}>Enable autosave</Switch>
      <Box style={{ fontSize: 13, color: '#475569' }}>State: {checked ? 'on' : 'off'}</Box>
    </Grid>
  );
};
Controlled.args = { checked: true };
