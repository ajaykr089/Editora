import { ElementBase } from '../ElementBase';
import { showPortalFor } from '../portal';

const style = `
  .panel { background: white; border: 1px solid rgba(0,0,0,0.12); border-radius: 6px; padding: 8px; box-shadow: 0 6px 24px rgba(0,0,0,0.12); }
`;

export class UIPopover extends ElementBase {
  static get observedAttributes() { return ['open']; }
  private _portalEl: HTMLElement | null = null;
  private _cleanup: (() => void) | undefined = undefined;

  constructor() { super(); }

  connectedCallback() { super.connectedCallback(); this.setup(); }

  setup() {
    this.addEventListener('click', (e) => {
      const t = e.composedPath()[0] as HTMLElement;
      if (t && t.getAttribute && t.getAttribute('slot') === 'trigger') this.toggle();
    });
  }

  open() { this.setAttribute('open',''); this.dispatchEvent(new CustomEvent('open')); }
  close() { this.removeAttribute('open'); this.dispatchEvent(new CustomEvent('close')); }
  toggle() { this.hasAttribute('open') ? this.close() : this.open(); }

  protected render() {
    this.setContent(`<slot name="trigger"></slot>`);
    if (this.hasAttribute('open')) {
      const panel = document.createElement('div');
      panel.className = 'panel';
      const sl = this.querySelector('[slot="content"]');
      if (sl) panel.appendChild(sl.cloneNode(true));
      if (!this._portalEl) this._portalEl = document.createElement('div');
      this._portalEl.innerHTML = '';
      const s = document.createElement('style'); s.textContent = style; this._portalEl.appendChild(s);
      this._portalEl.appendChild(panel);
      const trigger = this.querySelector('[slot="trigger"]') as HTMLElement | null;
      if (trigger) this._cleanup = showPortalFor(trigger, this._portalEl, 'bottom');
    } else {
      if (this._cleanup) { this._cleanup(); this._cleanup = undefined; }
      this._portalEl = null;
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-popover')) {
  customElements.define('ui-popover', UIPopover);
}
