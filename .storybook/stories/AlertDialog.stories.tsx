import React from 'react';
import type { Meta } from '@storybook/react';
import { AlertDialog, Box, Button, Flex, Grid } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldIcon,
} from '@editora/react-icons';
import '../../packages/editora-toast/src/toast.css';
import '@editora/themes/themes/default.css';

const meta: Meta<typeof AlertDialog> = {
  title: 'UI/AlertDialog',
  component: AlertDialog,
};

export default meta;

function EnterpriseIncidentFlow() {
  const [openCritical, setOpenCritical] = React.useState(false);
  const [openReview, setOpenReview] = React.useState(false);
  const [lastEvent, setLastEvent] = React.useState('None');

  return (
    <Grid style={{ gap: 14, maxInlineSize: 980 }}>
      <Box
        style={{
          border: '1px solid var(--ui-color-border, #d8e1ec)',
          borderRadius: 16,
          padding: 16,
          background:
            'linear-gradient(135deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 7%, #fff) 0%, var(--ui-color-surface, #fff) 42%)',
        }}
      >
        <Flex align="center" justify="space-between" style={{ gap: 12, flexWrap: 'wrap' }}>
          <Box>
            <Box style={{ fontWeight: 700, fontSize: 18 }}>Incident Command Dialogs</Box>
            <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13, marginTop: 4 }}>
              Enterprise confirmation flows with accessible, layered safeguards.
            </Box>
          </Box>
          <Flex align="center" style={{ gap: 6, color: 'var(--ui-color-muted, #64748b)', fontSize: 12 }}>
            <ClockIcon size={14} />
            Operations status: Elevated risk
          </Flex>
        </Flex>
      </Box>

      <Flex style={{ gap: 8, flexWrap: 'wrap' }}>
        <Button size="sm" onClick={() => setOpenCritical(true)}>
          Open Critical Shutdown
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setOpenReview(true)}>
          Open Policy Review
        </Button>
      </Flex>

      <AlertDialog
        open={openCritical}
        tone="danger"
        size="lg"
        dismissible
        config={{
          title: 'Confirm Emergency Ward Shutdown',
          description: 'This action halts admissions, paging, and medication dispatch for the selected unit.',
          confirmText: 'Confirm Shutdown',
          cancelText: 'Keep Running',
          tone: 'danger',
          checkbox: {
            enabled: true,
            label: 'Notify executive on-call immediately',
            defaultChecked: true,
          },
          input: {
            enabled: true,
            label: 'Type SHUTDOWN to continue',
            placeholder: 'SHUTDOWN',
            required: true,
          },
        }}
        onConfirm={(detail) => {
          toastAdvanced.warning(`Shutdown initiated (${detail.inputValue || 'no-code'})`, { duration: 1900, theme: 'light' });
          setLastEvent(`confirm:critical checked=${String(detail.checked)}`);
        }}
        onCancel={() => {
          toastAdvanced.info('Critical shutdown canceled', { duration: 1400, theme: 'light' });
          setLastEvent('cancel:critical');
        }}
        onDismiss={(detail) => {
          toastAdvanced.info(`Critical dialog dismissed via ${detail.source}`, { duration: 1400, theme: 'light' });
          setLastEvent(`dismiss:critical:${detail.source}`);
        }}
        onClose={(detail) => {
          setOpenCritical(false);
          setLastEvent(`close:critical:${detail.action}${detail.source ? `:${detail.source}` : ''}`);
        }}
      >
        <Box slot="icon" aria-hidden="true" style={{ display: 'inline-flex' }}>
          <AlertTriangleIcon size={16} />
        </Box>
        <Grid slot="content" style={{ gap: 10 }}>
          <Flex align="start" style={{ gap: 8 }}>
            <ShieldIcon size={14} style={{ marginTop: 2, color: '#b45309' }} />
            <Box style={{ fontSize: 13, lineHeight: 1.5 }}>
              Active trauma cases will be rerouted to fallback units immediately.
            </Box>
          </Flex>
          <Flex align="start" style={{ gap: 8 }}>
            <ShieldIcon size={14} style={{ marginTop: 2, color: '#b45309' }} />
            <Box style={{ fontSize: 13, lineHeight: 1.5 }}>
              Audit trail entry will include operator identity and confirmation payload.
            </Box>
          </Flex>
        </Grid>
      </AlertDialog>

      <AlertDialog
        open={openReview}
        tone="info"
        size="md"
        dismissible
        config={{
          title: 'Approve Updated Escalation Policy',
          description: 'This will publish revised response SLAs to all on-call teams.',
          confirmText: 'Publish Policy',
          cancelText: 'Review Later',
          tone: 'info',
          checkbox: {
            enabled: true,
            label: 'Require supervisor acknowledgment at next login',
          },
          showClose: true,
        }}
        onConfirm={(detail) => {
          toastAdvanced.success('Policy published successfully', { duration: 1600, theme: 'light' });
          setLastEvent(`confirm:policy checked=${String(detail.checked)}`);
        }}
        onCancel={() => {
          toastAdvanced.info('Policy review deferred', { duration: 1400, theme: 'light' });
          setLastEvent('cancel:policy');
        }}
        onDismiss={(detail) => {
          toastAdvanced.info(`Policy dialog dismissed via ${detail.source}`, { duration: 1400, theme: 'light' });
          setLastEvent(`dismiss:policy:${detail.source}`);
        }}
        onClose={(detail) => {
          setOpenReview(false);
          setLastEvent(`close:policy:${detail.action}${detail.source ? `:${detail.source}` : ''}`);
        }}
      >
        <Box slot="icon" aria-hidden="true" style={{ display: 'inline-flex' }}>
          <CheckCircleIcon size={16} />
        </Box>
      </AlertDialog>

      <Box
        style={{
          border: '1px solid var(--ui-color-border, #d8e1ec)',
          borderRadius: 12,
          padding: 10,
          color: 'var(--ui-color-muted, #64748b)',
          fontSize: 13,
        }}
      >
        Last event: <strong>{lastEvent}</strong>
      </Box>
    </Grid>
  );
}

export const EnterpriseIncidentResponse = () => <EnterpriseIncidentFlow />;

