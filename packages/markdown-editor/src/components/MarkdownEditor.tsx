import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { RichTextEditor } from '@editora/react';
import {
  BlockquotePlugin,
  BoldPlugin,
  ChecklistPlugin,
  CodeSamplePlugin,
  HeadingPlugin,
  HistoryPlugin,
  ItalicPlugin,
  LinkPlugin,
  ListPlugin,
  StrikethroughPlugin,
} from '@editora/plugins';
import { joinFrontMatter, splitFrontMatter } from '../markdown/frontMatter';
import { htmlToMarkdown } from '../markdown/htmlToMarkdown';
import { escapeHtml } from '../markdown/highlight';
import { markdownToEditorHtml, markdownToPreviewHtml } from '../markdown/markdownToHtml';
import type { MarkdownCommand } from '../source/commands';
import { SourceEditor, type ScrollInfo, type SourceEditorHandle } from '../source/SourceEditor';
import type { MathRenderer } from '../markdown/math';
import { resolveLabels, type MarkdownEditorLabelsInput } from './labels';
import { lineForPreviewTop, previewTopForLine, type Anchor } from './scrollSync';
import { MARKDOWN_EDITOR_CSS } from './styles';

type Mode = 'edit' | 'preview' | 'split';
type EditorType = 'source' | 'rich';

export interface MarkdownEditorProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  readOnly?: boolean;
  preview?: boolean;
  /** Layout: the editing pane, the preview, or both side by side. */
  mode?: Mode;
  /**
   * What the editing pane is. `'source'` (the default) is the markdown text itself, so nothing is converted
   * and nothing is lost. `'rich'` is a rich-text surface that renders the markdown as you edit it; the
   * markdown is converted back on every edit and is normalised the first time.
   */
  editorType?: EditorType;
  minHeight?: number;
  /**
   * Fixes the height of the editor (a number is pixels, a string any CSS length). Each pane then scrolls on its
   * own, and in split view the two scroll together. Without it the editor grows with its text.
   */
  height?: number | string;
  /** In split view, scroll the source and the preview together. Defaults to true; needs a `height`. */
  syncScroll?: boolean;
  /**
   * Turns on math in the preview: `$x^2$` inline, `$$x^2$$` and `$$` fences as display formulas. Typesetting
   * needs a library the page chooses (KaTeX, MathJax), so this is the function that uses it, for example
   * `(tex, displayMode) => katex.renderToString(tex, { displayMode, output: 'html', throwOnError: false })`.
   * Its HTML goes through the same sanitiser as the rest of the preview, which keeps KaTeX's `output: 'html'`
   * (not MathML or SVG). Without it, `$` is an ordinary character. Give it a stable identity (define it outside
   * the component, or memoise it): the preview is rendered again when it changes. Not used by the rich surface.
   */
  renderMath?: MathRenderer;
  /** Replaces any of the text the editor shows or announces, to translate it. See `MarkdownEditorLabels`. */
  labels?: MarkdownEditorLabelsInput;
  className?: string;
  onChange?: (value: string) => void;
}

/** What a ref to the editor gives you. */
export interface MarkdownEditorHandle {
  /** Puts the cursor in the editing surface. */
  focus(): void;
  /** The markdown as it is now. */
  getValue(): string;
  /**
   * Replaces the selection with text, with the cursor after it, as one undo step. Returns false when the
   * editor is read-only or its surface is the rich-text one (`editorType="rich"`).
   */
  insertText(text: string): boolean;
  /** Runs a formatting command (what the toolbar buttons do) on the selection. Same limits as `insertText`. */
  runCommand(command: MarkdownCommand): boolean;
}

