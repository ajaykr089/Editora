import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createEditor } from '../index';
import type { EditorExtension } from '../types';

// Tab indents in the editor, so without a way out a keyboard user who has tabbed in is stuck (WCAG 2.1.2).
// Escape is the way out: after it, the next Tab (or Shift+Tab) is left to the browser, which moves the focus.
let container: HTMLElement;
let editor: ReturnType<typeof createEditor>;

const surface = () => editor.getView().getContentElement();
const press = (key: string, init: KeyboardEventInit = {}) => {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init });
  surface().dispatchEvent(event);
  return event;
};
const text = () => surface().textContent;

const start = (config: Parameters<typeof createEditor>[1] = {}) => {
  editor = createEditor(container, { value: 'one\ntwo', ...config });
  surface().focus();
};

beforeEach(() => {
  // jsdom has no layout; the editor asks a range for its rectangles when it moves the caret.
  Object.defineProperty(Range.prototype, 'getClientRects', { configurable: true, writable: true, value: () => [] });
  Object.defineProperty(Range.prototype, 'getBoundingClientRect', { configurable: true, writable: true, value: () => new DOMRect() });
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  editor?.destroy();
  container.remove();
  delete (Range.prototype as any).getClientRects;
  delete (Range.prototype as any).getBoundingClientRect;
});

describe('Tab and the way out of the editor', () => {
  it('indents on Tab and takes the key (nothing changes for someone who is writing)', () => {
    start();
    expect(press('Tab').defaultPrevented).toBe(true);
    expect(press('Tab', { shiftKey: true }).defaultPrevented).toBe(true);
  });

  it('leaves the next Tab to the browser after Escape, so the focus can move on, and the text is not touched', () => {
    start();
    const before = text();
    press('Escape');
    const tab = press('Tab');
    expect(tab.defaultPrevented).toBe(false);
    expect(text()).toBe(before);
  });

  it('does the same for Shift+Tab, to go back', () => {
    start();
    press('Escape');
    expect(press('Tab', { shiftKey: true }).defaultPrevented).toBe(false);
  });

  it('lets go once: the Tab after that indents again', () => {
    start();
    press('Escape');
    expect(press('Tab').defaultPrevented).toBe(false);
    expect(press('Tab').defaultPrevented).toBe(true);
  });

  it('takes the Tab key back when something else is pressed after Escape', () => {
    start();
    press('Escape');
    press('a');
    expect(press('Tab').defaultPrevented).toBe(true);
  });

  it('does not count a modifier key on its own as something else', () => {
    start();
    press('Escape');
    press('Shift', { shiftKey: true });
    expect(press('Tab', { shiftKey: true }).defaultPrevented).toBe(false);
  });

  it('takes the Tab key back when the editor loses the focus', () => {
    start();
    press('Escape');
    surface().dispatchEvent(new Event('blur'));
    expect(press('Tab').defaultPrevented).toBe(true);
  });

  it('does not let go when something handled the Escape (a menu, a panel closing on it)', () => {
    let open = true;
    const closer: EditorExtension = {
      name: 'closer',
      setup() {},
      onKeyDown(event: KeyboardEvent) {
        if (event.key === 'Escape' && open) {
          open = false;
          return false;
        }
        return undefined;
      },
    };
    start({ extensions: [closer] });
    press('Escape'); // closes the panel
    expect(press('Tab').defaultPrevented).toBe(true);
    press('Escape'); // nothing left to close: this one is for the Tab key
    expect(press('Tab').defaultPrevented).toBe(false);
  });

  it('does not let go when a listener of the editor handled the Escape', () => {
    start();
    editor.on('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape') event.preventDefault();
    });
    press('Escape');
    expect(press('Tab').defaultPrevented).toBe(true);
  });

  it('leaves Tab with Ctrl, Alt or Meta to the browser either way, and does not keep the release for later', () => {
    start();
    press('Escape');
    press('Tab', { ctrlKey: true });
    expect(press('Tab').defaultPrevented).toBe(true);
  });
});
