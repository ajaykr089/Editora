import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { returnFocusToText } from '../dialogHelpers';
import { attachAnchoredPopover } from '../../src/utils/anchoredPopover';

// jsdom has no layout: say every element takes up room so the popover finds its controls and positions itself.
const room = vi.fn(() => [{}] as unknown as DOMRectList);

let anchor: HTMLButtonElement;
let popover: HTMLElement;
let handle: ReturnType<typeof attachAnchoredPopover> | null = null;

const key = (target: Element, init: KeyboardEventInit) => {
  const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init });
  target.dispatchEvent(event);
  return event;
};

beforeEach(() => {
  vi.useFakeTimers();
  HTMLElement.prototype.getClientRects = room;
  HTMLElement.prototype.getBoundingClientRect = () => ({ x: 0, y: 0, left: 0, top: 0, right: 40, bottom: 20, width: 40, height: 20, toJSON() {} }) as DOMRect;
  document.body.innerHTML = '<button id="anchor">Colour</button>';
  anchor = document.getElementById('anchor') as HTMLButtonElement;
  popover = document.createElement('div');
  popover.innerHTML = '<button class="sw" id="s1"></button><button class="sw selected" id="s2"></button><button class="sw" id="s3"></button><input id="hex">';
  document.body.appendChild(popover);
});

afterEach(() => {
  handle?.destroy();
  handle = null;
  vi.useRealTimers();
  document.body.innerHTML = '';
});

describe('a popover that takes the focus', () => {
  const open = (extra: Partial<Parameters<typeof attachAnchoredPopover>[0]> = {}) => {
    handle = attachAnchoredPopover({ popover, anchor, onClose: vi.fn(), label: 'Colour', initialFocus: '.sw.selected', ...extra });
    return handle;
  };

  it('is a named dialog', () => {
    open();
    expect(popover.getAttribute('role')).toBe('dialog');
    expect(popover.getAttribute('aria-label')).toBe('Colour');
  });

  it('moves the focus to the chosen control, but not in the same key press that opened it', () => {
    open();
    expect(popover.contains(document.activeElement)).toBe(false);
    vi.advanceTimersByTime(5);
    expect(document.activeElement?.id).toBe('s2');
  });

  it('starts on the first control when nothing matches the selector', () => {
    open({ initialFocus: '.nothing' });
    vi.advanceTimersByTime(5);
    expect(document.activeElement?.id).toBe('s1');
  });

  it('tries again when something else takes the focus straight back', () => {
    open();
    const editor = document.createElement('div');
    editor.setAttribute('contenteditable', 'true');
    editor.tabIndex = 0;
    document.body.appendChild(editor);
    const original = popover.querySelector<HTMLElement>('#s2')!.focus.bind(popover.querySelector('#s2'));
    let blocked = 2;
    popover.querySelector<HTMLElement>('#s2')!.focus = () => {
      if (blocked-- > 0) return editor.focus();
      original();
    };
    vi.advanceTimersByTime(300);
    expect(document.activeElement?.id).toBe('s2');
  });

  it('does not touch the focus when no initial focus is asked for', () => {
    open({ initialFocus: undefined, label: undefined });
    vi.advanceTimersByTime(300);
    expect(popover.contains(document.activeElement)).toBe(false);
    expect(popover.getAttribute('role')).toBeNull();
  });

  it('keeps Tab inside, moving the focus itself, and wraps at both ends', () => {
    open();
    vi.advanceTimersByTime(5);
    const tab = (shiftKey = false) => key(document.activeElement as Element, { key: 'Tab', shiftKey });
    expect(tab().defaultPrevented).toBe(true);
    expect(document.activeElement?.id).toBe('s3');
    tab();
    expect(document.activeElement?.id).toBe('hex');
    tab();
    expect(document.activeElement?.id).toBe('s1');
    tab(true);
    expect(document.activeElement?.id).toBe('hex');
  });

  it('leaves a Tab that something inside has already handled', () => {
    open();
    vi.advanceTimersByTime(5);
    const field = document.getElementById('hex') as HTMLElement;
    field.focus();
    field.addEventListener('keydown', (event) => event.preventDefault());
    key(field, { key: 'Tab' });
    expect(document.activeElement?.id).toBe('hex');
  });

  it('does not move the focus after it has been closed', () => {
    open();
    handle!.destroy();
    vi.advanceTimersByTime(300);
    expect(popover.contains(document.activeElement)).toBe(false);
  });
});

describe('returnFocusToText', () => {
  let editor: HTMLElement;
  beforeEach(() => {
    editor = document.createElement('div');
    editor.setAttribute('contenteditable', 'true');
    editor.tabIndex = 0;
    editor.innerHTML = '<p>Alpha beta gamma</p>';
    document.body.appendChild(editor);
  });

  const rangeOver = (from: number, to: number) => {
    const text = editor.querySelector('p')!.firstChild as Text;
    const range = document.createRange();
    range.setStart(text, from);
    range.setEnd(text, to);
    return range;
  };

  it('focuses the text the range is in and puts the selection back', () => {
    returnFocusToText(null, rangeOver(6, 10));
    expect(document.activeElement).toBe(editor);
    expect(window.getSelection()?.toString()).toBe('beta');
  });

  it('finds the editable from an element around it when there is no range', () => {
    const wrapper = document.createElement('section');
    document.body.appendChild(wrapper);
    wrapper.appendChild(editor);
    returnFocusToText(wrapper, null);
    expect(document.activeElement).toBe(editor);
  });

  it('focuses the text but does not restore a range whose nodes are gone', () => {
    const range = rangeOver(6, 10);
    editor.innerHTML = '<p>Replaced</p>';
    returnFocusToText(editor, range);
    expect(document.activeElement).toBe(editor);
    expect(window.getSelection()?.toString()).not.toBe('beta');
  });

  it('does nothing without an editor', () => {
    expect(() => returnFocusToText(null, null)).not.toThrow();
  });
});
