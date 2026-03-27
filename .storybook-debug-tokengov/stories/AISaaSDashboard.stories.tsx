import React from 'react';
import { Box, Button, Dialog, Flex, Grid, Tabs, Toast, type ToastElement } from '@editora/ui-react';

type CardProps = {
  title: string;
  value: string;
  delta: string;
  tone?: 'neutral' | 'success' | 'danger';
};

const Card = ({ title, value, delta, tone = 'neutral' }: CardProps) => (
  <Box
    variant="surface"
    p="14px"
    radius="md"
    style={{
      border: '1px solid #e2e8f0',
      background: '#ffffff'
    }}
  >
    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
      {title}
    </div>
    <div style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', lineHeight: 1.1 }}>{value}</div>
    <div
      style={{
        marginTop: 8,
        fontSize: 13,
        fontWeight: 600,
        color: tone === 'success' ? '#15803d' : tone === 'danger' ? '#b91c1c' : '#475569'
      }}
    >
      {delta}
    </div>
  </Box>
);

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children?: React.ReactNode;
};

const Modal = ({ open, title, onClose, children }: ModalProps) => (
  <Dialog
    open={open}
    title={title}
    description="Review release and audit context before approval."
    submitText="Approve"
    cancelText="Cancel"
    dismissible
    closeOnOverlay
    closeOnEsc
    onDialogClose={onClose}
  >
    {children}
  </Dialog>
);

export default {
  title: 'AI/SaaS Dashboard'
};

export const EnterpriseOps = () => {
  const [activeTab, setActiveTab] = React.useState(0);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const toastRef = React.useRef<ToastElement | null>(null);

  const showToast = React.useCallback((message: string, type: 'success' | 'error' | 'info' | 'loading' = 'info') => {
    toastRef.current?.show(message, { type, duration: 1400, theme: 'light' });
  }, []);

  const handleSync = React.useCallback(() => {
    if (isSyncing) return;
    setIsSyncing(true);
    showToast('Syncing dashboard metrics...', 'loading');
    window.setTimeout(() => {
      setIsSyncing(false);
      showToast('Metrics synced successfully', 'success');
    }, 900);
  }, [isSyncing, showToast]);

  return (
    <Grid gap="16px" style={{ maxWidth: 1080, margin: '0 auto', padding: 8 }}>
      <Toast ref={toastRef} position="bottom-right" theme="light" />

      <Flex justify="between" align="center" wrap="wrap" gap="10px">
        <Box>
          <h2 style={{ margin: 0, fontSize: 28, color: '#0f172a' }}>SaaS Operations Dashboard</h2>
          <p style={{ margin: '6px 0 0 0', color: '#64748b' }}>Monitor subscriptions, incident risk, and deployment health.</p>
        </Box>
        <Flex gap="8px">
          <Button onClick={handleSync}>{isSyncing ? 'Syncing...' : 'Sync Data'}</Button>
          <Button variant="secondary" onClick={() => setModalOpen(true)}>
            Open Modal
          </Button>
        </Flex>
      </Flex>

      <Grid columns={{ initial: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' }} gap="10px">
        <Card title="MRR" value="$412K" delta="+8.4% vs last month" tone="success" />
        <Card title="Active Teams" value="1,248" delta="+34 new this week" tone="success" />
        <Card title="Churn Risk" value="2.1%" delta="-0.6% after onboarding changes" tone="success" />
        <Card title="Incidents" value="3" delta="1 critical alert" tone="danger" />
      </Grid>

      <Box variant="surface" p="12px" radius="md" style={{ border: '1px solid #e2e8f0' }}>
        <Tabs selected={activeTab} variant="soft" onChange={setActiveTab}>
          <div slot="tab" data-value="overview">
            Overview
          </div>
          <div slot="panel">
            <Grid gap="8px">
              <div style={{ color: '#334155' }}>Revenue velocity improved after pricing page experiment.</div>
              <Button size="sm" onClick={() => showToast('Quarterly summary exported', 'success')}>
                Export Summary
              </Button>
            </Grid>
          </div>

          <div slot="tab" data-value="deployments">
            Deployments
          </div>
          <div slot="panel">
            <Grid gap="8px">
              <div style={{ color: '#334155' }}>Latest release passed health checks in all regions.</div>
              <Button size="sm" variant="secondary" onClick={() => setModalOpen(true)}>
                Review Approval
              </Button>
            </Grid>
          </div>

          <div slot="tab" data-value="alerts">
            Alerts
          </div>
          <div slot="panel">
            <Grid gap="8px">
              <div style={{ color: '#334155' }}>One account reached API quota threshold.</div>
              <Button size="sm" variant="danger" onClick={() => showToast('Escalation sent to on-call', 'error')}>
                Escalate Incident
              </Button>
            </Grid>
          </div>
        </Tabs>
      </Box>

      <Modal open={modalOpen} title="Deployment Approval" onClose={() => setModalOpen(false)}>
        <Grid gap="10px">
          <Box variant="outline" p="10px" radius="sm" color="#475569">
            Release <strong>v1.2.8</strong> includes billing retries, SOC2 audit logging, and dashboard performance fixes.
          </Box>
          <Flex gap="8px" wrap="wrap">
            <Button
              size="sm"
              onClick={() => {
                showToast('Release approved and queued', 'success');
                setModalOpen(false);
              }}
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                showToast('Release returned for review', 'info');
                setModalOpen(false);
              }}
            >
              Request Changes
            </Button>
          </Flex>
        </Grid>
      </Modal>
    </Grid>
  );
};
