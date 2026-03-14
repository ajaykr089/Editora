import { ElementBase } from '../ElementBase';

const style = `
  :host {
    --ui-splitter-size: 10px;
    --ui-splitter-hit-area: 10px;
    --ui-splitter-line: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 80%, transparent);
    --ui-splitter-accent: var(--ui-color-primary, #2563eb);
    --ui-splitter-handle-bg: color-mix(in srgb, var(--ui-splitter-line) 48%, transparent);
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

  .line {
    inline-size: 2px;
    block-size: 36px;
    border-radius: 999px;
    background: var(--ui-splitter-handle-bg);
    transition: background-color 140ms ease, transform 140ms ease;
  }

  :host([orientation="vertical"]) .line {
    inline-size: 36px;
    block-size: 2px;
  }

  :host(:hover) .line,
  :host(:focus-visible) .line,
  :host([data-dragging="true"]) .line {
    background: color-mix(in srgb, var(--ui-splitter-accent) 72%, white 28%);
    transform: scale(1.04);
  }

  :host([disabled]) {
    cursor: not-allowed;
    opacity: 0.5;
  }

  @media (prefers-reduced-motion: reduce) {
    .line {
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
