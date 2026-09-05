import React, { useEffect, useMemo, useState } from 'react';
import { marked } from 'marked';
import { RichTextEditor } from '@editora/react';

export interface MarkdownEditorProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  readOnly?: boolean;
  preview?: boolean;
  mode?: 'edit' | 'preview' | 'split';
  minHeight?: number;
  className?: string;
  onChange?: (value: string) => void;
}

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const highlightCode = (code: string, language?: string): string => {
  let html = escapeHtml(code);
  const normalizedLanguage = (language || '').toLowerCase();

  if (normalizedLanguage === 'json') {
    html = html.replace(/("(?:\\.|[^"\\])*"\s*:)/g, '<span class="md-token-key">$1</span>');
    html = html.replace(/("(?:\\.|[^"\\])*")/g, '<span class="md-token-string">$1</span>');
    html = html.replace(/\b(true|false|null)\b/g, '<span class="md-token-boolean">$1</span>');
  } else {
    html = html.replace(/(\/\/.*$)/gm, '<span class="md-token-comment">$1</span>');
    html = html.replace(/\b(const|let|var|function|return|if|else|for|while|new|class|import|export|from|async|await|try|catch|throw|true|false|null|undefined)\b/g, '<span class="md-token-keyword">$1</span>');
    html = html.replace(/("(?:\\.|[^"\\])*")/g, '<span class="md-token-string">$1</span>');
    html = html.replace(/\b(\d+)\b/g, '<span class="md-token-number">$1</span>');
  }

  return html;
};

const markdownToHtml = (input: string): string => {
  const parsed = marked.parse(input, {
    gfm: true,
    breaks: true,
  });

  return typeof parsed === 'string' ? parsed : '';
};

