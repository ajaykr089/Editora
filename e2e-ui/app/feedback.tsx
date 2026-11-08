import React from 'react';
import { createRoot } from 'react-dom/client';
import { DatePicker } from '@editora/ui-react/DatePicker';
import { DateRangePicker } from '@editora/ui-react/DateRangePicker';

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
    </>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
