import * as React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import * as TestUtils from 'react-dom/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// The code editor is a contenteditable engine that needs a real browser, so these tests run the
// component against an in-memory stand-in with the same API surface (text, selection offsets, replace,
// events). What is under test is the glue: change echoes, selection handling, commands, shortcuts, theme.
const fake = vi.hoisted(() => ({ instances: [] as any[] }));

vi.mock('@editora/light-code-editor', async () => {
  const { positionToOffset } = await import('../source/commands');

  class FakeEditor {
    surface: HTMLElement;
    text: string;
    start = 0;
    end = 0;
    theme: string | undefined;
    readOnly: boolean;
    destroyed = false;
    focused = 0;
    handlers: Record<string, Array<(...args: any[]) => void>> = {};
    commands: Array<[string, ...any[]]> = [];
    replaceCalls: Array<{ from: number; to: number; text: string }> = [];
    setValueCalls: string[] = [];
    config: any;

    constructor(host: HTMLElement, config: any) {
      this.config = config;
      this.text = config.value ?? '';
      this.theme = config.theme;
      this.readOnly = !!config.readOnly;
      this.surface = document.createElement('div');
      this.surface.setAttribute('contenteditable', 'true');
      host.appendChild(this.surface);
      fake.instances.push(this);
    }

    emit(event: string, ...args: any[]) {
      (this.handlers[event] || []).forEach((handler) => handler(...args));
    }
    on(event: string, handler: (...args: any[]) => void) {
      (this.handlers[event] ||= []).push(handler);
    }
    off() {}
    getValue() {
      return this.text;
    }
    setValue(value: string) {
      this.setValueCalls.push(value);
      this.text = value;
      this.emit('change', [{ text: value }]);
    }
    replace(range: any, text: string) {
      const from = positionToOffset(this.text, range.start);
      const to = positionToOffset(this.text, range.end);
      this.replaceCalls.push({ from, to, text });
      this.text = this.text.slice(0, from) + text + this.text.slice(to);
      this.emit('change', [{ text }]);
    }
    getCursor() {
      return { position: { line: 0, column: 0 } };
    }
    getView() {
      return {
        getContentElement: () => this.surface,
        getSelectionOffsets: () => ({
          isInEditor: true,
          isCollapsed: this.start === this.end,
          startOffset: this.start,
          endOffset: this.end,
        }),
        setSelectionOffsets: (start: number, end: number = start) => {
          this.start = start;
          this.end = end;
        },
      };
    }
    executeCommand(name: string, ...args: any[]) {
      this.commands.push([name, ...args]);
    }
    setTheme(theme: string) {
      this.theme = theme;
    }
    setReadOnly(readOnly: boolean) {
      this.readOnly = readOnly;
    }
    focus() {
      this.focused += 1;
    }
    destroy() {
      this.destroyed = true;
      this.surface.remove();
    }

    // What the user doing something looks like to the component.
    userTypes(text: string, caret = text.length) {
      this.text = text;
      this.start = caret;
      this.end = caret;
      this.emit('change', [{ text }]);
    }
    userSelects(start: number, end: number = start) {
      this.start = start;
      this.end = end;
    }
  }

  return {
    createEditor: (host: HTMLElement, config: any) => new FakeEditor(host, config),
    LineNumbersExtension: class {},
    SearchExtension: class {},
    SyntaxHighlightingExtension: class {},
  };
});

import { SourceEditor, type SourceEditorProps } from '../source/SourceEditor';

const act: (callback: () => void) => void = (React as any).act ?? (TestUtils as any).act;
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

let host: HTMLDivElement;
let root: Root;

const editor = () => fake.instances[fake.instances.length - 1];
const render = (props: Partial<SourceEditorProps> = {}, wrapperClass?: string) => {
  const element = (
    <SourceEditor value="" onChange={() => {}} readOnly={false} placeholder="Write here" {...props} />
  );
  act(() => root.render(wrapperClass ? <div className={wrapperClass}>{element}</div> : element));
};
const button = (command: string) => host.querySelector(`[data-md-command="${command}"]`) as HTMLButtonElement;
const press = (key: string, init: KeyboardEventInit = {}, target: Element = editor().surface) => {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init });
  act(() => {
    target.dispatchEvent(event);
  });
  return event;
};

