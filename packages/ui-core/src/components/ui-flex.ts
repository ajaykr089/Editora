import { ElementBase } from '../ElementBase';

const style = `
  :host { display: block; }
  .flex { display: flex; gap: var(--ui-gap, 12px); align-items: center; }
`;

export class UIFlex extends ElementBase {
  constructor() { super(); }
  protected render() {
    const dir = this.getAttribute('direction') || 'row';
    this.setContent(`<style>${style}</style><div class="flex" style="flex-direction:${dir};"><slot></slot></div>`);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-flex')) {
  customElements.define('ui-flex', UIFlex);
}
