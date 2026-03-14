import React from 'react';
import type { Meta } from '@storybook/react';
import {
  AlertDialog,
  AlertDialogActions,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogIcon,
  AlertDialogTitle,
  Box,
  Button,
  Flex,
  Grid
} from '@editora/ui-react';
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldIcon
} from '@editora/react-icons';

const meta: Meta<typeof AlertDialog> = {
  title: 'UI/AlertDialog',
  component: AlertDialog,
  args: {
    tone: 'warning',
    variant: 'soft',
    size: 'md',
    elevation: 'high',
    radius: 12,
    dismissible: true,
    closeOnEsc: true,
    closeOnBackdrop: false
  }
};

export default meta;

function SurfaceFrame({ children }: { children: React.ReactNode }) {
  return (
    <Grid
      style={{
        gap: 14,
        maxInlineSize: 980,
        padding: 20,
        border: '1px solid var(--base-panel-border, var(--ui-border))',
        borderRadius: 'var(--ui-radius, 4px)',
        background: 'var(--base-panel-bg, var(--color-panel-solid, #fff))',
        boxShadow: 'var(--base-panel-shadow, none)'
      }}
    >
      {children}
    </Grid>
  );
}

export function Playground(args: React.ComponentProps<typeof AlertDialog>) {
  const [open, setOpen] = React.useState(false);

  return (
    <SurfaceFrame>
      <Flex align="center" justify="space-between" style={{ gap: 12, flexWrap: 'wrap' }}>
        <Box>
          <Box style={{ fontWeight: 650, fontSize: 'var(--ui-default-font-size, 14px)' }}>Destructive confirmation</Box>
          <Box style={{ color: 'var(--ui-muted, #646464)', fontSize: 13, marginTop: 4 }}>
            Use alert dialogs for blocking, high-consequence actions.
          </Box>
        </Box>
        <Button onClick={() => setOpen(true)}>Open dialog</Button>
      </Flex>

      <AlertDialog
        {...args}
        open={open}
        onClose={() => setOpen(false)}
        config={{
          title: 'Delete environment',
          description: 'This permanently deletes the selected environment and all associated deployment metadata.',
          confirmText: 'Delete environment',
          cancelText: 'Keep environment'
        }}
      />
    </SurfaceFrame>
  );
}

export function VariantGallery() {
  const variants: Array<NonNullable<React.ComponentProps<typeof AlertDialog>['variant']>> = [
    'surface',
    'soft',
    'outline',
    'solid'
  ];

  return (
    <Grid style={{ gap: 14, maxInlineSize: 980 }}>
      {variants.map((variant) => (
        <SurfaceFrame key={variant}>
          <Box style={{ fontWeight: 650, textTransform: 'capitalize' }}>{variant}</Box>
          <AlertDialog
            open
            headless
            tone={variant === 'solid' ? 'danger' : 'warning'}
            variant={variant}
            elevation={variant === 'outline' ? 'none' : 'high'}
            radius={12}
            dismissible
            config={{
              title: 'Review production rollout',
              description: 'Publishing now will update the live workflow for all operators in the selected tenant.',
              confirmText: 'Publish',
              cancelText: 'Cancel'
            }}
          />
        </SurfaceFrame>
      ))}
    </Grid>
  );
}

export function StructuredComposition() {
  const [open, setOpen] = React.useState(true);

  return (
    <SurfaceFrame>
      <Grid style={{ gap: 12, maxInlineSize: 720 }}>
        <Box>
          <Box style={{ fontWeight: 700, fontSize: 18, lineHeight: 1.25 }}>Policy approval with embedded evidence</Box>
          <Box style={{ color: 'var(--ui-muted, #646464)', fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>
            This pattern shows the structured composition path for richer dialogs that still stay visually aligned with the
            alert-dialog shell.
          </Box>
        </Box>
        <Flex style={{ gap: 8, flexWrap: 'wrap' }}>
          <Box
            style={{
              padding: '4px 10px',
              borderRadius: 999,
              background: 'color-mix(in srgb, var(--ui-color-primary, #2563eb) 10%, transparent)',
              color: 'var(--ui-color-primary, #2563eb)',
              fontSize: 12,
              fontWeight: 600
            }}
          >
            Access control
          </Box>
          <Box
            style={{
              padding: '4px 10px',
              borderRadius: 999,
              background: 'color-mix(in srgb, var(--ui-color-success, #16a34a) 12%, transparent)',
              color: 'var(--ui-color-success, #16a34a)',
              fontSize: 12,
              fontWeight: 600
            }}
          >
            Auditable rollout
          </Box>
        </Flex>
      </Grid>
      <AlertDialog
        open={open}
        headless
        tone="info"
        variant="surface"
        size="lg"
        radius="none"
        indicator="none"
        dismissible
        onClose={() => setOpen(false)}
      >
        <AlertDialogIcon>
          <ShieldIcon size={16} />
        </AlertDialogIcon>
        <AlertDialogTitle>Approve updated access policy</AlertDialogTitle>
        <AlertDialogDescription>
          Publishing this policy will require re-authentication for privileged roles on their next session.
        </AlertDialogDescription>
        <AlertDialogContent>
          <Grid style={{ gap: 12 }}>
            <Grid
              style={{
                gap: 10,
                padding: 12,
                border: '1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent)',
                borderRadius: 12,
                background: 'color-mix(in srgb, var(--ui-color-primary, #2563eb) 4%, var(--color-panel-solid, #fff))'
              }}
            >
              <Flex align="start" style={{ gap: 8 }}>
                <CheckCircleIcon size={14} style={{ marginTop: 2, color: 'var(--ui-color-success, #16a34a)' }} />
                <Box style={{ fontSize: 13, lineHeight: 1.5 }}>
                  A signed audit trail entry will be generated automatically for each affected workspace.
                </Box>
              </Flex>
              <Flex align="start" style={{ gap: 8 }}>
                <ClockIcon size={14} style={{ marginTop: 2, color: 'var(--ui-color-primary, #2563eb)' }} />
                <Box style={{ fontSize: 13, lineHeight: 1.5 }}>
                  Policy propagation typically completes across tenants in under 30 seconds.
                </Box>
              </Flex>
            </Grid>
            <Grid
              style={{
                gap: 8,
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))'
              }}
            >
              <Box
                style={{
                  padding: 12,
                  borderRadius: 12,
                  background: 'var(--color-panel-solid, #fff)',
                  border: '1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent)'
                }}
              >
                <Box style={{ fontSize: 12, color: 'var(--ui-muted, #646464)', marginBottom: 4 }}>Affected roles</Box>
                <Box style={{ fontWeight: 650 }}>Platform Admins</Box>
              </Box>
              <Box
                style={{
                  padding: 12,
                  borderRadius: 12,
                  background: 'var(--color-panel-solid, #fff)',
                  border: '1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent)'
                }}
              >
                <Box style={{ fontSize: 12, color: 'var(--ui-muted, #646464)', marginBottom: 4 }}>Rollback window</Box>
                <Box style={{ fontWeight: 650 }}>15 minutes</Box>
              </Box>
            </Grid>
          </Grid>
        </AlertDialogContent>
        <AlertDialogActions>
          <Flex justify="end" style={{ gap: 8, width: '100%' }}>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Review later
            </Button>
            <Button onClick={() => setOpen(false)}>Publish policy</Button>
          </Flex>
        </AlertDialogActions>
      </AlertDialog>
    </SurfaceFrame>
  );
}

