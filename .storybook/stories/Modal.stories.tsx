import React, { useState } from 'react';
import { Modal, Button, ThemeProvider , Box} from '@editora/ui-react';

export default {
  title: 'UI/Modal',
  component: Modal,
  argTypes: { open: { control: 'boolean' } }
};

export const Default = (args: any) => {
  const [open, setOpen] = useState(!!args.open);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal open={open}>
        <Box style={{ padding: 20 }}>
          <h3>Dialog title</h3>
          <p>This is modal content.</p>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </Box>
      </Modal>
    </div>
  );
};
Default.args = { open: false };

export const ThemedByTokens = () => {
  const [open, setOpen] = useState(false);
  return (
    <ThemeProvider tokens={{ colors: { primary: '#ec4899', background: '#0b1220', text: '#f8fafc' }, radius: '12px' }}>
      <div>
        <Button onClick={() => setOpen(true)}>Open themed modal</Button>
        <Modal open={open}>
          <Box style={{ padding: 20 }}>
            <h3>Dialog title</h3>
            <p>Modal styled from theme tokens.</p>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </Box>
        </Modal>
      </div>
    </ThemeProvider>
  );
};
