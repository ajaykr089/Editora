import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: contents;
    color-scheme: light dark;
    --ui-direction-color: var(--ui-color-text, inherit);
    color: var(--ui-direction-color);
  }
  .dir-wrap { width: 100%; height: 100%; display: contents; }

  @media (prefers-reduced-motion: reduce) {
    .dir-wrap {
      scroll-behavior: auto;
    }
  }

  @media (prefers-contrast: more) {
    :host {
      --ui-direction-color: var(--ui-color-text, inherit);
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-direction-color: CanvasText;
    }
  }
`;

export class UIDirectionProvider extends ElementBase {
  static get observedAttributes() {
    return ['dir', 'headless'];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'presentation');
    this._reflectDir();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    if (name === 'dir' || name === 'headless') {
      this._reflectDir();
      if (this.isConnected) this.requestRender();
      return;
    }
  }

  get headless() {
    return this.hasAttribute('headless');
  }
  set headless(val: boolean) {
    if (val === this.headless) return;
    if (val) this.setAttribute('headless', '');
    else this.removeAttribute('headless');
  }

  _reflectDir() {
    let dir = this.getAttribute('dir') || 'ltr';
    if (dir !== 'ltr' && dir !== 'rtl' && dir !== 'auto') {
      this.setAttribute('dir', 'ltr');
      dir = 'ltr';
    }
    this.dispatchEvent(new CustomEvent('change', { detail: { dir }, bubbles: true }));
    // Propagate to children
    this._setDirOnChildren(dir);
  }

  _setDirOnChildren(dir: string) {
    const slot = this.root.querySelector('slot');
    if (!slot) return;
    const nodes = slot.assignedElements({ flatten: true });
    nodes.forEach(el => {
      if (el instanceof HTMLElement) el.setAttribute('dir', dir);
    });
  }

  protected render() {
    const dir = this.getAttribute('dir') || 'ltr';
    const headless = this.headless;
    this.setContent(`
      <style>${style}</style>
      <div class="dir-wrap" dir="${dir}" aria-hidden="${headless ? 'true' : 'false'}"><slot></slot></div>
    `);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-direction-provider')) {
  customElements.define('ui-direction-provider', UIDirectionProvider);
}
