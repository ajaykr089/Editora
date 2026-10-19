import { beforeEach, describe, expect, it } from 'vitest';
import {
  getCaretOffsetInBlock,
  liftListsOutOfParagraphs,
  removeEmptyParagraphsAroundLists,
  restoreCaretOffsetInBlock,
} from '../listMarkup';

let root: HTMLElement;

/** Builds `<p>` with children the way the browser leaves them: innerHTML would re-parse and close the paragraph. */
const paragraphWith = (...children: Array<string | HTMLElement>) => {
  const p = document.createElement('p');
  children.forEach((child) => p.append(typeof child === 'string' ? document.createTextNode(child) : child));
  return p;
};
const list = (tag: 'ul' | 'ol', ...items: string[]) => {
  const el = document.createElement(tag);
  items.forEach((text) => {
    const li = document.createElement('li');
    li.textContent = text;
    el.appendChild(li);
  });
  return el;
};
const html = () => root.innerHTML;

beforeEach(() => {
  document.body.innerHTML = '<div id="root" contenteditable="true"></div>';
  root = document.getElementById('root') as HTMLElement;
});

describe('liftListsOutOfParagraphs', () => {
  it('replaces a paragraph that holds only a list with the list', () => {
    root.append(paragraphWith('One'), paragraphWith(list('ul', 'Two')), paragraphWith('Three'));
    liftListsOutOfParagraphs(root);
    expect(html()).toBe('<p>One</p><ul><li>Two</li></ul><p>Three</p>');
  });

  it('does the same for an ordered list', () => {
    root.append(paragraphWith(list('ol', 'a', 'b')));
    liftListsOutOfParagraphs(root);
    expect(html()).toBe('<ol><li>a</li><li>b</li></ol>');
  });

  it('keeps the text on either side of the list in paragraphs of their own, in order', () => {
    root.append(paragraphWith('before', list('ul', 'item'), 'after'));
    liftListsOutOfParagraphs(root);
    expect(html()).toBe('<p>before</p><ul><li>item</li></ul><p>after</p>');
  });

  it('keeps the attributes of the paragraph on the paragraphs it is split into', () => {
    const p = paragraphWith('before', list('ul', 'item'), 'after');
    p.setAttribute('style', 'text-align: center;');
    root.append(p);
    liftListsOutOfParagraphs(root);
    expect(html()).toBe(
      '<p style="text-align: center;">before</p><ul><li>item</li></ul><p style="text-align: center;">after</p>',
    );
  });

  it('does not keep a paragraph for whitespace beside the list', () => {
    root.append(paragraphWith(' ', list('ul', 'item'), '\n'));
    liftListsOutOfParagraphs(root);
    expect(html()).toBe('<ul><li>item</li></ul>');
  });

  it('keeps inline content that is beside the list, such as a placeholder line break or bold text', () => {
    const strong = document.createElement('strong');
    strong.textContent = 'bold';
    root.append(paragraphWith(strong, list('ul', 'item'), document.createElement('br')));
    liftListsOutOfParagraphs(root);
    expect(html()).toBe('<p><strong>bold</strong></p><ul><li>item</li></ul><p><br></p>');
  });

  it('handles several lists in the document, and two in one paragraph', () => {
    root.append(paragraphWith(list('ul', 'a')), paragraphWith('x'), paragraphWith(list('ul', 'b'), 'mid', list('ol', 'c')));
    liftListsOutOfParagraphs(root);
    expect(html()).toBe('<ul><li>a</li></ul><p>x</p><ul><li>b</li></ul><p>mid</p><ol><li>c</li></ol>');
  });

  it('leaves lists that are already blocks of their own, and lists nested in a list item, alone', () => {
    root.innerHTML = '<p>One</p><ul><li>Two<ul><li>nested</li></ul></li></ul><p>Three</p>';
    liftListsOutOfParagraphs(root);
    expect(html()).toBe('<p>One</p><ul><li>Two<ul><li>nested</li></ul></li></ul><p>Three</p>');
  });

  it('leaves a list that sits in another block, such as a table cell or a blockquote, alone', () => {
    root.innerHTML = '<blockquote><ul><li>quoted</li></ul></blockquote>';
    liftListsOutOfParagraphs(root);
    expect(html()).toBe('<blockquote><ul><li>quoted</li></ul></blockquote>');
  });

  it('keeps the caret where it was, inside the list item', () => {
    const ul = list('ul', 'Two');
    root.append(paragraphWith(ul));
    const text = ul.querySelector('li')!.firstChild as Text;
    const range = document.createRange();
    range.setStart(text, 2);
    range.collapse(true);
    const selection = window.getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);

    liftListsOutOfParagraphs(root);

    const now = window.getSelection()!.getRangeAt(0);
    expect(now.startContainer).toBe(text);
    expect(now.startOffset).toBe(2);
    expect(root.contains(now.startContainer)).toBe(true);
  });

  it('keeps a selection that spans the list item', () => {
    const ul = list('ul', 'Two words');
    root.append(paragraphWith(ul));
    const text = ul.querySelector('li')!.firstChild as Text;
    const range = document.createRange();
    range.setStart(text, 0);
    range.setEnd(text, 3);
    window.getSelection()!.removeAllRanges();
    window.getSelection()!.addRange(range);

    liftListsOutOfParagraphs(root);

    expect(window.getSelection()!.toString()).toBe('Two');
  });

  it('does nothing, and does not throw, when there is no selection', () => {
    window.getSelection()!.removeAllRanges();
    root.append(paragraphWith(list('ul', 'Two')));
    expect(() => liftListsOutOfParagraphs(root)).not.toThrow();
    expect(html()).toBe('<ul><li>Two</li></ul>');
  });

  it('does nothing to content with no lists', () => {
    root.innerHTML = '<p>One</p><p>Two</p>';
    liftListsOutOfParagraphs(root);
    expect(html()).toBe('<p>One</p><p>Two</p>');
  });
});

