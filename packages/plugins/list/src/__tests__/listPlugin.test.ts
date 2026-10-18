import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { toggleBulletList, toggleOrderedList } from '../ListPlugin.native';

// jsdom has no editing commands. This stands in for Chromium's answer to insertUnorderedList / insertOrderedList
// on a paragraph: the list is put inside the paragraph (`<p><ul>...</ul></p>`), which is not valid HTML.
let editor: HTMLElement;
const original = (document as any).execCommand;

function chromiumListCommand(command: string): boolean {
  const range = window.getSelection()!.getRangeAt(0);
  let node: Node | null = range.startContainer;
  while (node && !(node instanceof HTMLElement && node.tagName === 'P')) node = node.parentNode;
  const paragraph = node as HTMLElement;
  const list = document.createElement(command === 'insertOrderedList' ? 'ol' : 'ul');
  const item = document.createElement('li');
  while (paragraph.firstChild) item.appendChild(paragraph.firstChild);
  list.appendChild(item);
  paragraph.appendChild(list);
  // Chromium leaves the caret in front of the text, on the list item, not in the text node.
  const caret = document.createRange();
  caret.setStart(item, 0);
  caret.collapse(true);
  window.getSelection()!.removeAllRanges();
  window.getSelection()!.addRange(caret);
  return true;
}

beforeEach(() => {
  document.body.innerHTML = '<div class="rte-content" contenteditable="true"><p>One</p><p>Two</p><p>Three</p></div>';
  editor = document.querySelector('.rte-content') as HTMLElement;
  (document as any).execCommand = chromiumListCommand;
  const text = editor.children[1].firstChild as Text;
  const range = document.createRange();
  range.setStart(text, 3);
  range.collapse(true);
  window.getSelection()!.removeAllRanges();
  window.getSelection()!.addRange(range);
});

afterEach(() => {
  (document as any).execCommand = original;
  document.body.innerHTML = '';
});

describe('list plugin with the other answer Chromium gives (the paragraph split, empty paragraphs left behind)', () => {
  beforeEach(() => {
    (document as any).execCommand = () => {
      const paragraph = editor.children[1] as HTMLElement;
      const list = document.createElement('ul');
      const item = document.createElement('li');
      while (paragraph.firstChild) item.appendChild(paragraph.firstChild);
      list.appendChild(item);
      editor.insertBefore(document.createElement('p'), paragraph);
      editor.insertBefore(list, paragraph);
      editor.insertBefore(document.createElement('p'), paragraph);
      editor.removeChild(paragraph);
      const caret = document.createRange();
      caret.setStart(item, 0);
      caret.collapse(true);
      window.getSelection()!.removeAllRanges();
      window.getSelection()!.addRange(caret);
      return true;
    };
  });

  it('leaves no empty paragraphs around the list, and the caret after the text', () => {
    expect(toggleBulletList()).toBe(true);
    expect(editor.innerHTML).toBe('<p>One</p><ul><li>Two</li></ul><p>Three</p>');
    const range = window.getSelection()!.getRangeAt(0);
    expect(range.startContainer.parentElement?.tagName).toBe('LI');
    expect(range.startOffset).toBe(3);
  });
});

describe('list plugin', () => {
  it('makes a bullet list of the line, without a list inside a paragraph', () => {
    expect(toggleBulletList()).toBe(true);
    expect(editor.innerHTML).toBe('<p>One</p><ul><li>Two</li></ul><p>Three</p>');
  });

  it('makes a numbered list of the line', () => {
    expect(toggleOrderedList()).toBe(true);
    expect(editor.innerHTML).toBe('<p>One</p><ol><li>Two</li></ol><p>Three</p>');
  });

  it('survives being serialised and parsed again with no empty paragraph added around the list', () => {
    toggleBulletList();
    const again = document.createElement('div');
    again.innerHTML = editor.innerHTML;
    expect(again.innerHTML).toBe('<p>One</p><ul><li>Two</li></ul><p>Three</p>');
  });

  it('puts the caret back at the end of the text, where it was, not in front of it', () => {
    toggleBulletList();
    const range = window.getSelection()!.getRangeAt(0);
    expect(range.startContainer.nodeType).toBe(Node.TEXT_NODE);
    expect(range.startContainer.parentElement?.tagName).toBe('LI');
    expect(range.startOffset).toBe(3);
  });
});
