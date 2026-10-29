import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

// Clicking into a cell of a table that has no wrapper yet made the plugin wrap it, and moving the table out of the
// editor drops any selection inside it: the caret jumped to just after the table, so what the person typed landed in
// the next paragraph (or the heading, in Firefox) instead of the cell.
let editor: HTMLElement;

beforeAll(async () => {
  vi.useFakeTimers();
  await import('../TablePlugin.native');
  vi.advanceTimersByTime(300);
  vi.useRealTimers();
});

beforeEach(() => {
  document.body.innerHTML = `<div class="rte-content" contenteditable="true">
    <h2>Title</h2>
    <table><tbody>
      <tr><th>Region</th><th>Q1</th></tr>
      <tr><td>Europe</td><td>1.2M</td></tr>
    </tbody></table>
    <p>After</p>
  </div>`;
  editor = document.querySelector('.rte-content') as HTMLElement;
});

afterEach(() => {
  delete (window as any).execEditorCommand;
  document.body.innerHTML = '';
});

afterAll(() => {
  vi.useRealTimers();
});

const textNodeOf = (cell: Element) => cell.firstChild as Text;
const select = (anchor: Node, anchorOffset: number, focus: Node = anchor, focusOffset: number = anchorOffset) => {
  window.getSelection()!.setBaseAndExtent(anchor, anchorOffset, focus, focusOffset);
  document.dispatchEvent(new Event('selectionchange'));
};

describe('wrapping a table the first time it is touched', () => {
  it('wraps the table', () => {
    const cell = editor.querySelectorAll('td')[0];
    select(textNodeOf(cell), 3);
    expect(editor.querySelector('table')!.parentElement!.classList.contains('rte-table-wrapper')).toBe(true);
  });

  it('keeps the caret where it was in the cell', () => {
    const cell = editor.querySelectorAll('td')[0];
    select(textNodeOf(cell), 3);
    const selection = window.getSelection()!;
    expect(selection.anchorNode).toBe(textNodeOf(cell));
    expect(selection.anchorOffset).toBe(3);
    expect(selection.isCollapsed).toBe(true);
  });

  it('keeps a selection that spans cells, and its direction', () => {
    const cells = editor.querySelectorAll('td');
    select(textNodeOf(cells[1]), 2, textNodeOf(cells[0]), 1);
    const selection = window.getSelection()!;
    expect(selection.anchorNode).toBe(textNodeOf(cells[1]));
    expect(selection.anchorOffset).toBe(2);
    expect(selection.focusNode).toBe(textNodeOf(cells[0]));
    expect(selection.focusOffset).toBe(1);
  });

  it('does not touch a selection outside the table', () => {
    const paragraph = editor.querySelector('p')!;
    select(paragraph.firstChild!, 2);
    expect(window.getSelection()!.anchorNode).toBe(paragraph.firstChild);
    expect(window.getSelection()!.anchorOffset).toBe(2);
  });
});
