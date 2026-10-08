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
    scroller: HTMLElement;
    scrollTopValue = 0;
    /** Height of each line in the stand-in layout; a wrapped line is taller. */
    lineHeights: number[] = [];
    /** Space above the first line, as the content has padding. */
    padding = 0;
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
      this.surface.style.lineHeight = '20px';
      this.scroller = document.createElement('div');
      Object.defineProperty(this.scroller, 'scrollTop', {
        get: () => this.scrollTopValue,
        set: (value: number) => {
          this.scrollTopValue = value;
        },
      });
      Object.defineProperty(this.scroller, 'scrollHeight', { get: () => this.lineTop(this.text.split('\n').length) });
      this.scroller.appendChild(this.surface);
      host.appendChild(this.scroller);
      fake.instances.push(this);
    }

    lineTop(line: number) {
      let top = this.padding;
      for (let i = 0; i < line; i += 1) top += this.lineHeights[i] ?? 20;
      return top;
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
        getScrollElement: () => this.scroller,
        // Where the browser would say a character is: its line's top in the stand-in layout, less the scroll.
        createDomRangeFromOffsets: (offset: number) => {
          const before = this.text.slice(0, offset).split('\n');
          const line = before.length - 1;
          const top = this.lineTop(line) - this.scrollTopValue;
          const height = this.lineHeights[line] ?? 20;
          const rect = { top, bottom: top + height, width: 0, height };
          // The browser has no rectangle for a collapsed range on an empty line.
          const empty = this.text[offset] === '\n' || offset >= this.text.length ? before[line] === '' : false;
          return {
            getClientRects: () => (empty ? [] : [rect]),
            getBoundingClientRect: () => (empty ? { top: 0, bottom: 0, width: 0, height: 0 } : rect),
          };
        },
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
      this.scroller.remove();
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

import { DEFAULT_LABELS } from '../components/labels';
import { SourceEditor, type SourceEditorHandle, type SourceEditorProps } from '../source/SourceEditor';

const act: (callback: () => void) => void = (React as any).act ?? (TestUtils as any).act;
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

let host: HTMLDivElement;
let root: Root;

const editor = () => fake.instances[fake.instances.length - 1];
const handle = React.createRef<SourceEditorHandle>();
const render = (props: Partial<SourceEditorProps> = {}, wrapperClass?: string) => {
  const element = (
    <SourceEditor ref={handle} labels={DEFAULT_LABELS} value="" onChange={() => {}} readOnly={false} placeholder="Write here" {...props} />
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

    it('tells a keyboard user how to leave it, since Tab indents there', () => {
      render({ value: '# Hi' });
      const hintId = editor().surface.getAttribute('aria-describedby')!;
      const hint = host.querySelector(`#${hintId}`)!;
      expect(hint.textContent).toBe('Tab indents. Press Escape, then Tab, to leave the editor.');
      // Read by assistive technology, not drawn.
      expect(hint.className).toBe('md-visually-hidden');
    });

    it('gives each editor its own hint', () => {
      render({ value: 'a' });
      const first = editor().surface.getAttribute('aria-describedby');
      const second = document.createElement('div');
      document.body.appendChild(second);
      const other = createRoot(second);
      act(() => other.render(<SourceEditor labels={DEFAULT_LABELS} value="b" onChange={() => {}} readOnly={false} placeholder="" />));
      const ids = Array.from(document.querySelectorAll('.md-visually-hidden')).map((element) => element.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(ids).toContain(first);
      act(() => other.unmount());
      second.remove();
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

  describe('scrolling and the handle', () => {
    // A 6-line document in a stand-in layout: lines are 20px, except line 2 which wraps to 3 rows (60px).
    const scrollable = (onScroll?: () => void) => {
      render({ value: 'a\nb\nc\nd\ne\nf', onScroll });
      editor().lineHeights = [20, 20, 60, 20, 20, 20];
    };

    it('reports scrolling of the text, and stops when the editor is destroyed', () => {
      const onScroll = vi.fn();
      render({ onScroll });
      editor().scroller.dispatchEvent(new Event('scroll'));
      expect(onScroll).toHaveBeenCalledTimes(1);
      act(() => root.unmount());
      editor().scroller.dispatchEvent(new Event('scroll'));
      expect(onScroll).toHaveBeenCalledTimes(1);
      root = createRoot(host);
    });

    it('uses the latest onScroll without recreating the editor', () => {
      const first = vi.fn();
      const second = vi.fn();
      render({ onScroll: first });
      render({ onScroll: second });
      editor().scroller.dispatchEvent(new Event('scroll'));
      expect(first).not.toHaveBeenCalled();
      expect(second).toHaveBeenCalledTimes(1);
      expect(fake.instances).toHaveLength(1);
    });

    it('scrolls a line to the top, a fraction of the way through a wrapped line', () => {
      scrollable();
      handle.current!.scrollToLine(0);
      expect(editor().scrollTopValue).toBe(0);
      handle.current!.scrollToLine(3);
      expect(editor().scrollTopValue).toBe(100);
      // Halfway through line 2, which is 60px tall and starts at 40px.
      handle.current!.scrollToLine(2.5);
      expect(editor().scrollTopValue).toBe(70);
    });

    it('scrolls to the end of the text for a line past the last, and never above the start', () => {
      scrollable();
      handle.current!.scrollToLine(99);
      expect(editor().scrollTopValue).toBe(editor().lineTop(6));
      handle.current!.scrollToLine(-4);
      expect(editor().scrollTopValue).toBe(0);
    });

    it('reads the line at the top, with the fraction of a wrapped line that has scrolled by', () => {
      scrollable();
      for (const [scrollTop, line] of [[0, 0], [20, 1], [40, 2], [70, 2.5], [100, 3], [118, 3.9], [120, 4]] as const) {
        editor().scrollTopValue = scrollTop;
        expect(handle.current!.getTopLine()).toBeCloseTo(line, 6);
      }
    });

    it('round-trips: scrolling to a line and reading it back gives the same line', () => {
      scrollable();
      for (const line of [0, 0.25, 1.5, 2, 2.75, 3, 4.5, 5.9]) {
        handle.current!.scrollToLine(line);
        expect(handle.current!.getTopLine()).toBeCloseTo(line, 6);
      }
    });

    it('finds lines after empty ones, which the browser has no rectangle for', () => {
      // Lines 1, 3 and 4 are empty; every line is 20px.
      render({ value: 'a\n\nb\n\n\nc' });
      for (const [scrollTop, line] of [[0, 0], [20, 1], [40, 2], [60, 3], [80, 4], [100, 5], [10, 0.5], [50, 2.5], [90, 4.5]] as const) {
        editor().scrollTopValue = scrollTop;
        expect(handle.current!.getTopLine()).toBeCloseTo(line, 6);
      }
      for (const line of [0, 1, 2, 3, 4, 5, 5.5]) {
        handle.current!.scrollToLine(line);
        expect(editor().scrollTopValue).toBe(line * 20);
      }
    });

    it('finds the end of text that finishes with empty lines', () => {
      render({ value: 'a\nb\n\n' });
      handle.current!.scrollToLine(99);
      expect(editor().scrollTopValue).toBe(80);
      handle.current!.scrollToLine(3);
      expect(editor().scrollTopValue).toBe(60);
    });

    it('measures from the top of the first line, so the padding above it is not a scroll offset', () => {
      render({ value: 'a\nb\nc' });
      editor().padding = 8;
      handle.current!.scrollToLine(0);
      expect(editor().scrollTopValue).toBe(0);
      handle.current!.scrollToLine(2);
      expect(editor().scrollTopValue).toBe(40);
      editor().scrollTopValue = 20;
      expect(handle.current!.getTopLine()).toBeCloseTo(1, 6);
      editor().scrollTopValue = 0;
      expect(handle.current!.getTopLine()).toBe(0);
    });

    it('is not fooled by a single-line document', () => {
      render({ value: 'only' });
      handle.current!.scrollToLine(0.5);
      expect(Number.isFinite(handle.current!.getTopLine())).toBe(true);
    });

    it('inserts text over the selection as one undoable replace, with the caret after it', () => {
      const onChange = vi.fn();
      render({ value: 'one two', onChange });
      editor().userSelects(4, 7);
      let inserted = false;
      act(() => {
        inserted = handle.current!.insertText('![x](y.png)');
      });
      expect(inserted).toBe(true);
      expect(editor().replaceCalls).toHaveLength(1);
      expect(editor().getValue()).toBe('one ![x](y.png)');
      expect(editor().start).toBe(editor().getValue().length);
      expect(onChange).toHaveBeenLastCalledWith('one ![x](y.png)');
    });

    it('runs a toolbar command by name', () => {
      render({ value: 'a word here' });
      editor().userSelects(2, 6);
      let ran = false;
      act(() => {
        ran = handle.current!.runCommand('bold');
      });
      expect(ran).toBe(true);
      expect(editor().getValue()).toBe('a **word** here');
    });

    it('does nothing, and says so, when read-only', () => {
      render({ value: 'text', readOnly: true });
      editor().userSelects(0, 4);
      let results: boolean[] = [];
      act(() => {
        results = [handle.current!.insertText('x'), handle.current!.runCommand('bold')];
      });
      expect(results).toEqual([false, false]);
      expect(editor().getValue()).toBe('text');
    });

    it('focuses the editor', () => {
      render();
      handle.current!.focus();
      expect(editor().focused).toBe(1);
    });
  });

  describe('labels', () => {
    const es = {
      ...DEFAULT_LABELS,
      sourceTextbox: 'Fuente markdown',
      sourceHint: 'Tab sangra. Pulsa Escape y luego Tab para salir del editor.',
      statusLanguage: 'Markdown (es)',
      toolbar: 'Formato',
      heading: 'Encabezado',
      headingMenu: 'Nivel de encabezado',
      headingLevel: 'Nivel: {0}',
      paragraph: 'Párrafo',
      headingN: 'Encabezado {0}',
      commands: { ...DEFAULT_LABELS.commands, bold: 'Negrita', table: 'Tabla', undo: 'Deshacer' },
    };

    it('names the buttons, with their shortcut in the tooltip, the toolbar and the text area', () => {
      render({ labels: es });
      expect(button('bold').getAttribute('aria-label')).toBe('Negrita');
      expect(button('bold').getAttribute('title')).toMatch(/^Negrita \(.*B\)$/);
      expect(button('table').getAttribute('title')).toBe('Tabla');
      expect(button('undo').getAttribute('aria-label')).toBe('Deshacer');
      // What is not translated stays English.
      expect(button('italic').getAttribute('aria-label')).toBe('Italic');
      expect(host.querySelector('[role="toolbar"]')!.getAttribute('aria-label')).toBe('Formato');
      expect(editor().surface.getAttribute('aria-label')).toBe('Fuente markdown');
      const hintId = editor().surface.getAttribute('aria-describedby')!;
      expect(host.querySelector(`#${hintId}`)!.textContent).toBe('Tab sangra. Pulsa Escape y luego Tab para salir del editor.');
    });

    it('keeps the visible glyph at the start of the heading button name, and hides the arrow', () => {
      render({ value: '## Title' });
      editor().userSelects(3);
      act(() => editor().emit('cursor', {}));
      const heading = button('heading');
      expect(heading.getAttribute('aria-label')).toBe('H2 Heading level: Heading 2');
      const arrow = heading.querySelector('span');
      expect(arrow?.getAttribute('aria-hidden')).toBe('true');
      expect(arrow?.textContent).toBe('▼');
      expect(heading.textContent).toBe('H2 ▼');
    });

    it('names the heading menu and its levels', () => {
      render({ labels: es, value: '## Title' });
      editor().userSelects(3);
      act(() => editor().emit('cursor', {}));
      const heading = button('heading');
      expect(heading.getAttribute('title')).toBe('Encabezado');
      // The glyph on the button is the start of its name, so that what can be read can be said (WCAG 2.5.3).
      expect(heading.getAttribute('aria-label')).toBe('H2 Nivel: Encabezado 2');
      act(() => heading.click());
      const menu = host.querySelector('[role="menu"]')!;
      expect(menu.getAttribute('aria-label')).toBe('Nivel de encabezado');
      const names = Array.from(menu.querySelectorAll('[role="menuitemradio"]')).map((item) => item.getAttribute('aria-label'));
      expect(names).toEqual(['P Párrafo', 'H1 Encabezado 1', 'H2 Encabezado 2', 'H3 Encabezado 3', 'H4 Encabezado 4', 'H5 Encabezado 5', 'H6 Encabezado 6']);
      // The glyphs on the buttons are the same in every language.
      expect(Array.from(menu.querySelectorAll('[role="menuitemradio"]')).map((item) => item.textContent)).toEqual(['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6']);
    });

    it('shows the language in the status bar', () => {
      render({ labels: es, value: 'text' });
      expect(host.querySelector('.editora-statusbar')!.textContent).toContain('Markdown (es)');
    });

    it('follows labels that change, without recreating the editor', () => {
      render({ value: 'text' });
      expect(editor().surface.getAttribute('aria-label')).toBe('Markdown source');
      render({ value: 'text', labels: es });
      expect(editor().surface.getAttribute('aria-label')).toBe('Fuente markdown');
      expect(button('bold').getAttribute('aria-label')).toBe('Negrita');
      expect(host.querySelector('.editora-statusbar')!.textContent).toContain('Markdown (es)');
      expect(fake.instances).toHaveLength(1);
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
