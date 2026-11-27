import { ElementBase } from '../ElementBase';
import { escapeHtml } from '../primitives/escape-html';

/**
 * One step of an agent's activity: a thought, a tool call, a search, a plan step, a subagent.
 *
 *   <ui-trace-item label="Read package.json" description="42 lines"></ui-trace-item>
 *   <ui-trace-item label="Running the test suite" status="running"></ui-trace-item>
 *   <ui-trace-item label="Searched the web" description="6 sources">…details, nested items…</ui-trace-item>
 *   <ui-trace-item label="Opened the pull request" href="https://…" target="_blank"></ui-trace-item>
 *
 * With content in the default slot the row is a button that expands it (aria-expanded); with
 * `href` it is a link; otherwise it is plain text and no tab stop. Titles should say what
 * happened as a sentence ("Failed to run pnpm build"); the status is also spoken (", in
 * progress", ", not started", ", failed"), not only shown by colour and the shimmer, which stops
 * under reduced motion.
 *
 * Attributes: `label` (or the `title` slot), `description` (or the `description` slot), `status`
 * (running | pending | error; unset = done), `open`, `href`, `target`. Slot `icon` (decorative).
 * Events: `toggle` (detail: { open }).
 */
const style = `
  :host {
    --ui-trace-color: var(--ui-color-text-secondary, var(--ui-color-text, #334155));
    --ui-trace-muted: var(--ui-color-muted, #526175);
    color-scheme: light dark;
    display: block;
    min-inline-size: 0;
    font-family: var(--ui-font-family, "Inter", system-ui, -apple-system, "Segoe UI", sans-serif);
    font-size: var(--ui-font-size-sm, 0.8125rem);
    line-height: 1.45;
  }
  :host([hidden]) { display: none; }

  .line {
    display: flex;
    align-items: center;
    gap: 8px;
    inline-size: 100%;
    box-sizing: border-box;
    min-block-size: 28px;
    margin: 0;
    padding: 3px 6px;
    border: 0;
    border-radius: var(--ui-control-radius-1, 6px);
    background: transparent;
    color: var(--ui-trace-color);
    font: inherit;
    text-align: start;
    text-decoration: none;
  }
  button.line, a.line { cursor: pointer; }
  button.line:hover, a.line:hover { background: var(--ui-color-fill-hover, color-mix(in srgb, var(--ui-color-text, #0f172a) 6%, transparent)); color: var(--ui-color-text, #0f172a); }
  button.line:focus-visible, a.line:focus-visible {
    outline: var(--ui-ring-width, 2px) solid var(--ui-ring-color, var(--ui-color-focus-ring, #2563eb));
    outline-offset: -2px;
  }

  .icon { flex: none; display: inline-flex; color: var(--ui-trace-muted); }
  .icon[data-empty] { display: none; }
  ::slotted([slot="icon"]) { inline-size: 15px; block-size: 15px; }

  .title {
    flex: 0 1 auto;
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .description {
    flex: none;
    color: var(--ui-trace-muted);
    font-size: 0.75rem;
    font-variant-numeric: tabular-nums;
  }
  .description[data-empty] { display: none; }

  .chevron, .external {
    flex: none;
    inline-size: 14px;
    block-size: 14px;
    margin-inline-start: auto;
    color: var(--ui-trace-muted);
    transition: transform 160ms ease;
  }
  :host([open]) .chevron { transform: rotate(90deg); }
  :host(:dir(rtl)) .chevron { transform: scaleX(-1); }
  :host(:dir(rtl)[open]) .chevron { transform: rotate(90deg); }

  :host([status="pending"]) .line { color: var(--ui-trace-muted); }
  :host([status="pending"]) .title { opacity: 0.8; }
  :host([status="error"]) .line { color: var(--ui-color-danger-text, var(--ui-color-danger, #b91c1c)); }
  :host([status="error"]) .icon { color: inherit; }

  :host([status="running"]) .title {
    background: linear-gradient(90deg, currentColor 0%, currentColor 40%, color-mix(in srgb, currentColor 30%, transparent) 50%, currentColor 60%, currentColor 100%);
    background-size: 220% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: ui-trace-shimmer 2s linear infinite;
  }
  @keyframes ui-trace-shimmer { from { background-position: 100% 0; } to { background-position: -120% 0; } }

  .details {
    margin-inline-start: 13px;
    padding: 2px 0 6px 14px;
    border-inline-start: 1px solid var(--ui-color-border, color-mix(in srgb, var(--ui-color-text, #0f172a) 14%, transparent));
    color: var(--ui-trace-muted);
  }
  .details[hidden] { display: none; }

  .sr {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    margin: -1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  @media (prefers-reduced-motion: reduce) {
    :host([status="running"]) .title { animation: none; background: none; -webkit-text-fill-color: currentColor; font-style: italic; }
    .chevron { transition: none; }
  }
  @media (forced-colors: active) {
    :host([status="running"]) .title { background: none; -webkit-text-fill-color: CanvasText; animation: none; }
  }
`;

