// block: A dashboard overview: four metric cards, a revenue chart and recent activity.
import * as React from 'react';
import { Badge, Box, Card, Chart, Heading, Item, ItemGroup, Text } from '@editora/ui-react';

export type DashboardMetric = { label: string; value: string; change: string; positive?: boolean };
export type DashboardActivity = { title: string; detail: string; status: 'paid' | 'pending' | 'failed' };

export type DashboardBlockProps = {
  metrics?: DashboardMetric[];
  revenue?: Array<{ label: string; value: number }>;
  activity?: DashboardActivity[];
};

const DEFAULT_METRICS: DashboardMetric[] = [
  { label: 'Revenue', value: '$48,200', change: '+12.4%', positive: true },
  { label: 'Customers', value: '1,284', change: '+3.1%', positive: true },
  { label: 'Churn', value: '1.8%', change: '+0.2%', positive: false },
  { label: 'Open tickets', value: '23', change: '-8', positive: true },
];
const DEFAULT_REVENUE = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((label, index) => ({ label, value: [31, 34, 33, 39, 44, 48][index] }));
const DEFAULT_ACTIVITY: DashboardActivity[] = [
  { title: 'Invoice #1042', detail: 'Acme Corp, $1,200', status: 'paid' },
  { title: 'Invoice #1043', detail: 'Globex, $860', status: 'pending' },
  { title: 'Invoice #1044', detail: 'Initech, $430', status: 'failed' },
];
const STATUS_TONE = { paid: 'success', pending: 'warning', failed: 'danger' } as const;

/** A dashboard overview: four metric cards, a revenue chart and recent activity. */
export function DashboardBlock({ metrics = DEFAULT_METRICS, revenue = DEFAULT_REVENUE, activity = DEFAULT_ACTIVITY }: DashboardBlockProps) {
  return (
    <Box style={{ display: 'grid', gap: 16, padding: 16 }}>
      <Heading level={1} size="2xl">Overview</Heading>
      <Box style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        {metrics.map((metric) => (
          <Card key={metric.label} size="sm">
            <Text variant="muted" size="sm">{metric.label}</Text>
            <Text style={{ fontSize: 24, fontWeight: 650 }}>{metric.value}</Text>
            <Text size="sm" tone={metric.positive ? 'success' : 'danger'}>{metric.change} from last month</Text>
          </Card>
        ))}
      </Box>
      {/* A section heading keeps the outline whole: the chart and card titles below are level 3. */}
      <Heading level={2} size="md">Performance</Heading>
      <Box style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <Chart type="area" title="Revenue" subtitle="Last six months, $k" data={revenue} valuePrefix="$" valueSuffix="k" showLegend={false} />
        <Card>
          <Card.Header>
            <Card.Title>Recent activity</Card.Title>
          </Card.Header>
          <ItemGroup divided>
            {activity.map((entry) => (
              <Item key={entry.title} label={entry.title} description={entry.detail} size="sm">
                <Badge slot="actions" tone={STATUS_TONE[entry.status]}>{entry.status}</Badge>
              </Item>
            ))}
          </ItemGroup>
        </Card>
      </Box>
    </Box>
  );
}

export default DashboardBlock;
