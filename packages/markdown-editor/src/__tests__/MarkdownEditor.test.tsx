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

// Likewise the source editor (covered in SourceEditor.test.tsx).
const source = vi.hoisted(() => ({
  renders: [] as any[],
  mounts: 0,
  unmounts: 0,
  // What the component's ref gives it; tests replace the methods they care about.
  handle: { focus: () => {}, insertText: () => true, runCommand: () => true, getTopLine: () => 0, scrollToLine: (_line: number) => 0 } as any,
}));

vi.mock('../source/SourceEditor', async () => {
  const react = await import('react');
  return {
    SourceEditor: react.forwardRef((props: any, ref: any) => {
      source.renders.push(props);
      react.useImperativeHandle(ref, () => source.handle, []);
      react.useEffect(() => {
        source.mounts += 1;
        return () => {
          source.unmounts += 1;
        };
      }, []);
      return react.createElement('div', { 'data-testid': 'source', 'data-readonly': String(!!props.readOnly) });
    }),
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

import { MarkdownEditor, type MarkdownEditorHandle, type MarkdownEditorProps } from '../components/MarkdownEditor';
import { clock, DEFER_FROM } from '../components/deferredSource';

const act: (callback: () => void) => void = (React as any).act ?? (TestUtils as any).act;
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

let host: HTMLDivElement;
let root: Root;

// The suites below that are about the rich editor opt into it; the source editor is the default.
const mount = (props: MarkdownEditorProps = {}) => {
  act(() => root.render(<MarkdownEditor editorType="rich" {...props} />));
};
const mountDefault = (props: MarkdownEditorProps = {}) => {
  act(() => root.render(<MarkdownEditor {...props} />));
};
const lastSourceProps = () => source.renders[source.renders.length - 1];
const typeInSource = (markdown: string) => act(() => lastSourceProps().onChange(markdown));
const pressed = (group: string) =>
  Array.from(host.querySelectorAll(`[aria-label="${group}"] .md-editor-mode`))
    .filter((b) => b.getAttribute('aria-pressed') === 'true')
    .map((b) => b.textContent);
const typeButton = (label: string) =>
  Array.from(host.querySelectorAll<HTMLButtonElement>('[aria-label="Editor type"] .md-editor-mode')).find((b) => b.textContent === label)!;
const lastEditorProps = () => rte.renders[rte.renders.length - 1];
const typeInEditor = (html: string) => act(() => lastEditorProps().onChange(html));
const preview = () => host.querySelector('.md-preview') as HTMLElement | null;
const modeButton = (label: string) =>
  Array.from(host.querySelectorAll<HTMLButtonElement>('[aria-label="Editor view"] .md-editor-mode')).find((b) => b.textContent === label)!;
const pressedModes = () => pressed('Editor view');
const editorPane = () => host.querySelector('[data-testid="rte"]')!.parentElement as HTMLElement;

beforeEach(() => {
  rte.renders.length = 0;
  rte.mounts = 0;
  rte.unmounts = 0;
  source.renders.length = 0;
  source.mounts = 0;
  source.unmounts = 0;
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
            editorType="rich"
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
      expect(host.querySelector('[aria-label="Editor view"]')).toBeNull();
      expect(preview()).toBeNull();
      expect(editorPane().hidden).toBe(false);
    });
  });
});