// These objects are props of the wrapped rich editor, which rebuilds itself whenever their identity changes,
// so they are created once here instead of inline in render (the parent re-renders on every keystroke).
const TOOLBAR = {
  items: [
    'undo', 'redo', '|',
    'setBlockType', '|',
    'bold', 'italic', 'strikethrough', '|',
    'link', '|',
    'bullist', 'numlist', 'checklist', '|',
    'blockquote', 'insertCodeBlock',
  ],
  floating: true,
  sticky: true,
  showMoreOptions: false,
};
const STATUSBAR = { enabled: true, position: 'bottom' as const };
const CONTENT = { sanitize: true };

const createPlugins = () => [
  HistoryPlugin(),
  HeadingPlugin(),
  BoldPlugin(),
  ItalicPlugin(),
  StrikethroughPlugin(),
  LinkPlugin(),
  ListPlugin(),
  ChecklistPlugin(),
  BlockquotePlugin(),
  CodeSamplePlugin(),
];

// Gives each editor's footnote ids a prefix of its own, so two editors on a page do not share ids.
let instanceCounter = 0;

const MarkdownGlyph: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" focusable="false">
    <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
    <path d="M6 15V9l2.5 3L11 9v6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 9v6m0 0-2-2m2 2 2-2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FullscreenGlyph: React.FC<{ exit: boolean }> = ({ exit }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {exit ? (
      <path d="M9 3v4a2 2 0 0 1-2 2H3m18 0h-4a2 2 0 0 1-2-2V3m0 18v-4a2 2 0 0 1 2-2h4M3 15h4a2 2 0 0 1 2 2v4" />
    ) : (
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
    )}
  </svg>
);

interface SegmentedProps<T extends string> {
  label: string;
  options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
}

