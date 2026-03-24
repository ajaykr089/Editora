import React, { useState } from 'react';
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
