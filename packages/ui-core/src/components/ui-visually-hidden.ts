import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: contents;
    color-scheme: light dark;
    --ui-visually-hidden-color: var(--ui-color-text, inherit);
    color: var(--ui-visually-hidden-color);
  }
  .vh {
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0,0,0,0) !important;
    white-space: nowrap !important;
    border: 0 !important;
    background: transparent !important;
    color: inherit !important;
  }

  @media (prefers-reduced-motion: reduce) {
    .vh {
      scroll-behavior: auto;
    }
  }

  @media (prefers-contrast: more) {
    :host {
      --ui-visually-hidden-color: var(--ui-color-text, inherit);
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-visually-hidden-color: CanvasText;
    }
  }
`;


export class UIVisuallyHidden extends ElementBase {
  static get observedAttributes() {
    return ['headless'];
  }

  private _headless = false;

  constructor() {
    super();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    if (name === 'headless') {
      this._headless = this.hasAttribute('headless');
      this.requestRender();
    }
  }

  connectedCallback() {
    this._headless = this.hasAttribute('headless');
    super.connectedCallback();
  }

  protected render() {
    if (this._headless) {
      this.setContent('');
      return;
    }
    this.setContent(`
      <style>${style}</style>
      <span class="vh" aria-hidden="false" tabindex="-1"><slot></slot></span>
    `);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-visually-hidden')) {
  customElements.define('ui-visually-hidden', UIVisuallyHidden);
}
