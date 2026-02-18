import { ElementBase } from '../ElementBase';
import { showPortalFor } from '../portal';

const style = `
  .menu { background: white; border: 1px solid rgba(0,0,0,0.12); border-radius: 6px; padding: 6px; box-shadow: 0 6px 24px rgba(0,0,0,0.12); }
  .trigger { display: inline-block; }
`;

export class UIDropdown extends ElementBase {
  static get observedAttributes() { return ['open']; }
  private _portalEl: HTMLElement | null = null;
  private _cleanup: (() => void) | undefined = undefined;

  constructor() { super(); }

  connectedCallback() { super.connectedCallback(); this.setup(); }

  setup() {
    // delegate: find first element with slot="trigger"
    this.addEventListener('click', (e) => {
      const t = e.composedPath()[0] as HTMLElement;
      if (t && t.getAttribute && t.getAttribute('slot') === 'trigger') {
        this.toggle();
      }
    });
  }

  open() { this.setAttribute('open', ''); this.dispatchEvent(new CustomEvent('open')); }
  close() { this.removeAttribute('open'); this.dispatchEvent(new CustomEvent('close')); }
  toggle() { this.hasAttribute('open') ? this.close() : this.open(); }

  protected render() {
    // render trigger only; content shows in portal
    this.setContent(`<style>${style}</style><slot name="trigger"></slot>`);
    if (this.hasAttribute('open')) {
      // show portal content
      const contentSlot = document.createElement('div');
      contentSlot.className = 'menu';
      const sl = this.querySelector('[slot="content"]');
      if (sl) {
        // clone content into portal
        contentSlot.appendChild(sl.cloneNode(true));
      } else {
        const fallback = document.createElement('div');
        fallback.textContent = '';
        contentSlot.appendChild(fallback);
      }
      const triggerEl = this.querySelector('[slot="trigger"]') as HTMLElement | null;
      if (triggerEl) {
        this._cleanup = showPortalFor(triggerEl, contentSlot, 'bottom');
      }
    } else {
      if (this._cleanup) { this._cleanup(); this._cleanup = undefined; }
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-dropdown')) {
  customElements.define('ui-dropdown', UIDropdown);
}
