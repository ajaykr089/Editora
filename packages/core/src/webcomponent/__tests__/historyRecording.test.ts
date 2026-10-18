import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { RichTextEditorElement } from '../RichTextEditor';
import { PluginLoader } from '../../config/PluginLoader';

// Typed text only reaches the undo history if the editor reports it: the history plugin cannot see keystrokes
// on its own. Without that report, Undo (button or Cmd+Z) did nothing for typing in <editora-editor>.

const record = vi.fn();

function installCommandBridge() {
  (window as any).execEditorCommand = (command: string, ...args: unknown[]) => {
    if (command === 'recordDomTransaction') record(...args);
    return true;
  };
}

async function mount() {
  const el = document.createElement('editora-editor') as any;
  document.body.appendChild(el);
  for (let i = 0; i < 40 && !el.querySelector('.editora-content'); i++) {
    await new Promise((r) => setTimeout(r, 25));
  }
  const content = el.querySelector('.editora-content') as HTMLElement | null;
  expect(content, 'editor content element').toBeTruthy();
  // The element appears before its async setup has attached the input listeners.
  await new Promise((r) => setTimeout(r, 200));
  // Installed after the editor's own set-up, which defines the command bridge the first time it runs.
  installCommandBridge();
  return { el, content: content! };
}

/** One keystroke as the browser reports it: `beforeinput`, the DOM change, then `input`. */
function keystroke(content: HTMLElement, inputType: string, data: string | null, change: () => void) {
  content.dispatchEvent(new InputEvent('beforeinput', { inputType, data, bubbles: true, cancelable: true }));
  change();
  content.dispatchEvent(new InputEvent('input', { inputType, data, bubbles: true }));
}

describe('<editora-editor> reports changes to the history', () => {
  beforeAll(() => {
    (document as any).execCommand ??= () => false;
    (RichTextEditorElement as any).__globalPluginLoader = new PluginLoader();
    if (!customElements.get('editora-editor')) {
      customElements.define('editora-editor', RichTextEditorElement);
    }
  });

  beforeEach(() => {
    record.mockReset();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    delete (window as any).execEditorCommand;
  });

  it('records a typed letter with the content before and after, its input type and its data', async () => {
    const { content } = await mount();
    content.innerHTML = '<p>Hi</p>';

    keystroke(content, 'insertText', '!', () => { content.innerHTML = '<p>Hi!</p>'; });

    expect(record).toHaveBeenCalledTimes(1);
    const [editor, before, after, options] = record.mock.calls[0];
    expect(editor).toBe(content);
    expect(before).toBe('<p>Hi</p>');
    expect(after).toBe('<p>Hi!</p>');
    expect(options).toEqual({ inputType: 'insertText', data: '!', selectionCollapsed: true });
  });

  it('says when text was selected as the key was pressed, so typing over it is not grouped with plain typing', async () => {
    const { content } = await mount();
    content.innerHTML = '<p>Hello</p>';
    const range = document.createRange();
    range.selectNodeContents(content.querySelector('p')!);
    window.getSelection()!.removeAllRanges();
    window.getSelection()!.addRange(range);

    keystroke(content, 'insertText', 'X', () => { content.innerHTML = '<p>X</p>'; });

    expect(record.mock.calls[0][3]).toMatchObject({ inputType: 'insertText', selectionCollapsed: false });
  });

  it('records each keystroke against the content the one before left', async () => {
    const { content } = await mount();
    content.innerHTML = '<p>a</p>';
    keystroke(content, 'insertText', 'b', () => { content.innerHTML = '<p>ab</p>'; });
    keystroke(content, 'insertText', 'c', () => { content.innerHTML = '<p>abc</p>'; });

    expect(record.mock.calls.map((call) => [call[1], call[2]])).toEqual([
      ['<p>a</p>', '<p>ab</p>'],
      ['<p>ab</p>', '<p>abc</p>'],
    ]);
  });

  it('passes deletions on with their input type', async () => {
    const { content } = await mount();
    content.innerHTML = '<p>abc</p>';
    keystroke(content, 'deleteContentBackward', null, () => { content.innerHTML = '<p>ab</p>'; });

    expect(record.mock.calls[0][3]).toEqual({ inputType: 'deleteContentBackward', data: null, selectionCollapsed: true });
  });

  it('does not record an input that changed nothing', async () => {
    const { content } = await mount();
    content.innerHTML = '<p>same</p>';
    keystroke(content, 'insertText', 'x', () => { /* no change */ });

    expect(record).not.toHaveBeenCalled();
  });

  it('does not record the browser undoing or redoing, which the history performs itself', async () => {
    const { content } = await mount();
    content.innerHTML = '<p>ab</p>';
    keystroke(content, 'historyUndo', null, () => { content.innerHTML = '<p>a</p>'; });
    keystroke(content, 'historyRedo', null, () => { content.innerHTML = '<p>ab</p>'; });

    expect(record).not.toHaveBeenCalled();
  });

  it('does not record the history restoring content (an input event with no beforeinput before it)', async () => {
    const { content } = await mount();
    content.innerHTML = '<p>ab</p>';
    content.dispatchEvent(new Event('input', { bubbles: true }));

    expect(record).not.toHaveBeenCalled();
  });

  it('does not fail when no history plugin has registered its commands', async () => {
    const { content } = await mount();
    delete (window as any).execEditorCommand;
    content.innerHTML = '<p>Hi</p>';

    expect(() => keystroke(content, 'insertText', '!', () => { content.innerHTML = '<p>Hi!</p>'; })).not.toThrow();
  });
});
