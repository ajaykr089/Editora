import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-data-table';

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));
const frame = () => new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
afterEach(() => { document.body.innerHTML = ''; });

describe('ui-data-table minimum width', () => {
  it('scales the minimum width with the visible columns, so a narrow table fits a phone', async () => {
    document.body.innerHTML = `<ui-data-table><table>
      <thead><tr><th data-key="a">A</th><th data-key="b">B</th><th data-key="c">C</th></tr></thead>
      <tbody><tr><td>1</td><td>2</td><td>3</td></tr></tbody></table></ui-data-table>`;
    const el = document.querySelector('ui-data-table')!;
    const table = el.querySelector('table')!;
    await tick();
    expect(table.style.getPropertyValue('--ui-data-table-fit-width')).toBe('300px');
    expect(document.head.textContent).toMatch(/min-width: min\(680px, var\(--ui-data-table-fit-width, 680px\)\)/);

    el.setAttribute('hidden-columns', 'b');
    await frame();
    expect(table.style.getPropertyValue('--ui-data-table-fit-width')).toBe('200px');
  });
});
