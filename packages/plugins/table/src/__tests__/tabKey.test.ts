import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

// Tab in a table cell took the focus out of the editor. It should move between cells, and add a row from the last one.
let editor: HTMLElement;

const TABLE = `
  <table>
    <tr><th><p>A1</p></th><th><p>B1</p></th></tr>
    <tr><td><p>A2</p></td><td><p>B2</p></td></tr>
  </table>`;

const cellsOf = (table: Element) => Array.from(table.querySelectorAll(':scope > tbody > tr > th, :scope > tbody > tr > td, :scope > tr > th, :scope > tr > td'));
const caretText = () => window.getSelection()!.toString() || window.getSelection()!.getRangeAt(0).startContainer.textContent;
const placeIn = (text: string) => {
  const target = Array.from(editor.querySelectorAll('p')).find((p) => p.textContent === text)!;
  const range = document.createRange();
  range.selectNodeContents(target);
  range.collapse(true);
  window.getSelection()!.removeAllRanges();
  window.getSelection()!.addRange(range);
};
const press = (init: KeyboardEventInit = {}, target: Element = editor) => {
  const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true, ...init });
  target.dispatchEvent(event);
  return event;
};

beforeAll(async () => {
  vi.useFakeTimers();
  await import('../TablePlugin.native');
  // The plugin starts itself shortly after it is loaded.
  vi.advanceTimersByTime(300);
  vi.useRealTimers();
});

beforeEach(() => {
  document.body.innerHTML = `<div class="rte-content" contenteditable="true">${TABLE}<p>After</p></div>`;
  editor = document.querySelector('.rte-content') as HTMLElement;
});

afterEach(() => {
  delete (window as any).execEditorCommand;
  document.body.innerHTML = '';
});

afterAll(() => {
  vi.useRealTimers();
});

describe('Tab in a table', () => {
  it('selects what the cell holds, so that typing replaces it, as in a word processor', () => {
    placeIn('A1');
    press();
    expect(window.getSelection()!.toString()).toBe('B1');
    expect(window.getSelection()!.isCollapsed).toBe(false);
  });

  it('puts just the caret in an empty cell', () => {
    editor.querySelectorAll('p')[1].textContent = '';
    editor.querySelectorAll('p')[1].innerHTML = '<br>';
    placeIn('A1');
    press();
    expect(window.getSelection()!.isCollapsed).toBe(true);
    expect(editor.querySelectorAll('th')[1].contains(window.getSelection()!.getRangeAt(0).startContainer)).toBe(true);
  });

  it('moves to the next cell, and from the end of a row to the start of the next', () => {
    placeIn('A1');
    expect(press().defaultPrevented).toBe(true);
    expect(caretText()).toBe('B1');
    press();
    expect(caretText()).toBe('A2');
  });

  it('moves back with Shift+Tab', () => {
    placeIn('A2');
    expect(press({ shiftKey: true }).defaultPrevented).toBe(true);
    expect(caretText()).toBe('B1');
    press({ shiftKey: true });
    expect(caretText()).toBe('A1');
  });

  it('leaves Shift+Tab in the first cell to the browser, so the focus can still leave', () => {
    placeIn('A1');
    expect(press({ shiftKey: true }).defaultPrevented).toBe(false);
    expect(caretText()).toBe('A1');
  });

  it('adds a row from the last cell, with as many cells as the others, and moves into it', () => {
    placeIn('B2');
    const table = editor.querySelector('table')!;
    expect(table.rows.length).toBe(2);

    expect(press().defaultPrevented).toBe(true);

    expect(table.rows.length).toBe(3);
    expect(table.rows[2].cells.length).toBe(2);
    expect(table.rows[2].cells[0].contains(window.getSelection()!.getRangeAt(0).startContainer)).toBe(true);
    // The existing rows are as they were.
    expect(table.rows[1].textContent).toBe('A2B2');
  });

  it('records the added row so that Undo takes it back', () => {
    const record = vi.fn((..._args: unknown[]) => true);
    (window as any).execEditorCommand = (command: string, ...args: unknown[]) => (command === 'recordDomTransaction' ? record(...args) : false);
    placeIn('B2');
    press();
    expect(record).toHaveBeenCalledTimes(1);
    const [target, before, after] = record.mock.calls[0] as unknown as [HTMLElement, string, string];
    expect(target).toBe(editor);
    expect(before.match(/<tr/g)).toHaveLength(2);
    expect(after.match(/<tr/g)).toHaveLength(3);
  });

  it('tells the editor its content changed when it adds a row', () => {
    const changed = vi.fn();
    editor.addEventListener('input', changed);
    placeIn('B2');
    press();
    expect(changed).toHaveBeenCalledTimes(1);
  });

  it('does not add a row when moving between cells', () => {
    placeIn('A1');
    press();
    press();
    press();
    expect(editor.querySelector('table')!.rows.length).toBe(2);
  });

  it('does nothing outside a table', () => {
    const range = document.createRange();
    range.selectNodeContents(editor.lastElementChild!);
    range.collapse(true);
    window.getSelection()!.removeAllRanges();
    window.getSelection()!.addRange(range);
    expect(press().defaultPrevented).toBe(false);
  });

  it('leaves Tab with Ctrl, Alt or Cmd to the browser', () => {
    placeIn('A1');
    for (const init of [{ ctrlKey: true }, { altKey: true }, { metaKey: true }]) {
      expect(press(init).defaultPrevented).toBe(false);
    }
    expect(caretText()).toBe('A1');
  });

  it('leaves a read-only editor alone', () => {
    editor.setAttribute('data-readonly', 'true');
    placeIn('B2');
    expect(press().defaultPrevented).toBe(false);
    expect(editor.querySelector('table')!.rows.length).toBe(2);
  });

  it('ignores a Tab typed somewhere else, such as a field in a dialog', () => {
    document.body.insertAdjacentHTML('beforeend', '<div class="dialog"><input id="field"></div>');
    placeIn('B2');
    expect(press({}, document.getElementById('field')!).defaultPrevented).toBe(false);
    expect(editor.querySelector('table')!.rows.length).toBe(2);
  });

  it('works in a table inside a cell: it adds the row to the inner table and leaves the outer one alone', () => {
    editor.innerHTML = '<table><tr><td><p>Outer</p><table><tr><td><p>Inner</p></td></tr></table></td></tr></table>';
    placeIn('Inner');
    press();
    const [outer, inner] = [editor.querySelector('table')!, editor.querySelectorAll('table')[1]];
    expect(inner.rows.length).toBe(2);
    expect(outer.rows.length).toBe(1);
  });

  it('does not stop other handlers for keys it does not handle', () => {
    placeIn('A1');
    expect(press({ key: 'a' }).defaultPrevented).toBe(false);
    expect(caretText()).toBe('A1');
  });
});