describe('MarkdownEditor with the source editor (the default)', () => {
  it('shows the source editor, not the rich one, and gives it the value as it is', () => {
    mountDefault({ defaultValue: '* star\n\n__strong__ and `code`\n', placeholder: 'Type here' });
    expect(host.querySelector('[data-testid="source"]')).not.toBeNull();
    expect(host.querySelector('[data-testid="rte"]')).toBeNull();
    expect(lastSourceProps().value).toBe('* star\n\n__strong__ and `code`\n');
    expect(lastSourceProps().placeholder).toBe('Type here');
    expect(lastSourceProps().readOnly).toBe(false);
  });

  it('passes readOnly through', () => {
    mountDefault({ readOnly: true });
    expect(lastSourceProps().readOnly).toBe(true);
  });

  it('reports exactly what was typed, with nothing converted or normalised', () => {
    const onChange = vi.fn();
    mountDefault({ defaultValue: '', onChange });
    const typed = '* star\n\n1. one\n1. two\n\n| a |\n|---|\n\nText   with  spaces\n';
    typeInSource(typed);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(typed);
    expect(lastSourceProps().value).toBe(typed);
  });

  it('updates the preview as the markdown changes', () => {
    mountDefault({ defaultValue: '' });
    typeInSource('# Title\n\n- [x] done');
    expect(preview()!.querySelector('h1')!.textContent).toBe('Title');
    expect(preview()!.querySelector('.md-task-box')!.getAttribute('aria-checked')).toBe('true');
  });

  it('does not remount the source editor as it is typed in, controlled or not', () => {
    mountDefault({ defaultValue: 'a' });
    typeInSource('ab');
    typeInSource('abc');
    expect(source.mounts).toBe(1);
    expect(source.unmounts).toBe(0);

    const Controlled = () => {
      const [value, setValue] = React.useState('x');
      return (
        <>
          <button id="set" onClick={() => setValue('from outside')} />
          <MarkdownEditor value={value} onChange={setValue} />
        </>
      );
    };
    act(() => root.render(<Controlled />));
    source.mounts = 0;
    source.unmounts = 0;
    typeInSource('xy');
    act(() => (host.querySelector('#set') as HTMLButtonElement).click());
    // A value that comes from outside reaches the editor as a prop; it is not remounted for it
    // (counters were reset after the first mount).
    expect(lastSourceProps().value).toBe('from outside');
    expect(source.mounts).toBe(0);
    expect(source.unmounts).toBe(0);
  });

  it('does no markdown conversion of its own while the source editor is on screen', () => {
    mountDefault({ defaultValue: '# Hi', mode: 'edit' });
    // Edit view with the source editor needs neither the preview HTML nor the rich editor's HTML.
    expect(preview()).toBeNull();
    expect(rte.renders).toHaveLength(0);
  });

  it('keeps the source editor mounted but hidden in preview view', () => {
    mountDefault({ mode: 'split' });
    act(() => modeButton('Preview').click());
    expect((host.querySelector('[data-testid="source"]')!.parentElement as HTMLElement).hidden).toBe(true);
    act(() => modeButton('Split').click());
    expect(source.mounts).toBe(1);
    expect(source.unmounts).toBe(0);
  });

  describe('switching the editor type', () => {
    it('marks the current type with aria-pressed, source first', () => {
      mountDefault();
      expect(pressed('Editor type')).toEqual(['Source']);
      expect(host.querySelector('[aria-label="Editor type"]')!.getAttribute('role')).toBe('group');
    });

    it('starts as the rich editor when asked to, and follows the prop', () => {
      mountDefault({ editorType: 'rich' });
      expect(pressed('Editor type')).toEqual(['Rich text']);
      expect(host.querySelector('[data-testid="rte"]')).not.toBeNull();
      mountDefault({ editorType: 'source' });
      expect(pressed('Editor type')).toEqual(['Source']);
      expect(host.querySelector('[data-testid="source"]')).not.toBeNull();
    });

    it('carries the markdown across, in both directions', () => {
      const onChange = vi.fn();
      mountDefault({ defaultValue: '# Title\n\n- one', onChange });

      act(() => typeButton('Rich text').click());
      expect(host.querySelector('[data-testid="source"]')).toBeNull();
      expect(lastEditorProps().defaultValue).toContain('<h1>Title</h1>');
      expect(lastEditorProps().defaultValue).toContain('<li>one</li>');

      // Text changed in the rich editor is the source editor's value when switching back.
      typeInEditor('<h1>Title</h1><ul><li>one</li><li>two</li></ul>');
      expect(onChange).toHaveBeenLastCalledWith('# Title\n\n- one\n- two');
      act(() => typeButton('Source').click());
      expect(host.querySelector('[data-testid="rte"]')).toBeNull();
      expect(lastSourceProps().value).toBe('# Title\n\n- one\n- two');
    });

    it('does not report a change just by switching, so the markdown is not normalised until it is edited', () => {
      const onChange = vi.fn();
      mountDefault({ defaultValue: '* star\n\n__x__', onChange });
      act(() => typeButton('Rich text').click());
      act(() => typeButton('Source').click());
      expect(onChange).not.toHaveBeenCalled();
      expect(lastSourceProps().value).toBe('* star\n\n__x__');
    });

    it('remounts the rich editor for a value that changed from outside while it is showing', () => {
      const Controlled = () => {
        const [value, setValue] = React.useState('a');
        return (
          <>
            <button id="set" onClick={() => setValue('# New')} />
            <MarkdownEditor editorType="rich" value={value} onChange={setValue} />
          </>
        );
      };
      act(() => root.render(<Controlled />));
      act(() => (host.querySelector('#set') as HTMLButtonElement).click());
      expect(rte.unmounts).toBe(1);
      expect(lastEditorProps().defaultValue).toContain('<h1>New</h1>');
    });

    it('does not bump the rich editor for value changes made while the source editor is showing', () => {
      const Controlled = () => {
        const [value, setValue] = React.useState('a');
        return <MarkdownEditor value={value} onChange={setValue} />;
      };
      act(() => root.render(<Controlled />));
      typeInSource('ab');
      typeInSource('abc');
      act(() => typeButton('Rich text').click());
      // The rich editor is mounted once, with the current text, instead of being remounted per keystroke.
      expect(rte.mounts).toBe(1);
      expect(rte.unmounts).toBe(0);
      expect(lastEditorProps().defaultValue).toContain('abc');
    });
  });
});

