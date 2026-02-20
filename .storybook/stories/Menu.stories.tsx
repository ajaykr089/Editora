import React, { useState } from 'react';
import { Menu, Button , Box, Grid} from '@editora/ui-react';

export default {
  title: 'UI/Menu',
  component: Menu
};

const items = ['Rename', 'Duplicate', 'Archive'];

export const Default = () => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <Menu onSelect={(idx) => setSelected(idx)}>
        <Button slot="trigger">Open menu</Button>
        {items.map((item) => (
          <div key={item} slot="item">{item}</div>
        ))}
      </Menu>

      <Box style={{ fontSize: 13, color: '#475569' }}>
        Selected action: {selected == null ? 'none' : items[selected]}
      </Box>
    </Grid>
  );
};

export const MenuWithDangerZone = () => (
  <Menu>
    <Button slot="trigger" variant="secondary">Document actions</Button>
    <div slot="item">Move</div>
    <div slot="item">Share</div>
    <Box slot="item" style={{ color: '#dc2626' }}>Delete permanently</Box>
  </Menu>
);