describe('removeEmptyParagraphsAroundLists', () => {
  it('removes the empty paragraphs Chromium leaves in front of and behind a new list', () => {
    root.innerHTML = '<p>One</p><p></p><ul><li>Two</li></ul><p></p><p>Three</p>';
    removeEmptyParagraphsAroundLists(root);
    expect(html()).toBe('<p>One</p><ul><li>Two</li></ul><p>Three</p>');
  });

  it('works at the start and at the end of the document, and for numbered lists', () => {
    root.innerHTML = '<p></p><ol><li>One</li></ol><p></p>';
    removeEmptyParagraphsAroundLists(root);
    expect(html()).toBe('<ol><li>One</li></ol>');
  });

  it('removes a run of them, and looks past whitespace between the blocks', () => {
    root.innerHTML = '<p>One</p>\n<p></p> <p></p><ul><li>Two</li></ul>';
    removeEmptyParagraphsAroundLists(root);
    expect(html()).toBe('<p>One</p>\n <ul><li>Two</li></ul>');
  });

  it('keeps a blank line the user made (it holds a placeholder), and text paragraphs', () => {
    root.innerHTML = '<p>One</p><p><br></p><ul><li>Two</li></ul><p><br></p><p>Three</p>';
    removeEmptyParagraphsAroundLists(root);
    expect(html()).toBe('<p>One</p><p><br></p><ul><li>Two</li></ul><p><br></p><p>Three</p>');
  });

  it('keeps an empty paragraph that is not next to a list', () => {
    root.innerHTML = '<p></p><p>One</p><ul><li>Two</li></ul><p>Three</p><p></p>';
    removeEmptyParagraphsAroundLists(root);
    expect(html()).toBe('<p></p><p>One</p><ul><li>Two</li></ul><p>Three</p><p></p>');
  });

  it('keeps a paragraph that holds an image or other element', () => {
    root.innerHTML = '<ul><li>Two</li></ul><p><img src="x.png"></p>';
    removeEmptyParagraphsAroundLists(root);
    expect(html()).toBe('<ul><li>Two</li></ul><p><img src="x.png"></p>');
  });

  it('does not reach into nested lists, and keeps the caret in the list item', () => {
    root.innerHTML = '<p></p><ul><li>Two<ul><li>nested</li></ul></li></ul>';
    const text = root.querySelector('li')!.firstChild as Text;
    const range = document.createRange();
    range.setStart(text, 1);
    range.collapse(true);
    window.getSelection()!.removeAllRanges();
    window.getSelection()!.addRange(range);

    removeEmptyParagraphsAroundLists(root);

    expect(html()).toBe('<ul><li>Two<ul><li>nested</li></ul></li></ul>');
    expect(window.getSelection()!.getRangeAt(0).startContainer).toBe(text);
  });
});

