import { ElementBase } from '../ElementBase';
import { FocusManager } from '../focusManager';

const style = `
  :host { position: fixed; inset: 0; display: none; align-items: center; justify-content: center; }
  :host([open]) { display: flex; }
  .overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); }
  .dialog {
    position: relative;
    background: var(--ui-background, white);
    color: var(--ui-foreground, black);
    border-radius: var(--ui-radius, 8px);
    padding: 16px;
    z-index: 1001;
    min-width: 280px;
    max-width: 90%;
    box-shadow: 0 6px 24px rgba(0,0,0,0.2);
  }
`;

export class UIModal extends ElementBase {
  private _trap: any = null;

  static get observedAttributes() { return ['open']; }

  constructor() { super(); }

  connectedCallback() { super.connectedCallback(); this.setup(); }

  setup() {
    this.addEventListener('click', (e) => {
      const t = e.target as HTMLElement;
      if (t && t.classList.contains('overlay')) this.close();
    });
  }

  open() {
    this.setAttribute('open', '');
    this.dispatchEvent(new CustomEvent('open'));
    this._trap = FocusManager.trap(this as unknown as HTMLElement);
  }

  close() {
    this.removeAttribute('open');
    this.dispatchEvent(new CustomEvent('close'));
    if (this._trap && this._trap.release) this._trap.release();
  }

  protected render() {
    const isOpen = this.hasAttribute('open');
    const headless = this.hasAttribute('headless');
    this.setContent(`
      ${headless ? '' : `<style>${style}</style>`}
      <div class="overlay"></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <slot></slot>
      </div>
    `);
    if (isOpen) {
      // ensure focus trap when open
      this._trap = FocusManager.trap(this as unknown as HTMLElement);
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-modal')) {
  customElements.define('ui-modal', UIModal);
}
