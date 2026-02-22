import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: block;
    box-sizing: border-box;
    color-scheme: light dark;
    --ui-container-padding: var(--ui-space-sm, 8px);
    --ui-container-max-sm: 640px;
    --ui-container-max-md: 960px;
    --ui-container-max-lg: 1280px;
    --ui-container-max-xl: 1440px;
    --ui-container-bg: transparent;
    --ui-container-border: transparent;
    --ui-container-radius: 14px;
    --ui-container-shadow: none;
    --ui-container-color: inherit;
  }
  .container {
    box-sizing: border-box;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    padding-left: var(--ui-container-padding);
    padding-right: var(--ui-container-padding);
    border: 1px solid var(--ui-container-border);
    border-radius: var(--ui-container-radius);
    background: var(--ui-container-bg);
    color: var(--ui-container-color);
    box-shadow: var(--ui-container-shadow);
    transition: background-color 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
  }
  .container.sm { max-width: var(--ui-container-max-sm); }
  .container.md { max-width: var(--ui-container-max-md); }
  .container.lg { max-width: var(--ui-container-max-lg); }
  .container.xl { max-width: var(--ui-container-max-xl); }

  :host([variant="surface"]) {
    --ui-container-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 96%, transparent);
    --ui-container-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent);
    --ui-container-shadow:
      0 1px 2px rgba(2, 6, 23, 0.05),
      0 12px 28px rgba(2, 6, 23, 0.08);
    --ui-container-color: var(--ui-color-text, #0f172a);
  }

  :host([variant="elevated"]) {
    --ui-container-bg: var(--ui-color-surface, #ffffff);
    --ui-container-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 64%, transparent);
    --ui-container-shadow:
      0 2px 10px rgba(2, 6, 23, 0.1),
      0 30px 64px rgba(2, 6, 23, 0.15);
    --ui-container-color: var(--ui-color-text, #0f172a);
  }

  :host([variant="glass"]) {
    --ui-container-bg:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--ui-color-surface, #ffffff) 84%, #ffffff 16%),
        color-mix(in srgb, var(--ui-color-surface, #ffffff) 90%, transparent)
      );
    --ui-container-border: color-mix(in srgb, #ffffff 64%, var(--ui-color-border, #cbd5e1));
    --ui-container-shadow:
      0 1px 2px rgba(2, 6, 23, 0.07),
      0 20px 48px rgba(2, 6, 23, 0.14);
    --ui-container-color: var(--ui-color-text, #0f172a);
  }

  :host([variant="contrast"]) {
    --ui-container-bg: #0f172a;
    --ui-container-border: #334155;
    --ui-container-color: #e2e8f0;
    --ui-container-shadow: none;
  }

  :host([density="compact"]) {
    --ui-container-padding: var(--ui-space-xs, 4px);
    --ui-container-radius: 10px;
  }

  :host([density="comfortable"]) {
    --ui-container-padding: var(--ui-space-md, 12px);
    --ui-container-radius: 18px;
  }

  :host([headless]) .container { display: none; }

  @media (prefers-reduced-motion: reduce) {
    .container {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .container {
      border-width: 2px;
      box-shadow: none;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-container-bg: Canvas;
      --ui-container-border: CanvasText;
      --ui-container-color: CanvasText;
      --ui-container-shadow: none;
    }

    .container {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
      border-color: CanvasText;
    }
  }
`;


export class UIContainer extends ElementBase {
  static get observedAttributes() { return ['size', 'headless', 'variant', 'density']; }

  private _headless = false;
  private _resizeObserver: ResizeObserver | null = null;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this._headless = this.hasAttribute('headless');
    this._observeResize();
  }

  disconnectedCallback() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
    super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    if (name === 'headless') {
      this._headless = this.hasAttribute('headless');
    }
    if (name === 'headless' || name === 'size' || name === 'variant' || name === 'density') this.requestRender();
  }

  protected render() {
    if (this._headless) {
      this.setContent('');
      return;
    }
    const validSizes = ['sm', 'md', 'lg', 'xl'];
    let size = (this.getAttribute('size') || 'md');
    if (!validSizes.includes(size)) size = 'md';
    const cls = `container ${size}`;
    this.setContent(`<style>${style}</style><div class="${cls}" role="group" aria-label="Container"><slot></slot></div>`);
    this._observeResize();
  }

  private _observeResize() {
    if (this._resizeObserver) this._resizeObserver.disconnect();
    const el = this.root?.querySelector('.container');
    if (!el) return;
    this._resizeObserver = new ResizeObserver(() => {
      this.dispatchEvent(new CustomEvent('resize', { bubbles: true }));
    });
    this._resizeObserver.observe(el);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-container')) {
  customElements.define('ui-container', UIContainer);
}
