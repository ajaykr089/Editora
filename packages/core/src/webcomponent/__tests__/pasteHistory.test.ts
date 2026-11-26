import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { RichTextEditorElement } from '../RichTextEditor';
import { PluginLoader } from '../../config/PluginLoader';

// A paste was not an undo step of its own. Inserted as plain text (the default), WebKit reported it as typed text,
// so it joined the run of typing before it, and Chromium did not report it at all; either way Undo took the paste
// back together with what had been typed just before. Inserted as HTML (`paste.keepFormatting`), it was never
// recorded, and no input event said the content had changed.

const record = vi.fn();
let original: unknown;

async function mount() {
  const el = document.createElement('editora-editor') as any;
  document.body.appendChild(el);
  for (let i = 0; i < 40 && !el.querySelector('.editora-content'); i++) {
    await new Promise((r) => setTimeout(r, 25));
  }
  const content = el.querySelector('.editora-content') as HTMLElement;
  expect(content, 'editor content element').toBeTruthy();
  await new Promise((r) => setTimeout(r, 200));
  (window as any).execEditorCommand = (command: string, ...args: unknown[]) => {
    if (command === 'recordDomTransaction') record(...args);
    return true;
  };
  content.innerHTML = '<p>Hi</p>';
  const range = document.createRange();
  range.setStart(content.querySelector('p')!.firstChild!, 2);
  window.getSelection()!.removeAllRanges();
  window.getSelection()!.addRange(range);
  return { el, content };
}

function paste(content: HTMLElement, text: string, html = '') {
  const data = new Map([['text/plain', text], ['text/html', html]]);
  const event = new Event('paste', { bubbles: true, cancelable: true }) as any;
  event.clipboardData = { getData: (type: string) => data.get(type) ?? '' };
  content.dispatchEvent(event);
}

/** execCommand('insertText') as WebKit answers it: beforeinput, the change, input. Chromium sends no beforeinput. */
function browserInsertText(content: HTMLElement, { beforeinput }: { beforeinput: boolean }) {
  (document as any).execCommand = (command: string, _ui: boolean, value: string) => {
    if (command !== 'insertText') return false;
    if (beforeinput) content.dispatchEvent(new InputEvent('beforeinput', { inputType: 'insertText', data: value, bubbles: true }));
    (content.querySelector('p')!.firstChild as Text).appendData(value);
    content.dispatchEvent(new InputEvent('input', { inputType: 'insertText', data: value, bubbles: true }));
    return true;
  };
}

describe('<editora-editor> records a paste as an undo step of its own', () => {
  beforeAll(() => {
    (document as any).execCommand ??= () => false;
    original = (document as any).execCommand;
    (RichTextEditorElement as any).__globalPluginLoader = new PluginLoader();
    if (!customElements.get('editora-editor')) {
      customElements.define('editora-editor', RichTextEditorElement);
    }
  });

  beforeEach(() => record.mockReset());

  afterEach(() => {
    (document as any).execCommand = original;
    delete (window as any).execEditorCommand;
    document.body.innerHTML = '';
  });

  it('when the browser reports the inserted text as typing (WebKit)', async () => {
    const { content } = await mount();
    browserInsertText(content, { beforeinput: true });
    paste(content, ' there');
    expect(record).toHaveBeenCalledTimes(1);
    expect(record.mock.calls[0].slice(1, 3)).toEqual(['<p>Hi</p>', '<p>Hi there</p>']);
    expect(record.mock.calls[0][3]).toMatchObject({ inputType: 'insertFromPaste' });
  });

  it('when the browser does not report it (Chromium)', async () => {
    const { content } = await mount();
    browserInsertText(content, { beforeinput: false });
    paste(content, ' there');
    expect(record).toHaveBeenCalledTimes(1);
    expect(record.mock.calls[0][3]).toMatchObject({ inputType: 'insertFromPaste' });
  });

  it('when it is pasted as HTML, and says the content changed', async () => {
    const { el, content } = await mount();
    el.config.paste = { keepFormatting: true };
    let inputs = 0;
    content.addEventListener('input', () => inputs++);
    paste(content, 'B', '<b>B</b>');
    expect(content.innerHTML).toBe('<p>Hi<b>B</b></p>');
    expect(inputs).toBe(1);
    expect(record).toHaveBeenCalledTimes(1);
    expect(record.mock.calls[0].slice(1, 3)).toEqual(['<p>Hi</p>', '<p>Hi<b>B</b></p>']);
  });
});
