import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createEditor, CodeFoldingExtension, SyntaxHighlightingExtension } from '../index';
import { View } from '../View';

// The editable text used to be one text node, replaced on every keystroke, so the browser laid out the whole
// document each time. It is now one block per line and an edit writes only the lines it changed.
let container: HTMLElement;
let editor: ReturnType<typeof createEditor>;

const surface = () => editor.getView().getContentElement();
const blocks = () => Array.from(surface().children) as HTMLElement[];
const overlay = () => container.querySelector('[data-editor-highlight]') as HTMLElement;
const type = (chars: string) => {
  for (const ch of chars) {
    surface().dispatchEvent(new InputEvent('beforeinput', { inputType: 'insertText', data: ch, bubbles: true, cancelable: true }));
  }
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
  vi.useRealTimers();
  delete (Range.prototype as any).getClientRects;
  delete (Range.prototype as any).getBoundingClientRect;
});

describe('one block per line', () => {
  it('shows each line as a block, an empty line as a <br>', () => {
    editor = createEditor(container, { value: 'a\n\nc\n' });
    expect(blocks().map((b) => b.outerHTML)).toEqual([
      '<div data-lce-line="">a</div>',
      '<div data-lce-line=""><br></div>',
      '<div data-lce-line="">c</div>',
      '<div data-lce-line=""><br></div>',
    ]);
    expect(editor.getValue()).toBe('a\n\nc\n');
    expect(surface().querySelector('[data-lce-trailing-newline-marker]')).toBeNull();
  });

  it('writes only the line that changed', () => {
    editor = createEditor(container, { value: 'one\ntwo\nthree' });
    const [first, second, third] = blocks();
    surface().focus();
    editor.setCursor({ line: 1, column: 3 });
    type('!');
    expect(editor.getValue()).toBe('one\ntwo!\nthree');
    expect(blocks()[0]).toBe(first);
    expect(blocks()[1]).toBe(second);
    expect(blocks()[2]).toBe(third);
    expect(second.textContent).toBe('two!');
    expect(editor.getCursor().position).toEqual({ line: 1, column: 4 });
  });

  it('adds and removes blocks for new and joined lines', () => {
    editor = createEditor(container, { value: 'ab\ncd', autoIndent: false });
    const last = blocks()[1];
    surface().focus();
    editor.setCursor({ line: 0, column: 1 });
    surface().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    expect(blocks().map((b) => b.textContent)).toEqual(['a', 'b', 'cd']);
    expect(blocks()[2]).toBe(last);
    surface().dispatchEvent(new InputEvent('beforeinput', { inputType: 'deleteContentBackward', bubbles: true, cancelable: true }));
    expect(editor.getValue()).toBe('ab\ncd');
    expect(blocks()).toHaveLength(2);
  });

  it('maps positions to the DOM and back across lines', () => {
    editor = createEditor(container, { value: 'alpha\n\ngamma' });
    surface().focus();
    for (const position of [{ line: 0, column: 2 }, { line: 1, column: 0 }, { line: 2, column: 5 }]) {
      editor.setCursor(position);
      expect(editor.getCursor().position).toEqual(position);
    }
    editor.setSelection({ start: { line: 0, column: 3 }, end: { line: 2, column: 2 } });
    expect(window.getSelection()!.toString().replace(/\n/g, '')).toBe('haga');
    expect(editor.getSelection()).toEqual({ start: { line: 0, column: 3 }, end: { line: 2, column: 2 } });
  });

  it('reads an edit the browser made itself (an IME composition) and leaves its text node alone', async () => {
    editor = createEditor(container, { value: 'ab\ncd' });
    const node = blocks()[1].firstChild as Text;
    node.data = 'cxd';
    surface().dispatchEvent(new InputEvent('input', { inputType: 'insertCompositionText', bubbles: true }));
    expect(editor.getValue()).toBe('ab\ncxd');
    editor.setValue('ab\ncxd');
    expect(blocks()[1].firstChild).toBe(node);
  });

  it('goes back to blocks after a fold is undone by an edit', () => {
    editor = createEditor(container, { value: 'function f() {\n  return 1;\n}\nx', extensions: [new CodeFoldingExtension()] });
    surface().focus();
    editor.setCursor({ line: 0, column: 3 });
    editor.executeCommand('fold');
    expect(surface().querySelector('[data-lce-fold-placeholder]')).not.toBeNull();
    expect(editor.getValue()).toBe('function f() {\n  return 1;\n}\nx');
    editor.setCursor({ line: 3, column: 1 });
    type('y');
    expect(editor.getValue()).toBe('function f() {\n  return 1;\n}\nxy');
    expect(surface().querySelector('[data-lce-fold-placeholder]')).toBeNull();
    expect(blocks().map((b) => b.textContent)).toEqual(['function f() {', '  return 1;', '}', 'xy']);
  });
});

