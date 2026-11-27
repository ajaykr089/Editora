import { ElementBase } from '../ElementBase';
import './ui-item';

/**
 * A list of <ui-item> rows (role="list"; each item becomes a listitem, including ones added
 * later). `divided` draws a rule between items instead of a gap. The gap is
 * `--ui-item-group-gap` (default 4px).
 */
const style = `
  :host {
    color-scheme: light dark;
    display: flex;
    flex-direction: column;
    gap: var(--ui-item-group-gap, 4px);
    min-inline-size: 0;
  }
  :host([hidden]) { display: none; }
  :host([divided]) { gap: 0; }
  :host([divided]) ::slotted(ui-item:not(:last-child)) {
    border-block-end: 1px solid var(--ui-color-border, color-mix(in srgb, var(--ui-color-text, #0f172a) 12%, transparent));
  }
  :host([divided]) ::slotted(ui-item) { --ui-item-radius: 0px; }
`;

export class UIItemGroup extends ElementBase {
  private observer: MutationObserver | null = null;

  override connectedCallback(): void {
    if (!this.hasAttribute('role')) this.setAttribute('role', 'list');
    super.connectedCallback();
    if (!this.observer && typeof MutationObserver !== 'undefined') {
      // Items added later become listitems too.
      this.observer = new MutationObserver(() => {
        for (const child of Array.from(this.children)) {
          if (child.localName === 'ui-item' && !child.hasAttribute('role')) {
            child.setAttribute('role', 'listitem');
            child.setAttribute('data-auto-role', '');
          }
        }
      });
      this.observer.observe(this, { childList: true });
    }
  }

  override disconnectedCallback(): void {
    this.observer?.disconnect();
    this.observer = null;
    super.disconnectedCallback();
  }

  protected override render(): void {
    this.setContent(`<style>${style}</style><slot></slot>`);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-item-group')) {
  customElements.define('ui-item-group', UIItemGroup);
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-item-group': UIItemGroup;
  }
}
