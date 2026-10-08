import * as React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import * as TestUtils from 'react-dom/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// The rich editor itself is covered by @editora/react; here it is a stand-in that records the props it
// is given and how often it is mounted, which is what the markdown editor's behaviour depends on.
const rte = vi.hoisted(() => ({
  renders: [] as any[],
  mounts: 0,
  unmounts: 0,
}));

vi.mock('@editora/react', async () => {
  const react = await import('react');
  return {
    RichTextEditor: (props: any) => {
      rte.renders.push(props);
      react.useEffect(() => {
        rte.mounts += 1;
        return () => {
          rte.unmounts += 1;
        };
      }, []);
      return react.createElement('div', { 'data-testid': 'rte', 'data-readonly': String(!!props.readonly) });
    },
  };
});

vi.mock('@editora/plugins', () => {
  const plugin = (name: string) => () => ({ name });
  return {
    BlockquotePlugin: plugin('blockquote'),
    BoldPlugin: plugin('bold'),
    ChecklistPlugin: plugin('checklist'),
    CodeSamplePlugin: plugin('codeSample'),
    HeadingPlugin: plugin('heading'),
    HistoryPlugin: plugin('history'),
    ItalicPlugin: plugin('italic'),
    LinkPlugin: plugin('link'),
    ListPlugin: plugin('list'),
    StrikethroughPlugin: plugin('strikethrough'),
  };
});

import { MarkdownEditor, type MarkdownEditorProps } from '../components/MarkdownEditor';

const act: (callback: () => void) => void = (React as any).act ?? (TestUtils as any).act;
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

let host: HTMLDivElement;
let root: Root;

const mount = (props: MarkdownEditorProps = {}) => {
  act(() => root.render(<MarkdownEditor {...props} />));
};
const lastEditorProps = () => rte.renders[rte.renders.length - 1];
const typeInEditor = (html: string) => act(() => lastEditorProps().onChange(html));
const preview = () => host.querySelector('.md-preview') as HTMLElement | null;
const modeButton = (label: string) =>
  Array.from(host.querySelectorAll<HTMLButtonElement>('.md-editor-mode')).find((b) => b.textContent === label)!;
const pressedModes = () =>
  Array.from(host.querySelectorAll('.md-editor-mode'))
    .filter((b) => b.getAttribute('aria-pressed') === 'true')
    .map((b) => b.textContent);
const editorPane = () => host.querySelector('[data-testid="rte"]')!.parentElement as HTMLElement;

