import React from 'react';
import { Box, Button, Dialog, Flex, Grid } from '@editora/ui-react';

export default {
  title: 'UI/Dialog',
  component: Dialog,
  argTypes: {
    open: { control: 'boolean' },
    closable: { control: 'boolean' },
    closeOnOverlay: { control: 'boolean' },
    closeOnEsc: { control: 'boolean' },
    size: { control: { type: 'radio', options: ['1', '2', '3', 'sm', 'md', 'lg'] } }
  }
};

export const Default = (args: any) => {
  const [open, setOpen] = React.useState(Boolean(args.open));
  return (
    <Box>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog
        {...args}
        open={open}
        title="Publish changes"
        description="Review details before publishing this version."
        onClose={() => setOpen(false)}
        onRequestClose={() => setOpen(false)}
      >
        <Grid style={{ display: 'grid', gap: 10 }}>
          <p style={{ margin: 0, color: '#475569', fontSize: 14 }}>
            This action will update the shared workspace for all collaborators.
          </p>
          <Flex style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Publish</Button>
          </Flex>
        </Grid>
      </Dialog>
    </Box>
  );
};
Default.args = {
  open: false,
  closable: true,
  closeOnOverlay: true,
  closeOnEsc: true,
  size: 'md'
};

export const Large = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <Box>
      <Button onClick={() => setOpen(true)}>Open large dialog</Button>
      <Dialog
        open={open}
        size="lg"
        title="Team activity report"
        description="Weekly summary across all editors."
        onClose={() => setOpen(false)}
        onRequestClose={() => setOpen(false)}
      >
        <Grid style={{ display: 'grid', gap: 8 }}>
          <Box style={{ padding: 10, borderRadius: 10, background: '#f8fafc' }}>Documents created: 42</Box>
          <Box style={{ padding: 10, borderRadius: 10, background: '#f8fafc' }}>Comments resolved: 128</Box>
          <Box style={{ padding: 10, borderRadius: 10, background: '#f8fafc' }}>Pending approvals: 6</Box>
        </Grid>
      </Dialog>
    </Box>
  );
};

export const NonDismissable = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <Box>
      <Button onClick={() => setOpen(true)}>Open strict dialog</Button>
      <Dialog
        open={open}
        title="Security confirmation"
        description="This dialog can only close via button action."
        closable={false}
        closeOnOverlay={false}
        closeOnEsc={false}
      >
        <Grid style={{ display: 'grid', gap: 10 }}>
          <p style={{ margin: 0, color: '#475569', fontSize: 14 }}>Confirm to continue with protected operation.</p>
          <Flex style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => setOpen(false)}>I Understand</Button>
          </Flex>
        </Grid>
      </Dialog>
    </Box>
  );
};

export const AccessibilityKeyboardMap = () => {
  const [open, setOpen] = React.useState(false);
  const [openRtl, setOpenRtl] = React.useState(false);

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <Box
        style={{
          border: '1px solid #dbeafe',
          borderRadius: 12,
          background: '#f8fbff',
          color: '#1e3a8a',
          fontSize: 13,
          padding: 12,
          lineHeight: 1.5
        }}
      >
        Focus trap keys: <strong>Tab / Shift+Tab</strong> cycle focus inside dialog.
        Dismiss keys: <strong>Escape</strong> and overlay click (when enabled).
        RTL note: use <code>dir="rtl"</code> to verify mirrored close control + reading direction.
      </Box>

      <Flex style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button onClick={() => setOpen(true)}>Open LTR Dialog</Button>
        <Button variant="secondary" onClick={() => setOpenRtl(true)}>Open RTL Dialog</Button>
      </Flex>

      <Dialog
        open={open}
        title="Accessibility map"
        description="Use keyboard only to confirm trap behavior."
        onClose={() => setOpen(false)}
        onRequestClose={() => setOpen(false)}
      >
        <Grid style={{ display: 'grid', gap: 8 }}>
          <Button size="sm">Primary</Button>
          <Button size="sm" variant="secondary">Secondary</Button>
        </Grid>
      </Dialog>

      <Box dir="rtl">
        <Dialog
          open={openRtl}
          title="RTL Dialog"
          description="Dialog controls should mirror with logical CSS properties."
          onClose={() => setOpenRtl(false)}
          onRequestClose={() => setOpenRtl(false)}
        >
          <Grid style={{ display: 'grid', gap: 8 }}>
            <Button size="sm">Approve</Button>
            <Button size="sm" variant="secondary">Dismiss</Button>
          </Grid>
        </Dialog>
      </Box>
    </Grid>
  );
};
