import { ElementBase } from '../ElementBase';
import { escapeHtml } from '../primitives/escape-html';

/**
 * A list of label and value pairs: the details panel of a record, an order summary, metadata.
 *
 *   <ui-data-list>
 *     <dl>
 *       <div><dt>Status</dt><dd>Active</dd></div>
 *       <div><dt>ID</dt><dd><code>u_2J89JSA4GJ</code></dd></div>
 *     </dl>
 *   </ui-data-list>
 *
 *   <ui-data-list items='[{"label":"Status","value":"Active"}]'></ui-data-list>
 *
 * Markup mode keeps a native description list in your markup (screen readers announce it as a
 * list of terms and their descriptions, and values can hold links, badges, buttons); the styles
 * come from one shared stylesheet adopted by the document or shadow root, every rule scoped to
 * this element. `items` (JSON: label, value) renders the same structure itself, for plain text.
 *
 * Attributes: `orientation` (horizontal: label beside value, default | vertical: label above),
 * `size` (sm | md | lg), `label-width` (a CSS length for the label column, default 10rem),
 * `divided` (a rule between rows), `align` (start | center | baseline: the label against a tall
 * value), `items`. On narrow screens (under 30rem wide) horizontal lists stack.
 */
const LIST_CSS = `
  ui-data-list {
    --ui-data-list-label-width: 10rem;
    --ui-data-list-gap: 12px;
    --ui-data-list-column-gap: 16px;
    --ui-data-list-label: var(--ui-color-muted, #526175);
    --ui-data-list-value: var(--ui-color-text, #0f172a);
    --ui-data-list-rule: var(--ui-color-border, color-mix(in srgb, currentColor 14%, transparent));
    --ui-data-list-font-size: var(--ui-font-size-md, 0.875rem);
    display: block;
    container-type: inline-size;
    font-family: var(--ui-font-family, "Inter", system-ui, -apple-system, "Segoe UI", sans-serif);
    font-size: var(--ui-data-list-font-size);
    line-height: 1.5;
  }
  ui-data-list[size="sm"] { --ui-data-list-font-size: var(--ui-font-size-sm, 0.8125rem); --ui-data-list-gap: 8px; }
  ui-data-list[size="lg"] { --ui-data-list-font-size: var(--ui-font-size-lg, 1rem); --ui-data-list-gap: 16px; }

  ui-data-list :where(dl) {
    display: grid;
    gap: var(--ui-data-list-gap);
    margin: 0;
  }
  ui-data-list :where(dl > div) {
    display: grid;
    grid-template-columns: minmax(0, var(--ui-data-list-label-width)) minmax(0, 1fr);
    column-gap: var(--ui-data-list-column-gap);
    align-items: baseline;
    min-inline-size: 0;
  }
  ui-data-list[align="start"] :where(dl > div) { align-items: start; }
  ui-data-list[align="center"] :where(dl > div) { align-items: center; }

  ui-data-list :where(dt) {
    margin: 0;
    color: var(--ui-data-list-label);
    font-weight: 500;
    overflow-wrap: anywhere;
  }
  ui-data-list :where(dd) {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
    min-inline-size: 0;
    margin: 0;
    color: var(--ui-data-list-value);
    overflow-wrap: anywhere;
  }

  ui-data-list[divided] :where(dl) { gap: 0; }
  ui-data-list[divided] :where(dl > div) {
    padding-block: var(--ui-data-list-gap);
    border-block-end: 1px solid var(--ui-data-list-rule);
  }
  ui-data-list[divided] :where(dl > div:last-child) { border-block-end: 0; }

  ui-data-list[orientation="vertical"] :where(dl > div) {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 2px;
  }

  @container (max-width: 30rem) {
    ui-data-list:not([orientation]) :where(dl > div),
    ui-data-list[orientation="horizontal"] :where(dl > div) {
      grid-template-columns: minmax(0, 1fr);
      row-gap: 2px;
    }
  }

  @media (forced-colors: active) {
    ui-data-list[divided] :where(dl > div) { border-color: CanvasText; }
  }
`;

let sharedSheet: CSSStyleSheet | null | undefined;
const fallbackRoots = new WeakSet<Node>();

/** Puts the data-list rules into the document or shadow root `node` lives in, once per root. */
export function installDataListStyles(node: Node): void {
  const root = node.getRootNode?.() as Document | ShadowRoot | Node | undefined;
  if (!root || !(root instanceof Document || (typeof ShadowRoot !== 'undefined' && root instanceof ShadowRoot))) return;
  const target = root as Document | ShadowRoot;
  if (sharedSheet === undefined) {
    try {
      sharedSheet = new CSSStyleSheet();
      sharedSheet.replaceSync(LIST_CSS);
    } catch {
      sharedSheet = null;
    }
  }
  if (sharedSheet && 'adoptedStyleSheets' in target) {
    if (!target.adoptedStyleSheets.includes(sharedSheet)) target.adoptedStyleSheets = [...target.adoptedStyleSheets, sharedSheet];
    return;
  }
  if (fallbackRoots.has(target)) return;
  fallbackRoots.add(target);
  const doc = target instanceof Document ? target : target.ownerDocument;
  const styleEl = doc.createElement('style');
  styleEl.setAttribute('data-editora-data-list', '');
  styleEl.textContent = LIST_CSS;
  if (target instanceof Document) (target.head || target.documentElement).appendChild(styleEl);
  else target.appendChild(styleEl);
}

export type DataListItem = { label: string; value: string };

export function parseDataListItems(value: string | null): DataListItem[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item === 'object')
      .map((item) => ({ label: String(item.label ?? ''), value: String(item.value ?? '') }));
  } catch {
    return [];
  }
}

// The `items` mode renders the list in the shadow root, styled by the same rules (with :host for
// the element and the same custom properties, so a theme sets both modes at once).
const SHADOW_CSS = LIST_CSS
  .replace(/ui-data-list\[([^\]]+)\]/g, ':host([$1])')
  .replace(/ui-data-list:not\(\[orientation\]\)/g, ':host(:not([orientation]))')
  .replace(/(^|\n)(\s*)ui-data-list(?=[\s{,])/g, '$1$2:host')
  .replace(/:host :where\(/g, ':where(')
  .replace(/\) :where\(/g, ') :where(');

export class UIDataList extends ElementBase {
  static get observedAttributes() {
    return ['items', 'label-width'];
  }

  override connectedCallback(): void {
    installDataListStyles(this);
    this.syncLabelWidth();
    super.connectedCallback();
  }

  protected override shouldRenderOnAttributeChange(name: string): boolean {
    if (name === 'label-width') {
      this.syncLabelWidth();
      return false;
    }
    return true;
  }

  private syncLabelWidth(): void {
    const width = (this.getAttribute('label-width') || '').trim();
    if (width) this.style.setProperty('--ui-data-list-label-width', /^\d+(\.\d+)?$/.test(width) ? `${width}px` : width);
    else this.style.removeProperty('--ui-data-list-label-width');
  }

  protected override render(): void {
    const items = parseDataListItems(this.getAttribute('items'));
    if (!items.length) {
      this.setContent('<style>:host{display:block}:host([hidden]){display:none}</style><slot></slot>');
      return;
    }
    const rows = items
      .map((item) => `<div part="item"><dt part="label">${escapeHtml(item.label)}</dt><dd part="value">${escapeHtml(item.value)}</dd></div>`)
      .join('');
    this.setContent(`<style>${SHADOW_CSS}:host([hidden]){display:none}</style><dl part="list">${rows}</dl>`);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-data-list')) {
  customElements.define('ui-data-list', UIDataList);
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-data-list': UIDataList;
  }
}
