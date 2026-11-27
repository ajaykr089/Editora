import { ElementBase } from '../ElementBase';

/**
 * Typography for HTML you do not write element by element: a Markdown render, a CMS field, the
 * output of the Editora editor.
 *
 *   <ui-prose>
 *     <h2>Release notes</h2>
 *     <p>Paragraphs, <a href="#">links</a>, <code>code</code>, lists, tables, quotes…</p>
 *   </ui-prose>
 *
 * The content stays in the light DOM (so it remains your markup, selectable, searchable and
 * styleable). The rules live in one shared constructed stylesheet that is adopted by the document
 * or shadow root the element is in. Every rule is `ui-prose :where(...)`, the specificity of one
 * element selector: it beats a CSS reset such as `h1 { margin: 0 }` (adopted sheets come after the
 * page's), and any class or id rule of the app's own beats it. Attributes: `size` (sm | md | lg), `measure`
 * (keep lines to a readable width, about 68 characters).
 */
const PROSE_CSS = `
  ui-prose {
    --ui-prose-body: var(--ui-color-text, #0f172a);
    --ui-prose-heading: var(--ui-color-text-strong, var(--ui-color-text, #0f172a));
    --ui-prose-muted: var(--ui-color-muted, #526175);
    --ui-prose-link: var(--ui-color-accent-text, var(--ui-color-primary, #2563eb));
    --ui-prose-rule: var(--ui-color-border, color-mix(in srgb, currentColor 16%, transparent));
    --ui-prose-code-bg: var(--ui-color-fill, color-mix(in srgb, currentColor 7%, transparent));
    --ui-prose-pre-bg: var(--ui-color-surface-alt, color-mix(in srgb, currentColor 5%, transparent));
    --ui-prose-font-size: var(--ui-font-size-md, 0.9375rem);
    display: block;
    color: var(--ui-prose-body);
    font-family: var(--ui-font-family, "Inter", system-ui, -apple-system, "Segoe UI", sans-serif);
    font-size: var(--ui-prose-font-size);
    line-height: 1.7;
    overflow-wrap: break-word;
  }
  ui-prose[size="sm"] { --ui-prose-font-size: 0.875rem; line-height: 1.65; }
  ui-prose[size="lg"] { --ui-prose-font-size: 1.0625rem; line-height: 1.75; }
  ui-prose[measure] { max-inline-size: 68ch; }

  ui-prose > :where(:first-child) { margin-block-start: 0; }
  ui-prose > :where(:last-child) { margin-block-end: 0; }

  ui-prose :where(p, ul, ol, dl, blockquote, pre, table, figure, details) { margin-block: 0 1em; }

  ui-prose :where(h1, h2, h3, h4, h5, h6) {
    color: var(--ui-prose-heading);
    font-family: var(--ui-font-family-heading, inherit);
    font-weight: 650;
    letter-spacing: -0.015em;
    scroll-margin-block-start: 1rem;
  }
  ui-prose :where(h1) { font-size: 2.1em; line-height: 1.15; margin-block: 0 0.8em; letter-spacing: -0.025em; }
  ui-prose :where(h2) { font-size: 1.55em; line-height: 1.25; margin-block: 1.8em 0.6em; padding-block-end: 0.3em; border-block-end: 1px solid var(--ui-prose-rule); }
  ui-prose :where(h3) { font-size: 1.25em; line-height: 1.3; margin-block: 1.5em 0.5em; }
  ui-prose :where(h4) { font-size: 1.05em; line-height: 1.4; margin-block: 1.4em 0.4em; }
  ui-prose :where(h5, h6) { font-size: 1em; line-height: 1.4; margin-block: 1.2em 0.4em; }
  ui-prose :where(h6) { color: var(--ui-prose-muted); }

  ui-prose :where(a) {
    color: var(--ui-prose-link);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 0.18em;
  }
  ui-prose :where(a:hover) { text-decoration-thickness: 2px; }
  ui-prose :where(a:focus-visible) {
    outline: var(--ui-ring-width, 2px) solid var(--ui-ring-color, var(--ui-color-focus-ring, #2563eb));
    outline-offset: 2px;
    border-radius: 2px;
  }

  ui-prose :where(strong, b) { font-weight: 650; color: var(--ui-prose-heading); }
  ui-prose :where(mark) { background: color-mix(in srgb, var(--ui-color-warning, #f59e0b) 30%, transparent); color: inherit; border-radius: 2px; padding: 0 0.1em; }
  ui-prose :where(small) { font-size: 0.85em; color: var(--ui-prose-muted); }

  ui-prose :where(ul, ol) { padding-inline-start: 1.5em; }
  ui-prose :where(ul) { list-style: disc; }
  ui-prose :where(ol) { list-style: decimal; }
  ui-prose :where(li) { margin-block: 0.3em; }
  ui-prose :where(li > ul, li > ol) { margin-block: 0.3em; }
  ui-prose :where(li)::marker { color: var(--ui-prose-muted); }
  ui-prose :where(ul[data-type="checklist"], ul.contains-task-list) { list-style: none; padding-inline-start: 0.25em; }

  ui-prose :where(dt) { font-weight: 600; color: var(--ui-prose-heading); margin-block-start: 0.6em; }
  ui-prose :where(dd) { margin-inline-start: 1.5em; }

  ui-prose :where(blockquote) {
    margin-inline: 0;
    padding-inline-start: 1em;
    border-inline-start: 3px solid var(--ui-prose-rule);
    color: var(--ui-prose-muted);
    font-style: italic;
  }

  ui-prose :where(hr) {
    margin-block: 2em;
    border: 0;
    border-block-start: 1px solid var(--ui-prose-rule);
  }

  ui-prose :where(code, kbd, samp) {
    font-family: var(--ui-font-family-code, var(--ui-font-family-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace));
    font-size: 0.875em;
  }
  ui-prose :where(:not(pre) > code) {
    padding: 0.15em 0.35em;
    border-radius: 4px;
    background: var(--ui-prose-code-bg);
  }
  ui-prose :where(kbd) {
    padding: 0.1em 0.4em;
    border: 1px solid var(--ui-prose-rule);
    border-block-end-width: 2px;
    border-radius: 4px;
  }
  ui-prose :where(pre) {
    padding: 0.9em 1em;
    overflow-x: auto;
    border: 1px solid var(--ui-prose-rule);
    border-radius: var(--ui-radius, 6px);
    background: var(--ui-prose-pre-bg);
    line-height: 1.55;
    tab-size: 2;
  }
  ui-prose :where(pre code) { padding: 0; background: none; font-size: 0.875em; }

  ui-prose :where(table) {
    display: block;
    max-inline-size: 100%;
    overflow-x: auto;
    border-collapse: collapse;
    font-size: 0.925em;
  }
  ui-prose :where(th, td) {
    padding: 0.5em 0.75em;
    border: 1px solid var(--ui-prose-rule);
    text-align: start;
    vertical-align: top;
  }
  ui-prose :where(th) { font-weight: 600; color: var(--ui-prose-heading); background: var(--ui-prose-pre-bg); }
  ui-prose :where(caption) { caption-side: bottom; padding-block-start: 0.5em; color: var(--ui-prose-muted); font-size: 0.9em; }

  ui-prose :where(img, video, svg, canvas, iframe) { max-inline-size: 100%; block-size: auto; }
  ui-prose :where(img, video) { border-radius: var(--ui-radius, 6px); }
  ui-prose :where(figure) { margin-inline: 0; }
  ui-prose :where(figcaption) { margin-block-start: 0.5em; color: var(--ui-prose-muted); font-size: 0.875em; text-align: center; }

  ui-prose :where(details) { padding: 0.5em 0.75em; border: 1px solid var(--ui-prose-rule); border-radius: var(--ui-radius, 6px); }
  ui-prose :where(summary) { cursor: pointer; font-weight: 600; }

  @media (forced-colors: active) {
    ui-prose :where(a) { color: LinkText; }
    ui-prose :where(mark) { forced-color-adjust: none; background: Mark; color: MarkText; }
  }
`;

