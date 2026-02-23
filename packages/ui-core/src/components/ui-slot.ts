import { ElementBase } from '../ElementBase';

const style = `
  :host {
    --ui-slot-bg: transparent;
    --ui-slot-text: inherit;
    --ui-slot-border-color: transparent;
    --ui-slot-border: 1px solid var(--ui-slot-border-color);
    --ui-slot-radius: 10px;
    --ui-slot-padding: 0;
    --ui-slot-gap: 6px;
    --ui-slot-accent: var(--ui-color-primary, #2563eb);
    --ui-slot-muted: var(--ui-color-muted, #64748b);
    color-scheme: light dark;
    display: inline-flex;
    min-inline-size: 0;
    box-sizing: border-box;
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: var(--ui-slot-text);
  }

  .shell {
    min-inline-size: 0;
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    gap: var(--ui-slot-gap);
    padding: var(--ui-slot-padding);
    border: var(--ui-slot-border);
    border-radius: var(--ui-slot-radius);
    background: var(--ui-slot-bg);
    color: inherit;
    transition: background-color 140ms ease, border-color 140ms ease, color 140ms ease;
  }

  .content,
  .fallback {
    min-inline-size: 0;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .fallback {
    color: var(--ui-slot-muted);
    font-size: 12px;
  }

  .shell[data-empty="true"] .content {
    display: none;
  }

  .shell[data-empty="false"] .fallback {
    display: none;
  }

  :host([align="center"]) .shell {
    justify-content: center;
  }

  :host([align="end"]) .shell {
    justify-content: flex-end;
  }

  :host([inline="false"]) {
    display: block;
  }

  :host([inline="false"]) .shell {
    display: flex;
    inline-size: 100%;
  }

  :host([size="sm"]) {
    --ui-slot-gap: 4px;
    --ui-slot-padding: 1px 6px;
    --ui-slot-radius: 8px;
  }

  :host([size="lg"]) {
    --ui-slot-gap: 8px;
    --ui-slot-padding: 5px 10px;
    --ui-slot-radius: 12px;
  }

  :host([variant="surface"]) {
    --ui-slot-bg: var(--ui-color-surface, #ffffff);
    --ui-slot-border-color: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent);
  }

  :host([variant="outline"]) {
    --ui-slot-bg: transparent;
    --ui-slot-border-color: color-mix(in srgb, var(--ui-slot-accent) 34%, var(--ui-color-border, #cbd5e1));
  }

  :host([variant="soft"]) {
    --ui-slot-bg: color-mix(in srgb, var(--ui-slot-accent) 10%, var(--ui-color-surface, #ffffff));
    --ui-slot-border-color: color-mix(in srgb, var(--ui-slot-accent) 24%, transparent);
  }

  :host([variant="chip"]) {
    --ui-slot-bg: color-mix(in srgb, var(--ui-slot-accent) 12%, var(--ui-color-surface, #ffffff));
    --ui-slot-border-color: color-mix(in srgb, var(--ui-slot-accent) 30%, transparent);
    --ui-slot-padding: 2px 9px;
    --ui-slot-radius: 999px;
    --ui-slot-text: color-mix(in srgb, var(--ui-slot-accent) 88%, #0f172a);
  }

  :host([variant="contrast"]) {
    --ui-slot-bg: #0f172a;
    --ui-slot-text: #e2e8f0;
    --ui-slot-muted: #93a4bd;
    --ui-slot-border-color: #334155;
  }

  :host([tone="success"]) {
    --ui-slot-accent: var(--ui-color-success, #16a34a);
  }

  :host([tone="warning"]) {
    --ui-slot-accent: var(--ui-color-warning, #d97706);
  }

  :host([tone="danger"]) {
    --ui-slot-accent: var(--ui-color-danger, #dc2626);
  }

  :host([headless]) .shell {
    display: contents;
    border: 0;
    background: transparent;
    padding: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .shell {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .shell {
      border-width: 2px;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-slot-bg: Canvas;
      --ui-slot-text: CanvasText;
      --ui-slot-muted: GrayText;
      --ui-slot-border-color: CanvasText;
    }
  }
`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export class UISlot extends ElementBase {
  static get observedAttributes() {
    return [
      'name',
      'headless',
      'inline',
      'align',
      'size',
      'variant',
      'tone',
      'fallback',
      'required'
    ];
  }

  private _slotEl: HTMLSlotElement | null = null;
  private _shellEl: HTMLElement | null = null;
  private _lastEmpty = true;

  constructor() {
    super();
    this._onSlotChange = this._onSlotChange.bind(this);
  }

  override disconnectedCallback(): void {
    if (this._slotEl) this._slotEl.removeEventListener('slotchange', this._onSlotChange);
    this._slotEl = null;
    this._shellEl = null;
    super.disconnectedCallback();
  }

  private _assignedCount(): number {
    if (!this._slotEl) return 0;
    const assigned = this._slotEl.assignedNodes({ flatten: true });
    return assigned.filter((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) return true;
      if (node.nodeType === Node.TEXT_NODE) return !!node.textContent?.trim();
      return false;
    }).length;
  }

  private _syncState(): void {
    const count = this._assignedCount();
    const empty = count === 0;

    if (this._shellEl) this._shellEl.setAttribute('data-empty', empty ? 'true' : 'false');

    this.dispatchEvent(
      new CustomEvent('slotchange', {
        detail: {
          name: this.getAttribute('name') || '',
          count,
          empty
        },
        bubbles: true,
        composed: true
      })
    );

    if (empty && this.hasAttribute('required') && !this._lastEmpty) {
      this.dispatchEvent(new CustomEvent('missing', { bubbles: true, composed: true }));
    }

    if (!empty && this._lastEmpty) {
      this.dispatchEvent(new CustomEvent('resolved', { bubbles: true, composed: true }));
    }

    this._lastEmpty = empty;
  }

  private _onSlotChange(): void {
    this._syncState();
  }

  protected override render(): void {
    const name = (this.getAttribute('name') || '').trim();
    const fallback = this.getAttribute('fallback') || '';
    const slotTag = name ? `<slot name="${escapeHtml(name)}"></slot>` : '<slot></slot>';

    this.setContent(`
      <style>${style}</style>
      <span class="shell" part="shell" data-empty="true">
        <span class="content" part="content">${slotTag}</span>
        <span class="fallback" part="fallback"><slot name="fallback">${escapeHtml(fallback)}</slot></span>
      </span>
    `);

    this._shellEl = this.root.querySelector('.shell') as HTMLElement | null;

    if (this._slotEl) this._slotEl.removeEventListener('slotchange', this._onSlotChange);
    this._slotEl = this.root.querySelector('slot:not([name="fallback"])') as HTMLSlotElement | null;
    if (this._slotEl) this._slotEl.addEventListener('slotchange', this._onSlotChange);

    this._syncState();
  }

  protected override shouldRenderOnAttributeChange(
    _name: string,
    _oldValue: string | null,
    _newValue: string | null
  ): boolean {
    return true;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-slot')) {
  customElements.define('ui-slot', UISlot);
}
