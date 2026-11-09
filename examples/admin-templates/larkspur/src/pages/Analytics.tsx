import React from 'react';
import { Card } from '@editora/ui-react/Card';
import { Chart } from '@editora/ui-react/Chart';
import { DataTable } from '@editora/ui-react/DataTable';
import { Meter } from '@editora/ui-react/Meter';
import { PageHeader } from '@editora/ui-react/PageHeader';
import { Stat } from '@editora/ui-react/Stat';
import { Tabs } from '@editora/ui-react/Tabs';
import { analyticsSummary, compact, shortDate } from '../../../shared/data';
import { useLoad } from '../lib/ui';
import { useTitle } from '../lib/router';

type Range = '7d' | '30d' | '90d';
const RANGES: Range[] = ['7d', '30d', '90d'];
const RANGE_LABEL: Record<Range, string> = { '7d': 'Last 7 days', '30d': 'Last 30 days', '90d': 'Last 90 days' };

const minutes = (seconds: number) => `${Math.floor(seconds / 60)}m ${String(Math.round(seconds % 60)).padStart(2, '0')}s`;

export function Analytics() {
  useTitle('Analytics');
  const [range, setRange] = React.useState<Range>('30d');
  const { data, loading } = useLoad(() => analyticsSummary(range), [range]);
  const state = loading ? 'loading' : 'idle';
  // Long ranges get a tick every week, short ones every day.
  const step = range === '90d' ? 7 : range === '30d' ? 3 : 1;
  const series = data ? data.series.filter((_, i) => i % step === 0 || i === data.series.length - 1) : [];

  return (
    <div className="lk-screen">
      <PageHeader title="Analytics" subtitle="Traffic to the web store. Numbers update every hour." />

      <Tabs
        variant="segmented"
        size="sm"
        aria-label="Date range"
        selected={RANGES.indexOf(range)}
        onChange={(index) => setRange(RANGES[index])}
        className="lk-range-tabs"
      >
        {RANGES.map((value) => (
          <Tabs.Tab key={value} value={value}>{RANGE_LABEL[value]}</Tabs.Tab>
        ))}
      </Tabs>

      <div className="lk-stats">
        <Stat variant="card" label="Sessions" value={data ? compact(data.sessions) : '…'} trend="+8.2% vs previous period" tone="success" />
        <Stat variant="card" label="Visitors" value={data ? compact(data.visitors) : '…'} trend="+5.1% vs previous period" tone="success" />
        <Stat variant="card" label="Conversion rate" value={data ? `${((data.conversions / data.sessions) * 100).toFixed(2)}%` : '…'} trend="Orders per session" tone="brand" />
        <Stat variant="card" label="Avg. session" value={data ? minutes(data.avgSession) : '…'} trend={data ? `Bounce rate ${(data.bounceRate * 100).toFixed(1)}%` : ''} tone="neutral" />
      </div>

      <Chart
        type="line"
        headingLevel={2}
        title="Sessions and visitors"
        subtitle={RANGE_LABEL[range]}
        series={[
          { name: 'Sessions', data: series.map((day) => ({ label: shortDate(day.date), value: day.sessions })) },
          { name: 'Visitors', data: series.map((day) => ({ label: shortDate(day.date), value: day.visitors })) },
        ]}
        state={state}
      />

      <div className="lk-grid-3">
        <Chart type="donut" headingLevel={2} title="Traffic sources" subtitle="Share of sessions" data={data?.sources || []} valueSuffix="%" showSummary={false} state={state} />
        <Chart type="bar" headingLevel={2} title="Devices" subtitle="Share of sessions" data={data?.devices || []} valueSuffix="%" showLegend={false} showSummary={false} state={state} />
        <Card>
          <Card.Header>
            <Card.Title as="h2">Top countries</Card.Title>
            <Card.Description>Share of sessions</Card.Description>
          </Card.Header>
          <ul className="lk-list">
            {(data?.countries || []).map((country) => (
              <li key={country.label} className="lk-row lk-row-meter-wide">
                <span className="lk-row-main cell-title">{country.label}</span>
                <Meter value={country.value} max={40} aria-label={`${country.label} ${country.value}%`} />
                <span className="num">{country.value}%</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <Card.Header>
          <Card.Title as="h2">Top pages</Card.Title>
          <Card.Description>Most viewed pages in the period.</Card.Description>
        </Card.Header>
        <DataTable sortable aria-label="Top pages" hideSummary elevation="none" variant="flat" state={state}>
          <table>
            <thead>
              <tr><th data-key="title">Page</th><th data-key="views">Views</th><th data-key="time">Avg. time</th></tr>
            </thead>
            <tbody>
              {(data?.pages || []).map((page) => (
                <tr key={page.path}>
                  <td><span className="cell-title">{page.title}</span><span className="cell-sub">{page.path}</span></td>
                  <td data-align="end" data-value={page.views}>{page.views.toLocaleString('en-US')}</td>
                  <td data-align="end">{page.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DataTable>
      </Card>
    </div>
  );
}
