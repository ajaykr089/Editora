import React from 'react';
import { Badge } from '@editora/ui-react/Badge';
import { Breadcrumb } from '@editora/ui-react/Breadcrumb';
import { Button } from '@editora/ui-react/Button';
import { Card } from '@editora/ui-react/Card';
import { EmptyState } from '@editora/ui-react/EmptyState';
import { PageHeader } from '@editora/ui-react/PageHeader';
import { Skeleton } from '@editora/ui-react/Skeleton';
import { Tabs } from '@editora/ui-react/Tabs';
import { Timeline } from '@editora/ui-react/Timeline';
import { useAlertDialog } from '@editora/ui-react/AlertDialogProvider';
import { toastApi } from '@editora/ui-react/ToastAPI';
import { decide, getExpense, money, shortDate, STATUS_LABEL, STATUS_TONE, type Expense } from './api';

export function ExpenseDetail({ id }: { id: string }) {
  const [expense, setExpense] = React.useState<Expense | null | undefined>(undefined);
  const [busy, setBusy] = React.useState(false);
  const dialogs = useAlertDialog();

  React.useEffect(() => {
    let current = true;
    setExpense(undefined);
    getExpense(id).then((found) => { if (current) setExpense(found); });
    return () => { current = false; };
  }, [id]);

  if (expense === null) {
    return (
      <div className="screen">
        <EmptyState title="Expense not found" description={`There is no expense ${id}. It may have been deleted.`}>
          <Button onClick={() => { window.location.hash = '#/app/expenses'; }}>Back to expenses</Button>
        </EmptyState>
      </div>
    );
  }

  const act = async (status: 'approved' | 'rejected') => {
    if (!expense) return;
    if (status === 'rejected') {
      const answer = await dialogs.confirm({
        title: `Reject ${expense.merchant}?`,
        description: `${expense.person} will be told and can edit and resubmit it.`,
        confirmText: 'Reject expense',
        cancelText: 'Keep it',
        tone: 'danger',
      });
      if (answer.action !== 'confirm') return;
    }
    setBusy(true);
    setExpense(await decide(expense.id, status));
    setBusy(false);
    toastApi.success(status === 'approved' ? 'Expense approved' : 'Expense rejected');
  };

  return (
    <div className="screen">
      <Breadcrumb>
        <Breadcrumb.Item href="#/app/expenses">Expenses</Breadcrumb.Item>
        <Breadcrumb.Item>{id}</Breadcrumb.Item>
      </Breadcrumb>

      <PageHeader
        eyebrow={id}
        title={expense ? expense.merchant : 'Loading…'}
        subtitle={expense ? `${expense.person} · ${expense.team} · ${shortDate(expense.date)}` : ' '}
        actions={
          expense?.status === 'submitted' ? (
            <>
              <Button variant="secondary" disabled={busy} onClick={() => act('rejected')}>Reject</Button>
              <Button loading={busy} onClick={() => act('approved')}>Approve</Button>
            </>
          ) : null
        }
      />

      {expense ? (
        <div className="detail-grid">
          <Card>
            <Card.Header>
              <Card.Title as="h2">{money(expense.amount, expense.currency)}</Card.Title>
              <Card.Description>
                <Badge tone={STATUS_TONE[expense.status]} variant="soft" size="sm">{STATUS_LABEL[expense.status]}</Badge>
                {expense.overPolicy ? <> <Badge tone="warning" variant="soft" size="sm">Over policy</Badge></> : null}
              </Card.Description>
            </Card.Header>
            <Tabs>
              <Tabs.Tab>Details</Tabs.Tab>
              <Tabs.Tab>Receipt</Tabs.Tab>
              <Tabs.Tab>History</Tabs.Tab>
              <Tabs.Panel>
                <dl className="facts">
                  <div><dt>Category</dt><dd>{expense.category}</dd></div>
                  <div><dt>Merchant</dt><dd>{expense.merchant}</dd></div>
                  <div><dt>Date</dt><dd>{shortDate(expense.date)} 2026</dd></div>
                  <div><dt>Paid with</dt><dd>Company card ···· 4417</dd></div>
                  <div><dt>Team</dt><dd>{expense.team}</dd></div>
                  <div><dt>Policy</dt><dd>{expense.overPolicy ? 'Above the category limit: needs a reason' : 'Within policy'}</dd></div>
                </dl>
              </Tabs.Panel>
              <Tabs.Panel>
                <div className="receipt" role="img" aria-label={`Receipt from ${expense.merchant}`}>
                  <span className="receipt-merchant">{expense.merchant}</span>
                  <span>{shortDate(expense.date)} 2026</span>
                  <span className="receipt-total">{money(expense.amount, expense.currency)}</span>
                </div>
              </Tabs.Panel>
              <Tabs.Panel>
                <Timeline
                  items={[
                    { title: 'Submitted', description: `${expense.person} submitted it`, time: shortDate(expense.date) },
                    { title: 'Card payment matched', description: 'Matched automatically', time: shortDate(expense.date), tone: 'info' },
                    ...(expense.status === 'approved' || expense.status === 'reimbursed' ? [{ title: 'Approved', description: 'By Maya Chen', time: 'Jun 18', tone: 'success' as const }] : []),
                    ...(expense.status === 'rejected' ? [{ title: 'Rejected', description: 'By Maya Chen', time: 'Jun 18', tone: 'danger' as const }] : []),
                    ...(expense.status === 'reimbursed' ? [{ title: 'Reimbursed', description: 'Paid in the Friday batch', time: 'Jun 13', tone: 'success' as const }] : []),
                  ]}
                />
              </Tabs.Panel>
            </Tabs>
          </Card>
          <Card>
            <Card.Header>
              <Card.Title as="h2">Approval</Card.Title>
              <Card.Description>{expense.amount > 500 ? 'Rule: over $500 goes to the team lead and finance.' : 'Rule: up to $500 goes to the team lead.'}</Card.Description>
            </Card.Header>
            <p className="muted approval-note">
              {expense.status === 'submitted' ? 'Waiting for you.' : `Decision: ${STATUS_LABEL[expense.status].toLowerCase()}.`}
            </p>
          </Card>
        </div>
      ) : (
        <Skeleton height="320px" radius="var(--base-card-radius)" />
      )}
    </div>
  );
}
