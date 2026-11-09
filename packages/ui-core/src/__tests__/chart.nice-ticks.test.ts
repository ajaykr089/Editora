import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-chart';

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

async function ticksFor(values: number[], attrs: Record<string, string> = {}) {
  const el = document.createElement('ui-chart');
  for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value);
  el.setAttribute('values', JSON.stringify(values));
  el.setAttribute('labels', JSON.stringify(values.map((_, i) => `P${i + 1}`)));
  document.body.appendChild(el);
  await tick();
  return Array.from(el.shadowRoot!.querySelectorAll('.axis-y span')).map((node) => node.textContent || '');
}

describe('ui-chart axis ticks', () => {
  afterEach(() => { document.body.innerHTML = ''; });

  it('bars get round steps from zero', async () => {
    expect(await ticksFor([22195, 20100, 21900, 28000, 47596, 45000], { type: 'bar', 'value-prefix': '$' }))
      .toEqual(['$60,000', '$45,000', '$30,000', '$15,000', '$0']);
  });

  it('small values keep the decimals the step needs', async () => {
    expect(await ticksFor([0, 0, 0], { type: 'line' })).toEqual(['1', '0.75', '0.5', '0.25', '0']);
  });

  it('lines that do not touch zero still land on round numbers', async () => {
    const ticks = await ticksFor([3120, 3480, 3300, 3900, 4100], { type: 'line' });
    const numbers = ticks.map((t) => Number(t.replace(/,/g, '')));
    const step = numbers[0] - numbers[1];
    expect([100, 150, 200, 250, 300, 400, 500, 600, 800, 1000]).toContain(step);
    expect(numbers.every((n) => n % step === 0)).toBe(true);
    expect(numbers[4]).toBeLessThanOrEqual(3120);
    expect(numbers[0]).toBeGreaterThanOrEqual(4100);
  });

  it('all-negative bars end at zero', async () => {
    expect(await ticksFor([-120, -340, -80], { type: 'bar' })).toEqual(['0', '-100', '-200', '-300', '-400']);
  });
});

describe('ui-chart area baseline', () => {
  it('starts an area at zero, like bars; lines keep a fitted axis', async () => {
    const area = await ticksFor([12000, 9100, 12100, 11000, 16800], { type: 'area' });
    expect(area[area.length - 1]).toBe('0');
    const line = await ticksFor([12000, 9100, 12100, 11000, 16800], { type: 'line' });
    expect(line[line.length - 1]).not.toBe('0');
  });
});