describe('MarkdownEditor front matter and footnotes', () => {
  const withFrontMatter = '---\ntitle: Post\n---\n\n# Heading\n\nText';

  it('shows front matter in the preview as a collapsed block, not as a rule and a heading', () => {
    mountDefault({ defaultValue: withFrontMatter });
    expect(preview()!.querySelector('details.md-front-matter code')?.textContent).toBe('title: Post');
    expect(preview()!.querySelector('hr')).toBeNull();
    expect(preview()!.querySelectorAll('h1, h2')).toHaveLength(1);
  });

  it('keeps front matter out of the rich pane, and puts it back when the rich pane reports a change', () => {
    const onChange = vi.fn();
    mount({ defaultValue: withFrontMatter, onChange });
    expect(lastEditorProps().defaultValue).not.toContain('title');
    expect(lastEditorProps().defaultValue).toContain('<h1>Heading</h1>');

    typeInEditor('<h1>Heading</h1><p>Edited</p>');
    expect(onChange).toHaveBeenLastCalledWith('---\ntitle: Post\n---\n\n# Heading\n\nEdited');
    // And it survives further edits, which start from what was just reported.
    typeInEditor('<h1>Heading</h1><p>Edited again</p>');
    expect(onChange).toHaveBeenLastCalledWith('---\ntitle: Post\n---\n\n# Heading\n\nEdited again');
  });

  it('leaves a document without front matter exactly as the rich pane reports it', () => {
    const onChange = vi.fn();
    mount({ defaultValue: '# Heading', onChange });
    typeInEditor('<h1>Heading</h1><p>More</p>');
    expect(onChange).toHaveBeenLastCalledWith('# Heading\n\nMore');
  });

  it('gives each editor its own footnote ids, so two on a page do not link into each other', () => {
    const second = document.createElement('div');
    document.body.appendChild(second);
    const secondRoot = createRoot(second);
    try {
      mountDefault({ defaultValue: 'A[^1]\n\n[^1]: note' });
      act(() => secondRoot.render(<MarkdownEditor defaultValue={'B[^1]\n\n[^1]: other'} />));
      const ids = [...host.querySelectorAll('[id]'), ...second.querySelectorAll('[id]')].map((element) => element.id);
      expect(ids.length).toBeGreaterThan(2);
      expect(new Set(ids).size).toBe(ids.length);
    } finally {
      act(() => secondRoot.unmount());
      second.remove();
    }
  });

  it('follows a footnote link inside the preview without changing the address of the page', () => {
    window.location.hash = '';
    mountDefault({ defaultValue: 'A[^1]\n\n[^1]: note' });
    const reference = preview()!.querySelector<HTMLAnchorElement>('a[data-footnote-ref]')!;
    const note = preview()!.querySelector<HTMLElement>('.footnotes li')!;
    const scrolled = vi.fn();
    note.scrollIntoView = scrolled;

    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    act(() => {
      reference.dispatchEvent(click);
    });
    expect(click.defaultPrevented).toBe(true);
    expect(window.location.hash).toBe('');
    expect(scrolled).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(note);
  });

  it('does not intercept ordinary links', () => {
    mountDefault({ defaultValue: '[x](https://example.com)' });
    const link = preview()!.querySelector<HTMLAnchorElement>('a')!;
    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    act(() => {
      link.dispatchEvent(click);
    });
    expect(click.defaultPrevented).toBe(false);
  });
});

