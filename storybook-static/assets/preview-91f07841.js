import{a as m,j as v,g as P,b as z}from"./index-c1b18327.js";import{r as b}from"./index-93f6b7ae.js";const A=`import React from 'react';
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
`,I=`import React from 'react';
import type { Meta } from '@storybook/react';
import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger, Box, Button, Flex, Grid } from '@editora/ui-react';
import { EditoraEditor } from '@editora/editor';
import { toastAdvanced } from '@editora/toast';
import {
  ActivityIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  ClipboardCheckIcon,
  ClockIcon,
  ShieldIcon,
} from '@editora/react-icons';
import '../../packages/editora-toast/src/toast.css';
import '@editora/themes/themes/default.css';

const meta: Meta<typeof Accordion> = {
  title: 'UI/Accordion',
  component: Accordion,
  parameters: {
    docs: {
      source: {
        type: 'code',
      },
    },
  },
};

export default meta;

type Section = {
  title: string;
  subtitle: string;
  badge: string;
  points: string[];
  icon: React.ReactNode;
};

const sections: Section[] = [
  {
    title: 'Triage Summary',
    subtitle: 'Vitals, nurse handoff, and immediate risk profile.',
    badge: 'Priority',
    icon: <ActivityIcon size={16} />,
    points: [
      'Bed occupancy at 92% with two high-risk alerts.',
      'Average triage time 11 minutes over the last 4 hours.',
      'Pending physician acknowledgment for transfer handoff.',
    ],
  },
  {
    title: 'Medication Safety',
    subtitle: 'Renal dosing, interaction checks, and pharmacy clearance.',
    badge: 'Safety',
    icon: <ShieldIcon size={16} />,
    points: [
      'High-risk medications reviewed for this shift.',
      'Drug interaction clearance pending for anticoagulants.',
      'Renal dose adjustments applied to latest lab values.',
    ],
  },
  {
    title: 'Discharge Checklist',
    subtitle: 'Follow-up, caregiver confirmation, and closure artifacts.',
    badge: 'Ready',
    icon: <ClipboardCheckIcon size={16} />,
    points: [
      'Discharge summary signed by attending physician.',
      'Caregiver confirmation still required before release.',
      'Follow-up visit scheduled within 7 days.',
    ],
  },
];

function toOpenArray(value: number | number[]): number[] {
  if (Array.isArray(value)) return value.filter((item) => Number.isFinite(item) && item >= 0);
  return Number.isFinite(value) && value >= 0 ? [value] : [];
}

function TriggerContent({ section }: { section: Section }) {
  return (
    <Flex align="center" style={{ gap: 12 }}>
      <Box
        aria-hidden="true"
        style={{
          inlineSize: 30,
          blockSize: 30,
          borderRadius: 10,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'color-mix(in srgb, var(--ui-accordion-primary, #2563eb) 12%, transparent)',
          color: 'var(--ui-accordion-primary, #2563eb)',
        }}
      >
        {section.icon}
      </Box>
      <Grid style={{ minWidth: 0 }}>
        <Box style={{ fontSize: 14, fontWeight: 650, lineHeight: 1.3 }}>{section.title}</Box>
      </Grid>
    </Flex>
  );
}

function EnterpriseClinicalAccordion() {
  const [open, setOpen] = React.useState<number | number[]>([0]);
  const [noteHtml, setNoteHtml] = React.useState(
    '<p><strong>Shift note:</strong> Continue fall-risk monitoring and confirm caregiver briefing before discharge.</p>'
  );
  const previous = React.useRef<number[]>([0]);

  const onToggle = (next: number | number[]) => {
    const nextArray = toOpenArray(next);
    const previousArray = previous.current;
    const opened = nextArray.filter((value) => !previousArray.includes(value));
    const closed = previousArray.filter((value) => !nextArray.includes(value));

    opened.forEach((index) => {
      const title = sections[index]?.title;
      if (title) toastAdvanced.info(\`\${title} expanded\`, { duration: 1600, theme: 'light' });
    });
    closed.forEach((index) => {
      const title = sections[index]?.title;
      if (title) toastAdvanced.success(\`\${title} reviewed\`, { duration: 1400, theme: 'light' });
    });

    previous.current = nextArray;
    setOpen(next);
  };

  return (
    <Grid style={{ gap: 14, maxInlineSize: 980 }}>
      <Box
        style={{
          border: '1px solid var(--ui-color-border, #d8e1ec)',
          borderRadius: 16,
          padding: 16,
          background:
            'linear-gradient(135deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 6%, #fff) 0%, var(--ui-color-surface, #fff) 42%)',
        }}
      >
        <Flex align="center" justify="space-between" style={{ gap: 12, flexWrap: 'wrap' }}>
          <Box>
            <Box style={{ fontWeight: 700, fontSize: 18 }}>Inpatient Care Workflow</Box>
            <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13, marginTop: 4 }}>
              Enterprise accordion built on \`ui-core\` and wrapped by \`ui-react\`.
            </Box>
          </Box>
          <Flex align="center" style={{ gap: 8, color: 'var(--ui-color-muted, #64748b)', fontSize: 12 }}>
            <ClockIcon size={14} />
            Live operation summary
          </Flex>
        </Flex>
      </Box>

      <Accordion
        multiple
        open={open}
        onToggle={onToggle}
        style={
          {
            '--ui-accordion-radius': '16px',
            '--ui-accordion-shadow': '0 1px 2px rgba(15, 23, 42, 0.06), 0 16px 28px rgba(15, 23, 42, 0.08)',
            '--ui-accordion-border': '1px solid color-mix(in srgb, var(--ui-color-border, #d8e1ec) 90%, transparent)',
            '--ui-accordion-divider': 'color-mix(in srgb, var(--ui-color-border, #d8e1ec) 85%, transparent)',
            '--ui-accordion-open-surface': 'color-mix(in srgb, var(--ui-color-primary, #2563eb) 6%, var(--ui-color-surface, #fff))',
            '--ui-accordion-duration': '190ms',
          } as React.CSSProperties
        }
      >
        {sections.map((section) => (
          <AccordionItem key={section.title} description={section.subtitle} badge={section.badge}>
            <AccordionTrigger aria-label={\`Toggle \${section.title}\`}>
              <TriggerContent section={section} />
            </AccordionTrigger>
            <AccordionPanel>
              <Grid style={{ gap: 10 }}>
                {section.points.map((point) => (
                  <Flex key={point} align="start" style={{ gap: 8 }}>
                    <CheckCircleIcon size={14} style={{ marginTop: 2, color: '#15803d' }} />
                    <Box style={{ fontSize: 13, lineHeight: 1.5 }}>{point}</Box>
                  </Flex>
                ))}
              </Grid>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

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
        <Flex justify="space-between" align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
          <Box style={{ fontWeight: 700 }}>Care Plan Notes</Box>
          <Flex align="center" style={{ gap: 6, color: '#b45309', fontSize: 12 }}>
            <AlertTriangleIcon size={14} />
            Rich text area powered by @editora/editor
          </Flex>
        </Flex>

        <Box style={{ border: '1px solid #dbe4ef', borderRadius: 12, minHeight: 220, overflow: 'hidden' }}>
          <EditoraEditor value={noteHtml} onChange={setNoteHtml} />
        </Box>

        <Flex justify="end" style={{ gap: 8 }}>
          <Button
            size="sm"
            variant="secondary"
            onClick={() =>
              toastAdvanced.warning('Escalation sent to on-call supervisor', { duration: 1800, theme: 'light' })
            }
          >
            Escalate
          </Button>
          <Button
            size="sm"
            onClick={() => toastAdvanced.success('Care plan note saved', { duration: 1800, theme: 'light' })}
          >
            Save Note
          </Button>
        </Flex>
      </Box>
    </Grid>
  );
}

export const EnterpriseClinicalOps = EnterpriseClinicalAccordion;
`,F=`import React from 'react';
import {
  Alert,
  AppHeader,
  Badge,
  Box,
  Breadcrumb,
  Combobox,
  DataTable,
  Drawer,
  EmptyState,
  Flex,
  Field,
  Grid,
  Select,
  Sidebar,
  Skeleton,
  Textarea,
  ThemeProvider
} from '@editora/ui-react';

const lightTokens = {
  colors: {
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    foregroundOnPrimary: '#ffffff',
    background: '#f8fafc',
    surface: '#ffffff',
    surfaceAlt: '#f1f5f9',
    text: '#0f172a',
    muted: '#475569',
    border: 'rgba(15, 23, 42, 0.18)',
    focusRing: '#2563eb',
    success: '#15803d',
    warning: '#b45309',
    danger: '#b91c1c'
  },
  motion: { durationShort: '0ms', durationBase: '0ms', durationLong: '0ms' }
};

const darkTokens = {
  colors: {
    primary: '#60a5fa',
    primaryHover: '#93c5fd',
    foregroundOnPrimary: '#0b1220',
    background: '#020617',
    surface: '#0f172a',
    surfaceAlt: '#1e293b',
    text: '#e2e8f0',
    muted: '#94a3b8',
    border: 'rgba(148, 163, 184, 0.34)',
    focusRing: '#93c5fd',
    success: '#4ade80',
    warning: '#facc15',
    danger: '#f87171'
  },
  motion: { durationShort: '0ms', durationBase: '0ms', durationLong: '0ms' }
};

const highContrastTokens = {
  colors: {
    primary: '#0033ff',
    primaryHover: '#001fd1',
    foregroundOnPrimary: '#ffffff',
    background: '#ffffff',
    surface: '#ffffff',
    surfaceAlt: '#ffffff',
    text: '#000000',
    muted: '#111111',
    border: '#000000',
    focusRing: '#ff0080',
    success: '#006100',
    warning: '#7a4a00',
    danger: '#a30000'
  },
  shadows: { sm: 'none', md: 'none' },
  motion: { durationShort: '0ms', durationBase: '0ms', durationLong: '0ms' }
};

const users = [
  { name: 'Ava Johnson', role: 'Admin', status: 'Active', usage: '82%' },
  { name: 'Liam Carter', role: 'Manager', status: 'Invited', usage: '46%' },
  { name: 'Mia Chen', role: 'Editor', status: 'Suspended', usage: '13%' }
];

function tone(status: string): 'success' | 'warning' | 'danger' {
  if (status === 'Active') return 'success';
  if (status === 'Invited') return 'warning';
  return 'danger';
}

function SnapshotPanel({
  title,
  tokens
}: {
  title: string;
  tokens: any;
}) {
  return (
    <ThemeProvider tokens={tokens}>
      <section
        style={{
          border: '1px solid var(--ui-color-border)',
          borderRadius: 14,
          background: 'var(--ui-color-background)',
          color: 'var(--ui-color-text)',
          padding: 14,
          display: 'grid',
          gap: 12
        }}
      >
        <h3 style={{ margin: 0, fontSize: 15 }}>{title}</h3>

        <Alert
          tone="info"
          title="System notice"
          description="Theme parity baseline for visual snapshots."
          variant="soft"
        />

        <AppHeader bordered dense showMenuButton>
          <Box slot="start" style={{ fontWeight: 700 }}>Editora</Box>
          <div slot="title">Admin</div>
        </AppHeader>

        <Sidebar value="dashboard" collapsible style={{ height: 188 }}>
          <div slot="item" data-value="dashboard" data-icon="🏠" data-active>Dashboard</div>
          <div slot="item" data-value="users" data-icon="👥">Users</div>
          <div slot="item" data-value="reports" data-icon="📊">Reports</div>
        </Sidebar>

        <Breadcrumb separator="/" maxItems={5}>
          <span slot="item">Workspace</span>
          <span slot="item">Admin</span>
          <span slot="item">Users</span>
        </Breadcrumb>

        <Flex style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Badge tone="info" text="Info" />
          <Badge tone="success" text="Success" />
          <Badge tone="warning" text="Warning" />
          <Badge tone="danger" text="Danger" />
        </Flex>

        <DataTable sortable striped hover page={1} pageSize={6}>
          <table>
            <thead>
              <tr>
                <th data-key="name">Name</th>
                <th data-key="role">Role</th>
                <th data-key="status">Status</th>
                <th data-key="usage">Usage</th>
              </tr>
            </thead>
            <tbody>
              {users.map((row) => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  <td>{row.role}</td>
                  <td>
                    <Badge tone={tone(row.status)} variant="soft" size="sm">
                      {row.status}
                    </Badge>
                  </td>
                  <td>{row.usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DataTable>

        <Skeleton variant="text" count={3} />

        <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
          <Select value="review">
            <option value="draft">Draft</option>
            <option value="review">Review</option>
            <option value="published">Published</option>
          </Select>
          <Combobox value="engineering" placeholder="Select team..." clearable>
            <option value="design">Design</option>
            <option value="engineering">Engineering</option>
            <option value="product">Product</option>
          </Combobox>
        </Grid>

        <Field label="Notes" description="Contrast baseline on field + textarea.">
          <Textarea value="Ready for release candidate." rows={3} />
        </Field>

        <Box style={{ position: 'relative', height: 148, border: '1px solid var(--ui-color-border)', borderRadius: 12, overflow: 'hidden' }}>
          <Drawer
            open
            dismissible
            side="right"
            style={{
              position: 'absolute',
              inset: 0,
              ['--ui-drawer-transition' as any]: '0ms',
              ['--ui-drawer-width' as any]: 'min(220px, 74vw)',
              ['--ui-drawer-height' as any]: 'min(140px, 72vh)'
            }}
            onChange={() => {}}
          >
            <Box slot="header" style={{ fontWeight: 600 }}>Filters</Box>
            <Box style={{ fontSize: 12 }}>Owner: Engineering</Box>
          </Drawer>
        </Box>

        <EmptyState
          compact
          title="No archived rows"
          description="Archive items to verify empty-state visuals."
          actionLabel="Open filters"
        />
      </section>
    </ThemeProvider>
  );
}

export default {
  title: 'QA/Admin Visual Regression',
  parameters: {
    themeSwitcher: {
      disable: true
    },
    layout: 'fullscreen',
    chromatic: {
      pauseAnimationAtEnd: true
    }
  }
};

export const LightDarkHighContrastMatrix = () => (
  <Box
    style={{
      background: 'linear-gradient(145deg, #e2e8f0 0%, #f8fafc 58%, #ffffff 100%)',
      minHeight: '100vh',
      padding: 20
    }}
  >
    <Grid
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 14
      }}
    >
      <SnapshotPanel title="Light Baseline" tokens={lightTokens} />
      <SnapshotPanel title="Dark Baseline" tokens={darkTokens} />
      <SnapshotPanel title="High Contrast Baseline" tokens={highContrastTokens} />
    </Grid>
  </Box>
);
`,E=`import React from 'react';
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
              Enterprise alert patterns powered by \`ui-core\` and wrapped by \`ui-react\`.
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
`,D=`import React from 'react';
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
          toastAdvanced.warning(\`Shutdown initiated (\${detail.inputValue || 'no-code'})\`, { duration: 1900, theme: 'light' });
          setLastEvent(\`confirm:critical checked=\${String(detail.checked)}\`);
        }}
        onCancel={() => {
          toastAdvanced.info('Critical shutdown canceled', { duration: 1400, theme: 'light' });
          setLastEvent('cancel:critical');
        }}
        onDismiss={(detail) => {
          toastAdvanced.info(\`Critical dialog dismissed via \${detail.source}\`, { duration: 1400, theme: 'light' });
          setLastEvent(\`dismiss:critical:\${detail.source}\`);
        }}
        onClose={(detail) => {
          setOpenCritical(false);
          setLastEvent(\`close:critical:\${detail.action}\${detail.source ? \`:\${detail.source}\` : ''}\`);
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
          setLastEvent(\`confirm:policy checked=\${String(detail.checked)}\`);
        }}
        onCancel={() => {
          toastAdvanced.info('Policy review deferred', { duration: 1400, theme: 'light' });
          setLastEvent('cancel:policy');
        }}
        onDismiss={(detail) => {
          toastAdvanced.info(\`Policy dialog dismissed via \${detail.source}\`, { duration: 1400, theme: 'light' });
          setLastEvent(\`dismiss:policy:\${detail.source}\`);
        }}
        onClose={(detail) => {
          setOpenReview(false);
          setLastEvent(\`close:policy:\${detail.action}\${detail.source ? \`:\${detail.source}\` : ''}\`);
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

export const EnterpriseIncidentResponse = EnterpriseIncidentFlow;

`,G=`import React from 'react';
import { AlertDialogProvider, Box, Button, Flex, useAlertDialog } from '@editora/ui-react';

export default {
  title: 'UI/AlertDialogPromise'
};

const promiseApiSource = \`import React from 'react';
import { AlertDialogProvider, Box, Button, Flex, useAlertDialog } from '@editora/ui-react';

function PromiseActions() {
  const dialogs = useAlertDialog();
  const [result, setResult] = React.useState('No result yet');

  const runAlert = async () => {
    const next = await dialogs.alert({
      title: 'Maintenance complete',
      description: 'Your deployment finished successfully.',
      confirmText: 'Great',
      mode: 'queue'
    });
    setResult(JSON.stringify(next));
  };

  return (
    <Box>
      <Flex gap="10px" wrap="wrap">
        <Button onClick={runAlert}>Run Alert</Button>
      </Flex>
      <Box mt="14px">Result: {result}</Box>
    </Box>
  );
}

export function AlertDialogPromiseExample() {
  return (
    <AlertDialogProvider>
      <PromiseActions />
    </AlertDialogProvider>
  );
}\`;

function PromiseDemo() {
  const dialogs = useAlertDialog();
  const [result, setResult] = React.useState('No result yet');

  const runAlert = async () => {
    const next = await dialogs.alert({
      title: 'Maintenance complete',
      description: 'Your deployment finished successfully.',
      confirmText: 'Great',
      mode: 'queue'
    });
    setResult(JSON.stringify(next));
  };

  const runConfirm = async () => {
    const next = await dialogs.confirm({
      title: 'Delete customer account?',
      description: 'This cannot be undone and will remove all related records.',
      confirmText: 'Delete',
      cancelText: 'Keep',
      mode: 'replace',
      onConfirm: async () => {
        await new Promise((resolve) => setTimeout(resolve, 700));
      }
    });
    setResult(JSON.stringify(next));
  };

  const runPrompt = async () => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);

    const next = await dialogs.prompt({
      title: 'Rename workspace',
      description: 'Use 3+ characters. This demonstrates validation + async confirm.',
      confirmText: 'Save',
      cancelText: 'Cancel',
      input: {
        label: 'Workspace name',
        placeholder: 'e.g. Northwind Ops',
        required: true,
        validate: (value: string) => {
          if (value.trim().length < 3) return 'Use at least 3 characters.';
          return null;
        }
      },
      signal: controller.signal,
      onConfirm: async ({ value }) => {
        await new Promise((resolve) => setTimeout(resolve, 900));
        if (value?.toLowerCase() === 'error') {
          throw new Error('"error" is reserved. Use another name.');
        }
      }
    });

    window.clearTimeout(timeout);
    setResult(JSON.stringify(next));
  };

  return (
    <Box>
      <Flex gap="10px" wrap="wrap">
        <Button onClick={runAlert}>Run Alert</Button>
        <Button variant="secondary" onClick={runConfirm}>Run Confirm</Button>
        <Button variant="ghost" onClick={runPrompt}>Run Prompt</Button>
      </Flex>
      <Box mt="14px">Result: {result}</Box>
    </Box>
  );
}

export const PromiseAPI = () => (
  <AlertDialogProvider>
    <PromiseDemo />
  </AlertDialogProvider>
);

PromiseAPI.parameters = {
  docs: {
    source: {
      type: 'code',
      code: promiseApiSource
    }
  }
};
`,M=`import React from 'react';
import type { Meta } from '@storybook/react';
import { AppHeader, Box, Button, Drawer, Flex, Grid, Sidebar } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import {
  BellIcon,
  ClockIcon,
  MenuIcon,
  SearchIcon,
  ShieldIcon,
} from '@editora/react-icons';
import '../../packages/editora-toast/src/toast.css';
import '@editora/themes/themes/default.css';

const meta: Meta<typeof AppHeader> = {
  title: 'UI/AppHeader',
  component: AppHeader,
};

export default meta;

function EnterpriseOpsHeader() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [active, setActive] = React.useState('dashboard');

  return (
    <Grid style={{ gap: 12, minHeight: 420 }}>
      <Box
        style={{
          border: '1px solid var(--ui-color-border, #d8e1ec)',
          borderRadius: 16,
          overflow: 'hidden',
          background: 'var(--ui-color-surface, #fff)',
        }}
      >
        <AppHeader
          sticky
          bordered
          showMenuButton
          onMenuTrigger={() => {
            setMenuOpen(true);
            toastAdvanced.info('Navigation opened', { duration: 1200, theme: 'light' });
          }}
          style={
            {
              '--ui-app-header-height': '66px',
              '--ui-app-header-shadow': '0 1px 2px rgba(15, 23, 42, 0.06), 0 18px 30px rgba(15, 23, 42, 0.08)',
            } as React.CSSProperties
          }
        >
          <Flex slot="start" align="center" style={{ gap: 8 }}>
            <Box
              style={{
                width: 28,
                height: 28,
                borderRadius: 9,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'color-mix(in srgb, var(--ui-color-primary, #2563eb) 12%, transparent)',
                color: 'var(--ui-color-primary, #2563eb)',
              }}
            >
              <ShieldIcon size={15} />
            </Box>
            <Box style={{ fontWeight: 700, fontSize: 14 }}>Editora CareOps</Box>
          </Flex>

          <Flex slot="center" align="center" style={{ gap: 8, color: 'var(--ui-color-muted, #64748b)', fontSize: 12 }}>
            <ClockIcon size={14} />
            Live monitoring
          </Flex>
          <Box slot="title">Hospital Command Center</Box>
          <Box slot="subtitle">Shift A / North Campus</Box>

          <Flex slot="end" align="center" style={{ gap: 8 }}>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => toastAdvanced.info('Search shortcuts opened', { duration: 1200, theme: 'light' })}
            >
              <SearchIcon size={14} />
              Search
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => toastAdvanced.warning('2 critical alerts require acknowledgment', { duration: 1600, theme: 'light' })}
            >
              <BellIcon size={14} />
              Alerts
            </Button>
          </Flex>
        </AppHeader>

        <Box style={{ padding: 16, minHeight: 300, background: 'var(--ui-color-surface-alt, #f8fafc)' }}>
          <Box style={{ fontWeight: 700, fontSize: 16 }}>Current View: {active}</Box>
          <Box style={{ marginTop: 6, color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>
            Enterprise app header supports sticky layout, status context, and fast operations.
          </Box>
        </Box>
      </Box>

      <Drawer open={menuOpen} side="left" dismissible onChange={setMenuOpen}>
        <Flex slot="header" align="center" style={{ gap: 8, fontWeight: 700 }}>
          <MenuIcon size={14} />
          Navigation
        </Flex>
        <Sidebar
          value={active}
          onSelect={(detail) => {
            setActive(detail.value);
            setMenuOpen(false);
            toastAdvanced.success(\`Switched to \${detail.value}\`, { duration: 1200, theme: 'light' });
          }}
        >
          <Box slot="item" data-value="dashboard" data-icon="🏥" data-active>Dashboard</Box>
          <Box slot="item" data-value="patients" data-icon="🩺">Patients</Box>
          <Box slot="item" data-value="staff" data-icon="👥">Staffing</Box>
          <Box slot="item" data-value="billing" data-icon="💳">Billing</Box>
        </Sidebar>
      </Drawer>
    </Grid>
  );
}

export const EnterpriseCommandCenter = EnterpriseOpsHeader;

`,O=`import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { EditoraEditor } from "@editora/react";
import "@editora/themes/themes/default.css";
import "@editora/themes/themes/dark.css";
import {
  ApprovalWorkflowPlugin,
  BoldPlugin,
  HeadingPlugin,
  HistoryPlugin,
  ItalicPlugin,
  LinkPlugin,
  ListPlugin,
  TrackChangesPlugin,
  UnderlinePlugin,
} from "@editora/plugins";
import { Box, Grid } from "@editora/ui-react";

type WorkflowEventLog = {
  source: string;
  type: string;
  status: string;
  locked: boolean;
  comments: number;
  signoffs: number;
  time: string;
};

const meta: Meta = {
  title: "Editor/Plugins/Approval Workflow Scenario",
  parameters: {
    layout: "padded",
    docs: {
      source: {
        type: "code",
      },
      description: {
        component:
          "Scenario story for validating Approval Workflow in a realistic editorial process with required sign-off comments, lock-on-approval, and multi-instance checks.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function createScenarioPlugins(defaultActor: string) {
  return [
    HistoryPlugin(),
    HeadingPlugin(),
    BoldPlugin(),
    ItalicPlugin(),
    UnderlinePlugin(),
    ListPlugin(),
    LinkPlugin(),
    TrackChangesPlugin({
      author: defaultActor,
      enabledByDefault: true,
    }),
    ApprovalWorkflowPlugin({
      defaultStatus: "draft",
      lockOnApproval: true,
      requireCommentOnApprove: true,
      defaultActor,
    }),
  ];
}

export const PolicyMemoApprovalFlow: Story = {
  render: () => {
    const primaryWrapperRef = useRef<HTMLDivElement>(null);
    const secondaryWrapperRef = useRef<HTMLDivElement>(null);
    const [events, setEvents] = useState<WorkflowEventLog[]>([]);

    const primaryPlugins = useMemo(() => createScenarioPlugins("Policy Owner"), []);
    const secondaryPlugins = useMemo(
      () => [
        HistoryPlugin(),
        ApprovalWorkflowPlugin({
          defaultStatus: "draft",
          lockOnApproval: true,
          requireCommentOnApprove: true,
          defaultActor: "Secondary Owner",
        }),
      ],
      [],
    );

    useEffect(() => {
      const handler = (rawEvent: Event) => {
        const event = rawEvent as CustomEvent<{ state?: any }>;
        const state = event.detail?.state;
        if (!state) return;

        const target = event.target as Node | null;
        if (!target) return;

        let source = "";
        if (primaryWrapperRef.current?.contains(target)) source = "Primary Memo";
        if (secondaryWrapperRef.current?.contains(target)) source = "Secondary Memo";
        if (!source) return;

        const next: WorkflowEventLog = {
          source,
          type: event.type,
          status: String(state.status || "unknown"),
          locked: Boolean(state.locked),
          comments: Array.isArray(state.comments) ? state.comments.length : 0,
          signoffs: Array.isArray(state.signoffs) ? state.signoffs.length : 0,
          time: new Date().toLocaleTimeString(),
        };

        setEvents((prev) => [next, ...prev].slice(0, 12));
      };

      document.addEventListener("editora:approval-state-changed", handler as EventListener);
      document.addEventListener("editora:approval-state", handler as EventListener);

      return () => {
        document.removeEventListener("editora:approval-state-changed", handler as EventListener);
        document.removeEventListener("editora:approval-state", handler as EventListener);
      };
    }, []);

    return (
      <Grid style={{ display: "grid", gap: 16 }}>
        <Box style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 14, background: "#f8fafc" }}>
          <h3 style={{ margin: 0 }}>Dummy Scenario: Security Incident Customer Memo</h3>
          <p style={{ margin: "8px 0 12px", lineHeight: 1.45 }}>
            Validate Draft - Review - Approved lifecycle with mandatory approval comment and editor lock.
          </p>
          <ol style={{ margin: 0, paddingInlineStart: 20, display: "grid", gap: 6 }}>
            <li>Open workflow panel using Ctrl/Cmd + Alt + Shift + A.</li>
            <li>Add comment: Initial draft ready for review.</li>
            <li>Request review using toolbar button or Ctrl/Cmd + Alt + Shift + R.</li>
            <li>Try approve without comment. It should fail.</li>
            <li>Approve with comment and verify editor becomes read-only.</li>
            <li>Reopen draft with Ctrl/Cmd + Alt + Shift + D and confirm editing works again.</li>
            <li>Repeat actions in secondary editor to confirm state isolation.</li>
          </ol>
        </Box>

        <Grid style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
          <Grid style={{ display: "grid", gap: 16 }}>
            <div ref={primaryWrapperRef}>
              <EditoraEditor
                plugins={primaryPlugins}
                statusbar={{ enabled: true, position: "bottom" }}
                floatingToolbar={true}
                defaultValue={\`
                  <h2>Security Incident Customer Communication Memo</h2>
                  <p><strong>Owner:</strong> Content Lead | <strong>Audience:</strong> Enterprise Customers</p>
                  <h3>Summary</h3>
                  <p>A service disruption was detected on March 4, 2026. This memo outlines customer-facing messaging and next steps.</p>
                  <h3>Message Draft</h3>
                  <ul>
                    <li>Acknowledge the disruption and impact window.</li>
                    <li>Provide current mitigation status and next ETA checkpoint.</li>
                    <li>Include customer support channel and incident page link.</li>
                  </ul>
                  <p>Open Approval Workflow and follow the checklist above.</p>
                \`}
              />
            </div>

            <div ref={secondaryWrapperRef}>
              <EditoraEditor
                plugins={secondaryPlugins}
                statusbar={{ enabled: true, position: "bottom" }}
                floatingToolbar={true}
                defaultValue={\`
                  <h3>Secondary Memo (Instance Isolation Check)</h3>
                  <p>Use this editor to confirm approval state/comments do not leak from the primary memo.</p>
                \`}
              />
            </div>
          </Grid>

          <Box style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 12, background: "#ffffff" }}>
            <h4 style={{ margin: "0 0 8px" }}>Approval Event Log</h4>
            <p style={{ margin: "0 0 12px", fontSize: 12, color: "#475569" }}>
              Captures <code>editora:approval-state-changed</code> and <code>editora:approval-state</code>.
            </p>
            {events.length === 0 ? (
              <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>No approval events captured yet.</p>
            ) : (
              <ol style={{ margin: 0, paddingInlineStart: 18, display: "grid", gap: 8 }}>
                {events.map((entry, index) => (
                  <li key={\`\${entry.time}-\${index}\`} style={{ fontSize: 12, lineHeight: 1.4 }}>
                    [{entry.time}] {entry.source} | {entry.type} | status={entry.status} | locked=
                    {String(entry.locked)} | comments={entry.comments} | signoffs={entry.signoffs}
                  </li>
                ))}
              </ol>
            )}
          </Box>
        </Grid>
      </Grid>
    );
  },
};
`,L=`import React from 'react';
import type { Meta } from '@storybook/react';
import { AspectRatio, Box, Button, Flex, Grid } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import {
  CameraIcon,
  CheckCircleIcon,
  ImageIcon,
  PlayCircleIcon,
  SlidersIcon,
} from '@editora/react-icons';
import '../../packages/editora-toast/src/toast.css';
import '@editora/themes/themes/default.css';

const meta: Meta<typeof AspectRatio> = {
  title: 'UI/AspectRatio',
  component: AspectRatio,
};

export default meta;

function EnterpriseMediaCanvas() {
  const [ratio, setRatio] = React.useState<'16/9' | '4/3' | '1/1'>('16/9');
  const [fit, setFit] = React.useState<'cover' | 'contain'>('cover');

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
            <Box style={{ fontWeight: 700, fontSize: 18 }}>Media Composition Surface</Box>
            <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13, marginTop: 4 }}>
              Enterprise aspect-ratio layouts for thumbnails, previews, and campaign assets.
            </Box>
          </Box>
          <Flex align="center" style={{ gap: 8, color: 'var(--ui-color-muted, #64748b)', fontSize: 12 }}>
            <SlidersIcon size={14} />
            Ratio: {ratio} / Fit: {fit}
          </Flex>
        </Flex>
      </Box>

      <Flex style={{ gap: 8, flexWrap: 'wrap' }}>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setRatio('16/9');
            toastAdvanced.info('Canvas ratio set to 16:9', { duration: 1300, theme: 'light' });
          }}
        >
          16:9
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setRatio('4/3');
            toastAdvanced.info('Canvas ratio set to 4:3', { duration: 1300, theme: 'light' });
          }}
        >
          4:3
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setRatio('1/1');
            toastAdvanced.info('Canvas ratio set to 1:1', { duration: 1300, theme: 'light' });
          }}
        >
          1:1
        </Button>
        <Button
          size="sm"
          onClick={() => {
            const next = fit === 'cover' ? 'contain' : 'cover';
            setFit(next);
            toastAdvanced.success(\`Fit mode changed to \${next}\`, { duration: 1300, theme: 'light' });
          }}
        >
          Toggle Fit
        </Button>
      </Flex>

      <Grid style={{ gap: 12 }}>
        <AspectRatio ratio={ratio} fit={fit} tone="info" interactive showRatioBadge style={{ width: '100%' }}>
          <img
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1400&q=80"
            alt="Operations team reviewing clinical dashboards"
          />
        </AspectRatio>

        <Grid style={{ gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <AspectRatio ratio="1/1" tone="success" showRatioBadge style={{ width: '100%' }}>
            <Flex
              style={{
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                color: '#0f172a',
              }}
            >
              <CheckCircleIcon size={16} />
              Approved Thumbnail
            </Flex>
          </AspectRatio>

          <AspectRatio ratio="4/3" tone="warning" showRatioBadge style={{ width: '100%' }}>
            <Flex
              style={{
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                color: '#0f172a',
              }}
            >
              <CameraIcon size={16} />
              Capture Queue
            </Flex>
          </AspectRatio>

          <AspectRatio ratio="16/9" tone="danger" showRatioBadge style={{ width: '100%' }}>
            <Flex
              style={{
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                color: '#0f172a',
              }}
            >
              <PlayCircleIcon size={16} />
              Pending Review
            </Flex>
          </AspectRatio>
        </Grid>

        <AspectRatio ratio="21/9" tone="neutral" showRatioBadge style={{ width: '100%' }} />
      </Grid>

      <Flex justify="end" style={{ gap: 8, flexWrap: 'wrap' }}>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => toastAdvanced.info('Preview generated for content team', { duration: 1400, theme: 'light' })}
        >
          <ImageIcon size={14} />
          Generate Preview
        </Button>
        <Button size="sm" onClick={() => toastAdvanced.success('Media layout saved', { duration: 1400, theme: 'light' })}>
          Save Layout
        </Button>
      </Flex>
    </Grid>
  );
}

export const EnterpriseMediaOps = EnterpriseMediaCanvas;

`,_=`import React from 'react';
import type { Meta } from '@storybook/react';
import { Avatar, Box, Button, Flex, Grid } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import {
  ActivityIcon,
  BellIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldIcon,
} from '@editora/react-icons';
import '../../packages/editora-toast/src/toast.css';
import '@editora/themes/themes/default.css';

const meta: Meta<typeof Avatar> = {
  title: 'UI/Avatar',
  component: Avatar,
};

export default meta;

type Clinician = {
  id: string;
  name: string;
  role: string;
  status: 'online' | 'offline' | 'busy' | 'away';
  tone: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
  uiState?: 'idle' | 'loading' | 'error' | 'success';
  badge?: string;
  src?: string;
};

const clinicians: Clinician[] = [
  {
    id: 'dr-ava',
    name: 'Dr. Ava Singh',
    role: 'ICU Lead',
    status: 'online',
    tone: 'success',
    badge: '1',
    src: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    id: 'nurse-luca',
    name: 'Luca Chen',
    role: 'Charge Nurse',
    status: 'away',
    tone: 'warning',
    uiState: 'loading',
    badge: '2',
    src: 'https://randomuser.me/api/portraits/men/35.jpg',
  },
  {
    id: 'dr-omar',
    name: 'Dr. Omar Hale',
    role: 'Cardiology',
    status: 'busy',
    tone: 'danger',
    src: 'https://randomuser.me/api/portraits/men/48.jpg',
  },
  {
    id: 'ops-ria',
    name: 'Ria Patel',
    role: 'Operations',
    status: 'offline',
    tone: 'info',
    src: 'https://randomuser.me/api/portraits/women/52.jpg',
  },
  {
    id: 'fallback',
    name: 'Maya Thomas',
    role: 'Triage Coordinator',
    status: 'online',
    tone: 'neutral',
    uiState: 'error',
    src: 'https://example.invalid/avatar-not-found.png',
  },
];

function EnterpriseCareRoster() {
  const [selected, setSelected] = React.useState(clinicians[0]?.id || '');
  const selectedMember = clinicians.find((member) => member.id === selected) || clinicians[0];

  return (
    <Grid style={{ gap: 14, maxInlineSize: 980 }}>
      <Box
        style={{
          border: '1px solid var(--ui-color-border, #d8e1ec)',
          borderRadius: 16,
          padding: 16,
          background:
            'linear-gradient(136deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 7%, #fff) 0%, var(--ui-color-surface, #fff) 44%)',
        }}
      >
        <Flex align="center" justify="space-between" style={{ gap: 12, flexWrap: 'wrap' }}>
          <Box>
            <Box style={{ fontWeight: 700, fontSize: 18 }}>Clinical Presence Roster</Box>
            <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13, marginTop: 4 }}>
              Enterprise avatar system with status, badge counts, and quick escalation actions.
            </Box>
          </Box>
          <Flex align="center" style={{ gap: 8, color: 'var(--ui-color-muted, #64748b)', fontSize: 12 }}>
            <ClockIcon size={14} />
            Shift status: Live
          </Flex>
        </Flex>
      </Box>

      <Grid style={{ gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))' }}>
        {clinicians.map((member) => {
          const isActive = member.id === selected;
          return (
            <Box
              key={member.id}
              style={{
                border: isActive
                  ? '1px solid color-mix(in srgb, var(--ui-color-primary, #2563eb) 48%, transparent)'
                  : '1px solid var(--ui-color-border, #d8e1ec)',
                borderRadius: 14,
                padding: 12,
                background: 'var(--ui-color-surface, #fff)',
                boxShadow: isActive ? '0 10px 24px rgba(37, 99, 235, 0.14)' : '0 1px 2px rgba(15, 23, 42, 0.05)',
              }}
            >
              <Flex align="center" justify="space-between" style={{ gap: 10 }}>
                <Flex align="center" style={{ gap: 10, minWidth: 0 }}>
                  <Avatar
                    src={member.src}
                    alt={member.name}
                    size={50}
                    status={member.status}
                    tone={member.tone}
                    state={isActive ? 'success' : member.uiState}
                    badge={member.badge}
                    interactive
                    disabled={member.uiState === 'loading'}
                    ring={isActive}
                    variant={isActive ? 'solid' : 'soft'}
                    onClick={() => {
                      setSelected(member.id);
                      toastAdvanced.info(\`\${member.name} selected\`, { duration: 1300, theme: 'light' });
                    }}
                    onAvatarError={() =>
                      toastAdvanced.warning(\`\${member.name} profile image unavailable, showing initials\`, {
                        duration: 1700,
                        theme: 'light',
                      })
                    }
                  />
                  <Box style={{ minWidth: 0 }}>
                    <Box style={{ fontWeight: 650, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.name}</Box>
                    <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)', marginTop: 2 }}>{member.role}</Box>
                  </Box>
                </Flex>
                <Flex
                  align="center"
                  style={{
                    gap: 5,
                    fontSize: 11,
                    color: isActive ? 'var(--ui-color-primary, #2563eb)' : 'var(--ui-color-muted, #64748b)',
                  }}
                >
                  <ActivityIcon size={12} />
                  {member.status}
                </Flex>
              </Flex>
            </Box>
          );
        })}
      </Grid>

      <Box
        style={{
          border: '1px solid var(--ui-color-border, #d8e1ec)',
          borderRadius: 16,
          padding: 14,
          background: 'var(--ui-color-surface, #fff)',
        }}
      >
        <Flex justify="space-between" align="center" style={{ gap: 10, flexWrap: 'wrap' }}>
          <Flex align="center" style={{ gap: 8, fontSize: 14, fontWeight: 650 }}>
            <ShieldIcon size={15} />
            {selectedMember?.name || 'Clinician'} selected for escalation coverage
          </Flex>
          <Flex style={{ gap: 8, flexWrap: 'wrap' }}>
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                toastAdvanced.warning(\`Escalation ping sent to \${selectedMember?.name || 'clinician'}\`, {
                  duration: 1500,
                  theme: 'light',
                })
              }
            >
              <BellIcon size={14} />
              Notify
            </Button>
            <Button
              size="sm"
              onClick={() =>
                toastAdvanced.success(\`\${selectedMember?.name || 'Clinician'} assigned as response lead\`, {
                  duration: 1500,
                  theme: 'light',
                })
              }
            >
              <CheckCircleIcon size={14} />
              Assign Lead
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Grid>
  );
}

export const EnterpriseCareTeam = EnterpriseCareRoster;
`,W=`import React from 'react';
import type { Meta } from '@storybook/react';
import { Badge, Box, Button, Flex, Grid } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import {
  ActivityIcon,
  AlertTriangleIcon,
  BellIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldIcon,
  XCircleIcon,
} from '@editora/react-icons';
import '../../packages/editora-toast/src/toast.css';
import '@editora/themes/themes/default.css';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  argTypes: {
    text: { control: 'text' },
    tone: { control: { type: 'radio', options: ['neutral', 'info', 'success', 'warning', 'danger', 'purple'] } },
    variant: { control: { type: 'radio', options: ['solid', 'soft', 'outline', 'ghost'] } },
    size: { control: { type: 'radio', options: ['xs', 'sm', 'md', 'lg', 'xl', '1', '2', '3'] } },
    state: { control: { type: 'radio', options: ['idle', 'loading', 'error', 'success'] } },
    dot: { control: 'boolean' },
    interactive: { control: 'boolean' },
    removable: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;

type Filter = {
  id: string;
  text: string;
  tone: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
  icon: React.ReactNode;
  count: number;
};

const initialFilters: Filter[] = [
  { id: 'critical', text: 'Critical', tone: 'danger', icon: <AlertTriangleIcon size={12} />, count: 7 },
  { id: 'monitoring', text: 'Monitoring', tone: 'warning', icon: <ClockIcon size={12} />, count: 11 },
  { id: 'stable', text: 'Stable', tone: 'success', icon: <CheckCircleIcon size={12} />, count: 32 },
  { id: 'telemetry', text: 'Telemetry', tone: 'info', icon: <ActivityIcon size={12} />, count: 5 },
];

function EnterpriseCareBadges() {
  const [active, setActive] = React.useState('critical');
  const [filters, setFilters] = React.useState(initialFilters);

  return (
    <Grid style={{ gap: 14, maxInlineSize: 980 }}>
      <Box
        style={{
          border: '1px solid var(--ui-color-border, #d8e1ec)',
          borderRadius: 16,
          padding: 16,
          background:
            'linear-gradient(136deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 7%, #fff) 0%, var(--ui-color-surface, #fff) 44%)',
        }}
      >
        <Flex align="center" justify="space-between" style={{ gap: 12, flexWrap: 'wrap' }}>
          <Box>
            <Box style={{ fontWeight: 700, fontSize: 18 }}>Badge-Driven Triage Filters</Box>
            <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13, marginTop: 4 }}>
              Enterprise status pills with interactive selection, loading/error state feedback, and tag removal.
            </Box>
          </Box>
          <Flex align="center" style={{ gap: 8, color: 'var(--ui-color-muted, #64748b)', fontSize: 12 }}>
            <ShieldIcon size={14} />
            Ward Control / Shift-A
          </Flex>
        </Flex>
      </Box>

      <Box
        style={{
          border: '1px solid var(--ui-color-border, #d8e1ec)',
          borderRadius: 16,
          padding: 14,
          background: 'var(--ui-color-surface, #fff)',
          display: 'grid',
          gap: 10,
        }}
      >
        <Box style={{ fontSize: 13, color: 'var(--ui-color-muted, #64748b)' }}>Interactive Filter Chips</Box>
        <Flex style={{ gap: 8, flexWrap: 'wrap' }}>
          {filters.map((filter) => {
            const isActive = active === filter.id;
            return (
              <Badge
                key={filter.id}
                tone={filter.tone}
                variant={isActive ? 'solid' : 'soft'}
                interactive
                dot
                state={isActive ? 'success' : 'idle'}
                onClick={() => {
                  setActive(filter.id);
                  toastAdvanced.info(\`\${filter.text} filter activated\`, { duration: 1300, theme: 'light' });
                }}
              >
                <span slot="icon">{filter.icon}</span>
                {filter.text} ({filter.count})
              </Badge>
            );
          })}
          <Badge tone="warning" variant="outline" state="loading" dot>
            Syncing queue
          </Badge>
          <Badge tone="danger" variant="outline" state="error">
            <span slot="icon">
              <XCircleIcon size={12} />
            </span>
            Feed delayed
          </Badge>
        </Flex>
      </Box>

      <Box
        style={{
          border: '1px solid var(--ui-color-border, #d8e1ec)',
          borderRadius: 16,
          padding: 14,
          background: 'var(--ui-color-surface, #fff)',
          display: 'grid',
          gap: 10,
        }}
      >
        <Flex align="center" justify="space-between" style={{ gap: 8, flexWrap: 'wrap' }}>
          <Box style={{ fontSize: 13, color: 'var(--ui-color-muted, #64748b)' }}>Escalation Labels</Box>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setFilters(initialFilters);
              toastAdvanced.success('Escalation labels restored', { duration: 1400, theme: 'light' });
            }}
          >
            <BellIcon size={14} />
            Reset Labels
          </Button>
        </Flex>

        <Flex style={{ gap: 8, flexWrap: 'wrap' }}>
          {filters.map((filter) => (
            <Badge
              key={\`\${filter.id}-remove\`}
              tone={filter.tone}
              variant="outline"
              removable
              truncate
              maxWidth="18ch"
              onRemove={(detail) => {
                setFilters((previous) => previous.filter((item) => item.id !== filter.id));
                toastAdvanced.warning(\`\${detail.text} removed from dashboard\`, { duration: 1400, theme: 'light' });
              }}
            >
              <span slot="icon">{filter.icon}</span>
              {filter.text} Alert Routing Rule
            </Badge>
          ))}
        </Flex>
      </Box>
    </Grid>
  );
}

export const EnterpriseTriageOps = EnterpriseCareBadges;

const PlaygroundTemplate = (args: Record<string, unknown>) => <Badge {...args} />;

export const Playground = PlaygroundTemplate.bind({});
Playground.args = {
  text: 'Operations',
  tone: 'info',
  variant: 'soft',
  size: 'md',
  state: 'idle',
  dot: true,
  interactive: false,
  removable: false,
  disabled: false,
};
`,N=`import React from 'react';
import type { Meta } from '@storybook/react';
import { BlockControls, Box, Button, Flex, Grid } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  AlertTriangleIcon,
  BoldIcon,
  CheckCircleIcon,
  ClockIcon,
  CodeIcon,
  ItalicIcon,
  LinkIcon,
  ShieldIcon,
  SparklesIcon,
} from '@editora/react-icons';
import '../../packages/editora-toast/src/toast.css';
import '@editora/themes/themes/default.css';

const meta: Meta<typeof BlockControls> = {
  title: 'UI/BlockControls',
  component: BlockControls,
};

export default meta;

function EnterpriseClinicalComposerControls() {
  const [block, setBlock] = React.useState<'paragraph' | 'heading' | 'quote' | 'code'>('paragraph');
  const [align, setAlign] = React.useState<'left' | 'center' | 'right'>('left');
  const [bold, setBold] = React.useState(false);
  const [italic, setItalic] = React.useState(false);
  const [linking, setLinking] = React.useState(false);
  const [state, setState] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');

  const applyChange = (label: string, callback: () => void) => {
    callback();
    toastAdvanced.info(\`\${label} updated\`, { duration: 1200, theme: 'light' });
  };

  return (
    <Grid style={{ gap: 14, maxInlineSize: 1020 }}>
      <Box
        style={{
          border: '1px solid var(--ui-color-border, #d8e1ec)',
          borderRadius: 16,
          padding: 16,
          background:
            'linear-gradient(136deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 7%, #fff) 0%, var(--ui-color-surface, #fff) 44%)',
        }}
      >
        <Flex align="center" justify="space-between" style={{ gap: 12, flexWrap: 'wrap' }}>
          <Box>
            <Box style={{ fontWeight: 700, fontSize: 18 }}>Clinical Note Block Controls</Box>
            <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13, marginTop: 4 }}>
              Enterprise command strip for fast formatting, alignment, and assistive review actions.
            </Box>
          </Box>
          <Flex align="center" style={{ gap: 8, color: 'var(--ui-color-muted, #64748b)', fontSize: 12 }}>
            <ShieldIcon size={14} />
            Secure Shift Documentation
          </Flex>
        </Flex>
      </Box>

      <BlockControls
        ariaLabel="Clinical note formatting controls"
        variant="solid"
        tone={state === 'error' ? 'danger' : state === 'success' ? 'success' : 'info'}
        state={state}
        wrap
        onNavigate={(detail) => {
          if (detail.key === 'Home' || detail.key === 'End') {
            toastAdvanced.info(\`Navigation moved to control \${detail.toIndex + 1}/\${detail.total}\`, {
              duration: 1100,
              theme: 'light',
            });
          }
        }}
      >
        <Button
          size="sm"
          variant={block === 'paragraph' ? 'primary' : 'secondary'}
          onClick={() => applyChange('Paragraph block', () => setBlock('paragraph'))}
        >
          P
        </Button>
        <Button
          size="sm"
          variant={block === 'heading' ? 'primary' : 'secondary'}
          onClick={() => applyChange('Heading block', () => setBlock('heading'))}
        >
          H1
        </Button>
        <Button
          size="sm"
          variant={block === 'quote' ? 'primary' : 'secondary'}
          onClick={() => applyChange('Quote block', () => setBlock('quote'))}
        >
          "
        </Button>
        <Button
          size="sm"
          variant={block === 'code' ? 'primary' : 'secondary'}
          onClick={() => applyChange('Code block', () => setBlock('code'))}
        >
          <CodeIcon size={14} />
        </Button>

        <span data-separator aria-hidden="true" />

        <Button
          size="sm"
          variant={bold ? 'primary' : 'secondary'}
          onClick={() => applyChange('Bold', () => setBold((value) => !value))}
        >
          <BoldIcon size={14} />
        </Button>
        <Button
          size="sm"
          variant={italic ? 'primary' : 'secondary'}
          onClick={() => applyChange('Italic', () => setItalic((value) => !value))}
        >
          <ItalicIcon size={14} />
        </Button>
        <Button
          size="sm"
          variant={linking ? 'primary' : 'secondary'}
          onClick={() => applyChange('Clinical reference link', () => setLinking((value) => !value))}
        >
          <LinkIcon size={14} />
        </Button>

        <span data-separator aria-hidden="true" />

        <Button
          size="sm"
          variant={align === 'left' ? 'primary' : 'secondary'}
          onClick={() => applyChange('Align left', () => setAlign('left'))}
        >
          <AlignLeftIcon size={14} />
        </Button>
        <Button
          size="sm"
          variant={align === 'center' ? 'primary' : 'secondary'}
          onClick={() => applyChange('Align center', () => setAlign('center'))}
        >
          <AlignCenterIcon size={14} />
        </Button>
        <Button
          size="sm"
          variant={align === 'right' ? 'primary' : 'secondary'}
          onClick={() => applyChange('Align right', () => setAlign('right'))}
        >
          <AlignRightIcon size={14} />
        </Button>

        <span data-separator aria-hidden="true" />

        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setState('loading');
            toastAdvanced.info('Clinical AI review in progress', { duration: 1200, theme: 'light' });
            window.setTimeout(() => {
              setState('success');
              toastAdvanced.success('Safety suggestions applied', { duration: 1300, theme: 'light' });
            }, 900);
          }}
        >
          <SparklesIcon size={14} />
          Suggest
        </Button>
      </BlockControls>

      <Flex align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setState('idle');
            toastAdvanced.info('Controls returned to idle', { duration: 1100, theme: 'light' });
          }}
        >
          <ClockIcon size={14} />
          Idle
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setState('error');
            toastAdvanced.warning('Audit rule mismatch detected', { duration: 1400, theme: 'light' });
          }}
        >
          <AlertTriangleIcon size={14} />
          Simulate Error
        </Button>
        <Button
          size="sm"
          onClick={() => {
            setState('success');
            toastAdvanced.success('Documentation policy checks passed', { duration: 1400, theme: 'light' });
          }}
        >
          <CheckCircleIcon size={14} />
          Mark Success
        </Button>
      </Flex>

      <Box
        style={{
          border: '1px solid var(--ui-color-border, #d8e1ec)',
          borderRadius: 14,
          padding: 12,
          background: 'var(--ui-color-surface, #fff)',
          fontSize: 13,
          color: 'var(--ui-color-muted, #64748b)',
        }}
      >
        Active block: <strong>{block}</strong> | Alignment: <strong>{align}</strong> | State: <strong>{state}</strong> | Style:{' '}
        <strong>
          {bold ? 'Bold ' : ''}
          {italic ? 'Italic ' : ''}
          {linking ? 'Linked' : 'Unlinked'}
        </strong>
      </Box>
    </Grid>
  );
}

export const EnterpriseClinicalComposer = EnterpriseClinicalComposerControls;
`,V=`import React from 'react';
import type { Meta } from '@storybook/react';
import { Box, Button, Flex, Grid } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import {
  ActivityIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldIcon,
  SparklesIcon,
} from '@editora/react-icons';
import '../../packages/editora-toast/src/toast.css';
import '@editora/themes/themes/default.css';

const meta: Meta<typeof Box> = {
  title: 'UI/Box',
  component: Box,
  argTypes: {
    variant: { control: 'select', options: ['default', 'surface', 'elevated', 'outline', 'glass', 'gradient', 'soft', 'contrast'] },
    tone: { control: 'select', options: ['default', 'neutral', 'brand', 'info', 'success', 'warning', 'danger'] },
    state: { control: 'select', options: ['idle', 'loading', 'error', 'success'] },
    elevation: { control: 'select', options: ['default', 'none', 'low', 'high'] },
    radius: { control: 'select', options: ['default', 'none', 'sm', 'lg', 'xl'] },
    interactive: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;

function EnterpriseOperationsBoxes() {
  const [activeCard, setActiveCard] = React.useState<'triage' | 'bed' | 'audit'>('triage');
  const [state, setState] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');

  const cardStyle: React.CSSProperties = {
    padding: '16px',
    minHeight: '134px',
    display: 'grid',
    gap: '10px',
  };

  return (
    <Grid style={{ gap: 14, maxInlineSize: 1080 }}>
      <Box variant="gradient" tone="brand" radius="xl" p="16px">
        <Flex align="center" justify="space-between" style={{ gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>Hospital Operations Surface</div>
            <div style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13, marginTop: 4 }}>
              Enterprise layout primitives with responsive spacing, states, and interactive behavior.
            </div>
          </div>
          <Flex align="center" style={{ gap: 8, color: 'var(--ui-color-muted, #64748b)', fontSize: 12 }}>
            <ShieldIcon size={14} />
            Command Center / Shift-B
          </Flex>
        </Flex>
      </Box>

      <Grid style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))' }}>
        <Box
          variant={activeCard === 'triage' ? 'gradient' : 'surface'}
          tone="info"
          elevation="low"
          interactive
          style={cardStyle}
          onClick={() => {
            setActiveCard('triage');
            toastAdvanced.info('Triage queue card selected', { duration: 1200, theme: 'light' });
          }}
        >
          <Flex align="center" style={{ gap: 8 }}>
            <ActivityIcon size={16} />
            <strong>Triage Queue</strong>
          </Flex>
          <div style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>
            22 pending assessments, average wait 9 minutes.
          </div>
        </Box>

        <Box
          variant={activeCard === 'bed' ? 'gradient' : 'surface'}
          tone="success"
          elevation="low"
          interactive
          style={cardStyle}
          onClick={() => {
            setActiveCard('bed');
            toastAdvanced.success('Bed allocation card selected', { duration: 1200, theme: 'light' });
          }}
        >
          <Flex align="center" style={{ gap: 8 }}>
            <CheckCircleIcon size={16} />
            <strong>Bed Allocation</strong>
          </Flex>
          <div style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>
            94% occupancy, 4 discharge-ready patients.
          </div>
        </Box>

        <Box
          variant={activeCard === 'audit' ? 'gradient' : 'surface'}
          tone="warning"
          elevation="low"
          interactive
          style={cardStyle}
          onClick={() => {
            setActiveCard('audit');
            toastAdvanced.warning('Compliance audit card selected', { duration: 1200, theme: 'light' });
          }}
        >
          <Flex align="center" style={{ gap: 8 }}>
            <AlertTriangleIcon size={16} />
            <strong>Compliance Audit</strong>
          </Flex>
          <div style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>
            2 notes require signature validation.
          </div>
        </Box>
      </Grid>

      <Box variant="elevated" radius="lg" p="12px" style={{ display: 'grid', gap: 10 }}>
        <Flex align="center" justify="space-between" style={{ gap: 8, flexWrap: 'wrap' }}>
          <div style={{ fontWeight: 650 }}>State Simulation</div>
          <Flex style={{ gap: 8, flexWrap: 'wrap' }}>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setState('loading');
                toastAdvanced.info('Refreshing dashboard insights', { duration: 1200, theme: 'light' });
              }}
            >
              <ClockIcon size={14} />
              Loading
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setState('error');
                toastAdvanced.warning('Data sync delay detected', { duration: 1400, theme: 'light' });
              }}
            >
              <AlertTriangleIcon size={14} />
              Error
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setState('success');
                toastAdvanced.success('Dashboard synced successfully', { duration: 1400, theme: 'light' });
              }}
            >
              <SparklesIcon size={14} />
              Success
            </Button>
          </Flex>
        </Flex>

        <Box
          variant="outline"
          tone={state === 'error' ? 'danger' : state === 'success' ? 'success' : 'info'}
          state={state}
          p={{ initial: '12px', md: '16px' }}
          radius="lg"
        >
          <div style={{ fontSize: 13, color: 'var(--ui-color-muted, #64748b)' }}>
            Current state: <strong>{state}</strong>. This uses \`ui-box\` state visuals (\`loading\`, \`error\`, \`success\`) for real operational feedback.
          </div>
        </Box>
      </Box>
    </Grid>
  );
}

export const EnterpriseCareOps = EnterpriseOperationsBoxes;

const PlaygroundTemplate = (args: Record<string, unknown>) => (
  <Box p="16px" style={{ maxWidth: 460 }} {...args}>
    Modern \`ui-box\` visual mode with production interaction and state support.
  </Box>
);

export const Playground = PlaygroundTemplate.bind({});
Playground.args = {
  variant: 'surface',
  tone: 'default',
  state: 'idle',
  elevation: 'default',
  radius: 'default',
  interactive: false,
  disabled: false,
};
`,H=`import React from 'react';
import type { Meta } from '@storybook/react';
import { Box, Breadcrumb, Button, Flex, Grid } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import {
  CheckCircleIcon,
  ClipboardCheckIcon,
  HomeIcon,
  ShieldIcon,
  UsersIcon,
} from '@editora/react-icons';
import '../../packages/editora-toast/src/toast.css';
import '@editora/themes/themes/default.css';

const meta: Meta<typeof Breadcrumb> = {
  title: 'UI/Breadcrumb',
  component: Breadcrumb,
  argTypes: {
    separator: { control: 'text' },
    maxItems: { control: { type: 'number', min: 3, max: 10, step: 1 } },
    currentIndex: { control: { type: 'number', min: 0, max: 10, step: 1 } },
    size: { control: { type: 'radio', options: ['sm', 'md', 'lg'] } },
    variant: { control: { type: 'radio', options: ['default', 'solid', 'minimal'] } },
    tone: { control: { type: 'radio', options: ['neutral', 'info', 'success', 'warning', 'danger'] } },
    state: { control: { type: 'radio', options: ['idle', 'loading', 'error', 'success'] } },
    disabled: { control: 'boolean' },
  },
};

export default meta;

function EnterprisePatientJourneyBreadcrumb() {
  const [state, setState] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [currentIndex, setCurrentIndex] = React.useState(3);
  const steps = ['Home', 'Clinical', 'Inpatient', 'Patient 42019', 'Care Plan', 'Medication', 'Discharge'];

  const selectStep = (index: number, label: string, source: string) => {
    setCurrentIndex(index);
    toastAdvanced.info(\`\${label} opened via \${source}\`, { duration: 1300, theme: 'light' });
  };

  return (
    <Grid style={{ gap: 14, maxInlineSize: 1040 }}>
      <Box
        variant="gradient"
        tone="brand"
        radius="xl"
        p="16px"
        style={{ display: 'grid', gap: 10 }}
      >
        <Flex align="center" justify="space-between" style={{ gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>Patient Journey Navigation</div>
            <div style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13, marginTop: 4 }}>
              Enterprise breadcrumb for deep clinical routing with collapse logic and keyboard support.
            </div>
          </div>
          <Flex align="center" style={{ gap: 8, color: 'var(--ui-color-muted, #64748b)', fontSize: 12 }}>
            <ShieldIcon size={14} />
            Compliance Path Tracking
          </Flex>
        </Flex>
      </Box>

      <Breadcrumb
        ariaLabel="Patient journey breadcrumb"
        maxItems={5}
        currentIndex={currentIndex}
        size="lg"
        variant="solid"
        tone={state === 'error' ? 'danger' : state === 'success' ? 'success' : 'info'}
        state={state}
        separator="/"
        onSelect={(detail) => selectStep(detail.index, detail.label || steps[detail.index] || 'step', detail.source || 'click')}
      >
        <span slot="item" data-label="Home">
          <HomeIcon size={13} style={{ marginInlineEnd: 4 }} />
          Home
        </span>
        <span slot="item" data-label="Clinical Workspace">
          <UsersIcon size={13} style={{ marginInlineEnd: 4 }} />
          Clinical
        </span>
        <span slot="item">Inpatient</span>
        <span slot="item">Patient 42019</span>
        <span slot="item">Care Plan</span>
        <span slot="item">Medication</span>
        <span slot="item">Discharge</span>
      </Breadcrumb>

      <Flex align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setState('loading');
            toastAdvanced.info('Resolving route permissions', { duration: 1200, theme: 'light' });
          }}
        >
          <ClipboardCheckIcon size={14} />
          Loading
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setState('error');
            toastAdvanced.warning('Navigation permission denied on selected route', { duration: 1500, theme: 'light' });
          }}
        >
          Set Error
        </Button>
        <Button
          size="sm"
          onClick={() => {
            setState('success');
            toastAdvanced.success('Route validation passed', { duration: 1300, theme: 'light' });
          }}
        >
          <CheckCircleIcon size={14} />
          Set Success
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setState('idle');
            toastAdvanced.info('Breadcrumb reset to idle', { duration: 1100, theme: 'light' });
          }}
        >
          Reset
        </Button>
      </Flex>
    </Grid>
  );
}

export const EnterpriseClinicalJourney = EnterprisePatientJourneyBreadcrumb;

const PlaygroundTemplate = (args: Record<string, unknown>) => (
  <Breadcrumb {...args}>
    <span slot="item">Dashboard</span>
    <span slot="item">Patients</span>
    <span slot="item">Ward A</span>
    <span slot="item">Details</span>
  </Breadcrumb>
);

export const Playground = PlaygroundTemplate.bind({});
Playground.args = {
  separator: '/',
  maxItems: 6,
  currentIndex: 3,
  size: 'md',
  variant: 'default',
  tone: 'info',
  state: 'idle',
  disabled: false,
};
`,U=`import React from 'react';
import type { Meta } from '@storybook/react';
import { Box, Button, Flex, Grid } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  ClipboardCheckIcon,
  RefreshCwIcon,
  SaveIcon,
  ShieldIcon,
  XIcon,
} from '@editora/react-icons';
import '../../packages/editora-toast/src/toast.css';
import '@editora/themes/themes/default.css';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  argTypes: {
    variant: { control: { type: 'radio', options: ['primary', 'secondary', 'ghost', 'danger', 'success', 'warning'] } },
    size: { control: { type: 'radio', options: ['sm', 'md', 'lg'] } },
    state: { control: { type: 'radio', options: ['idle', 'loading', 'error', 'success'] } },
    tone: { control: { type: 'radio', options: ['neutral', 'info', 'success', 'warning', 'danger'] } },
    theme: { control: { type: 'radio', options: ['default', 'dark', 'brand'] } },
    animation: { control: { type: 'radio', options: ['scale', 'pulse', 'none'] } },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    block: { control: 'boolean' },
    headless: { control: 'boolean' },
    type: { control: { type: 'radio', options: ['button', 'submit', 'reset'] } },
  },
};

export default meta;

function EnterpriseClinicalActions() {
  const [saving, setSaving] = React.useState(false);
  const [publishState, setPublishState] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');

  const runSave = () => {
    setSaving(true);
    toastAdvanced.info('Saving treatment plan draft...', { duration: 1000, theme: 'light' });
    window.setTimeout(() => {
      setSaving(false);
      toastAdvanced.success('Draft saved for review', { duration: 1300, theme: 'light' });
    }, 900);
  };

  const runPublish = () => {
    setPublishState('loading');
    toastAdvanced.info('Running final compliance checks...', { duration: 1000, theme: 'light' });
    window.setTimeout(() => {
      const fail = Math.random() < 0.35;
      if (fail) {
        setPublishState('error');
        toastAdvanced.error('Publish blocked: unresolved allergy warning', { duration: 1600, theme: 'light' });
      } else {
        setPublishState('success');
        toastAdvanced.success('Care plan published successfully', { duration: 1400, theme: 'light' });
      }
    }, 1200);
  };

  return (
    <Grid style={{ gap: 16, maxInlineSize: 980 }}>
      <Box variant="gradient" tone="brand" radius="xl" p="16px" style={{ display: 'grid', gap: 12 }}>
        <Flex align="center" justify="space-between" style={{ gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>Clinical Action Controls</div>
            <div style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13, marginTop: 4 }}>
              High-trust button system for save, verify, publish, and escalation flows.
            </div>
          </div>
          <Flex align="center" style={{ gap: 8, color: 'var(--ui-color-muted, #64748b)', fontSize: 12 }}>
            <ShieldIcon size={14} />
            Audit-Safe Operations
          </Flex>
        </Flex>
      </Box>

      <Flex align="center" style={{ gap: 12, flexWrap: 'wrap' }}>
        <Button
          variant="primary"
          size="lg"
          loading={saving}
          startIcon={<SaveIcon size={14} />}
          loadingLabel="Saving treatment plan"
          onClick={runSave}
        >
          Save Draft
        </Button>

        <Button
          variant="secondary"
          size="lg"
          startIcon={<ClipboardCheckIcon size={14} />}
          endIcon={<RefreshCwIcon size={14} />}
          onClick={() => toastAdvanced.info('Validation queue updated', { duration: 1100, theme: 'light' })}
        >
          Re-Validate
        </Button>

        <Button
          variant={publishState === 'error' ? 'danger' : publishState === 'success' ? 'success' : 'primary'}
          state={publishState}
          tone={publishState === 'error' ? 'danger' : publishState === 'success' ? 'success' : 'info'}
          size="lg"
          startIcon={publishState === 'error' ? <AlertTriangleIcon size={14} /> : <CheckCircleIcon size={14} />}
          loadingLabel="Publishing care plan"
          onClick={runPublish}
        >
          Publish Plan
        </Button>

        <Button
          variant="ghost"
          size="lg"
          startIcon={<XIcon size={14} />}
          onClick={() => toastAdvanced.warning('Escalation note created for supervisor review', { duration: 1500, theme: 'light' })}
        >
          Escalate
        </Button>
      </Flex>
    </Grid>
  );
}

export const EnterpriseWorkflow = EnterpriseClinicalActions;

const PlaygroundTemplate = (args: Record<string, unknown>) => (
  <Button {...args} startIcon={<SaveIcon size={14} />} endIcon={<CheckCircleIcon size={14} />}>
    Save Changes
  </Button>
);

export const Playground = PlaygroundTemplate.bind({});
Playground.args = {
  variant: 'primary',
  size: 'md',
  state: 'idle',
  tone: 'info',
  theme: 'default',
  animation: 'scale',
  disabled: false,
  loading: false,
  block: false,
  headless: false,
  type: 'button',
};
`,q=`import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge, Box, Button, Calendar, Flex, Grid } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import {
  AlertTriangleIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClipboardCheckIcon,
  RefreshCwIcon,
  ShieldIcon,
} from '@editora/react-icons';
import '../../packages/editora-toast/src/toast.css';
import '@editora/themes/themes/default.css';

const meta: Meta<typeof Calendar> = {
  title: 'UI/Calendar',
  component: Calendar,
  argTypes: {
    selection: { control: { type: 'radio', options: ['single', 'range', 'multiple'] } },
    size: { control: { type: 'radio', options: ['sm', 'md', 'lg'] } },
    state: { control: { type: 'radio', options: ['idle', 'loading', 'error', 'success'] } },
    tone: { control: { type: 'radio', options: ['neutral', 'info', 'success', 'warning', 'danger'] } },
    eventsDisplay: { control: { type: 'radio', options: ['dots', 'badges', 'count'] } },
    outsideClick: { control: { type: 'radio', options: ['none', 'navigate', 'select'] } },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    bare: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

const hospitalEvents = [
  { date: '2026-03-05', title: 'ICU handover', tone: 'info' as const },
  { date: '2026-03-06', title: 'Medication audit', tone: 'warning' as const },
  { date: '2026-03-09', title: 'Surgery board', tone: 'success' as const },
  { date: '2026-03-09', title: 'Insurance review', tone: 'default' as const },
  { date: '2026-03-13', title: 'Emergency drill', tone: 'danger' as const },
  { date: '2026-03-18', title: 'Radiology sync', tone: 'info' as const },
  { date: '2026-03-22', title: 'Discharge planning', tone: 'success' as const },
  { date: '2026-03-26', title: 'Pharmacy restock', tone: 'warning' as const },
];

function parseYearMonth(iso: string): { year: number; month: number } | null {
  const match = /^(\\d{4})-(\\d{2})-\\d{2}$/.exec((iso || '').trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) return null;
  return { year, month };
}

function EnterpriseClinicalCalendar() {
  const [state, setState] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [value, setValue] = React.useState('2026-03-09');
  const [view, setView] = React.useState({ year: 2026, month: 3 });

  return (
    <Grid style={{ gap: 16, maxInlineSize: 1040 }}>
      <Box variant="gradient" tone="brand" radius="xl" p="16px" style={{ display: 'grid', gap: 10 }}>
        <Flex align="center" justify="space-between" style={{ gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>Clinical Scheduling Calendar</div>
            <div style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13, marginTop: 4 }}>
              Enterprise-grade calendar for capacity planning, compliance checks, and daily operation routing.
            </div>
          </div>
          <Flex align="center" style={{ gap: 8, color: 'var(--ui-color-muted, #64748b)', fontSize: 12 }}>
            <ShieldIcon size={14} />
            HIPAA-aware Workflow
          </Flex>
        </Flex>
      </Box>

      <Calendar
        year={view.year}
        month={view.month}
        value={value}
        events={hospitalEvents}
        selection="single"
        eventsDisplay="badges"
        eventsMax={2}
        state={state}
        tone={state === 'error' ? 'danger' : state === 'success' ? 'success' : 'info'}
        ariaLabel="Hospital schedule calendar"
        onSelect={(detail) => {
          setValue(detail.value);
          const nextView = parseYearMonth(detail.value);
          if (nextView) setView(nextView);
          toastAdvanced.info(\`Selected \${detail.value}\`, { duration: 1000, theme: 'light' });
        }}
        onMonthChange={(detail) => {
          setView({ year: detail.year, month: detail.month });
          toastAdvanced.info(\`Navigated to \${detail.year}-\${String(detail.month).padStart(2, '0')}\`, {
            duration: 900,
            theme: 'light',
          });
        }}
      />

      <Flex align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
        <Badge tone="brand">
          <CalendarIcon size={12} />
          {value}
        </Badge>
        <Button
          size="sm"
          variant="secondary"
          startIcon={<RefreshCwIcon size={14} />}
          onClick={() => {
            setState('loading');
            toastAdvanced.loading('Syncing calendar events...', { duration: 900, theme: 'light' });
            window.setTimeout(() => setState('idle'), 900);
          }}
        >
          Sync
        </Button>
        <Button
          size="sm"
          variant="secondary"
          startIcon={<AlertTriangleIcon size={14} />}
          onClick={() => {
            setState('error');
            toastAdvanced.error('Scheduling feed unavailable', { duration: 1300, theme: 'light' });
          }}
        >
          Simulate Error
        </Button>
        <Button
          size="sm"
          variant="secondary"
          startIcon={<CheckCircleIcon size={14} />}
          onClick={() => {
            setState('success');
            toastAdvanced.success('Schedule synced successfully', { duration: 1300, theme: 'light' });
          }}
        >
          Mark Synced
        </Button>
        <Button
          size="sm"
          startIcon={<ClipboardCheckIcon size={14} />}
          onClick={() => {
            setState('idle');
            toastAdvanced.info('State reset', { duration: 900, theme: 'light' });
          }}
        >
          Reset
        </Button>
      </Flex>
    </Grid>
  );
}

const enterpriseScheduleSource = \`import { Badge, Box, Button, Calendar, Flex, Grid } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import { AlertTriangleIcon, CalendarIcon, CheckCircleIcon, RefreshCwIcon } from '@editora/react-icons';

const hospitalEvents = [
  { date: '2026-03-05', title: 'ICU handover', tone: 'info' },
  { date: '2026-03-09', title: 'Surgery board', tone: 'success' },
];

export function EnterpriseScheduleCalendar() {
  const [value, setValue] = React.useState('2026-03-09');
  const [view, setView] = React.useState({ year: 2026, month: 3 });
  const [state, setState] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');

  return (
    <Grid style={{ gap: 16, maxInlineSize: 1040 }}>
      <Calendar
        year={view.year}
        month={view.month}
        value={value}
        events={hospitalEvents}
        selection="single"
        eventsDisplay="badges"
        state={state}
        onSelect={(detail) => {
          setValue(detail.value);
          toastAdvanced.info(\\\`Selected \\\${detail.value}\\\`);
        }}
        onMonthChange={(detail) => setView({ year: detail.year, month: detail.month })}
        ariaLabel="Hospital schedule calendar"
      />
      <Flex style={{ gap: 8 }}>
        <Badge tone="brand"><CalendarIcon size={12} />{value}</Badge>
        <Button size="sm" variant="secondary" startIcon={<RefreshCwIcon size={14} />} onClick={() => setState('loading')}>Sync</Button>
        <Button size="sm" variant="secondary" startIcon={<AlertTriangleIcon size={14} />} onClick={() => setState('error')}>Simulate Error</Button>
        <Button size="sm" variant="secondary" startIcon={<CheckCircleIcon size={14} />} onClick={() => setState('success')}>Mark Synced</Button>
      </Flex>
    </Grid>
  );
}\`;

const playgroundSource = \`import { Calendar } from '@editora/ui-react';

<Calendar
  year={2026}
  month={3}
  value="2026-03-09"
  selection="single"
  size="md"
  state="idle"
  tone="info"
  eventsDisplay="dots"
  outsideClick="navigate"
  ariaLabel="Playground calendar"
/>;
\`;

const bareFlatSource = \`import { Badge, Box, Calendar, Grid } from '@editora/ui-react';

<Grid style={{ gap: 12, maxInlineSize: 760 }}>
  <Box variant="elevated" p="14px" radius="xl" style={{ display: 'grid', gap: 8 }}>
    <Badge tone="info">Bare calendar surface</Badge>
    <Calendar
      year={2026}
      month={3}
      value="2026-03-09"
      selection="single"
      eventsDisplay="dots"
      tone="info"
      bare
      ariaLabel="Bare calendar"
    />
  </Box>
</Grid>;
\`;

const localizationSource = \`import { Calendar } from '@editora/ui-react';

<Calendar
  year={2026}
  month={3}
  value="2026-03-09"
  locale="fr-FR"
  weekStart={1}
  translations={JSON.stringify({
    fr: {
      today: 'Aujourd hui',
      chooseMonthYear: 'Choisir mois/annee',
      scheduleSynced: 'Planning a jour',
    },
  })}
  ariaLabel="Localized calendar"
/>;
\`;

export const EnterpriseSchedule: Story = {
  render: () => <EnterpriseClinicalCalendar />,
  parameters: {
    docs: {
      source: {
        type: 'code',
        code: enterpriseScheduleSource,
      },
    },
  },
};

export const Playground: Story = {
  render: (args) => (
    <Calendar
      {...args}
      year={2026}
      month={3}
      events={hospitalEvents}
      value="2026-03-09"
      ariaLabel="Playground calendar"
    />
  ),
  args: {
    selection: 'single',
    size: 'md',
    bare: false,
    state: 'idle',
    tone: 'info',
    eventsDisplay: 'dots',
    outsideClick: 'navigate',
    disabled: false,
    readOnly: false,
  },
  parameters: {
    docs: {
      source: {
        type: 'code',
        code: playgroundSource,
      },
    },
  },
};

export const BareFlat: Story = {
  render: () => (
    <Grid style={{ gap: 12, maxInlineSize: 760 }}>
      <Box variant="elevated" p="14px" radius="xl" style={{ display: 'grid', gap: 8 }}>
        <Badge tone="info">Bare calendar surface</Badge>
        <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>
          \`bare\` removes calendar panel chrome (border/shadow/background) for flat UI surfaces.
        </Box>
        <Calendar
          year={2026}
          month={3}
          value="2026-03-09"
          selection="single"
          events={hospitalEvents}
          eventsDisplay="dots"
          tone="info"
          bare
          ariaLabel="Bare calendar"
        />
      </Box>
    </Grid>
  ),
  parameters: {
    docs: {
      source: {
        type: 'code',
        code: bareFlatSource,
      },
    },
  },
};

export const Localization: Story = {
  render: () => {
  const [locale, setLocale] = React.useState<'en-US' | 'zh-CN' | 'fr-FR'>('en-US');
  const [value, setValue] = React.useState('2026-03-09');
  const [weekStart, setWeekStart] = React.useState<0 | 1 | 6>(1);

  const localeOptions: Array<{ value: 'en-US' | 'zh-CN' | 'fr-FR'; label: string }> = [
    { value: 'en-US', label: 'English' },
    { value: 'zh-CN', label: 'Chinese' },
    { value: 'fr-FR', label: 'French' },
  ];

  const weekStartOptions: Array<{ value: 0 | 1 | 6; label: string }> = [
    { value: 0, label: 'Sun first' },
    { value: 1, label: 'Mon first' },
    { value: 6, label: 'Sat first' },
  ];

  const frenchOverride = JSON.stringify({
    fr: {
      today: 'Aujourd hui',
      chooseMonthYear: 'Choisir mois/annee',
      scheduleSynced: 'Planning a jour',
    },
  });

  return (
    <Grid style={{ gap: 12, maxInlineSize: 980 }}>
      <Box variant="elevated" p="14px" radius="xl" style={{ display: 'grid', gap: 10 }}>
        <Badge tone="brand">Calendar localization</Badge>
        <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>
          Switch locale and week start to validate month labels, weekdays, and action text.
        </Box>
        <Flex align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
          {localeOptions.map((option) => (
            <Button
              key={option.value}
              size="sm"
              variant={locale === option.value ? undefined : 'secondary'}
              onClick={() => setLocale(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </Flex>
        <Flex align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
          {weekStartOptions.map((option) => (
            <Button
              key={option.value}
              size="sm"
              variant={weekStart === option.value ? undefined : 'secondary'}
              onClick={() => setWeekStart(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </Flex>
      </Box>

      <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 12 }}>
        <Box variant="elevated" p="14px" radius="xl">
          <Grid style={{ gap: 10 }}>
            <Badge tone="info">Built-in locale</Badge>
            <Calendar
              year={2026}
              month={3}
              value={value}
              locale={locale}
              weekStart={weekStart}
              events={hospitalEvents}
              eventsDisplay="dots"
              onSelect={(detail) => setValue(detail.value)}
              ariaLabel="Localized calendar"
            />
          </Grid>
        </Box>

        <Box variant="elevated" p="14px" radius="xl">
          <Grid style={{ gap: 10 }}>
            <Badge tone="success">French custom override</Badge>
            <Calendar
              year={2026}
              month={3}
              value={value}
              locale="fr-FR"
              weekStart={weekStart}
              translations={frenchOverride}
              events={hospitalEvents}
              eventsDisplay="dots"
              onSelect={(detail) => setValue(detail.value)}
              ariaLabel="French override calendar"
            />
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
  },
  parameters: {
    docs: {
      source: {
        type: 'code',
        code: localizationSource,
      },
    },
  },
};
`,$=`import React from 'react';
import type { Meta } from '@storybook/react';
import { Badge, Box, Button, Chart, Flex, Grid } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import {
  ActivityIcon,
  AlertTriangleIcon,
  ChartBarIcon,
  ChartLineIcon,
  ChartPieIcon,
  CheckCircleIcon,
  RefreshCwIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from '@editora/react-icons';
import '../../packages/editora-toast/src/toast.css';
import '@editora/themes/themes/default.css';

const meta: Meta<typeof Chart> = {
  title: 'UI/Chart',
    component: Chart,
    argTypes: {
    type: { control: 'select', options: ['line', 'area', 'step', 'scatter', 'bar', 'donut', 'radial'] },
    variant: { control: 'select', options: ['default', 'contrast', 'minimal'] },
    state: { control: 'select', options: ['idle', 'loading', 'error', 'success'] },
    interactive: { control: 'boolean' },
    showLegend: { control: 'boolean' },
    showSummary: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;

const throughputSeries = [
  { label: 'Mon', value: 182 },
  { label: 'Tue', value: 214 },
  { label: 'Wed', value: 201 },
  { label: 'Thu', value: 236 },
  { label: 'Fri', value: 263 },
  { label: 'Sat', value: 191 },
  { label: 'Sun', value: 208 },
];

const marginSeries = [
  { label: 'Jan', value: 12 },
  { label: 'Feb', value: -4 },
  { label: 'Mar', value: 8 },
  { label: 'Apr', value: 16 },
  { label: 'May', value: -2 },
  { label: 'Jun', value: 10 },
];

const allocationSeries = [
  { label: 'Inpatient', value: 42, tone: '#2563eb' },
  { label: 'Outpatient', value: 33, tone: '#16a34a' },
  { label: 'Pharmacy', value: 15, tone: '#d97706' },
  { label: 'Labs', value: 10, tone: '#dc2626' },
];

function EnterpriseChartDashboard() {
  const [state, setState] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [chartType, setChartType] = React.useState<'line' | 'area' | 'step' | 'scatter' | 'bar' | 'donut' | 'radial'>(
    'line'
  );
  const [data, setData] = React.useState(throughputSeries);

  return (
    <Grid style={{ gap: 16, maxInlineSize: 1100 }}>
      <Box variant="gradient" tone="brand" radius="xl" p="16px" style={{ display: 'grid', gap: 10 }}>
        <Flex align="center" justify="space-between" style={{ gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>Enterprise Care Analytics</div>
            <div style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13, marginTop: 4 }}>
              Throughput, margin variance, and service allocation in one operational view.
            </div>
          </div>
          <Flex align="center" style={{ gap: 8, color: 'var(--ui-color-muted, #64748b)', fontSize: 12 }}>
            <ActivityIcon size={14} />
            Real-time stream
          </Flex>
        </Flex>
      </Box>

      <Grid style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <Box style={{ display: 'grid', gap: 8 }}>
          <Chart
            type={chartType}
            title="Patient Throughput"
            subtitle="Visits per day"
            data={data}
            state={state}
            showLegend
            showSummary
            onPointSelect={(detail) => {
              toastAdvanced.info(\`\${detail.label}: \${detail.value} visits\`, { duration: 900, theme: 'light' });
            }}
          />
        </Box>

        <Box style={{ display: 'grid', gap: 8 }}>
          <Chart
            type="bar"
            title="Monthly Margin Variance"
            subtitle="Positive and negative movement"
            data={marginSeries}
            state={state === 'error' ? 'error' : 'idle'}
            onPointSelect={(detail) => {
              const tone = detail.value < 0 ? 'error' : 'success';
              if (tone === 'error') toastAdvanced.error(\`\${detail.label}: \${detail.value}%\`, { duration: 900, theme: 'light' });
              else toastAdvanced.success(\`\${detail.label}: +\${detail.value}%\`, { duration: 900, theme: 'light' });
            }}
          />
        </Box>

        <Box style={{ display: 'grid', gap: 8 }}>
          <Chart
            type="donut"
            title="Service Allocation"
            subtitle="Current distribution"
            data={allocationSeries}
            state={state === 'loading' ? 'loading' : 'success'}
            onPointSelect={(detail) => {
              toastAdvanced.info(\`\${detail.label} share selected\`, { duration: 900, theme: 'light' });
            }}
          />
        </Box>
      </Grid>

      <Flex align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
        <Badge tone="brand">
          <TrendingUpIcon size={12} />
          +14.8% weekly throughput
        </Badge>
        <Badge tone="warning">
          <TrendingDownIcon size={12} />
          -2.1% margin variance risk
        </Badge>

        <Button
          size="sm"
          variant="secondary"
          startIcon={<ChartLineIcon size={14} />}
          onClick={() => setChartType('line')}
        >
          Line
        </Button>
        <Button
          size="sm"
          variant="secondary"
          startIcon={<ChartBarIcon size={14} />}
          onClick={() => setChartType('step')}
        >
          Step
        </Button>
        <Button
          size="sm"
          variant="secondary"
          startIcon={<ActivityIcon size={14} />}
          onClick={() => setChartType('scatter')}
        >
          Scatter
        </Button>
        <Button
          size="sm"
          variant="secondary"
          startIcon={<ChartBarIcon size={14} />}
          onClick={() => setChartType('bar')}
        >
          Bar
        </Button>
        <Button
          size="sm"
          variant="secondary"
          startIcon={<ChartPieIcon size={14} />}
          onClick={() => setChartType('donut')}
        >
          Donut
        </Button>
        <Button
          size="sm"
          variant="secondary"
          startIcon={<ChartPieIcon size={14} />}
          onClick={() => setChartType('radial')}
        >
          Radial
        </Button>

        <Button
          size="sm"
          variant="secondary"
          startIcon={<RefreshCwIcon size={14} />}
          onClick={() => {
            setState('loading');
            toastAdvanced.loading('Syncing chart stream...', { duration: 900, theme: 'light' });
            window.setTimeout(() => {
              setData((prev) =>
                prev.map((point) => ({
                  ...point,
                  value: Math.max(40, Math.round(point.value + (Math.random() * 24 - 12))),
                }))
              );
              setState('idle');
              toastAdvanced.success('Chart data refreshed', { duration: 1000, theme: 'light' });
            }, 900);
          }}
        >
          Refresh Data
        </Button>

        <Button
          size="sm"
          variant="secondary"
          startIcon={<AlertTriangleIcon size={14} />}
          onClick={() => {
            setState('error');
            toastAdvanced.error('Feed degraded: fallback dataset active', { duration: 1200, theme: 'light' });
          }}
        >
          Simulate Error
        </Button>

        <Button
          size="sm"
          startIcon={<CheckCircleIcon size={14} />}
          onClick={() => {
            setState('success');
            toastAdvanced.success('Pipeline healthy and synchronized', { duration: 1200, theme: 'light' });
          }}
        >
          Mark Healthy
        </Button>
      </Flex>
    </Grid>
  );
}

export const EnterpriseAnalytics = EnterpriseChartDashboard;

const PlaygroundTemplate = (args: Record<string, unknown>) => (
  <Box style={{ maxInlineSize: 860 }}>
    <Chart
      {...args}
      title="Playground Throughput"
      subtitle="Use controls to test chart states"
      data={throughputSeries}
      onPointSelect={(detail) => {
        toastAdvanced.info(\`\${detail.label}: \${detail.value}\`, { duration: 800, theme: 'light' });
      }}
    />
  </Box>
);

export const Playground = PlaygroundTemplate.bind({});
Playground.args = {
  type: 'line',
  variant: 'default',
  state: 'idle',
  interactive: true,
  showLegend: true,
  showSummary: true,
  disabled: false,
};

export const Contrast = () => (
  <Box variant="contrast" p="12px" radius="lg">
    <Grid style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
      <Chart
        variant="contrast"
        type="area"
        title="Night Shift Throughput"
        subtitle="Last 7 days"
        data={throughputSeries.map((item) => ({ ...item, value: Math.round(item.value * 0.72) }))}
        state="success"
      />
      <Chart
        variant="contrast"
        type="donut"
        title="Incident Categories"
        subtitle="Current month"
        data={[
          { label: 'API', value: 14, tone: '#93c5fd' },
          { label: 'DB', value: 7, tone: '#34d399' },
          { label: 'Infra', value: 4, tone: '#fbbf24' },
        ]}
      />
    </Grid>
  </Box>
);

export const AllTypes = () => (
  <Grid style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
    <Chart type="line" title="Line" subtitle="Daily trend" data={throughputSeries} />
    <Chart type="area" title="Area" subtitle="Volume envelope" data={throughputSeries} />
    <Chart type="step" title="Step" subtitle="Discrete changes" data={throughputSeries} />
    <Chart type="scatter" title="Scatter" subtitle="Point distribution" data={throughputSeries} />
    <Chart type="bar" title="Bar" subtitle="Category compare" data={throughputSeries} />
    <Chart type="donut" title="Donut" subtitle="Share split" data={allocationSeries} />
    <Chart type="radial" title="Radial" subtitle="Multi-axis spread" data={throughputSeries} />
  </Grid>
);
`,j=`import React from 'react';
import { Checkbox, Box, Flex } from '@editora/ui-react';

export default {
  title: 'UI/Checkbox',
  component: Checkbox,
};

const shellStyle: React.CSSProperties = {
  border: '1px solid #e2e8f0',
  borderRadius: 14,
  padding: 14,
  background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
};

export const Default = () => (
  <Box style={shellStyle}>
    <Checkbox>Enable smart formatting</Checkbox>
  </Box>
);

export const Checked = () => (
  <Box style={shellStyle}>
    <Checkbox checked>Checked</Checkbox>
  </Box>
);

export const Disabled = () => (
  <Box style={shellStyle}>
    <Checkbox disabled>Disabled</Checkbox>
  </Box>
);

export const Indeterminate = () => (
  <Box style={shellStyle}>
    <Checkbox indeterminate>Indeterminate</Checkbox>
  </Box>
);

export const WithLabel = () => (
  <Box style={shellStyle}>
    <Checkbox>Accept terms and conditions</Checkbox>
  </Box>
);

export const Controlled = () => {
  const [checked, setChecked] = React.useState(false);
  return (
    <Box style={shellStyle}>
      <Flex style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Checkbox checked={checked} onCheckedChange={(next) => setChecked(next)}>
          Controlled ({checked ? 'On' : 'Off'})
        </Checkbox>
        <Box style={{ fontSize: 12, color: '#64748b' }}>Value: {String(checked)}</Box>
      </Flex>
    </Box>
  );
};

export const CustomSize = () => (
  <Box style={shellStyle}>
    <Checkbox style={{ '--ui-checkbox-size': '32px' } as React.CSSProperties}>Large Checkbox</Checkbox>
  </Box>
);

export const CustomColor = () => (
  <Box style={shellStyle}>
    <Checkbox style={{ '--ui-checkbox-checked-background': '#22c55e', '--ui-checkbox-border': '2px solid #22c55e' } as React.CSSProperties} checked>
      Success
    </Checkbox>
  </Box>
);

export const ErrorState = () => (
  <Box style={shellStyle}>
    <Checkbox style={{ '--ui-checkbox-checked-background': '#ef4444', '--ui-checkbox-border': '2px solid #ef4444' } as React.CSSProperties} checked>
      Error
    </Checkbox>
  </Box>
);

export const Invalid = () => (
  <Box style={shellStyle}>
    <Checkbox invalid>Validation error state</Checkbox>
  </Box>
);

export const AdminCompactPreset = () => (
  <Box style={shellStyle}>
    <Flex style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Checkbox preset="admin" density="compact" checked>
        Compact active
      </Checkbox>
      <Checkbox preset="admin" density="compact">
        Compact default
      </Checkbox>
      <Checkbox preset="admin" density="compact" indeterminate>
        Compact mixed
      </Checkbox>
      <Checkbox preset="admin" density="compact" disabled>
        Compact disabled
      </Checkbox>
    </Flex>
  </Box>
);

export const Headless = () => (
  <Box style={shellStyle}>
    <Checkbox headless style={{ padding: '6px 10px', border: '1px dashed #94a3b8', borderRadius: 10 }}>
      Headless (unstyled)
    </Checkbox>
  </Box>
);

export const CheckboxGroup = () => {
  const [values, setValues] = React.useState([false, true, false]);
  return (
    <Box style={shellStyle}>
      <Flex style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {['One', 'Two', 'Three'].map((label, i) => (
          <Checkbox
            key={label}
            checked={values[i]}
            onCheckedChange={(next) => setValues((prev) => prev.map((val, idx) => (idx === i ? next : val)))}
          >
            {label}
          </Checkbox>
        ))}
      </Flex>
    </Box>
  );
};

export const DensityScale = () => (
  <Box style={shellStyle}>
    <Flex style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Checkbox density="compact">Compact density</Checkbox>
      <Checkbox>Default density</Checkbox>
      <Checkbox density="comfortable">Comfortable density</Checkbox>
    </Flex>
  </Box>
);

export const Loading = () => (
  <Box style={shellStyle}>
    <Flex style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <Checkbox loading>Loading</Checkbox>
      <Checkbox loading checked>
        Loading checked
      </Checkbox>
      <Checkbox loading indeterminate>
        Loading mixed
      </Checkbox>
    </Flex>
  </Box>
);
`,Q=`import React from 'react';
import type { Meta } from '@storybook/react';
import { Badge, Box, Button, Collapsible, Flex, Grid } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  ClipboardCheckIcon,
  RefreshCwIcon,
  ShieldIcon,
  SparklesIcon,
  UsersIcon,
} from '@editora/react-icons';
import '../../packages/editora-toast/src/toast.css';
import '@editora/themes/themes/default.css';

const meta: Meta<typeof Collapsible> = {
  title: 'UI/Collapsible',
  component: Collapsible,
  argTypes: {
    open: { control: 'boolean' },
    headless: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    state: { control: { type: 'radio', options: ['idle', 'loading', 'error', 'success'] } },
    size: { control: { type: 'radio', options: ['sm', 'md', 'lg'] } },
    variant: { control: { type: 'radio', options: ['default', 'subtle', 'outline', 'ghost'] } },
    tone: { control: { type: 'radio', options: ['neutral', 'info', 'success', 'warning', 'danger'] } },
    iconPosition: { control: { type: 'radio', options: ['left', 'right'] } },
    closeOnEscape: { control: 'boolean' },
  },
};

export default meta;

const shellStyle: React.CSSProperties = {
  border: '1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent)',
  borderRadius: 16,
  padding: 14,
  background: 'linear-gradient(168deg, #ffffff 0%, #f8fafc 100%)',
  boxShadow: '0 10px 24px rgba(15, 23, 42, 0.08)',
};

const baseContent = (
  <Grid style={{ display: 'grid', gap: 8 }}>
    <Box>1. Require reviewer approval for enterprise policy changes.</Box>
    <Box>2. Enforce audit trail retention for 365 days.</Box>
    <Box>3. Limit export scope for restricted patient records.</Box>
  </Grid>
);

export const Playground = (args: any) => (
  <Box style={{ ...shellStyle, maxInlineSize: 920 }}>
    <Collapsible
      {...args}
      header={
        <Flex align="center" style={{ gap: 8 }}>
          <ShieldIcon size={15} />
          Compliance Configuration
        </Flex>
      }
      caption="Security, auditing, and release governance"
      meta={<Badge tone="brand">Enterprise</Badge>}
      onToggleDetail={(detail) => {
        toastAdvanced.info(\`Panel \${detail.open ? 'expanded' : 'collapsed'} (\${detail.source})\`, {
          duration: 900,
          theme: 'light',
        });
      }}
    >
      {baseContent}
    </Collapsible>
  </Box>
);

Playground.args = {
  open: false,
  headless: false,
  disabled: false,
  readOnly: false,
  state: 'idle',
  size: 'md',
  variant: 'default',
  tone: 'info',
  iconPosition: 'right',
  closeOnEscape: true,
};

export const EnterprisePolicyPanels = () => (
  <Grid style={{ display: 'grid', gap: 12, maxInlineSize: 980 }}>
    <Collapsible
      open
      variant="subtle"
      tone="info"
      header={
        <Flex align="center" style={{ gap: 8 }}>
          <UsersIcon size={15} />
          Access Control Matrix
        </Flex>
      }
      caption="Role-based access for admins, reviewers, and operators"
      meta={<Badge tone="brand">12 rules</Badge>}
      onToggleDetail={(detail) => {
        toastAdvanced.info(\`Access Control \${detail.open ? 'opened' : 'closed'}\`, { duration: 900, theme: 'light' });
      }}
    >
      <Grid style={{ display: 'grid', gap: 8 }}>
        <Box>Admins: full scope + emergency override.</Box>
        <Box>Reviewers: read + approval actions only.</Box>
        <Box>Operators: execution scope within assigned departments.</Box>
      </Grid>
    </Collapsible>

    <Collapsible
      tone="warning"
      variant="outline"
      header={
        <Flex align="center" style={{ gap: 8 }}>
          <AlertTriangleIcon size={15} />
          Exception Handling Rules
        </Flex>
      }
      caption="Fallback strategy for degraded integrations"
      meta={<Badge tone="warning">Pending</Badge>}
      onToggleDetail={(detail) => {
        if (detail.open) toastAdvanced.warning('Review exception thresholds before deployment', { duration: 1200, theme: 'light' });
      }}
    >
      <Grid style={{ display: 'grid', gap: 8 }}>
        <Box>Temporary fail-open max window: 10 minutes.</Box>
        <Box>Escalate to on-call after 2 consecutive sync failures.</Box>
        <Box>Disable external writes when data confidence falls below 85%.</Box>
      </Grid>
    </Collapsible>

    <Collapsible
      tone="success"
      state="success"
      header={
        <Flex align="center" style={{ gap: 8 }}>
          <ClipboardCheckIcon size={15} />
          Release Checklist
        </Flex>
      }
      caption="Validated for rollout"
      meta={<Badge tone="success">Ready</Badge>}
      onToggleDetail={(detail) => {
        if (detail.open) toastAdvanced.success('Checklist validated. Ready for release.', { duration: 1100, theme: 'light' });
      }}
    >
      <Grid style={{ display: 'grid', gap: 8 }}>
        <Box>Schema validation: passed.</Box>
        <Box>QA sign-off: complete.</Box>
        <Box>Observability dashboard alerts: green.</Box>
      </Grid>
    </Collapsible>
  </Grid>
);

export const ControlledWorkflow = () => {
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');

  return (
    <Box style={{ ...shellStyle, maxInlineSize: 920 }}>
      <Flex align="center" style={{ gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
        <Button
          size="sm"
          variant="secondary"
          startIcon={<RefreshCwIcon size={14} />}
          onClick={() => {
            setState('loading');
            toastAdvanced.loading('Syncing section…', { duration: 900, theme: 'light' });
            window.setTimeout(() => setState('idle'), 900);
          }}
        >
          Sync
        </Button>
        <Button
          size="sm"
          variant="secondary"
          startIcon={<AlertTriangleIcon size={14} />}
          onClick={() => {
            setState('error');
            toastAdvanced.error('Sync failed: retry required', { duration: 1200, theme: 'light' });
          }}
        >
          Error
        </Button>
        <Button
          size="sm"
          variant="secondary"
          startIcon={<CheckCircleIcon size={14} />}
          onClick={() => {
            setState('success');
            toastAdvanced.success('Sync complete', { duration: 1000, theme: 'light' });
          }}
        >
          Success
        </Button>
        <Button
          size="sm"
          startIcon={<SparklesIcon size={14} />}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? 'Collapse' : 'Expand'}
        </Button>
      </Flex>

      <Collapsible
        open={open}
        onChangeOpen={setOpen}
        state={state}
        tone={state === 'error' ? 'danger' : state === 'success' ? 'success' : 'info'}
        header="Production Deployment Controls"
        caption="Coordinated release controls across teams"
        meta={<Badge tone="brand">Controlled</Badge>}
      >
        <Grid style={{ display: 'grid', gap: 8 }}>
          <Box>Batch window: 22:00 to 02:00 UTC.</Box>
          <Box>Rollback threshold: {'>'}2.5% elevated error ratio for 5 minutes.</Box>
          <Box>Notification channels: Ops, Clinical leads, Security audit stream.</Box>
        </Grid>
      </Collapsible>

      <Box style={{ marginTop: 10, fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>Open: {String(open)}</Box>
    </Box>
  );
};
`,J=`import React from 'react';
import type { Meta } from '@storybook/react';
import { Badge, Box, Button, ColorPicker, Flex, Grid } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import { AlertTriangleIcon, CheckCircleIcon, RefreshCwIcon, ShieldIcon } from '@editora/react-icons';
import '../../packages/editora-toast/src/toast.css';
import '@editora/themes/themes/default.css';

const meta: Meta<typeof ColorPicker> = {
  title: 'UI/ColorPicker',
  component: ColorPicker,
  argTypes: {
    value: { control: 'text' },
    format: { control: { type: 'radio', options: ['hex', 'rgb', 'hsl'] } },
    alpha: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    size: { control: { type: 'radio', options: ['sm', 'md', 'lg'] } },
    variant: { control: { type: 'radio', options: ['default', 'contrast'] } },
    state: { control: { type: 'radio', options: ['idle', 'loading', 'error', 'success'] } },
    tone: { control: { type: 'radio', options: ['brand', 'neutral', 'success', 'warning', 'danger'] } },
    mode: { control: { type: 'radio', options: ['inline', 'popover'] } },
    open: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' },
    recent: { control: 'boolean' },
    persist: { control: 'boolean' },
    maxRecent: { control: { type: 'number', min: 1, max: 24, step: 1 } },
  },
};

export default meta;

const enterprisePresets = [
  '#1d4ed8',
  '#0369a1',
  '#0f766e',
  '#15803d',
  '#b45309',
  '#b91c1c',
  '#7e22ce',
  '#334155',
  '#111827',
];

const cardStyle: React.CSSProperties = {
  border: '1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent)',
  borderRadius: 16,
  padding: 16,
  background: 'linear-gradient(168deg, #ffffff 0%, #f8fafc 100%)',
  boxShadow: '0 12px 28px rgba(15, 23, 42, 0.08)',
};

export const Playground = (args: any) => (
  <Box style={{ ...cardStyle, maxInlineSize: 980 }}>
    <Grid style={{ display: 'grid', gap: 12 }}>
      <Flex align="center" justify="space-between" style={{ gap: 10, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Enterprise Theme Color Controls</div>
          <div style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13, marginTop: 4 }}>
            Validate runtime palette updates for alerts, badges, and analytics highlights.
          </div>
        </div>
        <Badge tone="brand">Design System</Badge>
      </Flex>

      <ColorPicker
        {...args}
        presets={enterprisePresets}
        onChange={(detail) => {
          toastAdvanced.info(\`Updated \${detail.value} via \${detail.source}\`, { duration: 900, theme: 'light' });
        }}
        onInvalid={(detail) => {
          toastAdvanced.warning(\`Invalid token: \${detail.raw}\`, { duration: 1200, theme: 'light' });
        }}
        onCloseDetail={(detail) => {
          toastAdvanced.info(\`Picker closed via \${detail.source}\`, { duration: 850, theme: 'light' });
        }}
        aria-label="Theme color picker"
      />
    </Grid>
  </Box>
);

Playground.args = {
  value: '#2563eb',
  format: 'hex',
  alpha: true,
  disabled: false,
  readOnly: false,
  size: 'md',
  variant: 'default',
  state: 'idle',
  tone: 'brand',
  mode: 'inline',
  open: false,
  closeOnEscape: true,
  placeholder: 'Choose theme color',
  recent: true,
  persist: true,
  maxRecent: 10,
};

export const EnterpriseReleaseWorkflow = () => {
  const [value, setValue] = React.useState('rgb(37 99 235 / 0.92)');
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [lastCloseSource, setLastCloseSource] = React.useState('none');

  return (
    <Grid style={{ display: 'grid', gap: 12, maxInlineSize: 1040 }}>
      <Box style={cardStyle}>
        <Flex align="center" justify="space-between" style={{ gap: 10, flexWrap: 'wrap' }}>
          <Flex align="center" style={{ gap: 8 }}>
            <ShieldIcon size={15} />
            <span style={{ fontWeight: 700, fontSize: 16 }}>Release Color Governance</span>
          </Flex>
          <Badge tone={state === 'error' ? 'danger' : state === 'success' ? 'success' : 'brand'}>
            {state.toUpperCase()}
          </Badge>
        </Flex>

        <Box style={{ marginTop: 12 }}>
          <ColorPicker
            mode="popover"
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            onCloseDetail={(detail) => {
              setOpen(false);
              setLastCloseSource(detail.source);
            }}
            state={state}
            tone={state === 'error' ? 'danger' : state === 'success' ? 'success' : 'brand'}
            alpha
            recent
            persist
            maxRecent={12}
            format="rgb"
            value={value}
            presets={enterprisePresets}
            closeOnEscape
            onChange={(detail) => {
              setValue(detail.value);
              if (detail.source === 'eyedropper') {
                toastAdvanced.success('Eyedropper value committed', { duration: 1100, theme: 'light' });
              }
            }}
            aria-label="Release palette picker"
          />
        </Box>

        <Flex align="center" style={{ gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
          <Button
            size="sm"
            variant="secondary"
            startIcon={<RefreshCwIcon size={14} />}
            onClick={() => {
              setState('loading');
              toastAdvanced.loading('Validating palette consistency...', { duration: 850, theme: 'light' });
              window.setTimeout(() => setState('idle'), 900);
            }}
          >
            Validate
          </Button>
          <Button
            size="sm"
            variant="secondary"
            startIcon={<AlertTriangleIcon size={14} />}
            onClick={() => {
              setState('error');
              toastAdvanced.error('Contrast regression detected for warning badge', { duration: 1300, theme: 'light' });
            }}
          >
            Force Error
          </Button>
          <Button
            size="sm"
            variant="secondary"
            startIcon={<CheckCircleIcon size={14} />}
            onClick={() => {
              setState('success');
              toastAdvanced.success('Palette approved for release', { duration: 1200, theme: 'light' });
            }}
          >
            Mark Success
          </Button>
          <Button size="sm" onClick={() => setOpen((current) => !current)}>
            {open ? 'Close Picker' : 'Open Picker'}
          </Button>
        </Flex>

        <Box style={{ marginTop: 10, fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>
          Value: {value} | Last close source: {lastCloseSource}
        </Box>
      </Box>
    </Grid>
  );
};

export const EdgeCasesAndRecovery = () => {
  const [value, setValue] = React.useState('#0ea5e9');
  const [state, setState] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');

  return (
    <Grid style={{ display: 'grid', gap: 12, maxInlineSize: 980 }}>
      <Box style={cardStyle}>
        <Grid style={{ display: 'grid', gap: 10 }}>
          <Badge tone="warning">Edge Scenarios</Badge>
          <ColorPicker
            alpha
            format="hex"
            mode="inline"
            state={state}
            tone={state === 'error' ? 'danger' : state === 'success' ? 'success' : 'warning'}
            value={value}
            presets={['#fff', '#000', '#16a34a', '#dc2626', '#f59e0b', '#2563eb']}
            onChange={(detail) => setValue(detail.value)}
            onInvalid={(detail) => {
              setState('error');
              toastAdvanced.warning(\`Input recovery required: \${detail.reason}\`, { duration: 1300, theme: 'light' });
            }}
            aria-label="Edge-case color picker"
          />
          <Flex align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
            <Button size="sm" variant="secondary" onClick={() => setState('idle')}>Idle</Button>
            <Button size="sm" variant="secondary" onClick={() => setState('loading')}>Loading</Button>
            <Button size="sm" variant="secondary" onClick={() => setState('error')}>Error</Button>
            <Button size="sm" variant="secondary" onClick={() => setState('success')}>Success</Button>
          </Flex>
        </Grid>
      </Box>
    </Grid>
  );
};
`,Z=`import React from 'react';
import type { Meta } from '@storybook/react';
import { Badge, Box, Button, Combobox, Flex, Grid } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import { AlertTriangleIcon, CheckCircleIcon, RefreshCwIcon, ShieldIcon, UsersIcon } from '@editora/react-icons';
import '../../packages/editora-toast/src/toast.css';
import '@editora/themes/themes/default.css';

const meta: Meta<typeof Combobox> = {
  title: 'UI/Combobox',
  component: Combobox,
  argTypes: {
    value: { control: 'text' },
    open: { control: 'boolean' },
    state: { control: { type: 'radio', options: ['idle', 'loading', 'error', 'success'] } },
    stateText: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    clearable: { control: 'boolean' },
    debounce: { control: 'number' },
    allowCustom: { control: 'boolean' },
    noFilter: { control: 'boolean' },
    validation: { control: { type: 'radio', options: ['none', 'error', 'success'] } },
    size: { control: { type: 'radio', options: ['sm', 'md', 'lg', '1', '2', '3'] } },
    variant: { control: { type: 'radio', options: ['classic', 'surface', 'soft'] } },
    radius: { control: { type: 'radio', options: ['none', 'large', 'full'] } },
    label: { control: 'text' },
    description: { control: 'text' },
    emptyText: { control: 'text' }
  }
};

export default meta;

const cardStyle: React.CSSProperties = {
  border: '1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent)',
  borderRadius: 16,
  padding: 16,
  background: 'linear-gradient(168deg, #ffffff 0%, #f8fafc 100%)',
  boxShadow: '0 12px 28px rgba(15, 23, 42, 0.08)'
};

const staffOptions = [
  { value: 'dr-nadia-khan', label: 'Dr. Nadia Khan', description: 'ICU - Critical Care' },
  { value: 'dr-oliver-johnson', label: 'Dr. Oliver Johnson', description: 'Cardiology' },
  { value: 'nurse-amy-chen', label: 'Nurse Amy Chen', description: 'Emergency Triage' },
  { value: 'nurse-sam-patel', label: 'Nurse Sam Patel', description: 'Ward Operations' },
  { value: 'admin-rachel-park', label: 'Rachel Park', description: 'Admissions Manager' },
  { value: 'qa-ravi-mehta', label: 'Ravi Mehta', description: 'Clinical QA Lead' }
];

const renderOptions = () =>
  staffOptions.map((option) => (
    <option key={option.value} value={option.value} data-description={option.description}>
      {option.label}
    </option>
  ));

export const Playground = (args: any) => (
  <Box style={{ ...cardStyle, maxInlineSize: 900 }}>
    <Grid style={{ display: 'grid', gap: 12 }}>
      <Flex align="center" justify="space-between" style={{ gap: 8, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Enterprise Assignment Combobox</div>
          <div style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13, marginTop: 4 }}>
            Test keyboard filtering, async states, and validation feedback.
          </div>
        </div>
        <Badge tone="brand">SaaS Ready</Badge>
      </Flex>

      <Combobox
        {...args}
        onChange={(next) => toastAdvanced.info(\`Assigned \${next || 'none'}\`, { duration: 900, theme: 'light' })}
        onOpenDetail={(detail) => {
          if (detail.source !== 'attribute') {
            toastAdvanced.info(\`Combobox \${detail.open ? 'opened' : 'closed'} via \${detail.source}\`, {
              duration: 850,
              theme: 'light'
            });
          }
        }}
      >
        {renderOptions()}
      </Combobox>
    </Grid>
  </Box>
);

Playground.args = {
  value: '',
  placeholder: 'Search staff and departments...',
  clearable: true,
  debounce: 220,
  disabled: false,
  readOnly: false,
  validation: 'none',
  size: 'md',
  variant: 'surface',
  radius: 'large',
  label: 'Assignee',
  description: 'Choose the incident owner for this escalation.',
  allowCustom: false,
  noFilter: false,
  state: 'idle',
  stateText: '',
  emptyText: 'No matching staff found.'
};

export const EnterpriseTriageWorkflow = () => {
  const [value, setValue] = React.useState('');
  const [query, setQuery] = React.useState('');
  const [state, setState] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [open, setOpen] = React.useState(false);

  return (
    <Box style={{ ...cardStyle, maxInlineSize: 980 }}>
      <Grid style={{ display: 'grid', gap: 12 }}>
        <Flex align="center" justify="space-between" style={{ gap: 8, flexWrap: 'wrap' }}>
          <Flex align="center" style={{ gap: 8 }}>
            <ShieldIcon size={15} />
            <span style={{ fontWeight: 700 }}>Critical Incident Routing</span>
          </Flex>
          <Badge tone={state === 'error' ? 'danger' : state === 'success' ? 'success' : 'brand'}>
            {state.toUpperCase()}
          </Badge>
        </Flex>

        <Combobox
          open={open}
          value={value}
          clearable
          debounce={280}
          state={state}
          stateText={
            state === 'loading'
              ? 'Syncing on-call directory'
              : state === 'error'
                ? 'Directory unavailable'
                : state === 'success'
                  ? 'Directory verified'
                  : ''
          }
          label="Clinical owner"
          description="Type to search clinician roster and assign incident ownership."
          placeholder="Find clinician..."
          validation={state === 'error' ? 'error' : state === 'success' ? 'success' : 'none'}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          onInput={(nextQuery) => {
            setQuery(nextQuery);
            setState('loading');
            window.setTimeout(() => {
              setState(nextQuery.trim().length > 1 ? 'success' : 'idle');
            }, 500);
          }}
          onChange={(next) => {
            setValue(next);
            toastAdvanced.success(\`Incident assigned to \${next || 'unassigned'}\`, { duration: 1200, theme: 'light' });
          }}
          onOpenDetail={(detail) => {
            if (detail.source === 'outside') {
              toastAdvanced.info('Combobox dismissed by outside click', { duration: 900, theme: 'light' });
            }
          }}
        >
          {renderOptions()}
        </Combobox>

        <Flex align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
          <Button
            size="sm"
            variant="secondary"
            startIcon={<RefreshCwIcon size={14} />}
            onClick={() => {
              setState('loading');
              toastAdvanced.loading('Refreshing staffing directory...', { duration: 900, theme: 'light' });
              window.setTimeout(() => setState('idle'), 900);
            }}
          >
            Refresh
          </Button>
          <Button
            size="sm"
            variant="secondary"
            startIcon={<AlertTriangleIcon size={14} />}
            onClick={() => {
              setState('error');
              toastAdvanced.error('Roster API timeout detected', { duration: 1400, theme: 'light' });
            }}
          >
            Simulate Error
          </Button>
          <Button
            size="sm"
            variant="secondary"
            startIcon={<CheckCircleIcon size={14} />}
            onClick={() => {
              setState('success');
              toastAdvanced.success('Roster cache warmed and ready', { duration: 1100, theme: 'light' });
            }}
          >
            Mark Success
          </Button>
          <Button size="sm" startIcon={<UsersIcon size={14} />} onClick={() => setOpen((current) => !current)}>
            {open ? 'Close List' : 'Open List'}
          </Button>
        </Flex>

        <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>
          value: <code>{value || '(none)'}</code> | query: <code>{query || '(empty)'}</code>
        </Box>
      </Grid>
    </Box>
  );
};

export const EdgeCases = () => {
  const [value, setValue] = React.useState('');

  return (
    <Grid style={{ display: 'grid', gap: 12, maxInlineSize: 980 }}>
      <Box style={cardStyle}>
        <Grid style={{ display: 'grid', gap: 10 }}>
          <Badge tone="warning">Custom + Empty State</Badge>
          <Combobox
            allowCustom
            clearable
            debounce={250}
            emptyText="No known clinical tags. Press Enter to use custom value."
            label="Escalation Tag"
            description="Supports custom tags when no preset value matches."
            placeholder="Type severity tag..."
            onChange={(next) => {
              setValue(next);
              toastAdvanced.info(\`Tag set to \${next || '(empty)'}\`, { duration: 900, theme: 'light' });
            }}
          >
            <option value="high-risk" data-description="Immediate supervisory review">
              High Risk
            </option>
            <option value="compliance" data-description="Policy validation required">
              Compliance
            </option>
            <option value="handover" data-description="Shift transition dependency">
              Handover
            </option>
          </Combobox>
          <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>
            Current tag: <code>{value || '(none)'}</code>
          </Box>
        </Grid>
      </Box>

      <Box style={cardStyle}>
        <Grid style={{ display: 'grid', gap: 10 }}>
          <Badge tone="info">Read-Only Review</Badge>
          <Combobox
            readOnly
            value="dr-oliver-johnson"
            label="Escalation reviewer"
            description="Read-only snapshot for approval audit trail."
            placeholder="Reviewer"
          >
            {renderOptions()}
          </Combobox>
        </Grid>
      </Box>
    </Grid>
  );
};
`,K=`import React, { useMemo, useState } from 'react';
import { CommandPalette, Button , Box, Grid, Flex} from '@editora/ui-react';

export default {
  title: 'UI/CommandPalette',
  component: CommandPalette,
  argTypes: { open: { control: 'boolean' } }
};

const commands = [
  'Create document',
  'Insert image',
  'Toggle sidebar',
  'Export as PDF',
  'Open settings'
];

export const Default = (args: any) => {
  const [open, setOpen] = useState(!!args.open);
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <Flex style={{ display: 'flex', gap: 8 }}>
        <Button onClick={() => setOpen(true)}>Open Palette</Button>
        <Button variant="secondary" onClick={() => setOpen(false)}>Close</Button>
      </Flex>

      <CommandPalette
        open={open}
        onSelect={(idx) => {
          setSelected(idx);
          setOpen(false);
        }}
      >
        {commands.map((command) => (
          <Box key={command} slot="command" style={{ padding: 8, borderRadius: 6 }}>
            {command}
          </Box>
        ))}
      </CommandPalette>

      <Box style={{ fontSize: 13, color: '#475569' }}>
        Selected: {selected == null ? 'none' : commands[selected]}
      </Box>
    </Grid>
  );
};
Default.args = { open: false };

export const FilteredList = () => {
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () => commands.filter((command) => command.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter commands before rendering"
        style={{ maxWidth: 320, padding: 8, border: '1px solid #cbd5e1', borderRadius: 8 }}
      />
      <CommandPalette open={open} onSelect={() => setOpen(false)}>
        {filtered.map((command) => (
          <div key={command} slot="command">{command}</div>
        ))}
      </CommandPalette>
      <Button size="sm" variant="secondary" onClick={() => setOpen((v) => !v)}>
        Toggle palette
      </Button>
    </Grid>
  );
};
`,Y=`import React from 'react';
import { Container , Box, Grid} from '@editora/ui-react';

export default {
  title: 'UI/Container',
  component: Container,
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] }
  }
};

export const Default = (args: any) => (
  <Container size={args.size} style={{ padding: 24, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12 }}>
    Container content ({args.size})
  </Container>
);
Default.args = { size: 'md' };

export const SizeComparison = () => (
  <Grid style={{ display: 'grid', gap: 10 }}>
    <Container size="sm" style={{ background: '#f1f5f9', padding: 12 }}>Small</Container>
    <Container size="md" style={{ background: '#f1f5f9', padding: 12 }}>Medium</Container>
    <Container size="lg" style={{ background: '#f1f5f9', padding: 12 }}>Large</Container>
    <Container size="xl" style={{ background: '#f1f5f9', padding: 12 }}>Extra Large</Container>
  </Grid>
);
`,X=`import React from 'react';
import type { Meta } from '@storybook/react';
import { Badge, Box, Button, ContextMenu, Flex, Grid } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import {
  ActivityIcon,
  AlertTriangleIcon,
  ClipboardCheckIcon,
  CheckCircleIcon,
  SaveIcon,
  SparklesIcon,
  RefreshCwIcon,
  ShieldIcon,
  UsersIcon
} from '@editora/react-icons';
import '../../packages/editora-toast/src/toast.css';
import '@editora/themes/themes/default.css';

const meta: Meta<typeof ContextMenu> = {
  title: 'UI/ContextMenu',
  component: ContextMenu,
  argTypes: {
    open: { control: 'boolean' },
    anchorId: { control: 'text' },
    disabled: { control: 'boolean' },
    state: { control: { type: 'radio', options: ['idle', 'loading', 'error', 'success'] } },
    stateText: { control: 'text' },
    variant: { control: { type: 'radio', options: ['default', 'solid', 'flat', 'contrast'] } },
    density: { control: { type: 'radio', options: ['default', 'compact', 'comfortable'] } },
    shape: { control: { type: 'radio', options: ['default', 'square', 'soft'] } },
    elevation: { control: { type: 'radio', options: ['default', 'none', 'low', 'high'] } },
    tone: { control: { type: 'radio', options: ['default', 'brand', 'danger', 'success'] } },
    closeOnSelect: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' },
    typeahead: { control: 'boolean' }
  }
};

export default meta;

const cardStyle: React.CSSProperties = {
  border: '1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent)',
  borderRadius: 16,
  padding: 16,
  background: 'linear-gradient(168deg, #ffffff 0%, #f8fafc 100%)',
  boxShadow: '0 12px 28px rgba(15, 23, 42, 0.08)'
};

const baseItems = [
  {
    label: 'Create Follow-up Task',
    description: 'Assign a remediation owner',
    icon: <SaveIcon size={14} />,
    shortcut: 'T'
  },
  {
    label: 'Edit Incident Notes',
    description: 'Update timeline and context',
    icon: <SparklesIcon size={14} />,
    shortcut: 'E'
  },
  {
    label: 'Share with Command Center',
    description: 'Notify escalation room',
    icon: <UsersIcon size={14} />,
    shortcut: 'S'
  },
  { separator: true },
  {
    label: 'Move Incident',
    description: 'Transfer to another queue',
    icon: <ActivityIcon size={14} />,
    submenu: [
      { label: 'Critical Queue', description: 'On-call triage', shortcut: '1' },
      { label: 'Compliance Queue', description: 'Audit pathway', shortcut: '2' },
      { label: 'Archive', description: 'Resolved long-term', shortcut: '3' }
    ]
  },
  {
    label: 'Delete Incident',
    description: 'Requires supervisor approval',
    icon: <AlertTriangleIcon size={14} />,
    disabled: true
  }
];

export const Playground = (args: any) => (
  <Box style={{ ...cardStyle, maxInlineSize: 980 }}>
    <Grid style={{ display: 'grid', gap: 12 }}>
      <Flex align="center" justify="space-between" style={{ gap: 10, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Enterprise Incident Actions</div>
          <div style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13, marginTop: 4 }}>
            Validate navigation, submenu behavior, and action safety states.
          </div>
        </div>
        <Badge tone="brand">Playground</Badge>
      </Flex>

      <Box
        id="ctx-enterprise-anchor"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 110,
          borderRadius: 12,
          border: '1px dashed #94a3b8',
          color: '#334155',
          background: '#f8fafc'
        }}
      >
        Action Surface Anchor
      </Box>

      <ContextMenu
        {...args}
        anchorId={args.anchorId || 'ctx-enterprise-anchor'}
        items={baseItems as any}
        onSelect={(detail) => {
          toastAdvanced.info(\`\${detail.label || detail.value || 'Action'} selected\`, { duration: 900, theme: 'light' });
        }}
        onOpenDetail={(detail) => {
          if (detail.source !== 'attribute') {
            toastAdvanced.info(\`Menu \${detail.open ? 'opened' : 'closed'} via \${detail.source}\`, {
              duration: 850,
              theme: 'light'
            });
          }
        }}
      />
    </Grid>
  </Box>
);

Playground.args = {
  open: true,
  anchorId: 'ctx-enterprise-anchor',
  disabled: false,
  state: 'idle',
  stateText: '',
  variant: 'default',
  density: 'default',
  shape: 'default',
  elevation: 'default',
  tone: 'default',
  closeOnSelect: true,
  closeOnEscape: true,
  typeahead: true
};

export const IncidentWorkflow = () => {
  const [open, setOpen] = React.useState(false);
  const [point, setPoint] = React.useState<{ x: number; y: number } | undefined>(undefined);
  const [state, setState] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [lastAction, setLastAction] = React.useState('none');

  const stateText =
    state === 'loading'
      ? 'Syncing policy actions'
      : state === 'error'
        ? 'Action pipeline unavailable'
        : state === 'success'
          ? 'Action pipeline healthy'
          : '';

  return (
    <Box style={{ ...cardStyle, maxInlineSize: 980 }}>
      <Grid style={{ display: 'grid', gap: 12 }}>
        <Flex align="center" justify="space-between" style={{ gap: 10, flexWrap: 'wrap' }}>
          <Flex align="center" style={{ gap: 8 }}>
            <ShieldIcon size={15} />
            <span style={{ fontWeight: 700 }}>Critical Escalation Workspace</span>
          </Flex>
          <Badge tone={state === 'error' ? 'danger' : state === 'success' ? 'success' : 'brand'}>{state.toUpperCase()}</Badge>
        </Flex>

        <Box
          onContextMenu={(event) => {
            event.preventDefault();
            setPoint({ x: event.clientX, y: event.clientY });
            setOpen(true);
          }}
          style={{
            minHeight: 170,
            borderRadius: 12,
            border: '1px dashed #94a3b8',
            background: 'linear-gradient(160deg, #f8fafc 0%, #eef2ff 100%)',
            display: 'grid',
            placeItems: 'center',
            color: '#334155',
            fontWeight: 600
          }}
        >
          Right-click to open incident actions
        </Box>

        <ContextMenu
          open={open}
          anchorPoint={point}
          state={state}
          stateText={stateText}
          closeOnSelect
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          onSelect={(detail) => {
            setLastAction(detail.label || detail.value || 'unknown');
            toastAdvanced.success(\`\${detail.label || detail.value || 'Action'} executed\`, { duration: 1100, theme: 'light' });
          }}
          items={[
            {
              label: 'Run Safety Validation',
              description: 'Check protocol consistency',
              icon: <ClipboardCheckIcon size={14} />,
              shortcut: 'V'
            },
            {
              label: 'Refresh Incident Stream',
              description: 'Rehydrate event context',
              icon: <RefreshCwIcon size={14} />,
              shortcut: 'R'
            },
            {
              label: 'Escalate to Supervisor',
              description: 'Critical route',
              icon: <AlertTriangleIcon size={14} />,
              shortcut: 'X'
            }
          ] as any}
        />

        <Flex align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
          <Button
            size="sm"
            variant="secondary"
            startIcon={<RefreshCwIcon size={14} />}
            onClick={() => {
              setState('loading');
              toastAdvanced.loading('Syncing action policies...', { duration: 900, theme: 'light' });
              window.setTimeout(() => setState('idle'), 950);
            }}
          >
            Loading
          </Button>
          <Button
            size="sm"
            variant="secondary"
            startIcon={<AlertTriangleIcon size={14} />}
            onClick={() => {
              setState('error');
              toastAdvanced.error('Policy service timeout', { duration: 1300, theme: 'light' });
            }}
          >
            Error
          </Button>
          <Button
            size="sm"
            variant="secondary"
            startIcon={<CheckCircleIcon size={14} />}
            onClick={() => {
              setState('success');
              toastAdvanced.success('Policy checks passed', { duration: 1000, theme: 'light' });
            }}
          >
            Success
          </Button>
        </Flex>

        <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>Last action: {lastAction}</Box>
      </Grid>
    </Box>
  );
};

export const PersistentSelection = () => {
  const [last, setLast] = React.useState<string>('none');

  return (
    <Box style={{ ...cardStyle, maxInlineSize: 820 }}>
      <Grid style={{ display: 'grid', gap: 12 }}>
        <Flex align="center" justify="space-between" style={{ gap: 10, flexWrap: 'wrap' }}>
          <Badge tone="info">Persistent Selection</Badge>
          <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>Live preference panel</Box>
        </Flex>
        <Box
          id="ctx-functional"
          style={{
            padding: 16,
            border: '1px dashed #cbd5e1',
            borderRadius: 12,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            color: '#334155',
            background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)'
          }}
        >
          <SparklesIcon size={14} />
          Toggle options (menu stays open)
        </Box>
        <ContextMenu
          open
          anchorId="ctx-functional"
          closeOnSelect={false}
          density="comfortable"
          shape="soft"
          onSelect={(detail) => {
            setLast(\`\${detail.label || detail.value || 'item'}\${typeof detail.checked === 'boolean' ? \` (\${detail.checked ? 'on' : 'off'})\` : ''}\`);
          }}
        >
          <div slot="menu">
            <div className="section-label">Layout Preferences</div>
            <div className="menuitem" role="menuitemcheckbox" aria-checked="true" data-value="show-grid" tabIndex={0}>
              <span className="icon selection-icon" aria-hidden="true" />
              <span className="label"><span className="text">Show Grid</span><span className="caption">Visual alignment overlay</span></span>
              <span className="shortcut">Cmd+G</span>
            </div>
            <div className="menuitem" role="menuitemcheckbox" aria-checked="false" data-value="snap" tabIndex={0}>
              <span className="icon selection-icon" aria-hidden="true" />
              <span className="label"><span className="text">Snap to Guides</span><span className="caption">Precision drag behavior</span></span>
              <span className="shortcut">Alt+S</span>
            </div>
            <div className="menuitem" role="menuitemcheckbox" aria-checked="true" data-value="context-hints" tabIndex={0}>
              <span className="icon selection-icon" aria-hidden="true" />
              <span className="label"><span className="text">Context Hints</span><span className="caption">Inline action recommendations</span></span>
              <span className="shortcut">Cmd+H</span>
            </div>
            <div className="separator" role="separator" />
            <div className="section-label">Theme Mode</div>
            <div className="menuitem" role="menuitemradio" data-group="theme" aria-checked="true" data-value="theme-light" tabIndex={0}>
              <span className="icon selection-icon" aria-hidden="true" />
              <span className="label"><span className="text">Theme: Light</span><span className="caption">High contrast workspace</span></span>
              <span className="shortcut">1</span>
            </div>
            <div className="menuitem" role="menuitemradio" data-group="theme" aria-checked="false" data-value="theme-dark" tabIndex={0}>
              <span className="icon selection-icon" aria-hidden="true" />
              <span className="label"><span className="text">Theme: Dark</span><span className="caption">Low-glare night shift mode</span></span>
              <span className="shortcut">2</span>
            </div>
            <div className="menuitem" role="menuitemradio" data-group="theme" aria-checked="false" data-value="theme-system" tabIndex={0}>
              <span className="icon selection-icon" aria-hidden="true" />
              <span className="label"><span className="text">Theme: System</span><span className="caption">Follow OS color scheme</span></span>
              <span className="shortcut">3</span>
            </div>
          </div>
        </ContextMenu>

        <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>Last action: {last}</Box>
      </Grid>
    </Box>
  );
};
`,ee=`import React from 'react';
import {
  Alert,
  Badge,
  Box,
  Button,
  DataTable,
  EmptyState,
  Flex,
  Grid,
  Input,
  Pagination,
  Select,
  Skeleton
} from '@editora/ui-react';

export default {
  title: 'UI/DataTable',
  component: DataTable,
  argTypes: {
    pageSize: { control: { type: 'number', min: 3, max: 20, step: 1 } },
    shape: { control: { type: 'radio', options: ['default', 'square', 'soft'] } },
    variant: { control: { type: 'radio', options: ['default', 'flat', 'contrast'] } },
    elevation: { control: { type: 'radio', options: ['default', 'none', 'low', 'high'] } },
    striped: { control: 'boolean' },
    hover: { control: 'boolean' },
    stickyHeader: { control: 'boolean' },
    stickyFooter: { control: 'boolean' }
  }
};

const dashboardShellStyle: React.CSSProperties = {
  display: 'grid',
  gap: 'var(--ui-space-lg, 16px)',
  maxWidth: 1040
};

const panelStyle: React.CSSProperties = {
  border: '1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 74%, transparent)',
  borderRadius: 'calc(var(--ui-radius, 12px) + 4px)',
  background:
    'linear-gradient(180deg, color-mix(in srgb, var(--ui-color-surface, #ffffff) 98%, transparent), color-mix(in srgb, var(--ui-color-surface-alt, #f8fafc) 86%, transparent))',
  boxShadow: 'var(--ui-shadow-sm, 0 10px 24px rgba(15, 23, 42, 0.08))',
  padding: 'var(--ui-space-lg, 16px)'
};

const panelTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 'var(--ui-font-size-xl, 20px)',
  lineHeight: 1.3,
  color: 'var(--ui-color-text, #0f172a)',
  letterSpacing: '-0.01em'
};

const panelSubtitleStyle: React.CSSProperties = {
  margin: 'var(--ui-space-xs, 4px) 0 0',
  fontSize: 'var(--ui-font-size-md, 14px)',
  lineHeight: 1.45,
  color: 'var(--ui-color-muted, #64748b)'
};

const metricGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
  gap: 'var(--ui-space-sm, 8px)'
};

const metricCardStyle: React.CSSProperties = {
  border: '1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent)',
  borderRadius: 'var(--ui-radius, 12px)',
  background: 'color-mix(in srgb, var(--ui-color-surface, #ffffff) 95%, transparent)',
  padding: 'var(--ui-space-sm, 8px) var(--ui-space-md, 12px)'
};

const metricLabelStyle: React.CSSProperties = {
  fontSize: 'var(--ui-font-size-sm, 12px)',
  color: 'var(--ui-color-muted, #64748b)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em'
};

const metricValueStyle: React.CSSProperties = {
  marginTop: 'var(--ui-space-xs, 4px)',
  fontSize: 'var(--ui-font-size-xl, 20px)',
  color: 'var(--ui-color-text, #0f172a)',
  fontWeight: 700,
  lineHeight: 1.2
};

const toolbarStyle: React.CSSProperties = {
  display: 'flex',
  gap: 'var(--ui-space-sm, 8px)',
  flexWrap: 'wrap',
  alignItems: 'center'
};

const users = [
  { name: 'Ava Johnson', email: 'ava@acme.com', role: 'Admin', status: 'Active', signups: 12 },
  { name: 'Liam Carter', email: 'liam@acme.com', role: 'Manager', status: 'Invited', signups: 3 },
  { name: 'Mia Chen', email: 'mia@acme.com', role: 'Editor', status: 'Active', signups: 8 },
  { name: 'Noah Patel', email: 'noah@acme.com', role: 'Editor', status: 'Suspended', signups: 1 },
  { name: 'Emma Garcia', email: 'emma@acme.com', role: 'Analyst', status: 'Active', signups: 9 },
  { name: 'Lucas Brown', email: 'lucas@acme.com', role: 'Manager', status: 'Active', signups: 14 },
  { name: 'Sophia Miller', email: 'sophia@acme.com', role: 'Admin', status: 'Invited', signups: 2 },
  { name: 'Ethan Wilson', email: 'ethan@acme.com', role: 'Editor', status: 'Active', signups: 6 },
  { name: 'Olivia Moore', email: 'olivia@acme.com', role: 'Analyst', status: 'Active', signups: 11 },
  { name: 'James Taylor', email: 'james@acme.com', role: 'Editor', status: 'Suspended', signups: 4 },
  { name: 'Charlotte Davis', email: 'charlotte@acme.com', role: 'Admin', status: 'Active', signups: 16 },
  { name: 'Benjamin Lee', email: 'benjamin@acme.com', role: 'Manager', status: 'Active', signups: 10 }
];

const orders = [
  { id: 'ORD-1048', customer: 'Northstar LLC', total: '$5,420', status: 'Paid', placed: '2026-02-19' },
  { id: 'ORD-1047', customer: 'Urban Grid', total: '$1,280', status: 'Pending', placed: '2026-02-19' },
  { id: 'ORD-1046', customer: 'Summit Lab', total: '$2,730', status: 'Paid', placed: '2026-02-18' },
  { id: 'ORD-1045', customer: 'Cloudline', total: '$940', status: 'Refunded', placed: '2026-02-18' },
  { id: 'ORD-1044', customer: 'Pixel Grove', total: '$3,105', status: 'Pending', placed: '2026-02-17' },
  { id: 'ORD-1043', customer: 'Blue Harbor', total: '$620', status: 'Paid', placed: '2026-02-16' },
  { id: 'ORD-1042', customer: 'Nimble Ops', total: '$4,420', status: 'Failed', placed: '2026-02-15' },
  { id: 'ORD-1041', customer: 'Atlas Media', total: '$2,040', status: 'Paid', placed: '2026-02-15' }
];

const virtualRows = Array.from({ length: 1200 }, (_, index) => {
  const idx = index + 1;
  return {
    id: \`USR-\${String(idx).padStart(4, '0')}\`,
    name: \`User \${idx}\`,
    email: \`user\${idx}@acme.com\`,
    team: ['Design', 'Engineering', 'Product', 'Ops'][index % 4],
    active: index % 7 !== 0 ? 'Active' : 'Idle'
  };
});

function statusTone(status: string): 'success' | 'warning' | 'danger' | 'info' {
  if (status === 'Active' || status === 'Paid') return 'success';
  if (status === 'Pending' || status === 'Invited') return 'warning';
  if (status === 'Suspended' || status === 'Failed' || status === 'Refunded') return 'danger';
  return 'info';
}

export const UsersTable = (args: any) => {
  const [page, setPage] = React.useState(1);
  const [selected, setSelected] = React.useState<number[]>([]);
  const totalSignups = React.useMemo(() => users.reduce((sum, row) => sum + row.signups, 0), []);

  return (
    <Grid style={dashboardShellStyle}>
      <Box style={panelStyle}>
        <Flex style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--ui-space-md, 12px)', flexWrap: 'wrap' }}>
          <div>
            <h3 style={panelTitleStyle}>Workforce Access Directory</h3>
            <p style={panelSubtitleStyle}>Operational user inventory with multi-select workflows and in-row actions.</p>
          </div>
          <Badge tone="brand" variant="soft">Directory</Badge>
        </Flex>

        <Grid style={{ ...metricGridStyle, marginTop: 'var(--ui-space-md, 12px)' }}>
          <Box style={metricCardStyle}>
            <div style={metricLabelStyle}>Total Records</div>
            <div style={metricValueStyle}>{users.length}</div>
          </Box>
          <Box style={metricCardStyle}>
            <div style={metricLabelStyle}>Selected</div>
            <div style={metricValueStyle}>{selected.length}</div>
          </Box>
          <Box style={metricCardStyle}>
            <div style={metricLabelStyle}>Current Page</div>
            <div style={metricValueStyle}>{page}</div>
          </Box>
        </Grid>
      </Box>

      <DataTable
        sortable
        selectable
        multiSelect
        shape={args.shape}
        variant={args.variant}
        elevation={args.elevation}
        striped={args.striped}
        hover={args.hover}
        stickyHeader={args.stickyHeader}
        stickyFooter={args.stickyFooter}
        page={page}
        pageSize={args.pageSize}
        paginationId="users-pagination"
        onPageChange={(detail) => setPage(detail.page)}
        onRowSelect={(detail) => setSelected(detail.indices)}
      >
        <table>
          <caption>Click row actions to validate that controls do not toggle row selection.</caption>
          <thead>
            <tr>
              <th data-key="name">Name</th>
              <th data-key="email">Email</th>
              <th data-key="role">Role</th>
              <th data-key="status">Status</th>
              <th data-key="signups">Signups</th>
              <th data-key="actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((row) => (
              <tr key={row.email}>
                <td>{row.name}</td>
                <td>{row.email}</td>
                <td>{row.role}</td>
                <td>
                  <Badge tone={statusTone(row.status)} variant="soft" size="sm">
                    {row.status}
                  </Badge>
                </td>
                <td>{row.signups}</td>
                <td>
                  <Button size="sm" variant="ghost">View</Button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4}>Total signups</td>
              <td>{totalSignups}</td>
              <td>{selected.length ? \`\${selected.length} selected\` : ''}</td>
            </tr>
          </tfoot>
        </table>
      </DataTable>

      <Flex style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--ui-space-sm, 8px)', flexWrap: 'wrap' }}>
        <Box style={{ fontSize: 'var(--ui-font-size-md, 14px)', color: 'var(--ui-color-muted, #64748b)' }}>
          Selected users: {selected.length ? selected.length : 'none'}
        </Box>
        <Pagination id="users-pagination" page={String(page)} />
      </Flex>
    </Grid>
  );
};

UsersTable.args = {
  pageSize: 6,
  shape: 'default',
  variant: 'default',
  elevation: 'default',
  striped: true,
  hover: true,
  stickyHeader: false,
  stickyFooter: false
};

export const ShapeVariants = () => (
  <Grid style={dashboardShellStyle}>
    <Box style={panelStyle}>
      <h3 style={panelTitleStyle}>Shape + Surface Variants</h3>
      <p style={panelSubtitleStyle}>Use square corners and flat surfaces for utility-heavy enterprise screens, or softer/elevated styles for dashboards.</p>
    </Box>

    <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--ui-space-md, 12px)' }}>
      <Box style={panelStyle}>
        <h4 style={{ margin: 0, fontSize: 'var(--ui-font-size-lg, 16px)', color: 'var(--ui-color-text, #0f172a)' }}>Default</h4>
        <p style={{ ...panelSubtitleStyle, marginBottom: 'var(--ui-space-sm, 8px)' }}>Balanced rounded enterprise table</p>
        <DataTable sortable hover striped pageSize={4}>
          <table>
            <thead>
              <tr>
                <th data-key="id">Order</th>
                <th data-key="customer">Customer</th>
                <th data-key="status">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 4).map((row) => (
                <tr key={\`default-\${row.id}\`}>
                  <td>{row.id}</td>
                  <td>{row.customer}</td>
                  <td><Badge tone={statusTone(row.status)} variant="soft" size="sm">{row.status}</Badge></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}>Visible rows</td>
                <td>{orders.slice(0, 4).length}</td>
              </tr>
            </tfoot>
          </table>
        </DataTable>
      </Box>

      <Box style={panelStyle}>
        <h4 style={{ margin: 0, fontSize: 'var(--ui-font-size-lg, 16px)', color: 'var(--ui-color-text, #0f172a)' }}>Flat Square</h4>
        <p style={{ ...panelSubtitleStyle, marginBottom: 'var(--ui-space-sm, 8px)' }}>Minimal shape for dense operations</p>
        <DataTable sortable hover striped stickyFooter shape="square" variant="flat" elevation="none" pageSize={4}>
          <table>
            <thead>
              <tr>
                <th data-key="id">Order</th>
                <th data-key="customer">Customer</th>
                <th data-key="status">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 4).map((row) => (
                <tr key={\`flat-\${row.id}\`}>
                  <td>{row.id}</td>
                  <td>{row.customer}</td>
                  <td><Badge tone={statusTone(row.status)} variant="soft" size="sm">{row.status}</Badge></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}>Flat footer</td>
                <td>Sticky</td>
              </tr>
            </tfoot>
          </table>
        </DataTable>
      </Box>

      <Box style={panelStyle}>
        <h4 style={{ margin: 0, fontSize: 'var(--ui-font-size-lg, 16px)', color: 'var(--ui-color-text, #0f172a)' }}>Soft High Elevation</h4>
        <p style={{ ...panelSubtitleStyle, marginBottom: 'var(--ui-space-sm, 8px)' }}>Premium dashboard card treatment</p>
        <DataTable sortable hover striped stickyFooter shape="soft" elevation="high" pageSize={4}>
          <table>
            <thead>
              <tr>
                <th data-key="id">Order</th>
                <th data-key="customer">Customer</th>
                <th data-key="status">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 4).map((row) => (
                <tr key={\`soft-\${row.id}\`}>
                  <td>{row.id}</td>
                  <td>{row.customer}</td>
                  <td><Badge tone={statusTone(row.status)} variant="soft" size="sm">{row.status}</Badge></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}>Surface style</td>
                <td>Soft + High</td>
              </tr>
            </tfoot>
          </table>
        </DataTable>
      </Box>
    </Grid>
  </Grid>
);

export const OrdersTable = () => {
  const [page, setPage] = React.useState(1);
  const paidOrders = React.useMemo(() => orders.filter((order) => order.status === 'Paid').length, []);

  return (
    <Grid style={dashboardShellStyle}>
      <Box style={panelStyle}>
        <Flex style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--ui-space-md, 12px)', flexWrap: 'wrap' }}>
          <div>
            <h3 style={panelTitleStyle}>Order Pipeline</h3>
            <p style={panelSubtitleStyle}>Live commerce orders sorted by status, payout amount, and settlement date.</p>
          </div>
          <Badge tone="info" variant="soft">Revenue Ops</Badge>
        </Flex>
      </Box>
      <DataTable
        sortable
        striped
        hover
        stickyHeader
        stickyFooter
        page={page}
        pageSize={4}
        paginationId="orders-pagination"
        onPageChange={(detail) => setPage(detail.page)}
      >
        <table>
          <caption>Sortable order ledger for finance and support triage.</caption>
          <thead>
            <tr>
              <th data-key="id">Order</th>
              <th data-key="customer">Customer</th>
              <th data-key="total">Total</th>
              <th data-key="status">Status</th>
              <th data-key="placed">Placed</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.customer}</td>
                <td>{row.total}</td>
                <td>
                  <Badge tone={statusTone(row.status)} variant="soft" size="sm">
                    {row.status}
                  </Badge>
                </td>
                <td>{row.placed}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3}>Paid orders</td>
              <td>{paidOrders}</td>
              <td>{orders.length} total</td>
            </tr>
          </tfoot>
        </table>
      </DataTable>

      <Flex style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Pagination id="orders-pagination" page={String(page)} />
      </Flex>
    </Grid>
  );
};

export const FilterResizeReorder = () => {
  const [query, setQuery] = React.useState('');
  const [column, setColumn] = React.useState('all');
  const [order, setOrder] = React.useState('name,email,role,status,signups');
  const [page, setPage] = React.useState(1);
  const [stats, setStats] = React.useState({ total: users.length, filtered: users.length });

  return (
    <Grid style={dashboardShellStyle}>
      <Box style={panelStyle}>
        <h3 style={panelTitleStyle}>Analyst View Builder</h3>
        <p style={panelSubtitleStyle}>Filter by token, resize columns, and drag headers to curate review-ready layouts.</p>
      </Box>

      <Flex style={toolbarStyle}>
        <Input
          value={query}
          onChange={(next) => {
            setQuery(next);
            setPage(1);
          }}
          placeholder="Filter users..."
          style={{ minWidth: 220 }}
        />
        <Select
          value={column}
          onChange={(next) => {
            setColumn(next);
            setPage(1);
          }}
        >
          <option value="all">All columns</option>
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="role">Role</option>
          <option value="status">Status</option>
        </Select>
        <Button size="sm" variant="secondary" onClick={() => setOrder('name,email,role,status,signups')}>
          Default order
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setOrder('status,name,role,email,signups')}>
          Status-first
        </Button>
        <Box style={{ fontSize: 'var(--ui-font-size-sm, 12px)', color: 'var(--ui-color-muted, #64748b)' }}>
          Drag table headers to reorder columns
        </Box>
      </Flex>

      <DataTable
        sortable
        draggableColumns
        striped
        hover
        resizableColumns
        filterQuery={query}
        filterColumn={column === 'all' ? undefined : column}
        columnOrder={order}
        page={page}
        pageSize={5}
        paginationId="filter-pagination"
        onPageChange={(detail) => setPage(detail.page)}
        onFilterChange={(detail) => setStats({ total: detail.total, filtered: detail.filtered })}
        onColumnOrderChange={(detail) => setOrder(detail.order)}
      >
        <table>
          <caption>Interactive analyst table with drag/reorder/resize behaviors.</caption>
          <thead>
            <tr>
              <th data-key="name">Name</th>
              <th data-key="email">Email</th>
              <th data-key="role">Role</th>
              <th data-key="status">Status</th>
              <th data-key="signups">Signups</th>
            </tr>
          </thead>
          <tbody>
            {users.map((row) => (
              <tr key={row.email}>
                <td>{row.name}</td>
                <td>{row.email}</td>
                <td>{row.role}</td>
                <td>
                  <Badge tone={statusTone(row.status)} variant="soft" size="sm">
                    {row.status}
                  </Badge>
                </td>
                <td>{row.signups}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>

      <Flex style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box style={{ fontSize: 'var(--ui-font-size-md, 14px)', color: 'var(--ui-color-muted, #64748b)' }}>
          Matched {stats.filtered} of {stats.total} users
        </Box>
        <Box style={{ fontSize: 'var(--ui-font-size-sm, 12px)', color: 'var(--ui-color-muted, #64748b)' }}>
          Order: <code>{order}</code>
        </Box>
        <Pagination id="filter-pagination" page={String(page)} />
      </Flex>
    </Grid>
  );
};

export const VirtualizedLargeDataset = () => {
  const [query, setQuery] = React.useState('');
  const [range, setRange] = React.useState({ start: 0, end: 0, visible: 0, total: virtualRows.length });

  return (
    <Grid style={dashboardShellStyle}>
      <Box style={panelStyle}>
        <h3 style={panelTitleStyle}>Large Dataset Performance</h3>
        <p style={panelSubtitleStyle}>Virtualized rendering with overscan keeps interaction smooth at 1,200+ rows.</p>
      </Box>

      <Flex style={{ ...toolbarStyle, justifyContent: 'space-between' }}>
        <Input
          value={query}
          onChange={(next) => setQuery(next)}
          placeholder="Filter large dataset..."
          style={{ minWidth: 240 }}
        />
        <Box style={{ fontSize: 'var(--ui-font-size-md, 14px)', color: 'var(--ui-color-muted, #64748b)' }}>
          Window: {range.start + 1}-{Math.max(range.start + 1, range.end + 1)} / {range.total} (visible {range.visible})
        </Box>
      </Flex>

      <DataTable
        virtualize
        sortable
        striped
        hover
        stickyHeader
        pageSize={2000}
        rowHeight={44}
        overscan={8}
        filterQuery={query}
        style={{ ['--ui-data-table-virtual-height' as any]: '460px' }}
        onVirtualRangeChange={(detail) => setRange(detail)}
      >
        <table>
          <caption>Virtualized enterprise directory. Scroll to test range window updates.</caption>
          <thead>
            <tr>
              <th data-key="id">ID</th>
              <th data-key="name">Name</th>
              <th data-key="email">Email</th>
              <th data-key="team">Team</th>
              <th data-key="active">State</th>
            </tr>
          </thead>
          <tbody>
            {virtualRows.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.name}</td>
                <td>{row.email}</td>
                <td>{row.team}</td>
                <td>
                  <Badge tone={row.active === 'Active' ? 'success' : 'warning'} variant="soft" size="sm">
                    {row.active}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
    </Grid>
  );
};

export const AccessibilityKeyboardMap = () => (
  <Grid style={dashboardShellStyle}>
    <Box
      style={{
        border: '1px solid color-mix(in srgb, var(--ui-color-primary, #2563eb) 22%, var(--ui-color-border, #cbd5e1))',
        borderRadius: 'var(--ui-radius, 12px)',
        background: 'color-mix(in srgb, var(--ui-color-primary, #2563eb) 6%, var(--ui-color-surface-alt, #f8fafc))',
        color: 'color-mix(in srgb, var(--ui-color-primary, #2563eb) 74%, #0f172a 26%)',
        fontSize: 'var(--ui-font-size-md, 14px)',
        padding: 'var(--ui-space-md, 12px)',
        lineHeight: 1.5
      }}
    >
      Header keys: <strong>Enter/Space</strong> sort, <strong>Arrow Left/Right</strong> move focus,
      <strong>Alt + Arrow Left/Right</strong> reorder columns, <strong>Home/End</strong> jump first/last header.
      Row keys (when selectable): <strong>Arrow Up/Down</strong> move row focus,
      <strong>Space/Enter</strong> toggle selection. Pointer: drag resize handles to resize columns.
      In <strong>RTL</strong>, left/right shortcuts are mirrored.
    </Box>

    <Box dir="rtl" style={{ border: '1px solid var(--ui-color-border, #cbd5e1)', borderRadius: 'var(--ui-radius, 12px)', padding: 'var(--ui-space-md, 12px)' }}>
      <h4 style={{ margin: '0 0 10px' }}>RTL Preview</h4>
      <DataTable sortable draggableColumns striped hover>
        <table>
          <thead>
            <tr>
              <th data-key="name">Name</th>
              <th data-key="role">Role</th>
              <th data-key="status">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Ava Johnson</td><td>Admin</td><td>Active</td></tr>
            <tr><td>Mia Chen</td><td>Editor</td><td>Invited</td></tr>
            <tr><td>Noah Patel</td><td>Analyst</td><td>Suspended</td></tr>
          </tbody>
        </table>
      </DataTable>
    </Box>
  </Grid>
);

export const LoadingErrorEmptyMatrix = () => (
  <Grid style={{ display: 'grid', gap: 'var(--ui-space-md, 12px)' }}>
    <Box style={panelStyle}>
      <h3 style={panelTitleStyle}>Operational States Matrix</h3>
      <p style={panelSubtitleStyle}>Demonstrates loading, error, empty, and success table states for production flows.</p>
    </Box>

    <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
      <Box style={{ border: '1px solid var(--ui-color-border, #cbd5e1)', borderRadius: 'calc(var(--ui-radius, 12px) + 2px)', padding: 'var(--ui-space-lg, 16px)' }}>
        <h4 style={{ margin: '0 0 10px' }}>Loading</h4>
        <DataTable loading state="loading" stateText="Syncing billing records">
          <table>
            <thead>
              <tr>
                <th data-key="metric">Metric</th>
                <th data-key="value">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Pending invoices</td><td><Skeleton variant="text" count={1} animated /></td></tr>
              <tr><td>Open disputes</td><td><Skeleton variant="text" count={1} animated /></td></tr>
            </tbody>
          </table>
        </DataTable>
      </Box>

      <Box style={{ border: '1px solid var(--ui-color-border, #cbd5e1)', borderRadius: 'calc(var(--ui-radius, 12px) + 2px)', padding: 'var(--ui-space-lg, 16px)' }}>
        <h4 style={{ margin: '0 0 10px' }}>Error</h4>
        <DataTable state="error" stateText="Orders API timeout, retry required">
          <table>
            <thead>
              <tr>
                <th data-key="metric">Metric</th>
                <th data-key="value">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Failed requests</td><td>12</td></tr>
              <tr><td>Last healthy sync</td><td>2m ago</td></tr>
            </tbody>
          </table>
        </DataTable>
        <Box style={{ marginTop: 'var(--ui-space-sm, 8px)' }}>
          <Alert
            tone="danger"
            title="Could not fetch orders"
            description="API returned 502. Retry or contact platform team."
            dismissible
          >
            <Box slot="actions">
              <Button size="sm">Retry</Button>
            </Box>
          </Alert>
        </Box>
      </Box>

      <Box style={{ border: '1px solid var(--ui-color-border, #cbd5e1)', borderRadius: 'calc(var(--ui-radius, 12px) + 2px)', padding: 'var(--ui-space-lg, 16px)' }}>
        <h4 style={{ margin: '0 0 10px' }}>Empty</h4>
        <EmptyState
          title="No orders in this range"
          description="Try a different date range or create a manual order."
          actionLabel="Create order"
          compact
        />
      </Box>
    </Grid>

    <Box style={{ border: '1px solid var(--ui-color-border, #cbd5e1)', borderRadius: 'calc(var(--ui-radius, 12px) + 2px)', padding: 'var(--ui-space-lg, 16px)' }}>
      <h4 style={{ margin: '0 0 10px' }}>Success</h4>
      <DataTable sortable striped hover state="success" stateText="Data quality checks passed" page={1} pageSize={3}>
        <table>
          <thead>
            <tr>
              <th data-key="metric">Metric</th>
              <th data-key="value">Value</th>
              <th data-key="trend">Trend</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Daily Active Users</td><td>2,184</td><td>+8.4%</td></tr>
            <tr><td>Conversion Rate</td><td>4.9%</td><td>+0.7%</td></tr>
            <tr><td>Avg. Response Time</td><td>218ms</td><td>-12ms</td></tr>
          </tbody>
        </table>
      </DataTable>
    </Box>
  </Grid>
);

export const PinnedFilterBuilderBulkActions = () => {
  const [query, setQuery] = React.useState('');
  const [role, setRole] = React.useState('all');
  const [status, setStatus] = React.useState('all');
  const [minSignups, setMinSignups] = React.useState('0');
  const [page, setPage] = React.useState(1);
  const [selected, setSelected] = React.useState<number[]>([]);
  const [pinMode, setPinMode] = React.useState<'default' | 'analytics'>('default');
  const [message, setMessage] = React.useState('');

  const filterRules = React.useMemo(() => {
    const rules: Array<{ column: string; op: 'equals' | 'gte'; value: string | number }> = [];
    if (role !== 'all') rules.push({ column: 'role', op: 'equals', value: role });
    if (status !== 'all') rules.push({ column: 'status', op: 'equals', value: status });
    const min = Number(minSignups);
    if (Number.isFinite(min) && min > 0) rules.push({ column: 'signups', op: 'gte', value: min });
    return rules;
  }, [role, status, minSignups]);

  const pinColumns = pinMode === 'analytics'
    ? { left: ['status'], right: ['signups'] }
    : { left: ['name'], right: ['signups'] };

  return (
    <Grid style={dashboardShellStyle}>
      <Box style={panelStyle}>
        <h3 style={panelTitleStyle}>Pinned Columns + Bulk Operations</h3>
        <p style={panelSubtitleStyle}>Segment users by filter rules, keep critical columns pinned, and run bulk workflows.</p>
      </Box>

      <Flex style={toolbarStyle}>
        <Input
          value={query}
          onChange={(next) => {
            setQuery(next);
            setPage(1);
          }}
          placeholder="Search by token..."
          style={{ minWidth: 200 }}
        />
        <Select value={role} onChange={(next) => setRole(next)}>
          <option value="all">Any role</option>
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="Editor">Editor</option>
          <option value="Analyst">Analyst</option>
        </Select>
        <Select value={status} onChange={(next) => setStatus(next)}>
          <option value="all">Any status</option>
          <option value="Active">Active</option>
          <option value="Invited">Invited</option>
          <option value="Suspended">Suspended</option>
        </Select>
        <Input
          type="number"
          value={minSignups}
          onChange={(next) => setMinSignups(next)}
          placeholder="Min signups"
          style={{ width: 110 }}
        />
        <Button size="sm" variant="secondary" onClick={() => setPinMode((mode) => (mode === 'default' ? 'analytics' : 'default'))}>
          Pin mode: {pinMode}
        </Button>
      </Flex>

      <DataTable
        sortable
        selectable
        multiSelect
        striped
        hover
        stickyHeader
        draggableColumns
        resizableColumns
        page={page}
        pageSize={6}
        paginationId="pinned-pagination"
        filterQuery={query}
        filterRules={filterRules}
        pinColumns={pinColumns}
        bulkActionsLabel="{count} rows selected"
        bulkClearLabel="Clear"
        onPageChange={(detail) => setPage(detail.page)}
        onRowSelect={(detail) => setSelected(detail.indices)}
        onBulkClear={() => {
          setSelected([]);
          setMessage('Selection cleared');
          window.setTimeout(() => setMessage(''), 1000);
        }}
      >
        <Button
          slot="bulk-actions"
          size="sm"
          variant="secondary"
          onClick={() => setMessage(\`Exporting \${selected.length || 0} selected rows\`)}
        >
          Export selected
        </Button>
        <Button
          slot="bulk-actions"
          size="sm"
          variant="ghost"
          onClick={() => setMessage(\`Assigning \${selected.length || 0} users to campaign\`)}
        >
          Assign campaign
        </Button>

        <table>
          <caption>Pinned-column campaign table with reusable bulk actions.</caption>
          <thead>
            <tr>
              <th data-key="name">Name</th>
              <th data-key="email">Email</th>
              <th data-key="role">Role</th>
              <th data-key="status">Status</th>
              <th data-key="signups">Signups</th>
            </tr>
          </thead>
          <tbody>
            {users.map((row) => (
              <tr key={row.email}>
                <td>{row.name}</td>
                <td>{row.email}</td>
                <td>{row.role}</td>
                <td>
                  <Badge tone={statusTone(row.status)} variant="soft" size="sm">
                    {row.status}
                  </Badge>
                </td>
                <td>{row.signups}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>

      <Flex style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <Box style={{ fontSize: 'var(--ui-font-size-md, 14px)', color: 'var(--ui-color-muted, #64748b)' }}>
          Selected rows: <strong>{selected.length}</strong> {message ? \`• \${message}\` : ''}
        </Box>
        <Pagination id="pinned-pagination" page={String(page)} />
      </Flex>
    </Grid>
  );
};
`,te=`import React from 'react';
import {
  Badge,
  Box,
  Button,
  DatePicker,
  DateRangePicker,
  DateRangeTimePicker,
  DateTimePicker,
  Grid,
  TimePicker
} from '@editora/ui-react';

export default {
  title: 'UI/Date Time Pickers'
};

function useForcedMobileSheet(enabled: boolean) {
  React.useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;
    const original = window.matchMedia;
    const forced = ((query: string) => {
      if (query.includes('(max-width: 639px)')) {
        return {
          matches: true,
          media: query,
          onchange: null,
          addListener() {},
          removeListener() {},
          addEventListener() {},
          removeEventListener() {},
          dispatchEvent() {
            return false;
          }
        } as MediaQueryList;
      }
      return original.call(window, query);
    }) as typeof window.matchMedia;

    window.matchMedia = forced;
    return () => {
      window.matchMedia = original;
    };
  }, [enabled]);
}

export const SingleDate = () => {
  const [value, setValue] = React.useState<string | null>('2026-02-23');

  return (
    <Box w="min(560px, 100%)" variant="elevated" p="14px" radius="xl">
      <Grid gap="10px">
        <Badge tone="brand">Single date picker</Badge>
        <DatePicker
          // label="Admission date"
          hint="Accepts ISO and locale-like input."
          value={value || undefined}
          min="2026-01-01"
          max="2026-12-31"
          onValueChange={(next:any) => setValue(next)}
          clearable
          bare
          showFooter={false}
        />
        <Box bg="surface" p="10px" radius="lg">
          Current value: {value || "null"}
        </Box>
      </Grid>
    </Box>
  );
};

export const DatePickerEnterpriseStates = () => {
  const [value, setValue] = React.useState<string | null>('2026-08-14');
  const [invalidReason, setInvalidReason] = React.useState('');

  return (
    <Grid gap="12px" style={{ maxWidth: 960 }}>
      <Box variant="elevated" p="16px" radius="xl">
        <Grid gap="8px">
          <Badge tone="brand">Enterprise date picker states</Badge>
          <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: '14px' }}>
            Includes loading/success visuals, square + soft shape variants, and reversed min/max safety.
          </Box>
        </Grid>
      </Box>

      <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
        <Box variant="elevated" p="14px" radius="lg">
          <Grid gap="8px">
            <Badge tone="info">Default</Badge>
            <DatePicker
              label="Procedure date"
              hint="Normal popover interaction"
              value={value || undefined}
              clearable
              onValueChange={(next) => setValue(next)}
              onInvalid={(detail) => setInvalidReason(detail.reason)}
            />
          </Grid>
        </Box>

        <Box variant="elevated" p="14px" radius="lg">
          <Grid gap="8px">
            <Badge tone="warning">Loading</Badge>
            <DatePicker
              label="Syncing schedule"
              state="loading"
              hint="Interaction is blocked while loading."
              value={value || undefined}
              shape="square"
            />
          </Grid>
        </Box>

        <Box variant="elevated" p="14px" radius="lg">
          <Grid gap="8px">
            <Badge tone="success">Success + Soft</Badge>
            <DatePicker
              label="Confirmed date"
              state="success"
              hint="Soft corners for dashboard surfaces."
              value={value || undefined}
              shape="soft"
            />
          </Grid>
        </Box>
      </Grid>

      <Box variant="elevated" p="14px" radius="lg">
        <Grid gap="8px">
          <Badge tone="danger">Edge case: reversed bounds</Badge>
          <DatePicker
            label="Auto-corrected bounds"
            hint="\`min\` is intentionally later than \`max\`; component normalizes internally."
            min="2026-12-31"
            max="2026-01-01"
            defaultValue="2026-06-15"
            clearable
          />
          <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: '12px' }}>
            Last invalid reason: {invalidReason || 'none'}
          </Box>
        </Grid>
      </Box>
    </Grid>
  );
};

export const DateRange = () => {
  const [value, setValue] = React.useState('{"start":"2026-02-10","end":"2026-02-18"}');

  return (
    <Box w="min(760px, 100%)" variant="elevated" p="14px" radius="xl">
      <Grid gap="10px">
        <Badge tone="success">Date range picker</Badge>
        <DateRangePicker
          label="Billing cycle"
          hint="Choose a range for reports."
          value={value}
          rangeVariant="two-fields"
          closeOnSelect={false}
          onValueChange={(next) => setValue(next || "")}
          bare
          showFooter={false}
        />
        <Box bg="surface" p="10px" radius="lg">
          Current value: {value || "null"}
        </Box>
      </Grid>
    </Box>
  );
};

export const DateRangeEnterpriseStates = () => {
  const [value, setValue] = React.useState('{"start":"2026-09-01","end":"2026-09-07"}');
  const [invalidReason, setInvalidReason] = React.useState('');

  return (
    <Grid gap="12px" style={{ maxWidth: 980 }}>
      <Box variant="elevated" p="16px" radius="xl">
        <Grid gap="8px">
          <Badge tone="brand">Enterprise date range states</Badge>
          <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: '14px' }}>
            Covers loading/success states, single-field parsing, and reversed min/max normalization.
          </Box>
        </Grid>
      </Box>

      <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
        <Box variant="elevated" p="14px" radius="lg">
          <Grid gap="8px">
            <Badge tone="info">Two-field default</Badge>
            <DateRangePicker
              label="Coverage window"
              hint="Operational range for claims analysis."
              value={value}
              onValueChange={(next) => setValue(next || '')}
              onInvalid={(detail) => setInvalidReason(detail.reason)}
              clearable
            />
          </Grid>
        </Box>

        <Box variant="elevated" p="14px" radius="lg">
          <Grid gap="8px">
            <Badge tone="warning">Loading + square</Badge>
            <DateRangePicker
              label="Syncing date range"
              hint="Inputs/actions are blocked during background sync."
              value={value}
              state="loading"
              shape="square"
            />
          </Grid>
        </Box>

        <Box variant="elevated" p="14px" radius="lg">
          <Grid gap="8px">
            <Badge tone="success">Single-field + soft</Badge>
            <DateRangePicker
              label="Review range"
              hint="Single-field parser accepts: \`Sep 1 2026 — Sep 7 2026\`."
              value={value}
              rangeVariant="single-field"
              state="success"
              shape="soft"
            />
          </Grid>
        </Box>
      </Grid>

      <Box variant="elevated" p="14px" radius="lg">
        <Grid gap="8px">
          <Badge tone="danger">Edge case: reversed bounds + strict rules</Badge>
          <DateRangePicker
            label="Strict range"
            hint="\`min\` is later than \`max\`, and same-day/partial ranges are disabled."
            min="2026-12-31"
            max="2026-01-01"
            defaultValue='{"start":"2026-06-15","end":"2026-06-20"}'
            allowPartial={false}
            allowSameDay={false}
            clearable
          />
          <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: '12px' }}>
            Last invalid reason: {invalidReason || 'none'}
          </Box>
        </Grid>
      </Box>
    </Grid>
  );
};

export const TimeOnly = () => {
  const [value, setValue] = React.useState<string | null>('09:30');

  return (
    <Box w="min(560px, 100%)" variant="elevated" p="14px" radius="xl">
      <Grid gap="10px">
        <Badge tone="warning">Time picker</Badge>
        <TimePicker
          label="Shift start"
          hint="Arrow up/down steps by configured minutes."
          value={value || undefined}
          format="24h"
          step={5}
          min="06:00"
          max="23:00"
          onValueChange={(next) => setValue(next)}
        />
        <Box bg="surface" p="10px" radius="lg">
          Current value: {value || 'null'}
        </Box>
      </Grid>
    </Box>
  );
};

export const DateTime = () => {
  const [value, setValue] = React.useState<string | null>('2026-02-23T09:30');

  return (
    <Box w="min(760px, 100%)" variant="elevated" p="14px" radius="xl">
      <Grid gap="10px">
        <Badge tone="brand">Date-time picker</Badge>
        <DateTimePicker
          label="Procedure schedule"
          value={value || undefined}
          step={10}
          min="2026-02-01T08:00"
          max="2026-03-15T20:00"
          onValueChange={(next) => setValue(next)}
        />
        <Box bg="surface" p="10px" radius="lg">
          Current value: {value || 'null'}
        </Box>
      </Grid>
    </Box>
  );
};

export const DateRangeTime = () => {
  const [value, setValue] = React.useState(
    '{"start":"2026-02-23T09:00","end":"2026-02-23T12:30"}'
  );

  return (
    <Box w="min(860px, 100%)" variant="elevated" p="14px" radius="xl">
      <Grid gap="10px">
        <Badge tone="danger">Range date-time picker</Badge>
        <DateRangeTimePicker
          label="Operating room slot"
          hint="Complete range with date and time."
          value={value}
          step={15}
          autoNormalize
          allowPartial={false}
          min="2026-02-01T06:00"
          max="2026-12-31T23:00"
          onValueChange={(next) => setValue(next || '')}
        />
        <Box bg="surface" p="10px" radius="lg">
          Current value: {value || 'null'}
        </Box>
      </Grid>
    </Box>
  );
};

export const BareAndFooterVariants = () => {
  const [singleValue, setSingleValue] = React.useState<string | null>('2026-04-10');
  const [rangeValue, setRangeValue] = React.useState('{"start":"2026-04-08","end":"2026-04-14"}');
  const [dateTimeValue, setDateTimeValue] = React.useState<string | null>('2026-04-10T10:30');
  const [rangeTimeValue, setRangeTimeValue] = React.useState(
    '{"start":"2026-04-10T08:00","end":"2026-04-10T12:00"}'
  );

  return (
    <Grid gap="12px" style={{ maxWidth: 1100 }}>
      <Box variant="elevated" p="16px" radius="xl">
        <Grid gap="8px">
          <Badge tone="brand">\`bare\` + \`showFooter\` configuration</Badge>
          <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: '14px' }}>
            Use <code>bare</code> for flat/no-panel chrome and <code>showFooter</code> to control actions.
            Calendar-only inline layouts use <code>showFooter=&#123;false&#125;</code>.
          </Box>
        </Grid>
      </Box>

      <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px' }}>
        <Box variant="elevated" p="14px" radius="lg">
          <Grid gap="8px">
            <Badge tone="info">Date picker: calendar-only</Badge>
            <DatePicker
              mode="inline"
              bare
              showFooter={false}
              label="Flat admission calendar"
              value={singleValue || undefined}
              onValueChange={(next) => setSingleValue(next)}
            />
          </Grid>
        </Box>

        <Box variant="elevated" p="14px" radius="lg">
          <Grid gap="8px">
            <Badge tone="success">Range picker: calendar-only</Badge>
            <DateRangePicker
              mode="inline"
              bare
              showFooter={false}
              label="Flat reporting range"
              value={rangeValue}
              onValueChange={(next) => setRangeValue(next || '')}
            />
          </Grid>
        </Box>

        <Box variant="elevated" p="14px" radius="lg">
          <Grid gap="8px">
            <Badge tone="warning">Date-time: flat with actions</Badge>
            <DateTimePicker
              mode="inline"
              bare
              showFooter
              label="Flat schedule editor"
              value={dateTimeValue || undefined}
              step={10}
              onValueChange={(next) => setDateTimeValue(next)}
            />
          </Grid>
        </Box>

        <Box variant="elevated" p="14px" radius="lg">
          <Grid gap="8px">
            <Badge tone="danger">Range date-time: flat + no footer</Badge>
            <DateRangeTimePicker
              mode="inline"
              bare
              showFooter={false}
              label="Flat operating slot"
              value={rangeTimeValue}
              step={15}
              onValueChange={(next) => setRangeTimeValue(next || '')}
            />
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export const Localization = () => {
  const [locale, setLocale] = React.useState<'en-US' | 'zh-CN' | 'fr-FR'>('en-US');
  const [dateValue, setDateValue] = React.useState<string | null>('2026-05-14');
  const [rangeValue, setRangeValue] = React.useState('{"start":"2026-05-10","end":"2026-05-18"}');
  const [timeValue, setTimeValue] = React.useState<string | null>('14:30');
  const [dateTimeValue, setDateTimeValue] = React.useState<string | null>('2026-05-14T14:30');
  const [rangeTimeValue, setRangeTimeValue] = React.useState(
    '{"start":"2026-05-14T09:00","end":"2026-05-14T12:30"}'
  );

  const customFrenchTranslations = JSON.stringify({
    fr: {
      today: 'Aujourd hui (Clinique)',
      apply: 'Valider',
      clear: 'Reinitialiser',
      startTime: 'Debut de service',
      endTime: 'Fin de service'
    }
  });

  const localeOptions: Array<{ value: 'en-US' | 'zh-CN' | 'fr-FR'; label: string }> = [
    { value: 'en-US', label: 'English' },
    { value: 'zh-CN', label: 'Chinese' },
    { value: 'fr-FR', label: 'French' }
  ];

  return (
    <Grid gap="12px" style={{ maxWidth: 1100 }}>
      <Box variant="elevated" p="16px" radius="xl">
        <Grid gap="10px">
          <Badge tone="brand">Localization demo</Badge>
          <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: '14px' }}>
            Built-in localization supports English, Chinese, and French. Switch locale and inspect calendar labels,
            time labels, and action text.
          </Box>
          <Grid style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {localeOptions.map((option) => (
              <Button
                key={option.value}
                size="sm"
                variant={locale === option.value ? undefined : 'secondary'}
                onClick={() => setLocale(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </Grid>
        </Grid>
      </Box>

      <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px' }}>
        <Box variant="elevated" p="14px" radius="lg">
          <DatePicker
            label="Admission date"
            locale={locale}
            value={dateValue || undefined}
            onValueChange={(next) => setDateValue(next)}
            clearable
          />
        </Box>
        <Box variant="elevated" p="14px" radius="lg">
          <DateRangePicker
            label="Billing range"
            locale={locale}
            value={rangeValue}
            onValueChange={(next) => setRangeValue(next || '')}
            closeOnSelect={false}
          />
        </Box>
        <Box variant="elevated" p="14px" radius="lg">
          <TimePicker
            label="Shift start"
            locale={locale}
            value={timeValue || undefined}
            onValueChange={(next) => setTimeValue(next)}
            clearable
          />
        </Box>
        <Box variant="elevated" p="14px" radius="lg">
          <DateTimePicker
            label="Procedure schedule"
            locale={locale}
            value={dateTimeValue || undefined}
            onValueChange={(next) => setDateTimeValue(next)}
            step={10}
          />
        </Box>
        <Box variant="elevated" p="14px" radius="lg">
          <DateRangeTimePicker
            label="Operating slot"
            locale={locale}
            value={rangeTimeValue}
            onValueChange={(next) => setRangeTimeValue(next || '')}
            step={15}
            closeOnSelect={false}
          />
        </Box>
      </Grid>

      <Box variant="elevated" p="14px" radius="lg">
        <Grid gap="8px">
          <Badge tone="info">Custom translation override (French)</Badge>
          <DateRangeTimePicker
            locale="fr-FR"
            label="Bloc operatoire"
            value='{"start":"2026-05-20T08:00","end":"2026-05-20T11:00"}'
            translations={customFrenchTranslations}
            step={15}
            closeOnSelect={false}
          />
        </Grid>
      </Box>
    </Grid>
  );
};

export const MobileSheetBehavior = () => {
  useForcedMobileSheet(true);
  const [value, setValue] = React.useState<string | null>('2026-02-23');

  return (
    <Box w="360px" variant="elevated" p="14px" radius="xl">
      <Grid gap="10px">
        <Badge tone="brand">Forced mobile sheet preview</Badge>
        <DatePicker
          label="Mobile sheet date picker"
          value={value || undefined}
          onValueChange={(next) => setValue(next)}
          closeOnSelect={false}
          hint="This story forces mobile media query to validate bottom-sheet spacing."
        />
        <DateRangePicker
          label="Mobile range picker"
          value='{"start":"2026-02-20","end":"2026-02-24"}'
          closeOnSelect={false}
          hint="Check footer actions and scroll-lock behavior."
        />
      </Grid>
    </Box>
  );
};
`,oe=`import React from 'react';
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
          setResult(\`\${detail.action}\${detail.source ? \`:\${detail.source}\` : ''}\`);
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
`,ae=`import React from 'react';
import { Box, Button, DialogProvider, Flex, useDialog } from '@editora/ui-react';

export default {
  title: 'UI/DialogPromise'
};

function Demo() {
  const dialog = useDialog();
  const [result, setResult] = React.useState('No result yet');

  const runConfirm = async () => {
    const next = await dialog.confirm({
      title: 'Publish release notes?',
      description: 'This opens a production-grade promise dialog for confirm/cancel flows.',
      submitText: 'Publish',
      cancelText: 'Review again',
      onSubmit: async () => {
        await new Promise((resolve) => setTimeout(resolve, 700));
      }
    });
    setResult(JSON.stringify(next));
  };

  const runQueue = async () => {
    const first = await dialog.open({
      title: 'Step 1',
      description: 'First queued dialog',
      mode: 'queue'
    });
    const second = await dialog.open({
      title: 'Step 2',
      description: 'Second queued dialog',
      mode: 'queue'
    });
    setResult(\`\${JSON.stringify(first)} | \${JSON.stringify(second)}\`);
  };

  return (
    <Box>
      <Flex gap="10px" wrap="wrap">
        <Button onClick={runConfirm}>Run Confirm</Button>
        <Button variant="secondary" onClick={runQueue}>Run Queue</Button>
      </Flex>
      <Box mt="14px">Result: {result}</Box>
    </Box>
  );
}

export const PromiseAPI = () => (
  <DialogProvider>
    <Demo />
  </DialogProvider>
);
`,ne=`import React, { useState } from 'react';
import { DirectionProvider, Button , Box, Grid} from '@editora/ui-react';

export default {
  title: 'UI/DirectionProvider',
  component: DirectionProvider,
  argTypes: {
    dir: { control: 'select', options: ['ltr', 'rtl', 'auto'] }
  }
};

export const Default = (args: any) => (
  <DirectionProvider dir={args.dir}>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>
      <p style={{ margin: 0 }}>Navigation / التنقل / ניווט</p>
    </Box>
  </DirectionProvider>
);
Default.args = { dir: 'ltr' };

export const ToggleDirection = () => {
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <Button size="sm" onClick={() => setDir((v) => (v === 'ltr' ? 'rtl' : 'ltr'))}>Switch direction ({dir})</Button>
      <DirectionProvider dir={dir}>
        <Box style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>
          <strong>Current dir:</strong> {dir}
          <p style={{ marginBottom: 0 }}>Toolbar | Sidebar | Inspector</p>
        </Box>
      </DirectionProvider>
    </Grid>
  );
};
`,ie=`import React, { useState } from 'react';
import { Box, Button, Drawer, Flex, Grid } from '@editora/ui-react';

export default {
  title: 'UI/Drawer',
  component: Drawer,
  argTypes: {
    open: { control: 'boolean' },
    side: { control: 'select', options: ['left', 'right', 'top', 'bottom', 'start', 'end'] },
    dismissible: { control: 'boolean' },
    variant: { control: 'select', options: ['default', 'solid', 'flat', 'line', 'glass', 'contrast'] },
    density: { control: 'select', options: ['default', 'compact', 'comfortable'] },
    shape: { control: 'select', options: ['default', 'square', 'soft'] },
    elevation: { control: 'select', options: ['default', 'none', 'low', 'high'] },
    tone: { control: 'select', options: ['default', 'brand', 'danger', 'success', 'warning'] },
    size: { control: 'select', options: ['default', 'sm', 'lg'] },
    inset: { control: 'boolean' }
  }
};

export const Controlled = (args: any) => {
  const [open, setOpen] = useState(!!args.open);

  return (
    <Box style={{ minHeight: 220 }}>
      <Button onClick={() => setOpen(true)}>Open drawer</Button>

      <Drawer
        open={open}
        side={args.side}
        dismissible={args.dismissible}
        variant={args.variant}
        density={args.density}
        shape={args.shape}
        elevation={args.elevation}
        tone={args.tone}
        size={args.size}
        inset={args.inset}
        onChange={setOpen}
      >
        <Box slot="header" style={{ fontWeight: 700 }}>Filters</Box>
        <Grid style={{ display: 'grid', gap: 10 }}>
          <label><input type="checkbox" defaultChecked /> Active only</label>
          <label><input type="checkbox" /> Include archived</label>
          <label><input type="checkbox" /> Assigned to me</label>
        </Grid>
        <Flex slot="footer" style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button size="sm" onClick={() => setOpen(false)}>Apply</Button>
        </Flex>
      </Drawer>
    </Box>
  );
};
Controlled.args = {
  open: false,
  side: 'left',
  dismissible: true,
  variant: 'default',
  density: 'default',
  shape: 'default',
  elevation: 'default',
  tone: 'default',
  size: 'default',
  inset: false
};

export const VisualVariants = () => {
  const [open, setOpen] = useState<string | null>('default');

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <Flex style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button size="sm" onClick={() => setOpen('default')}>Default</Button>
        <Button size="sm" onClick={() => setOpen('square')}>Square Flat</Button>
        <Button size="sm" onClick={() => setOpen('line')}>Line Inset</Button>
        <Button size="sm" onClick={() => setOpen('comfortable')}>Comfortable</Button>
        <Button size="sm" onClick={() => setOpen('glass')}>Glass</Button>
        <Button size="sm" onClick={() => setOpen('contrast')}>Contrast</Button>
      </Flex>

      <Drawer open={open === 'default'} side="left" dismissible onChange={(next) => !next && setOpen(null)}>
        <Box slot="header">Default / Soft</Box>
        <p style={{ margin: 0 }}>Balanced admin panel style.</p>
        <Box slot="footer"><Button size="sm" onClick={() => setOpen(null)}>Close</Button></Box>
      </Drawer>

      <Drawer open={open === 'square'} side="right" dismissible variant="flat" elevation="none" shape="square" density="compact" onChange={(next) => !next && setOpen(null)}>
        <Box slot="header">Square / Flat / Compact</Box>
        <p style={{ margin: 0 }}>Sharp, low-ornament variant.</p>
        <Box slot="footer"><Button size="sm" variant="secondary" onClick={() => setOpen(null)}>Close</Button></Box>
      </Drawer>

      <Drawer open={open === 'line'} side="right" dismissible variant="line" tone="warning" shape="square" density="compact" inset onChange={(next) => !next && setOpen(null)}>
        <Box slot="header">Line / Warning / Inset</Box>
        <p style={{ margin: 0 }}>Floating side panel with crisp borders and no heavy shadows.</p>
        <Box slot="footer"><Button size="sm" variant="secondary" onClick={() => setOpen(null)}>Close</Button></Box>
      </Drawer>

      <Drawer open={open === 'comfortable'} side="left" dismissible density="comfortable" elevation="high" size="lg" onChange={(next) => !next && setOpen(null)}>
        <Box slot="header">Comfortable / Large</Box>
        <p style={{ margin: 0 }}>Roomier spacing for content-dense workflows.</p>
        <Box slot="footer"><Button size="sm" onClick={() => setOpen(null)}>Done</Button></Box>
      </Drawer>

      <Drawer open={open === 'glass'} side="left" dismissible variant="glass" shape="soft" elevation="high" inset onChange={(next) => !next && setOpen(null)}>
        <Box slot="header">Glass / Soft / Inset</Box>
        <p style={{ margin: 0 }}>High-polish floating drawer for analytics and detail views.</p>
        <Box slot="footer"><Button size="sm" onClick={() => setOpen(null)}>Done</Button></Box>
      </Drawer>

      <Drawer open={open === 'contrast'} side="right" dismissible variant="contrast" tone="danger" onChange={(next) => !next && setOpen(null)}>
        <Box slot="header">Contrast / Danger Tone</Box>
        <p style={{ margin: 0 }}>High-contrast critical action panel.</p>
        <Box slot="footer"><Button size="sm" variant="secondary" onClick={() => setOpen(null)}>Dismiss</Button></Box>
      </Drawer>
    </Grid>
  );
};

export const SideVariants = () => {
  const [openSide, setOpenSide] = useState<string | null>(null);

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <Flex style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button size="sm" onClick={() => setOpenSide('left')}>Open Left</Button>
        <Button size="sm" onClick={() => setOpenSide('right')}>Open Right</Button>
        <Button size="sm" onClick={() => setOpenSide('top')}>Open Top</Button>
        <Button size="sm" onClick={() => setOpenSide('bottom')}>Open Bottom</Button>
      </Flex>

      {(['left', 'right', 'top', 'bottom'] as const).map((side) => (
        <Drawer
          key={side}
          open={openSide === side}
          side={side}
          dismissible
          onChange={(next) => {
            if (!next && openSide === side) setOpenSide(null);
          }}
        >
          <Box slot="header" style={{ fontWeight: 700, textTransform: 'capitalize' }}>{side} drawer</Box>
          <p style={{ margin: 0 }}>Reusable panel for {side} anchored workflows.</p>
          <Box slot="footer">
            <Button size="sm" onClick={() => setOpenSide(null)}>Close</Button>
          </Box>
        </Drawer>
      ))}
    </Grid>
  );
};

export const TokenStyled = () => {
  const [open, setOpen] = useState(true);

  return (
    <Drawer
      open={open}
      side="right"
      dismissible
      onChange={setOpen}
      style={{
        ['--ui-drawer-width' as any]: '420px',
        ['--ui-drawer-bg' as any]: '#0f172a',
        ['--ui-drawer-color' as any]: '#e2e8f0',
        ['--ui-drawer-border' as any]: '#1e293b',
        ['--ui-drawer-overlay' as any]: 'rgba(2, 6, 23, 0.72)'
      }}
    >
      <Box slot="header" style={{ fontWeight: 700 }}>Dark Drawer</Box>
      <p style={{ margin: 0, color: '#cbd5e1' }}>Use tokens to align drawer with your dashboard theme.</p>
      <Box slot="footer">
        <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>Close</Button>
      </Box>
    </Drawer>
  );
};

export const AccessibilityKeyboardMap = () => {
  const [open, setOpen] = useState(false);

  return (
    <Grid style={{ display: 'grid', gap: 12, minHeight: 280 }}>
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
        Focus trap keys: <strong>Tab / Shift+Tab</strong> keep focus inside drawer while open.
        Dismiss keys: <strong>Escape</strong> closes when <code>dismissible</code> is enabled.
        RTL note: set <code>dir="rtl"</code> on container to validate mirrored layout and text flow.
      </Box>

      <Flex style={{ display: 'flex', gap: 8 }}>
        <Button onClick={() => setOpen(true)}>Open LTR Drawer</Button>
      </Flex>

      <Drawer open={open} side="left" dismissible onChange={setOpen}>
        <Box slot="header" style={{ fontWeight: 700 }}>Keyboard & Focus</Box>
        <Grid style={{ display: 'grid', gap: 10 }}>
          <Button size="sm">Primary Action</Button>
          <Button size="sm" variant="secondary">Secondary Action</Button>
        </Grid>
        <Box slot="footer">
          <Button size="sm" onClick={() => setOpen(false)}>Close</Button>
        </Box>
      </Drawer>

      <Box dir="rtl" style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
        <h4 style={{ margin: '0 0 10px' }}>RTL Preview</h4>
        <Drawer open side="right" dismissible onChange={() => {}}>
          <Box slot="header" style={{ fontWeight: 700 }}>RTL Header</Box>
          <p style={{ margin: 0 }}>Drawer in RTL context with right-side anchor.</p>
          <Box slot="footer">
            <Button size="sm" variant="secondary">Close</Button>
          </Box>
        </Drawer>
      </Box>
    </Grid>
  );
};
`,re=`import React from 'react';
import { Box, Button, Dropdown, Grid, ThemeProvider, useFloating } from '@editora/ui-react';

export default {
  title: 'UI/Dropdown',
  component: Dropdown,
  argTypes: {
    placement: { control: 'select', options: ['bottom', 'top', 'left', 'right'] },
    variant: { control: 'select', options: ['default', 'solid', 'flat', 'line', 'glass', 'contrast'] },
    density: { control: 'select', options: ['default', 'compact', 'comfortable'] },
    shape: { control: 'select', options: ['default', 'square', 'soft'] },
    elevation: { control: 'select', options: ['default', 'none', 'low', 'high'] },
    tone: { control: 'select', options: ['default', 'brand', 'danger', 'success', 'warning'] },
    closeOnSelect: { control: 'boolean' },
    typeahead: { control: 'boolean' }
  }
};

const cardStyle: React.CSSProperties = {
  border: '1px solid var(--ui-color-border, rgba(15, 23, 42, 0.16))',
  borderRadius: 12,
  padding: 14,
  background: 'var(--ui-color-surface, #ffffff)',
  color: 'var(--ui-color-text, #0f172a)'
};

const MenuContent = () => (
  <Box slot="content" role="menu" style={{ minWidth: 200, padding: 0, borderRadius: 0, boxShadow: 'var(--ui-shadow-sm, 0 2px 6px rgba(16,24,40,0.08))' }}>
    <Box role="menuitem" tabIndex={-1}><span className="icon">✏</span><span className="label">Edit</span><span className="shortcut">E</span></Box>
    <Box role="menuitem" tabIndex={-1}><span className="icon">⧉</span><span className="label">Duplicate</span><span className="shortcut">D</span></Box>
    <Box className="separator" role="separator" />
    <Box role="menuitem" tabIndex={-1}><span className="icon">🗂</span><span className="label">Archive</span><span className="meta">⌘A</span></Box>
  </Box>
);

export const Playground = (args: any) => (
  <Box style={{ padding: 60 }}>
    <Dropdown
      open={args.open}
      placement={args.placement}
      variant={args.variant}
      density={args.density}
      shape={args.shape}
      elevation={args.elevation}
      tone={args.tone}
      closeOnSelect={args.closeOnSelect}
      typeahead={args.typeahead}
      style={{
        ["--ui-dropdown-menu-padding" as any]: "0px",
        ["--ui-dropdown-menu-radius" as any]: "0px",
        ["--ui-dropdown-menu-border" as any]: "0",
        ["--ui-dropdown-menu-shadow" as any]: "none",
      }}
    >
      <Button slot="trigger">Open dropdown</Button>
      <MenuContent />
    </Dropdown>
  </Box>
);

Playground.args = {
  open: false,
  placement: 'bottom',
  variant: 'default',
  density: 'default',
  shape: 'default',
  elevation: 'default',
  tone: 'default',
  closeOnSelect: true,
  typeahead: true
};

export const VisualVariants = () => (
  <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(240px, 1fr))', gap: 16, padding: 20 }}>
    <Box style={cardStyle}>
      <strong>Soft Default</strong>
      <Box style={{ marginTop: 10 }}>
        <Dropdown open shape="soft" placement="bottom">
          <Button slot="trigger">Trigger</Button>
          <MenuContent />
        </Dropdown>
      </Box>
    </Box>

    <Box style={cardStyle}>
      <strong>Square Flat</strong>
      <Box style={{ marginTop: 10 }}>
        <Dropdown open shape="square" variant="flat" elevation="none" density="compact">
          <Button slot="trigger">Trigger</Button>
          <MenuContent />
        </Dropdown>
      </Box>
    </Box>

    <Box style={cardStyle}>
      <strong>Line / Compact</strong>
      <Box style={{ marginTop: 10 }}>
        <Dropdown open variant="line" shape="square" density="compact" tone="warning">
          <Button slot="trigger">Trigger</Button>
          <MenuContent />
        </Dropdown>
      </Box>
    </Box>

    <Box style={cardStyle}>
      <strong>Solid Comfortable</strong>
      <Box style={{ marginTop: 10 }}>
        <Dropdown open variant="solid" density="comfortable" elevation="low">
          <Button slot="trigger">Trigger</Button>
          <MenuContent />
        </Dropdown>
      </Box>
    </Box>

    <Box style={{ ...cardStyle, background: 'var(--ui-color-surface-alt, #f8fafc)' }}>
      <strong>Glass Surface</strong>
      <Box style={{ marginTop: 10 }}>
        <Dropdown open variant="glass" shape="soft" elevation="high">
          <Button slot="trigger">Trigger</Button>
          <MenuContent />
        </Dropdown>
      </Box>
    </Box>

    <Box style={cardStyle}>
      <strong>Contrast + Danger Tone</strong>
      <Box style={{ marginTop: 10 }}>
        <Dropdown open variant="contrast" tone="danger" elevation="high">
          <Button slot="trigger">Trigger</Button>
          <MenuContent />
        </Dropdown>
      </Box>
    </Box>
  </Grid>
);

export const PersistentSelection = () => {
  const [last, setLast] = React.useState<string>('none');
  return (
    <Box style={{ padding: 56 }}>
      <Dropdown
        open
        closeOnSelect={false}
        onSelect={(d) => setLast(\`\${d.label || d.value || 'item'}\${typeof d.checked === 'boolean' ? \` (\${d.checked ? 'on' : 'off'})\` : ''}\`)}
      >
        <Button slot="trigger">Options</Button>
        <Box slot="content">
          <Box role="menuitemcheckbox" aria-checked="true" data-value="show-grid" tabIndex={-1}>Show grid</Box>
          <Box role="menuitemcheckbox" aria-checked="false" data-value="snap" tabIndex={-1}>Snap to guides</Box>
          <Box className="separator" role="separator" />
        <Box role="menuitemradio" data-group="mode" aria-checked="true" data-value="mode-edit" tabIndex={-1}>Mode: Edit</Box>
        <Box role="menuitemradio" data-group="mode" aria-checked="false" data-value="mode-read" tabIndex={-1}>Mode: Read</Box>
      </Box>
      </Dropdown>
      <Box style={{ marginTop: 10, fontSize: 13, color: 'var(--ui-color-muted, #64748b)' }}>Last action: {last}</Box>
    </Box>
  );
};

export const Headless = () => {
  const { referenceRef, floatingRef, getReferenceProps, getFloatingProps, coords } = useFloating({ placement: 'bottom', offset: 6 });
  return (
    <Box style={{ padding: 80 }}>
      <button
        {...getReferenceProps()}
        ref={referenceRef as any}
        style={{
          padding: '8px 12px',
          borderRadius: 8,
          border: '1px solid var(--ui-color-border, rgba(15, 23, 42, 0.16))',
          background: 'var(--ui-color-surface, #ffffff)',
          color: 'var(--ui-color-text, #0f172a)'
        }}
      >
        Headless trigger
      </button>
      <Box {...getFloatingProps()} ref={floatingRef as any} style={{ position: 'absolute', top: coords.top, left: coords.left, pointerEvents: 'auto' }}>
        <Box
          style={{
            background: 'var(--ui-color-surface, #ffffff)',
            color: 'var(--ui-color-text, #0f172a)',
            border: '1px solid var(--ui-color-border, rgba(15, 23, 42, 0.16))',
            borderRadius: 6,
            boxShadow: 'var(--ui-shadow-md, 0 8px 30px rgba(2,6,23,0.12))',
            minWidth: 160
          }}
          role="menu"
        >
          <Box role="menuitem" tabIndex={-1} style={{ padding: 8 }}>First (headless)</Box>
          <Box role="menuitem" tabIndex={-1} style={{ padding: 8 }}>Second</Box>
          <Box role="menuitem" tabIndex={-1} style={{ padding: 8 }}>Third</Box>
        </Box>
      </Box>
    </Box>
  );
};

export const ThemeProviderVerification = () => {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light');
  const tokens =
    mode === 'light'
      ? {
          colors: {
            primary: '#0f766e',
            surface: '#ffffff',
            surfaceAlt: '#f8fafc',
            text: '#0f172a',
            muted: '#64748b',
            border: 'rgba(15, 23, 42, 0.16)',
            focusRing: '#0f766e',
            success: '#15803d',
            warning: '#b45309',
            danger: '#b91c1c'
          }
        }
      : {
          colors: {
            primary: '#38bdf8',
            surface: '#0f172a',
            surfaceAlt: '#111c33',
            text: '#e2e8f0',
            muted: '#94a3b8',
            border: '#334155',
            focusRing: '#7dd3fc',
            success: '#22c55e',
            warning: '#f59e0b',
            danger: '#f87171'
          }
        };

  return (
    <ThemeProvider tokens={tokens as any}>
      <Box style={{ padding: 32, background: 'var(--ui-color-background, #ffffff)', color: 'var(--ui-color-text, #0f172a)' }}>
        <Flex style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <Button size="sm" onClick={() => setMode('light')}>Light Tokens</Button>
          <Button size="sm" variant="secondary" onClick={() => setMode('dark')}>Dark Tokens</Button>
        </Flex>
        <Dropdown open variant="soft" elevation="low" shape="soft">
          <Button slot="trigger">Themed Dropdown</Button>
          <MenuContent />
        </Dropdown>
      </Box>
    </ThemeProvider>
  );
};
`,se=`import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { EditoraEditor } from '@editora/react';
import {
  BoldPlugin,
  ContentRulesPlugin,
  HistoryPlugin,
  ItalicPlugin,
  LinkPlugin,
  ListPlugin,
  TablePlugin,
  UnderlinePlugin
} from '@editora/plugins';
import { Box, Button, Dialog, Flex, Grid, Tabs, Toast, type ToastElement } from '@editora/ui-react';
import '@editora/themes/themes/default.css';

type CardProps = {
  title: string;
  value: string;
  note: string;
};

const Card = ({ title, value, note }: CardProps) => (
  <Box
    variant="surface"
    p="12px"
    radius="md"
    style={{
      border: '1px solid #e2e8f0',
      background: '#fff'
    }}
  >
    <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{title}</div>
    <div style={{ marginTop: 6, fontSize: 24, fontWeight: 700, color: '#0f172a' }}>{value}</div>
    <div style={{ marginTop: 6, fontSize: 13, color: '#475569' }}>{note}</div>
  </Box>
);

type ModalProps = {
  open: boolean;
  onClose: () => void;
  onPublish: () => void;
};

const Modal = ({ open, onClose, onPublish }: ModalProps) => (
  <Dialog
    open={open}
    title="Publish Editorial Update"
    description="Confirm release notes and compliance checks before publishing."
    submitText="Publish"
    cancelText="Cancel"
    dismissible
    closeOnOverlay
    closeOnEsc
    onDialogSubmit={onPublish}
    onDialogClose={onClose}
  >
    <Grid gap="10px">
      <Box variant="outline" p="10px" radius="sm" color="#475569">
        This release updates customer-facing workflows and internal policy wording.
      </Box>
      <Box variant="surface" p="10px" radius="sm" color="#334155">
        Ensure terminology and risk statements pass content rules before approval.
      </Box>
    </Grid>
  </Dialog>
);

const plugins = [
  BoldPlugin(),
  ItalicPlugin(),
  UnderlinePlugin(),
  LinkPlugin(),
  ListPlugin(),
  TablePlugin(),
  HistoryPlugin(),
  ContentRulesPlugin({
    bannedWords: ['obviously', 'simply'],
    requiredHeadings: ['Summary'],
    maxSentenceWords: 30,
    minReadabilityScore: 55,
    enableRealtime: true
  })
];

const meta: Meta = {
  title: 'Editor/AI SaaS Workspace'
};

export default meta;
type Story = StoryObj;

export const EnterpriseEditorOps: Story = {
  render: () => {
    const [activeTab, setActiveTab] = React.useState(0);
    const [publishOpen, setPublishOpen] = React.useState(false);
    const [contentLength, setContentLength] = React.useState(0);
    const [saving, setSaving] = React.useState(false);
    const toastRef = React.useRef<ToastElement | null>(null);

    const notify = React.useCallback((message: string, type: 'success' | 'error' | 'info' | 'loading' = 'info') => {
      toastRef.current?.show(message, { type, theme: 'light', duration: 1400 });
    }, []);

    const saveDraft = React.useCallback(() => {
      if (saving) return;
      setSaving(true);
      notify('Saving draft...', 'loading');
      window.setTimeout(() => {
        setSaving(false);
        notify('Draft saved to editorial queue', 'success');
      }, 900);
    }, [notify, saving]);

    return (
      <Grid gap="14px" style={{ maxWidth: 1120, margin: '0 auto', padding: 8 }}>
        <Toast ref={toastRef} position="bottom-right" theme="light" />

        <Flex justify="between" align="center" wrap="wrap" gap="10px">
          <Box>
            <h2 style={{ margin: 0, fontSize: 28, color: '#0f172a' }}>Editorial Operations Workspace</h2>
            <p style={{ margin: '6px 0 0 0', color: '#64748b' }}>
              AI-assisted release drafting, review workflows, and policy-safe publishing.
            </p>
          </Box>
          <Flex gap="8px">
            <Button onClick={saveDraft}>{saving ? 'Saving...' : 'Save Draft'}</Button>
            <Button variant="secondary" onClick={() => setPublishOpen(true)}>
              Open Modal
            </Button>
          </Flex>
        </Flex>

        <Grid columns={{ initial: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' }} gap="10px">
          <Card title="Documents" value="48" note="6 pending legal review" />
          <Card title="Open Comments" value="129" note="22 unresolved blockers" />
          <Card title="Content Risk" value="Low" note="No banned terms detected" />
          <Card title="Current Draft" value={\`\${contentLength} chars\`} note="Realtime onChange tracked" />
        </Grid>

        <Box variant="surface" p="12px" radius="md" style={{ border: '1px solid #e2e8f0' }}>
          <Tabs selected={activeTab} variant="soft" onChange={setActiveTab}>
            <div slot="tab" data-value="draft">Draft</div>
            <div slot="panel">
              <EditoraEditor
                plugins={plugins}
                statusbar={{ enabled: true, position: 'bottom' }}
                toolbar={{ items: 'undo redo | bold italic underline | link | bullist numlist | table', sticky: true }}
                defaultValue="<h2>Summary</h2><p>Draft your enterprise release update here.</p>"
                onChange={(html) => setContentLength(html.length)}
              />
            </div>

            <div slot="tab" data-value="review">Review</div>
            <div slot="panel">
              <Grid gap="8px">
                <Box variant="outline" p="10px" radius="sm" color="#475569">
                  Reviewer queue: Product, Legal, Security.
                </Box>
                <Button size="sm" onClick={() => notify('Review checklist refreshed', 'info')}>
                  Refresh Checklist
                </Button>
              </Grid>
            </div>

            <div slot="tab" data-value="publish">Publish</div>
            <div slot="panel">
              <Grid gap="8px">
                <Box variant="outline" p="10px" radius="sm" color="#475569">
                  Final release gating passed. You can publish this document now.
                </Box>
                <Button size="sm" onClick={() => setPublishOpen(true)}>
                  Open Publish Modal
                </Button>
              </Grid>
            </div>
          </Tabs>
        </Box>

        <Modal
          open={publishOpen}
          onClose={() => setPublishOpen(false)}
          onPublish={() => {
            notify('Release published successfully', 'success');
            setPublishOpen(false);
          }}
        />
      </Grid>
    );
  }
};
`,le=`import React from 'react';
import { Button, EmptyState, Flex } from '@editora/ui-react';

export default {
  title: 'UI/EmptyState',
  component: EmptyState,
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    actionLabel: { control: 'text' },
    tone: { control: 'radio', options: ['neutral', 'success', 'warning', 'danger'] },
    compact: { control: 'boolean' }
  }
};

export const Default = (args: any) => (
  <EmptyState
    title={args.title}
    description={args.description}
    actionLabel={args.actionLabel}
    tone={args.tone}
    compact={args.compact}
  />
);

Default.args = {
  title: 'No users matched your filter',
  description: 'Try changing role filters or invite a new team member.',
  actionLabel: 'Invite user',
  tone: 'neutral',
  compact: false
};

export const SlottedActions = () => (
  <EmptyState title="No invoices" description="Create your first invoice to start collecting payments.">
    <span slot="icon">USD</span>
    <Flex slot="actions" style={{ display: 'flex', gap: 8 }}>
      <Button size="sm">Create invoice</Button>
      <Button size="sm" variant="secondary">Import data</Button>
    </Flex>
  </EmptyState>
);
`,de=`import React, { useState } from 'react';
import { Box, Checkbox, Field, Flex, Grid, Input, Textarea, ThemeProvider, Button } from '@editora/ui-react';

export default {
  title: 'UI/Field',
  component: Field,
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
    required: { control: 'boolean' },
    invalid: { control: 'boolean' },
    orientation: { control: { type: 'radio', options: ['vertical', 'horizontal'] } },
    variant: { control: 'select', options: ['default', 'surface', 'outline', 'soft', 'contrast', 'minimal', 'elevated'] },
    tone: { control: 'select', options: ['default', 'brand', 'success', 'warning', 'danger'] },
    density: { control: 'select', options: ['default', 'compact', 'comfortable'] },
    shape: { control: 'select', options: ['default', 'square', 'soft'] },
    shell: { control: 'select', options: ['none', 'outline', 'filled', 'soft', 'line'] }
  }
};

export const Playground = (args: any) => (
  <Box style={{ maxWidth: 560 }}>
    <Field
      label={args.label}
      description={args.description}
      error={args.error}
      required={args.required}
      invalid={args.invalid}
      orientation={args.orientation}
      variant={args.variant}
      tone={args.tone}
      density={args.density}
      shape={args.shape}
      shell={args.shell}
      htmlFor="field-name"
    >
      <Input id="field-name" placeholder="Jane Doe" />
    </Field>
  </Box>
);

Playground.args = {
  label: 'Full name',
  description: 'Used across workspace profile and audit views.',
  error: '',
  required: true,
  invalid: false,
  orientation: 'vertical',
  variant: 'surface',
  tone: 'default',
  density: 'default',
  shape: 'default',
  shell: 'none'
};

export const VisualModes = () => (
  <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(260px, 1fr))', gap: 14 }}>
    <Field label="Surface" description="Balanced default for admin forms." variant="surface" shell="outline" htmlFor="field-surface">
      <Input id="field-surface" placeholder="Surface variant" />
    </Field>

    <Field label="Outline / Brand" description="Crisp borders with accent tone." variant="outline" tone="brand" shell="line" htmlFor="field-outline">
      <Input id="field-outline" placeholder="Outline variant" />
    </Field>

    <Field label="Soft / Success" description="Low-noise positive data entry state." variant="soft" tone="success" shell="soft" htmlFor="field-soft">
      <Input id="field-soft" placeholder="Soft variant" />
    </Field>

    <Field label="Minimal" description="Flat grouped style for dense admin layouts." variant="minimal" tone="brand" htmlFor="field-minimal">
      <Input id="field-minimal" placeholder="Minimal variant" />
    </Field>

    <Box style={{ background: 'var(--ui-color-text, #0f172a)', borderRadius: 16, padding: 10 }}>
      <Field label="Contrast" description="Dark mode parity." variant="contrast" shell="outline" htmlFor="field-contrast">
        <Input id="field-contrast" placeholder="Contrast variant" />
      </Field>
    </Box>

    <Field label="Elevated" description="Premium surface with stronger depth." variant="elevated" shell="filled" htmlFor="field-elevated">
      <Input id="field-elevated" placeholder="Elevated variant" />
    </Field>
  </Grid>
);

export const WithCustomSlots = () => {
  const [checked, setChecked] = useState(false);

  return (
    <Grid style={{ display: 'grid', gap: 14, maxWidth: 620 }}>
      <Field required invalid error="Please provide implementation notes." htmlFor="field-notes" variant="soft" tone="warning" shell="soft">
        <span slot="label">Implementation Notes</span>
        <span slot="actions" style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>Markdown supported</span>
        <span slot="description">Document migration and rollout details for the team.</span>
        <Textarea id="field-notes" rows={5} placeholder="Describe migration strategy..." />
      </Field>

      <Field label="Confirmation" description="Required before submitting." variant="outline" shell="line" htmlFor="field-confirm">
        <Flex style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Checkbox id="field-confirm" checked={checked} onClick={() => setChecked((v) => !v)} />
          <span>I verified these details.</span>
        </Flex>
      </Field>
    </Grid>
  );
};

export const HorizontalLayout = () => (
  <Box style={{ maxWidth: 820 }}>
    <Field
      orientation="horizontal"
      label="API Key"
      description="Used by backend integrations."
      htmlFor="field-key"
      labelWidth="220px"
      variant="surface"
      shell="outline"
    >
      <Input id="field-key" value="sk_live_****************" readOnly />
    </Field>
  </Box>
);

export const FlatVsShell = () => (
  <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(280px, 1fr))', gap: 16, maxWidth: 720 }}>
    <Field label="Flat field (default shell)" description="No wrapper chrome around the control." htmlFor="field-flat">
      <Input id="field-flat" placeholder="No control-shell styling by default" />
    </Field>
    <Field
      label="Opt-in control shell"
      description="Consumers can enable shell with a single prop or CSS tokens."
      shell="outline"
      htmlFor="field-shell"
    >
      <Input id="field-shell" placeholder="Outline shell enabled" />
    </Field>
  </Grid>
);

export const ThemeProviderVerification = () => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const tokens =
    mode === 'light'
      ? {
          colors: {
            primary: '#2563eb',
            surface: '#ffffff',
            surfaceAlt: '#f8fafc',
            text: '#0f172a',
            muted: '#64748b',
            border: 'rgba(15, 23, 42, 0.16)',
            focusRing: '#2563eb'
          }
        }
      : {
          colors: {
            primary: '#7dd3fc',
            surface: '#0f172a',
            surfaceAlt: '#111827',
            text: '#e2e8f0',
            muted: '#93a4bd',
            border: '#334155',
            focusRing: '#7dd3fc'
          }
        };

  return (
    <ThemeProvider tokens={tokens as any}>
      <Grid style={{ display: 'grid', gap: 12, maxWidth: 640, padding: 8, background: 'var(--ui-color-background, #ffffff)' }}>
        <Flex style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" onClick={() => setMode('light')}>Light Tokens</Button>
          <Button size="sm" variant="secondary" onClick={() => setMode('dark')}>Dark Tokens</Button>
        </Flex>
        <Field label="Themed Field" description="ThemeProvider tokens should update this instantly." shell="outline" variant="surface" htmlFor="field-themed">
          <Input id="field-themed" placeholder="Theme-aware input shell" />
        </Field>
      </Grid>
    </ThemeProvider>
  );
};
`,ce=`import React from 'react';
import { Flex, Box} from '@editora/ui-react';

export default {
  title: 'UI/Flex',
  component: Flex
};

export const Default = () => (
  <Flex gap="8px" align="center" justify="space-between" style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>
    <Box style={{ background: '#e2e8f0', padding: 8, borderRadius: 8 }}>Left</Box>
    <Box style={{ background: '#e2e8f0', padding: 8, borderRadius: 8 }}>Center</Box>
    <Box style={{ background: '#e2e8f0', padding: 8, borderRadius: 8 }}>Right</Box>
  </Flex>
);

export const ResponsiveProps = () => (
  <Flex
    direction={{ initial: 'column', md: 'row' } as any}
    gap={{ initial: '8px', md: '14px' } as any}
    align={{ initial: 'stretch', md: 'center' } as any}
    style={{ border: '1px dashed #cbd5e1', borderRadius: 10, padding: 12 }}
  >
    <Box style={{ background: '#dbeafe', padding: 10, borderRadius: 8 }}>Card A</Box>
    <Box style={{ background: '#dcfce7', padding: 10, borderRadius: 8 }}>Card B</Box>
    <Box style={{ background: '#fef3c7', padding: 10, borderRadius: 8 }}>Card C</Box>
  </Flex>
);
`,pe=`import React from 'react';
import { Box, Button, Field, Flex, FloatingToolbar, Grid, Input, ThemeProvider } from '@editora/ui-react';

export default {
  title: 'UI/FloatingToolbar',
  component: FloatingToolbar,
  argTypes: {
    open: { control: 'boolean' },
    anchorId: { control: 'text' },
    placement: { control: 'select', options: ['auto', 'top', 'bottom'] },
    align: { control: 'select', options: ['center', 'start', 'end'] },
    offset: { control: { type: 'number', min: 0, max: 40, step: 1 } },
    variant: { control: 'select', options: ['default', 'soft', 'flat', 'glass', 'contrast'] },
    density: { control: 'select', options: ['default', 'compact', 'comfortable'] },
    shape: { control: 'select', options: ['default', 'square', 'soft'] },
    elevation: { control: 'select', options: ['default', 'none', 'low', 'high'] },
    tone: { control: 'select', options: ['default', 'brand', 'success', 'warning', 'danger'] },
    closeOnOutside: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' }
  }
};

function ToolbarActions() {
  return (
    <Flex slot="toolbar" style={{ display: 'flex', gap: 6 }}>
      <Button size="sm">Bold</Button>
      <Button size="sm">Italic</Button>
      <Button size="sm">Underline</Button>
      <Button size="sm" variant="secondary">Link</Button>
      <Button size="sm" variant="secondary">Comment</Button>
    </Flex>
  );
}

export const Playground = (args: any) => {
  const [open, setOpen] = React.useState(!!args.open);
  const [anchorId, setAnchorId] = React.useState(args.anchorId || 'ft-story-anchor-main');
  const [lastClose, setLastClose] = React.useState('none');

  React.useEffect(() => setOpen(!!args.open), [args.open]);
  React.useEffect(() => setAnchorId(args.anchorId || 'ft-story-anchor-main'), [args.anchorId]);

  return (
    <Grid style={{ display: 'grid', gap: 14 }}>
      <Flex style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button size="sm" onClick={() => setOpen(true)}>Open</Button>
        <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>Close</Button>
        <Button size="sm" variant="secondary" onClick={() => setAnchorId('ft-story-anchor-main')}>Main Anchor</Button>
        <Button size="sm" variant="secondary" onClick={() => setAnchorId('ft-story-anchor-alt')}>Alt Anchor</Button>
      </Flex>

      <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(260px, 1fr))', gap: 12 }}>
        <Box
          id="ft-story-anchor-main"
          style={{
            border: '1px solid var(--ui-color-border, rgba(15, 23, 42, 0.16))',
            borderRadius: 12,
            padding: 18,
            background: 'var(--ui-color-surface, #ffffff)',
            color: 'var(--ui-color-text, #0f172a)'
          }}
        >
          Main editable block
        </Box>

        <Box
          id="ft-story-anchor-alt"
          style={{
            border: '1px solid var(--ui-color-border, rgba(15, 23, 42, 0.16))',
            borderRadius: 12,
            padding: 18,
            background: 'var(--ui-color-surface, #ffffff)',
            color: 'var(--ui-color-text, #0f172a)'
          }}
        >
          Secondary block
        </Box>
      </Grid>

      <FloatingToolbar
        anchorId={anchorId}
        open={open}
        placement={args.placement}
        align={args.align}
        offset={args.offset}
        variant={args.variant}
        density={args.density}
        shape={args.shape}
        elevation={args.elevation}
        tone={args.tone}
        closeOnOutside={args.closeOnOutside}
        closeOnEscape={args.closeOnEscape}
        onClose={(detail) => setLastClose(detail.reason || 'unknown')}
      >
        <ToolbarActions />
      </FloatingToolbar>

      <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>Last close reason: {lastClose}</Box>
    </Grid>
  );
};

Playground.args = {
  open: true,
  anchorId: 'ft-story-anchor-main',
  placement: 'auto',
  align: 'center',
  offset: 8,
  variant: 'default',
  density: 'default',
  shape: 'default',
  elevation: 'default',
  tone: 'default',
  closeOnOutside: true,
  closeOnEscape: true
};

export const EnterpriseDocumentEditor = () => {
  const [open, setOpen] = React.useState(true);
  const [saved, setSaved] = React.useState(false);

  return (
    <Grid style={{ display: 'grid', gap: 14, maxWidth: 940 }}>
      <Flex style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <h3 style={{ margin: 0, fontSize: 24, lineHeight: 1.2, color: 'var(--ui-color-text, #0f172a)' }}>Clinical Policy Editor</h3>
          <p style={{ margin: '6px 0 0', fontSize: 14, color: 'var(--ui-color-muted, #64748b)' }}>Inline authoring toolbar with anchored contextual controls.</p>
        </Box>
        <Button size="sm" variant="secondary" onClick={() => setOpen((v) => !v)}>
          {open ? 'Hide Toolbar' : 'Show Toolbar'}
        </Button>
      </Flex>

      <Box
        id="ft-enterprise-anchor"
        style={{
          border: '1px solid var(--ui-color-border, rgba(15, 23, 42, 0.16))',
          borderRadius: 14,
          padding: 18,
          background: 'var(--ui-color-surface, #ffffff)'
        }}
      >
        <Field label="Policy Section Title" htmlFor="policy-title" shell="outline">
          <Input id="policy-title" value="Medication Reconciliation Requirements" />
        </Field>
        <p style={{ margin: '14px 0 0', fontSize: 14, lineHeight: 1.55, color: 'var(--ui-color-text, #0f172a)' }}>
          Providers must verify medication history at admission, transition, and discharge. Exceptions require documented clinical justification.
        </p>
      </Box>

      <FloatingToolbar
        anchorId="ft-enterprise-anchor"
        open={open}
        variant="soft"
        density="comfortable"
        elevation="high"
        tone="brand"
        align="start"
        offset={10}
      >
        <Flex slot="toolbar" style={{ display: 'flex', gap: 6 }}>
          <Button size="sm">H1</Button>
          <Button size="sm">H2</Button>
          <Button size="sm">B</Button>
          <Button size="sm">I</Button>
          <Button size="sm">List</Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setSaved(true);
              setTimeout(() => setSaved(false), 1200);
            }}
          >
            {saved ? 'Saved' : 'Save'}
          </Button>
        </Flex>
      </FloatingToolbar>
    </Grid>
  );
};

export const FlatToolbar = () => (
  <Grid style={{ display: 'grid', gap: 12, maxWidth: 760 }}>
    <Box
      id="ft-flat-anchor"
      style={{
        border: '1px solid var(--ui-color-border, rgba(15, 23, 42, 0.16))',
        borderRadius: 8,
        padding: 18,
        background: 'var(--ui-color-surface, #ffffff)',
        color: 'var(--ui-color-text, #0f172a)'
      }}
    >
      Flat UI anchor surface
    </Box>

    <FloatingToolbar
      anchorId="ft-flat-anchor"
      open
      placement="bottom"
      align="end"
      variant="flat"
      shape="square"
      elevation="none"
      density="compact"
      style={{
        ['--ui-floating-toolbar-border' as any]: '1px solid var(--ui-color-border, rgba(15, 23, 42, 0.16))',
        ['--ui-floating-toolbar-bg' as any]: 'var(--ui-color-surface, #ffffff)'
      }}
    >
      <Flex slot="toolbar" style={{ display: 'flex', gap: 4 }}>
        <Button size="sm" variant="secondary">Cut</Button>
        <Button size="sm" variant="secondary">Copy</Button>
        <Button size="sm" variant="secondary">Paste</Button>
      </Flex>
    </FloatingToolbar>
  </Grid>
);

export const ThemeProviderVerification = () => {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light');
  const tokens =
    mode === 'light'
      ? {
          colors: {
            primary: '#0f766e',
            surface: '#ffffff',
            surfaceAlt: '#f8fafc',
            text: '#0f172a',
            muted: '#64748b',
            border: 'rgba(15, 23, 42, 0.16)',
            focusRing: '#0f766e'
          }
        }
      : {
          colors: {
            primary: '#38bdf8',
            surface: '#0f172a',
            surfaceAlt: '#111c33',
            text: '#e2e8f0',
            muted: '#94a3b8',
            border: '#334155',
            focusRing: '#7dd3fc'
          }
        };

  return (
    <ThemeProvider tokens={tokens as any}>
      <Grid style={{ display: 'grid', gap: 12, maxWidth: 720, background: 'var(--ui-color-background, #ffffff)', padding: 8 }}>
        <Flex style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" onClick={() => setMode('light')}>Light Tokens</Button>
          <Button size="sm" variant="secondary" onClick={() => setMode('dark')}>Dark Tokens</Button>
        </Flex>

        <Box
          id="ft-theme-anchor"
          style={{
            border: '1px solid var(--ui-color-border, rgba(15, 23, 42, 0.16))',
            borderRadius: 10,
            padding: 16,
            background: 'var(--ui-color-surface, #ffffff)',
            color: 'var(--ui-color-text, #0f172a)'
          }}
        >
          Theme-aware floating toolbar anchor
        </Box>

        <FloatingToolbar anchorId="ft-theme-anchor" open variant="soft" tone="brand">
          <Flex slot="toolbar" style={{ display: 'flex', gap: 6 }}>
            <Button size="sm">A</Button>
            <Button size="sm">B</Button>
            <Button size="sm" variant="secondary">C</Button>
          </Flex>
        </FloatingToolbar>
      </Grid>
    </ThemeProvider>
  );
};
`,ue=`import React, { useState } from 'react';
import { Box, Button, Field, Flex, Form, Grid, Input, Progress, Select, Textarea, useForm } from '@editora/ui-react';

export default {
  title: 'UI/Form',
  component: Form,
  argTypes: {
    heading: { control: 'text' },
    description: { control: 'text' },
    state: { control: 'select', options: ['default', 'success', 'warning', 'error'] },
    stateText: { control: 'text' },
    loadingText: { control: 'text' },
    variant: { control: 'select', options: ['default', 'surface', 'outline', 'soft', 'contrast', 'minimal', 'elevated'] },
    tone: { control: 'select', options: ['default', 'brand', 'success', 'warning', 'danger'] },
    density: { control: 'select', options: ['default', 'compact', 'comfortable'] },
    shape: { control: 'select', options: ['default', 'square', 'soft'] },
    elevation: { control: 'select', options: ['default', 'none', 'low', 'high'] },
    gap: { control: 'text' },
    novalidate: { control: 'boolean' }
  }
};

export const Playground = (args: any) => {
  const { ref, submit, getValues, validate } = useForm();
  const [message, setMessage] = useState('No action yet');

  return (
    <Box style={{ maxWidth: 620 }}>
      <Form
        ref={ref}
        heading={args.heading}
        description={args.description}
        state={args.state}
        stateText={args.stateText}
        loadingText={args.loadingText}
        variant={args.variant}
        tone={args.tone}
        density={args.density}
        shape={args.shape}
        elevation={args.elevation}
        gap={args.gap}
        novalidate={args.novalidate}
        onSubmit={(values) => setMessage(\`Submitted: \${JSON.stringify(values)}\`)}
        onInvalid={(errors) => setMessage(\`Invalid: \${JSON.stringify(errors)}\`)}
      >
        <Button slot="actions" size="sm" variant="secondary" onClick={() => setMessage(\`Preview values: \${JSON.stringify(getValues())}\`)}>
          Preview
        </Button>
        <Grid style={{ display: 'grid', gap: 12 }}>
          <Field label="First name" htmlFor="form-first-name" required variant="outline">
            <Input id="form-first-name" name="firstName" placeholder="Jane" required />
          </Field>

          <Field label="Email" htmlFor="form-email" required variant="outline">
            <Input id="form-email" name="email" type="email" placeholder="you@company.com" required />
          </Field>

          <Field label="Notes" htmlFor="form-notes" description="Optional context for reviewers." variant="soft">
            <Textarea id="form-notes" name="notes" rows={4} placeholder="Add additional details..." />
          </Field>
        </Grid>

        <Box style={{ marginTop: 12 }}>
          <Button onClick={() => submit()}>Submit</Button>
          <Button style={{ marginLeft: 8 }} variant="secondary" onClick={async () => setMessage(JSON.stringify(await validate()))}>
            Validate
          </Button>
          <Button style={{ marginLeft: 8 }} variant="ghost" onClick={() => setMessage(JSON.stringify(getValues()))}>
            Get values
          </Button>
        </Box>
        <Box slot="status" style={{ fontSize: 'var(--ui-font-size-sm, 12px)' }}>
          {message}
        </Box>
      </Form>
    </Box>
  );
};

Playground.args = {
  heading: 'Provider Profile',
  description: 'Collect and validate core details before provisioning.',
  state: 'default',
  stateText: '',
  loadingText: 'Saving profile...',
  variant: 'surface',
  tone: 'default',
  density: 'default',
  shape: 'default',
  elevation: 'default',
  gap: '12px',
  novalidate: false
};

export const ValidationFlow = () => {
  const { ref, submit } = useForm();
  const [state, setState] = useState('idle');
  const [formState, setFormState] = useState<'default' | 'success' | 'warning' | 'error'>('default');

  return (
    <Box style={{ maxWidth: 560 }}>
      <Form
        ref={ref}
        heading="Project Access Policy"
        description="Validation should prevent misconfigured policy codes."
        variant="outline"
        tone="warning"
        state={formState}
        stateText={state === 'idle' ? '' : \`Validation state: \${state}\`}
        onSubmit={() => {
          setState('submitted');
          setFormState('success');
        }}
        onInvalid={() => {
          setState('invalid');
          setFormState('error');
        }}
      >
        <Field label="Project code" htmlFor="form-code" required>
          <Input id="form-code" name="code" pattern="[A-Z]{3}-[0-9]{3}" required placeholder="ABC-123" />
        </Field>

        <Box style={{ marginTop: 12 }}>
          <Button onClick={() => submit()}>Run validation</Button>
          <Box style={{ marginTop: 8, fontSize: 'var(--ui-font-size-md, 14px)', color: 'var(--ui-color-muted, #64748b)' }}>State: {state}</Box>
        </Box>
      </Form>
    </Box>
  );
};

export const ContrastMode = () => {
  const { ref, submit } = useForm();
  return (
    <Box style={{ maxWidth: 620, background: 'color-mix(in srgb, var(--ui-color-text, #0f172a) 94%, transparent)', padding: 'var(--ui-space-md, 12px)', borderRadius: 'calc(var(--ui-radius, 12px) + 2px)' }}>
      <Form
        ref={ref}
        heading="Dark Surface Audit Form"
        description="High-contrast form with consistent typography and spacing."
        variant="contrast"
        shape="soft"
        elevation="high"
        onSubmit={() => {}}
      >
        <Field label="Workspace" htmlFor="form-workspace" variant="contrast">
          <Input id="form-workspace" name="workspace" value="Editora" />
        </Field>

        <Field label="Release notes" htmlFor="form-release" variant="contrast" description="Visible in changelog panel.">
          <Textarea id="form-release" name="release" rows={3} value="Sprint 3: hardening complete." />
        </Field>

        <Box style={{ marginTop: 12 }}>
          <Button onClick={() => submit()}>Save</Button>
        </Box>
      </Form>
    </Box>
  );
};

export const ProVisualModes = () => {
  const { ref, submit } = useForm();

  return (
    <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(280px, 1fr))', gap: 14 }}>
      <Form ref={ref} variant="minimal" tone="brand" onSubmit={() => {}}>
        <span slot="title">Minimal form</span>
        <Field label="Minimal form" htmlFor="form-minimal">
          <Input id="form-minimal" name="minimal" placeholder="Flat mode for dense pages" />
        </Field>
        <Button onClick={() => submit()}>Submit</Button>
      </Form>

      <Form variant="elevated" tone="success" shape="soft" elevation="high" heading="Elevated approval form" onSubmit={() => {}}>
        <Field label="Elevated form" htmlFor="form-elevated" variant="elevated">
          <Input id="form-elevated" name="elevated" placeholder="Depth-rich mode" />
        </Field>
        <Button>Save</Button>
      </Form>
    </Grid>
  );
};

export const AdvancedAdminFlow = () => {
  const { ref, submit } = useForm();
  const [step, setStep] = useState(1);
  const [dirty, setDirty] = useState(false);
  const [autosaveAt, setAutosaveAt] = useState('never');
  const [status, setStatus] = useState('idle');

  const progress = step === 1 ? 34 : step === 2 ? 68 : 100;

  return (
    <Box style={{ maxWidth: 760, display: 'grid', gap: 12 }}>
      <Progress value={progress} max={100} shape="round" />
      <Flex style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <Box style={{ fontSize: 'var(--ui-font-size-md, 14px)', color: 'var(--ui-color-muted, #64748b)' }}>
          Step {step} of 3 • Dirty: <strong>{String(dirty)}</strong> • Autosave: <strong>{autosaveAt}</strong>
        </Box>
        <Box style={{ fontSize: 'var(--ui-font-size-sm, 12px)', color: 'var(--ui-color-muted, #64748b)' }}>Unsaved-change guard is enabled on this story.</Box>
      </Flex>

      <Form
        ref={ref}
        heading="Tenant Provisioning Wizard"
        description="Autosave and unsaved-change guard are active for this flow."
        variant="elevated"
        tone="brand"
        autosave
        autosaveDelay={700}
        guardUnsaved
        onAutosave={() => setAutosaveAt(new Date().toLocaleTimeString())}
        onDirtyChange={(nextDirty) => setDirty(nextDirty)}
        onSubmit={() => setStatus('submitted')}
        onInvalid={() => setStatus('invalid')}
      >
        <Grid style={{ display: 'grid', gap: 12 }}>
          {step === 1 && (
            <>
              <Field label="Organization name" htmlFor="wizard-org" required variant="outline">
                <Input id="wizard-org" name="organization" required placeholder="Northstar Health" />
              </Field>
              <Field label="Primary admin email" htmlFor="wizard-email" required variant="outline">
                <Input id="wizard-email" name="adminEmail" type="email" required placeholder="admin@northstar.health" />
              </Field>
            </>
          )}

          {step === 2 && (
            <>
              <Field label="Module type" htmlFor="wizard-module" required variant="soft">
                <Select id="wizard-module" name="moduleType" required>
                  <option value="">Choose module</option>
                  <option value="hospital">Hospital</option>
                  <option value="school">School</option>
                  <option value="enterprise">Enterprise shared</option>
                </Select>
              </Field>
              <Field label="Record retention policy" htmlFor="wizard-policy" required description="Use uppercase code format." variant="soft">
                <Input id="wizard-policy" name="policyCode" required pattern="[A-Z]{3}-[0-9]{2}" placeholder="MED-07" />
              </Field>
            </>
          )}

          {step === 3 && (
            <Field label="Launch notes" htmlFor="wizard-notes" description="Inline validation remains consistent across steps." variant="elevated">
              <Textarea id="wizard-notes" name="notes" rows={4} placeholder="Team onboarding checklist and runbook notes..." />
            </Field>
          )}
        </Grid>

        <Flex style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, gap: 8 }}>
          <Button variant="ghost" onClick={() => setStep((current) => Math.max(1, current - 1))} disabled={step === 1}>
            Previous
          </Button>
          <Flex style={{ display: 'flex', gap: 8 }}>
            {step < 3 ? (
              <Button variant="secondary" onClick={() => setStep((current) => Math.min(3, current + 1))}>
                Next
              </Button>
            ) : (
              <Button onClick={() => submit()}>Submit setup</Button>
            )}
          </Flex>
        </Flex>
      </Form>

      <Box style={{ fontSize: 'var(--ui-font-size-md, 14px)', color: 'var(--ui-color-text, #0f172a)' }}>Validation state: <strong>{status}</strong></Box>
    </Box>
  );
};
`,ge=`import React from 'react';
import { Box, Gantt } from '@editora/ui-react';

export default {
  title: 'UI/Gantt',
  component: Gantt
};

const tasks = [
  { id: '1', label: 'Admissions Module', start: '2026-02-01', end: '2026-02-14', progress: 88, tone: 'success' as const },
  { id: '2', label: 'Billing Integrations', start: '2026-02-05', end: '2026-02-22', progress: 54, tone: 'warning' as const },
  { id: '3', label: 'Staff Scheduling', start: '2026-02-11', end: '2026-02-27', progress: 32, tone: 'default' as const },
  { id: '4', label: 'Audit + Compliance', start: '2026-02-15', end: '2026-03-01', progress: 22, tone: 'danger' as const }
];

export const Default = () => (
  <Box style={{ maxWidth: 860 }}>
    <Gantt tasks={tasks} />
  </Box>
);

export const Contrast = () => (
  <Box variant="contrast" p="12px" radius="lg" style={{ maxWidth: 860 }}>
    <Gantt tasks={tasks} variant="contrast" />
  </Box>
);
`,me=`import React from 'react';
import { Grid, Box} from '@editora/ui-react';

export default {
  title: 'UI/Grid',
  component: Grid
};

export const Default = () => (
  <Grid columns="repeat(3, minmax(0, 1fr))" gap="10px">
    <Box style={{ background: '#e2e8f0', padding: 12, borderRadius: 8 }}>1</Box>
    <Box style={{ background: '#e2e8f0', padding: 12, borderRadius: 8 }}>2</Box>
    <Box style={{ background: '#e2e8f0', padding: 12, borderRadius: 8 }}>3</Box>
  </Grid>
);

export const ResponsiveColumns = () => (
  <Grid
    columns={{ initial: '1fr', md: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' } as any}
    gap={{ initial: '8px', md: '12px' } as any}
  >
    {Array.from({ length: 8 }).map((_, idx) => (
      <Box key={idx} style={{ background: '#f1f5f9', padding: 12, borderRadius: 8 }}>
        Item {idx + 1}
      </Box>
    ))}
  </Grid>
);
`,xe=`import React from 'react';
import { Box, Grid, HoverCard } from '@editora/ui-react';

export default {
  title: 'UI/HoverCard',
  component: HoverCard,
  argTypes: {
    delay: { control: { type: 'number', min: 0, max: 1200, step: 20 } },
    closeDelay: { control: { type: 'number', min: 0, max: 1200, step: 20 } },
    placement: { control: 'select', options: ['bottom', 'top', 'left', 'right'] },
    offset: { control: { type: 'number', min: 0, max: 40, step: 1 } },
    variant: { control: 'select', options: ['default', 'line', 'glass', 'contrast', 'minimal', 'elevated'] },
    tone: { control: 'select', options: ['default', 'brand', 'success', 'warning', 'danger'] },
    density: { control: 'select', options: ['default', 'compact', 'comfortable'] },
    shape: { control: 'select', options: ['default', 'square', 'soft'] },
    elevation: { control: 'select', options: ['default', 'none', 'low', 'high'] }
  }
};

export const Playground = (args: any) => (
  <HoverCard
    delay={args.delay}
    closeDelay={args.closeDelay}
    placement={args.placement}
    offset={args.offset}
    variant={args.variant}
    tone={args.tone}
    density={args.density}
    shape={args.shape}
    elevation={args.elevation}
    style={{ display: 'inline-block' }}
  >
    <button style={{ padding: '8px 12px' }}>Hover me</button>
    <div slot="card">
      <strong>Editora</strong>
      <p style={{ margin: '6px 0 0', fontSize: 13, color: '#475569' }}>Composable editor UI primitives.</p>
    </div>
  </HoverCard>
);

Playground.args = {
  delay: 120,
  closeDelay: 140,
  placement: 'bottom',
  offset: 10,
  variant: 'default',
  tone: 'default',
  density: 'default',
  shape: 'default',
  elevation: 'default'
};

export const VisualModes = () => (
  <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(260px, 1fr))', gap: 16, padding: 10 }}>
    <Box style={{ padding: 14, border: '1px solid #e2e8f0', borderRadius: 12 }}>
      <HoverCard variant="line" tone="brand" placement="right" closeDelay={180}>
        <button style={{ padding: '8px 12px' }}>Line / Brand</button>
        <Box slot="card" style={{ display: 'grid', gap: 6 }}>
          <strong>Activity</strong>
          <span>Last edited by Priya</span>
          <span>2 minutes ago</span>
        </Box>
      </HoverCard>
    </Box>

    <Box style={{ padding: 14, border: '1px solid #e2e8f0', borderRadius: 12, background: 'linear-gradient(145deg, #f8fafc, #eef2ff)' }}>
      <HoverCard variant="glass" shape="soft" elevation="high" placement="left">
        <button style={{ padding: '8px 12px' }}>Glass / Soft</button>
        <Box slot="card" style={{ display: 'grid', gap: 6 }}>
          <strong>Workspace</strong>
          <span>12 collaborators online</span>
          <span>Theme-safe surface</span>
        </Box>
      </HoverCard>
    </Box>

    <Box style={{ padding: 14, border: '1px solid #e2e8f0', borderRadius: 12 }}>
      <HoverCard variant="default" tone="success" density="compact" placement="top">
        <button style={{ padding: '8px 12px' }}>Compact / Success</button>
        <Box slot="card" style={{ display: 'grid', gap: 4 }}>
          <strong>Deployment</strong>
          <span>Build healthy</span>
          <span>All checks passed</span>
        </Box>
      </HoverCard>
    </Box>

    <Box style={{ padding: 14, border: '1px solid #1e293b', borderRadius: 12, background: '#020617', color: '#e2e8f0' }}>
      <HoverCard variant="contrast" tone="danger" placement="bottom" shape="square">
        <button style={{ padding: '8px 12px' }}>Contrast / Danger</button>
        <Box slot="card" style={{ display: 'grid', gap: 6 }}>
          <strong>Critical Action</strong>
          <span>This cannot be undone.</span>
        </Box>
      </HoverCard>
    </Box>

    <Box style={{ padding: 14, border: '1px dashed #94a3b8', borderRadius: 12 }}>
      <HoverCard variant="minimal" tone="brand" placement="bottom">
        <button style={{ padding: '8px 12px' }}>Minimal / Brand</button>
        <Box slot="card" style={{ display: 'grid', gap: 6 }}>
          <strong>Quick details</strong>
          <span>Low-noise compact surface.</span>
        </Box>
      </HoverCard>
    </Box>

    <Box style={{ padding: 14, border: '1px solid #e2e8f0', borderRadius: 12, background: 'linear-gradient(155deg, #f8fafc, #eef2ff)' }}>
      <HoverCard variant="elevated" tone="warning" placement="right" elevation="high">
        <button style={{ padding: '8px 12px' }}>Elevated / Warning</button>
        <Box slot="card" style={{ display: 'grid', gap: 6 }}>
          <strong>Review required</strong>
          <span>Premium floating card with depth.</span>
        </Box>
      </HoverCard>
    </Box>
  </Grid>
);

export const RichCardContent = () => (
  <HoverCard>
    <span tabIndex={0} style={{ display: 'inline-block', padding: 8, borderBottom: '1px dashed #94a3b8' }}>Product details</span>
    <Grid slot="card" style={{ display: 'grid', gap: 6 }}>
      <div>Release: <strong>2.0</strong></div>
      <div>Support: LTR / RTL</div>
      <div>Theme-ready tokens</div>
    </Grid>
  </HoverCard>
);
`,fe=`import React from 'react';
import { Box, Flex, Grid, Icon } from '@editora/ui-react';

export default {
  title: 'UI/Icon',
  component: Icon,
  argTypes: {
    name: { control: 'text' },
    size: { control: 'text' },
    variant: { control: 'select', options: ['default', 'surface', 'soft', 'contrast', 'minimal', 'elevated'] },
    tone: { control: 'select', options: ['default', 'brand', 'success', 'warning', 'danger'] },
    shape: { control: 'select', options: ['default', 'square', 'soft'] },
    color: { control: 'color' },
    label: { control: 'text' },
    spin: { control: 'boolean' },
    pulse: { control: 'boolean' },
    badge: { control: 'boolean' },
    decorative: { control: 'boolean' }
  }
};

export const Playground = (args: any) => (
  <Flex style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
    <Icon
      name={args.name}
      size={args.size}
      variant={args.variant}
      tone={args.tone}
      shape={args.shape}
      color={args.color}
      label={args.label}
      spin={args.spin}
      pulse={args.pulse}
      badge={args.badge}
      decorative={args.decorative}
    />
    <Box style={{ fontSize: 14, color: '#475569' }}>Token-driven icon with accessible modes and visual variants.</Box>
  </Flex>
);

Playground.args = {
  name: 'check',
  size: '20px',
  variant: 'surface',
  tone: 'brand',
  shape: 'soft',
  color: '',
  label: 'Confirmed',
  spin: false,
  pulse: false,
  badge: false,
  decorative: false
};

export const DesignModes = () => (
  <Grid style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(3, minmax(200px, 1fr))' }}>
    <Box style={{ display: 'grid', gap: 10, border: '1px solid #e2e8f0', borderRadius: 12, padding: 12, background: '#f8fafc' }}>
      <Box style={{ fontSize: 12, color: '#64748b' }}>MUI-like</Box>
      <Flex style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <Icon name="check" variant="surface" tone="brand" size="22" />
        <Icon name="x" variant="surface" tone="danger" size="22" />
      </Flex>
    </Box>

    <Box style={{ display: 'grid', gap: 10, border: '1px solid #e2e8f0', borderRadius: 12, padding: 12, background: 'linear-gradient(145deg, #f8fafc, #eef2ff)' }}>
      <Box style={{ fontSize: 12, color: '#64748b' }}>Chakra-like</Box>
      <Flex style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <Icon name="check" variant="soft" tone="success" shape="soft" size="22" />
        <Icon name="x" variant="soft" tone="warning" shape="soft" size="22" />
      </Flex>
    </Box>

    <Box style={{ display: 'grid', gap: 10, border: '1px solid #1e293b', borderRadius: 12, padding: 12, background: '#020617', color: '#e2e8f0' }}>
      <Box style={{ fontSize: 12, color: '#93a4bd' }}>Ant-like</Box>
      <Flex style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <Icon name="check" variant="contrast" size="22" />
        <Icon name="x" variant="contrast" tone="danger" size="22" badge />
      </Flex>
    </Box>
  </Grid>
);

export const MotionAndFallback = () => (
  <Flex style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
    <Icon name="check" spin tone="brand" variant="minimal" size="24" label="Syncing" decorative={false} />
    <Icon name="x" pulse tone="warning" variant="elevated" size="22" />
    <Icon name="unknown" variant="surface" tone="danger" size="22" />
  </Flex>
);
`,he=`import React from 'react';
import { Box, Grid, Icon } from '@editora/ui-react';
import { iconNameList } from '@editora/icons';

export default {
  title: 'UI/Icons Catalog',
  component: Icon,
  argTypes: {
    iconVariant: { control: 'select', options: ['outline', 'solid', 'duotone'] },
    size: { control: 'number' },
    strokeWidth: { control: 'number' },
    variant: { control: 'select', options: ['default', 'surface', 'soft', 'contrast', 'minimal', 'elevated'] },
    tone: { control: 'select', options: ['default', 'brand', 'success', 'warning', 'danger'] },
    shape: { control: 'select', options: ['default', 'square', 'soft'] },
    color: { control: 'color' },
    secondaryColor: { control: 'color' }
  }
};

export const AllIcons = (args: any) => {
  const [query, setQuery] = React.useState('');

  const filteredNames = React.useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return iconNameList;
    return iconNameList.filter((name) => name.includes(term));
  }, [query]);

  return (
    <Box style={{ display: 'grid', gap: 12 }}>
      <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#475569' }}>
        <span>Showing {filteredNames.length} / {iconNameList.length} icons</span>
        <span>Source: @editora/icons</span>
      </Box>

      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search icons..."
        style={{
          width: '100%',
          border: '1px solid #cbd5e1',
          borderRadius: 10,
          padding: '10px 12px',
          fontSize: 14,
          outline: 'none'
        }}
      />

      <Grid columns="repeat(auto-fill, minmax(48px, 1fr))" gap="10px">
        {filteredNames.map((name) => (
          <Box
            key={name}
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              padding: 10,
              display: 'grid',
              gap: 8,
              justifyItems: 'start',
              background: 'linear-gradient(180deg, #ffffff, #f8fafc)'
            }}
          >
            <Icon
              name={name}
              iconVariant={args.iconVariant}
              size={args.size}
              strokeWidth={args.strokeWidth}
              variant={args.variant}
              tone={args.tone}
              shape={args.shape}
              color={args.color || undefined}
              secondaryColor={args.secondaryColor || undefined}
              label={name}
              decorative={false}
            />
            {/* <Box style={{ fontSize: 11, color: '#334155', lineHeight: 1.25, wordBreak: 'break-word' }}>{name}</Box> */}
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

AllIcons.args = {
  iconVariant: 'outline',
  size: 18,
  strokeWidth: 1.5,
  variant: 'minimal',
  tone: 'default',
  shape: 'default',
  color: '',
  secondaryColor: ''
};
`,ve=`import React from 'react';
import { Box, Grid, Input, ThemeProvider } from '@editora/ui-react';

export default {
  title: 'UI/Input',
  component: Input,
  argTypes: {
    value: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    clearable: { control: 'boolean' },
    debounce: { control: 'number' },
    validation: { control: { type: 'radio', options: ['none', 'error', 'success'] } },
    size: { control: { type: 'radio', options: ['1', '2', '3', 'sm', 'md', 'lg'] } },
    maxlength: { control: 'number' },
    minlength: { control: 'number' },
    autofocus: { control: 'boolean' },
    required: { control: 'boolean' },
    floatingLabel: { control: 'boolean' },
    counter: { control: 'boolean' },
    variant: { control: 'select', options: ['classic', 'surface', 'soft', 'outlined', 'filled', 'flushed', 'minimal', 'contrast', 'elevated'] },
    tone: { control: 'select', options: ['default', 'brand', 'success', 'warning', 'danger'] },
    density: { control: 'select', options: ['default', 'compact', 'comfortable'] },
    shape: { control: 'select', options: ['default', 'square', 'soft'] },
    radius: { control: { type: 'radio', options: ['none', 'default', 'large', 'full'] } },
    label: { control: 'text' },
    description: { control: 'text' }
  }
};

export const Playground = (args: any) => (
  <Box style={{ inlineSize: 'min(460px, 100%)' }}>
    <Input
      value={args.value}
      placeholder={args.placeholder}
      disabled={args.disabled}
      clearable={args.clearable}
      debounce={args.debounce}
      validation={args.validation}
      size={args.size}
      minlength={args.minlength}
      maxlength={args.maxlength}
      autofocus={args.autofocus}
      required={args.required}
      floatingLabel={args.floatingLabel}
      counter={args.counter}
      variant={args.variant}
      tone={args.tone}
      density={args.density}
      shape={args.shape}
      radius={args.radius === 'default' ? undefined : args.radius}
      label={args.label}
      description={args.description}
      onDebouncedInput={(next) => {
        const root = document.getElementById('input-playground-value');
        if (root) root.textContent = \`Debounced value: \${next}\`;
      }}
    />
    <Box id="input-playground-value" style={{ marginTop: 8, fontSize: 12, color: '#64748b' }}>
      Debounced value:
    </Box>
  </Box>
);

Playground.args = {
  value: '',
  placeholder: 'Type here…',
  disabled: false,
  clearable: true,
  debounce: 220,
  validation: 'none',
  size: 'md',
  minlength: undefined,
  maxlength: 64,
  autofocus: false,
  required: false,
  floatingLabel: false,
  counter: false,
  variant: 'surface',
  tone: 'default',
  density: 'default',
  shape: 'default',
  radius: 'default',
  label: 'Workspace name',
  description: 'Shown in the app header and analytics reports.'
};

export const WithSlots = () => (
  <Box style={{ inlineSize: 'min(480px, 100%)' }}>
    <Input label="Search users" description="Prefix, suffix, and custom error slot." clearable variant="outlined" placeholder="Find by name or email">
      <span slot="prefix">🔍</span>
      <button slot="suffix" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>Go</button>
      <span slot="error">No matching user in current workspace.</span>
    </Input>
  </Box>
);

export const DesignDirections = () => (
  <Grid style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(3, minmax(240px, 1fr))' }}>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 12, display: 'grid', gap: 10 }}>
      <Box style={{ fontSize: 12, color: '#64748b' }}>MUI-like</Box>
      <Input label="Project" variant="outlined" tone="brand" placeholder="Roadmap V3" />
      <Input label="Version" variant="filled" placeholder="2.1.0" />
    </Box>

    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 12, display: 'grid', gap: 10, background: 'linear-gradient(145deg, #f8fafc, #eef2ff)' }}>
      <Box style={{ fontSize: 12, color: '#64748b' }}>Chakra-like</Box>
      <Input label="Team" variant="soft" tone="success" shape="soft" placeholder="Engineering" />
      <Input label="Channel" variant="soft" tone="brand" shape="soft" placeholder="#release-sync" />
    </Box>

    <Box style={{ border: '1px solid #1e293b', borderRadius: 12, padding: 12, display: 'grid', gap: 10, background: '#020617' }}>
      <Box style={{ fontSize: 12, color: '#93a4bd' }}>Ant-like</Box>
      <Input label="Email" variant="contrast" placeholder="ops@company.com" type="email" />
      <Input label="Token" variant="flushed" tone="warning" placeholder="Paste token" />
    </Box>
  </Grid>
);

export const ValidationAndCounter = () => (
  <Grid style={{ display: 'grid', gap: 12, inlineSize: 'min(480px, 100%)' }}>
    <Input label="Release note" description="Validation + counter mode." validation="error" counter maxlength={48} value="Need update" clearable>
      <span slot="error">Please include the ticket reference.</span>
    </Input>
    <Input label="Tag" validation="success" value="approved" size="sm" tone="success" />
  </Grid>
);

export const ThemedByTokens = () => (
  <ThemeProvider
    tokens={{
      colors: {
        primary: '#0f766e',
        background: '#f8fafc',
        text: '#0f172a'
      },
      radius: '12px'
    }}
  >
    <Box style={{ padding: 12, background: 'var(--ui-color-background)', borderRadius: 12, inlineSize: 'min(460px, 100%)' }}>
      <Input label="Token-driven input" placeholder="Uses theme provider tokens" variant="elevated" />
    </Box>
  </ThemeProvider>
);
`,be=`import React from 'react';
import { Box, Grid, Input, Label } from '@editora/ui-react';

export default {
  title: 'UI/Label',
  component: Label,
  argTypes: {
    htmlFor: { control: 'text' },
    required: { control: 'boolean' },
    description: { control: 'text' },
    variant: { control: 'select', options: ['default', 'surface', 'soft', 'contrast', 'minimal', 'elevated'] },
    tone: { control: 'select', options: ['default', 'brand', 'success', 'warning', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg', '1', '2', '3'] },
    density: { control: 'select', options: ['default', 'compact', 'comfortable'] },
    shape: { control: 'select', options: ['default', 'square', 'soft'] }
  }
};

export const Playground = (args: any) => (
  <Grid style={{ display: 'grid', gap: 8, maxWidth: 360 }}>
    <Label
      htmlFor={args.htmlFor}
      required={args.required}
      description={args.description}
      variant={args.variant}
      tone={args.tone}
      size={args.size}
      density={args.density}
      shape={args.shape}
    >
      Workspace name
    </Label>
    <Input id={args.htmlFor} placeholder="Acme Production" />
  </Grid>
);

Playground.args = {
  htmlFor: 'storybook-label-input',
  required: true,
  description: 'Used in account settings and billing reports.',
  variant: 'surface',
  tone: 'default',
  size: 'md',
  density: 'default',
  shape: 'default'
};

export const ProModes = () => (
  <Grid style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(3, minmax(220px, 1fr))' }}>
    <Box style={{ display: 'grid', gap: 8, border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
      <Label htmlFor="label-mui" variant="surface" tone="brand">MUI-like Label</Label>
      <Input id="label-mui" placeholder="Outlined control" variant="outlined" />
    </Box>

    <Box style={{ display: 'grid', gap: 8, border: '1px solid #e2e8f0', borderRadius: 12, padding: 12, background: 'linear-gradient(145deg, #f8fafc, #eef2ff)' }}>
      <Label htmlFor="label-chakra" variant="soft" tone="success" shape="soft" description="Low-noise form grouping">Chakra-like Label</Label>
      <Input id="label-chakra" placeholder="Soft control" variant="soft" shape="soft" />
    </Box>

    <Box style={{ display: 'grid', gap: 8, border: '1px solid #1e293b', borderRadius: 12, padding: 12, background: '#020617' }}>
      <Label htmlFor="label-ant" variant="contrast" description="Dark admin mode">Ant-like Label</Label>
      <Input id="label-ant" placeholder="Contrast control" variant="contrast" />
    </Box>
  </Grid>
);

export const WithHintSlot = () => (
  <Grid style={{ display: 'grid', gap: 8, maxWidth: 360 }}>
    <Label htmlFor="storybook-email-input" required>
      Email
      <span slot="description">We use this only for account notifications.</span>
    </Label>
    <Input id="storybook-email-input" type="email" placeholder="you@company.com" />
  </Grid>
);
`,ye=`import React from 'react';
import { Layout, Box, Button, Flex, Grid, Section, Container } from '@editora/ui-react';

export default {
  title: 'UI/Layout',
  component: Layout,
  argTypes: {
    mode: { control: 'select', options: ['dashboard', 'split', 'stack'] },
    variant: { control: 'select', options: ['default', 'flat', 'elevated', 'glass', 'contrast'] },
    density: { control: 'select', options: ['default', 'compact', 'comfortable'] },
    maxWidth: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
    sidebarSide: { control: 'select', options: ['start', 'end'] },
    collapsed: { control: 'boolean' }
  }
};

const SidebarList = () => (
  <Grid style={{ display: 'grid', gap: 8 }}>
    <Button variant="ghost">Dashboard</Button>
    <Button variant="ghost">Users</Button>
    <Button variant="ghost">Reports</Button>
    <Button variant="ghost">Settings</Button>
  </Grid>
);

const ContentCards = () => (
  <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
      <strong>Weekly revenue</strong>
      <Box style={{ marginTop: 8, fontSize: 13, color: '#64748b' }}>+18.4% vs last week</Box>
    </Box>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
      <strong>Active users</strong>
      <Box style={{ marginTop: 8, fontSize: 13, color: '#64748b' }}>12,482 online</Box>
    </Box>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
      <strong>Conversion rate</strong>
      <Box style={{ marginTop: 8, fontSize: 13, color: '#64748b' }}>4.8% this month</Box>
    </Box>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
      <strong>Pending alerts</strong>
      <Box style={{ marginTop: 8, fontSize: 13, color: '#64748b' }}>7 require review</Box>
    </Box>
  </Grid>
);

export const Playground = (args: any) => (
  <Layout
    mode={args.mode}
    variant={args.variant}
    density={args.density}
    maxWidth={args.maxWidth}
    sidebarSide={args.sidebarSide}
    collapsed={args.collapsed}
    style={{ width: '100%', minHeight: 520 }}
  >
    <Flex slot="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
      <strong>Admin workspace</strong>
      <Flex style={{ display: 'flex', gap: 8 }}>
        <Button variant="secondary">Filters</Button>
        <Button>New report</Button>
      </Flex>
    </Flex>

    <Box slot="sidebar">
      <SidebarList />
    </Box>

    <Box slot="content">
      <ContentCards />
    </Box>

    <Box slot="aside">
      <Grid style={{ display: 'grid', gap: 10 }}>
        <Box style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>
          <strong>Team notes</strong>
          <Box style={{ marginTop: 8, fontSize: 13, color: '#64748b' }}>Sprint planning at 14:30.</Box>
        </Box>
        <Box style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>
          <strong>Deploy status</strong>
          <Box style={{ marginTop: 8, fontSize: 13, color: '#64748b' }}>Production healthy.</Box>
        </Box>
      </Grid>
    </Box>

    <Flex slot="footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
      <Box style={{ fontSize: 13, color: '#64748b' }}>Updated 2 minutes ago</Box>
      <Button variant="secondary">Export</Button>
    </Flex>
  </Layout>
);

Playground.args = {
  mode: 'dashboard',
  variant: 'default',
  density: 'default',
  maxWidth: 'xl',
  sidebarSide: 'start',
  collapsed: false
};

export const VisualModes = () => (
  <Grid style={{ display: 'grid', gap: 18 }}>
    <Layout variant="default" maxWidth="xl" style={{ width: '100%' }}>
      <Box slot="header"><strong>Default</strong></Box>
      <Box slot="sidebar"><SidebarList /></Box>
      <Box slot="content"><ContentCards /></Box>
      <Box slot="aside">Insights</Box>
    </Layout>

    <Layout variant="flat" density="compact" maxWidth="xl" style={{ width: '100%' }}>
      <Box slot="header"><strong>Flat / Compact</strong></Box>
      <Box slot="sidebar"><SidebarList /></Box>
      <Box slot="content"><ContentCards /></Box>
    </Layout>

    <Layout variant="glass" density="comfortable" maxWidth="xl" style={{ width: '100%' }}>
      <Box slot="header"><strong>Glass / Comfortable</strong></Box>
      <Box slot="sidebar"><SidebarList /></Box>
      <Box slot="content"><ContentCards /></Box>
      <Box slot="aside">Quick actions</Box>
    </Layout>
  </Grid>
);

export const LegacyPrimitives = () => (
  <Box style={{ padding: 20 }}>
    <Flex style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
      <Box style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12, flex: 1 }}>ui-flex item A</Box>
      <Box style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12, flex: 1 }}>ui-flex item B</Box>
    </Flex>
    <Grid style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <Box style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>ui-grid A</Box>
      <Box style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>ui-grid B</Box>
    </Grid>
    <Section size="medium" style={{ marginTop: 14 }}>
      <Container size="lg">
        <Box style={{ border: '1px dashed #cbd5e1', borderRadius: 10, padding: 12 }}>
          Existing \`Section\` and \`Container\` remain supported with \`Layout\`.
        </Box>
      </Container>
    </Section>
  </Box>
);
`,Be=`import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useRef, useState } from "react";

// Import the light code editor library
import {
  createEditor,
  LineNumbersExtension,
  SyntaxHighlightingExtension,
  ThemeExtension,
  ReadOnlyExtension,
  SearchExtension,
  BracketMatchingExtension,
  CodeFoldingExtension
} from "@editora/light-code-editor";
import "../../packages/light-code-editor/dist/light-code-editor.css";
import { Box, Flex} from '@editora/ui-react';


const meta: Meta = {
  title: "UI Components/Light Code Editor",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: \`
# Light Code Editor - Lightweight Code Editor Library

**Bundle Size**: ~38 KB ES module (8.7 KB gzipped)  
**Features**: Syntax highlighting, themes, search, folding, extensions  
**Zero Dependencies**: Framework agnostic, works everywhere  

## Features
- ✅ Self-contained library (CSS included)
- ✅ Modular extension system
- ✅ HTML syntax highlighting
- ✅ Light and dark themes
- ✅ Line numbers gutter
- ✅ Search and replace
- ✅ Bracket matching
- ✅ Code folding
- ✅ Read-only mode
- ✅ TypeScript support
- ✅ Zero runtime dependencies
        \`,
      },
    },
  },
  argTypes: {
    theme: {
      control: { type: "select" },
      options: ["light", "dark"],
      description: "Editor theme",
    },
    showLineNumbers: {
      control: { type: "boolean" },
      description: "Show line numbers",
    },
    syntaxHighlighting: {
      control: { type: "boolean" },
      description: "Enable syntax highlighting",
    },
    readOnly: {
      control: { type: "boolean" },
      description: "Read-only mode",
    },
    enableSearch: {
      control: { type: "boolean" },
      description: "Enable search functionality",
    },
    bracketMatching: {
      control: { type: "boolean" },
      description: "Enable bracket matching",
    },
    codeFolding: {
      control: { type: "boolean" },
      description: "Enable code folding",
    },
  },
};

export default meta;
type Story = StoryObj;

const sampleHTML = \`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sample Document</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
      background-color: #f5f5f5;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    h1 {
      color: #333;
      text-align: center;
    }

    .highlight {
      background-color: #fff3cd;
      padding: 10px;
      border-left: 4px solid #ffc107;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome to Our Website</h1>

    <p>This is a sample HTML document demonstrating various elements and styling.</p>

    <div class="highlight">
      <strong>Note:</strong> This content is highlighted for emphasis.
    </div>

    <ul>
      <li>First item</li>
      <li>Second item with <a href="#">a link</a></li>
      <li>Third item</li>
    </ul>

    <button onclick="alert('Hello!')">Click me</button>

    <!-- This is a comment -->
    <p>End of document.</p>
  </div>

  <script>
    console.log("Page loaded successfully!");
  <\/script>
</body>
</html>\`;

const LightCodeEditorDemo = ({
  theme = "dark",
  showLineNumbers = true,
  syntaxHighlighting = true,
  readOnly = false,
  enableSearch = true,
  bracketMatching = true,
  codeFolding = true
}: {
  theme?: string;
  showLineNumbers?: boolean;
  syntaxHighlighting?: boolean;
  readOnly?: boolean;
  enableSearch?: boolean;
  bracketMatching?: boolean;
  codeFolding?: boolean;
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<any>(null);
  const [currentContent, setCurrentContent] = useState(sampleHTML);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!editorRef.current) return;

    // Clean up previous instance
    if (editorInstanceRef.current) {
      editorInstanceRef.current.destroy?.();
    }

    // Create extensions array
    const extensions = [];

    if (showLineNumbers) {
      extensions.push(new LineNumbersExtension());
    }

    if (syntaxHighlighting) {
      extensions.push(new SyntaxHighlightingExtension());
    }

    extensions.push(new ThemeExtension());

    if (readOnly) {
      extensions.push(new ReadOnlyExtension());
    }

    if (enableSearch) {
      extensions.push(new SearchExtension());
    }

    if (bracketMatching) {
      extensions.push(new BracketMatchingExtension());
    }

    if (codeFolding) {
      extensions.push(new CodeFoldingExtension());
    }

    // Create editor instance
    editorInstanceRef.current = createEditor(editorRef.current, {
      value: currentContent,
      theme,
      readOnly,
      extensions
    });

    // Listen for changes
    editorInstanceRef.current.on('change', () => {
      const newContent = editorInstanceRef.current.getValue();
      setCurrentContent(newContent);
    });

    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy?.();
      }
    };
  }, [theme, showLineNumbers, syntaxHighlighting, readOnly, enableSearch, bracketMatching, codeFolding]);

  const handleSearch = () => {
    if (editorInstanceRef.current && searchQuery) {
      const results = editorInstanceRef.current.search(searchQuery);
      console.log('Search results:', results);
    }
  };

  const handleReplace = () => {
    if (editorInstanceRef.current && searchQuery) {
      const replacement = prompt('Replace with:');
      if (replacement !== null) {
        const count = editorInstanceRef.current.replaceAll(searchQuery, replacement);
        alert(\`Replaced \${count} occurrences\`);
      }
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const loadSampleContent = (contentType: string) => {
    let content = "";
    switch (contentType) {
      case "html":
        content = sampleHTML;
        break;
      case "minimal":
        content = \`<!DOCTYPE html>
<html>
<head><title>Minimal</title></head>
<body>
  <h1>Hello World</h1>
  <p>This is a minimal HTML document.</p>
</body>
</html>\`;
        break;
      case "complex":
        content = \`<div class="wrapper">
  <header>
    <nav>
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section id="home">
      <h1>Welcome</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      <button class="btn-primary">Get Started</button>
    </section>

    <section id="about">
      <h2>About Us</h2>
      <div class="grid">
        <div class="card">
          <h3>Feature 1</h3>
          <p>Description of feature 1.</p>
        </div>
        <div class="card">
          <h3>Feature 2</h3>
          <p>Description of feature 2.</p>
        </div>
      </div>
    </section>
  </main>

  <footer>
    <p>&copy; 2024 Company Name. All rights reserved.</p>
  </footer>
</div>\`;
        break;
      case "broken":
        content = \`<html>
<head>
  <title>Broken HTML</title>
<body>
  <h1>Unclosed heading
  <p>Missing closing tags
  <div class="broken">
    <span>Nested content
    <img src="image.jpg" alt="Missing quote>
  </div>
  <p>More content
</body>
</html>\`;
        break;
    }
    setCurrentContent(content);
    if (editorInstanceRef.current) {
      editorInstanceRef.current.setValue(content);
    }
  };

  return (
    <Flex style={{
      padding: "20px",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      backgroundColor: theme === "dark" ? "#1e1e1e" : "#f5f5f5",
      color: theme === "dark" ? "#f8f9fa" : "#333"
    }}>
      {/* Header */}
      <Flex style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
        padding: "10px 0",
        borderBottom: \`1px solid \${theme === "dark" ? "#404040" : "#ddd"}\`
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "24px" }}>Light Code Editor Demo</h1>
          <p style={{ margin: "5px 0 0 0", opacity: 0.7 }}>
            Full-featured code editor with extensions
          </p>
        </div>
        <button
          onClick={toggleFullscreen}
          style={{
            padding: "8px 16px",
            backgroundColor: theme === "dark" ? "#007acc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        </button>
      </Flex>

      {/* Controls */}
      <Flex style={{
        display: "flex",
        gap: "20px",
        marginBottom: "20px",
        flexWrap: "wrap",
        alignItems: "center"
      }}>
        {/* Content Presets */}
        <div>
          <label style={{ marginRight: "10px", fontWeight: "bold" }}>Load Sample:</label>
          <select
            onChange={(e) => loadSampleContent(e.target.value)}
            style={{
              padding: "5px 10px",
              backgroundColor: theme === "dark" ? "#2d2d2d" : "white",
              color: theme === "dark" ? "#f8f9fa" : "#333",
              border: \`1px solid \${theme === "dark" ? "#404040" : "#ddd"}\`,
              borderRadius: "4px"
            }}
          >
            <option value="html">Full HTML</option>
            <option value="minimal">Minimal</option>
            <option value="complex">Complex Layout</option>
            <option value="broken">Broken HTML</option>
          </select>
        </div>

        {/* Search Controls */}
        {enableSearch && (
          <Flex style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: "5px 10px",
                backgroundColor: theme === "dark" ? "#2d2d2d" : "white",
                color: theme === "dark" ? "#f8f9fa" : "#333",
                border: \`1px solid \${theme === "dark" ? "#404040" : "#ddd"}\`,
                borderRadius: "4px",
                width: "150px"
              }}
            />
            <button
              onClick={handleSearch}
              style={{
                padding: "5px 10px",
                backgroundColor: theme === "dark" ? "#28a745" : "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Search
            </button>
            <button
              onClick={handleReplace}
              style={{
                padding: "5px 10px",
                backgroundColor: theme === "dark" ? "#ffc107" : "#ffc107",
                color: "#333",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Replace All
            </button>
          </Flex>
        )}

        {/* Content Info */}
        <Box style={{ marginLeft: "auto", fontSize: "14px", opacity: 0.7 }}>
          {currentContent.split('\\n').length} lines, {currentContent.length} characters
        </Box>
      </Flex>

      {/* Editor Container */}
      <Box
        ref={editorRef}
        style={{
          flex: 1,
          border: \`1px solid \${theme === "dark" ? "#404040" : "#ddd"}\`,
          borderRadius: "8px",
          overflow: "hidden",
          backgroundColor: theme === "dark" ? "#1e1e1e" : "white",
          minHeight: isFullscreen ? "calc(100vh - 140px)" : "500px"
        }}
      />

      {/* Footer */}
      <Box style={{
        marginTop: "20px",
        padding: "10px 0",
        borderTop: \`1px solid \${theme === "dark" ? "#404040" : "#ddd"}\`,
        fontSize: "14px",
        opacity: 0.7
      }}>
        <Flex style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            Active Extensions: {[
              showLineNumbers && "Line Numbers",
              syntaxHighlighting && "Syntax Highlighting",
              readOnly && "Read Only",
              enableSearch && "Search",
              bracketMatching && "Bracket Matching",
              codeFolding && "Code Folding"
            ].filter(Boolean).join(", ") || "None"}
          </div>
          <div>
            Theme: {theme} | Mode: {readOnly ? "Read-Only" : "Editable"}
          </div>
        </Flex>
      </Box>
    </Flex>
  );
};

// Basic Editor Story
export const Basic: Story = {
  render: (args) => <LightCodeEditorDemo {...args} />,
  args: {
    theme: "dark",
    showLineNumbers: true,
    syntaxHighlighting: true,
    readOnly: false,
    enableSearch: true,
    bracketMatching: true,
    codeFolding: true,
  },
};

// Minimal Editor Story
export const Minimal: Story = {
  render: (args) => <LightCodeEditorDemo {...args} />,
  args: {
    theme: "light",
    showLineNumbers: false,
    syntaxHighlighting: false,
    readOnly: false,
    enableSearch: false,
    bracketMatching: false,
    codeFolding: false,
  },
};

// Read-Only Editor Story
export const ReadOnly: Story = {
  render: (args) => <LightCodeEditorDemo {...args} />,
  args: {
    theme: "dark",
    showLineNumbers: true,
    syntaxHighlighting: true,
    readOnly: true,
    enableSearch: true,
    bracketMatching: true,
    codeFolding: true,
  },
};

// Light Theme Story
export const LightTheme: Story = {
  render: (args) => <LightCodeEditorDemo {...args} />,
  args: {
    theme: "light",
    showLineNumbers: true,
    syntaxHighlighting: true,
    readOnly: false,
    enableSearch: true,
    bracketMatching: true,
    codeFolding: true,
  },
};

// Feature Showcase Story
export const FeatureShowcase: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState("syntax");

    const tabs = [
      { id: "syntax", label: "Syntax Highlighting", description: "HTML syntax highlighting with VS Code-style colors" },
      { id: "search", label: "Search & Replace", description: "Find and replace functionality across the document" },
      { id: "folding", label: "Code Folding", description: "Collapse and expand code sections" },
      { id: "brackets", label: "Bracket Matching", description: "Automatic bracket pair highlighting" },
      { id: "themes", label: "Themes", description: "Light and dark theme support" },
      { id: "readonly", label: "Read-Only Mode", description: "Prevent text modifications" },
    ];

    const getTabContent = () => {
      switch (activeTab) {
        case "syntax":
          return <LightCodeEditorDemo theme="dark" showLineNumbers={true} syntaxHighlighting={true} enableSearch={false} bracketMatching={false} codeFolding={false} />;
        case "search":
          return <LightCodeEditorDemo theme="dark" showLineNumbers={true} syntaxHighlighting={true} enableSearch={true} bracketMatching={false} codeFolding={false} />;
        case "folding":
          return <LightCodeEditorDemo theme="dark" showLineNumbers={true} syntaxHighlighting={true} enableSearch={false} bracketMatching={false} codeFolding={true} />;
        case "brackets":
          return <LightCodeEditorDemo theme="dark" showLineNumbers={true} syntaxHighlighting={true} enableSearch={false} bracketMatching={true} codeFolding={false} />;
        case "themes":
          return <LightCodeEditorDemo theme="light" showLineNumbers={true} syntaxHighlighting={true} enableSearch={false} bracketMatching={false} codeFolding={false} />;
        case "readonly":
          return <LightCodeEditorDemo theme="dark" showLineNumbers={true} syntaxHighlighting={true} readOnly={true} enableSearch={true} bracketMatching={true} codeFolding={true} />;
        default:
          return <LightCodeEditorDemo theme="dark" showLineNumbers={true} syntaxHighlighting={true} enableSearch={true} bracketMatching={true} codeFolding={true} />;
      }
    };

    return (
      <Flex style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Tab Navigation */}
        <Flex style={{
          display: "flex",
          borderBottom: "1px solid #ddd",
          backgroundColor: "#f8f9fa",
          padding: "0 20px"
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "15px 20px",
                border: "none",
                backgroundColor: activeTab === tab.id ? "white" : "transparent",
                borderBottom: activeTab === tab.id ? "2px solid #007acc" : "2px solid transparent",
                cursor: "pointer",
                fontWeight: activeTab === tab.id ? "bold" : "normal",
                color: activeTab === tab.id ? "#007acc" : "#666"
              }}
            >
              {tab.label}
            </button>
          ))}
        </Flex>

        {/* Tab Description */}
        <Box style={{
          padding: "10px 20px",
          backgroundColor: "#f8f9fa",
          borderBottom: "1px solid #ddd",
          fontSize: "14px",
          color: "#666"
        }}>
          {tabs.find(tab => tab.id === activeTab)?.description}
        </Box>

        {/* Tab Content */}
        <Box style={{ flex: 1, overflow: "hidden" }}>
          {getTabContent()}
        </Box>
      </Flex>
    );
  },
};`,Se=`import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { toastAdvanced } from '@editora/toast';
import {
  BracketMatchingExtension,
  CodeFoldingExtension,
  LineNumbersExtension,
  SearchExtension,
  SyntaxHighlightingExtension,
  ThemeExtension,
  createEditor
} from '@editora/light-code-editor';
import { Box, Button, Dialog, Flex, Grid, Tabs } from '@editora/ui-react';
import '../../packages/light-code-editor/dist/light-code-editor.css';

const meta: Meta = {
  title: 'AI/Light Code Editor SaaS Workspace'
};

export default meta;
type Story = StoryObj;

const starterCode = \`export function buildReleasePayload(input) {
  const timestamp = new Date().toISOString();
  return {
    ...input,
    generatedAt: timestamp,
    status: "ready"
  };
}
\`;

const Modal = ({ open, onClose }: { open: boolean; onClose: () => void }) => (
  <Dialog
    open={open}
    title="Code Policy Approval"
    description="Approve lint and security checks before publishing snippet."
    submitText="Approve"
    cancelText="Cancel"
    onDialogSubmit={() => {
      toastAdvanced.success('Code policy approved', { theme: 'light', duration: 1200 });
      onClose();
    }}
    onDialogClose={onClose}
  >
    <Box variant="outline" p="10px" radius="sm" color="#475569">
      Checks: naming conventions, export policy, and readonly review mode compliance.
    </Box>
  </Dialog>
);

export const DeveloperCodeWorkspace: Story = {
  render: () => {
    const hostRef = React.useRef<HTMLDivElement | null>(null);
    const editorRef = React.useRef<any>(null);
    const [tab, setTab] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const [readonly, setReadonly] = React.useState(false);
    const [chars, setChars] = React.useState(starterCode.length);

    React.useEffect(() => {
      if (!hostRef.current) return;

      editorRef.current?.destroy?.();
      editorRef.current = createEditor(hostRef.current, {
        value: starterCode,
        theme: 'dark',
        readOnly: readonly,
        extensions: [
          new ThemeExtension(),
          new LineNumbersExtension(),
          new SyntaxHighlightingExtension(),
          new SearchExtension({ replaceAndFindNext: true }),
          new BracketMatchingExtension(),
          new CodeFoldingExtension()
        ]
      });

      editorRef.current.on('change', () => {
        const next = editorRef.current.getValue();
        setChars(next.length);
      });

      return () => editorRef.current?.destroy?.();
    }, [readonly]);

    return (
      <Grid gap="14px" style={{ maxWidth: 1120, margin: '0 auto', padding: 8 }}>
        <Flex justify="between" align="center" wrap="wrap" gap="10px">
          <Box>
            <h2 style={{ margin: 0, fontSize: 28, color: '#0f172a' }}>Light Code Editor Workspace</h2>
            <p style={{ margin: '6px 0 0 0', color: '#64748b' }}>SaaS developer workspace for source review and policy-safe publishing.</p>
          </Box>
          <Flex gap="8px">
            <Button
              onClick={() => {
                toastAdvanced.loading('Validating source...', { theme: 'light', duration: 850 });
                setTimeout(() => toastAdvanced.success('Validation complete', { theme: 'light', duration: 1200 }), 900);
              }}
            >
              Validate
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setReadonly((prev) => !prev);
                toastAdvanced.info(\`Readonly \${!readonly ? 'enabled' : 'disabled'}\`, { theme: 'light', duration: 1000 });
              }}
            >
              Toggle Readonly
            </Button>
            <Button variant="secondary" onClick={() => setOpen(true)}>
              Open Modal
            </Button>
          </Flex>
        </Flex>

        <Grid columns={{ initial: '1fr', md: '1fr 1fr 1fr' }} gap="10px">
          <Box variant="surface" p="12px" radius="md" style={{ border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 12, color: '#64748b' }}>Characters</div>
            <div style={{ marginTop: 6, fontSize: 24, fontWeight: 700 }}>{chars}</div>
          </Box>
          <Box variant="surface" p="12px" radius="md" style={{ border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 12, color: '#64748b' }}>Theme</div>
            <div style={{ marginTop: 6, fontSize: 24, fontWeight: 700 }}>Dark</div>
          </Box>
          <Box variant="surface" p="12px" radius="md" style={{ border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 12, color: '#64748b' }}>Mode</div>
            <div style={{ marginTop: 6, fontSize: 24, fontWeight: 700 }}>{readonly ? 'Readonly' : 'Editable'}</div>
          </Box>
        </Grid>

        <Box variant="surface" p="12px" radius="md" style={{ border: '1px solid #e2e8f0' }}>
          <Tabs selected={tab} variant="soft" onChange={setTab}>
            <div slot="tab" data-value="editor">Editor</div>
            <div slot="panel">
              <div
                ref={hostRef}
                style={{
                  minHeight: 360,
                  border: '1px solid #0f172a',
                  borderRadius: 10,
                  overflow: 'hidden'
                }}
              />
            </div>

            <div slot="tab" data-value="commands">Commands</div>
            <div slot="panel">
              <Flex gap="8px" wrap="wrap">
                <Button size="sm" onClick={() => editorRef.current?.executeCommand?.('find')}>Find</Button>
                <Button size="sm" onClick={() => editorRef.current?.executeCommand?.('replace')}>Replace</Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    editorRef.current?.setValue?.(starterCode);
                    toastAdvanced.success('Editor reset to starter code', { theme: 'light', duration: 1000 });
                  }}
                >
                  Reset Code
                </Button>
              </Flex>
            </div>
          </Tabs>
        </Box>

        <Modal open={open} onClose={() => setOpen(false)} />
      </Grid>
    );
  }
};
`,Ce=`import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { EditoraEditor } from "@editora/react";
import {
  HeadingPlugin,
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  StrikethroughPlugin,
  ListPlugin,
  BlockquotePlugin,
  CodePlugin,
  LinkPlugin,
  ClearFormattingPlugin,
  HistoryPlugin,
  TablePlugin,
  MediaManagerPlugin,
  FontSizePlugin,
  FontFamilyPlugin,
  TextAlignmentPlugin,
} from "@editora/plugins";
import "@editora/themes/themes/default.css";
import { Box, Grid} from '@editora/ui-react';


/**
 * Media Manager Stories - Demonstrating Offline-First Upload
 * 
 * This showcases the new offline-first media manager that:
 * - Uses base64 by default for true offline capability
 * - Supports optional custom server upload
 * - Uses toast notifications for user feedback
 * - Works without any backend API required
 */

const meta: Meta<typeof EditoraEditor> = {
  title: "Editor/MediaManager - Offline-First Upload",
  component: EditoraEditor,
  parameters: {
    layout: "padded",
    docs: {
      source: {
        type: "code",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof EditoraEditor>;

// Common plugins for all media manager stories
const commonPlugins = [
  HeadingPlugin(),
  BoldPlugin(),
  ItalicPlugin(),
  UnderlinePlugin(),
  StrikethroughPlugin(),
  CodePlugin(),
  ListPlugin(),
  BlockquotePlugin(),
  LinkPlugin(),
  ClearFormattingPlugin(),
  TablePlugin(),
  HistoryPlugin(),
  MediaManagerPlugin(),
  FontSizePlugin(),
  FontFamilyPlugin(),
  TextAlignmentPlugin(),
];

/**
 * Story 1: Pure Offline Mode (Base64 Only)
 * 
 * The simplest configuration - images are stored as base64 directly in the content.
 * Perfect for standalone applications without any server.
 */
export const PureOfflineMode: Story = {
  args: {
    plugins: commonPlugins,
    mediaConfig: {
      maxFileSize: 52428800, // 50MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      offline: {
        enabled: true,
        useBase64Permanently: true, // Force base64 only
        fallbackToBase64: true,
      },
    },
  },
  render: (args) => (
    <Box style={{ position: 'relative', height: '600px', border: '1px solid #ddd' }}>
      <Box style={{ padding: '10px', background: '#f0f8ff', marginBottom: '10px' }}>
        <strong>📱 Pure Offline Mode:</strong> All images stored as base64. No server required!
      </Box>
      <EditoraEditor {...args} />
    </Box>
  ),
};

/**
 * Story 2: Offline-First with Custom Server Fallback
 * 
 * Tries to upload to a custom server, falls back to base64 if unavailable.
 * This is the recommended setup for most applications.
 */
export const OfflineFirstWithCustomServer: Story = {
  args: {
    plugins: commonPlugins,
    mediaConfig: {
      maxFileSize: 52428800,
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      offline: {
        enabled: true,
        fallbackToBase64: true,
        customUploadUrl: 'http://localhost:3001/api/upload',
        customUploadHeaders: {
          'Authorization': 'Bearer your-token-here',
        },
      },
    },
  },
  render: (args) => (
    <Box style={{ position: 'relative', height: '600px', border: '1px solid #ddd' }}>
      <Box style={{ padding: '10px', background: '#fff8f0', marginBottom: '10px' }}>
        <strong>🌐 Offline-First with Custom Server:</strong> Tries server first, falls back to base64 if unavailable
      </Box>
      <EditoraEditor {...args} />
    </Box>
  ),
};

/**
 * Story 3: Hybrid Mode - API Optional
 * 
 * Uses base64 by default but tries API upload if available.
 * Best user experience: always works offline, faster with API.
 */
export const HybridModeApiOptional: Story = {
  args: {
    plugins: commonPlugins,
    mediaConfig: {
      maxFileSize: 52428800,
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4'],
      offline: {
        enabled: true,
        fallbackToBase64: true,
      },
      uploadUrl: '/api/media/upload',
      libraryUrl: '/api/media/library',
    },
  },
  render: (args) => (
    <Box style={{ position: 'relative', height: '600px', border: '1px solid #ddd' }}>
      <Box style={{ padding: '10px', background: '#f0fff0', marginBottom: '10px' }}>
        <strong>⚡ Hybrid Mode:</strong> Base64 default + optional API upload in background
      </Box>
      <EditoraEditor {...args} />
    </Box>
  ),
};

/**
 * Story 4: Complete Example with Server Setup
 * 
 * Shows a complete, production-ready setup with:
 * - Custom server endpoint
 * - Authentication headers
 * - Full feature set enabled
 */
export const ProductionSetup: Story = {
  args: {
    plugins: commonPlugins,
    mediaConfig: {
      maxFileSize: 52428800,
      allowedTypes: [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
        'video/mp4',
        'video/webm',
        'audio/mpeg',
        'audio/wav',
      ],
      offline: {
        enabled: true,
        fallbackToBase64: true,
        customUploadUrl: 'http://localhost:3001/api/upload',
        customUploadHeaders: {
          'Authorization': \`Bearer \${'demo-token'}\`,
        },
      },
      uploadUrl: '/api/media/upload',
      libraryUrl: '/api/media/library',
    },
  },
  render: (args) => (
    <Box style={{ position: 'relative', height: '600px', border: '1px solid #ddd' }}>
      <Box style={{ padding: '10px', background: '#f5f5f5', marginBottom: '10px' }}>
        <strong>🚀 Production Setup:</strong> Full-featured configuration with authentication and fallback
      </Box>
      <EditoraEditor {...args} />
    </Box>
  ),
};

/**
 * Story 5: Migration Guide - From API-First to Offline-First
 * 
 * Shows how to migrate from the old API-first approach to the new offline-first approach.
 */
export const MigrationGuide: Story = {
  args: {
    plugins: commonPlugins,
    mediaConfig: {
      maxFileSize: 52428800,
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      offline: {
        enabled: true,
        fallbackToBase64: true,
      },
      uploadUrl: '/api/media/upload',
      libraryUrl: '/api/media/library',
    },
  },
  render: (args) => (
    <Box style={{ position: 'relative', minHeight: '600px', border: '1px solid #ddd' }}>
      <Box style={{ padding: '20px', maxHeight: '400px', overflow: 'auto' }}>
        <h3>📚 Migration Guide: API-First → Offline-First</h3>
        
        <Box style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
          <strong>❌ Old (Phase 16 - API-First):</strong>
          <pre style={{ marginTop: '10px', overflow: 'auto', fontSize: '11px' }}>
{\`offline: {
  customUploadUrl: '...',
  fallbackToBase64: true
}
// API tried first, base64 was fallback\`}
          </pre>
        </Box>

        <Box style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#d4edda', borderRadius: '4px' }}>
          <strong>✅ New (Phase 17 - Offline-First):</strong>
          <pre style={{ marginTop: '10px', overflow: 'auto', fontSize: '11px' }}>
{\`offline: {
  enabled: true,
  fallbackToBase64: true,
  customUploadUrl: '...'
}
// Base64 first, servers optional\`}
          </pre>
        </Box>

        <Box style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0fff0', borderRadius: '4px' }}>
          <strong>🎯 Key Improvements:</strong>
          <ul style={{ marginTop: '10px', marginBottom: '0', fontSize: '13px' }}>
            <li>✅ Instant uploads (base64 immediate)</li>
            <li>✅ Works offline (no network required)</li>
            <li>✅ Servers optional (API/custom server as bonus)</li>
            <li>✅ Toast notifications (better UX)</li>
            <li>✅ Backward compatible (old config still works)</li>
          </ul>
        </Box>
      </Box>
      
      <Box style={{ borderTop: '1px solid #ddd', paddingTop: '10px', marginTop: '10px' }}>
        <strong>Try it below:</strong>
        <EditoraEditor {...args} />
      </Box>
    </Box>
  ),
};

/**
 * Story 6: Toast Notifications Example
 * 
 * Demonstrates the different toast notifications the media manager shows
 */
export const ToastNotificationsDemo: Story = {
  args: {
    plugins: commonPlugins,
    mediaConfig: {
      maxFileSize: 52428800,
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      offline: {
        enabled: true,
        fallbackToBase64: true,
      },
    },
  },
  render: (args) => {
    const [notificationInfo, setNotificationInfo] = React.useState('');
    
    return (
      <Box style={{ position: 'relative', minHeight: '600px', border: '1px solid #ddd' }}>
        <Box style={{ padding: '20px', background: '#f9f9f9', borderBottom: '1px solid #ddd' }}>
          <h3>🔔 Toast Notifications in Action</h3>
          <p style={{ color: '#666', fontSize: '13px', margin: '10px 0 0 0' }}>
            When you upload images, you'll see professional toast notifications showing the upload status.
          </p>
          
          <Grid style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <Box style={{
              padding: '15px',
              backgroundColor: '#f1f8f4',
              borderLeft: '4px solid #4CAF50',
              borderRadius: '4px'
            }}>
              <strong style={{ color: '#4CAF50', fontSize: '12px' }}>✅ Success</strong>
              <p style={{ fontSize: '11px', marginTop: '5px', color: '#666' }}>
                Shows when image uploaded to server
              </p>
            </Box>

            <Box style={{
              padding: '15px',
              backgroundColor: '#f1f5f8',
              borderLeft: '4px solid #2196F3',
              borderRadius: '4px'
            }}>
              <strong style={{ color: '#2196F3', fontSize: '12px' }}>📌 Info (Offline)</strong>
              <p style={{ fontSize: '11px', marginTop: '5px', color: '#666' }}>
                Shows when image stored as base64
              </p>
            </Box>

            <Box style={{
              padding: '15px',
              backgroundColor: '#fdf1f1',
              borderLeft: '4px solid #f44336',
              borderRadius: '4px'
            }}>
              <strong style={{ color: '#f44336', fontSize: '12px' }}>⚠️ Error</strong>
              <p style={{ fontSize: '11px', marginTop: '5px', color: '#666' }}>
                Shows when upload fails
              </p>
            </Box>
          </Grid>
        </Box>

        <Box style={{ position: 'relative', height: '500px', borderTop: '1px solid #ddd' }}>
          <EditoraEditor 
            {...args}
            defaultValue="<p>Try uploading an image above to see the toast notifications! 📸</p>"
          />
        </Box>
      </Box>
    );
  },
};

/**
 * Story 7: Setup Code Examples
 * 
 * Shows the actual code needed to implement the media manager with different configurations
 */
export const SetupCodeExamples: Story = {
  args: {
    plugins: commonPlugins,
    mediaConfig: {
      maxFileSize: 52428800,
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      offline: {
        enabled: true,
        fallbackToBase64: true,
      },
    },
  },
  render: (args) => (
    <Box style={{ minHeight: '900px', border: '1px solid #ddd' }}>
      <Box style={{ padding: '30px', background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
        <h2>💻 Setup Code Examples</h2>
        <p style={{ color: '#666', marginTop: '10px' }}>
          Complete code snippets showing how to initialize and configure the media manager with various options
        </p>
      </Box>

      <Grid style={{ padding: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        
        {/* Example 1: Minimal Setup */}
        <div>
          <h3 style={{ marginTop: '0', fontSize: '16px', borderBottom: '2px solid #4CAF50', paddingBottom: '10px' }}>
            ✅ Example 1: Minimal Setup (Offline Only)
          </h3>
          <pre style={{
            background: '#f4f4f4',
            padding: '15px',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '12px',
            lineHeight: '1.4',
            border: '1px solid #ddd'
          }}>
{\`import { EditoraEditor } from '@editora/react';
import {
  ParagraphPlugin,
  BoldPlugin,
  ItalicPlugin,
  MediaManagerPlugin,
} from '@editora/plugins';
import '@editora/themes/themes/default.css';

export function MyEditor() {
  const plugins = [
    BoldPlugin(),
    ItalicPlugin(),
    MediaManagerPlugin(),
  ];

  return (
    <EditoraEditor
      plugins={plugins}
      mediaConfig={{
        maxFileSize: 52428800,
        allowedTypes: ['image/jpeg', 'image/png'],
        offline: {
          enabled: true,
          useBase64Permanently: true,
        },
      }}
    />
  );
}\`}
          </pre>
          <Box style={{ marginTop: '10px', padding: '10px', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>
            <strong style={{ fontSize: '12px' }}>💡 Use this when:</strong>
            <p style={{ fontSize: '11px', margin: '5px 0 0 0', color: '#555' }}>No server available, images stored in document</p>
          </Box>
        </div>

        {/* Example 2: With Custom Server */}
        <div>
          <h3 style={{ marginTop: '0', fontSize: '16px', borderBottom: '2px solid #2196F3', paddingBottom: '10px' }}>
            🌐 Example 2: With Custom Server Fallback
          </h3>
          <pre style={{
            background: '#f4f4f4',
            padding: '15px',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '12px',
            lineHeight: '1.4',
            border: '1px solid #ddd'
          }}>
{\`import { EditoraEditor } from '@editora/react';
import { MediaManagerPlugin } from '@editora/plugins';

export function MyEditor() {
  return (
    <EditoraEditor
      plugins={[
        // ... other plugins
        MediaManagerPlugin(),
      ]}
      mediaConfig={{
        maxFileSize: 52428800,
        allowedTypes: [
          'image/jpeg',
          'image/png',
          'image/webp',
        ],
        offline: {
          enabled: true,
          fallbackToBase64: true,
          customUploadUrl:
            'http://localhost:3001/api/upload',
          customUploadHeaders: {
            'Authorization':
              'Bearer YOUR_TOKEN_HERE',
          },
        },
      }}
    />
  );
}\`}
          </pre>
          <Box style={{ marginTop: '10px', padding: '10px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
            <strong style={{ fontSize: '12px' }}>💡 Use this when:</strong>
            <p style={{ fontSize: '11px', margin: '5px 0 0 0', color: '#555' }}>You have a custom server endpoint</p>
          </Box>
        </div>

        {/* Example 3: Hybrid with API Optional */}
        <div>
          <h3 style={{ marginTop: '0', fontSize: '16px', borderBottom: '2px solid #FF9800', paddingBottom: '10px' }}>
            ⚡ Example 3: Hybrid with API Optional
          </h3>
          <pre style={{
            background: '#f4f4f4',
            padding: '15px',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '12px',
            lineHeight: '1.4',
            border: '1px solid #ddd'
          }}>
{\`import { EditoraEditor } from '@editora/react';
import { MediaManagerPlugin } from '@editora/plugins';

export function MyEditor() {
  return (
    <EditoraEditor
      plugins={[MediaManagerPlugin()]}
      mediaConfig={{
        maxFileSize: 52428800,
        allowedTypes: [
          'image/jpeg',
          'image/png',
          'video/mp4',
        ],
        // Base64 used immediately
        offline: {
          enabled: true,
          fallbackToBase64: true,
        },
        // API upload tried in background
        uploadUrl: '/api/media/upload',
        libraryUrl: '/api/media/library',
      }}
    />
  );
}\`}
          </pre>
          <Box style={{ marginTop: '10px', padding: '10px', backgroundColor: '#fff3e0', borderRadius: '4px' }}>
            <strong style={{ fontSize: '12px' }}>💡 Use this when:</strong>
            <p style={{ fontSize: '11px', margin: '5px 0 0 0', color: '#555' }}>You want instant response + server upload as bonus</p>
          </Box>
        </div>

        {/* Example 4: Complete Production Setup */}
        <div>
          <h3 style={{ marginTop: '0', fontSize: '16px', borderBottom: '2px solid #9C27B0', paddingBottom: '10px' }}>
            🚀 Example 4: Production Setup
          </h3>
          <pre style={{
            background: '#f4f4f4',
            padding: '15px',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '12px',
            lineHeight: '1.4',
            border: '1px solid #ddd'
          }}>
{\`// config/mediaConfig.ts
export const mediaConfig = {
  maxFileSize: 52428800,
  allowedTypes: [
    'image/*',
    'video/mp4',
    'audio/mpeg',
  ],
  offline: {
    enabled: true,
    fallbackToBase64: true,
    customUploadUrl:
      ({}).CUSTOM_UPLOAD_URL,
    customUploadHeaders: {
      'Authorization':
        \\\`Bearer \\\${getAuthToken()}\\\`,
      'X-Custom-Header': 'value',
    },
  },
  uploadUrl: '/api/media/upload',
  libraryUrl: '/api/media/library',
};

// MyEditor.tsx
import { EditoraEditor } from '@editora/react';
import { mediaConfig } from './config/mediaConfig';

export function MyEditor() {
  return (
    <EditoraEditor
      plugins={[MediaManagerPlugin()]}
      mediaConfig={mediaConfig}
    />
  );
}\`}
          </pre>
          <Box style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f3e5f5', borderRadius: '4px' }}>
            <strong style={{ fontSize: '12px' }}>💡 Use this when:</strong>
            <p style={{ fontSize: '11px', margin: '5px 0 0 0', color: '#555' }}>Multiple editors, environment variables, authentication</p>
          </Box>
        </div>
      </Grid>

      {/* Configuration Options Reference */}
      <Box style={{ padding: '30px', background: '#fafafa', borderTop: '2px solid #ddd' }}>
        <h3 style={{ marginTop: '0', fontSize: '16px', borderBottom: '2px solid #666', paddingBottom: '10px' }}>
          ⚙️ Configuration Options Reference
        </h3>
        
        <Grid style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
          
          {/* Offline Options */}
          <Box style={{ padding: '15px', backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #e0e0e0' }}>
            <h4 style={{ marginTop: '0', color: '#2196F3' }}>📱 offline Options</h4>
            <pre style={{
              background: '#f5f5f5',
              padding: '10px',
              borderRadius: '3px',
              fontSize: '11px',
              overflow: 'auto'
            }}>
{\`offline: {
  // Enable offline mode
  enabled: true,

  // Force base64 only
  useBase64Permanently: false,

  // Fallback when server fails
  fallbackToBase64: true,

  // Custom server (optional)
  customUploadUrl: 'https://...',

  // Auth headers (optional)
  customUploadHeaders: {
    'Authorization': 'Bearer token'
  }
}\`}
            </pre>
          </Box>

          {/* File Options */}
          <Box style={{ padding: '15px', backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #e0e0e0' }}>
            <h4 style={{ marginTop: '0', color: '#4CAF50' }}>📄 File Options</h4>
            <pre style={{
              background: '#f5f5f5',
              padding: '10px',
              borderRadius: '3px',
              fontSize: '11px',
              overflow: 'auto'
            }}>
{\`mediaConfig: {
  // Max file size (bytes)
  maxFileSize: 52428800,

  // Allowed MIME types
  allowedTypes: [
    'image/jpeg',
    'image/png',
    'video/mp4'
  ],

  // API endpoints (optional)
  uploadUrl: '/api/upload',
  libraryUrl: '/api/library',

  // Offline config
  offline: { ... }
}\`}
            </pre>
          </Box>
        </Grid>

        {/* Common Patterns */}
        <Box style={{ marginTop: '30px', padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '4px', border: '1px solid #4CAF50' }}>
          <h4 style={{ marginTop: '0', color: '#2e7d32' }}>🎯 Common Patterns</h4>
          <ul style={{ fontSize: '12px', lineHeight: '1.8', color: '#555' }}>
            <li><strong>Development:</strong> Use base64 only (no server needed)</li>
            <li><strong>Staging:</strong> Use hybrid mode (base64 + optional API)</li>
            <li><strong>Production:</strong> Use custom server + fallback to base64</li>
            <li><strong>Self-Hosted:</strong> Use custom server with auth headers</li>
            <li><strong>SaaS:</strong> Use API endpoints + optional custom server</li>
          </ul>
        </Box>
      </Box>

      {/* Live Editor Example */}
      <Box style={{ padding: '30px', borderTop: '2px solid #ddd' }}>
        <h3 style={{ marginTop: '0' }}>👇 Try it below (Live Editor)</h3>
        <Box style={{ position: 'relative', height: '400px', marginTop: '20px' }}>
          <EditoraEditor
            {...args}
            defaultValue="<p>This editor uses the hybrid mode configuration from Example 3 above. Try uploading an image! 📸</p>"
          />
        </Box>
      </Box>
    </Box>
  ),
};
`,ke=`import React from 'react';
import { Menu, Button, Box, Grid, Flex } from '@editora/ui-react';

export default {
  title: 'UI/Menu',
  component: Menu,
  argTypes: {
    placement: { control: 'select', options: ['bottom', 'top', 'left', 'right'] },
    variant: { control: 'select', options: ['default', 'solid', 'flat', 'line', 'glass', 'contrast'] },
    density: { control: 'select', options: ['default', 'compact', 'comfortable'] },
    shape: { control: 'select', options: ['default', 'square', 'soft'] },
    elevation: { control: 'select', options: ['default', 'none', 'low', 'high'] },
    tone: { control: 'select', options: ['default', 'brand', 'danger', 'success', 'warning'] },
    closeOnSelect: { control: 'boolean' },
    typeahead: { control: 'boolean' }
  }
};

const BaseMenuContent = () => (
  <Box slot="content">
    <Box role="menuitem" tabIndex={-1}><span className="icon">✏</span><span className="label">Rename</span><span className="shortcut">R</span></Box>
    <Box role="menuitem" tabIndex={-1}><span className="icon">⧉</span><span className="label">Duplicate</span><span className="shortcut">D</span></Box>
    <Box role="separator" className="separator" />
    <Box role="menuitem" tabIndex={-1}><span className="icon">📦</span><span className="label">Archive</span><span className="shortcut">A</span></Box>
    <Box role="menuitem" tabIndex={-1} data-value="delete" style={{ color: '#b91c1c' }}>
      <span className="icon">🗑</span><span className="label">Delete permanently</span><span className="shortcut">⌘⌫</span>
    </Box>
  </Box>
);

export const Playground = (args: any) => {
  const [last, setLast] = React.useState('none');

  return (
    <Box style={{ padding: 64 }}>
      <Menu
        open={args.open}
        placement={args.placement}
        variant={args.variant}
        density={args.density}
        shape={args.shape}
        elevation={args.elevation}
        tone={args.tone}
        closeOnSelect={args.closeOnSelect}
        typeahead={args.typeahead}
        onSelectDetail={(detail) => {
          const token = detail.label || detail.value || (typeof detail.index === 'number' ? \`#\${detail.index}\` : 'item');
          setLast(token);
        }}
      >
        <Button slot="trigger">Open menu</Button>
        <BaseMenuContent />
      </Menu>
      <Box style={{ marginTop: 12, fontSize: 13, color: '#475569' }}>
        Last action: {last}
      </Box>
    </Box>
  );
};

Playground.args = {
  open: false,
  placement: 'bottom',
  variant: 'default',
  density: 'default',
  shape: 'default',
  elevation: 'default',
  tone: 'default',
  closeOnSelect: true,
  typeahead: true
};

export const VisualModes = () => (
  <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(240px, 1fr))', gap: 16, padding: 20 }}>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
      <strong>Default Soft</strong>
      <Box style={{ marginTop: 10 }}>
        <Menu open shape="soft">
          <Button slot="trigger">Actions</Button>
          <BaseMenuContent />
        </Menu>
      </Box>
    </Box>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
      <strong>Square Flat</strong>
      <Box style={{ marginTop: 10 }}>
        <Menu open shape="square" variant="flat" elevation="none" density="compact">
          <Button slot="trigger">Actions</Button>
          <BaseMenuContent />
        </Menu>
      </Box>
    </Box>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
      <strong>Line / Warning</strong>
      <Box style={{ marginTop: 10 }}>
        <Menu open variant="line" shape="square" density="compact" tone="warning">
          <Button slot="trigger">Actions</Button>
          <BaseMenuContent />
        </Menu>
      </Box>
    </Box>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
      <strong>Solid Comfortable</strong>
      <Box style={{ marginTop: 10 }}>
        <Menu open variant="solid" density="comfortable" elevation="low">
          <Button slot="trigger">Actions</Button>
          <BaseMenuContent />
        </Menu>
      </Box>
    </Box>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 14, background: 'linear-gradient(135deg, #f8fafc, #eef2ff)' }}>
      <strong>Glass</strong>
      <Box style={{ marginTop: 10 }}>
        <Menu open variant="glass" shape="soft" elevation="high">
          <Button slot="trigger">Actions</Button>
          <BaseMenuContent />
        </Menu>
      </Box>
    </Box>
    <Box style={{ border: '1px solid #1e293b', borderRadius: 12, padding: 14, background: '#0f172a', color: '#e2e8f0' }}>
      <strong>Contrast + Danger</strong>
      <Box style={{ marginTop: 10 }}>
        <Menu open variant="contrast" tone="danger" elevation="high">
          <Button slot="trigger">Actions</Button>
          <BaseMenuContent />
        </Menu>
      </Box>
    </Box>
  </Grid>
);

export const LegacySlotItems = () => {
  const actions = ['Rename', 'Duplicate', 'Archive', 'Delete'];
  const [selected, setSelected] = React.useState<number | null>(null);
  return (
    <Flex style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 24 }}>
      <Menu onSelect={(index) => setSelected(index)}>
        <Button slot="trigger" variant="secondary">Legacy item slots</Button>
        {actions.map((action) => (
          <Box key={action} slot="item">{action}</Box>
        ))}
      </Menu>
      <Box style={{ fontSize: 13, color: '#475569' }}>
        Selected index: {selected == null ? 'none' : selected} {selected == null ? '' : \`(\${actions[selected]})\`}
      </Box>
    </Flex>
  );
};

export const PersistentSelection = () => {
  const [last, setLast] = React.useState<string>('none');
  return (
    <Box style={{ padding: 56 }}>
      <Menu
        open
        closeOnSelect={false}
        onSelectDetail={(detail) =>
          setLast(
            \`\${detail.label || detail.value || (typeof detail.index === 'number' ? \`item-\${detail.index}\` : 'item')}\${
              typeof detail.checked === 'boolean' ? \` (\${detail.checked ? 'on' : 'off'})\` : ''
            }\`
          )
        }
      >
        <Button slot="trigger">View options</Button>
        <Box slot="content">
          <Box role="menuitemcheckbox" aria-checked="true" data-value="show-grid" tabIndex={-1}>Show grid</Box>
          <Box role="menuitemcheckbox" aria-checked="false" data-value="snap-guides" tabIndex={-1}>Snap to guides</Box>
          <Box role="separator" className="separator" />
          <Box role="menuitemradio" data-group="mode" aria-checked="true" data-value="mode-edit" tabIndex={-1}>Mode: Edit</Box>
          <Box role="menuitemradio" data-group="mode" aria-checked="false" data-value="mode-review" tabIndex={-1}>Mode: Review</Box>
        </Box>
      </Menu>
      <Box style={{ marginTop: 12, fontSize: 13, color: '#475569' }}>Last action: {last}</Box>
    </Box>
  );
};

export const SubmenuExample = () => {
  const [last, setLast] = React.useState('none');
  return (
    <Box style={{ padding: 56 }}>
      <Menu
        open
        closeOnSelect={false}
        onSelectDetail={(detail) => setLast(detail.label || detail.value || 'item')}
      >
        <Button slot="trigger">Project menu</Button>
        <Box slot="content">
          <Box role="menuitem" tabIndex={-1}>Rename</Box>
          <Box role="menuitem" tabIndex={-1}>Duplicate</Box>
          <Box role="separator" className="separator" />
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 8px',
              borderRadius: 8,
              gap: 8
            }}
          >
            <span style={{ fontSize: 13, color: '#334155' }}>Share</span>
            <Menu placement="right" density="compact" shape="square" variant="line" onSelectDetail={(detail) => setLast(\`share:\${detail.label || detail.value || 'item'}\`)}>
              <button
                slot="trigger"
                style={{
                  fontSize: 12,
                  border: '1px solid #cbd5e1',
                  borderRadius: 6,
                  background: '#fff',
                  padding: '4px 8px',
                  cursor: 'pointer'
                }}
              >
                More ▸
              </button>
              <Box slot="content">
                <Box role="menuitem" tabIndex={-1}>Copy link</Box>
                <Box role="menuitem" tabIndex={-1}>Invite by email</Box>
                <Box role="menuitem" tabIndex={-1}>Manage access</Box>
              </Box>
            </Menu>
          </Box>
          <Box role="separator" className="separator" />
          <Box role="menuitem" tabIndex={-1} style={{ color: '#b91c1c' }}>Delete</Box>
        </Box>
      </Menu>
      <Box style={{ marginTop: 12, fontSize: 13, color: '#475569' }}>Last action: {last}</Box>
    </Box>
  );
};
`,we=`import React from 'react';
import { Menubar, Menu, Box, Grid, Flex, Button } from '@editora/ui-react';

export default {
  title: 'UI/Menubar',
  component: Menubar,
  argTypes: {
    selected: { control: 'number' },
    open: { control: 'boolean' },
    loop: { control: 'boolean' },
    placement: { control: 'select', options: ['bottom', 'top', 'left', 'right'] },
    variant: { control: 'select', options: ['default', 'solid', 'flat', 'line', 'glass', 'contrast'] },
    density: { control: 'select', options: ['default', 'compact', 'comfortable'] },
    shape: { control: 'select', options: ['default', 'square', 'soft'] },
    elevation: { control: 'select', options: ['default', 'none', 'low', 'high'] },
    tone: { control: 'select', options: ['default', 'brand', 'danger', 'success', 'warning'] }
  }
};

function EditorMenubar(args: any) {
  return (
    <Menubar {...args}>
      <button slot="item">File</button>
      <button slot="item">Edit</button>
      <button slot="item">View</button>

      <Box slot="content" style={{ minWidth: 220 }}>
        <Box role="menuitem" tabIndex={-1}><span className="icon">📄</span><span className="label">New document</span><span className="shortcut">⌘N</span></Box>
        <Box role="menuitem" tabIndex={-1}><span className="icon">📂</span><span className="label">Open…</span><span className="shortcut">⌘O</span></Box>
        <Box role="menuitem" tabIndex={-1}><span className="icon">💾</span><span className="label">Save</span><span className="shortcut">⌘S</span></Box>
        <Box role="separator" className="separator" />
        <Box role="menuitem" tabIndex={-1}><span className="icon">📤</span><span className="label">Export PDF</span><span className="shortcut">⇧⌘E</span></Box>
      </Box>

      <Box slot="content" style={{ minWidth: 220 }}>
        <Box role="menuitem" tabIndex={-1}><span className="icon">↶</span><span className="label">Undo</span><span className="shortcut">⌘Z</span></Box>
        <Box role="menuitem" tabIndex={-1}><span className="icon">↷</span><span className="label">Redo</span><span className="shortcut">⇧⌘Z</span></Box>
        <Box role="separator" className="separator" />
        <Box role="menuitem" tabIndex={-1}><span className="icon">🔎</span><span className="label">Find</span><span className="shortcut">⌘F</span></Box>
        <Box role="menuitem" tabIndex={-1}><span className="icon">🪄</span><span className="label">Replace</span><span className="shortcut">⌘H</span></Box>
      </Box>

      <Box slot="content" style={{ minWidth: 220 }}>
        <Box role="menuitemcheckbox" aria-checked="true" tabIndex={-1}>Show minimap</Box>
        <Box role="menuitemcheckbox" aria-checked="false" tabIndex={-1}>Wrap lines</Box>
        <Box role="separator" className="separator" />
        <Box role="menuitemradio" data-group="zoom" aria-checked="true" tabIndex={-1}>100%</Box>
        <Box role="menuitemradio" data-group="zoom" aria-checked="false" tabIndex={-1}>125%</Box>
        <Box role="menuitemradio" data-group="zoom" aria-checked="false" tabIndex={-1}>150%</Box>
      </Box>
    </Menubar>
  );
}

export const Playground = EditorMenubar;
Playground.args = {
  selected: 0,
  open: false,
  loop: true,
  placement: 'bottom',
  variant: 'default',
  density: 'default',
  shape: 'default',
  elevation: 'default',
  tone: 'default'
};

export const Interactive = () => {
  const [state, setState] = React.useState({ open: false, selected: 0 });
  return (
    <Grid style={{ display: 'grid', gap: 10 }}>
      <EditorMenubar
        selected={state.selected}
        open={state.open}
        onOpen={(selected) => setState({ open: true, selected })}
        onClose={() => setState((prev) => ({ ...prev, open: false }))}
        onChange={(detail) => setState({ open: detail.open, selected: detail.selected })}
      />
      <Box style={{ fontSize: 13, color: '#475569' }}>
        open: {String(state.open)} | selected: {state.selected}
      </Box>
    </Grid>
  );
};

export const OpenByDefault = EditorMenubar;
OpenByDefault.args = {
  selected: 1,
  open: true
};

export const VisualModes = () => (
  <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(320px, 1fr))', gap: 16, padding: 20 }}>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
      <strong>Default</strong>
      <Box style={{ marginTop: 10 }}>
        <EditorMenubar selected={0} open variant="default" />
      </Box>
    </Box>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
      <strong>Square / Flat</strong>
      <Box style={{ marginTop: 10 }}>
        <EditorMenubar selected={1} open variant="flat" shape="square" density="compact" elevation="none" />
      </Box>
    </Box>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 14, background: 'linear-gradient(135deg, #f8fafc, #eef2ff)' }}>
      <strong>Glass</strong>
      <Box style={{ marginTop: 10 }}>
        <EditorMenubar selected={2} open variant="glass" shape="soft" elevation="high" />
      </Box>
    </Box>
    <Box style={{ border: '1px solid #1e293b', borderRadius: 12, padding: 14, background: '#0f172a', color: '#e2e8f0' }}>
      <strong>Contrast + Warning</strong>
      <Box style={{ marginTop: 10 }}>
        <EditorMenubar selected={0} open variant="contrast" tone="warning" />
      </Box>
    </Box>
  </Grid>
);

export const Vertical = () => (
  <Flex style={{ display: 'flex', gap: 16, padding: 24, alignItems: 'flex-start' }}>
    <Menubar orientation="vertical" open selected={0} shape="soft" density="comfortable" style={{ width: 240 }}>
      <Button slot="item" variant="ghost">Project</Button>
      <Button slot="item" variant="ghost">Team</Button>
      <Button slot="item" variant="ghost">Settings</Button>

      <Box slot="content">
        <Box role="menuitem" tabIndex={-1}>Overview</Box>
        <Box role="menuitem" tabIndex={-1}>Files</Box>
        <Box role="menuitem" tabIndex={-1}>Activity</Box>
      </Box>
      <Box slot="content">
        <Box role="menuitem" tabIndex={-1}>Members</Box>
        <Box role="menuitem" tabIndex={-1}>Roles</Box>
        <Box role="menuitem" tabIndex={-1}>Invites</Box>
      </Box>
      <Box slot="content">
        <Box role="menuitem" tabIndex={-1}>Preferences</Box>
        <Box role="menuitem" tabIndex={-1}>Billing</Box>
        <Box role="menuitem" tabIndex={-1}>API Keys</Box>
      </Box>
    </Menubar>
    <Box style={{ fontSize: 13, color: '#64748b' }}>
      Vertical mode is useful for command strips and compact admin side tools.
    </Box>
  </Flex>
);

export const SubmenuExample = () => (
  <Box style={{ padding: 32 }}>
    <Menubar open selected={0} closeOnSelect={false}>
      <button slot="item">File</button>
      <button slot="item">Edit</button>
      <button slot="item">View</button>

      <Box slot="content" style={{ minWidth: 240 }}>
        <Box role="menuitem" tabIndex={-1}>New file</Box>
        <Box role="menuitem" tabIndex={-1}>Open…</Box>
        <Box role="separator" className="separator" />
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            padding: '6px 8px',
            borderRadius: 8
          }}
        >
          <span style={{ fontSize: 13, color: '#334155' }}>Export</span>
          <Menu placement="right" density="compact" shape="square" variant="line">
            <button
              slot="trigger"
              style={{
                fontSize: 12,
                border: '1px solid #cbd5e1',
                borderRadius: 6,
                background: '#fff',
                padding: '4px 8px',
                cursor: 'pointer'
              }}
            >
              Formats ▸
            </button>
            <Box slot="content">
              <Box role="menuitem" tabIndex={-1}>Export as PDF</Box>
              <Box role="menuitem" tabIndex={-1}>Export as HTML</Box>
              <Box role="menuitem" tabIndex={-1}>Export as Markdown</Box>
            </Box>
          </Menu>
        </Box>
      </Box>

      <Box slot="content">
        <Box role="menuitem" tabIndex={-1}>Undo</Box>
        <Box role="menuitem" tabIndex={-1}>Redo</Box>
      </Box>

      <Box slot="content">
        <Box role="menuitemcheckbox" aria-checked="true" tabIndex={-1}>Show toolbar</Box>
        <Box role="menuitemcheckbox" aria-checked="false" tabIndex={-1}>Show minimap</Box>
      </Box>
    </Menubar>
  </Box>
);
`,Te=`import React from 'react';
import { NavigationMenu , Box, Grid} from '@editora/ui-react';

export default {
  title: 'UI/NavigationMenu',
  component: NavigationMenu,
  argTypes: {
    selected: { control: 'number' },
    orientation: { control: { type: 'radio', options: ['horizontal', 'vertical'] } },
    activation: { control: { type: 'radio', options: ['automatic', 'manual'] } },
    loop: { control: 'boolean' },
    collapsible: { control: 'boolean' }
  }
};

function ProductMenu(props: any) {
  return (
    <NavigationMenu {...props} style={{ maxWidth: 860 }}>
      <button slot="item">Overview</button>
      <button slot="item">Components</button>
      <button slot="item">Resources</button>

      <section slot="panel">
        <Grid style={{ display: 'grid', gap: 4 }}>
          <strong>Overview</strong>
          <span style={{ fontSize: 13, color: '#475569' }}>Roadmap, release notes, and workspace activity.</span>
        </Grid>
      </section>
      <section slot="panel">
        <Grid style={{ display: 'grid', gap: 6 }}>
          <strong>Components</strong>
          <ul style={{ margin: 0, paddingLeft: 18, color: '#475569', fontSize: 13 }}>
            <li>Combobox</li>
            <li>Badge</li>
            <li>Table</li>
            <li>Context Menu</li>
          </ul>
        </Grid>
      </section>
      <section slot="panel">
        <Grid style={{ display: 'grid', gap: 4 }}>
          <strong>Resources</strong>
          <span style={{ fontSize: 13, color: '#475569' }}>Developer docs, tokens, and Storybook examples.</span>
        </Grid>
      </section>
    </NavigationMenu>
  );
}

export const Default = ProductMenu;
Default.args = {
  selected: 0,
  orientation: 'horizontal',
  activation: 'automatic',
  loop: true
};

export const ManualActivation = (args: any) => (
  <ProductMenu {...args} activation="manual" />
);
ManualActivation.args = {
  selected: 1
};

export const Vertical = (args: any) => (
  <NavigationMenu {...args} orientation="vertical" style={{ maxWidth: 360 }}>
    <button slot="item">Dashboard</button>
    <button slot="item">Analytics</button>
    <button slot="item">Billing</button>

    <section slot="panel">
      <strong>Dashboard links</strong>
    </section>
    <section slot="panel">
      <strong>Analytics links</strong>
    </section>
    <section slot="panel">
      <strong>Billing links</strong>
    </section>
  </NavigationMenu>
);
Vertical.args = {
  selected: 0
};

export const Controlled = () => {
  const [selected, setSelected] = React.useState(0);
  return (
    <Grid style={{ display: 'grid', gap: 10 }}>
      <ProductMenu selected={selected} onSelect={(next) => setSelected(next)} />
      <Box style={{ fontSize: 13, color: '#475569' }}>Selected index: {selected}</Box>
    </Grid>
  );
};
`,Re=`import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { EditoraEditor } from "@editora/react";
import "@editora/themes/themes/default.css";
import "@editora/themes/themes/dark.css";
import {
  BoldPlugin,
  HeadingPlugin,
  HistoryPlugin,
  PIIRedactionPlugin,
  UnderlinePlugin,
} from "@editora/plugins";
import { Box, Grid } from "@editora/ui-react";

type PIIEventLog = {
  source: string;
  type: string;
  total: number;
  high: number;
  medium: number;
  low: number;
  redactedCount: number;
  time: string;
};

const meta: Meta = {
  title: "Editor/Plugins/PII Redaction Scenario",
  parameters: {
    layout: "padded",
    docs: {
      source: {
        type: "code",
      },
      description: {
        component:
          "Scenario story for validating PII detection/redaction lifecycle with realtime scan, redact-all flow, and multi-instance isolation.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function createPIIPlugins() {
  return [
    HistoryPlugin(),
    HeadingPlugin(),
    BoldPlugin(),
    UnderlinePlugin(),
    PIIRedactionPlugin({
      enableRealtime: true,
      redactionMode: "token",
      redactionToken: "REDACTED",
      maxFindings: 160,
    }),
  ];
}

export const SecurityComplianceReview: Story = {
  render: () => {
    const primaryRef = useRef<HTMLDivElement>(null);
    const secondaryRef = useRef<HTMLDivElement>(null);
    const [events, setEvents] = useState<PIIEventLog[]>([]);

    const primaryPlugins = useMemo(() => createPIIPlugins(), []);
    const secondaryPlugins = useMemo(
      () => [
        HistoryPlugin(),
        PIIRedactionPlugin({
          enableRealtime: true,
          redactionMode: "mask",
          maxFindings: 80,
        }),
      ],
      [],
    );

    useEffect(() => {
      const onScan = (rawEvent: Event) => {
        const event = rawEvent as CustomEvent<{ findings?: any[]; stats?: any }>;
        const detail = event.detail || {};
        const stats = detail.stats || {};

        const target = event.target as Node | null;
        if (!target) return;

        let source = "";
        if (primaryRef.current?.contains(target)) source = "Primary Memo";
        if (secondaryRef.current?.contains(target)) source = "Secondary Memo";
        if (!source) return;

        setEvents((prev) => [
          {
            source,
            type: event.type,
            total: Number(stats.total || 0),
            high: Number(stats.high || 0),
            medium: Number(stats.medium || 0),
            low: Number(stats.low || 0),
            redactedCount: Number(stats.redactedCount || 0),
            time: new Date().toLocaleTimeString(),
          },
          ...prev,
        ].slice(0, 14));
      };

      const onRedacted = (rawEvent: Event) => {
        const event = rawEvent as CustomEvent<{ redactedCount?: number }>;
        const target = event.target as Node | null;
        if (!target) return;

        let source = "";
        if (primaryRef.current?.contains(target)) source = "Primary Memo";
        if (secondaryRef.current?.contains(target)) source = "Secondary Memo";
        if (!source) return;

        setEvents((prev) => [
          {
            source,
            type: event.type,
            total: 0,
            high: 0,
            medium: 0,
            low: 0,
            redactedCount: Number(event.detail?.redactedCount || 0),
            time: new Date().toLocaleTimeString(),
          },
          ...prev,
        ].slice(0, 14));
      };

      document.addEventListener("editora:pii-scan", onScan as EventListener);
      document.addEventListener("editora:pii-findings", onScan as EventListener);
      document.addEventListener("editora:pii-redacted", onRedacted as EventListener);

      return () => {
        document.removeEventListener("editora:pii-scan", onScan as EventListener);
        document.removeEventListener("editora:pii-findings", onScan as EventListener);
        document.removeEventListener("editora:pii-redacted", onRedacted as EventListener);
      };
    }, []);

    return (
      <Grid style={{ display: "grid", gap: 16 }}>
        <Box style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 14, background: "#f8fafc" }}>
          <h3 style={{ margin: 0 }}>Dummy Scenario: Incident Memo Pre-Share PII Sweep</h3>
          <p style={{ margin: "8px 0 12px", lineHeight: 1.45 }}>
            Use the plugin before export/share to detect and redact sensitive values.
          </p>
          <ol style={{ margin: 0, paddingInlineStart: 20, display: "grid", gap: 6 }}>
            <li>Open panel with Ctrl/Cmd + Alt + Shift + I.</li>
            <li>Run scan with Ctrl/Cmd + Alt + Shift + U.</li>
            <li>Verify email/phone/API key findings appear.</li>
            <li>Use Locate to inspect context, then redact selected findings.</li>
            <li>Run Redact All (Ctrl/Cmd + Alt + Shift + M) and re-scan to confirm clean result.</li>
            <li>Check secondary editor remains independent.</li>
          </ol>
        </Box>

        <Grid style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
          <Grid style={{ display: "grid", gap: 16 }}>
            <div ref={primaryRef}>
              <EditoraEditor
                plugins={primaryPlugins}
                statusbar={{ enabled: true, position: "bottom" }}
                floatingToolbar={true}
                defaultValue={\`
                  <h2>Customer Incident Communication Memo</h2>
                  <p>Owner: Content Lead | Reviewer: Security Team</p>
                  <h3>Draft Message</h3>
                  <p>Please contact incident-owner@acme-secure.com for escalations and call +1 (415) 555-0136 for urgent updates.</p>
                  <p>Temporary debug token (remove before publish): sk-proj-9x8A12B34C56D78E90F12G34H56I78J.</p>
                  <p>Customer support fallback: support-team@acme-secure.com</p>
                \`}
              />
            </div>

            <div ref={secondaryRef}>
              <EditoraEditor
                plugins={secondaryPlugins}
                statusbar={{ enabled: true, position: "bottom" }}
                floatingToolbar={true}
                defaultValue={\`
                  <h3>Secondary Draft (Isolation Check)</h3>
                  <p>This instance should keep its own findings/state. Test value: test.secondary@acme.com</p>
                \`}
              />
            </div>
          </Grid>

          <Box style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 12, background: "#ffffff" }}>
            <h4 style={{ margin: "0 0 8px" }}>PII Event Log</h4>
            <p style={{ margin: "0 0 12px", fontSize: 12, color: "#475569" }}>
              Tracks scan/findings/redaction events from both editors.
            </p>
            {events.length === 0 ? (
              <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>No PII events captured yet.</p>
            ) : (
              <ol style={{ margin: 0, paddingInlineStart: 18, display: "grid", gap: 8 }}>
                {events.map((entry, index) => (
                  <li key={\`\${entry.time}-\${index}\`} style={{ fontSize: 12, lineHeight: 1.4 }}>
                    [{entry.time}] {entry.source} | {entry.type} | total={entry.total} | high={entry.high} | medium=
                    {entry.medium} | low={entry.low} | redacted={entry.redactedCount}
                  </li>
                ))}
              </ol>
            )}
          </Box>
        </Grid>
      </Grid>
    );
  },
};
`,Pe=`import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Flex, Grid, Pagination } from '@editora/ui-react';

export default {
  title: 'UI/Pagination',
  component: Pagination,
  argTypes: {
    page: { control: { type: 'number', min: 1, max: 50, step: 1 } },
    count: { control: { type: 'number', min: 1, max: 50, step: 1 } }
  }
};

export const Interactive = (args: any) => {
  const [page, setPage] = useState(Number(args.page) || 1);
  const [count, setCount] = useState(Number(args.count) || 12);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleChange = (event: Event) => {
      const next = (event as CustomEvent<{ page: number }>).detail?.page;
      if (typeof next === 'number') setPage(next);
    };
    el.addEventListener('change', handleChange as EventListener);
    return () => el.removeEventListener('change', handleChange as EventListener);
  }, []);

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <Flex style={{ display: 'flex', gap: 8 }}>
        <Button size="sm" variant="secondary" onClick={() => setCount((v) => Math.max(1, v - 1))}>- count</Button>
        <Button size="sm" variant="secondary" onClick={() => setCount((v) => v + 1)}>+ count</Button>
      </Flex>

      <Pagination ref={ref as any} page={String(page)} count={String(count)} />

      <Box style={{ fontSize: 13, color: '#475569' }}>
        Page {page} of {count}
      </Box>
    </Grid>
  );
};
Interactive.args = { page: 3, count: 12 };

export const CustomTokens = () => (
  <Pagination
    page="4"
    count="18"
    style={{
      ['--ui-pagination-active-bg' as any]: '#0ea5e9',
      ['--ui-pagination-radius' as any]: '999px',
      ['--ui-pagination-padding' as any]: '6px 12px'
    }}
  />
);
`,ze=`import React, { useState } from 'react';
import { PluginPanel, Button , Box, Grid, Flex} from '@editora/ui-react';

export default {
  title: 'UI/PluginPanel',
  component: PluginPanel,
  argTypes: {
    open: { control: 'boolean' },
    position: { control: 'select', options: ['right', 'left', 'bottom'] }
  }
};

export const Default = (args: any) => {
  const [open, setOpen] = useState(!!args.open);
  const [position, setPosition] = useState(args.position || 'right');

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <Flex style={{ display: 'flex', gap: 8 }}>
        <Button size="sm" onClick={() => setOpen((v) => !v)}>{open ? 'Close panel' : 'Open panel'}</Button>
        <Button size="sm" variant="secondary" onClick={() => setPosition('right')}>Right</Button>
        <Button size="sm" variant="secondary" onClick={() => setPosition('left')}>Left</Button>
        <Button size="sm" variant="secondary" onClick={() => setPosition('bottom')}>Bottom</Button>
      </Flex>

      <PluginPanel open={open} position={position}>
        <Box style={{ padding: 12, minWidth: 220 }}>
          <strong>Plugin Panel</strong>
          <p style={{ margin: '8px 0 0', color: '#475569' }}>Position: {position}</p>
        </Box>
      </PluginPanel>
    </Grid>
  );
};
Default.args = { open: true, position: 'right' };
`,Ae=`import React from 'react';
import { Popover, Button , Box, Flex} from '@editora/ui-react';

export default {
  title: 'UI/Popover',
  component: Popover
};

export const Default = (args: any) => (
  <Box style={{ padding: 60 }}>
    <Popover>
      <Button slot="trigger">Show popover</Button>
      <Box slot="content" style={{ padding: 8 }}>Popover content with <strong>HTML</strong></Box>
    </Popover>
  </Box>
);

export const Headless = () => {
  const { referenceRef, floatingRef, getReferenceProps, getFloatingProps, coords, toggle, open } = require('@editora/ui-react').useFloating({ placement: 'bottom', offset: 8 });
  return (
    <Box style={{ padding: 80, position: 'relative' }}>
      <button {...getReferenceProps()} ref={referenceRef as any} style={{ padding: '8px 12px' }}>Anchor (headless)</button>
      <Box {...getFloatingProps()} ref={floatingRef as any} style={{ position: 'absolute', top: coords.top, left: coords.left, pointerEvents: 'auto' }}>
        <Box style={{ padding: 8, background: '#fff', border: '1px solid #e6e6e6', borderRadius: 6, boxShadow: '0 8px 30px rgba(2,6,23,0.08)' }}>
          <Flex style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <strong>Headless panel</strong>
            <em style={{ color: '#666' }}>{coords.placement}</em>
            <Box style={{ marginLeft: 'auto' }}><button onClick={() => toggle()}>{open ? 'Close' : 'Open'}</button></Box>
          </Flex>
          <Box style={{ marginTop: 8 }}>Use Arrow keys and Escape — keyboard helpers are wired by the headless hook.</Box>
        </Box>
      </Box>
    </Box>
  );
};

export const ArrowAndShift = () => (
  <Box style={{ padding: 24 }}>
    <p>Click the button near the right edge to trigger <code>shift</code> and watch the arrow animate.</p>
    <Box style={{ position: 'relative', height: 140 }}>
      <Box style={{ position: 'absolute', right: 8, top: 40 }}>
        <Popover>
          <Button slot="trigger">Edge trigger</Button>
          <Box slot="content" style={{ padding: 12, width: 220 }}>This popover uses arrow + shift — it should stay on-screen and the arrow will move smoothly.</Box>
        </Popover>
      </Box>
    </Box>
  </Box>
);
`,Ie=`import React from 'react';
import { Portal, Button, Box, Grid, Flex } from '@editora/ui-react';

export default {
  title: 'UI/Portal',
  component: Portal,
  argTypes: {
    target: { control: 'text' },
    strategy: { control: 'select', options: ['append', 'prepend'] },
    headless: { control: 'boolean' },
    disabled: { control: 'boolean' }
  }
};

export const TargetedPortal = (args: any) => {
  const [show, setShow] = React.useState(true);
  const [log, setLog] = React.useState<string[]>([]);

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <Flex style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button size="sm" onClick={() => setShow((v) => !v)}>
          {show ? 'Unmount portaled content' : 'Mount portaled content'}
        </Button>
      </Flex>

      <Box
        id="storybook-portal-target"
        style={{
          minHeight: 96,
          padding: 12,
          border: '1px dashed #94a3b8',
          borderRadius: 10,
          background: 'linear-gradient(180deg, #f8fafc, #f1f5f9)'
        }}
      >
        <strong style={{ display: 'block', marginBottom: 8 }}>Portal target container</strong>
        Incoming content should render inside this box.
      </Box>

      {show && (
        <Portal
          target={args.target}
          strategy={args.strategy}
          headless={args.headless}
          disabled={args.disabled}
          onMount={(d) => setLog((prev) => [\`mount (\${d.count})\`, ...prev].slice(0, 4))}
          onUnmount={(d) => setLog((prev) => [\`unmount (\${d.count})\`, ...prev].slice(0, 4))}
          onSync={(d) => setLog((prev) => [\`sync (\${d.count})\`, ...prev].slice(0, 4))}
          onTargetMissing={(d) => setLog((prev) => [\`target missing: \${d.target}\`, ...prev].slice(0, 4))}
        >
          <Box style={{ padding: 10, borderRadius: 8, background: '#dbeafe', border: '1px solid #bfdbfe' }}>
            This content is rendered by <code>ui-portal</code>.
          </Box>
        </Portal>
      )}

      <Box style={{ fontSize: 12, color: '#64748b' }}>{log.length ? log.join(' | ') : 'No portal events yet.'}</Box>
    </Grid>
  );
};

TargetedPortal.args = {
  target: '#storybook-portal-target',
  strategy: 'append',
  headless: false,
  disabled: false
};

export const StrategyComparison = () => (
  <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(260px, 1fr))', gap: 14 }}>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
      <strong>Append Strategy</strong>
      <Box id="portal-append-target" style={{ marginTop: 8, minHeight: 72, padding: 10, border: '1px dashed #cbd5e1', borderRadius: 8 }}>
        <Box style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>Existing content A</Box>
        <Portal target="#portal-append-target" strategy="append">
          <Box style={{ padding: 8, borderRadius: 8, background: '#e0f2fe' }}>Portaled (append)</Box>
        </Portal>
      </Box>
    </Box>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
      <strong>Prepend Strategy</strong>
      <Box id="portal-prepend-target" style={{ marginTop: 8, minHeight: 72, padding: 10, border: '1px dashed #cbd5e1', borderRadius: 8 }}>
        <Box style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>Existing content B</Box>
        <Portal target="#portal-prepend-target" strategy="prepend">
          <Box style={{ padding: 8, borderRadius: 8, background: '#dcfce7' }}>Portaled (prepend)</Box>
        </Portal>
      </Box>
    </Box>
  </Grid>
);

export const BodyPortal = () => (
  <Portal>
    <Box
      style={{
        position: 'fixed',
        right: 20,
        bottom: 20,
        zIndex: 1600,
        background: '#0f172a',
        color: '#fff',
        padding: '8px 10px',
        borderRadius: 8,
        boxShadow: '0 14px 26px rgba(2, 6, 23, 0.28)'
      }}
    >
      Portaled to document.body
    </Box>
  </Portal>
);
`,Fe=`import React from 'react';
import { Presence, Button, Box, Grid, Flex } from '@editora/ui-react';

export default {
  title: 'UI/Presence',
  component: Presence,
  argTypes: {
    present: { control: 'boolean' },
    mode: { control: 'select', options: ['fade', 'scale', 'slide-up', 'slide-down', 'slide-left', 'slide-right', 'blur', 'flip'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['default', 'soft', 'glass', 'contrast'] },
    keepMounted: { control: 'boolean' },
    lazy: { control: 'boolean' },
    enterDuration: { control: { type: 'number', min: 50, max: 600, step: 10 } },
    exitDuration: { control: { type: 'number', min: 50, max: 600, step: 10 } },
    delay: { control: { type: 'number', min: 0, max: 500, step: 10 } }
  }
};

export const Playground = (args: any) => {
  const [present, setPresent] = React.useState(!!args.present);
  const [events, setEvents] = React.useState<string[]>([]);

  return (
    <Grid style={{ display: 'grid', gap: 12, maxWidth: 560 }}>
      <Flex style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button size="sm" onClick={() => setPresent((v) => !v)}>
          {present ? 'Hide card' : 'Show card'}
        </Button>
      </Flex>

      <Presence
        present={present}
        mode={args.mode}
        size={args.size}
        variant={args.variant}
        keepMounted={args.keepMounted}
        lazy={args.lazy}
        enterDuration={args.enterDuration}
        exitDuration={args.exitDuration}
        delay={args.delay}
        onBeforeEnter={() => setEvents((prev) => ['before-enter', ...prev].slice(0, 6))}
        onEnter={() => setEvents((prev) => ['enter', ...prev].slice(0, 6))}
        onAfterEnter={() => setEvents((prev) => ['after-enter', ...prev].slice(0, 6))}
        onBeforeExit={() => setEvents((prev) => ['before-exit', ...prev].slice(0, 6))}
        onExit={() => setEvents((prev) => ['exit', ...prev].slice(0, 6))}
        onAfterExit={() => setEvents((prev) => ['after-exit', ...prev].slice(0, 6))}
      >
        <Box
          style={{
            padding: 16,
            borderRadius: 12,
            border: '1px solid #bfdbfe',
            background: 'linear-gradient(135deg, #eff6ff, #e0f2fe)'
          }}
        >
          Presence-aware content with configurable motion states.
        </Box>
      </Presence>

      <Box style={{ fontSize: 12, color: '#64748b' }}>{events.length ? events.join(' | ') : 'No motion events yet.'}</Box>
    </Grid>
  );
};

Playground.args = {
  present: true,
  mode: 'fade',
  size: 'md',
  variant: 'default',
  keepMounted: false,
  lazy: false,
  enterDuration: 180,
  exitDuration: 150,
  delay: 0
};

export const MotionModes = () => (
  <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(220px, 1fr))', gap: 12, maxWidth: 700 }}>
    <Presence present mode="fade">
      <Box style={{ padding: 12, borderRadius: 10, border: '1px solid #e2e8f0' }}>Fade</Box>
    </Presence>
    <Presence present mode="scale" variant="soft">
      <Box style={{ padding: 12, borderRadius: 10, border: '1px solid #e2e8f0' }}>Scale</Box>
    </Presence>
    <Presence present mode="slide-up">
      <Box style={{ padding: 12, borderRadius: 10, border: '1px solid #e2e8f0' }}>Slide Up</Box>
    </Presence>
    <Presence present mode="slide-right">
      <Box style={{ padding: 12, borderRadius: 10, border: '1px solid #e2e8f0' }}>Slide Right</Box>
    </Presence>
    <Presence present mode="blur" variant="glass">
      <Box style={{ padding: 12, borderRadius: 10, border: '1px solid #e2e8f0', background: 'linear-gradient(135deg, #f8fafc, #eef2ff)' }}>
        Blur
      </Box>
    </Presence>
    <Presence present mode="flip" variant="contrast">
      <Box style={{ padding: 12, borderRadius: 10, border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0' }}>
        Flip
      </Box>
    </Presence>
  </Grid>
);

export const KeepMounted = () => {
  const [present, setPresent] = React.useState(true);
  return (
    <Grid style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
      <Button size="sm" onClick={() => setPresent((v) => !v)}>
        Toggle (keep-mounted)
      </Button>
      <Presence present={present} keepMounted mode="slide-down">
        <Box style={{ padding: 14, borderRadius: 10, border: '1px solid #dbeafe', background: '#f8fbff' }}>
          This node stays mounted in DOM even after exit transitions.
        </Box>
      </Presence>
    </Grid>
  );
};
`,Ee=`import React from 'react';
import { Progress, Button, Box, Grid, Flex } from '@editora/ui-react';

export default {
  title: 'UI/Progress',
  component: Progress,
  argTypes: {
    value: { control: { type: 'number', min: 0, max: 100, step: 1 } },
    buffer: { control: { type: 'number', min: 0, max: 100, step: 1 } },
    max: { control: { type: 'number', min: 1, max: 200, step: 1 } },
    variant: { control: 'select', options: ['default', 'solid', 'soft', 'line', 'glass', 'contrast'] },
    tone: { control: 'select', options: ['brand', 'success', 'warning', 'danger', 'info', 'neutral'] },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
    shape: { control: 'select', options: ['pill', 'round', 'square'] },
    mode: { control: 'select', options: ['line', 'circle'] },
    format: { control: 'select', options: ['percent', 'value', 'fraction'] },
    showLabel: { control: 'boolean' },
    striped: { control: 'boolean' },
    animated: { control: 'boolean' },
    indeterminate: { control: 'boolean' }
  }
};

export const Playground = (args: any) => {
  const [value, setValue] = React.useState(Number(args.value) || 32);
  const [buffer, setBuffer] = React.useState(Number(args.buffer) || 48);
  const max = Number(args.max) || 100;
  const [events, setEvents] = React.useState<string[]>([]);

  return (
    <Grid style={{ display: 'grid', gap: 12, maxWidth: 620 }}>
      <Flex style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button size="sm" variant="secondary" onClick={() => setValue((v) => Math.max(0, v - 10))}>-10 value</Button>
        <Button size="sm" onClick={() => setValue((v) => Math.min(max, v + 10))}>+10 value</Button>
        <Button size="sm" variant="secondary" onClick={() => setBuffer((v) => Math.max(0, v - 10))}>-10 buffer</Button>
        <Button size="sm" onClick={() => setBuffer((v) => Math.min(max, v + 10))}>+10 buffer</Button>
      </Flex>

      <Progress
        value={value}
        buffer={buffer}
        max={max}
        format={args.format}
        showLabel={args.showLabel}
        striped={args.striped}
        animated={args.animated}
        indeterminate={args.indeterminate}
        variant={args.variant}
        size={args.size}
        shape={args.shape}
        mode={args.mode}
        tone={args.tone}
        onValueChange={(detail) =>
          setEvents((prev) => [\`change -> \${detail.value.toFixed(0)} / \${detail.max.toFixed(0)}\`, ...prev].slice(0, 4))
        }
        onComplete={(detail) => setEvents((prev) => [\`complete -> \${detail.value.toFixed(0)} / \${detail.max.toFixed(0)}\`, ...prev].slice(0, 4))}
      />

      <Box style={{ fontSize: 13, color: '#475569' }}>
        value: {value} / {max} | buffer: {buffer}
      </Box>
      <Box style={{ fontSize: 12, color: '#64748b' }}>
        {events.length ? events.join(' | ') : 'No events yet'}
      </Box>
    </Grid>
  );
};

Playground.args = {
  value: 32,
  buffer: 48,
  max: 100,
  variant: 'default',
  tone: 'brand',
  size: 'md',
  shape: 'pill',
  mode: 'line',
  format: 'percent',
  showLabel: true,
  striped: false,
  animated: false,
  indeterminate: false
};

export const VisualModes = () => (
  <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(260px, 1fr))', gap: 14, maxWidth: 760 }}>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
      <strong>Soft + Brand</strong>
      <Progress value={56} showLabel format="percent" tone="brand" variant="soft" />
    </Box>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
      <strong>Solid + Success</strong>
      <Progress value={72} showLabel format="value" tone="success" variant="solid" />
    </Box>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
      <strong>Line + Warning + Striped</strong>
      <Progress value={41} showLabel striped tone="warning" variant="line" />
    </Box>
    <Box style={{ border: '1px solid #1f2937', borderRadius: 12, padding: 12, background: '#0f172a', color: '#e2e8f0' }}>
      <strong>Contrast + Danger</strong>
      <Progress value={88} showLabel tone="danger" variant="contrast" />
    </Box>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 12, background: 'linear-gradient(135deg, #f8fafc, #eef2ff)' }}>
      <strong>Glass + Info</strong>
      <Progress value={34} buffer={62} showLabel tone="info" variant="glass" />
    </Box>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
      <strong>Indeterminate</strong>
      <Progress indeterminate tone="neutral" showLabel label="Processing..." />
    </Box>
  </Grid>
);

export const SizeShapeMatrix = () => (
  <Grid style={{ display: 'grid', gap: 10, maxWidth: 680 }}>
    <Progress value={28} size="xs" shape="square" showLabel label="xs + square" />
    <Progress value={42} size="sm" shape="round" showLabel label="sm + round" />
    <Progress value={63} size="md" shape="pill" showLabel label="md + pill" />
    <Progress value={81} size="lg" shape="pill" showLabel label="lg + pill" />
  </Grid>
);

export const CircularModes = () => (
  <Flex style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
    <Progress mode="circle" value={24} size="sm" tone="info" showLabel />
    <Progress mode="circle" value={56} size="md" tone="brand" variant="soft" showLabel />
    <Progress mode="circle" value={82} size="lg" tone="success" variant="solid" showLabel />
    <Progress mode="circle" indeterminate size="md" tone="warning" label="Loading" showLabel />
  </Flex>
);
`,De=`import React from 'react';
import { Box, Button, Flex, QuickActions } from '@editora/ui-react';

export default {
  title: 'UI/QuickActions',
  component: QuickActions,
  argTypes: {
    mode: { control: 'select', options: ['bar', 'fab'] },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    variant: { control: 'select', options: ['default', 'soft', 'contrast', 'minimal'] },
    floating: { control: 'boolean' },
    collapsible: { control: 'boolean' }
  }
};

export const ActionBar = (args: any) => {
  const [message, setMessage] = React.useState('No action selected');

  return (
    <Box style={{ minHeight: 240, display: 'grid', gap: 10, alignContent: 'start' }}>
      <QuickActions
        mode={args.mode || 'bar'}
        orientation={args.orientation || 'horizontal'}
        variant={args.variant || 'default'}
        floating={!!args.floating}
        collapsible={typeof args.collapsible === 'boolean' ? args.collapsible : true}
        onSelect={(detail) => setMessage(\`Selected: \${detail.label}\`)}
      >
        <Button slot="action" size="sm">Create</Button>
        <Button slot="action" size="sm" variant="secondary">Assign</Button>
        <Button slot="action" size="sm" variant="ghost">Export</Button>
      </QuickActions>

      <Box style={{ fontSize: 'var(--ui-font-size-md, 14px)', color: 'var(--ui-color-muted, #64748b)' }}>{message}</Box>
    </Box>
  );
};

ActionBar.args = {
  mode: 'bar',
  orientation: 'horizontal',
  variant: 'default',
  floating: false,
  collapsible: true
};

export const FloatingFab = () => (
  <Box style={{ minHeight: 320, border: '1px solid var(--ui-color-border, #cbd5e1)', borderRadius: 'calc(var(--ui-radius, 12px) + 2px)', position: 'relative', padding: 'var(--ui-space-lg, 16px)' }}>
    <Flex style={{ fontSize: 'var(--ui-font-size-md, 14px)', color: 'var(--ui-color-muted, #64748b)' }}>Floating quick actions for dense admin workflows.</Flex>
    <QuickActions mode="fab" floating placement="bottom-right" label="Quick actions" onSelect={() => {}}>
      <Button slot="action" size="sm">New patient</Button>
      <Button slot="action" size="sm" variant="secondary">New class</Button>
      <Button slot="action" size="sm" variant="ghost">New invoice</Button>
    </QuickActions>
  </Box>
);

export const ContrastVertical = () => (
  <Box variant="contrast" p="12px" radius="lg" style={{ maxWidth: 240 }}>
    <QuickActions mode="bar" orientation="vertical" variant="contrast" collapsible>
      <Button slot="action" size="sm">Alerts</Button>
      <Button slot="action" size="sm" variant="secondary">Incidents</Button>
      <Button slot="action" size="sm" variant="ghost">Escalate</Button>
    </QuickActions>
  </Box>
);
`,Ge=`import React, { useMemo, useState } from 'react';
import { Box, Grid, RadioGroup } from '@editora/ui-react';

export default {
  title: 'UI/RadioGroup',
  component: RadioGroup,
  argTypes: {
    orientation: { control: 'select', options: ['vertical', 'horizontal'] },
    variant: { control: 'select', options: ['default', 'card', 'segmented'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    tone: { control: 'select', options: ['brand', 'neutral', 'success', 'warning', 'danger', 'info'] },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' }
  }
};

export const Playground = (args: any) => {
  const options = useMemo(
    () => [
      { value: 'draft', label: 'Draft', description: 'Visible only to team members' },
      { value: 'review', label: 'In review', description: 'Pending editorial approval' },
      { value: 'published', label: 'Published', description: 'Publicly available to readers' }
    ],
    []
  );

  const [value, setValue] = useState('draft');

  return (
    <Grid style={{ display: 'grid', gap: 12, maxWidth: 720 }}>
      <RadioGroup
        value={value}
        options={options}
        orientation={args.orientation}
        variant={args.variant}
        size={args.size}
        tone={args.tone}
        disabled={args.disabled}
        required={args.required}
        onValueChange={(detail) => {
          if (detail?.value) setValue(detail.value);
        }}
      />
      <Box style={{ fontSize: 13, color: '#475569' }}>Selected value: {value}</Box>
    </Grid>
  );
};

Playground.args = {
  orientation: 'vertical',
  variant: 'card',
  size: 'md',
  tone: 'brand',
  disabled: false,
  required: false
};

export const LegacySlottedUsage = () => {
  const [value, setValue] = useState('pro');

  return (
    <Grid style={{ display: 'grid', gap: 12, maxWidth: 620 }}>
      <RadioGroup
        value={value}
        variant="segmented"
        orientation="horizontal"
        onValueChange={(detail) => setValue(detail.value)}
      >
        <div data-radio data-value="starter" data-description="For personal projects">Starter</div>
        <div data-radio data-value="pro" data-description="For growing teams">Professional</div>
        <div data-radio data-value="enterprise" data-description="Custom workflows" data-disabled>
          Enterprise
        </div>
      </RadioGroup>

      <Box style={{ fontSize: 13, color: '#475569' }}>Selected plan: {value}</Box>
    </Grid>
  );
};

export const VisualModes = () => (
  <Grid style={{ display: 'grid', gap: 14, maxWidth: 760 }}>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 14, padding: 12 }}>
      <strong style={{ fontSize: 13 }}>Card + Success</strong>
      <RadioGroup
        variant="card"
        tone="success"
        options={[
          { value: 'a', label: 'Automatic backup', description: 'Runs every 4 hours' },
          { value: 'b', label: 'Manual backup', description: 'Trigger from dashboard' }
        ]}
        value="a"
      />
    </Box>

    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 14, padding: 12 }}>
      <strong style={{ fontSize: 13 }}>Segmented + Horizontal</strong>
      <RadioGroup
        variant="segmented"
        orientation="horizontal"
        size="sm"
        tone="info"
        options={[
          { value: 'day', label: 'Day' },
          { value: 'week', label: 'Week' },
          { value: 'month', label: 'Month' }
        ]}
        value="week"
      />
    </Box>
  </Grid>
);
`,Me=`import type { Meta, StoryObj } from '@storybook/react';
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
      Team standard: \`IconProvider(size=18, strokeWidth=1.9)\` and semantic icon mapping for status.
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
`,Oe=`import React from 'react';
import { Box, Calendar, Chart, Flex, Gantt, Grid, Timeline } from '@editora/ui-react';

export default {
  title: 'UI/Reporting Dashboard'
};

const trend = [
  { label: 'W1', value: 34 },
  { label: 'W2', value: 41 },
  { label: 'W3', value: 39 },
  { label: 'W4', value: 47 },
  { label: 'W5', value: 52 },
  { label: 'W6', value: 50 }
];

export const HospitalOrSchoolModule = () => (
  <Grid style={{ display: 'grid', gap: 14 }}>
    <Grid style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
      <Chart type="line" title="Admissions Trend" subtitle="Weekly" data={trend} />
      <Chart
        type="donut"
        title="Department Mix"
        subtitle="Current month"
        data={[
          { label: 'Emergency', value: 40, tone: 'var(--ui-color-primary, #2563eb)' },
          { label: 'OPD', value: 25, tone: 'var(--ui-color-success, #16a34a)' },
          { label: 'Lab', value: 20, tone: 'var(--ui-color-warning, #d97706)' },
          { label: 'Other', value: 15, tone: 'var(--ui-color-danger, #dc2626)' }
        ]}
      />
    </Grid>

    <Grid style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
      <Timeline
        items={[
          { title: 'Admissions import', time: '08:40', description: 'Morning records synced.', tone: 'success' },
          { title: 'Compliance check', time: '10:20', description: 'Data retention policy validated.', tone: 'info' },
          { title: 'Finance reconciliation', time: '13:15', description: 'Invoice mismatch detected.', tone: 'warning' },
          { title: 'Emergency escalation', time: '16:10', description: 'Critical queue exceeded SLA.', tone: 'danger' }
        ]}
      />

      <Calendar
        year={2026}
        month={2}
        value="2026-02-13"
        events={[
          { date: '2026-02-05', title: 'Ops review', tone: 'info' },
          { date: '2026-02-13', title: 'Release cut', tone: 'success' },
          { date: '2026-02-18', title: 'Incident drill', tone: 'danger' },
          { date: '2026-02-24', title: 'Audit export', tone: 'warning' }
        ]}
      />
    </Grid>

    <Gantt
      tasks={[
        { label: 'Admissions', start: '2026-02-01', end: '2026-02-14', progress: 88, tone: 'success' },
        { label: 'Billing', start: '2026-02-05', end: '2026-02-22', progress: 54, tone: 'warning' },
        { label: 'Scheduling', start: '2026-02-11', end: '2026-02-27', progress: 32, tone: 'default' },
        { label: 'Audit', start: '2026-02-15', end: '2026-03-01', progress: 22, tone: 'danger' }
      ]}
    />

    <Flex style={{ fontSize: 'var(--ui-font-size-sm, 12px)', color: 'var(--ui-color-muted, #64748b)' }}>
      Reporting primitives now cover charts, timeline history, calendar planning, and Gantt-like execution tracking.
    </Flex>
  </Grid>
);

export const ContrastCommandCenter = () => (
  <Box variant="contrast" p="14px" radius="lg" style={{ display: 'grid', gap: 12 }}>
    <Chart variant="contrast" type="area" title="Night Shift Throughput" data={trend.map((point) => ({ ...point, value: Math.round(point.value * 0.7) }))} />
    <Timeline
      variant="contrast"
      items={[
        { title: 'Nurse handoff complete', time: '21:00', tone: 'success' },
        { title: 'Unexpected surge', time: '23:10', tone: 'warning' },
        { title: 'Escalation resolved', time: '01:35', tone: 'info' }
      ]}
    />
  </Box>
);
`,Le=`import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useRef, useState } from "react";
import { EditoraEditor } from "@editora/react";
import "@editora/themes/themes/default.css";
import "@editora/themes/themes/dark.css";
import "@editora/themes/themes/acme.css";

// Import the Web Component build
// import "../../packages/core/dist/webcomponent.esm.js";

// Import native plugins
import {
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  StrikethroughPlugin,
  LinkPlugin,
  TablePlugin,
  ListPlugin,
  HistoryPlugin,
  ClearFormattingPlugin,
  HeadingPlugin,
  BlockquotePlugin,
  CodePlugin,
  CodeSamplePlugin,
  IndentPlugin,
  TextAlignmentPlugin,
  TextColorPlugin,
  BackgroundColorPlugin,
  FontSizePlugin,
  FontFamilyPlugin,
  LineHeightPlugin,
  FootnotePlugin,
  DirectionPlugin,
  CapitalizationPlugin,
  ChecklistPlugin,
  AnchorPlugin,
  EmbedIframePlugin,
  MathPlugin,
  MediaManagerPlugin,
  MergeTagPlugin,
  PageBreakPlugin,
  PrintPlugin,
  PreviewPlugin,
  SpecialCharactersPlugin,
  SpellCheckPlugin,
  EmojisPlugin,
  A11yCheckerPlugin,
  CommentsPlugin,
  DocumentManagerPlugin,
  FullscreenPlugin,
  TemplatePlugin,
  TrackChangesPlugin,
  MentionPlugin,
  SlashCommandsPlugin,
  VersionDiffPlugin,
  ConditionalContentPlugin,
  DataBindingPlugin,
  ContentRulesPlugin,
  CitationsPlugin,
  ApprovalWorkflowPlugin,
  PIIRedactionPlugin,
  SmartPastePlugin,
  BlocksLibraryPlugin,
  DocSchemaPlugin,
  TranslationWorkflowPlugin,
} from "@editora/plugins";
import { Box, Flex, Grid} from '@editora/ui-react';


const meta: Meta<typeof EditoraEditor> = {
  title: "Editor/Rich Text Editor - Web Component",
  component: EditoraEditor,
  parameters: {
    layout: "padded",
    docs: {
      source: {
        type: "code",
      },
      description: {
        component: \`
# Editora Web Component - Framework Agnostic Rich Text Editor

**Bundle Size**: 115 KB minified (28.65 KB gzipped)  
**Native Plugins**: 42  
**Framework Dependencies**: 0  
**Supports**: React, Vue, Angular, Svelte, Vanilla JS

## Features
- ✅ Zero framework dependencies
- ✅ 91% bundle size reduction
- ✅ TinyMCE-style declarative API
- ✅ Works everywhere
- ✅ 39 native plugins including Code Sample, Media Manager, Math, Merge Tags, Page Break, Template, A11y Checker, Comments, and more
        \`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// All native plugins
export const allNativePlugins = [
  BoldPlugin(),
  ItalicPlugin(),
  UnderlinePlugin(),
  StrikethroughPlugin(),
  ClearFormattingPlugin(),
  // ParagraphPlugin removed - paragraph option is in HeadingPlugin dropdown
  HeadingPlugin(),
  BlockquotePlugin(),
  CodePlugin(),
  CodeSamplePlugin(),
  ListPlugin(),
  ChecklistPlugin(),
  TextAlignmentPlugin(),
  IndentPlugin(),
  DirectionPlugin(),
  TextColorPlugin(),
  BackgroundColorPlugin(),
  FontSizePlugin(),
  FontFamilyPlugin(),
  LineHeightPlugin(),
  CapitalizationPlugin(),
  LinkPlugin(),
  TablePlugin(),
  AnchorPlugin(),
  EmbedIframePlugin(),
  MathPlugin(),
  MediaManagerPlugin(),
  MergeTagPlugin(),
  PageBreakPlugin(),
  PrintPlugin(),
  PreviewPlugin(),
  SpecialCharactersPlugin(),
  SpellCheckPlugin(),
  EmojisPlugin(),
  A11yCheckerPlugin(),
  CommentsPlugin(),
  DocumentManagerPlugin(),
  FullscreenPlugin(),
  TemplatePlugin(),
  HistoryPlugin(),
  FootnotePlugin(),
  TrackChangesPlugin(),
  VersionDiffPlugin(),
  ConditionalContentPlugin(),
  DataBindingPlugin({
    data: {
      user: { firstName: "Ava", lastName: "Miller" },
      order: { total: 1234.56, createdAt: "2026-03-03T12:00:00Z" },
    },
  }),
  ContentRulesPlugin({
    bannedWords: ["obviously", "simply"],
    requiredHeadings: ["Summary"],
    maxSentenceWords: 28,
    minReadabilityScore: 55,
    enableRealtime: true,
  }),
  CitationsPlugin({
    defaultStyle: "apa",
    enableFootnoteSync: true,
  }),
  ApprovalWorkflowPlugin({
    defaultStatus: "draft",
    lockOnApproval: true,
    defaultActor: "Editorial Lead",
  }),
  PIIRedactionPlugin({
    enableRealtime: true,
    redactionMode: "token",
    maxFindings: 120,
  }),
  SmartPastePlugin({
    defaultProfile: "balanced",
    maxHtmlLength: 220000,
  }),
  BlocksLibraryPlugin({
    maxResults: 120,
    blocks: [
      {
        id: "incident-summary",
        label: "Incident Summary Block",
        category: "Operations",
        tags: ["incident", "summary"],
        keywords: ["postmortem", "rca"],
        html: "<h3>Incident Summary</h3><p>Describe impact, timeline, and customer exposure.</p>",
      },
      {
        id: "risk-register-entry",
        label: "Risk Register Entry",
        category: "Compliance",
        tags: ["risk", "governance"],
        keywords: ["mitigation", "owner"],
        html: "<h3>Risk Register Entry</h3><p><strong>Risk:</strong> <em>Describe risk here.</em></p><p><strong>Mitigation:</strong> Define mitigation owner and due date.</p>",
      },
      {
        id: "release-rollback",
        label: "Release Rollback Plan",
        category: "Engineering",
        tags: ["release", "rollback"],
        keywords: ["deployment", "runbook"],
        html: "<h3>Rollback Plan</h3><ol><li>Pause rollout</li><li>Revert deployment</li><li>Validate service health</li></ol>",
      },
    ],
  }),
  DocSchemaPlugin({
    defaultSchemaId: "policy",
    enableRealtime: true,
    schemas: [
      {
        id: "policy",
        label: "Policy",
        strictOrder: true,
        allowUnknownHeadings: true,
        sections: [
          { title: "Policy Statement" },
          { title: "Applicability", aliases: ["Scope"] },
          { title: "Controls" },
          { title: "Exceptions" },
          { title: "Enforcement" },
        ],
      },
    ],
  }),
  TranslationWorkflowPlugin({
    sourceLocale: "en-US",
    targetLocale: "fr-FR",
    enableRealtime: true,
    locales: ["en-US", "fr-FR", "de-DE", "es-ES", "ja-JP"],
  }),
  SlashCommandsPlugin(),
  MentionPlugin({
    items: [
      { id: "john.doe", label: "John Doe", meta: "john@acme.com" },
      { id: "sarah.lee", label: "Sarah Lee", meta: "sarah@acme.com" },
      { id: "ops.team", label: "Ops Team", meta: "team" },
    ],
  }),
];

/**
 * Basic usage with default configuration
 * All 39 native plugins loaded automatically
 */
export const Basic: Story = {
  render: () => (
    <EditoraEditor
      plugins={allNativePlugins}
      statusbar={{ enabled: true, position: "bottom" }}
      floatingToolbar={true}
      defaultValue={\`
        <h2>Welcome to Editora!!</h2>
        <p>This is a <strong>framework-agnostic</strong> rich text editor with <mark style="background: #ffeb3b;">39 native plugins</mark>.</p>
        <p>✨ <strong>Key Features:</strong></p>
        <ul>
          <li>Zero framework dependencies</li>
          <li>115 KB minified (28.65 KB gzipped)</li>
          <li>91% smaller than before!</li>
          <li>Works with React, Vue, Angular, Svelte</li>
        </ul>
        <p>Try editing this content!</p>
      \`}
    />
  ),
};

/**
 * Web Component API - TinyMCE Style Usage
 * Demonstrates using the global Editora API
 */
export const WebComponentAPI: Story = {
  render: () => {
    const editorRef = useRef<any>(null);
    const [output, setOutput] = useState("");
    const [pluginCount, setPluginCount] = useState(0);
    const [version, setVersion] = useState("");

    useEffect(() => {
      // Access the global Editora object
      if (typeof window !== 'undefined' && (window as any).Editora) {
        const Editora = (window as any).Editora;
        setVersion(Editora.version || "N/A");
        setPluginCount(Editora.plugins?.length || 0);
      }
    }, []);

    const getContent = () => {
      if (editorRef.current) {
        const content = editorRef.current.innerHTML;
        setOutput(content);
      }
    };

    const setContent = () => {
      if (editorRef.current) {
        editorRef.current.innerHTML = \`
          <h3>Content Set via API!</h3>
          <p>Updated at: \${new Date().toLocaleTimeString()}</p>
          <p>This was set using the Web Component API.</p>
        \`;
      }
    };

    return (
      <div>
        <Box style={{ marginBottom: "20px", padding: "15px", background: "#f5f5f5", borderRadius: "4px" }}>
          <h4 style={{ margin: "0 0 10px 0" }}>🌐 Global Editora API</h4>
          <p style={{ margin: "5px 0" }}>Version: <strong>{version}</strong></p>
          <p style={{ margin: "5px 0" }}>Plugins Available: <strong>{pluginCount}</strong></p>
          <Flex style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
            <button onClick={getContent} style={{ padding: "8px 16px" }}>Get Content</button>
            <button onClick={setContent} style={{ padding: "8px 16px" }}>Set Content</button>
          </Flex>
        </Box>

        <div ref={editorRef}>
          <EditoraEditor
            plugins={allNativePlugins}
            statusbar={{ enabled: true }}
            defaultValue={\`
              <h3>Web Component API Demo</h3>
              <p>This editor can be controlled via the global <code>window.Editora</code> object.</p>
              <p>Try the buttons above to interact with the editor programmatically!</p>
            \`}
          />
        </div>

        {output && (
          <Box style={{ marginTop: "20px", padding: "15px", background: "#e8f5e9", borderRadius: "4px" }}>
            <h4 style={{ margin: "0 0 10px 0" }}>📄 Output:</h4>
            <pre style={{ overflow: "auto", fontSize: "12px" }}>{output}</pre>
          </Box>
        )}
      </div>
    );
  },
};

/**
 * All 32 Native Plugins Showcase
 * Demonstrates every available plugin
 */
export const AllPluginsShowcase: Story = {
  render: () => (
    <div>
      <Box style={{ marginBottom: "20px", padding: "15px", background: "#e3f2fd", borderRadius: "4px" }}>
        <h3 style={{ margin: "0 0 10px 0" }}>🔌 All 32 Native Plugins Loaded</h3>
        <Grid style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", fontSize: "13px" }}>
          <div><strong>Basic Formatting (5):</strong><br/>Bold, Italic, Underline, Strikethrough, ClearFormatting</div>
          <div><strong>Block Types (4):</strong><br/>Paragraph, Heading, Blockquote, Code</div>
          <div><strong>Lists (2):</strong><br/>List, Checklist</div>
          <div><strong>Layout (3):</strong><br/>TextAlignment, Indent, Direction</div>
          <div><strong>Typography (6):</strong><br/>TextColor, BackgroundColor, FontSize, FontFamily, LineHeight, Capitalization</div>
          <div><strong>Content (6):</strong><br/>Link, Image, Table, Anchor, EmbedIframe, Footnote</div>
          <div><strong>Special (3):</strong><br/>Math, SpecialCharacters, Emojis</div>
          <div><strong>Tools (4):</strong><br/>A11yChecker, Comments, DocumentManager, Fullscreen</div>
          <div><strong>History (1):</strong><br/>History</div>
        </Grid>
      </Box>

      <EditoraEditor
        plugins={allNativePlugins}
        statusbar={{ enabled: true }}
        defaultValue={\`
          <h1>🎨 All Plugin Features</h1>
          
          <h2>Basic Formatting</h2>
          <p><strong>Bold</strong>, <em>Italic</em>, <u>Underline</u>, <s>Strikethrough</s></p>
          
          <h2>Typography</h2>
          <p style="color: #e91e63;">Text Color</p>
          <p style="background-color: #ffeb3b;">Background Color</p>
          <p style="font-size: 18px;">Font Size: 18px</p>
          <p style="font-family: 'Courier New';">Font Family: Courier New</p>
          <p style="line-height: 2;">Line Height: 2.0</p>
          
          <h2>Text Alignment</h2>
          <p style="text-align: left;">Left aligned</p>
          <p style="text-align: center;">Center aligned</p>
          <p style="text-align: right;">Right aligned</p>
          <p style="text-align: justify;">Justified text with enough content to wrap and demonstrate the justification effect across multiple lines.</p>
          
          <h2>Lists</h2>
          <ul>
            <li>Bullet list item 1</li>
            <li>Bullet list item 2</li>
          </ul>
          <ol>
            <li>Numbered list item 1</li>
            <li>Numbered list item 2</li>
          </ol>
          
          <h2>Block Quotes</h2>
          <blockquote>
            "This is a blockquote. It can contain multiple paragraphs and formatting."
          </blockquote>
          
          <h2>Code</h2>
          <pre><code>function hello() {
  console.log("Hello, World!");
}</code></pre>
          
          <h2>Links & Media</h2>
          <p><a href="https://example.com">Click here for a link</a></p>
          
          <h2>Tables</h2>
          <table border="1">
            <tr><th>Header 1</th><th>Header 2</th></tr>
            <tr><td>Cell 1</td><td>Cell 2</td></tr>
            <tr><td>Cell 3</td><td>Cell 4</td></tr>
          </table>
          
          <p>Try using the toolbar to test all features! 🚀</p>
        \`}
      />
    </div>
  ),
};

/**
 * Custom Toolbar Configuration
 * Demonstrates toolbar customization
 */
export const CustomToolbar: Story = {
  render: () => (
    <div>
      <Box style={{ marginBottom: "20px", padding: "15px", background: "#fff3e0", borderRadius: "4px" }}>
        <h4 style={{ margin: "0 0 10px 0" }}>🎨 Custom Toolbar</h4>
        <p style={{ margin: 0, fontSize: "14px" }}>Only essential formatting tools are shown in the toolbar.</p>
      </Box>

      <EditoraEditor
        plugins={[
          BoldPlugin(),
          ItalicPlugin(),
          UnderlinePlugin(),
          StrikethroughPlugin(),
          LinkPlugin(),
          HistoryPlugin(),
        ]}
        statusbar={{ enabled: true }}
        toolbar={{
          items: "undo redo | bold italic underline strikethrough | link",
          sticky: true,
        }}
        defaultValue={\`
          <h2>Minimal Editor</h2>
          <p>This editor has a <strong>simplified toolbar</strong> with only essential formatting options.</p>
          <p>Perfect for comment sections, chat applications, or simple text input.</p>
        \`}
      />
    </div>
  ),
};

/**
 * Readonly Mode
 * Demonstrates readonly editor for viewing content
 */
export const ReadonlyMode: Story = {
  render: () => {
    const [readonly, setReadonly] = useState(true);

    return (
      <div>
        <Box style={{ marginBottom: "20px", padding: "15px", background: "#f3e5f5", borderRadius: "4px" }}>
          <h4 style={{ margin: "0 0 10px 0" }}>🔒 Readonly Mode</h4>
          <button onClick={() => setReadonly(!readonly)} style={{ padding: "8px 16px" }}>
            {readonly ? "Enable Editing" : "Disable Editing"}
          </button>
        </Box>

        <EditoraEditor
          plugins={allNativePlugins}
          statusbar={{ enabled: true }}
          readonly={readonly}
          defaultValue={\`
            <h2>Readonly Content</h2>
            <p>This content is <strong>\${readonly ? "readonly" : "editable"}</strong>.</p>
            <p>Click the button above to toggle editing mode.</p>
            <ul>
              <li>Perfect for previewing documents</li>
              <li>Displaying formatted content</li>
              <li>Review mode in collaborative editing</li>
            </ul>
          \`}
        />
      </div>
    );
  },
};

/**
 * Test 6: Placeholder
 * Shows multiple placeholder examples in editor instances
 */
export const Test6Placeholder: Story = {
  render: () => {
    return (
      <div>
        <Box
          style={{
            marginBottom: "20px",
            padding: "15px",
            background: "#e3f2fd",
            borderRadius: "4px",
          }}
        >
          <h4 style={{ margin: "0 0 10px 0" }}>🧪 Test 6: Placeholder</h4>
          <p style={{ margin: 0, fontSize: "14px" }}>
            Three placeholder examples: simple, detailed guidance, and
            prefilled-content fallback.
          </p>
        </Box>

        <Grid
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "16px",
          }}
        >
          <div>
            <h4 style={{ margin: "0 0 8px 0" }}>Simple Placeholder</h4>
            <EditoraEditor
              plugins={[BoldPlugin(), ItalicPlugin()]}
              toolbar={{ items: "bold italic", showMoreOptions: false }}
              statusbar={{ enabled: true }}
              placeholder="Type something here..."
            />
          </div>

          <div>
            <h4 style={{ margin: "0 0 8px 0" }}>Detailed Placeholder</h4>
            <EditoraEditor
              plugins={[BoldPlugin(), ItalicPlugin(), UnderlinePlugin()]}
              toolbar={{
                items: "bold italic underline",
                showMoreOptions: false,
              }}
              statusbar={{ enabled: true }}
              placeholder="Draft release notes: summary, impact, migration steps, and rollback plan."
            />
          </div>

          <div>
            <h4 style={{ margin: "0 0 8px 0" }}>Prefilled Then Clear</h4>
            <EditoraEditor
              plugins={[BoldPlugin(), ItalicPlugin()]}
              toolbar={{ items: "bold italic", showMoreOptions: false }}
              statusbar={{ enabled: true }}
              placeholder="Delete all content to show this placeholder."
              defaultValue="<p>This editor starts with content. Clear it to reveal placeholder.</p>"
            />
          </div>
        </Grid>
      </div>
    );
  },
};

/**
 * Test 7: Theme Switcher (Editor Only)
 * Toggles theme on editor wrappers without changing Storybook page theme
 */
export const Test7ThemeSwitcherEditorOnly: Story = {
  render: () => {
    const [themeA, setThemeA] = useState<"default" | "dark" | "acme">("default");
    const [themeB, setThemeB] = useState<"default" | "dark" | "acme">("dark");

    const cycleTheme = (theme: "default" | "dark" | "acme") => {
      if (theme === "default") return "dark";
      if (theme === "dark") return "acme";
      return "default";
    };

    return (
      <div>
        <Box style={{ marginBottom: "20px", padding: "15px", background: "#ede7f6", borderRadius: "4px" }}>
          <h4 style={{ margin: "0 0 10px 0" }}>🎨 Test 7: Theme Switcher (Editor Only)</h4>
          <p style={{ margin: "0 0 12px 0", fontSize: "14px" }}>
            Switches only editor themes using wrapper-level attributes (\`data-theme\`).
          </p>
          <Flex style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button onClick={() => setThemeA(cycleTheme(themeA))} style={{ padding: "8px 16px" }}>
              Cycle Editor A
            </button>
            <button onClick={() => setThemeB(cycleTheme(themeB))} style={{ padding: "8px 16px" }}>
              Cycle Editor B
            </button>
            <button
              onClick={() => {
                setThemeA("dark");
                setThemeB("dark");
              }}
              style={{ padding: "8px 16px" }}
            >
              Set Both Dark
            </button>
            <button
              onClick={() => {
                setThemeA("default");
                setThemeB("default");
              }}
              style={{ padding: "8px 16px" }}
            >
              Set Both Default
            </button>
            <button
              onClick={() => {
                setThemeA("acme");
                setThemeB("acme");
              }}
              style={{ padding: "8px 16px" }}
            >
              Set Both Acme
            </button>
          </Flex>
          <p style={{ margin: "12px 0 0 0", fontSize: "13px" }}>
            Current themes: <strong>Editor A = {themeA}</strong>, <strong>Editor B = {themeB}</strong>
          </p>
        </Box>

        <Grid style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div
            data-theme={themeA}
            style={{
              padding: "10px",
              borderRadius: "8px",
              background: themeA === "dark" ? "#0b1220" : themeA === "acme" ? "#eef4fb" : "#ffffff",
            }}
          >
            <h4
              style={{
                margin: "0 0 8px 0",
                color: themeA === "dark" ? "#f8fafc" : themeA === "acme" ? "#0f4f4a" : "#111827",
              }}
            >
              Editor A
            </h4>
            <EditoraEditor
              plugins={allNativePlugins}
              toolbar={{ showMoreOptions: false }}
              statusbar={{ enabled: true }}
              floatingToolbar={true}
              defaultValue="<p>Editor A theme is controlled independently.</p>"
            />
          </div>

          <div
            data-theme={themeB}
            style={{
              padding: "10px",
              borderRadius: "8px",
              background: themeB === "dark" ? "#0b1220" : themeB === "acme" ? "#eef4fb" : "#ffffff",
            }}
          >
            <h4
              style={{
                margin: "0 0 8px 0",
                color: themeB === "dark" ? "#f8fafc" : themeB === "acme" ? "#0f4f4a" : "#111827",
              }}
            >
              Editor B
            </h4>
            <EditoraEditor
              plugins={allNativePlugins}
              toolbar={{ showMoreOptions: false }}
              statusbar={{ enabled: true }}
              floatingToolbar={true}
              defaultValue="<p>Editor B can use a different theme from Editor A.</p>"
            />
          </div>
        </Grid>
      </div>
    );
  },
};

/**
 * Event Handling
 * Demonstrates onChange events and content tracking
 */
export const EventHandling: Story = {
  render: () => {
    const [content, setContent] = useState("");
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);

    const handleChange = (html: string) => {
      setContent(html);
      const text = html.replace(/<[^>]*>/g, "").trim();
      setWordCount(text.split(/\\s+/).filter(Boolean).length);
      setCharCount(text.length);
    };

    return (
      <div>
        <EditoraEditor
          plugins={allNativePlugins}
          statusbar={{ enabled: true }}
          onChange={handleChange}
          defaultValue={\`
            <h2>Try typing here!</h2>
            <p>Watch the statistics update in real-time as you type.</p>
          \`}
        />

        <Box style={{ marginTop: "20px", padding: "15px", background: "#e8f5e9", borderRadius: "4px" }}>
          <h4 style={{ margin: "0 0 10px 0" }}>📊 Statistics</h4>
          <p style={{ margin: "5px 0" }}>Words: <strong>{wordCount}</strong></p>
          <p style={{ margin: "5px 0" }}>Characters: <strong>{charCount}</strong></p>
          <details style={{ marginTop: "10px" }}>
            <summary style={{ cursor: "pointer" }}>Show HTML</summary>
            <pre style={{ fontSize: "12px", overflow: "auto", marginTop: "10px" }}>{content}</pre>
          </details>
        </Box>
      </div>
    );
  },
};

/**
 * Math Equations
 * Demonstrates the Math plugin with LaTeX support
 */
export const MathEquations: Story = {
  render: () => (
    <div>
      <Box style={{ marginBottom: "20px", padding: "15px", background: "#e1f5fe", borderRadius: "4px" }}>
        <h4 style={{ margin: "0 0 10px 0" }}>🔢 Math Plugin</h4>
        <p style={{ margin: 0, fontSize: "14px" }}>
          Insert mathematical equations using LaTeX notation. Click the Math button in the toolbar (fx).
        </p>
      </Box>

      <EditoraEditor
        plugins={allNativePlugins}
        statusbar={{ enabled: true }}
        defaultValue={\`
          <h2>Mathematical Equations</h2>
          <p>Inline equation: <span data-math-inline="true" data-latex="E = mc^2" class="math-inline">$E = mc^2$</span></p>
          
          <p>Block equation:</p>
          <div data-math-block="true" data-latex="\\\\sum_{i=1}^{n} i = \\\\frac{n(n+1)}{2}" class="math-block">
            $$\\\\sum_{i=1}^{n} i = \\\\frac{n(n+1)}{2}$$
          </div>
          
          <p>Pythagorean theorem: <span data-math-inline="true" data-latex="a^2 + b^2 = c^2" class="math-inline">$a^2 + b^2 = c^2$</span></p>
          
          <p><strong>Try it:</strong> Use Cmd/Ctrl-Shift-M to open the math dialog!</p>
        \`}
      />
    </div>
  ),
};

/**
 * Special Characters & Emojis
 * Demonstrates special character and emoji insertion
 */
export const SpecialContent: Story = {
  render: () => (
    <div>
      <Box style={{ marginBottom: "20px", padding: "15px", background: "#fce4ec", borderRadius: "4px" }}>
        <h4 style={{ margin: "0 0 10px 0" }}>✨ Special Characters & Emojis</h4>
        <p style={{ margin: 0, fontSize: "14px" }}>
          Insert special characters (Cmd/Ctrl-Shift-S) and emojis (Cmd/Ctrl-Shift-J).
        </p>
      </Box>

      <EditoraEditor
        plugins={allNativePlugins}
        statusbar={{ enabled: true }}
        defaultValue={\`
          <h2>Special Characters & Emojis</h2>
          
          <h3>Special Characters</h3>
          <p>Common: © ® ™ § ¶ † ‡ • ★</p>
          <p>Arrows: → ← ↑ ↓ ↔ ⇒ ⇐</p>
          <p>Currency: $ € £ ¥ ₹ ₽</p>
          <p>Math: ± × ÷ ≠ ≤ ≥ ∞ ∑ ∫ √</p>
          <p>Greek: α β γ δ π σ θ Ω</p>
          
          <h3>Emojis</h3>
          <p>Smileys: 😀 😃 😄 😊 😍 🤩</p>
          <p>Gestures: 👍 👏 🙌 💪 ✌️ 🤝</p>
          <p>Objects: 💻 📱 📷 ⌚ 💡 🔋</p>
          <p>Nature: 🌵 🌲 🌹 🌸 ⭐ 🌞</p>
          
          <p><strong>Try it:</strong> Use the toolbar buttons to insert more!</p>
        \`}
      />
    </div>
  ),
};

/**
 * Tables
 * Demonstrates table creation and editing
 */
export const Tables: Story = {
  render: () => (
    <div>
      <Box style={{ marginBottom: "20px", padding: "15px", background: "#f1f8e9", borderRadius: "4px" }}>
        <h4 style={{ margin: "0 0 10px 0" }}>📊 Table Plugin</h4>
        <p style={{ margin: 0, fontSize: "14px" }}>
          Create and edit tables with the table button in the toolbar.
        </p>
      </Box>

      <EditoraEditor
        plugins={allNativePlugins}
        statusbar={{ enabled: true }}
        defaultValue={\`
          <h2>Tables</h2>
          <p>Below is an example table:</p>
          
          <table border="1" style="border-collapse: collapse; width: 100%;">
            <thead>
              <tr>
                <th style="padding: 8px; background: #f5f5f5;">Feature</th>
                <th style="padding: 8px; background: #f5f5f5;">Status</th>
                <th style="padding: 8px; background: #f5f5f5;">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 8px;">Web Component</td>
                <td style="padding: 8px;">✅ Complete</td>
                <td style="padding: 8px;">100% framework-agnostic</td>
              </tr>
              <tr>
                <td style="padding: 8px;">Native Plugins</td>
                <td style="padding: 8px;">✅ Complete</td>
                <td style="padding: 8px;">29 plugins available</td>
              </tr>
              <tr>
                <td style="padding: 8px;">Bundle Size</td>
                <td style="padding: 8px;">✅ Optimized</td>
                <td style="padding: 8px;">115 KB (91% reduction)</td>
              </tr>
            </tbody>
          </table>
          
          <p><strong>Try it:</strong> Click the table button to create a new table!</p>
        \`}
      />
    </div>
  ),
};

/**
 * Multiple Editors
 * Demonstrates multiple editor instances on one page
 */
export const MultipleEditors: Story = {
  render: () => {
    const [contentA, setContentA] = useState("");
    const [contentB, setContentB] = useState("");

    const syncAtoB = () => {
      setContentB(contentA);
    };

    const syncBtoA = () => {
      setContentA(contentB);
    };

    return (
      <div>
        <Box style={{ marginBottom: "20px", padding: "15px", background: "#fff9c4", borderRadius: "4px" }}>
          <h4 style={{ margin: "0 0 10px 0" }}>👥 Multiple Editors</h4>
          <p style={{ margin: "0 0 10px 0", fontSize: "14px" }}>
            Two independent editor instances with content synchronization.
          </p>
          <Flex style={{ display: "flex", gap: "10px" }}>
            <button onClick={syncAtoB} style={{ padding: "8px 16px" }}>Sync A → B</button>
            <button onClick={syncBtoA} style={{ padding: "8px 16px" }}>Sync B → A</button>
          </Flex>
        </Box>

        <Grid style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div>
            <h4>Editor A</h4>
            <EditoraEditor
              plugins={allNativePlugins}
              toolbar={{ showMoreOptions: false }}
              statusbar={{ enabled: true }}
              onChange={setContentA}
              defaultValue="<h3>Editor A</h3><p>Type here...</p>"
            />
          </div>
          <div>
            <h4>Editor B</h4>
            <EditoraEditor
              plugins={allNativePlugins}
              toolbar={{ showMoreOptions: false }}
              statusbar={{ enabled: true }}
              value={contentB}
              onChange={setContentB}
              defaultValue="<h3>Editor B</h3><p>Type here...</p>"
            />
          </div>
        </Grid>
      </div>
    );
  },
};

/**
 * Controlled Editor
 * Demonstrates controlled component pattern
 */
export const ControlledEditor: Story = {
  render: () => {
    const [value, setValue] = useState(\`
      <h2>Controlled Editor</h2>
      <p>This editor's content is controlled by React state.</p>
    \`);

    const resetContent = () => {
      setValue(\`
        <h2>Reset!</h2>
        <p>Content was reset at \${new Date().toLocaleTimeString()}</p>
      \`);
    };

    const appendContent = () => {
      setValue(prev => prev + \`<p>Appended at \${new Date().toLocaleTimeString()}</p>\`);
    };

    return (
      <div>
        <Box style={{ marginBottom: "20px", padding: "15px", background: "#e0f2f1", borderRadius: "4px" }}>
          <h4 style={{ margin: "0 0 10px 0" }}>🎛️ Controlled Component</h4>
          <Flex style={{ display: "flex", gap: "10px" }}>
            <button onClick={resetContent} style={{ padding: "8px 16px" }}>Reset Content</button>
            <button onClick={appendContent} style={{ padding: "8px 16px" }}>Append Content</button>
          </Flex>
        </Box>

        <EditoraEditor
          plugins={allNativePlugins}
          statusbar={{ enabled: true }}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

/**
 * Performance - Large Document
 * Tests editor with large content
 */
export const PerformanceLargeDocument: Story = {
  render: () => {
    const generateLargeContent = () => {
      let content = "<h1>Large Document Performance Test</h1>";
      content += "<p><strong>This document contains 100 paragraphs to test performance.</strong></p>";
      
      for (let i = 1; i <= 100; i++) {
        content += \`<h3>Section \${i}</h3>\`;
        content += \`<p>This is paragraph \${i}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>\`;
        if (i % 10 === 0) {
          content += \`<blockquote>Milestone: Completed \${i} sections!</blockquote>\`;
        }
      }
      
      return content;
    };

    return (
      <div>
        <Box style={{ marginBottom: "20px", padding: "15px", background: "#ffebee", borderRadius: "4px" }}>
          <h4 style={{ margin: "0 0 10px 0" }}>⚡ Performance Test</h4>
          <p style={{ margin: 0, fontSize: "14px" }}>
            This editor contains 100 sections (300+ paragraphs) to test performance with large documents.
          </p>
        </Box>

        <EditoraEditor
          plugins={allNativePlugins}
          statusbar={{ enabled: true }}
          defaultValue={generateLargeContent()}
        />
      </div>
    );
  },
};

/**
 * Framework Independence Demo
 * Shows that the same editor works in different contexts
 */
export const FrameworkIndependence: Story = {
  render: () => (
    <div>
      <Box style={{ marginBottom: "20px", padding: "15px", background: "#f3e5f5", borderRadius: "4px" }}>
        <h3 style={{ margin: "0 0 10px 0" }}>🌐 Framework Independence</h3>
        <p style={{ margin: 0, fontSize: "14px" }}>
          This same editor can be used in React (shown here), Vue, Angular, Svelte, or vanilla JavaScript!
        </p>
        
        <Grid style={{ marginTop: "15px", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", fontSize: "13px" }}>
          <Box style={{ padding: "10px", background: "white", borderRadius: "4px" }}>
            <strong>React:</strong><br/>
            <code style={{ fontSize: "11px" }}>&lt;EditoraEditor /&gt;</code>
          </Box>
          <Box style={{ padding: "10px", background: "white", borderRadius: "4px" }}>
            <strong>Vanilla JS:</strong><br/>
            <code style={{ fontSize: "11px" }}>&lt;editora-editor&gt;</code>
          </Box>
          <Box style={{ padding: "10px", background: "white", borderRadius: "4px" }}>
            <strong>Vue:</strong><br/>
            <code style={{ fontSize: "11px" }}>&lt;editora-editor&gt;</code>
          </Box>
          <Box style={{ padding: "10px", background: "white", borderRadius: "4px" }}>
            <strong>Angular:</strong><br/>
            <code style={{ fontSize: "11px" }}>&lt;editora-editor&gt;</code>
          </Box>
        </Grid>
      </Box>

      <EditoraEditor
        plugins={allNativePlugins}
        statusbar={{ enabled: true }}
        defaultValue={\`
          <h2>🚀 Universal Editor</h2>
          <p><strong>Zero framework dependencies!</strong></p>
          
          <h3>✅ Works With:</h3>
          <ul>
            <li>React (this example)</li>
            <li>Vue.js</li>
            <li>Angular</li>
            <li>Svelte</li>
            <li>Vanilla JavaScript</li>
            <li>Any web framework</li>
          </ul>
          
          <h3>📦 Bundle Benefits:</h3>
          <ul>
            <li><strong>115 KB</strong> minified</li>
            <li><strong>28.65 KB</strong> gzipped</li>
            <li><strong>91% smaller</strong> than before</li>
            <li>No React in production bundle</li>
          </ul>
          
          <blockquote>
            "Build once, use everywhere!"
          </blockquote>
        \`}
      />
    </div>
  ),
};

/**
 * Doc Schema Workflow Scenario
 * Structured authoring flow for policy/governance documents.
 */
export const DocSchemaWorkflow: Story = {
  render: () => (
    <div>
      <Box style={{ marginBottom: "16px", padding: "14px", background: "#ecfdf5", borderRadius: "8px" }}>
        <h4 style={{ margin: "0 0 8px 0" }}>📐 Doc Schema Test Scenario</h4>
        <p style={{ margin: 0, fontSize: "13px" }}>
          Use <code>Ctrl/Cmd+Alt+Shift+G</code> to open schema panel, run validation, and insert missing sections.
        </p>
      </Box>

      <EditoraEditor
        plugins={allNativePlugins}
        statusbar={{ enabled: true, position: "bottom" }}
        defaultValue={\`
          <h2>Q2 Access Control Policy Draft</h2>
          <h3>Policy Statement</h3>
          <p>All production access must be approved and logged.</p>
          <h3>Controls</h3>
          <p>Access reviews run monthly. Emergency access expires in 24 hours.</p>
        \`}
      />
    </div>
  ),
};

/**
 * Translation Workflow Scenario
 * Localization QA with segment locking + source-target validation.
 */
export const TranslationWorkflowScenario: Story = {
  render: () => (
    <div>
      <Box style={{ marginBottom: "16px", padding: "14px", background: "#eff6ff", borderRadius: "8px" }}>
        <h4 style={{ margin: "0 0 8px 0" }}>🌍 Translation Workflow Test Scenario</h4>
        <p style={{ margin: 0, fontSize: "13px" }}>
          Use <code>Ctrl/Cmd+Alt+Shift+L</code> to open panel, capture source, lock approved segments, and run locale QA.
        </p>
      </Box>

      <EditoraEditor
        plugins={allNativePlugins}
        statusbar={{ enabled: true, position: "bottom" }}
        defaultValue={\`
          <h2>Release Notes v4.8</h2>
          <p>Welcome {{firstName}}! Your order ID is %ORDER_ID%.</p>
          <p>Click <strong>Upgrade Now</strong> to activate premium analytics.</p>
          <p>For support, contact support@acme.com within 24 hours.</p>
        \`}
      />
    </div>
  ),
};
`,_e=`import React, { useRef, useState } from 'react';
import { Box, Button, Grid, ScrollArea } from '@editora/ui-react';

export default {
  title: 'UI/ScrollArea',
  component: ScrollArea,
  argTypes: {
    orientation: { control: 'select', options: ['vertical', 'horizontal', 'both'] },
    variant: { control: 'select', options: ['default', 'soft', 'inset', 'contrast', 'minimal'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    tone: { control: 'select', options: ['neutral', 'brand', 'info', 'success', 'warning', 'danger'] },
    autoHide: { control: 'boolean' },
    shadows: { control: 'boolean' }
  }
};

export const Playground = (args: any) => {
  const ref = useRef<HTMLElement | null>(null);
  const [status, setStatus] = useState('Scroll to inspect edge events');

  return (
    <Grid style={{ display: 'grid', gap: 12, maxWidth: 720 }}>
      <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(3, max-content)', gap: 8 }}>
        <Button size="sm" variant="secondary" onClick={() => (ref.current as any)?.scrollToTop?.('smooth')}>
          Scroll Top
        </Button>
        <Button size="sm" variant="secondary" onClick={() => (ref.current as any)?.scrollToBottom?.('smooth')}>
          Scroll Bottom
        </Button>
        <Button size="sm" variant="secondary" onClick={() => (ref.current as any)?.scrollToIndex?.(24, 'smooth')}>
          Scroll to Row 25
        </Button>
      </Grid>

      <ScrollArea
        ref={ref as any}
        orientation={args.orientation}
        variant={args.variant}
        size={args.size}
        tone={args.tone}
        autoHide={args.autoHide}
        shadows={args.shadows}
        style={{ maxHeight: 220 }}
        onScrollChange={(detail) => {
          setStatus(\`top: \${Math.round(detail.scrollTop)}px | left: \${Math.round(detail.scrollLeft)}px\`);
        }}
        onReachStart={() => setStatus('Reached start')}
        onReachEnd={() => setStatus('Reached end')}
      >
        {Array.from({ length: 30 }).map((_, idx) => (
          <Box key={idx} style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0' }}>
            Activity row #{idx + 1}
          </Box>
        ))}
      </ScrollArea>

      <Box style={{ fontSize: 13, color: '#475569' }}>{status}</Box>
    </Grid>
  );
};

Playground.args = {
  orientation: 'vertical',
  variant: 'soft',
  size: 'md',
  tone: 'neutral',
  autoHide: true,
  shadows: true
};

export const HorizontalAndBoth = () => (
  <Grid style={{ display: 'grid', gap: 14, maxWidth: 760 }}>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 10 }}>
      <strong style={{ fontSize: 13 }}>Horizontal</strong>
      <ScrollArea orientation="horizontal" variant="inset" tone="brand" style={{ maxHeight: 110 }}>
        <Grid style={{ display: 'grid', gridAutoFlow: 'column', gridAutoColumns: '220px', gap: 10, padding: 8 }}>
          {Array.from({ length: 10 }).map((_, idx) => (
            <Box key={idx} style={{ border: '1px solid #dbeafe', borderRadius: 10, padding: 10, background: '#eff6ff' }}>
              Card {idx + 1}
            </Box>
          ))}
        </Grid>
      </ScrollArea>
    </Box>

    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 10 }}>
      <strong style={{ fontSize: 13 }}>Both axes</strong>
      <ScrollArea orientation="both" variant="default" tone="info" style={{ maxHeight: 180 }}>
        <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 180px)', gap: 8, padding: 8 }}>
          {Array.from({ length: 24 }).map((_, idx) => (
            <Box key={idx} style={{ border: '1px solid #bae6fd', borderRadius: 8, padding: 10, background: '#f0f9ff' }}>
              Item {idx + 1}
            </Box>
          ))}
        </Grid>
      </ScrollArea>
    </Box>
  </Grid>
);
`,We=`import React from 'react';
import { Box, Grid, Section } from '@editora/ui-react';

export default {
  title: 'UI/Section',
  component: Section,
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    variant: { control: 'select', options: ['default', 'surface', 'muted', 'outline', 'elevated', 'gradient', 'contrast'] },
    tone: { control: 'select', options: ['neutral', 'brand', 'success', 'warning', 'danger', 'info'] },
    radius: { control: 'select', options: ['none', 'sm', 'md', 'lg', 'xl'] },
    density: { control: 'select', options: ['compact', 'comfortable'] },
    inset: { control: 'boolean' }
  }
};

export const Playground = (args: any) => (
  <Section
    size={args.size}
    variant={args.variant}
    tone={args.tone}
    radius={args.radius}
    density={args.density}
    inset={args.inset}
  >
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 14, background: '#f8fafc' }}>
      <strong>Section content</strong>
      <Box style={{ marginTop: 8, fontSize: 13, color: '#475569' }}>
        Use this primitive for page bands, grouped layouts, and themed content zones.
      </Box>
    </Box>
  </Section>
);

Playground.args = {
  size: 'medium',
  variant: 'surface',
  tone: 'neutral',
  radius: 'md',
  density: 'comfortable',
  inset: false
};

export const VisualModes = () => (
  <Grid style={{ display: 'grid', gap: 14, maxWidth: 760 }}>
    <Section variant="surface" size="small" radius="sm">
      <Box style={{ padding: 10 }}>Surface small section</Box>
    </Section>

    <Section variant="outline" tone="brand" size="medium" radius="md">
      <Box style={{ padding: 10 }}>Outline + brand accent</Box>
    </Section>

    <Section variant="gradient" tone="info" size="large" radius="lg">
      <Box style={{ padding: 10 }}>Gradient + info tone for highlight blocks</Box>
    </Section>

    <Section variant="contrast" size="medium" radius="lg">
      <Box style={{ padding: 10 }}>Contrast mode for dark regions</Box>
    </Section>
  </Grid>
);
`,Ne=`import React from 'react';
import { Box, Flex, Grid, Select, Separator } from '@editora/ui-react';

export default {
  title: 'UI/Select',
  component: Select,
  argTypes: {
    value: { control: 'text' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    variant: {
      control: 'select',
      options: ['classic', 'surface', 'soft', 'filled', 'outline', 'line', 'minimal', 'ghost', 'solid', 'glass', 'contrast']
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    density: { control: 'select', options: ['default', 'compact', 'comfortable'] },
    shape: { control: 'select', options: ['rounded', 'square', 'pill'] },
    elevation: { control: 'select', options: ['low', 'none', 'high'] },
    tone: { control: 'select', options: ['default', 'brand', 'success', 'warning', 'danger'] },
    validation: { control: 'select', options: ['none', 'success', 'warning', 'error'] }
  }
};

export const EnterpriseWorkflow = (args: any) => {
  const [value, setValue] = React.useState(args.value || 'draft');

  return (
    <Grid style={{ display: 'grid', gap: 14, maxWidth: 420 }}>
      <Select
        {...args}
        label="Workflow status"
        description="Used by approvers and automations."
        value={value}
        onChange={setValue}
        variant={args.variant || 'soft'}
        tone={args.tone || 'brand'}
        shape={args.shape || 'rounded'}
        elevation={args.elevation || 'low'}
        density={args.density || 'default'}
        validation={args.validation && args.validation !== 'none' ? args.validation : undefined}
      >
        <option value="draft">Draft</option>
        <option value="review">In Review</option>
        <option value="published">Published</option>
        <option value="archived">Archived</option>
      </Select>
      <Box style={{ fontSize: 13, color: '#475569' }}>Selected value: {value}</Box>
    </Grid>
  );
};

EnterpriseWorkflow.args = {
  value: 'draft',
  disabled: false,
  loading: false,
  size: 'md',
  density: 'default',
  shape: 'rounded',
  elevation: 'low',
  variant: 'soft',
  tone: 'brand',
  validation: 'none'
};

export const DesignPatterns = () => {
  const [priority, setPriority] = React.useState('high');
  return (
    <Grid style={{ display: 'grid', gap: 16, maxWidth: 980 }}>
      <Flex style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Box style={{ minWidth: 220 }}>
          <Select label="Classic" value={priority} onChange={setPriority} variant="classic">
            <option value="low">Low priority</option>
            <option value="medium">Medium priority</option>
            <option value="high">High priority</option>
            <option value="critical">Critical</option>
          </Select>
        </Box>
        <Box style={{ minWidth: 220 }}>
          <Select label="Outline" value="healthy" variant="outline" tone="success" validation="success">
            <option value="healthy">Healthy</option>
            <option value="degraded">Degraded</option>
            <option value="outage">Outage</option>
          </Select>
        </Box>
        <Box style={{ minWidth: 220 }}>
          <Select label="Line" value="ops" variant="line" tone="warning" description="Dense dashboard pattern">
            <option value="ops">Ops</option>
            <option value="support">Support</option>
            <option value="security">Security</option>
          </Select>
        </Box>
        <Box style={{ minWidth: 220 }}>
          <Select label="Solid" value="team-a" variant="solid" tone="brand" shape="pill">
            <option value="team-a">Team A</option>
            <option value="team-b">Team B</option>
            <option value="team-c">Team C</option>
          </Select>
        </Box>
      </Flex>

      <Separator label="Glass / Contrast / Ghost" variant="gradient" />

      <Flex style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Box style={{ minWidth: 220 }}>
          <Select label="Glass" value="monthly" variant="glass" shape="rounded">
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </Select>
        </Box>
        <Box style={{ minWidth: 220 }}>
          <Select label="Ghost" value="api" variant="ghost" elevation="none">
            <option value="api">API</option>
            <option value="sdk">SDK</option>
            <option value="cli">CLI</option>
          </Select>
        </Box>
        <Box style={{ minWidth: 220 }}>
          <Select label="Contrast" value="p1" variant="contrast" tone="warning">
            <option value="p0">P0</option>
            <option value="p1">P1</option>
            <option value="p2">P2</option>
          </Select>
        </Box>
        <Box style={{ minWidth: 220 }}>
          <Select label="Minimal" value="en" variant="minimal" elevation="none">
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="zh">Chinese</option>
          </Select>
        </Box>
      </Flex>
    </Grid>
  );
};

export const FlatAdminSystem = () => (
  <Grid style={{ display: 'grid', gap: 12, maxWidth: 900 }}>
    <Box
      variant="surface"
      p="12px"
      style={{
        border: '1px solid #cbd5e1',
        borderRadius: 6,
        ['--ui-select-border-color' as any]: '#94a3b8',
        ['--ui-select-bg' as any]: '#ffffff',
        ['--ui-select-accent' as any]: '#0f172a',
        ['--ui-select-elevation' as any]: 'none'
      }}
    >
      <Flex style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Box style={{ minWidth: 220 }}>
          <Select label="Square flat" variant="outline" shape="square" elevation="none" value="ready">
            <option value="ready">Ready</option>
            <option value="blocked">Blocked</option>
            <option value="done">Done</option>
          </Select>
        </Box>
        <Box style={{ minWidth: 220 }}>
          <Select label="Compact" density="compact" variant="line" shape="square" value="7d">
            <option value="24h">24h</option>
            <option value="7d">7d</option>
            <option value="30d">30d</option>
          </Select>
        </Box>
        <Box style={{ minWidth: 220 }}>
          <Select label="Comfortable" density="comfortable" variant="surface" shape="rounded" value="all">
            <option value="all">All projects</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </Select>
        </Box>
      </Flex>
    </Box>
  </Grid>
);

export const EdgeScenarios = () => {
  const [owner, setOwner] = React.useState('');
  return (
    <Grid style={{ display: 'grid', gap: 12, maxWidth: 760 }}>
      <Select
        label="Required with placeholder"
        description="Placeholder remains visible until user picks a value."
        required
        placeholder="Choose owner"
        value={owner}
        validation={owner ? 'success' : 'error'}
        error={owner ? '' : 'Owner is required'}
        onChange={setOwner}
      >
        <option value="ajay">Ajay Kumar</option>
        <option value="sarah">Sarah Lee</option>
        <option value="alex">Alex Chen</option>
      </Select>

      <Select label="Grouped options" value="ap-south">
        <optgroup label="US">
          <option value="us-east">US East</option>
          <option value="us-west">US West</option>
        </optgroup>
        <optgroup label="APAC">
          <option value="ap-south">AP South</option>
          <option value="ap-southeast">AP Southeast</option>
        </optgroup>
      </Select>

      <Flex style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Box style={{ minWidth: 220 }}>
          <Select label="Loading" loading value="sync" description="Shows non-blocking spinner state">
            <option value="sync">Syncing…</option>
            <option value="done">Done</option>
          </Select>
        </Box>
        <Box style={{ minWidth: 220 }}>
          <Select label="Disabled" disabled value="readonly">
            <option value="readonly">Read only</option>
          </Select>
        </Box>
      </Flex>
    </Grid>
  );
};
`,Ve=`import React, { useState } from 'react';
import { SelectionPopup, Button , Box, Grid, Flex} from '@editora/ui-react';

export default {
  title: 'UI/SelectionPopup',
  component: SelectionPopup,
  argTypes: {
    open: { control: 'boolean' },
    anchorId: { control: 'text' },
    placement: { control: 'select', options: ['top', 'bottom', 'left', 'right', 'auto'] },
    variant: { control: 'select', options: ['default', 'surface', 'soft', 'glass', 'contrast'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] }
  }
};

export const Default = (args: any) => {
  const [open, setOpen] = useState(!!args.open);
  const [message, setMessage] = useState('No quick action selected');
  const anchorId = args.anchorId || 'sel-anchor';

  return (
    <Grid style={{ display: 'grid', gap: 14 }}>
      <Flex style={{ display: 'flex', gap: 8 }}>
        <Button size="sm" onClick={() => setOpen(true)}>Show popup</Button>
        <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>Hide popup</Button>
      </Flex>

      <Box id={anchorId} style={{ margin: 42, padding: 18, border: '1px dashed #94a3b8', borderRadius: 12, display: 'inline-block', background: '#f8fafc' }}>
        Highlight this paragraph region to trigger formatting actions.
      </Box>

      <SelectionPopup
        anchorId={anchorId}
        open={open}
        placement={args.placement || 'top'}
        variant={args.variant || 'glass'}
        size={args.size || 'md'}
        arrow
        onClose={() => setOpen(false)}
      >
        <Flex slot="content" style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" onClick={() => setMessage('Bold applied')}>Bold</Button>
          <Button size="sm" variant="secondary" onClick={() => setMessage('Comment added')}>Comment</Button>
          <Button size="sm" variant="ghost" onClick={() => setMessage('Tag created')}>Tag</Button>
        </Flex>
      </SelectionPopup>

      <Box style={{ fontSize: 13, color: '#475569' }}>{message}</Box>
    </Grid>
  );
};
Default.args = { open: true, anchorId: 'sel-anchor', placement: 'top', variant: 'glass', size: 'md' };

export const PlacementMatrix = () => {
  const [openId, setOpenId] = useState('top-anchor');

  const items = [
    { id: 'top-anchor', label: 'Top', placement: 'top' as const },
    { id: 'right-anchor', label: 'Right', placement: 'right' as const },
    { id: 'bottom-anchor', label: 'Bottom', placement: 'bottom' as const },
    { id: 'left-anchor', label: 'Left', placement: 'left' as const }
  ];

  return (
    <Grid style={{ display: 'grid', gap: 16 }}>
      <Flex style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {items.map((item) => (
          <Button key={item.id} size="sm" variant={openId === item.id ? 'primary' : 'secondary'} onClick={() => setOpenId(item.id)}>
            {item.label}
          </Button>
        ))}
      </Flex>
      <Flex style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
        {items.map((item) => (
          <Box
            key={item.id}
            id={item.id}
            style={{
              minWidth: 130,
              padding: 14,
              borderRadius: 10,
              border: '1px solid #cbd5e1',
              background: '#ffffff'
            }}
          >
            Anchor: {item.label}
            <SelectionPopup
              anchorId={item.id}
              open={openId === item.id}
              placement={item.placement}
              arrow
              variant={item.id === 'left-anchor' ? 'contrast' : 'soft'}
              tone={item.id === 'bottom-anchor' ? 'success' : 'brand'}
              closeOnOutside
              onClose={() => setOpenId('')}
            >
              <Box slot="content" style={{ padding: 4, fontSize: 12 }}>
                Popup placement: {item.placement}
              </Box>
            </SelectionPopup>
          </Box>
        ))}
      </Flex>
    </Grid>
  );
};
`,He=`import React from 'react';
import { Separator , Box, Flex} from '@editora/ui-react';

export default {
  title: 'UI/Separator',
  component: Separator
};

export const Horizontal = () => (
  <Box style={{ maxWidth: 560 }}>
    <Box style={{ fontSize: 13, color: '#334155' }}>Pipeline overview</Box>
    <Separator label="Milestone" variant="gradient" tone="brand" />
    <Box style={{ fontSize: 13, color: '#334155' }}>Live environments</Box>
    <Separator variant="dashed" tone="warning" inset="sm" />
    <Box style={{ fontSize: 13, color: '#334155' }}>Archived releases</Box>
  </Box>
);

export const Vertical = () => (
  <Flex style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 36 }}>
    <span>Left</span>
    <Separator orientation="vertical" variant="gradient" tone="brand" size="medium" />
    <span>Center</span>
    <Separator orientation="vertical" variant="glow" tone="success" />
    <span>Right</span>
  </Flex>
);

export const Variants = () => (
  <Flex style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 580 }}>
    <Separator label="Solid" variant="solid" />
    <Separator label="Dashed" variant="dashed" tone="warning" />
    <Separator label="Dotted" variant="dotted" tone="danger" />
    <Separator label="Gradient" variant="gradient" tone="brand" />
    <Separator label="Glow" variant="glow" tone="success" size="medium" />
  </Flex>
);
`,Ue=`import React, { useMemo, useState } from 'react';
import { Badge, Box, Button, CommandPalette, Flex, Grid, Sidebar } from '@editora/ui-react';

export default {
  title: 'UI/Sidebar',
  component: Sidebar,
  argTypes: {
    collapsed: { control: 'boolean' },
    collapsible: { control: 'boolean' },
    rail: { control: 'boolean' },
    position: { control: 'select', options: ['left', 'right'] },
    variant: { control: 'select', options: ['surface', 'soft', 'floating', 'contrast', 'minimal', 'split'] },
    density: { control: 'select', options: ['compact', 'default', 'comfortable'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] }
  }
};

export const InteractiveShell = (args: any) => {
  const [value, setValue] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(!!args.collapsed);

  return (
    <Grid columns="auto 1fr" style={{ minHeight: 440, border: '1px solid var(--ui-color-border, #cbd5e1)', borderRadius: 'calc(var(--ui-radius, 12px) + 4px)', overflow: 'hidden' }}>
      <Sidebar
        value={value}
        collapsed={collapsed}
        collapsible={args.collapsible}
        rail={args.rail}
        position={args.position || 'left'}
        variant={args.variant || 'floating'}
        density={args.density || 'default'}
        size={args.size || 'md'}
        onSelect={(detail) => setValue(detail.value)}
        onToggle={setCollapsed}
      >
        <Flex slot="header" align="center" justify="space-between" style={{ fontWeight: 700 }}>
          <span>Editora Admin</span>
          <Badge tone="info" variant="soft" size="sm">v3</Badge>
        </Flex>

        <Box slot="search" variant="outline" radius="lg" p="8px" style={{ fontSize: 'var(--ui-font-size-sm, 12px)', color: 'var(--ui-color-muted, #64748b)' }}>
          Search apps, teams, reports...
        </Box>

        <Box slot="item" data-section="Workspace" data-value="dashboard" data-icon="🏠" data-description="Overview and KPIs" data-active>
          Dashboard
        </Box>
        <Box slot="item" data-section="Workspace" data-value="analytics" data-icon="📈" data-description="Funnels and retention" data-badge="12">
          Analytics
        </Box>
        <Box slot="item" data-section="Workspace" data-value="customers" data-icon="👥" data-description="Segments and lifecycle">
          Customers
        </Box>
        <Box slot="item" data-section="Operations" data-value="orders" data-icon="📦" data-description="Pending fulfillment" data-badge="8" data-tone="warning">
          Orders
        </Box>
        <Box slot="item" data-section="Operations" data-value="incidents" data-icon="🚨" data-description="Urgent incidents" data-badge="3" data-tone="danger">
          Incidents
        </Box>
        <Box slot="item" data-section="System" data-value="settings" data-icon="⚙️" data-description="Preferences and access">
          Settings
        </Box>

        <Box slot="footer">Signed in as owner@editora.dev</Box>
      </Sidebar>

      <Box variant="surface" p="20px" style={{ background: 'var(--ui-color-surface-alt, #f8fafc)' }}>
        <Box style={{ fontSize: 'var(--ui-font-size-lg, 18px)', fontWeight: 700, marginBottom: 8 }}>Section: {value}</Box>
        <Box style={{ color: 'var(--ui-color-muted, #64748b)', marginBottom: 12 }}>
          Production shell pattern with grouped items, badge states, keyboard navigation, and collapsible rail mode.
        </Box>
        <Flex gap="10px" align="center">
          <Button size="sm" variant="secondary" onClick={() => setCollapsed((current) => !current)}>
            {collapsed ? 'Expand nav' : 'Collapse nav'}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setValue('dashboard')}>Reset selection</Button>
        </Flex>
      </Box>
    </Grid>
  );
};

InteractiveShell.args = {
  collapsed: false,
  collapsible: true,
  rail: false,
  position: 'left',
  variant: 'floating',
  density: 'default',
  size: 'md'
};

export const DataDriven = () => {
  const [value, setValue] = useState('overview');
  const items = useMemo(
    () => [
      { section: 'General', value: 'overview', label: 'Overview', icon: '🧭', description: 'Health summary', active: true },
      { section: 'General', value: 'reports', label: 'Reports', icon: '🧾', description: 'Revenue exports', badge: '4' },
      { section: 'Management', value: 'team', label: 'Team', icon: '🫂', description: 'Roles and invites' },
      { section: 'Management', value: 'security', label: 'Security', icon: '🔐', description: 'Policies', tone: 'danger' as const }
    ],
    []
  );

  return (
    <Grid columns="auto 1fr" style={{ minHeight: 360, border: '1px solid var(--ui-color-border, #cbd5e1)', borderRadius: 'calc(var(--ui-radius, 12px) + 2px)', overflow: 'hidden' }}>
      <Sidebar
        items={items}
        value={value}
        variant="soft"
        tone="brand"
        showBadges
        collapsible
        onSelect={(detail) => setValue(detail.value)}
      >
        <Box slot="header" style={{ fontWeight: 700 }}>Data-driven Navigation</Box>
      </Sidebar>
      <Box p="18px" style={{ background: 'var(--ui-color-surface-alt, #f8fafc)' }}>
        <strong>Active:</strong> {value}
      </Box>
    </Grid>
  );
};

export const VisualModes = () => (
  <Grid columns={{ initial: '1fr', lg: 'repeat(3, minmax(0, 1fr))' } as any} gap="14px">
    <Sidebar variant="surface" value="home" style={{ height: 300 }}>
      <Box slot="header" style={{ fontWeight: 700 }}>Surface</Box>
      <Box slot="item" data-value="home" data-icon="🏠" data-active>Home</Box>
      <Box slot="item" data-value="updates" data-icon="🛰">Updates</Box>
      <Box slot="item" data-value="tasks" data-icon="✅">Tasks</Box>
    </Sidebar>

    <Sidebar variant="soft" tone="success" density="comfortable" value="review" style={{ height: 300 }}>
      <Box slot="header" style={{ fontWeight: 700 }}>Soft Success</Box>
      <Box slot="item" data-value="builds" data-icon="⚙️">Builds</Box>
      <Box slot="item" data-value="review" data-icon="🔍" data-active>Review</Box>
      <Box slot="item" data-value="deploy" data-icon="🚀" data-badge="2">Deploy</Box>
    </Sidebar>

    <Sidebar variant="contrast" value="alerts" style={{ height: 300 }}>
      <Box slot="header" style={{ fontWeight: 700 }}>Contrast</Box>
      <Box slot="item" data-value="alerts" data-icon="🚨" data-tone="danger" data-active>Alerts</Box>
      <Box slot="item" data-value="ops" data-icon="🧠">Ops</Box>
      <Box slot="item" data-value="logs" data-icon="📜">Logs</Box>
      <Box slot="footer">24/7 command center</Box>
    </Sidebar>
  </Grid>
);

export const MegaNavigationAndQuickActions = () => {
  const [value, setValue] = useState('overview');
  const [openPalette, setOpenPalette] = useState(false);

  const commands = [
    'Create patient profile',
    'Schedule consultation',
    'Open billing queue',
    'Jump to admissions',
    'Run attendance sync',
    'Generate monthly report'
  ];

  return (
    <Grid columns="auto 1fr" style={{ minHeight: 520, border: '1px solid var(--ui-color-border, #cbd5e1)', borderRadius: 'calc(var(--ui-radius, 12px) + 4px)', overflow: 'hidden' }}>
      <Sidebar value={value} collapsible variant="floating" density="compact" onSelect={(detail) => setValue(detail.value)}>
        <Box slot="header" style={{ fontWeight: 700 }}>Operations Hub</Box>
        <Box slot="search" variant="outline" radius="lg" p="8px" style={{ fontSize: 'var(--ui-font-size-sm, 12px)', color: 'var(--ui-color-muted, #64748b)' }}>
          Cmd + K for command palette
        </Box>

        <Box slot="item" data-section="Overview" data-value="overview" data-icon="🧭" data-active>Overview</Box>
        <Box slot="item" data-section="Overview" data-value="alerts" data-icon="🚨" data-badge="5" data-tone="danger">Live alerts</Box>
        <Box slot="item" data-section="Clinical" data-value="appointments" data-icon="🩺" data-badge="18">Appointments</Box>
        <Box slot="item" data-section="Clinical" data-value="patients" data-icon="🏥">Patients</Box>
        <Box slot="item" data-section="Academic" data-value="classes" data-icon="🏫">Classes</Box>
        <Box slot="item" data-section="Academic" data-value="attendance" data-icon="🗓" data-badge="9" data-tone="warning">Attendance</Box>
        <Box slot="item" data-section="Finance" data-value="billing" data-icon="💳">Billing</Box>
        <Box slot="item" data-section="Finance" data-value="reports" data-icon="📊">Reports</Box>
      </Sidebar>

      <Box p="18px" style={{ background: 'var(--ui-color-surface-alt, #f8fafc)', display: 'grid', gap: 12, alignContent: 'start' }}>
        <Flex style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Box style={{ fontSize: 20, fontWeight: 700 }}>Module: {value}</Box>
          <Flex style={{ display: 'flex', gap: 8 }}>
            <Button size="sm" onClick={() => setOpenPalette(true)}>Open command palette</Button>
            <Button size="sm" variant="secondary">Create ticket</Button>
            <Button size="sm" variant="ghost">Quick export</Button>
          </Flex>
        </Flex>
        <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 'var(--ui-font-size-md, 14px)' }}>
          Dense navigation pattern with grouped modules, fast actions, and command-palette jump workflow for admin-heavy apps.
        </Box>
      </Box>

      <CommandPalette open={openPalette} onSelect={() => setOpenPalette(false)}>
        {commands.map((command) => (
          <Box key={command} slot="command">{command}</Box>
        ))}
      </CommandPalette>
    </Grid>
  );
};
`,qe=`import React from 'react';
import { Box, Flex, Grid, Skeleton } from '@editora/ui-react';

export default {
  title: 'UI/Skeleton',
  component: Skeleton,
  argTypes: {
    count: { control: { type: 'number', min: 1, max: 20, step: 1 } },
    variant: { control: 'select', options: ['rect', 'text', 'circle', 'pill', 'avatar', 'badge', 'button'] },
    animation: { control: 'select', options: ['none', 'shimmer', 'pulse', 'wave'] },
    density: { control: 'select', options: ['default', 'compact', 'comfortable'] },
    tone: { control: 'select', options: ['default', 'brand', 'success', 'warning', 'danger'] },
    animated: { control: 'boolean' },
    duration: { control: 'text' }
  }
};

export const Playground = (args: any) => (
  <Box style={{ maxWidth: 480 }}>
    <Skeleton
      count={args.count}
      variant={args.variant}
      animation={args.animation}
      density={args.density}
      tone={args.tone}
      animated={args.animated}
      duration={args.duration}
      height={args.variant === 'circle' || args.variant === 'avatar' ? '44px' : undefined}
      width={args.variant === 'circle' || args.variant === 'avatar' ? '44px' : undefined}
    />
  </Box>
);

Playground.args = {
  count: 4,
  variant: 'text',
  animation: 'shimmer',
  density: 'default',
  tone: 'default',
  animated: true,
  duration: '1.2s'
};

export const VariantGallery = () => (
  <Grid style={{ display: 'grid', gap: 16, maxWidth: 980 }}>
    <Flex style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
      <Box style={{ minWidth: 200 }}>
        <div style={{ fontSize: 12, marginBottom: 6, color: '#64748b' }}>Text</div>
        <Skeleton variant="text" count={3} animation="shimmer" />
      </Box>
      <Box>
        <div style={{ fontSize: 12, marginBottom: 6, color: '#64748b' }}>Circle</div>
        <Skeleton variant="circle" animation="wave" height="40px" width="40px" />
      </Box>
      <Box>
        <div style={{ fontSize: 12, marginBottom: 6, color: '#64748b' }}>Avatar</div>
        <Skeleton variant="avatar" animation="pulse" />
      </Box>
      <Box>
        <div style={{ fontSize: 12, marginBottom: 6, color: '#64748b' }}>Badge</div>
        <Skeleton variant="badge" animation="shimmer" />
      </Box>
      <Box>
        <div style={{ fontSize: 12, marginBottom: 6, color: '#64748b' }}>Button</div>
        <Skeleton variant="button" animation="wave" />
      </Box>
      <Box style={{ minWidth: 180 }}>
        <div style={{ fontSize: 12, marginBottom: 6, color: '#64748b' }}>Pill</div>
        <Skeleton variant="pill" count={2} animation="pulse" />
      </Box>
    </Flex>
  </Grid>
);

export const EnterpriseCardLoading = () => (
  <Box
    style={{
      border: '1px solid #e2e8f0',
      borderRadius: 14,
      padding: 16,
      maxWidth: 380,
      background: '#ffffff',
      display: 'grid',
      gap: 14
    }}
  >
    <Skeleton variant="rect" height="168px" radius="12px" animation="wave" />
    <Skeleton variant="text" count={2} animation="shimmer" />
    <Flex style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Skeleton variant="badge" animation="pulse" />
      <Skeleton variant="button" animation="shimmer" width="96px" />
    </Flex>
  </Box>
);

export const DataTableRows = () => (
  <Box
    style={{
      border: '1px solid #cbd5e1',
      borderRadius: 10,
      padding: 12,
      maxWidth: 980,
      display: 'grid',
      gap: 8
    }}
  >
    {Array.from({ length: 6 }).map((_, rowIndex) => (
      <Flex key={rowIndex} style={{ display: 'grid', gridTemplateColumns: '220px 140px 160px 1fr 120px', gap: 10, alignItems: 'center' }}>
        <Flex style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Skeleton variant="avatar" width="28px" height="28px" animation="none" />
          <Skeleton variant="text" count={1} width="140px" animation="pulse" />
        </Flex>
        <Skeleton variant="pill" count={1} width="110px" animation="none" />
        <Skeleton variant="text" count={1} width="130px" animation="shimmer" />
        <Skeleton variant="text" count={1} width="100%" animation="wave" />
        <Skeleton variant="button" count={1} width="92px" height="30px" animation="none" />
      </Flex>
    ))}
  </Box>
);

export const ProfilePanel = () => (
  <Box
    style={{
      border: '1px solid #e2e8f0',
      borderRadius: 16,
      padding: 18,
      maxWidth: 520,
      display: 'grid',
      gap: 16
    }}
  >
    <Flex style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
      <Skeleton variant="avatar" width="58px" height="58px" tone="brand" animation="wave" />
      <Box style={{ flex: 1 }}>
        <Skeleton variant="text" count={2} tone="brand" animation="shimmer" />
      </Box>
    </Flex>
    <Skeleton variant="rect" height="96px" radius="12px" tone="brand" animation="pulse" />
    <Flex style={{ display: 'flex', gap: 10 }}>
      <Skeleton variant="button" tone="brand" animation="wave" />
      <Skeleton variant="button" tone="default" animation="none" />
    </Flex>
  </Box>
);

export const AnimationAndToneMatrix = () => (
  <Grid style={{ display: 'grid', gap: 12, maxWidth: 920 }}>
    {(['shimmer', 'pulse', 'wave', 'none'] as const).map((animation) => (
      <Flex key={animation} style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <Box style={{ width: 80, fontSize: 12, color: '#64748b', textTransform: 'capitalize' }}>{animation}</Box>
        <Skeleton variant="text" count={1} width="140px" animation={animation} tone="default" />
        <Skeleton variant="text" count={1} width="140px" animation={animation} tone="brand" />
        <Skeleton variant="text" count={1} width="140px" animation={animation} tone="success" />
        <Skeleton variant="text" count={1} width="140px" animation={animation} tone="warning" />
        <Skeleton variant="text" count={1} width="140px" animation={animation} tone="danger" />
      </Flex>
    ))}
  </Grid>
);
`,$e=`import React from 'react';
import { Box, Grid, Slider } from '@editora/ui-react';

export default {
  title: 'UI/Slider',
  component: Slider,
  argTypes: {
    value: { control: { type: 'number', min: 0, max: 100, step: 1 } },
    min: { control: { type: 'number', min: 0, max: 100, step: 1 } },
    max: { control: { type: 'number', min: 1, max: 200, step: 1 } },
    step: { control: { type: 'number', min: 0.1, max: 25, step: 0.1 } },
    range: { control: 'boolean' },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    variant: { control: 'select', options: ['default', 'soft', 'glass', 'contrast', 'minimal'] },
    tone: { control: 'select', options: ['brand', 'success', 'warning', 'danger'] }
  }
};

export const Controlled = (args: any) => {
  const [value, setValue] = React.useState(Number(args.value) || 36);
  const min = Number(args.min ?? 0);
  const max = Number(args.max ?? 100);

  React.useEffect(() => {
    setValue((current) => Math.max(min, Math.min(max, current)));
  }, [min, max]);

  return (
    <Grid gap="12px" style={{ maxWidth: 420 }}>
      <Slider
        {...args}
        value={value}
        min={min}
        max={max}
        showValue
        label="Saturation"
        description="Applies to selected data visualization surfaces."
        marks={[0, 25, 50, 75, 100]}
        onInput={setValue}
      />
      <Box style={{ fontSize: 13, color: '#475569' }}>
        Value: {value}
      </Box>
    </Grid>
  );
};

Controlled.args = {
  value: 36,
  min: 0,
  max: 100,
  step: 1,
  range: false,
  orientation: 'horizontal',
  variant: 'glass',
  tone: 'brand'
};

export const RangeSelection = () => {
  const [windowStart, setWindowStart] = React.useState(20);
  const [windowEnd, setWindowEnd] = React.useState(68);

  return (
    <Grid gap="12px" style={{ maxWidth: 460 }}>
      <Slider
        range
        min={0}
        max={100}
        step={1}
        valueStart={windowStart}
        valueEnd={windowEnd}
        label="Allowed request window"
        description="Select the acceptable request-rate range."
        format="range"
        variant="soft"
        tone="success"
        marks={[
          { value: 0, label: '0' },
          { value: 25, label: '25' },
          { value: 50, label: '50' },
          { value: 75, label: '75' },
          { value: 100, label: '100' }
        ]}
        onValueChange={(detail) => {
          setWindowStart(detail.valueStart);
          setWindowEnd(detail.valueEnd);
        }}
      />
      <Box style={{ fontSize: 13, color: '#475569' }}>
        Current range: {windowStart} - {windowEnd}
      </Box>
    </Grid>
  );
};

export const VerticalAndContrast = () => (
  <Grid columns="repeat(2, minmax(0, 1fr))" gap="14px" style={{ maxWidth: 520 }}>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 14, display: 'grid', justifyItems: 'center' }}>
      <Slider
        orientation="vertical"
        value={58}
        min={0}
        max={100}
        format="percent"
        label="Volume"
        variant="default"
        marks={[0, 50, 100]}
      />
    </Box>

    <Box style={{ border: '1px solid #1e293b', borderRadius: 12, padding: 14, background: '#020617', display: 'grid', gap: 10 }}>
      <Slider
        value={72}
        min={0}
        max={100}
        format="percent"
        label="Latency threshold"
        description="Command center mode"
        variant="contrast"
        tone="warning"
        marks={[0, 25, 50, 75, 100]}
      />
    </Box>
  </Grid>
);

export const Disabled = () => (
  <Slider value={40} min={0} max={100} disabled label="Read-only metric" description="Disabled interaction state" />
);

export const AnimatedIndicators = () => (
  <Grid gap="14px" style={{ maxWidth: 500 }}>
    <Slider
      value={42}
      min={0}
      max={100}
      label="Interactive signal threshold"
      description="Animated indicator follows active thumb."
      variant="glass"
      tone="brand"
      marks={[0, 25, 50, 75, 100]}
    />
    <Slider
      range
      valueStart={28}
      valueEnd={76}
      min={0}
      max={100}
      format="range"
      label="Range indicator"
      description="Start and end indicators animate while active."
      variant="soft"
      tone="success"
    />
  </Grid>
);
`,je=`import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Flex, Grid, Slot } from '@editora/ui-react';

export default {
  title: 'UI/Slot',
  component: Slot
};

export const NamedSlot = () => {
  const ref = useRef<HTMLElement | null>(null);
  const [changes, setChanges] = useState(0);
  const [showBadge, setShowBadge] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onSlotChange = () => setChanges((value) => value + 1);
    el.addEventListener('slotchange', onSlotChange as EventListener);
    return () => el.removeEventListener('slotchange', onSlotChange as EventListener);
  }, []);

  return (
    <Grid gap="12px" style={{ maxWidth: 520 }}>
      <Button size="sm" variant="secondary" onClick={() => setShowBadge((value) => !value)}>
        Toggle slotted content
      </Button>

      <Flex align="center" gap="8px">
        <span>Document title</span>
        <Slot ref={ref as any} name="badge" variant="chip" tone="brand" fallback="No badge">
          {showBadge ? (
            <span slot="badge" style={{ padding: '2px 8px', borderRadius: 999, background: '#dbeafe', fontSize: 12 }}>
              Beta
            </span>
          ) : null}
        </Slot>
      </Flex>

      <Box style={{ fontSize: 13, color: '#475569' }}>slotchange fired: {changes}</Box>
    </Grid>
  );
};

export const VisualModes = () => (
  <Grid columns={{ initial: '1fr', md: 'repeat(2, minmax(0, 1fr))' } as any} gap="12px" style={{ maxWidth: 680 }}>
    <Slot variant="surface" fallback="No assignee">
      <span style={{ fontSize: 12 }}>Assignee: Ava</span>
    </Slot>

    <Slot variant="outline" tone="warning" fallback="No due date">
      <span style={{ fontSize: 12 }}>Due: Tomorrow</span>
    </Slot>

    <Slot variant="soft" tone="success" fallback="No status">
      <span style={{ fontSize: 12 }}>Status: Healthy</span>
    </Slot>

    <Slot variant="contrast" fallback="No environment">
      <span style={{ fontSize: 12 }}>Environment: Production</span>
    </Slot>
  </Grid>
);

export const RequiredState = () => {
  const [resolved, setResolved] = useState(false);
  const [value, setValue] = useState(false);

  return (
    <Grid gap="12px" style={{ maxWidth: 480 }}>
      <Button size="sm" onClick={() => setValue((current) => !current)}>
        {value ? 'Remove content' : 'Resolve content'}
      </Button>

      <Slot
        required
        name="status"
        fallback="Missing required slot"
        variant="outline"
        tone="danger"
        onMissing={() => setResolved(false)}
        onResolved={() => setResolved(true)}
      >
        {value ? <span slot="status">Ready</span> : null}
      </Slot>

      <Box style={{ fontSize: 13, color: '#475569' }}>
        Required slot resolved: {resolved ? 'yes' : 'no'}
      </Box>
    </Grid>
  );
};
`,Qe=`import React from 'react';
import { Box, Stepper } from '@editora/ui-react';

export default {
  title: 'UI/Stepper',
  component: Stepper,
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    variant: { control: 'select', options: ['default', 'contrast', 'minimal'] },
    linear: { control: 'boolean' },
    clickable: { control: 'boolean' }
  }
};

const onboardingSteps = [
  { value: 'org', label: 'Organization', description: 'Basic profile details' },
  { value: 'modules', label: 'Modules', description: 'Enable hospital/school modules' },
  { value: 'policies', label: 'Policies', description: 'Security and retention rules' },
  { value: 'review', label: 'Review', description: 'Validate all config' }
];

export const Controlled = (args: any) => {
  const [value, setValue] = React.useState('org');

  return (
    <Box style={{ maxWidth: 920, display: 'grid', gap: 10 }}>
      <Stepper
        steps={onboardingSteps}
        value={value}
        orientation={args.orientation || 'horizontal'}
        variant={args.variant || 'default'}
        linear={args.linear}
        clickable={args.clickable}
        onChange={(detail) => setValue(detail.value)}
      />
      <Box style={{ fontSize: 'var(--ui-font-size-md, 14px)', color: 'var(--ui-color-muted, #64748b)' }}>Active step: <strong>{value}</strong></Box>
    </Box>
  );
};

Controlled.args = {
  orientation: 'horizontal',
  variant: 'default',
  linear: false,
  clickable: true
};

export const ContrastVertical = () => (
  <Box variant="contrast" p="12px" radius="lg" style={{ maxWidth: 320 }}>
    <Stepper
      variant="contrast"
      orientation="vertical"
      linear
      clickable
      steps={[
        { value: '1', label: 'Collect data', description: 'Fetch records', state: 'complete' },
        { value: '2', label: 'Normalize', description: 'Map tenant schema' },
        { value: '3', label: 'Validate', description: 'Audit and policy checks' },
        { value: '4', label: 'Publish', description: 'Push to dashboard' }
      ]}
      value="2"
    />
  </Box>
);

export const AnimatedCurrentStep = () => (
  <Box style={{ maxWidth: 920, display: 'grid', gap: 10 }}>
    <Stepper
      clickable
      value="policies"
      steps={[
        { value: 'org', label: 'Organization', description: 'Tenant profile', state: 'complete' },
        { value: 'modules', label: 'Modules', description: 'Enable packages', state: 'complete' },
        { value: 'policies', label: 'Policies', description: 'Current review step' },
        { value: 'review', label: 'Review', description: 'Final confirmation' }
      ]}
    />
    <Box style={{ fontSize: 'var(--ui-font-size-md, 14px)', color: 'var(--ui-color-muted, #64748b)' }}>
      Current step shows animated indicator and connector flow.
    </Box>
  </Box>
);
`,Je=`import React from 'react';
import { Box, Flex, Grid, Switch } from '@editora/ui-react';

export default {
  title: 'UI/Switch',
  component: Switch,
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['default', 'soft', 'outline', 'contrast', 'minimal'] },
    tone: { control: 'select', options: ['brand', 'success', 'warning', 'danger'] },
    shape: { control: 'select', options: ['pill', 'rounded', 'square'] },
    elevation: { control: 'select', options: ['low', 'none', 'high'] }
  }
};

export const Controlled = (args: any) => {
  const [checked, setChecked] = React.useState(Boolean(args.checked));

  return (
    <Grid gap="12px" style={{ maxWidth: 520 }}>
      <Switch
        checked={checked}
        disabled={args.disabled}
        loading={args.loading}
        size={args.size || 'md'}
        variant={args.variant || 'default'}
        tone={args.tone || 'brand'}
        shape={args.shape || 'pill'}
        elevation={args.elevation || 'low'}
        onChange={(detail) => setChecked(detail.checked)}
      >
        Enable workspace automations
        <span slot="description">Run triggers when publishing or archiving content.</span>
      </Switch>

      <Box variant="surface" p="10px" style={{ fontSize: 13, color: '#475569' }}>
        Current state: <strong>{checked ? 'on' : 'off'}</strong>
      </Box>
    </Grid>
  );
};

Controlled.args = {
  checked: true,
  disabled: false,
  loading: false,
  size: 'md',
  variant: 'default',
  tone: 'brand',
  shape: 'pill',
  elevation: 'low'
};

export const VisualModes = () => (
  <Grid gap="12px" style={{ maxWidth: 760 }}>
    <Flex gap="12px" wrap="wrap">
      <Switch checked variant="default">Default</Switch>
      <Switch checked variant="soft">Soft</Switch>
      <Switch checked variant="outline">Outline</Switch>
      <Switch checked variant="minimal">Minimal</Switch>
    </Flex>

    <Box variant="contrast" p="12px" radius="lg">
      <Switch checked variant="contrast" tone="warning">
        Contrast mode
        <span slot="description">Improved visibility for command center layouts.</span>
      </Switch>
    </Box>

    <Flex gap="12px" wrap="wrap">
      <Switch checked tone="success">Healthy sync</Switch>
      <Switch checked tone="warning">Pending approvals</Switch>
      <Switch checked tone="danger">Destructive action</Switch>
      <Switch loading checked>Syncing</Switch>
      <Switch disabled checked>Disabled</Switch>
    </Flex>
  </Grid>
);

export const FlatEnterpriseShapes = () => (
  <Grid gap="12px" style={{ maxWidth: 760 }}>
    <Box
      variant="surface"
      p="12px"
      style={{
        border: '1px solid #cbd5e1',
        borderRadius: 6,
        ['--ui-switch-radius' as any]: '4px',
        ['--ui-switch-track-bg' as any]: '#ffffff',
        ['--ui-switch-track-border' as any]: '#94a3b8',
        ['--ui-switch-thumb-bg' as any]: '#0f172a',
        ['--ui-switch-thumb-color' as any]: '#ffffff',
        ['--ui-switch-accent' as any]: '#0f172a',
        ['--ui-switch-accent-hover' as any]: '#1e293b'
      }}
    >
      <Grid gap="10px">
        <Switch checked shape="square" elevation="none" variant="outline">
          Flat square
          <span slot="description">No shadow, crisp border for dense dashboards.</span>
        </Switch>
        <Switch shape="rounded" elevation="none" variant="outline">Flat rounded</Switch>
      </Grid>
    </Box>

    <Flex gap="12px" wrap="wrap">
      <Switch checked size="sm" shape="square" elevation="none">Small</Switch>
      <Switch checked size="md" shape="rounded" elevation="low">Medium</Switch>
      <Switch checked size="lg" shape="pill" elevation="high">Large</Switch>
    </Flex>
  </Grid>
);

export const KeyboardAndEdgeCases = () => (
  <Grid gap="12px" style={{ maxWidth: 760 }}>
    <Box variant="surface" p="12px" style={{ border: '1px solid #e2e8f0', borderRadius: 10 }}>
      <Grid gap="10px">
        <Switch checked name="alerts" value="email-alerts" required>
          Press Arrow Left/Right, Home, End
          <span slot="description">Label click also toggles. Inner links are non-toggling interactive targets.</span>
        </Switch>
        <Switch>
          Incident digest
          <a slot="description" href="#" data-ui-switch-no-toggle onClick={(e) => e.preventDefault()}>
            Open policy (does not toggle)
          </a>
        </Switch>
      </Grid>
    </Box>
  </Grid>
);
`,Ze=`import React from 'react';
import { Table , Box, Grid} from '@editora/ui-react';

export default {
  title: 'UI/Table',
  component: Table,
  argTypes: {
    sortable: { control: 'boolean' },
    selectable: { control: 'boolean' },
    multiSelect: { control: 'boolean' },
    striped: { control: 'boolean' },
    hover: { control: 'boolean' },
    compact: { control: 'boolean' },
    bordered: { control: 'boolean' },
    stickyHeader: { control: 'boolean' },
    loading: { control: 'boolean' }
  }
};

const teamRows = [
  { name: 'Ava Johnson', role: 'Designer', status: 'Active', tasks: 12, updated: '2026-02-15' },
  { name: 'Liam Carter', role: 'Engineer', status: 'Review', tasks: 7, updated: '2026-02-18' },
  { name: 'Mia Chen', role: 'Product', status: 'Active', tasks: 5, updated: '2026-02-17' },
  { name: 'Noah Patel', role: 'Ops', status: 'Blocked', tasks: 2, updated: '2026-02-12' },
  { name: 'Emma Garcia', role: 'QA', status: 'Active', tasks: 14, updated: '2026-02-19' }
];

function TeamMarkup() {
  return (
    <table>
      <thead>
        <tr>
          <th data-key="name">Name</th>
          <th data-key="role">Role</th>
          <th data-key="status">Status</th>
          <th data-key="tasks">Open Tasks</th>
          <th data-key="updated">Last Updated</th>
        </tr>
      </thead>
      <tbody>
        {teamRows.map((row) => (
          <tr key={row.name}>
            <td>{row.name}</td>
            <td>{row.role}</td>
            <td>{row.status}</td>
            <td>{row.tasks}</td>
            <td>{row.updated}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const Template = (args: any) => (
  <Box style={{ maxWidth: 900 }}>
    <Table {...args}>
      <TeamMarkup />
    </Table>
  </Box>
);

export const Default = Template.bind({});
Default.args = {
  striped: true,
  hover: true
};

export const Sortable = () => {
  const [sort, setSort] = React.useState('none');
  return (
    <Grid style={{ display: 'grid', gap: 10, maxWidth: 900 }}>
      <Table sortable striped onSortChange={(detail) => setSort(\`\${detail.key} (\${detail.direction})\`)}>
        <TeamMarkup />
      </Table>
      <Box style={{ fontSize: 13, color: '#475569' }}>Current sort: {sort}</Box>
    </Grid>
  );
};

export const SelectableRows = () => {
  const [selection, setSelection] = React.useState<number[]>([]);
  return (
    <Grid style={{ display: 'grid', gap: 10, maxWidth: 900 }}>
      <Table selectable multiSelect striped hover onRowSelect={(detail) => setSelection(detail.indices)}>
        <TeamMarkup />
      </Table>
      <Box style={{ fontSize: 13, color: '#475569' }}>
        Selected row indices: {selection.length ? selection.join(', ') : 'none'}
      </Box>
    </Grid>
  );
};

export const CompactBordered = Template.bind({});
CompactBordered.args = {
  compact: true,
  bordered: true
};

export const LoadingState = Template.bind({});
LoadingState.args = {
  loading: true,
  striped: true
};
`,Ke=`import React from 'react';
import { Box, Flex, Grid, Tabs } from '@editora/ui-react';

export default {
  title: 'UI/Tabs',
  component: Tabs,
  argTypes: {
    selected: { control: { type: 'number', min: 0, max: 5, step: 1 } },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    activation: { control: 'select', options: ['auto', 'manual'] },
    variant: {
      control: 'select',
      options: [
        'default',
        'soft',
        'outline',
        'solid',
        'ghost',
        'glass',
        'indicator',
        'indicator-line',
        'underline',
        'line',
        'segmented',
        'cards',
        'contrast',
        'minimal'
      ]
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    density: { control: 'select', options: ['default', 'compact', 'comfortable'] },
    tone: { control: 'select', options: ['brand', 'success', 'warning', 'danger'] },
    shape: { control: 'select', options: ['rounded', 'square', 'pill'] },
    elevation: { control: 'select', options: ['low', 'none', 'high'] },
    loop: { control: 'boolean' },
    stretched: { control: 'boolean' },
    bare: { control: 'boolean' }
  }
};

export const EnterpriseWorkspace = (args: any) => {
  const [selected, setSelected] = React.useState(Number(args.selected ?? 0));

  return (
    <Grid gap="12px" style={{ maxWidth: 860 }}>
      <Tabs
        selected={selected}
        orientation={args.orientation || 'horizontal'}
        activation={args.activation || 'auto'}
        variant={args.variant || 'soft'}
        size={args.size || 'md'}
        density={args.density || 'default'}
        tone={args.tone || 'brand'}
        shape={args.shape || 'rounded'}
        elevation={args.elevation || 'low'}
        stretched={Boolean(args.stretched)}
        bare={Boolean(args.bare)}
        loop={args.loop ?? true}
        onChange={setSelected}
      >
        <div slot="tab" data-value="overview" data-icon="📊">Overview</div>
        <div slot="panel">Workspace KPIs, revenue velocity, and trend deltas for this week.</div>

        <div slot="tab" data-value="activity" data-icon="🕒">Activity</div>
        <div slot="panel">Approvals, assignments, and SLA response timeline across teams.</div>

        <div slot="tab" data-value="permissions" data-icon="🔐">Permissions</div>
        <div slot="panel">Role-based access mapping with tenant-level override rules.</div>

        <div slot="tab" data-value="webhooks" data-icon="⚡">Webhooks</div>
        <div slot="panel">Delivery retries, endpoint errors, and queue throughput analytics.</div>
      </Tabs>

      <Box style={{ fontSize: 13, color: '#475569' }}>
        Selected tab index: <strong>{selected}</strong>
      </Box>
    </Grid>
  );
};

EnterpriseWorkspace.args = {
  selected: 0,
  orientation: 'horizontal',
  activation: 'auto',
  variant: 'soft',
  size: 'md',
  density: 'default',
  tone: 'brand',
  shape: 'rounded',
  elevation: 'low',
  loop: true,
  stretched: false,
  bare: false
};

export const DesignPatterns = () => (
  <Grid gap="14px" style={{ maxWidth: 980 }}>
    <Tabs variant="segmented" selected={0}>
      <div slot="tab" data-value="board">Board</div>
      <div slot="panel">Segmented pattern: compact for switch-like workflows.</div>
      <div slot="tab" data-value="list">List</div>
      <div slot="panel">Best for light mode admin dashboards with dense controls.</div>
      <div slot="tab" data-value="timeline">Timeline</div>
      <div slot="panel">Provides clear mode switching with high scanability.</div>
    </Tabs>

    <Tabs variant="line" selected={1}>
      <div slot="tab" data-value="critical">Critical</div>
      <div slot="panel">Line pattern: minimal visual noise for data-heavy layouts.</div>
      <div slot="tab" data-value="standard">Standard</div>
      <div slot="panel">Keeps the active state clear while preserving table focus.</div>
      <div slot="tab" data-value="longtail">Long-tail</div>
      <div slot="panel">Great for settings surfaces with many small sections.</div>
    </Tabs>

    <Tabs variant="cards" shape="square" selected={0}>
      <div slot="tab" data-value="pending" data-icon="🩺">Pending</div>
      <div slot="panel">Cards pattern: stronger surface separation for enterprise portals.</div>
      <div slot="tab" data-value="approved" data-icon="✅">Approved</div>
      <div slot="panel">Works well in operations dashboards and compliance screens.</div>
      <div slot="tab" data-value="archived" data-icon="📦">Archived</div>
      <div slot="panel">Square corners support flat UI systems without custom CSS forks.</div>
    </Tabs>

    <Box variant="contrast" p="14px" radius="lg">
      <Tabs variant="contrast" tone="warning" size="lg" stretched selected={2}>
        <div slot="tab" data-value="alerts">Alerts</div>
        <div slot="panel">Contrast pattern for command-center and dark operational themes.</div>
        <div slot="tab" data-value="runtime">Runtime</div>
        <div slot="panel">Large hit targets improve usability in high-pressure contexts.</div>
        <div slot="tab" data-value="logs">Logs</div>
        <div slot="panel">Color contrast and focus ring remain WCAG-friendly.</div>
      </Tabs>
    </Box>
  </Grid>
);

export const AdditionalVariants = () => (
  <Grid gap="14px" style={{ maxWidth: 980 }}>
    <Tabs variant="outline" selected={0}>
      <div slot="tab" data-value="summary">Summary</div>
      <div slot="panel">Outline style for admin dashboards that prefer clear strokes over fills.</div>
      <div slot="tab" data-value="queues">Queues</div>
      <div slot="panel">Strong contrast in low-noise layouts.</div>
      <div slot="tab" data-value="history">History</div>
      <div slot="panel">Easy to theme with token overrides.</div>
    </Tabs>

    <Tabs variant="solid" tone="success" selected={1}>
      <div slot="tab" data-value="healthy">Healthy</div>
      <div slot="panel">Solid style acts like mode chips for operational UIs.</div>
      <div slot="tab" data-value="monitoring">Monitoring</div>
      <div slot="panel">Selected tab remains highly visible.</div>
      <div slot="tab" data-value="alerts">Alerts</div>
      <div slot="panel">Works with success/warning/danger tones.</div>
    </Tabs>

    <Tabs variant="ghost" selected={0}>
      <div slot="tab" data-value="week">Week</div>
      <div slot="panel">Ghost style removes container chrome for embedded views.</div>
      <div slot="tab" data-value="month">Month</div>
      <div slot="panel">Good with tables/charts where tab chrome should be minimal.</div>
      <div slot="tab" data-value="quarter">Quarter</div>
      <div slot="panel">Still keyboard/focus accessible.</div>
    </Tabs>

    <Tabs variant="glass" selected={2}>
      <div slot="tab" data-value="north">North</div>
      <div slot="panel">Glass style for modern high-end SaaS shells.</div>
      <div slot="tab" data-value="south">South</div>
      <div slot="panel">Uses transparent surfaces and backdrop blur.</div>
      <div slot="tab" data-value="global">Global</div>
      <div slot="panel">Useful when page backgrounds are textured.</div>
    </Tabs>
  </Grid>
);

export const AnimatedIndicators = () => (
  <Grid gap="14px" style={{ maxWidth: 980 }}>
    <Tabs variant="indicator" selected={1}>
      <div slot="tab" data-value="triage">Triage</div>
      <div slot="panel">Moving pill indicator for modern SaaS top navigation.</div>
      <div slot="tab" data-value="review">Review</div>
      <div slot="panel">Selection motion follows click and keyboard transitions.</div>
      <div slot="tab" data-value="approved">Approved</div>
      <div slot="panel">Tab labels stay readable while indicator animates beneath.</div>
      <div slot="tab" data-value="done">Done</div>
      <div slot="panel">Works with overflow and reduced motion settings.</div>
    </Tabs>

    <Tabs variant="indicator-line" selected={0}>
      <div slot="tab" data-value="overview">Overview</div>
      <div slot="panel">Animated underline indicator for low-noise enterprise surfaces.</div>
      <div slot="tab" data-value="ops">Ops</div>
      <div slot="panel">The line tracks active tab width and position.</div>
      <div slot="tab" data-value="audit">Audit</div>
      <div slot="panel">Strong visual hierarchy for data-dense workflows.</div>
      <div slot="tab" data-value="logs">Logs</div>
      <div slot="panel">Keyboard navigation updates the line instantly.</div>
    </Tabs>

    <Tabs variant="indicator-line" orientation="vertical" activation="manual" loop={false} selected={2}>
      <div slot="tab" data-value="profile">Profile</div>
      <div slot="panel">Vertical mode uses a side indicator rail.</div>
      <div slot="tab" data-value="billing">Billing</div>
      <div slot="panel">Manual activation remains supported.</div>
      <div slot="tab" data-value="security">Security</div>
      <div slot="panel">Line indicator adapts to vertical dimensions.</div>
      <div slot="tab" data-value="notifications">Notifications</div>
      <div slot="panel">Loop disabled prevents wrap-around navigation.</div>
    </Tabs>
  </Grid>
);

export const VerticalEdgeScenarios = () => (
  <Box style={{ maxWidth: 980 }}>
    <Tabs orientation="vertical" activation="manual" variant="underline" loop={false} selected={1}>
      <div slot="tab" data-value="profile">Profile</div>
      <div slot="panel">Manual activation: arrow keys move focus; Enter/Space commits selection.</div>

      <div slot="tab" data-value="billing">Billing</div>
      <div slot="panel">Loop disabled: navigation stops at first/last enabled tab.</div>

      <div slot="tab" data-value="security" data-disabled="true">Security (Disabled)</div>
      <div slot="panel">Disabled tabs are skipped in keyboard traversal and cannot be selected.</div>

      <div slot="tab" data-value="notifications">Notifications</div>
      <div slot="panel">Vertical overflow remains scrollable for large tab sets.</div>
    </Tabs>
  </Box>
);

export const FlatBareEnterprise = () => (
  <Grid gap="12px" style={{ maxWidth: 920 }}>
    <Box
      variant="surface"
      p="12px"
      style={{
        border: '1px solid #cbd5e1',
        borderRadius: 6,
        ['--ui-tabs-border' as any]: '#94a3b8',
        ['--ui-tabs-accent' as any]: '#0f172a',
        ['--ui-tabs-nav-bg' as any]: '#ffffff',
        ['--ui-tabs-panel-bg' as any]: '#ffffff'
      }}
    >
      <Tabs variant="minimal" shape="square" elevation="none" bare selected={0}>
        <div slot="tab" data-value="summary">Summary</div>
        <div slot="panel">Flat tabs: no default shadow, sharp edges, token-based control retained.</div>

        <div slot="tab" data-value="financials">Financials</div>
        <div slot="panel">Useful for teams that enforce strict flat design language.</div>

        <div slot="tab" data-value="notes">Notes</div>
        <div slot="panel">Still supports tone/size variants without visual debt.</div>
      </Tabs>
    </Box>

    <Flex gap="10px" wrap="wrap">
      <Tabs variant="default" size="sm" shape="square" elevation="none" selected={0}>
        <div slot="tab" data-value="a">A</div>
        <div slot="panel">Small</div>
        <div slot="tab" data-value="b">B</div>
        <div slot="panel">Small</div>
      </Tabs>

      <Tabs variant="default" size="md" shape="rounded" elevation="low" selected={0}>
        <div slot="tab" data-value="a">A</div>
        <div slot="panel">Medium</div>
        <div slot="tab" data-value="b">B</div>
        <div slot="panel">Medium</div>
      </Tabs>

      <Tabs variant="default" size="lg" shape="pill" elevation="high" selected={0}>
        <div slot="tab" data-value="a">A</div>
        <div slot="panel">Large</div>
        <div slot="tab" data-value="b">B</div>
        <div slot="panel">Large</div>
      </Tabs>
    </Flex>
  </Grid>
);

export const DensityModes = () => (
  <Grid gap="12px" style={{ maxWidth: 980 }}>
    <Tabs variant="soft" density="compact" selected={0}>
      <div slot="tab" data-value="compact-a">Compact A</div>
      <div slot="panel">Compact density for data-heavy enterprise screens.</div>
      <div slot="tab" data-value="compact-b">Compact B</div>
      <div slot="panel">Tighter spacing with preserved tap targets.</div>
    </Tabs>

    <Tabs variant="soft" density="default" selected={0}>
      <div slot="tab" data-value="default-a">Default A</div>
      <div slot="panel">Balanced default density for most dashboard workflows.</div>
      <div slot="tab" data-value="default-b">Default B</div>
      <div slot="panel">Good middle ground for mixed content.</div>
    </Tabs>

    <Tabs variant="soft" density="comfortable" selected={0}>
      <div slot="tab" data-value="comfortable-a">Comfortable A</div>
      <div slot="panel">Comfortable density for touch-heavy and executive views.</div>
      <div slot="tab" data-value="comfortable-b">Comfortable B</div>
      <div slot="panel">Improved spacing and larger targets.</div>
    </Tabs>
  </Grid>
);

export const OverflowWithScroll = () => (
  <Tabs variant="soft" selected={5}>
    <div slot="tab" data-value="mon">Mon</div><div slot="panel">Mon capacity</div>
    <div slot="tab" data-value="tue">Tue</div><div slot="panel">Tue capacity</div>
    <div slot="tab" data-value="wed">Wed</div><div slot="panel">Wed capacity</div>
    <div slot="tab" data-value="thu">Thu</div><div slot="panel">Thu capacity</div>
    <div slot="tab" data-value="fri">Fri</div><div slot="panel">Fri capacity</div>
    <div slot="tab" data-value="sat">Sat</div><div slot="panel">Sat capacity</div>
    <div slot="tab" data-value="sun">Sun</div><div slot="panel">Sun capacity</div>
    <div slot="tab" data-value="next">Next Week</div><div slot="panel">Next week planning</div>
  </Tabs>
);
`,Ye=`import React from 'react';
import { Box, Grid, Textarea, ThemeProvider } from '@editora/ui-react';

export default {
  title: 'UI/Textarea',
  component: Textarea,
  argTypes: {
    value: { control: 'text' },
    placeholder: { control: 'text' },
    clearable: { control: 'boolean' },
    debounce: { control: 'number' },
    validation: { control: { type: 'radio', options: ['none', 'error', 'success'] } },
    size: { control: { type: 'radio', options: ['1', '2', '3', 'sm', 'md', 'lg'] } },
    rows: { control: { type: 'number', min: 2, max: 12, step: 1 } },
    maxlength: { control: 'number' },
    resize: { control: { type: 'radio', options: ['none', 'vertical', 'horizontal', 'both'] } },
    variant: { control: { type: 'radio', options: ['classic', 'surface', 'soft', 'filled', 'ghost', 'contrast'] } },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' }
  }
};

const Template = (args: any) => <Textarea {...args} />;

export const Playground = Template.bind({});
Playground.args = {
  value: '',
  placeholder: 'Write a release summary for stakeholders...',
  clearable: true,
  debounce: 250,
  validation: 'none',
  rows: 4,
  resize: 'vertical',
  variant: 'surface',
  size: 'md'
};

export const ControlledWithDebounce = () => {
  const [value, setValue] = React.useState('Release candidate notes...');
  const [debounced, setDebounced] = React.useState('Release candidate notes...');

  return (
    <Grid gap="10px" style={{ maxWidth: 560 }}>
      <Textarea
        value={value}
        clearable
        debounce={320}
        rows={5}
        variant="soft"
        label="Release notes"
        description="Debounced output updates after 320ms"
        onInput={setValue}
        onDebouncedInput={setDebounced}
      />

      <Box variant="surface" p="10px" style={{ fontSize: 13, color: '#475569' }}>
        <div><strong>Live:</strong> {value || '(empty)'}</div>
        <div><strong>Debounced:</strong> {debounced || '(empty)'}</div>
      </Box>
    </Grid>
  );
};

export const ValidationAndCounter = () => (
  <Grid gap="12px" style={{ maxWidth: 620 }}>
    <Textarea
      label="Change reason"
      description="Required for audit trails"
      maxlength={160}
      showCount
      validation="error"
      value=""
      placeholder="Describe what changed and why..."
      clearable
    >
      <Box slot="error">Please provide a clear reason before publishing.</Box>
    </Textarea>

    <Textarea
      label="Internal context"
      description="Autosize grows up to 8 rows"
      autosize
      maxRows={8}
      rows={3}
      showCount
      maxlength={600}
      variant="filled"
      tone="success"
      placeholder="Add operational context for support and QA teams..."
    />
  </Grid>
);

export const ContrastVariant = () => (
  <ThemeProvider
    tokens={{
      colors: {
        background: '#020617',
        surface: '#0f172a',
        text: '#e2e8f0',
        primary: '#93c5fd',
        border: 'rgba(148, 163, 184, 0.38)'
      }
    }}
  >
    <Box bg="var(--ui-color-background)" p="14px" radius="lg" style={{ maxWidth: 640 }}>
      <Textarea
        variant="contrast"
        size="lg"
        rows={4}
        label="Command center note"
        description="High-contrast operational annotation"
        placeholder="Type a runtime directive..."
        showCount
        maxlength={220}
      />
    </Box>
  </ThemeProvider>
);
`,Xe=`import React from 'react';
import { ThemeProvider, useTheme, Button , Box} from '@editora/ui-react';

export default { title: 'UI/Theming', component: ThemeProvider, argTypes: {
  primary: { control: 'color' },
  background: { control: 'color' },
  text: { control: 'color' },
  radius: { control: 'text' },
  fontSizeMd: { control: 'text' }
}};

function Demo() {
  const { tokens, setTokens } = useTheme() as any;
  const toggle = () => {
    const dark = tokens.colors.background === '#111827';
    setTokens({
      ...tokens,
      colors: dark
        ? { ...tokens.colors, background: '#ffffff', text: '#111827', primary: '#2563eb' }
        : { ...tokens.colors, background: '#111827', text: '#f8fafc', primary: '#7c3aed' }
    });
  };
  return (
    <Box style={{ padding: 20, background: 'var(--ui-color-background)', color: 'var(--ui-color-text)' }}>
      <h3>Theme demo</h3>
      <p>Primary color token: <strong style={{ color: 'var(--ui-color-primary)' }}>{tokens.colors.primary}</strong></p>
      <Button onClick={toggle}>Toggle theme</Button>
    </Box>
  );
}

export const Interactive = (args: any) => (
  <ThemeProvider tokens={{ colors: { primary: args.primary, background: args.background, text: args.text }, radius: args.radius, typography: { size: { md: args.fontSizeMd } } }}>
    <Demo />
  </ThemeProvider>
);
Interactive.args = { primary: '#2563eb', background: '#ffffff', text: '#111827', radius: '6px', fontSizeMd: '14px' };
Interactive.parameters = { controls: { expanded: true } };

export const Default = () => (
  <ThemeProvider>
    <Demo />
  </ThemeProvider>
);
Default.parameters = { controls: { hideNoControlsWarning: true } };`,et=`import React from 'react';
import { Box, Timeline } from '@editora/ui-react';

export default {
  title: 'UI/Timeline',
  component: Timeline
};

const releaseTimeline = [
  { title: 'Spec freeze', time: 'Feb 10, 2026', description: 'Finalized sprint scope and acceptance criteria.', tone: 'info' as const },
  { title: 'Internal QA sign-off', time: 'Feb 14, 2026', description: 'All critical regressions resolved.', tone: 'success' as const },
  { title: 'Security review', time: 'Feb 18, 2026', description: 'Permission model and audit logs validated.', tone: 'warning' as const },
  {
    title: 'Production release',
    time: 'Feb 21, 2026',
    description: 'Rolled out to all admin tenants.',
    tone: 'default' as const,
    active: true
  }
];

export const Default = () => (
  <Box style={{ maxWidth: 680 }}>
    <Timeline items={releaseTimeline} />
  </Box>
);

export const Contrast = () => (
  <Box variant="contrast" p="12px" radius="lg" style={{ maxWidth: 680 }}>
    <Timeline variant="contrast" items={releaseTimeline} />
  </Box>
);
`,tt=`import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";

// Import the toast library
import { toast, toastAdvanced } from "@editora/toast";
import "../../packages/editora-toast/dist/toast.css";
import { Box, Grid, Flex} from '@editora/ui-react';


const meta: Meta = {
  title: "UI Components/Toast Notifications",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: \`
# Editora Toast - Advanced Notification System

**Bundle Size**: ~22 KB minified (5.6 KB gzipped)  
**Features**: Promise lifecycle, progress bars, groups, plugins, accessibility  
**Zero Dependencies**: Framework agnostic, works everywhere  

## Features
- ✅ Promise lifecycle toasts (loading → success/error)
- ✅ Progress bars with percentage display
- ✅ Toast groups and stacking
- ✅ Custom rendering and actions
- ✅ Accessibility (ARIA, keyboard navigation)
- ✅ Themes (light/dark/system)
- ✅ Plugins system
- ✅ Multiple positions
- ✅ Auto-dismiss with pause on hover
- ✅ Drag/swipe to dismiss
        \`,
      },
    },
  },
  argTypes: {
    theme: {
      control: { type: "select" },
      options: ["light", "dark", "system", "custom", "colored", "minimal", "glass", "neon", "retro", "ocean", "forest", "sunset", "midnight"],
      description: "Toast theme",
    },
    position: {
      control: { type: "select" },
      options: ["top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"],
      description: "Toast position",
    },
    rtl: {
      control: { type: "boolean" },
      description: "Enable RTL (right-to-left) support",
    },
    swipeDirection: {
      control: { type: "select" },
      options: ["any", "horizontal", "vertical", "left", "right", "up", "down"],
      description: "Swipe direction for dismiss",
    },
    pauseOnWindowBlur: {
      control: { type: "boolean" },
      description: "Pause toasts when window loses focus",
    },
  },
};

export default meta;
type Story = StoryObj;

const ToastDemo = ({ 
  theme = "light", 
  position = "bottom-right",
  rtl = false,
  swipeDirection = "any",
  pauseOnWindowBlur = false
}: { 
  theme?: string; 
  position?: string;
  rtl?: boolean;
  swipeDirection?: string;
  pauseOnWindowBlur?: boolean;
}) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize toast with demo settings
    toastAdvanced.configure({
      theme: theme as any,
      position: position as any,
      duration: 4000,
      maxVisible: 5,
      enableAccessibility: true,
      rtl,
      swipeDirection: swipeDirection as any,
      pauseOnWindowBlur,
    });
    setIsInitialized(true);
  }, [theme, position, rtl, swipeDirection, pauseOnWindowBlur]);

  if (!isInitialized) {
    return <div>Initializing toast system...</div>;
  }

  return (
    <Box style={{ padding: "20px", maxWidth: "800px" }}>
      <h1>Toast Notifications Demo</h1>
      <p>Click the buttons below to see different toast types and features.</p>

      <Grid
        style={{
          display: "grid",
          gap: "20px",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        }}
      >
        {/* Basic Toasts */}
        <div>
          <h3>Basic Toasts</h3>
          <Flex
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <button onClick={() => toast.info("This is an info message", { theme: theme as any, position: position as any, rtl, swipeDirection: swipeDirection as any })}>
              Info Toast
            </button>
            <button
              onClick={() => toast.success("Operation completed successfully!", { theme: theme as any, position: position as any, rtl, swipeDirection: swipeDirection as any })}
            >
              Success Toast
            </button>
            <button onClick={() => toast.error("Something went wrong!", { theme: theme as any, position: position as any, rtl, swipeDirection: swipeDirection as any })}>
              Error Toast
            </button>
            <button onClick={() => toastAdvanced.warning("This is a warning", { theme: theme as any, position: position as any, rtl, swipeDirection: swipeDirection as any })}>
              Warning Toast
            </button>
            <button onClick={() => toastAdvanced.loading("Loading content...", { theme: theme as any, position: position as any, rtl, swipeDirection: swipeDirection as any })}>
              Loading Toast
            </button>
          </Flex>
        </div>

        {/* Rich Toasts */}
        <div>
          <h3>Rich Toasts</h3>
          <Flex
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <button
              onClick={() => {
                toastAdvanced.show({
                  message: "Document saved successfully!",
                  level: "success",
                  icon: "💾",
                  actions: [
                    {
                      label: "View Document",
                      onClick: () => alert("Viewing document..."),
                    },
                    { label: "Share", onClick: () => alert("Sharing...") },
                  ],
                });
              }}
            >
              Rich Toast with Actions
            </button>

            <button
              onClick={() => {
                toastAdvanced.show({
                  render: () => {
                    const div = document.createElement("div");
                    div.innerHTML = \`
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <span style="font-size: 20px;">🎨</span>
                      <div>
                        <strong>Custom Toast</strong>
                        <br>
                        <small>Rendered with custom function</small>
                      </div>
                    </div>
                  \`;
                    return div;
                  },
                  level: "custom",
                });
              }}
            >
              Custom Render Toast
            </button>
          </Flex>
        </div>

        {/* Progress Toasts */}
        <div>
          <h3>Progress Toasts</h3>
          <Flex
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <button
              onClick={() => {
                const toastInstance = toastAdvanced.show({
                  message: "Processing...",
                  level: "loading",
                  progress: { value: 0, showPercentage: true },
                });

                let progress = 0;
                const interval = setInterval(() => {
                  progress += 10;
                  toastAdvanced.update(toastInstance.id, {
                    progress: { value: progress, showPercentage: true },
                    message: \`Processing... \${progress}%\`,
                  });

                  if (progress >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                      toastAdvanced.update(toastInstance.id, {
                        message: "Complete!",
                        level: "success",
                        progress: undefined,
                      });
                    }, 500);
                  }
                }, 200);
              }}
            >
              Progress Toast
            </button>

            <button
              onClick={() => {
                const toastInstance = toastAdvanced.show({
                  message: "Downloading...",
                  level: "loading",
                  progress: { value: 0 },
                });

                let progress = 0;
                const interval = setInterval(() => {
                  progress += 5;
                  toastAdvanced.update(toastInstance.id, {
                    progress: { value: progress },
                  });

                  if (progress >= 100) {
                    clearInterval(interval);
                    toastAdvanced.update(toastInstance.id, {
                      message: "Download complete!",
                      level: "success",
                      progress: undefined,
                    });
                  }
                }, 100);
              }}
            >
              Download Progress
            </button>
          </Flex>
        </div>
        {/* Theme Showcase */}
        <div>
          <h3>Theme Showcase</h3>
          <Grid style={{ display: "grid", gap: "15px", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
            {[
              { name: "Colored", theme: "colored" },
              { name: "Minimal", theme: "minimal" },
              { name: "Glass", theme: "glass" },
              { name: "Neon", theme: "neon" },
              { name: "Retro", theme: "retro" },
              { name: "Ocean", theme: "ocean" },
              { name: "Forest", theme: "forest" },
              { name: "Sunset", theme: "sunset" },
              { name: "Midnight", theme: "midnight" }
            ].map(({ name, theme }) => (
              <Box key={theme} style={{ border: "1px solid #e1e5e9", borderRadius: "8px", padding: "15px" }}>
                <h4 style={{ margin: "0 0 10px 0", fontSize: "14px" }}>{name} Theme</h4>
                <Flex style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <button onClick={() => {
                    const toast = toastAdvanced.show({
                      message: \`\${name} theme - Success!\`,
                      level: "success",
                      theme: theme as any
                    });
                  }}>
                    Success
                  </button>
                  <button onClick={() => {
                    const toast = toastAdvanced.show({
                      message: \`\${name} theme - Info message\`,
                      level: "info",
                      theme: theme as any
                    });
                  }}>
                    Info
                  </button>
                  <button onClick={() => {
                    const toast = toastAdvanced.show({
                      message: \`\${name} theme - Warning!\`,
                      level: "warning",
                      theme: theme as any
                    });
                  }}>
                    Warning
                  </button>
                  <button onClick={() => {
                    const toast = toastAdvanced.show({
                      message: \`\${name} theme - Error occurred\`,
                      level: "error",
                      theme: theme as any
                    });
                  }}>
                    Error
                  </button>
                </Flex>
              </Box>
            ))}
          </Grid>
        </div>
        <div>
          <h3>Advanced Animations</h3>
          <Flex
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <button
              onClick={() => {
                toastAdvanced.show({
                  message: "Spring animation toast!",
                  level: "success",
                  animation: {
                    type: "spring",
                    config: { stiffness: 100, damping: 20 },
                  },
                });
              }}
            >
              Spring Animation
            </button>
            <button
              onClick={() => {
                toastAdvanced.show({
                  message: "Bounce animation!",
                  level: "info",
                  animation: {
                    type: "bounce",
                    direction: "up",
                    intensity: "normal",
                    duration: 800,
                  },
                });
              }}
            >
              Bounce Animation
            </button>
            <button
              onClick={() => {
                toastAdvanced.show({
                  message: "Slide animation!",
                  level: "success",
                  animation: {
                    type: "slide",
                    direction: "up",
                    distance: 100,
                    duration: 400,
                  },
                });
              }}
            >
              Slide Animation
            </button>
            <button
              onClick={() => {
                toastAdvanced.show({
                  message: "Zoom animation!",
                  level: "warning",
                  animation: {
                    type: "zoom",
                    scale: 0.3,
                    origin: "center",
                    duration: 500,
                  },
                });
              }}
            >
              Zoom Animation
            </button>
            <button
              onClick={() => {
                toastAdvanced.show({
                  message: "Flip animation!",
                  level: "error",
                  animation: {
                    type: "flip",
                    axis: "y",
                    direction: "forward",
                    duration: 600,
                  },
                });
              }}
            >
              Flip Animation
            </button>
            <button
              onClick={() => {
                toastAdvanced.show({
                  message: "Fade animation!",
                  level: "info",
                  animation: {
                    type: "fade",
                    direction: "up",
                    distance: 20,
                    duration: 300,
                  },
                });
              }}
            >
              Fade Animation
            </button>
            <button
              onClick={() => {
                toastAdvanced.show({
                  message: "Elastic animation!",
                  level: "success",
                  animation: {
                    type: "elastic",
                    direction: "up",
                    intensity: "normal",
                    duration: 1000,
                  },
                });
              }}
            >
              Elastic Animation
            </button>
            <button
              onClick={() => {
                toastAdvanced.show({
                  message: "Rotate animation!",
                  level: "warning",
                  animation: {
                    type: "rotate",
                    degrees: 360,
                    direction: "clockwise",
                    duration: 500,
                  },
                });
              }}
            >
              Rotate Animation
            </button>
            <button
              onClick={() => {
                toastAdvanced.show({
                  message: "Custom bounce animation!",
                  level: "info",
                  animation: {
                    type: "custom",
                    show: async (element) => {
                      // Custom bounce animation
                      element.style.transform = "scale(0.3)";
                      element.style.opacity = "0";

                      await new Promise((resolve) => setTimeout(resolve, 50));
                      element.style.transition =
                        "all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
                      element.style.transform = "scale(1)";
                      element.style.opacity = "1";

                      return new Promise((resolve) => setTimeout(resolve, 600));
                    },
                    hide: async (element) => {
                      element.style.transition = "all 0.4s ease";
                      element.style.transform = "scale(0.8)";
                      element.style.opacity = "0";
                      return new Promise((resolve) => setTimeout(resolve, 400));
                    },
                  },
                });
              }}
            >
              Custom Bounce Animation
            </button>
          </Flex>
        </div>

        {/* Promise Toasts */}
        <div>
          <h3>Promise Lifecycle Toasts</h3>
          <Flex
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <button
              onClick={() => {
                const promise = new Promise((resolve) => {
                  setTimeout(() => resolve("Data loaded successfully!"), 2000);
                });

                toastAdvanced
                  .promise(promise, {
                    loading: "Loading data...",
                    success: (data) => \`Success: \${data}\`,
                    error: "Failed to load data",
                  })
                  .catch(() => {});
              }}
            >
              Successful Promise
            </button>

            <button
              onClick={() => {
                const promise = new Promise((_, reject) => {
                  setTimeout(() => reject(new Error("Network error")), 2000);
                });

                toastAdvanced
                  .promise(promise, {
                    loading: "Loading data...",
                    success: "Data loaded!",
                    error: (error) => \`Error: \${error.message}\`,
                  })
                  .catch(() => {});
              }}
            >
              Failed Promise
            </button>
          </Flex>
        </div>

        {/* Grouped Toasts */}
        <div>
          <h3>Grouped Toasts</h3>
          <Flex
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <button
              onClick={() => {
                toastAdvanced.group("upload-group", {
                  message: "Upload 1 of 3 complete",
                  level: "success",
                });

                setTimeout(() => {
                  toastAdvanced.group("upload-group", {
                    message: "Upload 2 of 3 complete",
                    level: "success",
                  });
                }, 1000);

                setTimeout(() => {
                  toastAdvanced.group("upload-group", {
                    message: "All uploads complete!",
                    level: "success",
                  });
                }, 2000);
              }}
            >
              Grouped Uploads
            </button>
          </Flex>
        </div>

        {/* File Upload Simulation */}
        <div>
          <h3>File Upload Simulation</h3>
          <Flex
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <button
              onClick={() => {
                const uploadPromise = new Promise((resolve, reject) => {
                  let progress = 0;
                  const interval = setInterval(() => {
                    progress += 20;
                    if (progress >= 100) {
                      clearInterval(interval);
                      resolve("File uploaded successfully!");
                    }
                  }, 300);

                  setTimeout(() => {
                    if (Math.random() > 0.7) {
                      clearInterval(interval);
                      reject(new Error("Upload failed"));
                    }
                  }, 1000);
                });

                toastAdvanced
                  .promise(uploadPromise, {
                    loading: "Uploading file...",
                    success: "File uploaded successfully!",
                    error: "Upload failed. Please try again.",
                  })
                  .catch(() => {});
              }}
            >
              File Upload
            </button>
          </Flex>
        </div>

        {/* Positioned Toasts */}
        <div>
          <h3>Positioned Toasts</h3>
          <Flex
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {[
              "top-left",
              "top-center",
              "top-right",
              "bottom-left",
              "bottom-center",
              "bottom-right",
            ].map((pos) => (
              <button
                key={pos}
                onClick={() => {
                  toastAdvanced.show({
                    message: \`Toast at \${pos}\`,
                    level: "info",
                    position: pos as any,
                  });
                }}
              >
                {pos}
              </button>
            ))}
          </Flex>
        </div>

        {/* Configuration */}
        <div>
          <h3>Configuration</h3>
          <Flex
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <button
              onClick={() => {
                toastAdvanced.show({
                  message: "This toast will not auto-hide",
                  level: "warning",
                  persistent: true, // No auto-dismiss
                  closable: true,
                });
              }}
            >
              No Auto Hide
            </button>
            <button
              onClick={() => {
                toastAdvanced.configure({ duration: 2000 });
                toast.info("Fast duration set (2s)", { theme: theme as any, position: position as any, rtl, swipeDirection: swipeDirection as any });
              }}
            >
              Fast Duration (2s)
            </button>

            <button
              onClick={() => {
                toastAdvanced.configure({ duration: 10000 });
                toast.info("Slow duration set (10s)", { theme: theme as any, position: position as any, rtl, swipeDirection: swipeDirection as any });
              }}
            >
              Slow Duration (10s)
            </button>

            <button
              onClick={() => {
                toastAdvanced.configure({ maxVisible: 2 });
                toast.info("Max visible set to 2", { theme: theme as any, position: position as any, rtl, swipeDirection: swipeDirection as any });
              }}
            >
              Max Visible: 2
            </button>

            <button
              onClick={() => {
                toastAdvanced.configure({
                  duration: 4000,
                  maxVisible: 5,
                  position: "bottom-right",
                });
                toast.info("Configuration reset", { theme: theme as any, position: position as any, rtl, swipeDirection: swipeDirection as any });
              }}
            >
              Reset Config
            </button>
          </Flex>
        </div>

        {/* Update Toast */}
        <div>
          <h3>Update Toast</h3>
          <Flex
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <button
              onClick={() => {
                const loadingToast =
                  toastAdvanced.loading("Saving document...");
                setTimeout(() => {
                  toastAdvanced.update(loadingToast.id, {
                    message: "Document saved successfully!",
                    level: "success",
                  });
                }, 2000);
              }}
            >
              Loading → Success
            </button>
          </Flex>
        </div>

        {/* Plugin Demo */}
        <div>
          <h3>Plugin Demo</h3>
          <Flex
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <button
              onClick={() => {
                const analyticsPlugin = {
                  name: "analytics",
                  install(manager: any) {
                    manager.on("afterShow", (toast: any) => {
                      console.log("📊 Toast shown:", {
                        level: toast.level,
                        message: toast.message,
                        timestamp: new Date().toISOString(),
                      });
                    });
                  },
                };

                toastAdvanced.use(analyticsPlugin);
                toast.success("Analytics plugin installed! Check console.", { theme: theme as any, position: position as any, rtl, swipeDirection: swipeDirection as any });
              }}
            >
              Install Analytics Plugin
            </button>

            <button
              onClick={() => {
                toastAdvanced.info(
                  "This toast will be tracked by analytics plugin",
                );
              }}
            >
              Toast with Plugin
            </button>
          </Flex>
        </div>
      </Grid>

      <Box
        style={{
          marginTop: "40px",
          padding: "20px",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
        }}
      >
        <h3>Toast State</h3>
        <Flex style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <div>
            <strong>Toasts:</strong> {toastAdvanced.getToasts().length}
          </div>
          <div>
            <strong>Groups:</strong>{" "}
            {Object.keys(toastAdvanced.getGroups()).length}
          </div>
          <div>
            <strong>Config:</strong>
            <pre style={{ fontSize: "12px", margin: "5px 0" }}>
              {JSON.stringify(toastAdvanced.getConfig(), null, 2)}
            </pre>
          </div>
        </Flex>
      </Box>
    </Box>
  );
};

// Main demo story
export const ToastShowcase: Story = {
  render: (args) => <ToastDemo theme={args.theme} position={args.position} />,
  args: {
    theme: "light",
    position: "bottom-right",
  },
};

// Individual feature stories
export const BasicToasts: Story = {
  render: () => (
    <Box style={{ padding: "20px" }}>
      <h2>Basic Toast Types</h2>
      <Flex style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button onClick={() => toast.info("Info message", { theme: 'light', position: 'bottom-right' })}>Info</button>
        <button onClick={() => toast.success("Success message", { theme: 'light', position: 'bottom-right' })}>Success</button>
        <button onClick={() => toast.error("Error message", { theme: 'light', position: 'bottom-right' })}>Error</button>
        <button onClick={() => toastAdvanced.warning("Warning message", { theme: 'light', position: 'bottom-right' })}>Warning</button>
        <button onClick={() => toastAdvanced.loading("Loading message", { theme: 'light', position: 'bottom-right' })}>Loading</button>
      </Flex>
    </Box>
  ),
};

export const PromiseToasts: Story = {
  render: () => (
    <Box style={{ padding: "20px" }}>
      <h2>Promise Lifecycle Toasts</h2>
      <Flex style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => {
          const promise = new Promise((resolve) => {
            setTimeout(() => resolve("Data loaded!"), 2000);
          });
          toastAdvanced.promise(promise, {
            loading: "Loading...",
            success: (data) => \`Success: \${data}\`,
            error: "Failed"
          }).catch(() => {});
        }}>
          Success Promise
        </button>
        <button onClick={() => {
          const promise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Network error")), 2000);
          });
          toastAdvanced.promise(promise, {
            loading: "Loading...",
            success: "Success!",
            error: (error) => \`Error: \${error.message}\`
          }).catch(() => {});
        }}>
          Failed Promise
        </button>
      </Flex>
    </Box>
  ),
};

export const ProgressToasts: Story = {
  render: () => (
    <Box style={{ padding: "20px" }}>
      <h2>Progress Toasts</h2>
      <button onClick={() => {
        const toastInstance = toastAdvanced.show({
          message: "Processing...",
          level: "loading",
          progress: { value: 0, showPercentage: true }
        });

        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          toastAdvanced.update(toastInstance.id, {
            progress: { value: progress, showPercentage: true },
            message: \`Processing... \${progress}%\`
          });

          if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              toastAdvanced.update(toastInstance.id, {
                message: "Complete!",
                level: "success",
                progress: undefined
              });
            }, 500);
          }
        }, 200);
      }}>
        Start Progress
      </button>
    </Box>
  ),
};

// New Features Demo
export const NewFeaturesDemo: Story = {
  render: (args) => <ToastDemo 
    theme={args.theme} 
    position={args.position}
    rtl={args.rtl}
    swipeDirection={args.swipeDirection}
    pauseOnWindowBlur={args.pauseOnWindowBlur}
  />,
  args: {
    theme: "light",
    position: "bottom-right",
    rtl: false,
    swipeDirection: "any",
    pauseOnWindowBlur: false,
  },
  parameters: {
    docs: {
      description: {
        story: \`
# New Features Demo

This story demonstrates the newly added features:

## RTL Support
- Enable RTL support with the \\\`rtl\\\` prop
- Automatically adjusts text direction and layout for right-to-left languages

## Swipe Direction Control
- Choose specific swipe directions: \\\`any\\\`, \\\`horizontal\\\`, \\\`vertical\\\`, \\\`left\\\`, \\\`right\\\`, \\\`up\\\`, \\\`down\\\`
- More precise control over how users can dismiss toasts

## Window Focus Pausing
- Enable \\\`pauseOnWindowBlur\\\` to automatically pause toasts when the window loses focus
- Resumes when the window regains focus
- Useful for preventing toasts from disappearing while users are in other tabs
        \`,
      },
    },
  },
};

// Complex Examples Stories
export const InteractiveFeedbackForm: Story = {
  render: () => (
    <Box style={{ padding: "20px" }}>
      <h2>Interactive Feedback Form</h2>
      <p>Toast containing a textarea and submit/cancel buttons for user feedback.</p>
      <button onClick={() => {
        const feedbackForm = document.createElement('div');
        feedbackForm.style.cssText = \`
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 280px;
        \`;

        const title = document.createElement('div');
        title.textContent = '💬 Quick Feedback';
        title.style.cssText = \`
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 4px;
          color: inherit;
        \`;

        const textarea = document.createElement('textarea');
        textarea.placeholder = 'How can we improve Editora?';
        textarea.style.cssText = \`
          width: 100%;
          min-height: 60px;
          padding: 8px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.1);
          color: inherit;
          font-size: 13px;
          font-family: inherit;
          resize: vertical;
          outline: none;
        \`;

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = \`
          display: flex;
          gap: 6px;
          justify-content: flex-end;
          margin-top: 4px;
        \`;

        const submitBtn = document.createElement('button');
        submitBtn.textContent = 'Send';
        submitBtn.style.cssText = \`
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: 4px;
          color: inherit;
          font-size: 12px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        \`;

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.cssText = \`
          padding: 6px 12px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: 4px;
          color: inherit;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        \`;

        // Button hover effects
        submitBtn.onmouseover = () => {
          submitBtn.style.background = 'rgba(255, 255, 255, 0.3)';
          submitBtn.style.borderColor = 'rgba(255, 255, 255, 0.8)';
        };
        submitBtn.onmouseout = () => {
          submitBtn.style.background = 'rgba(255, 255, 255, 0.2)';
          submitBtn.style.borderColor = 'rgba(255, 255, 255, 0.6)';
        };

        cancelBtn.onmouseover = () => {
          cancelBtn.style.background = 'rgba(255, 255, 255, 0.1)';
          cancelBtn.style.borderColor = 'rgba(255, 255, 255, 0.8)';
        };
        cancelBtn.onmouseout = () => {
          cancelBtn.style.background = 'transparent';
          cancelBtn.style.borderColor = 'rgba(255, 255, 255, 0.6)';
        };

        // Form submission
        const handleSubmit = () => {
          const feedback = textarea.value.trim();
          if (!feedback) {
            feedbackForm.innerHTML = \`
              <div style="text-align: center; color: inherit;">
                <div style="font-size: 24px; margin-bottom: 8px;">⚠️</div>
                <div style="font-weight: 500; margin-bottom: 4px;">Please enter your feedback</div>
                <div style="font-size: 12px; opacity: 0.8;">We'd love to hear your thoughts!</div>
              </div>
            \`;
            setTimeout(() => {
              // In Storybook, we can't access the toast instance directly
              console.log('Feedback form validation error');
            }, 2000);
            return;
          }

          feedbackForm.innerHTML = \`
            <div style="text-align: center; color: inherit;">
              <div style="font-size: 24px; margin-bottom: 8px;">✅</div>
              <div style="font-weight: 500; margin-bottom: 4px;">Thank you for your feedback!</div>
              <div style="font-size: 12px; opacity: 0.8;">We'll review your suggestions soon.</div>
            </div>
          \`;

          console.log('Feedback received:', feedback);
        };

        const handleCancel = () => {
          console.log('Feedback form cancelled');
        };

        // Event listeners
        submitBtn.onclick = handleSubmit;
        cancelBtn.onclick = handleCancel;

        textarea.onkeydown = (e) => {
          if (e.key === 'Enter' && e.ctrlKey) {
            handleSubmit();
          } else if (e.key === 'Escape') {
            handleCancel();
          }
        };

        // Assemble form
        buttonContainer.appendChild(cancelBtn);
        buttonContainer.appendChild(submitBtn);

        feedbackForm.appendChild(title);
        feedbackForm.appendChild(textarea);
        feedbackForm.appendChild(buttonContainer);

        toastAdvanced.show({
          render: () => feedbackForm,
          level: 'info',
          duration: 0,
          closable: true
        });
      }}>
        Show Feedback Form
      </button>
    </Box>
  ),
};

export const SystemNotifications: Story = {
  render: () => (
    <Box style={{ padding: "20px" }}>
      <h2>System Notifications</h2>
      <p>Different types of system notifications with appropriate actions.</p>
      <Grid style={{ display: "grid", gap: "10px", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <button onClick={() => {
          toastAdvanced.show({
            message: '🎉 System update v2.1.0 is now available! New features include enhanced accessibility and improved performance.',
            level: 'success',
            actions: [
              { label: 'Update Now', primary: true, onClick: () => console.log('Update started') },
              { label: 'Later', onClick: () => console.log('Update scheduled') }
            ]
          });
        }}>
          System Update
        </button>

        <button onClick={() => {
          toastAdvanced.show({
            message: '⚠️ Low disk space detected. Only 2.3 GB remaining. Consider freeing up space or upgrading storage.',
            level: 'warning',
            actions: [
              { label: 'Free Space', primary: true, onClick: () => console.log('Storage cleanup started') },
              { label: 'Dismiss', onClick: () => {} }
            ]
          });
        }}>
          Low Disk Space
        </button>

        <button onClick={() => {
          toastAdvanced.show({
            message: '❌ Internet connection lost. Some features may not work properly. Please check your network settings.',
            level: 'error',
            actions: [
              { label: 'Retry', primary: true, onClick: () => console.log('Retrying connection') },
              { label: 'Settings', onClick: () => console.log('Opening network settings') }
            ]
          });
        }}>
          Connection Lost
        </button>

        <button onClick={() => {
          toastAdvanced.show({
            message: '💬 You have 3 unread messages from the development team. Click to view them.',
            level: 'info',
            actions: [
              { label: 'View Messages', primary: true, onClick: () => console.log('Messages opened') },
              { label: 'Mark Read', onClick: () => console.log('Messages marked as read') }
            ]
          });
        }}>
          New Messages
        </button>
      </Grid>
    </Box>
  ),
};

export const BulkNotifications: Story = {
  render: () => (
    <Box style={{ padding: "20px" }}>
      <h2>Bulk Notifications</h2>
      <p>Multiple notifications appearing in sequence.</p>
      <button onClick={() => {
        const notifications = [
          { message: '📧 New email from support@editora.dev', level: 'info', delay: 0 },
          { message: '🔄 Database backup completed successfully', level: 'success', delay: 500 },
          { message: '⚠️ High CPU usage detected on server-01', level: 'warning', delay: 1000 }
        ];

        notifications.forEach(notification => {
          setTimeout(() => {
            toastAdvanced.show({
              ...notification,
              duration: 6000,
              position: 'top-right'
            });
          }, notification.delay);
        });
      }}>
        Show Bulk Notifications
      </button>
    </Box>
  ),
};

export const PriorityNotifications: Story = {
  render: () => (
    <Box style={{ padding: "20px" }}>
      <h2>Priority Notifications</h2>
      <p>High-priority notifications that require immediate attention.</p>
      <button onClick={() => {
        toastAdvanced.show({
          message: '🚨 CRITICAL: Security vulnerability detected! Immediate action required.',
          level: 'error',
          priority: 100,
          duration: 0,
          actions: [
            { label: 'Fix Now', primary: true, onClick: () => console.log('Security patch applied') },
            { label: 'Learn More', onClick: () => console.log('Opening security documentation') }
          ]
        });
      }}>
        Show Critical Alert
      </button>
    </Box>
  ),
};

export const PersistentNotifications: Story = {
  render: () => (
    <Box style={{ padding: "20px" }}>
      <h2>Persistent Notifications</h2>
      <p>Notifications that stay until manually dismissed.</p>
      <button onClick={() => {
        toastAdvanced.show({
          message: '📌 This notification will stay until manually dismissed. Perfect for important announcements.',
          level: 'info',
          persistent: true,
          actions: [
            { label: 'Got it!', primary: true, onClick: () => {} },
            { label: 'Learn More', onClick: () => console.log('Opening help documentation') }
          ]
        });
      }}>
        Show Persistent Notification
      </button>
    </Box>
  ),
};

export const AdvancedProgressScenarios: Story = {
  render: () => (
    <Box style={{ padding: "20px" }}>
      <h2>Advanced Progress Scenarios</h2>
      <p>Complex progress tracking with multiple stages and real-time updates.</p>
      <Grid style={{ display: "grid", gap: "10px", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <button onClick={() => {
          const toast = toastAdvanced.show({
            message: '📁 Uploading document.pdf...',
            level: 'loading',
            progress: { value: 0, showPercentage: true },
            duration: 15000
          });

          let progress = 0;
          const interval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            if (progress >= 100) {
              progress = 100;
              clearInterval(interval);
              toastAdvanced.update(toast.id, {
                message: '✅ document.pdf uploaded successfully!',
                level: 'success',
                progress: undefined
              });
            } else {
              toastAdvanced.update(toast, {
                progress: { value: progress, showPercentage: true }
              });
            }
          }, 800);
        }}>
          File Upload Progress
        </button>

        <button onClick={() => {
          const steps = [
            '🔍 Analyzing files...',
            '📊 Processing data...',
            '🔄 Optimizing content...',
            '✅ Finalizing results...'
          ];

          let currentStep = 0;
          const toast = toastAdvanced.show({
            message: steps[0],
            level: 'loading',
            progress: { value: 0 },
            duration: 12000
          });

          const interval = setInterval(() => {
            currentStep++;
            const progress = (currentStep / steps.length) * 100;

            if (currentStep >= steps.length) {
              clearInterval(interval);
              toastAdvanced.update(toast.id, {
                message: '🎉 All steps completed successfully!',
                level: 'success',
                progress: undefined
              });
            } else {
              toastAdvanced.update(toast.id, {
                message: steps[currentStep],
                progress: { value: progress }
              });
            }
          }, 2500);
        }}>
          Multi-Step Process
        </button>

        <button onClick={() => {
          const toast = toastAdvanced.show({
            message: '⬇️ Downloading update.zip (0 MB/s)',
            level: 'loading',
            progress: { value: 0, showPercentage: true },
            duration: 10000
          });

          let progress = 0;
          let speed = 2.1;
          const interval = setInterval(() => {
            progress += Math.random() * 8 + 2;
            speed = Math.max(0.5, speed + (Math.random() - 0.5) * 0.5);

            if (progress >= 100) {
              progress = 100;
              clearInterval(interval);
              toastAdvanced.update(toast.id, {
                message: '✅ update.zip downloaded successfully!',
                level: 'success',
                progress: undefined
              });
            } else {
              toastAdvanced.update(toast.id, {
                message: \`⬇️ Downloading update.zip (\${speed.toFixed(1)} MB/s)\`,
                progress: { value: progress, showPercentage: true }
              });
            }
          }, 600);
        }}>
          Download with Speed
        </button>

        <button onClick={() => {
          toastAdvanced.show({
            message: '🔄 Synchronizing with cloud...',
            level: 'loading',
            progress: { indeterminate: true },
            duration: 8000
          });
        }}>
          Indeterminate Progress
        </button>
      </Grid>
    </Box>
  ),
};

export const InteractiveActions: Story = {
  render: () => (
    <Box style={{ padding: "20px" }}>
      <h2>Interactive Actions</h2>
      <p>Toasts with multiple action buttons for complex user interactions.</p>
      <Grid style={{ display: "grid", gap: "10px", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <button onClick={() => {
          toastAdvanced.show({
            message: '🔄 Are you sure you want to delete this file? This action cannot be undone.',
            level: 'warning',
            actions: [
              { label: 'Delete', primary: true, onClick: () => console.log('File deleted permanently') },
              { label: 'Cancel', onClick: () => console.log('Operation cancelled') }
            ]
          });
        }}>
          Confirm Action
        </button>

        <button onClick={() => {
          toastAdvanced.show({
            message: '❌ Failed to save document. Would you like to retry or save locally?',
            level: 'error',
            actions: [
              { label: 'Retry', primary: true, onClick: () => console.log('Retrying save operation') },
              { label: 'Save Locally', onClick: () => console.log('Document saved locally') }
            ]
          });
        }}>
          Retry Failed Operation
        </button>

        <button onClick={() => {
          toastAdvanced.show({
            message: '⬆️ A new version (v2.1.0) is available. Update now to get the latest features and security fixes.',
            level: 'info',
            actions: [
              { label: 'Update Now', primary: true, onClick: () => console.log('Installing update') },
              { label: 'Later', onClick: () => console.log('Update scheduled for next restart') },
              { label: 'What\\'s New', onClick: () => console.log('New features: Enhanced themes, better accessibility, improved performance') }
            ]
          });
        }}>
          Update Available
        </button>

        <button onClick={() => {
          toastAdvanced.show({
            message: '📊 How satisfied are you with Editora Toast?',
            level: 'info',
            actions: [
              { label: '😍 Very Satisfied', onClick: () => console.log('Thank you for the feedback!') },
              { label: '😊 Satisfied', onClick: () => console.log('Thank you for the feedback!') },
              { label: '😐 Neutral', onClick: () => console.log('We\\'ll work on improving!') },
              { label: '😕 Dissatisfied', onClick: () => console.log('Sorry to hear that. Please share your concerns.') }
            ]
          });
        }}>
          Quick Survey
        </button>

        <button onClick={() => {
          toastAdvanced.show({
            message: '⚖️ Choose your preferred notification position for future updates.',
            level: 'info',
            actions: [
              { label: 'Top Right', onClick: () => {
                toastAdvanced.configure({ position: 'top-right' });
                console.log('Position updated to top-right');
              }},
              { label: 'Bottom Right', onClick: () => {
                toastAdvanced.configure({ position: 'bottom-right' });
                console.log('Position updated to bottom-right');
              }},
              { label: 'Top Left', onClick: () => {
                toastAdvanced.configure({ position: 'top-left' });
                console.log('Position updated to top-left');
              }}
            ]
          });
        }}>
          Decision Required
        </button>
      </Grid>
    </Box>
  ),
};

export const ErrorHandlingScenarios: Story = {
  render: () => (
    <Box style={{ padding: "20px" }}>
      <h2>Error Handling Scenarios</h2>
      <p>Different error types with appropriate recovery options.</p>
      <Grid style={{ display: "grid", gap: "10px", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <button onClick={() => {
          toastAdvanced.show({
            message: '🌐 Unable to connect to the server. Please check your internet connection and try again.',
            level: 'error',
            actions: [
              { label: 'Retry', primary: true, onClick: () => console.log('Retrying connection') },
              { label: 'Settings', onClick: () => console.log('Opening network settings') }
            ]
          });
        }}>
          Network Error
        </button>

        <button onClick={() => {
          toastAdvanced.show({
            message: '❌ Please correct the following errors: Email format invalid, Password too short (min 8 characters).',
            level: 'error',
            actions: [
              { label: 'Fix Issues', primary: true, onClick: () => console.log('Highlighting error fields') }
            ]
          });
        }}>
          Validation Error
        </button>

        <button onClick={() => {
          toastAdvanced.show({
            message: '🔒 Permission denied. You need administrator privileges to perform this action.',
            level: 'error',
            actions: [
              { label: 'Request Access', primary: true, onClick: () => console.log('Access request sent to administrator') },
              { label: 'Learn More', onClick: () => console.log('Opening permissions documentation') }
            ]
          });
        }}>
          Permission Denied
        </button>

        <button onClick={() => {
          toastAdvanced.show({
            message: '⏰ Operation timed out. The server took too long to respond.',
            level: 'error',
            actions: [
              { label: 'Retry', primary: true, onClick: () => console.log('Retrying operation') },
              { label: 'Cancel', onClick: () => console.log('Operation cancelled') }
            ]
          });
        }}>
          Timeout Error
        </button>

        <button onClick={() => {
          toastAdvanced.show({
            message: '🖥️ Server error (500). Something went wrong on our end. Our team has been notified.',
            level: 'error',
            actions: [
              { label: 'Try Again', primary: true, onClick: () => console.log('Retrying request') },
              { label: 'Report Issue', onClick: () => console.log('Bug report submitted') }
            ]
          });
        }}>
          Server Error (500)
        </button>

        <button onClick={() => {
          toastAdvanced.show({
            message: '🚦 Too many requests. Please wait a moment before trying again.',
            level: 'warning',
            actions: [
              { label: 'Wait & Retry', primary: true, onClick: () => {
                setTimeout(() => console.log('Ready to retry'), 3000);
              }}
            ]
          });
        }}>
          Rate Limited
        </button>
      </Grid>
    </Box>
  ),
};

export const AsyncOperations: Story = {
  render: () => (
    <Box style={{ padding: "20px" }}>
      <h2>Async Operations</h2>
      <p>Promise-based operations with loading states and success/error handling.</p>
      <Grid style={{ display: "grid", gap: "10px", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <button onClick={() => {
          const promise = new Promise((resolve, reject) => {
            setTimeout(() => {
              Math.random() > 0.1 ? resolve({ data: 'Sample API response', status: 200 }) : reject(new Error('Network Error'));
            }, 2000);
          });

          toastAdvanced.promise(promise, {
            loading: '🔄 Making API request...',
            success: (data) => \`✅ API call successful! Status: \${data.status}\`,
            error: (error) => \`❌ API call failed: \${error.message}\`
          }).catch(() => {});
        }}>
          Successful API Call
        </button>

        <button onClick={() => {
          const promise = new Promise((resolve, reject) => {
            setTimeout(() => {
              Math.random() > 0.3 ? resolve('File processed successfully') : reject(new Error('File corrupted'));
            }, 2500);
          });

          toastAdvanced.promise(promise, {
            loading: '📄 Processing file...',
            success: (message) => \`✅ \${message}\`,
            error: (error) => \`❌ File operation failed: \${error.message}\`
          }).catch(() => {});
        }}>
          File Operation
        </button>

        <button onClick={() => {
          const promise = new Promise((resolve, reject) => {
            setTimeout(() => {
              Math.random() > 0.2 ? resolve({ transactionId: 'TXN_' + Date.now() }) : reject(new Error('Payment declined'));
            }, 3000);
          });

          toastAdvanced.promise(promise, {
            loading: '💳 Processing payment...',
            success: (data) => \`✅ Payment successful! Transaction ID: \${data.transactionId}\`,
            error: (error) => \`❌ Payment failed: \${error.message}\`
          }).catch(() => {});
        }}>
          Payment Processing
        </button>

        <button onClick={() => {
          const promise = new Promise((resolve, reject) => {
            setTimeout(() => {
              Math.random() > 0.1 ? resolve('Data synchronized') : reject(new Error('Sync conflict detected'));
            }, 3500);
          });

          toastAdvanced.promise(promise, {
            loading: '🔄 Synchronizing data...',
            success: (message) => \`✅ \${message} with cloud\`,
            error: (error) => \`❌ Sync failed: \${error.message}\`
          }).catch(() => {});
        }}>
          Data Synchronization
        </button>
      </Grid>
    </Box>
  ),
};
`,ot=`import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { toastAdvanced } from '@editora/toast';
import '@editora/toast/toast.css';
import { Box, Button, Dialog, Flex, Grid, Tabs } from '@editora/ui-react';

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
            <div slot="tab" data-value="signal">Signal</div>
            <div slot="panel">
              <Flex gap="8px" wrap="wrap">
                <Button size="sm" onClick={() => toastAdvanced.success('Deployment healthy', { theme: 'light' })}>Success</Button>
                <Button size="sm" variant="warning" onClick={() => toastAdvanced.warning('Latency above baseline', { theme: 'light' })}>Warning</Button>
                <Button size="sm" variant="danger" onClick={() => toastAdvanced.error('Webhook delivery failed', { theme: 'light' })}>Error</Button>
              </Flex>
            </div>

            <div slot="tab" data-value="queue">Queue</div>
            <div slot="panel">
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
            </div>

            <div slot="tab" data-value="config">Config</div>
            <div slot="panel">
              <Button
                size="sm"
                onClick={() => {
                  toastAdvanced.configure({ maxVisible: 4, position: 'bottom-right', theme: 'light' });
                  toastAdvanced.info('Toast defaults updated', { theme: 'light' });
                }}
              >
                Apply Runtime Config
              </Button>
            </div>
          </Tabs>
        </Box>

        <Modal open={open} onClose={() => setOpen(false)} />
      </Grid>
    );
  }
};
`,at=`import React from 'react';
import { Button, toast, toastApi , Box, Flex} from '@editora/ui-react';

export default {
  title: 'UI/ToastAPI'
};

export const Basic = () => (
  <Flex style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
    <Button onClick={() => toast('Saved')}>toast()</Button>
    <Button variant="secondary" onClick={() => toastApi.success('Published')}>
      success()
    </Button>
    <Button variant="secondary" onClick={() => toastApi.error('Publish failed')}>
      error()
    </Button>
    <Button variant="secondary" onClick={() => toastApi.warning('Storage is almost full')}>
      warning()
    </Button>
    <Button variant="secondary" onClick={() => toastApi.info('Background sync started')}>
      info()
    </Button>
  </Flex>
);
`,nt=`import React from 'react';
import { Button, Toast, type ToastElement , Box, Grid, Flex} from '@editora/ui-react';

export default {
  title: 'UI/Toast',
  component: Toast
};

export const Playground = () => {
  const ref = React.useRef<ToastElement | null>(null);
  const [lastToastId, setLastToastId] = React.useState<string | number | null>(null);
  const [lastEvent, setLastEvent] = React.useState<string>('none');

  const showToast = (message: string, duration = 2200) => {
    const id = ref.current?.show(message, { duration });
    if (id != null) setLastToastId(id);
  };

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <Toast
        ref={ref}
        onShow={(detail) => setLastEvent(\`show #\${detail.id}\`)}
        onHide={(detail) => setLastEvent(\`hide #\${detail.id}\`)}
      />

      <Flex style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button onClick={() => showToast('Saved successfully')}>Show toast</Button>
        <Button variant="secondary" onClick={() => showToast('Publishing in progress...', 4000)}>
          Show long toast
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            if (lastToastId != null) ref.current?.hide(lastToastId);
          }}
        >
          Hide last toast
        </Button>
      </Flex>

      <Box style={{ fontSize: 13, color: '#475569' }}>
        Last event: {lastEvent} {lastToastId != null ? \`(id: \${lastToastId})\` : ''}
      </Box>
    </Grid>
  );
};
`,it=`import React from 'react';
import { Box, Flex, Grid, Toggle } from '@editora/ui-react';

export default {
  title: 'UI/Toggle',
  component: Toggle,
  argTypes: {
    pressed: { control: 'boolean' },
    disabled: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['default', 'soft', 'outline', 'contrast', 'minimal'] },
    tone: { control: 'select', options: ['brand', 'success', 'warning', 'danger'] }
  }
};

export const Controlled = (args: any) => {
  const [pressed, setPressed] = React.useState(Boolean(args.pressed));

  return (
    <Grid gap="12px" style={{ maxWidth: 420 }}>
      <Toggle
        pressed={pressed}
        disabled={args.disabled}
        size={args.size || 'md'}
        variant={args.variant || 'default'}
        tone={args.tone || 'brand'}
        iconOn="✓"
        iconOff="○"
        onChange={(detail) => setPressed(detail.pressed)}
      >
        Bold
      </Toggle>
      <Box style={{ fontSize: 13, color: '#475569' }}>Pressed: <strong>{String(pressed)}</strong></Box>
    </Grid>
  );
};

Controlled.args = {
  pressed: false,
  disabled: false,
  size: 'md',
  variant: 'default',
  tone: 'brand'
};

export const VisualModes = () => (
  <Grid gap="12px" style={{ maxWidth: 700 }}>
    <Flex gap="10px" wrap="wrap">
      <Toggle variant="default" pressed>Default</Toggle>
      <Toggle variant="soft" pressed>Soft</Toggle>
      <Toggle variant="outline" pressed>Outline</Toggle>
      <Toggle variant="minimal" pressed>Minimal</Toggle>
    </Flex>

    <Box variant="contrast" p="12px" radius="lg">
      <Flex gap="10px" wrap="wrap">
        <Toggle variant="contrast" tone="success" pressed>Success</Toggle>
        <Toggle variant="contrast" tone="warning" pressed>Warning</Toggle>
        <Toggle variant="contrast" tone="danger" pressed>Danger</Toggle>
      </Flex>
    </Box>

    <Flex gap="10px" wrap="wrap">
      <Toggle size="sm">Small</Toggle>
      <Toggle size="md">Medium</Toggle>
      <Toggle size="lg">Large</Toggle>
      <Toggle disabled pressed>Disabled</Toggle>
    </Flex>
  </Grid>
);
`,rt=`import React from 'react';
import { Box, Grid, Toggle, ToggleGroup } from '@editora/ui-react';

export default {
  title: 'UI/ToggleGroup',
  component: ToggleGroup,
  argTypes: {
    multiple: { control: 'boolean' },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    variant: { control: 'select', options: ['default', 'soft', 'contrast', 'minimal'] },
    activation: { control: 'select', options: ['auto', 'manual'] }
  }
};

export const SingleSelect = () => {
  const [value, setValue] = React.useState('left');

  return (
    <Grid gap="12px" style={{ maxWidth: 520 }}>
      <ToggleGroup
        value={value}
        orientation="horizontal"
        variant="soft"
        onValueChange={(detail) => {
          if (typeof detail.value === 'string') setValue(detail.value);
        }}
      >
        <Toggle value="left">Left</Toggle>
        <Toggle value="center">Center</Toggle>
        <Toggle value="right">Right</Toggle>
      </ToggleGroup>

      <Box style={{ fontSize: 13, color: '#475569' }}>Alignment: <strong>{value}</strong></Box>
    </Grid>
  );
};

export const MultipleSelect = () => {
  const [value, setValue] = React.useState<string[]>(['bold']);

  return (
    <Grid gap="12px" style={{ maxWidth: 560 }}>
      <ToggleGroup
        multiple
        value={value}
        variant="default"
        onValueChange={(detail) => {
          if (Array.isArray(detail.value)) setValue(detail.value);
        }}
      >
        <Toggle value="bold">Bold</Toggle>
        <Toggle value="italic">Italic</Toggle>
        <Toggle value="underline">Underline</Toggle>
        <Toggle value="strike">Strike</Toggle>
      </ToggleGroup>

      <Box style={{ fontSize: 13, color: '#475569' }}>
        Active styles: <strong>{value.join(', ') || 'none'}</strong>
      </Box>
    </Grid>
  );
};

export const VerticalContrast = () => (
  <Box variant="contrast" p="12px" radius="lg" style={{ maxWidth: 280 }}>
    <ToggleGroup orientation="vertical" variant="contrast" multiple value={["overview", "alerts"]}>
      <Toggle value="overview">Overview</Toggle>
      <Toggle value="analytics">Analytics</Toggle>
      <Toggle value="alerts">Alerts</Toggle>
      <Toggle value="settings">Settings</Toggle>
    </ToggleGroup>
  </Box>
);
`,st=`import React from 'react';
import { Badge, Box, Button, Grid, ThemeProvider } from '@editora/ui-react';

export default {
  title: 'QA/Design Token Governance'
};

const governanceTokens = {
  colors: {
    primary: '#0f62fe',
    primaryHover: '#0043ce',
    foregroundOnPrimary: '#ffffff',
    background: '#f8fafc',
    surface: '#ffffff',
    surfaceAlt: '#eef2ff',
    text: '#0f172a',
    muted: '#475569',
    border: 'rgba(15, 23, 42, 0.2)',
    focusRing: '#0f62fe',
    success: '#15803d',
    warning: '#b45309',
    danger: '#b91c1c'
  },
  radius: '10px',
  spacing: { xs: '4px', sm: '8px', md: '12px', lg: '16px' },
  typography: {
    family: '"IBM Plex Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    size: { sm: '12px', md: '14px', lg: '18px' }
  },
  shadows: {
    sm: '0 1px 2px rgba(2,6,23,0.06)',
    md: '0 16px 30px rgba(2,6,23,0.12)'
  },
  motion: {
    durationShort: '120ms',
    durationBase: '180ms',
    durationLong: '280ms',
    easing: 'cubic-bezier(.2,.9,.2,1)'
  }
};

function Swatch({ label, value }: { label: string; value: string }) {
  return (
    <Box style={{ display: 'grid', gap: 4 }}>
      <Box style={{ fontSize: 12, color: '#475569' }}>{label}</Box>
      <Box style={{ border: '1px solid #cbd5e1', borderRadius: 8, padding: '8px 10px', fontSize: 12, background: '#fff' }}>{value}</Box>
    </Box>
  );
}

export const ScaleParity = () => (
  <ThemeProvider tokens={governanceTokens as any}>
    <Box style={{ padding: 18, display: 'grid', gap: 14, background: 'var(--ui-color-background)', color: 'var(--ui-color-text)' }}>
      <Box style={{ fontSize: 18, fontWeight: 700 }}>Design Token Governance Baseline</Box>
      <Box style={{ fontSize: 13, color: 'var(--ui-color-muted)' }}>
        4px spacing rhythm + consistent radius/typography/elevation across all primitives.
      </Box>

      <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
        <Swatch label="Space XS" value="4px" />
        <Swatch label="Space SM" value="8px" />
        <Swatch label="Space MD" value="12px" />
        <Swatch label="Space LG" value="16px" />
        <Swatch label="Font SM" value="12px" />
        <Swatch label="Font MD" value="14px" />
        <Swatch label="Font LG" value="18px" />
        <Swatch label="Radius" value="10px" />
      </Grid>

      <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
        <Box style={{ border: '1px solid var(--ui-color-border)', borderRadius: 'var(--ui-radius)', background: 'var(--ui-color-surface)', boxShadow: 'var(--ui-shadow-sm)', padding: 12, display: 'grid', gap: 8 }}>
          <Box style={{ fontWeight: 600 }}>Tokenized Card</Box>
          <Box style={{ color: 'var(--ui-color-muted)', fontSize: 13 }}>Spacing, border, shadow, and typography all come from tokens.</Box>
          <Button size="sm">Primary Action</Button>
        </Box>

        <Box style={{ border: '1px solid var(--ui-color-border)', borderRadius: 'var(--ui-radius)', background: 'var(--ui-color-surface-alt)', boxShadow: 'var(--ui-shadow-md)', padding: 12, display: 'grid', gap: 8 }}>
          <Box style={{ fontWeight: 600 }}>Status Palette</Box>
          <Box style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Badge tone="success" variant="soft">Success</Badge>
            <Badge tone="warning" variant="soft">Warning</Badge>
            <Badge tone="danger" variant="soft">Danger</Badge>
          </Box>
        </Box>
      </Grid>
    </Box>
  </ThemeProvider>
);
`,lt=`import React from 'react';
import { Box, Button, Grid, Toolbar, Toggle, ToggleGroup } from '@editora/ui-react';

export default {
  title: 'UI/Toolbar',
  component: Toolbar,
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    variant: { control: 'select', options: ['default', 'soft', 'contrast', 'minimal'] },
    wrap: { control: 'boolean' }
  }
};

export const Default = (args: any) => (
  <Toolbar
    orientation={args.orientation || 'horizontal'}
    variant={args.variant || 'default'}
    wrap={args.wrap}
    aria-label="Editor toolbar"
  >
    <Button size="sm">Undo</Button>
    <Button size="sm">Redo</Button>
    <div data-separator />
    <ToggleGroup multiple value={["bold"]}>
      <Toggle value="bold">Bold</Toggle>
      <Toggle value="italic">Italic</Toggle>
      <Toggle value="underline">Underline</Toggle>
    </ToggleGroup>
    <div data-separator />
    <Button size="sm" variant="secondary">Comment</Button>
  </Toolbar>
);

Default.args = {
  orientation: 'horizontal',
  variant: 'default',
  wrap: false
};

export const VisualModes = () => (
  <Grid gap="14px" style={{ maxWidth: 860 }}>
    <Toolbar variant="default">
      <Button size="sm">Default</Button>
      <Button size="sm" variant="secondary">Actions</Button>
      <Toggle pressed>Pin</Toggle>
    </Toolbar>

    <Toolbar variant="soft" size="lg" wrap>
      <Button size="sm">Soft</Button>
      <Button size="sm" variant="secondary">Export</Button>
      <Toggle pressed tone="success">Live</Toggle>
      <Toggle>Preview</Toggle>
      <Toggle>Share</Toggle>
    </Toolbar>

    <Box variant="contrast" p="12px" radius="lg">
      <Toolbar variant="contrast" density="compact">
        <Button size="sm">Runtime</Button>
        <Button size="sm" variant="secondary">Logs</Button>
        <Toggle pressed tone="warning">Alerts</Toggle>
      </Toolbar>
    </Box>

    <Toolbar variant="minimal" orientation="vertical" style={{ maxWidth: 220 }}>
      <Button size="sm">Cut</Button>
      <Button size="sm">Copy</Button>
      <Button size="sm">Paste</Button>
    </Toolbar>
  </Grid>
);
`,dt=`import React from 'react';
import { Box, Button, Flex, Tooltip } from '@editora/ui-react';

export default {
  title: 'UI/Tooltip',
  component: Tooltip,
  argTypes: {
    text: { control: 'text' },
    placement: { control: 'select', options: ['top', 'right', 'bottom', 'left'] },
    variant: { control: 'select', options: ['default', 'soft', 'contrast', 'minimal'] },
    trigger: { control: 'text' }
  }
};

export const Hover = (args: any) => (
  <Tooltip
    text={args.text}
    placement={args.placement || 'top'}
    variant={args.variant || 'default'}
    trigger={args.trigger || 'hover focus'}
  >
    <Button size="sm">Hover me</Button>
  </Tooltip>
);

Hover.args = {
  text: 'Helpful tooltip text',
  placement: 'top',
  variant: 'default',
  trigger: 'hover focus'
};

export const VisualModes = () => (
  <Flex gap="14px" align="center" wrap="wrap" style={{ padding: 20 }}>
    <Tooltip text="Default tooltip" variant="default"><Button size="sm">Default</Button></Tooltip>
    <Tooltip text="Soft accent tooltip" variant="soft"><Button size="sm">Soft</Button></Tooltip>
    <Tooltip text="High contrast tooltip" variant="contrast"><Button size="sm">Contrast</Button></Tooltip>
    <Tooltip text="Minimal tooltip" variant="minimal"><Button size="sm">Minimal</Button></Tooltip>
    <Tooltip text="Success state" tone="success"><Button size="sm">Success</Button></Tooltip>
    <Tooltip text="Warning state" tone="warning"><Button size="sm">Warning</Button></Tooltip>
    <Tooltip text="Danger state" tone="danger"><Button size="sm">Danger</Button></Tooltip>
  </Flex>
);

export const PlacementMatrix = () => (
  <Flex gap="20px" align="center" justify="center" style={{ padding: 40 }}>
    <Tooltip text="Top" placement="top"><Button size="sm">Top</Button></Tooltip>
    <Tooltip text="Right" placement="right"><Button size="sm">Right</Button></Tooltip>
    <Tooltip text="Bottom" placement="bottom"><Button size="sm">Bottom</Button></Tooltip>
    <Tooltip text="Left" placement="left"><Button size="sm">Left</Button></Tooltip>
  </Flex>
);

export const ControlledOpen = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <Box style={{ padding: 24, display: 'grid', gap: 12 }}>
      <Flex gap="10px">
        <Button size="sm" onClick={() => setOpen(true)}>Open</Button>
        <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>Close</Button>
      </Flex>
      <Tooltip
        text="Manually controlled tooltip"
        open={open}
        trigger="manual"
        onOpenChange={setOpen}
      >
        <Button size="sm">Manual trigger target</Button>
      </Tooltip>
    </Box>
  );
};

export const Headless = () => (
  <Box style={{ padding: 30 }}>
    <Tooltip text="Headless tooltip" headless>
      <button style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #cbd5e1', background: 'white' }}>
        Headless trigger
      </button>
    </Tooltip>
  </Box>
);
`,ct=`import React from 'react';
import { VisuallyHidden } from '@editora/ui-react';

export default {
  title: 'UI/VisuallyHidden',
  component: VisuallyHidden
};

export const AccessibilityLabel = () => (
  <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff' }}>
    <span aria-hidden>🔍</span>
    <VisuallyHidden>Search documents</VisuallyHidden>
  </button>
);
`,pt=`import React from 'react';
import { Box, Button, Field, Flex, Input, Select, Textarea, Wizard } from '@editora/ui-react';

export default {
  title: 'UI/Wizard',
  component: Wizard,
  argTypes: {
    linear: { control: 'boolean' },
    variant: { control: 'select', options: ['default', 'soft', 'glass', 'flat', 'contrast', 'minimal'] },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    density: { control: 'select', options: ['default', 'compact', 'comfortable'] },
    shape: { control: 'select', options: ['rounded', 'square', 'pill'] },
    showProgress: { control: 'boolean' },
    busy: { control: 'boolean' }
  }
};

export const EnterpriseOnboarding = (args: any) => {
  const [value, setValue] = React.useState('org');
  const [busy, setBusy] = React.useState(false);
  const [lastEvent, setLastEvent] = React.useState('idle');

  return (
    <Box style={{ maxWidth: 920, display: 'grid', gap: 12 }}>
      <Wizard
        value={value}
        linear={args.linear}
        variant={args.variant || 'glass'}
        orientation={args.orientation || 'horizontal'}
        density={args.density || 'default'}
        shape={args.shape || 'rounded'}
        showProgress={args.showProgress ?? true}
        busy={busy || args.busy}
        title="Workspace Provisioning"
        description="Configure tenant profile, modules, and policy in a guided enterprise flow."
        onBeforeChange={(detail) => {
          if (detail.nextValue === 'review' && !value) return false;
          return true;
        }}
        onChange={(detail) => {
          setValue(detail.value);
          setLastEvent(\`step:\${detail.value}\`);
        }}
        onComplete={() => {
          setBusy(true);
          setLastEvent('publishing');
          window.setTimeout(() => {
            setBusy(false);
            setLastEvent('complete');
          }, 1100);
        }}
      >
        <Box slot="step" data-value="org" data-title="Organization" data-description="Tenant profile">
          <Field label="Organization name" htmlFor="wizard-org-name" required>
            <Input id="wizard-org-name" placeholder="Northstar Hospital" required />
          </Field>
        </Box>

        <Box slot="step" data-value="modules" data-title="Modules" data-description="Feature toggles">
          <Field label="Primary module" htmlFor="wizard-module">
            <Select id="wizard-module" value="hospital">
              <option value="hospital">Hospital management</option>
              <option value="school">School management</option>
              <option value="commerce">E-commerce operations</option>
            </Select>
          </Field>
        </Box>

        <Box slot="step" data-value="policy" data-title="Policy" data-description="Validation rules">
          <Field label="Retention policy" htmlFor="wizard-policy">
            <Textarea id="wizard-policy" rows={3} value="7 years for records" />
          </Field>
        </Box>

        <Box slot="step" data-value="review" data-title="Review" data-description="Ready to ship">
          <Box style={{ fontSize: 'var(--ui-font-size-md, 14px)', color: 'var(--ui-color-muted, #64748b)' }}>
            Review all fields and click Finish to publish this admin workspace.
          </Box>
        </Box>
      </Wizard>

      <Flex style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
        <Box style={{ fontSize: 'var(--ui-font-size-md, 14px)', color: 'var(--ui-color-muted, #64748b)' }}>
          Current value: <strong>{value}</strong> • Event: <strong>{lastEvent}</strong>
        </Box>
        <Flex style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" variant="secondary" onClick={() => setValue('org')}>Reset</Button>
          <Button size="sm" onClick={() => setValue('review')}>Jump review</Button>
        </Flex>
      </Flex>
    </Box>
  );
};

EnterpriseOnboarding.args = {
  linear: true,
  variant: 'glass',
  orientation: 'horizontal',
  density: 'default',
  shape: 'rounded',
  showProgress: true,
  busy: false
};

export const VerticalClinicalChecklist = () => (
  <Box style={{ maxWidth: 340 }}>
    <Wizard
      value="triage"
      orientation="vertical"
      linear
      variant="soft"
      density="compact"
      title="Clinical Intake"
      description="Guided patient onboarding checklist"
      finishLabel="Complete intake"
    >
      <Box slot="step" data-value="register" data-title="Registration" data-description="Identity and insurance" data-state="success">
        <Box style={{ fontSize: '13px' }}>Registration data captured.</Box>
      </Box>
      <Box slot="step" data-value="triage" data-title="Triage" data-description="Vitals and severity" data-state="warning">
        <Box style={{ fontSize: '13px' }}>Vitals pending manual review.</Box>
      </Box>
      <Box slot="step" data-value="doctor" data-title="Doctor" data-description="Assign physician">
        <Box style={{ fontSize: '13px' }}>Physician assignment queued.</Box>
      </Box>
      <Box slot="step" data-value="admit" data-title="Admission" data-description="Finalize care plan" data-optional>
        <Box style={{ fontSize: '13px' }}>Optional for outpatient cases.</Box>
      </Box>
    </Wizard>
  </Box>
);

export const ContrastReview = () => (
  <Box variant="contrast" p="12px" radius="lg" style={{ maxWidth: 920 }}>
    <Wizard
      value="2"
      variant="contrast"
      linear
      title="Deployment Control"
      description="Secure release workflow"
    >
      <Box slot="step" data-value="1" data-title="Data import" data-description="Source mapping" data-state="success">
        <Box style={{ fontSize: 'var(--ui-font-size-md, 14px)' }}>Import source selected.</Box>
      </Box>
      <Box slot="step" data-value="2" data-title="Schema" data-description="Validate entities">
        <Box style={{ fontSize: 'var(--ui-font-size-md, 14px)' }}>Schema validation in progress.</Box>
      </Box>
      <Box slot="step" data-value="3" data-title="Permissions" data-description="RBAC rules" data-state="error">
        <Box style={{ fontSize: 'var(--ui-font-size-md, 14px)' }}>Permissions policy conflict detected.</Box>
      </Box>
    </Wizard>
  </Box>
);

export const EmptyState = () => (
  <Box style={{ maxWidth: 700 }}>
    <Wizard title="New Flow" description="No steps attached yet." emptyLabel="Add <Box slot='step'> panels to initialize this wizard." />
  </Box>
);
`,ut={colors:{primary:"#2563eb",background:"#ffffff",surface:"#ffffff",surfaceAlt:"#f8fafc",text:"#111827",muted:"#64748b",border:"rgba(15, 23, 42, 0.16)",focusRing:"#2563eb"},radius:"8px",typography:{size:{md:"16px"}}},gt={colors:{primary:"#7c3aed",background:"#111827",surface:"#0f172a",surfaceAlt:"#1e293b",text:"#f8fafc",muted:"#94a3b8",border:"rgba(148, 163, 184, 0.34)",focusRing:"#93c5fd"},radius:"8px",typography:{size:{md:"16px"}}},mt={colors:{primary:"#0033ff",background:"#ffffff",surface:"#ffffff",surfaceAlt:"#ffffff",text:"#000000",muted:"#1a1a1a",border:"#000000",focusRing:"#ff0080"},shadows:{sm:"none",md:"none"},radius:"8px",typography:{size:{md:"16px"}}},xt=(e,o)=>{var t,l;if((l=(t=o==null?void 0:o.parameters)==null?void 0:t.themeSwitcher)!=null&&l.disable)return m(e,{...o});const[r,s]=b.useState("light"),n=b.useMemo(()=>r==="dark"?gt:r==="high-contrast"?mt:ut,[r]),a=r==="light"?"dark":r==="dark"?"high-contrast":"light",i=a==="high-contrast"?"High Contrast":a[0].toUpperCase()+a.slice(1);return v(P,{tokens:n,children:[m("div",{style:{position:"fixed",top:16,right:16,zIndex:9999},children:v(z,{size:"sm",variant:"secondary",onClick:()=>s(a),children:["Switch to ",i]})}),m("div",{style:{background:"var(--ui-color-background)",color:"var(--ui-color-text)",minHeight:"100vh"},children:m(e,{...o})})]})},ft=Object.assign({"./stories/AISaaSDashboard.stories.tsx":A,"./stories/Accordion.stories.tsx":I,"./stories/AdminVisualRegression.stories.tsx":F,"./stories/Alert.stories.tsx":E,"./stories/AlertDialog.stories.tsx":D,"./stories/AlertDialogPromise.stories.tsx":G,"./stories/AppHeader.stories.tsx":M,"./stories/ApprovalWorkflowScenario.stories.tsx":O,"./stories/AspectRatio.stories.tsx":L,"./stories/Avatar.stories.tsx":_,"./stories/Badge.stories.tsx":W,"./stories/BlockControls.stories.tsx":N,"./stories/Box.stories.tsx":V,"./stories/Breadcrumb.stories.tsx":H,"./stories/Button.stories.tsx":U,"./stories/Calendar.stories.tsx":q,"./stories/Chart.stories.tsx":$,"./stories/Checkbox.stories.tsx":j,"./stories/Collapsible.stories.tsx":Q,"./stories/ColorPicker.stories.tsx":J,"./stories/Combobox.stories.tsx":Z,"./stories/CommandPalette.stories.tsx":K,"./stories/Container.stories.tsx":Y,"./stories/ContextMenu.stories.tsx":X,"./stories/DataTable.stories.tsx":ee,"./stories/DateTimePickers.stories.tsx":te,"./stories/Dialog.stories.tsx":oe,"./stories/DialogPromise.stories.tsx":ae,"./stories/DirectionProvider.stories.tsx":ne,"./stories/Drawer.stories.tsx":ie,"./stories/Dropdown.stories.tsx":re,"./stories/EditorAISaaSWorkspace.stories.tsx":se,"./stories/EmptyState.stories.tsx":le,"./stories/Field.stories.tsx":de,"./stories/Flex.stories.tsx":ce,"./stories/FloatingToolbar.stories.tsx":pe,"./stories/Form.stories.tsx":ue,"./stories/Gantt.stories.tsx":ge,"./stories/Grid.stories.tsx":me,"./stories/HoverCard.stories.tsx":xe,"./stories/Icon.stories.tsx":fe,"./stories/IconsCatalog.stories.tsx":he,"./stories/Input.stories.tsx":ve,"./stories/Label.stories.tsx":be,"./stories/Layout.stories.tsx":ye,"./stories/LightCodeEditor.stories.tsx":Be,"./stories/LightCodeEditorAISaaSWorkspace.stories.tsx":Se,"./stories/MediaManager.stories.tsx":Ce,"./stories/Menu.stories.tsx":ke,"./stories/Menubar.stories.tsx":we,"./stories/NavigationMenu.stories.tsx":Te,"./stories/PIIRedactionScenario.stories.tsx":Re,"./stories/Pagination.stories.tsx":Pe,"./stories/PluginPanel.stories.tsx":ze,"./stories/Popover.stories.tsx":Ae,"./stories/Portal.stories.tsx":Ie,"./stories/Presence.stories.tsx":Fe,"./stories/Progress.stories.tsx":Ee,"./stories/QuickActions.stories.tsx":De,"./stories/RadioGroup.stories.tsx":Ge,"./stories/ReactIconsAISaaSDashboard.stories.tsx":Me,"./stories/Reporting.stories.tsx":Oe,"./stories/RichTextEditor.stories.tsx":Le,"./stories/ScrollArea.stories.tsx":_e,"./stories/Section.stories.tsx":We,"./stories/Select.stories.tsx":Ne,"./stories/SelectionPopup.stories.tsx":Ve,"./stories/Separator.stories.tsx":He,"./stories/Sidebar.stories.tsx":Ue,"./stories/Skeleton.stories.tsx":qe,"./stories/Slider.stories.tsx":$e,"./stories/Slot.stories.tsx":je,"./stories/Stepper.stories.tsx":Qe,"./stories/Switch.stories.tsx":Je,"./stories/Table.stories.tsx":Ze,"./stories/Tabs.stories.tsx":Ke,"./stories/Textarea.stories.tsx":Ye,"./stories/Theming.stories.tsx":Xe,"./stories/Timeline.stories.tsx":et,"./stories/Toast.stories.tsx":tt,"./stories/ToastAISaaSCenter.stories.tsx":ot,"./stories/ToastAPI.stories.tsx":at,"./stories/ToastPrimitive.stories.tsx":nt,"./stories/Toggle.stories.tsx":it,"./stories/ToggleGroup.stories.tsx":rt,"./stories/TokenGovernance.stories.tsx":st,"./stories/Toolbar.stories.tsx":lt,"./stories/Tooltip.stories.tsx":dt,"./stories/VisuallyHidden.stories.tsx":ct,"./stories/Wizard.stories.tsx":pt});function ht(e){return(e.match(/(^import[\s\S]*?;)/gm)??[]).filter(s=>{const n=s.match(/from\s+['"]([^'"]+)['"]/);return n?n[1].startsWith("@editora/"):!1}).join(`
`).trim()}function S(e){return e?e.replace(/\\/g,"/").replace(/^\.?\/?\.storybook\//,"./").replace(/^\.\//,"./"):""}function C(e){const o=e.split("/");return o[o.length-1]||e}function vt(e){const o=e.trim().match(/^<([A-Z][A-Za-z0-9_]*)\b[^>]*\/>\s*;?$/);return(o==null?void 0:o[1])??null}function bt(e){const o=e.trim(),r=o.match(/^<([A-Z][A-Za-z0-9_]*)\b[^>]*\/>\s*;?$/);if(r)return r[1];const s=o.match(/^(?:\([^)]*\)|[A-Za-z_$][A-Za-z0-9_$]*)\s*=>\s*\(?\s*<([A-Z][A-Za-z0-9_]*)\b[\s\S]*\/>\s*\)?\s*;?$/);return(s==null?void 0:s[1])??null}function yt(e){const o=e.trim().match(/^([A-Z][A-Za-z0-9_]*)\s*;?$/);return(o==null?void 0:o[1])??null}function Bt(e){const o=new Set,r=/^import\s+([\s\S]*?)\s+from\s+['"][^'"]+['"];?$/gm;let s=null;for(;(s=r.exec(e))!==null;){const n=s[1].trim();if(!n)continue;const a=n.match(/\*\s+as\s+([A-Za-z_$][A-Za-z0-9_$]*)/);a!=null&&a[1]&&o.add(a[1]);const i=n.match(/^([A-Za-z_$][A-Za-z0-9_$]*)\s*(?:,|$)/);i&&!n.startsWith("{")&&!n.startsWith("*")&&o.add(i[1]);const t=n.match(/\{([\s\S]*?)\}/);if(t!=null&&t[1]){const l=t[1].split(",").map(d=>d.trim()).filter(Boolean);for(const d of l){const u=d.replace(/^type\s+/,"").trim(),p=u.match(/^([A-Za-z_$][A-Za-z0-9_$]*)\s+as\s+([A-Za-z_$][A-Za-z0-9_$]*)$/);if(p!=null&&p[2]){o.add(p[2]);continue}/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(u)&&o.add(u)}}}return o}function y(e){const o=e.matchAll(/<([A-Z][A-Za-z0-9_]*)\b/g),r=new Set;for(const s of o)s[1]&&r.add(s[1]);return Array.from(r)}function St(e,o,r,s){let n=0,a="normal";for(let i=o;i<e.length;i+=1){const t=e[i],l=e[i+1],d=e[i-1];if(a==="line-comment"){t===`
`&&(a="normal");continue}if(a==="block-comment"){t==="*"&&l==="/"&&(a="normal",i+=1);continue}if(a==="single"){t==="'"&&d!=="\\"&&(a="normal");continue}if(a==="double"){t==='"'&&d!=="\\"&&(a="normal");continue}if(a==="template"){t==="`"&&d!=="\\"&&(a="normal");continue}if(t==="/"&&l==="/"){a="line-comment",i+=1;continue}if(t==="/"&&l==="*"){a="block-comment",i+=1;continue}if(t==="'"){a="single";continue}if(t==='"'){a="double";continue}if(t==="`"){a="template";continue}if(t===r&&(n+=1),t===s&&(n-=1,n===0))return i}return-1}function Ct(e,o){let r=0,s=0,n=0,a="normal";for(let i=o;i<e.length;i+=1){const t=e[i],l=e[i+1],d=e[i-1];if(a==="line-comment"){t===`
`&&(a="normal");continue}if(a==="block-comment"){t==="*"&&l==="/"&&(a="normal",i+=1);continue}if(a==="single"){t==="'"&&d!=="\\"&&(a="normal");continue}if(a==="double"){t==='"'&&d!=="\\"&&(a="normal");continue}if(a==="template"){t==="`"&&d!=="\\"&&(a="normal");continue}if(t==="/"&&l==="/"){a="line-comment",i+=1;continue}if(t==="/"&&l==="*"){a="block-comment",i+=1;continue}if(t==="'"){a="single";continue}if(t==='"'){a="double";continue}if(t==="`"){a="template";continue}if(t==="("&&(r+=1),t===")"&&(r=Math.max(0,r-1)),t==="{"&&(s+=1),t==="}"&&(s=Math.max(0,s-1)),t==="["&&(n+=1),t==="]"&&(n=Math.max(0,n-1)),t===";"&&r===0&&s===0&&n===0)return i}return-1}function x(e,o){const s=new RegExp(`\\bfunction\\s+${o}\\s*\\(`).exec(e);if(s){const i=e.indexOf("{",s.index);if(i!==-1){const t=St(e,i,"{","}");if(t!==-1)return e.slice(s.index,t+1).trim()}}const a=new RegExp(`\\b(?:const|let|var)\\s+${o}\\s*=`).exec(e);if(a){const i=Ct(e,a.index);if(i!==-1)return e.slice(a.index,i+1).trim()}return null}function B(e){const o=e.match(/^function\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*\(/);if(o!=null&&o[1])return o[1];const r=e.match(/^(?:const|let|var)\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*=/);return(r==null?void 0:r[1])??null}function kt(e,o){const r=Bt(e),s=y(o),n=new Set,a=[];for(;s.length>0;){const i=s.shift();if(!i||n.has(i)||(n.add(i),r.has(i)))continue;const t=x(e,i);if(!t)continue;a.push(t);const l=y(t);for(const d of l)n.has(d)||s.push(d)}return a}const k=new Map,w=new Map,T=new Map,R=new Map;for(const[e,o]of Object.entries(ft)){const r=S(e),s=C(e),n=ht(o);T.set(r,o),R.set(s,o),n&&(k.set(r,n),w.set(s,n))}function wt(e,o){if(!e)return e;const r=S(o),s=C(r||o||""),n=T.get(r)||R.get(s),a=k.get(r)||w.get(s),i=vt(e);let t=e.trim();if(i&&n){const c=x(n,i);c&&(t=c)}const l=n?bt(t):null;if(l&&n){const c=x(n,l);c&&(t=c)}const d=n?yt(t):null;if(d&&n){const c=x(n,d);c&&(t=c)}const u=n&&!/^\s*import\s/m.test(t)?kt(n,t):[],p=B(t),f=u.filter(c=>{const h=B(c);return!h||h!==p}),g=[];return a&&!/^\s*import\s/m.test(t)&&g.push(a),f.length>0&&g.push(f.join(`

`)),g.push(t),g.join(`

`).trim()}if(typeof document<"u"&&!document.getElementById("editora-not-defined-guard")){const e=document.createElement("style");e.id="editora-not-defined-guard",e.textContent=":not(:defined) { visibility: hidden; }",document.head.appendChild(e)}const Pt={decorators:[xt],parameters:{docs:{canvas:{sourceState:"shown"},source:{state:"open",type:"dynamic",transform:(e,o)=>{var r;return wt(e,(r=o==null?void 0:o.parameters)==null?void 0:r.fileName)}}},controls:{matchers:{color:/(background|color)$/i,date:/Date$/}}}};export{Pt as default};
