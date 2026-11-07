import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-chart';

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));
afterEach(() => { document.body.innerHTML = ''; });

async function mount(attrs: Record<string, string>) {
  const el = document.createElement('ui-chart');
  for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value);
  document.body.appendChild(el);
  await tick();
  return el;
}

describe('ui-chart data table', () => {
  it('gives screen readers the numbers as a table, one column per series', async () => {
    const el = await mount({
      title: 'Spend by month',
      'value-prefix': '$',
      series: JSON.stringify([
        { name: 'Travel', data: [{ label: 'Jan', value: 120 }, { label: 'Feb', value: 80 }] },
        { name: 'Meals', data: [{ label: 'Jan', value: 40 }] },
      ]),
    });
    const table = el.shadowRoot!.querySelector('table.data-table')!;
    expect(table.classList.contains('sr-only')).toBe(true);
    expect(table.querySelector('caption')!.textContent).toBe('Spend by month');
    const cells = (row: Element) => Array.from(row.children).map((cell) => cell.textContent);
    expect(cells(table.querySelector('thead tr')!)).toEqual(['Label', 'Travel', 'Meals']);
    const rows = Array.from(table.querySelectorAll('tbody tr')).map(cells);
    expect(rows[0][0]).toBe('Jan');
    expect(rows[0][1]).toContain('120');
    expect(rows[1]).toEqual(['Feb', expect.stringContaining('80'), '']);
    expect(table.querySelector('tbody th')!.getAttribute('scope')).toBe('row');
  });

  it('shows it on screen with show-table', async () => {
    const el = await mount({ values: '[3,5,8]', labels: '["a","b","c"]', 'show-table': '' });
    expect(el.shadowRoot!.querySelector('table.data-table')!.classList.contains('sr-only')).toBe(false);
  });
});
