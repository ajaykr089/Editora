import React from 'react';
import { Box, Button, Chart, Flex, Grid, Input, Select } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import { PageHeader } from '@/shared/components/PageHeader';
import { ErrorStateView, TableSkeleton } from '@/shared/components/StateViews';
import { useReportsQuery } from '@/shared/query/hooks';

export default function ReportsPage() {
  const [from, setFrom] = React.useState(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10));
  const [to, setTo] = React.useState(new Date().toISOString().slice(0, 10));
  const [department, setDepartment] = React.useState('all');
  const [doctor, setDoctor] = React.useState('all');

  const query = useReportsQuery({
    from,
    to,
    department: department === 'all' ? undefined : department,
    doctor: doctor === 'all' ? undefined : doctor
  });

  if (query.isLoading) return <TableSkeleton />;
  if (query.isError || !query.data) {
    return <ErrorStateView description={(query.error as Error)?.message} onRetry={() => query.refetch()} />;
  }

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <PageHeader
        title="Reports"
        subtitle="Date and department-driven operational reporting with CSV export."
        actions={[
          {
            label: 'Export CSV',
            onClick: () => {
              const rows = (query.data.rows as Array<{ metric: string; value: string }>).map((row) => `${row.metric},${row.value}`).join('\n');
              const csv = `metric,value\n${rows}`;
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `hospital-report-${Date.now()}.csv`;
              a.click();
              URL.revokeObjectURL(url);
              toastAdvanced.success('CSV exported', { position: 'top-right', theme: 'light' });
            },
            icon: 'download'
          }
        ]}
      />

      <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8 }}>
        <Input type="date" label="From" value={from} onChange={(next) => setFrom(String((next as any)?.target?.value ?? next))} />
        <Input type="date" label="To" value={to} onChange={(next) => setTo(String((next as any)?.target?.value ?? next))} />
        <Select label="Department" value={department} onChange={(next) => setDepartment(String((next as any)?.target?.value ?? next))}>
          <option value="all">All departments</option>
          <option value="Cardiology">Cardiology</option>
          <option value="Orthopedics">Orthopedics</option>
          <option value="Pediatrics">Pediatrics</option>
          <option value="Laboratory">Laboratory</option>
        </Select>
        <Select label="Doctor" value={doctor} onChange={(next) => setDoctor(String((next as any)?.target?.value ?? next))}>
          <option value="all">All doctors</option>
          <option value="Dr/Staff 1">Dr/Staff 1</option>
          <option value="Dr/Staff 2">Dr/Staff 2</option>
          <option value="Dr/Staff 3">Dr/Staff 3</option>
        </Select>
      </Grid>

      <Grid style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 12 }}>
        <Box variant="surface" p="12px" radius="lg" style={{ border: '1px solid var(--ui-color-border, #dbe4ef)' }}>
          <Box style={{ fontWeight: 700, marginBottom: 8 }}>Prebuilt report matrix</Box>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {(query.data.rows as Array<{ metric: string; value: string }>).map((row) => (
                <tr key={row.metric}>
                  <td style={{ padding: '8px 6px', borderBottom: '1px solid #e2e8f0' }}>{row.metric}</td>
                  <td style={{ padding: '8px 6px', borderBottom: '1px solid #e2e8f0', textAlign: 'right', fontWeight: 700 }}>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>

        <Box variant="surface" p="12px" radius="lg" style={{ border: '1px solid var(--ui-color-border, #dbe4ef)', display: 'grid', gap: 10 }}>
          <Chart
            title="Revenue summary"
            subtitle="Synthetic weekly trend"
            type="bar"
            data={[
              { label: 'Mon', value: 12 },
              { label: 'Tue', value: 16 },
              { label: 'Wed', value: 14 },
              { label: 'Thu', value: 18 },
              { label: 'Fri', value: 21 },
              { label: 'Sat', value: 11 },
              { label: 'Sun', value: 9 }
            ]}
          />
          <Flex justify="space-between" style={{ gap: 8 }}>
            <Button size="sm" variant="secondary" onClick={() => toastAdvanced.info('PDF export opened')}>Export PDF</Button>
            <Button size="sm" variant="ghost" onClick={() => query.refetch()}>Refresh data</Button>
          </Flex>
        </Box>
      </Grid>
    </Grid>
  );
}
