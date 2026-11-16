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

describe('ui-chart values and labels attributes', () => {
  afterEach(() => { document.body.innerHTML = ''; });

  it('take a JSON array, keeping the first and last value and labels with commas', async () => {
    const el = document.createElement('ui-chart');
    el.setAttribute('type', 'bar');
    el.setAttribute('values', '[10, 20, 30]');
    el.setAttribute('labels', '["Jan 1, 2026", "Feb 1, 2026", "Mar 1, 2026"]');
    el.setAttribute('show-table', '');
    document.body.appendChild(el);
    await tick();
    const rows = Array.from(el.shadowRoot!.querySelectorAll('table tbody tr')).map((tr) => tr.textContent!.replace(/\s+/g, ' ').trim());
    expect(rows).toHaveLength(3);
    expect(rows[0]).toContain('Jan 1, 2026');
    expect(rows[2]).toContain('30');
  });

  it('still take comma-separated text', async () => {
    const el = document.createElement('ui-chart');
    el.setAttribute('values', '1,2,3');
    el.setAttribute('labels', 'a,b,c');
    el.setAttribute('show-table', '');
    document.body.appendChild(el);
    await tick();
    expect(el.shadowRoot!.querySelectorAll('table tbody tr')).toHaveLength(3);
  });
});
