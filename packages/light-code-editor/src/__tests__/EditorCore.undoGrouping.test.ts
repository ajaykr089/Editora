import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createEditor } from '../index';

// Undo used to take back one character at a time and keep only the last 100 of them. Typing is now grouped
// into words, and the caret goes back where the change was.
let container: HTMLElement;
let editor: ReturnType<typeof createEditor>;

const surface = () => editor.getView().getContentElement();

/** Types the way the editor sees it from the browser: a cancelable `beforeinput` carrying the character. */
const type = (chars: string) => {
  for (const ch of chars) {
    surface().dispatchEvent(new InputEvent('beforeinput', { inputType: 'insertText', data: ch, bubbles: true, cancelable: true }));
  }
};
const backspace = (count = 1) => {
  for (let i = 0; i < count; i++) {
    surface().dispatchEvent(new InputEvent('beforeinput', { inputType: 'deleteContentBackward', bubbles: true, cancelable: true }));
  }
};
const undo = () => editor.executeCommand('undo');
const redo = () => editor.executeCommand('redo');
const pause = (ms: number) => vi.setSystemTime(Date.now() + ms);

const start = (value = 'const a') => {
  editor = createEditor(container, { value });
  surface().focus();
  editor.setCursor({ line: 0, column: value.length });
};

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-01-01T10:00:00Z'));
  // jsdom has no layout; the editor asks a range for its rectangles when it moves the caret.
  Object.defineProperty(Range.prototype, 'getClientRects', { configurable: true, writable: true, value: () => [] });
  Object.defineProperty(Range.prototype, 'getBoundingClientRect', { configurable: true, writable: true, value: () => new DOMRect() });
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  editor?.destroy();
  container.remove();
  vi.useRealTimers();
  delete (Range.prototype as any).getClientRects;
  delete (Range.prototype as any).getBoundingClientRect;
});

describe('undo steps in the code editor', () => {
  it('takes back a run of typed letters with one undo', () => {
    start();
    type('bcd');
    expect(editor.getValue()).toBe('const abcd');
    undo();
    expect(editor.getValue()).toBe('const a');
  });

  it('takes back one word at a time, the word keeping its trailing space', () => {
    start('');
    type('let total = 42;');
    expect(editor.getValue()).toBe('let total = 42;');
    undo();
    expect(editor.getValue()).toBe('let total = ');
    undo();
    expect(editor.getValue()).toBe('let total ');
    undo();
    expect(editor.getValue()).toBe('let ');
    undo();
    expect(editor.getValue()).toBe('');
  });

  it('starts a new step after a pause', () => {
    start('');
    type('abc');
    pause(1500);
    type('def');
    undo();
    expect(editor.getValue()).toBe('abc');
    undo();
    expect(editor.getValue()).toBe('');
  });

  it('keeps typing and deleting as separate steps, and groups consecutive deletes', () => {
    start('');
    type('abcdef');
    backspace(3);
    expect(editor.getValue()).toBe('abc');
    undo();
    expect(editor.getValue()).toBe('abcdef');
    undo();
    expect(editor.getValue()).toBe('');
  });

  it('keeps a long run undoable beyond the old limit of 100 steps', () => {
    start('');
    type('x'.repeat(250));
    undo();
    expect(editor.getValue()).toBe('');
    redo();
    expect(editor.getValue()).toBe('x'.repeat(250));
  });

  it('gives a new line its own step', () => {
    start('');
    type('one');
    surface().dispatchEvent(new InputEvent('beforeinput', { inputType: 'insertParagraph', bubbles: true, cancelable: true }));
    type('two');
    expect(editor.getValue()).toBe('one\ntwo');
    undo();
    expect(editor.getValue()).toBe('one\n');
    undo();
    expect(editor.getValue()).toBe('one');
    undo();
    expect(editor.getValue()).toBe('');
  });

  it('starts a new step when the mouse is pressed in the editor', () => {
    start('');
    type('abc');
    surface().dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
    type('def');
    undo();
    expect(editor.getValue()).toBe('abc');
  });

  it('starts a new step when a caret key is pressed, but not for other keys', () => {
    start('');
    type('abc');
    surface().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true }));
    type('def');
    undo();
    expect(editor.getValue()).toBe('abc');

    undo();
    type('abc');
    surface().dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift', bubbles: true, cancelable: true }));
    type('def');
    undo();
    expect(editor.getValue()).toBe('');
  });

  it('starts a fresh step for typing after an undo, instead of growing the one before', () => {
    start('');
    type('one');
    pause(1500);
    type('two');
    undo();
    expect(editor.getValue()).toBe('one');
    type('X');
    undo();
    expect(editor.getValue()).toBe('one');
    undo();
    expect(editor.getValue()).toBe('');
  });

  it('does not merge keystrokes when the text was changed in between by something else', () => {
    start('');
    type('abc');
    editor.setValue('abc and a change from outside');
    type('d');
    undo();
    expect(editor.getValue()).toBe('abc and a change from outside');
  });

  it('never merges an edit that replaces a selection, or a paste, into the typing before it', () => {
    start('');
    type('abc');
    editor.setSelection({ start: { line: 0, column: 0 }, end: { line: 0, column: 3 } });
    type('Z');
    expect(editor.getValue()).toBe('Z');
    undo();
    expect(editor.getValue()).toBe('abc');
  });

  it('drops the redo steps when typing resumes', () => {
    start('');
    type('abc');
    undo();
    type('Z');
    redo();
    expect(editor.getValue()).toBe('Z');
  });
});
