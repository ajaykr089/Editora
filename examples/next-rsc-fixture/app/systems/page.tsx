'use client';

import React from 'react';
import {
  Badge,
  Box,
  Button,
  DirectionProvider,
  Field,
  Flex,
  Form,
  Gantt,
  Grid,
  Input,
  MasonryGrid,
  PlacementGrid,
  Textarea,
  Toast,
} from '@editora/ui-react';
import { ShowcaseCard, ShowcaseShell, eyebrowStyle, hintStyle, stageStyle } from '../showcase/shared';

const roadmapTasks = [
  { id: 'foundation', label: 'Foundation route polish', start: '2026-03-25', end: '2026-03-29', progress: 92, tone: 'success' as const },
  { id: 'shells', label: 'Shell demos and hydration fixes', start: '2026-03-27', end: '2026-04-02', progress: 71, tone: 'info' as const },
  { id: 'studio', label: 'Editor utilities route', start: '2026-03-29', end: '2026-04-05', progress: 58, tone: 'warning' as const },
  { id: 'systems', label: 'Final fixture coverage pass', start: '2026-04-01', end: '2026-04-08', progress: 34, tone: 'default' as const },
];

const masonryCards = [
  { title: 'Short note', height: 110, tone: '#dbeafe', body: 'Compact card for quick route notes and release callouts.' },
  { title: 'Longer checklist', height: 190, tone: '#dcfce7', body: 'Masonry is useful when content blocks have mixed heights and you still want the column packing to feel dense and intentional.' },
  { title: 'QA digest', height: 150, tone: '#fef3c7', body: 'This block is mid-sized to show the vertical staggering effect clearly.' },
  { title: 'Publishing memo', height: 240, tone: '#fee2e2', body: 'Large content cards are where masonry starts looking meaningfully different from a uniform grid. This one deliberately pushes the column balancing harder.' },
  { title: 'Tiny badge wall', height: 96, tone: '#ede9fe', body: 'Small summary card.' },
  { title: 'Review summary', height: 170, tone: '#e0f2fe', body: 'Another uneven block so the masonry wrapper has mixed column heights to work with.' },
];

