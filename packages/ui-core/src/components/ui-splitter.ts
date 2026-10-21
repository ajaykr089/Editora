import { ElementBase } from '../ElementBase';

const style = `
  :host {
    --ui-splitter-size: 10px;
    --ui-splitter-hit-area: 10px;
    --ui-splitter-line: var(--ui-color-line-subtle, color-mix(in srgb, var(--ui-color-border, #cbd5e1) 80%, transparent));
    --ui-splitter-accent: var(--ui-color-accent-solid, var(--ui-color-primary, #2563eb));
    --ui-splitter-handle-bg: var(--ui-color-line-strong, color-mix(in srgb, var(--ui-color-border, #cbd5e1) 90%, #64748b));
    display: block;
    position: relative;
    flex: 0 0 auto;
    inline-size: var(--ui-splitter-size);
    min-inline-size: var(--ui-splitter-size);
    block-size: 100%;
    min-block-size: 100%;
    cursor: col-resize;
    touch-action: none;
    outline: none;
  }

  :host([orientation="vertical"]) {
    inline-size: 100%;
    min-inline-size: 100%;
    block-size: var(--ui-splitter-size);
    min-block-size: var(--ui-splitter-size);
    cursor: row-resize;
  }

  .splitter {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
  }

  /* The divider: a hairline across the whole gap, so the edge between two panels is always visible. */
  .splitter::before {
    content: "";
    position: absolute;
    inset-block: 0;
    inset-inline: calc(50% - 0.5px) auto;
    inline-size: 1px;
    background: var(--ui-splitter-line);
    transition: background-color 140ms ease, inline-size 140ms ease, inset-inline-start 140ms ease;
  }

  :host([orientation="vertical"]) .splitter::before {
    inset-block: calc(50% - 0.5px) auto;
    inset-inline: 0;
    inline-size: auto;
    block-size: 1px;
  }

  /* The grip: a short pill in the middle that says "drag me". */
  .line {
    position: relative;
    inline-size: 4px;
    block-size: 28px;
    border-radius: 999px;
    background: var(--ui-splitter-handle-bg);
    transition: background-color 140ms ease;
  }

  :host([orientation="vertical"]) .line {
    inline-size: 28px;
    block-size: 4px;
  }

  :host(:hover) .splitter::before,
  :host(:focus-visible) .splitter::before,
  :host([data-dragging="true"]) .splitter::before {
    background: var(--ui-splitter-accent);
    inline-size: 2px;
    inset-inline-start: calc(50% - 1px);
  }

  :host([orientation="vertical"]:hover) .splitter::before,
  :host([orientation="vertical"]:focus-visible) .splitter::before,
  :host([orientation="vertical"][data-dragging="true"]) .splitter::before {
    inline-size: auto;
    block-size: 2px;
    inset-inline-start: 0;
    inset-block-start: calc(50% - 1px);
  }

  :host(:hover) .line,
  :host(:focus-visible) .line,
  :host([data-dragging="true"]) .line {
    background: var(--ui-splitter-accent);
  }

  :host(:focus-visible) .line {
    outline: var(--ui-ring-width, 2px) solid var(--ui-ring-color, var(--ui-splitter-accent));
    outline-offset: 2px;
  }

  :host([disabled]) {
    cursor: not-allowed;
    opacity: 0.5;
  }

  @media (prefers-reduced-motion: reduce) {
    .line,
    .splitter::before {
      transition: none !important;
    }
  }
`;

export class UISplitter extends ElementBase {
  static get observedAttributes() {
    return ['orientation', 'disabled', 'aria-label'];
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this._syncAccessibility();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (name === 'orientation' || name === 'disabled' || name === 'aria-label') {
      this._syncAccessibility();
      return;
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  override focus(options?: FocusOptions): void {
    super.focus(options);
  }

  private _syncAccessibility(): void {
    const disabled = this.hasAttribute('disabled');
    this.setAttribute('role', 'separator');
    this.setAttribute('tabindex', disabled ? '-1' : '0');
    this.setAttribute('aria-orientation', this.getAttribute('orientation') === 'vertical' ? 'vertical' : 'horizontal');
    this.setAttribute('aria-label', this.getAttribute('aria-label') || 'Resize panels');
  }

  protected override shouldRenderOnAttributeChange(): boolean {
    return false;
  }

  protected override render(): void {
    this.setContent(`
      <style>${style}</style>
      <div class="splitter" part="splitter">
        <div class="line" part="line"></div>
      </div>
    `);
    this._syncAccessibility();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-splitter': UISplitter;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-splitter')) {
  customElements.define('ui-splitter', UISplitter);
}
