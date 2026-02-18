import { ElementBase } from '@editora/ui-core';

export class UIPluginPanel extends ElementBase {
  static get observedAttributes() { return ['open','position']; }
  constructor() { super(); }

  open() { this.setAttribute('open',''); }
  close() { this.removeAttribute('open'); }

  protected render() {
    const open = this.hasAttribute('open');
    const position = this.getAttribute('position') || 'right';
    if (!open) { this.setContent(''); return; }
    const html = `<div class="panel panel-${position}"><slot></slot></div>`;
    this.setContent(html);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-plugin-panel')) {
  customElements.define('ui-plugin-panel', UIPluginPanel);
}