export default function SystemsPage() {
  const formRef = React.useRef<any>(null);
  const toastRef = React.useRef<any>(null);
  const [formStatus, setFormStatus] = React.useState('Waiting for input.');
  const [formValues, setFormValues] = React.useState<Record<string, any>>({});
  const [toastSummary, setToastSummary] = React.useState('No toast has been shown yet.');
  const [lastToastId, setLastToastId] = React.useState<string | number | null>(null);
  const [ganttVariant, setGanttVariant] = React.useState<'default' | 'contrast'>('default');

  return (
    <DirectionProvider dir="ltr">
      <ShowcaseShell
        currentHref="/systems"
        eyebrow="Systems"
        title="Forms, planning, notifications, and advanced grids"
        description="This route closes the remaining feature-level gaps in the fixture with live demos for the managed Form wrapper, the imperative Toast API, a planning-focused Gantt surface, and both advanced grid layout primitives."
      >
        <Grid style={{ display: 'grid', gap: 18, justifyItems: 'stretch', alignItems: 'start' }}>
          <ShowcaseCard
            eyebrow="Managed Input"
            title="Form with slots, validation hooks, and imperative actions"
            description="This demo uses the composed Form API rather than only the root wrapper, so the title, actions, and status slots all get exercised together."
          >
            <Grid style={{ display: 'grid', gap: 16, justifyItems: 'stretch', alignItems: 'start' }}>
              <Box style={{ ...stageStyle, width: '100%' }}>
                <Form
                  ref={formRef}
                  heading="Fixture coverage request"
                  description="Track the remaining demo work and submit a quick handoff note."
                  variant="surface"
                  tone="brand"
                  state={formStatus.startsWith('Invalid') ? 'warning' : 'default'}
                  stateText={formStatus}
                  gap="14px"
                  onSubmit={(values) => {
                    setFormValues(values);
                    setFormStatus(`Submitted ${Object.keys(values).length} fields successfully.`);
                  }}
                  onInvalid={(errors) => {
                    setFormStatus(`Invalid fields: ${Object.keys(errors).join(', ') || 'unknown'}.`);
                  }}
                  onValidate={(result) => {
                    if (result.valid) setFormStatus('Validation passed.');
                  }}
                  onDirtyChange={(dirty) => {
                    if (dirty) setFormStatus('You have unsaved changes.');
                  }}
                  style={{ width: '100%' }}
                >
                  <Form.Title style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>
                    Route planning form
                  </Form.Title>

                  <Field label="Owner" htmlFor="systems-owner" required>
                    <Input id="systems-owner" name="owner" required placeholder="Ava Stone" />
                  </Field>

                  <Field label="Scope" htmlFor="systems-scope" required>
                    <Input id="systems-scope" name="scope" required placeholder="Add missing fixture demos" />
                  </Field>

                  <Field label="Notes" htmlFor="systems-notes" description="A quick internal note to include with the handoff.">
                    <Textarea id="systems-notes" name="notes" rows={4} placeholder="Document what was added and what still needs polish." />
                  </Field>

                  <Form.Actions style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <Button type="button" onClick={() => formRef.current?.submit()}>
                      Submit form
                    </Button>
                    <Button
                      type="button"
                      recipe="outline"
                      onClick={async () => {
                        const result = await formRef.current?.validate?.();
                        setFormStatus(result?.valid ? 'Validation passed.' : `Validation failed for ${Object.keys(result?.errors || {}).join(', ') || 'unknown fields'}.`);
                      }}
                    >
                      Validate
                    </Button>
                    <Button
                      type="button"
                      recipe="outline"
                      onClick={() => {
                        const values = formRef.current?.getValues?.() || {};
                        setFormValues(values);
                        setFormStatus('Read current form values.');
                      }}
                    >
                      Read values
                    </Button>
                  </Form.Actions>

                  <Form.Status style={{ fontSize: 14, color: '#475569' }}>
                    {formStatus}
                  </Form.Status>
                </Form>
                <Box style={hintStyle}>Current values snapshot: <strong>{JSON.stringify(formValues)}</strong></Box>
              </Box>
            </Grid>
          </ShowcaseCard>

          <ShowcaseCard
            eyebrow="Planning & Feedback"
            title="Gantt timeline and Toast notifications"
            description="These two wrappers are very different, but they both expose higher-level product behaviors rather than small input controls."
          >
            <Grid
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 16,
                justifyItems: 'stretch',
                alignItems: 'start',
              }}
            >
              <Box style={{ ...stageStyle, width: '100%' }}>
                <Box style={eyebrowStyle}>Gantt</Box>
                <Flex style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <Button recipe="outline" onClick={() => setGanttVariant((value) => (value === 'default' ? 'contrast' : 'default'))}>
                    Toggle {ganttVariant === 'default' ? 'contrast' : 'default'} variant
                  </Button>
                </Flex>
                <Gantt tasks={roadmapTasks} variant={ganttVariant} style={{ width: '100%' }} />
                <Box style={hintStyle}>Current variant: <strong>{ganttVariant}</strong></Box>
              </Box>

              <Box style={{ ...stageStyle, width: '100%' }}>
                <Box style={eyebrowStyle}>Toast</Box>
                <Flex style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <Button
                    onClick={() => {
                      const id = toastRef.current?.show?.('Fixture route published.', { type: 'success', duration: 2400 });
                      setLastToastId(id ?? null);
                      setToastSummary(`Displayed success toast ${String(id ?? '')}.`);
                    }}
                  >
                    Show success toast
                  </Button>
                  <Button
                    recipe="outline"
                    onClick={() => {
                      const id = toastRef.current?.show?.('Route needs review before publish.', { type: 'warning', duration: 3200 });
                      setLastToastId(id ?? null);
                      setToastSummary(`Displayed warning toast ${String(id ?? '')}.`);
                    }}
                  >
                    Show warning toast
                  </Button>
                  <Button
                    recipe="outline"
                    onClick={() => {
                      if (lastToastId != null) {
                        toastRef.current?.hide?.(lastToastId);
                        setToastSummary(`Dismissed toast ${String(lastToastId)}.`);
                      }
                    }}
                  >
                    Hide last toast
                  </Button>
                  <Button
                    recipe="outline"
                    onClick={() => {
                      toastRef.current?.clear?.();
                      setLastToastId(null);
                      setToastSummary('Cleared all active toasts.');
                    }}
                  >
                    Clear all
                  </Button>
                </Flex>
                <Toast
                  ref={toastRef}
                  position="top-right"
                  maxVisible={3}
                  theme="light"
                  onShow={(detail) => setToastSummary(`Toast shown: ${detail.message} (${String(detail.id)}).`)}
                  onHide={(detail) => setToastSummary(`Toast hidden: ${String(detail.id)}.`)}
                />
                <Box style={hintStyle}>{toastSummary}</Box>
              </Box>
            </Grid>
          </ShowcaseCard>

          <ShowcaseCard
            eyebrow="Advanced Layout"
            title="PlacementGrid and MasonryGrid"
            description="These wrappers are about layout intelligence rather than standard form controls, so the demos focus on spatial behavior and uneven content blocks."
          >
            <Grid style={{ display: 'grid', gap: 16, justifyItems: 'stretch', alignItems: 'start' }}>
              <Box style={{ ...stageStyle, width: '100%' }}>
                <Box style={eyebrowStyle}>PlacementGrid</Box>
                <PlacementGrid columns="repeat(4, minmax(0, 1fr))" rows="repeat(3, minmax(72px, auto))" gap="12px" style={{ width: '100%' }}>
                  <PlacementGrid.Item row={1} column={1} columnSpan={2}>
                    <Box style={{ padding: 16, borderRadius: 16, background: '#dbeafe', minHeight: 72, display: 'grid', alignItems: 'center', color: '#1e3a8a', fontWeight: 700 }}>
                      Planning overview
                    </Box>
                  </PlacementGrid.Item>
                  <PlacementGrid.Item row={1} column={3}>
                    <Box style={{ padding: 16, borderRadius: 16, background: '#dcfce7', minHeight: 72, display: 'grid', alignItems: 'center', color: '#166534', fontWeight: 700 }}>
                      QA
                    </Box>
                  </PlacementGrid.Item>
                  <PlacementGrid.Item row={1} column={4} rowSpan={2}>
                    <Box style={{ padding: 16, borderRadius: 16, background: '#fef3c7', minHeight: 156, display: 'grid', alignItems: 'center', color: '#92400e', fontWeight: 700 }}>
                      Release notes
                    </Box>
                  </PlacementGrid.Item>
                  <PlacementGrid.Item row={2} column={1} columnSpan={2}>
                    <Box style={{ padding: 16, borderRadius: 16, background: '#fee2e2', minHeight: 72, display: 'grid', alignItems: 'center', color: '#991b1b', fontWeight: 700 }}>
                      Regression watchlist
                    </Box>
                  </PlacementGrid.Item>
                  <PlacementGrid.Item row={2} column={3}>
                    <Box style={{ padding: 16, borderRadius: 16, background: '#ede9fe', minHeight: 72, display: 'grid', alignItems: 'center', color: '#6d28d9', fontWeight: 700 }}>
                      Owners
                    </Box>
                  </PlacementGrid.Item>
                  <PlacementGrid.Item row={3} column={1} columnSpan={4}>
                    <Box style={{ padding: 16, borderRadius: 16, background: '#e0f2fe', minHeight: 72, display: 'grid', alignItems: 'center', color: '#075985', fontWeight: 700 }}>
                      Footer rail spanning the full placement grid
                    </Box>
                  </PlacementGrid.Item>
                </PlacementGrid>
              </Box>

              <Box style={{ ...stageStyle, width: '100%' }}>
                <Box style={eyebrowStyle}>MasonryGrid</Box>
                <MasonryGrid columns={3} gap="14px" style={{ width: '100%' }}>
                  {masonryCards.map((card) => (
                    <Box
                      key={card.title}
                      style={{
                        minHeight: card.height,
                        padding: 16,
                        borderRadius: 18,
                        display: 'grid',
                        gap: 10,
                        alignContent: 'start',
                        background: card.tone,
                        color: '#0f172a',
                        border: '1px solid rgba(148, 163, 184, 0.18)',
                      }}
                    >
                      <Flex style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center', width: '100%' }}>
                        <Box style={{ fontWeight: 800 }}>{card.title}</Box>
                        <Badge tone="info">{card.height}px</Badge>
                      </Flex>
                      <Box style={{ lineHeight: 1.6 }}>{card.body}</Box>
                    </Box>
                  ))}
                </MasonryGrid>
              </Box>
            </Grid>
          </ShowcaseCard>
        </Grid>
      </ShowcaseShell>
    </DirectionProvider>
  );
}
