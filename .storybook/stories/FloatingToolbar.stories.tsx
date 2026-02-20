import React, { useState } from 'react';
import { FloatingToolbar, Button , Box, Grid, Flex} from '@editora/ui-react';

export default {
  title: 'UI/FloatingToolbar',
  component: FloatingToolbar,
  argTypes: {
    anchorId: { control: 'text' },
    open: { control: 'boolean' }
  }
};

export const Anchored = (args: any) => {
  const [open, setOpen] = useState(!!args.open);

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <Flex style={{ display: 'flex', gap: 8 }}>
        <Button size="sm" onClick={() => setOpen(true)}>Show</Button>
        <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>Hide</Button>
      </Flex>

      <Box
        id={args.anchorId}
        style={{ margin: 80, padding: 24, border: '1px dashed #cbd5e1', borderRadius: 12, display: 'inline-block' }}
      >
        Select this block
      </Box>

      <FloatingToolbar anchorId={args.anchorId} open={open}>
        <Flex slot="toolbar" style={{ display: 'flex', gap: 8, padding: 6, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10 }}>
          <Button size="sm">Bold</Button>
          <Button size="sm">Italic</Button>
          <Button size="sm" variant="secondary">Link</Button>
        </Flex>
      </FloatingToolbar>
    </Grid>
  );
};
Anchored.args = { anchorId: 'storybook-anchor', open: true };

export const MultipleAnchors = () => {
  const [anchorId, setAnchorId] = useState('anchor-a');
  const [open, setOpen] = useState(true);

  return (
    <Grid style={{ display: 'grid', gap: 16 }}>
      <Flex style={{ display: 'flex', gap: 8 }}>
        <Button size="sm" onClick={() => setAnchorId('anchor-a')}>Anchor A</Button>
        <Button size="sm" onClick={() => setAnchorId('anchor-b')}>Anchor B</Button>
        <Button size="sm" variant="secondary" onClick={() => setOpen((v) => !v)}>{open ? 'Hide' : 'Show'}</Button>
      </Flex>
      <Box id="anchor-a" style={{ padding: 16, border: '1px solid #dbeafe', borderRadius: 10 }}>First anchor</Box>
      <Box id="anchor-b" style={{ padding: 16, border: '1px solid #fde68a', borderRadius: 10 }}>Second anchor</Box>

      <FloatingToolbar anchorId={anchorId} open={open}>
        <Flex slot="toolbar" style={{ display: 'flex', gap: 8, padding: 6, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10 }}>
          <Button size="sm">{anchorId === 'anchor-a' ? 'A Action' : 'B Action'}</Button>
        </Flex>
      </FloatingToolbar>
    </Grid>
  );
};
