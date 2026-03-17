import React from 'react';
import type { Meta } from '@storybook/react';
import { Accordion, Box, Button, Flex, Grid } from '@editora/ui-react';
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
      <Accordion.Item description="What the product does" badge="Overview">
        <Accordion.Trigger>What is Editora?</Accordion.Trigger>
        <Accordion.Panel>
          Editora is a rich text editing system with a web-component core and React wrappers.
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item description="Runtime model" badge="Core">
        <Accordion.Trigger>How does it work?</Accordion.Trigger>
        <Accordion.Panel>
          It composes token-aware web components behind React wrappers and shared theme primitives.
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item description="Production guidance" badge="Usage">
        <Accordion.Trigger>When should teams use it?</Accordion.Trigger>
        <Accordion.Panel>
          Use it for disclosure-heavy settings panels, FAQ groups, and operational workflows that need clear hierarchy.
        </Accordion.Panel>
      </Accordion.Item>
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
          <Accordion.Item description="Deployment model and editor surface">
            <Accordion.Trigger>Can teams use Editora in both React and plain web components?</Accordion.Trigger>
            <Accordion.Panel>
              Yes. The system ships a custom-element core and React wrappers so product teams can adopt the same
              primitives across both integration styles.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item description="Lifecycle, upgrades, and adoption strategy">
            <Accordion.Trigger>How should we roll it out inside an existing design system?</Accordion.Trigger>
            <Accordion.Panel>
              Start with infrastructure primitives and form controls, then move high-traffic composed components such
              as menus, dialogs, and editor workflows.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item description="Tokens, themes, and Storybook alignment">
            <Accordion.Trigger>Does it support product-level theming without forking styles?</Accordion.Trigger>
            <Accordion.Panel>
              Yes. The baseline theme system exposes semantic and component-level tokens so teams can tune color,
              radius, motion, density, and elevation without rewriting component CSS.
            </Accordion.Panel>
          </Accordion.Item>
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
          <Accordion.Item description="Identity, roles, workspace metadata" badge="Core">
            <Accordion.Trigger>Workspace settings</Accordion.Trigger>
            <Accordion.Panel>
              Naming rules, environment labels, ownership metadata, and internal access settings.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item description="Data retention and access events" badge="Audit">
            <Accordion.Trigger>Security and compliance</Accordion.Trigger>
            <Accordion.Panel>
              Access reviews, retention windows, export controls, and event retention policies.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item description="Theme, typography, and interaction defaults" badge="Brand">
            <Accordion.Trigger>Appearance controls</Accordion.Trigger>
            <Accordion.Panel>
              Color system, density preferences, component radius, and motion policy configuration.
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Box>

      <Box style={{ ...showcaseFrameStyle, padding: 18 }}>
        <Box style={showcaseHeadingStyle}>High-signal sections</Box>
        <Grid style={{ gap: 12 }}>
          <Box style={{ padding: 16, borderRadius: 12, background: 'var(--ui-color-surface-alt, #f8fafc)' }}>
            Keep sidebar accordions compact, border-light, and collapsible by default.
          </Box>
          <Box style={{ padding: 16, borderRadius: 12, background: 'var(--ui-color-surface-alt, #f8fafc)' }}>
            Use `ghost` or `outline` for utility-heavy settings shells where the accordion should recede behind content.
          </Box>
          <Box style={{ padding: 16, borderRadius: 12, background: 'var(--ui-color-surface-alt, #f8fafc)' }}>
            Reserve `solid` or stronger tones for workflows where state emphasis matters more than chrome reduction.
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
            <Accordion.Item key={section.title} description={section.subtitle} badge={section.badge}>
              <Accordion.Trigger>{section.title}</Accordion.Trigger>
              <Accordion.Panel>
                {section.points[index % section.points.length]}
              </Accordion.Panel>
            </Accordion.Item>
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
      if (title) toastAdvanced.info(`${title} expanded`, { duration: 1600, theme: 'light' });
    });
    closed.forEach((index) => {
      const title = sections[index]?.title;
      if (title) toastAdvanced.success(`${title} reviewed`, { duration: 1400, theme: 'light' });
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
              Enterprise accordion built on `ui-core` and wrapped by `ui-react`.
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
          <Accordion.Item key={section.title} description={section.subtitle} badge={section.badge}>
            <Accordion.Trigger aria-label={`Toggle ${section.title}`}>
              <TriggerContent section={section} />
            </Accordion.Trigger>
            <Accordion.Panel>
              <Grid style={{ gap: 10 }}>
                {section.points.map((point) => (
                  <Flex key={point} align="start" style={{ gap: 8 }}>
                    <CheckCircleIcon size={14} style={{ marginTop: 2, color: '#15803d' }} />
                    <Box style={{ fontSize: 13, lineHeight: 1.5 }}>{point}</Box>
                  </Flex>
                ))}
              </Grid>
            </Accordion.Panel>
          </Accordion.Item>
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
