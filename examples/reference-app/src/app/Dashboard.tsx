import React from 'react';
import { Badge } from '@editora/ui-react/Badge';
import { Button } from '@editora/ui-react/Button';
import { Card } from '@editora/ui-react/Card';
import { Chart } from '@editora/ui-react/Chart';
import { PageHeader } from '@editora/ui-react/PageHeader';
import { Skeleton } from '@editora/ui-react/Skeleton';
import { Stat } from '@editora/ui-react/Stat';
import { toastApi } from '@editora/ui-react/ToastAPI';
import { dashboard, decide, money, shortDate, wholeMoney, type Expense } from './api';

type Data = Awaited<ReturnType<typeof dashboard>>;

// Category colours that sit with the brand teal: teal and cyan for the large ones, then amber,
// slate, violet and rose.
const CATEGORY_TONES = ['#0f766e', '#0891b2', '#f59e0b', '#64748b', '#8b5cf6', '#e11d48'];

export function Dashboard() {
  const [data, setData] = React.useState<Data | null>(null);
  const [busy, setBusy] = React.useState<string | null>(null);

  const load = React.useCallback(() => dashboard().then(setData), []);
  React.useEffect(() => { void load(); }, [load]);

  const act = async (expense: Expense, status: 'approved' | 'rejected') => {
    setBusy(expense.id);
    await decide(expense.id, status);
    setBusy(null);
    toastApi.success(`${expense.merchant} ${status === 'approved' ? 'approved' : 'rejected'}`);
    void load();
  };

  return (
    <div className="screen">
      <PageHeader
        eyebrow="June 2026"
        title="Good morning, Maya"
        subtitle="Here is where spend stands this month, and what is waiting for you."
        actions={<Button icon="plus" onClick={() => { window.location.hash = '#/app/expenses/new'; }}>New expense</Button>}
      />

      <div className="stat-row">
        {data ? (
          <>
            <Stat variant="card" label="Spend this month" value={wholeMoney(data.spend)} trend="−6% vs May" tone="success" />
            <Stat variant="card" label="Waiting for approval" value={String(data.waiting)} trend={`${data.overPolicy} over policy`} tone="warning" />
            <Stat variant="card" label="Reimbursed, last 30 days" value={wholeMoney(data.reimbursed)} trend="Next payout Friday" tone="brand" />
            <Stat variant="card" label="Receipts missing" value="3" trend="Chased automatically" tone="neutral" />
          </>
        ) : (
          Array.from({ length: 4 }, (_, i) => <Skeleton key={i} height="96px" radius="var(--base-card-radius)" />)
        )}
      </div>

      <div className="dash-grid">
        <Chart
          type="area"
          headingLevel={2}
          title="Spend by week"
          subtitle="Last eight weeks, all teams"
          values={data ? data.weeks.map((week) => week.value) : []}
          labels={data ? data.weeks.map((week) => week.label) : []}
          valuePrefix="$"
          showLegend={false}
          state={data ? 'idle' : 'loading'}
        />
        <Chart
          type="donut"
          headingLevel={2}
          title="By category"
          subtitle="This month"
          data={data ? data.byCategory.map((point, index) => ({ ...point, tone: CATEGORY_TONES[index % CATEGORY_TONES.length] })) : []}
          valuePrefix="$"
          showSummary={false}
          state={data ? 'idle' : 'loading'}
        />
      </div>

      <Card>
        <Card.Header>
          <Card.Title as="h2">Waiting for you</Card.Title>
          <Card.Description>Approve or reject; the person is told straight away.</Card.Description>
        </Card.Header>
        <ul className="queue">
          {(data?.queue || []).map((expense) => (
            <li key={expense.id} className="queue-row">
              <a className="queue-main" href={`#/app/expenses/${expense.id}`}>
                <span className="cell-title">{expense.merchant}</span>
                <span className="cell-sub">{expense.person} · {expense.category} · {shortDate(expense.date)}</span>
              </a>
              {expense.overPolicy ? <Badge tone="warning" variant="soft" size="sm">Over policy</Badge> : null}
              <span className="num queue-amount">{money(expense.amount, expense.currency)}</span>
              <div className="queue-actions">
                <Button size="sm" variant="secondary" disabled={busy === expense.id} onClick={() => act(expense, 'rejected')}>Reject</Button>
                <Button size="sm" loading={busy === expense.id} onClick={() => act(expense, 'approved')}>Approve</Button>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
