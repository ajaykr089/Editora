import React from 'react';
import { createRoot } from 'react-dom/client';
import { applySystemTheme, loadIcons } from '@editora/ui-core';
import { Input } from '@editora/ui-react/Input';
import { Select } from '@editora/ui-react/Select';
import { Textarea } from '@editora/ui-react/Textarea';
import { Checkbox } from '@editora/ui-react/Checkbox';
import { Switch } from '@editora/ui-react/Switch';
import { Tabs } from '@editora/ui-react/Tabs';
import { Alert } from '@editora/ui-react/Alert';
import { Button } from '@editora/ui-react/Button';
import { Badge } from '@editora/ui-react/Badge';
import { Card } from '@editora/ui-react/Card';
import { EmptyState } from '@editora/ui-react/EmptyState';
import { Pagination } from '@editora/ui-react/Pagination';

// ?theme=light|dark&density=compact|default|comfortable: one screenshot per combination.
const params = new URLSearchParams(location.search);

const density = (params.get('density') || 'default') as 'compact' | 'default' | 'comfortable';
applySystemTheme(); // follows prefers-color-scheme, which the spec emulates

function Showcase() {
  return (
    <div style={{ display: 'grid', gap: 16, padding: 24, width: 720 }}>
      <Card>
        <Card.Header>
          <Card.Title>Expenses</Card.Title>
          <Card.Description>This month, all accounts</Card.Description>
          <Card.Actions><Button size="sm" variant="secondary">Export</Button><Button size="sm" icon="plus">Add</Button></Card.Actions>
        </Card.Header>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
          <Input label="Payee" description="Who was paid" density={density} defaultValue="Acme Ltd" />
          <Select label="Category" density={density} value="travel" onChange={() => {}}>
            <option value="travel">Travel</option><option value="meals">Meals</option>
          </Select>
          <Textarea label="Notes" density={density} defaultValue="Train tickets" />
          <div style={{ display: 'grid', gap: 8, alignContent: 'start' }}>
            <Checkbox density={density} checked onChange={() => {}}>Billable</Checkbox>
            <Switch checked onChange={() => {}}>Reimbursed</Switch>
          </div>
        </div>
      </Card>
      <Tabs density={density}>
        <Tabs.Tab>Overview</Tabs.Tab><Tabs.Tab>Receipts</Tabs.Tab><Tabs.Tab>History</Tabs.Tab>
        <Tabs.Panel><Alert tone="warning" title="2 receipts missing" description="Upload them before the 30th." live={false} /></Tabs.Panel>
        <Tabs.Panel>-</Tabs.Panel><Tabs.Panel>-</Tabs.Panel>
      </Tabs>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <Button>Save</Button><Button variant="secondary">Cancel</Button><Button variant="ghost">Skip</Button>
        <Badge tone="success">Paid</Badge><Badge tone="warning">Pending</Badge><Badge tone="danger">Rejected</Badge>
      </div>
      <Card><EmptyState variant="plain" title="No receipts yet" description="Upload one to get started." /></Card>
      <Pagination page={2} count={5} />
    </div>
  );
}

loadIcons().then(() => {
  createRoot(document.getElementById('root')!).render(<Showcase />);
  setTimeout(() => { (window as any).ready = true; }, 300);
});
