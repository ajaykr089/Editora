import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createEditor, CodeFoldingExtension } from '../index';

// Copy and cut were left to the browser, which copies what is on screen. A folded block is on screen as its
// label, so copying across a fold put " … 3 lines … " on the clipboard, and Cut deleted the code and kept the label.
let container: HTMLElement;
let editor: ReturnType<typeof createEditor>;

const source = `function greet(user) {
  const msg = "hi";
  return msg;
}
const x = 1;`;

const surface = () => editor.getView().getContentElement();

/** jsdom has no DataTransfer; a ClipboardEvent only needs getData/setData here. */
const clipboardEvent = (type: 'copy' | 'cut') => {
  const store = new Map<string, string>();
  const event = new Event(type, { bubbles: true, cancelable: true }) as ClipboardEvent;
  Object.defineProperty(event, 'clipboardData', {
    value: { setData: (k: string, v: string) => store.set(k, v), getData: (k: string) => store.get(k) ?? '' },
  });
  surface().dispatchEvent(event);
  return { event, text: store.get('text/plain') };
};

const selectAllContent = () => {
  const range = document.createRange();
  range.selectNodeContents(surface());
  const selection = window.getSelection()!;
  selection.removeAllRanges();
  selection.addRange(range);
};

beforeEach(() => {
  Object.defineProperty(Range.prototype, 'getClientRects', { configurable: true, writable: true, value: () => [] });
  Object.defineProperty(Range.prototype, 'getBoundingClientRect', { configurable: true, writable: true, value: () => new DOMRect() });
  container = document.createElement('div');
  document.body.appendChild(container);
  editor = createEditor(container, { value: source, extensions: [new CodeFoldingExtension()] });
  surface().focus();
});

afterEach(() => {
  editor.destroy();
  container.remove();
  delete (Range.prototype as any).getClientRects;
  delete (Range.prototype as any).getBoundingClientRect;
});

const foldFirstBlock = () => {
  editor.setCursor({ line: 0, column: 3 });
  editor.executeCommand('fold');
  expect(surface().querySelector('[data-lce-fold-placeholder]')).not.toBeNull();
};

describe('copy and cut', () => {
  it('copies the folded code, not the fold label', () => {
    foldFirstBlock();
    selectAllContent();
    const { event, text } = clipboardEvent('copy');
    expect(event.defaultPrevented).toBe(true);
    expect(text).toBe(source);
    expect(editor.getValue()).toBe(source);
  });

  it('cuts the folded code and leaves an empty editor that pastes it back', () => {
    foldFirstBlock();
    selectAllContent();
    const { text } = clipboardEvent('cut');
    expect(text).toBe(source);
    expect(editor.getValue()).toBe('');
    editor.executeCommand('undo');
    expect(editor.getValue()).toBe(source);
  });

  it('copies part of a line', () => {
    editor.setSelection({ start: { line: 4, column: 6 }, end: { line: 4, column: 11 } });
    expect(clipboardEvent('copy').text).toBe('x = 1');
  });

  it('copies but does not delete in a read-only editor', () => {
    editor.setReadOnly(true);
    editor.setSelection({ start: { line: 4, column: 0 }, end: { line: 4, column: 5 } });
    expect(clipboardEvent('cut').text).toBe('const');
    expect(editor.getValue()).toBe(source);
  });

  it('leaves an empty selection to the browser', () => {
    editor.setCursor({ line: 1, column: 0 });
    expect(clipboardEvent('copy').event.defaultPrevented).toBe(false);
  });
});