beforeEach(() => {
  rte.renders.length = 0;
  rte.mounts = 0;
  rte.unmounts = 0;
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

describe('MarkdownEditor', () => {
  describe('rendering', () => {
    it('renders the editor and a sanitised preview of the initial markdown', () => {
      mount({ defaultValue: '# Hello\n\n**bold**' });
      expect(host.querySelector('[data-testid="rte"]')).not.toBeNull();
      expect(preview()!.querySelector('h1')!.textContent).toBe('Hello');
      expect(preview()!.querySelector('strong')!.textContent).toBe('bold');
      expect(lastEditorProps().defaultValue).toContain('<h1>Hello</h1>');
    });

    it('shows an empty state when there is nothing to preview', () => {
      mount({ defaultValue: '' });
      expect(preview()!.textContent).toBe('Nothing to preview yet.');
    });

    it('never puts script-capable markup in the preview or the editor', () => {
      mount({ defaultValue: '<img src=x onerror="window.__pwned=1">\n\n[a](javascript:alert(1))' });
      expect(preview()!.innerHTML).not.toMatch(/onerror|javascript:/i);
      expect(lastEditorProps().defaultValue).not.toMatch(/onerror|javascript:/i);
    });

    it('applies className and minHeight to the root', () => {
      mount({ className: 'mine', minHeight: 333 });
      const rootEl = host.querySelector('[data-markdown-editor]') as HTMLElement;
      expect(rootEl.classList.contains('md-editor')).toBe(true);
      expect(rootEl.classList.contains('mine')).toBe(true);
      expect(rootEl.style.getPropertyValue('--md-min-height')).toBe('333px');
    });

    it('is not itself marked as an editor root (the wrapped editor is)', () => {
      mount();
      expect(host.querySelector('.md-editor')!.hasAttribute('data-editora-editor')).toBe(false);
    });
  });

  describe('the wrapped editor', () => {
    it('is given the Editora toolbar, status bar and the plugins its buttons need', () => {
      mount({ readOnly: true, placeholder: 'Type here' });
      const props = lastEditorProps();
      expect(props.readonly).toBe(true);
      expect(props.placeholder).toBe('Type here');
      expect(props.statusbar).toEqual({ enabled: true, position: 'bottom' });
      expect(props.toolbar.items).toContain('bold');
      expect(props.toolbar.items).toContain('insertCodeBlock');
      expect(props.toolbar.floating).toBe(true);
      expect(props.plugins.map((p: { name: string }) => p.name)).toEqual([
        'history', 'heading', 'bold', 'italic', 'strikethrough', 'link', 'list', 'checklist', 'blockquote', 'codeSample',
      ]);
    });

    it('keeps the objects it rebuilds itself from stable across renders (the parent re-renders on every keystroke)', () => {
      mount({ defaultValue: 'a' });
      const first = lastEditorProps();
      typeInEditor('<p>ab</p>');
      typeInEditor('<p>abc</p>');
      const latest = lastEditorProps();
      expect(rte.renders.length).toBeGreaterThan(1);
      for (const prop of ['plugins', 'toolbar', 'statusbar', 'content']) {
        expect(latest[prop]).toBe(first[prop]);
      }
    });
  });

  describe('editing', () => {
    it('reports markdown from the editor and updates the preview, without remounting the editor', () => {
      const onChange = vi.fn();
      mount({ defaultValue: 'start', onChange });
      typeInEditor('<p>Hello <strong>world</strong></p>');
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith('Hello **world**');
      expect(preview()!.querySelector('strong')!.textContent).toBe('world');

      typeInEditor('<p>Hello <strong>world</strong>!</p>');
      expect(onChange).toHaveBeenLastCalledWith('Hello **world**!');
      expect(rte.mounts).toBe(1);
      expect(rte.unmounts).toBe(0);
    });

    it('does not lose structure the editor reports (links, lists, code, tables)', () => {
      const onChange = vi.fn();
      mount({ onChange });
      typeInEditor(
        '<p><a href="https://e.com">l</a></p><ol start="3"><li>a</li></ol><pre><code class="language-js">x</code></pre>',
      );
      expect(onChange).toHaveBeenCalledWith('[l](https://e.com)\n\n3. a\n\n```js\nx\n```');
    });
  });

  describe('controlled use', () => {
    const Controlled = ({ initial, onChange }: { initial: string; onChange?: (v: string) => void }) => {
      const [value, setValue] = React.useState(initial);
      return (
        <>
          <button id="set" onClick={() => setValue('# From outside')} />
          <MarkdownEditor
            value={value}
            onChange={(next) => {
              onChange?.(next);
              setValue(next);
            }}
          />
        </>
      );
    };

    it('does not remount the editor when the value it just reported comes back', () => {
      const onChange = vi.fn();
      act(() => root.render(<Controlled initial="a" onChange={onChange} />));
      typeInEditor('<p>ab</p>');
      typeInEditor('<p>abc</p>');
      expect(onChange).toHaveBeenLastCalledWith('abc');
      expect(rte.mounts).toBe(1);
      expect(rte.unmounts).toBe(0);
      expect(preview()!.textContent!.trim()).toBe('abc');
    });

    it('remounts the editor with the new content when the value changes from outside', () => {
      act(() => root.render(<Controlled initial="a" />));
      act(() => (host.querySelector('#set') as HTMLButtonElement).click());
      expect(rte.unmounts).toBe(1);
      expect(rte.mounts).toBe(2);
      expect(lastEditorProps().defaultValue).toContain('<h1>From outside</h1>');
      expect(preview()!.querySelector('h1')!.textContent).toBe('From outside');
    });

    it('treats an empty string as a controlled value', () => {
      const onChange = vi.fn();
      mount({ value: '', onChange });
      typeInEditor('<p>x</p>');
      expect(onChange).toHaveBeenCalledWith('x');
      expect(preview()!.textContent).toBe('Nothing to preview yet.');
    });
  });

  describe('views', () => {
    it('starts in the requested mode and marks it with aria-pressed', () => {
      mount({ mode: 'preview' });
      expect(pressedModes()).toEqual(['Preview']);
      expect(host.querySelector('.md-editor-modes')!.getAttribute('role')).toBe('group');
    });

    it('shows both panes in split view, only the editor in edit view', () => {
      mount({ mode: 'split' });
      expect(pressedModes()).toEqual(['Split']);
      expect(preview()).not.toBeNull();
      act(() => modeButton('Edit').click());
      expect(pressedModes()).toEqual(['Edit']);
      expect(preview()).toBeNull();
      expect(editorPane().hidden).toBe(false);
    });

    it('keeps the editor mounted but hidden in preview view, so undo history and selection survive', () => {
      mount({ mode: 'split' });
      act(() => modeButton('Preview').click());
      expect(pressedModes()).toEqual(['Preview']);
      expect(editorPane().hidden).toBe(true);
      expect(preview()).not.toBeNull();
      act(() => modeButton('Split').click());
      expect(editorPane().hidden).toBe(false);
      expect(rte.mounts).toBe(1);
      expect(rte.unmounts).toBe(0);
    });

    it('follows the mode prop when it changes', () => {
      mount({ mode: 'split' });
      mount({ mode: 'edit' });
      expect(pressedModes()).toEqual(['Edit']);
    });

    it('offers no view switch and no preview when preview is false, whatever the mode', () => {
      mount({ preview: false, mode: 'preview' });
      expect(host.querySelector('.md-editor-modes')).toBeNull();
      expect(preview()).toBeNull();
      expect(editorPane().hidden).toBe(false);
    });
  });
});
