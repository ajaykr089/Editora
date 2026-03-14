import React from 'react';
import type { Meta } from '@storybook/react';
import { Alert, AlertActions, AlertDescription, AlertIcon, AlertTitle, Box, Button, Flex, Grid } from '@editora/ui-react';
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

function DemoAlert(props: React.ComponentProps<typeof Alert>) {
  return (
    <Alert {...props}>
      <AlertTitle>Deployment notice</AlertTitle>
      <AlertDescription>Production rollout windows have shifted by 20 minutes for the eu-west cluster.</AlertDescription>
      <AlertActions style={{ display: 'inline-flex', gap: 8, flexWrap: 'wrap' }}>
        <Button size="sm" variant="secondary">
          Review plan
        </Button>
        <Button size="sm">Acknowledge</Button>
      </AlertActions>
    </Alert>
  );
}

export function BaselineStyles() {
  return (
    <Grid style={{ gap: 18, maxInlineSize: 1100 }}>
      <Box
        style={{
          border: '1px solid var(--ui-color-border, #d8e1ec)',
          borderRadius: 16,
          padding: 16,
          background: 'var(--ui-color-surface, #fff)',
          display: 'grid',
          gap: 14,
        }}
      >
        <Box style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ui-color-muted, #64748b)' }}>
          Variants
        </Box>
        <Grid style={{ gap: 14 }}>
          <DemoAlert variant="surface" tone="info" radius={12} elevation="low" />
          <DemoAlert variant="outline" tone="success" radius={12} elevation="none" />
          <DemoAlert variant="soft" tone="warning" radius={12} elevation="none" />
          <DemoAlert variant="solid" tone="danger" radius={12} elevation="low" />
        </Grid>
      </Box>

      <Grid columns={2} style={{ gap: 16 }}>
        <Box
          style={{
            border: '1px solid var(--ui-color-border, #d8e1ec)',
            borderRadius: 16,
            padding: 16,
            background: 'var(--ui-color-surface, #fff)',
            display: 'grid',
            gap: 14,
          }}
        >
          <Box style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ui-color-muted, #64748b)' }}>
            Sizes
          </Box>
          <DemoAlert size="sm" radius={8} />
          <DemoAlert size="md" radius={12} />
          <DemoAlert size="lg" radius={16} />
        </Box>

        <Box
          style={{
            border: '1px solid var(--ui-color-border, #d8e1ec)',
            borderRadius: 16,
            padding: 16,
            background: 'var(--ui-color-surface, #fff)',
            display: 'grid',
            gap: 14,
          }}
        >
          <Box style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ui-color-muted, #64748b)' }}>
            Radius and indicator
          </Box>
          <DemoAlert radius={0} variant="outline" />
          <DemoAlert radius={4} variant="outline" />
          <DemoAlert radius={12} variant="outline" />
          <DemoAlert radius="full" variant="outline" indicator="none" />
        </Box>
      </Grid>
    </Grid>
  );
}

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
          size="md"
          radius={16}
          elevation="low"
          dismissible
          onClose={() => {
            setShowCritical(false);
            toastAdvanced.warning('Critical alert dismissed', { duration: 1800, theme: 'light' });
          }}
        >
          <AlertIcon aria-hidden="true" style={{ display: 'inline-flex' }}>
            <AlertTriangleIcon size={16} />
          </AlertIcon>
          <AlertTitle>Sepsis protocol breach detected</AlertTitle>
          <AlertDescription>
            Medication administration delayed by 11 minutes in Ward 4C. Immediate physician acknowledgment required.
          </AlertDescription>
          <AlertActions as="div" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
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
          </AlertActions>
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
          radius={16}
          elevation="none"
          dismissible
          onClose={() => {
            setShowOps(false);
            toastAdvanced.info('Operations notice dismissed', { duration: 1400, theme: 'light' });
          }}
        >
          <AlertIcon aria-hidden="true" style={{ display: 'inline-flex' }}>
            <ShieldIcon size={16} />
          </AlertIcon>
          <AlertTitle>Overnight audit reminder</AlertTitle>
          <AlertDescription>
            Ensure narcotics log reconciliation is complete before 06:00 handoff.
          </AlertDescription>
          <AlertActions as="div" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
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
          </AlertActions>
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
