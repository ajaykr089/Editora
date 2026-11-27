import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MediaManagerPlugin } from '../MediaManagerPlugin.native';
import { getMediaController } from '../ui/mediaController';

// The keys were left to the browser with a picture selected, and each browser mishandles a block that is not
// editable in its own way: Backspace and Delete merged the paragraphs on either side (Chromium wrapping the second
// in a styled span, Firefox leaving a <br> behind), typing a letter glued them together (Firefox: a bare text node),
// Enter deleted the picture, and Backspace at the start of the next paragraph deleted the picture and merged too.

vi.mock('../../../shared/notify', () => ({ notify: vi.fn() }));

const PIXEL = 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';
let editor: HTMLElement;
const recorded: unknown[][] = [];

const keydown = (key: string, init: KeyboardEventInit = {}) => {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init });
  editor.dispatchEvent(event);
  return event;
};
const select = (range: Range) => {
  window.getSelection()!.removeAllRanges();
  window.getSelection()!.addRange(range);
  document.dispatchEvent(new Event('selectionchange'));
};
const selectNode = (node: Node) => {
  const range = document.createRange();
  range.selectNode(node);
  select(range);
};
const caretIn = (node: Node, offset: number) => {
  const range = document.createRange();
  range.setStart(node, offset);
  range.collapse(true);
  select(range);
};
const caret = () => {
  const range = window.getSelection()!.getRangeAt(0);
  return `${range.startContainer.nodeType === Node.TEXT_NODE ? range.startContainer.textContent : range.startContainer.nodeName}@${range.startOffset}`;
};
const selectedNode = () => {
  const range = window.getSelection()!.getRangeAt(0);
  return range.endOffset - range.startOffset === 1 ? range.startContainer.childNodes[range.startOffset] : null;
};
const blocks = () => Array.from(editor.children).map((el) => (el.tagName === 'FIGURE' ? 'figure' : `${el.tagName.toLowerCase()}:${el.textContent}`));

function setUp(html: string) {
  document.body.innerHTML = `<div class="rte-content" contenteditable="true">${html}</div>`;
  editor = document.querySelector('.rte-content') as HTMLElement;
  MediaManagerPlugin();
  editor.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
}
const figure = () => editor.querySelector('figure') as HTMLElement;
const PICTURE = `<figure class="rte-media"><img src="${PIXEL}" alt="A card"></figure>`;

beforeEach(() => {
  getMediaController().detach();
  recorded.length = 0;
  (window as any).execEditorCommand = (command: string, ...args: unknown[]) => {
    if (command === 'recordDomTransaction') recorded.push(args);
    return true;
  };
});
afterEach(() => {
  getMediaController().detach();
  document.body.innerHTML = '';
  delete (window as any).execEditorCommand;
});

describe('keys on a selected picture', () => {
  it('Backspace removes it and nothing else, the caret going to the end of the text before it', () => {
    setUp(`<p>Before</p>${PICTURE}<p>After it.</p>`);
    selectNode(figure());
    expect(keydown('Backspace').defaultPrevented).toBe(true);
    expect(blocks()).toEqual(['p:Before', 'p:After it.']);
    expect(caret()).toBe('Before@6');
    expect(recorded).toHaveLength(1);
    expect(getMediaController().selection).toBeNull();
  });

  it('Delete removes it, the caret going to the start of the text after it', () => {
    setUp(`<p>Before</p>${PICTURE}<p>After it.</p>`);
    selectNode(figure());
    expect(keydown('Delete').defaultPrevented).toBe(true);
    expect(blocks()).toEqual(['p:Before', 'p:After it.']);
    expect(caret()).toBe('After it.@0');
  });

  it('leaves an empty paragraph when it was all there was', () => {
    setUp(PICTURE);
    selectNode(figure());
    keydown('Backspace');
    expect(editor.innerHTML).toBe('<p><br></p>');
    expect(caret()).toBe('P@0');
  });

  it('Enter starts a paragraph below it and keeps it', () => {
    setUp(`<p>Before</p>${PICTURE}<p>After it.</p>`);
    selectNode(figure());
    expect(keydown('Enter').defaultPrevented).toBe(true);
    expect(blocks()).toEqual(['p:Before', 'figure', 'p:', 'p:After it.']);
    expect(caret()).toBe('P@0');
    expect(recorded).toHaveLength(1);
  });

  it('typing a character puts it in a paragraph of its own where the picture was', () => {
    setUp(`<p>Before</p>${PICTURE}<p>After it.</p>`);
    selectNode(figure());
    expect(keydown('x').defaultPrevented).toBe(true);
    expect(blocks()).toEqual(['p:Before', 'p:x', 'p:After it.']);
    expect(caret()).toBe('x@1');
    // Shortcuts are not typing.
    setUp(`<p>Before</p>${PICTURE}`);
    selectNode(figure());
    expect(keydown('c', { metaKey: true }).defaultPrevented).toBe(false);
    expect(keydown('c', { ctrlKey: true }).defaultPrevented).toBe(false);
    expect(blocks()).toEqual(['p:Before', 'figure']);
  });

  it('cutting it puts it on the clipboard without its editing attributes, and removes only it', () => {
    setUp(`<p>Before</p>${PICTURE}<p>After it.</p>`);
    selectNode(figure());
    const data = new Map<string, string>();
    const event = new Event('cut', { bubbles: true, cancelable: true }) as ClipboardEvent;
    Object.defineProperty(event, 'clipboardData', { value: { setData: (type: string, value: string) => data.set(type, value) } });
    editor.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(data.get('text/html')).toMatch(/^<figure class="rte-media"[^>]*><img [^>]*alt="A card"[^>]*><\/figure>$/);
    expect(data.get('text/html')).not.toContain('contenteditable');
    expect(data.get('text/plain')).toBe('A card');
    expect(blocks()).toEqual(['p:Before', 'p:After it.']);
  });

  it('removes one picture of a gallery, not the gallery', () => {
    setUp(`<p>Before</p><figure class="rte-media rte-gallery" data-columns="2"><img src="${PIXEL}" alt="one"><img src="${PIXEL}" alt="two"><img src="${PIXEL}" alt="three"></figure>`);
    selectNode(editor.querySelectorAll('img')[1]);
    keydown('Delete');
    expect(Array.from(editor.querySelectorAll('img')).map((img) => img.alt)).toEqual(['one', 'three']);
  });
});