export function EnterpriseIncidentResponse() {
  const [openCritical, setOpenCritical] = React.useState(false);
  const [openReview, setOpenReview] = React.useState(false);
  const [lastEvent, setLastEvent] = React.useState('None');

  return (
    <Grid style={{ gap: 14, maxInlineSize: 980 }}>
      <SurfaceFrame>
        <Flex align="center" justify="space-between" style={{ gap: 12, flexWrap: 'wrap' }}>
          <Box>
            <Box style={{ fontWeight: 700, fontSize: 18 }}>Incident command dialogs</Box>
            <Box style={{ color: 'var(--ui-muted, #646464)', fontSize: 13, marginTop: 4 }}>
              Production-safe confirmation flows with layered safeguards.
            </Box>
          </Box>
          <Flex align="center" style={{ gap: 6, color: 'var(--ui-muted, #646464)', fontSize: 12 }}>
            <ClockIcon size={14} />
            Operations status: Elevated risk
          </Flex>
        </Flex>
      </SurfaceFrame>

      <Flex style={{ gap: 8, flexWrap: 'wrap' }}>
        <Button onClick={() => setOpenCritical(true)}>Open critical shutdown</Button>
        <Button variant="secondary" onClick={() => setOpenReview(true)}>
          Open policy review
        </Button>
      </Flex>

      <AlertDialog
        open={openCritical}
        tone="danger"
        variant="soft"
        size="lg"
        radius={12}
        elevation="high"
        dismissible
        onConfirm={(detail) => setLastEvent(`confirm:critical checked=${String(detail.checked)}`)}
        onCancel={() => setLastEvent('cancel:critical')}
        onDismiss={(detail) => setLastEvent(`dismiss:critical:${detail.source}`)}
        onClose={(detail) => {
          setOpenCritical(false);
          setLastEvent(`close:critical:${detail.action}${detail.source ? `:${detail.source}` : ''}`);
        }}
        config={{
          title: 'Confirm emergency ward shutdown',
          description: 'This action halts admissions, paging, and medication dispatch for the selected unit.',
          confirmText: 'Confirm shutdown',
          cancelText: 'Keep running',
          input: {
            enabled: true,
            label: 'Type SHUTDOWN to continue',
            placeholder: 'SHUTDOWN',
            required: true
          },
          checkbox: {
            enabled: true,
            label: 'Notify executive on-call immediately',
            checked: true
          }
        }}
      >
        <AlertDialogIcon>
          <AlertTriangleIcon size={16} />
        </AlertDialogIcon>
        <AlertDialogContent>
          <Grid style={{ gap: 10 }}>
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
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={openReview}
        tone="info"
        variant="surface"
        dismissible
        onConfirm={() => setLastEvent('confirm:policy')}
        onCancel={() => setLastEvent('cancel:policy')}
        onDismiss={(detail) => setLastEvent(`dismiss:policy:${detail.source}`)}
        onClose={(detail) => {
          setOpenReview(false);
          setLastEvent(`close:policy:${detail.action}${detail.source ? `:${detail.source}` : ''}`);
        }}
        config={{
          title: 'Approve updated escalation policy',
          description: 'This will publish revised response SLAs to all on-call teams.',
          confirmText: 'Publish policy',
          cancelText: 'Review later',
          checkbox: {
            enabled: true,
            label: 'Require supervisor acknowledgment at next login'
          }
        }}
      >
        <AlertDialogIcon>
          <CheckCircleIcon size={16} />
        </AlertDialogIcon>
      </AlertDialog>

      <Box
        style={{
          border: '1px solid var(--base-panel-border, var(--ui-border))',
          borderRadius: 'var(--ui-radius, 4px)',
          padding: 10,
          color: 'var(--ui-muted, #646464)',
          fontSize: 13
        }}
      >
        Last event: <strong>{lastEvent}</strong>
      </Box>
    </Grid>
  );
}
