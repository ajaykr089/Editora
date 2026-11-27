import { ElementBase } from '../ElementBase';
import './ui-trace-item';

/**
 * A list of an agent's steps (trace items). The host is a list and each direct item a listitem,
 * including items appended while the agent works. Inside a message scroller each new step is
 * announced once, as it is added. `label` names the list ("Agent activity").
 */
const style = `
  :host {
    color-scheme: light dark;
    display: flex;
    flex-direction: column;
    gap: 0;
    min-inline-size: 0;
  }
  :host([hidden]) { display: none; }
  slot[hidden] { display: none; }
`;

export class UITrace extends ElementBase {
  static get observedAttributes() {
    return ['label'];
  }

  private observer: MutationObserver | null = null;

  override connectedCallback(): void {
    if (!this.hasAttribute('role')) this.setAttribute('role', 'list');
    this.syncItems();
    super.connectedCallback();
    if (!this.observer && typeof MutationObserver !== 'undefined') {
      this.observer = new MutationObserver(() => this.syncItems());
      this.observer.observe(this, { childList: true });
    }
  }

  override disconnectedCallback(): void {
    this.observer?.disconnect();
    this.observer = null;
    super.disconnectedCallback();
  }

  protected override shouldRenderOnAttributeChange(): boolean {
    this.syncItems();
    return false;
  }

  private syncItems(): void {
    const label = this.getAttribute('label');
    if (label) this.setAttribute('aria-label', label);
    for (const child of Array.from(this.children)) {
      if (!child.hasAttribute('role')) child.setAttribute('role', 'listitem');
    }
  }

  protected override render(): void {
    this.setContent(`<style>${style}</style><slot></slot>`);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-trace')) {
  customElements.define('ui-trace', UITrace);
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-trace': UITrace;
  }
}