describe('Backspace and Delete next to a picture', () => {
  it('select it from the start of the paragraph after it, and from the end of the one before', () => {
    setUp(`<p>Before</p>${PICTURE}<p>After it.</p>`);
    caretIn(editor.querySelectorAll('p')[1].firstChild!, 0);
    expect(keydown('Backspace').defaultPrevented).toBe(true);
    expect(selectedNode()).toBe(figure());
    expect(blocks()).toEqual(['p:Before', 'figure', 'p:After it.']);

    caretIn(editor.querySelector('p')!.firstChild!, 6);
    expect(keydown('Delete').defaultPrevented).toBe(true);
    expect(selectedNode()).toBe(figure());
    expect(recorded).toHaveLength(0);
  });

  it('take an empty paragraph away and select the picture', () => {
    setUp(`<p>Before</p>${PICTURE}<p><br></p><p>After it.</p>`);
    caretIn(editor.querySelectorAll('p')[1], 0);
    keydown('Backspace');
    expect(blocks()).toEqual(['p:Before', 'figure', 'p:After it.']);
    expect(selectedNode()).toBe(figure());
    expect(recorded).toHaveLength(1);
  });

  it('leave other places alone', () => {
    setUp(`<p>Before</p>${PICTURE}<p>After it.</p>`);
    caretIn(editor.querySelectorAll('p')[1].firstChild!, 3);
    expect(keydown('Backspace').defaultPrevented).toBe(false);
    caretIn(editor.querySelector('p')!.firstChild!, 0);
    expect(keydown('Backspace').defaultPrevented).toBe(false);
  });
});

describe("the toolbar's Remove", () => {
  // It left the caret between the paragraphs, so the next letter typed went outside any paragraph (Firefox) or was
  // glued onto the text before (WebKit).
  const confirmRemove = async () => {
    (document.querySelector('.media-floating-toolbar .btn-remove') as HTMLElement).click();
    const button = () => [...document.querySelectorAll('button')].find((b) => /^remove$/i.test(b.textContent?.trim() ?? ''));
    await vi.waitFor(() => expect(button()).toBeTruthy());
    button()!.click();
    await vi.waitFor(() => expect(editor.querySelector('figure')).toBeNull());
  };

  it('puts the caret in the paragraph after the picture, with the editor focused', async () => {
    setUp(`<p>Before</p>${PICTURE}<p>After it.</p>`);
    selectNode(figure());
    await confirmRemove();
    expect(blocks()).toEqual(['p:Before', 'p:After it.']);
    expect(caret()).toBe('After it.@0');
    expect(document.activeElement).toBe(editor);
    expect(recorded).toHaveLength(1);
  });

  it('leaves a paragraph to type in when the picture was all there was', async () => {
    setUp(PICTURE);
    selectNode(figure());
    await confirmRemove();
    expect(editor.innerHTML).toBe('<p><br></p>');
    expect(caret()).toBe('P@0');
  });
});
