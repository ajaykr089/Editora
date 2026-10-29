import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

// The plugin's selection, keyboard and toolbar handlers listen on the whole page. They treated a table in any
// contenteditable as Editora's: a plain comment box or another editor next to Editora got resize handles and a
// wrapper (which outlived the browser's undo), the table toolbar, and Tab hijacked.
const TABLE = '<table><tbody><tr><td><p>A1</p></td><td><p>B1</p></td></tr></tbody></table>';

const placeCaretIn = (root: Element, text: string) => {
  const target = Array.from(root.querySelectorAll('p')).find((p) => p.textContent === text)!;
  const range = document.createRange();
  range.selectNodeContents(target);
  range.collapse(true);
  window.getSelection()!.removeAllRanges();
  window.getSelection()!.addRange(range);
  document.dispatchEvent(new Event('selectionchange'));
};

const toolbarVisible = () => {
  const toolbar = document.querySelector<HTMLElement>('.table-toolbar');
  return Boolean(toolbar && toolbar.style.display !== 'none');
};

const pressTab = (target: Element) => {
  const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
  target.dispatchEvent(event);
  return event;
};

beforeAll(async () => {
  vi.useFakeTimers();
  await import('../TablePlugin.native');
  vi.advanceTimersByTime(300);
  vi.useRealTimers();
});

// The plugin keeps its toolbar in <body>; mount each editor in its own box so the toolbar survives between tests.
let box: HTMLElement;
const mount = (html: string) => {
  box = document.createElement('div');
  box.innerHTML = html;
  document.body.appendChild(box);
};

afterEach(() => {
  window.getSelection()!.removeAllRanges();
  document.dispatchEvent(new Event('selectionchange'));
  box?.remove();
});

afterAll(() => {
  vi.useRealTimers();
});

describe('tables outside Editora', () => {
  it('leaves a table in another contenteditable alone', () => {
    mount(`<div id="other" contenteditable="true">${TABLE}</div>`);
    const other = document.getElementById('other')!;

    placeCaretIn(other, 'A1');

    expect(other.querySelector('.rte-table-wrapper, .resize-handle, .table-resize-handle')).toBeNull();
    expect(toolbarVisible()).toBe(false);
    expect(pressTab(other).defaultPrevented).toBe(false);
    expect(other.innerHTML).toBe(TABLE);
  });

  it('still decorates and handles a table inside an Editora editor', () => {
    mount(`<div class="rte-content" contenteditable="true">${TABLE}</div>`);
    const content = document.querySelector('.rte-content')!;

    placeCaretIn(content, 'A1');

    expect(content.querySelector('.rte-table-wrapper')).not.toBeNull();
    expect(toolbarVisible()).toBe(true);
    expect(pressTab(content).defaultPrevented).toBe(true);
  });

  it('works for the web component, whose content element is .editora-content', () => {
    mount(`<div class="editora-content" contenteditable="true">${TABLE}</div>`);
    placeCaretIn(document.querySelector('.editora-content')!, 'A1');
    expect(toolbarVisible()).toBe(true);
  });

  it('ignores a table inside a non-editable island in an Editora editor', () => {
    mount(`<div class="rte-content" contenteditable="true"><div contenteditable="false">${TABLE}</div></div>`);
    placeCaretIn(document.querySelector('.rte-content')!, 'A1');
    expect(toolbarVisible()).toBe(false);
  });
});