describe('MarkdownEditor scroll sync and height', () => {
  // jsdom has no layout, so the preview's geometry is stated: three blocks starting on lines 0, 2 and 4
  // (tops 0, 100 and 600) in 1000px of content shown through a 200px window.
  const DOC = '# One\n\ntwo\n\n# Three';
  const TOPS = [0, 100, 600];

  const lay = (element: HTMLElement) => {
    let scrollTop = 0;
    Object.defineProperty(element, 'scrollTop', {
      configurable: true,
      get: () => scrollTop,
      set: (value: number) => {
        scrollTop = Math.max(0, Math.min(800, value));
      },
    });
    Object.defineProperty(element, 'scrollHeight', { configurable: true, get: () => 1000 });
    Object.defineProperty(element, 'clientHeight', { configurable: true, get: () => 200 });
    element.getBoundingClientRect = () => ({ top: 0 } as DOMRect);
    Array.from(element.querySelectorAll<HTMLElement>('[data-md-line]')).forEach((block, index) => {
      block.getBoundingClientRect = () => ({ top: TOPS[index] - scrollTop } as DOMRect);
    });
  };
  const scrollPreview = (to: number) => {
    preview()!.scrollTop = to;
    act(() => {
      preview()!.dispatchEvent(new Event('scroll'));
    });
  };
  const scrollSource = (info: { scrollTop: number; atBottom?: boolean }) =>
    act(() => lastSourceProps().onScroll({ atBottom: false, ...info }));

  let scrollToLine: ReturnType<typeof vi.fn>;
  let getTopLine: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    scrollToLine = vi.fn(() => 77);
    getTopLine = vi.fn(() => 3);
    source.handle.scrollToLine = scrollToLine;
    source.handle.getTopLine = getTopLine;
  });

  const mountSplit = (props: MarkdownEditorProps = {}) => {
    mountDefault({ defaultValue: DOC, mode: 'split', height: 400, ...props });
    if (preview()) lay(preview()!);
  };

  it('tags the preview blocks with the lines they start on', () => {
    mountSplit();
    expect(Array.from(preview()!.querySelectorAll('[data-md-line]')).map((block) => block.getAttribute('data-md-line'))).toEqual(['0', '2', '4']);
  });

  it('moves the preview to the place of the line at the top of the source', () => {
    mountSplit();
    scrollSource({ scrollTop: 50 });
    // Line 3 is halfway between the block on line 2 (100px) and the one on line 4 (600px).
    expect(preview()!.scrollTop).toBe(350);
  });

  it('moves the source to the line at the top of the preview', () => {
    mountSplit();
    scrollPreview(350);
    expect(scrollToLine).toHaveBeenCalledWith(3);
  });

  it('does not bounce: the scroll a pane makes because of the other is not passed back', () => {
    mountSplit();
    scrollSource({ scrollTop: 50 });
    // The preview was just moved to 350, and tells us so.
    act(() => {
      preview()!.dispatchEvent(new Event('scroll'));
    });
    expect(scrollToLine).not.toHaveBeenCalled();

    scrollPreview(350);
    expect(scrollToLine).toHaveBeenCalledTimes(1);
    // The source was just moved to 77, and tells us so.
    getTopLine.mockClear();
    scrollSource({ scrollTop: 77 });
    expect(getTopLine).not.toHaveBeenCalled();
  });

  it('still follows the user after an echo that moved nothing', () => {
    mountSplit();
    // The preview is already at 0, so moving it to 0 raises no scroll event and the echo is never seen...
    getTopLine.mockReturnValue(0);
    scrollSource({ scrollTop: 0 });
    // ...and the next real scroll of the preview is not swallowed.
    scrollPreview(300);
    expect(scrollToLine).toHaveBeenCalledTimes(1);
  });

  it('shows the end of the preview when the source is at its end', () => {
    mountSplit();
    scrollSource({ scrollTop: 900, atBottom: true });
    expect(preview()!.scrollTop).toBe(800);
  });

  it('shows the end of the source when the preview is at its end', () => {
    mountSplit();
    scrollPreview(800);
    expect(scrollToLine).toHaveBeenLastCalledWith(Number.POSITIVE_INFINITY);
  });

  it('does nothing when syncScroll is off, in a single-pane view, or for the rich editor', () => {
    mountSplit({ syncScroll: false });
    scrollSource({ scrollTop: 50 });
    scrollPreview(350);
    expect(getTopLine).not.toHaveBeenCalled();
    expect(scrollToLine).not.toHaveBeenCalled();

    mountSplit({ mode: 'edit' });
    expect(preview()).toBeNull();
    scrollSource({ scrollTop: 50 });
    expect(getTopLine).not.toHaveBeenCalled();

    mount({ defaultValue: DOC, mode: 'split', height: 400 });
    lay(preview()!);
    scrollPreview(350);
    expect(scrollToLine).not.toHaveBeenCalled();
  });

  it('fixes the height of the card when a height is given, in pixels or any CSS length', () => {
    mountSplit({ height: 400 });
    const root = host.querySelector<HTMLElement>('[data-markdown-editor]')!;
    expect(root.hasAttribute('data-bounded')).toBe(true);
    expect(root.style.getPropertyValue('--md-height')).toBe('400px');

    mountSplit({ height: '60vh' });
    expect(root.style.getPropertyValue('--md-height')).toBe('60vh');

    mountSplit({ height: undefined });
    expect(root.hasAttribute('data-bounded')).toBe(false);
    expect(root.style.getPropertyValue('--md-height')).toBe('');
  });
});

