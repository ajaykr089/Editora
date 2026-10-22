import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createEditor } from '../index';
import { CompletionExtension, SearchExtension, EditingCommandsExtension } from '../extensions';

let container: HTMLElement;
let editor: ReturnType<typeof createEditor>;
const surface = () => editor.getView().getContentElement();
const flush = () => new Promise((resolve) => setTimeout(resolve, 20));

beforeEach(() => {
  // jsdom has no layout; the editor asks a range for its rectangles when it moves the caret.
  Object.defineProperty(Range.prototype, 'getClientRects', { configurable: true, writable: true, value: () => [] });
  Object.defineProperty(Range.prototype, 'getBoundingClientRect', { configurable: true, writable: true, value: () => new DOMRect() });
  Object.defineProperty(Element.prototype, 'scrollIntoView', { configurable: true, writable: true, value: () => {} });
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  editor?.destroy?.();
  container.remove();
});

describe('the editing surface', () => {
  it('is a named, multi-line text box, and says when it is read-only', () => {
    editor = createEditor(container, { value: 'one' });
    expect(surface().getAttribute('role')).toBe('textbox');
    expect(surface().getAttribute('aria-multiline')).toBe('true');
    expect(surface().getAttribute('aria-label')).toBe('Code editor');
    expect(surface().hasAttribute('aria-readonly')).toBe(false);

    editor.setReadOnly(true);
    expect(surface().getAttribute('aria-readonly')).toBe('true');
    editor.setReadOnly(false);
    expect(surface().hasAttribute('aria-readonly')).toBe(false);
  });

  it('takes the author\'s accessible name', () => {
    editor = createEditor(container, { value: '', ariaLabel: 'Template source' });
    expect(surface().getAttribute('aria-label')).toBe('Template source');
  });
});

describe('completion popup', () => {
  const items = [
    { label: 'div', kind: 'tag', detail: '<div>', description: 'Inserts a <div> element' },
    { label: 'dialog', kind: 'tag', detail: '<dialog>' }
  ];

  it('is a combobox listbox for the editor, not an unnamed dialog', async () => {
    editor = createEditor(container, { value: '<di', extensions: [new CompletionExtension({ providers: [() => items as never], debounceMs: 0 })] });
    surface().focus();
    editor.setCursor?.({ line: 0, column: 3 } as never);
    editor.executeCommand?.('showCompletions');
    await flush();

    const popup = container.querySelector('.lce-completion-popup') as HTMLElement;
    const list = popup.querySelector('[role="listbox"]') as HTMLElement;
    expect(popup.getAttribute('role')).toBeNull();
    expect(list.getAttribute('aria-label')).toBe('Suggestions');
    expect(list.tabIndex).toBe(-1);
    expect(popup.querySelector('[role="status"]')).toBeTruthy();

    const options = Array.from(list.querySelectorAll('[role="option"]')) as HTMLElement[];
    expect(options.length).toBe(2);
    expect(new Set(options.map((o) => o.id)).size).toBe(2);
    // the editor points at the active suggestion while the popup is open
    const active = options.find((o) => o.getAttribute('aria-selected') === 'true')!;
    expect(surface().getAttribute('aria-activedescendant')).toBe(active.id);
    expect(surface().getAttribute('aria-controls')).toBe(list.id);
    expect(surface().getAttribute('aria-haspopup')).toBe('listbox');

    // a kind badge that is hidden from assistive tech (the kind is also written out as text)
    const icon = options[0].querySelector('.lce-completion-item-icon') as HTMLElement;
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(icon.dataset.kind).toBe('tag');
    // the typed prefix is highlighted
    expect(options[0].querySelector('mark.lce-completion-match')?.textContent).toBe('di');

    editor.executeCommand?.('closeCompletions');
    expect(surface().hasAttribute('aria-activedescendant')).toBe(false);
    expect(surface().hasAttribute('aria-controls')).toBe(false);
  });
});

describe('find and go to line', () => {
  it('give the panels a landmark and every input and icon button a name', () => {
    editor = createEditor(container, { value: 'one\ntwo', extensions: [new SearchExtension(), new EditingCommandsExtension()] });
    editor.executeCommand('find');
    editor.executeCommand('openGoToLine');
    const search = container.querySelector('.lce-search-ui') as HTMLElement;
    expect(search.getAttribute('role')).toBe('search');
    expect(search.getAttribute('aria-label')).toBeTruthy();
    for (const el of Array.from(search.querySelectorAll('input[type="text"], button'))) {
      const name = el.getAttribute('aria-label') || el.textContent?.trim();
      expect(name, el.outerHTML.slice(0, 60)).toBeTruthy();
    }
    const goto = container.querySelector('.lce-goto-line-ui') as HTMLElement;
    expect(goto.getAttribute('role')).toBe('group');
    expect(goto.getAttribute('aria-label')).toBe('Go to line');
    // the visible "Go" is part of the button's name (WCAG 2.5.3)
    const go = Array.from(goto.querySelectorAll('button')).find((b) => b.textContent?.trim() === 'Go')!;
    expect((go.getAttribute('aria-label') || '').toLowerCase()).toContain('go');
  });
});
