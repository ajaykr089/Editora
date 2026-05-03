import React from 'react';
import {
  Avatar, Badge, Box, Button, Card, Chart, DataTable, Flex, Grid,
  Pagination, ScrollArea, Separator, Skeleton, Table,
} from '@editora/ui-react';
import { CheckCircleIcon, ClockIcon } from '@editora/react-icons';

const panel: React.CSSProperties = { border: '1px solid #e2e8f0', borderRadius: 16, padding: 20, background: '#fff', marginBottom: 20 };
const h2: React.CSSProperties = { fontSize: 22, fontWeight: 700, marginBottom: 16, color: '#0f172a' };
const h3: React.CSSProperties = { fontSize: 15, fontWeight: 650, marginBottom: 12, color: '#334155' };
const tableWrap: React.CSSProperties = { display: 'block', overflow: 'hidden', border: '1px solid #dbe4ef', borderRadius: 12, background: '#fff' };
const tableEl: React.CSSProperties = { width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 14 };
const th: React.CSSProperties = { padding: '12px 14px', textAlign: 'left', fontSize: 12, fontWeight: 750, color: '#475569', background: '#f8fafc', borderBottom: '1px solid #dbe4ef', textTransform: 'uppercase', letterSpacing: '0.04em' };
const td: React.CSSProperties = { padding: '12px 14px', color: '#0f172a', borderBottom: '1px solid #edf2f7', verticalAlign: 'middle' };
const lastRowTd: React.CSSProperties = { ...td, borderBottom: 0 };

export function AvatarDemo() {
  return (
    <div>
      <h2 style={h2}>Avatar</h2>
      <div style={panel}>
        <h3 style={h3}>Sizes</h3>
        <Flex style={{ gap: 12, alignItems: 'center' }}>
          {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => (
            <Avatar key={s} size={s} src="https://i.pravatar.cc/150?img=3" alt="User" fallback="JD" />
          ))}
        </Flex>
      </div>
      <div style={panel}>
        <h3 style={h3}>Fallback & Status</h3>
        <Flex style={{ gap: 12, alignItems: 'center' }}>
          <Avatar fallback="AB" size="md" />
          <Avatar fallback="CD" size="md" tone="success" />
          <Avatar fallback="EF" size="md" tone="warning" />
          <Avatar src="https://i.pravatar.cc/150?img=5" size="md" status="online" />
          <Avatar src="https://i.pravatar.cc/150?img=7" size="md" status="busy" />
          <Avatar src="https://i.pravatar.cc/150?img=9" size="md" status="away" />
        </Flex>
      </div>
    </div>
  );
}

export function BadgeDemo() {
  return (
    <div>
      <h2 style={h2}>Badge</h2>
      <div style={panel}>
        <h3 style={h3}>Variants</h3>
        <Flex style={{ gap: 8, flexWrap: 'wrap' }}>
          {(['surface', 'soft', 'outline', 'solid'] as const).map((v) => (
            <Badge key={v} variant={v} tone="brand">{v}</Badge>
          ))}
        </Flex>
      </div>
      <div style={panel}>
        <h3 style={h3}>Tones</h3>
        <Flex style={{ gap: 8, flexWrap: 'wrap' }}>
          {(['brand', 'neutral', 'info', 'success', 'warning', 'danger'] as const).map((t) => (
            <Badge key={t} variant="soft" tone={t}>{t}</Badge>
          ))}
        </Flex>
      </div>
      <div style={panel}>
        <h3 style={h3}>Sizes</h3>
        <Flex style={{ gap: 8, alignItems: 'center' }}>
          {(['sm', 'md', 'lg'] as const).map((s) => (
            <Badge key={s} variant="soft" tone="info" size={s}>{s}</Badge>
          ))}
        </Flex>
      </div>
    </div>
  );
}

