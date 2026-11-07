import React from 'react';
import { createRoot } from 'react-dom/client';
import { Tabs } from '@editora/ui-react/Tabs';
import { Select } from '@editora/ui-react/Select';
import { Dropdown } from '@editora/ui-react/Dropdown';
import { Dialog } from '@editora/ui-react/Dialog';
import { Combobox } from '@editora/ui-react/Combobox';

function App() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Tabs id="tabs" aria-label="Sections">
        <Tabs.Tab>One</Tabs.Tab><Tabs.Tab>Two</Tabs.Tab><Tabs.Tab>Three</Tabs.Tab>
        <Tabs.Panel>1</Tabs.Panel><Tabs.Panel>2</Tabs.Panel><Tabs.Panel>3</Tabs.Panel>
      </Tabs>
      <Select id="sel" label="Fruit">
        <option value="apple">Apple</option><option value="banana">Banana</option><option value="cherry">Cherry</option>
      </Select>
      <Dropdown id="dd">
        <button slot="trigger">Actions</button>
        <div slot="content"><button role="menuitem">Edit</button><button role="menuitem">Duplicate</button><button role="menuitem">Delete</button></div>
      </Dropdown>
      <button id="opener" onClick={() => setOpen(true)}>Open dialog</button>
      <Dialog id="dlg" open={open} title="Edit item" onClose={() => setOpen(false)}>
        <input id="first" aria-label="Name" /><input id="second" aria-label="Notes" />
      </Dialog>
      <Combobox id="cb" label="City">
        <option value="berlin">Berlin</option><option value="boston">Boston</option><option value="paris">Paris</option>
      </Combobox>
    </>
  );
}
createRoot(document.getElementById('root')!).render(<App />);