beforeEach(() => {
  fake.instances.length = 0;
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

describe('SourceEditor', () => {
  describe('the code editor', () => {
    it('is created once, for markdown, with line numbers and wrapping, and labelled for assistive tech', () => {
      render({ value: '# Hi' });
      expect(fake.instances).toHaveLength(1);
      const created = editor();
      expect(created.config).toMatchObject({ value: '# Hi', lineNumbers: true, lineWrapping: true, readOnly: false, theme: 'light' });
      expect(created.commands).toContainEqual(['setSyntaxLanguage', 'markdown']);
      expect(created.surface.getAttribute('role')).toBe('textbox');
      expect(created.surface.getAttribute('aria-multiline')).toBe('true');
      expect(created.surface.getAttribute('aria-label')).toBe('Markdown source');
      expect(created.surface.getAttribute('spellcheck')).toBe('false');
      render({ value: '# Hi again' });
      expect(fake.instances).toHaveLength(1);
    });

    it('is destroyed with the component, along with its status bar', () => {
      render();
      const created = editor();
      expect(host.querySelector('.editora-statusbar')).not.toBeNull();
      act(() => root.render(<div />));
      expect(created.destroyed).toBe(true);
      expect(host.querySelector('.editora-statusbar')).toBeNull();
    });

    it('starts with CRLF line endings normalised, since a stray CR would show as a character', () => {
      render({ value: 'a\r\nb\rc' });
      expect(editor().config.value).toBe('a\nb\nc');
    });
  });

  describe('value and onChange', () => {
    it('reports every change the user makes, with the exact text', () => {
      const onChange = vi.fn();
      render({ onChange });
      act(() => editor().userTypes('* star\n\n1. one\n1. two'));
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith('* star\n\n1. one\n1. two');
    });

    it('takes a value that changed from outside, once, without reporting it back as a change', () => {
      const onChange = vi.fn();
      render({ value: 'one', onChange });
      render({ value: 'two', onChange });
      expect(editor().setValueCalls).toEqual(['two']);
      expect(editor().getValue()).toBe('two');
      expect(onChange).not.toHaveBeenCalled();
    });

    it('ignores a value that is just the echo of what the editor reported', () => {
      const onChange = vi.fn();
      render({ value: '', onChange });
      act(() => editor().userTypes('typed'));
      render({ value: 'typed', onChange });
      expect(editor().setValueCalls).toEqual([]);
    });

    it('normalises a CRLF value from outside before comparing and applying it', () => {
      render({ value: 'a\nb' });
      render({ value: 'a\r\nb' });
      expect(editor().setValueCalls).toEqual([]);
      render({ value: 'x\r\ny' });
      expect(editor().setValueCalls).toEqual(['x\ny']);
    });

    it('follows later changes in readOnly', () => {
      render({ readOnly: false });
      render({ readOnly: true });
      expect(editor().readOnly).toBe(true);
      expect(editor().surface.getAttribute('aria-readonly')).toBe('true');
    });
  });

  describe('placeholder', () => {
    it('shows while the document is empty and goes away when there is text', () => {
      render({ value: '', placeholder: 'Start writing' });
      expect(host.querySelector('.md-source-placeholder')!.textContent).toBe('Start writing');
      act(() => editor().userTypes('x'));
      expect(host.querySelector('.md-source-placeholder')).toBeNull();
      act(() => editor().userTypes(''));
      expect(host.querySelector('.md-source-placeholder')).not.toBeNull();
    });

    it('is not shown for a document that starts with text, and follows a value set from outside', () => {
      render({ value: 'x' });
      expect(host.querySelector('.md-source-placeholder')).toBeNull();
      render({ value: '' });
      expect(host.querySelector('.md-source-placeholder')).not.toBeNull();
    });
  });

  describe('theme', () => {
    it('starts in the Editora theme in effect and follows it when it changes', async () => {
      render({}, 'editora-theme-dark');
      expect(editor().config.theme).toBe('dark');

      const wrapper = host.firstElementChild as HTMLElement;
      await act(async () => {
        wrapper.classList.remove('editora-theme-dark');
        await Promise.resolve();
      });
      expect(editor().theme).toBe('light');
      await act(async () => {
        wrapper.setAttribute('data-theme', 'dark');
        await Promise.resolve();
      });
      expect(editor().theme).toBe('dark');
    });
  });

  describe('toolbar', () => {
    it('applies a command to the selection as one replace, selects what it asks for and reports the change', () => {
      const onChange = vi.fn();
      render({ value: 'a word here', onChange });
      editor().userSelects(2, 6);
      act(() => button('bold').click());
      expect(editor().replaceCalls).toHaveLength(1);
      expect(editor().getValue()).toBe('a **word** here');
      expect(onChange).toHaveBeenLastCalledWith('a **word** here');
      // "word" stays selected, so the next shortcut acts on it.
      expect([editor().start, editor().end]).toEqual([4, 8]);
      expect(editor().focused).toBeGreaterThan(0);
    });

    it('acts on the line the caret is on', () => {
      render({ value: 'one\ntwo\nthree' });
      editor().userSelects(5);
      act(() => button('quote').click());
      expect(editor().getValue()).toBe('one\n> two\nthree');
      editor().userSelects(1);
      act(() => button('bulletList').click());
      expect(editor().getValue()).toBe('- one\n> two\nthree');
    });

    it('has image and table buttons that insert one undoable block and select what to type next', () => {
      render({ value: 'intro' });
      editor().userSelects(5);
      act(() => button('image').click());
      expect(editor().getValue()).toBe('intro![alt text](url)');
      expect(editor().getValue().slice(editor().start, editor().end)).toBe('alt text');

      act(() => editor().setValue('intro'));
      editor().userSelects(5);
      editor().replaceCalls.length = 0;
      act(() => button('table').click());
      expect(editor().replaceCalls).toHaveLength(1);
      expect(editor().getValue()).toBe(
        'intro\n\n| Header 1 | Header 2 | Header 3 |\n| --- | --- | --- |\n| Cell | Cell | Cell |\n| Cell | Cell | Cell |',
      );
      expect(editor().getValue().slice(editor().start, editor().end)).toBe('Header 1');
    });

    it('runs undo and redo in the code editor', () => {
      render();
      act(() => button('undo').click());
      act(() => button('redo').click());
      expect(editor().commands).toContainEqual(['undo']);
      expect(editor().commands).toContainEqual(['redo']);
    });

    it('is disabled, and does nothing, when read-only', () => {
      render({ value: 'text', readOnly: true });
      const buttons = Array.from(host.querySelectorAll<HTMLButtonElement>('.md-source-toolbar button'));
      expect(buttons.length).toBeGreaterThan(10);
      expect(buttons.every((b) => b.disabled)).toBe(true);
      editor().userSelects(0, 4);
      act(() => button('bold').click());
      expect(editor().getValue()).toBe('text');
    });

    it('does not take focus from the text when a button is pressed with the mouse', () => {
      render();
      const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
      act(() => {
        button('bold').dispatchEvent(event);
      });
      expect(event.defaultPrevented).toBe(true);
    });

    it('has the toolbar role and a single tab stop that arrow keys move along', () => {
      render();
      const toolbar = host.querySelector('[role="toolbar"]') as HTMLElement;
      expect(toolbar.getAttribute('aria-label')).toBe('Markdown formatting');
      const buttons = Array.from(toolbar.querySelectorAll<HTMLButtonElement>('button[data-md-roving]'));
      expect(buttons.filter((b) => b.tabIndex === 0)).toHaveLength(1);
      buttons[0].focus();
      press('ArrowRight', {}, buttons[0]);
      expect(document.activeElement).toBe(buttons[1]);
      press('End', {}, buttons[1]);
      expect(document.activeElement).toBe(buttons[buttons.length - 1]);
      press('ArrowRight', {}, buttons[buttons.length - 1]);
      expect(document.activeElement).toBe(buttons[0]);
    });
  });

  describe('heading menu', () => {
    it('shows the heading level of the line the caret is on', () => {
      render({ value: 'plain\n## Two' });
      editor().userSelects(0);
      act(() => editor().emit('cursor', {}));
      expect(button('heading').textContent).toBe('P ▼');
      editor().userSelects(8);
      act(() => editor().emit('cursor', {}));
      expect(button('heading').textContent).toBe('H2 ▼');
    });

    it('opens, marks the current level, applies a level and closes', () => {
      render({ value: 'Title' });
      editor().userSelects(2);
      act(() => button('heading').click());
      expect(button('heading').getAttribute('aria-expanded')).toBe('true');
      const items = Array.from(host.querySelectorAll<HTMLElement>('[role="menuitemradio"]'));
      expect(items.map((i) => i.textContent)).toEqual(['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6']);
      expect(items.filter((i) => i.getAttribute('aria-checked') === 'true').map((i) => i.textContent)).toEqual(['P']);

      act(() => items[2].click());
      expect(editor().getValue()).toBe('## Title');
      expect(host.querySelector('[role="menu"]')).toBeNull();
    });

    it('closes on Escape and returns focus to its button', () => {
      render({ value: 'x' });
      act(() => button('heading').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true })));
      const menu = host.querySelector('[role="menu"]') as HTMLElement;
      expect(menu).not.toBeNull();
      press('Escape', {}, menu);
      expect(host.querySelector('[role="menu"]')).toBeNull();
      expect(document.activeElement).toBe(button('heading'));
    });

    it('closes when something else is clicked', () => {
      render({ value: 'x' });
      act(() => button('heading').click());
      expect(host.querySelector('[role="menu"]')).not.toBeNull();
      act(() => {
        document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));
      });
      expect(host.querySelector('[role="menu"]')).toBeNull();
    });
  });

  describe('shortcuts', () => {
    it.each([
      ['b', {}, 'a **«word»** b'],
      ['i', {}, 'a *«word»* b'],
      ['e', {}, 'a `«word»` b'],
      ['x', { shiftKey: true }, 'a ~~«word»~~ b'],
    ])('Cmd/Ctrl+%s formats the selection', (key, extra, expected) => {
      for (const modifier of [{ metaKey: true }, { ctrlKey: true }]) {
        fake.instances.length = 0;
        render({ value: 'a word b' });
        editor().userSelects(2, 6);
        const event = press(key, { ...modifier, ...extra });
        expect(event.defaultPrevented).toBe(true);
        expect(editor().getValue()).toBe(expected.replace(/[«»]/g, ''));
        act(() => root.render(<div />));
      }
    });

    it('Cmd/Ctrl+K makes a link', () => {
      render({ value: 'the docs' });
      editor().userSelects(0, 8);
      const event = press('k', { metaKey: true });
      expect(event.defaultPrevented).toBe(true);
      expect(editor().getValue()).toBe('[the docs](url)');
    });

    it('leaves other shortcuts to the code editor', () => {
      render({ value: 'x' });
      for (const [key, init] of [['z', { metaKey: true }], ['f', { metaKey: true }], ['b', {}], ['b', { metaKey: true, altKey: true }]] as const) {
        expect(press(key, init).defaultPrevented).toBe(false);
      }
      expect(editor().replaceCalls).toHaveLength(0);
    });

    it('ignores shortcuts while read-only, while composing text, and from outside the editing surface', () => {
      render({ value: 'x', readOnly: true });
      editor().userSelects(0, 1);
      expect(press('b', { metaKey: true }).defaultPrevented).toBe(false);

      render({ value: 'x', readOnly: false });
      expect(press('b', { metaKey: true, isComposing: true }).defaultPrevented).toBe(false);
      expect(press('b', { metaKey: true }, button('undo')).defaultPrevented).toBe(false);
      expect(editor().replaceCalls).toHaveLength(0);
    });
  });

  describe('Enter', () => {
    it('continues a list item, with the caret on the new marker', () => {
      render({ value: '- one' });
      editor().userSelects(5);
      const event = press('Enter');
      expect(event.defaultPrevented).toBe(true);
      expect(editor().getValue()).toBe('- one\n- ');
      expect([editor().start, editor().end]).toEqual([8, 8]);
    });

    it('ends a list on an empty item', () => {
      render({ value: '- one\n- ' });
      editor().userSelects(8);
      press('Enter');
      expect(editor().getValue()).toBe('- one\n\n');
    });

    it('is left to the code editor on an ordinary line, with a selection, or with a modifier', () => {
      render({ value: 'plain' });
      editor().userSelects(5);
      expect(press('Enter').defaultPrevented).toBe(false);

      render({ value: '- one' });
      editor().userSelects(0, 5);
      expect(press('Enter').defaultPrevented).toBe(false);
      editor().userSelects(5);
      expect(press('Enter', { shiftKey: true }).defaultPrevented).toBe(false);
      expect(press('Enter', { metaKey: true }).defaultPrevented).toBe(false);
      expect(press('Enter', { isComposing: true }).defaultPrevented).toBe(false);
      expect(editor().replaceCalls).toHaveLength(0);
    });
  });

  describe('status bar', () => {
    it('shows the caret position, language and counts, and follows changes and selections', () => {
      render({ value: 'one two\nthree' });
      const bar = () => host.querySelector('.editora-statusbar')!.textContent!;
      expect(bar()).toContain('Markdown');
      expect(bar()).toContain('3 words');
      expect(bar()).toContain('13 chars');
      expect(bar()).toContain('2 lines');

      editor().userSelects(9);
      act(() => editor().emit('cursor', {}));
      expect(bar()).toContain('Ln 2, Col 2');

      editor().userSelects(0, 3);
      act(() => editor().emit('selection', {}));
      expect(bar()).toContain('Ln 1, Col 1-4');
      expect(bar()).toContain('3 chars selected');

      act(() => editor().userTypes('one'));
      expect(bar()).toContain('1 words');
    });
  });
});
