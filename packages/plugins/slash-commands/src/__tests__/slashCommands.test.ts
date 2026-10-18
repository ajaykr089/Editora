import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { SlashCommandsPlugin } from '../SlashCommandsPlugin.native';
import { keepCaretBlockSelectable } from '../emptyBlock';

let editor: HTMLElement;

const place = (node: Node, offset: number) => {
  const range = document.createRange();
  range.setStart(node, offset);
  range.collapse(true);
  const selection = window.getSelection()!;
  selection.removeAllRanges();
  selection.addRange(range);
  return range;
};

describe('keepCaretBlockSelectable', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div class="rte-content" contenteditable="true"><p>One</p><p></p><p>Three</p></div>';
    editor = document.querySelector('.rte-content') as HTMLElement;
  });

  it('puts a placeholder in an empty block and keeps the caret in it', () => {
    const empty = editor.children[1] as HTMLElement;
    const caret = document.createRange();
    caret.setStart(empty, 0);
    caret.collapse(true);

    expect(keepCaretBlockSelectable(editor, caret)).toBe(empty);
    expect(empty.innerHTML).toBe('<br>');
    expect(caret.startContainer).toBe(empty);
  });

  it('copes with the empty text node that deleting the typed text leaves behind', () => {
    const empty = editor.children[1] as HTMLElement;
    const text = document.createTextNode('');
    empty.appendChild(text);
    const caret = document.createRange();
    caret.setStart(text, 0);
    caret.collapse(true);

    expect(keepCaretBlockSelectable(editor, caret)).toBe(empty);
    expect(empty.innerHTML).toBe('<br>');
    expect(empty.childNodes.length).toBe(1);
    expect(caret.startContainer).toBe(empty);
    expect(caret.startOffset).toBe(0);
  });

  it('leaves a block that still has text alone', () => {
    const block = editor.children[0] as HTMLElement;
    const caret = document.createRange();
    caret.setStart(block.firstChild!, 3);
    caret.collapse(true);

    expect(keepCaretBlockSelectable(editor, caret)).toBeNull();
    expect(block.innerHTML).toBe('One');
  });

  it('leaves a block that has a placeholder, an image or another element that is its content', () => {
    for (const html of ['<br>', '<img src="x.png">', '<hr>', '<span contenteditable="false"></span>']) {
      editor.children[1].innerHTML = html;
      const caret = document.createRange();
      caret.setStart(editor.children[1], 0);
      caret.collapse(true);
      expect(keepCaretBlockSelectable(editor, caret), html).toBeNull();
      expect(editor.children[1].innerHTML).toBe(html);
    }
  });

  it('does nothing for text that sits directly in the editor, with no block around it', () => {
    editor.innerHTML = '';
    const text = document.createTextNode('');
    editor.appendChild(text);
    const caret = document.createRange();
    caret.setStart(text, 0);
    caret.collapse(true);

    expect(keepCaretBlockSelectable(editor, caret)).toBeNull();
    expect(editor.querySelector('br')).toBeNull();
  });

  it('finds the block of a caret inside a list item', () => {
    editor.innerHTML = '<ul><li></li></ul>';
    const li = editor.querySelector('li') as HTMLElement;
    const caret = document.createRange();
    caret.setStart(li, 0);
    caret.collapse(true);

    expect(keepCaretBlockSelectable(editor, caret)).toBe(li);
    expect(li.innerHTML).toBe('<br>');
  });
});

