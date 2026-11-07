import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-chart';

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));
afterEach(() => { document.body.innerHTML = ''; });

async function chart(attrs: Record<string, string>) {
  const el = document.createElement('ui-chart');
  for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value);
  document.body.appendChild(el);
  await tick();
  return el.shadowRoot!;
}

describe('ui-chart with a few points', () => {
  it('lets a few points fit a narrow card instead of a fixed 420px plot', async () => {
    const root = await chart({ type: 'bar', values: '1,2,3,4,5', labels: 'a,b,c,d,e' });
    expect((root.querySelector('.frame') as HTMLElement).getAttribute('style')).toBe('--ui-chart-fit-width: 140px');
    const css = root.querySelector('style')!.textContent!;
    expect(css).toMatch(/\.plot-stage \{[^}]*min-inline-size: min\(var\(--ui-chart-plot-min-width\), var\(--ui-chart-fit-width/);
  });

  it('does not put all-positive bars on an axis that starts below zero', async () => {
    const root = await chart({ type: 'bar', 'value-prefix': '$', values: '8200,11400,9600,12800,6210', labels: 'W1,W2,W3,W4,W5' });
    const ticks = Array.from(root.querySelectorAll('.axis-y span')).map((node) => node.textContent);
    expect(ticks[ticks.length - 1]).toBe('$0');
    expect(ticks.some((text) => text!.includes('-'))).toBe(false);
  });

  it('puts the minus sign before the prefix', async () => {
    const root = await chart({ type: 'line', 'value-prefix': '$', values: '500,-1990', labels: 'a,b', 'show-table': '' });
    const cells = Array.from(root.querySelectorAll('table.data-table tbody td')).map((node) => node.textContent);
    expect(cells).toEqual(['$500', '-$1,990']);
  });
});
