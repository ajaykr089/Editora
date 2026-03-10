import React, { useState } from 'react';
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
  value: `team-${index + 1}`,
  label: `Team ${index + 1}`,
  description: `Operational slice ${index + 1}`
}));

export default {
  title: 'UI/MultiSelect',
  component: MultiSelect,
  argTypes: {
    selectionIndicator: { control: 'radio', options: ['checkbox', 'check', 'none'] },
    variant: { control: 'select', options: ['default', 'surface', 'soft', 'filled', 'minimal', 'contrast'] },
    tone: { control: 'select', options: ['default', 'success', 'warning', 'danger'] },
    density: { control: 'select', options: ['default', 'compact', 'comfortable'] },
    shape: { control: 'select', options: ['default', 'square', 'soft'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
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
        { label: 'Selection', value: `${value.length} active` }
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
  variant: 'surface',
  tone: 'default',
  density: 'default',
  shape: 'default',
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
      <MultiSelect label="Filled compact" options={teamOptions} value={['platform']} variant="filled" density="compact" size="sm" />
      <MultiSelect label="Minimal no indicator" options={teamOptions} value={['support']} variant="minimal" selectionIndicator="none" />
      <MultiSelect label="Contrast shell" options={teamOptions} value={['ops']} variant="contrast" shape="soft" />
      <MultiSelect label="Comfortable square" options={teamOptions} value={['security']} density="comfortable" shape="square" size="lg" />
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
