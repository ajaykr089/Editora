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

export default {
  title: 'UI/MultiSelect',
  component: MultiSelect
};

export const Playground = () => {
  const [value, setValue] = useState<string[]>(['ops', 'security']);
  return (
    <ShowcasePage
      eyebrow="Composed Selection"
      title="Multi-select should behave like a serious filter control, not a stitched-together tag input"
      description="These stories validate token rhythm, searchable listbox behavior, and how selected values stay legible when the control becomes dense."
      meta={[
        { label: 'Pattern', value: 'Filter + tokens' },
        { label: 'Options', value: `${teamOptions.length}` },
        { label: 'Selection', value: `${value.length} active` }
      ]}
    >
      <ShowcaseSection
        eyebrow="Default Pattern"
        title="Owning teams"
        description="The default treatment should feel clean enough for dashboards and structured enough for admin forms."
      >
        <Box style={{ display: 'grid', gap: 16, maxWidth: 640 }}>
          <div style={showcaseChipRowStyle}>
            <span style={showcaseChipStyle}>Searchable</span>
            <span style={showcaseChipStyle}>Tokenized</span>
            <span style={showcaseChipStyle}>Listbox-backed</span>
          </div>
          <MultiSelect
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
