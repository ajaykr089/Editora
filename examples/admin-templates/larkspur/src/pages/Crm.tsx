import React from 'react';
import { Avatar } from '@editora/ui-react/Avatar';
import { Badge } from '@editora/ui-react/Badge';
import { Card } from '@editora/ui-react/Card';
import { Chart } from '@editora/ui-react/Chart';
import { Checkbox } from '@editora/ui-react/Checkbox';
import { DataTable } from '@editora/ui-react/DataTable';
import { PageHeader } from '@editora/ui-react/PageHeader';
import { Select } from '@editora/ui-react/Select';
import { Stat } from '@editora/ui-react/Stat';
import { toastApi } from '@editora/ui-react/ToastAPI';
import { DEAL_STAGES, crmSummary, initials, moveDeal, shortDate, TODAY, wholeMoney, type DealStage } from '../../../shared/data';
import { useLoad } from '../lib/ui';
import { useTitle } from '../lib/router';

const STAGE_TONE: Record<DealStage, 'neutral' | 'info' | 'brand' | 'warning' | 'success' | 'danger'> = {
  lead: 'neutral', qualified: 'info', proposal: 'brand', negotiation: 'warning', won: 'success', lost: 'danger',
};

export function Crm() {
  useTitle('CRM');
  const { data, reload } = useLoad(crmSummary, []);
  const [done, setDone] = React.useState<Record<string, boolean>>({});

  const changeStage = async (id: string, stage: DealStage) => {
    const result = await moveDeal(id, stage);
    if (result.ok) {
      toastApi.success(`${result.deal.title} moved to ${DEAL_STAGES.find((s) => s.value === stage)!.label}`);
      reload();
    }
  };

  return (
    <div className="lk-screen">
      <PageHeader title="CRM" subtitle="Wholesale deals and what needs doing this week." />

      <div className="lk-stats">
        <Stat variant="card" label="Open pipeline" value={data ? wholeMoney(data.pipeline) : '…'} trend="All open deals" tone="brand" icon="target" />
        <Stat variant="card" label="Weighted forecast" value={data ? wholeMoney(data.weighted) : '…'} trend="Value × stage probability" tone="info" icon="trending-up" />
        <Stat variant="card" label="Won this quarter" value={data ? wholeMoney(data.won) : '…'} trend="Closed and signed" tone="success" icon="check-circle" />
        <Stat variant="card" label="Win rate" value={data ? `${Math.round(data.winRate * 100)}%` : '…'} trend="Won of closed deals" tone="neutral" icon="activity" />
      </div>

      <div className="lk-grid-3">
        <Chart
          className="lk-span-2"
          type="bar"
          headingLevel={2}
          title="Pipeline by stage"
          subtitle="Total deal value"
          data={data?.byStage || []}
          valuePrefix="$"
          showLegend={false}
          showSummary={false}
          state={data ? 'idle' : 'loading'}
        />
        <Card>
          <Card.Header>
            <Card.Title as="h2">Tasks</Card.Title>
            <Card.Description>{data ? `${data.tasks.filter((t) => !(done[t.id] ?? t.done)).length} left` : 'Loading'}</Card.Description>
          </Card.Header>
          <ul className="lk-list lk-tasks">
            {(data?.tasks || []).map((task) => {
              const checked = done[task.id] ?? task.done;
              const overdue = !checked && task.due < TODAY;
              return (
                <li key={task.id} className={checked ? 'lk-row is-done' : 'lk-row'}>
                  <Checkbox checked={checked} onCheckedChange={(next) => setDone((all) => ({ ...all, [task.id]: next }))}>
                    {task.title}
                  </Checkbox>
                  <span className={overdue ? 'cell-sub cell-warn' : 'cell-sub'}>{task.due === TODAY ? 'Today' : shortDate(task.due)}</span>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <Card>
        <Card.Header>
          <Card.Title as="h2">Deals</Card.Title>
          <Card.Description>Change a stage and the forecast updates.</Card.Description>
        </Card.Header>
        <DataTable sortable hover aria-label="Deals" elevation="none" variant="flat" page={1} pageSize={10} state={data ? 'idle' : 'loading'}>
          <table>
            <thead>
              <tr><th data-key="title">Deal</th><th data-key="owner">Owner</th><th data-key="value">Value</th><th data-key="close">Close date</th><th>Stage</th></tr>
            </thead>
            <tbody>
              {(data?.deals || []).map((deal) => (
                <tr key={deal.id}>
                  <td><span className="cell-title">{deal.title}</span><span className="cell-sub">{deal.company}</span></td>
                  <td>
                    <span className="lk-person">
                      <Avatar initials={initials(deal.owner)} size="sm" alt="" variant="soft" tone="neutral" />
                      {deal.owner}
                    </span>
                  </td>
                  <td data-align="end" data-value={deal.value}>{wholeMoney(deal.value)}</td>
                  <td data-value={deal.closeDate}>{shortDate(deal.closeDate)}</td>
                  <td>
                    {deal.stage === 'won' || deal.stage === 'lost' ? (
                      <Badge tone={STAGE_TONE[deal.stage]} variant="soft" size="sm">{deal.stage === 'won' ? 'Won' : 'Lost'}</Badge>
                    ) : (
                      <Select size="sm" value={deal.stage} aria-label={`Stage of ${deal.title}`} onChange={(value) => changeStage(deal.id, value as DealStage)}>
                        {DEAL_STAGES.map((stage) => <option key={stage.value} value={stage.value}>{stage.label}</option>)}
                      </Select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </DataTable>
      </Card>
    </div>
  );
}
