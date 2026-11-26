import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { ListPlugin } from '../ListPlugin.native';

// The browsers give a list none of a word processor's keys: Tab took the focus out of the editor, Enter in an empty
// item made a <div> in Firefox, and Backspace at the start of the first item did nothing.

let root: HTMLElement;

function setUp(html: string) {
  document.body.innerHTML = `<div class="rte-content" contenteditable="true">${html}</div>`;
  root = document.querySelector('.rte-content') as HTMLElement;
  // jsdom does not compute isContentEditable.
  Object.defineProperty(root, 'isContentEditable', { configurable: true, get: () => true });
}

function caretIn(text: string | null, offset = 0, nth = 0) {
  const range = document.createRange();
  if (text === null) {
    range.setStart(root.querySelectorAll('li')[nth], 0);
  } else {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node: Node | null;
    while ((node = walker.nextNode()) && node.textContent !== text);
    range.setStart(node!, offset);
  }
  range.collapse(true);
  window.getSelection()!.removeAllRanges();
  window.getSelection()!.addRange(range);
}

function press(key: string, init: KeyboardEventInit = {}) {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init });
  root.dispatchEvent(event);
  return event;
}

const caretText = () => {
  const range = window.getSelection()!.getRangeAt(0);
  return `${range.startContainer.textContent}@${range.startOffset}`;
};

beforeAll(() => {
  ListPlugin();
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Tab and Shift+Tab in a list', () => {
  it('nest an item under the one before it, and move it back out', () => {
    setUp('<ul><li>one</li><li>two</li><li>three</li></ul>');
    caretIn('two', 1);
    expect(press('Tab').defaultPrevented).toBe(true);
    expect(root.innerHTML).toBe('<ul><li>one<ul><li>two</li></ul></li><li>three</li></ul>');
    expect(caretText()).toBe('two@1');

    caretIn('three');
    press('Tab');
    expect(root.innerHTML).toBe('<ul><li>one<ul><li>two</li><li>three</li></ul></li></ul>');

    caretIn('two');
    expect(press('Tab', { shiftKey: true }).defaultPrevented).toBe(true);
    // What came after it in the nested list stays below it.
    expect(root.innerHTML).toBe('<ul><li>one</li><li>two<ul><li>three</li></ul></li></ul>');
  });

  it('leave Tab on the first item, and Shift+Tab on a top-level item, alone', () => {
    setUp('<ol><li>one</li><li>two</li></ol>');
    caretIn('one');
    press('Tab');
    expect(root.innerHTML).toBe('<ol><li>one</li><li>two</li></ol>');
    caretIn('two');
    // The focus can always leave the editor with Shift+Tab.
    expect(press('Tab', { shiftKey: true }).defaultPrevented).toBe(false);
  });

  it('do nothing outside a list, or in a checklist', () => {
    setUp('<p>text</p><ul data-type="checklist"><li>a</li><li>b</li></ul>');
    caretIn('text');
    expect(press('Tab').defaultPrevented).toBe(false);
    caretIn('b');
    expect(press('Tab').defaultPrevented).toBe(false);
  });
});

describe('Enter in an empty item', () => {
  it('makes a paragraph at the top level, with the caret in it', () => {
    setUp('<ul><li>one</li><li><br></li></ul><p>after</p>');
    caretIn(null, 0, 1);
    expect(press('Enter').defaultPrevented).toBe(true);
    expect(root.innerHTML).toBe('<ul><li>one</li></ul><p><br></p><p>after</p>');
    expect(window.getSelection()!.getRangeAt(0).startContainer).toBe(root.querySelector('p'));
  });

  it('moves a nested item out one level', () => {
    setUp('<ul><li>one<ul><li><br></li></ul></li></ul>');
    caretIn(null, 0, 1);
    press('Enter');
    expect(root.innerHTML).toBe('<ul><li>one</li><li><br></li></ul>');
  });

  it('is left to the browser in an item with text', () => {
    setUp('<ul><li>one</li></ul>');
    caretIn('one', 3);
    expect(press('Enter').defaultPrevented).toBe(false);
  });
});

describe('Backspace at the start of an item', () => {
  it('turns a top-level item into a paragraph, the caret staying in front of its text', () => {
    setUp('<p>before</p><ul><li>one</li><li>two</li></ul>');
    caretIn('one');
    expect(press('Backspace').defaultPrevented).toBe(true);
    expect(root.innerHTML).toBe('<p>before</p><p>one</p><ul><li>two</li></ul>');
    expect(caretText()).toBe('one@0');
  });

  it('moves a nested item out one level, and is one undo step', () => {
    setUp('<ul><li>one<ul><li>two</li></ul></li></ul>');
    const recorded: unknown[][] = [];
    (window as any).execEditorCommand = (command: string, ...args: unknown[]) => {
      if (command === 'recordDomTransaction') recorded.push(args);
      return true;
    };
    caretIn('two');
    press('Backspace');
    expect(root.innerHTML).toBe('<ul><li>one</li><li>two</li></ul>');
    expect(recorded).toEqual([[root, '<ul><li>one<ul><li>two</li></ul></li></ul>', '<ul><li>one</li><li>two</li></ul>']]);
    delete (window as any).execEditorCommand;
  });

  it('is left to the browser away from the start', () => {
    setUp('<ul><li>one</li></ul>');
    caretIn('one', 1);
    expect(press('Backspace').defaultPrevented).toBe(false);
  });
});
