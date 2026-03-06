import React from 'react';
import type { Meta } from '@storybook/react';
import { Badge, Box, Button, Chart, Flex, Grid } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import {
  ActivityIcon,
  AlertTriangleIcon,
  ChartBarIcon,
  ChartLineIcon,
  ChartPieIcon,
  CheckCircleIcon,
  RefreshCwIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from '@editora/react-icons';
import '../../packages/editora-toast/src/toast.css';
import '@editora/themes/themes/default.css';

const meta: Meta<typeof Chart> = {
  title: 'UI/Chart',
    component: Chart,
    argTypes: {
    type: { control: 'select', options: ['line', 'area', 'step', 'scatter', 'bar', 'donut', 'radial'] },
    variant: { control: 'select', options: ['default', 'contrast', 'minimal'] },
    state: { control: 'select', options: ['idle', 'loading', 'error', 'success'] },
    interactive: { control: 'boolean' },
    showLegend: { control: 'boolean' },
    showSummary: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;

const throughputSeries = [
  { label: 'Mon', value: 182 },
  { label: 'Tue', value: 214 },
  { label: 'Wed', value: 201 },
  { label: 'Thu', value: 236 },
  { label: 'Fri', value: 263 },
  { label: 'Sat', value: 191 },
  { label: 'Sun', value: 208 },
];

const marginSeries = [
  { label: 'Jan', value: 12 },
  { label: 'Feb', value: -4 },
  { label: 'Mar', value: 8 },
  { label: 'Apr', value: 16 },
  { label: 'May', value: -2 },
  { label: 'Jun', value: 10 },
];

const allocationSeries = [
  { label: 'Inpatient', value: 42, tone: '#2563eb' },
  { label: 'Outpatient', value: 33, tone: '#16a34a' },
  { label: 'Pharmacy', value: 15, tone: '#d97706' },
  { label: 'Labs', value: 10, tone: '#dc2626' },
];

function EnterpriseChartDashboard() {
  const [state, setState] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [chartType, setChartType] = React.useState<'line' | 'area' | 'step' | 'scatter' | 'bar' | 'donut' | 'radial'>(
    'line'
  );
  const [data, setData] = React.useState(throughputSeries);

  return (
    <Grid style={{ gap: 16, maxInlineSize: 1100 }}>
      <Box variant="gradient" tone="brand" radius="xl" p="16px" style={{ display: 'grid', gap: 10 }}>
        <Flex align="center" justify="space-between" style={{ gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>Enterprise Care Analytics</div>
            <div style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13, marginTop: 4 }}>
              Throughput, margin variance, and service allocation in one operational view.
            </div>
          </div>
          <Flex align="center" style={{ gap: 8, color: 'var(--ui-color-muted, #64748b)', fontSize: 12 }}>
            <ActivityIcon size={14} />
            Real-time stream
          </Flex>
        </Flex>
      </Box>

      <Grid style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <Box style={{ display: 'grid', gap: 8 }}>
          <Chart
            type={chartType}
            title="Patient Throughput"
            subtitle="Visits per day"
            data={data}
            state={state}
            showLegend
            showSummary
            onPointSelect={(detail) => {
              toastAdvanced.info(`${detail.label}: ${detail.value} visits`, { duration: 900, theme: 'light' });
            }}
          />
        </Box>

        <Box style={{ display: 'grid', gap: 8 }}>
          <Chart
            type="bar"
            title="Monthly Margin Variance"
            subtitle="Positive and negative movement"
            data={marginSeries}
            state={state === 'error' ? 'error' : 'idle'}
            onPointSelect={(detail) => {
              const tone = detail.value < 0 ? 'error' : 'success';
              if (tone === 'error') toastAdvanced.error(`${detail.label}: ${detail.value}%`, { duration: 900, theme: 'light' });
              else toastAdvanced.success(`${detail.label}: +${detail.value}%`, { duration: 900, theme: 'light' });
            }}
          />
        </Box>

        <Box style={{ display: 'grid', gap: 8 }}>
          <Chart
            type="donut"
            title="Service Allocation"
            subtitle="Current distribution"
            data={allocationSeries}
            state={state === 'loading' ? 'loading' : 'success'}
            onPointSelect={(detail) => {
              toastAdvanced.info(`${detail.label} share selected`, { duration: 900, theme: 'light' });
            }}
          />
        </Box>
      </Grid>

      <Flex align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
        <Badge tone="brand">
          <TrendingUpIcon size={12} />
          +14.8% weekly throughput
        </Badge>
        <Badge tone="warning">
          <TrendingDownIcon size={12} />
          -2.1% margin variance risk
        </Badge>

        <Button
          size="sm"
          variant="secondary"
          startIcon={<ChartLineIcon size={14} />}
          onClick={() => setChartType('line')}
        >
          Line
        </Button>
        <Button
          size="sm"
          variant="secondary"
          startIcon={<ChartBarIcon size={14} />}
          onClick={() => setChartType('step')}
        >
          Step
        </Button>
        <Button
          size="sm"
          variant="secondary"
          startIcon={<ActivityIcon size={14} />}
          onClick={() => setChartType('scatter')}
        >
          Scatter
        </Button>
        <Button
          size="sm"
          variant="secondary"
          startIcon={<ChartBarIcon size={14} />}
          onClick={() => setChartType('bar')}
        >
          Bar
        </Button>
        <Button
          size="sm"
          variant="secondary"
          startIcon={<ChartPieIcon size={14} />}
          onClick={() => setChartType('donut')}
        >
          Donut
        </Button>
        <Button
          size="sm"
          variant="secondary"
          startIcon={<ChartPieIcon size={14} />}
          onClick={() => setChartType('radial')}
        >
          Radial
        </Button>

        <Button
          size="sm"
          variant="secondary"
          startIcon={<RefreshCwIcon size={14} />}
          onClick={() => {
            setState('loading');
            toastAdvanced.loading('Syncing chart stream...', { duration: 900, theme: 'light' });
            window.setTimeout(() => {
              setData((prev) =>
                prev.map((point) => ({
                  ...point,
                  value: Math.max(40, Math.round(point.value + (Math.random() * 24 - 12))),
                }))
              );
              setState('idle');
              toastAdvanced.success('Chart data refreshed', { duration: 1000, theme: 'light' });
            }, 900);
          }}
        >
          Refresh Data
        </Button>

        <Button
          size="sm"
          variant="secondary"
          startIcon={<AlertTriangleIcon size={14} />}
          onClick={() => {
            setState('error');
            toastAdvanced.error('Feed degraded: fallback dataset active', { duration: 1200, theme: 'light' });
          }}
        >
          Simulate Error
        </Button>

        <Button
          size="sm"
          startIcon={<CheckCircleIcon size={14} />}
          onClick={() => {
            setState('success');
            toastAdvanced.success('Pipeline healthy and synchronized', { duration: 1200, theme: 'light' });
          }}
        >
          Mark Healthy
        </Button>
      </Flex>
    </Grid>
  );
}

export const EnterpriseAnalytics = () => <EnterpriseChartDashboard />;

const PlaygroundTemplate = (args: Record<string, unknown>) => (
  <Box style={{ maxInlineSize: 860 }}>
    <Chart
      {...args}
      title="Playground Throughput"
      subtitle="Use controls to test chart states"
      data={throughputSeries}
      onPointSelect={(detail) => {
        toastAdvanced.info(`${detail.label}: ${detail.value}`, { duration: 800, theme: 'light' });
      }}
    />
  </Box>
);

export const Playground = PlaygroundTemplate.bind({});
Playground.args = {
  type: 'line',
  variant: 'default',
  state: 'idle',
  interactive: true,
  showLegend: true,
  showSummary: true,
  disabled: false,
};

export const Contrast = () => (
  <Box variant="contrast" p="12px" radius="lg">
    <Grid style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
      <Chart
        variant="contrast"
        type="area"
        title="Night Shift Throughput"
        subtitle="Last 7 days"
        data={throughputSeries.map((item) => ({ ...item, value: Math.round(item.value * 0.72) }))}
        state="success"
      />
      <Chart
        variant="contrast"
        type="donut"
        title="Incident Categories"
        subtitle="Current month"
        data={[
          { label: 'API', value: 14, tone: '#93c5fd' },
          { label: 'DB', value: 7, tone: '#34d399' },
          { label: 'Infra', value: 4, tone: '#fbbf24' },
        ]}
      />
    </Grid>
  </Box>
);

export const AllTypes = () => (
  <Grid style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
    <Chart type="line" title="Line" subtitle="Daily trend" data={throughputSeries} />
    <Chart type="area" title="Area" subtitle="Volume envelope" data={throughputSeries} />
    <Chart type="step" title="Step" subtitle="Discrete changes" data={throughputSeries} />
    <Chart type="scatter" title="Scatter" subtitle="Point distribution" data={throughputSeries} />
    <Chart type="bar" title="Bar" subtitle="Category compare" data={throughputSeries} />
    <Chart type="donut" title="Donut" subtitle="Share split" data={allocationSeries} />
    <Chart type="radial" title="Radial" subtitle="Multi-axis spread" data={throughputSeries} />
  </Grid>
);
