import React from 'react';
import { createRoot } from 'react-dom/client';
import { DatePicker } from '@editora/ui-react/DatePicker';
import { DateRangePicker } from '@editora/ui-react/DateRangePicker';
import { Chart } from '@editora/ui-react/Chart';
import { Dropdown } from '@editora/ui-react/Dropdown';
import { Sidebar } from '@editora/ui-react/Sidebar';
import { Input } from '@editora/ui-react/Input';
import { Select } from '@editora/ui-react/Select';
import { Textarea } from '@editora/ui-react/Textarea';

// Regressions from an app team's feedback list: pickers in a narrow filter column, inside a
// wrapper that sets its own theme colours (as a scoped theme does), over a busy background.
function App() {
  return (
    <>
      <section id="filters" className="stripes" style={{ ['--ui-color-primary' as string]: 'rgb(124, 58, 237)', ['--ui-color-surface' as string]: 'rgb(253, 244, 255)', ['--color-panel-solid' as string]: 'rgb(253, 244, 255)' }}>
        <div style={{ width: 176 }}>
          <DatePicker id="from" label="From" clearable={false} defaultValue="2026-11-08" />
        </div>
        <div style={{ width: 176 }}>
          <DatePicker id="to" label="To" defaultValue="2026-11-08" />
        </div>
        <div style={{ width: 176 }}>
          <DateRangePicker id="period" label="Period" clearable={false} />
        </div>
      </section>
      <p id="behind">Cash received</p>

      {/* An INR expense card: narrow, Indian digit grouping from lang, no title, summary off. */}
      <section lang="en-IN" style={{ width: 300 }}>
        <Chart id="spend" type="line" valuePrefix="₹" showSummary={false} values={[150, 0, 900, 100000]} labels={['Mon', 'Tue', 'Wed', 'Thu']} showTable />
        <Chart id="flat" type="line" valuePrefix="₹" values={[0, 0, 0]} labels={['a', 'b', 'c']} />
        <Chart id="tones" type="bar" series={[{ name: 'In', tone: 'success', data: [{ label: 'a', value: 3 }] }, { name: 'Out', tone: 'danger', data: [{ label: 'a', value: 2 }] }]} />
      </section>

      <div style={{ position: 'fixed', top: 8, right: 8 }}>
        <Dropdown id="menu">
          <Dropdown.Trigger>Account</Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Item value="profile">Profile and personal settings</Dropdown.Item>
            <Dropdown.Item value="out">Sign out of every device</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>
      </div>

      <div id="side-wrap" style={{ width: 240 }}>
        <Sidebar id="side" rowGap="2px">
          <Sidebar.Item value="home" label="Home" />
          <Sidebar.Item value="reports" label="Reports" />
        </Sidebar>
      </div>

      <div id="fields" style={{ display: 'grid', gap: 8, width: 300 }}>
        <Input id="f-input" label="Payee" />
        <Select id="f-select" label="Category"><option>Travel</option></Select>
        <Textarea id="f-textarea" label="Note" />
      </div>
    </>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
