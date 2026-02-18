import { getIcon } from '../icons';

export class UIIcon extends HTMLElement {
  static get observedAttributes() { return ['name']; }
  constructor() { super(); this.attachShadow({ mode: 'open' }); }
  attributeChangedCallback() { this.render(); }
  connectedCallback() { this.render(); }
    render() {
      const name = this.getAttribute('name') || '';
      const svg = getIcon(name);
      this.shadowRoot!.innerHTML = `<style>:host{display:inline-block;line-height:0;color:currentColor}</style>${svg}`;
    }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-icon')) {
  customElements.define('ui-icon', UIIcon);
}
