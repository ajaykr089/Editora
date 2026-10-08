import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { htmlToMarkdown } from '../markdown/htmlToMarkdown';
import { markdownToEditorHtml, markdownToPreviewHtml } from '../markdown/markdownToHtml';
import { SourceEditor } from '../source/SourceEditor';
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
  className?: string;
  onChange?: (value: string) => void;
}

const MODES: ReadonlyArray<{ mode: Mode; label: string }> = [
  { mode: 'edit', label: 'Edit' },
  { mode: 'split', label: 'Split' },
  { mode: 'preview', label: 'Preview' },
];

const EDITOR_TYPES: ReadonlyArray<{ type: EditorType; label: string }> = [
  { type: 'source', label: 'Source' },
  { type: 'rich', label: 'Rich text' },
];

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

const MarkdownGlyph: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" focusable="false">
    <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
    <path d="M6 15V9l2.5 3L11 9v6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 9v6m0 0-2-2m2 2 2-2" strokeLinecap="round" strokeLinejoin="round" />
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

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  defaultValue = '',
  placeholder = 'Write markdown here...',
  readOnly = false,
  preview = true,
  mode = 'split',
  editorType = 'source',
  minHeight = 220,
  className,
  onChange,
}) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [activeMode, setActiveMode] = useState<Mode>(mode);
  const [activeType, setActiveType] = useState<EditorType>(editorType);
  const currentValue = isControlled ? value ?? '' : internalValue;
  const visibleMode: Mode = preview ? activeMode : 'edit';
  const rich = activeType === 'rich';

  // Only what is on screen is converted: the preview HTML when a preview is shown, the rich editor's
  // HTML when the rich editor is.
  const plugins = useMemo(() => (rich ? createPlugins() : []), [rich]);
  const previewHtml = useMemo(
    () => (visibleMode === 'edit' ? '' : markdownToPreviewHtml(currentValue)),
    [currentValue, visibleMode],
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
    const markdown = htmlToMarkdown(html);
    lastEditorValue.current = markdown;
    reportChange(markdown);
  };

  const style = { '--md-min-height': `${minHeight}px` } as React.CSSProperties;

  return (
    <div className={`md-editor${className ? ` ${className}` : ''}`} style={style} data-markdown-editor="">
      <style>{MARKDOWN_EDITOR_CSS}</style>

      <div className="md-editor-header">
        <span className="md-editor-title">
          <MarkdownGlyph />
          Markdown
        </span>
        <div className="md-editor-controls">
          <Segmented
            label="Editor type"
            options={EDITOR_TYPES.map(({ type, label }) => ({ value: type, label }))}
            value={activeType}
            onChange={setActiveType}
          />
          {preview && (
            <Segmented
              label="Editor view"
              options={MODES.map(({ mode: option, label }) => ({ value: option, label }))}
              value={activeMode}
              onChange={setActiveMode}
            />
          )}
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
            <SourceEditor value={currentValue} onChange={reportChange} readOnly={readOnly} placeholder={placeholder} />
          )}
        </div>

        {(visibleMode === 'preview' || visibleMode === 'split') && (
          <section className="md-editor-pane" aria-label="Markdown preview">
            <div className="md-preview-head" aria-hidden="true">
              Preview
            </div>
            <div
              className="md-preview"
              dangerouslySetInnerHTML={{
                __html: previewHtml || '<p class="md-empty-state">Nothing to preview yet.</p>',
              }}
            />
          </section>
        )}
      </div>
    </div>
  );
};
