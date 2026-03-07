import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { toastAdvanced } from '@editora/toast';
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  IconProvider,
  RefreshCwIcon,
  ShieldIcon,
  UsersIcon
} from '@editora/react-icons';
import { Box, Button, Dialog, Flex, Grid, Tabs } from '@editora/ui-react';

const meta: Meta = {
  title: 'AI/React Icons SaaS Dashboard'
};

export default meta;
type Story = StoryObj;

const Card = ({
  icon,
  title,
  value,
  tone = '#0f172a'
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  tone?: string;
}) => (
  <Box variant="surface" p="12px" radius="md" style={{ border: '1px solid #e2e8f0', background: '#fff' }}>
    <Flex justify="between" align="center">
      <div>
        <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{title}</div>
        <div style={{ marginTop: 6, fontSize: 24, fontWeight: 700, color: tone }}>{value}</div>
      </div>
      {icon}
    </Flex>
  </Box>
);

const Modal = ({ open, onClose }: { open: boolean; onClose: () => void }) => (
  <Dialog
    open={open}
    title="Icon Set Governance"
    description="Approve stroke and semantic icon usage policy."
    submitText="Approve"
    cancelText="Cancel"
    onDialogSubmit={() => {
      toastAdvanced.success('Icon governance policy approved', { theme: 'light', duration: 1200 });
      onClose();
    }}
    onDialogClose={onClose}
  >
    <Box variant="outline" p="10px" radius="sm" color="#475569">
      Team standard: `IconProvider(size=18, strokeWidth=1.9)` and semantic icon mapping for status.
    </Box>
  </Dialog>
);

export const IconDrivenOperations: Story = {
  render: () => {
    const [tab, setTab] = React.useState(0);
    const [open, setOpen] = React.useState(false);

    return (
      <IconProvider value={{ size: 20, strokeWidth: 1.9 }}>
        <Grid gap="14px" style={{ maxWidth: 1040, margin: '0 auto', padding: 8 }}>
          <Flex justify="between" align="center" wrap="wrap" gap="10px">
            <Box>
              <h2 style={{ margin: 0, fontSize: 28, color: '#0f172a' }}>React Icons Operations Dashboard</h2>
              <p style={{ margin: '6px 0 0 0', color: '#64748b' }}>Icon-driven telemetry for enterprise SaaS workflows.</p>
            </Box>
            <Flex gap="8px">
              <Button
                onClick={() => {
                  toastAdvanced.loading('Refreshing icon telemetry...', { theme: 'light', duration: 850 });
                  setTimeout(() => toastAdvanced.success('Icon telemetry updated', { theme: 'light', duration: 1100 }), 900);
                }}
              >
                <RefreshCwIcon ariaLabel="Refresh" style={{ marginInlineEnd: 6 }} />
                Refresh
              </Button>
              <Button variant="secondary" onClick={() => setOpen(true)}>
                <ShieldIcon ariaLabel="Policy" style={{ marginInlineEnd: 6 }} />
                Policy
              </Button>
            </Flex>
          </Flex>

          <Grid columns={{ initial: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' }} gap="10px">
            <Card icon={<UsersIcon ariaLabel="Users" color="#1d4ed8" />} title="Active Seats" value="1,842" />
            <Card icon={<CheckCircleIcon ariaLabel="Healthy" color="#15803d" />} title="Healthy Services" value="23" tone="#15803d" />
            <Card icon={<AlertTriangleIcon ariaLabel="Warning" color="#b45309" />} title="Warnings" value="4" tone="#b45309" />
            <Card icon={<ShieldIcon ariaLabel="Compliance" color="#475569" />} title="Policy Score" value="98.7%" />
          </Grid>

          <Box variant="surface" p="12px" radius="md" style={{ border: '1px solid #e2e8f0' }}>
            <Tabs selected={tab} variant="soft" onChange={setTab}>
              <div slot="tab" data-value="system">System</div>
              <div slot="panel">
                <Flex gap="8px" wrap="wrap">
                  <Button size="sm" onClick={() => toastAdvanced.success('Status icon mapping validated', { theme: 'light' })}>
                    Validate Mapping
                  </Button>
                </Flex>
              </div>

              <div slot="tab" data-value="alerts">Alerts</div>
              <div slot="panel">
                <Button size="sm" variant="warning" onClick={() => toastAdvanced.warning('Icon contrast check required', { theme: 'light' })}>
                  Run Contrast Check
                </Button>
              </div>

              <div slot="tab" data-value="accessibility">A11y</div>
              <div slot="panel">
                <Button size="sm" onClick={() => toastAdvanced.info('Aria label audit completed', { theme: 'light' })}>
                  Audit Aria Labels
                </Button>
              </div>
            </Tabs>
          </Box>

          <Modal open={open} onClose={() => setOpen(false)} />
        </Grid>
      </IconProvider>
    );
  }
};
