import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getMediaController } from '../ui/mediaController';
import { insertBlocks } from '../ui/picker/insertMedia';

// Media goes in by splitting the paragraph at the caret. At the end of a paragraph (or in an empty one) that left an
// empty paragraph below the media even with a paragraph already there to type in.

vi.mock('../../../shared/notify', () => ({ notify: vi.fn() }));

let editor: HTMLElement;
const blocks = () => Array.from(editor.children).map((el) => (el.tagName === 'FIGURE' ? 'figure' : `${el.tagName.toLowerCase()}:${el.textContent}`));
const figure = () => {
  const node = document.createElement('figure');
  node.className = 'rte-media';
  node.innerHTML = '<img src="https://cdn.test/a.png" alt="">';
  return node;
};
const caretAt = (node: Node, offset: number) => {
  const range = document.createRange();
  range.setStart(node, offset);
  range.collapse(true);
  return range;
};

function setUp(html: string) {
  document.body.innerHTML = `<div class="rte-content" contenteditable="true">${html}</div>`;
  editor = document.querySelector('.rte-content') as HTMLElement;
}

beforeEach(() => getMediaController().detach());
afterEach(() => {
  getMediaController().detach();
  document.body.innerHTML = '';
  delete (window as any).execEditorCommand;
});

describe('inserting media at the caret', () => {
  it('adds no empty paragraph below it when a paragraph follows', () => {
    setUp('<p>Before</p><p>After</p>');
    const next = insertBlocks(caretAt(editor.querySelector('p')!.firstChild!, 6), editor, [figure()]);
    expect(blocks()).toEqual(['p:Before', 'figure', 'p:After']);
    expect(next).toBe(editor.lastElementChild);
  });

  it('takes the place of an empty paragraph', () => {
    setUp('<p>First</p><p><br></p><p>Last</p>');
    insertBlocks(caretAt(editor.children[1], 0), editor, [figure()]);
    expect(blocks()).toEqual(['p:First', 'figure', 'p:Last']);
  });

  it('still leaves a paragraph to type in at the end of the document, or before something that is not text', () => {
    setUp('<p>Only line</p>');
    insertBlocks(caretAt(editor.querySelector('p')!.firstChild!, 9), editor, [figure()]);
    expect(blocks()).toEqual(['p:Only line', 'figure', 'p:']);

    setUp('<p>Text</p><table><tbody><tr><td>x</td></tr></tbody></table>');
    insertBlocks(caretAt(editor.querySelector('p')!.firstChild!, 4), editor, [figure()]);
    expect(blocks()).toEqual(['p:Text', 'figure', 'p:', 'table:x']);
  });

  it('splits a paragraph in the middle as before', () => {
    setUp('<p>Before</p><p>After</p>');
    insertBlocks(caretAt(editor.querySelector('p')!.firstChild!, 3), editor, [figure()]);
    expect(blocks()).toEqual(['p:Bef', 'figure', 'p:ore', 'p:After']);
  });
});
