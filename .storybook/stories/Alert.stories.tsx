import React from 'react';
import type { Meta } from '@storybook/react';
import { Alert, Box, Button, Flex, Grid } from '@editora/ui-react';
import { EditoraEditor } from '@editora/editor';
import { toastAdvanced } from '@editora/toast';
import {
  AlertTriangleIcon,
  BellIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldIcon,
} from '@editora/react-icons';
import '../../packages/editora-toast/src/toast.css';
import '@editora/themes/themes/default.css';

const meta: Meta<typeof Alert> = {
  title: 'UI/Alert',
  component: Alert,
  parameters: {
    docs: {
      source: {
        type: 'code',
      },
    },
  },
};

export default meta;

function EnterpriseAlertCenter() {
  const [showCritical, setShowCritical] = React.useState(true);
  const [showOps, setShowOps] = React.useState(true);
  const [noteHtml, setNoteHtml] = React.useState(
    '<p><strong>On-call note:</strong> Validate renal dosing override and confirm escalation callback.</p>'
  );

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
        <Flex align="center" justify="space-between" style={{ gap: 10, flexWrap: 'wrap' }}>
          <Box>
            <Box style={{ fontWeight: 700, fontSize: 18 }}>Clinical Alert Center</Box>
            <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13, marginTop: 4 }}>
              Enterprise alert patterns powered by `ui-core` and wrapped by `ui-react`.
            </Box>
          </Box>
          <Flex align="center" style={{ gap: 6, color: 'var(--ui-color-muted, #64748b)', fontSize: 12 }}>
            <ClockIcon size={14} />
            Shift status: Active monitoring
          </Flex>
        </Flex>
      </Box>

      {showCritical ? (
        <Alert
          tone="danger"
          variant="soft"
          dismissible
          onClose={() => {
            setShowCritical(false);
            toastAdvanced.warning('Critical alert dismissed', { duration: 1800, theme: 'light' });
          }}
          style={
            {
              '--ui-alert-radius': '16px',
              '--ui-alert-padding-x': '16px',
              '--ui-alert-padding-y': '14px',
            } as React.CSSProperties
          }
        >
          <Box slot="icon" aria-hidden="true" style={{ display: 'inline-flex' }}>
            <AlertTriangleIcon size={16} />
          </Box>
          <Box slot="title" style={{ fontWeight: 700 }}>
            Sepsis protocol breach detected
          </Box>
          Medication administration delayed by 11 minutes in Ward 4C. Immediate physician acknowledgment required.
          <Flex slot="actions" style={{ gap: 8, flexWrap: 'wrap' }}>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => toastAdvanced.info('Critical alert assigned to on-call physician', { duration: 1800 })}
            >
              Assign Owner
            </Button>
            <Button
              size="sm"
              onClick={() => toastAdvanced.success('Escalation acknowledged and action plan started', { duration: 1800 })}
            >
              Escalate Now
            </Button>
          </Flex>
        </Alert>
      ) : (
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setShowCritical(true);
            toastAdvanced.info('Critical alert restored', { duration: 1400, theme: 'light' });
          }}
        >
          Restore Critical Alert
        </Button>
      )}

      {showOps ? (
        <Alert
          tone="info"
          variant="outline"
          dismissible
          onClose={() => {
            setShowOps(false);
            toastAdvanced.info('Operations notice dismissed', { duration: 1400, theme: 'light' });
          }}
        >
          <Box slot="icon" aria-hidden="true" style={{ display: 'inline-flex' }}>
            <ShieldIcon size={16} />
          </Box>
          <Box slot="title" style={{ fontWeight: 700 }}>
            Overnight audit reminder
          </Box>
          Ensure narcotics log reconciliation is complete before 06:00 handoff.
          <Flex slot="actions" style={{ gap: 8, flexWrap: 'wrap' }}>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => toastAdvanced.success('Checklist opened', { duration: 1200, theme: 'light' })}
            >
              Open Checklist
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => toastAdvanced.info('Reminder snoozed for 30 minutes', { duration: 1200, theme: 'light' })}
            >
              Snooze
            </Button>
          </Flex>
        </Alert>
      ) : (
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setShowOps(true);
            toastAdvanced.info('Operations notice restored', { duration: 1200, theme: 'light' });
          }}
        >
          Restore Ops Notice
        </Button>
      )}

      <Box
        style={{
          border: '1px solid var(--ui-color-border, #d8e1ec)',
          borderRadius: 16,
          padding: 12,
          background: 'var(--ui-color-surface, #fff)',
          display: 'grid',
          gap: 10,
        }}
      >
        <Flex justify="space-between" align="center" style={{ gap: 10, flexWrap: 'wrap' }}>
          <Flex align="center" style={{ gap: 8 }}>
            <BellIcon size={14} />
            <Box style={{ fontWeight: 700, fontSize: 14 }}>Responder Notes</Box>
          </Flex>
          <Flex align="center" style={{ gap: 6, color: '#15803d', fontSize: 12 }}>
            <CheckCircleIcon size={14} />
            Rich text editor integration
          </Flex>
        </Flex>

        <Box style={{ border: '1px solid #dbe4ef', borderRadius: 12, minHeight: 220, overflow: 'hidden' }}>
          <EditoraEditor value={noteHtml} onChange={setNoteHtml} />
        </Box>

        <Flex justify="end" style={{ gap: 8 }}>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => toastAdvanced.warning('Reminder sent to ward supervisor', { duration: 1500, theme: 'light' })}
          >
            Notify Supervisor
          </Button>
          <Button size="sm" onClick={() => toastAdvanced.success('Responder note saved', { duration: 1500, theme: 'light' })}>
            Save Notes
          </Button>
        </Flex>
      </Box>
    </Grid>
  );
}

export const EnterpriseClinicalAlerts = EnterpriseAlertCenter;
