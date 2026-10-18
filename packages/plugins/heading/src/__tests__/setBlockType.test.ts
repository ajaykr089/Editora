import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HeadingPlugin } from '../HeadingPlugin.native';

// Turning a paragraph into a heading moves its text into a new block. The selection used to be thrown away by that
// and the caret put at the start of the block, so a selected word was deselected and the next key went in front.
let editor: HTMLElement;
const run = (level: string) => (HeadingPlugin().commands as any).setBlockType(level, { contentElement: editor });

const select = (node: Node, start: number, end: number = start) => {
  const range = document.createRange();
  range.setStart(node, start);
  range.setEnd(node, end);
  window.getSelection()!.removeAllRanges();
  window.getSelection()!.addRange(range);
};
const selection = () => {
  const range = window.getSelection()!.getRangeAt(0);
  return { text: window.getSelection()!.toString(), container: range.startContainer.textContent, offset: range.startOffset, collapsed: range.collapsed };
};

beforeEach(() => {
  document.body.innerHTML = '<div class="rte-content" contenteditable="true"><p>Alpha beta gamma</p><p>Second</p></div>';
  editor = document.querySelector('.rte-content') as HTMLElement;
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('setBlockType and the selection', () => {
  it('keeps a selected word selected', () => {
    select(editor.querySelector('p')!.firstChild!, 6, 10);
    expect(run('h1')).toBe(true);
    expect(editor.innerHTML).toBe('<h1>Alpha beta gamma</h1><p>Second</p>');
    expect(selection()).toMatchObject({ text: 'beta', collapsed: false });
  });

  it('keeps the caret at the character it was at', () => {
    select(editor.querySelector('p')!.firstChild!, 11);
    run('h2');
    expect(editor.querySelector('h2')).not.toBeNull();
    expect(selection()).toEqual({ text: '', container: 'Alpha beta gamma', offset: 11, collapsed: true });
  });

  it('keeps the selection inside text that carries inline formatting', () => {
    editor.innerHTML = '<p>One <strong>bold</strong> two</p>';
    select(editor.querySelector('strong')!.firstChild!, 1, 3);
    run('h1');
    expect(editor.innerHTML).toBe('<h1>One <strong>bold</strong> two</h1>');
    expect(selection()).toMatchObject({ text: 'ol', collapsed: false });
  });

  it('keeps a selection that spans two paragraphs', () => {
    const [first, second] = Array.from(editor.querySelectorAll('p'));
    const range = document.createRange();
    range.setStart(first.firstChild!, 6);
    range.setEnd(second.firstChild!, 3);
    window.getSelection()!.removeAllRanges();
    window.getSelection()!.addRange(range);
    run('h3');
    expect(editor.innerHTML).toBe('<h3>Alpha beta gamma</h3><h3>Second</h3>');
    expect(window.getSelection()!.toString()).toContain('beta gamma');
    expect(window.getSelection()!.toString()).toContain('Sec');
  });

  it('puts the caret at the start of the new block when the block it was in is replaced (an empty line)', () => {
    editor.innerHTML = '<p>One</p><p><br></p>';
    select(editor.children[1], 0);
    run('h1');
    const range = window.getSelection()!.getRangeAt(0);
    expect(editor.children[1].tagName).toBe('H1');
    expect(editor.children[1].contains(range.startContainer)).toBe(true);
  });

  it('puts the caret in the right place when the selection was a list item turned into a heading', () => {
    editor.innerHTML = '<ul><li>Item one</li><li>Item two</li></ul>';
    select(editor.querySelectorAll('li')[1].firstChild!, 5);
    run('h1');
    expect(editor.innerHTML).toContain('<h1>Item two</h1>');
    expect(window.getSelection()!.rangeCount).toBe(1);
    expect(editor.contains(window.getSelection()!.getRangeAt(0).startContainer)).toBe(true);
  });
});
