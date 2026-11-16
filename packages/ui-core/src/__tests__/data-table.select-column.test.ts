import { describe, expect, it } from 'vitest';
import '../components/ui-data-table';

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

async function mount() {
  const el = document.createElement('ui-data-table');
  el.setAttribute('selectable', '');
  el.innerHTML = `<table>
    <thead><tr><th><input type="checkbox" data-select-all aria-label="Select all"></th><th>Name</th></tr></thead>
    <tbody>
      <tr data-id="a"><td><input type="checkbox" data-row-select aria-label="Select Ada"></td><td>Ada</td></tr>
      <tr data-id="b"><td><input type="checkbox" data-row-select aria-label="Select Lin"></td><td>Lin</td></tr>
      <tr data-id="c"><td><input type="checkbox" data-row-select aria-label="Select Mo"></td><td>Mo</td></tr>
    </tbody>
  </table>`;
  document.body.appendChild(el);
  await tick();
  const events: any[] = [];
  el.addEventListener('row-select', (event) => events.push((event as CustomEvent).detail));
  const boxes = Array.from(el.querySelectorAll<HTMLInputElement>('[data-row-select]'));
  const all = el.querySelector<HTMLInputElement>('[data-select-all]')!;
  return { el, boxes, all, events };
}

describe('ui-data-table checkbox column', () => {
  it('row checkboxes add to the selection, even without multi-select', async () => {
    const { el, boxes, all, events } = await mount();
    boxes[0].click();
    boxes[2].click();
    expect(events.at(-1).ids).toEqual(['a', 'c']);
    expect(boxes.map((b) => b.checked)).toEqual([true, false, true]);
    expect(all.indeterminate).toBe(true);
    expect(all.checked).toBe(false);
    el.remove();
  });

  it('select-all selects the page, then clears it', async () => {
    const { el, boxes, all, events } = await mount();
    all.click();
    expect(events.at(-1).ids).toEqual(['a', 'b', 'c']);
    expect(boxes.every((b) => b.checked)).toBe(true);
    expect(all.checked).toBe(true);
    all.click();
    expect(events.at(-1).ids).toEqual([]);
    expect(boxes.some((b) => b.checked)).toBe(false);
    el.remove();
  });
});

describe('ui-data-table column sort opt-out', () => {
  it('does not sort by the select-all column or a data-sort="false" column', async () => {
    const el = document.createElement('ui-data-table');
    el.setAttribute('sortable', '');
    el.innerHTML = `<table><thead><tr><th><input type="checkbox" data-select-all></th><th data-sort="false">Notes</th><th>Name</th></tr></thead>
      <tbody><tr><td></td><td>x</td><td>B</td></tr><tr><td></td><td>y</td><td>A</td></tr></tbody></table>`;
    document.body.appendChild(el);
    await new Promise((resolve) => setTimeout(resolve, 0));
    const [check, notes, name] = Array.from(el.querySelectorAll('th'));
    expect(check.hasAttribute('data-sortable')).toBe(false);
    expect(notes.hasAttribute('data-sortable')).toBe(false);
    expect(name.getAttribute('data-sortable')).toBe('true');
    (notes as HTMLElement).click();
    expect(notes.getAttribute('aria-sort') ?? 'none').toBe('none');
    el.remove();
  });
});