const htmlToMarkdown = (html: string): string => {
  const normalized = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(h[1-6])>/gi, '\n')
    .replace(/<h([1-6])[^>]*>/gi, (_match, level: string) => `${'#'.repeat(Number(level))} `)
    .replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, '**$2**')
    .replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, '*$2*')
    .replace(/<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>/gi, '> $1')
    .replace(/<code\b[^>]*>([\s\S]*?)<\/code>/gi, '`$1`')
    .replace(/<li\b[^>]*>/gi, '- ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<p\b[^>]*>/gi, '')
    .replace(/<\/div>/gi, '\n')
    .replace(/<div\b[^>]*>/gi, '')
    .replace(/<\/(ul|ol)>/gi, '\n')
    .replace(/<(ul|ol)>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return normalized;
};

const renderMarkdown = (input: string): string => {
  const renderer = new marked.Renderer();
  renderer.code = ({ text, lang }: any) => {
    const language = lang ? escapeHtml(lang) : 'txt';
    return `<pre class="md-code-block"><code class="language-${language}">${highlightCode(text, lang)}</code></pre>`;
  };

  renderer.codespan = ({ text }: any) => {
    return `<code class="md-inline-code">${escapeHtml(text)}</code>`;
  };

  const parsed = marked.parse(input, {
    gfm: true,
    breaks: true,
    renderer,
  });

  return typeof parsed === 'string' ? parsed : '';
};

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
  const [activeMode, setActiveMode] = useState<'edit' | 'preview' | 'split'>(mode);
  const currentValue = isControlled ? value ?? '' : internalValue;
  const previewHtml = useMemo(() => renderMarkdown(currentValue), [currentValue]);
  const editorHtml = useMemo(() => markdownToHtml(currentValue), [currentValue]);

  useEffect(() => {
    setActiveMode(mode);
  }, [mode]);

  const updateValue = (nextValue: string) => {
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
  };

  const handleEditorChange = (html: string) => {
    updateValue(htmlToMarkdown(html));
  };

  const toolbarButtons = [
    { label: 'Bold', icon: 'B', action: () => updateValue(`${currentValue}\\n**bold text**`) },
    { label: 'Italic', icon: 'I', action: () => updateValue(`${currentValue}\\n*italic text*`) },
    { label: 'Heading', icon: 'H', action: () => updateValue(`${currentValue}\\n# Heading`) },
    { label: 'List', icon: '•', action: () => updateValue(`${currentValue}\\n- list item`) },
    { label: 'Quote', icon: '❝', action: () => updateValue(`${currentValue}\\n> quote`) },
    { label: 'Code', icon: '</>', action: () => updateValue(`${currentValue}\\n\`code\``) },
  ];

  return (
    <div className={className} style={{ display: 'grid', gap: '12px' }}>
      <style>{`
        .md-inline-code {
          background: #e2e8f0;
          color: #0f172a;
          border-radius: 4px;
          padding: 0.1rem 0.35rem;
          font-family: ui-monospace, SFMono-Regular, monospace;
        }
        .md-editor-shell {
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
          overflow: hidden;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .md-editor-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          padding: 12px 14px;
          border-bottom: 1px solid #e2e8f0;
          background: rgba(248, 250, 252, 0.92);
        }
        .md-editor-toolbar-group {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          align-items: center;
        }
        .md-editor-mode-btn,
        .md-editor-action-btn {
          border: 1px solid #cbd5e1;
          border-radius: 999px;
          padding: 6px 10px;
          background: #fff;
          color: #334155;
          cursor: pointer;
          font-size: 0.82rem;
          font-weight: 600;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
          transition: all 120ms ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .md-editor-mode-btn.active,
        .md-editor-action-btn:hover {
          background: #0f172a;
          color: #fff;
          border-color: #0f172a;
          box-shadow: 0 6px 14px rgba(15, 23, 42, 0.12);
        }
        .md-editor-action-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          padding: 10px 14px;
          border-bottom: 1px solid #e2e8f0;
          background: #fff;
        }
        .md-editor-body {
          display: grid;
          gap: 12px;
          padding: 12px;
          background: #fff;
        }
        .md-editor-pane {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          min-height: ${minHeight}px;
          background: #fff;
        }
        .md-rich-editor .rte-content {
          min-height: ${minHeight}px;
          padding: 12px;
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
          line-height: 1.6;
          color: #0f172a;
        }
        .md-code-block {
          background: #0f172a;
          color: #f8fafc;
          border-radius: 8px;
          padding: 0.9rem 1rem;
          overflow: auto;
          font-family: ui-monospace, SFMono-Regular, monospace;
          font-size: 0.92rem;
        }
        .md-token-keyword { color: #f472b6; }
        .md-token-string { color: #86efac; }
        .md-token-number { color: #fbbf24; }
        .md-token-boolean { color: #93c5fd; }
        .md-token-comment { color: #94a3b8; font-style: italic; }
        .md-token-key { color: #f9a8d4; }
        .md-empty-state { color: #64748b; font-style: italic; }
      `}</style>

      <div className="md-editor-shell" data-editora-editor="markdown" style={{ display: 'grid', gap: 0 }}>
        <div className="md-editor-toolbar">
          <div className="md-editor-toolbar-group">
            <div style={{ width: '8px', height: '8px', borderRadius: '999px', background: '#0f172a' }} />
            <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>Markdown Editor</strong>
          </div>
          <div className="md-editor-toolbar-group">
            {preview && (
              <>
                {(['edit', 'split', 'preview'] as const).map((modeOption) => (
                  <button
                    key={modeOption}
                    type="button"
                    onClick={() => setActiveMode(modeOption)}
                    className={`md-editor-mode-btn${activeMode === modeOption ? ' active' : ''}`}
                  >
                    {modeOption.charAt(0).toUpperCase() + modeOption.slice(1)}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>

        {preview && (
          <div className="md-editor-action-row">
            {toolbarButtons.map((button) => (
              <button
                key={button.label}
                type="button"
                onClick={button.action}
                className="md-editor-action-btn"
                title={button.label}
              >
                <span style={{ fontSize: '0.9rem' }}>{button.icon}</span>
                <span>{button.label}</span>
              </button>
            ))}
          </div>
        )}

        <div className="md-editor-body">
          {(activeMode === 'edit' || activeMode === 'split') && (
            <div className="md-editor-pane">
              <RichTextEditor
                key={currentValue}
                defaultValue={editorHtml}
                readonly={readOnly}
                placeholder={placeholder}
                onChange={handleEditorChange}
                toolbar={{ items: ['bold', 'italic', 'heading', 'bullist', 'numlist', 'quote', 'code'], floating: true, sticky: true, showMoreOptions: false }}
                content={{ sanitize: true }}
                className="md-rich-editor"
              />
            </div>
          )}

          {(activeMode === 'preview' || activeMode === 'split') && preview && (
            <div
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '12px',
                backgroundColor: '#f8fafc',
                minHeight: '120px',
                overflow: 'auto',
                boxShadow: 'inset 0 1px 2px rgba(15, 23, 42, 0.04)',
              }}
            >
              <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px', color: '#475569' }}>
                Preview
              </div>
              <div
                style={{
                  lineHeight: 1.6,
                  color: '#0f172a',
                  fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
                }}
                dangerouslySetInnerHTML={{ __html: previewHtml || '<p class="md-empty-state">Nothing to preview yet.</p>' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
