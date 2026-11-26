import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { EditoraEditor } from '../index';

// A paste was not an undo step of its own. Inserted as plain text (the default), WebKit reported it as typed text,
// so it joined the run of typing before it, and Chromium did not report it at all; either way Undo took the paste
// back together with what had been typed just before. Inserted as HTML (`paste.keepFormatting`), it was never
// recorded, and onChange did not hear of it.

if (!(globalThis as any).ResizeObserver) {
  (globalThis as any).ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
}

const record = vi.fn();
const original = (document as any).execCommand;

beforeEach(() => {
  record.mockReset();
  (document as any).execCommand = () => false;
  (window as any).execEditorCommand = (command: string, ...args: unknown[]) => {
    if (command === 'recordDomTransaction') record(...args);
    return true;
  };
});

afterEach(() => {
  cleanup();
  (document as any).execCommand = original;
  delete (window as any).execEditorCommand;
});

async function mount(paste?: Record<string, unknown>, onChange?: (html: string) => void) {
  const { container } = render(
    <EditoraEditor defaultValue="<p>Hi</p>" onChange={onChange} plugins={[]} paste={paste} />,
  );
  await new Promise((resolve) => setTimeout(resolve, 0));
  const content = container.querySelector('.rte-content') as HTMLElement;
  const range = document.createRange();
  range.setStart(content.querySelector('p')!.firstChild!, 2);
  window.getSelection()!.removeAllRanges();
  window.getSelection()!.addRange(range);
  return content;
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

describe('EditoraEditor records a paste as an undo step of its own', () => {
  it('when the browser reports the inserted text as typing (WebKit)', async () => {
    const content = await mount();
    browserInsertText(content, { beforeinput: true });
    paste(content, ' there');
    expect(record).toHaveBeenCalledTimes(1);
    expect(record.mock.calls[0].slice(1, 3)).toEqual(['<p>Hi</p>', '<p>Hi there</p>']);
    expect(record.mock.calls[0][3]).toMatchObject({ inputType: 'insertFromPaste' });
  });

  it('when the browser does not report it (Chromium)', async () => {
    const content = await mount();
    browserInsertText(content, { beforeinput: false });
    paste(content, ' there');
    expect(record).toHaveBeenCalledTimes(1);
    expect(record.mock.calls[0][3]).toMatchObject({ inputType: 'insertFromPaste' });
  });

  it('when it is pasted as HTML, and tells onChange', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const onChange = vi.fn();
    const content = await mount({ clean: false, keepFormatting: true }, onChange);
    paste(content, 'B', '<b>B</b>');
    expect(content.innerHTML).toBe('<p>Hi<b>B</b></p>');
    expect(record).toHaveBeenCalledTimes(1);
    expect(record.mock.calls[0].slice(1, 3)).toEqual(['<p>Hi</p>', '<p>Hi<b>B</b></p>']);
    vi.advanceTimersByTime(500);
    expect(onChange).toHaveBeenCalledWith('<p>Hi<b>B</b></p>');
    vi.useRealTimers();
  });
});
