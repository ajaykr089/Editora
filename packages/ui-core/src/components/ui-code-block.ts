import { ElementBase } from '../ElementBase';
import { announce } from '../announce';
import { escapeHtml } from '../primitives/escape-html';

/**
 * A block of code with a header, copy button, line numbers and highlighted lines.
 *
 *   <ui-code-block language="bash" code="npm install @editora/ui-core"></ui-code-block>
 *   <ui-code-block filename="app.ts" line-numbers highlight="2,4-5"></ui-code-block>  (el.code = '…')
 *
 * The code comes from the `code` property/attribute, or from a child <pre> (or <code>): its text
 * is used as is. A child <pre> that is already highlighted (Shiki, Prism, highlight.js output) is
 * shown as given, styled by its own CSS; the copy button copies its text. Attributes: `language`
 * (shown in the header), `filename` (the header title; also the region's name), `line-numbers`,
 * `highlight` (lines to mark: "3", "2,4-6"), `wrap` (soft-wrap long lines instead of scrolling),
 * `no-copy`, `max-height` (a CSS length; taller code scrolls), `copy-label`, `copied-label`.
 *
 * The code area is a focusable region, so keyboard users can scroll it. Copying announces
 * "Copied" to screen readers and fires `code-copy` (detail: { text }).
 */
const style = `
  :host {
    --ui-code-block-bg: var(--ui-color-surface-alt, color-mix(in srgb, var(--ui-color-text, #0f172a) 3%, var(--ui-color-surface, #ffffff)));
    --ui-code-block-header-bg: color-mix(in srgb, var(--ui-color-text, #0f172a) 3%, var(--ui-code-block-bg));
    --ui-code-block-border: var(--ui-color-border, color-mix(in srgb, var(--ui-color-text, #0f172a) 14%, transparent));
    --ui-code-block-color: var(--ui-color-text, #0f172a);
    --ui-code-block-muted: var(--ui-color-muted, #526175);
    --ui-code-block-highlight: color-mix(in srgb, var(--ui-color-primary, #2563eb) 11%, transparent);
    --ui-code-block-highlight-bar: var(--ui-color-primary, #2563eb);
    --ui-code-block-radius: var(--ui-radius, 8px);
    --ui-code-block-font-size: 0.8125rem;
    --ui-code-block-max-height: none;
    color-scheme: light dark;
    display: block;
    min-inline-size: 0;
    font-family: var(--ui-font-family, "Inter", system-ui, -apple-system, "Segoe UI", sans-serif);
  }

  :host([hidden]) { display: none; }

  .frame {
    overflow: hidden;
    border: 1px solid var(--ui-code-block-border);
    border-radius: var(--ui-code-block-radius);
    background: var(--ui-code-block-bg);
    color: var(--ui-code-block-color);
  }

  .header {
    display: flex;
    align-items: center;
    gap: 8px;
    min-block-size: 36px;
    padding: 0 6px 0 12px;
    border-block-end: 1px solid var(--ui-code-block-border);
    background: var(--ui-code-block-header-bg);
    color: var(--ui-code-block-muted);
    font-size: 0.75rem;
  }
  .header[hidden] { display: none; }

  .title {
    flex: 1 1 auto;
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--ui-color-text-secondary, var(--ui-code-block-color));
    font-weight: 500;
  }

  .language {
    flex: none;
    text-transform: lowercase;
    font-family: var(--ui-font-family-code, var(--ui-font-family-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace));
  }

  .copy {
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    block-size: 26px;
    padding: 0 8px;
    border: 1px solid transparent;
    border-radius: var(--ui-control-radius-1, 4px);
    background: transparent;
    color: inherit;
    font: inherit;
    cursor: pointer;
  }
  .copy:hover { background: var(--ui-color-fill-hover, color-mix(in srgb, var(--ui-code-block-color) 8%, transparent)); color: var(--ui-code-block-color); }
  .copy:focus-visible {
    outline: var(--ui-ring-width, 2px) solid var(--ui-ring-color, var(--ui-color-focus-ring, #2563eb));
    outline-offset: 1px;
  }
  .copy svg { inline-size: 14px; block-size: 14px; }
  .copy[data-copied] { color: var(--ui-color-success-text, var(--ui-color-success, #15803d)); }

  /* Floating copy button when there is no header. */
  .body { position: relative; }
  .body > .copy {
    position: absolute;
    inset-block-start: 6px;
    inset-inline-end: 6px;
    z-index: 1;
    background: var(--ui-code-block-bg);
    border-color: var(--ui-code-block-border);
    opacity: 0;
    transition: opacity 120ms ease;
  }
  .frame:hover .body > .copy,
  .body > .copy:focus-visible,
  .body > .copy[data-copied] { opacity: 1; }
  @media (hover: none) { .body > .copy { opacity: 1; } }

  pre {
    margin: 0;
    padding: 12px 0;
    max-block-size: var(--ui-code-block-max-height);
    overflow: auto;
    font-family: var(--ui-font-family-code, var(--ui-font-family-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace));
    font-size: var(--ui-code-block-font-size);
    line-height: 1.6;
    tab-size: 2;
    outline: none;
  }
  pre:focus-visible {
    box-shadow: inset 0 0 0 2px var(--ui-ring-color, var(--ui-color-focus-ring, #2563eb));
  }
  code { display: block; min-inline-size: max-content; font: inherit; }
  :host([wrap]) code { min-inline-size: 0; white-space: pre-wrap; overflow-wrap: anywhere; }

  .line {
    display: block;
    padding-inline: 14px;
    min-block-size: 1.6em;
  }
  .line[data-highlighted] {
    background: var(--ui-code-block-highlight);
    box-shadow: inset 2px 0 0 var(--ui-code-block-highlight-bar);
  }
  :host(:dir(rtl)) .line[data-highlighted] { box-shadow: inset -2px 0 0 var(--ui-code-block-highlight-bar); }

  :host([line-numbers]) code { counter-reset: ui-code-line; }
  :host([line-numbers]) .line { padding-inline-start: 0; }
  :host([line-numbers]) .line::before {
    counter-increment: ui-code-line;
    content: counter(ui-code-line);
    display: inline-block;
    box-sizing: border-box;
    inline-size: calc(var(--ui-code-block-gutter, 2) * 1ch + 28px);
    padding-inline: 14px 14px;
    color: var(--ui-code-block-muted);
    text-align: end;
    user-select: none;
    -webkit-user-select: none;
    opacity: 0.75;
  }

  /* A highlighted <pre> from the app keeps its own colours; only the frame is ours. */
  .slotted { display: block; }
  slot[hidden] { display: none; }
  ::slotted(pre) {
    margin: 0 !important;
    padding: 12px 14px !important;
    max-block-size: var(--ui-code-block-max-height);
    overflow: auto;
    border-radius: 0 !important;
    font-size: var(--ui-code-block-font-size) !important;
    line-height: 1.6;
  }

  .sr {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    margin: -1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  @media (forced-colors: active) {
    .frame { border-color: CanvasText; }
    .line[data-highlighted] { forced-color-adjust: none; background: Highlight; color: HighlightText; }
  }
`;