describe('MarkdownEditor labels', () => {
  const es = {
    title: 'Markdown (es)',
    editorTypeGroup: 'Tipo de editor',
    viewGroup: 'Vista',
    source: 'Fuente',
    richText: 'Texto enriquecido',
    edit: 'Editar',
    split: 'Dividido',
    preview: 'Vista previa',
    previewHeading: 'VISTA PREVIA',
    previewRegion: 'Vista previa de markdown',
    emptyPreview: 'Nada que mostrar.',
    enterFullscreen: 'Pantalla completa',
    exitFullscreen: 'Salir de pantalla completa',
    frontMatter: 'Metadatos',
    footnotes: 'Notas',
    backToReference: 'Volver a {0}',
  };

  it('translates the header, both switches, the fullscreen button and the preview', () => {
    mountDefault({ defaultValue: '', labels: es });
    expect(host.querySelector('.md-editor-title')!.textContent).toBe('Markdown (es)');
    expect(pressed('Tipo de editor')).toEqual(['Fuente']);
    expect(pressed('Vista')).toEqual(['Dividido']);
    expect(Array.from(host.querySelectorAll('[aria-label="Vista"] button')).map((b) => b.textContent)).toEqual(['Editar', 'Dividido', 'Vista previa']);
    expect(Array.from(host.querySelectorAll('[aria-label="Tipo de editor"] button')).map((b) => b.textContent)).toEqual(['Fuente', 'Texto enriquecido']);
    expect(host.querySelector('section')!.getAttribute('aria-label')).toBe('Vista previa de markdown');
    expect(host.querySelector('.md-preview-head')!.textContent).toBe('VISTA PREVIA');
    expect(preview()!.textContent).toBe('Nada que mostrar.');
    expect(host.querySelector('.md-editor-icon-button')!.getAttribute('aria-label')).toBe('Pantalla completa');
  });

  it('keeps English for what is not given', () => {
    mountDefault({ defaultValue: '', labels: { title: 'Notas' } });
    expect(host.querySelector('.md-editor-title')!.textContent).toBe('Notas');
    expect(pressed('Editor view')).toEqual(['Split']);
    expect(preview()!.textContent).toBe('Nothing to preview yet.');
  });

  it('shows a label as text, not as markup, since the empty state is injected as HTML', () => {
    mountDefault({ defaultValue: '', labels: { emptyPreview: '<img src=x onerror=alert(1)> & more' } });
    expect(preview()!.querySelector('img')).toBeNull();
    expect(preview()!.textContent).toBe('<img src=x onerror=alert(1)> & more');
  });

  it('hands the labels to the source editor', () => {
    mountDefault({ labels: { sourceTextbox: 'Fuente', commands: { bold: 'Negrita' } } });
    expect(lastSourceProps().labels.sourceTextbox).toBe('Fuente');
    expect(lastSourceProps().labels.commands.bold).toBe('Negrita');
    expect(lastSourceProps().labels.commands.italic).toBe('Italic');
  });

  it('translates what the preview itself says', () => {
    mountDefault({ defaultValue: '---\na: 1\n---\n\nText[^1]\n\n[^1]: note', labels: es });
    expect(preview()!.querySelector('summary')!.textContent).toBe('Metadatos');
    expect(preview()!.querySelector('.footnotes h2')!.textContent).toBe('Notas');
    expect(preview()!.querySelector('[data-footnote-backref]')!.getAttribute('aria-label')).toBe('Volver a 1');
  });

  it('follows labels that change', () => {
    mountDefault({ defaultValue: '' });
    expect(host.querySelector('.md-editor-title')!.textContent).toBe('Markdown');
    mountDefault({ defaultValue: '', labels: es });
    expect(host.querySelector('.md-editor-title')!.textContent).toBe('Markdown (es)');
  });
});

