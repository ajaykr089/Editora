/**
 * Styles follow the Editora editor: everything is drawn from the `--rte-*` theme variables (the
 * fallbacks are the default light theme's values), so `@editora/themes`, including its dark theme
 * (`.dark`, `[data-theme="dark"]`, `.editora-theme-dark` on any ancestor), restyles this component
 * with the editor it wraps.
 */
export const MARKDOWN_EDITOR_CSS = `
.md-editor {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border: 1px solid var(--rte-color-border, #dee2e6);
  border-radius: var(--rte-radius-lg, 0.5rem);
  background: var(--rte-color-bg-primary, #fff);
  color: var(--rte-color-text-primary, #212529);
  font-family: var(--rte-font-family-base, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif);
  box-shadow: var(--rte-shadow, 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06));
  transition: border-color var(--rte-transition-fast, 150ms ease-in-out), box-shadow var(--rte-transition-fast, 150ms ease-in-out);
  overflow: hidden;
  overflow: clip;
}
.md-editor *, .md-editor *::before, .md-editor *::after { box-sizing: border-box; }
.md-editor:focus-within {
  border-color: var(--rte-color-border-focus, #007bff);
  box-shadow: var(--rte-shadow, 0 1px 3px rgba(0, 0, 0, 0.1)), 0 0 0 3px rgba(0, 123, 255, 0.1);
}

/* Header strip: the same surface as the editor toolbar. */
.md-editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--rte-space-sm, 0.5rem);
  min-height: 2.75rem;
  padding: 0.375rem var(--rte-space-sm, 0.5rem);
  background: var(--rte-color-bg-secondary, #f8f9fa);
  border-bottom: 1px solid var(--rte-color-border, #dee2e6);
}
.md-editor-title {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding-left: 0.25rem;
  font-size: var(--rte-font-size-sm, 0.875rem);
  font-weight: var(--rte-font-weight-semibold, 600);
  color: var(--rte-color-text-secondary, #6c757d);
}
.md-editor-title svg { width: 1.25rem; height: 1.25rem; flex-shrink: 0; }
.md-editor-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--rte-space-sm, 0.5rem);
}

.md-editor-modes {
  display: inline-flex;
  border: 1px solid var(--rte-color-border, #dee2e6);
  border-radius: var(--rte-radius, 0.25rem);
  background: var(--rte-color-bg-primary, #fff);
  overflow: hidden;
}
.md-editor-mode {
  appearance: none;
  border: 0;
  margin: 0;
  height: 1.75rem;
  padding: 0 0.75rem;
  background: transparent;
  color: var(--rte-color-text-secondary, #6c757d);
  font: inherit;
  font-size: 0.8125rem;
  font-weight: var(--rte-font-weight-medium, 500);
  line-height: 1;
  cursor: pointer;
  transition: background-color var(--rte-transition-fast, 150ms ease-in-out), color var(--rte-transition-fast, 150ms ease-in-out);
}
.md-editor-mode + .md-editor-mode { border-left: 1px solid var(--rte-color-border, #dee2e6); }
.md-editor-mode:hover {
  background: var(--rte-color-bg-hover, #f8f9fa);
  color: var(--rte-color-text-primary, #212529);
}
.md-editor-mode[aria-pressed="true"] {
  background: var(--rte-color-primary, #007bff);
  color: var(--rte-color-text-inverse, #fff);
}
.md-editor-mode:focus-visible {
  outline: 2px solid var(--rte-color-border-focus, #007bff);
  outline-offset: -2px;
}
.md-editor-icon-button {
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  padding: 0;
  border: 1px solid var(--rte-color-border, #dee2e6);
  border-radius: var(--rte-radius, 0.25rem);
  background: var(--rte-color-bg-primary, #fff);
  color: var(--rte-color-text-secondary, #6c757d);
  cursor: pointer;
  transition: background-color var(--rte-transition-fast, 150ms ease-in-out), color var(--rte-transition-fast, 150ms ease-in-out);
}
.md-editor-icon-button svg { width: 1rem; height: 1rem; }
.md-editor-icon-button:hover {
  background: var(--rte-color-bg-hover, #f8f9fa);
  color: var(--rte-color-text-primary, #212529);
}
.md-editor-icon-button:focus-visible {
  outline: 2px solid var(--rte-color-border-focus, #007bff);
  outline-offset: 1px;
}

/* Panes. The 1px gap shows the border colour between them, side by side or stacked. */
.md-editor-body {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1px;
  background: var(--rte-color-border, #dee2e6);
}
.md-editor-body[data-mode="split"] {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 24rem), 1fr));
}
.md-editor-pane {
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: var(--rte-color-bg-primary, #fff);
}
.md-editor-pane[hidden] { display: none; }
.md-editor-pane > .rte-editor { flex: 1 1 auto; }

/* The wrapped editor lives inside this card, so it drops its own frame. */
.md-editor .rte-editor,
.md-editor .rte-editor:focus-within {
  border: 0;
  border-radius: 0;
  box-shadow: none;
}
.md-editor .rte-toolbar { border-radius: 0; }
.md-editor .rte-content { min-height: var(--md-min-height, 220px); }
.md-editor .rte-content li > ul,
.md-editor .rte-content li > ol { margin: 0; }

/* Source editor: the Editora toolbar, the code editor, and the Editora status bar. */
.md-source {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-width: 0;
}
.md-source-toolbar { position: sticky; top: 0; z-index: 3; }
.md-source .rte-toolbar {
  border: 0;
  border-bottom: 1px solid var(--rte-color-border, #dee2e6);
  border-radius: 0;
}
.md-source .rte-toolbar-dropdown-item {
  display: block;
  width: 100%;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
}
.md-source .rte-toolbar-dropdown-item:focus-visible {
  outline: 2px solid var(--rte-color-border-focus, #007bff);
  outline-offset: -2px;
}
.md-source-surface { position: relative; flex: 1 1 auto; min-height: var(--md-min-height, 220px); }
.md-source-editor { height: 100%; }
.md-source-editor .rte-light-editor {
  height: auto;
  min-height: var(--md-min-height, 220px);
  border: 0;
  border-radius: 0;
}
.md-source-placeholder {
  position: absolute;
  top: 8px;
  left: 58px;
  right: 8px;
  color: var(--rte-color-text-muted, #868e96);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 21px;
  pointer-events: none;
  z-index: 6;
}
.md-source .editora-statusbar-container { display: flex; flex-direction: column; }
.md-source .editora-statusbar { border-left: 0; border-right: 0; }

.md-preview-head {
  display: flex;
  align-items: center;
  min-height: 3rem;
  padding: 0 var(--rte-space-md, 1rem);
  background: var(--rte-color-bg-secondary, #f8f9fa);
  border-bottom: 1px solid var(--rte-color-border, #dee2e6);
  font-size: var(--rte-font-size-xs, 0.75rem);
  font-weight: var(--rte-font-weight-semibold, 600);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--rte-color-text-muted, #868e96);
}

/* Preview typography mirrors .rte-content so both panes read the same. */
.md-preview {
  flex: 1 1 auto;
  min-height: var(--md-min-height, 220px);
  padding: 16px;
  overflow: auto;
  font-size: 16px;
  line-height: 1.6;
  color: var(--rte-color-text-primary, #212529);
  overflow-wrap: anywhere;
}
.md-preview > :first-child { margin-top: 0; }
.md-preview > :last-child { margin-bottom: 0; }
.md-preview p { margin: 0 0 1em; }
.md-preview h1 { font-size: 2em; margin: 0.67em 0; }
.md-preview h2 { font-size: 1.5em; margin: 0.75em 0; }
.md-preview h3 { font-size: 1.17em; margin: 0.83em 0; }
.md-preview h4 { font-size: 1em; margin: 1em 0; }
.md-preview h5 { font-size: 0.83em; margin: 1.17em 0; }
.md-preview h6 { font-size: 0.67em; margin: 1.33em 0; }
.md-preview ul, .md-preview ol { margin: 1em 0; padding-left: 2em; }
.md-preview li > ul, .md-preview li > ol { margin: 0; }
.md-preview blockquote {
  margin: 1em 0;
  padding-left: 1em;
  border-left: 4px solid var(--rte-color-border, #ddd);
  color: var(--rte-color-text-secondary, #666);
}
.md-preview a { color: var(--rte-color-primary, #0066cc); text-decoration: underline; }
.md-preview img { max-width: 100%; height: auto; }
.md-preview hr { border: 0; border-top: 1px solid var(--rte-color-border, #dee2e6); margin: 1.5em 0; }
.md-preview table { border-collapse: collapse; width: 100%; margin: 1rem 0; font-size: 14px; line-height: 1.4; }
.md-preview th, .md-preview td {
  border: 1px solid var(--rte-color-border, #ddd);
  padding: 8px 12px;
  text-align: left;
  vertical-align: top;
}
.md-preview th { background: var(--rte-color-bg-secondary, #f8f9fa); font-weight: 600; }
.md-inline-code {
  padding: 2px 6px;
  border-radius: 3px;
  background: var(--rte-color-bg-tertiary, #f4f4f4);
  font-family: var(--rte-font-family-mono, 'SFMono-Regular', Menlo, Monaco, Consolas, monospace);
  font-size: 0.9em;
}
.md-code-block {
  margin: 1em 0;
  padding: 0.9rem 1rem;
  border-radius: 8px;
  background: #0f172a;
  color: #f8fafc;
  overflow: auto;
  font-family: var(--rte-font-family-mono, 'SFMono-Regular', Menlo, Monaco, Consolas, monospace);
  font-size: 0.9rem;
  line-height: 1.5;
}
.md-code-block code { background: none; padding: 0; color: inherit; font: inherit; }
.md-token-keyword { color: #f472b6; }
.md-token-string { color: #86efac; }
.md-token-number { color: #fbbf24; }
.md-token-boolean { color: #93c5fd; }
.md-token-comment { color: #94a3b8; font-style: italic; }
.md-token-key { color: #f9a8d4; }

.md-preview li:has(> .md-task-box) { list-style: none; }
.md-task-box {
  display: inline-block;
  position: relative;
  width: 1em;
  height: 1em;
  margin: 0 0.5em 0 -1.5em;
  vertical-align: -0.15em;
  border: 2px solid var(--rte-color-text-muted, #868e96);
  border-radius: 3px;
}
.md-task-box[aria-checked="true"] {
  background: var(--rte-color-primary, #007bff);
  border-color: var(--rte-color-primary, #007bff);
}
/* An SVG over the whole box (border included) and centred in it, sized the way the editor's checklist
 * sizes its own mark, so the two panes match and the mark does not depend on hand-tuned offsets. */
.md-task-box[aria-checked="true"]::after {
  content: '';
  position: absolute;
  inset: -2px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M3.5 8.5l3 3 6-7' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center / 75% no-repeat;
}

/* A fixed height (the height prop) or fullscreen: each pane scrolls inside the card instead of the card growing.
 * Side by side or stacked, the panes share what is left under the header equally. */
.md-editor[data-bounded] { height: var(--md-height); }
.md-editor[data-fullscreen] {
  position: fixed;
  inset: 0;
  z-index: var(--md-fullscreen-z-index, 9999);
  height: auto;
  border: 0;
  border-radius: 0;
  box-shadow: none;
}
.md-editor:is([data-bounded], [data-fullscreen]) .md-editor-body {
  flex: 1 1 0;
  min-height: 0;
  grid-template-rows: minmax(0, 1fr);
  grid-auto-rows: minmax(0, 1fr);
}
.md-editor:is([data-bounded], [data-fullscreen]) .md-editor-pane { min-height: 0; overflow: hidden; }
.md-editor:is([data-bounded], [data-fullscreen]) .md-source { min-height: 0; }
.md-editor:is([data-bounded], [data-fullscreen]) .md-source-surface { flex: 1 1 0; min-height: 0; }
.md-editor:is([data-bounded], [data-fullscreen]) .md-source-editor { position: absolute; inset: 0; height: auto; }
.md-editor:is([data-bounded], [data-fullscreen]) .md-source-editor .rte-light-editor { height: 100%; min-height: 0; }
.md-editor:is([data-bounded], [data-fullscreen]) .md-preview { flex: 1 1 0; min-height: 0; }
.md-editor:is([data-bounded], [data-fullscreen]) .rte-editor { min-height: 0; }

/* Front matter is metadata, so it is a quiet, collapsed block above the document. */
.md-front-matter {
  margin: 0 0 1em;
  border: 1px solid var(--rte-color-border, #dee2e6);
  border-radius: var(--rte-radius, 0.25rem);
  background: var(--rte-color-bg-secondary, #f8f9fa);
  font-size: 14px;
  line-height: 1.5;
}
.md-front-matter summary {
  padding: 0.4rem 0.75rem;
  cursor: pointer;
  font-size: var(--rte-font-size-xs, 0.75rem);
  font-weight: var(--rte-font-weight-semibold, 600);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--rte-color-text-muted, #868e96);
}
.md-front-matter pre {
  margin: 0;
  padding: 0.5rem 0.75rem 0.75rem;
  border-top: 1px solid var(--rte-color-border, #dee2e6);
  overflow: auto;
  font-family: var(--rte-font-family-mono, 'SFMono-Regular', Menlo, Monaco, Consolas, monospace);
  font-size: 0.9em;
}
.md-front-matter code { background: none; padding: 0; font: inherit; }

/* Footnotes: a small reference number in the text, and the notes together at the end. */
.md-preview sup > a[data-footnote-ref] { padding: 0 1px; text-decoration: none; }
.md-preview .footnotes {
  margin-top: 2em;
  padding-top: 0.5em;
  border-top: 1px solid var(--rte-color-border, #dee2e6);
  font-size: 0.875em;
  color: var(--rte-color-text-secondary, #6c757d);
}
.md-preview .footnotes ol { margin: 0.5em 0 0; }
.md-preview .footnotes li > p { margin: 0 0 0.25em; }
.md-preview a[data-footnote-backref] { margin-left: 0.25em; text-decoration: none; }
.md-preview .sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
.md-empty-state { margin: 0; color: var(--rte-color-text-muted, #868e96); font-style: italic; }
`;
