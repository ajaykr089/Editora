import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createEditor } from '../index';

// createEditor used to add its default extensions to the caller's own `extensions` array. A second editor made
// from the same options then found a keymap already there, did not get one of its own, and shared the first
// editor's: Ctrl+Z in the first editor ran undo in the second.
let hosts: HTMLElement[] = [];
const host = () => {
  const el = document.createElement('div');
  document.body.appendChild(el);
  hosts.push(el);
  return el;
};

beforeEach(() => {
  Object.defineProperty(Range.prototype, 'getClientRects', { configurable: true, writable: true, value: () => [] });
  Object.defineProperty(Range.prototype, 'getBoundingClientRect', { configurable: true, writable: true, value: () => new DOMRect() });
});

afterEach(() => {
  hosts.forEach((el) => el.remove());
  hosts = [];
  delete (Range.prototype as any).getClientRects;
  delete (Range.prototype as any).getBoundingClientRect;
});

describe('createEditor with shared options', () => {
  it('leaves the caller’s extensions array as it was', () => {
    const options = { extensions: [] };
    const editor = createEditor(host(), options);
    expect(options.extensions).toEqual([]);
    editor.destroy();
  });

  it('gives each editor its own keymap, so undo acts on the editor it was pressed in', () => {
    const options = { extensions: [] };
    const first = createEditor(host(), { ...options, value: 'one' });
    const second = createEditor(host(), { ...options, value: 'two' });
    expect(first.getKeymapExtension()).not.toBe(second.getKeymapExtension());

    const surface = first.getView().getContentElement();
    surface.focus();
    first.setCursor({ line: 0, column: 3 });
    surface.dispatchEvent(new InputEvent('beforeinput', { inputType: 'insertText', data: '!', bubbles: true, cancelable: true }));
    expect(first.getValue()).toBe('one!');

    surface.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', code: 'KeyZ', ctrlKey: true, bubbles: true, cancelable: true }));
    expect(first.getValue()).toBe('one');
    expect(second.getValue()).toBe('two');
    first.destroy();
    second.destroy();
  });
});