describe('choosing a slash command on an otherwise empty line', () => {
  // jsdom has no layout; the panel asks a range for its rectangles to position itself.
  beforeEach(() => {
    Object.defineProperty(Range.prototype, 'getClientRects', { configurable: true, writable: true, value: () => [] });
    Object.defineProperty(Range.prototype, 'getBoundingClientRect', { configurable: true, writable: true, value: () => new DOMRect() });
  });
  afterEach(() => {
    delete (Range.prototype as any).getClientRects;
    delete (Range.prototype as any).getBoundingClientRect;
  });

  const seen: { block: string | null; placeholder: boolean; caretInBlock: boolean }[] = [];
  let plugin: ReturnType<typeof SlashCommandsPlugin>;

  beforeEach(() => {
    seen.length = 0;
    document.body.innerHTML = '<div class="rte-content" contenteditable="true"><p>One</p><p>Two</p><p id="line"></p><p>Four</p></div>';
    editor = document.querySelector('.rte-content') as HTMLElement;
    plugin = SlashCommandsPlugin({
      includeDefaultItems: false,
      items: [
        {
          id: 'mark',
          label: 'Mark block',
          action: () => {
            // What a block command sees: the block that holds the caret when the command runs.
            const range = window.getSelection()!.getRangeAt(0);
            const node = range.startContainer;
            const block = (node.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node.parentElement)!.closest('p');
            seen.push({
              block: block ? block.id || block.textContent : null,
              placeholder: !!block?.querySelector('br'),
              caretInBlock: !!block && block.contains(range.startContainer),
            });
            return true;
          },
        },
      ],
    });
    plugin.init?.({} as never);
  });

  afterEach(() => {
    plugin.destroy?.();
    document.body.innerHTML = '';
  });

  /** Types the trigger and a query on a line, the way input events arrive, then chooses the first command with Enter. */
  const chooseOn = async (line: HTMLElement, textBefore: string) => {
    editor.focus();
    editor.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    const text = document.createTextNode(`${textBefore}/mark`);
    line.textContent = '';
    line.appendChild(text);
    place(text, text.data.length);
    editor.dispatchEvent(new Event('input', { bubbles: true }));
    editor.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    // The command runs after a microtask (the choice is awaited).
    await vi.waitFor(() => expect(seen.length).toBe(1));
  };

  it('runs the command in the block where the slash was typed, with a placeholder to hold the caret', async () => {
    await chooseOn(document.getElementById('line') as HTMLElement, '');

    expect(seen[0]).toEqual({ block: 'line', placeholder: true, caretInBlock: true });
  });

  it('does not add a placeholder when the line has other text', async () => {
    const line = document.getElementById('line') as HTMLElement;
    await chooseOn(line, 'Word ');

    expect(seen[0].block).toBe('line');
    expect(seen[0].placeholder).toBe(false);
    expect(line.textContent).toBe('Word ');
  });
});

describe('running a command by name when the page has two command bridges', () => {
  let nativeCommand: Mock<any[], any>;
  let plugin: ReturnType<typeof SlashCommandsPlugin>;
  const bridges = ['executeEditorCommand', 'execEditorCommand'] as const;

  beforeEach(() => {
    Object.defineProperty(Range.prototype, 'getClientRects', { configurable: true, writable: true, value: () => [] });
    Object.defineProperty(Range.prototype, 'getBoundingClientRect', { configurable: true, writable: true, value: () => new DOMRect() });
    document.body.innerHTML = '<div class="rte-content" contenteditable="true"><p id="line"></p></div>';
    editor = document.querySelector('.rte-content') as HTMLElement;
    nativeCommand = vi.fn(() => true);
    (document as any).execCommand = nativeCommand;
    plugin = SlashCommandsPlugin({ includeDefaultItems: false, items: [{ id: 'x', label: 'Extra', command: 'toggleBulletList' }] });
    plugin.init?.({} as never);
  });

  afterEach(() => {
    plugin.destroy?.();
    for (const name of bridges) delete (window as any)[name];
    delete (document as any).execCommand;
    delete (Range.prototype as any).getClientRects;
    delete (Range.prototype as any).getBoundingClientRect;
    document.body.innerHTML = '';
  });

  const choose = async () => {
    editor.focus();
    editor.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    const text = document.createTextNode('/extra');
    const line = document.getElementById('line') as HTMLElement;
    line.appendChild(text);
    place(text, text.data.length);
    editor.dispatchEvent(new Event('input', { bubbles: true }));
    editor.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    await new Promise((resolve) => setTimeout(resolve, 20));
  };

  for (const [first, second] of [bridges, [...bridges].reverse()] as const) {
    it(`finds the command on ${second} when ${first} does not know it`, async () => {
      const knows = vi.fn(() => true);
      (window as any)[first] = vi.fn(() => false);
      (window as any)[second] = knows;

      await choose();

      expect(knows).toHaveBeenCalledWith('toggleBulletList', undefined, expect.objectContaining({ contentElement: editor }));
      expect(nativeCommand).not.toHaveBeenCalled();
    });
  }

  it('does not ask the same bridge twice when both names are one function', async () => {
    const bridge = vi.fn((..._args: unknown[]) => false);
    (window as any).executeEditorCommand = bridge;
    (window as any).execEditorCommand = bridge;

    await choose();

    // (The history recording is a second, different command on the same bridge.)
    expect(bridge.mock.calls.filter((call) => call[0] === 'toggleBulletList')).toHaveLength(1);
  });

  it('falls back to the browser command only when no bridge knows it', async () => {
    (window as any).executeEditorCommand = vi.fn(() => false);
    (window as any).execEditorCommand = vi.fn(() => false);

    await choose();

    expect(nativeCommand).toHaveBeenCalledWith('insertUnorderedList');
  });
});
