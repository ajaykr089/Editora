import { ElementBase } from '../ElementBase';
import { createPortalContainer, showPortalFor } from '../portal';

const style = `
  .tooltip {
    padding: 6px 8px;
    font-size: 12px;
    background: rgba(0,0,0,0.85);
    color: white;
    border-radius: 4px;
    white-space: nowrap;
    transition: opacity 120ms ease, transform 120ms ease;
    opacity: 0;
  }
  .tooltip.show { opacity: 1; }
`;

export class UITooltip extends ElementBase {
  static get observedAttributes() { return ['text']; }

  private _portalEl: HTMLElement | null = null;
  private _cleanup: (() => void) | undefined = undefined;

  constructor() { super(); this.addEventListeners(); }

  addEventListeners() {
    this.addEventListener('mouseenter', () => this.show());
    this.addEventListener('focus', () => this.show(), true);
    this.addEventListener('mouseleave', () => this.hide());
    this.addEventListener('blur', () => this.hide(), true);
  }

  show() {
    const text = this.getAttribute('text') || '';
    const headless = this.hasAttribute('headless');
    if (!this._portalEl) {
      this._portalEl = document.createElement('div');
      if (!headless) {
        const s = document.createElement('style');
        s.textContent = style;
        this._portalEl.appendChild(s);
      }
      const content = document.createElement('div');
      content.className = 'tooltip show';
      content.setAttribute('role', 'tooltip');
      content.textContent = text;
      this._portalEl.appendChild(content);
    }
    const anchor = this as unknown as HTMLElement;
    this._cleanup = showPortalFor(anchor, this._portalEl, 'top');
  }

  hide() {
    if (this._cleanup) this._cleanup();
    this._cleanup = undefined;
    this._portalEl = null;
  }

  protected render() {
    // render only slot since tooltip renders to portal
    const headless = this.hasAttribute('headless');
    this.setContent(`${headless ? '' : ''}<slot></slot>`);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-tooltip')) {
  customElements.define('ui-tooltip', UITooltip);
}
