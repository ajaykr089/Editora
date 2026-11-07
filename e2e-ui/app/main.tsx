import React from 'react';
import { createRoot } from 'react-dom/client';
import { Tabs } from '@editora/ui-react/Tabs';
import { Select } from '@editora/ui-react/Select';
import { Pagination } from '@editora/ui-react/Pagination';
import { Card } from '@editora/ui-react/Card';
import { Sidebar } from '@editora/ui-react/Sidebar';
import { Dropdown } from '@editora/ui-react/Dropdown';
import { Dialog } from '@editora/ui-react/Dialog';
import { Input } from '@editora/ui-react/Input';
const w = window as any;
w.log = { tabChanges: [] as any[], navigated: [] as string[], submits: [] as any[] };
function App() {
  const [n, setN] = React.useState(0);
  const [kind, setKind] = React.useState('');
  w.bump = () => setN((v) => v + 1);
  return (
    <div>
      <Tabs id="tabs" onChange={(i) => w.log.tabChanges.push(i)}>
        <Tabs.Tab>One</Tabs.Tab><Tabs.Tab>Two</Tabs.Tab><Tabs.Tab>Three</Tabs.Tab>
        <Tabs.Panel><label><input id="box" type="checkbox" /> Remember</label> <span>{n}</span></Tabs.Panel>
        <Tabs.Panel>{Array.from({ length: n % 4 }, (_, i) => <p key={i}>row {i}</p>)} two {n}</Tabs.Panel>
        <Tabs.Panel>three</Tabs.Panel>
      </Tabs>
      <Select id="sel" label="Kind" placeholder="Pick one" value={kind} onChange={setKind}>
        <option value="a">Alpha</option><option value="b">Beta</option>
      </Select>
      <Pagination id="pager" page={1} count={3} />
      <Card id="card"><Card.Header><Card.Title>Title</Card.Title></Card.Header><Card.Inset><div id="inset">INSET</div></Card.Inset></Card>
      <Sidebar id="side" onNavigate={(d) => { d.preventDefault(); w.log.navigated.push(d.href); }}>
        <Sidebar.Group title="Main"><Sidebar.Item value="home" label="Home" href="/home" /><Sidebar.Item value="reports" label="Reports" href="/reports" /></Sidebar.Group>
      </Sidebar>
      <Dropdown id="dd"><button slot="trigger">Actions</button><div slot="content"><button role="menuitem">Export</button><button role="menuitem">Archive</button></div></Dropdown>
      <Dialog id="dlg" open={false} title="Edit item">Body</Dialog>
      <form id="f" onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); w.log.submits.push({ submitter: (e.nativeEvent as SubmitEvent).submitter?.textContent, email: fd.get('email') }); }}>
        <fieldset id="fs"><Input id="email" name="email" label="Email" value="first@example.com" /></fieldset>
        <Input id="req" name="req" label="Required" required />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
createRoot(document.getElementById('root')!).render(<App />);
