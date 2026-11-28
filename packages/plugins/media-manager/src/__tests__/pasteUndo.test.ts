import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MediaManagerPlugin } from '../MediaManagerPlugin.native';
import { getMediaController } from '../ui/mediaController';
import type { MediaManagerConfig } from '../types/media';

// A pasted or dropped file goes in by splitting the paragraph at the caret for its placeholder. The finished upload
// was recorded for undo from the split document, so Undo left the paragraph in two and nothing could put it back; a
// failed or cancelled upload left it split as well.

vi.mock('../../../shared/notify', () => ({ notify: vi.fn() }));

let editor: HTMLElement;
const blocks = () => Array.from(editor.children).map((el) => (el.tagName === 'FIGURE' ? 'figure' : `${el.tagName.toLowerCase()}:${el.textContent}`));
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

describe('pasting a file into the middle of a paragraph', () => {
  const ORIGINAL = '<p>Alpha beta</p><p>Gamma</p>';
  const paste = () => {
    const range = caretAt(editor.querySelector('p')!.firstChild!, 5);
    window.getSelection()!.removeAllRanges();
    window.getSelection()!.addRange(range);
    const event = Object.assign(new Event('paste', { bubbles: true, cancelable: true }), {
      clipboardData: { files: [new File(['x'], 'shot.png', { type: 'image/png' })], types: ['Files'], getData: () => '' },
    });
    editor.querySelector('p')!.dispatchEvent(event);
  };
  const pending = () => editor.querySelectorAll('[data-rte-media-pending]');
  const make = (config: Partial<MediaManagerConfig>) => MediaManagerPlugin(config);

  it('is undone back to the paragraph in one piece', async () => {
    const recorded: unknown[][] = [];
    (window as any).execEditorCommand = (command: string, ...args: unknown[]) => {
      if (command === 'recordDomTransaction') recorded.push(args);
      return true;
    };
    setUp(ORIGINAL);
    make({ uploadHandler: async () => 'https://cdn.test/shot.png' });
    paste();
    await vi.waitFor(() => expect(recorded).toHaveLength(1));
    expect(recorded[0][1]).toBe(ORIGINAL);
    expect(blocks()).toEqual(['p:Alpha', 'figure', 'p: beta', 'p:Gamma']);
  });

  it('keeps what was typed while it uploaded when undone', async () => {
    const recorded: unknown[][] = [];
    (window as any).execEditorCommand = (command: string, ...args: unknown[]) => {
      if (command === 'recordDomTransaction') recorded.push(args);
      return true;
    };
    let finish!: (url: string) => void;
    setUp(ORIGINAL);
    make({ uploadHandler: () => new Promise((resolve) => (finish = resolve)) });
    paste();
    editor.lastElementChild!.append(' typed');
    finish('https://cdn.test/shot.png');
    await vi.waitFor(() => expect(recorded).toHaveLength(1));
    expect(recorded[0][1]).toContain('Gamma typed');
  });

  it('puts the paragraph back together when the upload fails', async () => {
    setUp(ORIGINAL);
    make({ uploadHandler: async () => { throw new Error('Storage is full.'); } });
    paste();
    await vi.waitFor(() => expect(pending()).toHaveLength(0));
    expect(editor.innerHTML).toBe(ORIGINAL);
  });

  it('puts the paragraph back together when it is cancelled', () => {
    setUp(ORIGINAL);
    make({ uploadHandler: () => new Promise(() => {}) });
    paste();
    expect(pending()).toHaveLength(1);
    document.querySelector<HTMLButtonElement>('.rte-mp-pending button')!.click();
    expect(pending()).toHaveLength(0);
    expect(editor.innerHTML).toBe(ORIGINAL);
  });
});
