import React, { useState } from 'react';
import { PluginPanel, Button , Box, Grid, Flex} from '@editora/ui-react';

export default {
  title: 'UI/PluginPanel',
  component: PluginPanel,
  argTypes: {
    open: { control: 'boolean' },
    position: { control: 'select', options: ['right', 'left', 'bottom'] }
  }
};

export const Default = (args: any) => {
  const [open, setOpen] = useState(!!args.open);
  const [position, setPosition] = useState(args.position || 'right');

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <Flex style={{ display: 'flex', gap: 8 }}>
        <Button size="sm" onClick={() => setOpen((v) => !v)}>{open ? 'Close panel' : 'Open panel'}</Button>
        <Button size="sm" variant="secondary" onClick={() => setPosition('right')}>Right</Button>
        <Button size="sm" variant="secondary" onClick={() => setPosition('left')}>Left</Button>
        <Button size="sm" variant="secondary" onClick={() => setPosition('bottom')}>Bottom</Button>
      </Flex>

      <PluginPanel open={open} position={position}>
        <Box style={{ padding: 12, minWidth: 220 }}>
          <strong>Plugin Panel</strong>
          <p style={{ margin: '8px 0 0', color: '#475569' }}>Position: {position}</p>
        </Box>
      </PluginPanel>
    </Grid>
  );
};
Default.args = { open: true, position: 'right' };
