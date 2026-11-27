import { ElementBase } from '../ElementBase';
import './ui-bubble';

/**
 * Consecutive bubbles from one sender, stacked close together with the inner corners tightened
 * so they read as one turn. Set `align` on each bubble (or on the enclosing message), not here.
 */
const style = `
  :host {
    color-scheme: light dark;
    display: flex;
    flex-direction: column;
    gap: 2px;
    align-self: stretch;
    min-inline-size: 0;
  }
  :host([hidden]) { display: none; }
  ::slotted(ui-bubble:not(:last-child)) { --ui-bubble-tail-radius: var(--ui-bubble-radius, 16px); }
`;

export class UIBubbleGroup extends ElementBase {
  override connectedCallback(): void {
    if (!this.hasAttribute('role')) this.setAttribute('role', 'group');
    super.connectedCallback();
  }

  protected override render(): void {
    this.setContent(`<style>${style}</style><slot></slot>`);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-bubble-group')) {
  customElements.define('ui-bubble-group', UIBubbleGroup);
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-bubble-group': UIBubbleGroup;
  }
}
