import { beforeAll, beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

// The table shortcuts were Mod+Shift+R and Mod+Shift+C: the browsers' own hard reload (Chrome, Firefox), Reader
// (Safari) and DevTools element picker. They are Mod+Shift+Enter (row below) and Mod+Alt+Enter (column right) now.
let editor: HTMLElement;

const shape = () =>
  Array.from(editor.querySelector('table')!.rows).map((row) => Array.from(row.cells).map((cell) => cell.textContent || '_').join(' '));

const placeIn = (text: string) => {
  const target = Array.from(editor.querySelectorAll('p')).find((p) => p.textContent === text)!;
  const range = document.createRange();
  range.selectNodeContents(target);
  range.collapse(true);
  window.getSelection()!.removeAllRanges();
  window.getSelection()!.addRange(range);
};

const press = (init: KeyboardEventInit, target: Element = editor) => {
  const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init });
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
  document.body.innerHTML =
    '<div class="rte-content" contenteditable="true"><table><tbody><tr><td><p>a</p></td><td><p>b</p></td></tr></tbody></table><p>after</p></div>';
  editor = document.querySelector('.rte-content') as HTMLElement;
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('table shortcuts', () => {
  it('add a row below with Mod+Shift+Enter', () => {
    placeIn('a');
    const event = press({ key: 'Enter', metaKey: true, shiftKey: true });
    expect(event.defaultPrevented).toBe(true);
    expect(shape()).toEqual(['a b', '_ _']);
  });

  it('add a column to the right with Mod+Alt+Enter (Ctrl on Windows and Linux)', () => {
    placeIn('a');
    press({ key: 'Enter', ctrlKey: true, altKey: true });
    expect(shape()).toEqual(['a _ b']);
  });

  it('leave the old browser shortcuts, and Mod+Shift+Enter outside a table, to the browser', () => {
    placeIn('a');
    expect(press({ key: 'r', metaKey: true, shiftKey: true }).defaultPrevented).toBe(false);
    expect(press({ key: 'c', metaKey: true, shiftKey: true }).defaultPrevented).toBe(false);
    placeIn('after');
    expect(press({ key: 'Enter', metaKey: true, shiftKey: true }).defaultPrevented).toBe(false);
    expect(shape()).toEqual(['a b']);
  });
});
