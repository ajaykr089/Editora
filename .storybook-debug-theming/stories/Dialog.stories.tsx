import React from 'react';
import { Box, Button, Dialog, Flex, Grid } from '@editora/ui-react';

export default {
  title: 'UI/Dialog',
  component: Dialog,
  argTypes: {
    open: { control: 'boolean' },
    dismissible: { control: 'boolean' },
    closeOnOverlay: { control: 'boolean' },
    closeOnEsc: { control: 'boolean' },
    size: { control: { type: 'radio', options: ['1', '2', '3', 'sm', 'md', 'lg'] } }
  }
};

export const Default = (args: any) => {
  const [open, setOpen] = React.useState(Boolean(args.open));
  const [requestReason, setRequestReason] = React.useState('none');
  const [result, setResult] = React.useState('none');

  React.useEffect(() => {
    setOpen(Boolean(args.open));
  }, [args.open]);

  return (
    <Grid gap="12px">
      <Flex gap="8px" wrap="wrap">
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <Button variant="secondary" onClick={() => { setRequestReason('none'); setResult('none'); }}>
          Reset Event Log
        </Button>
      </Flex>

      <Dialog
        {...args}
        open={open}
        title="Publish changes"
        description="Review details before publishing this version."
        submitText="Publish"
        cancelText="Cancel"
        onRequestClose={(detail) => setRequestReason(detail.reason)}
        onDialogClose={(detail) => {
          setResult(`${detail.action}${detail.source ? `:${detail.source}` : ''}`);
          setOpen(false);
        }}
      >
        <Grid gap="10px">
          <Box variant="surface" p="10px" radius="sm" color="#475569">
            This action updates the shared workspace for all collaborators.
          </Box>
          <Box variant="outline" p="10px" radius="sm" color="#475569">
            Press <strong>Tab</strong> / <strong>Shift+Tab</strong> to verify focus trapping.
          </Box>
        </Grid>
      </Dialog>

      <Box variant="surface" p="10px" radius="sm" color="#475569">
        Request reason: <strong>{requestReason}</strong> | Close result: <strong>{result}</strong>
      </Box>
    </Grid>
  );
};

Default.args = {
  open: false,
  dismissible: true,
  closeOnOverlay: true,
  closeOnEsc: true,
  size: 'md'
};

export const Large = () => {
  const [open, setOpen] = React.useState(false);
  const [submittedData, setSubmittedData] = React.useState<Record<string, string | string[]> | null>(null);

  return (
    <Grid gap="12px">
      <Button onClick={() => setOpen(true)}>Open Large Dialog</Button>

      <Dialog
        open={open}
        size="lg"
        title="Team activity report"
        description="Weekly summary across all editors."
        submitText="Apply Filters"
        onDialogSubmit={(detail) => {
          setSubmittedData(detail.formData || null);
        }}
        onDialogClose={() => setOpen(false)}
      >
        <Grid gap="10px">
          <form>
            <Grid gap="8px" columns={{ initial: '1fr', md: '1fr 1fr' }}>
              <label>
                <span>Owner</span>
                <input name="owner" defaultValue="Operations" />
              </label>
              <label>
                <span>Window</span>
                <input name="window" defaultValue="Last 7 days" />
              </label>
            </Grid>
          </form>

          <Grid gap="8px" columns={{ initial: '1fr', md: '1fr 1fr 1fr' }}>
            <Box variant="surface" p="10px" radius="sm">Documents created: 42</Box>
            <Box variant="surface" p="10px" radius="sm">Comments resolved: 128</Box>
            <Box variant="surface" p="10px" radius="sm">Pending approvals: 6</Box>
          </Grid>
        </Grid>
      </Dialog>

      <Box variant="surface" p="10px" radius="sm" color="#475569">
        Last form data: {submittedData ? JSON.stringify(submittedData) : 'none'}
      </Box>
    </Grid>
  );
};

export const NonDismissable = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <Grid gap="12px">
      <Button onClick={() => setOpen(true)}>Open Strict Dialog</Button>
      <Dialog
        open={open}
        title="Security confirmation"
        description="This dialog can only close via submit action."
        dismissible={false}
        closeOnOverlay={false}
        closeOnEsc={false}
        config={{
          showCancel: false,
          showClose: false
        }}
        submitText="I Understand"
        onDialogClose={() => setOpen(false)}
      >
        <Box variant="outline" p="10px" radius="sm" color="#475569">
          Confirm to continue with protected operation.
        </Box>
      </Dialog>
    </Grid>
  );
};

export const AccessibilityKeyboardMap = () => {
  const [open, setOpen] = React.useState(false);
  const [openRtl, setOpenRtl] = React.useState(false);

  return (
    <Grid gap="12px">
      <Box variant="outline" tone="brand" p="12px" radius="lg" color="#1e3a8a">
        Focus trap keys: <strong>Tab / Shift+Tab</strong>.
        Dismiss keys: <strong>Escape</strong> and overlay click (if enabled).
        RTL: verify mirrored layout with <code>dir="rtl"</code>.
      </Box>

      <Flex gap="8px" wrap="wrap">
        <Button onClick={() => setOpen(true)}>Open LTR Dialog</Button>
        <Button variant="secondary" onClick={() => setOpenRtl(true)}>Open RTL Dialog</Button>
      </Flex>

      <Dialog
        open={open}
        title="Accessibility map"
        description="Use keyboard only to validate trap behavior."
        onDialogClose={() => setOpen(false)}
      >
        <Grid gap="8px">
          <Button size="sm">Primary</Button>
          <Button size="sm" variant="secondary">Secondary</Button>
        </Grid>
      </Dialog>

      <Box dir="rtl">
        <Dialog
          open={openRtl}
          title="RTL Dialog"
          description="Controls should mirror with logical CSS properties."
          onDialogClose={() => setOpenRtl(false)}
        >
          <Grid gap="8px">
            <Button size="sm">Approve</Button>
            <Button size="sm" variant="secondary">Dismiss</Button>
          </Grid>
        </Dialog>
      </Box>
    </Grid>
  );
};
