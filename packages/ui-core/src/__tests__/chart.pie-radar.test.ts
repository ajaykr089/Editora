import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-chart';

const flush = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

function chart(type: string, series: unknown): HTMLElement {
  const el = document.createElement('ui-chart');
  el.setAttribute('type', type);
  el.setAttribute('series', JSON.stringify(series));
  document.body.appendChild(el);
  return el;
}

afterEach(() => {
  document.body.innerHTML = '';
});

const SHARES = [{ name: 'Traffic', data: [{ label: 'Search', value: 50 }, { label: 'Direct', value: 30 }, { label: 'Social', value: 20 }] }];

describe('ui-chart type="pie"', () => {
  it('draws one wedge per positive point and names each hit target with its share', async () => {
    const el = chart('pie', SHARES);
    await flush();
    const wedges = el.shadowRoot!.querySelectorAll('svg.plot path');
    expect(wedges.length).toBe(3);
    const hits = Array.from(el.shadowRoot!.querySelectorAll('[data-role="plot-hit"]')).map((hit) => hit.getAttribute('aria-label'));
    expect(hits[0]).toBe('Search: 50 (50%)');
    expect(hits[2]).toBe('Social: 20 (20%)');
  });

  it('draws a single 100% slice as a full circle and skips zero slices', async () => {
    const el = chart('pie', [{ name: 'All', data: [{ label: 'Only', value: 9 }, { label: 'None', value: 0 }] }]);
    await flush();
    expect(el.shadowRoot!.querySelectorAll('svg.plot path').length).toBe(0);
    expect(el.shadowRoot!.querySelectorAll('svg.plot circle').length).toBe(1);
  });

  it('uses the large-arc flag for a slice over half the pie', async () => {
    const el = chart('pie', [{ name: 'A', data: [{ label: 'Big', value: 70 }, { label: 'Small', value: 30 }] }]);
    await flush();
    const [big, small] = Array.from(el.shadowRoot!.querySelectorAll('svg.plot path')).map((p) => p.getAttribute('d')!);
    expect(big).toMatch(/A24 24 0 1 1/);
    expect(small).toMatch(/A24 24 0 0 1/);
  });

  it('has no axes and reports the largest share as its insight', async () => {
    const el = chart('pie', SHARES);
    await flush();
    expect(el.shadowRoot!.querySelector('.insight')?.textContent).toContain('Search');
  });
});

describe('ui-chart type="radar"', () => {
  const SKILLS = [
    { name: 'Ada', data: [{ label: 'Speed', value: 8 }, { label: 'Quality', value: 6 }, { label: 'Scope', value: 9 }, { label: 'Cost', value: 4 }] },
    { name: 'Grace', data: [{ label: 'Speed', value: 5 }, { label: 'Quality', value: 9 }, { label: 'Scope', value: 7 }, { label: 'Cost', value: 6 }] },
  ];

  it('draws four rings, a spoke and a label per dimension, and a polygon per series', async () => {
    const el = chart('radar', SKILLS);
    await flush();
    const svg = el.shadowRoot!.querySelector('svg.plot')!;
    const polygons = svg.querySelectorAll('polygon');
    expect(polygons.length).toBe(4 + 2);
    expect(svg.querySelectorAll('line').length).toBe(4);
    expect(Array.from(svg.querySelectorAll('text')).map((t) => t.textContent)).toEqual(['Speed', 'Quality', 'Scope', 'Cost']);
  });

  it('scales every series to the largest value across all series', async () => {
    const el = chart('radar', SKILLS);
    await flush();
    const shapes = Array.from(el.shadowRoot!.querySelectorAll('svg.plot polygon')).slice(4);
    // "Scope" (index 2) is 9, the maximum: Ada's point sits on the outer ring (r = 21 below the centre... at angle 90deg).
    const ada = shapes[0].getAttribute('points')!.split(' ').map((pair) => pair.split(',').map(Number));
    expect(ada[2][0]).toBeCloseTo(32, 3);
    expect(ada[2][1]).toBeCloseTo(49, 3);
  });

  it('names each dimension with every series value', async () => {
    const el = chart('radar', SKILLS);
    await flush();
    const first = el.shadowRoot!.querySelector('[data-role="plot-hit"]')!.getAttribute('aria-label');
    expect(first).toBe('Speed: Ada: 8, Grace: 5');
  });

  it('shows a series legend for several series', async () => {
    const el = chart('radar', SKILLS);
    await flush();
    expect(el.shadowRoot!.querySelectorAll('.legend-item').length).toBe(2);
  });
});