const COPY_ICON = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5.5" y="5.5" width="8" height="8" rx="1.5"/><path d="M10.5 3.5v-.5A1.5 1.5 0 0 0 9 1.5H4A1.5 1.5 0 0 0 2.5 3v5A1.5 1.5 0 0 0 4 9.5h.5"/></svg>';
const CHECK_ICON = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 8.5 3.2 3L13 4.5"/></svg>';

/** "2,4-6" -> {2, 4, 5, 6}. Ranges are capped so a typo cannot allocate millions of entries. */
export function parseLineRanges(value: string | null): Set<number> {
  const lines = new Set<number>();
  for (const part of (value || '').split(',')) {
    const match = /^\s*(\d+)\s*(?:-\s*(\d+))?\s*$/.exec(part);
    if (!match) continue;
    const start = Number(match[1]);
    const end = match[2] ? Number(match[2]) : start;
    for (let line = Math.min(start, end); line <= Math.max(start, end) && line - start < 10000; line += 1) lines.add(line);
  }
  return lines;
}

async function writeClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Permission denied or not focused: try the legacy path.
  }
  try {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.cssText = 'position:fixed;inset-block-start:0;opacity:0;pointer-events:none';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  } catch {
    return false;
  }
}

export class UICodeBlock extends ElementBase {
  static get observedAttributes() {
    return ['code', 'language', 'filename', 'line-numbers', 'highlight', 'wrap', 'no-copy', 'max-height', 'copy-label', 'copied-label'];
  }

  private _code: string | null = null;

  constructor() {
    super();
    this.root.addEventListener('click', (event) => {
      if ((event.target as Element | null)?.closest?.('.copy')) void this.copy();
    });
  }

  private copiedTimer: ReturnType<typeof setTimeout> | null = null;
  private observer: MutationObserver | null = null;

  /** The code shown and copied. Setting it overrides the attribute and any child <pre>. */
  get code(): string {
    if (this._code != null) return this._code;
    if (this.hasAttribute('code')) return this.getAttribute('code') || '';
    return this.childCode();
  }

