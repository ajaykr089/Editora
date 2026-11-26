import { afterEach, describe, expect, it } from 'vitest';
import { addColumnLeftCommand, addColumnRightCommand, addRowAboveCommand, addRowBelowCommand } from '../TablePlugin.native';

// New rows and columns were always made of data cells: a column added to a table with a header row put a <td> into
// the header, and a row added above the header row was a row of <td>s inside <thead>.

const tags = (table: HTMLTableElement) =>
  Array.from(table.rows).map((row) => Array.from(row.cells).map((cell) => cell.tagName.toLowerCase()).join(' '));

function setUp(html: string) {
  const content = document.createElement('div');
  content.className = 'rte-content';
  content.setAttribute('contenteditable', 'true');
  content.innerHTML = html;
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

const WITH_HEADER_ROW =
  '<table><thead><tr><th>h1</th><th>h2</th></tr></thead><tbody><tr><td>a</td><td>b</td></tr></tbody></table>';
const WITH_HEADER_COLUMN =
  '<table><tbody><tr><th>k1</th><td>a</td></tr><tr><th>k2</th><td>b</td></tr></tbody></table>';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('new cells next to header cells', () => {
  it('are header cells in the header row of a new column', () => {
    const table = setUp(WITH_HEADER_ROW);
    caretIn(table, 'b');
    addColumnRightCommand();
    expect(tags(table)).toEqual(['th th th', 'td td td']);
  });

  it('make a row added above the header row a header row', () => {
    const table = setUp(WITH_HEADER_ROW);
    caretIn(table, 'h1');
    addRowAboveCommand();
    expect(tags(table)).toEqual(['th th', 'th th', 'td td']);
  });

  it('leave a row added below the header row a row of data cells', () => {
    const table = setUp(WITH_HEADER_ROW);
    caretIn(table, 'h2');
    addRowBelowCommand();
    expect(tags(table)).toEqual(['th th', 'td td', 'td td']);
  });

  it('continue a header column into a new row', () => {
    const table = setUp(WITH_HEADER_COLUMN);
    caretIn(table, 'b');
    addRowBelowCommand();
    expect(tags(table)).toEqual(['th td', 'th td', 'th td']);
  });

  it('are data cells in a column added beside a header column', () => {
    const table = setUp(WITH_HEADER_COLUMN);
    caretIn(table, 'k1');
    addColumnLeftCommand();
    expect(tags(table)).toEqual(['td th td', 'td th td']);
  });
});
