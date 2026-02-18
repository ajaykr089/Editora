import { ElementBase } from '../ElementBase';

const style = `
  :host { display: block; }
  .grid { display: grid; gap: var(--ui-gap, 12px); }
`;

export class UIGrid extends ElementBase {
  constructor() { super(); }
  protected render() {
    const columns = this.getAttribute('columns') || '1fr';
    this.setContent(`<style>${style}</style><div class="grid" style="grid-template-columns: ${columns};"><slot></slot></div>`);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-grid')) {
  customElements.define('ui-grid', UIGrid);
}