describe('MarkdownEditor fullscreen', () => {
  const card = () => host.querySelector<HTMLElement>('[data-markdown-editor]')!;
  const toggle = () => host.querySelector<HTMLButtonElement>('.md-editor-icon-button')!;
  const press = (target: Element, key: string) => {
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
    act(() => {
      target.dispatchEvent(event);
    });
    return event;
  };

  beforeEach(() => {
    document.body.style.overflow = 'auto';
  });
  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('fills the window, names its button for what it does next, and locks the page behind it', () => {
    mountDefault({ defaultValue: 'text' });
    expect(card().hasAttribute('data-fullscreen')).toBe(false);
    expect(toggle().getAttribute('aria-label')).toBe('Enter fullscreen');

    act(() => toggle().click());
    expect(card().hasAttribute('data-fullscreen')).toBe(true);
    expect(toggle().getAttribute('aria-label')).toBe('Exit fullscreen');
    expect(document.body.style.overflow).toBe('hidden');

    act(() => toggle().click());
    expect(card().hasAttribute('data-fullscreen')).toBe(false);
    expect(toggle().getAttribute('aria-label')).toBe('Enter fullscreen');
    // The page goes back to what it was, not just to the default.
    expect(document.body.style.overflow).toBe('auto');
  });

  it('keeps the editors mounted, so nothing is lost by going fullscreen', () => {
    mountDefault({ defaultValue: 'text' });
    const mounts = source.mounts;
    act(() => toggle().click());
    act(() => toggle().click());
    expect(source.mounts).toBe(mounts);
    expect(source.unmounts).toBe(0);
  });

  it('leaves on Escape, unless something inside handled it first', () => {
    mountDefault({ defaultValue: 'text' });
    act(() => toggle().click());

    press(host.querySelector('[data-testid="source"]')!, 'a');
    expect(card().hasAttribute('data-fullscreen')).toBe(true);

    // A menu or the find panel closing on Escape says so by preventing the default.
    const inner = host.querySelector('[data-testid="source"]')!;
    const handler = (event: Event) => event.preventDefault();
    inner.addEventListener('keydown', handler);
    press(inner, 'Escape');
    expect(card().hasAttribute('data-fullscreen')).toBe(true);
    inner.removeEventListener('keydown', handler);

    press(inner, 'Escape');
    expect(card().hasAttribute('data-fullscreen')).toBe(false);
    expect(document.body.style.overflow).toBe('auto');
  });

  it('does not react to Escape when it is not fullscreen', () => {
    mountDefault({ defaultValue: 'text' });
    const event = press(host.querySelector('[data-testid="source"]')!, 'Escape');
    expect(event.defaultPrevented).toBe(false);
    expect(card().hasAttribute('data-fullscreen')).toBe(false);
  });

  it('gives the page back when the editor is removed while fullscreen', () => {
    mountDefault({ defaultValue: 'text' });
    act(() => toggle().click());
    expect(document.body.style.overflow).toBe('hidden');
    act(() => root.unmount());
    expect(document.body.style.overflow).toBe('auto');
    root = createRoot(host);
  });
});

