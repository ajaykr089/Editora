import { ElementBase } from '@editora/ui-core';
import { showPortalFor } from '@editora/ui-core';

export class UIFloatingToolbar extends ElementBase {
  static get observedAttributes() { return ['anchor-id','open']; }
  private _portalEl: HTMLElement | null = null;
  private _cleanup: (() => void) | undefined = undefined;

  constructor() { super(); }

  connectedCallback() { super.connectedCallback(); }

  attributeChangedCallback() { this.render(); }

  showForAnchorId(id: string) { this.setAttribute('anchor-id', id); this.setAttribute('open',''); }
  hide() { this.removeAttribute('open'); }

  protected render() {
    const anchorId = this.getAttribute('anchor-id');
    const open = this.hasAttribute('open');
    this.setContent(`<slot></slot>`);
    if (open && anchorId) {
      const anchor = document.getElementById(anchorId);
      if (!anchor) return;
      if (!this._portalEl) this._portalEl = document.createElement('div');
      this._portalEl.innerHTML = '';
      const panel = document.createElement('div');
      panel.className = 'floating-toolbar';
      // clone slot content into panel
      const sl = this.querySelector('[slot="toolbar"]');
      if (sl) panel.appendChild(sl.cloneNode(true));
      this._portalEl.appendChild(panel);
      this._cleanup = showPortalFor(anchor as HTMLElement, this._portalEl, 'top');
    } else {
      if (this._cleanup) { this._cleanup(); this._cleanup = undefined; }
      this._portalEl = null;
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-floating-toolbar')) {
  customElements.define('ui-floating-toolbar', UIFloatingToolbar);
}