export function CardDemo() {
  return (
    <div>
      <h2 style={h2}>Card</h2>
      <div style={panel}>
        <h3 style={h3}>Variants</h3>
        <Grid style={{ gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))' }}>
          {(['surface', 'soft', 'outline', 'glass'] as const).map((v) => (
            <Card key={v} variant={v} radius={12}>
              <Card.Header>
                <Card.Title>{v}</Card.Title>
                <Card.Description>Card with {v} variant.</Card.Description>
              </Card.Header>
              <Card.Footer>
                <Button size="sm" variant="secondary">Action</Button>
              </Card.Footer>
            </Card>
          ))}
        </Grid>
      </div>
      <div style={panel}>
        <h3 style={h3}>With Media</h3>
        <Grid style={{ gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))' }}>
          <Card variant="surface" radius={12}>
            <Card.Media src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80" alt="Team" />
            <Card.Header>
              <Card.Title>Team dashboard</Card.Title>
              <Card.Description>Monitor your team's performance.</Card.Description>
            </Card.Header>
          </Card>
          <Card variant="surface" radius={12}>
            <Card.Header>
              <Card.Title>Analytics</Card.Title>
              <Card.Description>Real-time data insights.</Card.Description>
            </Card.Header>
            <Card.Inset>
              <Box style={{ height: 80, background: 'linear-gradient(135deg,#eff6ff,#dbeafe)', borderRadius: 8, display: 'grid', placeItems: 'center', fontSize: 13, color: '#2563eb' }}>Chart area</Box>
            </Card.Inset>
            <Card.Footer>
              <Button size="sm">View report</Button>
            </Card.Footer>
          </Card>
        </Grid>
      </div>
    </div>
  );
}

