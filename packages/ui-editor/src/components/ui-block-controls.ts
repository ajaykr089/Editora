import { ElementBase } from '@editora/ui-core';

export class UIBlockControls extends ElementBase {
  constructor() { super(); }
  protected render() { this.setContent(`<div class="block-controls"><slot></slot></div>`); }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-block-controls')) {
  customElements.define('ui-block-controls', UIBlockControls);
}