  set code(value: string) {
    this._code = value == null ? null : String(value);
    this.requestRender();
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.observer && typeof MutationObserver !== 'undefined') {
      this.observer = new MutationObserver(() => {
        if (this._code == null && !this.hasAttribute('code')) this.requestRender();
      });
      this.observer.observe(this, { childList: true, characterData: true, subtree: true });
    }
  }

  override disconnectedCallback(): void {
    this.observer?.disconnect();
    this.observer = null;
    if (this.copiedTimer) clearTimeout(this.copiedTimer);
    super.disconnectedCallback();
  }

  protected override shouldRenderOnAttributeChange(name: string): boolean {
    if (name === 'max-height') {
      this.syncMaxHeight();
      return false;
    }
    return true;
  }

  private syncMaxHeight(): void {
    const value = (this.getAttribute('max-height') || '').trim();
    if (value) this.style.setProperty('--ui-code-block-max-height', /^\d+$/.test(value) ? `${value}px` : value);
    else this.style.removeProperty('--ui-code-block-max-height');
  }

  private highlightedChild(): HTMLElement | null {
    const pre = this.querySelector(':scope > pre');
    // A <pre> with element children (spans from a highlighter) is shown as given.
    return pre && pre.querySelector('span, b, i, em, strong, mark') ? (pre as HTMLElement) : null;
  }

  private childCode(): string {
    const source = this.querySelector(':scope > pre, :scope > code') as HTMLElement | null;
    const text = source ? source.textContent || '' : '';
    // A leading newline right after <pre> is not content; neither is a trailing one.
    return text.replace(/^\n/, '').replace(/\n$/, '');
  }

  /** Copies the code to the clipboard. Resolves to whether it worked. */
  async copy(): Promise<boolean> {
    const highlighted = this._code == null && !this.hasAttribute('code') ? this.highlightedChild() : null;
    const text = highlighted ? (highlighted.textContent || '').replace(/\n$/, '') : this.code;
    const ok = await writeClipboard(text);
    const button = this.root.querySelector('.copy') as HTMLButtonElement | null;
    if (ok) {
      this.dispatchEvent(new CustomEvent('code-copy', { detail: { text }, bubbles: true, composed: true }));
      announce(this.getAttribute('copied-label') || 'Copied');
      if (button) {
        button.setAttribute('data-copied', '');
        const label = button.querySelector('.copy-text');
        if (label) label.textContent = this.getAttribute('copied-label') || 'Copied';
        const icon = button.querySelector('.copy-icon');
        if (icon) icon.innerHTML = CHECK_ICON;
      }
      if (this.copiedTimer) clearTimeout(this.copiedTimer);
      this.copiedTimer = setTimeout(() => {
        this.copiedTimer = null;
        const current = this.root.querySelector('.copy');
        if (!current) return;
        current.removeAttribute('data-copied');
        const label = current.querySelector('.copy-text');
        if (label) label.textContent = this.getAttribute('copy-label') || 'Copy';
        const icon = current.querySelector('.copy-icon');
        if (icon) icon.innerHTML = COPY_ICON;
      }, 2000);
    }
    return ok;
  }

  protected override render(): void {
    this.syncMaxHeight();
    const filename = this.getAttribute('filename') || '';
    const language = this.getAttribute('language') || '';
    const copyable = !this.hasAttribute('no-copy');
    const copyLabel = this.getAttribute('copy-label') || 'Copy';
    const highlighted = this._code == null && !this.hasAttribute('code') ? this.highlightedChild() : null;
    const hasHeader = !!(filename || language);
    const regionName = filename || (language ? `${language} code` : 'Code');

    const copyButton = copyable
      ? `<button type="button" class="copy" part="copy-button" aria-label="${escapeHtml(`${copyLabel}${filename ? ` ${filename}` : ' code'}`)}">
          <span class="copy-icon">${COPY_ICON}</span>${hasHeader ? `<span class="copy-text" aria-hidden="true">${escapeHtml(copyLabel)}</span>` : ''}
        </button>`
      : '';

    let codeArea: string;
    if (highlighted) {
      codeArea = '<div class="slotted"><slot></slot></div>';
    } else {
      const lines = this.code.split('\n');
      const marked = parseLineRanges(this.getAttribute('highlight'));
      this.style.setProperty('--ui-code-block-gutter', String(String(lines.length).length));
      const body = lines
        .map((line, index) => `<span class="line"${marked.has(index + 1) ? ' data-highlighted' : ''}>${escapeHtml(line) || ' '}</span>`)
        .join('');
      codeArea = `<pre part="pre" tabindex="0" role="region" aria-label="${escapeHtml(regionName)}"><code part="code"${language ? ` data-language="${escapeHtml(language)}"` : ''}>${body}</code></pre><slot hidden></slot>`;
    }

    this.setContent(`
      <style>${style}</style>
      <div class="frame" part="frame">
        <div class="header" part="header"${hasHeader ? '' : ' hidden'}>
          <span class="title" part="title">${escapeHtml(filename)}</span>
          ${language ? `<span class="language" part="language">${escapeHtml(language)}</span>` : ''}
          ${hasHeader ? copyButton : ''}
        </div>
        <div class="body" part="body">
          ${hasHeader ? '' : copyButton}
          ${codeArea}
        </div>
      </div>
    `);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-code-block')) {
  customElements.define('ui-code-block', UICodeBlock);
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-code-block': UICodeBlock;
  }
}
