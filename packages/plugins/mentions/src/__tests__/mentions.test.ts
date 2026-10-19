import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MentionPlugin } from '../MentionPlugin.native';

// The suggestions have to be a listbox with options, and the editor, which keeps the focus, has to say which is active.
let editor: HTMLElement;
let plugin: ReturnType<typeof MentionPlugin>;

const place = (node: Node, offset: number) => {
  const range = document.createRange();
  range.setStart(node, offset);
  range.collapse(true);
  window.getSelection()!.removeAllRanges();
  window.getSelection()!.addRange(range);
};
const options = () => Array.from(document.querySelectorAll<HTMLElement>('[role="option"]'));
const key = (name: string) => editor.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true, cancelable: true }));

beforeEach(async () => {
  Object.defineProperty(Range.prototype, 'getClientRects', { configurable: true, writable: true, value: () => [] });
  Object.defineProperty(Range.prototype, 'getBoundingClientRect', { configurable: true, writable: true, value: () => new DOMRect() });
  HTMLElement.prototype.scrollIntoView = () => {};
  document.body.innerHTML = '<div class="rte-content" contenteditable="true"><p id="line"></p></div>';
  editor = document.querySelector('.rte-content') as HTMLElement;
  plugin = MentionPlugin({
    items: [
      { id: '1', label: 'Ada Lovelace' },
      { id: '2', label: 'Alan Turing' },
      { id: '3', label: 'Grace Hopper' },
    ],
  });
  plugin.init?.({} as never);
  editor.focus();
  editor.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
  const text = document.createTextNode('@a');
  document.getElementById('line')!.appendChild(text);
  place(text, 2);
  editor.dispatchEvent(new Event('input', { bubbles: true }));
  await vi.waitFor(() => expect(options().length).toBeGreaterThan(0));
});

afterEach(() => {
  plugin.destroy?.();
  delete (Range.prototype as any).getClientRects;
  delete (Range.prototype as any).getBoundingClientRect;
  document.body.innerHTML = '';
});

describe('the mention suggestions', () => {
  it('are a named listbox of options with ids', () => {
    const list = document.querySelector('[role="listbox"]')!;
    expect(list.getAttribute('aria-label')).toBe('Mentions');
    expect(options().map((option) => option.textContent!.trim())).toEqual(['Ada Lovelace', 'Alan Turing', 'Grace Hopper'].filter((name) => /a/i.test(name)));
    expect(new Set(options().map((option) => option.id)).size).toBe(options().length);
    expect(options().every((option) => option.id.length > 0)).toBe(true);
  });

  it('say which option is selected', () => {
    expect(options()[0].getAttribute('aria-selected')).toBe('true');
    expect(options().slice(1).every((option) => option.getAttribute('aria-selected') === 'false')).toBe(true);
  });

  it('are announced through the editor, which keeps the focus', () => {
    expect(editor.getAttribute('aria-activedescendant')).toBe(options()[0].id);
    expect(editor.getAttribute('aria-controls')).toBe(document.querySelector('[role="listbox"]')!.id);
  });

  it('follow the arrow keys', () => {
    key('ArrowDown');
    expect(editor.getAttribute('aria-activedescendant')).toBe(options()[1].id);
    expect(options().map((option) => option.getAttribute('aria-selected'))).toEqual(['false', 'true', 'false']);
    key('ArrowUp');
    expect(editor.getAttribute('aria-activedescendant')).toBe(options()[0].id);
  });

  it('are let go of when they close', () => {
    key('Escape');
    expect(editor.hasAttribute('aria-activedescendant')).toBe(false);
    expect(editor.hasAttribute('aria-controls')).toBe(false);
  });
});
