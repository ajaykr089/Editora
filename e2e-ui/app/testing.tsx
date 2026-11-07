import React from 'react';
import { createRoot } from 'react-dom/client';
import { Select } from '@editora/ui-react/Select';
import { Dropdown } from '@editora/ui-react/Dropdown';
import { Tabs } from '@editora/ui-react/Tabs';
import { Input } from '@editora/ui-react/Input';
import { Checkbox } from '@editora/ui-react/Checkbox';
import { Switch } from '@editora/ui-react/Switch';
import { Form } from '@editora/ui-react/Form';

// A page for the @editora/ui-testing Playwright helpers (tests/ui-testing.spec.ts).
const w = window as any;
w.log = [] as string[];
const log = (entry: string) => w.log.push(entry);

function App() {
  return (
    <>
      <Select label="Role" onChange={(value) => log(`role:${value}`)}>
        <option value="admin">Admin</option>
        <option value="staff">Staff</option>
      </Select>
      <Dropdown onSelect={(detail) => log(`menu:${detail.value}`)}>
        <Dropdown.Trigger>Actions</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item value="export">Export</Dropdown.Item>
          <Dropdown.Item value="archive">Archive</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
      <Tabs onChange={(index) => log(`tab:${index}`)}>
        <Tabs.Tab>Profile</Tabs.Tab>
        <Tabs.Tab>Billing</Tabs.Tab>
        <Tabs.Panel>p</Tabs.Panel>
        <Tabs.Panel>b</Tabs.Panel>
      </Tabs>
      <Form id="form">
        <Input name="email" label="Email" defaultValue="old@x.io" required onCommit={(value) => log(`commit:${value}`)} />
        <Input name="company" label="Company" />
        <Checkbox onChange={(event) => log(`billable:${(event as CustomEvent<{ checked: boolean }>).detail.checked}`)}>Billable</Checkbox>
        <Switch onChange={(detail) => log(`active:${detail.checked}`)}>Active</Switch>
      </Form>
    </>
  );
}
createRoot(document.getElementById('root')!).render(<App />);
