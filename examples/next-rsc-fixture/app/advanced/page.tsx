'use client';

import React from 'react';
import {
  Accordion,
  Badge,
  Box,
  Button,
  Card,
  Chart,
  DataTable,
  DirectionProvider,
  Grid,
  Pagination,
  Table,
  Tabs,
} from '@editora/ui-react';
import { ShowcaseCard, ShowcaseShell, eyebrowStyle, hintStyle, scrollerStyle, stageStyle } from '../showcase/shared';

const performanceSeries = [
  {
    name: 'Revenue',
    data: [
      { label: 'Jan', value: 42, tone: 'info' },
      { label: 'Feb', value: 49, tone: 'info' },
      { label: 'Mar', value: 54, tone: 'info' },
      { label: 'Apr', value: 61, tone: 'info' },
      { label: 'May', value: 66, tone: 'info' },
      { label: 'Jun', value: 72, tone: 'info' },
    ],
    fill: true,
    tone: 'info',
  },
  {
    name: 'Retention',
    data: [
      { label: 'Jan', value: 31, tone: 'success' },
      { label: 'Feb', value: 38, tone: 'success' },
      { label: 'Mar', value: 44, tone: 'success' },
      { label: 'Apr', value: 46, tone: 'success' },
      { label: 'May', value: 52, tone: 'success' },
      { label: 'Jun', value: 58, tone: 'success' },
    ],
    tone: 'success',
    dash: '6 4',
  },
];

const pipelineRows = [
  { name: 'Ava Stone', team: 'Design', status: 'Active', region: 'North America', arr: '$14.2k' },
  { name: 'Noah Park', team: 'Engineering', status: 'Trial', region: 'Europe', arr: '$8.4k' },
  { name: 'Mila Chen', team: 'Operations', status: 'Active', region: 'APAC', arr: '$11.9k' },
  { name: 'Luca Meyer', team: 'Support', status: 'At Risk', region: 'Europe', arr: '$6.8k' },
  { name: 'Zara Patel', team: 'Sales', status: 'Active', region: 'India', arr: '$18.7k' },
  { name: 'Omar Reed', team: 'Marketing', status: 'Trial', region: 'North America', arr: '$7.1k' },
  { name: 'Ivy Brooks', team: 'Finance', status: 'Active', region: 'Australia', arr: '$9.6k' },
  { name: 'Leo Hart', team: 'Product', status: 'At Risk', region: 'LATAM', arr: '$5.9k' },
];

function toneForStatus(status: string): 'success' | 'warning' | 'info' {
  if (status === 'Active') return 'success';
  if (status === 'At Risk') return 'warning';
  return 'info';
}

