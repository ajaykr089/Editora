import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { toastAdvanced } from '@editora/toast';
import '@editora/toast/toast.css';
import { Box, Button, Dialog, Flex, Grid } from '@editora/ui-react';
import { Tabs } from '@editora/ui-react/Tabs';

const meta: Meta = {
  title: 'AI/Toast SaaS Center'
};

export default meta;
type Story = StoryObj;

type CardProps = {
  title: string;
  value: string;
  note: string;
};

const Card = ({ title, value, note }: CardProps) => (
  <Box variant="surface" p="12px" radius="md" style={{ border: '1px solid #e2e8f0', background: '#fff' }}>
    <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{title}</div>
    <div style={{ marginTop: 6, fontSize: 24, fontWeight: 700, color: '#0f172a' }}>{value}</div>
    <div style={{ marginTop: 6, fontSize: 13, color: '#475569' }}>{note}</div>
  </Box>
);

const Modal = ({ open, onClose }: { open: boolean; onClose: () => void }) => (
  <Dialog
    open={open}
    title="Notification Policy Update"
    description="Approve notification defaults before rollout."
    submitText="Approve"
    cancelText="Cancel"
    onDialogSubmit={() => {
      toastAdvanced.success('Policy approved and published', { theme: 'light', duration: 1300 });
      onClose();
    }}
    onDialogClose={onClose}
  >
    <Grid gap="8px">
      <Box variant="outline" p="10px" radius="sm" color="#475569">
        Default position: bottom-right. Max visible: 4. Promise mode enabled.
      </Box>
    </Grid>
  </Dialog>
);

export const NotificationCommandCenter: Story = {
  render: () => {
    const [tab, setTab] = React.useState(0);
    const [open, setOpen] = React.useState(false);

    return (
      <Grid gap="14px" style={{ maxWidth: 1040, margin: '0 auto', padding: 8 }}>
        <Flex justify="between" align="center" wrap="wrap" gap="10px">
          <Box>
            <h2 style={{ margin: 0, fontSize: 28, color: '#0f172a' }}>Toast Notification Center</h2>
            <p style={{ margin: '6px 0 0 0', color: '#64748b' }}>SaaS-grade delivery patterns with grouped and promise toasts.</p>
          </Box>
          <Flex gap="8px">
            <Button
              onClick={() =>
                toastAdvanced.promise(
                  new Promise((resolve) => setTimeout(resolve, 1000)),
                  {
                    loading: { message: 'Publishing release notes...', duration: 900 },
                    success: { message: 'Release notes published', duration: 1200 },
                    error: { message: 'Publish failed' }
                  }
                )
              }
            >
              Run Promise Toast
            </Button>
            <Button variant="secondary" onClick={() => setOpen(true)}>
              Open Modal
            </Button>
          </Flex>
        </Flex>

        <Grid columns={{ initial: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' }} gap="10px">
          <Card title="Toasts Today" value="248" note="11 grouped streams" />
          <Card title="Errors" value="6" note="Auto-retry enabled" />
          <Card title="Median TTL" value="1.4s" note="Within UX threshold" />
          <Card title="Queue Depth" value="2" note="No overload risk" />
        </Grid>

        <Box variant="surface" p="12px" radius="md" style={{ border: '1px solid #e2e8f0' }}>
          <Tabs selected={tab} variant="soft" onChange={setTab}>
            <Tabs.Tab value="signal">Signal</Tabs.Tab>
            <Tabs.Panel>
              <Flex gap="8px" wrap="wrap">
                <Button size="sm" onClick={() => toastAdvanced.success('Deployment healthy', { theme: 'light' })}>Success</Button>
                <Button size="sm" variant="warning" onClick={() => toastAdvanced.warning('Latency above baseline', { theme: 'light' })}>Warning</Button>
                <Button size="sm" variant="danger" onClick={() => toastAdvanced.error('Webhook delivery failed', { theme: 'light' })}>Error</Button>
              </Flex>
            </Tabs.Panel>

            <Tabs.Tab value="queue">Queue</Tabs.Tab>
            <Tabs.Panel>
              <Button
                size="sm"
                onClick={() => {
                  toastAdvanced.group('sync-stream', { message: 'Sync started', level: 'info', theme: 'light' });
                  toastAdvanced.group('sync-stream', { message: '50% complete', level: 'info', theme: 'light' });
                  toastAdvanced.group('sync-stream', { message: 'Sync complete', level: 'success', theme: 'light' });
                }}
              >
                Simulate Group Stream
              </Button>
            </Tabs.Panel>

            <Tabs.Tab value="config">Config</Tabs.Tab>
            <Tabs.Panel>
              <Button
                size="sm"
                onClick={() => {
                  toastAdvanced.configure({ maxVisible: 4, position: 'bottom-right', theme: 'light' });
                  toastAdvanced.info('Toast defaults updated', { theme: 'light' });
                }}
              >
                Apply Runtime Config
              </Button>
            </Tabs.Panel>
          </Tabs>
        </Box>

        <Modal open={open} onClose={() => setOpen(false)} />
      </Grid>
    );
  }
};