export function TableDemo() {
  const rows = [
    { id: 1, name: 'Alice Johnson', role: 'Engineer', status: 'Active', team: 'Platform' },
    { id: 2, name: 'Bob Smith', role: 'Designer', status: 'Away', team: 'Experience' },
    { id: 3, name: 'Carol White', role: 'Manager', status: 'Active', team: 'Operations' },
    { id: 4, name: 'David Brown', role: 'Engineer', status: 'Inactive', team: 'Infrastructure' },
  ];
  return (
    <div>
      <h2 style={h2}>Table</h2>
      <div style={panel}>
        <h3 style={h3}>Styled table wrapper</h3>
        <Table hover striped bordered style={tableWrap}>
          <table style={tableEl}>
            <thead>
              <tr>
                <th style={th}>Name</th><th style={th}>Role</th><th style={th}>Team</th><th style={th}>Status</th><th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, index) => (
                <tr key={r.id} style={{ background: index % 2 ? '#fbfdff' : '#fff' }}>
                  <td style={index === rows.length - 1 ? lastRowTd : td}>{r.name}</td>
                  <td style={index === rows.length - 1 ? lastRowTd : td}>{r.role}</td>
                  <td style={index === rows.length - 1 ? lastRowTd : td}>{r.team}</td>
                  <td style={index === rows.length - 1 ? lastRowTd : td}>
                    <Badge variant="soft" tone={r.status === 'Active' ? 'success' : r.status === 'Away' ? 'warning' : 'neutral'} size="sm">{r.status}</Badge>
                  </td>
                  <td style={index === rows.length - 1 ? lastRowTd : td}><Button size="sm" variant="ghost">Edit</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Table>
      </div>
      <div style={panel}>
        <h3 style={h3}>Sortable + selectable</h3>
        <Table
          sortable
          selectable
          multiSelect
          hover
          striped
          style={tableWrap}
          onSortChange={(detail: any) => console.log('table sort', detail)}
          onRowSelect={(detail: any) => console.log('table rows', detail.indices)}
        >
          <table style={tableEl}>
            <thead>
              <tr>
                <th style={th} data-key="name" data-sortable="true">Name</th>
                <th style={th} data-key="role" data-sortable="true">Role</th>
                <th style={th} data-key="team" data-sortable="true">Team</th>
                <th style={th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, index) => (
                <tr key={r.id}>
                  <td style={index === rows.length - 1 ? lastRowTd : td}>{r.name}</td>
                  <td style={index === rows.length - 1 ? lastRowTd : td}>{r.role}</td>
                  <td style={index === rows.length - 1 ? lastRowTd : td}>{r.team}</td>
                  <td style={index === rows.length - 1 ? lastRowTd : td}>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Table>
      </div>
      <div style={panel}>
        <h3 style={h3}>Bordered + compact</h3>
        <Table bordered compact style={tableWrap}>
          <table style={tableEl}>
            <thead><tr><th style={th}>Key</th><th style={th}>Value</th></tr></thead>
            <tbody>
              {[['Version', '0.1.13'], ['License', 'MIT'], ['Framework', 'React 18'], ['Language', 'TypeScript 5']].map(([k, v], index, items) => (
                <tr key={k}><td style={index === items.length - 1 ? lastRowTd : td}>{k}</td><td style={index === items.length - 1 ? lastRowTd : td}>{v}</td></tr>
              ))}
            </tbody>
          </table>
        </Table>
      </div>
    </div>
  );
}

export function DataTableDemo() {
  const [page, setPage] = React.useState(1);
  const rows = [
    { id: 1001, project: 'Editor shell', owner: 'Maya', status: 'Active', risk: 'Low', due: '2026-02-14' },
    { id: 1002, project: 'Plugin catalog', owner: 'Noah', status: 'Review', risk: 'Medium', due: '2026-02-18' },
    { id: 1003, project: 'Design tokens', owner: 'Ava', status: 'Active', risk: 'Low', due: '2026-02-21' },
    { id: 1004, project: 'Docs recipes', owner: 'Nia', status: 'Blocked', risk: 'High', due: '2026-02-25' },
    { id: 1005, project: 'Release QA', owner: 'Omar', status: 'Ready', risk: 'Medium', due: '2026-03-01' },
    { id: 1006, project: 'Accessibility audit', owner: 'Iris', status: 'Active', risk: 'Low', due: '2026-03-04' },
  ];

  return (
    <div>
      <h2 style={h2}>DataTable</h2>
      <div style={panel}>
        <h3 style={h3}>Interactive data grid</h3>
        <DataTable
          sortable
          selectable
          multiSelect
          striped
          hover
          bordered
          stickyHeader
          page={page}
          pageSize={4}
          paginationId="sandbox-data-table-pager"
          filterQuery=""
          style={{ ...tableWrap, overflow: 'auto' }}
          onPageChange={(detail: any) => setPage(detail.page)}
          onSortChange={(detail: any) => console.log('data-table sort', detail)}
          onRowSelect={(detail: any) => console.log('data-table rows', detail.indices)}
        >
          <table style={tableEl}>
            <caption style={{ padding: '12px 14px', textAlign: 'left', color: '#64748b', fontSize: 13 }}>Project portfolio, selectable and sortable</caption>
            <thead>
              <tr>
                <th style={th} data-key="id" data-sortable="true">ID</th>
                <th style={th} data-key="project" data-sortable="true">Project</th>
                <th style={th} data-key="owner" data-sortable="true">Owner</th>
                <th style={th} data-key="status" data-sortable="true">Status</th>
                <th style={th} data-key="risk" data-sortable="true">Risk</th>
                <th style={th} data-key="due" data-sortable="true">Due</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, index) => (
                <tr key={r.id}>
                  <td style={index === rows.length - 1 ? lastRowTd : td}>{r.id}</td>
                  <td style={index === rows.length - 1 ? lastRowTd : td}>{r.project}</td>
                  <td style={index === rows.length - 1 ? lastRowTd : td}>{r.owner}</td>
                  <td style={index === rows.length - 1 ? lastRowTd : td}>
                    <Badge variant="soft" tone={r.status === 'Blocked' ? 'danger' : r.status === 'Review' ? 'warning' : 'success'} size="sm">{r.status}</Badge>
                  </td>
                  <td style={index === rows.length - 1 ? lastRowTd : td}>{r.risk}</td>
                  <td style={index === rows.length - 1 ? lastRowTd : td}>{r.due}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DataTable>
        <div style={{ marginTop: 12 }}>
          <Pagination id="sandbox-data-table-pager" page={page} count={2} onPageChange={(detail) => setPage(detail.page)} />
        </div>
      </div>
      <div style={panel}>
        <h3 style={h3}>States and variants</h3>
        <Grid style={{ gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <DataTable state="loading" stateText="Loading records..." style={{ minHeight: 120 }} />
          <DataTable state="error" stateText="Could not load records" style={{ minHeight: 120 }} />
          <DataTable state="success" stateText="All records synced" style={{ minHeight: 120 }} />
        </Grid>
      </div>
    </div>
  );
}

export function SkeletonDemo() {
  return (
    <div>
      <h2 style={h2}>Skeleton</h2>
      <div style={panel}>
        <h3 style={h3}>Card skeleton</h3>
        <Grid style={{ gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))' }}>
          {[1, 2, 3].map((i) => (
            <Box key={i} style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
              <Skeleton style={{ height: 120, borderRadius: 8, marginBottom: 12 }} />
              <Skeleton style={{ height: 16, width: '70%', borderRadius: 4, marginBottom: 8 }} />
              <Skeleton style={{ height: 12, width: '90%', borderRadius: 4, marginBottom: 6 }} />
              <Skeleton style={{ height: 12, width: '60%', borderRadius: 4 }} />
            </Box>
          ))}
        </Grid>
      </div>
      <div style={panel}>
        <h3 style={h3}>Text skeleton</h3>
        <Grid style={{ gap: 8 }}>
          <Skeleton style={{ height: 24, width: '40%', borderRadius: 4 }} />
          <Skeleton style={{ height: 14, width: '100%', borderRadius: 4 }} />
          <Skeleton style={{ height: 14, width: '85%', borderRadius: 4 }} />
          <Skeleton style={{ height: 14, width: '92%', borderRadius: 4 }} />
        </Grid>
      </div>
    </div>
  );
}

export function ScrollAreaDemo() {
  return (
    <div>
      <h2 style={h2}>ScrollArea</h2>
      <div style={panel}>
        <ScrollArea style={{ height: 200, border: '1px solid #e2e8f0', borderRadius: 10 }}>
          <Box style={{ padding: 16 }}>
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: 14, color: '#475569' }}>
                List item {i + 1} — scrollable content
              </div>
            ))}
          </Box>
        </ScrollArea>
      </div>
    </div>
  );
}