const CHEVRON = '<svg class="chevron" part="chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 4 4 4-4 4"/></svg>';
const EXTERNAL = '<svg class="external" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 3h4v4M13 3 7.5 8.5M11 9.5V13H3V5h3.5"/></svg>';
const STATUS_TEXT: Record<string, string> = { running: ', in progress', pending: ', not started', error: ', failed' };

let uid = 0;

export class UITraceItem extends ElementBase {
  static get observedAttributes() {
    return ['label', 'description', 'status', 'open', 'href', 'target'];
  }

  private readonly detailsId = `ui-trace-details-${(uid += 1)}`;
  private observer: MutationObserver | null = null;

  constructor() {
    super();
    this.root.addEventListener('slotchange', () => this.syncSlots());
    this.root.addEventListener('click', (event) => {
      if (!(event.target as Element | null)?.closest?.('button.line')) return;
      this.open = !this.open;
      this.dispatchEvent(new CustomEvent('toggle', { detail: { open: this.open }, bubbles: true }));
    });
  }

  get open(): boolean {
    return this.hasAttribute('open');
  }

  set open(value: boolean) {
    this.toggleAttribute('open', !!value);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    // Details added or removed later switch the row between text and an expandable button.
    if (!this.observer && typeof MutationObserver !== 'undefined') {
      this.observer = new MutationObserver(() => {
        if (this.hasDetails() !== !!this.root.querySelector('button.line')) this.requestRender();
      });
      this.observer.observe(this, { childList: true });
    }
  }

  override disconnectedCallback(): void {
    this.observer?.disconnect();
    this.observer = null;
    super.disconnectedCallback();
  }

  protected override shouldRenderOnAttributeChange(name: string): boolean {
    if (name === 'open') {
      const button = this.root.querySelector('button.line');
      const details = this.root.querySelector('.details') as HTMLElement | null;
      button?.setAttribute('aria-expanded', String(this.open));
      if (details) details.hidden = !this.open;
      return false;
    }
    return true;
  }

  private hasDetails(): boolean {
    return Array.from(this.childNodes).some((node) => {
      if (node.nodeType === 3) return !!(node.textContent || '').trim();
      return node.nodeType === 1 && !(node as Element).hasAttribute('slot');
    });
  }

  private syncSlots(): void {
    const icon = this.root.querySelector('slot[name="icon"]') as HTMLSlotElement | null;
    this.root.querySelector('.icon')?.toggleAttribute('data-empty', !icon || icon.assignedNodes().length === 0);
    for (const node of Array.from(this.querySelectorAll(':scope > [slot="icon"]'))) node.setAttribute('aria-hidden', 'true');
    const description = this.root.querySelector('slot[name="description"]') as HTMLSlotElement | null;
    const hasDescription = !!this.getAttribute('description') || (!!description && description.assignedNodes().length > 0);
    this.root.querySelector('.description')?.toggleAttribute('data-empty', !hasDescription);
  }

  protected override render(): void {
    const label = this.getAttribute('label') || '';
    const description = this.getAttribute('description') || '';
    const status = this.getAttribute('status') || '';
    const href = this.getAttribute('href');
    const target = this.getAttribute('target');
    const expandable = !href && this.hasDetails();
    const newTab = target === '_blank';

    const parts = `
      <span class="icon" part="icon" aria-hidden="true" data-empty><slot name="icon"></slot></span>
      <span class="title" part="title"><slot name="title">${escapeHtml(label)}</slot></span>
      <span class="sr">${escapeHtml(STATUS_TEXT[status] || '')}${newTab ? ' (opens in a new tab)' : ''}</span>
      <span class="description" part="description"><slot name="description">${escapeHtml(description)}</slot></span>
    `;
    let line: string;
    if (href) {
      line = `<a class="line" part="line" href="${escapeHtml(href)}"${target ? ` target="${escapeHtml(target)}"` : ''}${newTab ? ' rel="noopener noreferrer"' : ''}>${parts}${newTab ? EXTERNAL : ''}</a>`;
    } else if (expandable) {
      line = `<button type="button" class="line" part="line" aria-expanded="${this.open}" aria-controls="${this.detailsId}">${parts}${CHEVRON}</button>`;
    } else {
      line = `<span class="line" part="line">${parts}</span>`;
    }
    const details = expandable
      ? `<div class="details" part="details" id="${this.detailsId}"${this.open ? '' : ' hidden'}><slot></slot></div>`
      : '<slot hidden></slot>';
    this.setContent(`<style>${style}</style>${line}${details}`);
    this.syncSlots();
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-trace-item')) {
  customElements.define('ui-trace-item', UITraceItem);
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-trace-item': UITraceItem;
  }
}
