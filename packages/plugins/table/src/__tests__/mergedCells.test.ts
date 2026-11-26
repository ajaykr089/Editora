import { afterEach, describe, expect, it } from 'vitest';
import {
  addColumnLeftCommand,
  addColumnRightCommand,
  addRowAboveCommand,
  addRowBelowCommand,
  deleteColumnCommand,
  deleteRowCommand,
  toggleHeaderColumnCommand,
} from '../TablePlugin.native';

// With a merged cell in the table, the row and column commands counted cells instead of columns: a new row came
// out a cell short, a new column went in at different places in different rows, and deleting a column deleted a
// merged cell outright, text and all.

/** Each row as `text` per cell, with `+n` for a column span and `^n` for a row span. */
const shape = (table: HTMLTableElement) =>
  Array.from(table.rows).map((row) =>
    Array.from(row.cells)
      .map((cell) => `${cell.textContent || '_'}${cell.colSpan > 1 ? `+${cell.colSpan}` : ''}${cell.rowSpan > 1 ? `^${cell.rowSpan}` : ''}`)
      .join(' '),
  );

function setUp(rows: string) {
  const content = document.createElement('div');
  content.className = 'rte-content';
  content.setAttribute('contenteditable', 'true');
  content.innerHTML = `<table class="rte-table"><tbody>${rows}</tbody></table>`;
  document.body.appendChild(content);
  return content.querySelector('table') as HTMLTableElement;
}

function caretIn(table: HTMLTableElement, text: string) {
  const cell = Array.from(table.querySelectorAll('td, th')).find((candidate) => candidate.textContent === text)!;
  const range = document.createRange();
  range.selectNodeContents(cell);
  range.collapse(true);
  window.getSelection()!.removeAllRanges();
  window.getSelection()!.addRange(range);
}

// a and b merged into one cell over two columns, above d and e.
const MERGED = '<tr><td colspan="2">ab</td><td>c</td></tr><tr><td>d</td><td>e</td><td>f</td></tr>';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('row commands with a merged cell', () => {
  it('give a new row one cell per column', () => {
    const table = setUp(MERGED);
    caretIn(table, 'f');
    addRowAboveCommand();
    expect(shape(table)).toEqual(['ab+2 c', '_ _ _', 'd e f']);
    caretIn(table, 'ab');
    addRowBelowCommand();
    expect(shape(table)).toEqual(['ab+2 c', '_ _ _', '_ _ _', 'd e f']);
  });

  it('add a row below the header row to the body', () => {
    const content = setUp('<tr><td>b</td></tr>').closest('.rte-content')!;
    content.innerHTML = '<table><thead><tr><th>h</th></tr></thead><tbody><tr><td>b</td></tr></tbody></table>';
    const table = content.querySelector('table')!;
    caretIn(table, 'h');
    addRowBelowCommand();
    expect(table.tHead!.rows.length).toBe(1);
    expect(shape(table)).toEqual(['h', '_', 'b']);
  });

  it('stretch a cell that spans rows over a row added inside it', () => {
    const table = setUp('<tr><td rowspan="2">a</td><td>b</td></tr><tr><td>c</td></tr>');
    caretIn(table, 'b');
    addRowBelowCommand();
    expect(shape(table)).toEqual(['a^3 b', '_', 'c']);
  });

  it('keep the text of a cell that spans rows when its first row is deleted', () => {
    const table = setUp('<tr><td rowspan="2">a</td><td>b</td></tr><tr><td>c</td></tr><tr><td>d</td><td>e</td></tr>');
    caretIn(table, 'b');
    deleteRowCommand();
    expect(shape(table)).toEqual(['a c', 'd e']);
  });
});

describe('column commands with a merged cell', () => {
  it('add the new column at the same place in every row', () => {
    const table = setUp(MERGED);
    caretIn(table, 'c');
    addColumnLeftCommand();
    expect(shape(table)).toEqual(['ab+2 _ c', 'd e _ f']);
  });

  it('widen a merged cell when the new column goes inside it', () => {
    const table = setUp(MERGED);
    caretIn(table, 'd');
    addColumnRightCommand();
    expect(shape(table)).toEqual(['ab+3 c', 'd _ e f']);
  });

  it('narrow a merged cell instead of deleting it and its text', () => {
    const table = setUp(MERGED);
    caretIn(table, 'd');
    deleteColumnCommand();
    expect(shape(table)).toEqual(['ab c', 'e f']);
  });

  it('turn the whole column into header cells', () => {
    const table = setUp(MERGED);
    caretIn(table, 'f');
    toggleHeaderColumnCommand();
    expect(Array.from(table.querySelectorAll('th')).map((cell) => cell.textContent)).toEqual(['c', 'f']);
  });
});