let sharedSheet: CSSStyleSheet | null | undefined;
const fallbackRoots = new WeakSet<Node>();

function proseSheet(): CSSStyleSheet | null {
  if (sharedSheet !== undefined) return sharedSheet;
  try {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(PROSE_CSS);
    sharedSheet = sheet;
  } catch {
    sharedSheet = null;
  }
  return sharedSheet;
}

/** Puts the prose rules into the document or shadow root `node` lives in, once per root. */
export function installProseStyles(node: Node): void {
  const root = node.getRootNode?.() as Document | ShadowRoot | Node | undefined;
  if (!root || !(root instanceof Document || (typeof ShadowRoot !== 'undefined' && root instanceof ShadowRoot))) return;
  const target = root as Document | ShadowRoot;
  const sheet = proseSheet();
  if (sheet && 'adoptedStyleSheets' in target) {
    const adopted = target.adoptedStyleSheets;
    if (!adopted.includes(sheet)) target.adoptedStyleSheets = [...adopted, sheet];
    return;
  }
  // No constructable stylesheets (old engines, some test environments): one <style> per root.
  if (fallbackRoots.has(target)) return;
  fallbackRoots.add(target);
  const doc = target instanceof Document ? target : target.ownerDocument;
  const styleEl = doc.createElement('style');
  styleEl.setAttribute('data-editora-prose', '');
  styleEl.textContent = PROSE_CSS;
  if (target instanceof Document) (target.head || target.documentElement).appendChild(styleEl);
  else target.appendChild(styleEl);
}

export class UIProse extends ElementBase {
  override connectedCallback(): void {
    installProseStyles(this);
    super.connectedCallback();
  }

  protected override render(): void {
    this.setContent('<style>:host{display:block}:host([hidden]){display:none}</style><slot></slot>');
  }
}

export { PROSE_CSS };

if (typeof customElements !== 'undefined' && !customElements.get('ui-prose')) {
  customElements.define('ui-prose', UIProse);
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-prose': UIProse;
  }
}
