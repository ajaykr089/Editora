import React from 'react';
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
            <span style={showcaseChipStyle}>Select-inspired options</span>
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

export const HardEdgeActions = () => {
  const [selected, setSelected] = React.useState('');
  return (
    <ShowcaseSection
      eyebrow="Hard Edge"
      title="Absolutely square split action"
      description="A zero-radius treatment for dense admin surfaces, data tools, and product areas that use completely flat geometry for controls and menus."
    >
      <Box style={{ display: 'grid', gap: 16, maxWidth: 580 }}>
        <SplitButton
          label="Apply action"
          menuHeading="Workflow actions"
          menuDescription="Square button, square menu container, and square option rows."
          variant="flat"
          shape="square"
          menuShape="square"
          items={[
            {
              value: 'apply-now',
              label: 'Apply now',
              description: 'Run the standard action immediately.',
              shortcut: '↵'
            },
            {
              value: 'queue',
              label: 'Queue action',
              description: 'Move this task into the next processing batch.'
            },
            {
              value: 'discard',
              label: 'Discard request',
              description: 'Permanently remove this request from the queue.',
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
