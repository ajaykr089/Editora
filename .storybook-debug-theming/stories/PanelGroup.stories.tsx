import React, { useMemo, useState } from 'react';
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
  const summary = useMemo(() => sizes.map((size) => `${Math.round(size)}%`).join(' / '), [sizes]);

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
