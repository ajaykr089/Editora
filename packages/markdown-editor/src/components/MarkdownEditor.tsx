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
import { MARKDOWN_EDITOR_CSS } from './styles';

type Mode = 'edit' | 'preview' | 'split';

export interface MarkdownEditorProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  readOnly?: boolean;
  preview?: boolean;
  mode?: Mode;
  minHeight?: number;
  className?: string;
  onChange?: (value: string) => void;
}

const MODES: ReadonlyArray<{ mode: Mode; label: string }> = [
  { mode: 'edit', label: 'Edit' },
  { mode: 'split', label: 'Split' },
  { mode: 'preview', label: 'Preview' },
];

// These objects are props of the wrapped editor, which rebuilds itself whenever their identity changes,
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

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  defaultValue = '',
  placeholder = 'Write markdown here...',
  readOnly = false,
  preview = true,
  mode = 'split',
  minHeight = 220,
  className,
  onChange,
}) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [activeMode, setActiveMode] = useState<Mode>(mode);
  const currentValue = isControlled ? value ?? '' : internalValue;
  const visibleMode: Mode = preview ? activeMode : 'edit';

  const plugins = useMemo(createPlugins, []);
  const previewHtml = useMemo(() => markdownToPreviewHtml(currentValue), [currentValue]);
  const editorHtml = useMemo(() => markdownToEditorHtml(currentValue), [currentValue]);

  // The rich editor is remounted to load markdown that changed from outside (the `value` prop). It
  // used to be keyed on the markdown itself, so every keystroke - which round-trips through onChange
  // - remounted it and dropped focus after each character. Now it only remounts when the value differs
  // from what the editor itself last reported.
  const lastEditorValue = useRef(currentValue);
  const [editorKey, setEditorKey] = useState(0);
  useEffect(() => {
    if (currentValue === lastEditorValue.current) return;
    lastEditorValue.current = currentValue;
    setEditorKey((key) => key + 1);
  }, [currentValue]);

  useEffect(() => {
    setActiveMode(mode);
  }, [mode]);

  const handleEditorChange = (html: string) => {
    const markdown = htmlToMarkdown(html);
    lastEditorValue.current = markdown;
    if (!isControlled) setInternalValue(markdown);
    onChange?.(markdown);
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
        {preview && (
          <div className="md-editor-modes" role="group" aria-label="Editor view">
            {MODES.map(({ mode: option, label }) => (
              <button
                key={option}
                type="button"
                className="md-editor-mode"
                aria-pressed={activeMode === option}
                onClick={() => setActiveMode(option)}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="md-editor-body" data-mode={visibleMode}>
        {/* Stays mounted (hidden) in preview mode so switching views keeps undo history and selection. */}
        <div className="md-editor-pane" hidden={visibleMode === 'preview'}>
          <RichTextEditor
            key={editorKey}
            defaultValue={editorHtml}
            readonly={readOnly}
            placeholder={placeholder}
            onChange={handleEditorChange}
            plugins={plugins}
            toolbar={TOOLBAR}
            statusbar={STATUSBAR}
            content={CONTENT}
            className="md-rich-editor"
          />
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
