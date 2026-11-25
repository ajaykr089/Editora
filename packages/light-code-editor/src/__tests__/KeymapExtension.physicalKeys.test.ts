import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createEditor } from '../index';

// Bindings were looked up by `event.key` only. With Shift held, Ctrl+Shift+[ arrives as key "{", so the fold and
// unfold shortcuts never ran; on a Mac, Option+Shift+F arrives as "Ï", so Alt-based shortcuts never ran there.
let container: HTMLElement;
let editor: ReturnType<typeof createEditor>;

beforeEach(() => {
  Object.defineProperty(Range.prototype, 'getClientRects', { configurable: true, writable: true, value: () => [] });
  Object.defineProperty(Range.prototype, 'getBoundingClientRect', { configurable: true, writable: true, value: () => new DOMRect() });
  container = document.createElement('div');
  document.body.appendChild(container);
  editor = createEditor(container, { value: 'x' });
});

afterEach(() => {
  editor.destroy();
  container.remove();
  delete (Range.prototype as any).getClientRects;
  delete (Range.prototype as any).getBoundingClientRect;
});

const press = (init: KeyboardEventInit) => {
  const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init });
  editor.getView().getContentElement().dispatchEvent(event);
  return event;
};

const spyOn = (command: string) => {
  const spy = vi.fn();
  editor.registerCommand(command, spy);
  return spy;
};

describe('shortcuts by physical key', () => {
  it('runs fold and unfold for Ctrl+Shift+[ and ] although the key reads "{" and "}"', () => {
    const fold = spyOn('fold');
    const unfold = spyOn('unfold');
    expect(press({ key: '{', code: 'BracketLeft', ctrlKey: true, shiftKey: true }).defaultPrevented).toBe(true);
    press({ key: '}', code: 'BracketRight', ctrlKey: true, shiftKey: true });
    expect(fold).toHaveBeenCalledTimes(1);
    expect(unfold).toHaveBeenCalledTimes(1);
  });

  it('runs an Alt shortcut when Option changed the character (Option+Shift+F gives "Ï" on a Mac)', () => {
    const format = spyOn('formatDocument');
    press({ key: 'Ï', code: 'KeyF', altKey: true, shiftKey: true });
    expect(format).toHaveBeenCalledTimes(1);
  });

  it('still matches by the letter first, so Ctrl+Z on a German keyboard (physical Y key) is undo', () => {
    const undo = spyOn('undo');
    const redo = spyOn('redo');
    press({ key: 'z', code: 'KeyY', ctrlKey: true });
    expect(undo).toHaveBeenCalledTimes(1);
    expect(redo).not.toHaveBeenCalled();
  });

  it('does not treat plain typing as a shortcut', () => {
    const fold = spyOn('fold');
    const event = press({ key: '{', code: 'BracketLeft', shiftKey: true });
    expect(event.defaultPrevented).toBe(false);
    expect(fold).not.toHaveBeenCalled();
  });
});
