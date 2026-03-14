export class UIAnchor extends HTMLElement {}

if (typeof customElements !== 'undefined' && !customElements.get('ui-anchor')) {
  customElements.define('ui-anchor', UIAnchor);
}