describe('the caret offset in its block', () => {
  const placeAt = (node: Node, offset: number) => {
    const range = document.createRange();
    range.setStart(node, offset);
    range.collapse(true);
    window.getSelection()!.removeAllRanges();
    window.getSelection()!.addRange(range);
  };

  it('counts the characters from the start of the block to the caret', () => {
    root.innerHTML = '<p>One</p><p>Two <strong>bold</strong> text</p>';
    const strong = root.querySelector('strong')!.firstChild as Text;
    placeAt(strong, 2);
    expect(getCaretOffsetInBlock(root)).toBe(6);
  });

  it('is null when text is selected, when there is no selection or when the caret is outside the editor', () => {
    root.innerHTML = '<p>One</p>';
    window.getSelection()!.removeAllRanges();
    expect(getCaretOffsetInBlock(root)).toBeNull();

    const range = document.createRange();
    range.selectNodeContents(root.firstChild!);
    window.getSelection()!.removeAllRanges();
    window.getSelection()!.addRange(range);
    expect(getCaretOffsetInBlock(root)).toBeNull();

    document.body.insertAdjacentHTML('beforeend', '<p id="out">outside</p>');
    placeAt(document.getElementById('out')!.firstChild!, 2);
    expect(getCaretOffsetInBlock(root)).toBeNull();
  });

  it('puts the caret back at that character after the browser moved it to the start of the item', () => {
    root.innerHTML = '<ul><li>Two words</li></ul>';
    const li = root.querySelector('li')!;
    placeAt(li, 0); // where Chromium leaves it
    restoreCaretOffsetInBlock(root, 3);
    const range = window.getSelection()!.getRangeAt(0);
    expect(range.startContainer).toBe(li.firstChild);
    expect(range.startOffset).toBe(3);
  });

  it('finds the character across inline elements', () => {
    root.innerHTML = '<ul><li>ab<em>cd</em>ef</li></ul>';
    placeAt(root.querySelector('li')!, 0);
    restoreCaretOffsetInBlock(root, 4);
    const range = window.getSelection()!.getRangeAt(0);
    expect(range.startContainer.textContent).toBe('cd');
    expect(range.startOffset).toBe(2);
  });

  it('puts the caret at the end when the offset is past the text', () => {
    root.innerHTML = '<ul><li>abc</li></ul>';
    placeAt(root.querySelector('li')!, 0);
    restoreCaretOffsetInBlock(root, 99);
    const range = window.getSelection()!.getRangeAt(0);
    expect(range.startContainer.textContent).toBe('abc');
    expect(range.startOffset).toBe(3);
  });

  it('leaves the caret alone in a block with no text', () => {
    root.innerHTML = '<ul><li><br></li></ul>';
    const li = root.querySelector('li')!;
    placeAt(li, 0);
    restoreCaretOffsetInBlock(root, 0);
    const range = window.getSelection()!.getRangeAt(0);
    expect(range.startContainer).toBe(li);
    expect(range.startOffset).toBe(0);
  });

  it('does nothing when text is selected', () => {
    root.innerHTML = '<ul><li>abc</li></ul>';
    const range = document.createRange();
    range.selectNodeContents(root.querySelector('li')!);
    window.getSelection()!.removeAllRanges();
    window.getSelection()!.addRange(range);
    restoreCaretOffsetInBlock(root, 1);
    expect(window.getSelection()!.toString()).toBe('abc');
  });
});
