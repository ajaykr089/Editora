import { ElementBase } from '../ElementBase';

/**
 * An inline line in a conversation that is not a message: a status update ("Searching the
 * web…"), a system note ("Ada joined"), a date divider, a checkpoint.
 *
 *   <ui-marker live shimmer>Thinking…</ui-marker>
 *   <ui-marker variant="separator">Today</ui-marker>
 *   <ui-marker variant="border"><svg slot="icon" …></svg>Conversation renamed</ui-marker>
 *
 * Presentational by default. `live` makes it a status, so a progress update is announced (set it
 * on markers whose text changes while a reply streams). Do not give a labelled separator
 * role="separator": that role is named from aria-label only, so its visible text would not be
 * read. Put a real link or button inside for an interactive marker. Variants: default, border
 * (a rule under the row), separator (centred text between two rules). `shimmer` animates the text
 * (off under reduced motion). The `icon` slot is decorative.
 */
const style = `
  :host {
    --ui-marker-color: var(--ui-color-muted, #526175);
    --ui-marker-rule: var(--ui-color-border, color-mix(in srgb, var(--ui-color-text, #0f172a) 14%, transparent));
    color-scheme: light dark;
    display: block;
    min-inline-size: 0;
    color: var(--ui-marker-color);
    font-family: var(--ui-font-family, "Inter", system-ui, -apple-system, "Segoe UI", sans-serif);
    font-size: var(--ui-font-size-sm, 0.8125rem);
    line-height: 1.45;
  }
  :host([hidden]) { display: none; }

  .marker {
    display: flex;
    align-items: center;
    gap: 8px;
    min-inline-size: 0;
    padding-block: 4px;
  }
  :host([variant="border"]) .marker {
    padding-block: 8px;
    border-block-end: 1px solid var(--ui-marker-rule);
  }
  :host([variant="separator"]) .marker { justify-content: center; }
  :host([variant="separator"]) .marker::before,
  :host([variant="separator"]) .marker::after {
    content: "";
    flex: 1 1 0;
    block-size: 1px;
    background: var(--ui-marker-rule);
  }
  :host([variant="separator"]) .content { flex: none; font-size: 0.75rem; font-weight: 500; }

  .icon { display: inline-flex; flex: none; }
  .icon[data-empty] { display: none; }
  ::slotted([slot="icon"]) { inline-size: 14px; block-size: 14px; }

  .content { min-inline-size: 0; overflow-wrap: anywhere; }

  :host([shimmer]) .content {
    background: linear-gradient(90deg, var(--ui-marker-color) 0%, var(--ui-marker-color) 40%, color-mix(in srgb, var(--ui-marker-color) 35%, transparent) 50%, var(--ui-marker-color) 60%, var(--ui-marker-color) 100%);
    background-size: 220% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: ui-marker-shimmer 2.2s linear infinite;
  }
  @keyframes ui-marker-shimmer {
    from { background-position: 100% 0; }
    to { background-position: -120% 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    :host([shimmer]) .content { animation: none; background: none; -webkit-text-fill-color: currentColor; }
  }
  @media (forced-colors: active) {
    :host([shimmer]) .content { background: none; -webkit-text-fill-color: CanvasText; animation: none; }
    :host([variant="separator"]) .marker::before,
    :host([variant="separator"]) .marker::after { background: CanvasText; }
  }
`;

export class UIMarker extends ElementBase {
  static get observedAttributes() {
    return ['live'];
  }

  constructor() {
    super();
    this.root.addEventListener('slotchange', () => this.syncIcon());
  }

  override connectedCallback(): void {
    this.syncRole();
    super.connectedCallback();
  }

  protected override shouldRenderOnAttributeChange(): boolean {
    this.syncRole();
    return false;
  }

  private syncRole(): void {
    if (this.hasAttribute('live')) {
      if (!this.hasAttribute('role')) {
        this.setAttribute('role', 'status');
        this.setAttribute('data-auto-role', '');
      }
    } else if (this.hasAttribute('data-auto-role')) {
      this.removeAttribute('role');
      this.removeAttribute('data-auto-role');
    }
  }

  private syncIcon(): void {
    const slot = this.root.querySelector('slot[name="icon"]') as HTMLSlotElement | null;
    this.root.querySelector('.icon')?.toggleAttribute('data-empty', !slot || slot.assignedNodes().length === 0);
    for (const node of Array.from(this.querySelectorAll(':scope > [slot="icon"]'))) node.setAttribute('aria-hidden', 'true');
  }

  protected override render(): void {
    this.setContent(`
      <style>${style}</style>
      <div class="marker" part="marker">
        <span class="icon" part="icon" aria-hidden="true" data-empty><slot name="icon"></slot></span>
        <span class="content" part="content"><slot></slot></span>
      </div>
    `);
    this.syncIcon();
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-marker')) {
  customElements.define('ui-marker', UIMarker);
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-marker': UIMarker;
  }
}
