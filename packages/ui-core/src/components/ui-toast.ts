import { ElementBase } from '../ElementBase';
import { showToast } from '../toast';

export class UIToast extends ElementBase {
  constructor() { super(); }
  connectedCallback() { super.connectedCallback(); }
  protected render() { this.setContent(`<div part="root"></div>`); }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-toast')) {
  customElements.define('ui-toast', UIToast);
}

export { showToast };
