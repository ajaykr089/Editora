import React, { useState } from 'react';
import { SelectionPopup, Button , Box, Grid, Flex} from '@editora/ui-react';

export default {
  title: 'UI/SelectionPopup',
  component: SelectionPopup,
  argTypes: {
    open: { control: 'boolean' },
    anchorId: { control: 'text' }
  }
};

export const Default = (args: any) => {
  const [open, setOpen] = useState(!!args.open);
  const [message, setMessage] = useState('No action yet');
  const anchorId = args.anchorId || 'sel-anchor';

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <Flex style={{ display: 'flex', gap: 8 }}>
        <Button size="sm" onClick={() => setOpen(true)}>Show popup</Button>
        <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>Hide popup</Button>
      </Flex>

      <Box id={anchorId} style={{ margin: 40, padding: 20, border: '1px dashed #cbd5e1', borderRadius: 10, display: 'inline-block' }}>
        Select text around this anchor
      </Box>

      <SelectionPopup anchorId={anchorId} open={open}>
        <Flex slot="content" style={{ display: 'flex', gap: 8, padding: 6, borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff' }}>
          <Button size="sm" onClick={() => setMessage('Bold applied')}>Bold</Button>
          <Button size="sm" onClick={() => setMessage('Comment inserted')}>Comment</Button>
        </Flex>
      </SelectionPopup>

      <Box style={{ fontSize: 13, color: '#475569' }}>{message}</Box>
    </Grid>
  );
};
Default.args = { open: true, anchorId: 'sel-anchor' };