function Segmented<T extends string>({ label, options, value, onChange }: SegmentedProps<T>) {
  return (
    <div className="md-editor-modes" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className="md-editor-mode"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export const MarkdownEditor = forwardRef<MarkdownEditorHandle, MarkdownEditorProps>(function MarkdownEditor(
  {
    value,
    defaultValue = '',
    placeholder = 'Write markdown here...',
    readOnly = false,
    preview = true,
    mode = 'split',
    editorType = 'source',
    minHeight = 220,
    height,
    syncScroll = true,
    renderMath,
    labels,
    className,
    onChange,
  },
  ref,
) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [activeMode, setActiveMode] = useState<Mode>(mode);
  const [activeType, setActiveType] = useState<EditorType>(editorType);
  const currentValue = isControlled ? value ?? '' : internalValue;
  const visibleMode: Mode = preview ? activeMode : 'edit';
  const rich = activeType === 'rich';
  const [instanceId] = useState(() => {
    instanceCounter += 1;
    return instanceCounter;
  });
  const valueRef = useRef(currentValue);
  valueRef.current = currentValue;
  const text = useMemo(() => resolveLabels(labels), [labels]);
  const [fullscreen, setFullscreen] = useState(false);

  // Only what is on screen is converted: the preview HTML when a preview is shown, the rich editor's
  // HTML when the rich editor is.
  const plugins = useMemo(() => (rich ? createPlugins() : []), [rich]);
  const previewHtml = useMemo(
    () =>
      visibleMode === 'edit'
        ? ''
        : markdownToPreviewHtml(currentValue, {
            idPrefix: `md${instanceId}-`,
            labels: { frontMatter: text.frontMatter, footnotes: text.footnotes, backToReference: text.backToReference },
            renderMath,
          }),
    [currentValue, visibleMode, instanceId, text.frontMatter, text.footnotes, text.backToReference, renderMath],
  );
  const editorHtml = useMemo(() => (rich ? markdownToEditorHtml(currentValue) : ''), [currentValue, rich]);

  // The rich editor is remounted to load markdown that changed from outside (the `value` prop). It used
  // to be keyed on the markdown itself, so every keystroke - which round-trips through onChange -
  // remounted it and dropped focus after each character. Now it only remounts when the value differs
  // from what the editor itself last reported. (The source editor takes new values without remounting.)
  const lastEditorValue = useRef(currentValue);
  const [editorKey, setEditorKey] = useState(0);
  useEffect(() => {
    if (!rich || currentValue === lastEditorValue.current) {
      lastEditorValue.current = currentValue;
      return;
    }
    lastEditorValue.current = currentValue;
    setEditorKey((key) => key + 1);
  }, [currentValue, rich]);

  useEffect(() => {
    setActiveMode(mode);
  }, [mode]);

  useEffect(() => {
    setActiveType(editorType);
  }, [editorType]);

  const reportChange = (markdown: string) => {
    if (!isControlled) setInternalValue(markdown);
    onChange?.(markdown);
  };

  const handleRichChange = (html: string) => {
    // The rich pane does not show the front matter (see markdownToEditorHtml), so it is put back.
    const markdown = joinFrontMatter(splitFrontMatter(valueRef.current).frontMatter, htmlToMarkdown(html));
    lastEditorValue.current = markdown;
    reportChange(markdown);
  };

  // A link to "#..." is a footnote (or a heading link) inside this preview. Left alone, the browser would
  // change the address of the page the editor sits in and scroll that instead.
  const handlePreviewClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const link = (event.target as Element).closest?.('a[href^="#"]');
    if (!link) return;
    event.preventDefault();
    const id = link.getAttribute('href')!.slice(1);
    const target = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[id]')).find((element) => element.id === id);
    if (!target) return;
    target.scrollIntoView?.({ block: 'nearest' });
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  };

  const rootRef = useRef<HTMLDivElement>(null);
  const sourceRef = useRef<SourceEditorHandle>(null);
  useImperativeHandle(
    ref,
    () => ({
      focus: () => {
        if (sourceRef.current) sourceRef.current.focus();
        else rootRef.current?.querySelector<HTMLElement>('[contenteditable="true"]')?.focus();
      },
      getValue: () => valueRef.current,
      insertText: (inserted) => sourceRef.current?.insertText(inserted) ?? false,
      runCommand: (command) => sourceRef.current?.runCommand(command) ?? false,
    }),
    [],
  );

  // Fullscreen covers the page, so the page behind it must not scroll.
  useEffect(() => {
    if (!fullscreen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [fullscreen]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Escape also closes menus and the find panel; whatever handled it first has said so.
    if (fullscreen && event.key === 'Escape' && !event.defaultPrevented) setFullscreen(false);
  };

  // Scrolling the two panes together. Each pane's position is mapped to the other through the preview's
  // blocks (see scrollSync.ts). A pane that was just moved by this code scrolls too and tells us so; that
  // echo is recognised by its position, so it is not mistaken for the user and does not bounce back.
  const previewRef = useRef<HTMLDivElement>(null);
  const echoed = useRef<{ source: number | null; preview: number | null }>({ source: null, preview: null });
  const totalLines = useMemo(() => currentValue.split('\n').length, [currentValue]);
  const syncing = syncScroll && !rich && visibleMode === 'split';

  const readAnchors = (preview: HTMLElement): Anchor[] => {
    const origin = preview.getBoundingClientRect().top - preview.scrollTop;
    return Array.from(preview.querySelectorAll<HTMLElement>('[data-md-line]')).map((element) => ({
      line: Number(element.getAttribute('data-md-line')),
      top: element.getBoundingClientRect().top - origin,
    }));
  };

  const handleSourceScroll = ({ scrollTop, atBottom }: ScrollInfo) => {
    const preview = previewRef.current;
    if (!syncing || !preview) return;
    const echo = echoed.current.source;
    echoed.current.source = null;
    if (echo !== null && Math.abs(scrollTop - echo) <= 1) return;

    const max = Math.max(0, preview.scrollHeight - preview.clientHeight);
    const line = sourceRef.current?.getTopLine() ?? 0;
    const target = atBottom ? max : previewTopForLine(readAnchors(preview), line, totalLines, preview.scrollHeight);
    preview.scrollTop = Math.max(0, Math.min(max, target));
    echoed.current.preview = preview.scrollTop;
  };

  const handlePreviewScroll = () => {
    const preview = previewRef.current;
    const source = sourceRef.current;
    if (!syncing || !preview || !source) return;
    const echo = echoed.current.preview;
    echoed.current.preview = null;
    if (echo !== null && Math.abs(preview.scrollTop - echo) <= 1) return;

    const atBottom = preview.scrollTop >= preview.scrollHeight - preview.clientHeight - 1;
    const line = atBottom
      ? Number.POSITIVE_INFINITY
      : lineForPreviewTop(readAnchors(preview), preview.scrollTop, totalLines, preview.scrollHeight);
    echoed.current.source = source.scrollToLine(line);
  };

  const style = {
    '--md-min-height': `${minHeight}px`,
    ...(height === undefined ? null : { '--md-height': typeof height === 'number' ? `${height}px` : height }),
  } as React.CSSProperties;

  return (
    <div
      className={`md-editor${className ? ` ${className}` : ''}`}
      style={style}
      ref={rootRef}
      data-markdown-editor=""
      data-bounded={height === undefined ? undefined : ''}
      data-fullscreen={fullscreen ? '' : undefined}
      onKeyDown={handleKeyDown}
    >
      <style>{MARKDOWN_EDITOR_CSS}</style>

      <div className="md-editor-header">
        <span className="md-editor-title">
          <MarkdownGlyph />
          {text.title}
        </span>
        <div className="md-editor-controls">
          <Segmented
            label={text.editorTypeGroup}
            options={[
              { value: 'source' as EditorType, label: text.source },
              { value: 'rich' as EditorType, label: text.richText },
            ]}
            value={activeType}
            onChange={setActiveType}
          />
          {preview && (
            <Segmented
              label={text.viewGroup}
              options={[
                { value: 'edit' as Mode, label: text.edit },
                { value: 'split' as Mode, label: text.split },
                { value: 'preview' as Mode, label: text.preview },
              ]}
              value={activeMode}
              onChange={setActiveMode}
            />
          )}
          <button
            type="button"
            className="md-editor-icon-button"
            aria-label={fullscreen ? text.exitFullscreen : text.enterFullscreen}
            title={fullscreen ? text.exitFullscreen : text.enterFullscreen}
            onClick={() => setFullscreen((on) => !on)}
          >
            <FullscreenGlyph exit={fullscreen} />
          </button>
        </div>
      </div>

      <div className="md-editor-body" data-mode={visibleMode}>
        {/* Stays mounted (hidden) in preview mode so switching views keeps undo history and selection. */}
        <div className="md-editor-pane" hidden={visibleMode === 'preview'}>
          {rich ? (
            <RichTextEditor
              key={editorKey}
              defaultValue={editorHtml}
              readonly={readOnly}
              placeholder={placeholder}
              onChange={handleRichChange}
              plugins={plugins}
              toolbar={TOOLBAR}
              statusbar={STATUSBAR}
              content={CONTENT}
              className="md-rich-editor"
            />
          ) : (
            <SourceEditor
              ref={sourceRef}
              labels={text}
              value={currentValue}
              onChange={reportChange}
              readOnly={readOnly}
              placeholder={placeholder}
              onScroll={handleSourceScroll}
            />
          )}
        </div>

        {(visibleMode === 'preview' || visibleMode === 'split') && (
          <section className="md-editor-pane" aria-label={text.previewRegion}>
            <div className="md-preview-head" aria-hidden="true">
              {text.previewHeading}
            </div>
            <div
              className="md-preview"
              ref={previewRef}
              onClick={handlePreviewClick}
              onScroll={handlePreviewScroll}
              dangerouslySetInnerHTML={{
                __html: previewHtml || `<p class="md-empty-state">${escapeHtml(text.emptyPreview)}</p>`,
              }}
            />
          </section>
        )}
      </div>
    </div>
  );
});
