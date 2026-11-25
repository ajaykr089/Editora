import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createEditor } from '../index';

// Enter started every new line at column 0, in a code editor where almost every line is indented.
let container: HTMLElement;
let editor: ReturnType<typeof createEditor>;

const surface = () => editor.getView().getContentElement();
const enter = () => surface().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
const type = (chars: string) => {
  for (const ch of chars) {
    surface().dispatchEvent(new InputEvent('beforeinput', { inputType: 'insertText', data: ch, bubbles: true, cancelable: true }));
  }
};

const start = (value: string, line: number, column: number, options: Record<string, unknown> = {}) => {
  editor = createEditor(container, { value, ...options });
  surface().focus();
  editor.setCursor({ line, column });
};

beforeEach(() => {
  Object.defineProperty(Range.prototype, 'getClientRects', { configurable: true, writable: true, value: () => [] });
  Object.defineProperty(Range.prototype, 'getBoundingClientRect', { configurable: true, writable: true, value: () => new DOMRect() });
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  editor?.destroy();
  container.remove();
  delete (Range.prototype as any).getClientRects;
  delete (Range.prototype as any).getBoundingClientRect;
});

describe('Enter keeps the indentation', () => {
  it('starts the new line at the indentation of the current one', () => {
    start('  const a = 1;', 0, 14);
    enter();
    type('b');
    expect(editor.getValue()).toBe('  const a = 1;\n  b');
  });

  it('indents one level more after an opening bracket', () => {
    start('if (x) {', 0, 8, { tabSize: 4 });
    enter();
    type('y');
    expect(editor.getValue()).toBe('if (x) {\n    y');
  });

  it('puts the closing bracket on its own line when the caret is between a pair', () => {
    start('  f({})', 0, 5);
    enter();
    type('a');
    expect(editor.getValue()).toBe('  f({\n    a\n  })');
  });

  it('indents with tabs when the line does', () => {
    start('\tif (x) {', 0, 9);
    enter();
    expect(editor.getValue()).toBe('\tif (x) {\n\t\t');
  });

  it('splits a line in its indentation without adding any', () => {
    start('    x', 0, 0);
    enter();
    expect(editor.getValue()).toBe('\n    x');
  });

  it('is one undo step', () => {
    start('  a', 0, 3);
    enter();
    editor.executeCommand('undo');
    expect(editor.getValue()).toBe('  a');
  });

  it('can be turned off', () => {
    start('  a {', 0, 5, { autoIndent: false });
    enter();
    expect(editor.getValue()).toBe('  a {\n');
  });
});
