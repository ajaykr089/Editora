import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MediaManagerPlugin } from '../MediaManagerPlugin.native';

// The insert-image / insert-video dialog, driven the way a person drives it.
let editor: HTMLElement;
const plugin = MediaManagerPlugin();
const dialog = () => document.querySelector('.rte-media-dialog') as HTMLElement;
const field = (id: string) => dialog().querySelector<HTMLInputElement>(`#${id}`) as HTMLInputElement;
const insertButton = () => dialog().querySelector<HTMLButtonElement>('#insert-btn') as HTMLButtonElement;

const open = (command: 'insertImage' | 'insertVideo' = 'insertImage') => {
  (plugin.commands as any)[command](undefined, { contentElement: editor });
  vi.advanceTimersByTime(5);
};
const openUrlTab = () => {
  dialog().querySelector<HTMLButtonElement>('.tab-url')!.click();
  vi.advanceTimersByTime(5);
};
/** One typed character: the field's value grows and `input` fires, as in a browser. */
const typeInto = (input: HTMLInputElement, text: string) => {
  for (const ch of text) {
    input.value += ch;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }
};
const placeCaret = (node: Node, offset: number) => {
  const range = document.createRange();
  range.setStart(node, offset);
  range.collapse(true);
  window.getSelection()!.removeAllRanges();
  window.getSelection()!.addRange(range);
};

beforeEach(() => {
  vi.useFakeTimers();
  document.body.innerHTML = '<div class="rte-content" contenteditable="true" tabindex="0"><p>Alpha beta gamma</p></div>';
  editor = document.querySelector('.rte-content') as HTMLElement;
  editor.focus();
  placeCaret(editor.querySelector('p')!.firstChild!, 11);
});

afterEach(() => {
  document.querySelectorAll('.rte-media-overlay').forEach((node) => node.remove());
  vi.useRealTimers();
  document.body.innerHTML = '';
});

describe('typing a URL in the insert dialog', () => {
  it('keeps the same field while typing, so the focus stays in it', () => {
    open();
    openUrlTab();
    const input = field('url-input');
    input.focus();

    typeInto(input, 'https://example.com/pic.png');
    vi.advanceTimersByTime(600);

    expect(field('url-input')).toBe(input);
    expect(input.isConnected).toBe(true);
    expect(input.value).toBe('https://example.com/pic.png');
    expect(document.activeElement).toBe(input);
  });

  it('enables Insert as soon as there is something in the field, and disables it when it is emptied', () => {
    open();
    openUrlTab();
    expect(insertButton().disabled).toBe(true);

    typeInto(field('url-input'), 'h');
    expect(insertButton().disabled).toBe(false);

    field('url-input').value = '';
    field('url-input').dispatchEvent(new Event('input', { bubbles: true }));
    expect(insertButton().disabled).toBe(true);
  });

  it('shows a preview once the typing settles, and updates it in place', () => {
    open();
    openUrlTab();
    typeInto(field('url-input'), 'https://example.com/a.png');
    expect(dialog().querySelector('.rte-media-preview')).toBeNull();

    vi.advanceTimersByTime(500);
    const preview = dialog().querySelector<HTMLImageElement>('.rte-media-preview img')!;
    expect(preview.getAttribute('src')).toBe('https://example.com/a.png');

    typeInto(field('url-input'), 'x');
    vi.advanceTimersByTime(500);
    expect(dialog().querySelector('.rte-media-preview img')).toBe(preview);
    expect(preview.getAttribute('src')).toBe('https://example.com/a.pngx');
  });

  it('removes the preview when the field is emptied', () => {
    open();
    openUrlTab();
    typeInto(field('url-input'), 'https://example.com/a.png');
    vi.advanceTimersByTime(500);
    field('url-input').value = '';
    field('url-input').dispatchEvent(new Event('input', { bubbles: true }));
    vi.advanceTimersByTime(500);
    expect(dialog().querySelector('.rte-media-preview')).toBeNull();
  });

  it('keeps what was typed in the other fields when the dialog is rebuilt, and escapes it', () => {
    open();
    openUrlTab();
    typeInto(field('url-input'), 'https://example.com/a.png?x="><img src=x onerror=alert(1)>');
    typeInto(field('alt-input'), 'A "quoted" <b>alt</b>');
    // Switching tabs rebuilds the dialog from what was typed.
    dialog().querySelector<HTMLButtonElement>('.tab-upload')!.click();
    dialog().querySelector<HTMLButtonElement>('.tab-url')!.click();

    expect(field('url-input').value).toBe('https://example.com/a.png?x="><img src=x onerror=alert(1)>');
    expect(field('alt-input').value).toBe('A "quoted" <b>alt</b>');
    // Nothing the person typed became markup.
    expect(dialog().querySelectorAll('img[onerror]').length).toBe(0);
    expect(dialog().querySelectorAll('b').length).toBe(0);
  });
});