export function ChartDemo() {
  const [type, setType] = React.useState<'line' | 'area' | 'bar' | 'donut' | 'step' | 'scatter' | 'radial'>('line');

  const throughput = [
    { label: 'Mon', value: 182 },
    { label: 'Tue', value: 214 },
    { label: 'Wed', value: 201 },
    { label: 'Thu', value: 236 },
    { label: 'Fri', value: 263 },
    { label: 'Sat', value: 191 },
    { label: 'Sun', value: 208 },
  ];

  const allocation = [
    { label: 'Inpatient', value: 42, tone: '#2563eb' },
    { label: 'Outpatient', value: 33, tone: '#16a34a' },
    { label: 'Pharmacy', value: 15, tone: '#d97706' },
    { label: 'Labs', value: 10, tone: '#dc2626' },
  ];

  const margin = [
    { label: 'Jan', value: 12 },
    { label: 'Feb', value: -4 },
    { label: 'Mar', value: 8 },
    { label: 'Apr', value: 16 },
    { label: 'May', value: -2 },
    { label: 'Jun', value: 10 },
  ];

  return (
    <div>
      <h2 style={h2}>Chart</h2>

      <div style={panel}>
        <h3 style={h3}>All chart types</h3>
        <Grid style={{ gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))' }}>
          <Chart type="line" title="Line" subtitle="Daily trend" data={throughput} />
          <Chart type="area" title="Area" subtitle="Volume envelope" data={throughput} />
          <Chart type="bar" title="Bar" subtitle="Category compare" data={throughput} />
          <Chart type="donut" title="Donut" subtitle="Share split" data={allocation} />
          <Chart type="step" title="Step" subtitle="Discrete changes" data={throughput} />
          <Chart type="radial" title="Radial" subtitle="Multi-axis spread" data={throughput} />
        </Grid>
      </div>

      <div style={panel}>
        <h3 style={h3}>Interactive — switch type</h3>
        <Flex style={{ gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
          {(['line', 'area', 'bar', 'donut', 'step', 'scatter', 'radial'] as const).map((t) => (
            <Button key={t} size="sm" variant={type === t ? 'primary' : 'secondary'} onClick={() => setType(t)}>
              {t}
            </Button>
          ))}
        </Flex>
        <Chart
          type={type}
          title="Patient Throughput"
          subtitle="Visits per day — click a point"
          data={throughput}
          showLegend
          showSummary
          interactive
        />
      </div>

      <div style={panel}>
        <h3 style={h3}>Margin variance (bar with negatives)</h3>
        <Chart type="bar" title="Monthly Margin Variance" subtitle="Positive and negative movement" data={margin} />
      </div>

      <div style={panel}>
        <h3 style={h3}>Contrast variant</h3>
        <Box variant="contrast" p="12px" radius="lg">
          <Grid style={{ gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))' }}>
            <Chart variant="contrast" type="area" title="Night Shift Throughput" subtitle="Last 7 days" data={throughput} />
            <Chart variant="contrast" type="donut" title="Service Allocation" subtitle="Current month" data={allocation} />
          </Grid>
        </Box>
      </div>
    </div>
  );
}
