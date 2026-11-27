import { ElementBase } from '../ElementBase';
import { escapeHtml } from '../primitives/escape-html';

/**
 * Gives an icon a name that assistive technology reads, and hides the icon itself.
 *
 *   <button><ui-accessible-icon label="Close"><svg>…</svg></ui-accessible-icon></button>
 *
 * The slotted icon is marked `aria-hidden` (and an <svg> `focusable="false"`, for old Edge/IE
 * tabbing into SVGs), and `label` is rendered as visually hidden text, so a button around it gets
 * "Close" as its name. Use it for icon-only controls; an icon next to visible text needs no label.
 */
const style = `
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 0;
    vertical-align: middle;
  }
  :host([hidden]) { display: none; }
  .icon { display: contents; }
  .label {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
  }
`;

export class UIAccessibleIcon extends ElementBase {
  static get observedAttributes() {
    return ['label'];
  }

  constructor() {
    super();
    this.root.addEventListener('slotchange', () => this.hideIcons());
  }

  protected override render(): void {
    const label = (this.getAttribute('label') || '').trim();
    this.setContent(`
      <style>${style}</style>
      <span class="icon" part="icon" aria-hidden="true"><slot></slot></span>
      <span class="label" part="label">${escapeHtml(label)}</span>
    `);
    this.hideIcons();
    if (!label && typeof console !== 'undefined') {
      console.warn('[ui-accessible-icon] set a label: without one the icon has no accessible name.');
    }
  }

  private hideIcons(): void {
    // The aria-hidden wrapper already hides them in the flat tree; marking the elements themselves
    // also covers tools that read the light DOM (axe, older screen readers).
    for (const node of Array.from(this.children)) {
      if (node.getAttribute('aria-hidden') !== 'true') node.setAttribute('aria-hidden', 'true');
      if (node.localName === 'svg' && !node.hasAttribute('focusable')) node.setAttribute('focusable', 'false');
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-accessible-icon')) {
  customElements.define('ui-accessible-icon', UIAccessibleIcon);
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-accessible-icon': UIAccessibleIcon;
  }
}
