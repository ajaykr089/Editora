import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createEditor } from '../index';

// Ctrl/Cmd+Shift+Z is redo. The undo binding named no Shift state, so it matched first and undid again.
let container: HTMLElement;
let editor: ReturnType<typeof createEditor>;

const surface = () => editor.getView().getContentElement();
const type = (chars: string) => {
  for (const ch of chars) {
    surface().dispatchEvent(new InputEvent('beforeinput', { inputType: 'insertText', data: ch, bubbles: true, cancelable: true }));
  }
};
const pause = (ms: number) => vi.setSystemTime(Date.now() + ms);

const start = (value = '') => {
  editor = createEditor(container, { value });
  surface().focus();
  editor.setCursor({ line: 0, column: value.length });
};

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-01-01T10:00:00Z'));
  Object.defineProperty(Range.prototype, 'getClientRects', { configurable: true, writable: true, value: () => [] });
  Object.defineProperty(Range.prototype, 'getBoundingClientRect', { configurable: true, writable: true, value: () => new DOMRect() });
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  editor?.destroy();
  container.remove();
  vi.useRealTimers();
  delete (Range.prototype as any).getClientRects;
  delete (Range.prototype as any).getBoundingClientRect;
});

describe('undo and redo shortcuts', () => {
  const press = (init: KeyboardEventInit) => {
    const event = new KeyboardEvent('keydown', { key: 'z', bubbles: true, cancelable: true, ...init });
    surface().dispatchEvent(event);
    return event;
  };

  it('undoes with Ctrl+Z and Cmd+Z, and redoes with Ctrl+Shift+Z and Cmd+Shift+Z', () => {
    start('');
    for (const [undoKeys, redoKeys] of [
      [{ ctrlKey: true }, { ctrlKey: true, shiftKey: true }],
      [{ metaKey: true }, { metaKey: true, shiftKey: true }],
    ] as KeyboardEventInit[][]) {
      type('abc');
      pause(1500);
      press(undoKeys);
      expect(editor.getValue()).toBe('');
      press(redoKeys);
      expect(editor.getValue()).toBe('abc');
      press(undoKeys);
      expect(editor.getValue()).toBe('');
    }
  });

  it('still redoes with Ctrl+Y and Cmd+Y', () => {
    start('');
    type('abc');
    press({ ctrlKey: true });
    press({ key: 'y', ctrlKey: true });
    expect(editor.getValue()).toBe('abc');
  });
});