describe('splitHtmlLines', () => {
  it('closes and reopens an element that spans a line break', () => {
    const { lines, startTags } = View.splitHtmlLines('a<span class="c">/* x\ny */</span>b\nc');
    expect(lines).toEqual(['a<span class="c">/* x</span>', '<span class="c">y */</span>b', 'c']);
    expect(startTags).toEqual(['', '<span class="c">', '']);
  });

  it('starts inside elements carried over from the line before', () => {
    const { lines, startTags } = View.splitHtmlLines('x */</span>y', '<span class="c">');
    expect(lines).toEqual(['<span class="c">x */</span>y']);
    expect(startTags).toEqual(['<span class="c">']);
  });
});

describe('highlighting in a long document', () => {
  const longDocument = () => {
    const block = 'function f(a) {\n  // note\n  return "x" + a;\n}\n/* block\n   comment */\n';
    return block.repeat(800);
  };

  it('gives the overlay and the gutter a line for every line of the text', () => {
    editor = createEditor(container, { value: longDocument(), extensions: [new SyntaxHighlightingExtension()] });
    editor.executeCommand('setSyntaxLanguage', 'javascript');
    const lineCount = editor.getValue().split('\n').length;
    expect(overlay().children).toHaveLength(lineCount);
    expect(container.querySelectorAll('[data-editor-gutter-content] > div')).toHaveLength(lineCount);
  });

  it('rewrites only the changed overlay line, then the whole document once typing pauses', () => {
    vi.useFakeTimers();
    const highlighting = new SyntaxHighlightingExtension();
    editor = createEditor(container, { value: longDocument(), extensions: [highlighting] });
    editor.executeCommand('setSyntaxLanguage', 'javascript');
    const before = Array.from(overlay().children);
    const full = vi.spyOn(highlighting, 'highlight');

    surface().focus();
    editor.setCursor({ line: 2, column: 8 });
    type('q');
    // Only the changed line went through the highlighter, not the document.
    expect(full.mock.calls.map(([source]) => source)).toEqual(['  returnq "x" + a;']);
    const after = Array.from(overlay().children);
    expect(after).toHaveLength(before.length);
    expect(after[1]).toBe(before[1]);
    expect(after[3]).toBe(before[3]);
    expect(after[2].textContent).toBe('  returnq "x" + a;');

    vi.advanceTimersByTime(300);
    expect(full).toHaveBeenCalledTimes(2);
    expect(full.mock.calls[1][0]).toBe(editor.getValue());
    const expected = View.splitHtmlLines(highlighting.highlight(editor.getValue(), 'javascript')).lines;
    while (expected.length < editor.getValue().split('\n').length) expected.push('');
    const normalise = (html: string) => {
      const block = document.createElement('div');
      block.innerHTML = html || '<br>';
      return block.innerHTML;
    };
    expect(Array.from(overlay().children).map((line) => line.innerHTML)).toEqual(expected.map(normalise));
  });

  it('keeps the colour of a block comment while typing inside it', () => {
    vi.useFakeTimers();
    editor = createEditor(container, { value: longDocument(), extensions: [new SyntaxHighlightingExtension()] });
    editor.executeCommand('setSyntaxLanguage', 'javascript');
    const commentLine = overlay().children[5] as HTMLElement;
    const colour = (commentLine.firstElementChild as HTMLElement).style.color;
    surface().focus();
    editor.setCursor({ line: 5, column: 4 });
    type('zz');
    const updated = overlay().children[5] as HTMLElement;
    expect(updated.textContent).toBe('   czzomment */');
    expect((updated.firstElementChild as HTMLElement).style.color).toBe(colour);
  });
});
