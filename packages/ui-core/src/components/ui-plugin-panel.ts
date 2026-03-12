import { ElementBase } from '../ElementBase';

const style = `
  :host {
    position: fixed;
    display: block;
    z-index: var(--ui-plugin-panel-z, 1300);
    pointer-events: none;
    color-scheme: light dark;
    --ui-plugin-panel-width: min(340px, 92vw);
    --ui-plugin-panel-height: min(280px, 44vh);
    --ui-plugin-panel-bg: var(--base-panel-bg, var(--color-panel, color-mix(in srgb, var(--ui-color-surface, #ffffff) 94%, transparent)));
    --ui-plugin-panel-border: var(--base-panel-border, 1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent));
    --ui-plugin-panel-radius: var(--base-panel-radius, var(--ui-radius, 4px));
    --ui-plugin-panel-shadow: var(--base-panel-shadow, var(--shadow-4, none));
    --ui-plugin-panel-color: var(--ui-color-text, #0f172a);
  }

  .panel {
    pointer-events: auto;
    position: fixed;
    box-sizing: border-box;
    background: var(--ui-plugin-panel-bg);
    border: var(--ui-plugin-panel-border);
    border-radius: var(--ui-plugin-panel-radius);
    box-shadow: var(--ui-plugin-panel-shadow);
    color: var(--ui-plugin-panel-color);
    backdrop-filter: var(--base-panel-backdrop, var(--backdrop-filter-panel, saturate(1.1) blur(10px)));
    font: 500 var(--ui-default-font-size, var(--font-size-2, var(--ui-font-size-md, 14px)))/var(--ui-default-line-height, var(--line-height-2, 20px)) var(--ui-font-family, system-ui, sans-serif);
    letter-spacing: var(--ui-default-letter-spacing, var(--letter-spacing-2, 0em));
    opacity: 0;
    transform: translate3d(0, 6px, 0) scale(0.985);
    transition: opacity 180ms ease, transform 180ms ease;
    display: grid;
  }

  .panel[data-size="sm"] {
    --ui-plugin-panel-width: min(280px, 90vw);
    --ui-plugin-panel-height: min(220px, 38vh);
  }

  .panel[data-size="lg"] {
    --ui-plugin-panel-width: min(420px, 94vw);
    --ui-plugin-panel-height: min(420px, 54vh);
  }

  :host([open]) .panel {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }

  :host([position="right"]) .panel,
  :host(:not([position])) .panel {
    top: 16px;
    right: 16px;
    width: var(--ui-plugin-panel-width);
    max-height: calc(100vh - 32px);
  }

  :host([position="left"]) .panel {
    top: 16px;
    left: 16px;
    width: var(--ui-plugin-panel-width);
    max-height: calc(100vh - 32px);
  }

  :host([position="bottom"]) .panel {
    left: 50%;
    bottom: 16px;
    transform: translate3d(-50%, 8px, 0) scale(0.985);
    width: min(760px, calc(100vw - 32px));
    max-height: var(--ui-plugin-panel-height);
  }

  :host([open][position="bottom"]) .panel {
    transform: translate3d(-50%, 0, 0) scale(1);
  }

  :host(:not([open])) .panel {
    pointer-events: none;
    opacity: 0;
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
      --ui-plugin-panel-bg: Canvas;
      --ui-plugin-panel-border: 1px solid CanvasText;
      --ui-plugin-panel-shadow: none;
      --ui-plugin-panel-color: CanvasText;
    }

    .panel {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
      border-color: CanvasText;
      box-shadow: none;
      backdrop-filter: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .panel {
      transition: none !important;
    }
  }
`;

export class UIPluginPanel extends ElementBase {
  static get observedAttributes() {
    return ['open', 'position', 'headless', 'title', 'description', 'dismissible', 'size'];
  }

  private _onDocumentKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || !this.hasAttribute('open') || !this.hasAttribute('dismissible')) return;
    event.preventDefault();
    this.closePanel();
  };

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('keydown', this._onDocumentKeyDown);
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this._onDocumentKeyDown);
    super.disconnectedCallback();
  }

  openPanel() {
    this.setAttribute('open', '');
  }

  closePanel() {
    this.removeAttribute('open');
  }

  togglePanel() {
    if (this.hasAttribute('open')) this.closePanel();
    else this.openPanel();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    if (this.isConnected) this.requestRender();
    if (name === 'open' && oldValue !== newValue) {
      const isOpen = newValue != null;
      this.dispatchEvent(new CustomEvent(isOpen ? 'open' : 'close', { bubbles: true, composed: true }));
      this.dispatchEvent(new CustomEvent('open-change', { detail: { open: isOpen }, bubbles: true, composed: true }));
    }
  }

  protected render() {
    const title = this.getAttribute('title');
    const description = this.getAttribute('description');
    const dismissible = this.hasAttribute('dismissible');
    const size = this.getAttribute('size') || 'md';

    this.setContent(`
      <style>${style}</style>
      <aside class="panel" part="panel" role="complementary" aria-label="${title || 'Plugin panel'}" data-size="${size}">
        ${title || description || dismissible ? `
          <header class="header" part="header" style="display:flex;align-items:flex-start;gap:10px;padding:12px 14px 0;">
            <div style="min-width:0;display:grid;gap:4px;flex:1 1 auto;">
              ${title ? `<strong part="title" style="font-size:14px;line-height:1.3;">${title}</strong>` : ''}
              ${description ? `<p part="description" style="margin:0;font-size:12px;line-height:1.4;color:var(--ui-color-muted, #64748b);">${description}</p>` : ''}
            </div>
            ${dismissible ? '<button type="button" class="dismiss" part="dismiss-button" aria-label="Close panel" style="border:none;background:transparent;color:inherit;cursor:pointer;font:inherit;padding:4px 6px;">Close</button>' : ''}
          </header>
        ` : ''}
        <slot></slot>
      </aside>
    `);

    const dismiss = this.root.querySelector('.dismiss') as HTMLButtonElement | null;
    dismiss?.addEventListener('click', () => this.closePanel(), { once: true });
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-plugin-panel')) {
  customElements.define('ui-plugin-panel', UIPluginPanel);
}
