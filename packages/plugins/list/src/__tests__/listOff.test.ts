import { afterEach, describe, expect, it } from 'vitest';
import { toggleBulletList, toggleOrderedList } from '../ListPlugin.native';

// Pressing Bullet list (or Numbered list) again on a list is left to the browser's own command, which joins the
// items into one paragraph with line breaks (`<p>a<br>b</p>`), Chromium wrapping each in a span with the editor's
// font: a list could not be turned back into the paragraphs it was made from.

const original = (document as any).execCommand;
let browserCommands: string[] = [];

function setUp(html: string) {
  document.body.innerHTML = `<div class="rte-content" contenteditable="true">${html}</div>`;
  (document as any).execCommand = (command: string) => {
    browserCommands.push(command);
    return true;
  };
  return document.querySelector('.rte-content') as HTMLElement;
}

function select(root: HTMLElement, from: string, to = from, toEnd = false) {
  const textOf = (text: string) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) if (node.textContent === text) return node as Text;
    throw new Error(`no text ${text}`);
  };
  const range = document.createRange();
  range.setStart(textOf(from), 0);
  range.setEnd(textOf(to), toEnd ? to.length : 0);
  window.getSelection()!.removeAllRanges();
  window.getSelection()!.addRange(range);
}

afterEach(() => {
  (document as any).execCommand = original;
  browserCommands = [];
  document.body.innerHTML = '';
});

describe('switching a list off', () => {
  it('gives one paragraph per item, and keeps the selection on the same text', () => {
    const root = setUp('<ul><li>alpha</li><li>beta</li></ul>');
    select(root, 'alpha', 'beta', true);
    toggleBulletList();
    expect(root.innerHTML).toBe('<p>alpha</p><p>beta</p>');
    expect(window.getSelection()!.getRangeAt(0).toString()).toBe('alphabeta');
    expect(browserCommands).toEqual([]);
  });

  it('leaves the items before and after the selection in their list, numbered on', () => {
    const root = setUp('<ol><li>one</li><li>two</li><li>three</li></ol>');
    select(root, 'two');
    toggleOrderedList();
    expect(root.innerHTML).toBe('<ol><li>one</li></ol><p>two</p><ol start="3"><li>three</li></ol>');
  });

  it('keeps a list nested in the item, and an empty item becomes an empty paragraph', () => {
    const root = setUp('<ul><li>a<ul><li>x</li></ul></li></ul><ul><li><br></li></ul>');
    select(root, 'a');
    toggleBulletList();
    expect(root.innerHTML).toBe('<p>a</p><ul><li>x</li></ul><ul><li><br></li></ul>');

    const empty = root.querySelectorAll('li')[1];
    const caret = document.createRange();
    caret.setStart(empty, 0);
    window.getSelection()!.removeAllRanges();
    window.getSelection()!.addRange(caret);
    toggleBulletList();
    expect(root.innerHTML).toBe('<p>a</p><ul><li>x</li></ul><p><br></p>');
  });

  it('leaves a selection that is not only list items to the browser', () => {
    const root = setUp('<ul><li>a</li></ul><p>b</p>');
    select(root, 'a', 'b', true);
    toggleBulletList();
    expect(browserCommands).toEqual(['insertUnorderedList']);
  });

  it('keeps an item\'s own list and the rest of a bullet list as one list', () => {
    const root = setUp('<ul><li>a<ul><li>x</li></ul></li><li>b</li></ul>');
    select(root, 'a');
    toggleBulletList();
    expect(root.innerHTML).toBe('<p>a</p><ul><li>x</li><li>b</li></ul>');
  });

  it('is one undo step', () => {
    const root = setUp('<ul><li>a</li></ul>');
    const recorded: unknown[][] = [];
    (window as any).execEditorCommand = (command: string, ...args: unknown[]) => {
      if (command === 'recordDomTransaction') recorded.push(args);
      return true;
    };
    select(root, 'a');
    toggleBulletList();
    expect(recorded).toEqual([[root, '<ul><li>a</li></ul>', '<p>a</p>']]);
    delete (window as any).execEditorCommand;
  });
});

// Switching between bullets and numbers was the browser's too: it converts item by item, splitting the list, and
// Chromium wraps each converted item in a span with the editor's font.
describe('switching between bullets and numbers', () => {
  it('switches the whole list, keeping its items and the selection', () => {
    const root = setUp('<ul class="x"><li>alpha</li><li>beta</li></ul>');
    select(root, 'beta', 'beta', true);
    toggleOrderedList();
    expect(root.innerHTML).toBe('<ol class="x"><li>alpha</li><li>beta</li></ol>');
    expect(window.getSelection()!.getRangeAt(0).toString()).toBe('beta');
    toggleBulletList();
    expect(root.innerHTML).toBe('<ul class="x"><li>alpha</li><li>beta</li></ul>');
    expect(browserCommands).toEqual([]);
  });

  it('drops the numbering attributes on the way to bullets', () => {
    const root = setUp('<ol start="4"><li>a</li></ol>');
    select(root, 'a');
    toggleBulletList();
    expect(root.innerHTML).toBe('<ul><li>a</li></ul>');
  });
});
