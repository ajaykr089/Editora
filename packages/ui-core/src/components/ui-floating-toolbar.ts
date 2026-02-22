import { ElementBase } from '../ElementBase';

const style = `
  :host {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1160;
    pointer-events: none;
    display: none;
    color-scheme: light dark;
    --ui-floating-toolbar-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 94%, transparent);
    --ui-floating-toolbar-border: 1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 74%, transparent);
    --ui-floating-toolbar-radius: 12px;
    --ui-floating-toolbar-shadow:
      0 2px 8px rgba(15, 23, 42, 0.11),
      0 22px 50px rgba(15, 23, 42, 0.18);
    --ui-floating-toolbar-text: var(--ui-color-text, #0f172a);
  }

  :host([open]) {
    display: block;
  }

  .panel {
    box-sizing: border-box;
    pointer-events: auto;
    transform: translate3d(-50%, calc(-100% - 8px), 0) scale(0.98);
    opacity: 0;
    border-radius: var(--ui-floating-toolbar-radius);
    border: var(--ui-floating-toolbar-border);
    background: var(--ui-floating-toolbar-bg);
    color: var(--ui-floating-toolbar-text);
    box-shadow: var(--ui-floating-toolbar-shadow);
    backdrop-filter: saturate(1.08) blur(10px);
    padding: 6px;
    transition: opacity 130ms ease, transform 130ms ease;
  }

  :host([open]) .panel {
    transform: translate3d(-50%, calc(-100% - 8px), 0) scale(1);
    opacity: 1;
  }

  .panel[data-side="bottom"] {
    transform: translate3d(-50%, 8px, 0) scale(0.98);
  }

  :host([open]) .panel[data-side="bottom"] {
    transform: translate3d(-50%, 8px, 0) scale(1);
  }

  :host([headless]) .panel {
    display: none !important;
  }

  @media (prefers-contrast: more) {
    .panel {
      border-width: 2px;
      box-shadow: none;
      backdrop-filter: none;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-floating-toolbar-bg: Canvas;
      --ui-floating-toolbar-border: 1px solid CanvasText;
      --ui-floating-toolbar-shadow: none;
      --ui-floating-toolbar-text: CanvasText;
    }

    .panel {
      forced-color-adjust: none;
      backdrop-filter: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .panel {
      transition: none !important;
    }
  }
`;

export class UIFloatingToolbar extends ElementBase {
  static get observedAttributes() {
    return ['open', 'anchor-id', 'headless'];
  }

  private _anchor: HTMLElement | null = null;
  private _raf: number | null = null;
  private _onWindowChangeBound = this._onWindowChange.bind(this);
  private _onDocumentPointerDownBound = this._onDocumentPointerDown.bind(this);

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('scroll', this._onWindowChangeBound, true);
    window.addEventListener('resize', this._onWindowChangeBound);
    document.addEventListener('pointerdown', this._onDocumentPointerDownBound, true);
    this._syncAnchorFromAttribute();
    this._schedulePosition();
  }

  disconnectedCallback() {
    window.removeEventListener('scroll', this._onWindowChangeBound, true);
    window.removeEventListener('resize', this._onWindowChangeBound);
    document.removeEventListener('pointerdown', this._onDocumentPointerDownBound, true);
    if (this._raf != null) {
      cancelAnimationFrame(this._raf);
      this._raf = null;
    }
    super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'anchor-id') this._syncAnchorFromAttribute();
    if (name === 'open' && oldValue !== newValue) {
      this.dispatchEvent(new CustomEvent(newValue != null ? 'open' : 'close', { bubbles: true }));
    }
    this._schedulePosition();
  }

  showForAnchorId(anchorId: string) {
    const anchor = document.getElementById(anchorId);
    if (!anchor) return;
    this._anchor = anchor;
    this.setAttribute('anchor-id', anchorId);
    this.setAttribute('open', '');
    this._schedulePosition();
  }

  hide() {
    this.removeAttribute('open');
  }

  private _syncAnchorFromAttribute() {
    const anchorId = this.getAttribute('anchor-id');
    if (!anchorId) {
      this._anchor = null;
      return;
    }
    this._anchor = document.getElementById(anchorId);
  }

  private _schedulePosition() {
    if (this._raf != null) cancelAnimationFrame(this._raf);
    this._raf = requestAnimationFrame(() => {
      this._raf = null;
      this._position();
    });
  }

  private _position() {
    if (!this.hasAttribute('open')) return;
    if (!this._anchor) return;

    const anchorRect = this._anchor.getBoundingClientRect();
    const panel = this.root.querySelector('.panel') as HTMLElement | null;
    if (!panel) return;

    const panelRect = panel.getBoundingClientRect();
    const gap = 8;
    let x = anchorRect.left + anchorRect.width / 2;
    let y = anchorRect.top;

    if (y - panelRect.height < 8) {
      y = anchorRect.bottom + gap;
      panel.setAttribute('data-side', 'bottom');
    } else {
      panel.setAttribute('data-side', 'top');
    }

    const minX = 12 + panelRect.width / 2;
    const maxX = window.innerWidth - 12 - panelRect.width / 2;
    x = Math.max(minX, Math.min(x, maxX));

    this.style.left = `${Math.round(x)}px`;
    this.style.top = `${Math.round(y)}px`;
  }

  private _onWindowChange() {
    if (!this.hasAttribute('open')) return;
    this._schedulePosition();
  }

  private _onDocumentPointerDown(event: PointerEvent) {
    if (!this.hasAttribute('open')) return;
    const path = event.composedPath();
    if (path.includes(this)) return;
    if (this._anchor && path.includes(this._anchor)) return;
    this.hide();
  }

  protected render() {
    this.setContent(`
      <style>${style}</style>
      <div class="panel" part="panel" role="toolbar" aria-label="Floating toolbar">
        <slot name="toolbar"></slot>
        <slot></slot>
      </div>
    `);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-floating-toolbar')) {
  customElements.define('ui-floating-toolbar', UIFloatingToolbar);
}
