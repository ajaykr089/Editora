import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createEditor, ReadOnlyExtension } from '../index';

// Ctrl+R used to toggle read-only mode. Pressed twice it made a read-only editor editable, and it swallowed the
// browser's reload shortcut on Windows and Linux.
let container: HTMLElement;

beforeEach(() => {
  Object.defineProperty(Range.prototype, 'getClientRects', { configurable: true, writable: true, value: () => [] });
  Object.defineProperty(Range.prototype, 'getBoundingClientRect', { configurable: true, writable: true, value: () => new DOMRect() });
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  container.remove();
  delete (Range.prototype as any).getClientRects;
  delete (Range.prototype as any).getBoundingClientRect;
});

const pressCtrlR = (target: HTMLElement) => {
  const event = new KeyboardEvent('keydown', { key: 'r', code: 'KeyR', ctrlKey: true, bubbles: true, cancelable: true });
  target.dispatchEvent(event);
  return event;
};

describe('ReadOnlyExtension', () => {
  it('cannot be switched off from the keyboard', () => {
    const readOnly = new ReadOnlyExtension();
    const editor = createEditor(container, { value: 'secret = 1', readOnly: true, extensions: [readOnly] });
    const surface = editor.getView().getContentElement();

    const first = pressCtrlR(surface);
    pressCtrlR(surface);

    expect(first.defaultPrevented).toBe(false);
    expect(surface.contentEditable).toBe('false');
    expect(readOnly.isCurrentlyReadOnly()).toBe(true);

    surface.dispatchEvent(new InputEvent('beforeinput', { inputType: 'insertText', data: 'X', bubbles: true, cancelable: true }));
    expect(editor.getValue()).toBe('secret = 1');
    editor.destroy();
  });

  it('reports and toggles the editor’s own read-only state', () => {
    const readOnly = new ReadOnlyExtension();
    const editor = createEditor(container, { value: '', readOnly: true, extensions: [readOnly] });
    expect(readOnly.isCurrentlyReadOnly()).toBe(true);

    editor.executeCommand('toggleReadOnly');
    expect(readOnly.isCurrentlyReadOnly()).toBe(false);
    expect(editor.getView().getContentElement().contentEditable).toBe('true');

    editor.setReadOnly(true);
    expect(readOnly.isCurrentlyReadOnly()).toBe(true);
    editor.executeCommand('setReadOnly', false);
    expect(editor.getConfig().readOnly).toBe(false);
    editor.destroy();
  });
});