export default function AdvancedPage() {
  const [openSections, setOpenSections] = React.useState<number | number[]>([0]);
  const [selectedTab, setSelectedTab] = React.useState('overview');
  const [selectedPoint, setSelectedPoint] = React.useState('Tap a chart point to inspect its detail.');
  const [page, setPage] = React.useState(1);
  const [selectedRows, setSelectedRows] = React.useState<number[]>([]);

  const totalPages = Math.ceil(pipelineRows.length / 4);

  return (
    <DirectionProvider dir="ltr">
      <ShowcaseShell
        currentHref="/advanced"
        eyebrow="Advanced"
        title="Higher-level composition and data wrappers"
        description="This route reaches beyond the reduced client barrel and demonstrates the broader ui-react surface that was still missing from the fixture, including accordions, tabs, cards, charts, tables, and paginated data tables."
      >
        <Grid
          style={{
            display: 'grid',
            // gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 18,
            justifyItems: 'stretch',
            alignItems: 'start',
          }}
        >
          <ShowcaseCard
            eyebrow="Disclosure"
            title="Accordion and tabs"
            description="Compound components are grouped here so you can test the composed APIs and the state bridges in one place."
          >
            <Grid style={{ display: 'grid', gap: 16, justifyItems: 'stretch', alignItems: 'start' }}>
              <Accordion
                multiple
                collapsible
                open={openSections}
                variant="outline"
                tone="info"
                radius={16}
                onToggle={(next) => setOpenSections(next)}
              >
                <Accordion.Item description="Why this route exists" badge="Fixture">
                  <Accordion.Trigger>What was missing from the old showcase?</Accordion.Trigger>
                  <Accordion.Panel>
                    The original split fixture focused on the small RSC-safe client barrel and left higher-level wrappers
                    like Accordion, Tabs, Chart, and DataTable without a live page.
                  </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item description="Controlled open indices" badge="State">
                  <Accordion.Trigger>How is the accordion wired?</Accordion.Trigger>
                  <Accordion.Panel>
                    This demo keeps a controlled <code>open</code> state so it is easy to verify the React wrapper stays
                    synced with the underlying custom element.
                  </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item description="Compound API" badge="Composed">
                  <Accordion.Trigger>Can I use sub-components naturally?</Accordion.Trigger>
                  <Accordion.Panel>
                    Yes. <code>Accordion.Item</code>, <code>Accordion.Trigger</code>, and <code>Accordion.Panel</code> are
                    all exercised here.
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>

              <Tabs value={selectedTab} variant="soft" tone="brand" onTabChange={(detail) => setSelectedTab(detail.value)}>
                <Tabs.Tab value="overview">Overview</Tabs.Tab>
                <Tabs.Tab value="usage">Usage</Tabs.Tab>
                <Tabs.Tab value="events">Events</Tabs.Tab>

                <Tabs.Panel>
                  <Box style={stageStyle}>
                    <Box style={eyebrowStyle}>Overview tab</Box>
                    <Box style={hintStyle}>Selected tab value: <strong>{selectedTab}</strong></Box>
                  </Box>
                </Tabs.Panel>
                <Tabs.Panel>
                  <Box style={stageStyle}>
                    <Box style={eyebrowStyle}>Usage tab</Box>
                    <Box style={hintStyle}>This demonstrates the slotted tab/panel structure the wrapper expects.</Box>
                  </Box>
                </Tabs.Panel>
                <Tabs.Panel>
                  <Box style={stageStyle}>
                    <Box style={eyebrowStyle}>Events tab</Box>
                    <Box style={hintStyle}>The route listens to <code>onTabChange</code> and reflects the active tab immediately.</Box>
                  </Box>
                </Tabs.Panel>
              </Tabs>
            </Grid>
          </ShowcaseCard>

          <ShowcaseCard
            eyebrow="Visual Data"
            title="Card and chart"
            description="A compact analytics surface that demonstrates both the slotted Card API and the chart wrapper in a realistic layout."
          >
            <Grid style={{ display: 'grid', gap: 16, justifyItems: 'stretch', alignItems: 'start' }}>
              <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, justifyItems: 'stretch', alignItems: 'start' }}>
                <Card variant="surface" tone="info" radius={18} elevation="low" style={{ width: '100%' }}>
                  <Card.Header>
                    <Card.Title>Revenue pulse</Card.Title>
                    <Card.Description>Shared card composition with header, title, description, and footer.</Card.Description>
                  </Card.Header>
                  <Card.Footer>Updated from the advanced fixture route</Card.Footer>
                </Card>

                <Card variant="soft" tone="success" radius={18} interactive style={{ width: '100%' }}>
                  <Card.Header>
                    <Card.Title>Healthy accounts</Card.Title>
                    <Card.Description>Cards can still be used as lightweight info modules without extra layout wrappers.</Card.Description>
                  </Card.Header>
                  <Card.Footer>82% active this week</Card.Footer>
                </Card>
              </Grid>

              <Box style={{ ...stageStyle, width: '100%' }}>
                <Chart.Root
                  type="area"
                  series={performanceSeries}
                  valueSuffix="%"
                  showLegend
                  style={{ width: '100%' }}
                  onPointSelect={(detail) => setSelectedPoint(`${detail.series ?? 'Series'} • ${detail.label}: ${detail.value}${detail.seriesValues ? ` (${detail.seriesValues.length} series)` : ''}`)}
                >
                  <Chart.Title>Growth comparison</Chart.Title>
                  <Chart.Subtitle>Revenue and retention over six months</Chart.Subtitle>
                  <Chart.Header>
                    <Button recipe="outline" size="sm" onClick={() => setSelectedPoint('Tap a chart point to inspect its detail.')}>
                      Reset chart detail
                    </Button>
                  </Chart.Header>
                </Chart.Root>

                <Box style={hintStyle}>{selectedPoint}</Box>
              </Box>
            </Grid>
          </ShowcaseCard>

          <ShowcaseCard
            eyebrow="Tables"
            title="Table, data table, and pagination"
            description="Both the lighter Table wrapper and the richer DataTable wrapper are mounted here with real table markup."
          >
            <Grid
              style={{
                display: 'grid',
                gap: 18,
                justifyItems: 'stretch',
                alignItems: 'start',
                gridTemplateColumns: 'minmax(0, 1fr)',
              }}
            >
              <Box style={{ ...stageStyle, width: '100%' }}>
                <Box style={eyebrowStyle}>Table</Box>
                <Box style={scrollerStyle}>
                  <Table sortable striped hover compact bordered style={{ minWidth: 520, width: '100%' }}>
                    <table>
                      <thead>
                        <tr>
                          <th data-key="metric">Metric</th>
                          <th data-key="owner">Owner</th>
                          <th data-key="status">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Design QA</td>
                          <td>Ava</td>
                          <td><Badge tone="success">Ready</Badge></td>
                        </tr>
                        <tr>
                          <td>Accessibility sweep</td>
                          <td>Noah</td>
                          <td><Badge tone="warning">Review</Badge></td>
                        </tr>
                        <tr>
                          <td>Docs parity</td>
                          <td>Mila</td>
                          <td><Badge tone="info">Queued</Badge></td>
                        </tr>
                      </tbody>
                    </table>
                  </Table>
                </Box>
              </Box>

              <Box style={{ ...stageStyle, width: '100%' }}>
                <Box style={eyebrowStyle}>DataTable</Box>
                <Box style={hintStyle}>Selected rows: <strong>{selectedRows.length}</strong> / page <strong>{page}</strong></Box>
                <Box style={scrollerStyle}>
                  <DataTable
                    sortable
                    selectable
                    multiSelect
                    striped
                    hover
                    bordered
                    page={page}
                    pageSize={4}
                    paginationId="advanced-data-table-pagination"
                    style={{ minWidth: 760, width: '100%' }}
                    onPageChange={(detail) => setPage(detail.page)}
                    onRowSelect={(detail) => setSelectedRows(detail.indices)}
                  >
                    <table>
                      <thead>
                        <tr>
                          <th data-key="name">Name</th>
                          <th data-key="team">Team</th>
                          <th data-key="status">Status</th>
                          <th data-key="region">Region</th>
                          <th data-key="arr">ARR</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pipelineRows.map((row) => (
                          <tr key={`${row.name}-${row.region}`}>
                            <td>{row.name}</td>
                            <td>{row.team}</td>
                            <td><Badge tone={toneForStatus(row.status)}>{row.status}</Badge></td>
                            <td>{row.region}</td>
                            <td>{row.arr}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </DataTable>
                </Box>

                <Pagination
                  id="advanced-data-table-pagination"
                  page={page}
                  count={totalPages}
                  variant="outline"
                  style={{ width: '100%' }}
                  onPageChange={(detail) => setPage(detail.page)}
                />
              </Box>
            </Grid>
          </ShowcaseCard>
        </Grid>
      </ShowcaseShell>
    </DirectionProvider>
  );
}