describe('MarkdownEditor ref', () => {
  const ref = React.createRef<MarkdownEditorHandle>();
  const mountWithRef = (props: MarkdownEditorProps = {}) => {
    act(() => root.render(<MarkdownEditor ref={ref} {...props} />));
  };

  beforeEach(() => {
    source.handle.focus = vi.fn();
    source.handle.insertText = vi.fn(() => true);
    source.handle.runCommand = vi.fn(() => true);
  });

  it('gives the markdown as it is now, as the user types, and from outside', () => {
    mountWithRef({ defaultValue: 'start' });
    expect(ref.current!.getValue()).toBe('start');
    typeInSource('typed');
    expect(ref.current!.getValue()).toBe('typed');
    mountWithRef({ value: 'controlled' });
    expect(ref.current!.getValue()).toBe('controlled');
  });

  it('focuses, inserts text and runs commands in the source editor', () => {
    mountWithRef();
    ref.current!.focus();
    expect(source.handle.focus).toHaveBeenCalledTimes(1);
    expect(ref.current!.insertText('![a](b)')).toBe(true);
    expect(source.handle.insertText).toHaveBeenCalledWith('![a](b)');
    expect(ref.current!.runCommand('bold')).toBe(true);
    expect(source.handle.runCommand).toHaveBeenCalledWith('bold');
  });

  it('says so when the source editor refuses (read-only)', () => {
    source.handle.insertText = vi.fn(() => false);
    source.handle.runCommand = vi.fn(() => false);
    mountWithRef({ readOnly: true });
    expect(ref.current!.insertText('x')).toBe(false);
    expect(ref.current!.runCommand('bold')).toBe(false);
  });

  it('cannot insert or run commands in the rich surface, and focuses its editable area', () => {
    mountWithRef({ editorType: 'rich' });
    expect(ref.current!.insertText('x')).toBe(false);
    expect(ref.current!.runCommand('bold')).toBe(false);
    expect(source.handle.insertText).not.toHaveBeenCalled();

    const editable = document.createElement('div');
    editable.setAttribute('contenteditable', 'true');
    editable.tabIndex = 0;
    host.querySelector('[data-testid="rte"]')!.appendChild(editable);
    ref.current!.focus();
    expect(document.activeElement).toBe(editable);
    expect(ref.current!.getValue()).toBe('');
  });
});

