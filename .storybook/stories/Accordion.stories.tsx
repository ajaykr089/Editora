import React from 'react';
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
            <AccordionTrigger aria-label={`Toggle ${section.title}`}>
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
