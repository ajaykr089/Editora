import React, { useState } from 'react';
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