describe('MarkdownEditor math', () => {
  const typeset = (tex: string, display: boolean) => `<span class="tex">${display ? 'D' : 'I'}:${tex}</span>`;

  it('typesets math in the preview with the renderer it is given', () => {
    mountDefault({ defaultValue: 'Area $\\pi r^2$\n\n$$\nE = mc^2\n$$', renderMath: typeset });
    const formulas = Array.from(preview()!.querySelectorAll('.tex')).map((element) => element.textContent);
    expect(formulas).toEqual(['I:\\pi r^2', 'D:E = mc^2']);
  });

  it('leaves dollar signs alone without one', () => {
    mountDefault({ defaultValue: 'Area $\\pi r^2$' });
    expect(preview()!.querySelector('.md-math')).toBeNull();
    expect(preview()!.textContent!.trim()).toBe('Area $\\pi r^2$');
  });

  it('follows the markdown as it changes, and a renderer that changes', () => {
    mountDefault({ defaultValue: '$a$', renderMath: typeset });
    typeInSource('$a$ and $b$');
    expect(Array.from(preview()!.querySelectorAll('.tex')).map((element) => element.textContent)).toEqual(['I:a', 'I:b']);
    mountDefault({ defaultValue: '$a$', renderMath: (tex) => `<span class="tex">other:${tex}</span>` });
    expect(Array.from(preview()!.querySelectorAll('.tex')).map((element) => element.textContent)).toEqual(['other:a', 'other:b']);
  });
});

describe('MarkdownEditor with a long document', () => {
  // A long document is one the preview takes long to build; the clock is set so that a build takes 100ms.
  const longDocument = (heading: string) => `# ${heading}\n\n${'word '.repeat(DEFER_FROM / 5)}`;
  const previewHeading = () => preview()!.querySelector('h1')!.textContent;
  const wait = (ms: number) => act(() => void vi.advanceTimersByTime(ms));
  let ticks = 0;

  beforeEach(() => {
    vi.useFakeTimers();
    ticks = 0;
    vi.spyOn(clock, 'now').mockImplementation(() => (ticks += 100));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('shows the preview of the document it starts with, straight away', () => {
    mountDefault({ defaultValue: longDocument('First') });
    expect(previewHeading()).toBe('First');
  });

  it('waits for a pause in the typing before rebuilding the preview', () => {
    mountDefault({ defaultValue: longDocument('First') });
    typeInSource(longDocument('Second'));
    typeInSource(longDocument('Third'));
    expect(previewHeading()).toBe('First');
    wait(199);
    expect(previewHeading()).toBe('First');
    wait(1);
    expect(previewHeading()).toBe('Third');
  });

  it('keeps showing the text it waits on when something else makes it build the preview again', () => {
    const labels = (frontMatter: string) => ({ frontMatter });
    const render = (value: string, frontMatter: string) =>
      act(() => root.render(<MarkdownEditor value={value} labels={labels(frontMatter)} />));
    render(longDocument('First'), 'Front matter');
    render(longDocument('Second'), 'Front matter');
    expect(previewHeading()).toBe('First');
    // A new label rebuilds the preview, from the text it was showing and not the one still being typed.
    render(longDocument('Second'), 'Metadata');
    expect(previewHeading()).toBe('First');
    wait(200);
    expect(previewHeading()).toBe('Second');
  });

  it('leaves what the user typed alone: the markdown is current at once, and onChange is not late', () => {
    const onChange = vi.fn();
    const ref = React.createRef<MarkdownEditorHandle>();
    act(() => root.render(<MarkdownEditor ref={ref} defaultValue={longDocument('First')} onChange={onChange} />));
    typeInSource(longDocument('Second'));
    expect(ref.current!.getValue()).toBe(longDocument('Second'));
    expect(lastSourceProps().value).toBe(longDocument('Second'));
    expect(previewHeading()).toBe('First');
  });

  it('is not late for a short document', () => {
    mountDefault({ defaultValue: '# First' });
    typeInSource('# Second');
    expect(previewHeading()).toBe('Second');
  });

  it('is not late when the preview is shown alone, where nothing is being typed', () => {
    mountDefault({ defaultValue: longDocument('First'), mode: 'preview' });
    act(() => root.render(<MarkdownEditor mode="preview" value={longDocument('Second')} />));
    expect(previewHeading()).toBe('Second');
  });

  it('is not late when the build is quick', () => {
    vi.mocked(clock.now).mockImplementation(() => (ticks += 1));
    mountDefault({ defaultValue: longDocument('First') });
    typeInSource(longDocument('Second'));
    expect(previewHeading()).toBe('Second');
  });
});