describe('the insert dialog without a pointer', () => {
  it('gives every field a label that is tied to it', () => {
    open();
    openUrlTab();
    for (const id of ['url-input', 'alt-input', 'width-input', 'height-input']) {
      const label = dialog().querySelector(`label[for="${id}"]`);
      expect(label, id).not.toBeNull();
      expect((label!.textContent ?? '').trim().length).toBeGreaterThan(1);
    }
  });

  it('keeps the focus on the tab that was chosen, even though the dialog is rebuilt', () => {
    open();
    const urlTab = dialog().querySelector<HTMLButtonElement>('.tab-url')!;
    urlTab.focus();
    urlTab.click();
    expect(document.activeElement).toBe(dialog().querySelector('.tab-url'));
    expect(dialog().contains(document.activeElement)).toBe(true);

    dialog().querySelector<HTMLButtonElement>('.tab-upload')!.click();
    expect(document.activeElement).toBe(dialog().querySelector('.tab-upload'));
  });

  it('marks the tabs and which one is selected', () => {
    open();
    expect(dialog().querySelector('.tab-upload')!.getAttribute('aria-selected')).toBe('true');
    expect(dialog().querySelector('.tab-url')!.getAttribute('aria-selected')).toBe('false');
    openUrlTab();
    expect(dialog().querySelector('.tab-url')!.getAttribute('aria-selected')).toBe('true');
  });

  it('can be used to upload with the keyboard: the drop zone takes focus and Enter or Space opens the chooser', () => {
    open();
    const zone = dialog().querySelector<HTMLElement>('.dropzone')!;
    expect(zone.getAttribute('tabindex')).toBe('0');
    expect(zone.getAttribute('role')).toBe('button');
    expect((zone.getAttribute('aria-label') ?? '').length).toBeGreaterThan(5);

    const chooser = vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {});
    zone.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    zone.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }));
    zone.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true, cancelable: true }));
    expect(chooser).toHaveBeenCalledTimes(2);
    chooser.mockRestore();
  });

  it('has a name, a role and focus inside once it has opened', () => {
    open();
    expect(dialog().getAttribute('role')).toBe('dialog');
    expect(dialog().getAttribute('aria-modal')).toBe('true');
    expect(dialog().getAttribute('aria-label')).toBe('Insert Image');
    expect(dialog().contains(document.activeElement)).toBe(true);
  });

  it('says Video for a video', () => {
    open('insertVideo');
    expect(dialog().getAttribute('aria-label')).toBe('Insert Video');
    expect(dialog().querySelector('.dropzone')!.getAttribute('aria-label')).toMatch(/video/);
  });
});

describe('inserting the media', () => {
  const insertFromUrl = (url: string, alt = '') => {
    open();
    openUrlTab();
    typeInto(field('url-input'), url);
    if (alt) typeInto(field('alt-input'), alt);
    insertButton().click();
  };

  it('puts the image where the caret was, with its alt text', () => {
    insertFromUrl('https://example.com/a.png', 'A picture');
    const img = editor.querySelector('img') as HTMLImageElement;
    expect(img.getAttribute('src')).toBe('https://example.com/a.png');
    expect(img.alt).toBe('A picture');
    expect(editor.querySelector('p')!.firstChild!.textContent).toBe('Alpha beta ');
    expect(document.querySelector('.rte-media-overlay')).toBeNull();
  });

  it('tells the editor the content changed', () => {
    const changed = vi.fn();
    editor.addEventListener('input', changed);
    insertFromUrl('https://example.com/a.png');
    expect(changed).toHaveBeenCalledTimes(1);
  });

  it('puts the caret after the image, in the editor, so that typing continues there', () => {
    insertFromUrl('https://example.com/a.png');
    expect(document.activeElement).toBe(editor);
    const range = window.getSelection()!.getRangeAt(0);
    expect(range.collapsed).toBe(true);
    const img = editor.querySelector('img')!;
    expect(range.compareBoundaryPoints(Range.START_TO_END, (() => {
      const r = document.createRange();
      r.selectNode(img);
      return r;
    })())).toBeGreaterThanOrEqual(0);
    expect(editor.contains(range.startContainer)).toBe(true);
  });

  it('records the insertion in the undo history', () => {
    const record = vi.fn(() => true);
    (window as any).execEditorCommand = (command: string, ...args: unknown[]) => (command === 'recordDomTransaction' ? record(...args) : false);
    try {
      insertFromUrl('https://example.com/a.png');
      expect(record).toHaveBeenCalledTimes(1);
      const [target, before, after] = record.mock.calls[0] as unknown as [HTMLElement, string, string];
      expect(target).toBe(editor);
      expect(before).toBe('<p>Alpha beta gamma</p>');
      expect(after).toContain('<img');
    } finally {
      delete (window as any).execEditorCommand;
    }
  });

  it('inserts at the end of the editor when it was opened with no selection', () => {
    window.getSelection()!.removeAllRanges();
    insertFromUrl('https://example.com/a.png');
    expect(editor.lastElementChild!.tagName).toBe('IMG');
    expect(editor.querySelector('p')!.textContent).toBe('Alpha beta gamma');
  });

  it('puts a video in the same way, with controls', () => {
    open('insertVideo');
    openUrlTab();
    typeInto(field('url-input'), 'https://example.com/a.mp4');
    insertButton().click();
    const video = editor.querySelector('video') as HTMLVideoElement;
    expect(video.getAttribute('src')).toBe('https://example.com/a.mp4');
    expect(video.controls).toBe(true);
  });

  it('does nothing when Insert is pressed with no URL', () => {
    open();
    openUrlTab();
    insertButton().click();
    expect(editor.querySelector('img')).toBeNull();
    expect(document.querySelector('.rte-media-overlay')).not.toBeNull();
  });
});
