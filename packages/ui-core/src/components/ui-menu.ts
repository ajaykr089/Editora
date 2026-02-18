import { ElementBase } from '../ElementBase';
import { FocusManager } from '../focusManager';
import { showPortalFor } from '../portal';

const style = `
  :host { display: inline-block; }
  .menu { background: white; border: 1px solid rgba(0,0,0,0.12); border-radius: 6px; padding: 6px; box-shadow: 0 6px 24px rgba(0,0,0,0.12); }
  .item { padding: 6px 8px; cursor: pointer; }
  .item[aria-disabled="true"] { opacity: 0.5; cursor: not-allowed; }
`;

export class UIMenu extends ElementBase {
  static get observedAttributes() { return ['open']; }
  private _trap: any = null;
  private _portalEl: HTMLElement | null = null;
  private _cleanup: (() => void) | undefined = undefined;
  private _items: HTMLElement[] = [];
  private _focusedIndex = -1;

  constructor() { super(); }

  connectedCallback() { super.connectedCallback(); this.setup(); }

  setup() {
    this.addEventListener('click', (e) => {
      const t = e.composedPath()[0] as HTMLElement;
      if (t && t.getAttribute && t.getAttribute('slot') === 'trigger') this.toggle();
    });
  }

  open() { this.setAttribute('open',''); this.dispatchEvent(new CustomEvent('open')); this._trap = FocusManager.trap(this as unknown as HTMLElement); }
  close() { this.removeAttribute('open'); this.dispatchEvent(new CustomEvent('close')); if (this._trap) this._trap.release(); this._focusedIndex = -1; }
  toggle() { this.hasAttribute('open') ? this.close() : this.open(); }

  private focusItem(i: number) {
    this._focusedIndex = i;
    this._items.forEach((it, idx) => {
      if (idx === i) {
        it.setAttribute('tabindex', '0');
        try { it.focus(); } catch (e) {}
      } else {
        it.setAttribute('tabindex', '-1');
      }
    });
  }

  protected render() {
    this.setContent(`<slot name="trigger"></slot>`);
    if (this.hasAttribute('open')) {
      const panel = document.createElement('div');
      panel.className = 'menu';
      const items = Array.from(this.querySelectorAll('[slot="item"]'));
      this._items = items.map((it, i) => {
        const node = (it as HTMLElement).cloneNode(true) as HTMLElement;
        node.className = 'item';
        node.setAttribute('role','menuitem');
        node.setAttribute('tabindex','-1');
        node.addEventListener('click', () => this.dispatchEvent(new CustomEvent('select', { detail: { index: i } })));
        panel.appendChild(node);
        return node;
      });
      if (!this._portalEl) this._portalEl = document.createElement('div');
      this._portalEl.innerHTML = '';
      const s = document.createElement('style'); s.textContent = style; this._portalEl.appendChild(s);
      this._portalEl.appendChild(panel);
      const trigger = this.querySelector('[slot="trigger"]') as HTMLElement | null;
      if (trigger) {
        this._cleanup = showPortalFor(trigger, this._portalEl, 'bottom');
      }

      // keyboard nav
      const keyHandler = (e: KeyboardEvent) => {
        if (!this.hasAttribute('open')) return;
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const next = (this._focusedIndex + 1) % this._items.length;
          this.focusItem(next);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = (this._focusedIndex - 1 + this._items.length) % this._items.length;
          this.focusItem(prev);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (this._focusedIndex >= 0) {
            this._items[this._focusedIndex].click();
          }
        } else if (e.key === 'Escape') {
          e.preventDefault();
          this.close();
        }
      };
      window.addEventListener('keydown', keyHandler);
      // focus first item
      if (this._items.length > 0) this.focusItem(0);
      // cleanup when closed
      const cleanupAll = this._cleanup;
      const origClose = () => {
        window.removeEventListener('keydown', keyHandler);
        if (cleanupAll) cleanupAll();
      };
      // attach an attribute watcher to remove listeners on next render when closed
      // we'll store cleanup to call later when attribute removed
      (this as any).__menuCleanup = origClose;
    } else {
      if ((this as any).__menuCleanup) {
        try { (this as any).__menuCleanup(); } catch (e) {}
        (this as any).__menuCleanup = null;
      }
      if (this._cleanup) { this._cleanup(); this._cleanup = undefined; }
      this._portalEl = null;
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-menu')) {
  customElements.define('ui-menu', UIMenu);
}
