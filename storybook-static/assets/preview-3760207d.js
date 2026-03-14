const k=`import React from 'react';
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
`,T=`import React from 'react';
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

const showcaseFrameStyle: React.CSSProperties = {
  border: '1px solid var(--ui-color-border, #d8e1ec)',
  borderRadius: 16,
  padding: 16,
  background: 'var(--ui-color-surface, #fff)',
};

const showcaseHeadingStyle: React.CSSProperties = {
  fontSize: 12,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: 'var(--ui-color-muted, #64748b)',
  marginBottom: 10,
};

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
          background: 'color-mix(in srgb, var(--ui-accordion-accent, #2563eb) 12%, transparent)',
          color: 'var(--ui-accordion-accent, #2563eb)',
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

function DemoAccordion(props: React.ComponentProps<typeof Accordion>) {
  return (
    <Accordion collapsible {...props}>
      <AccordionItem description="What the product does" badge="Overview">
        <AccordionTrigger>What is Editora?</AccordionTrigger>
        <AccordionPanel>
          Editora is a rich text editing system with a web-component core and React wrappers.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem description="Runtime model" badge="Core">
        <AccordionTrigger>How does it work?</AccordionTrigger>
        <AccordionPanel>
          It composes token-aware web components behind React wrappers and shared theme primitives.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem description="Production guidance" badge="Usage">
        <AccordionTrigger>When should teams use it?</AccordionTrigger>
        <AccordionPanel>
          Use it for disclosure-heavy settings panels, FAQ groups, and operational workflows that need clear hierarchy.
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

export function BaselineStyles() {
  return (
    <Grid style={{ gap: 18, maxInlineSize: 1100 }}>
      <Box style={showcaseFrameStyle}>
        <Box style={showcaseHeadingStyle}>Variants</Box>
        <Grid style={{ gap: 16 }}>
          <Grid style={{ gap: 10 }}>
            <Box style={{ fontWeight: 650 }}>Surface</Box>
            <DemoAccordion variant="surface" tone="neutral" radius={12} elevation="low" />
          </Grid>
          <Grid style={{ gap: 10 }}>
            <Box style={{ fontWeight: 650 }}>Outline</Box>
            <DemoAccordion variant="outline" tone="info" radius={12} elevation="none" />
          </Grid>
          <Grid style={{ gap: 10 }}>
            <Box style={{ fontWeight: 650 }}>Soft</Box>
            <DemoAccordion variant="soft" tone="success" radius={12} elevation="none" />
          </Grid>
          <Grid style={{ gap: 10 }}>
            <Box style={{ fontWeight: 650 }}>Solid</Box>
            <DemoAccordion variant="solid" tone="warning" radius={12} elevation="low" />
          </Grid>
          <Grid style={{ gap: 10 }}>
            <Box style={{ fontWeight: 650 }}>Ghost</Box>
            <DemoAccordion variant="ghost" tone="danger" radius={12} elevation="none" />
          </Grid>
          <Grid style={{ gap: 10 }}>
            <Box style={{ fontWeight: 650 }}>Without indicator</Box>
            <DemoAccordion variant="outline" tone="info" radius={12} elevation="none" indicator="none" />
          </Grid>
        </Grid>
      </Box>

      <Grid columns={2} style={{ gap: 16 }}>
        <Box style={showcaseFrameStyle}>
          <Box style={showcaseHeadingStyle}>Sizes</Box>
          <Grid style={{ gap: 14 }}>
            <Grid style={{ gap: 8 }}>
              <Box style={{ fontWeight: 650 }}>Small</Box>
              <DemoAccordion size="sm" radius={8} />
            </Grid>
            <Grid style={{ gap: 8 }}>
              <Box style={{ fontWeight: 650 }}>Medium</Box>
              <DemoAccordion size="md" radius={12} />
            </Grid>
            <Grid style={{ gap: 8 }}>
              <Box style={{ fontWeight: 650 }}>Large</Box>
              <DemoAccordion size="lg" radius={16} />
            </Grid>
          </Grid>
        </Box>

        <Box style={showcaseFrameStyle}>
          <Box style={showcaseHeadingStyle}>Radius</Box>
          <Grid style={{ gap: 14 }}>
            <Grid style={{ gap: 8 }}>
              <Box style={{ fontWeight: 650 }}>0</Box>
              <DemoAccordion radius={0} variant="outline" />
            </Grid>
            <Grid style={{ gap: 8 }}>
              <Box style={{ fontWeight: 650 }}>4</Box>
              <DemoAccordion radius={4} variant="outline" />
            </Grid>
            <Grid style={{ gap: 8 }}>
              <Box style={{ fontWeight: 650 }}>12</Box>
              <DemoAccordion radius={12} variant="outline" />
            </Grid>
            <Grid style={{ gap: 8 }}>
              <Box style={{ fontWeight: 650 }}>Full</Box>
              <DemoAccordion radius="full" variant="outline" />
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}

export function FAQPattern() {
  return (
    <Grid style={{ gap: 16, maxInlineSize: 860 }}>
      <Box style={{ ...showcaseFrameStyle, padding: 24 }}>
        <Box style={{ fontWeight: 700, fontSize: 28, lineHeight: 1.15, marginBottom: 8 }}>Frequently asked questions</Box>
        <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 15, lineHeight: 1.6, marginBottom: 18 }}>
          A cleaner, customer-facing disclosure pattern with low-noise borders and generous reading rhythm.
        </Box>
        <Accordion collapsible variant="outline" radius={12} size="lg" tone="neutral" elevation="none">
          <AccordionItem description="Deployment model and editor surface">
            <AccordionTrigger>Can teams use Editora in both React and plain web components?</AccordionTrigger>
            <AccordionPanel>
              Yes. The system ships a custom-element core and React wrappers so product teams can adopt the same
              primitives across both integration styles.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem description="Lifecycle, upgrades, and adoption strategy">
            <AccordionTrigger>How should we roll it out inside an existing design system?</AccordionTrigger>
            <AccordionPanel>
              Start with infrastructure primitives and form controls, then move high-traffic composed components such
              as menus, dialogs, and editor workflows.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem description="Tokens, themes, and Storybook alignment">
            <AccordionTrigger>Does it support product-level theming without forking styles?</AccordionTrigger>
            <AccordionPanel>
              Yes. The baseline theme system exposes semantic and component-level tokens so teams can tune color,
              radius, motion, density, and elevation without rewriting component CSS.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    </Grid>
  );
}

export function SettingsSidebarPattern() {
  return (
    <Grid columns={2} style={{ gap: 18, maxInlineSize: 1180, alignItems: 'start' }}>
      <Box style={{ ...showcaseFrameStyle, padding: 18 }}>
        <Box style={showcaseHeadingStyle}>Compact sidebar pattern</Box>
        <Accordion multiple variant="ghost" tone="neutral" size="sm" radius={8} elevation="none" open={[0, 2]}>
          <AccordionItem description="Identity, roles, workspace metadata" badge="Core">
            <AccordionTrigger>Workspace settings</AccordionTrigger>
            <AccordionPanel>
              Naming rules, environment labels, ownership metadata, and internal access settings.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem description="Data retention and access events" badge="Audit">
            <AccordionTrigger>Security and compliance</AccordionTrigger>
            <AccordionPanel>
              Access reviews, retention windows, export controls, and event retention policies.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem description="Theme, typography, and interaction defaults" badge="Brand">
            <AccordionTrigger>Appearance controls</AccordionTrigger>
            <AccordionPanel>
              Color system, density preferences, component radius, and motion policy configuration.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>

      <Box style={{ ...showcaseFrameStyle, padding: 18 }}>
        <Box style={showcaseHeadingStyle}>High-signal sections</Box>
        <Grid style={{ gap: 12 }}>
          <Box style={{ padding: 16, borderRadius: 12, background: 'var(--ui-color-surface-alt, #f8fafc)' }}>
            Keep sidebar accordions compact, border-light, and collapsible by default.
          </Box>
          <Box style={{ padding: 16, borderRadius: 12, background: 'var(--ui-color-surface-alt, #f8fafc)' }}>
            Use \`ghost\` or \`outline\` for utility-heavy settings shells where the accordion should recede behind content.
          </Box>
          <Box style={{ padding: 16, borderRadius: 12, background: 'var(--ui-color-surface-alt, #f8fafc)' }}>
            Reserve \`solid\` or stronger tones for workflows where state emphasis matters more than chrome reduction.
          </Box>
        </Grid>
      </Box>
    </Grid>
  );
}

export function ControlledSingleOpen() {
  const [open, setOpen] = React.useState<number | number[]>(0);

  return (
    <Grid style={{ gap: 16, maxInlineSize: 900 }}>
      <Box style={{ ...showcaseFrameStyle, padding: 20 }}>
        <Flex align="center" justify="space-between" style={{ gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
          <Box>
            <Box style={{ fontWeight: 700, fontSize: 20 }}>Controlled operations review</Box>
            <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13, marginTop: 4 }}>
              Single-open mode managed by React state.
            </Box>
          </Box>
          <Flex style={{ gap: 8, flexWrap: 'wrap' }}>
            <Button size="sm" variant="secondary" onClick={() => setOpen(0)}>
              Open Summary
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setOpen(1)}>
              Open Safety
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setOpen(2)}>
              Open Discharge
            </Button>
          </Flex>
        </Flex>

        <Accordion open={open} onToggle={setOpen} variant="soft" tone="info" radius={12} size="md">
          {sections.map((section, index) => (
            <AccordionItem key={section.title} description={section.subtitle} badge={section.badge}>
              <AccordionTrigger>{section.title}</AccordionTrigger>
              <AccordionPanel>
                {section.points[index % section.points.length]}
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Box>
    </Grid>
  );
}

export function ToneGallery() {
  return (
    <Grid columns={2} style={{ gap: 16, maxInlineSize: 1100 }}>
      {[
        ['Info', 'info', 'outline'],
        ['Success', 'success', 'soft'],
        ['Warning', 'warning', 'solid'],
        ['Danger', 'danger', 'outline'],
      ].map(([label, tone, variant]) => (
        <Box key={label} style={{ ...showcaseFrameStyle, padding: 18 }}>
          <Box style={{ ...showcaseHeadingStyle, marginBottom: 12 }}>{label}</Box>
          <DemoAccordion
            variant={variant as React.ComponentProps<typeof Accordion>['variant']}
            tone={tone as React.ComponentProps<typeof Accordion>['tone']}
            radius={12}
            size="md"
            elevation={variant === 'solid' ? 'low' : 'none'}
          />
        </Box>
      ))}
    </Grid>
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
        variant="surface"
        tone="info"
        size="md"
        radius={16}
        elevation="low"
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
`,z=`import React from 'react';
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
`,P=`import React from 'react';
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
`,R=`import React from 'react';
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
        onConfirm={(detail) => setLastEvent(\`confirm:critical checked=\${String(detail.checked)}\`)}
        onCancel={() => setLastEvent('cancel:critical')}
        onDismiss={(detail) => setLastEvent(\`dismiss:critical:\${detail.source}\`)}
        onClose={(detail) => {
          setOpenCritical(false);
          setLastEvent(\`close:critical:\${detail.action}\${detail.source ? \`:\${detail.source}\` : ''}\`);
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
        onDismiss={(detail) => setLastEvent(\`dismiss:policy:\${detail.source}\`)}
        onClose={(detail) => {
          setOpenReview(false);
          setLastEvent(\`close:policy:\${detail.action}\${detail.source ? \`:\${detail.source}\` : ''}\`);
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
`,I=`import React from 'react';
import type { Meta } from '@storybook/react';
import { AlertDialogProvider, Box, Button, Flex, Grid, useAlertDialog } from '@editora/ui-react';

const meta: Meta = {
  title: 'UI/AlertDialogPromise'
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

function PromiseConsole() {
  const dialogs = useAlertDialog();
  const [result, setResult] = React.useState('No result yet');

  const runAlert = async () => {
    const next = await dialogs.alert({
      title: 'Maintenance complete',
      description: 'Your deployment finished successfully.',
      confirmText: 'Great',
      tone: 'success'
    });
    setResult(JSON.stringify(next));
  };

  const runConfirm = async () => {
    const next = await dialogs.confirm({
      title: 'Delete customer account?',
      description: 'This cannot be undone and will remove all related records.',
      confirmText: 'Delete',
      cancelText: 'Keep',
      tone: 'danger',
      onConfirm: async () => {
        await new Promise((resolve) => setTimeout(resolve, 700));
      },
      onCancel: async () => {
        await new Promise((resolve) => setTimeout(resolve, 180));
      },
      onDismiss: async () => {
        await new Promise((resolve) => setTimeout(resolve, 120));
      }
    });
    setResult(JSON.stringify(next));
  };

  const runPrompt = async () => {
    const next = await dialogs.prompt({
      title: 'Rename workspace',
      description: 'Use 3+ characters. This demonstrates validation and async confirm.',
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
      onConfirm: async ({ value }) => {
        await new Promise((resolve) => setTimeout(resolve, 900));
        if (value?.toLowerCase() === 'error') {
          throw new Error('"error" is reserved. Use another name.');
        }
      }
    });

    setResult(JSON.stringify(next));
  };

  return (
    <SurfaceFrame>
      <Grid style={{ gap: 12 }}>
        <Box>
          <Box style={{ fontWeight: 700, fontSize: 18 }}>Promise-driven confirmation flows</Box>
          <Box style={{ color: 'var(--ui-muted, #646464)', fontSize: 13, marginTop: 4 }}>
            Provider defaults keep promise dialogs visually aligned without repeating the same shell props on every call.
          </Box>
        </Box>
        <Flex gap="10px" wrap="wrap">
          <Button onClick={runAlert}>Run alert</Button>
          <Button variant="secondary" onClick={runConfirm}>
            Run confirm
          </Button>
          <Button variant="ghost" onClick={runPrompt}>
            Run prompt
          </Button>
        </Flex>
        <Box
          style={{
            border: '1px solid var(--base-panel-border, var(--ui-border))',
            borderRadius: 'var(--ui-radius, 4px)',
            padding: 12,
            fontSize: 13,
            color: 'var(--ui-muted, #646464)'
          }}
        >
          Result: <code>{result}</code>
        </Box>
      </Grid>
    </SurfaceFrame>
  );
}

export function ProductionWorkflow() {
  return (
    <AlertDialogProvider
      defaults={{
        variant: 'soft',
        tone: 'warning',
        radius: 12,
        elevation: 'high',
        indicator: 'line',
        closeOnBackdrop: false
      }}
    >
      <PromiseConsole />
    </AlertDialogProvider>
  );
}

function VariantHarness() {
  const dialogs = useAlertDialog();

  const openVariant = (variant: 'surface' | 'soft' | 'outline' | 'solid') => {
    void dialogs.confirm({
      title: \`\${variant[0].toUpperCase()}\${variant.slice(1)} dialog\`,
      description: 'The promise API now carries the same visual system props as the base component.',
      variant,
      tone: variant === 'solid' ? 'danger' : 'warning',
      radius: 12,
      elevation: variant === 'outline' ? 'none' : 'high',
      indicator: variant === 'surface' ? 'none' : 'line',
      confirmText: 'Continue',
      cancelText: 'Cancel'
    });
  };

  return (
    <SurfaceFrame>
      <Grid style={{ gap: 12 }}>
        <Box>
          <Box style={{ fontWeight: 700, fontSize: 18 }}>Variant gallery</Box>
          <Box style={{ color: 'var(--ui-muted, #646464)', fontSize: 13, marginTop: 4 }}>
            Use provider defaults for baseline behavior, then override variant props per workflow when needed.
          </Box>
        </Box>
        <Flex gap="10px" wrap="wrap">
          <Button onClick={() => openVariant('surface')}>Surface</Button>
          <Button onClick={() => openVariant('soft')}>Soft</Button>
          <Button onClick={() => openVariant('outline')}>Outline</Button>
          <Button onClick={() => openVariant('solid')}>Solid</Button>
        </Flex>
      </Grid>
    </SurfaceFrame>
  );
}

export function VariantRecipes() {
  return (
    <AlertDialogProvider defaults={{ size: 'lg', closeOnBackdrop: false }}>
      <VariantHarness />
    </AlertDialogProvider>
  );
}
`,A=`import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  AppHeader,
  AppHeaderCenter,
  AppHeaderEnd,
  AppHeaderStart,
  AppHeaderSubtitle,
  AppHeaderTitle,
  Badge,
  Box,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Flex,
  Grid,
} from '@editora/ui-react';
import { BellIcon, SearchIcon, ShieldIcon, SparklesIcon } from '@editora/react-icons';

const meta: Meta<typeof AppHeader> = {
  title: 'UI/AppHeader',
  component: AppHeader,
  args: {
    bordered: true,
    sticky: false,
    variant: 'surface',
    tone: 'neutral',
    size: 'md',
    elevation: 'low',
    radius: 12,
  },
  argTypes: {
    variant: { control: 'select', options: ['surface', 'soft', 'outline', 'solid'] },
    tone: { control: 'select', options: ['neutral', 'info', 'success', 'warning', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    elevation: { control: 'select', options: ['none', 'low', 'high'] },
    radius: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof AppHeader>;

function HeaderChrome(props: React.ComponentProps<typeof AppHeader>) {
  return (
    <AppHeader {...props} style={{ width: '100%' }}>
      <AppHeaderStart>
        <Flex align="center" style={{ gap: 10 }}>
          <Box
            style={{
              width: 30,
              height: 30,
              borderRadius: 10,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'color-mix(in srgb, var(--ui-color-primary, #2563eb) 12%, transparent)',
              color: 'var(--ui-color-primary, #2563eb)',
            }}
          >
            <ShieldIcon size={15} />
          </Box>
          <Flex direction="column" style={{ gap: 0 }}>
            <Box style={{ fontWeight: 600 }}>Editora Ops</Box>
          </Flex>
        </Flex>
      </AppHeaderStart>

      <AppHeaderCenter>
        <Badge tone="info" variant="soft">Live</Badge>
      </AppHeaderCenter>

      <AppHeaderTitle>Clinical Command Center</AppHeaderTitle>
      <AppHeaderSubtitle>North campus · Shift A · 08:15 UTC</AppHeaderSubtitle>

      <AppHeaderEnd>
        <Button size="sm" recipe="soft" variant="secondary">
          <SearchIcon size={14} />
          Search
        </Button>
        <Button size="sm" recipe="soft" variant="secondary">
          <BellIcon size={14} />
          Alerts
        </Button>
      </AppHeaderEnd>
    </AppHeader>
  );
}

function InteractiveHeaderShell(props: React.ComponentProps<typeof AppHeader>) {
  const [navOpen, setNavOpen] = React.useState(false);

  return (
    <Grid style={{ gap: 12 }}>
      <HeaderChrome
        {...props}
        showMenuButton
        onMenuTrigger={() => setNavOpen((open) => !open)}
      />
      <Box
        style={{
          display: navOpen ? 'block' : 'none',
          padding: 14,
          borderRadius: 14,
          border: '1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent)',
          background: 'color-mix(in srgb, var(--ui-color-surface-alt, #f8fafc) 78%, transparent)',
        }}
      >
        <Flex direction="column" style={{ gap: 8 }}>
          <Box style={{ fontWeight: 600 }}>Navigation</Box>
          <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>
            Dashboard, Patients, Staffing, and Billing are available from the app shell.
          </Box>
        </Flex>
      </Box>
    </Grid>
  );
}

export const Playground: Story = {
  render: (args) => (
    <Grid style={{ gap: 16 }}>
      <Card radius={16}>
        <CardHeader>
          <CardTitle>App header</CardTitle>
        <CardDescription>
          Token-backed shell for branding, title context, search/actions, and mobile navigation.
        </CardDescription>
        </CardHeader>
        <Box slot="inset" style={{ padding: 12 }}>
          <InteractiveHeaderShell {...args} />
        </Box>
      </Card>
    </Grid>
  ),
};

export const VariantGallery: Story = {
  render: () => (
    <Grid style={{ gap: 14 }}>
      {[
        { label: 'Surface', variant: 'surface', tone: 'neutral' },
        { label: 'Soft', variant: 'soft', tone: 'info' },
        { label: 'Outline', variant: 'outline', tone: 'warning' },
        { label: 'Solid', variant: 'solid', tone: 'info' },
      ].map((entry) => (
        <Grid key={entry.label} style={{ gap: 8 }}>
          <Box style={{ fontSize: 13, fontWeight: 600, color: 'var(--ui-color-muted, #64748b)' }}>{entry.label}</Box>
          <HeaderChrome
            bordered
            showMenuButton
            variant={entry.variant as 'surface' | 'soft' | 'outline' | 'solid'}
            tone={entry.tone as 'neutral' | 'info' | 'warning'}
            radius={12}
          />
        </Grid>
      ))}
    </Grid>
  ),
};

export const SizeGallery: Story = {
  render: () => (
    <Grid style={{ gap: 14 }}>
      {[
        { label: 'Small', size: 'sm' },
        { label: 'Medium', size: 'md' },
        { label: 'Large', size: 'lg' },
      ].map((entry) => (
        <Grid key={entry.label} style={{ gap: 8 }}>
          <Box style={{ fontSize: 13, fontWeight: 600, color: 'var(--ui-color-muted, #64748b)' }}>{entry.label}</Box>
          <HeaderChrome
            bordered
            showMenuButton
            size={entry.size as 'sm' | 'md' | 'lg'}
            radius={entry.size === 'lg' ? 16 : 12}
          />
        </Grid>
      ))}
    </Grid>
  ),
};

export const ProductShellPattern: Story = {
  render: () => (
    <Grid style={{ gap: 14 }}>
      <InteractiveHeaderShell
        sticky
        bordered
        variant="soft"
        tone="info"
        elevation="low"
        radius={16}
      />
      <Grid style={{ gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {[
          {
            title: 'Critical escalations',
            description: '3 cases require acknowledgment inside the next 30 minutes.',
          },
          {
            title: 'Automation coverage',
            description: '92% of nightly triage rules completed without manual intervention.',
          },
          {
            title: 'Priority releases',
            description: 'Two release trains are queued for clinical review and approval.',
          },
        ].map((card) => (
          <Card key={card.title} variant="soft" radius={16}>
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </Grid>
      <Box
        style={{
          padding: 16,
          borderRadius: 16,
          border: '1px dashed color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent)',
          color: 'var(--ui-color-muted, #64748b)',
        }}
      >
        Scrollable workspace content begins here. The header remains visually stable and can switch between surface,
        soft, outline, and solid treatments without story-specific CSS overrides.
      </Box>
    </Grid>
  ),
};

export const DenseUtilityRail: Story = {
  render: () => (
    <HeaderChrome
      dense
      bordered
      showMenuButton
      variant="outline"
      tone="neutral"
      radius={8}
      elevation="none"
    />
  ),
};

export const SignalBar: Story = {
  render: () => (
    <AppHeader variant="solid" tone="success" size="sm" bordered radius={12}>
      <AppHeaderStart>
        <Flex align="center" style={{ gap: 8, fontWeight: 600 }}>
          <SparklesIcon size={14} />
          Deployment complete
        </Flex>
      </AppHeaderStart>
      <AppHeaderTitle>Release 2026.03.12.4 is now active</AppHeaderTitle>
      <AppHeaderSubtitle>Observability checks are healthy across all regions</AppHeaderSubtitle>
      <AppHeaderEnd>
        <Button size="sm" recipe="surface" variant="secondary">
          View changes
        </Button>
      </AppHeaderEnd>
    </AppHeader>
  ),
};
`,F=`import type { Meta, StoryObj } from "@storybook/react";
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
`,G=`import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AspectRatio, Box, Button, Card, CardDescription, CardHeader, CardTitle, Flex, Grid } from '@editora/ui-react';
import { CameraIcon, CheckCircleIcon, ImageIcon, PlayCircleIcon } from '@editora/react-icons';

const meta: Meta<typeof AspectRatio> = {
  title: 'UI/AspectRatio',
  component: AspectRatio,
  args: {
    ratio: '16/9',
    fit: 'cover',
    variant: 'surface',
    tone: 'neutral',
    size: 'md',
    elevation: 'none',
    radius: 12,
  },
  argTypes: {
    variant: { control: 'select', options: ['surface', 'soft', 'outline', 'solid'] },
    tone: { control: 'select', options: ['neutral', 'info', 'success', 'warning', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    elevation: { control: 'select', options: ['none', 'low', 'high'] },
    fit: { control: 'select', options: ['cover', 'contain', 'fill', 'none', 'scale-down'] },
  },
};

export default meta;

type Story = StoryObj<typeof AspectRatio>;

const imageUrl = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1400&q=80';

export const Playground: Story = {
  render: (args) => (
    <Grid style={{ gap: 16 }}>
      <Card radius={16}>
        <CardHeader>
          <CardTitle>Aspect ratio</CardTitle>
          <CardDescription>
            Stable media frames for previews, thumbnails, editorial cards, and workflow canvases.
          </CardDescription>
        </CardHeader>
        <Box slot="inset" style={{ padding: 12 }}>
          <AspectRatio {...args} showRatioBadge style={{ width: '100%' }}>
            <img src={imageUrl} alt="Operations team reviewing dashboards" />
          </AspectRatio>
        </Box>
      </Card>
    </Grid>
  ),
};

export const VariantGallery: Story = {
  render: () => (
    <Grid style={{ gap: 14 }}>
      {[
        { label: 'Surface', variant: 'surface', tone: 'neutral' },
        { label: 'Soft', variant: 'soft', tone: 'info' },
        { label: 'Outline', variant: 'outline', tone: 'warning' },
        { label: 'Solid', variant: 'solid', tone: 'success' },
      ].map((entry) => (
        <Grid key={entry.label} style={{ gap: 8 }}>
          <Box style={{ fontSize: 13, fontWeight: 600, color: 'var(--ui-color-muted, #64748b)' }}>{entry.label}</Box>
          <AspectRatio
            ratio="16/9"
            showRatioBadge
            variant={entry.variant as 'surface' | 'soft' | 'outline' | 'solid'}
            tone={entry.tone as 'neutral' | 'info' | 'warning' | 'success'}
            radius={12}
            style={{ width: '100%' }}
          >
            <img src={imageUrl} alt={\`\${entry.label} preview\`} />
          </AspectRatio>
        </Grid>
      ))}
    </Grid>
  ),
};

export const SizeGallery: Story = {
  render: () => (
    <Grid style={{ gap: 14 }}>
      {[
        { label: 'Small', size: 'sm', radius: 8 },
        { label: 'Medium', size: 'md', radius: 12 },
        { label: 'Large', size: 'lg', radius: 16 },
      ].map((entry) => (
        <Grid key={entry.label} style={{ gap: 8 }}>
          <Box style={{ fontSize: 13, fontWeight: 600, color: 'var(--ui-color-muted, #64748b)' }}>{entry.label}</Box>
          <AspectRatio
            ratio="4/3"
            size={entry.size as 'sm' | 'md' | 'lg'}
            radius={entry.radius}
            tone="info"
            variant="soft"
            showRatioBadge
            style={{ width: '100%' }}
          >
            <img src={imageUrl} alt={\`\${entry.label} media frame\`} />
          </AspectRatio>
        </Grid>
      ))}
    </Grid>
  ),
};

export const MediaOpsWorkflow: Story = {
  render: () => {
    const [ratio, setRatio] = React.useState<'16/9' | '4/3' | '1/1'>('16/9');
    const [fit, setFit] = React.useState<'cover' | 'contain'>('cover');

    return (
      <Grid style={{ gap: 14, maxInlineSize: 980 }}>
        <Flex align="center" justify="space-between" style={{ gap: 12, flexWrap: 'wrap' }}>
          <Box>
            <Box style={{ fontWeight: 700, fontSize: 18 }}>Media composition surface</Box>
            <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13, marginTop: 4 }}>
              Production preview frames for campaign assets, dashboard thumbnails, and review queues.
            </Box>
          </Box>
          <Flex align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
            <Button size="sm" recipe="soft" variant="secondary" onClick={() => setRatio('16/9')}>
              16:9
            </Button>
            <Button size="sm" recipe="soft" variant="secondary" onClick={() => setRatio('4/3')}>
              4:3
            </Button>
            <Button size="sm" recipe="soft" variant="secondary" onClick={() => setRatio('1/1')}>
              1:1
            </Button>
            <Button size="sm" onClick={() => setFit((current) => (current === 'cover' ? 'contain' : 'cover'))}>
              Toggle Fit
            </Button>
          </Flex>
        </Flex>

        <AspectRatio ratio={ratio} fit={fit} tone="info" interactive showRatioBadge radius={16} elevation="low">
          <img src={imageUrl} alt="Operations team reviewing clinical dashboards" />
        </AspectRatio>

        <Grid style={{ gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <AspectRatio ratio="1/1" tone="success" variant="soft" showRatioBadge radius={12}>
            <Flex style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#0f172a' }}>
              <CheckCircleIcon size={16} />
              Approved thumbnail
            </Flex>
          </AspectRatio>

          <AspectRatio ratio="4/3" tone="warning" variant="soft" showRatioBadge radius={0}>
            <Flex style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#0f172a' }}>
              <CameraIcon size={16} />
              Capture queue
            </Flex>
          </AspectRatio>

          <AspectRatio ratio="16/9" tone="danger" variant="soft" showRatioBadge radius={12}>
            <Flex style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#0f172a' }}>
              <PlayCircleIcon size={16} />
              Pending review
            </Flex>
          </AspectRatio>
        </Grid>

        <Flex justify="end" style={{ gap: 8, flexWrap: 'wrap' }}>
          <Button size="sm" recipe="soft" variant="secondary">
            <ImageIcon size={14} />
            Generate preview
          </Button>
          <Button size="sm">Save layout</Button>
        </Flex>
      </Grid>
    );
  },
};

export const EmptyStates: Story = {
  render: () => (
    <Grid style={{ gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
      <AspectRatio ratio="16/9" showRatioBadge variant="surface" radius={12} />
      <AspectRatio ratio="4/3" showRatioBadge variant="soft" tone="info" radius={12} />
      <AspectRatio ratio="1/1" showRatioBadge variant="outline" tone="warning" radius={12} />
    </Grid>
  ),
};
`,D=`import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, Box, Button, Card, CardDescription, CardHeader, CardTitle, Flex, Grid } from '@editora/ui-react';
import { ActivityIcon, BellIcon, CheckCircleIcon, ClockIcon, ShieldIcon } from '@editora/react-icons';

const meta: Meta<typeof Avatar> = {
  title: 'UI/Avatar',
  component: Avatar,
  args: {
    variant: 'surface',
    tone: 'neutral',
    size: 'md',
    elevation: 'low',
    radius: 'full',
  },
  argTypes: {
    variant: { control: 'select', options: ['surface', 'soft', 'outline', 'solid'] },
    tone: { control: 'select', options: ['neutral', 'info', 'success', 'warning', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    elevation: { control: 'select', options: ['none', 'low', 'high'] },
  },
};

export default meta;

type Story = StoryObj<typeof Avatar>;

const clinicians = [
  {
    id: 'dr-ava',
    name: 'Dr. Ava Singh',
    role: 'ICU Lead',
    status: 'online' as const,
    tone: 'success' as const,
    badge: '1',
    src: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    id: 'nurse-luca',
    name: 'Luca Chen',
    role: 'Charge Nurse',
    status: 'away' as const,
    tone: 'warning' as const,
    state: 'loading' as const,
    badge: '2',
    src: 'https://randomuser.me/api/portraits/men/35.jpg',
  },
  {
    id: 'dr-omar',
    name: 'Dr. Omar Hale',
    role: 'Cardiology',
    status: 'busy' as const,
    tone: 'danger' as const,
    src: 'https://randomuser.me/api/portraits/men/48.jpg',
  },
];

export const Playground: Story = {
  render: (args) => (
    <Grid style={{ gap: 16 }}>
      <Card radius={16}>
        <CardHeader>
          <CardTitle>Avatar</CardTitle>
          <CardDescription>
            Identity surface for people, queues, and entities with presence, badge, and fallback states.
          </CardDescription>
        </CardHeader>
        <Box slot="inset" style={{ padding: 12 }}>
          <Flex align="center" style={{ gap: 12 }}>
            <Avatar
              {...args}
              src="https://randomuser.me/api/portraits/women/68.jpg"
              alt="Dr. Ava Singh"
              status="online"
              badge="1"
              interactive
            />
            <Flex direction="column" style={{ gap: 2 }}>
              <Box style={{ fontWeight: 600 }}>Dr. Ava Singh</Box>
              <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>ICU Lead</Box>
            </Flex>
          </Flex>
        </Box>
      </Card>
    </Grid>
  ),
};

export const VariantGallery: Story = {
  render: () => (
    <Grid style={{ gap: 14 }}>
      {[
        { label: 'Surface', variant: 'surface', tone: 'neutral' },
        { label: 'Soft', variant: 'soft', tone: 'info' },
        { label: 'Outline', variant: 'outline', tone: 'warning' },
        { label: 'Solid', variant: 'solid', tone: 'success' },
      ].map((entry) => (
        <Grid key={entry.label} style={{ gap: 8 }}>
          <Box style={{ fontSize: 13, fontWeight: 600, color: 'var(--ui-color-muted, #64748b)' }}>{entry.label}</Box>
          <Flex align="center" style={{ gap: 12 }}>
            <Avatar
              alt={\`\${entry.label} avatar\`}
              initials="EA"
              variant={entry.variant as 'surface' | 'soft' | 'outline' | 'solid'}
              tone={entry.tone as 'neutral' | 'info' | 'warning' | 'success'}
              radius="full"
              elevation="low"
            />
            <Avatar
              alt={\`\${entry.label} image avatar\`}
              src="https://randomuser.me/api/portraits/women/68.jpg"
              variant={entry.variant as 'surface' | 'soft' | 'outline' | 'solid'}
              tone={entry.tone as 'neutral' | 'info' | 'warning' | 'success'}
              radius={12}
              shape="rounded"
            />
          </Flex>
        </Grid>
      ))}
    </Grid>
  ),
};

export const SizeGallery: Story = {
  render: () => (
    <Grid style={{ gap: 14 }}>
      {[
        { label: 'Small', size: 'sm' },
        { label: 'Medium', size: 'md' },
        { label: 'Large', size: 'lg' },
      ].map((entry) => (
        <Grid key={entry.label} style={{ gap: 8 }}>
          <Box style={{ fontSize: 13, fontWeight: 600, color: 'var(--ui-color-muted, #64748b)' }}>{entry.label}</Box>
          <Flex align="center" style={{ gap: 12 }}>
            <Avatar size={entry.size as 'sm' | 'md' | 'lg'} initials="AV" tone="info" />
            <Avatar
              size={entry.size as 'sm' | 'md' | 'lg'}
              src="https://randomuser.me/api/portraits/women/68.jpg"
              alt="Dr. Ava Singh"
              status="online"
              badge="1"
              tone="success"
            />
          </Flex>
        </Grid>
      ))}
    </Grid>
  ),
};

export const StateGallery: Story = {
  render: () => (
    <Grid style={{ gap: 14 }}>
      <Flex align="center" style={{ gap: 12, flexWrap: 'wrap' }}>
        <Avatar initials="ID" state="idle" tone="neutral" />
        <Avatar initials="LD" state="loading" tone="info" />
        <Avatar initials="ER" state="error" tone="danger" />
        <Avatar initials="OK" state="success" tone="success" />
        <Avatar initials="DS" disabled />
      </Flex>
    </Grid>
  ),
};

export const ClinicalRosterWorkflow: Story = {
  render: () => {
    const [selected, setSelected] = React.useState(clinicians[0]?.id || '');
    const selectedMember = clinicians.find((member) => member.id === selected) || clinicians[0];

    return (
      <Grid style={{ gap: 14, maxInlineSize: 980 }}>
        <Box
          style={{
            border: '1px solid var(--ui-color-border, #d8e1ec)',
            borderRadius: 16,
            padding: 16,
            background: 'color-mix(in srgb, var(--ui-color-primary, #2563eb) 4%, var(--ui-color-surface, #fff))',
          }}
        >
          <Flex align="center" justify="space-between" style={{ gap: 12, flexWrap: 'wrap' }}>
            <Box>
              <Box style={{ fontWeight: 700, fontSize: 18 }}>Clinical presence roster</Box>
              <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13, marginTop: 4 }}>
                Presence, fallback, queue badges, and quick escalation actions for live operations.
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
                      size="lg"
                      status={member.status}
                      tone={member.tone}
                      state={isActive ? 'success' : member.state}
                      badge={member.badge}
                      interactive
                      disabled={member.state === 'loading'}
                      ring={isActive}
                      variant={isActive ? 'solid' : 'soft'}
                      onClick={() => setSelected(member.id)}
                    />
                    <Box style={{ minWidth: 0 }}>
                      <Box style={{ fontWeight: 650, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.name}</Box>
                      <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)', marginTop: 2 }}>{member.role}</Box>
                    </Box>
                  </Flex>
                  <Flex align="center" style={{ gap: 5, fontSize: 11, color: isActive ? 'var(--ui-color-primary, #2563eb)' : 'var(--ui-color-muted, #64748b)' }}>
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
              <Button size="sm" recipe="soft" variant="secondary">
                <BellIcon size={14} />
                Notify
              </Button>
              <Button size="sm">
                <CheckCircleIcon size={14} />
                Assign lead
              </Button>
            </Flex>
          </Flex>
        </Box>
      </Grid>
    );
  },
};
`,M=`import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge, Box, Button, Card, CardDescription, CardHeader, CardTitle, Flex, Grid } from '@editora/ui-react';
import { ActivityIcon, AlertTriangleIcon, CheckCircleIcon, ClockIcon, ShieldIcon, XCircleIcon } from '@editora/react-icons';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  args: {
    tone: 'neutral',
    variant: 'surface',
    size: 'md',
    radius: 'full',
    elevation: 'none',
    state: 'idle',
    dot: false,
    interactive: false,
    removable: false,
    disabled: false,
    truncate: false,
    text: 'Operations',
  },
  argTypes: {
    tone: { control: 'select', options: ['neutral', 'info', 'success', 'warning', 'danger', 'purple'] },
    variant: { control: 'select', options: ['surface', 'soft', 'solid', 'outline', 'ghost'] },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', '1', '2', '3'] },
    radius: { control: 'text' },
    elevation: { control: 'select', options: ['none', 'low', 'high'] },
    state: { control: 'select', options: ['idle', 'loading', 'error', 'success'] },
    dot: { control: 'boolean' },
    interactive: { control: 'boolean' },
    removable: { control: 'boolean' },
    disabled: { control: 'boolean' },
    truncate: { control: 'boolean' },
    maxWidth: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Playground: Story = {
  render: (args) => (
    <Grid style={{ gap: 16, maxInlineSize: 760 }}>
      <Card radius={16}>
        <CardHeader>
          <CardTitle>Badge</CardTitle>
          <CardDescription>
            Compact status surface for workflow labels, queue states, live filters, and removable metadata chips.
          </CardDescription>
        </CardHeader>
        <Box slot="inset" style={{ padding: 16 }}>
          <Flex align="center" justify="space-between" style={{ gap: 12, flexWrap: 'wrap' }}>
            <Flex align="center" style={{ gap: 10, flexWrap: 'wrap' }}>
              <Badge {...args}>{args.text}</Badge>
              <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>
                Attached to the real \`ui-badge\` API: tone, variant, size, radius, elevation, state, and interaction props.
              </Box>
            </Flex>
          </Flex>
        </Box>
      </Card>
    </Grid>
  ),
};

export const VariantGallery: Story = {
  render: () => (
    <Grid style={{ gap: 14, maxInlineSize: 980 }}>
      {[
        { label: 'Surface', variant: 'surface', tone: 'neutral', icon: <ShieldIcon size={12} /> },
        { label: 'Soft', variant: 'soft', tone: 'info', icon: <ActivityIcon size={12} /> },
        { label: 'Outline', variant: 'outline', tone: 'warning', icon: <ClockIcon size={12} /> },
        { label: 'Solid', variant: 'solid', tone: 'success', icon: <CheckCircleIcon size={12} /> },
        { label: 'Ghost', variant: 'ghost', tone: 'danger', icon: <AlertTriangleIcon size={12} /> },
      ].map((entry) => (
        <Grid key={entry.label} style={{ gap: 8 }}>
          <Box style={{ fontSize: 13, fontWeight: 600, color: 'var(--ui-color-muted, #64748b)' }}>{entry.label}</Box>
          <Flex align="center" style={{ gap: 10, flexWrap: 'wrap' }}>
            <Badge variant={entry.variant as any} tone={entry.tone as any} radius="full">
              <span slot="icon">{entry.icon}</span>
              {entry.label} workflow
            </Badge>
            <Badge variant={entry.variant as any} tone={entry.tone as any} radius={12} dot>
              {entry.label} queue
            </Badge>
            <Badge variant={entry.variant as any} tone={entry.tone as any} radius={4} elevation="low">
              {entry.label} tag
            </Badge>
          </Flex>
        </Grid>
      ))}
    </Grid>
  ),
};

export const SizeGallery: Story = {
  render: () => (
    <Grid style={{ gap: 14, maxInlineSize: 880 }}>
      {[
        { label: 'Extra small', size: 'xs' },
        { label: 'Small', size: 'sm' },
        { label: 'Medium', size: 'md' },
        { label: 'Large', size: 'lg' },
        { label: 'Extra large', size: 'xl' },
      ].map((entry) => (
        <Grid key={entry.label} style={{ gap: 8 }}>
          <Box style={{ fontSize: 13, fontWeight: 600, color: 'var(--ui-color-muted, #64748b)' }}>{entry.label}</Box>
          <Flex align="center" style={{ gap: 10, flexWrap: 'wrap' }}>
            <Badge size={entry.size as any} tone="info" variant="surface">
              <span slot="icon">
                <ActivityIcon size={12} />
              </span>
              Live monitor
            </Badge>
            <Badge size={entry.size as any} tone="success" variant="soft" dot>
              Healthy
            </Badge>
            <Badge size={entry.size as any} tone="warning" variant="outline" removable>
              Needs review
            </Badge>
          </Flex>
        </Grid>
      ))}
    </Grid>
  ),
};

export const StateGallery: Story = {
  render: () => (
    <Grid style={{ gap: 14, maxInlineSize: 900 }}>
      <Flex align="center" style={{ gap: 10, flexWrap: 'wrap' }}>
        <Badge tone="neutral" variant="surface">
          Idle
        </Badge>
        <Badge tone="info" variant="soft" state="loading">
          Syncing queue
        </Badge>
        <Badge tone="danger" variant="outline" state="error">
          <span slot="icon">
            <XCircleIcon size={12} />
          </span>
          Feed delayed
        </Badge>
        <Badge tone="success" variant="solid" state="success" dot>
          Healthy
        </Badge>
        <Badge tone="purple" variant="surface" elevation="high">
          Priority
        </Badge>
        <Badge tone="warning" variant="ghost" interactive>
          Clickable
        </Badge>
        <Badge tone="neutral" variant="surface" disabled>
          Disabled
        </Badge>
      </Flex>
    </Grid>
  ),
};

export const OperationsFilterPattern: Story = {
  render: () => {
    const [selected, setSelected] = React.useState('critical');
    const [filters, setFilters] = React.useState([
      { id: 'critical', label: 'Critical', tone: 'danger' as const, icon: <AlertTriangleIcon size={12} />, count: 7 },
      { id: 'monitoring', label: 'Monitoring', tone: 'warning' as const, icon: <ClockIcon size={12} />, count: 11 },
      { id: 'stable', label: 'Stable', tone: 'success' as const, icon: <CheckCircleIcon size={12} />, count: 32 },
      { id: 'telemetry', label: 'Telemetry', tone: 'info' as const, icon: <ActivityIcon size={12} />, count: 5 },
    ]);

    return (
      <Grid style={{ gap: 14, maxInlineSize: 980 }}>
        <Card radius={16}>
          <CardHeader>
            <CardTitle>Incident filter rail</CardTitle>
            <CardDescription>
              Interactive triage labels, queue states, and removable routing chips for production monitoring surfaces.
            </CardDescription>
          </CardHeader>

          <Box slot="inset" style={{ padding: 14, display: 'grid', gap: 14 }}>
            <Grid style={{ gap: 8 }}>
              <Box style={{ fontSize: 13, color: 'var(--ui-color-muted, #64748b)' }}>Active filters</Box>
              <Flex align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
                {filters.map((filter) => {
                  const active = selected === filter.id;
                  return (
                    <Badge
                      key={filter.id}
                      tone={filter.tone}
                      variant={active ? 'solid' : 'soft'}
                      interactive
                      dot
                      elevation={active ? 'high' : 'none'}
                      onClick={() => setSelected(filter.id)}
                    >
                      <span slot="icon">{filter.icon}</span>
                      {filter.label} ({filter.count})
                    </Badge>
                  );
                })}
                <Badge tone="warning" variant="outline" state="loading">
                  Syncing queue
                </Badge>
              </Flex>
            </Grid>

            <Grid style={{ gap: 8 }}>
              <Flex align="center" justify="space-between" style={{ gap: 10, flexWrap: 'wrap' }}>
                <Box style={{ fontSize: 13, color: 'var(--ui-color-muted, #64748b)' }}>Routing chips</Box>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    setFilters([
                      { id: 'critical', label: 'Critical', tone: 'danger', icon: <AlertTriangleIcon size={12} />, count: 7 },
                      { id: 'monitoring', label: 'Monitoring', tone: 'warning', icon: <ClockIcon size={12} />, count: 11 },
                      { id: 'stable', label: 'Stable', tone: 'success', icon: <CheckCircleIcon size={12} />, count: 32 },
                      { id: 'telemetry', label: 'Telemetry', tone: 'info', icon: <ActivityIcon size={12} />, count: 5 },
                    ])
                  }
                >
                  Reset filters
                </Button>
              </Flex>

              <Flex align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
                {filters.map((filter) => (
                  <Badge
                    key={\`\${filter.id}-chip\`}
                    tone={filter.tone}
                    variant="outline"
                    removable
                    truncate
                    maxWidth="18ch"
                    onRemove={() => setFilters((current) => current.filter((entry) => entry.id !== filter.id))}
                  >
                    <span slot="icon">{filter.icon}</span>
                    {filter.label} escalation route
                  </Badge>
                ))}
              </Flex>
            </Grid>
          </Box>
        </Card>
      </Grid>
    );
  },
};
`,E=`import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BlockControls, Box, Button, Card, CardDescription, CardHeader, CardTitle, Flex, Grid } from '@editora/ui-react';
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
  SparklesIcon,
} from '@editora/react-icons';

const meta: Meta<typeof BlockControls> = {
  title: 'UI/BlockControls',
  component: BlockControls,
  args: {
    variant: 'surface',
    tone: 'neutral',
    size: 'md',
    radius: 12,
    elevation: 'low',
    state: 'idle',
    orientation: 'horizontal',
    density: 'compact',
    wrap: true,
  },
  argTypes: {
    variant: { control: 'select', options: ['surface', 'soft', 'solid', 'outline', 'ghost'] },
    tone: { control: 'select', options: ['neutral', 'info', 'success', 'warning', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg', '1', '2', '3'] },
    radius: { control: 'text' },
    elevation: { control: 'select', options: ['none', 'low', 'high'] },
    state: { control: 'select', options: ['idle', 'loading', 'error', 'success'] },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    density: { control: 'select', options: ['compact', 'comfortable'] },
    wrap: { control: 'boolean' },
    loop: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof BlockControls>;

function DemoToolbar(props: React.ComponentProps<typeof BlockControls>) {
  const [align, setAlign] = React.useState<'left' | 'center' | 'right'>('left');
  const [bold, setBold] = React.useState(false);
  const [italic, setItalic] = React.useState(false);
  const [linked, setLinked] = React.useState(false);

  return (
    <BlockControls {...props} ariaLabel="Formatting controls">
      <Button variant={bold ? 'primary' : 'secondary'} onClick={() => setBold((value) => !value)}>
        <BoldIcon size={14} />
      </Button>
      <Button variant={italic ? 'primary' : 'secondary'} onClick={() => setItalic((value) => !value)}>
        <ItalicIcon size={14} />
      </Button>
      <Button variant={linked ? 'primary' : 'secondary'} onClick={() => setLinked((value) => !value)}>
        <LinkIcon size={14} />
      </Button>
      <span data-separator aria-hidden="true" />
      <Button variant={align === 'left' ? 'primary' : 'secondary'} onClick={() => setAlign('left')}>
        <AlignLeftIcon size={14} />
      </Button>
      <Button variant={align === 'center' ? 'primary' : 'secondary'} onClick={() => setAlign('center')}>
        <AlignCenterIcon size={14} />
      </Button>
      <Button variant={align === 'right' ? 'primary' : 'secondary'} onClick={() => setAlign('right')}>
        <AlignRightIcon size={14} />
      </Button>
    </BlockControls>
  );
}

export const Playground: Story = {
  render: (args) => (
    <Grid style={{ gap: 16, maxInlineSize: 840 }}>
      <Card radius={16}>
        <CardHeader>
          <CardTitle>Block controls</CardTitle>
          <CardDescription>
            Token-backed command strip for editor controls, inline formatting actions, and contextual action groups.
          </CardDescription>
        </CardHeader>
        <Box slot="inset" style={{ padding: 16 }}>
          <DemoToolbar {...args} />
        </Box>
      </Card>
    </Grid>
  ),
};

export const VariantGallery: Story = {
  render: () => (
    <Grid style={{ gap: 14, maxInlineSize: 920 }}>
      {[
        { label: 'Surface', variant: 'surface', tone: 'neutral' },
        { label: 'Soft', variant: 'soft', tone: 'info' },
        { label: 'Outline', variant: 'outline', tone: 'warning' },
        { label: 'Solid', variant: 'solid', tone: 'success' },
        { label: 'Ghost', variant: 'ghost', tone: 'danger' },
      ].map((entry) => (
        <Grid key={entry.label} style={{ gap: 8 }}>
          <Box style={{ fontSize: 13, fontWeight: 600, color: 'var(--ui-color-muted, #64748b)' }}>{entry.label}</Box>
          <DemoToolbar variant={entry.variant as any} tone={entry.tone as any} size="md" radius={12} elevation="low" wrap />
        </Grid>
      ))}
    </Grid>
  ),
};

export const SizeGallery: Story = {
  render: () => (
    <Grid style={{ gap: 14, maxInlineSize: 920 }}>
      {[
        { label: 'Small', size: 'sm', radius: 8 },
        { label: 'Medium', size: 'md', radius: 12 },
        { label: 'Large', size: 'lg', radius: 16 },
      ].map((entry) => (
        <Grid key={entry.label} style={{ gap: 8 }}>
          <Box style={{ fontSize: 13, fontWeight: 600, color: 'var(--ui-color-muted, #64748b)' }}>{entry.label}</Box>
          <DemoToolbar variant="surface" tone="info" size={entry.size as any} radius={entry.radius} elevation="low" wrap />
        </Grid>
      ))}
    </Grid>
  ),
};

export const EditorialWorkflow: Story = {
  render: () => {
    const [block, setBlock] = React.useState<'paragraph' | 'heading' | 'quote' | 'code'>('paragraph');
    const [align, setAlign] = React.useState<'left' | 'center' | 'right'>('left');
    const [state, setState] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');

    return (
      <Grid style={{ gap: 14, maxInlineSize: 980 }}>
        <Card radius={16}>
          <CardHeader>
            <CardTitle>Clinical note toolbar</CardTitle>
            <CardDescription>
              Baseline-themed command strip for formatting, alignment, and AI-assisted note review.
            </CardDescription>
          </CardHeader>

          <Box slot="inset" style={{ padding: 16, display: 'grid', gap: 14 }}>
            <BlockControls
              ariaLabel="Clinical note formatting controls"
              variant={state === 'error' ? 'outline' : state === 'success' ? 'soft' : 'surface'}
              tone={state === 'error' ? 'danger' : state === 'success' ? 'success' : 'info'}
              state={state}
              size="md"
              radius={12}
              elevation="low"
              wrap
            >
              <Button variant={block === 'paragraph' ? 'primary' : 'secondary'} onClick={() => setBlock('paragraph')}>
                P
              </Button>
              <Button variant={block === 'heading' ? 'primary' : 'secondary'} onClick={() => setBlock('heading')}>
                H1
              </Button>
              <Button variant={block === 'quote' ? 'primary' : 'secondary'} onClick={() => setBlock('quote')}>
                "
              </Button>
              <Button variant={block === 'code' ? 'primary' : 'secondary'} onClick={() => setBlock('code')}>
                <CodeIcon size={14} />
              </Button>

              <span data-separator aria-hidden="true" />

              <Button variant={align === 'left' ? 'primary' : 'secondary'} onClick={() => setAlign('left')}>
                <AlignLeftIcon size={14} />
              </Button>
              <Button variant={align === 'center' ? 'primary' : 'secondary'} onClick={() => setAlign('center')}>
                <AlignCenterIcon size={14} />
              </Button>
              <Button variant={align === 'right' ? 'primary' : 'secondary'} onClick={() => setAlign('right')}>
                <AlignRightIcon size={14} />
              </Button>

              <span data-separator aria-hidden="true" />

              <Button
                variant="secondary"
                onClick={() => {
                  setState('loading');
                  window.setTimeout(() => setState('success'), 900);
                }}
              >
                <SparklesIcon size={14} />
                Suggest
              </Button>
            </BlockControls>

            <Flex align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
              <Button size="sm" variant="secondary" onClick={() => setState('idle')}>
                <ClockIcon size={14} />
                Idle
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setState('error')}>
                <AlertTriangleIcon size={14} />
                Error
              </Button>
              <Button size="sm" onClick={() => setState('success')}>
                <CheckCircleIcon size={14} />
                Success
              </Button>
            </Flex>

            <Box
              style={{
                border: '1px solid var(--ui-color-border, #d8e1ec)',
                borderRadius: 12,
                padding: 12,
                background: 'var(--ui-color-surface, #fff)',
                fontSize: 13,
                color: 'var(--ui-color-muted, #64748b)',
              }}
            >
              Block: <strong>{block}</strong> | Alignment: <strong>{align}</strong> | State: <strong>{state}</strong>
            </Box>
          </Box>
        </Card>
      </Grid>
    );
  },
};
`,O=`import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box, Button, Card, CardDescription, CardHeader, CardTitle, Flex, Grid } from '@editora/ui-react';
import { ActivityIcon, AlertTriangleIcon, CheckCircleIcon, ClockIcon, ShieldIcon, SparklesIcon } from '@editora/react-icons';

const meta: Meta<typeof Box> = {
  title: 'UI/Box',
  component: Box,
  args: {
    variant: 'surface',
    tone: 'default',
    state: 'idle',
    elevation: 'low',
    radius: 12,
    interactive: false,
    disabled: false,
  },
  argTypes: {
    variant: { control: 'select', options: ['default', 'surface', 'elevated', 'outline', 'glass', 'gradient', 'soft', 'contrast'] },
    tone: { control: 'select', options: ['default', 'neutral', 'brand', 'info', 'success', 'warning', 'danger'] },
    state: { control: 'select', options: ['idle', 'loading', 'error', 'success'] },
    elevation: { control: 'select', options: ['default', 'none', 'low', 'high'] },
    radius: { control: 'text' },
    interactive: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof Box>;

export const Playground: Story = {
  render: (args) => (
    <Grid style={{ gap: 16, maxInlineSize: 760 }}>
      <Card radius={16}>
        <CardHeader>
          <CardTitle>Box</CardTitle>
          <CardDescription>
            Low-level surface and layout primitive for spacing, state, elevation, and responsive container styling.
          </CardDescription>
        </CardHeader>
        <Box slot="inset" style={{ padding: 16 }}>
          <Box p="16px" {...args}>
            Modern \`ui-box\` surface with theme-backed variants, tone, state, elevation, and radius.
          </Box>
        </Box>
      </Card>
    </Grid>
  ),
};

export const VariantGallery: Story = {
  render: () => (
    <Grid style={{ gap: 14, maxInlineSize: 980 }}>
      {[
        { label: 'Surface', variant: 'surface', tone: 'default' },
        { label: 'Elevated', variant: 'elevated', tone: 'default' },
        { label: 'Outline', variant: 'outline', tone: 'info' },
        { label: 'Soft', variant: 'soft', tone: 'success' },
        { label: 'Glass', variant: 'glass', tone: 'brand' },
        { label: 'Gradient', variant: 'gradient', tone: 'warning' },
        { label: 'Contrast', variant: 'contrast', tone: 'default' },
      ].map((entry) => (
        <Grid key={entry.label} style={{ gap: 8 }}>
          <Box style={{ fontSize: 13, fontWeight: 600, color: 'var(--ui-color-muted, #64748b)' }}>{entry.label}</Box>
          <Box
            variant={entry.variant as any}
            tone={entry.tone as any}
            elevation="low"
            radius={12}
            p="16px"
            style={{ display: 'grid', gap: 8 }}
          >
            <Flex align="center" style={{ gap: 8 }}>
              <ShieldIcon size={15} />
              <strong>{entry.label} container</strong>
            </Flex>
            <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>
              Shared theme tokens control border, background, radius, shadow, and tone treatment.
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  ),
};

export const InteractiveStates: Story = {
  render: () => {
    const [state, setState] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');

    return (
      <Grid style={{ gap: 14, maxInlineSize: 860 }}>
        <Box
          variant="outline"
          tone={state === 'error' ? 'danger' : state === 'success' ? 'success' : 'info'}
          state={state}
          elevation="low"
          radius={16}
          interactive
          p="16px"
          style={{ display: 'grid', gap: 10 }}
        >
          <Flex align="center" justify="space-between" style={{ gap: 10, flexWrap: 'wrap' }}>
            <Flex align="center" style={{ gap: 8 }}>
              <ActivityIcon size={16} />
              <strong>Realtime monitoring panel</strong>
            </Flex>
            <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>State: {state}</Box>
          </Flex>
          <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>
            This surface demonstrates interactive focus styling plus loading, error, and success state treatments.
          </Box>
        </Box>

        <Flex align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
          <Button size="sm" variant="secondary" onClick={() => setState('idle')}>
            <ClockIcon size={14} />
            Idle
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setState('loading')}>
            <SparklesIcon size={14} />
            Loading
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setState('error')}>
            <AlertTriangleIcon size={14} />
            Error
          </Button>
          <Button size="sm" onClick={() => setState('success')}>
            <CheckCircleIcon size={14} />
            Success
          </Button>
        </Flex>
      </Grid>
    );
  },
};

export const ResponsiveLayoutPattern: Story = {
  render: () => (
    <Grid style={{ gap: 14, maxInlineSize: 1080 }}>
      <Box variant="gradient" tone="brand" radius={16} p="16px">
        <Flex align="center" justify="space-between" style={{ gap: 12, flexWrap: 'wrap' }}>
          <Box>
            <Box style={{ fontWeight: 700, fontSize: 18 }}>Operations dashboard shell</Box>
            <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13, marginTop: 4 }}>
              Responsive spacing and surface composition using \`ui-box\` as the layout substrate.
            </Box>
          </Box>
          <Flex align="center" style={{ gap: 8, color: 'var(--ui-color-muted, #64748b)', fontSize: 12 }}>
            <ShieldIcon size={14} />
            Shift B
          </Flex>
        </Flex>
      </Box>

      <Grid style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))' }}>
        <Box variant="surface" tone="info" elevation="low" interactive p="16px" style={{ minHeight: 134, display: 'grid', gap: 10 }}>
          <Flex align="center" style={{ gap: 8 }}>
            <ActivityIcon size={16} />
            <strong>Triage queue</strong>
          </Flex>
          <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>22 pending assessments, average wait 9 minutes.</Box>
        </Box>

        <Box variant="soft" tone="success" elevation="low" interactive p="16px" style={{ minHeight: 134, display: 'grid', gap: 10 }}>
          <Flex align="center" style={{ gap: 8 }}>
            <CheckCircleIcon size={16} />
            <strong>Bed allocation</strong>
          </Flex>
          <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>94% occupancy, 4 discharge-ready patients.</Box>
        </Box>

        <Box variant="outline" tone="warning" elevation="low" interactive p="16px" style={{ minHeight: 134, display: 'grid', gap: 10 }}>
          <Flex align="center" style={{ gap: 8 }}>
            <AlertTriangleIcon size={16} />
            <strong>Compliance audit</strong>
          </Flex>
          <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>2 notes require signature validation.</Box>
        </Box>
      </Grid>

      <Box variant="elevated" radius={16} p={{ initial: '12px', md: '16px' }} style={{ display: 'grid', gap: 10 }}>
        <Box style={{ fontSize: 13, color: 'var(--ui-color-muted, #64748b)' }}>
          Responsive padding here is driven by the layout props, while variant, elevation, and radius stay theme-backed.
        </Box>
      </Box>
    </Grid>
  ),
};
`,L=`import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box, Breadcrumb, Card, CardDescription, CardHeader, CardTitle, Flex, Grid } from '@editora/ui-react';
import { CheckCircleIcon, FolderIcon, HomeIcon, ShieldIcon, SparklesIcon } from '@editora/react-icons';

const meta: Meta<typeof Breadcrumb> = {
  title: 'UI/Breadcrumb',
  component: Breadcrumb,
  args: {
    separator: '/',
    maxItems: 6,
    currentIndex: 3,
    size: 'md',
    variant: 'surface',
    tone: 'neutral',
    radius: 'md',
    elevation: 'none',
    state: 'idle',
    disabled: false,
  },
  argTypes: {
    separator: { control: 'text' },
    maxItems: { control: { type: 'number', min: 3, max: 10, step: 1 } },
    currentIndex: { control: { type: 'number', min: 0, max: 10, step: 1 } },
    size: { control: 'select', options: ['sm', 'md', 'lg', '1', '2', '3'] },
    variant: { control: 'select', options: ['surface', 'soft', 'solid', 'outline', 'ghost', 'minimal'] },
    tone: { control: 'select', options: ['neutral', 'info', 'success', 'warning', 'danger'] },
    radius: { control: 'text' },
    elevation: { control: 'select', options: ['none', 'low', 'high'] },
    state: { control: 'select', options: ['idle', 'loading', 'error', 'success'] },
    disabled: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof Breadcrumb>;

const trail = ['Workspace', 'Programs', 'Spring release', 'Governance', 'Audit logs'];

export const Playground: Story = {
  render: (args) => (
    <Grid style={{ gap: 16, maxInlineSize: 860 }}>
      <Card radius={16}>
        <CardHeader>
          <CardTitle>Breadcrumb</CardTitle>
          <CardDescription>
            Hierarchical navigation with collapse logic, keyboard support, and theme-backed visual variants.
          </CardDescription>
        </CardHeader>
        <Box slot="inset" style={{ padding: 16, display: 'grid', gap: 12 }}>
          <Breadcrumb {...args} ariaLabel="Release navigation">
            <span slot="item">
              <HomeIcon size={13} style={{ marginInlineEnd: 4 }} />
              Workspace
            </span>
            <span slot="item">
              <FolderIcon size={13} style={{ marginInlineEnd: 4 }} />
              Programs
            </span>
            <span slot="item">Spring release</span>
            <span slot="item">Governance</span>
            <span slot="item">Audit logs</span>
          </Breadcrumb>
          <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>
            Uses the real breadcrumb API: \`variant\`, \`size\`, \`radius\`, \`elevation\`, \`tone\`, \`state\`, and \`onSelect\`.
          </Box>
        </Box>
      </Card>
    </Grid>
  ),
};

export const VariantGallery: Story = {
  render: () => (
    <Grid style={{ gap: 14, maxInlineSize: 920 }}>
      {[
        { label: 'Surface', variant: 'surface', tone: 'neutral' },
        { label: 'Soft', variant: 'soft', tone: 'info' },
        { label: 'Solid', variant: 'solid', tone: 'success' },
        { label: 'Outline', variant: 'outline', tone: 'warning' },
        { label: 'Ghost', variant: 'ghost', tone: 'danger' },
        { label: 'Minimal', variant: 'minimal', tone: 'neutral' },
      ].map((entry) => (
        <Grid key={entry.label} style={{ gap: 8 }}>
          <Box style={{ fontSize: 13, fontWeight: 600, color: 'var(--ui-color-muted, #64748b)' }}>{entry.label}</Box>
          <Breadcrumb
            separator="/"
            currentIndex={3}
            variant={entry.variant as any}
            tone={entry.tone as any}
            radius={entry.variant === 'ghost' ? 'none' : 'md'}
            elevation={entry.variant === 'solid' ? 'low' : 'none'}
          >
            <span slot="item">Workspace</span>
            <span slot="item">Programs</span>
            <span slot="item">Governance</span>
            <span slot="item">Audit logs</span>
          </Breadcrumb>
        </Grid>
      ))}
    </Grid>
  ),
};

export const SizeGallery: Story = {
  render: () => (
    <Grid style={{ gap: 14, maxInlineSize: 860 }}>
      {[
        { label: 'Small', size: 'sm' },
        { label: 'Medium', size: 'md' },
        { label: 'Large', size: 'lg' },
      ].map((entry) => (
        <Grid key={entry.label} style={{ gap: 8 }}>
          <Box style={{ fontSize: 13, fontWeight: 600, color: 'var(--ui-color-muted, #64748b)' }}>{entry.label}</Box>
          <Breadcrumb separator="/" currentIndex={3} size={entry.size as any} variant="surface" tone="info" radius={12}>
            <span slot="item">Workspace</span>
            <span slot="item">Programs</span>
            <span slot="item">Governance</span>
            <span slot="item">Audit logs</span>
          </Breadcrumb>
        </Grid>
      ))}
    </Grid>
  ),
};

export const WorkflowPattern: Story = {
  render: () => {
    const [currentIndex, setCurrentIndex] = React.useState(3);
    const [state, setState] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');

    return (
      <Grid style={{ gap: 16, maxInlineSize: 980 }}>
        <Card radius={18} variant="soft" tone="info">
          <CardHeader>
            <CardTitle>Governance review trail</CardTitle>
            <CardDescription>
              Collapsed breadcrumb for deep navigation paths with state feedback and keyboard-friendly selection.
            </CardDescription>
          </CardHeader>
          <Box slot="inset" style={{ padding: 16, display: 'grid', gap: 14 }}>
            <Breadcrumb
              separator="/"
              maxItems={5}
              currentIndex={currentIndex}
              variant="soft"
              tone={state === 'error' ? 'danger' : state === 'success' ? 'success' : 'info'}
              state={state}
              radius={12}
              elevation="low"
              ariaLabel="Governance review trail"
              onSelect={(detail) => {
                setCurrentIndex(detail.index);
                setState(detail.index === trail.length - 1 ? 'success' : 'idle');
              }}
            >
              <span slot="item">
                <HomeIcon size={13} style={{ marginInlineEnd: 4 }} />
                Workspace
              </span>
              <span slot="item">Programs</span>
              <span slot="item">Spring release</span>
              <span slot="item">Governance</span>
              <span slot="item">
                <ShieldIcon size={13} style={{ marginInlineEnd: 4 }} />
                Audit logs
              </span>
            </Breadcrumb>

            <Flex align="center" style={{ gap: 10, flexWrap: 'wrap', color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                {state === 'success' ? <CheckCircleIcon size={14} /> : <SparklesIcon size={14} />}
                Active step: {trail[currentIndex]}
              </span>
            </Flex>
          </Box>
        </Card>
      </Grid>
    );
  },
};
`,_=`import React from 'react';
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
import { ShowcasePage, ShowcaseSection, showcasePanelStyle } from './storybook-showcase';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  argTypes: {
    variant: { control: { type: 'radio', options: ['primary', 'secondary', 'ghost', 'danger', 'success', 'warning'] } },
    size: { control: { type: 'radio', options: ['sm', 'md', 'lg'] } },
    recipe: { control: { type: 'radio', options: ['classic', 'solid', 'soft', 'surface', 'outline', 'ghost'] } },
    radius: { control: 'text' },
    scale: { control: { type: 'radio', options: ['1', '2', '3', '4'] } },
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
  recipe: 'solid',
  radius: '4',
  scale: '2',
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
`,W=`import React from 'react';
import type { Meta } from '@storybook/react';
import { Button } from '@editora/ui-react';
import type { ThemeTokens } from '@editora/ui-core';
import { createThemeTokens } from '@editora/ui-core';
import { ArrowRightIcon } from '@editora/react-icons';
import { ShowcasePage, ShowcaseSection, showcasePanelStyle } from './storybook-showcase';

const meta: Meta = {
  title: 'UI/Button Matrices',
  parameters: {
    docs: {
      description: {
        component: 'Heavy theme and sizing matrices for button recipes. Kept separate from the main button docs to preserve Storybook performance.'
      }
    }
  }
};

export default meta;

const BUTTON_MATRIX_TABS = [
  { id: 'theme-colors', label: 'Theme colors' },
  { id: 'all-colors', label: 'All colors' },
  { id: 'all-sizes', label: 'All sizes' }
] as const;

type MatrixRecipe = {
  id: string;
  label: string;
  variant: React.ComponentProps<typeof Button>['variant'];
  recipe: React.ComponentProps<typeof Button>['recipe'];
};

function buttonThemeDeclarations(tokens: ThemeTokens) {
  return [
    \`--ui-color-primary: \${tokens.colors.primary};\`,
    \`--ui-color-primary-hover: \${tokens.colors.primaryHover || tokens.colors.primary};\`,
    \`--ui-color-foreground-on-primary: \${tokens.colors.foregroundOnPrimary || '#ffffff'};\`,
    \`--ui-color-background: \${tokens.colors.background || '#ffffff'};\`,
    \`--ui-color-surface: \${tokens.colors.surface || tokens.colors.background || '#ffffff'};\`,
    \`--ui-color-surface-alt: \${tokens.colors.surfaceAlt || tokens.colors.surface || '#f8fafc'};\`,
    \`--ui-color-text: \${tokens.colors.text || '#111827'};\`,
    \`--ui-color-muted: \${tokens.colors.muted || '#64748b'};\`,
    \`--ui-color-border: \${tokens.colors.border || 'rgba(15,23,42,0.16)'};\`,
    \`--ui-color-focus-ring: \${tokens.colors.focusRing || tokens.colors.primary};\`,
    \`--color-panel-solid: \${tokens.surfaces?.panelSolid || tokens.colors.surface || '#ffffff'};\`,
    \`--color-panel: \${tokens.surfaces?.panel || tokens.surfaces?.panelTranslucent || '#ffffffcc'};\`,
    \`--shadow-1: \${tokens.shadows?.['1'] || 'none'};\`
  ].join(' ');
}

function buttonThemeRule(themeId: string, tokens: ThemeTokens) {
  return \`#button-theme-matrix ui-button[data-button-theme="\${themeId}"] { \${buttonThemeDeclarations(tokens)} }\`;
}

const accentLightTokens = createThemeTokens({}, { accentPalette: 'blue', mode: 'light' });
const accentDarkTokens = createThemeTokens({}, { accentPalette: 'blue', mode: 'dark' });
const grayLightTokens = createThemeTokens({}, { accentPalette: 'gray', mode: 'light' });
const grayDarkTokens = createThemeTokens({}, { accentPalette: 'gray', mode: 'dark' });

function makeStoryPalette(label: string, light: string, dark: string, solidText = '#ffffff') {
  const lightTokens = createThemeTokens({
    colors: {
      primary: light,
      primaryHover: dark,
      foregroundOnPrimary: solidText,
      focusRing: light
    }
  });

  const darkTokens = createThemeTokens(
    {
      colors: {
        primary: dark,
        primaryHover: dark,
        foregroundOnPrimary: '#ffffff',
        focusRing: light,
        background: '#0f172a',
        surface: '#0f172a',
        surfaceAlt: '#111827',
        text: '#f8fafc',
        muted: '#94a3b8',
        border: 'rgba(255,255,255,0.12)'
      },
      surfaces: {
        background: '#0f172a',
        surface: '#111827',
        panel: '#0f172acc',
        panelSolid: '#111827',
        panelTranslucent: '#0f172acc',
        overlay: 'rgba(2, 6, 23, 0.6)'
      }
    },
    { mode: 'dark' }
  );

  return {
    id: label.toLowerCase().replace(/\\s+/g, '-'),
    label,
    lightTokens,
    darkTokens
  };
}

const paletteRows = [
  makeStoryPalette('Gray', '#8d8d8d', '#202020'),
  makeStoryPalette('Gold', '#b89b68', '#3f3421'),
  makeStoryPalette('Bronze', '#b48b79', '#4d392f'),
  makeStoryPalette('Brown', '#b88756', '#43362b'),
  makeStoryPalette('Yellow', '#d2ad00', '#5a4b14'),
  makeStoryPalette('Amber', '#f2b600', '#6d4615', '#231b06'),
  makeStoryPalette('Orange', '#f97316', '#6a3318'),
  makeStoryPalette('Tomato', '#ea5a47', '#6a2a1e'),
  makeStoryPalette('Red', '#e5484d', '#6e1f2e'),
  makeStoryPalette('Ruby', '#e54666', '#7a1d4f'),
  makeStoryPalette('Crimson', '#e93d82', '#7d184f'),
  makeStoryPalette('Pink', '#d6409f', '#6f2b68'),
  makeStoryPalette('Plum', '#ab4aba', '#5f2c7a'),
  makeStoryPalette('Purple', '#8e4ec6', '#4d2d7a'),
  makeStoryPalette('Violet', '#6e56cf', '#39307a'),
  makeStoryPalette('Iris', '#5b5bd6', '#29416f'),
  makeStoryPalette('Indigo', '#3e63dd', '#203b7a'),
  makeStoryPalette('Blue', '#0090ff', '#174ea6'),
  makeStoryPalette('Cyan', '#05a2c2', '#145369'),
  makeStoryPalette('Teal', '#12a594', '#0f5c56'),
  makeStoryPalette('Jade', '#29a383', '#1d5b48'),
  makeStoryPalette('Green', '#30a46c', '#1f5a36'),
  makeStoryPalette('Grass', '#46a758', '#365314'),
  makeStoryPalette('Lime', '#9bb300', '#465b18', '#1a1f08'),
  makeStoryPalette('Mint', '#2db8a0', '#105a53'),
  makeStoryPalette('Sky', '#4cc9f0', '#174e67', '#0f2430')
] as const;

const radiusColumns = [
  { id: '0', label: '0', radius: '0' },
  { id: '4', label: '4', radius: '4' },
  { id: '8', label: '8', radius: '8' },
  { id: '12', label: '12', radius: '12' },
  { id: 'full', label: 'Full', radius: 'full' }
] as const;

const sizeRows = [
  { id: '1', label: 'Size 1', scale: '1' as const },
  { id: '2', label: 'Size 2', scale: '2' as const },
  { id: '3', label: 'Size 3', scale: '3' as const },
  { id: '4', label: 'Size 4', scale: '4' as const }
] as const;

const matrixRecipes: MatrixRecipe[] = [
  { id: 'classic', label: 'Classic', variant: 'primary', recipe: 'classic' },
  { id: 'solid', label: 'Solid', variant: 'primary', recipe: 'solid' },
  { id: 'soft', label: 'Soft', variant: 'secondary', recipe: 'soft' },
  { id: 'surface', label: 'Surface', variant: 'secondary', recipe: 'surface' },
  { id: 'outline', label: 'Outline', variant: 'secondary', recipe: 'outline' },
  { id: 'ghost', label: 'Ghost', variant: 'ghost', recipe: 'ghost' }
];

function ThemeMatrixStory() {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const themeCss = React.useMemo(() => {
    const themeEntries: Array<[string, ThemeTokens]> = [
      ['accent-light', accentLightTokens],
      ['accent-dark', accentDarkTokens],
      ['gray-light', grayLightTokens],
      ['gray-dark', grayDarkTokens],
      ...paletteRows.flatMap((palette) => [
        [\`\${palette.id}-light\`, palette.lightTokens] as [string, ThemeTokens],
        [\`\${palette.id}-dark\`, palette.darkTokens] as [string, ThemeTokens]
      ])
    ];

    return themeEntries.map(([id, tokens]) => buttonThemeRule(id, tokens)).join('\\n');
  }, []);

  const headerGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '120px repeat(6, minmax(120px, 1fr))',
    gap: 10,
    alignItems: 'center',
    color: '#5b6672',
    fontSize: 13,
    lineHeight: '20px',
    fontWeight: 600
  };

  const rowGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '120px repeat(6, minmax(120px, 1fr))',
    gap: 10,
    alignItems: 'center'
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 14,
    lineHeight: '20px',
    fontWeight: 600,
    color: '#5b6672'
  };

  const tabsSurfaceStyle: React.CSSProperties = {
    ...showcasePanelStyle,
    gap: 16,
    padding: 18
  };

  const cellStyle = (dark = false): React.CSSProperties => ({
    padding: 10,
    borderRadius: 12,
    background: dark ? '#121826' : '#f8fafc',
    border: \`1px solid \${dark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)'}\`,
    minHeight: 72,
    display: 'grid',
    placeItems: 'center'
  });

  const matrixTabListStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 12,
    marginBottom: 14,
    borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
    flexWrap: 'wrap'
  };

  const matrixTabButtonStyle = (active: boolean): React.CSSProperties => ({
    border: '1px solid transparent',
    background: active ? '#ffffff' : 'transparent',
    color: active ? '#111827' : '#5b6672',
    borderColor: active ? 'rgba(37, 99, 235, 0.35)' : 'transparent',
    borderRadius: 8,
    padding: '8px 14px',
    fontSize: 13,
    lineHeight: '20px',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: active ? 'inset 0 -2px 0 #2563eb' : 'none'
  });

  const compactHeaderStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '72px repeat(6, minmax(170px, 1fr))',
    gap: 14,
    alignItems: 'center',
    color: '#5b6672',
    fontSize: 12,
    lineHeight: '18px',
    fontWeight: 600
  };

  const compactRowStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '72px repeat(6, minmax(170px, 1fr))',
    gap: 14,
    alignItems: 'center'
  };

  const pairCellStyle: React.CSSProperties = {
    minHeight: 56,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'nowrap'
  };

  const sizeHeaderStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '72px repeat(5, minmax(140px, 1fr))',
    gap: 22,
    alignItems: 'center',
    color: '#5b6672',
    fontSize: 12,
    lineHeight: '18px',
    fontWeight: 600
  };

  const sizeRowStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '72px repeat(5, minmax(140px, 1fr))',
    gap: 22,
    alignItems: 'center'
  };

  const sizeCellStyle: React.CSSProperties = {
    minHeight: 56,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  };

  const renderRecipeButton = (
    recipe: MatrixRecipe,
    themeId: string,
    extraProps?: Partial<React.ComponentProps<typeof Button>>
  ) => (
    <Button
      data-button-theme={themeId}
      variant={recipe.variant}
      recipe={recipe.recipe}
      endIcon={<ArrowRightIcon size={16} />}
      {...extraProps}
    >
      Next
    </Button>
  );

  const renderThemeColorsMatrix = () => (
    <div style={{ display: 'grid', gap: 10 }}>
      <div style={headerGridStyle}>
        <div />
        <div style={{ textAlign: 'center' }}>Accent / Light</div>
        <div style={{ textAlign: 'center' }}>Accent / Dark</div>
        <div style={{ textAlign: 'center' }}>Gray / Light</div>
        <div style={{ textAlign: 'center' }}>Gray / Dark</div>
        <div style={{ textAlign: 'center' }}>Disabled</div>
        <div style={{ textAlign: 'center' }}>Loading</div>
      </div>

      {matrixRecipes.map((recipe) => (
        <div key={recipe.id} style={rowGridStyle}>
          <div style={labelStyle}>{recipe.label}</div>
          <div style={cellStyle(false)}>{renderRecipeButton(recipe, 'accent-light')}</div>
          <div style={cellStyle(true)}>{renderRecipeButton(recipe, 'accent-dark')}</div>
          <div style={cellStyle(false)}>{renderRecipeButton(recipe, 'gray-light')}</div>
          <div style={cellStyle(true)}>{renderRecipeButton(recipe, 'gray-dark')}</div>
          <div style={cellStyle(false)}>{renderRecipeButton(recipe, 'accent-light', { disabled: true })}</div>
          <div style={cellStyle(false)}>{renderRecipeButton(recipe, 'accent-light', { loading: true, ariaLabel: \`\${recipe.label} loading\` })}</div>
        </div>
      ))}
    </div>
  );

  const renderAllColorsMatrix = () => (
    <div style={{ display: 'grid', gap: 10 }}>
      <div style={compactHeaderStyle}>
        <div />
        {matrixRecipes.map((recipe) => (
          <div key={recipe.id}>{recipe.label}</div>
        ))}
      </div>

      {paletteRows.map((palette) => (
        <div key={palette.id} style={compactRowStyle}>
          <div style={{ ...labelStyle, fontWeight: 500 }}>{palette.label}</div>
          {matrixRecipes.map((recipe) => (
            <div key={recipe.id} style={pairCellStyle}>
              {renderRecipeButton(recipe, \`\${palette.id}-light\`)}
              {renderRecipeButton(recipe, \`\${palette.id}-dark\`, { theme: 'dark' })}
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  const renderAllSizesMatrix = () => (
    <div style={{ display: 'grid', gap: 26 }}>
      <div style={sizeHeaderStyle}>
        <div />
        {radiusColumns.map((column) => (
          <div key={column.id}>{column.label}</div>
        ))}
      </div>

      {matrixRecipes.map((recipe, recipeIndex) => (
        <div key={recipe.id} style={{ display: 'grid', gap: 14 }}>
          {recipeIndex > 0 ? <div style={{ height: 1, background: 'rgba(15, 23, 42, 0.08)', margin: '6px 0 2px' }} /> : null}
          <div
            style={{
              fontSize: 12,
              lineHeight: '18px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#64748b',
              fontWeight: 700
            }}
          >
            {recipe.label}
          </div>
          {sizeRows.map((sizeRow) => (
            <div key={\`\${recipe.id}-\${sizeRow.id}\`} style={sizeRowStyle}>
              <div style={{ ...labelStyle, fontWeight: 500 }}>{sizeRow.label}</div>
              {radiusColumns.map((column) => (
                <div key={column.id} style={sizeCellStyle}>
                  {renderRecipeButton(recipe, 'accent-light', { radius: column.radius, scale: sizeRow.scale })}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  const activePanel =
    selectedTab === 0 ? renderThemeColorsMatrix() : selectedTab === 1 ? renderAllColorsMatrix() : renderAllSizesMatrix();

  return (
    <ShowcasePage
      eyebrow="Token Matrix"
      title="Theme-Driven Button Patterns"
      description="Heavy reference matrices for recipe, palette, and size coverage. This story is isolated from the main button docs to keep the primary button surface responsive."
      meta={[
        { label: 'Accent Palette', value: 'Blue' },
        { label: 'Neutral Palette', value: 'Gray' },
        { label: 'Rows', value: '26 Colors' },
        { label: 'Tabs', value: '3 Matrices' }
      ]}
    >
      <ShowcaseSection
        eyebrow="Button Grammar"
        title="Tabbed Matrix Recipes"
        description="Use the tabs to inspect recipe behavior by theme state, palette coverage, and size/radius combinations."
      >
        <div id="button-theme-matrix" style={tabsSurfaceStyle}>
          <style>{themeCss}</style>
          <div role="tablist" aria-label="Button matrix tabs" style={matrixTabListStyle}>
            {BUTTON_MATRIX_TABS.map((tab, index) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selectedTab === index}
                onClick={() => setSelectedTab(index)}
                style={matrixTabButtonStyle(selectedTab === index)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div role="tabpanel">{activePanel}</div>
        </div>
      </ShowcaseSection>
    </ShowcasePage>
  );
}

export const ThemeTokenMatrix = ThemeMatrixStory.bind({});
`,H=`import React from 'react';
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
`,N=`import React from 'react';
import type { Meta } from '@storybook/react';
import { Card, CardDescription, CardFooter, CardHeader, CardInset, CardMedia, CardTitle, Flex, Grid } from '@editora/ui-react';
import { ShowcasePage, ShowcaseSection } from './storybook-showcase';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  argTypes: {
    variant: { control: { type: 'radio', options: ['surface', 'outline', 'soft', 'solid', 'ghost', 'glass'] } },
    size: { control: { type: 'radio', options: ['sm', 'md', 'lg'] } },
    radius: { control: 'text' },
    tone: { control: { type: 'radio', options: ['neutral', 'info', 'success', 'warning', 'danger'] } },
    elevation: { control: { type: 'radio', options: ['none', 'low', 'high'] } },
    interactive: { control: 'boolean' },
    disabled: { control: 'boolean' }
  }
};

export default meta;

function InsetArtwork() {
  return (
    <div
      style={{
        aspectRatio: '4 / 2.4',
        background:
          'linear-gradient(135deg, rgba(236,242,255,1) 0%, rgba(248,250,252,1) 38%, rgba(226,232,240,1) 100%)',
        borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '14% 18%',
          transform: 'rotate(-12deg)',
          background: '#ffffff',
          borderRadius: 8,
          boxShadow: '0 22px 50px rgba(15, 23, 42, 0.12)',
          display: 'grid',
          gridTemplateColumns: '1fr 1.1fr',
          padding: 18,
          gap: 14
        }}
      >
        <div style={{ borderRight: '1px solid rgba(15, 23, 42, 0.08)', paddingRight: 12 }}>
          <div style={{ fontSize: 54, lineHeight: 1, fontWeight: 700, color: '#111827' }}>A</div>
          <div style={{ marginTop: 10, fontSize: 10, lineHeight: '14px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Editorial layout
          </div>
        </div>
        <div style={{ display: 'grid', gap: 10 }}>
          <div style={{ inlineSize: 110, blockSize: 34, background: '#1f2937', color: '#ffffff', display: 'grid', placeItems: 'center', fontWeight: 700 }}>
            FACTURES
          </div>
          <div style={{ fontSize: 11, lineHeight: '16px', color: '#475569' }}>
            Typography is the art and technique of arranging type to make written language legible and expressive.
          </div>
        </div>
      </div>
    </div>
  );
}

export const Playground = {
  args: {
    variant: 'surface',
    size: 'md',
    radius: '4',
    tone: 'neutral',
    elevation: 'low',
    interactive: false,
    disabled: false
  },
  render: (args: Record<string, unknown>) => (
    <Card {...args} style={{ maxInlineSize: 360 }}>
      <CardHeader>
        <CardTitle>Project overview</CardTitle>
        <CardDescription>
          Launch health and release readiness.
        </CardDescription>
      </CardHeader>
      <div style={{ fontSize: 14, lineHeight: '20px', color: '#334155' }}>
        Track migration progress, QA handoff, and final release blockers from one place.
      </div>
      <CardFooter style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, lineHeight: '18px', color: '#64748b' }}>
        <span>Updated 2m ago</span>
        <span>12 items</span>
      </CardFooter>
    </Card>
  )
};

export const WithInsetContent = () => (
  <ShowcasePage
    eyebrow="Composition"
    title="With inset content"
    description="Use the inset slot to align media flush with the card edges while keeping the reading content padded."
  >
    <ShowcaseSection title="Inset media" description="Full-bleed artwork and a readable text block can live in the same card without custom wrappers.">
      <Card variant="surface" size="lg" radius={8} style={{ maxInlineSize: 520 }}>
        <CardInset>
          <InsetArtwork />
        </CardInset>
        <div style={{ display: 'grid', gap: 10 }}>
          <CardTitle as="div">
            Typography is the art and technique of arranging type.
          </CardTitle>
          <div style={{ fontSize: 15, lineHeight: '24px', color: '#334155' }}>
            Use inset sections when imagery, charts, or media should sit flush against the card frame while the rest of the content stays comfortably padded.
          </div>
        </div>
      </Card>
    </ShowcaseSection>
  </ShowcasePage>
);

export const VariantGallery = () => (
  <ShowcasePage eyebrow="Visual language" title="Variant" description="Use the variant prop to control the visual style.">
    <ShowcaseSection title="Card variants" description="Choose a surface that matches the amount of visual weight the layout needs.">
      <Grid style={{ gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {[
          ['surface', 'Quick start'],
          ['outline', 'Documentation shell'],
          ['soft', 'Status summary'],
          ['solid', 'Priority insight'],
          ['ghost', 'Canvas section'],
          ['glass', 'Overlay surface']
        ].map(([variant, title]) => (
          <Card key={variant} variant={variant as any} size="md" radius={8} style={{ minBlockSize: 132 }}>
            <CardHeader>
              <div style={{ fontSize: 14, lineHeight: '18px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{variant}</div>
              <CardTitle as="div">{title}</CardTitle>
            </CardHeader>
            <CardDescription as="div">
              Start building your next project in minutes.
            </CardDescription>
          </Card>
        ))}
      </Grid>
    </ShowcaseSection>
  </ShowcasePage>
);

export const SizeGallery = () => (
  <ShowcasePage eyebrow="Scaling" title="Size" description="Use the size prop to control the padding rhythm of the card.">
    <ShowcaseSection title="Size ramp" description="Size now drives content rhythm too, including media height, title scale, description line height, and footer density.">
      <Flex direction="column" style={{ gap: 18, maxInlineSize: 980 }}>
        {[
          ['sm', 40],
          ['md', 54],
          ['lg', 68]
        ].map(([size, avatar]) => (
          <Card key={size} size={size as any} variant="surface" radius={8} style={{ maxInlineSize: size === 'lg' ? 760 : size === 'md' ? 610 : 520 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  inlineSize: avatar as number,
                  blockSize: avatar as number,
                  borderRadius: 999,
                  display: 'grid',
                  placeItems: 'center',
                  background: '#e2e8f0',
                  color: '#3358c5',
                  fontSize: (avatar as number) * 0.45,
                  lineHeight: 1
                }}
              >
                T
              </div>
              <div style={{ display: 'grid', gap: 'var(--ui-card-header-gap, 4px)' }}>
                <CardTitle as="div">Teodros Girmay</CardTitle>
                <CardDescription as="div">Engineering</CardDescription>
              </div>
            </div>
            <CardFooter style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{String(size).toUpperCase()} density</span>
              <span>Footer follows size too</span>
            </CardFooter>
          </Card>
        ))}
      </Flex>
    </ShowcaseSection>
  </ShowcasePage>
);

export const StructuredComposition = () => (
  <ShowcasePage
    eyebrow="Composition"
    title="Structured card composition"
    description="Use the convenience subcomponents to write readable card markup while preserving the same slot contract underneath."
  >
    <ShowcaseSection title="Semantic sections" description="Header, media, inset, title, description, and footer helpers keep the structure clear for developers.">
        <Card variant="soft" tone="info" size="lg" radius={12} style={{ maxInlineSize: 540 }}>
          <CardMedia>
            <div
            style={{
              aspectRatio: '16 / 8',
              background: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 40%, #e0f2fe 100%)',
              display: 'grid',
              placeItems: 'center',
              color: '#1d4ed8',
              fontSize: 42,
              fontWeight: 700
            }}
          >
            Q3
          </div>
        </CardMedia>
        <CardHeader>
          <CardTitle>Quarterly planning workspace</CardTitle>
          <CardDescription style={{ color: '#475569' }}>
            Centralize milestones, owner updates, and launch decisions for the quarter.
          </CardDescription>
        </CardHeader>
        <div style={{ color: '#334155', fontSize: 14, lineHeight: '22px' }}>
          Use the convenience exports when teams want a clear authoring model without remembering slot names for every section.
        </div>
        <CardFooter style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: 13, lineHeight: '18px' }}>
          <span>6 active workstreams</span>
          <span>Updated today</span>
        </CardFooter>
      </Card>
    </ShowcaseSection>
  </ShowcasePage>
);

export const InteractiveStates = () => (
  <ShowcasePage
    eyebrow="Interaction"
    title="Interactive card states"
    description="Interactive cards now support keyboard focus, activation, and disabled semantics in addition to hover styling."
  >
    <ShowcaseSection
      title="Focus and activation"
      description="Use interactive cards for clickable summary surfaces. They receive button semantics and keyboard activation by default."
    >
      <Grid style={{ gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <Card
          interactive
          variant="surface"
          elevation="low"
          radius={12}
          onClick={() => window.alert('Card activated')}
          style={{ minBlockSize: 152 }}
        >
          <CardHeader>
            <CardTitle>Interactive project summary</CardTitle>
            <CardDescription>Press Enter or Space after focusing the card to activate it.</CardDescription>
          </CardHeader>
          <div style={{ color: '#334155', fontSize: 14, lineHeight: '22px' }}>
            This is the production interaction model for clickable cards.
          </div>
        </Card>

        <Card interactive disabled variant="outline" radius={12} style={{ minBlockSize: 152 }}>
          <CardHeader>
            <CardTitle>Disabled state</CardTitle>
            <CardDescription>The disabled card is not focusable and exposes aria-disabled.</CardDescription>
          </CardHeader>
          <div style={{ color: '#64748b', fontSize: 14, lineHeight: '22px' }}>
            Use disabled when the whole card surface should be unavailable.
          </div>
        </Card>
      </Grid>
    </ShowcaseSection>
  </ShowcasePage>
);
`,V=`import React from 'react';
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
`,U=`import React from 'react';
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
`,q=`import React from 'react';
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
`,j=`import React from 'react';
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
`,$=`import React from 'react';
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
`,Q=`import React, { useState } from 'react';
import { Box, Command, Grid } from '@editora/ui-react';
import {
  ShowcasePage,
  ShowcaseSection,
  showcaseCaptionStyle,
  showcaseChipRowStyle,
  showcaseChipStyle,
  showcasePanelStyle
} from './storybook-showcase';

const commandSurface: React.CSSProperties = {
  maxWidth: 680,
  marginInline: 'auto'
};

const statusCard: React.CSSProperties = {
  border: '1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 78%, transparent)',
  borderRadius: 14,
  background: 'linear-gradient(180deg, color-mix(in srgb, var(--ui-color-surface, #ffffff) 96%, #f8fafc 4%), var(--ui-color-surface, #ffffff))',
  padding: 16
};

const commandItem: React.CSSProperties = {
  display: 'grid',
  gap: 2
};

const commandMeta: React.CSSProperties = {
  fontSize: 11,
  color: 'var(--ui-color-muted, #64748b)'
};

export default {
  title: 'UI/Command',
  component: Command
};

export const WorkspaceActions = () => {
  const [lastSelected, setLastSelected] = useState('none');
  const [query, setQuery] = useState('');

  return (
    <ShowcasePage
      eyebrow="Command Primitive"
      title="Command surfaces should feel crisp, fast, and deeply navigable"
      description="This story exists to validate the lower-level command pattern beneath palettes and search-driven action surfaces."
      meta={[
        { label: 'Search state', value: query ? 'Active' : 'Idle' },
        { label: 'Last command', value: lastSelected },
        { label: 'Pattern', value: 'Keyboard-first', tone: 'success' }
      ]}
    >
      <ShowcaseSection
        eyebrow="Workspace Actions"
        title="Command list"
        description="A command surface should read like a precision tool. Search, match, and selection feedback all need clear rhythm and hierarchy."
      >
        <Grid style={{ display: 'grid', gap: 16 }}>
          <div style={showcaseChipRowStyle}>
            <span style={showcaseChipStyle}>Search-driven</span>
            <span style={showcaseChipStyle}>Listbox-backed</span>
            <span style={showcaseChipStyle}>Action oriented</span>
          </div>
          <Box style={commandSurface}>
            <Command
              placeholder="Search workspace actions..."
              emptyText="No matching commands in this workspace."
              onQueryChange={setQuery}
              onSelect={(detail) => {
                setLastSelected(detail.value || detail.label);
              }}
            >
              <div slot="command" data-value="open-file" data-keywords="file open workspace" style={commandItem}>
                <strong>Open file</strong>
                <span style={commandMeta}>Jump to a document or asset in the current workspace.</span>
              </div>
              <div slot="command" data-value="rename-symbol" data-keywords="rename refactor symbol" style={commandItem}>
                <strong>Rename symbol</strong>
                <span style={commandMeta}>Safely update references across the current project.</span>
              </div>
              <div slot="command" data-value="format-document" data-keywords="format prettier code" style={commandItem}>
                <strong>Format document</strong>
                <span style={commandMeta}>Apply the shared formatting policy to the active editor.</span>
              </div>
              <div slot="command" data-value="toggle-sidebar" data-keywords="sidebar navigation layout" style={commandItem}>
                <strong>Toggle sidebar</strong>
                <span style={commandMeta}>Show or hide the surrounding navigation chrome.</span>
              </div>
            </Command>
          </Box>

          <Box style={{ ...showcasePanelStyle, maxWidth: 680, marginInline: 'auto' }}>
            <strong style={{ color: '#0f172a' }}>Command state</strong>
            <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>
              Query: {query || 'empty'}
            </Box>
            <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>
              Last selected: {lastSelected}
            </Box>
            <p style={showcaseCaptionStyle}>The surrounding panel gives a stable place to inspect match and selection behavior during refinement.</p>
          </Box>
        </Grid>
      </ShowcaseSection>
    </ShowcasePage>
  );
};
`,Z=`import React, { useMemo, useState } from 'react';
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
  const [query, setQuery] = useState('');

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <Flex style={{ display: 'flex', gap: 8 }}>
        <Button onClick={() => setOpen(true)}>Open Palette</Button>
        <Button variant="secondary" onClick={() => setOpen(false)}>Close</Button>
      </Flex>

      <CommandPalette
        open={open}
        query={query}
        placeholder="Search workflows"
        emptyText="No command matches"
        onQueryChange={(detail) => setQuery(detail.value)}
        onSelect={(detail) => {
          setSelected(detail.index);
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
        Selected: {selected == null ? 'none' : commands[selected]} • query: {query || 'empty'}
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
`,J=`import React from 'react';
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
`,K=`import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { createThemeTokens, type AccentPaletteName, type ThemeTokens } from '@editora/ui-core';
import { Badge, Box, Button, Card, CardDescription, CardHeader, CardTitle, ContextMenu, Flex, Grid, ThemeProvider } from '@editora/ui-react';
import { CheckCircleIcon, ClipboardCheckIcon, FolderIcon, HomeIcon, LayersIcon, ShieldIcon, SparklesIcon, TrashIcon } from '@editora/react-icons';

const baseItems = [
  { label: 'Edit', shortcut: '⌘ E' },
  { label: 'Duplicate', shortcut: '⌘ D' },
  { separator: true },
  { label: 'Archive', shortcut: '⌘ N' },
  {
    label: 'More',
    submenu: [
      { label: 'Move to project…' },
      { label: 'Move to folder…' },
      { separator: true },
      { label: 'Advanced options…' },
    ],
  },
  { separator: true },
  { label: 'Share' },
  { label: 'Add to favorites' },
  { separator: true },
  { label: 'Delete', shortcut: '⌘ ⌫', tone: 'danger' as const },
] as const;

const meta: Meta<typeof ContextMenu> = {
  title: 'UI/ContextMenu',
  component: ContextMenu,
  args: {
    variant: 'surface',
    size: 'md',
    radius: 12,
    elevation: 'low',
    tone: 'default',
    state: 'idle',
    closeOnSelect: true,
    closeOnEscape: true,
    typeahead: true,
    disabled: false,
  },
  argTypes: {
    variant: { control: 'select', options: ['surface', 'soft', 'solid', 'outline', 'contrast', 'flat'] },
    size: { control: 'select', options: ['sm', 'md', 'lg', '1', '2', '3'] },
    radius: { control: 'text' },
    elevation: { control: 'select', options: ['none', 'low', 'high'] },
    tone: { control: 'select', options: ['default', 'neutral', 'info', 'success', 'warning', 'danger'] },
    state: { control: 'select', options: ['idle', 'loading', 'error', 'success'] },
    closeOnSelect: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' },
    typeahead: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof ContextMenu>;

function TabButton(props: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      style={{
        appearance: 'none',
        border: 'none',
        borderBottom: props.active ? '3px solid var(--ui-color-primary, #2563eb)' : '3px solid transparent',
        background: 'transparent',
        color: props.active ? 'var(--ui-color-text, #0f172a)' : 'var(--ui-color-muted, #64748b)',
        padding: '14px 4px 12px',
        font: '600 15px/1.4 inherit',
        cursor: 'pointer',
      }}
    >
      {props.children}
    </button>
  );
}

type StoryPaletteName = AccentPaletteName | 'purple';

function paletteTokens(name: StoryPaletteName) {
  if (name === 'purple') {
    return createThemeTokens({
      colors: {
        primary: '#8b5cf6',
        primaryHover: '#7c3aed',
        focusRing: '#8b5cf6',
      },
      palette: {
        accent: {
          '1': '#fdfcff',
          '2': '#faf7ff',
          '3': '#f3ecff',
          '4': '#eadcff',
          '5': '#ddc7ff',
          '6': '#cdb0ff',
          '7': '#b693ff',
          '8': '#9b70ff',
          '9': '#8b5cf6',
          '10': '#7c3aed',
          '11': '#6d28d9',
          '12': '#2e1065',
        },
        accentAlpha: {
          '1': '#7c3aed03',
          '2': '#7c3aed08',
          '3': '#7c3aed14',
          '4': '#7c3aed24',
          '5': '#7c3aed38',
          '6': '#7c3aed4d',
          '7': '#7c3aed68',
          '8': '#7c3aed8f',
          '9': '#7c3aed',
          '10': '#6d28d9',
          '11': '#5b21b6',
          '12': '#2e1065',
        },
        accentContrast: '#ffffff',
        accentSurface: '#f5f0ffcc',
        accentIndicator: '#8b5cf6',
        accentTrack: '#8b5cf6',
      },
    } satisfies Partial<ThemeTokens>, { accentPalette: 'blue', mode: 'light' });
  }
  return createThemeTokens({}, { accentPalette: name, mode: 'light' });
}

function ContextZone(props: {
  label: string;
  variant: 'surface' | 'soft' | 'solid' | 'outline' | 'contrast' | 'flat';
  size: 'sm' | 'md' | 'lg' | '1' | '2' | '3';
  tone?: 'default' | 'neutral' | 'info' | 'success' | 'warning' | 'danger';
  radius?: number | string;
  elevation?: 'none' | 'low' | 'high';
  state?: 'idle' | 'loading' | 'error' | 'success';
  palette?: StoryPaletteName;
}) {
  const [menu, setMenu] = React.useState<{ open: boolean; point?: { x: number; y: number } }>({ open: false });

  const content = (
    <Box
      onContextMenu={(event) => {
        event.preventDefault();
        setMenu({ open: true, point: { x: event.clientX, y: event.clientY } });
      }}
      style={{
        display: 'grid',
        placeItems: 'center',
        minHeight: 92,
        borderRadius: 14,
        border: '2px dashed color-mix(in srgb, var(--ui-color-primary, #2563eb) 34%, transparent)',
        color: 'color-mix(in srgb, var(--ui-color-primary, #2563eb) 70%, var(--ui-color-text, #0f172a))',
        background: 'linear-gradient(180deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 4%, white) 0%, color-mix(in srgb, var(--ui-color-primary, #2563eb) 2%, white) 100%)',
        fontSize: 17,
        lineHeight: '24px',
      }}
    >
      {props.label}
      <ContextMenu
        open={menu.open}
        anchorPoint={menu.point}
        items={baseItems as any}
        variant={props.variant}
        size={props.size}
        tone={props.tone}
        radius={props.radius}
        elevation={props.elevation}
        state={props.state}
        onClose={() => setMenu((current) => ({ ...current, open: false }))}
      />
    </Box>
  );

  if (!props.palette) return content;

  return <ThemeProvider tokens={paletteTokens(props.palette)}>{content}</ThemeProvider>;
}

function ThemeTokenMatrixStory() {
  const [tab, setTab] = React.useState<'theme' | 'colors' | 'sizes'>('theme');

  return (
    <Grid style={{ gap: 20, maxInlineSize: 1280 }}>
      <div>
        <div style={{ fontSize: 44, lineHeight: 1.05, fontWeight: 700, color: '#111827' }}>Context Menu</div>
      </div>

      <Flex style={{ gap: 28, borderBottom: '1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 78%, transparent)' }}>
        <TabButton active={tab === 'theme'} onClick={() => setTab('theme')}>Theme colors</TabButton>
        <TabButton active={tab === 'colors'} onClick={() => setTab('colors')}>All colors</TabButton>
        <TabButton active={tab === 'sizes'} onClick={() => setTab('sizes')}>All sizes</TabButton>
      </Flex>

      {tab === 'theme' ? (
        <Grid style={{ gap: 22 }}>
          <Grid style={{ gridTemplateColumns: '120px repeat(2, minmax(240px, 1fr)) repeat(2, minmax(240px, 1fr))', gap: 18, alignItems: 'center' }}>
            <div />
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Accent</div>
            <div />
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Gray</div>
            <div />
          </Grid>
          <Grid style={{ gridTemplateColumns: '120px repeat(4, minmax(240px, 1fr))', gap: 18, alignItems: 'center' }}>
            <div style={{ fontSize: 18, color: '#5b6574' }}>Solid</div>
            <ContextZone label="Right-click here" variant="solid" size="md" elevation="low" palette="blue" />
            <ContextZone label="Right-click here" variant="solid" size="md" elevation="low" palette="blue" tone="neutral" />
            <ContextZone label="Right-click here" variant="solid" size="md" elevation="low" palette="gray" />
            <ContextZone label="Right-click here" variant="solid" size="md" elevation="low" palette="gray" tone="neutral" />

            <div style={{ fontSize: 18, color: '#5b6574' }}>Soft</div>
            <ContextZone label="Right-click here" variant="soft" size="md" elevation="low" palette="blue" />
            <ContextZone label="Right-click here" variant="soft" size="md" elevation="low" palette="blue" tone="neutral" />
            <ContextZone label="Right-click here" variant="soft" size="md" elevation="low" palette="gray" />
            <ContextZone label="Right-click here" variant="soft" size="md" elevation="low" palette="gray" tone="neutral" />
          </Grid>
        </Grid>
      ) : null}

      {tab === 'colors' ? (
        <Grid style={{ gap: 16 }}>
          <Grid style={{ gridTemplateColumns: '120px repeat(2, minmax(260px, 1fr))', gap: 18, alignItems: 'center' }}>
            <div />
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Solid</div>
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Soft</div>
            {(['gray', 'amber', 'red', 'purple', 'blue', 'green'] as const satisfies readonly StoryPaletteName[]).map((name) => (
              <React.Fragment key={name}>
                <div style={{ fontSize: 18, color: '#5b6574', textTransform: 'capitalize' }}>{name}</div>
                <ContextZone label="Right-click here" variant="solid" size="md" elevation="low" palette={name} />
                <ContextZone label="Right-click here" variant="soft" size="md" elevation="low" palette={name} />
              </React.Fragment>
            ))}
          </Grid>
        </Grid>
      ) : null}

      {tab === 'sizes' ? (
        <Grid style={{ gap: 18 }}>
          <Grid style={{ gridTemplateColumns: '120px repeat(2, minmax(280px, 1fr))', gap: 18, alignItems: 'center' }}>
            <div />
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Solid</div>
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Soft</div>
            {(['1', '2', '3'] as const).map((size) => (
              <React.Fragment key={size}>
                <div style={{ fontSize: 18, color: '#5b6574' }}>Size {size}</div>
                <ContextZone label="Right-click here" variant="solid" size={size} elevation="low" palette="blue" />
                <ContextZone label="Right-click here" variant="soft" size={size} elevation="low" palette="blue" />
              </React.Fragment>
            ))}
          </Grid>
        </Grid>
      ) : null}
    </Grid>
  );
}

export const ThemeTokenMatrix: Story = {
  render: () => <ThemeTokenMatrixStory />,
};

export const Playground: Story = {
  render: (args) => {
    const [menu, setMenu] = React.useState<{ open: boolean; point?: { x: number; y: number } }>({ open: false });
    const [lastAction, setLastAction] = React.useState('No action yet');

    return (
      <Grid style={{ gap: 16, maxInlineSize: 1040 }}>
        <Card radius={18}>
          <CardHeader>
            <CardTitle>Anchored production surface</CardTitle>
            <CardDescription>
              Right-click the canvas to inspect the real component contract: variants, size, radius, elevation, tone, state, keyboard support, and submenu handling.
            </CardDescription>
          </CardHeader>
          <Box slot="inset" style={{ padding: 16, display: 'grid', gap: 16 }}>
            <Box
              onContextMenu={(event) => {
                event.preventDefault();
                setMenu({ open: true, point: { x: event.clientX, y: event.clientY } });
              }}
              style={{
                minHeight: 220,
                borderRadius: 18,
                border: '2px dashed color-mix(in srgb, var(--ui-color-primary, #2563eb) 34%, transparent)',
                background: 'linear-gradient(180deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 4%, white) 0%, color-mix(in srgb, var(--ui-color-primary, #2563eb) 2%, white) 100%)',
                display: 'grid',
                placeItems: 'center',
                padding: 24,
              }}
            >
              <Grid style={{ gap: 12, justifyItems: 'center', textAlign: 'center' }}>
                <Flex align="center" style={{ gap: 10 }}>
                  <ShieldIcon size={16} />
                  <span style={{ fontWeight: 700 }}>Critical Escalation Workspace</span>
                </Flex>
                <div style={{ maxInlineSize: 560, color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
                  Right-click anywhere in this surface to open the context menu. The component is portaled, typeahead-aware, submenu-capable, and theme-token driven.
                </div>
                <Badge tone="info">Right-click here</Badge>
              </Grid>
            </Box>

            <Flex align="center" justify="space-between" style={{ gap: 12, flexWrap: 'wrap' }}>
              <Flex align="center" style={{ gap: 10, flexWrap: 'wrap' }}>
                <Button variant="secondary" onClick={() => setMenu((current) => ({ ...current, open: false }))}>
                  Close menu
                </Button>
                <Badge tone="success">{lastAction}</Badge>
              </Flex>
              <Flex align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
                <Badge tone={args.state === 'error' ? 'danger' : args.state === 'success' ? 'success' : args.state === 'loading' ? 'warning' : 'neutral'}>
                  {args.state}
                </Badge>
              </Flex>
            </Flex>
          </Box>
        </Card>

        <ContextMenu
          {...args}
          open={menu.open}
          anchorPoint={menu.point}
          items={baseItems as any}
          onClose={() => setMenu((current) => ({ ...current, open: false }))}
          onSelect={(detail) => {
            setLastAction(detail.label || detail.value || 'Unknown action');
            args.onSelect?.(detail);
          }}
        />
      </Grid>
    );
  },
};

export const StructuredComposition: Story = {
  render: () => {
    const [menu, setMenu] = React.useState<{ open: boolean; point?: { x: number; y: number } }>({ open: false });

    return (
      <Grid style={{ gap: 16, maxInlineSize: 920 }}>
        <Card radius={18} variant="soft" tone="info">
          <CardHeader>
            <CardTitle>Structured composition</CardTitle>
            <CardDescription>
              Use custom slotted content when the built-in \`items\` model is not expressive enough for mixed labels, captions, and workflow-specific states.
            </CardDescription>
          </CardHeader>
          <Box slot="inset" style={{ padding: 16 }}>
            <Box
              onContextMenu={(event) => {
                event.preventDefault();
                setMenu({ open: true, point: { x: event.clientX, y: event.clientY } });
              }}
              style={{
                minHeight: 160,
                borderRadius: 16,
                border: '2px dashed color-mix(in srgb, var(--ui-color-primary, #2563eb) 34%, transparent)',
                display: 'grid',
                placeItems: 'center',
                color: '#334155',
              }}
            >
              <Flex align="center" style={{ gap: 10 }}>
                <SparklesIcon size={16} />
                <span>Right-click the workflow card</span>
              </Flex>
            </Box>
          </Box>
        </Card>

        <ContextMenu
          open={menu.open}
          anchorPoint={menu.point}
          variant="soft"
          size="md"
          radius={12}
          elevation="low"
          onClose={() => setMenu((current) => ({ ...current, open: false }))}
        >
          <div className="section-label">Workflow actions</div>
          <div className="menuitem" role="menuitem" tabIndex={0}>
            <span className="icon"><HomeIcon size={14} /></span>
            <span className="label">
              <span className="text">Open review room</span>
              <span className="caption">Continue moderated triage</span>
            </span>
            <span className="shortcut">⌘ R</span>
          </div>
          <div className="menuitem" role="menuitem" tabIndex={0}>
            <span className="icon"><ClipboardCheckIcon size={14} /></span>
            <span className="label">
              <span className="text">Sync operator notes</span>
              <span className="caption">Refresh assignee comments</span>
            </span>
            <span className="shortcut">⌘ S</span>
          </div>
          <div className="separator" role="separator" />
          <div className="menuitem" role="menuitem" tabIndex={0} data-tone="danger">
            <span className="icon"><TrashIcon size={14} /></span>
            <span className="label">
              <span className="text">Delete draft</span>
              <span className="caption">This action cannot be undone</span>
            </span>
          </div>
        </ContextMenu>
      </Grid>
    );
  },
};
`,Y=`import React from 'react';
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
        <Pagination id="users-pagination" page={page} />
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
        <Pagination id="orders-pagination" page={page} />
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
        <Pagination id="filter-pagination" page={page} />
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
        <Pagination id="pinned-pagination" page={page} />
      </Flex>
    </Grid>
  );
};
`,X=`import React, { useState } from 'react';
import { Box, DateField, Grid, TimeField } from '@editora/ui-react';
import {
  ShowcasePage,
  ShowcaseSection,
  showcaseCaptionStyle,
  showcaseChipRowStyle,
  showcaseChipStyle,
  showcasePanelStyle
} from './storybook-showcase';

export default {
  title: 'UI/DateTimeField',
  component: DateField
};

export const Playground = () => {
  const [date, setDate] = useState('2026-03-09');
  const [time, setTime] = useState('09:30');

  return (
    <ShowcasePage
      eyebrow="Segmented Fields"
      title="Date and time fields should feel keyboard-native, not like weakened picker leftovers"
      description="These stories validate segmented editing, range clamping, and whether the fields maintain clear hierarchy without depending on popup pickers."
      meta={[
        { label: 'Date range', value: '2024-2028' },
        { label: 'Time mode', value: '12h' },
        { label: 'Interaction', value: 'Keyboard-first', tone: 'success' }
      ]}
    >
      <ShowcaseSection
        eyebrow="Default Pattern"
        title="Launch scheduling"
        description="The paired date and time fields should feel calm and structured enough for scheduling, approvals, and release planning."
      >
        <Box style={{ display: 'grid', gap: 16 }}>
          <div style={showcaseChipRowStyle}>
            <span style={showcaseChipStyle}>Segmented entry</span>
            <span style={showcaseChipStyle}>Arrow-key stepping</span>
            <span style={showcaseChipStyle}>Range-aware</span>
          </div>
          <Grid style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(2, minmax(260px, 1fr))' }}>
            <DateField
              label="Launch date"
              description="Segmented, keyboard-first date entry."
              value={date}
              onValueChange={(value) => setDate(value || '')}
              min="2024-01-01"
              max="2028-12-31"
            />
            <TimeField
              label="Launch time"
              description="Segmented time entry without opening a picker."
              value={time}
              onValueChange={(value) => setTime(value || '')}
              format="12h"
            />
          </Grid>
          <Box style={showcasePanelStyle}>
            <strong style={{ color: '#0f172a' }}>Value snapshot</strong>
            <Box style={{ color: '#64748b', fontSize: 13 }}>
              {date || 'empty'} {time || 'empty'}
            </Box>
          </Box>
        </Box>
      </ShowcaseSection>
    </ShowcasePage>
  );
};

export const DenseAdminEntry = () => (
  <ShowcaseSection
    eyebrow="Dense Form"
    title="Admin entry row"
    description="Segmented fields should compress into denser admin surfaces without losing clarity or making the active segment hard to track."
  >
    <Grid style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(2, minmax(260px, 1fr))' }}>
      <DateField
        label="Maintenance window"
        description="Optimized for dense forms and table editors."
        value="2026-04-12"
        locale="en-GB"
      />
      <TimeField
        label="Window start"
        description="24-hour segmented entry with seconds."
        value="21:45:10"
        seconds
      />
    </Grid>
  </ShowcaseSection>
);

export const BoundedRange = () => {
  const [date, setDate] = useState('2026-03-09');

  return (
    <ShowcaseSection
      eyebrow="Range Behavior"
      title="Bounded year"
      description="This story exists to make clamping behavior obvious. When the configured range stays within one year, the year segment should remain visually stable under arrow-key input."
    >
      <Grid style={{ display: 'grid', gap: 16, maxWidth: 560 }}>
        <DateField
          label="Contract year"
          description="This example intentionally clamps the year. Arrow keys stop at the configured min/max range."
          value={date}
          onValueChange={(value) => setDate(value || '')}
          min="2026-01-01"
          max="2026-12-31"
        />
        <Box style={showcasePanelStyle}>
          <strong style={{ color: '#0f172a' }}>Bounded value</strong>
          <Box style={{ color: '#64748b', fontSize: 13 }}>{date}</Box>
        </Box>
        <p style={showcaseCaptionStyle}>If the range widens, the year segment should step normally again. This story shows the intentionally clamped case.</p>
      </Grid>
    </ShowcaseSection>
  );
};
`,ee=`import React from 'react';
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
`,te=`import React from 'react';
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
`,oe=`import React from 'react';
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
`,ae=`import React, { useState } from 'react';
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
`,ne=`import React, { useState } from 'react';
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
import type { Meta, StoryObj } from '@storybook/react';
import { createThemeTokens, type AccentPaletteName, type ThemeTokens } from '@editora/ui-core';
import { Badge, Box, Button, Dropdown, Flex, Grid, ThemeProvider } from '@editora/ui-react';

const meta: Meta<typeof Dropdown> = {
  title: 'UI/Dropdown',
  component: Dropdown,
  args: {
    open: false,
    placement: 'bottom',
    variant: 'soft',
    size: 'md',
    density: 'default',
    shape: 'rounded',
    elevation: 'low',
    radius: 12,
    tone: 'default',
    closeOnSelect: true,
    typeahead: true,
  },
  argTypes: {
    open: { control: 'boolean' },
    placement: { control: 'select', options: ['bottom', 'top', 'left', 'right'] },
    variant: {
      control: 'select',
      options: ['default', 'surface', 'soft', 'filled', 'outline', 'flat', 'line', 'minimal', 'ghost', 'glass', 'solid', 'contrast'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg', '1', '2', '3'] },
    density: { control: 'select', options: ['default', 'compact', 'comfortable'] },
    shape: { control: 'select', options: ['rounded', 'square', 'soft', 'pill'] },
    elevation: { control: 'select', options: ['none', 'low', 'high'] },
    tone: { control: 'select', options: ['default', 'brand', 'neutral', 'info', 'danger', 'success', 'warning'] },
    radius: { control: 'text' },
    closeOnSelect: { control: 'boolean' },
    typeahead: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof Dropdown>;
type StoryPaletteName = AccentPaletteName | 'purple';
const paletteTokenCache = new Map<StoryPaletteName, ThemeTokens>();

const menuItems = [
  { value: 'edit', label: 'Edit page', caption: 'Quick inline changes', icon: '✏', shortcut: 'E' },
  { value: 'duplicate', label: 'Duplicate', caption: 'Clone current draft', icon: '⧉', shortcut: 'D' },
  { value: 'review', label: 'Status: In review', type: 'radio' as const, group: 'status', checked: true },
  { value: 'published', label: 'Status: Published', type: 'radio' as const, group: 'status', checked: false },
  { value: 'delete', label: 'Delete', caption: 'Moves item to trash', icon: '⌫', tone: 'danger' as const },
] as const;

function TabButton(props: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      style={{
        appearance: 'none',
        border: 'none',
        borderBottom: props.active ? '3px solid var(--ui-color-primary, #2563eb)' : '3px solid transparent',
        background: 'transparent',
        color: props.active ? 'var(--ui-color-text, #0f172a)' : 'var(--ui-color-muted, #64748b)',
        padding: '14px 4px 12px',
        font: '600 15px/1.4 inherit',
        cursor: 'pointer',
      }}
    >
      {props.children}
    </button>
  );
}

function paletteTokens(name: StoryPaletteName) {
  const cached = paletteTokenCache.get(name);
  if (cached) return cached;

  let tokens: ThemeTokens;
  if (name === 'purple') {
    tokens = createThemeTokens(
      {
        colors: {
          primary: '#8b5cf6',
          primaryHover: '#7c3aed',
          focusRing: '#8b5cf6',
        },
        palette: {
          accent: {
            '1': '#fdfcff',
            '2': '#faf7ff',
            '3': '#f3ecff',
            '4': '#eadcff',
            '5': '#ddc7ff',
            '6': '#cdb0ff',
            '7': '#b693ff',
            '8': '#9b70ff',
            '9': '#8b5cf6',
            '10': '#7c3aed',
            '11': '#6d28d9',
            '12': '#2e1065',
          },
          accentAlpha: {
            '1': '#7c3aed03',
            '2': '#7c3aed08',
            '3': '#7c3aed14',
            '4': '#7c3aed24',
            '5': '#7c3aed38',
            '6': '#7c3aed4d',
            '7': '#7c3aed68',
            '8': '#7c3aed8f',
            '9': '#7c3aed',
            '10': '#6d28d9',
            '11': '#5b21b6',
            '12': '#2e1065',
          },
          accentContrast: '#ffffff',
          accentSurface: '#f5f0ffcc',
          accentIndicator: '#8b5cf6',
          accentTrack: '#8b5cf6',
        },
      } satisfies Partial<ThemeTokens>,
      { accentPalette: 'blue', mode: 'light' }
    );
  } else {
    tokens = createThemeTokens({}, { accentPalette: name, mode: 'light' });
  }

  paletteTokenCache.set(name, tokens);
  return tokens;
}

function DropdownMenuContent() {
  return (
    <Box slot="content" role="menu" style={{ display: 'grid', gap: 0 }}>
      <Box role="menuitem" data-value={menuItems[0].value} tabIndex={-1} className="item">
        <span className="icon" aria-hidden="true">{menuItems[0].icon}</span>
        <span className="label">
          <span className="text">{menuItems[0].label}</span>
          <span className="caption">{menuItems[0].caption}</span>
        </span>
        <span className="shortcut">{menuItems[0].shortcut}</span>
      </Box>

      <Box role="menuitem" data-value={menuItems[1].value} tabIndex={-1} className="item">
        <span className="icon" aria-hidden="true">{menuItems[1].icon}</span>
        <span className="label">
          <span className="text">{menuItems[1].label}</span>
          <span className="caption">{menuItems[1].caption}</span>
        </span>
        <span className="shortcut">{menuItems[1].shortcut}</span>
      </Box>

      <Box role="separator" className="separator" />

      <Box
        role="menuitemradio"
        data-group={menuItems[2].group}
        data-value={menuItems[2].value}
        aria-checked="true"
        tabIndex={-1}
        className="item"
      >
        <span className="selection-icon" aria-hidden="true" />
        <span className="label">
          <span className="text">{menuItems[2].label}</span>
        </span>
      </Box>

      <Box
        role="menuitemradio"
        data-group={menuItems[3].group}
        data-value={menuItems[3].value}
        aria-checked="false"
        tabIndex={-1}
        className="item"
      >
        <span className="selection-icon" aria-hidden="true" />
        <span className="label">
          <span className="text">{menuItems[3].label}</span>
        </span>
      </Box>

      <Box role="separator" className="separator" />

      <Box role="menuitem" data-value={menuItems[4].value} tabIndex={-1} className="item" data-tone="danger">
        <span className="icon" aria-hidden="true">{menuItems[4].icon}</span>
        <span className="label">
          <span className="text">{menuItems[4].label}</span>
          <span className="caption">{menuItems[4].caption}</span>
        </span>
      </Box>
    </Box>
  );
}

function DropdownPreview(props: {
  variant: 'surface' | 'soft' | 'solid' | 'contrast';
  size: 'sm' | 'md' | 'lg' | '1' | '2' | '3';
  palette?: StoryPaletteName;
  elevation?: 'none' | 'low' | 'high';
  radius?: number | string;
  tone?: 'default' | 'brand' | 'neutral' | 'info' | 'danger' | 'success' | 'warning';
  label?: string;
  caption?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [lastAction, setLastAction] = React.useState('None');

  const content = (
    <Grid style={{ gap: 12 }}>
      <Box
        style={{
          minHeight: 148,
          borderRadius: 16,
          border: '2px dashed color-mix(in srgb, var(--ui-color-primary, #2563eb) 30%, transparent)',
          background:
            'linear-gradient(180deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 4%, white) 0%, color-mix(in srgb, var(--ui-color-primary, #2563eb) 2%, white) 100%)',
          display: 'grid',
          placeItems: 'center',
          padding: 20,
        }}
      >
        <Box style={{ width: 'min(280px, 100%)', display: 'grid', gap: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ui-color-text, #0f172a)' }}>{props.label || 'Review actions'}</div>
          <Dropdown
            open={open}
            onChange={setOpen}
            onSelect={(detail) => setLastAction(detail.label || detail.value || 'Unknown')}
            variant={props.variant}
            size={props.size}
            elevation={props.elevation}
            radius={props.radius}
            tone={props.tone}
          >
            <Button slot="trigger">{open ? 'Close menu' : 'Open menu'}</Button>
            <DropdownMenuContent />
          </Dropdown>
        </Box>
      </Box>
      <Flex justify="space-between" align="center" style={{ gap: 10, flexWrap: 'wrap' }}>
        {props.caption ? <div style={{ fontSize: 13, color: '#64748b' }}>{props.caption}</div> : <span />}
        <Badge tone="neutral">last action: {lastAction}</Badge>
      </Flex>
    </Grid>
  );

  if (!props.palette) return content;
  return (
    <ThemeProvider tokens={paletteTokens(props.palette)} storageKey={null}>
      {content}
    </ThemeProvider>
  );
}

function ThemeTokenMatrixStory() {
  const [tab, setTab] = React.useState<'theme' | 'colors' | 'sizes'>('theme');

  return (
    <Grid style={{ gap: 20, maxInlineSize: 1280 }}>
      <div>
        <div style={{ fontSize: 44, lineHeight: 1.05, fontWeight: 700, color: '#111827' }}>Dropdown</div>
      </div>

      <Flex style={{ gap: 28, borderBottom: '1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 78%, transparent)' }}>
        <TabButton active={tab === 'theme'} onClick={() => setTab('theme')}>
          Theme colors
        </TabButton>
        <TabButton active={tab === 'colors'} onClick={() => setTab('colors')}>
          All colors
        </TabButton>
        <TabButton active={tab === 'sizes'} onClick={() => setTab('sizes')}>
          All sizes
        </TabButton>
      </Flex>

      {tab === 'theme' ? (
        <Grid style={{ gap: 22 }}>
          <Grid style={{ gridTemplateColumns: '120px repeat(4, minmax(240px, 1fr))', gap: 18, alignItems: 'start' }}>
            <div style={{ fontSize: 18, color: '#5b6574' }}>Surface</div>
            <DropdownPreview variant="surface" size="md" elevation="low" palette="blue" />
            <DropdownPreview variant="surface" size="md" elevation="low" palette="gray" />
            <DropdownPreview variant="surface" size="md" elevation="low" palette="purple" />
            <DropdownPreview variant="surface" size="md" elevation="low" palette="green" />

            <div style={{ fontSize: 18, color: '#5b6574' }}>Soft</div>
            <DropdownPreview variant="soft" size="md" elevation="low" palette="blue" />
            <DropdownPreview variant="soft" size="md" elevation="low" palette="gray" />
            <DropdownPreview variant="soft" size="md" elevation="low" palette="purple" />
            <DropdownPreview variant="soft" size="md" elevation="low" palette="green" />

            <div style={{ fontSize: 18, color: '#5b6574' }}>Solid</div>
            <DropdownPreview variant="solid" size="md" elevation="low" palette="blue" />
            <DropdownPreview variant="solid" size="md" elevation="low" palette="gray" />
            <DropdownPreview variant="solid" size="md" elevation="low" palette="purple" />
            <DropdownPreview variant="solid" size="md" elevation="low" palette="green" />

            <div style={{ fontSize: 18, color: '#5b6574' }}>Contrast</div>
            <DropdownPreview variant="contrast" size="md" elevation="low" palette="blue" />
            <DropdownPreview variant="contrast" size="md" elevation="low" palette="gray" />
            <DropdownPreview variant="contrast" size="md" elevation="low" palette="purple" />
            <DropdownPreview variant="contrast" size="md" elevation="low" palette="green" />
          </Grid>
        </Grid>
      ) : null}

      {tab === 'colors' ? (
        <Grid style={{ gap: 16 }}>
          <Grid style={{ gridTemplateColumns: '120px repeat(3, minmax(240px, 1fr))', gap: 18, alignItems: 'start' }}>
            <div />
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Surface</div>
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Soft</div>
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Solid</div>
            {(['gray', 'amber', 'red', 'purple', 'blue', 'green'] as const satisfies readonly StoryPaletteName[]).map((name) => (
              <React.Fragment key={name}>
                <div style={{ fontSize: 18, color: '#5b6574', textTransform: 'capitalize' }}>{name}</div>
                <DropdownPreview variant="surface" size="md" elevation="low" palette={name} />
                <DropdownPreview variant="soft" size="md" elevation="low" palette={name} />
                <DropdownPreview variant="solid" size="md" elevation="low" palette={name} />
              </React.Fragment>
            ))}
          </Grid>
        </Grid>
      ) : null}

      {tab === 'sizes' ? (
        <Grid style={{ gap: 18 }}>
          <Grid style={{ gridTemplateColumns: '120px repeat(3, minmax(240px, 1fr))', gap: 18, alignItems: 'start' }}>
            <div />
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Surface</div>
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Soft</div>
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Solid</div>
            {(['1', '2', '3'] as const).map((size) => (
              <React.Fragment key={size}>
                <div style={{ fontSize: 18, color: '#5b6574' }}>Size {size}</div>
                <DropdownPreview variant="surface" size={size} elevation="low" palette="blue" />
                <DropdownPreview variant="soft" size={size} elevation="low" palette="blue" />
                <DropdownPreview variant="solid" size={size} elevation="low" palette="blue" />
              </React.Fragment>
            ))}
          </Grid>
        </Grid>
      ) : null}
    </Grid>
  );
}

export const ThemeTokenMatrix: Story = {
  render: () => <ThemeTokenMatrixStory />,
};
`,ie=`import type { Meta, StoryObj } from '@storybook/react';
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
`,se=`import React from 'react';
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
`,le=`import React, { useState } from 'react';
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
`,de=`import React from 'react';
import {
  Box,
  Button,
  Checkbox,
  ControlGroup,
  Description,
  FieldError,
  Fieldset,
  Input,
  Switch
} from '@editora/ui-react';

export default {
  title: 'UI/FieldSemantics',
  component: Fieldset
};

export const StandaloneAssociations = () => (
  <Box style={{ display: 'grid', gap: 10, maxWidth: 520 }}>
    <Input id="story-email" placeholder="ops@workspace.dev" />
    <Description htmlFor="story-email">Used for incident digests and weekly delivery reports.</Description>
    <FieldError htmlFor="story-email" active>
      Email domain must be allow-listed before rollout.
    </FieldError>
  </Box>
);

export const GroupedControls = () => (
  <Fieldset
    legend="Notification channels"
    description="Select the delivery paths that should receive deployment and incident updates."
    variant="surface"
    tone="brand"
    style={{ maxWidth: 640 }}
  >
    <ControlGroup label="Channels" orientation="horizontal" variant="soft">
      <Checkbox checked />
      <span>Email</span>
      <Checkbox />
      <span>SMS</span>
      <Checkbox checked />
      <span>Slack</span>
    </ControlGroup>
  </Fieldset>
);

export const PolicyReview = () => (
  <Fieldset
    legend="Publishing policy"
    description="These settings control how releases are exposed to customers."
    error="Approval and public release cannot both be disabled."
    invalid
    variant="soft"
    tone="warning"
    style={{ maxWidth: 720 }}
  >
    <ControlGroup label="Release controls" orientation="horizontal" variant="surface">
      <Switch checked />
      <span>Require approval</span>
      <Switch />
      <span>Auto-publish changelog</span>
      <Switch checked />
      <span>Notify account owners</span>
    </ControlGroup>
    <div slot="actions">
      <Button size="sm" variant="secondary">Reset</Button>
    </div>
    <div slot="footer">
      <Button size="sm">Save policy</Button>
    </div>
  </Fieldset>
);
`,ce=`import React, { useState } from 'react';
import { Box, Dropzone, FileUpload, Grid } from '@editora/ui-react';
import {
  ShowcasePage,
  ShowcaseSection,
  showcaseCaptionStyle,
  showcaseChipRowStyle,
  showcaseChipStyle,
  showcasePanelStyle
} from './storybook-showcase';

export default {
  title: 'UI/FileUpload',
  component: FileUpload,
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    accept: { control: 'text' },
    multiple: { control: 'boolean' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    maxFiles: { control: 'number' },
    maxSize: { control: 'number' },
    buttonText: { control: 'text' },
    dropLabel: { control: 'text' },
    uploadOnSelect: { control: 'boolean' },
    uploadButtonText: { control: 'text' }
  }
};

export const Playground = (args: any) => {
  const [names, setNames] = useState<string[]>([]);
  return (
    <ShowcasePage
      eyebrow="File Intake"
      title="Upload surfaces should feel operationally trustworthy, not like a browser-default afterthought"
      description="These stories validate pickup, drag-and-drop hierarchy, queue readability, and whether the upload contract looks at home in audit, asset, and ops workflows."
      meta={[
        { label: 'Accepts', value: args.accept },
        { label: 'Limit', value: \`\${args.maxFiles} files\` },
        { label: 'Surface', value: 'Picker + dropzone', tone: 'success' }
      ]}
    >
      <ShowcaseSection
        eyebrow="Default Pattern"
        title="Attachments"
        description="The base field should work in a form without losing hierarchy or overwhelming the surrounding layout."
      >
        <Box style={{ maxWidth: 680, display: 'grid', gap: 16 }}>
          <div style={showcaseChipRowStyle}>
            <span style={showcaseChipStyle}>Validation-aware</span>
            <span style={showcaseChipStyle}>Queue display</span>
            <span style={showcaseChipStyle}>Form-ready</span>
          </div>
          <FileUpload {...args} onChange={(files) => setNames(files.map((file) => file.name))} />
          <Box style={showcasePanelStyle}>
            <strong style={{ color: '#0f172a' }}>Selected files</strong>
            <Box style={{ color: '#64748b', fontSize: 13 }}>
              {names.length ? names.join(', ') : 'none'}
            </Box>
          </Box>
        </Box>
      </ShowcaseSection>
    </ShowcasePage>
  );
};

Playground.args = {
  label: 'Attachments',
  description: 'Upload release notes, screenshots, or audit artifacts.',
  accept: '.pdf,.png,.jpg',
  multiple: true,
  required: false,
  disabled: false,
  maxFiles: 4,
  maxSize: 5_000_000,
  buttonText: 'Browse files',
  dropLabel: 'Drop files here or browse',
  uploadOnSelect: false,
  uploadButtonText: 'Start upload'
};

export const DragAndDropSurface = () => {
  const [files, setFiles] = useState<string[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({});
  return (
    <ShowcaseSection
      eyebrow="Operational Intake"
      title="Drag-and-drop evidence capture"
      description="The dropzone pattern should feel substantial enough for incident response and audit workflows, with a queue summary that stays readable as files accumulate."
    >
      <Grid style={{ display: 'grid', gap: 16, gridTemplateColumns: 'minmax(320px, 1fr) minmax(260px, 320px)' }}>
        <Dropzone
          label="Evidence bundle"
          description="Optimized for drag-and-drop ingestion in incident workflows."
          accept=".pdf,.csv,.json"
          multiple
          maxFiles={6}
          maxSize={8_000_000}
          showPreviews
          progress={progress}
          onChange={(next) => {
            setFiles(next.map((file) => file.name));
            const nextProgress: Record<string, number> = {};
            next.forEach((file, index) => {
              nextProgress[\`\${file.name}::\${file.size}::\${file.lastModified}\`] = Math.min(100, 35 + index * 20);
            });
            setProgress(nextProgress);
          }}
        />
        <Box style={showcasePanelStyle}>
          <strong style={{ color: '#0f172a' }}>Queued files</strong>
          <Box style={{ color: '#64748b', fontSize: 13 }}>
            {files.length ? files.join(', ') : 'Drop files to populate the queue.'}
          </Box>
          <p style={showcaseCaptionStyle}>Use the side summary when the upload outcome drives a review or submission step nearby.</p>
        </Box>
      </Grid>
    </ShowcaseSection>
  );
};

function simulateUpload(delay = 420, shouldFail = false) {
  return async ({ signal, setProgress }: { signal: AbortSignal; setProgress(progress: number): void }) => {
    for (const progress of [18, 42, 67, 88, 100]) {
      if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
      await new Promise((resolve) => setTimeout(resolve, delay / 5));
      setProgress(progress);
    }
    if (shouldFail) throw new Error('Server rejected this file');
  };
}

export const UploadWorkflow = () => {
  const [events, setEvents] = useState<string[]>([]);
  return (
    <ShowcaseSection
      eyebrow="Upload Workflow"
      title="Manual start upload with lifecycle feedback"
      description="This is the production path for review or submission workflows where files should be queued first and uploaded only after user confirmation."
    >
      <Grid style={{ display: 'grid', gap: 16, gridTemplateColumns: 'minmax(320px, 1fr) minmax(260px, 320px)' }}>
        <FileUpload
          label="Release assets"
          description="Queue files, then start upload when the batch is ready."
          accept=".zip,.pdf,.png"
          multiple
          maxFiles={5}
          maxSize={12_000_000}
          uploadButtonText="Start upload"
          onUploadRequest={simulateUpload()}
          onUploadStart={() => setEvents((current) => ['Upload started', ...current].slice(0, 5))}
          onUploadSuccess={(detail) => setEvents((current) => [\`Uploaded \${detail.file?.name}\`, ...current].slice(0, 5))}
          onUploadError={(detail) => setEvents((current) => [\`Failed \${detail.file?.name}: \${detail.error}\`, ...current].slice(0, 5))}
        />
        <Box style={showcasePanelStyle}>
          <strong style={{ color: '#0f172a' }}>Recent lifecycle events</strong>
          <Box style={{ color: '#64748b', fontSize: 13 }}>
            {events.length ? events.join(' | ') : 'Select files and start the upload to inspect the lifecycle.'}
          </Box>
          <p style={showcaseCaptionStyle}>Use this pattern when files must be reviewed before hitting the server.</p>
        </Box>
      </Grid>
    </ShowcaseSection>
  );
};

export const AutoUploadQueue = () => {
  const [summary, setSummary] = useState('Waiting for files');
  return (
    <ShowcaseSection
      eyebrow="Auto Upload"
      title="Automatic upload after selection"
      description="This path suits messenger, support, and intake tools where the interaction should immediately start the transfer."
    >
      <Grid style={{ display: 'grid', gap: 16, gridTemplateColumns: 'minmax(320px, 1fr) minmax(260px, 320px)' }}>
        <Dropzone
          label="Incident evidence"
          description="Files begin uploading as soon as they are dropped."
          multiple
          uploadOnSelect
          uploadButtonText="Uploading"
          onUploadRequest={simulateUpload(360)}
          onUploadStart={() => setSummary('Upload started')}
          onUploadComplete={() => setSummary('All uploads finished')}
        />
        <Box style={showcasePanelStyle}>
          <strong style={{ color: '#0f172a' }}>Queue status</strong>
          <Box style={{ color: '#64748b', fontSize: 13 }}>{summary}</Box>
          <p style={showcaseCaptionStyle}>Auto-start is best when there is no separate review gate.</p>
        </Box>
      </Grid>
    </ShowcaseSection>
  );
};

export const FailureAndRetry = () => {
  const [shouldFail, setShouldFail] = useState(true);
  return (
    <ShowcaseSection
      eyebrow="Recovery"
      title="Failure and retry workflow"
      description="A production uploader needs an honest failure path that leaves the queue actionable instead of silently resetting the file row."
    >
      <Grid style={{ display: 'grid', gap: 16, gridTemplateColumns: 'minmax(320px, 1fr) minmax(260px, 320px)' }}>
        <FileUpload
          label="Compliance package"
          description="The first attempt fails, then retries succeed."
          multiple
          uploadButtonText="Retry uploads"
          onUploadRequest={async (context) => {
            await simulateUpload(320, shouldFail)(context);
            setShouldFail(false);
          }}
        />
        <Box style={showcasePanelStyle}>
          <strong style={{ color: '#0f172a' }}>Failure contract</strong>
          <Box style={{ color: '#64748b', fontSize: 13 }}>
            First run returns a server error. Use the per-file retry action or the queue-level retry button to recover.
          </Box>
        </Box>
      </Grid>
    </ShowcaseSection>
  );
};
`,pe=`import React from 'react';
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
`,ue=`import React from 'react';
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
`,me=`import React, { useState } from 'react';
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
`,fe=`import React from 'react';
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
`,he=`import React from 'react';
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
`,ye=`import React from 'react';
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
`,ve=`import React from 'react';
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
`,be=`import React from 'react';
import { Box, InlineEdit } from '@editora/ui-react';

export default {
  title: 'UI/InlineEdit',
  component: InlineEdit
};

export const EditorialCard = () => {
  const [title, setTitle] = React.useState('Q2 Incident Review');
  const [summary, setSummary] = React.useState('Summarize the operational learnings and remediation follow-up for the release train.');
  return (
    <Box style={{ display: 'grid', gap: 18, maxWidth: 720 }}>
      <InlineEdit value={title} placeholder="Untitled note" onValueChange={setTitle} />
      <InlineEdit multiline value={summary} placeholder="Add summary" onValueChange={setSummary} />
    </Box>
  );
};
`,xe=`import React from 'react';
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
`,Se=`import React from 'react';
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
`,Be=`import { Layout } from '@editora/ui-react';
import { layoutArgTypes, LayoutPlayground } from './layout.shared';

export default {
  title: 'UI/Layout',
  component: Layout,
  argTypes: layoutArgTypes
};

export const Playground = (args: any) => <LayoutPlayground {...args} />;

Playground.args = {
  mode: 'dashboard',
  variant: 'default',
  density: 'default',
  maxWidth: 'xl',
  sidebarSide: 'start',
  collapsed: false,
  sidebarWidth: '280px',
  asideWidth: '320px'
};
`,we=`import { Layout } from '@editora/ui-react';
import {
  LayoutCollapsedShell,
  LayoutLegacyPrimitives,
  LayoutOperationalModes,
  LayoutVisualModes,
  LayoutWorkspaceExample
} from './layout.shared';

export default {
  title: 'UI/Layout Showcase',
  component: Layout
};

export const VisualModes = () => <LayoutVisualModes />;

export const OperationalModes = () => <LayoutOperationalModes />;

export const CollapsedShell = () => <LayoutCollapsedShell />;

export const WorkspaceExample = () => <LayoutWorkspaceExample />;

export const LegacyPrimitives = () => <LayoutLegacyPrimitives />;
`,Ce=`import type { Meta, StoryObj } from "@storybook/react";
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
};`,ke=`import type { Meta, StoryObj } from '@storybook/react';
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
`,Te=`import type { Meta, StoryObj } from "@storybook/react";
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
`,ze=`import React from 'react';
import { Box, Button, Flex, Grid, Menu, MenuItem, MenuSectionLabel, MenuSeparator } from '@editora/ui-react';

export default {
  title: 'UI/Menu',
  component: Menu,
  argTypes: {
    placement: { control: 'select', options: ['bottom', 'top', 'left', 'right'] },
    variant: { control: 'select', options: ['surface', 'soft', 'solid', 'outline', 'flat', 'contrast'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    radius: { control: 'text' },
    tone: { control: 'select', options: ['default', 'neutral', 'info', 'success', 'warning', 'danger'] },
    elevation: { control: 'select', options: ['default', 'none', 'low', 'high'] },
    closeOnSelect: { control: 'boolean' },
    typeahead: { control: 'boolean' }
  }
};

function menuContent() {
  return (
    <div slot="content">
      <MenuItem icon="✏" shortcut="R">Rename</MenuItem>
      <MenuItem icon="⧉" shortcut="D">Duplicate</MenuItem>
      <MenuSeparator />
      <MenuItem role="menuitemcheckbox" checked shortcut="⌘L" caption="Editor preference">
        Show line numbers
      </MenuItem>
      <MenuSeparator />
      <MenuItem tone="danger" icon="🗑" shortcut="⌘⌫">Delete permanently</MenuItem>
    </div>
  );
}

function PreviewMenu({
  label,
  menuProps,
  buttonRecipe = 'surface',
  children,
}: {
  label: React.ReactNode;
  menuProps?: Record<string, unknown>;
  buttonRecipe?: 'surface' | 'solid' | 'soft' | 'outline' | 'ghost' | 'classic';
  children?: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Flex style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {children}
      <Menu
        open={open}
        onOpenChange={(next) => setOpen(Boolean(next))}
        {...menuProps}
      >
        <Button slot="trigger" recipe={buttonRecipe}>
          {label}
        </Button>
        {menuContent()}
      </Menu>
    </Flex>
  );
}

export const Playground = (args: any) => {
  const [lastAction, setLastAction] = React.useState('none');

  return (
    <Box style={{ padding: 64 }}>
      <Menu
        open={args.open}
        placement={args.placement}
        variant={args.variant}
        size={args.size}
        radius={args.radius}
        tone={args.tone}
        elevation={args.elevation}
        closeOnSelect={args.closeOnSelect}
        typeahead={args.typeahead}
        onSelectDetail={(detail) => {
          setLastAction(detail.label || detail.value || (typeof detail.index === 'number' ? \`item-\${detail.index}\` : 'item'));
        }}
      >
        <Button slot="trigger" recipe="solid">Open menu</Button>
        {menuContent()}
      </Menu>
      <Box style={{ marginTop: 12, fontSize: 13, color: '#475569' }}>Last action: {lastAction}</Box>
    </Box>
  );
};

Playground.args = {
  open: false,
  placement: 'bottom',
  variant: 'surface',
  size: 'md',
  tone: 'default',
  elevation: 'default',
  closeOnSelect: true,
  typeahead: true,
  radius: ''
};

export const VariantGallery = () => (
  <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(260px, 1fr))', gap: 18, padding: 20 }}>
    {[
      ['Surface', { variant: 'surface' }],
      ['Soft', { variant: 'soft' }],
      ['Solid', { variant: 'solid' }],
      ['Outline', { variant: 'outline' }],
      ['Flat', { variant: 'flat', elevation: 'none' }],
      ['Contrast', { variant: 'contrast', elevation: 'high' }],
    ].map(([label, props]) => (
      <Box key={label as string} style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
        <div style={{ fontWeight: 600, marginBottom: 12 }}>{label}</div>
        <PreviewMenu label="Open menu" menuProps={props as Record<string, unknown>} />
      </Box>
    ))}
  </Grid>
);

export const SizeGallery = () => (
  <Grid style={{ display: 'grid', gridTemplateColumns: '160px repeat(3, minmax(240px, 1fr))', gap: 18, padding: 20, alignItems: 'start' }}>
    <div />
    <div style={{ textAlign: 'center', color: '#64748b' }}>Surface</div>
    <div style={{ textAlign: 'center', color: '#64748b' }}>Soft</div>
    <div style={{ textAlign: 'center', color: '#64748b' }}>Solid</div>

    {(['sm', 'md', 'lg'] as const).map((size) => (
      <React.Fragment key={size}>
        <div style={{ fontSize: 18, color: '#64748b', alignSelf: 'center' }}>{size.toUpperCase()}</div>
        <PreviewMenu label="Open menu" menuProps={{ size, variant: 'surface' }} />
        <PreviewMenu label="Open menu" menuProps={{ size, variant: 'soft' }} />
        <PreviewMenu label="Open menu" menuProps={{ size, variant: 'solid' }} />
      </React.Fragment>
    ))}
  </Grid>
);

export const SelectionModes = () => {
  const [last, setLast] = React.useState('none');
  return (
    <Flex style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 24 }}>
      <Menu closeOnSelect={false} onSelectDetail={(detail) => setLast(detail.label || detail.value || 'item')}>
        <Button slot="trigger" recipe="surface">View options</Button>
        <div slot="content">
          <MenuSectionLabel>Canvas</MenuSectionLabel>
          <MenuItem role="menuitemcheckbox" checked data-value="show-grid">
            Show grid
          </MenuItem>
          <MenuItem role="menuitemcheckbox" data-value="snap-guides">
            Snap to guides
          </MenuItem>
          <MenuSeparator />
          <MenuSectionLabel>Mode</MenuSectionLabel>
          <MenuItem role="menuitemradio" data-group="mode" checked data-value="mode-edit">
            Mode: Edit
          </MenuItem>
          <MenuItem role="menuitemradio" data-group="mode" data-value="mode-review">
            Mode: Review
          </MenuItem>
        </div>
      </Menu>
      <Box style={{ fontSize: 13, color: '#475569' }}>Last action: {last}</Box>
    </Flex>
  );
};
`,Pe=`import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { createThemeTokens, type AccentPaletteName, type ThemeTokens } from '@editora/ui-core';
import {
  Badge,
  Box,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Flex,
  Grid,
  Menubar,
  MenuItem,
  MenuSectionLabel,
  MenuSeparator,
  ThemeProvider,
} from '@editora/ui-react';

const meta: Meta<typeof Menubar> = {
  title: 'UI/Menubar',
  component: Menubar,
  args: {
    selected: 1,
    open: false,
    loop: true,
    placement: 'bottom',
    variant: 'surface',
    size: 'md',
    radius: 12,
    elevation: 'low',
    tone: 'default',
    closeOnSelect: true,
    typeahead: true,
  },
  argTypes: {
    selected: { control: 'number' },
    open: { control: 'boolean' },
    loop: { control: 'boolean' },
    placement: { control: 'select', options: ['bottom', 'top', 'left', 'right'] },
    variant: { control: 'select', options: ['surface', 'soft', 'solid', 'outline', 'contrast', 'flat'] },
    size: { control: 'select', options: ['sm', 'md', 'lg', '1', '2', '3'] },
    radius: { control: 'text' },
    elevation: { control: 'select', options: ['none', 'low', 'high'] },
    tone: { control: 'select', options: ['default', 'neutral', 'info', 'success', 'warning', 'danger'] },
    closeOnSelect: { control: 'boolean' },
    typeahead: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof Menubar>;
type StoryPaletteName = AccentPaletteName | 'purple';

function TabButton(props: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      style={{
        appearance: 'none',
        border: 'none',
        borderBottom: props.active ? '3px solid var(--ui-color-primary, #2563eb)' : '3px solid transparent',
        background: 'transparent',
        color: props.active ? 'var(--ui-color-text, #0f172a)' : 'var(--ui-color-muted, #64748b)',
        padding: '14px 4px 12px',
        font: '600 15px/1.4 inherit',
        cursor: 'pointer',
      }}
    >
      {props.children}
    </button>
  );
}

function paletteTokens(name: StoryPaletteName) {
  if (name === 'purple') {
    return createThemeTokens({
      colors: {
        primary: '#8b5cf6',
        primaryHover: '#7c3aed',
        focusRing: '#8b5cf6',
      },
      palette: {
        accent: {
          '1': '#fdfcff',
          '2': '#faf7ff',
          '3': '#f3ecff',
          '4': '#eadcff',
          '5': '#ddc7ff',
          '6': '#cdb0ff',
          '7': '#b693ff',
          '8': '#9b70ff',
          '9': '#8b5cf6',
          '10': '#7c3aed',
          '11': '#6d28d9',
          '12': '#2e1065',
        },
        accentAlpha: {
          '1': '#7c3aed03',
          '2': '#7c3aed08',
          '3': '#7c3aed14',
          '4': '#7c3aed24',
          '5': '#7c3aed38',
          '6': '#7c3aed4d',
          '7': '#7c3aed68',
          '8': '#7c3aed8f',
          '9': '#7c3aed',
          '10': '#6d28d9',
          '11': '#5b21b6',
          '12': '#2e1065',
        },
        accentContrast: '#ffffff',
        accentSurface: '#f5f0ffcc',
        accentIndicator: '#8b5cf6',
        accentTrack: '#8b5cf6',
      },
    } satisfies Partial<ThemeTokens>, { accentPalette: 'blue', mode: 'light' });
  }
  return createThemeTokens({}, { accentPalette: name, mode: 'light' });
}

function MenubarContent() {
  return (
    <>
      <div slot="content">
        <MenuItem shortcut="⌘N">New file</MenuItem>
        <MenuItem shortcut="⌘O">Open…</MenuItem>
        <MenuSeparator />
        <div role="menuitem" tabIndex={-1} className="item" data-menu-item>
          <span className="label">
            <span className="text">Export</span>
          </span>
          <span className="submenu-arrow">▶</span>
          <div className="submenu">
            <MenuItem>Export as PDF</MenuItem>
            <MenuItem>Export as HTML</MenuItem>
            <MenuItem>Export as Markdown</MenuItem>
          </div>
        </div>
      </div>

      <div slot="content">
        <MenuItem shortcut="⌘Z">Undo</MenuItem>
        <MenuItem shortcut="⇧⌘Z">Redo</MenuItem>
        <MenuSeparator />
        <MenuItem shortcut="⌘F">Find</MenuItem>
        <MenuItem shortcut="⌘H">Replace</MenuItem>
      </div>

      <div slot="content">
        <MenuItem role="menuitemcheckbox" checked>
          Show line numbers
        </MenuItem>
        <MenuItem role="menuitemcheckbox">Wrap lines</MenuItem>
        <MenuSeparator />
        <MenuItem role="menuitemradio" data-group="zoom" checked>
          100%
        </MenuItem>
        <MenuItem role="menuitemradio" data-group="zoom">
          125%
        </MenuItem>
        <MenuItem role="menuitemradio" data-group="zoom">
          150%
        </MenuItem>
      </div>

      <div slot="content">
        <MenuSectionLabel>Workspace</MenuSectionLabel>
        <MenuItem>Profile settings</MenuItem>
        <MenuItem>Team access</MenuItem>
        <MenuSeparator />
        <MenuItem tone="danger">Sign out</MenuItem>
      </div>
    </>
  );
}

function MenubarPreview(props: {
  variant: 'surface' | 'soft' | 'solid' | 'outline' | 'contrast' | 'flat';
  size: 'sm' | 'md' | 'lg' | '1' | '2' | '3';
  tone?: 'default' | 'neutral' | 'info' | 'success' | 'warning' | 'danger';
  radius?: number | string;
  elevation?: 'none' | 'low' | 'high';
  palette?: StoryPaletteName;
  label?: string;
}) {
  const content = (
    <Grid style={{ gap: 12 }}>
      <Box
        style={{
          minHeight: 120,
          borderRadius: 16,
          border: '2px dashed color-mix(in srgb, var(--ui-color-primary, #2563eb) 30%, transparent)',
          background: 'linear-gradient(180deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 4%, white) 0%, color-mix(in srgb, var(--ui-color-primary, #2563eb) 2%, white) 100%)',
          display: 'grid',
          placeItems: 'center',
          padding: 24,
        }}
      >
        <Menubar
          selected={1}
          closeOnSelect={false}
          variant={props.variant}
          size={props.size}
          radius={props.radius}
          elevation={props.elevation}
          tone={props.tone}
          style={{ maxWidth: 'fit-content' }}
        >
          <button slot="item">File</button>
          <button slot="item">Edit</button>
          <button slot="item">View</button>
          <button slot="item">Profiles</button>
          <MenubarContent />
        </Menubar>
      </Box>
      {props.label ? <div style={{ fontSize: 13, color: '#64748b', textAlign: 'center' }}>{props.label}</div> : null}
    </Grid>
  );

  if (!props.palette) return content;
  return <ThemeProvider tokens={paletteTokens(props.palette)}>{content}</ThemeProvider>;
}

function MenubarMatrixStory() {
  const [tab, setTab] = React.useState<'theme' | 'colors' | 'sizes'>('theme');

  return (
    <Grid style={{ gap: 20, maxInlineSize: 1280 }}>
      <div>
        <div style={{ fontSize: 44, lineHeight: 1.05, fontWeight: 700, color: '#111827' }}>Menubar</div>
      </div>

      <Flex style={{ gap: 28, borderBottom: '1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 78%, transparent)' }}>
        <TabButton active={tab === 'theme'} onClick={() => setTab('theme')}>
          Theme colors
        </TabButton>
        <TabButton active={tab === 'colors'} onClick={() => setTab('colors')}>
          All colors
        </TabButton>
        <TabButton active={tab === 'sizes'} onClick={() => setTab('sizes')}>
          All sizes
        </TabButton>
      </Flex>

      {tab === 'theme' ? (
        <Grid style={{ gap: 22 }}>
          <Grid style={{ gridTemplateColumns: '120px repeat(4, minmax(240px, 1fr))', gap: 18, alignItems: 'start' }}>
            <div style={{ fontSize: 18, color: '#5b6574' }}>Solid</div>
            <MenubarPreview variant="solid" size="md" elevation="low" palette="blue" />
            <MenubarPreview variant="solid" size="md" elevation="low" palette="blue" tone="neutral" />
            <MenubarPreview variant="solid" size="md" elevation="low" palette="gray" />
            <MenubarPreview variant="solid" size="md" elevation="low" palette="gray" tone="neutral" />

            <div style={{ fontSize: 18, color: '#5b6574' }}>Soft</div>
            <MenubarPreview variant="soft" size="md" elevation="low" palette="blue" />
            <MenubarPreview variant="soft" size="md" elevation="low" palette="blue" tone="neutral" />
            <MenubarPreview variant="soft" size="md" elevation="low" palette="gray" />
            <MenubarPreview variant="soft" size="md" elevation="low" palette="gray" tone="neutral" />
          </Grid>
        </Grid>
      ) : null}

      {tab === 'colors' ? (
        <Grid style={{ gap: 16 }}>
          <Grid style={{ gridTemplateColumns: '120px repeat(2, minmax(260px, 1fr))', gap: 18, alignItems: 'start' }}>
            <div />
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Solid</div>
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Soft</div>
            {(['gray', 'amber', 'red', 'purple', 'blue', 'green'] as const satisfies readonly StoryPaletteName[]).map((name) => (
              <React.Fragment key={name}>
                <div style={{ fontSize: 18, color: '#5b6574', textTransform: 'capitalize' }}>{name}</div>
                <MenubarPreview variant="solid" size="md" elevation="low" palette={name} />
                <MenubarPreview variant="soft" size="md" elevation="low" palette={name} />
              </React.Fragment>
            ))}
          </Grid>
        </Grid>
      ) : null}

      {tab === 'sizes' ? (
        <Grid style={{ gap: 18 }}>
          <Grid style={{ gridTemplateColumns: '120px repeat(2, minmax(280px, 1fr))', gap: 18, alignItems: 'start' }}>
            <div />
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Solid</div>
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Soft</div>
            {(['1', '2', '3'] as const).map((size) => (
              <React.Fragment key={size}>
                <div style={{ fontSize: 18, color: '#5b6574' }}>Size {size}</div>
                <MenubarPreview variant="solid" size={size} elevation="low" palette="blue" />
                <MenubarPreview variant="soft" size={size} elevation="low" palette="blue" />
              </React.Fragment>
            ))}
          </Grid>
        </Grid>
      ) : null}
    </Grid>
  );
}

export const ThemeTokenMatrix: Story = {
  render: () => <MenubarMatrixStory />,
};

export const Playground: Story = {
  render: (args) => {
    const [state, setState] = React.useState({ open: false, selected: 1 });
    return (
      <Grid style={{ gap: 16, maxInlineSize: 1040 }}>
        <Card radius={18}>
          <CardHeader>
            <CardTitle>Production menubar surface</CardTitle>
            <CardDescription>
              A baseline-token driven menubar with real panels, hover-open submenus, selection modes, and palette-aware variants.
            </CardDescription>
          </CardHeader>
          <Box slot="inset" style={{ padding: 16, display: 'grid', gap: 16 }}>
            <Box
              style={{
                minHeight: 240,
                borderRadius: 18,
                border: '2px dashed color-mix(in srgb, var(--ui-color-primary, #2563eb) 30%, transparent)',
                background: 'linear-gradient(180deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 4%, white) 0%, color-mix(in srgb, var(--ui-color-primary, #2563eb) 2%, white) 100%)',
                display: 'grid',
                placeItems: 'center',
                padding: 24,
              }}
            >
              <Menubar
                {...args}
                selected={state.selected}
                open={state.open}
                onOpen={(selected) => setState({ open: true, selected })}
                onClose={() => setState((current) => ({ ...current, open: false }))}
                onChange={(detail) => setState({ open: detail.open, selected: detail.selected })}
                closeOnSelect={false}
              >
                <button slot="item">File</button>
                <button slot="item">Edit</button>
                <button slot="item">View</button>
                <button slot="item">Profiles</button>
                <MenubarContent />
              </Menubar>
            </Box>

            <Flex align="center" justify="space-between" style={{ gap: 12, flexWrap: 'wrap' }}>
              <Flex align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
                <Button variant="secondary" onClick={() => setState({ open: !state.open, selected: state.selected })}>
                  {state.open ? 'Close panel' : 'Open panel'}
                </Button>
                <Badge tone="info">selected: {state.selected}</Badge>
              </Flex>
              <Badge tone="neutral">open: {String(state.open)}</Badge>
            </Flex>
          </Box>
        </Card>
      </Grid>
    );
  },
};

export const Vertical: Story = {
  render: () => (
    <Flex style={{ display: 'flex', gap: 18, padding: 24, alignItems: 'flex-start' }}>
      <Menubar orientation="vertical" open selected={0} variant="soft" size="lg" radius={16} elevation="low" style={{ width: 260 }}>
        <button slot="item">Project</button>
        <button slot="item">Team</button>
        <button slot="item">Settings</button>

        <div slot="content">
          <MenuItem>Overview</MenuItem>
          <MenuItem>Files</MenuItem>
          <MenuItem>Activity</MenuItem>
        </div>
        <div slot="content">
          <MenuItem>Members</MenuItem>
          <MenuItem>Roles</MenuItem>
          <MenuItem>Invites</MenuItem>
        </div>
        <div slot="content">
          <MenuItem>Preferences</MenuItem>
          <MenuItem>Billing</MenuItem>
          <MenuItem>API keys</MenuItem>
        </div>
      </Menubar>

      <Box style={{ fontSize: 13, color: '#64748b', maxInlineSize: 280 }}>
        Vertical mode works for command strips, editor side rails, and compact admin tool clusters.
      </Box>
    </Flex>
  ),
};
`,Re=`import React from 'react';
import { Box, Flex, Grid, Meter } from '@editora/ui-react';

export default {
  title: 'UI/Meter',
  component: Meter,
  argTypes: {
    value: { control: 'number' },
    min: { control: 'number' },
    max: { control: 'number' },
    low: { control: 'number' },
    high: { control: 'number' },
    optimum: { control: 'number' },
    label: { control: 'text' },
    showLabel: { control: 'boolean' },
    format: { control: 'select', options: ['value', 'percent', 'fraction'] },
    precision: { control: 'number' },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['default', 'soft', 'solid', 'contrast'] },
    tone: { control: 'select', options: ['auto', 'brand', 'success', 'warning', 'danger', 'neutral'] },
    shape: { control: 'select', options: ['pill', 'round', 'square'] },
    mode: { control: 'select', options: ['line', 'circle'] }
  }
};

export const Playground = (args: any) => (
  <Box style={{ maxWidth: 520 }}>
    <Meter {...args} />
  </Box>
);

Playground.args = {
  value: 68,
  min: 0,
  max: 100,
  low: 35,
  high: 80,
  label: 'Storage health',
  showLabel: true,
  format: 'percent',
  precision: 0,
  size: 'md',
  variant: 'default',
  tone: 'auto',
  shape: 'pill',
  mode: 'line'
};

export const CapacityBands = () => (
  <Grid style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(2, minmax(220px, 1fr))' }}>
    <Box style={{ display: 'grid', gap: 12 }}>
      <Meter value={24} max={100} low={35} high={80} label="Cluster A" showLabel format="percent" />
      <Meter value={57} max={100} low={35} high={80} label="Cluster B" showLabel format="percent" />
      <Meter value={91} max={100} low={35} high={80} label="Cluster C" showLabel format="percent" />
    </Box>
    <Box
      style={{
        border: '1px solid var(--ui-color-border, #cbd5e1)',
        borderRadius: 'var(--ui-radius, 12px)',
        background: 'var(--ui-color-surface, #ffffff)',
        padding: 16
      }}
    >
      <strong>Why meter instead of progress</strong>
      <Box style={{ marginTop: 8, color: 'var(--ui-color-muted, #64748b)' }}>
        Use meter when the value is a measurement or score, not a task moving toward completion. Health, quality, capacity, and quota are meter semantics.
      </Box>
    </Box>
  </Grid>
);

export const CircularScores = () => (
  <Flex style={{ display: 'flex', gap: 18, flexWrap: 'wrap', alignItems: 'center' }}>
    <Meter mode="circle" value={0.82} max={1} low={0.45} high={0.72} optimum={0.9} format="percent" precision={0} label="Reliability" showLabel />
    <Meter mode="circle" value={0.63} max={1} low={0.45} high={0.72} optimum={0.9} format="percent" precision={0} label="Coverage" showLabel variant="soft" />
    <Meter mode="circle" value={0.37} max={1} low={0.45} high={0.72} optimum={0.9} format="percent" precision={0} label="Risk" showLabel variant="contrast" />
  </Flex>
);
`,Ie=`import React, { useState } from 'react';
import { Box, Grid, MultiSelect } from '@editora/ui-react';
import {
  ShowcasePage,
  ShowcaseSection,
  showcaseCaptionStyle,
  showcaseChipRowStyle,
  showcaseChipStyle,
  showcasePanelStyle
} from './storybook-showcase';

const teamOptions = [
  { value: 'ops', label: 'Operations', description: 'Incident response and escalations' },
  { value: 'security', label: 'Security', description: 'Threat review and approvals' },
  { value: 'platform', label: 'Platform', description: 'Infrastructure and tooling' },
  { value: 'support', label: 'Support', description: 'Customer-facing coordination' }
];

const groupedOptions = [
  {
    label: 'Core response',
    options: [
      { value: 'ops', label: 'Operations', description: 'Incident response and escalations' },
      { value: 'security', label: 'Security', description: 'Threat review and approvals' }
    ]
  },
  {
    label: 'Platform delivery',
    options: [
      { value: 'platform', label: 'Platform', description: 'Infrastructure and tooling' },
      { value: 'support', label: 'Support', description: 'Customer-facing coordination' }
    ]
  }
];

const largeOptions = Array.from({ length: 320 }, (_, index) => ({
  value: \`team-\${index + 1}\`,
  label: \`Team \${index + 1}\`,
  description: \`Operational slice \${index + 1}\`
}));

export default {
  title: 'UI/MultiSelect',
  component: MultiSelect,
  argTypes: {
    selectionIndicator: { control: 'radio', options: ['checkbox', 'check', 'none'] },
    optionBorder: { control: 'boolean' },
    variant: { control: 'select', options: ['default', 'surface', 'soft', 'solid', 'outline', 'flat', 'contrast'] },
    tone: { control: 'select', options: ['default', 'neutral', 'info', 'success', 'warning', 'danger'] },
    density: { control: 'select', options: ['default', 'compact', 'comfortable'] },
    radius: { control: 'text' },
    optionRadius: { control: 'text' },
    elevation: { control: 'select', options: ['none', 'low', 'high'] },
    size: { control: 'select', options: ['sm', 'md', 'lg', '1', '2', '3'] },
    clearable: { control: 'boolean' },
    loading: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    disabled: { control: 'boolean' }
  }
};

export const Playground = (args: any) => {
  const [value, setValue] = useState<string[]>(['ops', 'security']);
  return (
    <ShowcasePage
      eyebrow="Composed Selection"
      title="Multi-select should behave like a serious filter control, not a stitched-together tag input"
      description="These stories validate token rhythm, searchable listbox behavior, and how selected values stay legible when the control becomes dense."
      meta={[
        { label: 'Pattern', value: 'Filter + tokens' },
        { label: 'Indicator', value: args.selectionIndicator },
        { label: 'Selection', value: \`\${value.length} active\` }
      ]}
    >
      <ShowcaseSection
        eyebrow="Default Pattern"
        title="Owning teams"
        description="The default treatment should feel clean enough for dashboards and structured enough for admin forms."
      >
        <Box style={{ display: 'grid', gap: 16, maxWidth: 680 }}>
          <div style={showcaseChipRowStyle}>
            <span style={showcaseChipStyle}>Searchable</span>
            <span style={showcaseChipStyle}>Tokenized</span>
            <span style={showcaseChipStyle}>Indicator optional</span>
          </div>
          <MultiSelect
            {...args}
            label="Owning teams"
            description="Composed from listbox and token selection behavior."
            options={teamOptions}
            value={value}
            onValueChange={setValue}
            placeholder="Filter teams"
          />
          <div style={showcasePanelStyle}>
            <strong style={{ color: '#0f172a' }}>Selected teams</strong>
            <div style={{ color: '#64748b', fontSize: 13 }}>
              {value.length ? value.join(', ') : 'No teams selected'}
            </div>
          </div>
        </Box>
      </ShowcaseSection>
    </ShowcasePage>
  );
};

Playground.args = {
  selectionIndicator: 'checkbox',
  optionBorder: false,
  variant: 'surface',
  tone: 'default',
  density: 'default',
  radius: 12,
  optionRadius: 10,
  elevation: 'low',
  size: 'md',
  clearable: true,
  loading: false,
  readOnly: false,
  disabled: false
};

export const IndicatorModes = () => (
  <ShowcaseSection
    eyebrow="Selection Affordance"
    title="Indicator modes"
    description="Some products want checkbox-like options, some want a lighter checkmark, and some want no leading affordance at all."
  >
    <Grid style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
      <MultiSelect label="Checkbox indicator" options={teamOptions} value={['ops']} selectionIndicator="checkbox" />
      <MultiSelect label="Check indicator" options={teamOptions} value={['security']} selectionIndicator="check" />
      <MultiSelect label="No indicator" options={teamOptions} value={['platform']} selectionIndicator="none" />
    </Grid>
  </ShowcaseSection>
);

export const OptionRadiusGallery = () => (
  <ShowcaseSection
    eyebrow="Option Geometry"
    title="Option radius"
    description="Option rows can follow the shell radius or use their own tighter or softer corners depending on the density of the menu."
  >
    <Grid style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
      <MultiSelect label="Sharp rows" options={teamOptions} value={['ops']} optionRadius={0} optionBorder clearable />
      <MultiSelect label="Default rows" options={teamOptions} value={['security']} optionRadius={10} clearable />
      <MultiSelect label="Soft rows" options={teamOptions} value={['platform']} optionRadius={16} clearable />
      <MultiSelect label="Pill rows" options={teamOptions} value={['support']} optionRadius="full" clearable />
    </Grid>
  </ShowcaseSection>
);

export const StateMatrix = () => {
  const [active, setActive] = useState<string[]>(['platform']);
  return (
    <ShowcaseSection
      eyebrow="Operational States"
      title="Production state coverage"
      description="The component should hold up in disabled, readonly, loading, invalid, and constrained-selection scenarios."
    >
      <Grid style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <MultiSelect
          label="Readonly review"
          description="Selected values stay visible, but no changes can be made."
          options={teamOptions}
          value={['ops', 'security']}
          readOnly
        />
        <MultiSelect
          label="Loading remote teams"
          description="Used while async filters or server results are being refreshed."
          options={teamOptions}
          value={[]}
          loading
          loadingText="Refreshing available teams..."
          clearable
        />
        <MultiSelect
          label="Invalid selection"
          description="Required filter with no selected owners."
          options={teamOptions}
          value={[]}
          required
          error="At least one owning team is required."
          tone="danger"
        />
        <MultiSelect
          label="Max constrained"
          description="Keeps the most recent two selections."
          options={teamOptions}
          value={active}
          onValueChange={setActive}
          maxSelections={2}
          clearable
        />
        <MultiSelect
          label="Disabled"
          description="Locked after workflow finalization."
          options={teamOptions}
          value={['support']}
          disabled
        />
      </Grid>
    </ShowcaseSection>
  );
};

export const VariantGallery = () => (
  <ShowcaseSection
    eyebrow="Visual System"
    title="Variant, density, and shape gallery"
    description="These patterns cover the main product contexts: filters, console rails, minimal in-table controls, and contrast-heavy admin shells."
  >
    <Grid style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
      <MultiSelect label="Surface default" options={teamOptions} value={['ops']} variant="surface" />
      <MultiSelect label="Soft warning" options={teamOptions} value={['security']} variant="soft" tone="warning" />
      <MultiSelect label="Solid compact" options={teamOptions} value={['platform']} variant="solid" density="compact" size="sm" />
      <MultiSelect label="Flat no indicator" options={teamOptions} value={['support']} variant="flat" selectionIndicator="none" />
      <MultiSelect label="Contrast shell" options={teamOptions} value={['ops']} variant="contrast" radius={16} />
      <MultiSelect label="Comfortable outline" options={teamOptions} value={['security']} density="comfortable" variant="outline" radius={0} size="lg" />
    </Grid>
  </ShowcaseSection>
);

export const DenseFilterBuilder = () => {
  const [value, setValue] = useState<string[]>(['platform']);
  return (
    <ShowcaseSection
      eyebrow="Operational Form"
      title="Dense filter builder"
      description="This pattern is for settings pages and incident tooling where the selected values need to remain readable alongside their downstream meaning."
    >
      <Grid style={{ display: 'grid', gap: 16, gridTemplateColumns: 'minmax(320px, 1fr) minmax(260px, 320px)' }}>
        <MultiSelect
          label="Escalation policy"
          description="Tokenized selection with searchable options."
          options={teamOptions}
          value={value}
          onValueChange={setValue}
          placeholder="Add teams"
          maxSelections={3}
          density="compact"
          clearable
        />
        <Box style={showcasePanelStyle}>
          <strong style={{ color: '#0f172a' }}>Selected values</strong>
          <Box style={{ color: '#64748b', fontSize: 13 }}>
            {value.length ? value.join(', ') : 'No teams selected'}
          </Box>
          <p style={showcaseCaptionStyle}>Keep the summary adjacent when the selected values change downstream rules or routing.</p>
        </Box>
      </Grid>
    </ShowcaseSection>
  );
};

export const GroupedWorkflow = () => (
  <ShowcaseSection
    eyebrow="Enterprise Structure"
    title="Grouped options"
    description="Large organizations rarely present flat team lists. Grouped sections keep taxonomy readable without giving up the same selection model."
  >
    <Box style={{ maxWidth: 640, display: 'grid', gap: 14 }}>
      <MultiSelect
        label="Response partners"
        description="Grouped by operating function."
        options={groupedOptions}
        value={['security']}
        selectionIndicator="check"
        clearable
      />
      <p style={showcaseCaptionStyle}>The grouped rendering path is intended for enterprise routing, ownership, and taxonomy-driven filters.</p>
    </Box>
  </ShowcaseSection>
);

export const LargeDataset = () => (
  <ShowcaseSection
    eyebrow="Performance Guard"
    title="Large dataset fallback"
    description="For big option sets, the control caps rendered rows and asks the user to keep narrowing the query instead of dumping hundreds of live buttons."
  >
    <Grid style={{ display: 'grid', gap: 16, gridTemplateColumns: 'minmax(320px, 1fr) minmax(260px, 320px)' }}>
      <MultiSelect
        label="Service ownership"
        description="Large catalog path with render limiting."
        options={largeOptions}
        value={[]}
        renderLimit={40}
        clearable
        placeholder="Search 320 services"
      />
      <Box style={showcasePanelStyle}>
        <strong style={{ color: '#0f172a' }}>Why this exists</strong>
        <p style={showcaseCaptionStyle}>This is the current performance guard: render a bounded subset, preserve search, and guide the user to narrow the result set.</p>
      </Box>
    </Grid>
  </ShowcaseSection>
);
`,Ae=`import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NavigationMenu, ThemeProvider } from '@editora/ui-react';
import { createThemeTokens, type AccentPaletteName } from '@editora/ui-core';
import {
  ShowcasePage,
  ShowcaseSection,
  showcaseBodyStyle,
  showcaseChipRowStyle,
  showcaseChipStyle,
  showcaseMonoStyle,
  showcasePanelStyle
} from './storybook-showcase';

const meta: Meta<typeof NavigationMenu> = {
  title: 'UI/NavigationMenu',
  component: NavigationMenu,
  args: {
    orientation: 'horizontal',
    activation: 'automatic',
    variant: 'surface',
    size: 'md',
    radius: 12,
    elevation: 'low',
    tone: 'default',
    loop: true,
    collapsible: false,
  },
  argTypes: {
    selected: { control: 'number' },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    activation: { control: 'select', options: ['automatic', 'manual'] },
    variant: { control: 'select', options: ['surface', 'soft', 'solid', 'outline', 'flat', 'contrast'] },
    size: { control: 'select', options: ['sm', 'md', 'lg', '1', '2', '3'] },
    radius: { control: 'text' },
    elevation: { control: 'select', options: ['none', 'low', 'high'] },
    tone: { control: 'select', options: ['default', 'neutral', 'info', 'success', 'warning', 'danger'] },
    loop: { control: 'boolean' },
    collapsible: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof NavigationMenu>;

function paletteTokens(name: AccentPaletteName) {
  return createThemeTokens({}, { accentPalette: name, mode: 'light' });
}

const heroCanvasStyle: React.CSSProperties = {
  position: 'relative',
  display: 'grid',
  alignItems: 'start',
  justifyItems: 'center',
  minHeight: 780,
  padding: '40px 20px 120px',
  borderRadius: 28,
  overflow: 'hidden',
  background: 'linear-gradient(120deg, #4361d9 0%, #6165dc 38%, #8756cf 100%)'
};

const heroGlowStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 'auto 10% 12% 10%',
  height: 220,
  borderRadius: 999,
  background: 'radial-gradient(circle, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 68%)',
  filter: 'blur(20px)',
  pointerEvents: 'none'
};

const codeWindowStyle: React.CSSProperties = {
  position: 'absolute',
  left: 20,
  right: 20,
  bottom: 20,
  height: 380,
  borderRadius: 22,
  overflow: 'hidden',
  border: '1px solid rgba(15, 23, 42, 0.14)',
  background: '#f8f7fb',
  boxShadow: '0 22px 70px rgba(15, 23, 42, 0.18)'
};

const codeTabsStyle: React.CSSProperties = {
  display: 'flex',
  gap: 28,
  alignItems: 'center',
  height: 54,
  padding: '0 20px',
  borderBottom: '1px solid rgba(148, 163, 184, 0.22)',
  background: 'rgba(255,255,255,0.86)'
};

const codeTabStyle: React.CSSProperties = {
  fontSize: 13,
  lineHeight: '20px',
  fontWeight: 600,
  color: '#475569'
};

const codeBodyStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '280px minmax(0, 1fr)',
  height: 'calc(100% - 54px)'
};

const codeSidebarStyle: React.CSSProperties = {
  borderRight: '1px solid rgba(148, 163, 184, 0.18)',
  background: 'rgba(255,255,255,0.72)'
};

const codePanelStyle: React.CSSProperties = {
  padding: '26px 34px',
  fontSize: 16,
  lineHeight: 1.55,
  background: 'rgba(255,255,255,0.84)'
};

const codeLineStyle: React.CSSProperties = {
  margin: 0,
  color: '#334155'
};

const panelGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1.02fr 1fr',
  gap: 18
};

const leadCardStyle: React.CSSProperties = {
  display: 'grid',
  alignContent: 'end',
  minHeight: 100,
  padding: 28,
  borderRadius: 18,
  color: '#ffffff',
  background: 'linear-gradient(145deg, #9551d2 0%, #5d64da 55%, #4b67e1 100%)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)'
};

const stackCardStyle: React.CSSProperties = {
  ...showcasePanelStyle,
  gap: 10,
  minHeight: 176,
  background: 'rgba(240, 235, 244, 0.94)',
  border: '1px solid rgba(192, 186, 206, 0.42)'
};

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 24,
  lineHeight: 1.15,
  fontWeight: 700,
  color: '#1f2937'
};

const sectionBodyStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 18,
  lineHeight: 1.45,
  color: '#6b7280'
};

const galleryFrameStyle: React.CSSProperties = {
  position: 'relative',
  display: 'grid',
  justifyItems: 'center',
  alignItems: 'start',
  minHeight: 520,
  padding: '28px 20px 360px',
  borderRadius: 24,
  border: '1px solid rgba(148, 163, 184, 0.18)',
  background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,247,251,0.98) 100%)',
  boxSizing: 'border-box',
  overflow: 'visible'
};

const compactGalleryFrameStyle: React.CSSProperties = {
  ...galleryFrameStyle,
  minHeight: 480,
  paddingBottom: 320
};

function ReferenceNavigation(props: React.ComponentProps<typeof NavigationMenu>) {
  return (
    <NavigationMenu.Root {...props} style={{ width: '100%', maxWidth: 1180 }}>
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger>Learn</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <div style={panelGridStyle}>
              <div style={leadCardStyle}>
                 <p style={{ margin: 0, fontSize: 18, lineHeight: 1.5, color: 'rgba(255,255,255,0.9)' }}>
                    Unstyled, accessible components for React and design-system teams.
                  </p>
              </div>
              <div style={{ display: 'grid', gap: 18 }}>
                <div style={{ display: 'grid', gap: 18, gridTemplateColumns: '1fr 1fr' }}>
                  <div style={{ display: 'grid', gap: 8 }}>
                    <h3 style={{ ...sectionTitleStyle, fontSize: 20 }}>Getting started</h3>
                    <p style={{ ...sectionBodyStyle, fontSize: 16 }}>A quick tutorial to get you up and running.</p>
                  </div>
                  <div style={{ display: 'grid', gap: 8 }}>
                    <h3 style={{ ...sectionTitleStyle, fontSize: 20 }}>Accessibility</h3>
                    <p style={{ ...sectionBodyStyle, fontSize: 16 }}>Tested in a range of browsers and assistive technologies.</p>
                  </div>
                  <div style={{ display: 'grid', gap: 8 }}>
                    <h3 style={{ ...sectionTitleStyle, fontSize: 20 }}>Styling</h3>
                    <p style={{ ...sectionBodyStyle, fontSize: 16 }}>Unstyled and compatible with any styling solution.</p>
                  </div>
                  <div style={{ display: 'grid', gap: 8 }}>
                    <h3 style={{ ...sectionTitleStyle, fontSize: 20 }}>Releases</h3>
                    <p style={{ ...sectionBodyStyle, fontSize: 16 }}>Track updates and ship consistent foundations.</p>
                  </div>
                </div>
              </div>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Trigger>Overview</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <div style={panelGridStyle}>
              <div style={leadCardStyle}>
                <div style={{ display: 'grid', gap: 12 }}>
                  <div style={{ fontSize: 64, lineHeight: 1, fontWeight: 700 }}>✦</div>
                  <div style={{ fontSize: 54, lineHeight: 0.98, fontWeight: 700, letterSpacing: '-0.03em' }}>
                    Platform
                    <br />
                    Overview
                  </div>
                  <p style={{ margin: 0, fontSize: 18, lineHeight: 1.5, color: 'rgba(255,255,255,0.9)' }}>
                    Core packages, token system, and implementation guides for product teams.
                  </p>
                </div>
              </div>
              <div style={{ display: 'grid', gap: 18 }}>
                <div style={{ display: 'grid', gap: 18, gridTemplateColumns: '1fr' }}>
                  <div style={{ display: 'grid', gap: 8 }}>
                    <h3 style={{ ...sectionTitleStyle, fontSize: 20 }}>Colors</h3>
                    <p style={{ ...sectionBodyStyle, fontSize: 16 }}>Beautiful, thought-out palettes with auto dark mode.</p>
                  </div>
                  <div style={{ display: 'grid', gap: 8 }}>
                    <h3 style={{ ...sectionTitleStyle, fontSize: 20 }}>Icons</h3>
                    <p style={{ ...sectionBodyStyle, fontSize: 16 }}>A crisp set of 15x15 icons, balanced and consistent.</p>
                  </div>
                </div>
              </div>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link href="https://editora-free.netlify.app/">Github</NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
      <NavigationMenu.Indicator />
      <NavigationMenu.Viewport />
    </NavigationMenu.Root>
  );
}

function HeroComposition(props: React.ComponentProps<typeof NavigationMenu>) {
  return (
    <div style={heroCanvasStyle}>
      <div style={heroGlowStyle} />
      <ReferenceNavigation {...props} />
    </div>
  );
}

function GalleryNavigationPreview(
  props: React.ComponentProps<typeof NavigationMenu> & {
    frameStyle?: React.CSSProperties;
  }
) {
  const { frameStyle, ...menuProps } = props;
  const [selected, setSelected] = React.useState(-1);

  return (
    <div
      style={frameStyle ?? galleryFrameStyle}
      onMouseLeave={() => setSelected(-1)}
      onBlur={(event) => {
        const nextTarget = event.relatedTarget as Node | null;
        if (!nextTarget || !event.currentTarget.contains(nextTarget)) {
          setSelected(-1);
        }
      }}
    >
      <ReferenceNavigation {...menuProps} selected={selected} onSelect={(next) => setSelected(next)} />
    </div>
  );
}

export const Playground: Story = {
  render: (args) => (
    <ShowcasePage
      eyebrow="Interactive Navigation"
      title="Navigation Menu"
      description="A collection of links for navigating websites. The shell, trigger bar, and content viewport are styled to feel like one composed surface rather than a basic tab strip."
      meta={[
        { label: 'Pattern', value: 'Hero navigation' },
        { label: 'Viewport', value: 'Structured panel' },
        { label: 'State', value: 'Interactive' }
      ]}
    >
      <HeroComposition {...args} />
    </ShowcasePage>
  ),
};

export const VariantGallery: Story = {
  render: () => (
    <ShowcaseSection
      eyebrow="Visual Recipes"
      title="Navigation Variants"
      description="Use the same content with different shell treatments to validate how the trigger bar and panel feel across app surfaces."
    >
      <div style={{ display: 'grid', gap: 20 }}>
        {(['surface', 'soft', 'solid', 'outline', 'flat', 'contrast'] as const).map((variant) => (
          <div key={variant} style={{ display: 'grid', gap: 10 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#475569', textTransform: 'capitalize' }}>{variant}</div>
            <GalleryNavigationPreview variant={variant} size="md" elevation={variant === 'flat' ? 'none' : 'low'} />
          </div>
        ))}
      </div>
    </ShowcaseSection>
  ),
};

export const SizeGallery: Story = {
  render: () => (
    <ShowcaseSection
      eyebrow="Scale"
      title="Small, medium, large"
      description="The size prop affects trigger rhythm and viewport padding so the menu can sit comfortably inside compact tools or spacious landing sections."
    >
      <div style={{ display: 'grid', gap: 22 }}>
        {(['sm', 'md', 'lg'] as const).map((size) => (
          <div key={size} style={{ display: 'grid', gap: 10 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#475569', textTransform: 'capitalize' }}>{size}</div>
            <GalleryNavigationPreview size={size} frameStyle={compactGalleryFrameStyle} />
          </div>
        ))}
      </div>
    </ShowcaseSection>
  ),
};

export const ToneGallery: Story = {
  render: () => (
    <ShowcaseSection
      eyebrow="Tones"
      title="Semantic emphasis"
      description="Tone changes the ring and active treatments without changing the structural geometry."
    >
      <div style={{ display: 'grid', gap: 22 }}>
        {(['neutral', 'info', 'success', 'warning', 'danger'] as const).map((tone) => (
          <div key={tone} style={{ display: 'grid', gap: 10 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#475569', textTransform: 'capitalize' }}>{tone}</div>
            <GalleryNavigationPreview tone={tone} variant="soft" />
          </div>
        ))}
      </div>
    </ShowcaseSection>
  ),
};

export const ColorPaletteGallery: Story = {
  render: () => (
    <ShowcaseSection
      eyebrow="Palettes"
      title="All colors"
      description="Preview the same navigation system across the accent palettes supported by the shared theme tokens."
    >
      <div style={{ display: 'grid', gap: 22 }}>
        {(['blue', 'amber', 'green', 'red', 'gray'] as const).map((palette) => (
          <ThemeProvider key={palette} tokens={paletteTokens(palette)}>
            <div style={{ display: 'grid', gap: 10 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#475569', textTransform: 'capitalize' }}>{palette}</div>
              <GalleryNavigationPreview variant="soft" />
            </div>
          </ThemeProvider>
        ))}
      </div>
    </ShowcaseSection>
  ),
};

export const Vertical: Story = {
  render: (args) => (
    <ShowcaseSection
      eyebrow="Sidebar"
      title="Vertical navigation"
      description="The same API can collapse into a vertical rail with a stacked viewport for workspace side navigation."
    >
      <div style={{ maxWidth: 420 }}>
        <NavigationMenu.Root {...args} orientation="vertical" size="lg" variant="soft" radius={16} elevation="low">
          <NavigationMenu.List>
            <NavigationMenu.Item>
              <NavigationMenu.Trigger>Dashboard</NavigationMenu.Trigger>
              <NavigationMenu.Content>
                <div style={{ display: 'grid', gap: 10 }}>
                  <h3 style={{ ...sectionTitleStyle, fontSize: 22 }}>Dashboard links</h3>
                  <p style={{ ...sectionBodyStyle, fontSize: 16 }}>Daily summaries, service status, and team activity.</p>
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavigationMenu.Trigger>Analytics</NavigationMenu.Trigger>
              <NavigationMenu.Content>
                <div style={{ display: 'grid', gap: 10 }}>
                  <h3 style={{ ...sectionTitleStyle, fontSize: 22 }}>Analytics links</h3>
                  <p style={{ ...sectionBodyStyle, fontSize: 16 }}>Conversion, retention, and operational trend reports.</p>
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavigationMenu.Trigger>Billing</NavigationMenu.Trigger>
              <NavigationMenu.Content>
                <div style={{ display: 'grid', gap: 10 }}>
                  <h3 style={{ ...sectionTitleStyle, fontSize: 22 }}>Billing links</h3>
                  <p style={{ ...sectionBodyStyle, fontSize: 16 }}>Plans, invoices, entitlements, and workspace limits.</p>
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          </NavigationMenu.List>
          <NavigationMenu.Indicator />
          <NavigationMenu.Viewport />
        </NavigationMenu.Root>
      </div>
    </ShowcaseSection>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [selected, setSelected] = React.useState(1);
    return (
      <ShowcaseSection
        eyebrow="Controlled"
        title="Selection managed in React"
        description="The component still supports a controlled model while keeping the more polished visual shell."
      >
        <div style={{ display: 'grid', gap: 14 }}>
          <ReferenceNavigation selected={selected} onSelect={(next) => setSelected(next)} />
          <div style={{ ...showcaseBodyStyle, fontSize: 13 }}>Selected index: {selected}</div>
          <div style={showcaseChipRowStyle}>
            {['Learn', 'Overview', 'Github'].map((label, index) => (
              <button
                key={label}
                type="button"
                onClick={() => setSelected(index)}
                style={{
                  ...showcaseChipStyle,
                  cursor: 'pointer',
                  border: index === selected ? '1px solid color-mix(in srgb, #2563eb 32%, transparent)' : showcaseChipStyle.border
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </ShowcaseSection>
    );
  },
};
`,Fe=`import React, { useState } from 'react';
import { Box, Grid, NumberField } from '@editora/ui-react';
import {
  ShowcasePage,
  ShowcaseSection,
  showcaseCaptionStyle,
  showcaseChipRowStyle,
  showcaseChipStyle,
  showcasePanelStyle
} from './storybook-showcase';

export default {
  title: 'UI/NumberField',
  component: NumberField,
  argTypes: {
    value: { control: 'text' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    precision: { control: 'number' },
    locale: { control: 'text' },
    format: { control: 'select', options: ['grouped', 'plain'] },
    placeholder: { control: 'text' },
    label: { control: 'text' },
    description: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    allowWheel: { control: 'boolean' },
    showSteppers: { control: 'boolean' },
    clampOnBlur: { control: 'boolean' }
  }
};

export const Playground = (args: any) => {
  const [current, setCurrent] = useState<number | null>(12500);

  return (
    <ShowcasePage
      eyebrow="Numeric Entry"
      title="Number fields should feel precise, native, and stable under fast keyboard interaction"
      description="These stories validate spinbutton semantics, formatting, validation states, and whether the control still looks composed inside serious enterprise forms."
      meta={[
        { label: 'Locale', value: args.locale },
        { label: 'Step', value: \`\${args.step}\` },
        { label: 'Steppers', value: args.showSteppers ? 'Visible' : 'Hidden' }
      ]}
    >
      <ShowcaseSection
        eyebrow="Primary Pattern"
        title="Budget ceiling"
        description="The base story should demonstrate strong label hierarchy, precise step behavior, and enough context for the value to feel operational rather than generic."
      >
        <Box style={{ maxWidth: 640, display: 'grid', gap: 16 }}>
          <div style={showcaseChipRowStyle}>
            <span style={showcaseChipStyle}>Locale-aware</span>
            <span style={showcaseChipStyle}>Stepper-integrated</span>
            <span style={showcaseChipStyle}>Clamp on blur</span>
          </div>
          <NumberField
            {...args}
            value={current ?? ''}
            onValueChange={(detail) => setCurrent(detail.value)}
            prefix="USD"
          />
          <Box style={showcasePanelStyle}>
            <strong style={{ color: '#0f172a' }}>Live value</strong>
            <Box style={{ color: '#64748b', fontSize: 13 }}>
              {current == null ? 'empty' : current.toLocaleString('en-US')}
            </Box>
          </Box>
        </Box>
      </ShowcaseSection>
    </ShowcasePage>
  );
};

Playground.args = {
  label: 'Monthly budget ceiling',
  description: 'Locale-aware number entry with spinbutton semantics.',
  min: 0,
  max: 100000,
  step: 250,
  precision: 0,
  locale: 'en-US',
  format: 'grouped',
  placeholder: '0',
  showSteppers: true,
  clampOnBlur: true,
  allowWheel: true
};

export const FinanceControls = () => {
  const [limit, setLimit] = useState<number | null>(18000);
  const [buffer, setBuffer] = useState<number | null>(12.5);
  const [throughput, setThroughput] = useState<number | null>(350);

  return (
    <ShowcaseSection
      eyebrow="Dashboard Row"
      title="Finance controls"
      description="A realistic field row should keep numeric inputs visually aligned while still showing distinct prefixes, suffixes, and ranges."
    >
      <Grid style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(3, minmax(220px, 1fr))' }}>
        <NumberField
          label="Spend limit"
          description="Hard ceiling for campaign automation."
          value={limit ?? ''}
          min={0}
          max={50000}
          step={500}
          prefix="USD"
          showSteppers
          onValueChange={(detail) => setLimit(detail.value)}
        />
        <NumberField
          label="Safety buffer"
          description="Percent headroom before throttling."
          value={buffer ?? ''}
          min={0}
          max={100}
          step={0.5}
          precision={1}
          suffix="%"
          showSteppers
          onValueChange={(detail) => setBuffer(detail.value)}
        />
        <NumberField
          label="Ops throughput"
          description="Expected tasks processed per hour."
          value={throughput ?? ''}
          min={50}
          max={1000}
          step={25}
          suffix="req/h"
          showSteppers
          onValueChange={(detail) => setThroughput(detail.value)}
        />
      </Grid>
    </ShowcaseSection>
  );
};

export const ValidationStates = () => (
  <ShowcaseSection
    eyebrow="State Coverage"
    title="Validation and policy states"
    description="The component should preserve hierarchy and legibility across required, readonly, error, and disabled states without collapsing into inconsistent spacing."
  >
    <Grid style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(2, minmax(240px, 1fr))' }}>
      <NumberField
        label="Incident threshold"
        description="Escalate after this many failures."
        value="5"
        min={1}
        max={12}
        step={1}
        showSteppers
        required
      />
      <NumberField
        label="Reserved capacity"
        description="This value is locked by policy."
        value="2500"
        prefix="GB"
        readOnly
        showSteppers
      />
      <NumberField
        label="Quota floor"
        description="Demonstrates inline error messaging."
        value="0"
        min={10}
        max={100}
        error="Value must be at least 10."
        showSteppers
      />
      <NumberField
        label="Archive batch size"
        description="Control disabled during background migration."
        value="400"
        suffix="items"
        disabled
        showSteppers
      />
    </Grid>
    <p style={showcaseCaptionStyle}>Error, readonly, and disabled states should still feel like part of the same product system.</p>
  </ShowcaseSection>
);
`,Ge=`import type { Meta, StoryObj } from "@storybook/react";
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
`,De=`import React, { useRef, useState } from 'react';
import { Box, Button, Flex, Grid, Pagination } from '@editora/ui-react';

export default {
  title: 'UI/Pagination',
  component: Pagination,
  argTypes: {
    page: { control: { type: 'number', min: 1, max: 50, step: 1 } },
    count: { control: { type: 'number', min: 1, max: 50, step: 1 } },
    variant: { control: 'select', options: ['classic', 'flat', 'outline', 'solid'] }
  }
};

export const Interactive = (args: any) => {
  const [page, setPage] = useState(Number(args.page) || 1);
  const [count, setCount] = useState(Number(args.count) || 12);
  const [lastReason, setLastReason] = useState('change');
  const ref = useRef<any>(null);

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <Flex style={{ display: 'flex', gap: 8 }}>
        <Button size="sm" variant="secondary" onClick={() => setCount((v) => Math.max(1, v - 1))}>- count</Button>
        <Button size="sm" variant="secondary" onClick={() => setCount((v) => v + 1)}>+ count</Button>
      </Flex>

      <Pagination
        ref={ref}
        page={page}
        count={count}
        variant={args.variant || 'classic'}
        onPageChange={(detail) => {
          setPage(detail.page);
          setLastReason(detail.reason);
        }}
      />

      <Box style={{ fontSize: 13, color: '#475569' }}>
        Page {page} of {count} • last action: {lastReason}
      </Box>
    </Grid>
  );
};
Interactive.args = { page: 3, count: 12, variant: 'classic' };

export const CustomTokens = () => (
  <Pagination
    page={4}
    count={18}
    variant="outline"
    style={{
      ['--ui-pagination-active-bg' as any]: '#0ea5e9',
      ['--ui-pagination-radius' as any]: '999px',
      ['--ui-pagination-padding' as any]: '6px 12px'
    }}
  />
);

export const VariantGallery = () => (
  <Grid style={{ display: 'grid', gap: 18 }}>
    {(['classic', 'flat', 'outline', 'solid'] as const).map((variant) => (
      <Flex key={variant} style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <Box style={{ width: 72, fontSize: 13, color: '#475569', textTransform: 'capitalize' }}>{variant}</Box>
        <Pagination page={4} count={18} variant={variant} />
      </Flex>
    ))}
  </Grid>
);
`,Me=`import React, { useMemo, useState } from 'react';
import { Box, Button, Flex, Panel, PanelGroup, Splitter } from '@editora/ui-react';
import {
  ShowcasePage,
  ShowcaseSection,
  showcaseCaptionStyle,
  showcaseChipRowStyle,
  showcaseChipStyle,
  showcasePanelStyle
} from './storybook-showcase';

const panelShell: React.CSSProperties = {
  inlineSize: '100%',
  blockSize: '100%',
  minInlineSize: 0,
  minBlockSize: 0,
  boxSizing: 'border-box',
  borderRadius: 14,
  border: '1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 78%, transparent)',
  background: 'linear-gradient(180deg, color-mix(in srgb, var(--ui-color-surface, #ffffff) 96%, #f8fafc 4%), var(--ui-color-surface, #ffffff))',
  padding: 16,
  display: 'grid',
  gap: 10
};

export default {
  title: 'UI/PanelGroup',
  component: PanelGroup
};

export const WorkspaceShell = () => {
  const [sizes, setSizes] = useState<number[]>([26, 46, 28]);
  const summary = useMemo(() => sizes.map((size) => \`\${Math.round(size)}%\`).join(' / '), [sizes]);

  return (
    <ShowcasePage
      eyebrow="Resizable Layout"
      title="Panel groups should feel architectural, not like a demo-only splitter"
      description="These stories validate surface hierarchy, persisted layout behavior, and whether the resizable shell still looks deliberate when populated with real product content."
      meta={[
        { label: 'Persistence', value: 'Enabled', tone: 'success' },
        { label: 'Panels', value: '3' },
        { label: 'Current layout', value: summary }
      ]}
    >
      <ShowcaseSection
        eyebrow="Workspace Shell"
        title="Three-panel editing layout"
        description="This pattern is for application shells where navigation, workspace, and metadata all need a clear but adjustable relationship."
      >
        <Box style={{ display: 'grid', gap: 16 }}>
          <div style={showcaseChipRowStyle}>
            <span style={showcaseChipStyle}>Persisted layout</span>
            <span style={showcaseChipStyle}>Three-panel shell</span>
            <span style={showcaseChipStyle}>Production app chrome</span>
          </div>
          <PanelGroup
            style={{ blockSize: 460 }}
            storageKey="storybook-workspace-shell"
            autoSave={true}
            onLayoutChange={(detail) => setSizes(detail.sizes)}
          >
            <Panel size={26} minSize={18} maxSize={40}>
              <Box style={panelShell}>
                <strong>Signal queue</strong>
                <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>
                  Triage board, alert filters, and incident routing live in this narrow rail.
                </Box>
                <Box style={{ display: 'grid', gap: 8 }}>
                  <Box style={{ padding: 10, borderRadius: 10, background: 'color-mix(in srgb, #2563eb 10%, transparent)' }}>Escalations</Box>
                  <Box style={{ padding: 10, borderRadius: 10, background: 'color-mix(in srgb, #0f172a 5%, transparent)' }}>Policies</Box>
                  <Box style={{ padding: 10, borderRadius: 10, background: 'color-mix(in srgb, #16a34a 10%, transparent)' }}>Automations</Box>
                </Box>
              </Box>
            </Panel>
            <Splitter ariaLabel="Resize navigation and workspace" />
            <Panel size={46} minSize={28}>
              <Box style={panelShell}>
                <strong>Active workspace</strong>
                <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>
                  Primary editing surface with enough width to show why panel persistence matters.
                </Box>
                <Box style={{ padding: 14, borderRadius: 12, background: 'color-mix(in srgb, #0f172a 4%, transparent)', minBlockSize: 220 }}>
                  Draft response plan, live metrics, and annotations.
                </Box>
              </Box>
            </Panel>
            <Splitter ariaLabel="Resize workspace and inspector" />
            <Panel size={28} minSize={18} collapsedSize={8}>
              <Box style={panelShell}>
                <strong>Inspector</strong>
                <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>
                  Metadata, ownership, audit trail, and task assignment.
                </Box>
                <Box style={{ display: 'grid', gap: 8 }}>
                  <Box style={{ padding: 10, borderRadius: 10, background: 'color-mix(in srgb, #f59e0b 12%, transparent)' }}>Severity: P1</Box>
                  <Box style={{ padding: 10, borderRadius: 10, background: 'color-mix(in srgb, #ef4444 10%, transparent)' }}>SLA at risk</Box>
                </Box>
              </Box>
            </Panel>
          </PanelGroup>
        </Box>
      </ShowcaseSection>
    </ShowcasePage>
  );
};

export const CollapsibleConsole = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ShowcaseSection
      eyebrow="Console Stack"
      title="Collapsible console"
      description="Vertical panel groups should feel just as resolved as horizontal shells, especially when used for editor and console pairings."
    >
      <Box style={{ display: 'grid', gap: 16 }}>
        <Flex style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <Box>
            <strong>Analysis shell</strong>
            <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 12 }}>
              Vertical panel layouts work for console-and-output stacks as well.
            </Box>
          </Box>
          <Button
            onClick={() => setCollapsed((value) => !value)}
            variant="secondary"
          >
            {collapsed ? 'Expand console' : 'Collapse console'}
          </Button>
        </Flex>

        <PanelGroup orientation="vertical" style={{ blockSize: 440 }}>
          <Panel size={68} minSize={42}>
            <Box style={panelShell}>
              <strong>Query composer</strong>
              <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>
                Main editor surface with stacked tool output below it.
              </Box>
              <Box style={{ minBlockSize: 180, borderRadius: 12, background: 'color-mix(in srgb, #0f172a 4%, transparent)' }} />
            </Box>
          </Panel>
          <Splitter ariaLabel="Resize editor and console" />
          <Panel size={32} minSize={18} collapsed={collapsed} collapsedSize={8}>
            <Box style={panelShell}>
              <strong>Execution console</strong>
              <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>
                Persisted logs, validation results, and post-run diagnostics.
              </Box>
              <Box style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>
                09:42 validate schema
                <br />
                09:43 compile assets
                <br />
                09:44 publish preview
              </Box>
            </Box>
          </Panel>
        </PanelGroup>
        <Box style={showcasePanelStyle}>
          <strong style={{ color: '#0f172a' }}>Why this pattern matters</strong>
          <p style={showcaseCaptionStyle}>Console regions need a believable collapsed state because they spend most of their time secondary to the primary editing surface.</p>
        </Box>
      </Box>
    </ShowcaseSection>
  );
};
`,Ee=`import React, { useState } from 'react';
import { Box, Grid, PasswordField } from '@editora/ui-react';
import {
  ShowcasePage,
  ShowcaseSection,
  showcaseCaptionStyle,
  showcaseChipRowStyle,
  showcaseChipStyle,
  showcasePanelStyle
} from './storybook-showcase';

export default {
  title: 'UI/PasswordField',
  component: PasswordField,
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
    clearable: { control: 'boolean' },
    counter: { control: 'boolean' },
    floatingLabel: { control: 'boolean' },
    showStrength: { control: 'boolean' },
    revealable: { control: 'boolean' },
    validation: { control: 'radio', options: ['none', 'error', 'success'] },
    variant: { control: 'select', options: ['classic', 'surface', 'soft', 'outlined', 'filled', 'flushed', 'minimal', 'contrast', 'elevated'] },
    tone: { control: 'select', options: ['default', 'brand', 'success', 'warning', 'danger'] },
    density: { control: 'select', options: ['default', 'compact', 'comfortable'] },
    shape: { control: 'select', options: ['default', 'square', 'soft'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] }
  }
};

export const Playground = (args: any) => {
  const [revealed, setRevealed] = useState(false);
  const [length, setLength] = useState(0);
  return (
    <ShowcasePage
      eyebrow="Credential Entry"
      title="Password inputs should feel deliberate, secure, and operationally clear"
      description="This field packages visibility control and strength feedback into the same design system language as the rest of the input stack."
      meta={[
        { label: 'Reveal toggle', value: args.revealable ? 'Enabled' : 'Disabled' },
        { label: 'Strength', value: args.showStrength ? 'Visible' : 'Hidden' },
        { label: 'Pattern', value: 'Production auth' }
      ]}
    >
      <ShowcaseSection
        eyebrow="Core Pattern"
        title="Password toggle field"
        description="The default pattern should handle form semantics, visibility changes, and password quality feedback without custom one-off suffix wiring."
      >
        <Grid style={{ display: 'grid', gap: 18, gridTemplateColumns: 'minmax(320px, 1fr) minmax(260px, 320px)' }}>
          <Box style={{ display: 'grid', gap: 14 }}>
            <div style={showcaseChipRowStyle}>
              <span style={showcaseChipStyle}>Visibility toggle</span>
              <span style={showcaseChipStyle}>Strength guidance</span>
              <span style={showcaseChipStyle}>Form ready</span>
            </div>
            <PasswordField
              {...args}
              onInput={(next) => setLength(next.length)}
              onVisibilityChange={setRevealed}
            />
          </Box>
          <Box style={showcasePanelStyle}>
            <strong style={{ color: '#0f172a' }}>Live state</strong>
            <Box style={{ color: '#64748b', fontSize: 13 }}>
              Visibility: {revealed ? 'visible' : 'hidden'}
            </Box>
            <Box style={{ color: '#64748b', fontSize: 13 }}>
              Characters: {length}
            </Box>
            <p style={showcaseCaptionStyle}>Use \`showStrength\` for signup, recovery, or admin-reset flows where quality feedback is part of the product contract.</p>
          </Box>
        </Grid>
      </ShowcaseSection>
    </ShowcasePage>
  );
};

Playground.args = {
  label: 'Workspace password',
  description: 'Used for admin-level changes and destructive actions.',
  placeholder: 'Enter password',
  disabled: false,
  readOnly: false,
  required: false,
  clearable: false,
  counter: false,
  floatingLabel: false,
  showStrength: true,
  revealable: true,
  validation: 'none',
  variant: 'surface',
  tone: 'default',
  density: 'default',
  shape: 'default',
  size: 'md'
};

export const SignupRequirements = () => (
  <ShowcaseSection
    eyebrow="Account Creation"
    title="Strength-led signup pattern"
    description="This is the common SaaS account-creation path: strong password guidance, floating label, and a slightly more elevated shell."
  >
    <Box style={{ maxWidth: 520, display: 'grid', gap: 12 }}>
      <PasswordField
        label="Create password"
        description="Use at least 12 characters. Mix uppercase, lowercase, numbers, and symbols."
        placeholder="Choose a strong password"
        showStrength
        floatingLabel
        variant="elevated"
        clearable
        autoComplete="new-password"
      />
      <p style={showcaseCaptionStyle}>Pair this with a confirm-password field and a mismatch validator when the flow requires explicit confirmation.</p>
    </Box>
  </ShowcaseSection>
);

export const SecurityConsole = () => (
  <ShowcaseSection
    eyebrow="Admin Console"
    title="Compact verification field"
    description="For higher-friction admin checks, the field should stay dense and deliberate without losing the reveal affordance."
  >
    <Grid style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(2, minmax(240px, 1fr))' }}>
      <PasswordField
        label="Current password"
        description="Required before rotating signing keys."
        variant="outlined"
        density="compact"
        shape="square"
        autoComplete="current-password"
      />
      <PasswordField
        label="Recovery key"
        description="Reveal is disabled when shoulder-surfing risk is higher."
        variant="contrast"
        tone="warning"
        density="compact"
        revealable={false}
        autoComplete="one-time-code"
      />
    </Grid>
  </ShowcaseSection>
);

export const EnterprisePolicy = () => {
  const [label, setLabel] = useState('Awaiting input');
  return (
    <ShowcaseSection
      eyebrow="Custom Policy"
      title="Policy-driven strength evaluation"
      description="Production auth flows often need to plug in enterprise-specific password rules instead of relying on fixed heuristics."
    >
      <Grid style={{ display: 'grid', gap: 16, gridTemplateColumns: 'minmax(320px, 1fr) minmax(260px, 320px)' }}>
        <PasswordField
          label="Privileged account password"
          description="Requires a minimum length plus a company-specific rule set."
          showStrength
          strengthEvaluator={(value) => {
            if (value.length >= 16 && /[A-Z]/.test(value) && /\\d/.test(value) && /[^A-Za-z0-9]/.test(value)) {
              return {
                score: 4,
                label: 'Enterprise strong',
                caption: 'Matches privileged-account policy.'
              };
            }
            return {
              score: 2,
              label: 'Needs policy work',
              caption: 'Use 16+ chars with uppercase, numbers, and symbols.'
            };
          }}
          onStrengthChange={(detail) => setLabel(detail.label)}
        />
        <Box style={showcasePanelStyle}>
          <strong style={{ color: '#0f172a' }}>Current strength label</strong>
          <Box style={{ color: '#64748b', fontSize: 13 }}>{label}</Box>
          <p style={showcaseCaptionStyle}>This is the integration path for products with their own password policy language or compliance requirements.</p>
        </Box>
      </Grid>
    </ShowcaseSection>
  );
};

export const VariantGallery = () => {
  const variants = [
    ['classic', 'Classic'],
    ['surface', 'Surface'],
    ['soft', 'Soft'],
    ['outlined', 'Outlined'],
    ['filled', 'Filled'],
    ['flushed', 'Flushed'],
    ['minimal', 'Minimal'],
    ['contrast', 'Contrast'],
    ['elevated', 'Elevated']
  ] as const;

  return (
    <ShowcaseSection
      eyebrow="Visual System"
      title="Variant gallery"
      description="Each password field variant should keep the same affordances: direct typing, reveal control, and predictable password guidance."
    >
      <Grid style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {variants.map(([variant, title]) => (
          <Box key={variant} style={{ display: 'grid', gap: 10 }}>
            <strong style={{ color: '#0f172a', fontSize: 13 }}>{title}</strong>
            <PasswordField
              label={\`\${title} password\`}
              description="Reveal stays ghosted by default so it reads as a field affordance, not a pill button."
              placeholder="Enter password"
              variant={variant}
              showStrength
              clearable
            />
          </Box>
        ))}
      </Grid>
    </ShowcaseSection>
  );
};

export const StateMatrix = () => (
  <ShowcaseSection
    eyebrow="Operational States"
    title="Production state coverage"
    description="The component needs to hold up not just in the default state, but in readonly, invalid, success, no-reveal, and dense admin usage."
  >
    <Grid style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
      <PasswordField
        label="Readonly password"
        description="Used in audit views where reveal should not mutate the field."
        value="ReadonlySecret42!"
        readOnly
        variant="surface"
      />
      <PasswordField
        label="Validation error"
        description="Used when the backend rejects the credential or policy requirements are unmet."
        value="short"
        validation="error"
        error="Password must be at least 12 characters."
        showStrength
        tone="danger"
        variant="outlined"
      />
      <PasswordField
        label="Validated success"
        description="Used after policy confirmation in setup or reset flows."
        value="VeryStrongPassword#42"
        validation="success"
        showStrength
        tone="success"
        variant="soft"
      />
      <PasswordField
        label="No reveal"
        description="For sensitive support-console flows where reveal is intentionally suppressed."
        placeholder="Enter recovery secret"
        revealable={false}
        autoComplete="off"
        variant="contrast"
        tone="warning"
      />
      <PasswordField
        label="Disabled field"
        description="Communicates locked state cleanly without showing stray toggle chrome."
        value="DisabledValue42!"
        disabled
        showStrength
        variant="filled"
      />
      <PasswordField
        label="Clearable with counter"
        description="Useful for temporary secret entry or wizard-style setup steps."
        placeholder="Set workspace password"
        clearable
        counter
        maxlength={32}
        variant="elevated"
      />
    </Grid>
  </ShowcaseSection>
);

export const DensityAndShape = () => (
  <ShowcaseSection
    eyebrow="Layout Variations"
    title="Density, size, and shape patterns"
    description="These are the combinations teams usually need when the same field moves from app shell forms into admin rails or console drawers."
  >
    <Grid style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
      <PasswordField
        label="Compact square"
        description="Toolbar-style administrative density."
        density="compact"
        size="sm"
        shape="square"
        variant="outlined"
      />
      <PasswordField
        label="Default soft"
        description="Balanced product default."
        density="default"
        size="md"
        shape="soft"
        variant="surface"
        showStrength
      />
      <PasswordField
        label="Comfortable large"
        description="Signup and recovery forms that need more breathing room."
        density="comfortable"
        size="lg"
        shape="soft"
        floatingLabel
        variant="elevated"
        showStrength
      />
    </Grid>
  </ShowcaseSection>
);
`,Oe=`import React from 'react';
import { Box, Button, Fieldset, OTPInput, PinInput } from '@editora/ui-react';
import {
  ShowcasePage,
  ShowcaseSection,
  showcaseCaptionStyle,
  showcaseChipRowStyle,
  showcaseChipStyle,
  showcaseMonoStyle,
  showcasePanelStyle
} from './storybook-showcase';

export default {
  title: 'UI/PinInput',
  component: PinInput,
  argTypes: {
    length: { control: { type: 'range', min: 4, max: 8, step: 1 } },
    mask: { control: 'boolean' },
    mode: { control: 'select', options: ['numeric', 'alpha', 'alphanumeric'] }
  }
};

export const VerificationCode = (args: any) => {
  const [value, setValue] = React.useState('');
  const [completed, setCompleted] = React.useState('');

  return (
    <ShowcasePage
      eyebrow="Verification Inputs"
      title="Segmented pin entry should feel secure, calm, and operationally clear"
      description="These stories are intended to validate focus flow, paste behavior, completion states, and visual rhythm for authentication and approval flows."
      meta={[
        { label: 'Entry mode', value: args.mode },
        { label: 'Length', value: \`\${args.length} cells\` },
        { label: 'Masking', value: args.mask ? 'On' : 'Off', tone: args.mask ? 'warning' : 'neutral' }
      ]}
    >
      <ShowcaseSection
        eyebrow="Default Pattern"
        title="Verification code"
        description="The segmented field should be easy to scan, forgiving to paste, and visually balanced enough to sit in auth screens without looking improvised."
      >
        <Box style={{ display: 'grid', gap: 16, maxWidth: 560 }}>
          <div style={showcaseChipRowStyle}>
            <span style={showcaseChipStyle}>Auto-advance</span>
            <span style={showcaseChipStyle}>Paste friendly</span>
            <span style={showcaseChipStyle}>Completion event</span>
          </div>
          <PinInput
            length={args.length}
            mode={args.mode}
            mask={args.mask}
            label="Verification code"
            description="Enter the one-time code sent to your device."
            value={value}
            onChange={setValue}
            onComplete={setCompleted}
            placeholderChar="•"
          />
          <div style={{ ...showcasePanelStyle, gap: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
              Input state
            </div>
            <div style={{ fontSize: 14, color: '#0f172a' }}>
              Current: <code style={showcaseMonoStyle}>{value || '(empty)'}</code>
            </div>
            <div style={{ fontSize: 14, color: '#0f172a' }}>
              Complete: <code style={showcaseMonoStyle}>{completed || '(waiting)'}</code>
            </div>
          </div>
        </Box>
      </ShowcaseSection>
    </ShowcasePage>
  );
};

VerificationCode.args = {
  length: 6,
  mode: 'numeric',
  mask: false
};

export const RecoveryCode = () => (
  <ShowcaseSection
    eyebrow="Admin Recovery"
    title="Longer OTP pattern"
    description="Alpha-numeric recovery paths need stronger framing and more semantic grouping than a standard login OTP."
  >
    <Fieldset
      legend="Recovery verification"
      description="Alpha-numeric challenge code for admin recovery flows."
      variant="surface"
      style={{ maxWidth: 640 }}
    >
      <OTPInput length={8} mode="alphanumeric" label="Recovery code" description="Paste or type the issued code." />
    </Fieldset>
    <p style={showcaseCaptionStyle}>Use this for account recovery, secondary approval, and high-assurance admin challenges.</p>
  </ShowcaseSection>
);

export const MaskedEntry = () => {
  const ref = React.useRef<HTMLElement | null>(null);
  return (
    <ShowcaseSection
      eyebrow="Sensitive Flow"
      title="Masked approval entry"
      description="Masking should still preserve calm spacing and an obvious recovery action when the user needs to restart entry."
    >
      <Box style={{ display: 'grid', gap: 16, maxWidth: 560 }}>
        <PinInput ref={ref} length={6} mask label="Secure approval code" description="Masked entry for high-sensitivity flows." />
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button size="sm" onClick={() => (ref.current as any)?.clear?.()}>Clear code</Button>
          <p style={showcaseCaptionStyle}>Reset should feel secondary and deliberate, not like a destructive primary action.</p>
        </div>
      </Box>
    </ShowcaseSection>
  );
};
`,Le=`import React, { useState } from 'react';
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

      <PluginPanel
        open={open}
        position={position}
        title="Plugin inspector"
        description="Review plugin output and close the panel with the built-in dismiss action."
        dismissible
        onOpenChange={(detail) => setOpen(detail.open)}
      >
        <Box style={{ padding: 12, minWidth: 220 }}>
          <strong>Plugin Panel</strong>
          <p style={{ margin: '8px 0 0', color: '#475569' }}>Position: {position}</p>
        </Box>
      </PluginPanel>
    </Grid>
  );
};
Default.args = { open: true, position: 'right' };
`,_e=`import React from 'react';
import { Popover, Button , Box, Flex} from '@editora/ui-react';

export default {
  title: 'UI/Popover',
  component: Popover,
  args: {
    placement: 'bottom',
    offset: 8,
    closeOnEscape: true,
    closeOnOutside: true
  }
};

export const Default = (args: any) => (
  <Box style={{ padding: 60 }}>
    <Popover {...args}>
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

export const PlacementMatrix = () => (
  <Flex style={{ display: 'flex', gap: 24, flexWrap: 'wrap', padding: 60 }}>
    {(['top', 'right', 'bottom-start', 'left-end'] as const).map((placement) => (
      <Popover key={placement} placement={placement} offset={12} closeOnOutside>
        <Button slot="trigger">{placement}</Button>
        <Box slot="content" style={{ padding: 10, minWidth: 180 }}>
          Placement: <strong>{placement}</strong>
        </Box>
      </Popover>
    ))}
  </Flex>
);
`,We=`import React from 'react';
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
`,He=`import React from 'react';
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
`,Ne=`import React from 'react';
import {
  Anchor,
  Box,
  Button,
  Collection,
  DismissableLayer,
  Flex,
  FocusScope,
  Listbox,
  Positioner,
  RovingFocusGroup
} from '@editora/ui-react';
import {
  ShowcasePage,
  ShowcaseSection,
  showcaseCaptionStyle,
  showcaseChipRowStyle,
  showcaseChipStyle,
  showcasePanelStyle
} from './storybook-showcase';

export default {
  title: 'UI/Primitive Wrappers'
};

const shell: React.CSSProperties = {
  display: 'grid',
  gap: 18,
  maxWidth: 980,
  padding: 24,
  border: '1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 76%, transparent)',
  borderRadius: 20,
  background: 'var(--ui-color-surface, #ffffff)',
  boxShadow: '0 18px 42px rgba(15, 23, 42, 0.08)'
};

const panel: React.CSSProperties = {
  display: 'grid',
  gap: 12,
  padding: 16,
  border: '1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 78%, transparent)',
  borderRadius: 14,
  background: 'color-mix(in srgb, var(--ui-color-surface, #ffffff) 96%, #eff6ff 4%)'
};

const menuButton: React.CSSProperties = {
  width: '100%',
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto',
  gap: 12,
  alignItems: 'center',
  minHeight: 42,
  padding: '10px 12px',
  border: 0,
  borderRadius: 10,
  background: 'transparent',
  color: '#0f172a',
  textAlign: 'left',
  cursor: 'pointer'
};

const shortcut: React.CSSProperties = {
  justifySelf: 'end',
  padding: '4px 6px',
  borderRadius: 8,
  background: 'rgba(15, 23, 42, 0.04)',
  fontSize: 12,
  fontFamily: 'IBM Plex Mono, SFMono-Regular, monospace',
  color: '#64748b'
};

export const CollectionAndListbox = () => {
  const collectionRef = React.useRef<HTMLElement | null>(null);
  const listboxRef = React.useRef<HTMLElement | null>(null);
  const [collectionInfo, setCollectionInfo] = React.useState('3 items registered');
  const [activeValue, setActiveValue] = React.useState('schedule');

  const updateCollectionInfo = React.useCallback(() => {
    const items = ((collectionRef.current as any)?.queryItems?.() || []) as HTMLElement[];
    setCollectionInfo(\`\${items.length} items registered\`);
  }, []);

  const syncActiveValue = React.useCallback(() => {
    const active = (listboxRef.current as any)?.getActiveItem?.() as HTMLElement | null;
    setActiveValue(active?.getAttribute('data-value') || '(none)');
  }, []);

  React.useEffect(() => {
    updateCollectionInfo();
    const listbox = listboxRef.current as any;
    if (!listbox) return;
    const first = listbox.findByValue?.('schedule') || null;
    if (first) {
      listbox.setActiveItem(first, { focus: false, scroll: false });
      syncActiveValue();
    }
  }, [syncActiveValue, updateCollectionInfo]);

  return (
    <ShowcasePage
      eyebrow="Infrastructure"
      title="Primitive wrappers need audit surfaces too, not just product-facing components"
      description="These stories are intentionally utilitarian, but they still need clean spacing, strong hierarchy, and enough framing to debug behavior without visual noise."
      meta={[
        { label: 'Collection', value: collectionInfo },
        { label: 'Active', value: activeValue },
        { label: 'Pattern', value: 'Behavioral primitive' }
      ]}
    >
      <ShowcaseSection
        eyebrow="Collection + Listbox"
        title="Item discovery and active traversal"
        description="This story is for debugging low-level selection mechanics, so the surrounding presentation should stay quiet and systematic."
      >
        <div style={showcaseChipRowStyle}>
          <span style={showcaseChipStyle}>Imperative hooks</span>
          <span style={showcaseChipStyle}>Discovery</span>
          <span style={showcaseChipStyle}>Traversal</span>
        </div>

        <Flex style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button size="sm" onClick={() => updateCollectionInfo()}>
            Refresh collection
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              (listboxRef.current as any)?.move?.(-1, { focus: false, scroll: true });
              syncActiveValue();
            }}
          >
            Previous option
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              (listboxRef.current as any)?.move?.(1, { focus: false, scroll: true });
              syncActiveValue();
            }}
          >
            Next option
          </Button>
        </Flex>

        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'minmax(240px, 280px) minmax(280px, 1fr)' }}>
          <Box style={panel}>
            <strong>ui-collection</strong>
            <Collection ref={collectionRef} itemSelector="[data-collection-item]" itemRole="option" onCollectionChange={updateCollectionInfo}>
              <div data-collection-item data-value="schedule">Schedule publish</div>
              <div data-collection-item data-value="duplicate">Duplicate release</div>
              <div data-collection-item data-value="archive">Archive draft</div>
            </Collection>
            <div style={{ fontSize: 13, color: '#64748b' }}>{collectionInfo}</div>
          </Box>

          <Box style={panel}>
            <strong>ui-listbox</strong>
            <Listbox ref={listboxRef} itemSelector="[data-menu-item]" itemRole="option" activeAttribute="data-current">
              {[
                ['schedule', 'Schedule publish', '⌘K'],
                ['duplicate', 'Duplicate release', ''],
                ['archive', 'Archive draft', '']
              ].map(([value, label, keys]) => (
                <button
                  key={value}
                  data-menu-item
                  data-value={value}
                  style={menuButton}
                  onClick={(event) => {
                    (listboxRef.current as any)?.setActiveItem?.(event.currentTarget, { focus: false, scroll: false });
                    syncActiveValue();
                  }}
                >
                  <span>{label}</span>
                  {keys ? <span style={shortcut}>{keys}</span> : null}
                </button>
              ))}
            </Listbox>
            <div style={{ fontSize: 13, color: '#64748b' }}>Active value: <code>{activeValue}</code></div>
          </Box>
        </div>
      </ShowcaseSection>
    </ShowcasePage>
  );
};

export const RovingFocusToolbar = () => {
  const ref = React.useRef<HTMLElement | null>(null);
  const [active, setActive] = React.useState('Bold');

  return (
    <Box style={shell}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
          Roving Focus Group
        </div>
        <div style={{ marginTop: 8, fontSize: 28, fontWeight: 700, lineHeight: 1.1, color: '#0f172a' }}>
          Test directional focus management over a toolbar-style surface
        </div>
      </div>

      <Flex style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button size="sm" onClick={() => (ref.current as any)?.focusBoundary?.('first', { focus: true })}>First item</Button>
        <Button size="sm" variant="secondary" onClick={() => (ref.current as any)?.move?.(-1, { focus: true })}>Move left</Button>
        <Button size="sm" variant="secondary" onClick={() => (ref.current as any)?.move?.(1, { focus: true })}>Move right</Button>
      </Flex>

      <Box style={panel}>
        <RovingFocusGroup ref={ref} itemSelector="[data-tool]" activeAttribute="data-current" onActiveItemChange={(detail) => {
          const label = detail.item?.textContent?.trim();
          if (label) setActive(label);
        }}>
          <Flex style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['Bold', 'Italic', 'Underline', 'Comment'].map((label, index) => (
              <button
                key={label}
                data-tool
                style={{
                  minHeight: 40,
                  padding: '0 14px',
                  borderRadius: 10,
                  border: '1px solid #dbe4f0',
                  background: index === 0 ? '#eff6ff' : '#ffffff'
                }}
                onClick={(event) => (ref.current as any)?.setActiveItem?.(event.currentTarget, { focus: true })}
              >
                {label}
              </button>
            ))}
          </Flex>
        </RovingFocusGroup>
        <div style={{ fontSize: 13, color: '#64748b' }}>Active tool: <code>{active}</code></div>
      </Box>
    </Box>
  );
};

export const LayerAndFocusScope = () => {
  const [open, setOpen] = React.useState(false);
  const [log, setLog] = React.useState('Closed');

  return (
    <Box style={shell}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
          Dismissable Layer + Focus Scope
        </div>
        <div style={{ marginTop: 8, fontSize: 28, fontWeight: 700, lineHeight: 1.1, color: '#0f172a' }}>
          Test outside dismissal, Escape handling, and trapped focus
        </div>
      </div>

      <Button size="sm" onClick={() => setOpen(true)}>Open test layer</Button>
      <div style={{ fontSize: 13, color: '#64748b' }}>Event log: <code>{log}</code></div>

      {open ? (
        <DismissableLayer
          open
          closeOnEscape
          closeOnPointerOutside
          onBeforeClose={(detail) => setLog(\`before-close:\${detail.reason}\`)}
          onClose={(detail) => {
            setLog(\`close:\${detail.reason}\`);
            setOpen(false);
          }}
          style={{
            position: 'fixed',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            background: 'rgba(15, 23, 42, 0.22)',
            zIndex: 2000
          }}
        >
          <FocusScope
            active
            trapped
            loop
            autoFocus="container"
            onEscape={() => {
              setLog('focus-scope:escape');
              setOpen(false);
            }}
          >
            <Box
              tabIndex={-1}
              style={{
                width: 360,
                padding: 20,
                borderRadius: 16,
                background: '#ffffff',
                boxShadow: '0 24px 48px rgba(15, 23, 42, 0.18)',
                display: 'grid',
                gap: 12
              }}
            >
              <strong>Primitive test surface</strong>
              <div style={{ fontSize: 13, color: '#64748b' }}>Use Tab and Escape here to validate focus containment and dismissal behavior.</div>
              <input placeholder="First field" style={{ minHeight: 38, padding: '0 12px', borderRadius: 10, border: '1px solid #cbd5e1' }} />
              <input placeholder="Second field" style={{ minHeight: 38, padding: '0 12px', borderRadius: 10, border: '1px solid #cbd5e1' }} />
              <Flex style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>Close</Button>
                <Button size="sm">Confirm</Button>
              </Flex>
            </Box>
          </FocusScope>
        </DismissableLayer>
      ) : null}
    </Box>
  );
};

export const PositionerAndAnchor = () => {
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState('bottom-start');

  return (
    <Box style={shell}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
          Positioner + Anchor
        </div>
        <div style={{ marginTop: 8, fontSize: 28, fontWeight: 700, lineHeight: 1.1, color: '#0f172a' }}>
          Test anchored floating layout with live placement updates
        </div>
      </div>

      <Flex style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button size="sm" onClick={() => setOpen((value) => !value)}>{open ? 'Hide layer' : 'Show layer'}</Button>
        <Button size="sm" variant="secondary" onClick={() => setPlacement('top-start')}>Top start</Button>
        <Button size="sm" variant="secondary" onClick={() => setPlacement('bottom-start')}>Bottom start</Button>
        <Button size="sm" variant="secondary" onClick={() => setPlacement('right-start')}>Right start</Button>
      </Flex>

      <Box
        style={{
          minHeight: 260,
          borderRadius: 18,
          border: '1px dashed #94a3b8',
          background: 'linear-gradient(180deg, #f8fafc, #eef2ff)',
          display: 'grid',
          placeItems: 'center',
          padding: 24
        }}
      >
        <Positioner open={open} placement={placement as any} offset={10} shift fitViewport onPositionChange={(detail) => setPlacement(detail.placement)}>
          <Anchor slot="anchor">
            <Button>Anchored trigger</Button>
          </Anchor>
          <Box
            slot="content"
            style={{
              minWidth: 240,
              padding: 14,
              borderRadius: 14,
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              boxShadow: '0 22px 48px rgba(15, 23, 42, 0.14)'
            }}
          >
            <strong>Positioned surface</strong>
            <div style={{ marginTop: 8, fontSize: 13, color: '#64748b' }}>
              Current placement: <code>{placement}</code>
            </div>
          </Box>
        </Positioner>
      </Box>
    </Box>
  );
};
`,Ve=`import React from 'react';
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
`,Ue=`import React from 'react';
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
`,qe=`import React, { useMemo, useState } from 'react';
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
`,je=`import type { Meta, StoryObj } from '@storybook/react';
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
`,$e=`import React from 'react';
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
`,Qe=`import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useRef, useState } from 'react';
import { EditoraEditor } from '@editora/react';
import { BoldPlugin, HistoryPlugin, ItalicPlugin, LinkPlugin, StrikethroughPlugin, UnderlinePlugin } from '@editora/plugins';
import { Box, Flex } from '@editora/ui-react';
import '@editora/themes/themes/default.css';
import '@editora/themes/themes/dark.css';
import '@editora/themes/themes/acme.css';
import { allNativePlugins } from './richTextEditor.shared';

const meta: Meta<typeof EditoraEditor> = {
  title: 'Editor/Rich Text Editor - Web Component',
  component: EditoraEditor,
  parameters: {
    layout: 'padded',
    docs: {
      source: { type: 'code' },
      description: {
        component: \`
# Editora Web Component - Core Docs

This page now only contains the core introduction stories so docs stay responsive.

Additional examples were split into dedicated pages:
- \\\`Formatting & Content\\\`
- \\\`Patterns & State\\\`
- \\\`Collaboration & Workflows\\\`
- \\\`Performance\\\`

Use those sub-stories when you want the heavier scenarios without loading every example on one docs page.
        \`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <EditoraEditor
      plugins={allNativePlugins}
      statusbar={{ enabled: true, position: 'bottom' }}
      floatingToolbar={true}
      defaultValue={\`
        <h2>Welcome to Editora</h2>
        <p>This is a <strong>framework-agnostic</strong> rich text editor with a broad native plugin surface.</p>
        <p>✨ <strong>Core capabilities:</strong></p>
        <ul>
          <li>Zero framework dependencies in the editor runtime</li>
          <li>Works with React, Vue, Angular, Svelte, and vanilla web apps</li>
          <li>Large native plugin catalog for enterprise workflows</li>
          <li>Declarative TinyMCE-style API</li>
        </ul>
        <p>Use this page for the lightweight overview. Heavier scenario docs live in dedicated subpages.</p>
      \`}
    />
  ),
};

export const WebComponentAPI: Story = {
  render: () => {
    const editorRef = useRef<any>(null);
    const [output, setOutput] = useState('');
    const [pluginCount, setPluginCount] = useState(0);
    const [version, setVersion] = useState('');

    useEffect(() => {
      if (typeof window !== 'undefined' && (window as any).Editora) {
        const Editora = (window as any).Editora;
        setVersion(Editora.version || 'N/A');
        setPluginCount(Editora.plugins?.length || 0);
      }
    }, []);

    const getContent = () => {
      if (editorRef.current) setOutput(editorRef.current.innerHTML);
    };

    const setContent = () => {
      if (!editorRef.current) return;
      editorRef.current.innerHTML = \`
        <h3>Content Set via API</h3>
        <p>Updated at: \${new Date().toLocaleTimeString()}</p>
        <p>This was set using the Web Component API.</p>
      \`;
    };

    return (
      <div>
        <Box style={{ marginBottom: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '4px' }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Global Editora API</h4>
          <p style={{ margin: '5px 0' }}>Version: <strong>{version}</strong></p>
          <p style={{ margin: '5px 0' }}>Plugins Available: <strong>{pluginCount}</strong></p>
          <Flex style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
            <button onClick={getContent} style={{ padding: '8px 16px' }}>Get Content</button>
            <button onClick={setContent} style={{ padding: '8px 16px' }}>Set Content</button>
          </Flex>
        </Box>

        <div ref={editorRef}>
          <EditoraEditor
            plugins={allNativePlugins}
            statusbar={{ enabled: true }}
            defaultValue={\`
              <h3>Web Component API Demo</h3>
              <p>This editor can be controlled via the global <code>window.Editora</code> object.</p>
              <p>Try the buttons above to interact with the editor programmatically.</p>
            \`}
          />
        </div>

        {output ? (
          <Box style={{ marginTop: '20px', padding: '15px', background: '#e8f5e9', borderRadius: '4px' }}>
            <h4 style={{ margin: '0 0 10px 0' }}>Output</h4>
            <pre style={{ overflow: 'auto', fontSize: '12px' }}>{output}</pre>
          </Box>
        ) : null}
      </div>
    );
  },
};

export const CustomToolbar: Story = {
  render: () => (
    <div>
      <Box style={{ marginBottom: '20px', padding: '15px', background: '#fff3e0', borderRadius: '4px' }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Custom Toolbar</h4>
        <p style={{ margin: 0, fontSize: '14px' }}>Only essential formatting tools are shown in the toolbar.</p>
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
          items: 'undo redo | bold italic underline strikethrough | link',
          sticky: true,
        }}
        defaultValue={\`
          <h2>Minimal Editor</h2>
          <p>This editor has a <strong>simplified toolbar</strong> with only essential formatting options.</p>
          <p>Perfect for comments, lightweight review flows, or simple text input.</p>
        \`}
      />
    </div>
  ),
};

export const ReadonlyMode: Story = {
  render: () => {
    const [readonly, setReadonly] = useState(true);

    return (
      <div>
        <Box style={{ marginBottom: '20px', padding: '15px', background: '#f3e5f5', borderRadius: '4px' }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Readonly Mode</h4>
          <button onClick={() => setReadonly(!readonly)} style={{ padding: '8px 16px' }}>
            {readonly ? 'Enable Editing' : 'Disable Editing'}
          </button>
        </Box>

        <EditoraEditor
          plugins={allNativePlugins}
          statusbar={{ enabled: true }}
          readonly={readonly}
          defaultValue={\`
            <h2>Readonly Content</h2>
            <p>This content is <strong>\${readonly ? 'readonly' : 'editable'}</strong>.</p>
            <p>Click the button above to toggle editing mode.</p>
            <ul>
              <li>Useful for previews and audit views</li>
              <li>Good for formatted document display</li>
              <li>Supports review-mode workflows</li>
            </ul>
          \`}
        />
      </div>
    );
  },
};
`,Ze=`import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { EditoraEditor } from '@editora/react';
import { Box, Grid } from '@editora/ui-react';
import '@editora/themes/themes/default.css';
import '@editora/themes/themes/dark.css';
import '@editora/themes/themes/acme.css';
import { allNativePlugins } from './richTextEditor.shared';

const meta: Meta<typeof EditoraEditor> = {
  title: 'Editor/Rich Text Editor - Web Component/Formatting & Content',
  component: EditoraEditor,
  parameters: {
    layout: 'padded',
    docs: {
      source: { type: 'code' },
      description: {
        component: 'Formatting and content examples were split out of the main docs page to keep the base editor docs responsive.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AllPluginsShowcase: Story = {
  render: () => (
    <div>
      <Box style={{ marginBottom: '20px', padding: '15px', background: '#e3f2fd', borderRadius: '4px' }}>
        <h3 style={{ margin: '0 0 10px 0' }}>All Native Plugins Loaded</h3>
        <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', fontSize: '13px' }}>
          <div><strong>Basic Formatting:</strong><br />Bold, Italic, Underline, Strikethrough, ClearFormatting</div>
          <div><strong>Block Types:</strong><br />Heading, Blockquote, Code, Code Sample</div>
          <div><strong>Lists:</strong><br />List, Checklist</div>
          <div><strong>Layout:</strong><br />TextAlignment, Indent, Direction</div>
          <div><strong>Typography:</strong><br />TextColor, BackgroundColor, FontSize, FontFamily, LineHeight, Capitalization</div>
          <div><strong>Content:</strong><br />Link, Table, Anchor, EmbedIframe, Footnote</div>
          <div><strong>Special:</strong><br />Math, SpecialCharacters, Emojis</div>
          <div><strong>Tools:</strong><br />A11yChecker, Comments, DocumentManager, Fullscreen</div>
          <div><strong>Workflow:</strong><br />Schema, Translation, Approval, SmartPaste, PII Redaction</div>
        </Grid>
      </Box>

      <EditoraEditor
        plugins={allNativePlugins}
        statusbar={{ enabled: true }}
        defaultValue={\`
          <h1>All Plugin Features</h1>
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
          <p style="text-align: justify;">Justified text with enough content to wrap and demonstrate justification.</p>
          <h2>Lists</h2>
          <ul><li>Bullet list item 1</li><li>Bullet list item 2</li></ul>
          <ol><li>Numbered list item 1</li><li>Numbered list item 2</li></ol>
          <h2>Block Quotes</h2>
          <blockquote>"This is a blockquote. It can contain multiple paragraphs and formatting."</blockquote>
          <h2>Code</h2>
          <pre><code>function hello() { console.log("Hello, World!"); }</code></pre>
          <h2>Tables</h2>
          <table border="1"><tr><th>Header 1</th><th>Header 2</th></tr><tr><td>Cell 1</td><td>Cell 2</td></tr></table>
        \`}
      />
    </div>
  ),
};

export const MathEquations: Story = {
  render: () => (
    <div>
      <Box style={{ marginBottom: '20px', padding: '15px', background: '#e1f5fe', borderRadius: '4px' }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Math Plugin</h4>
        <p style={{ margin: 0, fontSize: '14px' }}>Insert mathematical equations using LaTeX notation.</p>
      </Box>

      <EditoraEditor
        plugins={allNativePlugins}
        statusbar={{ enabled: true }}
        defaultValue={\`
          <h2>Mathematical Equations</h2>
          <p>Inline equation: <span data-math-inline="true" data-latex="E = mc^2" class="math-inline">$E = mc^2$</span></p>
          <div data-math-block="true" data-latex="\\\\sum_{i=1}^{n} i = \\\\frac{n(n+1)}{2}" class="math-block">
            $$\\\\sum_{i=1}^{n} i = \\\\frac{n(n+1)}{2}$$
          </div>
          <p>Pythagorean theorem: <span data-math-inline="true" data-latex="a^2 + b^2 = c^2" class="math-inline">$a^2 + b^2 = c^2$</span></p>
        \`}
      />
    </div>
  ),
};

export const SpecialContent: Story = {
  render: () => (
    <div>
      <Box style={{ marginBottom: '20px', padding: '15px', background: '#fce4ec', borderRadius: '4px' }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Special Characters & Emojis</h4>
        <p style={{ margin: 0, fontSize: '14px' }}>Insert special characters and emojis from the editor tool surface.</p>
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
        \`}
      />
    </div>
  ),
};

export const Tables: Story = {
  render: () => (
    <div>
      <Box style={{ marginBottom: '20px', padding: '15px', background: '#f1f8e9', borderRadius: '4px' }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Table Plugin</h4>
        <p style={{ margin: 0, fontSize: '14px' }}>Create and edit structured tables in the editor.</p>
      </Box>

      <EditoraEditor
        plugins={allNativePlugins}
        statusbar={{ enabled: true }}
        defaultValue={\`
          <h2>Tables</h2>
          <table border="1" style="border-collapse: collapse; width: 100%;">
            <thead>
              <tr>
                <th style="padding: 8px; background: #f5f5f5;">Feature</th>
                <th style="padding: 8px; background: #f5f5f5;">Status</th>
                <th style="padding: 8px; background: #f5f5f5;">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style="padding: 8px;">Web Component</td><td style="padding: 8px;">Complete</td><td style="padding: 8px;">Framework-agnostic</td></tr>
              <tr><td style="padding: 8px;">Native Plugins</td><td style="padding: 8px;">Complete</td><td style="padding: 8px;">Extensive surface</td></tr>
              <tr><td style="padding: 8px;">Bundle Size</td><td style="padding: 8px;">Optimized</td><td style="padding: 8px;">Lean runtime</td></tr>
            </tbody>
          </table>
        \`}
      />
    </div>
  ),
};

export const EventHandling: Story = {
  render: () => {
    const [content, setContent] = useState('');
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);

    const handleChange = (html: string) => {
      setContent(html);
      const text = html.replace(/<[^>]*>/g, '').trim();
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
            <h2>Try typing here</h2>
            <p>Watch the statistics update in real time as you type.</p>
          \`}
        />

        <Box style={{ marginTop: '20px', padding: '15px', background: '#e8f5e9', borderRadius: '4px' }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Statistics</h4>
          <p style={{ margin: '5px 0' }}>Words: <strong>{wordCount}</strong></p>
          <p style={{ margin: '5px 0' }}>Characters: <strong>{charCount}</strong></p>
          <details style={{ marginTop: '10px' }}>
            <summary style={{ cursor: 'pointer' }}>Show HTML</summary>
            <pre style={{ fontSize: '12px', overflow: 'auto', marginTop: '10px' }}>{content}</pre>
          </details>
        </Box>
      </div>
    );
  },
};
`,Je=`import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { EditoraEditor } from '@editora/react';
import { BoldPlugin, ItalicPlugin, UnderlinePlugin } from '@editora/plugins';
import { Box, Flex, Grid } from '@editora/ui-react';
import '@editora/themes/themes/default.css';
import '@editora/themes/themes/dark.css';
import '@editora/themes/themes/acme.css';
import { allNativePlugins } from './richTextEditor.shared';

const meta: Meta<typeof EditoraEditor> = {
  title: 'Editor/Rich Text Editor - Web Component/Patterns & State',
  component: EditoraEditor,
  parameters: {
    layout: 'padded',
    docs: {
      source: { type: 'code' },
      description: {
        component: 'State-heavy editor examples were moved here so the core docs page no longer renders multiple live instances at once.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const PlaceholderPatterns: Story = {
  render: () => (
    <div>
      <Box style={{ marginBottom: '20px', padding: '15px', background: '#e3f2fd', borderRadius: '4px' }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Placeholder Patterns</h4>
        <p style={{ margin: 0, fontSize: '14px' }}>Simple, detailed, and prefilled placeholder states are grouped here instead of the main docs page.</p>
      </Box>

      <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px' }}>
        <div>
          <h4 style={{ margin: '0 0 8px 0' }}>Simple Placeholder</h4>
          <EditoraEditor
            plugins={[BoldPlugin(), ItalicPlugin()]}
            toolbar={{ items: 'bold italic', showMoreOptions: false }}
            statusbar={{ enabled: true }}
            placeholder="Type something here..."
          />
        </div>

        <div>
          <h4 style={{ margin: '0 0 8px 0' }}>Detailed Placeholder</h4>
          <EditoraEditor
            plugins={[BoldPlugin(), ItalicPlugin(), UnderlinePlugin()]}
            toolbar={{ items: 'bold italic underline', showMoreOptions: false }}
            statusbar={{ enabled: true }}
            placeholder="Draft release notes: summary, impact, migration steps, and rollback plan."
          />
        </div>

        <div>
          <h4 style={{ margin: '0 0 8px 0' }}>Prefilled Then Clear</h4>
          <EditoraEditor
            plugins={[BoldPlugin(), ItalicPlugin()]}
            toolbar={{ items: 'bold italic', showMoreOptions: false }}
            statusbar={{ enabled: true }}
            placeholder="Delete all content to show this placeholder."
            defaultValue="<p>This editor starts with content. Clear it to reveal placeholder.</p>"
          />
        </div>
      </Grid>
    </div>
  ),
};

export const ThemeSwitcherEditorOnly: Story = {
  render: () => {
    const [themeA, setThemeA] = useState<'default' | 'dark' | 'acme'>('default');
    const [themeB, setThemeB] = useState<'default' | 'dark' | 'acme'>('dark');

    const cycleTheme = (theme: 'default' | 'dark' | 'acme') => {
      if (theme === 'default') return 'dark';
      if (theme === 'dark') return 'acme';
      return 'default';
    };

    return (
      <div>
        <Box style={{ marginBottom: '20px', padding: '15px', background: '#ede7f6', borderRadius: '4px' }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Theme Switcher (Editor Only)</h4>
          <p style={{ margin: '0 0 12px 0', fontSize: '14px' }}>
            Switch only the editor theme wrappers without changing the Storybook page theme.
          </p>
          <Flex style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => setThemeA(cycleTheme(themeA))} style={{ padding: '8px 16px' }}>Cycle Editor A</button>
            <button onClick={() => setThemeB(cycleTheme(themeB))} style={{ padding: '8px 16px' }}>Cycle Editor B</button>
            <button onClick={() => { setThemeA('dark'); setThemeB('dark'); }} style={{ padding: '8px 16px' }}>Set Both Dark</button>
            <button onClick={() => { setThemeA('default'); setThemeB('default'); }} style={{ padding: '8px 16px' }}>Set Both Default</button>
            <button onClick={() => { setThemeA('acme'); setThemeB('acme'); }} style={{ padding: '8px 16px' }}>Set Both Acme</button>
          </Flex>
        </Box>

        <Grid style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div data-theme={themeA} style={{ padding: '10px', borderRadius: '8px', background: themeA === 'dark' ? '#0b1220' : themeA === 'acme' ? '#eef4fb' : '#ffffff' }}>
            <h4 style={{ margin: '0 0 8px 0', color: themeA === 'dark' ? '#f8fafc' : themeA === 'acme' ? '#0f4f4a' : '#111827' }}>Editor A</h4>
            <EditoraEditor plugins={allNativePlugins} toolbar={{ showMoreOptions: false }} statusbar={{ enabled: true }} floatingToolbar={true} defaultValue="<p>Editor A theme is controlled independently.</p>" />
          </div>

          <div data-theme={themeB} style={{ padding: '10px', borderRadius: '8px', background: themeB === 'dark' ? '#0b1220' : themeB === 'acme' ? '#eef4fb' : '#ffffff' }}>
            <h4 style={{ margin: '0 0 8px 0', color: themeB === 'dark' ? '#f8fafc' : themeB === 'acme' ? '#0f4f4a' : '#111827' }}>Editor B</h4>
            <EditoraEditor plugins={allNativePlugins} toolbar={{ showMoreOptions: false }} statusbar={{ enabled: true }} floatingToolbar={true} defaultValue="<p>Editor B can use a different theme from Editor A.</p>" />
          </div>
        </Grid>
      </div>
    );
  },
};

export const MultipleEditors: Story = {
  render: () => {
    const [contentA, setContentA] = useState('');
    const [contentB, setContentB] = useState('');

    return (
      <div>
        <Box style={{ marginBottom: '20px', padding: '15px', background: '#fff9c4', borderRadius: '4px' }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Multiple Editors</h4>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Two independent editor instances with content synchronization.</p>
          <Flex style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setContentB(contentA)} style={{ padding: '8px 16px' }}>Sync A → B</button>
            <button onClick={() => setContentA(contentB)} style={{ padding: '8px 16px' }}>Sync B → A</button>
          </Flex>
        </Box>

        <Grid style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
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

export const ControlledEditor: Story = {
  render: () => {
    const [value, setValue] = useState(\`
      <h2>Controlled Editor</h2>
      <p>This editor's content is controlled by React state.</p>
    \`);

    return (
      <div>
        <Box style={{ marginBottom: '20px', padding: '15px', background: '#e0f2f1', borderRadius: '4px' }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Controlled Component</h4>
          <Flex style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setValue(\`<h2>Reset!</h2><p>Content was reset at \${new Date().toLocaleTimeString()}</p>\`)} style={{ padding: '8px 16px' }}>
              Reset Content
            </button>
            <button onClick={() => setValue((prev) => prev + \`<p>Appended at \${new Date().toLocaleTimeString()}</p>\`)} style={{ padding: '8px 16px' }}>
              Append Content
            </button>
          </Flex>
        </Box>

        <EditoraEditor plugins={allNativePlugins} statusbar={{ enabled: true }} value={value} onChange={setValue} />
      </div>
    );
  },
};
`,Ke=`import type { Meta, StoryObj } from '@storybook/react';
import { EditoraEditor } from '@editora/react';
import { Box } from '@editora/ui-react';
import '@editora/themes/themes/default.css';
import '@editora/themes/themes/dark.css';
import '@editora/themes/themes/acme.css';
import { allNativePlugins } from './richTextEditor.shared';

const meta: Meta<typeof EditoraEditor> = {
  title: 'Editor/Rich Text Editor - Web Component/Performance',
  component: EditoraEditor,
  parameters: {
    layout: 'padded',
    docs: {
      source: { type: 'code' },
      description: {
        component: 'The large-document stress case is isolated here so it does not slow down the main Rich Text Editor docs page.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function generateLargeContent() {
  let content = '<h1>Large Document Performance Test</h1>';
  content += '<p><strong>This document contains 100 sections to stress test editor rendering and navigation.</strong></p>';

  for (let i = 1; i <= 100; i += 1) {
    content += \`<h3>Section \${i}</h3>\`;
    content += \`<p>This is paragraph \${i}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>\`;
    if (i % 10 === 0) {
      content += \`<blockquote>Milestone: Completed \${i} sections.</blockquote>\`;
    }
  }

  return content;
}

export const LargeDocument: Story = {
  render: () => (
    <div>
      <Box style={{ marginBottom: '20px', padding: '15px', background: '#ffebee', borderRadius: '4px' }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Performance Test</h4>
        <p style={{ margin: 0, fontSize: '14px' }}>
          This story is intentionally isolated because it mounts a large document and is meant for performance validation, not for the default docs page.
        </p>
      </Box>

      <EditoraEditor
        plugins={allNativePlugins}
        statusbar={{ enabled: true }}
        defaultValue={generateLargeContent()}
      />
    </div>
  ),
};
`,Ye=`import type { Meta, StoryObj } from '@storybook/react';
import { EditoraEditor } from '@editora/react';
import { Box, Grid } from '@editora/ui-react';
import '@editora/themes/themes/default.css';
import '@editora/themes/themes/dark.css';
import '@editora/themes/themes/acme.css';
import { allNativePlugins } from './richTextEditor.shared';

const meta: Meta<typeof EditoraEditor> = {
  title: 'Editor/Rich Text Editor - Web Component/Collaboration & Workflows',
  component: EditoraEditor,
  parameters: {
    layout: 'padded',
    docs: {
      source: { type: 'code' },
      description: {
        component: 'Workflow-heavy editor scenarios were split out so the base docs page no longer mounts every enterprise example at once.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const FrameworkIndependence: Story = {
  render: () => (
    <div>
      <Box style={{ marginBottom: '20px', padding: '15px', background: '#f3e5f5', borderRadius: '4px' }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Framework Independence</h3>
        <p style={{ margin: 0, fontSize: '14px' }}>
          The same editor works in React, Vue, Angular, Svelte, or vanilla JavaScript.
        </p>

        <Grid style={{ marginTop: '15px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '13px' }}>
          <Box style={{ padding: '10px', background: 'white', borderRadius: '4px' }}><strong>React:</strong><br /><code style={{ fontSize: '11px' }}>&lt;EditoraEditor /&gt;</code></Box>
          <Box style={{ padding: '10px', background: 'white', borderRadius: '4px' }}><strong>Vanilla JS:</strong><br /><code style={{ fontSize: '11px' }}>&lt;editora-editor&gt;</code></Box>
          <Box style={{ padding: '10px', background: 'white', borderRadius: '4px' }}><strong>Vue:</strong><br /><code style={{ fontSize: '11px' }}>&lt;editora-editor&gt;</code></Box>
          <Box style={{ padding: '10px', background: 'white', borderRadius: '4px' }}><strong>Angular:</strong><br /><code style={{ fontSize: '11px' }}>&lt;editora-editor&gt;</code></Box>
        </Grid>
      </Box>

      <EditoraEditor
        plugins={allNativePlugins}
        statusbar={{ enabled: true }}
        defaultValue={\`
          <h2>Universal Editor</h2>
          <p><strong>Zero framework dependencies.</strong></p>
          <h3>Works With</h3>
          <ul>
            <li>React</li>
            <li>Vue.js</li>
            <li>Angular</li>
            <li>Svelte</li>
            <li>Vanilla JavaScript</li>
          </ul>
          <blockquote>Build once, use everywhere.</blockquote>
        \`}
      />
    </div>
  ),
};

export const DocSchemaWorkflow: Story = {
  render: () => (
    <div>
      <Box style={{ marginBottom: '16px', padding: '14px', background: '#ecfdf5', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>Doc Schema Workflow</h4>
        <p style={{ margin: 0, fontSize: '13px' }}>
          Use <code>Ctrl/Cmd+Alt+Shift+G</code> to open schema validation, review missing sections, and normalize structure.
        </p>
      </Box>

      <EditoraEditor
        plugins={allNativePlugins}
        statusbar={{ enabled: true, position: 'bottom' }}
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

export const TranslationWorkflowScenario: Story = {
  render: () => (
    <div>
      <Box style={{ marginBottom: '16px', padding: '14px', background: '#eff6ff', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>Translation Workflow</h4>
        <p style={{ margin: 0, fontSize: '13px' }}>
          Use <code>Ctrl/Cmd+Alt+Shift+L</code> to open translation QA, capture source, and lock approved segments.
        </p>
      </Box>

      <EditoraEditor
        plugins={allNativePlugins}
        statusbar={{ enabled: true, position: 'bottom' }}
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
`,Xe=`import React, { useRef, useState } from 'react';
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
`,et=`import React from 'react';
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
`,tt=`import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { createThemeTokens, type AccentPaletteName, type ThemeTokens } from '@editora/ui-core';
import { Badge, Box, Button, Card, CardDescription, CardHeader, CardTitle, Flex, Grid, Select, ThemeProvider } from '@editora/ui-react';

const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
  args: {
    value: 'review',
    disabled: false,
    loading: false,
    required: false,
    invalid: false,
    placeholder: 'Choose a status',
    size: 'md',
    variant: 'soft',
    tone: 'default',
    density: 'default',
    shape: 'rounded',
    elevation: 'low',
    radius: 12,
    optionBorder: false,
    validation: 'none',
  },
  argTypes: {
    value: { control: 'text' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    required: { control: 'boolean' },
    invalid: { control: 'boolean' },
    placeholder: { control: 'text' },
    variant: {
      control: 'select',
      options: ['classic', 'surface', 'soft', 'filled', 'outline', 'line', 'minimal', 'ghost', 'solid', 'glass', 'contrast'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg', '1', '2', '3'] },
    density: { control: 'select', options: ['default', 'compact', 'comfortable'] },
    shape: { control: 'select', options: ['rounded', 'square', 'pill'] },
    elevation: { control: 'select', options: ['none', 'low', 'high'] },
    tone: { control: 'select', options: ['default', 'brand', 'success', 'warning', 'danger'] },
    validation: { control: 'select', options: ['none', 'success', 'warning', 'error'] },
    radius: { control: 'text' },
    optionBorder: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof Select>;
type StoryPaletteName = AccentPaletteName | 'purple';

const workflowOptions = [
  { value: "draft", label: "Draft" },
  { value: "review", label: "In review" },
  { value: "approved", label: "Approved" },
  { value: "published1", label: "Published1" },
  { value: "published2", label: "Published2" },
  { value: "published3", label: "Published3" },
  { value: "published4", label: "Published4" },
  { value: "published5", label: "Published5" },
  { value: "published6", label: "Published6" },
  { value: "published7", label: "Published7" },
  { value: "published8", label: "Published8" },
  { value: "published9", label: "Published9" },
  { value: "published10", label: "Published10" },
  { value: "published11", label: "Published11" },
  { value: "published12", label: "Published12" },
  { value: "published13", label: "Published13" },
  { value: "published14", label: "Published14" },
  { value: "published15", label: "Published15" },
  { value: "published16", label: "Published16" },
  { value: "published17", label: "Published17" },
  { value: "published18", label: "Published18" },
  { value: "published19", label: "Published19" },
  { value: "published20", label: "Published20" },
  { value: "published21", label: "Published21" },
  { value: "published22", label: "Published22" },
  { value: "published23", label: "Published23" },
  { value: "published24", label: "Published24" },
  { value: "published25", label: "Published25" },
] as const;

function TabButton(props: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      style={{
        appearance: 'none',
        border: 'none',
        borderBottom: props.active ? '3px solid var(--ui-color-primary, #2563eb)' : '3px solid transparent',
        background: 'transparent',
        color: props.active ? 'var(--ui-color-text, #0f172a)' : 'var(--ui-color-muted, #64748b)',
        padding: '14px 4px 12px',
        font: '600 15px/1.4 inherit',
        cursor: 'pointer',
      }}
    >
      {props.children}
    </button>
  );
}

function paletteTokens(name: StoryPaletteName) {
  if (name === 'purple') {
    return createThemeTokens(
      {
        colors: {
          primary: '#8b5cf6',
          primaryHover: '#7c3aed',
          focusRing: '#8b5cf6',
        },
        palette: {
          accent: {
            '1': '#fdfcff',
            '2': '#faf7ff',
            '3': '#f3ecff',
            '4': '#eadcff',
            '5': '#ddc7ff',
            '6': '#cdb0ff',
            '7': '#b693ff',
            '8': '#9b70ff',
            '9': '#8b5cf6',
            '10': '#7c3aed',
            '11': '#6d28d9',
            '12': '#2e1065',
          },
          accentAlpha: {
            '1': '#7c3aed03',
            '2': '#7c3aed08',
            '3': '#7c3aed14',
            '4': '#7c3aed24',
            '5': '#7c3aed38',
            '6': '#7c3aed4d',
            '7': '#7c3aed68',
            '8': '#7c3aed8f',
            '9': '#7c3aed',
            '10': '#6d28d9',
            '11': '#5b21b6',
            '12': '#2e1065',
          },
          accentContrast: '#ffffff',
          accentSurface: '#f5f0ffcc',
          accentIndicator: '#8b5cf6',
          accentTrack: '#8b5cf6',
        },
      } satisfies Partial<ThemeTokens>,
      { accentPalette: 'blue', mode: 'light' }
    );
  }

  return createThemeTokens({}, { accentPalette: name, mode: 'light' });
}

function SelectPreview(props: {
  variant: 'surface' | 'soft' | 'solid' | 'outline' | 'contrast';
  size: 'sm' | 'md' | 'lg' | '1' | '2' | '3';
  palette?: StoryPaletteName;
  elevation?: 'none' | 'low' | 'high';
  radius?: number | string;
  validation?: 'none' | 'success' | 'warning' | 'error';
  optionBorder?: boolean;
  label?: string;
  caption?: string;
  placeholder?: string;
  defaultValue?: string;
}) {
  const [value, setValue] = React.useState(props.defaultValue ?? 'review');

  const content = (
    <Grid style={{ gap: 12 }}>
      <Box
        style={{
          minHeight: 148,
          borderRadius: 16,
          border: '2px dashed color-mix(in srgb, var(--ui-color-primary, #2563eb) 30%, transparent)',
          background: 'linear-gradient(180deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 4%, white) 0%, color-mix(in srgb, var(--ui-color-primary, #2563eb) 2%, white) 100%)',
          display: 'grid',
          placeItems: 'center',
          padding: 20,
        }}
      >
        <Box style={{ width: 'min(280px, 100%)' }}>
          <Select
            label={props.label || 'Workflow status'}
            description="Open the menu to inspect option rendering."
            placeholder={props.placeholder || 'Choose a status'}
            value={value}
            onChange={setValue}
            variant={props.variant}
            size={props.size}
            elevation={props.elevation}
            radius={props.radius}
            validation={props.validation && props.validation !== 'none' ? props.validation : undefined}
            optionBorder={props.optionBorder}
          >
            {props.placeholder ? <option value="">{props.placeholder}</option> : null}
            {workflowOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Box>
      </Box>
      {props.caption ? <div style={{ fontSize: 13, color: '#64748b', textAlign: 'center' }}>{props.caption}</div> : null}
    </Grid>
  );

  if (!props.palette) return content;
  return <ThemeProvider tokens={paletteTokens(props.palette)}>{content}</ThemeProvider>;
}

function ThemeTokenMatrixStory() {
  const [tab, setTab] = React.useState<'theme' | 'colors' | 'sizes'>('theme');

  return (
    <Grid style={{ gap: 20, maxInlineSize: 1280 }}>
      <div>
        <div style={{ fontSize: 44, lineHeight: 1.05, fontWeight: 700, color: '#111827' }}>Select</div>
      </div>

      <Flex style={{ gap: 28, borderBottom: '1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 78%, transparent)' }}>
        <TabButton active={tab === 'theme'} onClick={() => setTab('theme')}>
          Theme colors
        </TabButton>
        <TabButton active={tab === 'colors'} onClick={() => setTab('colors')}>
          All colors
        </TabButton>
        <TabButton active={tab === 'sizes'} onClick={() => setTab('sizes')}>
          All sizes
        </TabButton>
      </Flex>

      {tab === 'theme' ? (
        <Grid style={{ gap: 22 }}>
          <Grid style={{ gridTemplateColumns: '120px repeat(4, minmax(240px, 1fr))', gap: 18, alignItems: 'start' }}>
            <div style={{ fontSize: 18, color: '#5b6574' }}>Surface</div>
            <SelectPreview variant="surface" size="md" elevation="low" palette="blue" />
            <SelectPreview variant="surface" size="md" elevation="low" palette="gray" />
            <SelectPreview variant="surface" size="md" elevation="low" palette="purple" />
            <SelectPreview variant="surface" size="md" elevation="low" palette="green" />

            <div style={{ fontSize: 18, color: '#5b6574' }}>Soft</div>
            <SelectPreview variant="soft" size="md" elevation="low" palette="blue" />
            <SelectPreview variant="soft" size="md" elevation="low" palette="gray" />
            <SelectPreview variant="soft" size="md" elevation="low" palette="purple" />
            <SelectPreview variant="soft" size="md" elevation="low" palette="green" />

            <div style={{ fontSize: 18, color: '#5b6574' }}>Solid</div>
            <SelectPreview variant="solid" size="md" elevation="low" palette="blue" />
            <SelectPreview variant="solid" size="md" elevation="low" palette="gray" />
            <SelectPreview variant="solid" size="md" elevation="low" palette="purple" />
            <SelectPreview variant="solid" size="md" elevation="low" palette="green" />

            <div style={{ fontSize: 18, color: '#5b6574' }}>Contrast</div>
            <SelectPreview variant="contrast" size="md" elevation="low" palette="blue" />
            <SelectPreview variant="contrast" size="md" elevation="low" palette="gray" />
            <SelectPreview variant="contrast" size="md" elevation="low" palette="purple" />
            <SelectPreview variant="contrast" size="md" elevation="low" palette="green" />
          </Grid>
        </Grid>
      ) : null}

      {tab === 'colors' ? (
        <Grid style={{ gap: 16 }}>
          <Grid style={{ gridTemplateColumns: '120px repeat(3, minmax(240px, 1fr))', gap: 18, alignItems: 'start' }}>
            <div />
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Surface</div>
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Soft</div>
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Solid</div>
            {(['gray', 'amber', 'red', 'purple', 'blue', 'green'] as const satisfies readonly StoryPaletteName[]).map((name) => (
              <React.Fragment key={name}>
                <div style={{ fontSize: 18, color: '#5b6574', textTransform: 'capitalize' }}>{name}</div>
                <SelectPreview variant="surface" size="md" elevation="low" palette={name} />
                <SelectPreview variant="soft" size="md" elevation="low" palette={name} />
                <SelectPreview variant="solid" size="md" elevation="low" palette={name} />
              </React.Fragment>
            ))}
          </Grid>
        </Grid>
      ) : null}

      {tab === 'sizes' ? (
        <Grid style={{ gap: 18 }}>
          <Grid style={{ gridTemplateColumns: '120px repeat(3, minmax(240px, 1fr))', gap: 18, alignItems: 'start' }}>
            <div />
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Surface</div>
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Soft</div>
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Solid</div>
            {(['1', '2', '3'] as const).map((size) => (
              <React.Fragment key={size}>
                <div style={{ fontSize: 18, color: '#5b6574' }}>Size {size}</div>
                <SelectPreview variant="surface" size={size} elevation="low" palette="blue" />
                <SelectPreview variant="soft" size={size} elevation="low" palette="blue" />
                <SelectPreview variant="solid" size={size} elevation="low" palette="blue" />
              </React.Fragment>
            ))}
          </Grid>
        </Grid>
      ) : null}
    </Grid>
  );
}

export const ThemeTokenMatrix: Story = {
  render: () => <ThemeTokenMatrixStory />,
};

export const Playground: Story = {
  render: (args) => {
    const [value, setValue] = React.useState(args.value || 'review');

    React.useEffect(() => {
      setValue(args.value || '');
    }, [args.value]);

    return (
      <Grid style={{ gap: 16, maxInlineSize: 1040 }}>
        <Card radius={18}>
          <CardHeader>
            <CardTitle>Production select surface</CardTitle>
            <CardDescription>
              Controlled wrapper around \`ui-select\` with theme-backed variants, sizing, validation, and option-surface styling.
            </CardDescription>
          </CardHeader>
          <Box slot="inset" style={{ padding: 16, display: 'grid', gap: 16 }}>
            <Box
              style={{
                minHeight: 220,
                borderRadius: 18,
                border: '2px dashed color-mix(in srgb, var(--ui-color-primary, #2563eb) 30%, transparent)',
                background: 'linear-gradient(180deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 4%, white) 0%, color-mix(in srgb, var(--ui-color-primary, #2563eb) 2%, white) 100%)',
                display: 'grid',
                placeItems: 'center',
                padding: 24,
              }}
            >
              <Box style={{ width: 'min(320px, 100%)' }}>
                <Select
                  {...args}
                  label="Workflow status"
                  description="Used by reviewers and publish automations."
                  value={value}
                  onChange={setValue}
                  validation={args.validation && args.validation !== 'none' ? args.validation : undefined}
                  radius={"4px"}
                >
                  {args.placeholder ? <option value="">{args.placeholder}</option> : null}
                  {workflowOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Box>
            </Box>

            <Flex align="center" justify="space-between" style={{ gap: 12, flexWrap: 'wrap' }}>
              <Flex align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
                <Button variant="secondary" onClick={() => setValue('draft')}>
                  Reset to draft
                </Button>
                <Badge tone="info">value: {value || 'placeholder'}</Badge>
              </Flex>
              <Badge tone="neutral">variant: {String(args.variant || 'classic')}</Badge>
            </Flex>
          </Box>
        </Card>
      </Grid>
    );
  },
};
`,ot=`import React, { useState } from 'react';
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
`,at=`import React from 'react';
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
`,nt=`import React, { useMemo, useState } from 'react';
import { createThemeTokens, withAccentPalette } from '@editora/ui-core';
import {
  BookIcon,
  BookmarkIcon,
  CreditCardIcon,
  DashboardIcon,
  DownloadIcon,
  FileIcon,
  FolderOpenIcon,
  HelpCircleIcon,
  HistoryIcon,
  ReceiptIcon,
  SearchIcon,
  SettingsIcon,
  SparklesIcon
} from '@editora/react-icons';
import {
  Box,
  Button,
  Flex,
  Grid,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarPromo,
  SidebarSearch,
  SidebarSearchInput,
  ThemeProvider
} from '@editora/ui-react';

export default {
  title: 'UI/Sidebar',
  component: Sidebar,
  argTypes: {
    collapsed: { control: 'boolean' },
    collapsible: { control: 'boolean' },
    resizable: { control: 'boolean' },
    variant: { control: 'select', options: ['surface', 'soft', 'floating', 'contrast', 'minimal', 'split'] },
    size: { control: 'select', options: ['sm', 'md', 'lg', '1', '2', '3'] },
    density: { control: 'select', options: ['compact', 'default', 'comfortable'] },
    tone: { control: 'select', options: ['default', 'brand', 'success', 'warning', 'danger'] },
    radius: { control: 'text' },
    elevation: { control: 'select', options: ['none', 'low', 'high'] }
  }
};

const operationsItems = [
  { section: 'Overview', value: 'home', label: 'Overview', icon: <DashboardIcon />, active: true, description: 'System status and KPIs' },
  { section: 'Overview', value: 'alerts', label: 'Alerts', badge: '5', tone: 'danger', description: 'Urgent incidents' },
  {
    section: 'Operations',
    value: 'orders',
    label: 'Orders',
    icon: <FolderOpenIcon />,
    children: [
      { value: 'pending', label: 'Pending approval', badge: '18' },
      { value: 'packed', label: 'Packed & staged' },
      { value: 'returns', label: 'Returns', tone: 'warning' }
    ]
  },
  { section: 'Operations', value: 'inventory', label: 'Inventory', description: 'Realtime stock health' },
  { section: 'Growth', value: 'campaigns', label: 'Campaigns', icon: <SparklesIcon /> },
  { section: 'Growth', value: 'audiences', label: 'Audiences' },
  { section: 'System', value: 'settings', label: 'Settings', icon: <SettingsIcon /> }
];

const premiumTokens = withAccentPalette(
  createThemeTokens({
    colors: {
      text: '#f7fbff',
      muted: '#9fb6d7',
      border: 'rgba(142, 197, 255, 0.18)',
      primary: '#0f68e8',
      primaryHover: '#0b58c8',
      foregroundOnPrimary: '#ffffff'
    },
    surfaces: {
      panel: 'rgba(10, 28, 58, 0.82)',
      panelSolid: '#0c2447'
    },
    components: {
      sidebar: {
        bg: 'linear-gradient(180deg, rgba(5, 24, 50, 0.96), rgba(11, 39, 76, 0.92))',
        border: '1px solid rgba(143, 196, 255, 0.12)',
        radius: '26px',
        shadow: '0 36px 68px rgba(2, 12, 30, 0.42)',
        padding: '18px',
        gap: '14px',
        'item-radius': '16px',
        'item-height': '54px',
        'item-padding-x': '16px',
        'item-padding-y': '12px',
        'item-gap': '14px',
        'item-font-size': '16px',
        'item-line-height': '24px',
        'submenu-indent': '20px',
        'promo-radius': '20px',
        'promo-padding': '22px'
      }
    }
  }),
  'blue'
);

const pageFrameStyle: React.CSSProperties = {
  padding: 24,
  borderRadius: 32,
  minHeight: 820,
  background:
    'radial-gradient(circle at 72% 18%, rgba(25, 122, 255, 0.22), transparent 28%), linear-gradient(180deg, #04162f 0%, #0a2446 48%, #0b2c56 100%)'
};

const previewShellStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr)',
  minHeight: 760,
  gap: 18
};

function PremiumPromoCard() {
  return (
    <div
      style={{
        padding: 22,
        borderRadius: 20,
        background: 'linear-gradient(140deg, rgba(16, 96, 226, 0.96), rgba(98, 154, 255, 0.42))',
        color: '#ffffff',
        display: 'grid',
        gap: 18,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)'
      }}
    >
      <div style={{ display: 'grid', gap: 10 }}>
        <div style={{ fontSize: 18, lineHeight: '1.25', fontWeight: 800 }}>Upgrade to Premium</div>
        <div style={{ fontSize: 14, lineHeight: '1.55', color: 'rgba(255,255,255,0.82)' }}>
          Unlock unlimited reading and offline access across your whole library.
        </div>
      </div>
      <Button recipe="solid" scale="2" radius={4} style={{ width: '100%' }}>
        Upgrade Now
      </Button>
    </div>
  );
}

function PremiumSidebarStructure({
  value
}: {
  value: string;
}) {
  return (
    <>
      <SidebarHeader>
        <Flex align="center" gap="12px" style={{ color: '#ffffff', fontWeight: 900, fontSize: 21 }}>
          <span
            style={{
              display: 'inline-grid',
              placeItems: 'center',
              width: 38,
              height: 38,
              borderRadius: 4,
              background: 'rgba(255,255,255,0.1)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)'
            }}
          >
            <BookIcon width={22} height={22} />
          </span>
          <span>Publify</span>
        </Flex>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup title="Library">
          <SidebarItem value="dashboard" label="Dashboard" icon={<DashboardIcon />} active={value === 'dashboard'} />
          <SidebarItem value="library" label="My Library" icon={<FolderOpenIcon />} active={value === 'library'} />
          <SidebarItem value="books" label="Books" icon={<BookIcon />} active={value === 'books'} />
          <SidebarItem value="magazines" label="Magazines" icon={<FileIcon />} active={value === 'magazines'}>
            <SidebarItem value="editorial" label="Editorial picks" description="Weekly hand-picked reads" />
            <SidebarItem value="trending" label="Trending now" description="Most opened this week" />
            <SidebarItem value="collections" href="#collections">
              <span>Collections</span>
              <span>Curated reading lists</span>
            </SidebarItem>
          </SidebarItem>
          <SidebarItem value="bookmarks" label="Bookmarks" icon={<BookmarkIcon />} active={value === 'bookmarks'} />
          <SidebarItem value="history" label="Reading History" icon={<HistoryIcon />} active={value === 'history'} />
        </SidebarGroup>
        <SidebarGroup title="Account">
          <SidebarItem value="subscription" label="Subscription" icon={<CreditCardIcon />} active={value === 'subscription'} />
          <SidebarItem value="downloads" label="Downloads" icon={<DownloadIcon />} active={value === 'downloads'} />
          <SidebarItem value="payments" label="Payments" icon={<ReceiptIcon />} active={value === 'payments'} />
          <SidebarItem value="settings" label="Settings" icon={<SettingsIcon />} active={value === 'settings'}>
            <SidebarItem value="preferences" label="Preferences" />
            <SidebarItem value="devices" label="Devices" />
            <SidebarItem value="security" label="Security" />
          </SidebarItem>
          <SidebarItem value="support" label="Help & Support" icon={<HelpCircleIcon />} active={value === 'support'} />
        </SidebarGroup>
      </SidebarContent>
      <SidebarPromo>
        <PremiumPromoCard />
      </SidebarPromo>
      <SidebarFooter>
        <div style={{ color: 'rgba(255,255,255,0.72)' }}>Signed in as premium@publify.app</div>
      </SidebarFooter>
    </>
  );
}

export const PremiumReadingShell = (args: any) => {
  const [value, setValue] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ThemeProvider tokens={premiumTokens} storageKey={null}>
      <div style={pageFrameStyle}>
        <div style={previewShellStyle}>
          <Sidebar
            {...args}
            value={value}
            collapsed={collapsed}
            onSelect={(detail) => setValue(detail.value)}
            onToggle={setCollapsed}
            collapsible
            resizable
            variant="contrast"
            tone="brand"
            size="sm"
            itemFontSize={12}
          >
            <PremiumSidebarStructure value={value} />
          </Sidebar>

          <div
            style={{
              minHeight: 760,
              borderRadius: 28,
              border: "1px solid rgba(158, 197, 255, 0.16)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
              padding: 26,
              color: "#f7fbff",
            }}
          >
            <div style={{ display: "grid", gap: 12, maxWidth: 720 }}>
              <div
                style={{
                  fontSize: 14,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.54)",
                }}
              >
                Reading dashboard
              </div>
              <div style={{ fontSize: 40, lineHeight: 1.05, fontWeight: 900 }}>
                Sidebar-driven premium shell
              </div>
              <div
                style={{
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.78)",
                }}
              >
                The sidebar keeps the reading app navigation structured with
                grouped links, expandable subsections, and a dedicated promo
                rail without sacrificing keyboard support or resize persistence.
              </div>
              <Flex gap="10px" wrap="wrap">
                <Button recipe="solid" scale="2" radius={14}>
                  Open active module
                </Button>
                <Button
                  recipe="surface"
                  scale="2"
                  radius={14}
                  onClick={() => setCollapsed((current) => !current)}
                >
                  {collapsed ? "Expand sidebar" : "Collapse sidebar"}
                </Button>
              </Flex>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

PremiumReadingShell.parameters = {
  controls: { exclude: ['children'] }
};

export const OperationsWorkspace = () => {
  const [value, setValue] = useState('home');
  const items = useMemo(
    () => operationsItems.map((item) => ({ ...item, active: item.value === value })),
    [value]
  );

  return (
    <Grid columns="auto minmax(0, 1fr)" style={{ minHeight: 620, border: '1px solid var(--ui-color-border, #d6dce6)', borderRadius: 28, overflow: 'hidden' }}>
      <Sidebar
        items={items}
        value={value}
        onSelect={(detail) => setValue(detail.value)}
        collapsible
        resizable
        variant="surface"
      >
        <SidebarHeader>
          <Flex align="center" justify="space-between" style={{ fontWeight: 800, fontSize: 18 }}>
          <span>Operations Hub</span>
          <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>24/7</Box>
          </Flex>
        </SidebarHeader>
        <SidebarSearchInput
          placeholder="Search orders, audiences, incidents…"
          icon={<SearchIcon width={16} height={16} />}
        />
        <SidebarPromo>
          <Box
          style={{
            borderRadius: 18,
            padding: 18,
            background: 'linear-gradient(140deg, color-mix(in srgb, var(--ui-color-primary) 92%, #1d4ed8 8%), color-mix(in srgb, var(--ui-color-primary) 22%, #ffffff 78%))',
            color: '#ffffff',
            display: 'grid',
            gap: 12
          }}
        >
            <Flex align="center" gap="8px" style={{ fontWeight: 800 }}>
              <SparklesIcon width={16} height={16} />
              <strong>Quarter-end launch</strong>
            </Flex>
          <span style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>Review every open operational blocker before the release checklist closes.</span>
        </Box>
        </SidebarPromo>
      </Sidebar>

      <Box p="24px" style={{ background: 'var(--ui-color-surface-alt, #f8fafc)' }}>
        <div style={{ display: 'grid', gap: 10, maxWidth: 760 }}>
          <div style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ui-color-muted, #64748b)' }}>
            Selected module
          </div>
          <div style={{ fontSize: 34, lineHeight: 1.08, fontWeight: 900 }}>{value}</div>
          <div style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--ui-color-muted, #64748b)' }}>
            Light theme application shell with nested operations routes, inline promo card, and search/header/footer regions.
          </div>
        </div>
      </Box>
    </Grid>
  );
};

export const VariantGallery = () => {
  const rows = ['surface', 'soft', 'floating', 'contrast', 'minimal'] as const;
  return (
    <div style={{ display: 'grid', gap: 18 }}>
      {rows.map((variant) => (
          <div key={variant} style={{ display: 'grid', gridTemplateColumns: '120px auto', alignItems: 'start', gap: 18 }}>
          <div style={{ fontWeight: 800, textTransform: 'capitalize' }}>{variant}</div>
          <Sidebar
            items={operationsItems.slice(0, 4)}
            variant={variant}
            style={{ height: 340 }}
          >
            <Box slot="header" style={{ fontWeight: 800 }}>Shell</Box>
          </Sidebar>
        </div>
      ))}
    </div>
  );
};

export const SizeAndDensityGallery = () => (
  <div style={{ display: 'grid', gap: 18 }}>
    {(['sm', 'md', 'lg'] as const).map((size) => (
      <div key={size} style={{ display: 'grid', gridTemplateColumns: '120px auto auto', gap: 18, alignItems: 'start' }}>
        <div style={{ fontWeight: 800, textTransform: 'uppercase' }}>{size}</div>
        <Sidebar items={operationsItems.slice(0, 4)} size={size} density="compact" style={{ height: 300 }} />
        <Sidebar items={operationsItems.slice(0, 4)} size={size} density="comfortable" style={{ height: 300 }} />
      </div>
    ))}
  </div>
);

export const NavigationLinksAndCustomContent = () => {
  const [value, setValue] = useState('dashboard');

  return (
    <Grid
      columns="auto minmax(0, 1fr)"
      style={{
        minHeight: 640,
        border: '1px solid var(--ui-color-border, #d6dce6)',
        borderRadius: 28,
        overflow: 'hidden',
        background: 'var(--ui-color-surface-alt, #f8fafc)'
      }}
    >
      <Sidebar
        value={value}
        onSelect={(detail) => setValue(detail.value)}
        collapsible
        resizable
        sectionLabelTransform="none"
      >
        <SidebarHeader>
          <Flex align="center" justify="space-between" style={{ fontWeight: 800, fontSize: 18 }}>
            <span>Product docs</span>
            <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>v4.2</Box>
          </Flex>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup title="Getting started">
            <SidebarItem value="dashboard" label="Overview" icon={<DashboardIcon />} href="#overview" active={value === 'dashboard'} />
            <SidebarItem value="guides" href="#guides">
              <BookIcon />
              <span>Guides</span>
              <span>Patterns, conventions, and implementation notes</span>
            </SidebarItem>
            <SidebarItem value="components" label="Components" icon={<FolderOpenIcon />}>
              <SidebarItem value="navigation" label="Navigation" href="#navigation" />
              <SidebarItem value="feedback" label="Feedback" href="#feedback" />
              <SidebarItem value="data-entry" label="Data entry" href="#data-entry" />
            </SidebarItem>
          </SidebarGroup>
          <SidebarGroup title="Resources">
            <SidebarItem value="releases" label="Release notes" icon={<SparklesIcon />} href="#releases" />
            <SidebarItem value="support" label="Help & Support" icon={<HelpCircleIcon />} href="#support" />
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div style={{ color: 'var(--ui-color-muted, #64748b)' }}>Links use real anchor navigation and still emit sidebar selection.</div>
        </SidebarFooter>
      </Sidebar>

      <Box p="28px" style={{ display: 'grid', gap: 14, alignContent: 'start' }}>
        <div style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ui-color-muted, #64748b)' }}>
          Current selection
        </div>
        <div style={{ fontSize: 34, lineHeight: 1.05, fontWeight: 900 }}>{value}</div>
        <div style={{ maxWidth: 720, fontSize: 16, lineHeight: 1.7, color: 'var(--ui-color-muted, #64748b)' }}>
          This story demonstrates two new sidebar capabilities: leaf items can be real links through <code>href</code>, and display content can be authored directly inside <code>SidebarItem</code> instead of relying only on <code>label</code> and <code>description</code>.
        </div>
        <Box
          style={{
            padding: 18,
            borderRadius: 18,
            border: '1px solid color-mix(in srgb, var(--ui-color-primary, #2563eb) 12%, transparent)',
            background: 'color-mix(in srgb, var(--ui-color-primary, #2563eb) 4%, var(--color-panel-solid, #ffffff))'
          }}
        >
          <div style={{ fontWeight: 800, marginBottom: 8 }}>API example</div>
          <pre
            style={{
              margin: 0,
              whiteSpace: 'pre-wrap',
              fontSize: 13,
              lineHeight: 1.55,
              color: 'var(--ui-color-text, #202020)'
            }}
          >{\`<SidebarItem value="guides" href="#guides">
  <BookIcon />
  <span>Guides</span>
  <span>Patterns, conventions, and implementation notes</span>
</SidebarItem>\`}</pre>
        </Box>
        <Box
          style={{
            padding: 18,
            borderRadius: 18,
            border: '1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 84%, transparent)',
            background: 'var(--color-panel-solid, #ffffff)',
            display: 'grid',
            gap: 10
          }}
        >
          <div style={{ fontWeight: 800 }}>What this demo covers</div>
          <div style={{ color: 'var(--ui-color-muted, #64748b)', lineHeight: 1.65 }}>
            Link rows keep anchor navigation semantics, custom leading icons can be authored directly in the item body, and nested submenu sections animate open and closed instead of snapping.
          </div>
        </Box>
      </Box>
    </Grid>
  );
};

export const SectionLabelTransformGallery = () => (
  <Grid columns="repeat(3, minmax(0, 1fr))" style={{ gap: 18, alignItems: 'start' }}>
    {([
      { title: 'Uppercase', transform: 'uppercase' as const },
      { title: 'None', transform: 'none' as const },
      { title: 'Capitalize', transform: 'capitalize' as const }
    ]).map((example) => (
      <div
        key={example.transform}
        style={{
          display: 'grid',
          gap: 14
        }}
      >
        <div style={{ fontWeight: 800 }}>{example.title}</div>
        <Sidebar
          variant="surface"
          sectionLabelTransform={example.transform}
          style={{ height: 360 }}
        >
          <SidebarHeader>
            <Flex align="center" justify="space-between" style={{ fontWeight: 800 }}>
              <span>Sidebar labels</span>
              <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>{example.transform}</Box>
            </Flex>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup title="Primary navigation">
              <SidebarItem value="overview" label="Overview" icon={<DashboardIcon />} />
              <SidebarItem value="reading" icon={<BookIcon />}>
                <span>Reading lists</span>
                <span>Custom content rendered inside the row</span>
              </SidebarItem>
            </SidebarGroup>
            <SidebarGroup title="Account settings">
              <SidebarItem value="billing" label="Billing" icon={<CreditCardIcon />} />
              <SidebarItem value="preferences" label="Preferences" icon={<SettingsIcon />} />
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </div>
    ))}
  </Grid>
);

export const SubmenuMotionAndCustomIcons = () => {
  const [value, setValue] = useState('overview');

  return (
    <Grid
      columns="auto minmax(0, 1fr)"
      style={{
        minHeight: 620,
        border: '1px solid var(--ui-color-border, #d6dce6)',
        borderRadius: 28,
        overflow: 'hidden',
        background: 'linear-gradient(180deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 3%, #ffffff), #f8fafc)'
      }}
    >
      <Sidebar
        value={value}
        onSelect={(detail) => setValue(detail.value)}
        variant="soft"
        sectionLabelTransform="capitalize"
      >
        <SidebarHeader>
          <Flex align="center" justify="space-between" style={{ fontWeight: 800, fontSize: 18 }}>
            <span>Docs navigation</span>
            <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>animated</Box>
          </Flex>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup title="Core guides">
            <SidebarItem value="overview" href="#overview">
              <DashboardIcon />
              <span>Overview</span>
              <span>Entry points, architecture, and release notes</span>
            </SidebarItem>
            <SidebarItem value="patterns">
              <BookIcon />
              <span>Patterns</span>
              <span>Open this item to preview submenu motion</span>
              <SidebarItem value="forms" href="#forms" label="Forms" />
              <SidebarItem value="navigation" href="#navigation" label="Navigation" />
              <SidebarItem value="feedback" href="#feedback" label="Feedback" />
            </SidebarItem>
            <SidebarItem value="tooling" href="#tooling">
              <SparklesIcon />
              <span>Tooling</span>
              <span>Storybook, E2E, and docs automation</span>
            </SidebarItem>
          </SidebarGroup>
          <SidebarGroup title="Support links">
            <SidebarItem value="account" href="#account" icon={<CreditCardIcon />} label="Account" />
            <SidebarItem value="support" href="#support" icon={<HelpCircleIcon />} label="Help & Support" />
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <Box p="28px" style={{ display: 'grid', gap: 16, alignContent: 'start' }}>
        <div style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ui-color-muted, #64748b)' }}>
          Demo focus
        </div>
        <div style={{ fontSize: 34, lineHeight: 1.05, fontWeight: 900 }}>Animated submenus and icon-as-child rows</div>
        <div style={{ maxWidth: 720, fontSize: 16, lineHeight: 1.7, color: 'var(--ui-color-muted, #64748b)' }}>
          This example is tuned for visual review. Open the “Patterns” group to inspect the submenu transition, and check that icon spacing remains correct even when icons are authored directly as children inside each <code>SidebarItem</code>.
        </div>
      </Box>
    </Grid>
  );
};
`,rt=`import React from 'react';
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
`,it=`import React from 'react';
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
`,st=`import React, { useEffect, useRef, useState } from 'react';
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
`,lt=`import React from 'react';
import { Box, SplitButton } from '@editora/ui-react';
import {
  ShowcasePage,
  ShowcaseSection,
  showcaseCaptionStyle,
  showcaseChipRowStyle,
  showcaseChipStyle,
  showcaseMonoStyle,
  showcasePanelStyle
} from './storybook-showcase';

export default {
  title: 'UI/SplitButton',
  component: SplitButton
};

function ActionEcho({ value }: { value: string }) {
  return (
    <div style={{ ...showcasePanelStyle, gap: 8 }}>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
        Last action
      </div>
      <div style={{ fontSize: 15, color: '#0f172a' }}>
        <code style={showcaseMonoStyle}>{value || '(none)'}</code>
      </div>
    </div>
  );
}

function baseItems() {
  return [
    {
      value: 'schedule',
      label: 'Schedule publish',
      description: 'Queue this update for the next release window.',
      shortcut: '⌘K' as const
    },
    {
      value: 'duplicate',
      label: 'Duplicate release',
      description: 'Fork the current draft into a new release candidate.'
    },
    {
      value: 'archive',
      label: 'Archive draft',
      description: 'Remove the draft from the active publishing queue.'
    }
  ];
}

export const WorkspaceActions = () => {
  const [selected, setSelected] = React.useState('');
  return (
    <ShowcasePage
      eyebrow="Primary Pattern"
      title="Split button with a clear primary action and an attached command menu"
      description="The trigger should feel decisive, while the menu reads like the same product family rather than a generic dropdown bolted onto the side."
      meta={[
        { label: 'Variant', value: 'Primary' },
        { label: 'Density', value: 'Comfortable' },
        { label: 'Menu', value: 'Attached surface', tone: 'success' }
      ]}
    >
      <ShowcaseSection
        eyebrow="Workspace Actions"
        title="Release workflow"
        description="This is the baseline production pattern for publish flows, approvals, and workspace actions that have one dominant path plus a few adjacent commands."
      >
        <Box style={{ display: 'grid', gap: 16, maxWidth: 560 }}>
          <div style={showcaseChipRowStyle}>
            <span style={showcaseChipStyle}>Primary emphasis</span>
            <span style={showcaseChipStyle}>Attached menu</span>
            <span style={showcaseChipStyle}>Shortcut support</span>
          </div>
          <SplitButton
            label="Publish update"
            menuHeading="Publish workflow"
            menuDescription="Choose the next release action without leaving the editor."
            items={baseItems()}
            onSelect={(detail) => setSelected(detail.value || '')}
          />
          <p style={showcaseCaptionStyle}>
            Use this treatment when one action should carry most of the visual weight and the alternates are secondary.
          </p>
          <ActionEcho value={selected} />
        </Box>
      </ShowcaseSection>
    </ShowcasePage>
  );
};

export const NeutralToolbar = () => {
  const [selected, setSelected] = React.useState('');
  return (
    <ShowcaseSection
      eyebrow="Neutral Toolbar"
      title="Low-emphasis split action"
      description="A flatter, quieter shell for inspector panels, rails, and dense application chrome where the control still needs menu affordance without dominating the layout."
    >
      <Box style={{ display: 'grid', gap: 16, maxWidth: 580 }}>
        <SplitButton
          label="Create issue"
          menuHeading="Issue actions"
          menuDescription="Use the primary action for a standard issue or switch to an alternate workflow."
          variant="neutral"
          items={[
            {
              value: 'bug',
              label: 'Create bug',
              description: 'Capture a defect with triage defaults.',
              shortcut: 'B'
            },
            {
              value: 'incident',
              label: 'Create incident',
              description: 'Open a high-priority incident workflow.',
              shortcut: 'I'
            },
            {
              value: 'followup',
              label: 'Create follow-up',
              description: 'Spawn a linked task after a review.'
            }
          ]}
          onSelect={(detail) => setSelected(detail.value || '')}
        />
        <ActionEcho value={selected} />
      </Box>
    </ShowcaseSection>
  );
};

export const DestructiveReview = () => {
  const [selected, setSelected] = React.useState('');
  return (
    <ShowcaseSection
      eyebrow="Decision Pattern"
      title="High-contrast split action"
      description="A stronger treatment for review or approval flows where the primary action needs confidence but dangerous alternatives must still remain visible and well-separated."
    >
      <Box style={{ display: 'grid', gap: 16, maxWidth: 580 }}>
        <SplitButton
          label="Resolve request"
          menuHeading="Review decision"
          menuDescription="Promote the approved path as primary and keep destructive actions clearly separated."
          variant="contrast"
          items={[
            {
              value: 'approve',
              label: 'Approve and close',
              description: 'Complete the review and notify stakeholders.',
              shortcut: '↵'
            },
            {
              value: 'request-changes',
              label: 'Request changes',
              description: 'Send the item back with actionable feedback.'
            },
            {
              value: 'reject',
              label: 'Reject request',
              description: 'Permanently reject this submission.',
              tone: 'danger',
              shortcut: '⌥⌫'
            }
          ]}
          onSelect={(detail) => setSelected(detail.value || '')}
        />
        <ActionEcho value={selected} />
      </Box>
    </ShowcaseSection>
  );
};

export const CompactUtilityRail = () => {
  const [selected, setSelected] = React.useState('');
  return (
    <ShowcaseSection
      eyebrow="Compact Rail"
      title="Dense utility action"
      description="Compact density should still preserve touch targets, shortcut legibility, and menu rhythm. This variation exists for side rails and analytics toolbars."
    >
      <Box style={{ display: 'grid', gap: 16, maxWidth: 540 }}>
        <SplitButton
          label="Export"
          menuHeading="Export format"
          menuDescription="Compact treatment for dense toolbars and admin rails."
          density="compact"
          items={[
            {
              value: 'pdf',
              label: 'Export as PDF',
              description: 'Print-friendly shareable document.',
              shortcut: 'P'
            },
            {
              value: 'csv',
              label: 'Export as CSV',
              description: 'Structured data for spreadsheets.'
            },
            {
              value: 'json',
              label: 'Export as JSON',
              description: 'Raw system payload for integrations.'
            }
          ]}
          onSelect={(detail) => setSelected(detail.value || '')}
        />
        <ActionEcho value={selected} />
      </Box>
    </ShowcaseSection>
  );
};

export const FlatActions = () => {
  const [selected, setSelected] = React.useState('');
  return (
    <ShowcaseSection
      eyebrow="Flat Pattern"
      title="Low-radius, low-chrome split action"
      description="This is the flatter product language for tables, editors, and admin workspaces where the control should feel integrated into the surrounding frame instead of elevated above it."
    >
      <Box style={{ display: 'grid', gap: 16, maxWidth: 580 }}>
        <SplitButton
          label="Save changes"
          menuHeading="Save options"
          menuDescription="Flat treatment for dense productivity views and inspector panels."
          variant="flat"
          menuShape="flat"
          items={[
            {
              value: 'save',
              label: 'Save now',
              description: 'Persist current changes immediately.',
              shortcut: '⌘S'
            },
            {
              value: 'save-close',
              label: 'Save and close',
              description: 'Commit and return to the list view.'
            },
            {
              value: 'discard',
              label: 'Discard draft',
              description: 'Revert unpublished local changes.',
              tone: 'danger'
            }
          ]}
          onSelect={(detail) => setSelected(detail.value || '')}
        />
        <ActionEcho value={selected} />
      </Box>
    </ShowcaseSection>
  );
};

export const MenuListboxVariations = () => {
  const [selected, setSelected] = React.useState('');
  return (
    <ShowcaseSection
      eyebrow="Menu Rhythm"
      title="Listbox density variations"
      description="The menu should scale across flat, standard, and premium surfaces without breaking the relationship between button shell and menu content."
    >
      <Box style={{ display: 'grid', gap: 20 }}>
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          <Box style={{ display: 'grid', gap: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>Flat</div>
            <p style={showcaseCaptionStyle}>Tight list density for flatter workhorse layouts.</p>
            <SplitButton
              label="Flat menu"
              menuHeading="Flat commands"
              menuDescription="Tight, low-noise listbox treatment."
              variant="flat"
              menuDensity="compact"
              menuShape="flat"
              items={baseItems()}
              onSelect={(detail) => setSelected(detail.value || '')}
            />
          </Box>

          <Box style={{ display: 'grid', gap: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>Comfortable</div>
            <p style={showcaseCaptionStyle}>Balanced default for most dashboard and editor surfaces.</p>
            <SplitButton
              label="Comfortable menu"
              menuHeading="Comfortable commands"
              menuDescription="Balanced default for most app surfaces."
              items={baseItems()}
              onSelect={(detail) => setSelected(detail.value || '')}
            />
          </Box>

          <Box style={{ display: 'grid', gap: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>Airy</div>
            <p style={showcaseCaptionStyle}>Looser spacing for premium actions and lower-frequency menus.</p>
            <SplitButton
              label="Airy menu"
              menuHeading="Airy commands"
              menuDescription="Looser listbox rhythm for premium dashboard actions."
              menuDensity="airy"
              menuShape="soft"
              items={baseItems()}
              onSelect={(detail) => setSelected(detail.value || '')}
            />
          </Box>
        </div>
        <ActionEcho value={selected} />
      </Box>
    </ShowcaseSection>
  );
};
`,dt=`import React from 'react';
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
`,ct=`import React from 'react';
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
`,pt=`import React from 'react';
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
`,ut=`import React from 'react';
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
`,mt=`import React, { useState } from 'react';
import { Box, Grid, TagsInput } from '@editora/ui-react';

export default {
  title: 'UI/TagsInput',
  component: TagsInput,
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    placeholder: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    counter: { control: 'boolean' },
    maxTags: { control: 'number' },
    allowDuplicates: { control: 'boolean' },
    addOnBlur: { control: 'boolean' }
  }
};

export const Playground = (args: any) => {
  const [value, setValue] = useState<string[]>(['design', 'ops']);
  return (
    <Box style={{ maxWidth: 560 }}>
      <TagsInput {...args} value={value} onChange={setValue} />
    </Box>
  );
};

Playground.args = {
  label: 'Owners',
  description: 'Add recipients, labels, or reviewer groups.',
  placeholder: 'Add an owner',
  required: false,
  disabled: false,
  readOnly: false,
  counter: true,
  maxTags: 6,
  allowDuplicates: false,
  addOnBlur: true
};

export const ProductionPatterns = () => {
  const [reviewers, setReviewers] = useState(['ops', 'security', 'platform']);
  const [filters, setFilters] = useState(['p0', 'incident', 'customer-visible']);

  return (
    <Grid style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(2, minmax(280px, 1fr))' }}>
      <TagsInput
        label="Incident reviewers"
        description="Fast keyboard entry for multi-owner assignment."
        value={reviewers}
        onChange={setReviewers}
        maxTags={8}
        counter
        addOnBlur
      />
      <TagsInput
        label="Saved search filters"
        description="Tokenized filters without dropdown dependence."
        value={filters}
        onChange={setFilters}
        counter
      />
    </Grid>
  );
};
`,gt=`import React from 'react';
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
`,ft=`import React from 'react';
import type { Meta } from '@storybook/react';
import { ThemeProvider, useTheme, Button , Box} from '@editora/ui-react';

const meta: Meta = {
  title: 'UI/Theming',
  argTypes: {
    primary: { control: 'color' },
    background: { control: 'color' },
    text: { control: 'color' },
    radius: { control: 'text' },
    fontSizeMd: { control: 'text' }
  }
};

export default meta;

function Demo() {
  const theme = useTheme() as any;
  const setTokens = theme?.setTokens || (() => {});
  const tokens = theme?.tokens;
  const safeTokens = tokens || {
    colors: { primary: '#2563eb', background: '#ffffff', text: '#111827' }
  };
  const toggle = () => {
    const dark = safeTokens.colors.background === '#111827';
    setTokens({
      ...safeTokens,
      colors: dark
        ? { ...safeTokens.colors, background: '#ffffff', text: '#111827', primary: '#2563eb' }
        : { ...safeTokens.colors, background: '#111827', text: '#f8fafc', primary: '#7c3aed' }
    });
  };
  return (
    <Box style={{ padding: 20, background: 'var(--ui-color-background)', color: 'var(--ui-color-text)' }}>
      <h3>Theme demo</h3>
      <p>Primary color token: <strong style={{ color: 'var(--ui-color-primary)' }}>{safeTokens.colors.primary}</strong></p>
      <Button onClick={toggle}>Toggle theme</Button>
    </Box>
  );
}

export const Interactive = (args: any = {}) => (
  <ThemeProvider tokens={{ colors: { primary: args.primary || '#2563eb', background: args.background || '#ffffff', text: args.text || '#111827' }, radius: args.radius || '6px', typography: { size: { md: args.fontSizeMd || '14px' } } }}>
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
Default.parameters = { controls: { hideNoControlsWarning: true } };
`,ht=`import React from 'react';
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
`,yt=`import type { Meta, StoryObj } from "@storybook/react";
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
`,vt=`import type { Meta, StoryObj } from '@storybook/react';
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
`,bt=`import React from 'react';
import { Button, toast, toastApi, ToastProvider, useToast, Flex } from '@editora/ui-react';

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

function ProviderDemoInner() {
  const notifications = useToast();
  return (
    <Flex style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Button onClick={() => notifications.success('Policy saved')}>useToast().success</Button>
      <Button variant="secondary" onClick={() => notifications.loading('Uploading assets')}>
        useToast().loading
      </Button>
    </Flex>
  );
}

export const ProviderPattern = () => (
  <ToastProvider config={{ position: 'bottom-right', theme: 'glass' }}>
    <ProviderDemoInner />
  </ToastProvider>
);
`,xt=`import React from 'react';
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
`,St=`import React from 'react';
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
`,Bt=`import React from 'react';
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
`,wt=`import React from 'react';
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
`,Ct=`import React from 'react';
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
`,kt=`import React from 'react';
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
`,Tt=`import React from 'react';
import { Box, TransferList } from '@editora/ui-react';

export default {
  title: 'UI/TransferList',
  component: TransferList
};

export const RoleMapping = () => {
  const [value, setValue] = React.useState<string[]>(['read']);
  return (
    <Box style={{ maxWidth: 860 }}>
      <TransferList
        label="Workspace permissions"
        description="Move permissions into the selected column to grant them."
        value={value}
        onValueChange={setValue}
        options={[
          { value: 'read', label: 'Read', description: 'View records and reports.' },
          { value: 'write', label: 'Write', description: 'Create and edit content.' },
          { value: 'export', label: 'Export', description: 'Download audit and CSV exports.' },
          { value: 'admin', label: 'Admin', description: 'Manage workspace configuration.' }
        ]}
      />
    </Box>
  );
};
`,zt=`import React, { useState } from 'react';
import { Box, Grid, Tree, TreeItem } from '@editora/ui-react';

export default {
  title: 'UI/Tree',
  component: Tree
};

export const Explorer = () => {
  const [value, setValue] = useState('button');

  return (
    <Grid columns="320px 1fr" gap="16px" style={{ minHeight: 420 }}>
      <Tree
        value={value}
        indentSize="14px"
        onSelect={(detail) => setValue(detail.value)}
        style={{ minHeight: 360 }}
      >
        <TreeItem value="src" label="src" expanded>
          <TreeItem value="components" label="components" expanded>
            <TreeItem value="button" label="button.tsx" />
            <TreeItem value="dialog" label="dialog.tsx" />
            <TreeItem value="tree" label="tree.tsx" />
          </TreeItem>
          <TreeItem value="hooks" label="hooks" expanded>
            <TreeItem value="use-floating" label="useFloating.ts" />
            <TreeItem value="use-theme" label="useTheme.ts" />
          </TreeItem>
        </TreeItem>
        <TreeItem value="docs" label="docs" expanded>
          <TreeItem value="changelog" label="changelog.md" />
          <TreeItem value="roadmap" label="roadmap.md" />
        </TreeItem>
      </Tree>

      <Box
        style={{
          border: '1px solid var(--ui-color-border, #cbd5e1)',
          borderRadius: 'var(--ui-radius, 12px)',
          padding: 16,
          background: 'var(--ui-color-surface, #ffffff)'
        }}
      >
        <strong>Selected node</strong>
        <Box style={{ marginTop: 8, color: 'var(--ui-color-muted, #64748b)' }}>{value}</Box>
        <Box style={{ marginTop: 12, color: 'var(--ui-color-muted, #64748b)' }}>
          Production-style explorer navigation with nested groups, roving focus, expand/collapse arrows, and typeahead.
        </Box>
      </Box>
    </Grid>
  );
};
`,Pt=`import React from 'react';
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
`,Rt=`import React from 'react';
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
`,It=Object.assign({"./stories/AISaaSDashboard.stories.tsx":k,"./stories/Accordion.stories.tsx":T,"./stories/AdminVisualRegression.stories.tsx":z,"./stories/Alert.stories.tsx":P,"./stories/AlertDialog.stories.tsx":R,"./stories/AlertDialogPromise.stories.tsx":I,"./stories/AppHeader.stories.tsx":A,"./stories/ApprovalWorkflowScenario.stories.tsx":F,"./stories/AspectRatio.stories.tsx":G,"./stories/Avatar.stories.tsx":D,"./stories/Badge.stories.tsx":M,"./stories/BlockControls.stories.tsx":E,"./stories/Box.stories.tsx":O,"./stories/Breadcrumb.stories.tsx":L,"./stories/Button.stories.tsx":_,"./stories/ButtonMatrix.stories.tsx":W,"./stories/Calendar.stories.tsx":H,"./stories/Card.stories.tsx":N,"./stories/Chart.stories.tsx":V,"./stories/Checkbox.stories.tsx":U,"./stories/Collapsible.stories.tsx":q,"./stories/ColorPicker.stories.tsx":j,"./stories/Combobox.stories.tsx":$,"./stories/Command.stories.tsx":Q,"./stories/CommandPalette.stories.tsx":Z,"./stories/Container.stories.tsx":J,"./stories/ContextMenu.stories.tsx":K,"./stories/DataTable.stories.tsx":Y,"./stories/DateTimeField.stories.tsx":X,"./stories/DateTimePickers.stories.tsx":ee,"./stories/Dialog.stories.tsx":te,"./stories/DialogPromise.stories.tsx":oe,"./stories/DirectionProvider.stories.tsx":ae,"./stories/Drawer.stories.tsx":ne,"./stories/Dropdown.stories.tsx":re,"./stories/EditorAISaaSWorkspace.stories.tsx":ie,"./stories/EmptyState.stories.tsx":se,"./stories/Field.stories.tsx":le,"./stories/FieldSemantics.stories.tsx":de,"./stories/FileUpload.stories.tsx":ce,"./stories/Flex.stories.tsx":pe,"./stories/FloatingToolbar.stories.tsx":ue,"./stories/Form.stories.tsx":me,"./stories/Gantt.stories.tsx":ge,"./stories/Grid.stories.tsx":fe,"./stories/HoverCard.stories.tsx":he,"./stories/Icon.stories.tsx":ye,"./stories/IconsCatalog.stories.tsx":ve,"./stories/InlineEdit.stories.tsx":be,"./stories/Input.stories.tsx":xe,"./stories/Label.stories.tsx":Se,"./stories/Layout.stories.tsx":Be,"./stories/LayoutShowcase.stories.tsx":we,"./stories/LightCodeEditor.stories.tsx":Ce,"./stories/LightCodeEditorAISaaSWorkspace.stories.tsx":ke,"./stories/MediaManager.stories.tsx":Te,"./stories/Menu.stories.tsx":ze,"./stories/Menubar.stories.tsx":Pe,"./stories/Meter.stories.tsx":Re,"./stories/MultiSelect.stories.tsx":Ie,"./stories/NavigationMenu.stories.tsx":Ae,"./stories/NumberField.stories.tsx":Fe,"./stories/PIIRedactionScenario.stories.tsx":Ge,"./stories/Pagination.stories.tsx":De,"./stories/PanelGroup.stories.tsx":Me,"./stories/PasswordField.stories.tsx":Ee,"./stories/PinInput.stories.tsx":Oe,"./stories/PluginPanel.stories.tsx":Le,"./stories/Popover.stories.tsx":_e,"./stories/Portal.stories.tsx":We,"./stories/Presence.stories.tsx":He,"./stories/PrimitiveWrappers.stories.tsx":Ne,"./stories/Progress.stories.tsx":Ve,"./stories/QuickActions.stories.tsx":Ue,"./stories/RadioGroup.stories.tsx":qe,"./stories/ReactIconsAISaaSDashboard.stories.tsx":je,"./stories/Reporting.stories.tsx":$e,"./stories/RichTextEditor.stories.tsx":Qe,"./stories/RichTextEditorFormatting.stories.tsx":Ze,"./stories/RichTextEditorPatterns.stories.tsx":Je,"./stories/RichTextEditorPerformance.stories.tsx":Ke,"./stories/RichTextEditorWorkflows.stories.tsx":Ye,"./stories/ScrollArea.stories.tsx":Xe,"./stories/Section.stories.tsx":et,"./stories/Select.stories.tsx":tt,"./stories/SelectionPopup.stories.tsx":ot,"./stories/Separator.stories.tsx":at,"./stories/Sidebar.stories.tsx":nt,"./stories/Skeleton.stories.tsx":rt,"./stories/Slider.stories.tsx":it,"./stories/Slot.stories.tsx":st,"./stories/SplitButton.stories.tsx":lt,"./stories/Stepper.stories.tsx":dt,"./stories/Switch.stories.tsx":ct,"./stories/Table.stories.tsx":pt,"./stories/Tabs.stories.tsx":ut,"./stories/TagsInput.stories.tsx":mt,"./stories/Textarea.stories.tsx":gt,"./stories/Theming.stories.tsx":ft,"./stories/Timeline.stories.tsx":ht,"./stories/Toast.stories.tsx":yt,"./stories/ToastAISaaSCenter.stories.tsx":vt,"./stories/ToastAPI.stories.tsx":bt,"./stories/ToastPrimitive.stories.tsx":xt,"./stories/Toggle.stories.tsx":St,"./stories/ToggleGroup.stories.tsx":Bt,"./stories/TokenGovernance.stories.tsx":wt,"./stories/Toolbar.stories.tsx":Ct,"./stories/Tooltip.stories.tsx":kt,"./stories/TransferList.stories.tsx":Tt,"./stories/Tree.stories.tsx":zt,"./stories/VisuallyHidden.stories.tsx":Pt,"./stories/Wizard.stories.tsx":Rt});function At(e){return(e.match(/(^import[\s\S]*?;)/gm)??[]).filter(i=>{const n=i.match(/from\s+['"]([^'"]+)['"]/);return n?n[1].startsWith("@editora/"):!1}).join(`
`).trim()}function b(e){return e?e.replace(/\\/g,"/").replace(/^\.?\/?\.storybook\//,"./").replace(/^\.\//,"./"):""}function x(e){const o=e.split("/");return o[o.length-1]||e}function Ft(e){const o=e.trim().match(/^<([A-Z][A-Za-z0-9_]*)\b[^>]*\/>\s*;?$/);return(o==null?void 0:o[1])??null}function Gt(e){const o=e.trim(),s=o.match(/^<([A-Z][A-Za-z0-9_]*)\b[^>]*\/>\s*;?$/);if(s)return s[1];const i=o.match(/^(?:\([^)]*\)|[A-Za-z_$][A-Za-z0-9_$]*)\s*=>\s*\(?\s*<([A-Z][A-Za-z0-9_]*)\b[\s\S]*\/>\s*\)?\s*;?$/);return(i==null?void 0:i[1])??null}function Dt(e){const o=e.trim().match(/^([A-Z][A-Za-z0-9_]*)\s*;?$/);return(o==null?void 0:o[1])??null}function Mt(e){const o=new Set,s=/^import\s+([\s\S]*?)\s+from\s+['"][^'"]+['"];?$/gm;let i=null;for(;(i=s.exec(e))!==null;){const n=i[1].trim();if(!n)continue;const a=n.match(/\*\s+as\s+([A-Za-z_$][A-Za-z0-9_$]*)/);a!=null&&a[1]&&o.add(a[1]);const r=n.match(/^([A-Za-z_$][A-Za-z0-9_$]*)\s*(?:,|$)/);r&&!n.startsWith("{")&&!n.startsWith("*")&&o.add(r[1]);const t=n.match(/\{([\s\S]*?)\}/);if(t!=null&&t[1]){const d=t[1].split(",").map(l=>l.trim()).filter(Boolean);for(const l of d){const u=l.replace(/^type\s+/,"").trim(),p=u.match(/^([A-Za-z_$][A-Za-z0-9_$]*)\s+as\s+([A-Za-z_$][A-Za-z0-9_$]*)$/);if(p!=null&&p[2]){o.add(p[2]);continue}/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(u)&&o.add(u)}}}return o}function y(e){const o=e.matchAll(/<([A-Z][A-Za-z0-9_]*)\b/g),s=new Set;for(const i of o)i[1]&&s.add(i[1]);return Array.from(s)}function Et(e,o,s,i){let n=0,a="normal";for(let r=o;r<e.length;r+=1){const t=e[r],d=e[r+1],l=e[r-1];if(a==="line-comment"){t===`
`&&(a="normal");continue}if(a==="block-comment"){t==="*"&&d==="/"&&(a="normal",r+=1);continue}if(a==="single"){t==="'"&&l!=="\\"&&(a="normal");continue}if(a==="double"){t==='"'&&l!=="\\"&&(a="normal");continue}if(a==="template"){t==="`"&&l!=="\\"&&(a="normal");continue}if(t==="/"&&d==="/"){a="line-comment",r+=1;continue}if(t==="/"&&d==="*"){a="block-comment",r+=1;continue}if(t==="'"){a="single";continue}if(t==='"'){a="double";continue}if(t==="`"){a="template";continue}if(t===s&&(n+=1),t===i&&(n-=1,n===0))return r}return-1}function Ot(e,o){let s=0,i=0,n=0,a="normal";for(let r=o;r<e.length;r+=1){const t=e[r],d=e[r+1],l=e[r-1];if(a==="line-comment"){t===`
`&&(a="normal");continue}if(a==="block-comment"){t==="*"&&d==="/"&&(a="normal",r+=1);continue}if(a==="single"){t==="'"&&l!=="\\"&&(a="normal");continue}if(a==="double"){t==='"'&&l!=="\\"&&(a="normal");continue}if(a==="template"){t==="`"&&l!=="\\"&&(a="normal");continue}if(t==="/"&&d==="/"){a="line-comment",r+=1;continue}if(t==="/"&&d==="*"){a="block-comment",r+=1;continue}if(t==="'"){a="single";continue}if(t==='"'){a="double";continue}if(t==="`"){a="template";continue}if(t==="("&&(s+=1),t===")"&&(s=Math.max(0,s-1)),t==="{"&&(i+=1),t==="}"&&(i=Math.max(0,i-1)),t==="["&&(n+=1),t==="]"&&(n=Math.max(0,n-1)),t===";"&&s===0&&i===0&&n===0)return r}return-1}function g(e,o){const i=new RegExp(`\\bfunction\\s+${o}\\s*\\(`).exec(e);if(i){const r=e.indexOf("{",i.index);if(r!==-1){const t=Et(e,r,"{","}");if(t!==-1)return e.slice(i.index,t+1).trim()}}const a=new RegExp(`\\b(?:const|let|var)\\s+${o}\\s*=`).exec(e);if(a){const r=Ot(e,a.index);if(r!==-1)return e.slice(a.index,r+1).trim()}return null}function v(e){const o=e.match(/^function\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*\(/);if(o!=null&&o[1])return o[1];const s=e.match(/^(?:const|let|var)\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*=/);return(s==null?void 0:s[1])??null}function Lt(e,o){const s=Mt(e),i=y(o),n=new Set,a=[];for(;i.length>0;){const r=i.shift();if(!r||n.has(r)||(n.add(r),s.has(r)))continue;const t=g(e,r);if(!t)continue;a.push(t);const d=y(t);for(const l of d)n.has(l)||i.push(l)}return a}const S=new Map,B=new Map,w=new Map,C=new Map;for(const[e,o]of Object.entries(It)){const s=b(e),i=x(e),n=At(o);w.set(s,o),C.set(i,o),n&&(S.set(s,n),B.set(i,n))}function _t(e,o){if(!e)return e;const s=b(o),i=x(s||o||""),n=w.get(s)||C.get(i),a=S.get(s)||B.get(i),r=Ft(e);let t=e.trim();if(r&&n){const c=g(n,r);c&&(t=c)}const d=n?Gt(t):null;if(d&&n){const c=g(n,d);c&&(t=c)}const l=n?Dt(t):null;if(l&&n){const c=g(n,l);c&&(t=c)}const u=n&&!/^\s*import\s/m.test(t)?Lt(n,t):[],p=v(t),f=u.filter(c=>{const h=v(c);return!h||h!==p}),m=[];return a&&!/^\s*import\s/m.test(t)&&m.push(a),f.length>0&&m.push(f.join(`

`)),m.push(t),m.join(`

`).trim()}if(typeof document<"u"&&!document.getElementById("editora-not-defined-guard")){const e=document.createElement("style");e.id="editora-not-defined-guard",e.textContent=":not(:defined) { visibility: hidden; }",document.head.appendChild(e)}const Wt={parameters:{docs:{canvas:{sourceState:"shown"},source:{state:"open",type:"dynamic",transform:(e,o)=>{var s,i;try{return _t(e,(s=o==null?void 0:o.parameters)==null?void 0:s.fileName)}catch(n){const a=((i=o==null?void 0:o.parameters)==null?void 0:i.fileName)||"unknown-story";return console.warn(`[storybook] docs source transform failed for ${a}`,n),e}}}},controls:{matchers:{color:/(background|color)$/i,date:/Date$/}}}};export{Wt as default};
