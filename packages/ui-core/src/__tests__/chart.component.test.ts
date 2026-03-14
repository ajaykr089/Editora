import { beforeEach, describe, expect, it } from 'vitest';
import '../components/ui-chart';

function flushMicrotask() {
  return Promise.resolve();
}

describe('ui-chart component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders multi-series legend and emits aggregated point detail', async () => {
    const el = document.createElement('ui-chart') as HTMLElement;
    el.setAttribute(
      'series',
      JSON.stringify([
        {
          name: 'New MRR',
          tone: '#2f7ef7',
          data: [
            { label: 'Jan', value: 12 },
            { label: 'Feb', value: 18 },
            { label: 'Mar', value: 24 }
          ]
        },
        {
          name: 'Earnings',
          tone: '#8cc6ff',
          data: [
            { label: 'Jan', value: 8 },
            { label: 'Feb', value: 11 },
            { label: 'Mar', value: 16 }
          ]
        }
      ])
    );
    el.setAttribute('type', 'area');
    el.setAttribute('value-suffix', '%');
    document.body.appendChild(el);
    await flushMicrotask();

    const legend = el.shadowRoot?.querySelectorAll('.legend-item');
    expect(legend?.length).toBe(2);
    expect(el.shadowRoot?.textContent).toContain('New MRR');
    expect(el.shadowRoot?.textContent).toContain('Earnings');

    const details: Array<Record<string, unknown>> = [];
    el.addEventListener('ui-point-select', (event) => {
      details.push((event as CustomEvent<Record<string, unknown>>).detail);
    });

    const hit = el.shadowRoot?.querySelector('.plot-hit[data-point-index="1"]') as HTMLButtonElement | null;
    expect(hit).toBeTruthy();
    hit?.click();
    await flushMicrotask();

    expect(details).toHaveLength(1);
    expect(details[0].label).toBe('Feb');
    expect(details[0].series).toBe('New MRR');
    expect(details[0].seriesValues).toEqual([
      { series: 'New MRR', value: 18, tone: '#2f7ef7' },
      { series: 'Earnings', value: 11, tone: '#8cc6ff' }
    ]);
    expect(el.shadowRoot?.textContent).toContain('Feb');
    expect(el.shadowRoot?.textContent).toContain('18%');
    expect(el.shadowRoot?.textContent).toContain('11%');
  });
});
