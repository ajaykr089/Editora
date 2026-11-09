import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-chart';

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));
afterEach(() => { document.body.innerHTML = ''; document.documentElement.removeAttribute('lang'); });

async function chart(attrs: Record<string, string>) {
  const el = document.createElement('ui-chart');
  for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value);
  document.body.appendChild(el);
  await tick();
  return el.shadowRoot!;
}

const text = (node: Element | null) => (node?.textContent || '').replace(/\s+/g, ' ').trim();

// From an app team's feedback list (an INR expense dashboard).
describe('ui-chart feedback', () => {
  it('show-summary="false" also hides the readout line; show-insight brings it back alone', async () => {
    const off = await chart({ type: 'line', values: '150,900', labels: 'a,b', 'show-summary': 'false' });
    expect(off.querySelector('.summary')).toBeNull();
    expect(off.querySelector('.insight')).toBeNull();
    document.body.innerHTML = '';
    const insightOnly = await chart({ type: 'line', values: '150,900', labels: 'a,b', 'show-summary': 'false', 'show-insight': 'true' });
    expect(insightOnly.querySelector('.summary')).toBeNull();
    expect(text(insightOnly.querySelector('.insight'))).toContain('+500%');
  });

  it('prints the change percentage without the currency', async () => {
    const root = await chart({ type: 'line', 'value-prefix': '₹', values: '150,900', labels: 'a,b' });
    const insight = text(root.querySelector('.insight'));
    expect(insight).toContain('+₹750 (+500%)');
    expect(insight).not.toContain('₹500%');
  });

  it('shows no status pill (it said "Live") unless a state is set, and hides an empty header', async () => {
    const plain = await chart({ values: '1,2', labels: 'a,b' });
    expect(plain.querySelector('.status-pill')).toBeNull();
    expect((plain.querySelector('.header') as HTMLElement).hidden).toBe(true);
    expect(plain.querySelector('style')!.textContent).toMatch(/\.header\[hidden\]/);
    document.body.innerHTML = '';
    const titled = await chart({ title: 'Spend', values: '1,2', labels: 'a,b' });
    expect(titled.querySelector('.status-pill')).toBeNull();
    document.body.innerHTML = '';
    const loading = await chart({ title: 'Spend', values: '1,2', labels: 'a,b', state: 'loading' });
    expect(text(loading.querySelector('.status-pill'))).toBe('Updating');
  });

  it('fits its card by default', async () => {
    const root = await chart({ type: 'line', values: Array.from({ length: 30 }, (_, i) => i).join(','), labels: Array.from({ length: 30 }, (_, i) => `d${i}`).join(',') });
    expect(root.querySelector('style')!.textContent).toMatch(/--ui-chart-plot-min-width: 0px/);
    expect(root.querySelector('style')!.textContent).not.toMatch(/--ui-chart-plot-min-width: 3\d\dpx/);
  });

  it('accepts tone names as well as colours', async () => {
    const root = await chart({
      type: 'bar',
      series: JSON.stringify([
        { name: 'In', tone: 'success', data: [{ label: 'a', value: 1 }] },
        { name: 'Out', tone: 'danger', data: [{ label: 'a', value: 2 }] },
        { name: 'Other', tone: '#123456', data: [{ label: 'a', value: 3 }] }
      ])
    });
    const fills = Array.from(root.querySelectorAll('svg rect, svg path')).map((node) => node.getAttribute('fill') || '');
    expect(fills.some((fill) => fill.includes('--ui-color-success'))).toBe(true);
    expect(fills.some((fill) => fill.includes('--ui-color-danger'))).toBe(true);
    expect(fills).toContain('#123456');
    expect(fills.some((fill) => fill === 'success' || fill === 'danger')).toBe(false);
  });

  it('does not call a single dataset "Series 1"', async () => {
    const root = await chart({ type: 'bar', values: '1,2', labels: 'a,b' });
    const chartEl = document.querySelector('ui-chart')!;
    (root.querySelector('[data-point-index="0"]') as HTMLElement | null)?.click();
    await tick();
    expect(chartEl.shadowRoot!.querySelector('.tooltip')).toBeTruthy();
    expect(chartEl.shadowRoot!.innerHTML).not.toContain('Series 1');
    expect(chartEl.shadowRoot!.querySelector('.tooltip .tooltip-series')).toBeNull();
  });

  it('starts the axis at 0 when no value is negative (line charts and all-zero data)', async () => {
    for (const values of ['0,0,0', '120,90,300,0', '150,900']) {
      const root = await chart({ type: 'line', 'value-prefix': '₹', values, labels: values.split(',').map((_, i) => `d${i}`).join(',') });
      const ticks = Array.from(root.querySelectorAll('.axis-y span')).map((node) => node.textContent || '');
      expect(ticks.some((tick) => tick.includes('-')), `${values}: ${ticks.join(' ')}`).toBe(false);
      document.body.innerHTML = '';
    }
  });

  it('groups digits by locale: the attribute, else the nearest lang', async () => {
    const own = await chart({ type: 'bar', values: '100000', labels: 'a', locale: 'en-IN', 'show-table': '' });
    expect(text(own.querySelector('table.data-table tbody td'))).toBe('1,00,000');
    document.body.innerHTML = '';
    document.documentElement.setAttribute('lang', 'en-IN');
    const inherited = await chart({ type: 'bar', values: '100000', labels: 'a', 'show-table': '' });
    expect(text(inherited.querySelector('table.data-table tbody td'))).toBe('1,00,000');
  });
});
