import React, { useState } from 'react';
import { Modal, Button } from '@editora/ui-react';

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
        <div style={{ padding: 20 }}>
          <h3>Dialog title</h3>
          <p>This is modal content.</p>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </div>
      </Modal>
    </div>
  );
};
Default.args = { open: false };
